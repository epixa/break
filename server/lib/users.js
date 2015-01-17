'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var _ = require('lodash');
var AuthError = require('./errors').AuthError;

/**
 * Factory for users services
 *
 * @param db     Mongodb db client, assumed to be connected
 * @param rounds Number of rounds to use when encrypting new passwords
 */
module.exports = function(db, rounds) {
  rounds || (rounds = 10);

  var users = db.collection('users');

  return {
    /**
     * Hashes the given password
     *
     * Returns a promise that is fulfilled by the hashed password
     */
    hashPassword: _.partialRight(Promise.promisify(bcrypt.hash), rounds),

    /**
     * Compares the given password to the given hash
     *
     * Returns a promise that is fulfilled by true or false
     */
    comparePassword: Promise.promisify(bcrypt.compare),

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

      return this.hashPassword(data.password).then(function(hashedPwd) {
        data.password = hashedPwd;
        return users.insertAsync(data);
      });
    },

    /**
     * Authenticate the user with the given credentials
     *
     * Returns a promise that is either fulfilled with the user that has the
     * same email and password or with null in the event that there is no match
     */
    authenticate: function(email, password) {
      var matchesHash = _.partial(this.comparePassword, password);
      return users.findOneAsync({email: email}).then(function(user) {
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
          return matchesHash(fakePwdHash()).then(function() {
            throw new AuthError('Failed to authenticate because user does not exist: ' + email);
          });
        }
      });
    }
  };

  function fakePwdHash() {
    return _.sample([
      '$2a$05$Y79.zTNrDWWBHrpYiybElOnrezQ71ulFsRqnZVaDtyKn87A6HH9KC',
      '$2a$10$pqHIfMjNa1a1BNjUgXwKRO5gLuOs53ZJs/jf3oV2.PLKJMuPXDX4q',
      '$2a$10$P6EbHC9ylk2mQ11QLhYf6.uruQs96.dtkXJ0NNflSgglqg5Z2vHAG',
      '$2a$10$c4yFfG2umiGeOFaMenXmNuW6U4PTKPmr87d2ZcXwo26h0tV3.34i2',
      '$2a$10$WMP02xDVn91pjMIm11Nnv.cFvLa.0PO1EIODFslRavC2v5fBVMX1u'
    ]);
  }
};
