'use strict';

module.exports = function SignupCtrl($window, signup) {
  this.submit = function(data) {
    this.submitting = true;
    signup.attempt(data).then(success, error);
  };

  var success = function(data) {
    $window.location = '/login';
  };

  var error = function(response) {
    console.log('error', response);
    this.submitting = false;
  }.bind(this);
};
