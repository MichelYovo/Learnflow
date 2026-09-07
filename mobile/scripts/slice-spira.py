"""Slice the 10 Spira mascots from the 5x2 sprite sheet.

Drops French labels and dashed frames, keeps the character + mood props,
and letterboxes into a square without stretching.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\Bright\.cursor\projects\c-LF\assets"
    r"\c__Users_Bright_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"07ca7622d538560fa082ddce5afc7665_images_image-ea90e1cb-1a5a-4dde-a674-3510ae0ced2b.jpg"
)
OUT = Path(r"c:\LF\LearnFlow\assets\spira")
SIZE = 512
PAD_RATIO = 0.12

# Inset inside dashed frames, cropped above the label band.
CELLS: list[tuple[str, int, int, int, int]] = [
    ("joyeux", 34, 44, 196, 286),
    ("calme", 234, 44, 400, 286),
    ("confiant", 440, 44, 594, 286),
    ("triste", 634, 44, 794, 286),
    ("enerve", 833, 44, 990, 286),
    ("timide", 34, 364, 196, 606),
    ("surpris", 234, 364, 400, 606),
    ("neutre", 440, 364, 594, 606),
    ("determine", 634, 364, 794, 606),
    ("fatigue", 833, 364, 990, 606),
]


def background_mask(rgb: np.ndarray) -> np.ndarray:
    """Near-white, low-chroma paper / faint checkerboard — not body or props."""
    lum = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    return (lum >= 238) & (chroma <= 16)


def flood_from_edges(is_bg: np.ndarray) -> np.ndarray:
    h, w = is_bg.shape
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and not visited[y, x] and is_bg[y, x]:
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
        seed(y - 1, x)
        seed(y + 1, x)
        seed(y, x - 1)
        seed(y, x + 1)
    return visited


def morph_close(mask: np.ndarray, radius: int = 2) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    k = radius * 2 + 1
    img = img.filter(ImageFilter.MaxFilter(k))
    img = img.filter(ImageFilter.MinFilter(k))
    return np.asarray(img) > 127


def fill_holes(keep: np.ndarray) -> np.ndarray:
    """Fill enclosed transparent pockets (glossy highlights that leaked)."""
    exterior = flood_from_edges(~keep)
    return keep | ~exterior


def extract(cell: np.ndarray) -> Image.Image:
    is_bg = background_mask(cell)
    sheet = flood_from_edges(is_bg)
    keep = fill_holes(morph_close(~sheet, radius=2))

    alpha = (keep.astype(np.uint8) * 255)
    alpha_img = Image.fromarray(alpha, "L")
    alpha_img = alpha_img.filter(ImageFilter.MaxFilter(3))
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.55))

    rgba = np.dstack([cell, np.asarray(alpha_img)])
    img = Image.fromarray(rgba, "RGBA")

    ys, xs = np.where(np.asarray(alpha_img) > 28)
    if len(xs) == 0:
        return img
    pad = 6
    left = max(0, int(xs.min()) - pad)
    top = max(0, int(ys.min()) - pad)
    right = min(img.width, int(xs.max()) + 1 + pad)
    bottom = min(img.height, int(ys.max()) + 1 + pad)
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
