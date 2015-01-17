'use strict';

var statusError = require('./status-error');

exports.InvalidArg = statusError('InvalidArg', 422);
exports.Forbidden = statusError('Forbidden', 403);
exports.NotFound = statusError('NotFound', 404, function() {
  this.message || (this.message = 'Not Found');
});
exports.AuthError = statusError('AuthError', 401);
