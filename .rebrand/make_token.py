"""Generate the 800x800 token avatar for the new brand mark (dark plate, Q ring + lane)."""
from PIL import Image, ImageDraw
import shutil

SRC = "public/brand/token.png"
shutil.copyfile(SRC, ".rebrand/backup/assets-original/token.png") if (
    __import__("os").path.exists(".rebrand/backup/assets-original/token.png") is False
) else None

S = 4
W = 800
img = Image.new("RGBA", (W * S, W * S), (11, 13, 26, 255))  # #0b0d1a
d = ImageDraw.Draw(img)

u = W * S / 32
cx, cy, r = 13.6 * u, 13.6 * u, 7.4 * u
stroke = 3.2 * u

d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 255, 255, 255), width=int(round(stroke)))
d.line([(16.9 * u, 17.0 * u), (25.3 * u, 25.0 * u)], fill=(108, 134, 255, 255), width=int(round(stroke)))
for px, py in ((16.9 * u, 17.0 * u), (25.3 * u, 25.0 * u)):
    d.ellipse([px - stroke / 2, py - stroke / 2, px + stroke / 2, py + stroke / 2], fill=(108, 134, 255, 255))

img = img.resize((W, W), Image.LANCZOS).convert("RGB")
img.save("public/brand/token.png", optimize=True)
print("token.png", img.size)
