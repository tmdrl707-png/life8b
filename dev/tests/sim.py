# 엔진 계산만 빠르게 돌려 보는 도구: 페이지를 연 뒤 JS 파일(또는 식)을 실행하고 결과(JSON)를 찍는다.
# 예) python3 dev/tests/sim.py dev/tests/sim_money.js
import asyncio,sys,os,json
from playwright.async_api import async_playwright
async def main():
    src=sys.argv[1]; js=open(src,encoding='utf8').read() if os.path.exists(src) else src
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
        if errs: print("load errs",errs)
        r=await pg.evaluate(js)
        print(json.dumps(r,ensure_ascii=False,indent=1) if not isinstance(r,str) else r)
        if errs: print('errs',errs)
        await b.close()
asyncio.run(main())
