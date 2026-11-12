# 개발자 모드 시험: 코드 → 나라·나이 골라 플레이 → +1년·+5년·나이로 가기·큰 사건 → 엔딩(처음·마지막 장) → 개발자 메뉴로 돌아오기, 저장되지 않는지 확인
import asyncio,sys
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1280,'height':720}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        pg.on('dialog',lambda d:asyncio.ensure_future(d.accept('40')))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.click('#btnDev'); await pg.fill('#devCode','2026'); await pg.click('#devGo')
        await pg.screenshot(path=S+'dev_menu.png')
        for code,age in [('NG',13),('JP',30)]:
            await pg.select_option('#devC',code); await pg.fill('#devA',str(age)); await pg.click('#devP .seg[data-k=set] button[data-v=R]')
            await pg.click('#devPlay'); await pg.wait_for_timeout(1500)
            print(code,'시작 나이',await ev("G.life.age"),'나라',await ev("G.life.C.n"),'사는 곳',await ev("G.life.set"),'막대',await pg.inner_text('#devBar'))
            await pg.screenshot(path=S+f'dev_play_{code}.png')
            for a in ['y1','y5','age']:
                if await pg.is_visible('#sheet'): await ev("closeSheet()")
                await pg.click(f'#devBar button[data-a={a}]'); await pg.wait_for_timeout(500); print('  ',a,'→',await ev("G.life&&G.life.age"))
            if await pg.is_visible('#sheet'): await ev("closeSheet()")
            await pg.click('#devBar button[data-a=major]'); await pg.wait_for_timeout(400); print('   큰 사건 창:',(await pg.inner_text('#sheetBox'))[:50].replace('\n',' ') if await pg.is_visible('#sheet') else '없음')
            await ev("closeSheet()")
            await pg.click('#devBar button[data-a=end]'); await pg.wait_for_timeout(1200)
            print('   엔딩:',await pg.inner_text('#endIn .shead'))
            await pg.click('#devBar button[data-a=last]'); await pg.wait_for_timeout(600); print('   마지막 장:',await pg.inner_text('#endIn .shead'))
            await pg.screenshot(path=S+f'dev_end_{code}.png')
            await pg.click('#devBar button[data-a=first]'); await pg.wait_for_timeout(400); print('   처음 장:',await pg.inner_text('#endIn .shead'))
            await pg.click('#devBar button[data-a=last]'); await pg.wait_for_timeout(400)
            await pg.click('#btnDone'); await pg.wait_for_timeout(600)
            print('   돌아옴: 메뉴',await pg.is_visible('#devP'),'저장된 교사 기록',await ev("(TStore.data&&TStore.data.lives||[]).length"))
        # 바로 엔딩 두 가지
        await pg.fill('#devA','0'); await pg.click('#devEndAll'); await pg.wait_for_timeout(1500); print('끝까지:',await ev("G.life.lifespan"),'살',await pg.inner_text('#endIn .shead'))
        await pg.click('#devBar button[data-a=menu]'); await pg.fill('#devA','5'); await pg.click('#devEndHere'); await pg.wait_for_timeout(1500); print('5살 엔딩:',await ev("G.life.lifespan"),'살')
        await pg.click('#devBar button[data-a=quit]'); await pg.wait_for_timeout(400); print('끝내기 후 화면 login:',await pg.is_visible('#s-login'),'막대 숨김',await ev("$('devBar').hidden"))
        print('errs',errs); await b.close()
asyncio.run(main())
