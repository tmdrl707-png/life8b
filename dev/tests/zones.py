# 옆 동네 시험: 우리 동네 가장자리 길 → 옆 동네 · 강가 마을 · 큰 도시로 넘어가고, 건물에 들어갔다 나오고, 다시 돌아온다.
# python3 dev/tests/zones.py [나라] [phone]  → dev/tests/out/zone_*.png
import asyncio,sys,os
from playwright.async_api import async_playwright
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
C=sys.argv[1] if len(sys.argv)>1 and sys.argv[1]!='phone' else 'KR'; PH='phone' in sys.argv
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':844,'height':390} if PH else {'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.click('#btnDev'); await pg.fill('#devCode','2026'); await pg.click('#devGo'); await pg.wait_for_timeout(300)
        async def start(age):
            await ev(f"(()=>{{ DEV.c='{C}'; $('devA').value={age}; devStart('play'); }})()"); await pg.wait_for_timeout(1500)
            await ev("(()=>{ if(!$('sheet').hidden) closeSheet(); if(typeof dlgOpen==='function'&&dlgOpen()) DLG.close&&DLG.close(); G.life.cur.t=999; paused=false; if(W.zone) setZone(0); })()")
        async def walk(dx,dy,n=40):
            await pg.wait_for_timeout(900)
            for i in range(n):
                await ev(f"(()=>{{ if(!$('sheet').hidden) closeSheet(); tryMove({dx},{dy}); }})()")
            await pg.wait_for_timeout(250)
        async def st(): return await ev("({zone:W.zone,map:W.map,x:+W.x.toFixed(1),y:+W.y.toFixed(1),w:OUT.w,tag:$('miniTag').textContent})")
        async def shot(n): await ev("(()=>{ const L=G.life; (L.ensureCal()||[]).forEach(x=>x.done=1); L.cur.mDone=L.cur.plan; L.q=null; if(!$('sheet').hidden) closeSheet(); $('toasts').innerHTML=''; })()"); await pg.wait_for_timeout(700); await pg.screenshot(path=S+f'zone_{n}{"_ph" if PH else ""}.png')
        # 1) 어른: 서쪽 큰길 끝 → 옆 동네
        await start(30)
        await ev("(()=>{ W.map='out'; W.x=2.5; W.y=25; W.car=false; NPCMAP={}; })()"); await pg.wait_for_timeout(300)
        await shot('0west'); await walk(-.12,0,30); print('옆 동네로:',await st()); await shot('1')
        # 건물 안에 들어갔다 나오기 (작은 도서관)
        await ev("(()=>{ const d=doorOf('z1lib'); W.x=d[0]; W.y=d[1]+.3; })()"); await walk(0,-.1,3); print('도서관 안:',await st()); await shot('1lib')
        await walk(0,.15,20); print('나옴:',await st())
        await ev("(()=>{ W.x=93.5; W.y=23; })()"); await walk(.12,0,30); print('돌아옴:',await st())
        # 2) 남쪽 길 끝 → 강가 마을
        await ev("(()=>{ W.x=31.9; W.y=49.5; })()"); await walk(0,.12,30); print('강가 마을로:',await st()); await shot('2')
        await ev("(()=>{ W.x=33.4; W.y=22; })()"); await walk(0,.1,40); print('다리 건너기:',await st())
        await ev("(()=>{ W.x=20; W.y=22; })()"); await walk(0,.1,15); print('강물에 막힘(y가 24 전):',await st())
        await ev("(()=>{ W.x=31.7; W.y=2.4; })()"); await walk(0,-.12,30); print('돌아옴:',await st())
        # 2-2) 북쪽 길 끝 → 산과 숲
        await ev("(()=>{ W.car=false; W.x=61.9; W.y=2.5; })()"); await walk(0,-.12,30); print('산과 숲으로:',await st()); await shot('4')
        await ev("(()=>{ W.x=46.7; W.y=24; })()"); await walk(0,-.12,40); print('계곡 다리 건너 오르기:',await st())
        await ev("(()=>{ W.x=46.7; W.y=45; })()"); await walk(0,.12,30); print('돌아옴:',await st())
        # 3) 동쪽 큰길 끝(탈것) → 큰 도시
        await ev("(()=>{ W.x=118; W.y=24.6; W.car=true; })()"); await walk(.2,0,40); print('큰 도시로:',await st()); await shot('3')
        await ev("(()=>{ W.car=false; W.x=40; W.y=33; NPCMAP={}; })()"); await shot('3walk')
        print('다른 지도의 할 일 → 화살표:',await ev("targets().map(t=>t.type+':'+t.m+':'+(t.p?t.p.map(v=>+v.toFixed(1)).join(','):'없음')).slice(0,5)"))
        await ev("(()=>{ if(typeof openBigMap==='function') openBigMap(); else { const c=document.createElement('canvas'); c.width=800; c.height=400; drawBigMap(c); } })()"); await pg.wait_for_timeout(300)
        await ev("(()=>{ W.car=true; W.x=3; W.y=24.6; })()"); await walk(-.2,0,30); print('돌아옴:',await st())
        # 4) 아이: 9살은 옆 동네에 못 감, 12살은 강가 마을에 못 감
        await start(12); await ev("(()=>{ W.map='out'; W.x=2; W.y=25; NPCMAP={}; })()"); await walk(-.12,0,30); print('12살 옆 동네:',await st())
        await ev("(()=>{ setZone(0,31.5,50); })()"); await walk(0,.12,30); print('12살 강가 마을(막혀야 함):',await st())
        # 5) 집으로 돌아가 눕기 → 우리 동네
        await ev("(()=>{ W.x=50; W.y=20; goHomeBed(); })()"); await pg.wait_for_timeout(300); print('집:',await st())
        print('errs',errs); await b.close()
asyncio.run(main())
