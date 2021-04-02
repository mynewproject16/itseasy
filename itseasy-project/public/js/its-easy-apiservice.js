angular.module('itsEasyApp').service('ItsEasyApiService', ['$http', function($http) {

  this.getAll = function(success, error) {
    return $http.get('/api/get-all').then(success, error);
  };

    this.getAllDealersRec = function(success, error) {
    return $http.get('/api/dealer/getAllDealersRec').then(success, error);
  };

  this.getUsersJobDealRec = function( data, success, error) {
    return $http.post('/api/job/getAllForSearch', data ).then(success, error);
  };
this.getAllCorpsRec = function(success, error) {
    return $http.get('/api/corp/getAllCorpsRec').then(success, error);
  };

  this.getdealerRec = function(id, success, error) {
    return $http.get('/api/dealer/read/'+ id).then(success, error);
  };
  
  // this.getAllJobs = function(success, error) {
  //   return $http.get('/api/job/getAllJobs').then(success, error);
  // };

  this.checkUser = function(data, success, error) {
    return $http.post('/api/user/checkUser' , data).then(success, error);
  };
  this.getUsersArchRec = function(  data, success, error) {
    return $http.post('/api/job/getUsersArchRec', data).then(success, error);
  };

  this.getUsersJobRec = function(  data, success, error) {
    return $http.post('/api/job/getUsersRec', data).then(success, error);
  };
  this.getUsersDealerRec = function(  data, success, error) {
    return $http.post('/api/dealer/getUsersRec', data).then(success, error);
  };
  this.getUsersCorpRec = function(  data, success, error) {
    return $http.post('/api/corp/getUsersRec', data).then(success, error);
  };

  this.getAllJobs = function(data, success, error) {
    return $http.post('/api/job/getAllJobs' , data).then(success, error);
  };
  this.getAllArchive = function(data, success, error) {
    return $http.post('/api/job/getAllArchive' , data).then(success, error);
  };

  this.getAllDealers = function(data, success, error) {
    return $http.post('/api/dealer/getAllDealers' , data).then(success, error);
  };

  this.getAllCorps = function(data, success, error) {
    return $http.post('/api/corp/getAllCorps' , data).then(success, error);
  };

  this.getAllSheets = function(data, success, error) {
    return $http.post('/api/sheet/getAllSheets' , data).then(success, error);
  };
  this.getAllUsers = function(data, success, error) {
    return $http.post('/api/user/getAllUsers' , data).then(success, error);
  };

  // this.getAllArchievs = function(data, success, error) {
  //   return $http.post('/api/job/getAllArchievs' , data).then(success, error);
  // };

  // this.getAllUsers = function(success, error) {
  //   return $http.get('/api/user/getUser').then(success, error);
  // };

  this.create = function(item, data, success, error) {
    return $http.post('/api/' + item + '/create', data).then(success, error);
  };

  this.read = function(id,item, success, error) {
    return $http.get('/api/' + item + '/read/'+ id).then(success, error);
  };

  this.registration = function( item, data, success, error) {
    return $http.post('/api/' + item + '/registration', data).then(success, error);
  };

  this.authenticate = function( item, data, success, error) {
    return $http.post('/api/' + item + '/authenticate', data).then(success, error);
  };

  this.update = function(id, item, data, success, error) {
    return $http.put('/api/' + item + '/update/' + id, data).then(success, error);
  };

  this.remove = function(id, item, success, error) {
    return $http.delete('/api/' + item + '/delete/' + id).then(success, error);
  };

  // this.register = function(data, success, error) {
  //   return $http.post('/api/login/', data).then(success, error);
  // };

  this.getForms = function(jobId, success, error) {
    return $http.get('/api/forms/' + jobId).then(success, error);
  };

  this.getSheet = function(data, success, error) {
    return $http.get("/api/job/get-sheet/" + data.sheet_name + "/" + data.job_ids).then(success, error);
  };

}]);