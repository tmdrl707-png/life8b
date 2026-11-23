# 11-22 점검 2차: 대화 중 스페이스가 '5살로' 단추를 누르지 않는지, 짧게 눌러도 움직이는지, Esc로 기억 창이 닫히는지
import asyncio, sys; sys.path.insert(0,'dev/tests'); import lib
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx,pg,errs=await lib.page(b)
        await lib.dev(pg,'GB',3,set_='U')
        ev=pg.evaluate
        await ev("()=>{ const s=$('btnSkip5'); if(s){ s.hidden=false; s.focus(); } dlgRun([{who:'아빠',t:'책상에 다녀오자.'},{who:'아빠',t:'고마워.'}]); }"); await pg.wait_for_timeout(600)
        print('대화 중 5살로 숨김:', await ev("getComputedStyle($('btnSkip5')).display"))
        for _ in range(3): await pg.keyboard.press(' '); await pg.wait_for_timeout(400)
        print('스페이스 뒤 확인창:', await ev("!$('sheet').hidden && $('sheetBox').textContent.slice(0,30)"), '· 대화 끝:', await ev("!dlgOpen()"))
        await ev("()=>{ if(!$('sheet').hidden) closeSheet(); }")
        x0=await ev("W.x"); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(400); x1=await ev("W.x")
        print('짧게 누른 오른쪽:', round(x1-x0,2))
        await ev("()=>openMem('all')"); await pg.wait_for_timeout(300); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
        print('Esc 뒤 기억 창 닫힘:', await ev("$('sheet').hidden"), '· 읽는 동안 멈춤 풀림:', await ev("!G.reading"))
        print('errs', errs[:3]); await b.close()
asyncio.run(main())
