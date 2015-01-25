'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var _ = require('lodash');
var crypto = require('crypto');
var AuthError = require('./errors').AuthError;
var InvalidArg = require('./errors').InvalidArg;
var db = require('../models');
var nconf = require('nconf');
var sendEmail = require('../emails');

module.exports = {
  /**
   * Securely hashes the given value
   *
   * Returns a promise that is fulfilled by the resulting hash
   */
  secureHash: _.partialRight(Promise.promisify(bcrypt.hash), nconf.get('bcrypt:rounds')),

  /**
   * Compares the given value to the given hash
   *
   * Returns a promise that is fulfilled by true or false
   */
  compareToHash: Promise.promisify(bcrypt.compare),

  /**
   * Creates a new user
   *
   * The given password is hashed before persisting.
   *
   * Returns a promise that is fulfilled with the user when the record is
   * successfully persisted
   */
  create: function(data) {
    if (!data.password) {
      return Promise.reject('Cannot create a user without a password');
    }

    return this.secureHash(data.password).then(function(hashedPwd) {
      data.password = hashedPwd;
      return db.User.create(data);
    });
  },

  /**
   * Authenticate the user with the given credentials
   *
   * Returns a promise that is either fulfilled with the user that has the
   * same email and password or with null in the event that there is no match
   */
  authenticate: function(email, password) {
    var matchesHash = _.partial(this.compareToHash, password);
    return db.User.find({ where: { email: email } }).then(function(user) {
      if (user) {
        return matchesHash(user.password).then(function(valid) {
          if (!valid) throw new AuthError('Password mismatch for user ' + user._id);
          return user;
        });
      } else {
        // no user found by email, but we go ahead and do a random hash
        // comparison anyway before rejecting the promise so that it is
        // difficult to determine if the email exists in the system simply by
        // looking at how long the request took to complete
        return matchesHash(fakeSecureHash()).then(function() {
          throw new AuthError('Failed to authenticate because user does not exist: ' + email);
        });
      }
    });
  },

  /**
   * Creates and sends a password reset request
   *
   * Returns a promise that is either fulfilled if the email is sent
   * successfully or rejected if an error is encountered
   */
  sendPasswordReset: function(email) {
    var uid = this.generateSecureHex(40);
    var token = this.generateSecureHex(40);
    return Promise.join(uid, token.then(this.secureHash))
      .spread(function(uid, hash) {
        return db.PasswordReset.create({uid:uid, email:email, hash:hash});
      })
      .then(function(pwdReset) {
        return sendEmail('reset-password', email, 'Password Reset', {
          uid: pwdReset.uid,
          token: token.value()
        });
      });
  },

  /**
   * Generates a secure pseudo-random hex value of the given length
   *
   * Returns a promise that is fulfilled by the string hex value
   */
  generateSecureHex: function(length) {
    return Promise.promisify(crypto.randomBytes)(length).then(function(buf) {
      return buf.toString('hex');
    });
  },

  /**
   * Changes a user's password via password reset
   *
   * Also notifies the user via email that the change has occurred.
   *
   * Returns a promise that is fulfilled if the given credentials match a valid 
   * password reset request, the user's password is updated, the reset request
   * is deleted, and the notification email is dispatched.
   */
  confirmPasswordReset: function(uid, token, newPassword) {
    var matchesHash = _.partial(this.compareToHash, token);

    var validPwdReset = db.PasswordReset.find({where: { uid: uid, deletedAt: null }})
      .then(function(pwdReset) {
        if (pwdReset) {
          return matchesHash(pwdReset.hash).then(function(valid) {
            if (!pwdReset) throw new InvalidArg('Invalid password reset token');
            return pwdReset;
          });
        } else {
          // no valid password reset token found by uid, but we go ahead and do
          // a random hash comparison anyway before rejecting the promise so
          // that it is difficult to determine if the uid exists in the system
          // simply by looking at how long the request took to complete
          return matchesHash(fakeSecureHash()).then(function() {
            throw new InvalidArg('Password reset id not found');
          });
        }
      });

    return Promise.join(
      validPwdReset, this.secureHash(newPassword),
      function(pwdReset, newPassword) {
        return db.sequelize.transaction(function(t) {
          var config = { transaction: t };
          return Promise.join(
            db.User.update(pwdReset.user_id, {password: newPassword}, config),
            db.PasswordReset.delete(pwdReset.id, config)
          );
        });
      }
    ).then(function() {
      return sendEmail('password-changed', email, 'Password Changed');
    });
  }
};

function fakeSecureHash() {
  return _.sample([
    '$2a$05$Y79.zTNrDWWBHrpYiybElOnrezQ71ulFsRqnZVaDtyKn87A6HH9KC',
    '$2a$10$pqHIfMjNa1a1BNjUgXwKRO5gLuOs53ZJs/jf3oV2.PLKJMuPXDX4q',
    '$2a$10$P6EbHC9ylk2mQ11QLhYf6.uruQs96.dtkXJ0NNflSgglqg5Z2vHAG',
    '$2a$10$c4yFfG2umiGeOFaMenXmNuW6U4PTKPmr87d2ZcXwo26h0tV3.34i2',
    '$2a$10$WMP02xDVn91pjMIm11Nnv.cFvLa.0PO1EIODFslRavC2v5fBVMX1u'
  ]);
}
