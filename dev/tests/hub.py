import asyncio,sys
from playwright.async_api import async_playwright
import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); from lib import *
async def run(p,W,H,mob):
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=1,is_mobile=mob,has_touch=mob); await ctx.route('https://**',lambda r:r.abort())
    pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300])); ev=pg.evaluate
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
    await pg.fill('#uid','ui'+str(W)); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(900)
    await pg.click('#btnNew'); await pg.wait_for_timeout(400); await ev("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=[['r'],['h'],['k'],['r'],['h']]; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext')&&$('vNext').click(); } })()"); await pg.wait_for_timeout(600)
    await pg.click('#bSet .seg[data-o=tut] button[data-v="0"]'); await pg.click('#btnLive'); await pg.wait_for_timeout(1800)
    for _ in range(6):
        if await pg.is_visible('#sixU'): await ev("document.querySelectorAll('#sixU button').forEach(b=>b.click())")
        await pg.wait_for_timeout(250)
    print(await ev("({run:G.running,gh:$('s-game').hidden,wh:$('hubWrap').hidden,age:G.life&&G.life.age})"))
    print('hbtns visible',await ev("$('btnInfo').offsetParent!==null"))
    await pg.wait_for_timeout(800); await pg.click('#btnHub'); await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+f'u1_{W}.png')
    print('tray',await ev("[...document.querySelectorAll('#hubTray .hi')].map(d=>d.textContent.trim()+':'+Math.round(d.getBoundingClientRect().bottom))"))
    await pg.click('#btnMe'); await pg.wait_for_timeout(500); print('info open',await ev("!$('sheet').hidden"))
    await ev("closeSheet()"); await pg.click('#btnHub'); await pg.click('#btnRec'); await pg.wait_for_timeout(400); print('mem open',await ev("!$('sheet').hidden")); await ev("closeSheet()")
    await pg.click('#btnHub'); await pg.click('#btnLeave'); await pg.wait_for_timeout(400); print('exit sheet',await ev("$('sheetBox').textContent.slice(0,60)")); await pg.screenshot(path=OUT+f'u2_{W}.png'); await ev("closeSheet()")
    await pg.click('#btnHub'); await pg.click('#btnSet'); await pg.wait_for_timeout(300)
    print('prob btns',await ev("[...document.querySelectorAll('#setPanel .sq[data-k=prob] button')].map(b=>b.textContent)"))
    async def st(k,v): await pg.click(f'#setPanel .sq[data-k={k}] button[data-v="{v}"]'); await pg.wait_for_timeout(250)
    for combo in [('mp','bl'),('ms','l'),('sp','tc'),('sr','0')]: await st(*combo)
    await pg.screenshot(path=OUT+f'u3_{W}.png')
    await st('mp','mr'); await st('sp','bl');
    await pg.click('#setX'); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+f'u4_{W}.png')
    await pg.click('#btnHub'); await pg.click('#btnSet'); await st('mp','bl'); await st('ms','s'); await pg.click('#setX'); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+f'u5_{W}.png')
    await pg.click('#btnHub'); await pg.click('#btnSet'); await st('mp','off'); await st('sp','off'); await pg.click('#setX'); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+f'u6_{W}.png')
    print('saved',await ev("JSON.stringify(ls('life8b_ui'))"), errs)
    await b.close()
async def main():
    async with async_playwright() as p:
        await run(p,1366,768,False); await run(p,844,390,True)
asyncio.run(main())
