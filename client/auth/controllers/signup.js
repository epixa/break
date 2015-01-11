'use strict';

var _ = require('lodash');

module.exports = function SignupCtrl() {
  this.submit = function(data) {
    data = _.pick(data, ['email', 'password']);
    console.log('signup', data);
  };
};
