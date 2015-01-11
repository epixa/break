'use strict';

module.exports = function LoginCtrl(login) {
  this.submit = function(data) {
    this.submitting = true;
    login.attempt(data).then(success, error);
  };

  var success = function(data) {
    console.log('success', data);
  };

  var error = function(response) {
    console.log('error', response);
    this.submitting = false;
  }.bind(this);
};
