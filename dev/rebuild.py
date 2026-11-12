"""분리된 조각(src/*.js)을 src/v.html 안에 끼워 넣고 ../index.html 로 내보낸다.
사용: 저장소 맨 위에서  python3 dev/rebuild.py
- 큰 변경은 src/*.js 조각(능력치·새 사건·화면·그림)이나 src/v.html(나머지 전부)을 고친 뒤 이 스크립트를 돌린다.
- art.js 안의 ART_MAP 은 ../art/atlas.json 에서 자동으로 채운다."""
import os
H=os.path.dirname(os.path.abspath(__file__)); SRC=os.path.join(H,'src'); ROOT=os.path.dirname(H)
rd=lambda p:open(p,encoding='utf8').read()
s=rd(os.path.join(SRC,'v.html'))
PIECES=[('stats2.js','/* ========== 능력치 2판'),('new_ev.js','/* ===== 새 사건 (능력치 2판)'),('conv.js','/* ===== 기존 사건의 효과를 새 체계로'),('ui2.js','/* ========== 능력치 2판 화면'),('hd.js','/* ========== 고해상도 캐릭터'),('ui3.js','/* ========== 화면 다듬기 (3판)'),('art.js','/* ========== 그림 자원 (제미나이')]
ENDS=[m for _,m in PIECES]+['</script>']
for name,mark in PIECES:
    a=s.index(mark)
    b=min(x for x in [s.find(m,a+10) for m in ENDS] if x>a)
    body=rd(os.path.join(SRC,name))
    if name=='art.js': body=body.replace('const ART={','const ART_MAP='+rd(os.path.join(ROOT,'art','atlas.json'))+';\nconst ART={',1)
    s=s[:a]+body+'\n'+s[b:]
open(os.path.join(SRC,'v.html'),'w',encoding='utf8').write(s)
open(os.path.join(ROOT,'index.html'),'w',encoding='utf8').write(s)
print('index.html', len(s.encode('utf8')),'bytes')
