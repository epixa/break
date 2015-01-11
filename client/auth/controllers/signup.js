'use strict';

module.exports = function SignupCtrl(signup) {
  this.submit = function(data) {
    this.submitting = true;
    signup.attempt(data).then(success, error);
  };

  var success = function(data) {
    console.log('success', data);
  };

  var error = function(response) {
    console.log('error', response);
    this.submitting = false;
  }.bind(this);
};
