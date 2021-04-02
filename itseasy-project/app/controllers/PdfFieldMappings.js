!(function() {

  'use strict'

  // PDF fields on the right.

  var PdfFieldMappings = {
    "primary_full_name": "owner_full_name",
    "primary_city": "owner_city",
    "primary_state": "owner_state",
    "primary_zip": "owner_zip",

    "ba49_primary_full_name": "ba49_owner_full_name",
    "ba49_primary_city": "ba49_owner_city",
    "ba49_primary_state": "ba49_owner_state",
    "ba49_primary_zip": "ba49_owner_zip",
    "ba49_primary_address": "ba49_owner_street_address",

    "primary_license_number": "owner_license_number",
    "ba49_primary_license_number": "ba49_owner_license_number",

    "primary_dob": "owner_birth_date",
    "primary_eye_color": "owner_eye_color",
    "ba49_primary_eye_color": "ba49_owner_eye_color",

    "primary_sex": "owner_sex",
    "primary_address": "owner_street_address",
    "primary_city_state_zip": "owner_city_state_zip",
    "primary_state": "owner_state",
    "primary_city": "owner_city",
    "primary_zip": "owner_zip",

    "vehicle_make": "make",
    "vehicle_model": "model",
    "vehicle_year": "year",
    "vehicle_color": "color",
    "vehicle_axles": "axles",
    "vehicle_body_style": "body_type",
    "vehicle_vin": "vin",
    "vehicle_purchase_price": "purchase_price",
    "vehicle_odometer": "odometer",
    "vehicle_plate": "plate",

    "dealer_name": "dealer_name",
    "epa_average": "avg_epa_miles",
    "dealer_dmv_id": "dealer_id_number",
    "epa_over40_price_over45k_yes": "epa_over40_price_over45k_yes",
    "epa_over40_price_over45k_no": "epa_over40_price_over45k_no",
    "zero_emission_yes": "zero_emission_yes",
    "zero_emission_no": "zero_emission_no",
    "commercial_yes": "commercial_yes",
    "commercial_no": "commercial_no",


    "owner_license_num_corp_code": "owner_license_num_corp_code",
    "lienholder_license_num_corp_code": "lien_corp_code",

    // TODO: ?
    //"owner_phone_home":"owner_phone_home",
    //"owner_phone_cell":"owner_phone_home",
    //"owner_phone_work":"owner_phone_home",
    //"reg_suspended_yes": "reg_suspended_yes",
    //"reg_suspended_no": "reg_suspended_yes",

    "lienholder_name_address": "lienholder_name_address",

    "vehicle_insurance_company": "insurance_company_name",
    "vehicle_insurance_policy_number": "vehicle_insurance_policy_number",
    "primary_tax_id_number": "fed_tax_id",


    "vehicle_lease_sign_date": "lease_sign_date",
    "vehicle_lease_terms": "lease_terms",
    "vehicle_lease_cancellation": "lease_cancellation",
    "vehicle_lease_cancel_date": "lease_cancel_date",

    "rental_use_yes": "rental_use_yes",
    "rental_use_no": "rental_use_no",

    //TODO: "code_change": "",
    //"increase_in_weight": "",

    "lienholder_name_address": "lienholder_name_address",
    "lien_name": "corporation_name",
    "lien_corp_code": "corporation_code",
    "lien_address": "corporation_address",
    "lien_city": "corporation_city",
    "lien_state": "corporation_state",
    "lien_zip": "corporation_zip",
    "vehicle_insurance_company": "insurance_company_name",
    "primary_violation": "primary_violation",
    "vehicle_insurance_policy_number": "insurance_policy_number",

  };

  module.exports = PdfFieldMappings;

})();