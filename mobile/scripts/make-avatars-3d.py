"""Bake sphere lighting onto circular avatar PNGs so they read as 3D orbs."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(r"c:\LF\LearnFlow\assets\avatars")


def shade(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    # Work at 512 then downscale for smoother lighting
    im = im.resize((512, 512), Image.Resampling.LANCZOS)
    arr = np.asarray(im).astype(np.float32)
    h, w = arr.shape[:2]
    alpha = arr[:, :, 3] / 255.0

    yy, xx = np.ogrid[:h, :w]
    nx = (xx + 0.5 - w / 2) / (w / 2)
    ny = (yy + 0.5 - h / 2) / (h / 2)
    r2 = nx * nx + ny * ny
    sphere = r2 <= 1.02
    nz = np.sqrt(np.clip(1.0 - np.minimum(r2, 1.0), 0.0, 1.0))

    # Key light from upper-left, fill from front
    lx, ly, lz = -0.42, -0.62, 0.66
    ndotl = np.clip(nx * lx + ny * ly + nz * lz, 0.0, 1.0)
    lambert = 0.52 + 0.62 * ndotl

    # Specular (Phong-ish)
    hx, hy, hz = -0.28, -0.48, 0.83
    ndoth = np.clip(nx * hx + ny * hy + nz * hz, 0.0, 1.0)
    spec = (ndoth ** 28) * 95.0
    spec2 = (ndoth ** 8) * 28.0

    # Ambient occlusion near the rim, darker at the bottom
    rim = np.clip((r2 - 0.62) / 0.38, 0.0, 1.0)
    bottom = np.clip((ny + 0.15) / 1.15, 0.0, 1.0)
    ao = 1.0 - 0.28 * rim * bottom - 0.12 * rim

    rgb = arr[:, :, :3]
    rgb = rgb * lambert[..., None] * ao[..., None]
    rgb = rgb + spec[..., None] + spec2[..., None]

    # Soft top-left gloss blob
    gloss_x = (nx + 0.28) / 0.42
    gloss_y = (ny + 0.38) / 0.28
    gloss = np.clip(1.0 - (gloss_x * gloss_x + gloss_y * gloss_y), 0.0, 1.0)
    rgb = rgb + (gloss ** 2)[..., None] * 48.0

    rgb = np.clip(rgb, 0, 255)

    out = np.zeros_like(arr)
    out[:, :, :3] = rgb
    # Keep circular mask, slightly anti-aliased by original alpha
    out[:, :, 3] = np.clip(alpha * 255.0 * sphere.astype(np.float32), 0, 255)

    result = Image.fromarray(out.astype(np.uint8), "RGBA")
    result = result.resize((256, 256), Image.Resampling.LANCZOS)
    result = result.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=3))
    result.save(path, "PNG")
    print("3d", path.name)


def main() -> None:
    files = sorted(ROOT.glob("avatar-*.png"))
    for f in files:
        shade(f)
    print("done", len(files))


if __name__ == "__main__":
    main()
