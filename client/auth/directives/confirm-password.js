'use strict';

module.exports = function ConfirmPasswordDirective() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      confirmPassword: '='
    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.confirmPassword = function(modelValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return scope.confirmPassword == modelValue;
      };
    }
  };
};
