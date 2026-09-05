"""Slice the 10 Spira mascots from the sprite sheet.

Keeps the full character + mood props, drops the French labels under
each one, and letterboxes into a square without stretching.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\Bright\.cursor\projects\c-LF\assets"
    r"\c__Users_Bright_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"07ca7622d538560fa082ddce5afc7665_images_image-6561db9f-525a-4777-9846-339ca831a8d5.jpg"
)
OUT = Path(r"c:\LF\LearnFlow\assets\spira")
SIZE = 512
PAD_RATIO = 0.16

# Exclusive cells: midpoints between neighbors, above the label bands.
# Top labels sit ~333–353; bottom labels ~608–628.
CELLS: list[tuple[str, int, int, int, int]] = [
    ("joyeux", 0, 72, 189, 328),
    ("calme", 189, 72, 362, 328),
    ("confiant", 362, 72, 528, 328),
    ("triste", 528, 72, 689, 328),
    ("enerve", 689, 72, 852, 328),
    ("timide", 852, 72, 1024, 328),
    ("surpris", 90, 368, 295, 604),
    ("neutre", 295, 368, 487, 604),
    ("determine", 487, 368, 691, 604),
    ("fatigue", 691, 368, 920, 604),
]

NAVY = np.array([9.0, 21.0, 37.0])


def background_mask(rgb: np.ndarray) -> np.ndarray:
    """Navy sheet pixels — not enclosed dark faces, not gray fatigue body."""
    dist = np.sqrt(((rgb.astype(np.float32) - NAVY) ** 2).sum(axis=2))
    blue_bias = rgb[:, :, 2].astype(np.int16) - rgb[:, :, 0].astype(np.int16)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    return (dist < 30) & (blue_bias > 8) & (chroma < 55)


def flood_from_edges(is_bg: np.ndarray) -> np.ndarray:
    h, w = is_bg.shape
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if not visited[y, x] and is_bg[y, x]:
            visited[y, x] = True
            q.append((y, x))

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(h):
        seed(y, 0)
        seed(y, w - 1)

    while q:
        y, x = q.popleft()
        if y > 0 and not visited[y - 1, x] and is_bg[y - 1, x]:
            visited[y - 1, x] = True
            q.append((y - 1, x))
        if y + 1 < h and not visited[y + 1, x] and is_bg[y + 1, x]:
            visited[y + 1, x] = True
            q.append((y + 1, x))
        if x > 0 and not visited[y, x - 1] and is_bg[y, x - 1]:
            visited[y, x - 1] = True
            q.append((y, x - 1))
        if x + 1 < w and not visited[y, x + 1] and is_bg[y, x + 1]:
            visited[y, x + 1] = True
            q.append((y, x + 1))
    return visited


def extract(cell: np.ndarray) -> Image.Image:
    is_bg = background_mask(cell)
    sheet = flood_from_edges(is_bg)
    keep = ~sheet

    alpha = (keep.astype(np.uint8) * 255)
    alpha_img = Image.fromarray(alpha, "L")
    # Grow 1px so outlines aren't eaten, then feather JPEG ringing.
    alpha_img = alpha_img.filter(ImageFilter.MaxFilter(3))
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.7))

    rgba = np.dstack([cell, np.asarray(alpha_img)])
    img = Image.fromarray(rgba, "RGBA")

    ys, xs = np.where(np.asarray(alpha_img) > 24)
    bbox = None if len(xs) == 0 else (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    if bbox is None:
        return img
    left, top, right, bottom = bbox
    pad = 10
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    return img.crop((left, top, right, bottom))


def letterbox(src: Image.Image, size: int = SIZE, pad_ratio: float = PAD_RATIO) -> Image.Image:
    inner = int(round(size * (1 - 2 * pad_ratio)))
    scale = min(inner / src.width, inner / src.height)
    nw = max(1, int(round(src.width * scale)))
    nh = max(1, int(round(src.height * scale)))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def main() -> None:
    sheet = Image.open(SRC).convert("RGB")
    arr = np.asarray(sheet)
    OUT.mkdir(parents=True, exist_ok=True)

    for name, x0, y0, x1, y1 in CELLS:
        cell = arr[y0:y1, x0:x1]
        cut = extract(cell)
        out = letterbox(cut)
        path = OUT / f"{name}.png"
        out.save(path, "PNG")
        opaque = int(np.asarray(out.split()[-1]).sum() / 255)
        print(f"{name:10} cell={cell.shape[1]}x{cell.shape[0]} crop={cut.size} opaque={opaque} -> {path.name}")


if __name__ == "__main__":
    main()
