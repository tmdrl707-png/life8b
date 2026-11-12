# 미션 대화 시험: 8살 아이에게 미션을 주고, 부탁 받기 → 다녀오기 → 돌아와 알리기를 대화창으로 끝까지 해 본다.
# 미션이 없을 때 같은 사람에게 가면 보통 말 걸기가 나오는지도 본다.
import asyncio,sys,os
from playwright.async_api import async_playwright
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1280,'height':720}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html')
        await pg.wait_for_timeout(800)
        await pg.click('#btnDev'); await pg.fill('#devCode','2026'); await pg.click('#devGo'); await pg.wait_for_timeout(300)
        await ev(f"(()=>{{ DEV.c='{sys.argv[1] if len(sys.argv)>1 else 'KR'}'; $('devA').value=8; devStart('play'); }})()"); await pg.wait_for_timeout(1500)
        await ev("(()=>{ if(!$('sheet').hidden) closeSheet(); const L=G.life; L.q=null; L.lastQ=-1; })()")
        qi=await ev("""(()=>{ const L=G.life; for(let t=0;t<200&&!L.q;t++) L.questOffer(); return L.q?L.q.i:null; })()""")
        print('나이',await ev('G.life.age'),'미션',qi, await ev("G.life.q?QUESTS[G.life.q.i].ask:null"))
        if qi is None: print('미션을 받지 못함'); print('errs',errs); await b.close(); return
        async def step(tag):
            await ev("(()=>{ if(!$('sheet').hidden) closeSheet(); $('flash').hidden=true; G.life.cur.scenes.forEach(c=>c.done=1); const t=targets().find(t=>t.type==='q'); W.map=t.m; NPCMAP={}; W.car=false; W.x=t.p[0]+.3; W.y=t.p[1]; G.life.cur.scenes=[]; })()")
            await pg.wait_for_timeout(500)
            other=await ev("$('sheet').hidden?null:$('sheetBox').innerText.slice(0,60)")
            if other: print('   (그 사이 열린 다른 창 닫음:',other.replace('\n',' '),')'); await ev("closeSheet()"); await pg.wait_for_timeout(200)
            await ev("G.life.cur.scenes=[]"); await pg.wait_for_timeout(200)
            lab=await ev("$('btnAct').hidden?null:$('btnAct').textContent"); print(tag,'버튼:',lab,'· 맵',await ev('W.map'))
            await pg.click('#btnAct'); await pg.wait_for_timeout(300)
            print('   팝업 창 열림:',not await ev("$('sheet').hidden"))
            for _ in range(8):
                if not await pg.is_visible('#dlg'): break
                await ev('DLG.typing&&DLG.fin()'); await pg.wait_for_timeout(100)
                print('   대화창:',(await pg.inner_text('#dlg')).replace('\n',' / ')[:120])
                if await pg.locator('#dlg .dopts').count():
                    await pg.screenshot(path=S+f'quest_{tag}.png'); await pg.locator('#dlg .dopts button').first.click(); await pg.wait_for_timeout(250)
                else:
                    await pg.click('#dlg'); await pg.wait_for_timeout(150)
            print('   단계:',await ev("G.life.q?G.life.q.st:'끝'"),'멈춤 풀림:',not await ev('paused'))
        s0=await ev("JSON.stringify(G.life.s)")
        await step('1_부탁')
        await step('2_다녀오기')
        await step('3_알리기')
        print('능력치 전',s0); print('능력치 후',await ev("JSON.stringify(G.life.s)"))
        print('기억에 남음:',await ev("(G.life.mem||[]).slice(-1).map(m=>m.l+' · '+m.t)"))
        print('errs',errs)
        await b.close()
asyncio.run(main())
