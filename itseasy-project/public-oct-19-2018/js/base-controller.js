angular.module('itsEasyApp').controller('BaseController', BaseController);

BaseController.$inject = ['$scope', '$rootScope'];

function BaseController($scope, $rootScope) {
  $scope.activeView = localStorage.getItem('activeView') || 'jobs';
  $rootScope.loading = true;

  $scope.setActiveView = function(view) {
    if (!view || view === '') return;

    if (view === $scope.activeView) return;

    $scope.activeView = view;
    localStorage.setItem('activeView', view);
    $scope.$broadcast('activeViewChanged');

  };
}