'use strict';

module.exports = angular.module('auth', [])

.controller('SignupCtrl', require('./controllers/signup'))
.controller('LoginCtrl', require('./controllers/login'))

.directive('confirmPassword', require('./directives/confirm-password'))
