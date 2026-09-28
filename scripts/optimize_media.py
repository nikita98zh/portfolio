"""Build reviewable WebP derivatives for the portfolio's source PNG files.

Run from the repository root. Sources are removed only after the derivatives
have been checked and all application references point at the new files.
"""

from pathlib import Path
from PIL import Image, ImageOps

ASSETS = Path(__file__).resolve().parents[1] / "public" / "assets"


def target_width(path: Path) -> int:
    if path.name == "HOME.png":
        return 1600
    if path.parent == ASSETS and path.name.startswith("work_"):
        return 1122
    return 2200


def optimize(source: Path) -> None:
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((target_width(source), 10000), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=85, method=6)
    print(f"{source.relative_to(ASSETS)}: {source.stat().st_size // 1024} → {target.stat().st_size // 1024} KiB", flush=True)


if __name__ == "__main__":
    for original in sorted(ASSETS.rglob("*.png")):
        optimize(original)
