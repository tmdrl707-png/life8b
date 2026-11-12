# 넓어진 동네 지도와 건물 안 시험: 나이별 갈 수 있는 범위(가림막)·미니맵, 건물에 들어가 말 걸기·물건 만지기
import asyncio,sys
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]+' | '+(e.stack or '').split('\n')[1][:160] if e.stack else str(e))); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.click('#btnDev'); await pg.fill('#devCode','2026'); await pg.click('#devGo')
        code=sys.argv[1] if len(sys.argv)>1 else 'KR'
        async def start(age):
            await ev("()=>{ if(!$('devP')||$('devP').hidden) openDev(); }"); await pg.select_option('#devC',code); await pg.fill('#devA',str(age)); await pg.click('#devPlay'); await pg.wait_for_timeout(700)
            await ev("()=>{ if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); const c=G.life.cur; c.mDone=c.plan; (c.cal||[]).forEach(x=>x.done=1); c.sk=null; G.life.f.dying=0; G.sickT=0; }")
        async def clean(): await ev("()=>{ if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); $('flash').hidden=true; }")
        for age in [7,11,15,30]:
            await start(age); await clean()
            await ev("()=>{ W.map='out'; const d=doorOf('home'); W.x=d[0]; W.y=d[1]+1; NPCMAP={}; }"); await pg.wait_for_timeout(900); await clean()
            print(age,'살 · 갈 수 있는 곳',await ev("JSON.stringify(reachOf(G.life.age))"),'나무',await ev("OUT.trees.length"))
            await pg.screenshot(path=S+f'map_{code}_{age}.png')
            # 막힘 확인: 범위 밖으로 걸어가기
            await ev("()=>{ const r=reachOf(G.life.age); if(r[2]<OUT.w){ W.x=r[2]-1; W.y=Math.min(r[3]-2,OUT.RY-1.2); } }")
            await pg.keyboard.down('ArrowRight'); await pg.wait_for_timeout(700); await pg.keyboard.up('ArrowRight')
            print('   오른쪽 끝에서 더 가면 x =',round(await ev("W.x"),2),'(경계',await ev("reachOf(G.life.age)[2]"),')')
        # 건물 안: 30살로 동네 건물 하나씩 들어가 본다
        await start(30); await clean()
        for k in ['shop','friend','lib','market','rest','cafe','bank','hosp','hall','post','station','gym','study']:
            await clean(); await ev(f"()=>{{ W.map='out'; W.car=false; const d=doorOf('{k}'); W.x=d[0]; W.y=d[1]+.3; NPCMAP={{}}; }}")
            await pg.keyboard.down('ArrowUp'); await pg.wait_for_timeout(250); await pg.keyboard.up('ArrowUp'); await pg.wait_for_timeout(500)
            inside=await ev("W.map")
            # 주인 옆으로 가서 말 걸기
            await ev("()=>{ const n=(NPCMAP[W.map]||[]).find(n=>n.key==='p0'); if(n){ n.static=1; W.x=n.x; W.y=n.y+.9; } }"); await pg.wait_for_timeout(350)
            lab=await ev("$('btnAct').hidden?null:$('btnAct').textContent")
            talk='-'
            if lab and '말 걸기' in lab:
                await clean(); await ev("$('btnAct').click()"); await pg.wait_for_timeout(200); await ev("DLG.typing&&DLG.fin()"); talk=(await pg.inner_text('#dlg')).replace('\n',' / ')[:60]
                if k=='shop': await pg.screenshot(path=S+'place_shop_talk.png')
                await clean()
            # 첫 물건 앞에서 만져 보기
            await ev("()=>{ const f=furnOf(W.map)[1]||furnOf(W.map)[0]; W.x=f[1]+f[3]/2; W.y=f[2]+f[4]+.45; }"); await pg.wait_for_timeout(350)
            lab2=await ev("$('btnAct').hidden?null:$('btnAct').textContent"); obj='-'
            if lab2 and '말 걸기' not in lab2:
                await clean(); await ev("$('btnAct').click()"); await pg.wait_for_timeout(200); await ev("DLG.typing&&DLG.fin()"); obj=(await pg.inner_text('#dlg')).replace('\n',' / ')[:60]
                await pg.screenshot(path=S+f'place_{k}.png'); await clean()
            print(k,'안:',inside,'|',lab,'→',talk,'|',lab2,'→',obj)
        print('errs',errs[:5]); await b.close()
asyncio.run(main())
