# 개발자 모드 '지금 플레이 중' 탭 시험: 학생(한 창)이 플레이하는 동안 개발자(다른 창)가 목록·기록을 보고 대화한다. 같은 브라우저 저장소를 나눠 쓰는 두 창으로 흉내.
import asyncio
from playwright.async_api import async_playwright
from lib import *
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx,A,ea=await page(b)
        D=await ctx.new_page(); ed=[]; D.on('pageerror',lambda e:ed.append(str(e)[:200])); await D.goto(URL); await D.wait_for_timeout(700); await D.evaluate("Store.fb=false; Store.mode='local'; 0")
        await student(A,'s1'); await A.evaluate("FRIENDS.beat(); 0"); await A.wait_for_timeout(400)
        await D.evaluate("G.tok=1; openDev(); 0"); await D.click('#devP .dtabs [data-t=live]'); await D.wait_for_timeout(1500)
        t=await D.inner_text('#devP .panel'); print('목록:',t.replace('\n',' | ')[:200])
        await D.click('#devP [data-rec]'); await D.wait_for_timeout(500); print('기록:',(await D.inner_text('#devP .recbox'))[:120].replace('\n',' | '))
        await D.screenshot(path=OUT+'devlive_list.png')
        await D.click('#devP [data-chat]'); await D.fill('#lvIn','안녕, 잘 하고 있니?'); await D.press('#lvIn','Enter'); await D.wait_for_timeout(600)
        print('선생님 창:',(await D.inner_text('#lvMs')).replace('\n',' '))
        await A.evaluate('FRIENDS.open(); 0'); await A.wait_for_timeout(1500)
        print('학생 친구 목록:',(await A.inner_text('#frB')).replace('\n',' | ')[:120],'/ 안 읽음',await A.is_visible('#frPanel .nw'))
        await A.click('#frPanel .fc'); await A.wait_for_timeout(900); print('학생이 본 대화:',(await A.inner_text('#frMs')).replace('\n',' '))
        await A.fill('#frIn','네 선생님, 지금 5살이에요'); await A.press('#frIn','Enter'); await A.wait_for_timeout(500)
        await D.wait_for_timeout(4000); print('선생님이 본 대화:',(await D.inner_text('#lvMs')).replace('\n',' '))
        await D.screenshot(path=OUT+'devlive_chat.png'); await A.screenshot(path=OUT+'devlive_student.png')
        # 탭 바꾸면 선생님이 목록에서 사라지는지(알림 멈춤)
        await D.click('#devP .dtabs [data-t=play]'); await D.wait_for_timeout(500)
        print('탭을 바꾼 뒤 online/teacher-local:',await D.evaluate("(JSON.parse(localStorage.getItem('life8b_frdb')||'{}').online||{})['teacher-local']?'남아 있음':'없음'"))
        print('errs 학생',ea,'개발자',ed); await b.close()
asyncio.run(main())
