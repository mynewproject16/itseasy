angular.module('itsEasyApp').controller('ItsEasyConfirmDeleteController', ['$scope', '$uibModalInstance', 'ItsEasyApiService', 'data', 'toastr', function ($scope, $uibModalInstance, ItsEasyApiService, data, toastr) {

  $scope.delete = function () {
    $scope.isBusy = true;
    ItsEasyApiService.remove(data.currentObj._id, data.item, function (successResp) {

      $scope.isBusy = false;
      $scope.$parent.tables[data.item + 's'].current_page_data.splice(data.idxToDelete, 1);
      // $scope[data.item + 's'].splice(data.idxToDelete, 1);
      $scope["current_" + data.item] = undefined;
    //   if(data.item=='user'){
    //     document.getElementById("editUser").disabled = true;
    //     document.getElementById("deleteUser").disabled = true;
    //   }
    //  else if(data.item=='job'){
    //     document.getElementById("editJobs").disabled = true;
    //     document.getElementById("deleteJobs").disabled = true;
    //   }
    //  else if(data.item=='dealer'){
    //     document.getElementById("editDealer").disabled = true;
    //     document.getElementById("deleteDealer").disabled = true;
    //   }
    //  else if(data.item=='corp'){
    //     document.getElementById("editCorp").disabled = true;
    //     document.getElementById("deleteCorp").disabled = true;
    //   }
      
      toastr.success(data.item + ' Deleted!');
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
