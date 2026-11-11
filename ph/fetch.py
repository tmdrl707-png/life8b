# 위키미디어 공용 사진을 미리 받아 ph/<id>.jpg 로 저장한다. 결과는 ph/report.txt 에 남긴다.
import json, os, time, urllib.request, io
from PIL import Image
L = json.load(open('ph/list.json'))
ok = bad = skip = 0; out = []
for it in L:
    p = f"ph/{it['id']}.jpg"
    if os.path.exists(p) and os.path.getsize(p) > 2000: skip += 1; continue
    for t in range(3):
        try:
            req = urllib.request.Request(it['url'], headers={'User-Agent': 'life8b-classroom-game/1.0 (https://tmdrl707-png.github.io/life8b/)'})
            b = urllib.request.urlopen(req, timeout=30).read()
            im = Image.open(io.BytesIO(b)).convert('RGB')
            if im.width > 640: im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
            im.save(p, 'JPEG', quality=80, optimize=True, progressive=True); ok += 1; break
        except Exception as e:
            err = str(e); time.sleep((30 if '429' in err else 2) + t * 15)
    else:
        bad += 1; out.append(f"{it['id']} {it['url']} {err}")
    time.sleep(1.5)
open('ph/report.txt', 'w').write(f"ok {ok} skip {skip} bad {bad}\n" + "\n".join(out))
print(ok, skip, bad)
