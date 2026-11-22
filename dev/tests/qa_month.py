# 11-22 점검: 달력 일이 달 순서대로 나오는지, 계절이 달과 맞는지, 철 지난 장면이 거둬지는지 (영국 맨체스터 5~8살)
import asyncio, sys; sys.path.insert(0,'dev/tests'); import lib
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx,pg,errs=await lib.page(b)
        await lib.dev(pg,'GB',6,set_='U',sec=20)
        await pg.evaluate("()=>{ window.__log=[]; const _f=fireCal; fireCal=function(k){ const L=G.life, it=L.cur.cal[k]; window.__log.push([L.age, monthNow(), it.m]); return _f.apply(this,arguments); }; }")
        for _ in range(140):
            await pg.wait_for_timeout(500)
            await pg.evaluate("()=>{ const s=$('sheet'); if(!s.hidden){ const b=s.querySelector('.opts button')||$('btnOk')||s.querySelector('.btn.primary'); if(b) b.click(); } const d=$('sixU'); if(d&&!d.hidden&&$('sixUOk')) $('sixUOk').click(); if(typeof dlgOpen==='function'&&dlgOpen()) dlgClose(); }")
        log=await pg.evaluate("window.__log"); late=[x for x in log if x[1]-x[2]>2]
        print('달력', len(log), '개 · 늦게 나온 것(2달 넘게)', len(late), late[:5])
        print('지금', await pg.evaluate("()=>{ const L=G.life; return [L.age, ymOf(monthNow()).m, seasonOf(L)]; }"))
        print('errs', errs[:3]); await b.close()
asyncio.run(main())
