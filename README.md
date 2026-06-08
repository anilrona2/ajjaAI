# ajjaAI — DS-160 Visa Application Assistant

Auto-fills the DS-160 non-immigrant visa form using your passport, I-797, and visa stamp.

## Quick Start

```bash
docker-compose up
```

Open http://localhost:3000, go to **Settings**, and paste your [Anthropic API key](https://console.anthropic.com).

## Usage

1. **Settings** — enter your Anthropic API key (stored in browser only)
2. **Extract** — drag and drop your passport scan, I-797 PDF, and/or visa stamp image, then click **Extract All**
3. **Gap Analysis** — review any missing fields and fill them in manually
4. **Export JSON** — download `ds160_data.json`
5. Install the **Chrome Extension** (load `extension/` as unpacked in `chrome://extensions`)
6. Go to ceac.state.gov, solve the CAPTCHA, then open the extension popup and click **Load JSON File**
7. Navigate through DS-160 pages — fields auto-fill as you go

## Chrome Extension

The extension requires:
- Chrome / Chromium
- `chrome://extensions` → Enable **Developer mode** → **Load unpacked** → select the `extension/` folder

> **Note:** The extension fills fields after you solve the DS-160 landing page CAPTCHA manually.

## Accepted Document Types

JPEG, PNG, PDF, HEIC, WEBP — up to 10 MB per file

## Privacy

No documents or PII are ever stored server-side. Files are processed in-memory and discarded immediately after extraction.

## Architecture

```
frontend (React + Vite, port 3000)
    └── /api proxy → backend (FastAPI, port 8000)
                          └── Anthropic claude-sonnet-4-6 API
```

## Requirements

- Docker Desktop
- An Anthropic API key (you pay per extraction — ~$0.01–0.10 per run depending on document size)
