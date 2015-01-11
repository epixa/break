'use strict';

module.exports = function SignupCtrl() {
  this.submit = function(data) {
    console.log('signup', data);
  };
};
