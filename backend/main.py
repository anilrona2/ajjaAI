from __future__ import annotations
import base64
from io import BytesIO

from fastapi import FastAPI, File, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from PIL import Image

from extractor import extract_fields, image_to_base64
from models import DS160Fields

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

try:
    from pdf2image import convert_from_bytes
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="ajjaAI DS-160 Extractor")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def file_to_images(upload: UploadFile) -> list[tuple[str, str]]:
    content_type = (upload.content_type or "").lower()
    data = await upload.read()

    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"{upload.filename}: file exceeds 10 MB limit")

    if content_type == "application/pdf" or upload.filename.lower().endswith(".pdf"):
        if not PDF_SUPPORT:
            raise HTTPException(status_code=400, detail="PDF support not available (poppler-utils missing)")
        pages = convert_from_bytes(data, dpi=150)
        return [image_to_base64(page, "JPEG") for page in pages[:10]]  # cap at 10 pages

    img = Image.open(BytesIO(data))
    return [image_to_base64(img, "JPEG")]


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/extract", response_model=DS160Fields)
@limiter.limit("10/hour")
async def extract(
    request: Request,
    files: list[UploadFile] = File(...),
    x_claude_api_key: str = Header(...),
):
    if not x_claude_api_key.startswith("sk-ant-"):
        raise HTTPException(status_code=400, detail="Invalid API key format")

    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    all_images: list[tuple[str, str]] = []
    for upload in files:
        imgs = await file_to_images(upload)
        all_images.extend(imgs)

    if not all_images:
        raise HTTPException(status_code=400, detail="No processable images found")

    try:
        result = await extract_fields(all_images, x_claude_api_key)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Extraction failed: {exc}") from exc

    return result
