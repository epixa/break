'use strict';

var nconf = require('nconf');
var db = require('../db');
var users = require('../lib/users');

/**
 * Middleware to attach a configured users service to the request
 *
 * If database connection fails, then the middleware advances an error and a
 * 500 response.
 */
module.exports = function(req, res, next) {
  db.then(function(db) {
    req.users = users(db, nconf.get('bcrypt:rounds'));
    next();
  });
  db.then(null, function(err) {
    res.status(500);
    next(err);
  });
};
