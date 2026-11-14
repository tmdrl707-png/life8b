from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':800})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(1500)
    pg.evaluate("G.teacher=true;G.tid=tNewId();G.troom=null;birth(); if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); }")
    for t in (600,1500,3500,9000):
        pg.wait_for_timeout(t if t==600 else 900 if t==1500 else 2000 if t==3500 else 5500)
        print(t, pg.evaluate("[document.getElementById('s-birth').className, [...document.querySelectorAll('#bInfo b')].map(x=>x.textContent)]"))
        pg.screenshot(path=f'roll_{t}.png')
    # skip test
    pg.evaluate("birth(); if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); }"); pg.wait_for_timeout(700); pg.click('#bInfo'); pg.wait_for_timeout(500)
    print('skip', pg.evaluate("[document.getElementById('s-birth').className, [...document.querySelectorAll('#bInfo b')].map(x=>x.textContent)]"))
    print(errs); b.close()
