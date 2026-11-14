# 학생 화면 시험: 시간 배율 고르기(100살까지 걸리는 시간) · 선택 창이 떠도 시간이 흐르고 저절로 정해짐 · 저장하기 창에서는 멈춤 · 교사용 버튼 없음
import asyncio
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','flow1'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(1000)
        await pg.click('#btnNew'); await pg.wait_for_timeout(500); await pg.evaluate("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); } })()"); await pg.wait_for_timeout(8000)
        await pg.click('#bSet .seg[data-o="yl"] button[data-v="60"]'); await pg.wait_for_timeout(200)
        txt=await pg.inner_text('#bSet'); i=txt.find('플레이 시간'); print('설정:',txt[i:i+120].replace('\n',' '))
        await pg.screenshot(path=S+'flow_birth.png',full_page=True)
        await pg.click('#btnLive'); await pg.wait_for_timeout(1500)
        print('한 해 길이 G.sec',await ev("G.sec"),'| 다음 해로 숨김',await ev("$('btnNext').hidden"),'| 중요 사건 숨김',await ev("$('btnImp').hidden"),'| 저장 버튼',await pg.inner_text('#btnPause'))
        for _ in range(6):
            if await pg.is_visible('#sheet'): await ev("closeSheet()")
            await pg.wait_for_timeout(200)
        # 큰 사건을 띄우고 기다린다
        await ev("()=>{ G.running=false; let X; for(let i=0;i<30;i++){ X=new Life(); X.runAuto(15); if(!X.dead) break; } X.dead=false; X.yl=35; X.pace='short'; G.life=X; G.sec=35; startGame(); }"); await pg.wait_for_timeout(1500)
        for _ in range(8):
            if await pg.is_visible('#sheet'): await ev("$('btnOk')?$('btnOk').click():closeSheet()")
            await pg.wait_for_timeout(250)
        ok=await ev("()=>{ const L=G.life; L.cur.t=200; if(!L.majorLeft()) L.addMajor(); const m=L.major(); if(m==null) return false; openMajor(); return true; }")
        print('큰 사건 창',ok, (await pg.inner_text('#sheetBox'))[:70].replace('\n',' ') if ok else '')
        t0=await ev("G.life.cur.t"); await pg.wait_for_timeout(4000); t1=await ev("G.life.cur.t")
        print('창이 떠 있는 4초 동안 남은 시간',round(t0,1),'→',round(t1,1),'| 제한 막대',await pg.inner_text('#sheetBox .decbar') if await pg.locator('#sheetBox .decbar').count() else '없음')
        await pg.screenshot(path=S+'flow_major.png')
        await pg.wait_for_timeout(9500)
        print('13초 뒤:',(await pg.inner_text('#sheetBox'))[:60].replace('\n',' ') if await pg.is_visible('#sheet') else '창 닫힘','| 알림',(await pg.inner_text('#toasts'))[-60:].replace('\n',' '))
        await pg.screenshot(path=S+'flow_auto.png')
        for _ in range(8):
            if await pg.is_visible('#sheet'): await ev("$('btnOk')?$('btnOk').click():closeSheet()")
            await pg.wait_for_timeout(250)
        # 저장하기: 시간이 멈춘다
        await ev("()=>{ for(let i=0;i<6&&!$('sheet').hidden;i++) closeSheet(); $('btnPause').click(); }"); await pg.wait_for_timeout(300); a0=await ev("G.life.cur.t"); await pg.wait_for_timeout(2000); a1=await ev("G.life.cur.t")
        print('저장하기 창:',(await pg.inner_text('#sheetBox'))[:40].replace('\n',' '),'| 2초 동안',round(a0,2),'→',round(a1,2))
        await ev("$('btnOk').click()"); await pg.wait_for_timeout(1500); print('이어서 살기 뒤 시간 흐름',round(await ev("G.life.cur.t"),2))
        # 해가 끝날 때 창이 떠 있으면 정리하고 넘어간다
        age0=await ev("G.life.age"); await ev("()=>{ const L=G.life; L.cur.t=2; if(!L.majorLeft()) L.addMajor(); if(L.major()!=null) openMajor(); }"); await pg.wait_for_timeout(4000)
        print('해 넘김:',age0,'→',await ev("G.life.age"))
        await pg.screenshot(path=S+'flow_toasts.png')
        print('errs',errs); await b.close()
asyncio.run(main())
