# 플레이어처럼: 해마다 달력의 일을 직접 열어 고르고(아무 선택지나), 작은 선택도 하고, 나머지는 시간이 흐르게 둔다
import asyncio,sys,random,re,json
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
BAD=re.compile(r'undefined|NaN|\{[a-zA-Z0-9]+\}|\bnull\b|\[object')
async def play(b,code,seed):
    random.seed(seed); errs=[]; issues=[]; ctx=await b.new_context(viewport={'width':900,'height':420}); await ctx.route('https://**',lambda r:r.abort())
    pg=await ctx.new_page(); ev=pg.evaluate; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/index.html')
    await pg.click('#btnTeacher'); await pg.fill('#tCode','2026'); await pg.click('#btnTCode'); await pg.select_option('#tCountry',code); await pg.click('#tForm [data-k=sec] [data-v="8"]'); await pg.click('#btnTStart')
    await ev("G.sec=4; if(G.life.cur) G.life.cur.t=4")
    async def handle_sheet():
        for _ in range(12):
            for _ in range(12):   # 아래 대화창(사람이 나오는 선택·진로 이야기): 글을 넘기고 아무 선택지나 고른다
                if not await ev("dlgOpen()"): break
                await ev("DLG.typing&&DLG.fin()")
                n=await pg.locator('#dlg .dopts button').count()
                if n: await pg.locator('#dlg .dopts button').nth(random.randrange(n)).click()
                else: await ev("dlgNext()")
                await pg.wait_for_timeout(40)
            if not await pg.is_visible('#sheet'): return
            txt=await pg.inner_text('#sheetBox')
            m=BAD.search(txt)
            if m: issues.append((await ev("G.life.age"),'글자 이상:'+m.group(0),txt[:120].replace('\n',' ')))
            if await pg.locator('#sheet #btnAskNo').count(): await pg.click('#sheet #btnAskNo')
            elif await pg.locator('#sheet #btnOk').count(): await pg.click('#sheet #btnOk')
            else:
                bs=pg.locator('#sheetBox .opts button:not([disabled])'); n=await bs.count()
                if n: await bs.nth(random.randrange(n)).click()
                elif await pg.locator('#sheetBox .opts button').count(): issues.append((await ev("G.life.age"),'모든 선택지 막힘',txt[:80])); await ev("closeSheet()")
                else: await ev("closeSheet()")
            await pg.wait_for_timeout(60)
    lastAge=-1; t=0
    while t<6000:
        t+=1
        if await ev("!$('s-end').hidden"): break
        await handle_sheet()
        a=await ev("G.life?G.life.age:-1")
        if a!=lastAge:
            lastAge=a
            # 이 해의 일: 직접 다가가 연 것처럼
            n=await ev("(G.life&&G.life.cur&&G.life.ensureCal()||[]).length")
            for k in range(n):
                if await ev(f"!$('s-end').hidden||!G.life||G.life.age!=={a}||!G.life.cur||!G.life.cur.cal[{k}]||G.life.cur.cal[{k}].done"): continue
                try: await ev(f"fireCal({k})")
                except Exception as e: issues.append((a,'fireCal 오류',str(e)[:100]))
                await handle_sheet()
            ns=await ev("G.life&&G.life.cur?G.life.cur.scenes.length:0")
            for k in range(ns):
                if await ev(f"!G.life||!G.life.cur||!G.life.cur.scenes[{k}]||G.life.cur.scenes[{k}].done"): continue
                try: await ev(f"openScene({k})")
                except Exception as e: issues.append((a,'openScene 오류',str(e)[:100]))
                await handle_sheet()
            st=await ev("G.life?Object.fromEntries(Object.entries(G.life.s).map(([k,v])=>[k,Math.round(v)])):null")
            if st and any(v<0 or v>100 for v in st.values()): issues.append((a,'범위 밖',json.dumps(st)))
        await pg.wait_for_timeout(40)
    # 엔딩 넘기기
    shots=0; heads=[]
    for i in range(30):
        if not await pg.locator('#endIn .shead').count(): break
        h=await pg.inner_text('#endIn .shead'); heads.append(h.split('\n')[0])
        body=await pg.inner_text('#endIn .slide'); m=BAD.search(body)
        if m: issues.append(('엔딩','글자 이상:'+m.group(0),body[:120].replace('\n',' ')))
        if '모양' in h: await pg.wait_for_timeout(600); await pg.screenshot(path=S+f'play_{code}_shape.png',full_page=True)
        if not await pg.locator('#btnStep').count(): break
        await pg.click('#btnStep'); await pg.wait_for_timeout(120)
    L=await ev("(()=>{ const L=G.life; const H=(L.hist||[]).filter(h=>h.t!=null); return {c:L.c,age:L.age,life:L.lifespan,cause:causeOf(L).n,lim:L.limN||0,last:H.slice(-2),peak:peakOf(L)}; })()")
    await ctx.close(); return L,issues,errs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for i,code in enumerate(sys.argv[1:]):
            L,iss,errs=await play(b,code,i)
            print('==',code,'수명',L['life'],'사인',L['cause'],'막힌 선택',L['lim'],'| 가장 넓을 때',json.dumps(L['peak'],ensure_ascii=False))
            print('   마지막 기록',json.dumps(L['last'],ensure_ascii=False))
            for x in iss[:12]: print('   문제:',x)
            print('   오류:',errs[:5])
        await b.close()
asyncio.run(main())
