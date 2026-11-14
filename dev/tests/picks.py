# 엔딩 '나의 기록 고르기' 시험: 세 순간·대표 장면·한 마디를 고르고, 마지막 기록 메뉴와 '지나온 삶' 목록에 보이는지
import asyncio
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','pick1'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(1000)
        await pg.click('#btnNew'); await pg.wait_for_timeout(500); await pg.evaluate("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); } })()"); await pg.wait_for_timeout(8000); await pg.click('#btnLive'); await pg.wait_for_timeout(1000)
        await ev("()=>{ G.running=false; if(!$('sheet').hidden) closeSheet(); const L=G.life; L.cur=null; L.runAuto(); if(!L.dead){ L.dead=true; L.lifespan=L.age; } finishLife(); }"); await pg.wait_for_timeout(800)
        for _ in range(40):
            if await pg.locator('#pkBox').count(): break
            await pg.click('#btnStep'); await pg.wait_for_timeout(200)
        print('고르기 장:',await pg.inner_text('#endIn .shead'),'| 고를 거리',await pg.locator('#pkBox .pk').count())
        await pg.locator('#pkBox .pk').nth(0).click(); await pg.locator('#pkBox .pk').nth(3).click(); await pg.locator('#pkBox .pk').nth(5).click()
        await pg.locator('#pkBox .pk').nth(3).locator('.pkstar').click(); await pg.locator('#pkBox .pk').nth(7).click()
        print('고른 수',await pg.inner_text('#pkN'))
        await pg.screenshot(path=S+'pick_slide.png')
        await pg.click('#btnStep'); await pg.wait_for_timeout(500)
        print('고른 장면:',(await pg.inner_text('#endIn .slide'))[:80].replace('\n',' / '))
        for _ in range(10):
            if await pg.locator('#lsum').count(): break
            if await pg.locator('#endIn [data-ans]').count(): await pg.locator('#endIn [data-ans]').first.click()
            if await pg.locator('#rq1').count(): await pg.fill('#rq1','엄마, 늘 밥을 챙겨 주셔서')
            await pg.click('#btnStep'); await pg.wait_for_timeout(300)
        await pg.fill('#lsum','끝까지 가족 곁을 지킨 사람'); await pg.fill('#ltitle','시험으로 산 삶'); await pg.wait_for_timeout(200)
        await pg.click('#btnStep'); await pg.wait_for_timeout(800)
        print('마지막 장:',await pg.inner_text('#endIn .shead'),'| 메뉴',await pg.locator('#recBox .rtabs button').all_inner_texts())
        print('나의 기록:',(await pg.inner_text('#recBox .rpane[data-r=mine]'))[:150].replace('\n',' / '))
        await pg.screenshot(path=S+'pick_record.png')
        await pg.click('#btnDone'); await pg.wait_for_timeout(1200)
        print('허브 목록:',(await pg.inner_text('#hubLives'))[:150].replace('\n',' / '))
        await pg.screenshot(path=S+'pick_hub.png',full_page=True)
        await pg.locator('#hubLives summary').first.click(); await pg.wait_for_timeout(400)
        print('펼침 메뉴:',await pg.locator('#hubLives .rtabs button').all_inner_texts())
        await pg.screenshot(path=S+'pick_hub_open.png',full_page=True)
        print('errs',errs); await b.close()
asyncio.run(main())
