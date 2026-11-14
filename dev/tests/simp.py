# sim.py 를 나라별로 나눠 페이지 2개에서 함께 돌린다(코어 2개). 사용: python3 dev/tests/simp.py dev/tests/sim_stats.js KR,US,NG 300
import asyncio,sys,json
from playwright.async_api import async_playwright
INIT="(()=>{ const r0=Math.random; window.__rng=r0; Math.random=function(){ return window.__rng(); }; })();"
async def run(b,js,cs,n):
    ctx=await b.new_context(); await ctx.route('https://**',lambda r:r.abort()); await ctx.add_init_script(INIT)
    pg=await ctx.new_page(); await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
    await pg.evaluate(f"window.SIMC='{','.join(cs)}'; window.SIMN={n}; 0"); r=await pg.evaluate(js); await ctx.close(); return r
async def main():
    js=open(sys.argv[1],encoding='utf8').read(); cs=sys.argv[2].split(','); n=int(sys.argv[3]) if len(sys.argv)>3 else 300
    async with async_playwright() as p:
        b=await p.chromium.launch(); parts=[cs[0::2],cs[1::2]]
        rs=await asyncio.gather(*[run(b,js,c,n) for c in parts if c]); await b.close()
    out={}
    for r in rs: out.update(r)
    for c in cs: print(c, out.get(c))
asyncio.run(main())
