# 엔딩 2판 시험: 학생이 어린 나이에 끝난 삶 → 12장 대신 짧은 흐름 → 기록을 남긴 뒤에야 '다른 삶' 제안, 기록 메뉴 '돈과 행복'·답 저장
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','early1'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(1000)
        for kind,age in [('young',6),('old',None)]:
            await pg.click('#btnNew'); await pg.wait_for_timeout(8500); await pg.click('#btnLive'); await pg.wait_for_timeout(1000)
            await ev(f"()=>{{ G.running=false; if(!$('sheet').hidden) closeSheet(); const L=G.life; L.cur=null; L.runAuto({age or 'undefined'}); if(!L.dead){{ L.dead=true; L.lifespan=L.age; L.cause='sudden'; }} finishLife(); }}"); await pg.wait_for_timeout(800)
            heads=[]
            for _ in range(20):
                heads.append((await pg.inner_text('#endIn .shead')).split('\n')[0])
                for b2 in await pg.locator('#endIn [data-ans]').all(): await b2.click(); break
                if await pg.locator('#rq0').count(): await pg.fill('#rq0','공부를 더 하고 싶어서')
                if await pg.locator('#btnStep').count()==0: break
                await pg.click('#btnStep'); await pg.wait_for_timeout(250)
            print(kind,len(heads),'장:',heads)
            print('  마지막 장 다른 삶 버튼(있으면 안 됨):',await pg.locator('#btnAgain').count())
            await pg.click('#endIn .rtabs button[data-r=life]'); await pg.wait_for_timeout(200)
            print('  돈과 행복:',(await pg.inner_text('#endIn .rpane[data-r=life]'))[:90].replace('\n',' / '))
            await pg.click('#btnDone'); await pg.wait_for_timeout(900)
            if kind=='young':
                print('  남긴 뒤 제안:',(await pg.inner_text('#endIn'))[:120].replace('\n',' / '), '| 버튼',await pg.locator('#btnAgain').count())
                await pg.click('#btnBack'); await pg.wait_for_timeout(800)
            print('  저장된 답:',await ev("G.data.lives.slice(-1)[0].ans"), '| hpf' ,await ev("!!G.data.lives.slice(-1)[0].hpf"))
        print('errs',errs); await b.close()
asyncio.run(main())
