/**
 * DS-160 AutoFill content script.
 *
 * Selector pattern (stable ASP.NET WebForms IDs since ~2017):
 *   ctl00_SiteContentPlaceHolder_FormView1_<typePrefix><FIELDNAME>
 * Type prefixes: tbx (text input), ddl (select), rbl (radio group), composite (date)
 * Exception: Sign & Certify page uses FormView3.
 *
 * NOTE: Composite date month option values must be verified against a live
 * DS-160 session — "JAN"/"January"/"01" may vary. Update MONTH_VALUE if needed.
 */

const PREFIX = "ctl00_SiteContentPlaceHolder_FormView1_";
const PREFIX3 = "ctl00_SiteContentPlaceHolder_FormView3_"; // Sign & Certify

// Month name → option value mapping (verify against live DS-160 session)
const MONTH_VALUE = {
  "JAN": "Jan", "FEB": "Feb", "MAR": "Mar", "APR": "Apr",
  "MAY": "May", "JUN": "Jun", "JUL": "Jul", "AUG": "Aug",
  "SEP": "Sep", "OCT": "Oct", "NOV": "Nov", "DEC": "Dec",
};

function dispatch(el) {
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function fillText(id, value) {
  const el = document.getElementById(id);
  if (!el || !value) return false;
  el.value = value;
  dispatch(el);
  return true;
}

function fillSelect(id, value) {
  const el = document.getElementById(id);
  if (!el || !value) return false;
  const options = Array.from(el.options);
  const opt = options.find(
    (o) => o.value.toUpperCase() === value.toUpperCase() ||
           o.text.toUpperCase() === value.toUpperCase()
  );
  if (!opt) return false;
  el.value = opt.value;
  dispatch(el);
  return true;
}

function fillRadio(name, value) {
  const radios = document.querySelectorAll(`input[type="radio"][id^="${name}"]`);
  if (!radios.length) return false;
  for (const r of radios) {
    if (r.value.toUpperCase() === value.toUpperCase() ||
        r.labels?.[0]?.textContent?.trim().toUpperCase() === value.toUpperCase()) {
      r.checked = true;
      dispatch(r);
      return true;
    }
  }
  return false;
}

// Parse DD-MMM-YYYY into { day, month, year }
function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [day, mon, year] = parts;
  return { day: day.replace(/^0/, ""), month: MONTH_VALUE[mon.toUpperCase()] ?? mon, year };
}

function fillCompositeDate(baseId, dateStr) {
  const d = parseDate(dateStr);
  if (!d) return;
  fillSelect(baseId + "_Month", d.month);
  fillSelect(baseId + "_Day", d.day);
  fillText(baseId + "_Year", d.year);
}

// Page-to-fill mappings keyed by the ?node= value in the URL
const PAGE_FILLERS = {
  Personal1: (data) => {
    fillText(PREFIX + "tbxFamilyName", data.surname?.value);
    fillText(PREFIX + "tbxGivenName", data.given_name?.value);
    fillText(PREFIX + "tbxFullNameNative", data.full_name_native?.value);
    fillRadio(PREFIX + "rblOtherNames", data.has_other_names?.value ?? "N");
    fillText(PREFIX + "tbxOtherFamilyName", data.other_surname?.value);
    fillText(PREFIX + "tbxOtherGivenName", data.other_given_name?.value);
    fillRadio(PREFIX + "rblSex", data.gender?.value);
    fillSelect(PREFIX + "ddlMaritalStatus", data.marital_status?.value);
    fillCompositeDate(PREFIX + "compositeDOB", data.dob?.value);
    fillText(PREFIX + "tbxPOBCity", data.pob_city?.value);
    fillText(PREFIX + "tbxPOBState", data.pob_state_province?.value);
    fillSelect(PREFIX + "ddlPOBCountry", data.pob_country?.value);
  },

  Personal2: (data) => {
    fillSelect(PREFIX + "ddlCountryOfCitizenship", data.nationality?.value);
    fillRadio(PREFIX + "rblOtherCitizenship", data.has_other_nationality?.value ?? "N");
    fillSelect(PREFIX + "ddlOtherCountryOfCitizenship", data.other_nationality?.value);
    fillText(PREFIX + "tbxNationalID", data.national_id?.value);
    fillText(PREFIX + "tbxSSN", data.us_ssn?.value);
  },

  AddressPhone: (data) => {
    fillText(PREFIX + "tbxHomeAddressLine1", data.home_address_line1?.value);
    fillText(PREFIX + "tbxHomeAddressCity", data.home_address_city?.value);
    fillText(PREFIX + "tbxHomeAddressStateProvince", data.home_address_state?.value);
    fillText(PREFIX + "tbxHomeAddressPostalZip", data.home_address_postal_code?.value);
    fillSelect(PREFIX + "ddlHomeAddressCountry", data.home_address_country?.value);
    fillText(PREFIX + "tbxPhoneNumber", data.primary_phone?.value);
    fillText(PREFIX + "tbxEmailAddress", data.email_address?.value);
  },

  Travel: (data) => {
    fillSelect(PREFIX + "ddlPurposeOfTrip", data.travel_purpose?.value);
    fillCompositeDate(PREFIX + "dtpIntendedDateOfArrival", data.intended_arrival_date?.value);
    fillText(PREFIX + "tbxIntendedLengthOfStay", data.intended_length_of_stay?.value);
    fillRadio(PREFIX + "rblTravelingWithOthers", data.traveling_with_others?.value ?? "N");
  },

  PptVisa: (data) => {
    fillSelect(PREFIX + "ddlTypeOfPassport", data.passport_type?.value);
    fillText(PREFIX + "tbxPassportNumber", data.passport_number?.value);
    fillText(PREFIX + "tbxPassportBookNumber", data.passport_book_number?.value);
    fillSelect(PREFIX + "ddlCountryPassportIssued", data.passport_issued_country?.value);
    fillText(PREFIX + "tbxCityPassportIssued", data.passport_issued_city?.value);
    fillCompositeDate(PREFIX + "dtpPassportIssueDate", data.passport_issue_date?.value);
    fillCompositeDate(PREFIX + "dtpPassportExpirationDate", data.passport_expiry_date?.value);
  },

  PreviousUSTravel: (data) => {
    fillRadio(PREFIX + "rblPreviouslyIssuedVisa", data.previously_issued_visa?.value ?? "N");
    // Conditional fields appear after UpdatePanel refresh — delay fill
    if (data.previously_issued_visa?.value === "Y") {
      setTimeout(() => {
        fillText(PREFIX + "tbxVisaNumber", data.prev_visa_number?.value);
        fillCompositeDate(PREFIX + "dtpVisaIssueDate", data.prev_visa_issue_date?.value);
        fillCompositeDate(PREFIX + "dtpVisaExpirationDate", data.prev_visa_expiry_date?.value);
        fillSelect(PREFIX + "ddlVisaClass", data.prev_visa_type?.value);
        fillRadio(PREFIX + "rblVisaLost", data.prev_visa_lost?.value ?? "N");
        fillRadio(PREFIX + "rblVisaCancelled", data.prev_visa_cancelled?.value ?? "N");
      }, 800);
    }
  },

  WorkEducation1: (data) => {
    fillText(PREFIX + "tbxPresentEmployer", data.employer_name?.value);
    fillText(PREFIX + "tbxEmployerAddress", data.employer_address_line1?.value);
    fillText(PREFIX + "tbxEmployerCity", data.employer_city?.value);
    fillText(PREFIX + "tbxEmployerState", data.employer_state?.value);
    fillText(PREFIX + "tbxEmployerZip", data.employer_postal_code?.value);
    fillText(PREFIX + "tbxEmployerPhone", data.employer_phone?.value);
    fillText(PREFIX + "tbxJobTitle", data.job_title?.value);
    fillText(PREFIX + "tbxSupervisorFamilyName", data.supervisor_name?.value);
  },
};

function getPageNode() {
  const url = new URL(location.href);
  return url.searchParams.get("node") ?? "";
}

function showBanner(missingCount) {
  if (missingCount === 0) return;
  const div = document.createElement("div");
  div.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:99999;background:#fef9c3;" +
    "color:#854d0e;padding:10px 16px;font-size:13px;font-family:sans-serif;" +
    "border-bottom:2px solid #fde68a;";
  div.textContent =
    `ajjaAI: ${missingCount} expected selector(s) not found on this page — ` +
    "the DS-160 site may have changed. Check field mappings in content.js.";
  document.body.prepend(div);
}

function run(data) {
  const node = getPageNode();
  const filler = PAGE_FILLERS[node];
  if (!filler) return; // page not in our mapping — silently skip

  // Count how many selectors we expect vs. found
  const beforeCount = document.querySelectorAll("[id^='ctl00_SiteContentPlaceHolder']").length;
  filler(data);
  if (beforeCount === 0) {
    showBanner(1); // no form elements at all — likely a site change
  }
}

chrome.storage.local.get("ds160Data", (result) => {
  if (!result.ds160Data) return;
  run(result.ds160Data);
});
