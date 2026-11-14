import asyncio
from playwright.async_api import async_playwright
import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); from lib import *
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','fl1'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(900)
        await pg.click('#btnNew'); await pg.wait_for_timeout(400); await ev("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=[['r'],['h'],['k'],['r'],['h']]; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext')&&$('vNext').click(); } })()"); await pg.wait_for_timeout(600)
        await pg.click('#bSet .seg[data-o=tut] button[data-v="0"]'); await pg.click('#btnLive'); await pg.wait_for_timeout(1800)
        for _ in range(6):
            if await pg.is_visible('#sixU'): await ev("document.querySelectorAll('#sixU button').forEach(b=>b.click())")
            await pg.wait_for_timeout(300)
        print('age',await ev("G.life.age"),'hp',await ev("G.hardPause"))
        t0=await ev("G.life.cur.t"); await ev("dlgRun([{who:'a',t:'안녕'}],null)"); await pg.wait_for_timeout(3000); t1=await ev("G.life.cur.t"); print('dlg',t0,t1,await ev("[paused,dlgOpen()]"))
        await ev("dlgClose()")
        await ev("sheet('<h2>x</h2><div class=opts><button>a</button></div>')"); t0=await ev("G.life.cur.t"); await pg.wait_for_timeout(3000); t1=await ev("G.life.cur.t"); print('sheet',t0,t1)
        await ev("closeSheet()")
        await ev("DEC.next='auto'; sheet('<h2>x</h2><div class=opts><button>a</button></div>')"); t0=await ev("G.life.cur.t"); await pg.wait_for_timeout(3000); t1=await ev("G.life.cur.t"); print('major',t0,t1)
        print(errs); await b.close()
asyncio.run(main())
