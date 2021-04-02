!(function() {

  'use strict'

  var DealerModel = require('../models/DealerModel');

  var DealerController = {

    getUsersRec: function(req, res, next) {
          
      if(req.body.searchKey.name != undefined && req.body.searchKey.hasOwnProperty("name")){
        DealerModel.getName(req.body.page,req.body.limit,req.body.searchKey.name, function(err, dealer) {

         if (err) {
 
           res.sendStatus(500);
 
         } else {
           res.json(dealer);
         }
       });

           }
         else  if(req.body.searchKey.city != undefined && req.body.searchKey.hasOwnProperty("city")){
          DealerModel.getCity(req.body.page,req.body.limit,req.body.searchKey.city, function(err, dealer) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(dealer);
               }
             });   

           }
          else if(req.body.searchKey.state != undefined && req.body.searchKey.hasOwnProperty("state")){
            DealerModel.getState(req.body.page,req.body.limit,req.body.searchKey.state, function(err, dealer) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(dealer);
               }
             });    

           }
         else if(req.body.searchKey.zip != undefined && req.body.searchKey.hasOwnProperty("zip")){

          DealerModel.getZip(req.body.page,req.body.limit,req.body.searchKey.zip, function(err, dealer) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(dealer);
               }
             });   
            

           }
 },

   getAllDealers : function(req, res, next) {
    DealerModel.getAll(req.body.page,req.body.limit, function(err, aggrResp) {
      
if (err) {
    res.sendStatus(500);
} else {
  var dealers = aggrResp
  if (dealers && dealers.length) {
    dealers = dealers.filter(function(dealer) {
      return (dealer && dealer.name && dealer.name.length);
    }).sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  DealerModel.getAllRec( function(err, count) {

      if (err) {
        res.sendStatus(500);

      }else{
var lengthCount =count;
        res.json({
           lengthCount : lengthCount,
          totalPages: Math.ceil(count / req.body.limit),
          dealers: dealers || []
        });

      } 
    });
  }
});
 },

 getAllDealRec : function(req, res, next) {
  DealerModel.getAllDealersRec(function(err, aggrResp) {
    
if (err) {
  res.sendStatus(500);
} else {
var dealers = aggrResp
if (dealers && dealers.length) {
  dealers = dealers.filter(function(dealer) {
    return (dealer && dealer.name && dealer.name.length);
  }).sort(function(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}
res.json({
 dealers: aggrResp || []
});

}
});
},
    create: function(req, res, next) {

      DealerModel.save(req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    read: function(req, res, next) {

      DealerModel.get(req.params.id, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    update: function(req, res, next) {

      DealerModel.update(req.params.id, req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },

    delete: function(req, res, next) {

      DealerModel.update(req.params.id, { deleted: true }, function(err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json({ success: true});
        }
      });
    }

  };

  module.exports = DealerController;

})();