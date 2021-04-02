!(function() {
  'use strict'

  var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    sheetSchema;

  /*
   * Define Sheetoration/Company Schema
   */
  sheetSchema = new Schema({
    created_sheet_file_name: { type: String },
    created_sheet_name: { type: String },
    deleted: {type: Boolean, default: false}
  });

  sheetSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  sheetSchema.statics.save = function(data, callback) {

    var SheetModel = new Sheet(data);

    SheetModel.save(function(err, resp) {
      if (err) {
        callback(err);
      } else {
        callback(null, resp);
      }
    });
  };

  sheetSchema.statics.get = function(id, callback) {
    Sheet.findOne({ '_id': id }).exec(callback);
  };

  // sheetSchema.statics.getAll = function(callback) {
  //   Sheet.find({ 'deleted': false }).exec(callback);
  // };

  sheetSchema.statics.getAll = function(page,limit,callback) {
    Sheet.find({ 'deleted': false }).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)
    
    .exec(callback);
  };

  sheetSchema.statics.getAllRec = function(callback) {
    Sheet.count({ 'deleted': false }).exec(callback);
  };
  sheetSchema.statics.getSearchRec = function(callback) {

    Sheet.find({ 'deleted': false }).exec(callback);
  };

  var Sheet = mongoose.model('Sheet', sheetSchema);
  module.exports = Sheet;

})();