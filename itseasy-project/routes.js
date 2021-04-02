!(function() {
  'use strict'

  var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    async = require('async'),
    DealerController = require('./app/controllers/DealerController'),
    CorpController = require('./app/controllers/CorpController'),
    JobController = require('./app/controllers/JobController'),
    PdfController = require('./app/controllers/PdfController'),
    SheetController = require('./app/controllers/SheetController'),
    UserController = require('./app/controllers/UserController'),
    JobModel = require('./app/models/JobModel'),
    DealerModel = require('./app/models/DealerModel'),
    CorpModel = require('./app/models/CorpModel'),
    SheetModel = require('./app/models/SheetModel'),
    UserModel = require('./app/models/UserModel');
    

  var route = function(app) {

    router.post('/user/registration', UserController.registration);
    router.post('/user/authenticate', UserController.authenticate);
    router.get('/user/getUser', UserController.getUser);
    router.delete('/user/delete/:id', UserController.delete);
    router.put('/user/update/:id', UserController.update);
    router.get('/user/read/:id', UserController.read);
    router.post('/user/getAllUsers', UserController.getAllUsers);
    // router.post('/user/checkUser', UserController.checkUser);

    router.post('/job/create', JobController.create);
    router.get('/job/read/:id', JobController.read);
    router.put('/job/update/:id', JobController.update);
    router.delete('/job/delete/:id', JobController.delete);
    router.get('/job/get-sheet/:sheet_name/:job_ids', JobController.getSheet);
    router.post('/job/getAllJobs', JobController.getAllJobs);
    router.post('/job/getUsersRec', JobController.getUsersRec);
    router.post('/job/getAllArchive', JobController.getAllArchive);
    router.post('/job/getUsersArchRec', JobController.getUsersArchRec);
    router.post('/job/getAllForSearch', JobController.getSearchRec);

    // router.get('/job/getVin', JobController.getVin);
    // router.get('/job/getDealer', JobController.getDealer);
    // router.get('/job/getLastName', JobController.getLastName);
    // router.get('/job/getVehicleCompany', JobController.getVehicleCompany);
    
    
    
    router.post('/dealer/create', DealerController.create);
    router.get('/dealer/read/:id', DealerController.read);
    router.put('/dealer/update/:id', DealerController.update);
    router.delete('/dealer/delete/:id', DealerController.delete);
    router.post('/dealer/getAllDealers', DealerController.getAllDealers);
    router.post('/dealer/getUsersRec', DealerController.getUsersRec);
    router.get('/dealer/getAllDealersRec', DealerController.getAllDealRec);



    router.post('/corp/create', CorpController.create);
    router.get('/corp/read/:id', CorpController.read);
    router.put('/corp/update/:id', CorpController.update);
    router.delete('/corp/delete/:id', CorpController.delete);
    router.post('/corp/getAllCorps', CorpController.getAllCorps);
    router.post('/corp/getUsersRec', CorpController.getUsersRec);
     router.get('/corp/getAllCorpsRec', CorpController.getAllCorpRec);


    router.post('/sheet/create', SheetController.create);
    router.get('/sheet/read/:id', SheetController.read);
    router.post('/sheet/getAllSheets', SheetController.getAllSheets);
    //router.put('/corp/update/:id', CorpController.update);
    //router.delete('/corp/delete/:id', CorpController.delete);

    router.get('/forms/:job_id', JobController.getForms);

 








    router.get("/get-all", function(req, res, next) {

      async.parallel([

        JobModel.getAll,
        DealerModel.getAll,
        CorpModel.getAll,
        SheetModel.getAll,
        UserModel.getAll,

      ], function(err, aggrResp) {

        if (err) {
          res.sendStatus(500);

        } else {
          var corps = aggrResp[2],
            dealers = aggrResp[1],
            jobs = aggrResp[0],
            users = aggrResp[4];
            
          if (corps && corps.length) {
            corps = corps.filter(function(corp) {
              return (corp && corp.name && corp.name.length);
            }).sort(function(a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
          }

          if (dealers && dealers.length) {
            dealers = dealers.filter(function(dealer) {
              return (dealer && dealer.name && dealer.name.length);
            }).sort(function(a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
          }

          if (users && users.length) {
            users = users.filter(function(user) {
              return (user && user.name && user.name.length);
            }).sort(function(a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
          }
          if (jobs && jobs.length) {
            
            jobs = jobs.sort(function(a, b) {
              if (a.created_at > b.created_at) return -1;
              if (a.created_at < b.created_at) return 1;
              return 0;
            });
          }
          

          res.json({
            jobs: aggrResp[0] || [],
            dealers: dealers || [],
            corps: corps || [],
            sheets: aggrResp[3] || [],
            users: users || []

          });
        }
      });
    });




 
    app.use('/api', router);
  }

  module.exports = route;
})();