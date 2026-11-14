# 말 걸기·만져 보기·인생 기록 메뉴 시험: 집(아기)·밖(어린이)·학교(청소년)에서 A 버튼을 눌러 보고, 엔딩의 기록 메뉴를 모두 넘겨 본다
import asyncio,sys
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1280,'height':720}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html')
        await pg.click('#btnTeacher'); await pg.fill('#tCode','2026'); await pg.click('#btnTCode'); await pg.select_option('#tCountry',sys.argv[1] if len(sys.argv)>1 else 'KR'); await pg.click('#btnTStart')
        await pg.wait_for_timeout(9000)
        for sel in ['#btnGo','#btnBorn','#btnStart']:
            if await pg.locator(sel).count() and await pg.is_visible(sel): await pg.click(sel); break
        await pg.wait_for_timeout(800)
        async def tryAt(tag,x,y):
            await ev(f"(()=>{{ if($('sixU')&&!$('sixU').hidden) $('sixUOk').click(); if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); $('flash').hidden=true; const c=G.life.cur; c.mDone=c.plan; (c.cal||[]).forEach(x=>x.done=1); c.sk=null; W.x={x}; W.y={y}; G.life.cur.scenes.forEach(c=>c.done=1); if(G.life.q) G.life.q=null; }})()"); await pg.wait_for_timeout(400)
            lab=await ev("$('btnAct').hidden?null:$('btnAct').textContent")
            print(tag,'버튼:',lab)
            if lab:
                await pg.click('#btnAct'); await pg.wait_for_timeout(300)
                pages=[]
                for _ in range(8):
                    if not await pg.is_visible('#dlg'): break
                    await pg.wait_for_timeout(120); await pg.screenshot(path=S+f'talk_{tag}_typing.png') if not pages else None
                    await ev('DLG.typing&&DLG.fin()'); await pg.wait_for_timeout(100)   # 다 나오게
                    pages.append((await pg.inner_text('#dlg')).replace('\n',' / ')[:110])
                    if await pg.locator('#dlg .dopts').count():
                        await pg.screenshot(path=S+f'talk_{tag}.png'); await pg.locator('#dlg .dopts button').first.click(); await pg.wait_for_timeout(250)
                    else:
                        await pg.screenshot(path=S+f'talk_{tag}_r.png'); await pg.click('#dlg'); await pg.wait_for_timeout(150)
                        if await pg.is_visible('#dlg'): continue
                for x in pages: print('   대화창:',x)
                print('   닫힘:',not await pg.is_visible('#dlg'),'멈춤 풀림:',not await ev('paused'))
        print('나이',await ev("G.life.age"),'맵',await ev("W.map"))
        await tryAt('아기_소파',9.1,2.4)
        await tryAt('아기_책상',9.1,7.7)
        await ev("(()=>{ const n=(NPCMAP.home||[]).find(n=>n.key==='mom'); if(n){ n.static=1; } })()")
        mx,my=await ev("(()=>{ const n=(NPCMAP.home||[]).find(n=>n.key==='mom'); return n?[n.x+.6,n.y]:[3.2,2.7]; })()")
        await tryAt('아기_엄마',mx,my)
        # 어린이: 밖에서 나무·사람
        await ev("(()=>{ if($('sixU')&&!$('sixU').hidden) $('sixUOk').click(); const L=G.life; L.age=9; L.f.elem=1; W.map='out'; NPCMAP={}; })()"); await pg.wait_for_timeout(500)
        await tryAt('어린이_나무',8.5,9.9)
        nx,ny=await ev("(()=>{ const n=(NPCMAP.out||[]).find(n=>n.kind==='p'); n.static=1; return [n.x+.5,n.y]; })()")
        await tryAt('어린이_이웃',nx,ny)
        # 청소년: 학교 안
        await ev("(()=>{ const L=G.life; L.age=15; L.f.sec=1; W.map='mid'; NPCMAP={}; })()"); await pg.wait_for_timeout(500)
        await tryAt('청소년_칠판',7,1.6)
        await tryAt('청소년_책장',2.2,7.9)
        await ev("(()=>{ const n=(NPCMAP.mid||[]).find(n=>n.key==='p0'); n.static=1; })()")
        tx,ty=await ev("(()=>{ const n=(NPCMAP.mid||[]).find(n=>n.key==='p0'); return [n.x+.6,n.y]; })()")
        await tryAt('청소년_선생님',tx,ty)
        print('올해 기록',await ev("JSON.stringify(G.life.cur.tk&&{n:G.life.cur.tk.n,o:G.life.cur.tk.o})"),'기술',await ev("Math.round(G.life.s.t*10)/10"))
        # 엔딩의 인생 기록 메뉴
        await ev("""()=>{ const L=G.life; for(let y=0;y<45;y++){ L.startPeriod(); let g=0; while(L.pending&&g++<6) L.choose(0); const cal=L.ensureCal()||[]; cal.forEach((it,k)=>{ if(!it.done){ const ev=L.calEv(it); L.calDo(k,ev&&ev.opts?0:null); } }); const r=L.endPeriod(); if(r&&r.dead) break; } if(!L.dead){ L.dead=1; } }""")
        await ev("finishLife()"); await pg.wait_for_timeout(800)
        for _ in range(40):
            if not await pg.locator('#btnStep').count(): break
            if await pg.locator('#rq0').count(): await pg.fill('#rq0','태어난 곳이 달랐다')
            if await pg.locator('#ltitle').count(): await pg.fill('#ltitle','시험 삶')
            await pg.click('#btnStep'); await pg.wait_for_timeout(250)
        tabs=await pg.locator('#recBox .rtabs button').all_inner_texts(); print('기록 메뉴:',tabs)
        for i,t in enumerate(tabs):
            await pg.locator('#recBox .rtabs button').nth(i).click(); await pg.wait_for_timeout(300)
            vis=await ev("[...document.querySelectorAll('#recBox .rpane')].filter(p=>!p.hidden).map(p=>p.dataset.r+':'+p.innerText.slice(0,50).replace(/\\n/g,' '))")
            print('  ',t,'→',vis); await pg.screenshot(path=S+f'rec_{i}.png')
        await pg.locator('#recBox .rpane:not([hidden]) .rnext').count()
        print('errs',errs)
        await b.close()
asyncio.run(main())
