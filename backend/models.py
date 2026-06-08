from __future__ import annotations
from typing import Literal
from pydantic import BaseModel


SourceType = Literal["passport", "visa_stamp", "i797"] | None


class FieldValue(BaseModel):
    value: str | None = None
    found: bool = False
    source: SourceType = None


class DS160Fields(BaseModel):
    # Personal Info 1
    surname: FieldValue = FieldValue()
    given_name: FieldValue = FieldValue()
    full_name_native: FieldValue = FieldValue()
    has_other_names: FieldValue = FieldValue()
    other_surname: FieldValue = FieldValue()
    other_given_name: FieldValue = FieldValue()
    gender: FieldValue = FieldValue()
    marital_status: FieldValue = FieldValue()
    dob: FieldValue = FieldValue()
    pob_city: FieldValue = FieldValue()
    pob_state_province: FieldValue = FieldValue()
    pob_country: FieldValue = FieldValue()

    # Personal Info 2
    nationality: FieldValue = FieldValue()
    has_other_nationality: FieldValue = FieldValue()
    other_nationality: FieldValue = FieldValue()
    national_id: FieldValue = FieldValue()
    us_ssn: FieldValue = FieldValue()

    # Address & Phone
    home_address_line1: FieldValue = FieldValue()
    home_address_city: FieldValue = FieldValue()
    home_address_state: FieldValue = FieldValue()
    home_address_postal_code: FieldValue = FieldValue()
    home_address_country: FieldValue = FieldValue()
    primary_phone: FieldValue = FieldValue()
    email_address: FieldValue = FieldValue()

    # Travel
    travel_purpose: FieldValue = FieldValue()
    intended_arrival_date: FieldValue = FieldValue()
    intended_length_of_stay: FieldValue = FieldValue()
    traveling_with_others: FieldValue = FieldValue()

    # Passport
    passport_type: FieldValue = FieldValue()
    passport_number: FieldValue = FieldValue()
    passport_book_number: FieldValue = FieldValue()
    passport_issued_country: FieldValue = FieldValue()
    passport_issued_city: FieldValue = FieldValue()
    passport_issue_date: FieldValue = FieldValue()
    passport_expiry_date: FieldValue = FieldValue()

    # Previous US Visa
    previously_issued_visa: FieldValue = FieldValue()
    prev_visa_number: FieldValue = FieldValue()
    prev_visa_issue_date: FieldValue = FieldValue()
    prev_visa_expiry_date: FieldValue = FieldValue()
    prev_visa_type: FieldValue = FieldValue()
    prev_visa_lost: FieldValue = FieldValue()
    prev_visa_cancelled: FieldValue = FieldValue()

    # Work/Education
    employer_name: FieldValue = FieldValue()
    employer_address_line1: FieldValue = FieldValue()
    employer_city: FieldValue = FieldValue()
    employer_state: FieldValue = FieldValue()
    employer_postal_code: FieldValue = FieldValue()
    employer_phone: FieldValue = FieldValue()
    job_title: FieldValue = FieldValue()
    supervisor_name: FieldValue = FieldValue()
