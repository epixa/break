'use strict';

var _ = require('lodash');

module.exports = function ResetPasswordService($http) {
  return {
    begin: function(data) {
      data = _.pick(data, ['email']);
      return $http.post('/reset-password', data)
        .then(_.partialRight(_.result, 'data'));
    }
  };
};
