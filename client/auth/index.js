'use strict';

module.exports = angular.module('auth', [])

.controller('SignupCtrl', require('./controllers/signup'))

.directive('confirmPassword', require('./directives/confirm-password'))
