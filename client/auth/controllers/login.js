'use strict';

var _ = require('lodash');

module.exports = function LoginCtrl() {
  this.submit = function(data) {
    data = _.pick(data, ['email', 'password']);
    console.log('login', data);
  };
};
