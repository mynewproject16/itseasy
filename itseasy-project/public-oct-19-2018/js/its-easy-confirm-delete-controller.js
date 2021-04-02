angular.module('itsEasyApp').controller('ItsEasyConfirmDeleteController', ['$scope', '$uibModalInstance', 'ItsEasyApiService', 'data', 'toastr', function ($scope, $uibModalInstance, ItsEasyApiService, data, toastr) {

  $scope.delete = function () {
    $scope.isBusy = true;
    ItsEasyApiService.remove(data.currentObj._id, data.item, function (successResp) {

      $scope.isBusy = false;
      $scope.$parent.tables[data.item + 's'].current_page_data.splice(data.idxToDelete, 1);
      // $scope[data.item + 's'].splice(data.idxToDelete, 1);

      toastr.success(data.item + ' deleted!');
      $uibModalInstance.close('ok');

    }, function (errorResp) {
      $scope.isBusy = false;
      toastr.error('Error while deleting ' + data.item);
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.close('cancel');
  };
}]);
