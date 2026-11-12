# 진로 이야기·사람 선택 대화·대학 후보 시험 (11-13)
# 1) 12살: 집에서 엄마에게 다가가면 '엄마 · 진로 이야기' → 대화창(오각형 카드)에서 흥미 분야 고르기
# 2) 16살: 학교 담임 선생님과 진로 상담, 17살: 진학 상담(목표 학과)
# 3) 사람이 나오는 '!' 선택이 대화창으로 열리는지(될 가능성 표시), 물건 선택은 팝업 그대로인지
# 4) 19살 대학 갈림길: 도전·적정·안정 후보와 확률
# 화면은 dev/tests/out/career_*.png  (두 번째 인자로 'phone'을 주면 휴대폰 가로 크기)
import asyncio,sys,os
from playwright.async_api import async_playwright
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
C=sys.argv[1] if len(sys.argv)>1 else 'KR'; PH=len(sys.argv)>2 and sys.argv[2]=='phone'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); vp={'width':844,'height':390} if PH else {'width':1280,'height':720}
        ctx=await b.new_context(viewport=vp); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate; tag='_ph' if PH else ''
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.click('#btnDev'); await pg.fill('#devCode','2026'); await pg.click('#devGo'); await pg.wait_for_timeout(300)
        async def start(age):
            await ev(f"(()=>{{ DEV.c='{C}'; $('devA').value={age}; devStart('play'); }})()"); await pg.wait_for_timeout(1500)
            await ev("(()=>{ if(!$('sheet').hidden) closeSheet(); $('flash').hidden=true; G.life.cur.scenes=[]; G.life.q=null; G.life.pending=null; })()")
        async def talk(name,picks=0):
            for _ in range(10):
                if not await pg.is_visible('#dlg'): break
                await ev('DLG.typing&&DLG.fin()'); await pg.wait_for_timeout(120)
                t=(await pg.inner_text('#dlg')).replace('\n',' / ')
                print('   대화창:',t[:230])
                if await pg.locator('#dlg .dopts').count():
                    await pg.screenshot(path=S+f'career_{name}{tag}.png'); await pg.locator('#dlg .dopts button').nth(picks).click(); await pg.wait_for_timeout(250)
                else: await pg.click('#dlg'); await pg.wait_for_timeout(150)
        # 1) 12살 엄마
        await start(12)
        print('12살 진로 단계:',await ev('careerDue(G.life)'))
        lab=await ev("""(()=>{ W.map='home'; W.car=false; npcUpdate(.1); const m=(NPCMAP.home||[]).find(n=>n.key==='mom'); if(!m) return 'mom 없음'; W.x=m.x+.4; W.y=m.y; G.life.cur.scenes=[]; const r=nearExtra(); return r?r.lab:null; })()""")
        print('A 버튼:',lab)
        await ev("openTalk({npc:{key:'mom',x:0,y:0}})"); await pg.wait_for_timeout(200); await talk('1_parent',0)
        print('흥미:',await ev("G.life.f.dir+' '+JSON.stringify(G.life.f.dirs)"))
        # 3) 사람이 나오는 선택 / 물건 선택
        r=await ev("""(()=>{ const L=G.life, i=SCENES.findIndex(s=>s.spot==='mom'&&L.age>=s.a[0]&&L.age<=s.a[1]||s.spot==='friend'&&L.age>=s.a[0]&&L.age<=s.a[1]); if(i<0) return null; if(!$('sheet').hidden) closeSheet(); L.cur.scenes=[{i,done:0}]; openScene(0); return [SCENES[i].spot, !$('dlg').hidden, !$('sheet').hidden]; })()""")
        print('사람 선택:',r); await talk('3_person',1)
        r=await ev("""(()=>{ const L=G.life, i=SCENES.findIndex(s=>(s.spot==='desk'||s.spot==='tv')&&L.age>=s.a[0]&&L.age<=s.a[1]&&!scenePerson(L,s)); if(i<0) return null; if(!$('sheet').hidden) closeSheet(); L.cur.scenes=[{i,done:0}]; openScene(0); return [SCENES[i].spot, !$('dlg').hidden, !$('sheet').hidden, $('sheetBox').innerText.slice(0,120)]; })()""")
        print('물건 선택:',r); await pg.screenshot(path=S+f'career_3_thing{tag}.png'); await ev("closeSheet()")
        # 2) 16살 진로 상담 · 17살 진학 상담
        await ev("(()=>{ const L=G.life; L.age=16; L.f.school=1; L.f.sec=1; W.map='mid'; })()")
        print('16살 단계:',await ev('careerDue(G.life)'))
        await ev("openTalk({npc:{key:'p0',x:0,y:0}})"); await pg.wait_for_timeout(200); await talk('2_teacher',1)
        await ev("G.life.age=17"); print('17살 단계:',await ev('careerDue(G.life)'))
        await ev("openTalk({npc:{key:'p0',x:0,y:0}})"); await pg.wait_for_timeout(200); await talk('2_major',0)
        print('흥미·목표 학과:',await ev("DIRS[G.life.f.dir].n+' · '+G.life.f.major"))
        # 4) 19살 대학 갈림길
        await ev("(()=>{ const L=G.life; L.age=19; W.map='out'; L.pending=L.choiceAt(19); openCross(); })()"); await pg.wait_for_timeout(400)
        print('대학 갈림길:',(await pg.inner_text('#sheetBox')).replace('\n',' / ')[:600])
        await pg.screenshot(path=S+f'career_4_univ{tag}.png')
        print('errs',errs); await b.close()
asyncio.run(main())
