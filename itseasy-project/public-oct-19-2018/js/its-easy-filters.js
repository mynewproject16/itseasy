angular.module('itsEasyApp').filter('itseToDate', [function () {
  return function (input) {
    return new Date(input);
  };
}]);