var Converter = require("csvtojson").Converter;
var fs = require("fs");
var csvFileName = "./jobs.csv";
var csvConverter = new Converter();
var buffer = "";
var mapping;
csvConverter.on("end_parsed", function(jobs) {

  jobs.length = 1;

  jobs.forEach(function(job) {

    job.lease_or_buy = job.Lease_Or_Buy.toLowerCase();
    job.hold = (job.HOLD !== "False");
    job.vehicle_status = (job.New_Vech_YES === "X" ? "new": "used");

    [
      "ITSEASY_TAX_CHECKNUM", "ITSEASY_TAX_CHECKAMT", "ITSEASY_DMV_FEE_CHECKNUM", "ITSEASY_DMV_FEE_CHECKAMT",
      "DEALER_DMV_CHECKNUM", "DEALER_DMV_CHECKAMT", "DEALER_TAX_CHECKNUM", "DEALER_TAX_CHECKAMT", "DEALER_ITSEASYFEE_CHECKNUM",
      "DEALER_ITSEASYFEE_CHECKAMT", "DEALER_STATEMENT_CHECKNUM", "STATEMENT_ID", "ITSEASYFEEDESCRIPT", "ITSEASY_FEE",
      "DMVFEEDESCRIPT", "DMV_FEE", "DMV_TAX_AMT", "TOTAL_AMT", "TOTAL_AMT_REC", "TOTAL_AMT_OUT", "BALANCE_DUE", "PAID",
      "PRINTED", "TAXCHECKNUM", "TAXCHECKAMT", "Rental_Vehicle_YES", "Rental_Vehicle_NO", "FedexNumber", "UPS_acnt_eNumber",
      "FEDexPrefered", "UPS_Prefered", "ship_UPS", "ship_fedex", "Package_shipped", "Tracking_Number", "Package_ship_date",
      "ShipTo", "ShipToAtt", "ShipToAddress", "ShipToAddress1", "ShipToCity", "ShipToState", "ShipTozipcode", "SHIPTOALT",
      "shipinfo_ship_UPS", "shipinfo_ship_fedex", "shipinfo_Package_shipped", "shipinfo_Tracking_Number",
      "shipinfo_Package_ship_date", "shipinfo_ShipTo", "shipinfo_ShipToAtt", "shipinfo_ShipToAddress", "shipinfo_ShipToAddress1",
      "shipinfo_ShipToCity", "shipinfo_ShipToState", "shipinfo_ShipTozipcode", "shipinfo_phone_number", "shipinfo_UPS_acnt_Number",
      "shipinfo_fedex_acnt_Number", "shipinfo_BILL_third_party", "shipinfo_BILL_third_party_box", "shipinfo_BILL_Recipiant",
      "shipinfo_BILL_Recipiant_box", "shipinfo_BILL_sender", "shipinfo_BILL_sender_box", "OUT_OF_STATE_NOTE",
      "OUT_OF_STATE_Pay_IN_FULL_NOTE", "SHEET_ID", "SHEET", "SHEET_note", "JOB", "DEALER_STATEMENT_CHECKAMT", "New_Vech_YES",
      "New_Vech_No", "Used_Vech_YES", "Used_Vech_No", "TRANSTYPE_CODE_CHANGE_YES", "Lease_Or_Buy", "Lease_YES", "Lease_NO",

    ].forEach(function(item) {
      delete job[item];
    });

    console.log(" >> " + JSON.stringify(job));


  });


});

fs.createReadStream(csvFileName).pipe(csvConverter);

mapping = {

};