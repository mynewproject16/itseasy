angular.module('itsEasyApp', [
  'ui.router', 'ui.bootstrap', 'toastr'
]);
window.baseUrl = window.location.protocol + "//" + window.location.host + "/";
var lang = 'en';


angular.module('itsEasyApp').run(
    ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        $rootScope.$state = "root";
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(function($stateProvider) {
    $stateProvider
      .state("root", {
        url: "",
        views: {
          'header': {
            templateUrl: 'partials/header.html',
     
          },
          'footer': {
            templateUrl: 'partials/footer.html',
          },
          'content': {
            templateUrl: 'partials/its-easy-content.html',
            controller: 'ItsEasyController'
          },
          'login': {
            templateUrl: 'partials/login.html',
            controller: 'ItsEasyController'
          },
          
        }
      });
  });
