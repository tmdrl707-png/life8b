import asyncio, sys
from playwright.async_api import async_playwright
import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); from lib import *
W,H=(int(sys.argv[1]),int(sys.argv[2])) if len(sys.argv)>2 else (1366,768)
MOB=W<900; TUT=(sys.argv[3] if len(sys.argv)>3 else '1')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=1 if not MOB else 2,is_mobile=MOB,has_touch=MOB); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','tu'+TUT+str(W)); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(900)
        await pg.click('#btnNew'); await pg.wait_for_timeout(400); await ev("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=[['r'],['h'],['k'],['r'],['h']]; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext')&&$('vNext').click(); } })()"); await pg.wait_for_timeout(600)
        await pg.click(f'#bSet .seg[data-o=tut] button[data-v="{TUT}"]'); await pg.wait_for_timeout(200)
        print('opt tut',await ev("G.opts.tut"))
        await pg.screenshot(path=OUT+f'tu_set.png',full_page=True)
        await pg.click('#btnLive'); await pg.wait_for_timeout(1800)
        if TUT=='0':
            for _ in range(6):
                if await pg.is_visible('#sixU'): await ev("document.querySelectorAll('#sixU button').forEach(b=>b.click())")
                await pg.wait_for_timeout(300)
            print('skip: age',await ev("G.life.age"),'map',await ev("W.map"),await ev("$('toasts').innerText.slice(0,200)"))
            await pg.screenshot(path=OUT+'tu_skip.png'); print(errs); await b.close(); return
        n=0
        while await pg.is_visible('#tut') and n<20:
            await pg.screenshot(path=OUT+f'tu0_{n}.png'); await pg.click('#tut .nx'); await pg.wait_for_timeout(350); n+=1
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=OUT+f'tu_btn_{W}.png')
        print('btn5 vis',await pg.is_visible('#btnSkip5'),'age',await ev('G.life.age'))
        await ev("$('btnSkip5').click()"); await pg.wait_for_timeout(400); await pg.click('#btnSk5Go'); await pg.wait_for_timeout(2500)
        print('after0: age',await ev("G.life.age"),'tut',await ev("G.life.f.tut"),'tutvis',await pg.is_visible('#tut'))
        n=0
        while await pg.is_visible('#tut') and n<20:
            await pg.screenshot(path=OUT+f'tu5_{n}.png'); await pg.click('#tut .nx'); await pg.wait_for_timeout(350); n+=1
        await pg.wait_for_timeout(1000)
        print('after5: age',await ev("G.life.age"),'tut',await ev("G.life.f.tut"),'quest',await ev("!!G.life.q"),'sixU',await pg.is_visible('#sixU'),'paused',await ev("paused+' '+G.hardPause"))
        await pg.screenshot(path=OUT+'tu_end.png')
        print(errs); await b.close()
asyncio.run(main())
