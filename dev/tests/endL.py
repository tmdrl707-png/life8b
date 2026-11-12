import asyncio,sys
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
tag=sys.argv[1] if len(sys.argv)>1 else 'x'
async def run(b,nm,vp):
    ctx=await b.new_context(viewport=vp,device_scale_factor=1); await ctx.route('https://**',lambda r:r.abort())
    pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8765/index.html')
    await pg.click('#btnTeacher'); await pg.fill('#tCode','2026'); await pg.click('#btnTCode'); await pg.select_option('#tCountry','KR'); await pg.click('#btnTStart')
    await pg.evaluate("""()=>{ const L=G.life; for(let y=0;y<60;y++){ L.startPeriod(); let g=0; while(L.pending&&g++<6) L.choose(0); const cal=L.ensureCal()||[]; cal.forEach((it,k)=>{ if(!it.done){ const ev=L.calEv(it); L.calDo(k,ev&&ev.opts?0:null); } }); L.endPeriod(); if(L.dead) break; } L.lifespan=L.age; }""")
    await pg.evaluate("finishLife()"); await pg.wait_for_timeout(700)
    n=0; info=[]
    while n<40:
        await pg.wait_for_timeout(450)
        h=(await pg.inner_text('#endIn .shead')).replace('\n',' ')
        m=await pg.evaluate("(()=>{const e=document.scrollingElement; const s=document.querySelector('#endIn .slide'); const r=s?s.getBoundingClientRect():null; return {sh:e.scrollHeight,vh:innerHeight,sw:e.scrollWidth,vw:innerWidth,slide:r?[Math.round(r.width),Math.round(r.height)]:null}})()")
        info.append((n,h,m))
        await pg.screenshot(path=S+f'eL_{tag}_{nm}_{n:02d}.png')
        if not await pg.locator('#btnStep').count(): break
        await pg.click('#btnStep'); n+=1
    for x in info: print(nm,x)
    print(nm,'errs',errs[:3]); await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,'desk',{'width':1366,'height':768})
        await run(b,'land',{'width':844,'height':390})
        await b.close()
asyncio.run(main())
