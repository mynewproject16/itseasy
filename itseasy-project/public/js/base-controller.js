angular.module('itsEasyApp').controller('BaseController', BaseController);

BaseController.$inject = ['$scope', '$rootScope','$window',];

function BaseController($scope, $rootScope,$window) {
  // $scope.$broadcast('rememberMe');
  $scope.count = localStorage.getItem('executed');
  $scope.activateTab = false;
  if($scope.count == 1){
    $scope.role = localStorage.getItem('role'); 
    if($scope.role=="Admin"){
$scope.activateTab = true;
    }else{
      $scope.activateTab = false;
    }
    $scope.activeView = localStorage.getItem('activeView') || 'jobs';  
  }else {
    $scope.loginVisibility = false;
  }
      
  $scope.activeuserView = localStorage.getItem('activeUserName');
  $rootScope.loading = true;
  // $scope.loginVisibility = false;

  if( $scope.activeView == 'jobs'){
    $scope.loginVisibility = true;
  }else if( $scope.activeView == 'corps'){
    $scope.loginVisibility = true;
  }else if( $scope.activeView == 'dealers'){
    $scope.loginVisibility = true;
  }else if( $scope.activeView == 'users'){
    $scope.loginVisibility = true;
  }
  else{
    $scope.loginVisibility = false;
  }


  $scope.backToLogin = function(view) {
    $scope.activeView == view;
    localStorage.setItem('activeView', view);
    localStorage.clear();
    $scope.loginVisibility = false;


  }
  $scope.setActiveView = function(view) {
    debugger;
    $scope.role = localStorage.getItem('role'); 
    if($scope.role=="Admin"){
$scope.activateTab = true;
    }else{
      $scope.activateTab = false;
    }
    if (!view || view === '') return;
    if (view === $scope.activeView) return;
    $scope.activeView = view;
    localStorage.setItem('activeView', view);
  
    $scope.$broadcast('activeViewChanged');
    
    
   
  };
 
  $scope.$on('loginVisibility', function(e) {
    $scope.loginVisibility = true;
    viewPage= "jobs";
    localStorage.setItem('activeView', viewPage)
    $scope.setActiveView('jobs');
  });
  
}