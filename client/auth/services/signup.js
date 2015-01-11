'use strict';

var _ = require('lodash');

module.exports = function SubmitSignupService($http) {
  return {
    attempt: function(data) {
      data = _.pick(data, ['email', 'password']);
      return $http.post('/signup', data)
        .then(_.partialRight(_.result, 'data'));
    }
  };
};
