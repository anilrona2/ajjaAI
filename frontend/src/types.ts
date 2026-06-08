export type Source = "passport" | "visa_stamp" | "i797" | null;

export interface FieldValue {
  value: string | null;
  found: boolean;
  source: Source;
}

export interface DS160Fields {
  // Personal Info 1
  surname: FieldValue;
  given_name: FieldValue;
  full_name_native: FieldValue;
  has_other_names: FieldValue;
  other_surname: FieldValue;
  other_given_name: FieldValue;
  gender: FieldValue;
  marital_status: FieldValue;
  dob: FieldValue;
  pob_city: FieldValue;
  pob_state_province: FieldValue;
  pob_country: FieldValue;
  // Personal Info 2
  nationality: FieldValue;
  has_other_nationality: FieldValue;
  other_nationality: FieldValue;
  national_id: FieldValue;
  us_ssn: FieldValue;
  // Address & Phone
  home_address_line1: FieldValue;
  home_address_city: FieldValue;
  home_address_state: FieldValue;
  home_address_postal_code: FieldValue;
  home_address_country: FieldValue;
  primary_phone: FieldValue;
  email_address: FieldValue;
  // Travel
  travel_purpose: FieldValue;
  intended_arrival_date: FieldValue;
  intended_length_of_stay: FieldValue;
  traveling_with_others: FieldValue;
  // Passport
  passport_type: FieldValue;
  passport_number: FieldValue;
  passport_book_number: FieldValue;
  passport_issued_country: FieldValue;
  passport_issued_city: FieldValue;
  passport_issue_date: FieldValue;
  passport_expiry_date: FieldValue;
  // Previous US Visa
  previously_issued_visa: FieldValue;
  prev_visa_number: FieldValue;
  prev_visa_issue_date: FieldValue;
  prev_visa_expiry_date: FieldValue;
  prev_visa_type: FieldValue;
  prev_visa_lost: FieldValue;
  prev_visa_cancelled: FieldValue;
  // Work/Education
  employer_name: FieldValue;
  employer_address_line1: FieldValue;
  employer_city: FieldValue;
  employer_state: FieldValue;
  employer_postal_code: FieldValue;
  employer_phone: FieldValue;
  job_title: FieldValue;
  supervisor_name: FieldValue;
}

export interface FieldMeta {
  key: keyof DS160Fields;
  label: string;
  section: string;
  hint: string;
}

export const FIELD_META: FieldMeta[] = [
  // Personal Info 1
  { key: "surname", label: "Surname (Last Name)", section: "Personal Info 1", hint: "Passport — bio page, surname field" },
  { key: "given_name", label: "Given Name (First Name)", section: "Personal Info 1", hint: "Passport — bio page, given names field" },
  { key: "full_name_native", label: "Full Name in Native Alphabet", section: "Personal Info 1", hint: "Passport — may appear on inside cover pages" },
  { key: "has_other_names", label: "Has Other Names Used (Y/N)", section: "Personal Info 1", hint: "Enter Y or N" },
  { key: "other_surname", label: "Other Surname", section: "Personal Info 1", hint: "Any alias or maiden name" },
  { key: "other_given_name", label: "Other Given Name", section: "Personal Info 1", hint: "Any alias or nickname used officially" },
  { key: "gender", label: "Gender (M/F)", section: "Personal Info 1", hint: "Passport — bio page, sex field" },
  { key: "marital_status", label: "Marital Status", section: "Personal Info 1", hint: "S=Single, M=Married, W=Widowed, D=Divorced, P=Separated" },
  { key: "dob", label: "Date of Birth", section: "Personal Info 1", hint: "Passport — bio page, date of birth (DD-MMM-YYYY)" },
  { key: "pob_city", label: "City of Birth", section: "Personal Info 1", hint: "Passport — bio page, place of birth" },
  { key: "pob_state_province", label: "State/Province of Birth", section: "Personal Info 1", hint: "Passport — bio page, place of birth" },
  { key: "pob_country", label: "Country of Birth", section: "Personal Info 1", hint: "Passport — bio page, place of birth" },
  // Personal Info 2
  { key: "nationality", label: "Nationality", section: "Personal Info 2", hint: "Passport — bio page, nationality" },
  { key: "has_other_nationality", label: "Has Other Nationality (Y/N)", section: "Personal Info 2", hint: "Enter Y or N" },
  { key: "other_nationality", label: "Other Nationality", section: "Personal Info 2", hint: "If dual citizenship, second nationality" },
  { key: "national_id", label: "National ID Number", section: "Personal Info 2", hint: "National ID card number (if applicable)" },
  { key: "us_ssn", label: "US Social Security Number", section: "Personal Info 2", hint: "US SSN (if you have one)" },
  // Address & Phone
  { key: "home_address_line1", label: "Home Address Line 1", section: "Address & Phone", hint: "Current residence street address" },
  { key: "home_address_city", label: "Home City", section: "Address & Phone", hint: "Current residence city" },
  { key: "home_address_state", label: "Home State/Province", section: "Address & Phone", hint: "Current residence state" },
  { key: "home_address_postal_code", label: "Home Postal Code", section: "Address & Phone", hint: "Current residence ZIP/postal code" },
  { key: "home_address_country", label: "Home Country", section: "Address & Phone", hint: "Current residence country" },
  { key: "primary_phone", label: "Primary Phone Number", section: "Address & Phone", hint: "Your primary contact phone number" },
  { key: "email_address", label: "Email Address", section: "Address & Phone", hint: "Your primary email address" },
  // Travel
  { key: "travel_purpose", label: "Purpose of Trip", section: "Travel", hint: "e.g., TEMPORARY BUSINESS (H1B)" },
  { key: "intended_arrival_date", label: "Intended Arrival Date", section: "Travel", hint: "Planned US arrival date (DD-MMM-YYYY)" },
  { key: "intended_length_of_stay", label: "Intended Length of Stay", section: "Travel", hint: "e.g., 3 YEARS" },
  { key: "traveling_with_others", label: "Traveling with Others (Y/N)", section: "Travel", hint: "Enter Y or N" },
  // Passport
  { key: "passport_type", label: "Passport Type", section: "Passport", hint: "Passport — bio page, type field (R=Regular)" },
  { key: "passport_number", label: "Passport Number", section: "Passport", hint: "Passport — bio page, passport number" },
  { key: "passport_book_number", label: "Passport Book Number", section: "Passport", hint: "Passport — secondary number (if present)" },
  { key: "passport_issued_country", label: "Passport Issued Country", section: "Passport", hint: "Passport — bio page, country of issue" },
  { key: "passport_issued_city", label: "Passport Issued City", section: "Passport", hint: "Passport — bio page, place of issue" },
  { key: "passport_issue_date", label: "Passport Issue Date", section: "Passport", hint: "Passport — bio page, date of issue (DD-MMM-YYYY)" },
  { key: "passport_expiry_date", label: "Passport Expiry Date", section: "Passport", hint: "Passport — bio page, date of expiry (DD-MMM-YYYY)" },
  // Previous US Visa
  { key: "previously_issued_visa", label: "Previously Issued US Visa (Y/N)", section: "Previous US Visa", hint: "Visa stamp — enter Y if you have a prior US visa" },
  { key: "prev_visa_number", label: "Previous Visa Number", section: "Previous US Visa", hint: "Visa stamp — red foil number or visa number field" },
  { key: "prev_visa_issue_date", label: "Previous Visa Issue Date", section: "Previous US Visa", hint: "Visa stamp — issuance date (DD-MMM-YYYY)" },
  { key: "prev_visa_expiry_date", label: "Previous Visa Expiry Date", section: "Previous US Visa", hint: "Visa stamp — expiration date (DD-MMM-YYYY)" },
  { key: "prev_visa_type", label: "Previous Visa Type", section: "Previous US Visa", hint: "Visa stamp — visa classification (e.g., H-1B)" },
  { key: "prev_visa_lost", label: "Previous Visa Lost (Y/N)", section: "Previous US Visa", hint: "Was the prior visa ever lost?" },
  { key: "prev_visa_cancelled", label: "Previous Visa Cancelled (Y/N)", section: "Previous US Visa", hint: "Was the prior visa ever cancelled?" },
  // Work/Education
  { key: "employer_name", label: "Employer Name", section: "Work/Education", hint: "I-797 — employer/petitioner name" },
  { key: "employer_address_line1", label: "Employer Address", section: "Work/Education", hint: "I-797 — employer street address" },
  { key: "employer_city", label: "Employer City", section: "Work/Education", hint: "I-797 — employer city" },
  { key: "employer_state", label: "Employer State", section: "Work/Education", hint: "I-797 — employer state" },
  { key: "employer_postal_code", label: "Employer Postal Code", section: "Work/Education", hint: "I-797 — employer ZIP code" },
  { key: "employer_phone", label: "Employer Phone", section: "Work/Education", hint: "I-797 — employer phone number" },
  { key: "job_title", label: "Job Title / Occupation", section: "Work/Education", hint: "I-797 — job title or occupation" },
  { key: "supervisor_name", label: "Supervisor Name", section: "Work/Education", hint: "Your direct supervisor's name" },
];

export interface DocRecord {
  filename: string;
  uploadDate: string;
  fileType: string;
  totalFields: number;
  foundFields: number;
}
