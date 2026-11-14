# 학생처럼 0~20살을 살아 보는 시험: 시간이 실제로 흐르는 학생 모드에서, 파란 미션은 받으면 바로 다녀오고,
# 대화·팝업은 아무 선택지나 고른다. 해마다 미션이 언제 왔는지(한 해의 몇 %), 해냈는지, 능력치, 이상한 글자, 오류를 찍는다.
# 20살이 되면 남은 삶을 저절로 살리고 엔딩을 끝까지 넘겨 본다.
#   python3 dev/tests/young.py [삶 수=2] [한 해 초=12] [tut=0|1]
import asyncio, sys, random, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.async_api import async_playwright
from lib import *
NL = int(sys.argv[1]) if len(sys.argv) > 1 else 2
SEC = int(sys.argv[2]) if len(sys.argv) > 2 else 12
TUT = int(sys.argv[3]) if len(sys.argv) > 3 else 0

async def life(b, k):
    random.seed(k); ctx, pg, errs = await page(b, phone=(k % 2 == 1)); ev = pg.evaluate
    await student(pg, f'yg{k}{random.randint(100,999)}', tut=TUT)
    info = await ev("(()=>{ const L=G.life; return L.C.n+' '+(L.set==='R'?'농촌':'도시')+' '+L.age+'살' })()")
    print(f'== 삶 {k+1} ({"휴대폰" if k%2 else "컴퓨터"}): {info}')
    await ev(f"(()=>{{ G.sec={SEC}; if(G.life.cur) G.life.cur.t=Math.min(G.life.cur.t,{SEC}); }})(); 0")
    year = {}; bad = []; last_age = -1; t_act = 0
    for tick in range(4000):
        st = await ev("""(()=>{ const L=G.life; if(!L) return null; const c=L.cur||{};
          return {a:L.age, dead:!!L.dead, end:!$('s-end').hidden, q:L.q?{st:L.q.st,i:L.q.i}:null, t:c.t, sec:G.sec,
            dlg:typeof dlgOpen==='function'&&dlgOpen(), sh:!$('sheet').hidden, u:!!($('sixU')&&!$('sixU').hidden),
            tut:!!($('tut')&&!$('tut').hidden), toasts:[...document.querySelectorAll('#toasts .toast')].map(x=>x.innerText).join(' | ')}; })()""")
        if not st or st['end'] or st['dead']: break
        a = st['a']
        if a != last_age:
            if last_age >= 0:
                y = year[last_age]; y['six'] = await ev("(()=>{ const s=G.life.s; return ['h','r','e','k','t','m','j'].map(k=>k+Math.round(s[k]||0)).join(' ') })()")
            await ev(f"(()=>{{ G.sec={SEC}; if(G.life.cur) G.life.cur.t=Math.min(G.life.cur.t,{SEC}); }})(); 0")
            year[a] = {'qAt': None, 'qDone': 0, 'q': 0, 'sheets': 0, 'dlgs': 0}; last_age = a
            if a >= 20: break
        y = year[a]
        for txt in [st['toasts']]:
            m = BAD.search(txt or '')
            if m: bad.append((a, '알림', txt[:100]))
        if st['q'] and y['qAt'] is None and st['t'] is not None:
            y['qAt'] = round(100 - st['t'] / max(1, st['sec']) * 100); y['q'] += 1
        if st['u']: await ev("(()=>{ const ok=$('sixUOk'); ok?ok.click():$('sixU').querySelectorAll('button').forEach(b=>b.click()); })(); 0")
        elif st['tut']: await ev("(()=>{ const n=document.querySelector('#tut .nx'); n&&n.click(); })(); 0")
        elif st['dlg']:
            y['dlgs'] += 1
            txt = await ev("DLG.typing&&DLG.fin(), $('dlg').innerText")
            m = BAD.search(txt or '')
            if m: bad.append((a, '대화', txt[:100].replace('\n', ' ')))
            n = await pg.locator('#dlg .dopts button').count()
            if n: await pg.locator('#dlg .dopts button').nth(random.randrange(n)).click()
            else: await ev("dlgNext(); 0")
        elif st['sh']:
            y['sheets'] += 1
            txt = await pg.inner_text('#sheetBox')
            m = BAD.search(txt)
            if m: bad.append((a, '팝업', txt[:100].replace('\n', ' ')))
            bs = pg.locator('#sheetBox .opts button:not([disabled])'); n = await bs.count()
            if n: await bs.nth(random.randrange(n)).click()
            else: await ev("(()=>{ const ok=$('btnOk')||$('sheetBox').querySelector('.btn.primary'); ok?ok.click():closeSheet(); })(); 0")
        elif st['q'] and tick - t_act > 5:
            t_act = tick
            moved = await ev("""(()=>{ const t=targets().find(t=>t.type==='q'); if(!t) return false; if(W.map!==t.m){ W.map=t.m; NPCMAP={}; } W.car=false; W.x=t.p[0]+.3; W.y=t.p[1]; return true; })()""")
            if moved:
                await pg.wait_for_timeout(250)
                await ev("(()=>{ if($('sheet').hidden&&!$('btnAct').hidden) $('btnAct').click(); })(); 0")
            st2 = await ev("G.life.q?G.life.q.st:'끝'")
            if st2 == '끝': y['qDone'] += 1
        await pg.wait_for_timeout(120)
    print('  나이 미션(받은 때 %·해냄) 팝업/대화 수 · 해 끝 능력치')
    for a in sorted(year):
        y = year[a]; print(f"  {a:>2}살 미션 {y['q']}({y['qAt'] if y['qAt'] is not None else '-'}%·{y['qDone']}) 창 {y['sheets']}/{y['dlgs']} · {y.get('six','')}")
    # 엔딩
    await ev("(()=>{ G.running=false; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); const L=G.life; if(!L.dead) L.runAuto(); finishLife(); })(); 0")
    await pg.wait_for_timeout(1500); heads = []
    for i in range(30):
        if not await pg.locator('#endIn .shead').count(): break
        h = (await pg.inner_text('#endIn .shead')).split('\n')[0]; heads.append(h)
        body = await pg.inner_text('#endIn .slide'); m = BAD.search(body)
        if m: bad.append(('엔딩', h, body[:100].replace('\n', ' ')))
        if not await pg.locator('#btnStep').count(): break
        await pg.click('#btnStep'); await pg.wait_for_timeout(200)
    print('  엔딩', len(heads), '장 · 수명', await ev("G.life.lifespan"), '·', ' / '.join(heads[:3]), '…')
    for x in bad[:10]: print('  이상한 글자:', x)
    print('  오류:', errs[:5]); await ctx.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for k in range(NL): await life(b, k)
        await b.close()
asyncio.run(main())
