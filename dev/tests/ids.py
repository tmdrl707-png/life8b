from playwright.sync_api import sync_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
FIN="""()=>{ const L=G.life; for(let y=0;y<70;y++){ L.startPeriod(); let g=0; while(L.pending&&g++<6) L.choose(0); const cal=L.ensureCal()||[]; cal.forEach((it,k)=>{ if(!it.done){ const ev=L.calEv(it); L.calDo(k,ev&&ev.opts?0:null); } }); L.endPeriod(); if(L.dead) break; } L.lifespan=L.age; }"""
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1100,'height':900}); ctx.route('https://**',lambda r:r.abort()); pg=ctx.new_page()
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]+' @ '+str(getattr(e,'stack',''))[:400]))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(800); pg.evaluate("Store.fb=false; Store.mode='local'")
    def login(i,pw):
        pg.fill('#uid',i); pg.fill('#upw',pw); pg.click('#btnLogin'); pg.wait_for_timeout(700)
        return pg.evaluate("[!$('s-hub').hidden,$('loginErr').textContent]")
    print('login1',login('민지','abc123'))
    # 삶 하나 살고 끝내기 -> 허브
    pg.click('#btnNew'); pg.wait_for_timeout(500); pg.evaluate("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); } })()"); pg.wait_for_timeout(300); pg.click('#btnLive'); pg.wait_for_timeout(500)
    pg.evaluate(FIN); pg.evaluate("finishLife()"); pg.wait_for_timeout(600)
    for _ in range(40):
        if not pg.locator('#btnStep').count(): break
        pg.click('#btnStep'); pg.wait_for_timeout(60)
    pg.fill('#ltitle','별을 따라간 삶') if pg.locator('#ltitle').count() else None
    pg.click('#btnDone'); pg.wait_for_timeout(800)
    print('hub',pg.evaluate("!$('s-hub').hidden"))
    pg.click('#hubLives summary'); pg.wait_for_timeout(300)
    pg.screenshot(path=S+'hubdet.png',full_page=True)
    print('rec keys',pg.evaluate("Object.keys(G.data.lives[0]).join(',')"))
    pg.click('#btnLogout'); pg.wait_for_timeout(300)
    print('login2 wrong',login('민지','zzzzzz')); 
    # 교사
    pg.click('#btnTeacher'); pg.fill('#tCode','2026'); pg.click('#btnTCode'); pg.wait_for_timeout(800)
    pg.screenshot(path=S+'tids0.png',full_page=True)
    print('list',pg.inner_text('#tIdList')[:200].replace('\n',' | '))
    pg.click('[data-iv="민지"]'); pg.wait_for_timeout(500); pg.click('[data-ibox="민지"] summary'); pg.wait_for_timeout(300); pg.screenshot(path=S+'tids1.png',full_page=True)
    # 미리 등록 + 등록 전용
    pg.click('#tIds > details > summary'); pg.fill('#tIdAdd','가온\n나래\nx'); pg.click('#btnTIdAdd'); pg.wait_for_timeout(500); print('msg',pg.inner_text('#tIdMsg'))
    pg.check('#tIdClosed'); pg.wait_for_timeout(300)
    # 초기화
    pg.click('[data-ir="민지"]'); pg.click('[data-ir="민지"]'); pg.wait_for_timeout(300); print('reset',pg.inner_text('#tIdMsg'))
    pg.screenshot(path=S+'tids2.png',full_page=True)
    pg.click('#btnTBack'); pg.wait_for_timeout(400)
    print('hub?',pg.evaluate("[!$('s-login').hidden,!$('s-hub').hidden]"))
    pg.evaluate("show('login')")
    print('closed new',login('새친구','abc123'))
    print('prereg 가온',login('가온','qwe123'), pg.evaluate("($('hubNow').querySelector('p.small')||{}).textContent"))
    pg.click('#btnLogout'); pg.wait_for_timeout(200)
    print('reset 민지 new pw',login('민지','newpw1'), pg.evaluate("[(G.data.lives||[]).length]"))
    pg.click('#btnLogout'); pg.wait_for_timeout(200)
    print('old pw rejected',login('민지','abc123'))
    # 삭제
    pg.click('#btnTeacher'); pg.wait_for_timeout(800)
    pg.click('[data-id="나래"]'); pg.click('[data-id="나래"]'); pg.wait_for_timeout(300); print('del',pg.inner_text('#tIdMsg'))
    print(errs); b.close()
