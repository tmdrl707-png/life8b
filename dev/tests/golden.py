# 엔진 '기준값' 시험: 난수·날짜를 고정하고 여러 삶을 자동으로 살려 기록 전체의 지문을 비교한다.
# 코드 정리(겉모습만 바꾸고 결과는 같아야 하는 일) 전후에 돌린다.
#   python3 dev/tests/golden.py save   → dev/tests/out/golden.json 에 저장
#   python3 dev/tests/golden.py        → 저장한 값과 비교 (다른 삶만 찍음)
import asyncio,sys,os,json
from playwright.async_api import async_playwright
H=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(H,'out','golden.json')
INIT="""(()=>{ const r0=Math.random; window.__rng=r0; Math.random=function(){ return window.__rng(); }; })();"""
async def main():
    js=open(os.path.join(H,'sim_golden.js'),encoding='utf8').read()
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(); await ctx.route('https://**',lambda r:r.abort())
        await ctx.add_init_script(INIT)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
        r=await pg.evaluate(js); await b.close()
    if errs: print('errs',errs)
    if 'save' in sys.argv:
        os.makedirs(os.path.dirname(OUT),exist_ok=True); json.dump(r,open(OUT,'w')); print('저장',r['all'],r['n'],'개'); return
    g=json.load(open(OUT)); diff=[(a,b) for a,b in zip(g['rows'],r['rows']) if a!=b]
    print('같음' if g['all']==r['all'] else '다름', r['all'], '(기준 %s)'%g['all'], '다른 삶 %d/%d'%(len(diff),r['n']))
    for a,b in diff[:8]: print('  ',a,'→',b)
asyncio.run(main())
