!(function() {
  'use strict'

  var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    corpSchema;

  /*
   * Define Corporation/Company Schema
   */
  corpSchema = new Schema({
    name: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    corp_code: { type: String },
    fed_tax_id: { type: String },
    deleted: { type: Boolean, default: false }
  });

  corpSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  corpSchema.statics.save = function(data, callback) {

    var CorpModel = new Corp(data);

    CorpModel.save(function(err, resp) {
      if (err) {
        callback(err);
      } else {
        callback(null, resp);
      }
    });
  };

  corpSchema.statics.get = function(id, callback) {
    Corp.findOne({ '_id': id }).exec(callback);
  };

  corpSchema.statics.update = function(id, data, callback) {
    if (data.created_at) {
      delete data.created_at;
    }
    Corp.findByIdAndUpdate(id, { $set: data }, { new: true }, callback);
  };

  corpSchema.statics.getAll = function(page,limit,callback) {
    Corp.find({ 'deleted': false }).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getAllRec = function(callback) {
    Corp.count({ 'deleted': false })
    .exec(callback);
  };
  corpSchema.statics.getSearchRec = function(callback) {

    Corp.find({ 'deleted': false }).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getName = function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'name' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getCity = function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'city' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getState= function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'state' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getZip = function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'zip' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };
  corpSchema.statics.getCorp= function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'corp_code' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getFedtax = function(page,limit,data,callback) {

    Corp.find({ 'deleted': false , 'fed_tax_id' : { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}).limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  corpSchema.statics.getAllCorpsRec = function(callback) {
    Corp.find({ 'deleted': false }).exec(callback);
  };

  var Corp = mongoose.model('Corp', corpSchema);
  module.exports = Corp;

})();