!(function() {
  'use strict'

  var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    jobSchema;

  /*
   * Define Job Schema
   */
  jobSchema = new Schema({

    // Job info

    date: { type: String },
    lease_or_buy: { type: String, enum: ['lease', 'buy'] },
    initial: { type: Boolean, default: false },
    trans: { type: Boolean, default: false },
    renew: { type: Boolean, default: false },
    rep_pl: { type: Boolean, default: false },
    dupl: { type: Boolean, default: false },
    comm: { type: Boolean, default: false },
    add_lien: { type: Boolean, default: false},
    remove_lien: { type: Boolean, default:false},
    rental: { type: Boolean, default: false },
    hold: { type: Boolean, default: false },
    created_by: { type: String },
    state: { type: String },
    trans_type: { type: String },
    job_type: { type: String, enum: ['sys', 'non-sys'] },
    status: { type: String, enum: ["ITS EASY", "READY FOR DMV", "SENT TO DMV", "BACK FROM DMV", "READY TO SHIP", "SHIPPED"] },
    date_sent: { type: String },
    date_return: { type: String},

    note: { type: String },
    notes_collection: [],
    sheet_name: { type: String },

    dealer_id: { type: Schema.Types.ObjectId, ref: 'Dealer' },
    lessor_id: { type: Schema.Types.ObjectId, ref: 'Corp' },
    lien_id: { type: Schema.Types.ObjectId, ref: 'Corp' },

    // Seller info
    seller_name: { type: String },
    seller_address1: { type: String },
    seller_address2: { type: String },
    seller_city: { type: String },
    seller_state: { type: String },
    seller_zip: { type: String },
    seller_corp_code: { type: String },
    seller_dealer_same: { type: Boolean, default: false },

    // Lessee info
    primary_first_name: { type: String },
    primary_middle_name: { type: String },
    primary_last_name: { type: String },
    primary_city: { type: String },
    primary_state: { type: String },
    primary_zip: { type: String },
    primary_company: { type: String },
    primary_address1: { type: String },
    primary_address2: { type: String },
    primary_addess_mailing_address_same: { type: Boolean, default: false },
    primary_mailing_city: { type: String },
    primary_mailing_state: { type: String },
    primary_mailing_zip: { type: String },
    primary_mailing_address1: { type: String },
    primary_mailing_address2: { type: String },
    primary_dob: { type: String },
    primary_sex: { type: String, enum: ['male', 'female'] },
    primary_eye_color: { type: String },
    primary_license_number: { type: String },
    primary_corp_code: { type: String },
    primary_ssn_number: { type: String },
    primary_tax_id_number: { type: String },
    primary_state_of: { type: String },
    primary_violation: { type: String, default: "none" },
    is_lessee_company: { type: Boolean, default: false },

    // Coowner info
    coowner_first_name: { type: String },
    coowner_middle_name: { type: String },
    coowner_last_name: { type: String },
    coowner_city: { type: String },
    coowner_state: { type: String },
    coowner_zip: { type: String },
    coowner_company: { type: String },
    coowner_address1: { type: String },
    coowner_address2: { type: String },
    coowner_addess_mailing_address_same: { type: Boolean, default: false },
    coowner_mailing_city: { type: String },
    coowner_mailing_state: { type: String },
    coowner_mailing_zip: { type: String },
    coowner_mailing_address1: { type: String },
    coowner_mailing_address2: { type: String },
    coowner_dob: { type: String },
    coowner_sex: { type: String, enum: ['male', 'female'] },
    coowner_eye_color: { type: String },
    coowner_license_number: { type: String },
    coowner_corp_code: { type: String },
    coowner_ssn_number: { type: String },

    // Vehicle info
    vehicle_vin: { type: String },
    vehicle_plate: { type: String },
    vehicle_reg_state: { type: String },
    vehicle_purchase_date: { type: String },
    vehicle_status: { type: String, enum: ['new', 'used'] },
    vehicle_weight: { type: String },
    vehicle_year: { type: String },
    vehicle_body_style: { type: String },
    vehicle_make: { type: String },
    vehicle_model: { type: String },
    vehicle_color: { type: String },
    vehicle_axles: { type: Number },
    vehicle_fuel_type: { type: String },
    vehicle_cylinders: { type: String },
    vehicle_emission_cert_number: { type: String },
    vehicle_odometer: { type: String },
    vehicle_purchase_price: { type: String },
    vehicle_trade_in: { type: String },
    vehicle_tax_rate: { type: String },
    vehicle_tax: { type: String },
    vehicle_title_reg: { type: String, enum: ['instate', 'outofstate'] },
    vehicle_insurance_company: { type: String },
    vehicle_insurance_policy_number: { type: String },
    vehicle_lease_sign_date: { type: String },
    vehicle_lease_terms: { type: Number },
    vehicle_lease_cancellation: { type: Boolean, default: false },
    vehicle_lease_cancel_date: { type: String },
    reg_suspended_yes: { type: Boolean, default: false },
    reg_suspended_no: { type: Boolean, default: true },

    epa_average: { type: String },
    epa_rating_over_40: { type: String },
    epa_zero_emissions: { type: Boolean, default: false },
    epa_question_1: { type: Boolean, default: false },
    epa_question_2: { type: Boolean, default: false },
    epa_question_3: { type: Boolean, default: false },
    commercial_yes: { type: Boolean, default: false },
    commercial_no: { type: Boolean, default: false },

    deleted: { type: Boolean, default: false }
  });

  jobSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  jobSchema.statics.save = function(data, callback) {

    var JobModel = new Job(data);

    JobModel.save(function(err, resp) {
      if (err) {
        callback(err);
      } else {
        callback(null, resp);
      }
    });
  };

  jobSchema.statics.get = function(id, callback) {
    Job.findOne({ '_id': id }).populate('dealer_id lessor_id lien_id').exec(callback);
  };
  
  jobSchema.statics.getAllForSearch = function(callback) {
    Job.find({  'deleted': false}).populate('dealer_id').sort({$natural:-1}).exec(callback);
  };

  jobSchema.statics.update = function(id, data, callback) {
    if (data.created_at) {
      delete data.created_at;
    }
    Job.findByIdAndUpdate(id, { $set: data }, { new: true }, callback);
  };

  jobSchema.statics.getAll = function(page,limit,callback) {
    Job.find({ 'deleted': false }).sort({$natural:-1})
     .limit(limit * 1)

     .skip((page - 1) * limit)

    .exec(callback);
  };

  jobSchema.statics.getAllArchive = function(page,limit,callback) {
    Job.find({ 'deleted': true }).sort({$natural:-1})
     .limit(limit * 1)

     .skip((page - 1) * limit)

    .exec(callback);
  };

  jobSchema.statics.getAllRec = function(callback) {
    Job.count({ 'deleted': false }).exec(callback);
  };

  jobSchema.statics.getAllArchiveRec = function(callback) {
    Job.count({ 'deleted': true }).exec(callback);
  };




  jobSchema.statics.getVin = function(page,limit,data,callback) {

    Job.find({ 'deleted': false , 'vehicle_vin' : { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getDealer = function(page,limit,data,callback) {

    Job.find({ 'deleted': false , 'dealer_id' : data}).populate('dealer_id')
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getLastName = function(page,limit,data,callback) {

    Job.find({ 'deleted': false , 'primary_last_name' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getVehicleCompany = function(page,limit,data,callback) {

    Job.find({ 'deleted': false , 'vehicle_insurance_company' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  
  jobSchema.statics.getArchVin = function(page,limit,data,callback) {

    Job.find({ 'deleted': true , 'vehicle_vin' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getArchDealer = function(page,limit,data,callback) {

    Job.find({ 'deleted': true , 'name' : new RegExp(data)}).populate('dealer_id')
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getArchLastName = function(page,limit,data,callback) {

    Job.find({ 'deleted': true , 'primary_last_name' : { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };
  jobSchema.statics.getCompany = function(page,limit,data,callback) {

    Job.find({ 'deleted': false , 'primary_company' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };
  
  jobSchema.statics.getArchCompany = function(page,limit,data,callback) {

    Job.find({ 'deleted': true , 'primary_company' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getArchVehicleCompany = function(page,limit,data,callback) {

    Job.find({ 'deleted': true , 'vehicle_insurance_company' :  { $regex: new RegExp("^" + data, "i") }}).sort({$natural:-1})
    .limit(limit * 1)

    .skip((page - 1) * limit)

   .exec(callback);
  };

  jobSchema.statics.getJobs = function(jobIds, callback) {
    Job.find({ _id: { '$in': jobIds } }).populate('dealer_id lessor_id lien_id').exec(callback);
  };

  var Job = mongoose.model('Job', jobSchema);
  module.exports = Job;

})();