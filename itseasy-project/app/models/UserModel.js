!(function() {
  'use strict'

  var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    userSchema;
    var validateEmail = function(email) {

      var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
      return re.test(email)
  
  };
  var validatePhone = function(phone) {

    var re = /^\d{10}$/;

    return re.test(phone)

};

  /*
   * Define Sheetoration/Company Schema
   */
  userSchema = new Schema({
    name: { type: String,  required: [true, 'Full name must be provided'] },
        email:    { 
    
          type: String,     
      
          Required:  'Email address cannot be left blank.',
          
          validate: [validateEmail, 'Please fill a valid email address'],
               match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
          index: {unique: true, dropDups: true}
          
          },
      
        password: { type: String , required: [true,  'Password cannot be left blank']},
        phone:{type:Number,
     
        
        },
        role:{type :String},
        status:{type:String},
        deleted: { type: Boolean, default: false }
  });

  userSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  userSchema.statics.save = function(data, callback) {

    var UserModel = new User(data);

    UserModel.save(function(err, resp) {
      if (err) {
        callback(err);
      } else {
        callback(null, resp);
      }
    });
  };
  userSchema.statics.get = function(id, callback) {
    User.findOne({ '_id': id }).exec(callback);
  };

  userSchema.statics.update = function(id, data, callback) {
    if (data.created_at) {
      delete data.created_at;
    }
    User.findByIdAndUpdate(id, { $set: data }, { new: true }, callback);
  };
  // userSchema.statics.getAll = function(callback) {
  //   User.find({'deleted': false }).exec(callback);
  // };

  userSchema.statics.getAll = function(page,limit,callback) {
    User.find({ 'deleted': false }).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  userSchema.statics.getAllRec = function(callback) {
    User.count({ 'deleted': false }).exec(callback);
  };

  userSchema.statics.getAllEmail = function(email,callback) {
    User.find({ 'email': email }).exec(callback);
  };

  userSchema.statics.getSearchRec = function(callback) {

    User.find({ 'deleted': false }).exec(callback);
  };
//Authenticate input on database
userSchema.statics.authenticate = function(data,callback) {
  User.find({ 'email': data.name }).exec(callback);
};
  var User = mongoose.model('User', userSchema);
  module.exports = User;

})();




// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
 
// var UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   name: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   passwordConf: {
//     type: String,
//     required: true,
//   }
// });
 
// // Authenticate input on database
// UserSchema.statics.authenticate = function (email, password, callback) {
//   User.findOne({ email: email })
//     .exec(function (err, user) {
//       if (err) {
//         return callback(err)
//       } else if (!user) {
//         var err = new Error('User not found.');
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (result === true) {
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       })
//     });
// }
 
// // Hashing password before saving it to the database
// UserSchema.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.password, 10, function (err, hash) {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });
 
// var User = mongoose.model('User', UserSchema);
// module.exports = User;