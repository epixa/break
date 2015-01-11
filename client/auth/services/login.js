'use strict';

var _ = require('lodash');

module.exports = function SubmitLoginService($http) {
  return {
    attempt: function(data) {
      data = _.pick(data, ['email', 'password']);
      return $http.post('/login', data)
        .then(_.partialRight(_.result, 'data'));
    }
  };
};
