import asyncio
from playwright.async_api import async_playwright
import sys; sys.path.insert(0,'dev/tests')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','qa2'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(1000)
        await pg.click('#btnNew'); await pg.wait_for_timeout(500); await ev("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); } })()"); await pg.wait_for_timeout(2500)
        await ev("()=>{ if(!$('sheet').hidden) closeSheet(); ls('life8b_sixhud','A'); renderHud(); }")
        print('A 행복:', await ev("!!document.querySelector('#hRes .sA .jw')"), (await pg.inner_text('#hRes'))[:60].replace('\n',' '))
        await ev("()=>{ openSettings ? 0:0 }") if False else None
        await ev("()=>{ $('btnHub').click(); }"); await pg.wait_for_timeout(300)
        await ev("()=>{ const b=$('btnSet'); if(b) b.click(); }"); await pg.wait_for_timeout(300)
        n=await pg.locator('#uiReset').count(); print('reset btn',n)
        if n: await ev("()=>$('uiReset').click()"); await pg.wait_for_timeout(300)
        print('처음대로 뒤:', await ev("ls('life8b_sixhud')"), await ev("!!document.querySelector('#hRes .sB')"))
        r=await ev("()=>{ dlgRun([{who:'내 자리',t:'한 문제 더 풀어 볼까?',opts:['네','아니요'],then:()=>[]}]); const before=!$('dlg').hidden; G.running=false; persist(true); openHub(); startGame(); return [before, $('dlg').hidden, paused]; }")
        await pg.wait_for_timeout(500); print('대화창 열림→나가기→이어서:', r)
        print('errs',errs); await b.close()
asyncio.run(main())
