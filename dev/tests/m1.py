from playwright.sync_api import sync_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch()
    for nm,vp in [('desk',{'width':1280,'height':800}),('land',{'width':844,'height':390})]:
        ctx=b.new_context(viewport=vp); ctx.route('https://**',lambda r:r.abort()); pg=ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(1800); pg.screenshot(path=S+f'm_{nm}_land.png')
        pg.evaluate("G.teacher=true;G.tid=tNewId();G.troom=null;birth(); if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); }"); pg.wait_for_timeout(2500); pg.screenshot(path=S+f'm_{nm}_birth1.png')
        pg.wait_for_timeout(5500); pg.screenshot(path=S+f'm_{nm}_birth2.png',full_page=True)
        pg.click('#btnLive'); pg.wait_for_timeout(1500); pg.screenshot(path=S+f'm_{nm}_game.png')
        print(nm,errs)
    b.close()
