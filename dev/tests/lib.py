# 시험 스크립트가 함께 쓰는 도우미. 화면이 바뀌면 여기만 고치면 된다.
#   from lib import *            (dev/tests 안의 스크립트에서)
#   ctx,pg,errs = await page(b)                 # 컴퓨터 1366×768 (phone=True 면 휴대폰 가로 844×390)
#   await dev(pg,'KR',age=6)                    # 개발자 모드로 나라·나이를 골라 바로 시작 (시간은 학생처럼 흐르지 않음)
#   await teacher(pg,'KR',age=6)                # 교사용 '체험하기'로 시작
#   await student(pg,'s1')                      # 학생 로그인 → 소중한 것 설문 → 안내 건너뛰기(바로 6살)
#   await settle(pg)                            # 능력치 안내·가운데 창·대화창 정리
import os, re
URL = 'http://localhost:8765/index.html'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out') + '/'
os.makedirs(OUT, exist_ok=True)
BAD = re.compile(r'undefined|NaN|\{[a-zA-Z0-9]+\}|\bnull\b|\[object')
QUIET = re.compile(r'agent-proxy|jsdelivr|googleapis|gstatic')

async def page(b, phone=False, w=None, h=None, local=True):
    W, H = (844, 390) if phone else (1366, 768)
    ctx = await b.new_context(viewport={'width': w or W, 'height': h or H}, is_mobile=phone, has_touch=phone)
    await ctx.route('https://**', lambda r: r.abort())
    pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await pg.goto(URL); await pg.wait_for_timeout(700)
    if local: await pg.evaluate("Store.fb=false; Store.mode='local'; 0")
    return ctx, pg, errs

async def settle(pg):
    await pg.evaluate("""(()=>{ for(let i=0;i<6;i++){ const u=$('sixU'); if(u&&!u.hidden){ const ok=$('sixUOk'); ok?ok.click():u.querySelectorAll('button').forEach(b=>b.click()); }
      if(typeof dlgOpen==='function'&&dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); } })(); 0""")

async def dev(pg, code='KR', age=6, set_=None, fam=None, sex=None, sec=None):
    js = f"G.tok=1; openDev(); DEV.c='{code}'; $('devA').value={age};"
    if set_: js += f" DEV.set='{set_}';"
    if fam is not None: js += f" DEV.famI={fam};"
    if sex is not None: js += f" DEV.sex={sex};"
    if sec: js += f" DEV.sec={sec};"
    await pg.evaluate("(()=>{ " + js + " devStart('play'); })(); 0")
    await pg.wait_for_timeout(900); await settle(pg)

async def teacher(pg, code='KR', age=6):
    await pg.click('#btnTeacher'); await pg.fill('#tCode', '2026'); await pg.click('#btnTCode'); await pg.wait_for_timeout(300)
    await pg.select_option('#tCountry', code)
    await pg.click(f'#tExp [data-k=age] [data-v="{age}"]')
    await pg.click('#btnTExp'); await pg.wait_for_timeout(1500)
    for _ in range(40):   # 태어나는 연출을 넘긴다
        if await pg.is_visible('#s-game'): break
        await pg.mouse.click(400, 300); await pg.wait_for_timeout(250)
    await settle(pg)

async def student(pg, uid, pw='123456', tut=0):
    await pg.fill('#uid', uid); await pg.fill('#upw', pw); await pg.click('#btnLogin'); await pg.wait_for_timeout(900)
    await pg.click('#btnNew'); await pg.wait_for_timeout(400)
    await pg.evaluate("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=[['r'],['h'],['k'],['r'],['h']]; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext')&&$('vNext').click(); } })(); 0")
    await pg.wait_for_timeout(500)
    await pg.click(f'#bSet .seg[data-o=tut] button[data-v="{tut}"]'); await pg.click('#btnLive'); await pg.wait_for_timeout(1800)
    for _ in range(40):
        if await pg.is_visible('#s-game'): break
        await pg.mouse.click(400, 300); await pg.wait_for_timeout(250)
    await settle(pg)

async def to_end(pg):
    """개발자 모드에서: 남은 삶을 저절로 살리고 엔딩으로 간다"""
    await pg.evaluate("(()=>{ const L=G.life; if(!L.dead) L.runAuto(); if(!L.dead) devKill(L); devToEnd(); })(); 0")
    await pg.wait_for_timeout(1500)
