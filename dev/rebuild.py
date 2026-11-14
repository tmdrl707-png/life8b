"""조각을 모아 index.html 한 파일을 만든다.
사용: 저장소 맨 위에서
  python3 dev/rebuild.py              index.html 만들기 (+이름 겹침 검사)
  python3 dev/rebuild.py -u 2-2       그 단위의 조각 목록과, 그 단위가 다른 단위의 함수를 감싸는 곳 (빌드 안 함)
  python3 dev/rebuild.py -w 이름      그 함수·메서드를 정의하거나 감싸는 모든 곳을 실행 순서대로 (빌드 안 함)
  python3 dev/rebuild.py -v           만든 뒤 감싸기 목록

- dev/src/template.html 의 '<!--#include 경로-->' 줄을 그 조각 파일 내용으로 바꾼다. 조각은 위에서부터 이 순서대로 실행된다.
- 조각 폴더 = 개발 단위: 1-ops(운영) 2-1-world(세계·화면) 2-2-talk(상호작용) 2-3-time(시간·사건) 2-4-art(그림) 3-ending(엔딩·기록)
  4-engine(내용·삶 엔진), 그리고 css/·html/. 파일 앞 번호는 예전부터의 순서 번호이고, 실제 실행 순서는 template.html 이 정한다.
  4-engine/u69-… 처럼 u가 붙은 것은 화면 쪽 순서(69번 자리)에서 실행되는 엔진 부분이다.
- 2-4-art/53-art-loader.js 의 'const ART={' 앞에 art/atlas.json 을 ART_MAP 으로 끼워 넣는다.
- 이름 검사: 모든 조각은 한 스크립트로 합쳐지므로, 맨 바깥 'function 이름'이 두 조각에 있으면 뒤의 것이 앞의 것까지 몰래 덮어쓴다.
  그런 이름이 있으면 빌드를 멈춘다. 일부러 앞 조각의 함수를 바꾸는 것은 '이름=function' 처럼 다시 넣는 방식(감싸기)으로 한다.
"""
import os, re, sys, hashlib
H = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(H, 'src'); ROOT = os.path.dirname(H)
rd = lambda p: open(p, encoding='utf8').read()

if os.path.exists(os.path.join(SRC, 'v.html')):
    sys.exit('dev/src/v.html 이 남아 있습니다. 2026-11-12부터 v.html 대신 dev/src/template.html 과 조각 파일(css·html·engine·ui)을 고칩니다. 고친 내용은 해당 조각으로 옮기고 v.html 은 지워 주세요.')

INC = re.compile(r'^<!--#include (\S+)-->$')
UNIT = {'1':'1-ops','2-1':'2-1-world','2-2':'2-2-talk','2-3':'2-3-time','2-4':'2-4-art','3':'3-ending','4':'4-engine'}
def query():
    names = [m.group(1) for m in map(INC.match, rd(os.path.join(SRC, 'template.html')).split('\n')) if m and m.group(1).endswith('.js')]
    if '-w' in sys.argv:
        n = sys.argv[sys.argv.index('-w') + 1]; pat = re.compile(r'(function\s+%s\s*\(|(?<![\w$.])%s\s*=\s*(\(?\w*\)?\s*=>\s*)?function|(?<![\w$])(?:P|Life\.prototype)\.%s\s*=|(const|let)\s+\w+\s*=\s*(P\.|Life\.prototype\.)?%s\s*[;,]|^\s{2}%s\s*\()' % ((re.escape(n),) * 5), re.M)
        for f in names:
            for i, line in enumerate(rd(os.path.join(SRC, f)).split('\n'), 1):
                if pat.search(line): print(f'{f}:{i}  {line.strip()[:110]}')
    if '-u' in sys.argv:
        u = UNIT.get(sys.argv[sys.argv.index('-u') + 1], sys.argv[sys.argv.index('-u') + 1]); mine = [f for f in names if f.startswith(u + '/')]
        defs = {}
        for f in names:
            for m in re.finditer(r'^(?:async\s+)?function\s+([\w$]+)', rd(os.path.join(SRC, f)), re.M): defs.setdefault(m.group(1), f)
        print(f'{u}: 조각 {len(mine)}개 (실행 순서)'); [print('  ' + f, os.path.getsize(os.path.join(SRC, f)) // 1024, 'KB') for f in mine]
        cross = set()
        for f in mine:
            for m in re.finditer(r'(?<![\w$.])([\w$]+)\s*=\s*(?:\(?\w*\)?\s*=>\s*)?function', rd(os.path.join(SRC, f))):
                d = defs.get(m.group(1))
                if d and not d.startswith(u + '/'): cross.add(f'{m.group(1)} ({d.split("/")[0]})')
            if '4-engine' != u and re.search(r'Life\.prototype|\bP\.\w+\s*=\s*function', rd(os.path.join(SRC, f))): cross.add(f'Life 메서드 ({f})')
        print('다른 단위의 것을 감쌈:', ', '.join(sorted(cross)) or '없음')
    sys.exit(0)
if '-w' in sys.argv or '-u' in sys.argv: query()
out = []; order = []
for line in rd(os.path.join(SRC, 'template.html')).split('\n'):
    m = INC.match(line)
    if not m: out.append(line + '\n'); continue
    name = m.group(1); body = rd(os.path.join(SRC, name)); order.append((name, body))
    if name == '2-4-art/53-art-loader.js':
        assert body.count('const ART={') == 1, 'art-loader 에 const ART={ 가 한 번만 있어야 합니다'
        body = body.replace('const ART={', 'const ART_MAP=' + rd(os.path.join(ROOT, 'art', 'atlas.json')) + ';\nconst ART={', 1)
    if not body.endswith('\n'): body += '\n'
    out.append(body)
s = ''.join(out)[:-1]  # template 맨 끝 줄바꿈 뒤에 덧붙은 '\n' 하나를 되돌린다

# ---- 이름 검사 ----
FN = re.compile(r'^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)', re.M)
DECL = re.compile(r'^(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)', re.M)
WRAP = re.compile(r'(?:^|[;{}\s])([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b', re.M)
# 예전부터 두 번 있는 이름(뒤의 것만 쓰이고 앞의 것은 쓰이지 않음). 고칠 때 이 목록에서 빼면 된다.
KNOWN_DUP = {'treeSprite'}  # ui/10-pixel-art.js 의 것은 쓰이지 않고 ui/11-pixel-art-2.js 의 것이 쓰인다
first = {}; dup = []; wraps = set()
js = [(n, b) for n, b in order if n.endswith('.js')]
for name, body in js:
    for n in FN.findall(body) + DECL.findall(body):
        if n in first and first[n] != name and n not in KNOWN_DUP: dup.append(f'  {n}: {first[n]} · {name}')
        first.setdefault(n, name)
for name, body in js:
    for n in WRAP.findall(body):
        if n in first and first[n] != name: wraps.add(f'{n}({first[n].split("/")[-1]}→{name.split("/")[-1]})')
if dup:
    sys.exit('같은 이름이 두 조각에 있습니다 (뒤의 것이 앞의 것을 덮어씁니다):\n' + '\n'.join(sorted(set(dup))) + '\n한쪽 이름을 바꾸거나, 일부러 바꾸는 것이면 "이름=function(...)" 으로 감싸 주세요. index.html 은 만들지 않았습니다.')

open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf8', newline='\n').write(s)
b = s.encode('utf8')
print(f'index.html {len(b)} bytes · 조각 {len(order)}개 · sha256 {hashlib.sha256(b).hexdigest()[:16]}')
if '-v' in sys.argv: print('감싸기 (앞 조각의 함수를 뒤 조각이 바꿈):\n  ' + '\n  '.join(sorted(wraps)))
