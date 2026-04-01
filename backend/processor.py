from pathlib import Path
from PIL import Image
from rembg import remove

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def remove_background(input_path: Path) -> Image.Image:
    """Remove background from an image using rembg (U2Net)."""
    with open(input_path, "rb") as f:
        input_bytes = f.read()
    output_bytes = remove(input_bytes)
    from io import BytesIO
    return Image.open(BytesIO(output_bytes)).convert("RGBA")


def auto_crop(image: Image.Image, padding: int = 10) -> Image.Image:
    """Crop to tight bounding box of non-transparent pixels."""
    bbox = image.split()[3].getbbox()  # alpha channel bounding box
    if bbox is None:
        return image
    left, upper, right, lower = bbox
    left = max(0, left - padding)
    upper = max(0, upper - padding)
    right = min(image.width, right + padding)
    lower = min(image.height, lower + padding)
    return image.crop((left, upper, right, lower))


def resize_to_max(image: Image.Image, max_dim: int = 200) -> Image.Image:
    """Resize so the largest dimension is max_dim, preserving aspect ratio."""
    w, h = image.size
    if max(w, h) <= max_dim:
        return image
    scale = max_dim / max(w, h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    return image.resize((new_w, new_h), Image.LANCZOS)


def process_single(input_path: Path, output_dir: Path) -> Path:
    """Process a single image: remove background, crop, resize, save as PNG."""
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{input_path.stem}.png"

    image = remove_background(input_path)
    image = auto_crop(image)
    image = resize_to_max(image)
    image.save(output_path, "PNG")
    return output_path


def process_all(raw_dir: Path, output_dir: Path) -> list[str]:
    """Batch process all supported images in raw_dir. Skips already-processed."""
    output_dir.mkdir(parents=True, exist_ok=True)
    processed = []

    for file in raw_dir.iterdir():
        if file.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        output_path = output_dir / f"{file.stem}.png"
        if output_path.exists():
            processed.append(output_path.name)
            continue
        try:
            process_single(file, output_dir)
            processed.append(output_path.name)
        except Exception as e:
            print(f"Failed to process {file.name}: {e}")

    return processed
