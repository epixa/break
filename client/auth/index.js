'use strict';

module.exports = angular.module('auth', [])

.controller('SignupCtrl', require('./controllers/signup'))
.controller('LoginCtrl', require('./controllers/login'))
.controller('ResetPasswordCtrl', require('./controllers/reset-password'))

.factory('login', require('./services/login'))
.factory('signup', require('./services/signup'))
.factory('resetPassword', require('./services/reset-password'))

.directive('confirmPassword', require('./directives/confirm-password'))
