'use strict';

module.exports = function ResetPasswordCtrl(resetPassword) {
  this.submit = function(data) {
    this.submitting = true;
    resetPwd.begin(data).then(success, error);
  };

  var success = function(data) {
    console.log('success', data);
  };

  var error = function(response) {
    console.log('error', response);
    this.submitting = false;
  }.bind(this);
};
