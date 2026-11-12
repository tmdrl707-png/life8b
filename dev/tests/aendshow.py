import asyncio
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1280,'height':760},device_scale_factor=1); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html')
        await pg.click('#btnTeacher'); await pg.fill('#tCode','2026'); await pg.click('#btnTCode'); await pg.select_option('#tCountry','KR'); await pg.click('#btnTStart')
        await pg.evaluate("""()=>{ const L=G.life; for(let y=0;y<45;y++){ L.startPeriod(); let g=0; while(L.pending&&g++<6) L.choose(0); const cal=L.ensureCal()||[]; cal.forEach((it,k)=>{ if(!it.done){ const ev=L.calEv(it); L.calDo(k,ev&&ev.opts?0:null); } }); L.endPeriod(); if(L.dead) break; } L.lifespan=L.age; }""")
        await pg.evaluate("finishLife()"); await pg.wait_for_timeout(600)
        n=0; heads=[]
        while True:
            heads.append(await pg.inner_text('#endIn .shead'))
            if any(w in heads[-1] for w in ['모양','스쳐','넓었던 때의','한 문장','마지막 순간']):
                await pg.wait_for_timeout(700); await pg.screenshot(path=S+f'aend_{n:02d}.png')
            if not await pg.locator('#btnStep').count(): break
            if n==3:
                await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300); await pg.click('#btnPrev'); await pg.wait_for_timeout(200)
            await pg.click('#btnStep'); await pg.wait_for_timeout(350); n+=1
            if n>40: break
        print('\n'.join(h.replace('\n',' ') for h in heads)); print(errs[:5]); await b.close()
asyncio.run(main())
