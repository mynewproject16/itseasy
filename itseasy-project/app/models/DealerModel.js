!(function() {
  'use strict'

  var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    dealerSchema;

  /*
   * Define Dealer Schema
   */
  dealerSchema = new Schema({
    name: { type: String },
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String },
    work_phone: { type: String },
    work_phone_ext: { type: String },
    fax_number: { type: String },
    email: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    corp_code: { type: String },
    dmv_id: { type: String },
    deleted: { type: Boolean, default: false }

  });

  dealerSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  dealerSchema.statics.save = function(data, callback) {

    var DealerModel = new Dealer(data);

    DealerModel.save(function(err, resp) {
      if (err) {
        callback(err);
      } else {
        callback(null, resp);
      }
    });
  };

  dealerSchema.statics.get = function(id, callback) {
    Dealer.findOne({ '_id': id }).exec(callback);
  };

  dealerSchema.statics.update = function(id, data, callback) {
    if (data.created_at) {
      delete data.created_at;
    }
    Dealer.findByIdAndUpdate(id, { $set: data }, { new: true }, callback);
  };

  dealerSchema.statics.getAll = function(page,limit,callback) {
    Dealer.find({ 'deleted': false }).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)
    .exec(callback);
  };

  dealerSchema.statics.getAllRec = function(callback) {
    Dealer.count({ 'deleted': false }).exec(callback);
  };

  dealerSchema.statics.getAllDealersRec = function(callback) {
    Dealer.find({ 'deleted': false }).exec(callback);
  };

  dealerSchema.statics.getName = function(page,limit,data,callback) {

  Dealer.find({ 'deleted': false , 'name' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

     .skip((page - 1) * limit)

    .exec(callback);
  };

  dealerSchema.statics.getCity = function(page,limit,data,callback) {

    Dealer.find({ 'deleted': false , 'city' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)
    .exec(callback);
  };

  dealerSchema.statics.getState= function(page,limit,data,callback) {

    Dealer.find({ 'deleted': false , 'state' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}) .limit(limit * 1)

    .skip((page - 1) * limit)
    .exec(callback);
  };

  dealerSchema.statics.getZip = function(page,limit,data,callback) {

    Dealer.find({ 'deleted': false , 'zip' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1}) 
    .limit(limit * 1)

    .skip((page - 1) * limit)
    .exec(callback);
  };




  dealerSchema.statics.getSearchRec = function(callback) {

    Dealer.find({ 'deleted': false }).exec(callback);
  };
  var Dealer = mongoose.model('Dealer', dealerSchema);
  module.exports = Dealer;

})();