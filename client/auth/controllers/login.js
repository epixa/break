'use strict';

module.exports = function LoginCtrl(login) {
  this.submit = function(data) {
    login.attempt(data).then(function(response) {
      console.log('success', response);
    });
  };
};
