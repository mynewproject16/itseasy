!(function() {

  'use strict'

  var CorpModel = require('../models/CorpModel');

  var CorpController = {


    getAllCorpRec : function(req, res, next) {
      CorpModel.getAllCorpsRec(function(err, aggrResp) {
        
    if (err) {
      res.sendStatus(500);
    } else {
      var corps = aggrResp
      if (corps && corps.length) {
        corps = corps.filter(function(corp) {
          return (corp && corp.name && corp.name.length);
        }).sort(function(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      }
    res.json({
      corps: aggrResp || []
    });
    
    }
    });
    },

    getUsersRec: function(req, res, next) {
          
      if(req.body.searchKey.name != undefined && req.body.searchKey.hasOwnProperty("name")){
        CorpModel.getName(req.body.page,req.body.limit,req.body.searchKey.name, function(err, corp) {

         if (err) {
 
           res.sendStatus(500);
 
         } else {
           res.json(corp);
         }
       });

           }
         else  if(req.body.searchKey.city != undefined && req.body.searchKey.hasOwnProperty("city")){
          CorpModel.getCity(req.body.page,req.body.limit,req.body.searchKey.city, function(err, corp) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(corp);
               }
             });   

           }
          else if(req.body.searchKey.state != undefined && req.body.searchKey.hasOwnProperty("state")){
            CorpModel.getState(req.body.page,req.body.limit,req.body.searchKey.state, function(err, corp) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(corp);
               }
             });    

           }
         else if(req.body.searchKey.zip != undefined && req.body.searchKey.hasOwnProperty("zip")){

          CorpModel.getZip(req.body.page,req.body.limit,req.body.searchKey.zip, function(err, corp) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(corp);
               }
             });   
            

           }
           else if(req.body.searchKey.corp_code != undefined && req.body.searchKey.hasOwnProperty("corp_code")){

            CorpModel.getCorp(req.body.page,req.body.limit,req.body.searchKey.corp_code, function(err, corp) {
  
                 if (err) {
         
                   res.sendStatus(500);
         
                 } else {
                   res.json(corp);
                 }
               });   
              
  
             }
             else if(req.body.searchKey.fed_tax_id != undefined && req.body.searchKey.hasOwnProperty("fed_tax_id")){

              CorpModel.getFedtax(req.body.page,req.body.limit,req.body.searchKey.fed_tax_id, function(err, corp) {
    
                   if (err) {
           
                     res.sendStatus(500);
           
                   } else {
                     res.json(corp);
                   }
                 });   
                
    
               }
 },


   getAllCorps : function(req, res, next) {
    CorpModel.getAll(req.body.page,req.body.limit, function(err, aggrResp) {
      
if (err) {
    res.sendStatus(500);
} else {
  var corps = aggrResp
  if (corps && corps.length) {
    corps = corps.filter(function(corp) {
      return (corp && corp.name && corp.name.length);
    }).sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  CorpModel.getAllRec( function(err, count) {

      if (err) {
        res.sendStatus(500);

      }else{
var lengthCount =count;
        res.json({
           lengthCount : lengthCount,
          totalPages: Math.ceil(count / req.body.limit),
          corps: corps || []
        });

      } 
    });
  }
});
 },



    create: function(req, res, next) {

      CorpModel.save(req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    read: function(req, res, next) {

      CorpModel.get(req.params.id, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    update: function(req, res, next) {

      CorpModel.update(req.params.id, req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    delete: function(req, res, next) {

      CorpModel.update(req.params.id, { deleted: true }, function(err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json({ success: true});
        }
      });
    }

  };

  module.exports = CorpController;

})();