# 휴대폰 가로(약 780×360, 고해상도) 화면 시험: 정보창·알림·결과 글·대화창·개발자 막대가 화면을 얼마나 가리는지 찍어 본다
import asyncio,sys
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for (w,h,tag) in [(780,360,'m780'),(844,390,'m844'),(667,375,'m667')]:
            ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=3,is_mobile=True,has_touch=True); await ctx.route('https://**',lambda r:r.abort())
            pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
            await pg.screenshot(path=S+f'{tag}_login.png')
            await ev("()=>openDev()"); await pg.fill('#devCode','2026'); await pg.click('#devGo'); await pg.fill('#devA','10'); await pg.click('#devPlay'); await pg.wait_for_timeout(900)
            await ev("()=>{ for(let i=0;i<6&&!$('sheet').hidden;i++) closeSheet(); W.map='out'; const d=doorOf('home'); W.x=d[0]+3; W.y=d[1]+2; NPCMAP={}; }"); await pg.wait_for_timeout(500)
            await ev("()=>{ toast('2036년 · 10살 · 가을','year'); calToast(11,'온 가족이 모여 김장을 했다. 손이 빨갛게 얼었지만 막 버무린 김치에 수육을 싸 먹었다.',{r:3,j:2}); flash('11월 · 나의 선택','허리가 아팠지만 쌀 바구니가 차오를 때 뿌듯했다.',{r:2,h:1},'K'); }")
            await pg.wait_for_timeout(700); await pg.screenshot(path=S+f'{tag}_game.png')
            await ev("()=>{ $('flash').hidden=true; const n=(NPCMAP.out||[]).find(n=>n.kind==='p'); if(n) openTalk({npc:n}); }"); await pg.wait_for_timeout(1500); await pg.screenshot(path=S+f'{tag}_talk.png')
            await ev("()=>{ if(dlgOpen()) dlgClose(); const L=G.life; if(!L.majorLeft()) L.addMajor(); if(L.major()!=null) openMajor(); }"); await pg.wait_for_timeout(600); await pg.screenshot(path=S+f'{tag}_major.png')
            await ev("()=>{ closeSheet(); openInfo('me'); }"); await pg.wait_for_timeout(500); await pg.screenshot(path=S+f'{tag}_info.png')
            print(tag,'errs',errs); await ctx.close()
        await b.close()
asyncio.run(main())
