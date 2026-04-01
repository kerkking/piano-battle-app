from pathlib import Path

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from processor import process_single, process_all, SUPPORTED_EXTENSIONS

app = FastAPI(title="Piano Battle - Image Processor")

BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "raw_images"
PROCESSED_DIR = BASE_DIR / "processed_images"

RAW_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/processed_images", StaticFiles(directory=str(PROCESSED_DIR)), name="processed_images")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    if not any(file.filename.lower().endswith(ext) for ext in SUPPORTED_EXTENSIONS):
        return {"error": f"Unsupported file type. Supported: {SUPPORTED_EXTENSIONS}"}

    save_path = RAW_DIR / file.filename
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    output_path = process_single(save_path, PROCESSED_DIR)
    return {"filename": output_path.name, "status": "processed"}


@app.post("/api/process-all")
def batch_process():
    processed = process_all(RAW_DIR, PROCESSED_DIR)
    return {"processed": processed, "count": len(processed)}


@app.get("/api/images")
def list_images():
    images = [f.name for f in PROCESSED_DIR.iterdir() if f.suffix == ".png"]
    return {"images": images}
