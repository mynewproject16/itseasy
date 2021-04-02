!(function() {

  'use strict'

  const path = require('path');
  var pdfFiller = require("pdffiller"),
    mappings = require("./PdfFieldMappings"),
    pdfDirectory = path.join(__dirname, '../..', 'pdfs/'),

    formNames = [
      "Application-Certificate-Ownership-New-Vehicle",
      "Application-Duplicate-Certificate",
      "BA-49-Front",
      "BA-49-Back",
      "Certificate-of-Ownership",
      "Financing-Statement",
      "Vehicle-Correction",
      "Universal"
    ];

  var PdfController = {

    createForms: function(data, cb) {

      var key, pdfFields = JSON.parse(JSON.stringify(data)),
        count = 0;

      for (key in pdfFields) {

        if (typeof(pdfFields[key]) === "string") {
          pdfFields[key] = pdfFields[key].toUpperCase();
        }

        if (typeof(pdfFields[key]) === "boolean") {
          pdfFields[key] = (pdfFields[key]) ? "Yes" : "No";
        } else if (pdfFields[key] && mappings[key]) {
          pdfFields[mappings[key]] = (pdfFields[key] || "");
        }
      }

      try {


        formNames.forEach(function(formName) {
          pdfFiller.fillForm(pdfDirectory + "originals/" + formName + ".pdf", pdfDirectory + formName + "-" + data._id + ".pdf", pdfFields, function(err) {

            if (err) {
              cb(false);
              //return;
            }

            if (count >= (formNames.length - 1)) {
              cb(true);
            }

            count = count + 1;
          });
        });
      } catch (ex) {
        console.log(" Error " + JSON.stringify(arguments));
      }
    },

    createSheet: function(jobs, sheetName, cb) {

      var timeStamp = (new Date()).getTime(),
        pdfFields = {},
        jobsLength = jobs.length,
        sheetNote, originalSheetName;

      if (jobsLength <= 5) {
        originalSheetName = "Sheet0.pdf";
      
      } else if (jobsLength <= 10) {
        originalSheetName = "Sheet1.pdf";

      } else if (jobsLength <= 15) {
        originalSheetName = "Sheet2.pdf";

      } else if (jobsLength <= 20) {
        originalSheetName = "Sheet3.pdf";

      } else if (jobsLength <= 25) {
        originalSheetName = "Sheet4.pdf";

      } else if (jobsLength <= 30) {
        originalSheetName = "Sheet5.pdf";

      } else if (jobsLength <= 35) {
        originalSheetName = "Sheet6.pdf";

      } else if (jobsLength <= 40) {
        originalSheetName = "Sheet7.pdf";
      }

      for (var i = 0; i < jobsLength; i++) {

        if (jobs[i]) {

          pdfFields["name" + i] = ((jobs[i].primary_full_name) || "").toUpperCase();
          pdfFields["status" + i] = ((jobs[i].trans_type) || "").toUpperCase();
          pdfFields["vin" + i] = ((jobs[i].vehicle_vin) || "").toUpperCase();
          pdfFields["dealer" + i] = ((jobs[i].dealer_id && jobs[i].dealer_id.name) || "").toUpperCase();
          pdfFields["lessor" + i] = ((jobs[i].lessor_id && jobs[i].lessor_id.name) || "").toUpperCase();
          pdfFields["note" + i] = "";

          if (jobs[i].notes_collection && jobs[i].notes_collection.length) {

            sheetNote = jobs[i].notes_collection.filter(function(item) {
              return item.sheet_note;
            })[0];

            if (sheetNote) {
              pdfFields["note" + i] = sheetNote.note || ""
            }
          }
        }
      }

      pdfFields.sheet_name = sheetName;

      pdfFiller.fillForm(pdfDirectory + "originals/" + originalSheetName, pdfDirectory + "sheets/Sheet-" + timeStamp + ".pdf", pdfFields, function(err) {

        if (err) {
          cb(false);
        } else {
          cb(true, { created_sheet_file_name: "Sheet-" + timeStamp + ".pdf" });
        }
      });
    }
  };

  module.exports = PdfController;

})();