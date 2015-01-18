'use strict';

var _ = require('lodash');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

/**
 * Configure and return an express session middleware
 *
 * The returned middleware will attempt to re-connect to the session storage up
 * to three times in the off-chance that it is unavailable.
 */
module.exports = function(config) {
  config = _.merge({ store: { type: 'memory' }}, config);
  switch (config.store.type) {
    case 'redis':
      config.store = new RedisStore(config.store);
      break;
    case 'memory':
      delete config.store;
      break;
    default:
      throw new Error('Unsupported session store: "' + config.store.type + '"');
  }

  var sessionMiddleware = session(config);
  return function(req, res, next) {
    var tries = 3;

    function lookupSession(error) {
      if (error) return next(error);

      tries -= 1;

      if (req.session !== undefined) {
        return next();
      }

      if (tries < 0) {
        return next(new Error('Session could not be established, the session storage could be down'));
      }

      // wait 10ms before trying to execute the middleware again to give the
      // storage backend some time to recover
      // this will result in up to a 30ms delay (10ms x 3 tries) in the event
      // that a session is never established for this request
      setTimeout(function() {
        sessionMiddleware(req, res, lookupSession);
      }, 10);
    }

    lookupSession();
  };
}