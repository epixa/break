'use strict';

module.exports = function SignupCtrl(signup) {
  this.submit = function(data) {
    signup.attempt(data).then(function(response) {
      console.log('success', response);
    });
  };
};
