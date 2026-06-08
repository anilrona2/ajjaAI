from __future__ import annotations
import base64
import json
from io import BytesIO
from pathlib import Path

import anthropic
from PIL import Image

from models import DS160Fields, FieldValue

MODEL = "claude-sonnet-4-6"

EXTRACTION_PROMPT = """You are a visa document data extractor. Extract DS-160 visa application fields from the provided images.

The images may include: passport bio page, US visa stamp, I-797 approval notice.

SOURCE HIERARCHY (when a field appears in multiple documents):
- Personal info (name, DOB, nationality, place of birth): passport > visa_stamp > i797
- Employer/work info (company name, address, job title): i797 > other documents

DATE FORMAT: Normalize all dates to DD-MMM-YYYY (e.g., "15-JAN-2025"). Use 3-letter month abbreviations.

GENDER VALUES: "M" for male, "F" for female.
MARITAL STATUS VALUES: "S" (Single), "M" (Married), "W" (Widowed), "D" (Divorced), "P" (Separated).
TRAVEL PURPOSE: Most likely "H1B" or "TEMPORARY BUSINESS/PLEASURE" for H-1B holders.
PASSPORT TYPE: "R" for Regular/Tourist, "O" for Official, "D" for Diplomatic.
YES/NO FIELDS: Use "Y" for yes, "N" for no.

For each field, return:
- value: the extracted string value, or null if not found
- found: true if value was extracted, false if not found
- source: "passport", "visa_stamp", or "i797" (whichever document it came from), or null

Return ONLY valid JSON matching this exact structure — no prose, no markdown fences.

{
  "surname": {"value": null, "found": false, "source": null},
  "given_name": {"value": null, "found": false, "source": null},
  "full_name_native": {"value": null, "found": false, "source": null},
  "has_other_names": {"value": null, "found": false, "source": null},
  "other_surname": {"value": null, "found": false, "source": null},
  "other_given_name": {"value": null, "found": false, "source": null},
  "gender": {"value": null, "found": false, "source": null},
  "marital_status": {"value": null, "found": false, "source": null},
  "dob": {"value": null, "found": false, "source": null},
  "pob_city": {"value": null, "found": false, "source": null},
  "pob_state_province": {"value": null, "found": false, "source": null},
  "pob_country": {"value": null, "found": false, "source": null},
  "nationality": {"value": null, "found": false, "source": null},
  "has_other_nationality": {"value": null, "found": false, "source": null},
  "other_nationality": {"value": null, "found": false, "source": null},
  "national_id": {"value": null, "found": false, "source": null},
  "us_ssn": {"value": null, "found": false, "source": null},
  "home_address_line1": {"value": null, "found": false, "source": null},
  "home_address_city": {"value": null, "found": false, "source": null},
  "home_address_state": {"value": null, "found": false, "source": null},
  "home_address_postal_code": {"value": null, "found": false, "source": null},
  "home_address_country": {"value": null, "found": false, "source": null},
  "primary_phone": {"value": null, "found": false, "source": null},
  "email_address": {"value": null, "found": false, "source": null},
  "travel_purpose": {"value": null, "found": false, "source": null},
  "intended_arrival_date": {"value": null, "found": false, "source": null},
  "intended_length_of_stay": {"value": null, "found": false, "source": null},
  "traveling_with_others": {"value": null, "found": false, "source": null},
  "passport_type": {"value": null, "found": false, "source": null},
  "passport_number": {"value": null, "found": false, "source": null},
  "passport_book_number": {"value": null, "found": false, "source": null},
  "passport_issued_country": {"value": null, "found": false, "source": null},
  "passport_issued_city": {"value": null, "found": false, "source": null},
  "passport_issue_date": {"value": null, "found": false, "source": null},
  "passport_expiry_date": {"value": null, "found": false, "source": null},
  "previously_issued_visa": {"value": null, "found": false, "source": null},
  "prev_visa_number": {"value": null, "found": false, "source": null},
  "prev_visa_issue_date": {"value": null, "found": false, "source": null},
  "prev_visa_expiry_date": {"value": null, "found": false, "source": null},
  "prev_visa_type": {"value": null, "found": false, "source": null},
  "prev_visa_lost": {"value": null, "found": false, "source": null},
  "prev_visa_cancelled": {"value": null, "found": false, "source": null},
  "employer_name": {"value": null, "found": false, "source": null},
  "employer_address_line1": {"value": null, "found": false, "source": null},
  "employer_city": {"value": null, "found": false, "source": null},
  "employer_state": {"value": null, "found": false, "source": null},
  "employer_postal_code": {"value": null, "found": false, "source": null},
  "employer_phone": {"value": null, "found": false, "source": null},
  "job_title": {"value": null, "found": false, "source": null},
  "supervisor_name": {"value": null, "found": false, "source": null}
}"""


def image_to_base64(img: Image.Image, fmt: str = "JPEG") -> tuple[str, str]:
    buf = BytesIO()
    if fmt == "JPEG" and img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(buf, format=fmt)
    data = base64.standard_b64encode(buf.getvalue()).decode("utf-8")
    media_type = f"image/{'jpeg' if fmt == 'JPEG' else fmt.lower()}"
    return data, media_type


async def extract_fields(
    images: list[tuple[str, str]],  # list of (base64_data, media_type)
    api_key: str,
) -> DS160Fields:
    client = anthropic.Anthropic(api_key=api_key)

    content: list[dict] = []
    for b64, mime in images:
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": mime, "data": b64},
        })
    content.append({"type": "text", "text": EXTRACTION_PROMPT})

    message = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        messages=[{"role": "user", "content": content}],
    )

    raw = message.content[0].text.strip()
    # Strip markdown fences if model adds them despite instructions
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    data = json.loads(raw)
    return DS160Fields.model_validate(data)
