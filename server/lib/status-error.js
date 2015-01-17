'use strict';

module.exports = function statusError(name, status, fn) {
  var StatusError = function(message) {
    this.message = message;
    this.name = name;
    this.status = status;
    !fn || fn.apply(this, arguments);
    Error.captureStackTrace(this, StatusError);
  };

  StatusError.prototype = Object.create(Error.prototype);
  StatusError.prototype.constructor = StatusError;

  return StatusError;
};
