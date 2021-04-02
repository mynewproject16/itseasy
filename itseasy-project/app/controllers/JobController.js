!(function() {

  'use strict'
  const path = require('path');
  var pdfDirectory = path.join(__dirname, '../..', 'pdfs/'),
    rootDirectory = path.join(__dirname, '../..');

  var JobModel = require('../models/JobModel'),
    PdfController = require('./PdfController'),
    fs = require('fs-extra');

  var customConcat = function(newKey, job, fields, insertComma) {

    var ret = "",
      len = fields.length;

    fields.forEach(function(field, idx) {

      if (job[field]) {

        ret += job[field];

        if (idx < (len - 1)) {
          ret += ((insertComma) ? "," : "" + " ");
        }
      }
    });

    job[newKey] = ret;
  };

  var JobController = {
    
    




    getUsersArchRec: function(req, res, next) {
          
      if(req.body.searchKey.vehicle_vin != undefined && req.body.searchKey.hasOwnProperty("vehicle_vin")){
       JobModel.getArchVin(req.body.page,req.body.limit,req.body.searchKey.vehicle_vin, function(err, job) {

         if (err) {
 
           res.sendStatus(500);
 
         } else {
           res.json(job);
         }
       });

           }
         else  if(req.body.searchKey.dealer_name != undefined && req.body.searchKey.hasOwnProperty("dealer_name")){
             JobModel.getArchDealer(req.body.page,req.body.limit,req.body.searchKey.dealer_name, function(err, job) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(job);
               }
             });   

           }
          else if(req.body.searchKey.primary_last_name != undefined && req.body.searchKey.hasOwnProperty("primary_last_name")){
             JobModel.getArchLastName(req.body.page,req.body.limit,req.body.searchKey.primary_last_name, function(err, job) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                if(job.length == 0){
                  JobModel.getArchCompany(req.body.page,req.body.limit,req.body.searchKey.primary_last_name, function(err, job) {

                    if (err) {
            
                      res.sendStatus(500);
            
                    }else{
                      res.json(job);
                    }
                });
              }else{
                res.json(job);
              }
               }
             });    

           }
         else if(req.body.searchKey.vehicle_insurance_company != undefined && req.body.searchKey.hasOwnProperty("vehicle_insurance_company")){

             JobModel.getArchVehicleCompany(req.body.page,req.body.limit,req.body.searchKey.vehicle_insurance_company, function(err, job) {

               if (err) {
       
                 res.sendStatus(500);
       
               } else {
                 res.json(job);
               }
             });   
            

           }
 },
     

    getUsersRec: function(req, res, next) {
          
       if(req.body.searchKey.vehicle_vin != undefined && req.body.searchKey.hasOwnProperty("vehicle_vin")){
        JobModel.getVin(req.body.page,req.body.limit,req.body.searchKey.vehicle_vin, function(err, job) {

          if (err) {
  
            res.sendStatus(500);
  
          } else {
            res.json(job);
          }
        });

            }
          else  if(req.body.dealer_id != undefined && req.body.hasOwnProperty("dealer_id")){
              JobModel.getDealer(req.body.page,req.body.limit,req.body.dealer_id, function(err, job) {

                if (err) {
        
                  res.sendStatus(500);
        
                } else {
                  res.json(job);
                }
              });   

            }
            else if(req.body.searchKey.primary_last_name != undefined && req.body.searchKey.hasOwnProperty("primary_last_name")){
              JobModel.getLastName(req.body.page,req.body.limit,req.body.searchKey.primary_last_name, function(err, job) {

                if (err) {
        
                  res.sendStatus(500);
        
                } else {
                if(job.length == 0){
                  JobModel.getCompany(req.body.page,req.body.limit,req.body.searchKey.primary_last_name, function(err, job) {

                    if (err) {
            
                      res.sendStatus(500);
            
                    }else{
                      res.json(job);
                    }
                });
              }else{
                res.json(job);
              }
            }
              });    

            }
          else if(req.body.searchKey.vehicle_insurance_company != undefined && req.body.searchKey.hasOwnProperty("vehicle_insurance_company")){

              JobModel.getVehicleCompany(req.body.page,req.body.limit,req.body.searchKey.vehicle_insurance_company, function(err, job) {

                if (err) {
        
                  res.sendStatus(500);
        
                } else {
                  res.json(job);
                }
              });   
             

            }
  },
        




     getAllJobs : function(req, res, next) {
      JobModel.getAll(req.body.page,req.body.limit, function(err, aggrResp) {
        
 if (err) {
      res.sendStatus(500);
 } else {
      var jobs = aggrResp
         if (jobs && jobs.length) {
        jobs = jobs.sort(function(a, b) {
          if (a.created_at > b.created_at) return -1;
          if (a.created_at < b.created_at) return 1;
          return 0;
        });
      }

      JobModel.getAllRec( function(err, count) {

        if (err) {
          res.sendStatus(500);

        }else{
var lengthCount =count;
          res.json({
             lengthCount : lengthCount,
            totalPages: Math.ceil(count / req.body.limit),
            jobs: aggrResp || []
          });

        } 
      });
    }
  });
   },
   getSearchRec: function(req, res, next) {
      JobModel.getAllForSearch(function(err, job) {

        if (err) {

          res.sendStatus(500);

        } else {
          var jobs = job
        
       var collectRes=[];
       var myJSON = JSON.stringify(job);
       var as = JSON.parse(myJSON);
for(var j =0; j<as.length; j++ ){
  if(as[j].dealer_id != undefined){
    if(as[j].dealer_id.name != undefined){
      if(as[j].dealer_id.name.toUpperCase().startsWith(req.body.searchKey.name) || 
      as[j].dealer_id.name.toLowerCase().startsWith(req.body.searchKey.name) ||
      as[j].dealer_id.name.startsWith(req.body.searchKey.name)
       ) {collectRes.push(as[j]);
      
          }
    }
    
  }
  
}
res.send( collectRes) 
      
        }
      });   

    
        

       },
   getAllArchive : function(req, res, next) {
    JobModel.getAllArchive(req.body.page,req.body.limit, function(err, aggrResp) {
      
if (err) {
    res.sendStatus(500);
} else {
    var jobs = aggrResp
       if (jobs && jobs.length) {
      jobs = jobs.sort(function(a, b) {
        if (a.created_at > b.created_at) return -1;
        if (a.created_at < b.created_at) return 1;
        return 0;
      });
    }

    JobModel.getAllArchiveRec( function(err, count) {

      if (err) {
        res.sendStatus(500);

      }else{
var lengthCount =count;
        res.json({
           lengthCount : lengthCount,
          totalPages: Math.ceil(count / req.body.limit),
          jobs: aggrResp || []
        });

      } 
    });
  }
});
 },
// getAllJobs : function(req, res, next) {
//     JobModel.getAll(req.body, function (err, res) => {
//       const { page = 1, limit = 10 } = req.query;
//      try {
//       const posts = await Posts.find()
    
//           .limit(limit * 1)
    
//           .skip((page - 1) * limit)
    
//           .exec();
    
//      const count = await Posts.countDocuments();
//       res.json({
    
//           posts,
    
//           totalPages: Math.ceil(count / limit),
    
//           currentPage: page
    
//         });
    
//       } catch (err) {
    
//         console.error(err.message);
    
//       }
    
//     });
//   },
    create: function(req, res, next) {
      JobModel.save(req.body, function(err, job) {

        if (err || !job || !job._id) {

          res.sendStatus(500);

        } else {
          res.json(job);
        }
      });

    },

    read: function(req, res, next) {

      JobModel.get(req.params.id, function(err, job) {

        if (err || !job || !job._id) {

          res.sendStatus(500);

        } else {
          res.json(job);
        }
      });
    },

    update: function(req, res, next) {

      JobModel.get(req.params.id, function(err, job) {

        if (err || !job || !job._id) {

          res.sendStatus(500);

        } else {

          if (req.body.note && req.body.note.length) {

            job.notes_collection.push({
              note: req.body.note,
              created_by: req.body.created_by,
              created_on: (new Date()).toLocaleDateString(),
              sheet_note: req.body.sheet_note
            });
          }

          req.body.note = "";
          req.body.notes_collection = job.notes_collection;

          JobModel.update(req.params.id, req.body, function(err, job) {

            if (err || !job || !job._id) {
              res.sendStatus(500);

            } else {
              res.json(job);
            }
          });
        }
      });
    },

    delete: function(req, res, next) {

      JobModel.update(req.params.id, { deleted: true }, function(err, resp) {

        if (err) {

          res.sendStatus(500);

        } else {
          res.json({ success: true });
        }
      });
    },

    getSheet: function(req, res, next) {

      fs.removeSync(pdfDirectory + '/sheets');
      fs.mkdirsSync(pdfDirectory + '/sheets');
      fs.removeSync(rootDirectory + '/temp*');

      var jobIds = req.params.job_ids.split("__"),
        sheetName = req.params.sheet_name;

      if (sheetName === "RAHWAY") {
        jobIds = [jobIds[0]];
      }

      jobIds.forEach(function(id) {
        JobModel.update(id, {
          sheet_name: sheetName,
          date_sent: (new Date()).toLocaleDateString('en-us'),
          status: "SENT TO DMV"
        }, function() {});
      });

      JobModel.getJobs(jobIds, function(err, jobs) {

        if (jobs && jobs.length) {

          jobs = jobs.map(function(job) {
            customConcat("primary_full_name", job, ["primary_first_name", "primary_middle_name", "primary_last_name"], false);
            return job;
          });

          PdfController.createSheet(jobs, sheetName, function(status, data) {

            if (status) {
              res.json({ success: true, data: data });
            } else {
              res.sendStatus(500);
            }
          });

        } else {
          res.sendStatus(500);
        }
      });
    },

    getForms: function(req, res, next) {

      var key, temp;

      JobModel.get(req.params.job_id, function(err, job) {
        console.log(err, job);
        job = job.toObject();

        if (err || !job || !job._id) {
          res.sendStatus(500);

        } else {

          ["dealer", "lien", "lessor"].forEach(function(item) {
            if (job[item + "_id"]) {
              for (key in job[item + "_id"]) {
                if (key !== "_id") {
                  job[item + "_" + key] = job[item + "_id"][key];
                }
              }
            }
          });

          job.lien_name = (job.lien_name || "NONE");

          job.lienholder_license_num_corp_code = (job.lien_name && job.lien_name !== "NONE") ? job.lien_corp_code : job.primary_license_number;

          customConcat("lien_address", job, ["lien_address1", "lien_address2"], true);
          customConcat("primary_full_name", job, ["primary_first_name", "primary_middle_name", "primary_last_name"], false);
          customConcat("primary_address", job, ["primary_address1", "primary_address2"], false);

          customConcat("primary_city_state_zip", job, ["primary_city", "primary_state", "primary_zip"], true);

          customConcat("dealer_full_address", job, ["dealer_address1", "dealer_address2", "dealer_city", "dealer_state", "dealer_zip"], false);
          customConcat("coowner_first_name", job, ["coowner_first_name"], false);
          customConcat("coowner_middle_name", job, [ "coowner_middle_name"], false);
          customConcat("coowner_last_name", job, ["coowner_last_name"], false);
          customConcat("coowner_name", job, ["coowner_first_name", "coowner_middle_name", "coowner_last_name"], false);

          customConcat("owner_mailing_address", job, ["primary_mailing_address1", "primary_mailing_address2", "primary_mailing_city", "primary_mailing_state", "primary_mailing_zip"], false);
          customConcat("coowner_address", job, ["coowner_address1", "coowner_address2"], false);
          customConcat("coowner_city_state_zip", job, ["coowner_city", "coowner_state", "coowner_zip"], true);

          customConcat("lienholder_name_address", job, ["lien_name", "lien_aaddress1", "lien_address2", "lien_city", "lien_state", "lien_state"], false);

          customConcat("lienholder_address", job, ["lien_aaddress1", "lien_address2"], false);

          job.lien_yes = (job.lienholder_name_address.trim() !== "NONE");
          job.lien_no = !job.lien_yes;

          if (job.vehicle_odometer && job.vehicle_odometer.length > 0) {

            temp = job.vehicle_odometer.split(".");

            if (temp[1]) {
              job.odometer_6 = temp[1].charAt(0);
            }

            if (temp[0] && temp[0].length) {
              //job.odometer_6 = temp[1].charAt(0);
              job.odometer_5 = temp[0].charAt(temp[0].length - 1);
              job.odometer_4 = temp[0].charAt(temp[0].length - 2);
              job.odometer_3 = temp[0].charAt(temp[0].length - 3);
              job.odometer_2 = temp[0].charAt(temp[0].length - 4);
              job.odometer_1 = temp[0].charAt(temp[0].length - 5);
              job.odometer_0 = temp[0].charAt(temp[0].length - 6);
            }
          }

          if (job.primary_ssn_number && job.primary_ssn_number.length > 0) {
            temp = job.primary_ssn_number.replace(/-/g, "");
            job.owner_ssn_1 = temp.slice(0, 3);
            job.owner_ssn_2 = temp.slice(3, 5);
            job.owner_ssn_3 = temp.slice(5, 9);
          }

          if (job.coowner_ssn_number && job.coowner_ssn_number.length > 0) {
            temp = job.coowner_ssn_number.replace(/-/g, "");
            job.coowner_ssn_1 = temp.slice(0, 3);
            job.coowner_ssn_2 = temp.slice(3, 5);
            job.coowner_ssn_3 = temp.slice(5, 9);
          }

          job.epa_over40_price_over45k_yes = Boolean(!isNaN(parseInt(job.epa_average, 10)) && parseInt(job.epa_average, 10) > 40 && !isNaN(parseInt(job.vehicle_purchase_price, 10)) && parseInt(job.vehicle_purchase_price, 10) > 45000);
          job.epa_over40_price_over45k_no = !job.epa_over40_price_over45k_yes;

          job.zero_emission_yes = Boolean(job.epa_zero_emissions);
          job.zero_emission_no = !job.epa_zero_emissions;

          job.commercial_yes = job.comm;
          job.commercial_no = !job.comm;

          job.add_lien_yes = job.add_lien;
          job.add_lien_no = !job.add_lien;

          job.remove_lien_yes = job.remove_lien;
          job.reemove_lien_no = !job.remove_lien;

          job.rental_use_yes = job.rental;
          job.rental_use_no = !job.rental_use_yes;

          job.reg_outside_nj_yes = job.vehicle_reg_state && job.vehicle_reg_state.length && job.vehicle_reg_state.toLowerCase() === "nj";
          job.reg_outside_nj_no = !job.reg_outside_nj_yes;

          job.epa_under40_price_over45k_yes = (!isNaN(parseInt(job.epa_average, 10)) && parseInt(job.epa_average, 10) < 40 && !isNaN(parseInt(job.vehicle_purchase_price, 10)) && parseInt(job.vehicle_purchase_price, 10) > 45000);
          job.epa_under40_price_over45k_no = !job.epa_under40_price_over45k_yes;

          job.epa_under19_price_under45k_yes = (!isNaN(parseInt(job.epa_average, 10)) && parseInt(job.epa_average, 10) < 19 && !isNaN(parseInt(job.vehicle_purchase_price, 10)) && parseInt(job.vehicle_purchase_price, 10) < 45000);
          job.epa_under19_price_under45k_no = !job.epa_under19_price_under45k_yes;

          customConcat("owner_license_num_corp_code", job, ["primary_license_number", "primary_corp_code"], false);
          customConcat("owner_license_number", job, ["primary_license_number", "primary_corp_code"], false);

          if (job.coowner_dob && job.coowner_dob.length > 0) {
            temp = job.coowner_dob.split("T")[0].split("-");
            job.coowner_dob_month = temp[0];
            job.coowner_dob_day = temp[1];
            job.coowner_dob_year = temp[2];
          }
          job.coowner_sex_female = (job.coowner_sex === "female");
          job.coowner_sex_male = (job.coowner_sex === "male");

          if (job.lease_or_buy === "buy") {

            ["primary_full_name", "primary_address", "primary_city", "primary_state", "primary_zip", "primary_license_number", "primary_eye_color"].forEach(function(field) {
              job["ba49_" + field] = job[field];
            });

            ["owner_ssn_1", "owner_ssn_2", "owner_ssn_3", "owner_dob_month", "owner_dob_year", "owner_dob_day", "owner_sex_male", "owner_sex_female"].forEach(function(item) {
              job["ba49_" + item] = job[item];
            });

            if (job.is_lessee_company) {

              job.ba49_primary_full_name = job.primary_company;
              job.owner_sex_female = job.owner_sex_male =
                job.coowner_sex_female = job.coowner_sex_male = false;
              job.owner_birth_date = job.owner_eye_color = job.owner_sex = "";
              job.ba49_owner_license_number = job.primary_corp_code;

            } else {

              job.ba49_primary_full_name = job.primary_full_name;

              job.owner_sex_male = (job.primary_sex === "male");
              job.owner_sex_female = (job.primary_sex === "female");
              job.ba49_owner_sex_male = job.owner_sex_male;
              job.ba49_owner_sex_female = job.owner_sex_female;

              if (job.primary_dob && job.primary_dob.length > 0) {
                temp = job.primary_dob.split("T")[0].split("-");
                job.ba49_owner_dob_month = job.owner_dob_month = temp[0];
                job.ba49_owner_dob_day = job.owner_dob_day = temp[1];
                job.ba49_owner_dob_year = job.owner_dob_year = temp[2];
              }
              job.ba49_owner_license_number = job.primary_license_number;
            }

            job.ba49_owner_city_state_zip = job.primary_city_state_zip;
            job.ba49_owner_street_address = job.primary_address;

          } else {

            job.ba49_primary_full_name = job.lessor_name;
            job.ba49_leasee_full_name = (job.primary_full_name && job.primary_full_name.length) ? job.primary_full_name : job.primary_company;
            job.owner_full_name = (job.primary_full_name && job.primary_full_name.length) ? job.primary_full_name : job.primary_company;


            customConcat("ba49_owner_street_address", job, ["lessor_address1", "lessor_address2"], false);
            job.ba49_leasee_street_address = job.primary_address;

            job.ba49_primary_license_number = job.lessor_corp_code;
            job.ba49_leasee_license_number = (job.primary_license_number && job.primary_license_number.length) ? job.primary_license_number : job.primary_corp_code;

            ["city", "state", "zip"].forEach(function(field) {
              job["ba49_primary_" + field] = job["lessor_" + field];
            });

            customConcat("ba49_owner_city_state_zip", job, ["lessor_city", "lessor_state", "lessor_zip"], false);

            ["city", "state", "zip", "eye_color"].forEach(function(field) {
              job["ba49_leasee_" + field] = job["primary_" + field];
            });

            ["ssn_1", "ssn_2", "ssn_3"].forEach(function(item) {
              job["ba49_leasee_" + item] = job["owner_" + item];
            });

            if (job.primary_dob && job.primary_dob.length > 0) {
              temp = job.primary_dob.split("T")[0].split("-");
              job.ba49_leasee_dob_month = temp[0];
              job.ba49_leasee_dob_day = temp[1];
              job.ba49_leasee_dob_year = temp[2];
            }

            job.ba49_leasee_sex_male = (job.primary_sex === "male");
            job.ba49_leasee_sex_female = (job.primary_sex === "female");

            job.owner_birth_date = job.owner_eye_color = job.owner_sex = "";
            job.primary_dob = job.primary_eye_color = job.primary_sex = "";
          }

          PdfController.createForms(job, function(success) {
            console.log(success);
            fs.removeSync(rootDirectory + '/temp*');
            if (!success) {
              res.sendStatus(500);
            } else {
              res.json({ success: true });
            }
          });
        }
      });
    }
  };
  module.exports = JobController;
})();