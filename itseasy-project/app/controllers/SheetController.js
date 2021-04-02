!(function() {

  'use strict'

  var SheetModel = require('../models/SheetModel');

  var SheetController = {

    getAllSheets : function(req, res, next) {
      SheetModel.getAll(req.body.page,req.body.limit, function(err, aggrResp) {
        
  if (err) {
      res.sendStatus(500);
  } else {
    var sheets = aggrResp
   
   SheetModel.getAllRec( function(err, count) {
  
        if (err) {
          res.sendStatus(500);
  
        }else{
  var lengthCount =count;
          res.json({
             lengthCount : lengthCount,
            totalPages: Math.ceil(count / req.body.limit),
            sheets: aggrResp || []
          });
  
        } 
      });
    }
  });
   },





    create: function(req, res, next) {

      SheetModel.save(req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    read: function(req, res, next) {

      SheetModel.get(req.params.id, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    }
  };

  module.exports = SheetController;

})();