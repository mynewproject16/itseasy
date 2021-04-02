
!(function() {

  'use strict'

  var UserModel = require('../models/UserModel');

  var UserController = {


    // checkUser: function(req, res, next) {

     
    //   UserModel.getAllEmail(req.body.username, function (err, resp) {

    //   if (err) {
    //     res.sendStatus(err.message);
    //   } else {
    //   res.json(resp);
    //   }
    // });
     
    // },


    getAllUsers : function(req, res, next) {
      UserModel.getAll(req.body.page,req.body.limit, function(err, aggrResp) {
        
  if (err) {
      res.sendStatus(500);
  } else {
    var users = aggrResp
    if (users && users.length) {
      users = users.filter(function(user) {
        return (user && user.name && user.name.length);
      }).sort(function(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  
    UserModel.getAllRec( function(err, count) {
  
        if (err) {
          res.sendStatus(500);
  
        }else{
  var lengthCount =count;
          res.json({
             lengthCount : lengthCount,
            totalPages: Math.ceil(count / req.body.limit),
            users: aggrResp || []
          });
  
        } 
      });
    }
  });
   },
  




    registration: function(req, res, next) {
      UserModel.getAllEmail(req.body.email, function (err, resp) {
        if (err) {
        
        } else {

if(resp.length == 0){
UserModel.save(req.body, function (err, resp) {

  if (err) {
    res.send(err.message);
  } else {
    res.json(resp);
  }
});
}else{
res.send("Email already used");
}

}

})
     
    
     
    },

    authenticate: function(req, res, next) {

     
      UserModel.authenticate(req.body, function (err, resp) {
      
      if (err) {
        res.send(err.message);
      } else {
        if(resp.length == 1){
          if(resp[0].status == "Deactive" || resp[0].deleted == true){
            
            res.send("Undefined");
          
          
        }else{
          if(resp[0].password == req.body.password){
            res.send(resp[0].role);
          }else{
            res.send("Email");
          }
        }
        }else{
          res.send("Undefined");
        }
       
      }
      
    });
     
    },

    getUser: function(req, res, next) {

     
      UserModel.getAll( function (err, resp) {

      if (err) {
        res.sendStatus(err.message);
      } else {
      res.json(resp);
      }
    });
     
    },

    read: function(req, res, next) {

      UserModel.get(req.params.id, function(err, user) {

        if (err || !user || !user._id) {

          res.sendStatus(500);

        } else {
          res.json(user);
        }
      });
    },


    update: function(req, res, next) {

      UserModel.update(req.params.id, req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },
    delete: function(req, res, next) {

      UserModel.update(req.params.id, { deleted: true }, function(err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json({ success: true});
        }
      });
    },

    getUsers: function(req, res, next) {

      UserModel.getAll(req.params.id, req.body, function (err, resp) {

        if (err) {
          res.sendStatus(500);
        } else {
          res.json(resp);
        }
      });
    },
    

  
  };

  module.exports = UserController;

})();