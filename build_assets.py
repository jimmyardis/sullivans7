"""Copy every image index.html / history.html reference from the version 2
source, converting camera-original JPGs into web-sized WebP."""
import re, sys, shutil, pathlib
from PIL import Image, ImageOps
SRC = pathlib.Path(sys.argv[1]); HERE = pathlib.Path(__file__).parent
ORIGINALS = {'fireplacezoom.webp': 'fireplacezoom.jpg', 'castlekeepjoindoor.webp': 'castlekeepjoindoor.jpg'}
ORIGINALS.update({f'Castle-{t}-{n}.webp': f'Castle-{t}-{n}.JPG'
                  for t, ns in (('PM', ['01','02','03','04','05','06']), ('AM', ['11','12'])) for n in ns})
refs = set()
for page in ('index.html', 'history.html'):
    text = (HERE / page).read_text()
    refs |= set(re.findall(r'src="([^"#:]+\.(?:webp|jpg|JPG|png))"', text))
    refs |= set(re.findall(r"url\('([^'#:]+\.(?:webp|jpg|png))'\)", text))
refs |= set(re.findall(r"url\('([^'#:]+\.(?:webp|jpg|png))'\)", (HERE / 'style.css').read_text()))
for name in sorted(refs):
    if name in ORIGINALS:
        im = ImageOps.exif_transpose(Image.open(SRC / ORIGINALS[name])); im.thumbnail((2400, 2400))
        im.convert('RGB').save(HERE / name, 'WEBP', quality=82, method=6)
    else:
        shutil.copy2(SRC / name, HERE / name)
print(len(refs), 'images')
