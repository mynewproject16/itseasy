angular.module('itsEasyApp').directive('formatDateModel', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function(modelValue) {
          return new Date(modelValue);
        });
      }
    };
  })
  // Convert number in select inputs to string
  .directive('numberModelToString', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$formatters.push(function(val) {
          return val ? val.toString() : undefined;
        });
      }
    };
  });
