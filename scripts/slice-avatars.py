"""Slice the 9x5 avatar sprite sheet into circular PNGs."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(
    r"C:\Users\Bright\.cursor\projects\c-LF\assets"
    r"\c__Users_Bright_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"07ca7622d538560fa082ddce5afc7665_images_image-9e9c8014-c5ba-43a1-b3a9-cc8b36a5d951.jpg"
)
OUT = Path(r"c:\LF\LearnFlow\assets\avatars\flat")
COLS, ROWS = 9, 5


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    arr = np.asarray(im)
    h, w = arr.shape[:2]
    print("size", w, h, "corners", arr[0, 0], arr[h // 2, w // 2])

    lum = arr.mean(axis=2)
    bg = lum > 232
    print("bg fraction", float(bg.mean()))

    # Content mask: not near-white/grey sheet
    content = ~bg
    # Morphological close via max-filter-ish using PIL
    mask_img = Image.fromarray((content * 255).astype(np.uint8), "L")
    mask_img = mask_img.filter(ImageFilter.MaxFilter(5))
    content = np.asarray(mask_img) > 0

    ys, xs = np.where(content)
    print("content bbox", xs.min(), ys.min(), xs.max(), ys.max())

    # Uniform grid over content bbox with a little inset
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())
    # Expand a bit then clamp
    pad = 2
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(w - 1, x1 + pad)
    y1 = min(h - 1, y1 + pad)

    cell_w = (x1 - x0 + 1) / COLS
    cell_h = (y1 - y0 + 1) / ROWS
    print("cell", cell_w, cell_h)

    # Detect actual circle in each cell by finding the largest connected blob
    OUT.mkdir(parents=True, exist_ok=True)

    for r in range(ROWS):
        for c in range(COLS):
            idx = r * COLS + c + 1
            cx0 = int(round(x0 + c * cell_w))
            cy0 = int(round(y0 + r * cell_h))
            cx1 = int(round(x0 + (c + 1) * cell_w))
            cy1 = int(round(y0 + (r + 1) * cell_h))
            cell = im.crop((cx0, cy0, cx1, cy1))
            carr = np.asarray(cell)
            clum = carr.mean(axis=2)
            # Sheet leftover is very light
            blob = clum < 228
            if blob.sum() < 40:
                blob = clum < 240
            bys, bxs = np.where(blob)
            if len(bxs) == 0:
                print("empty cell", idx)
                continue
            bx0, by0, bx1, by1 = int(bxs.min()), int(bys.min()), int(bxs.max()), int(bys.max())
            # Make square crop around the blob
            bw, bh = bx1 - bx0 + 1, by1 - by0 + 1
            side = max(bw, bh)
            mx = (bx0 + bx1) // 2
            my = (by0 + by1) // 2
            sx0 = mx - side // 2
            sy0 = my - side // 2
            sx1 = sx0 + side
            sy1 = sy0 + side
            # Map back to full image coords
            gx0 = cx0 + sx0
            gy0 = cy0 + sy0
            gx1 = cx0 + sx1
            gy1 = cy0 + sy1
            # Clamp and pad with white if needed
            crop = Image.new("RGBA", (side, side), (245, 245, 245, 255))
            src_box = (
                max(0, gx0),
                max(0, gy0),
                min(w, gx1),
                min(h, gy1),
            )
            part = im.crop(src_box).convert("RGBA")
            dx = src_box[0] - gx0
            dy = src_box[1] - gy0
            crop.paste(part, (dx, dy))

            # Circular alpha: keep pixels inside circle, fade sheet
            # Recenter using blob again on crop
            ca = np.asarray(crop.convert("RGB")).mean(axis=2)
            inside = ca < 228
            if inside.sum() < 40:
                inside = ca < 240
            iys, ixs = np.where(inside)
            if len(ixs):
                ccx = float(ixs.mean())
                ccy = float(iys.mean())
                # radius from max distance of inside pixels, slightly inset
                dist = np.sqrt((ixs - ccx) ** 2 + (iys - ccy) ** 2)
                radius = float(np.percentile(dist, 98.5))
            else:
                ccx = ccy = side / 2
                radius = side / 2 - 1

            mask = Image.new("L", (side, side), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse(
                (ccx - radius, ccy - radius, ccx + radius, ccy + radius),
                fill=255,
            )
            # Recrop tightly to the circle
            left = max(0, int(np.floor(ccx - radius)))
            top = max(0, int(np.floor(ccy - radius)))
            right = min(side, int(np.ceil(ccx + radius)))
            bottom = min(side, int(np.ceil(ccy + radius)))
            # square
            tw, th = right - left, bottom - top
            tside = max(tw, th)
            left = int(round(ccx - tside / 2))
            top = int(round(ccy - tside / 2))
            right = left + tside
            bottom = top + tside
            # pad if needed
            padded = Image.new("RGBA", (tside, tside), (0, 0, 0, 0))
            src = crop.crop(
                (
                    max(0, left),
                    max(0, top),
                    min(side, right),
                    min(side, bottom),
                )
            )
            msrc = mask.crop(
                (
                    max(0, left),
                    max(0, top),
                    min(side, right),
                    min(side, bottom),
                )
            )
            px = max(0, -left)
            py = max(0, -top)
            padded.paste(src, (px, py))
            pm = Image.new("L", (tside, tside), 0)
            pm.paste(msrc, (px, py))
            padded.putalpha(pm)
            # Scale to a consistent size for Expo
            out = padded.resize((256, 256), Image.Resampling.LANCZOS)
            path = OUT / f"avatar-{idx:02d}.png"
            out.save(path, "PNG")
            print("wrote", path.name, "from cell", (cx0, cy0, cx1, cy1), "r", round(radius, 1))


if __name__ == "__main__":
    main()
