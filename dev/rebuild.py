"""조각을 모아 index.html 한 파일을 만든다.
사용: 저장소 맨 위에서  python3 dev/rebuild.py      (-v 를 붙이면 감싸기 목록도 보여 준다)

- dev/src/template.html 의 '<!--#include 경로-->' 줄을 그 조각 파일 내용으로 바꾼다. 조각은 위에서부터 이 순서대로 실행된다.
- 조각: dev/src/css/ (화면 모양), html/ (화면 뼈대), engine/ (자료·삶 엔진), ui/ (화면 동작). 번호는 그 폴더 안에서의 순서다.
- ui/53-art-loader.js 의 'const ART={' 앞에 art/atlas.json 을 ART_MAP 으로 끼워 넣는다.
- 이름 검사: 모든 조각은 한 스크립트로 합쳐지므로, 맨 바깥 'function 이름'이 두 조각에 있으면 뒤의 것이 앞의 것까지 몰래 덮어쓴다.
  그런 이름이 있으면 빌드를 멈춘다. 일부러 앞 조각의 함수를 바꾸는 것은 '이름=function' 처럼 다시 넣는 방식(감싸기)으로 한다.
"""
import os, re, sys, hashlib
H = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(H, 'src'); ROOT = os.path.dirname(H)
rd = lambda p: open(p, encoding='utf8').read()

if os.path.exists(os.path.join(SRC, 'v.html')):
    sys.exit('dev/src/v.html 이 남아 있습니다. 2026-11-12부터 v.html 대신 dev/src/template.html 과 조각 파일(css·html·engine·ui)을 고칩니다. 고친 내용은 해당 조각으로 옮기고 v.html 은 지워 주세요.')

INC = re.compile(r'^<!--#include (\S+)-->$')
out = []; order = []
for line in rd(os.path.join(SRC, 'template.html')).split('\n'):
    m = INC.match(line)
    if not m: out.append(line + '\n'); continue
    name = m.group(1); body = rd(os.path.join(SRC, name)); order.append((name, body))
    if name == 'ui/53-art-loader.js':
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
