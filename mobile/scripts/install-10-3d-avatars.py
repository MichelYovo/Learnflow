"""Copy 10 3D busts into the app avatar folder, circular-cropped."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

SRC = Path(r"C:\Users\Bright\.cursor\projects\c-LF\assets")
OUT = Path(r"c:\LF\LearnFlow\assets\avatars")
COUNT = 10


def circle_crop(im: Image.Image, size: int = 512) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side)).resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, size - 2, size - 2), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(im, (0, 0))
    out.putalpha(mask)
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for i in range(1, COUNT + 1):
        src = SRC / f"avatar-3d-{i:02d}.png"
        dest = OUT / f"avatar-{i:02d}.png"
        if not src.exists():
            print("missing", src.name)
            continue
        circle_crop(Image.open(src)).save(dest, "PNG")
        print("wrote", dest.name, src.stat().st_size, "->", dest.stat().st_size)


if __name__ == "__main__":
    main()
