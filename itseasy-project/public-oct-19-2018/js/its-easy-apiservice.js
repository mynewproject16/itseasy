angular.module('itsEasyApp').service('ItsEasyApiService', ['$http', function($http) {

  this.getAll = function(success, error) {
    return $http.get('/api/get-all').then(success, error);
  };

  this.create = function(item, data, success, error) {
    return $http.post('/api/' + item + '/create', data).then(success, error);
  };

  this.update = function(id, item, data, success, error) {
    return $http.put('/api/' + item + '/update/' + id, data).then(success, error);
  };

  this.remove = function(id, item, success, error) {
    return $http.delete('/api/' + item + '/delete/' + id).then(success, error);
  };

  this.register = function(data, success, error) {
    return $http.post('/api/login/', data).then(success, error);
  };

  this.getForms = function(jobId, success, error) {
    return $http.get('/api/forms/' + jobId).then(success, error);
  };

  this.getSheet = function(data, success, error) {
    return $http.get("/api/job/get-sheet/" + data.sheet_name + "/" + data.job_ids).then(success, error);
  };

}]);