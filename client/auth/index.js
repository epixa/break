'use strict';

module.exports = angular.module('auth', [])

.controller('SignupCtrl', require('./controllers/signup'))
.controller('LoginCtrl', require('./controllers/login'))

.factory('login', require('./services/login'))
.factory('signup', require('./services/signup'))

.directive('confirmPassword', require('./directives/confirm-password'))
