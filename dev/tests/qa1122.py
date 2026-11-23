# QA 리포트(11-22) 확인: 3살에 끝난 삶 → 인생 기록 탭 글자 대비, 그래프 NaN, 콘솔 오류
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':768}); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m: errs.append('console:'+m.text[:160]) if m.type=='error' else None); ev=pg.evaluate
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800); await ev("Store.fb=false; Store.mode='local'")
        await pg.fill('#uid','qa1'); await pg.fill('#upw','123456'); await pg.click('#btnLogin'); await pg.wait_for_timeout(1000)
        await pg.click('#btnNew'); await pg.wait_for_timeout(500); await pg.evaluate("(()=>{ if($('s-vow')&&!$('s-vow').hidden){ VOW.a=['r','h','k']; VOW.st=VOW_Q.length+1; vowDraw(); $('vNext').click(); } })()"); await pg.wait_for_timeout(2500)
        await ev("()=>{ G.running=false; if(!$('sheet').hidden) closeSheet(); const L=G.life; L.cur=null; L.runAuto(3); if(!L.dead){ L.dead=true; L.lifespan=L.age; L.cause='sick'; if(!L.C||L.c!=='TZ'){}  } finishLife(); }"); await pg.wait_for_timeout(2500); await pg.screenshot(path='dev/tests/out/qa_end1.png'); print('slide1 sc:', await ev("[...document.querySelectorAll('#endIn canvas, #endIn img')].map(e=>e.dataset.sc||e.src||e.className).slice(0,4)"))
        for _ in range(20):
            if await pg.locator('#endIn .rtabs').count(): break
            for b2 in await pg.locator('#endIn [data-ans]').all(): await b2.click(); break
            if await pg.locator('#btnStep').count()==0: break
            await pg.click('#btnStep'); await pg.wait_for_timeout(300)
        tabs=await ev("[...document.querySelectorAll('#endIn .rtabs button')].map(b=>b.dataset.r)")
        print('tabs',tabs)
        bad=[]
        for t in tabs:
            await pg.click(f'#endIn .rtabs button[data-r={t}]'); await pg.wait_for_timeout(200)
            r=await ev("""(t)=>{ const pane=document.querySelector('#endIn .rpane[data-r='+t+']'); if(!pane) return 'nopane';
              const lum=c=>{ const m=c.match(/[\\d.]+/g).map(Number); const f=v=>{v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}; return [.2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2]), m[3]==null?1:m[3]]; };
              const bgOf=el=>{ while(el){ const c=getComputedStyle(el).backgroundColor; const m=c.match(/[\\d.]+/g); if(m&&(m[3]==null||+m[3]>.5)) return c; el=el.parentElement; } return 'rgb(255,255,255)'; };
              const out=[]; pane.querySelectorAll('*').forEach(el=>{ if(!el.childNodes.length||![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) return; if(!el.offsetParent) return;
                const [l1]=lum(getComputedStyle(el).color), [l2]=lum(bgOf(el)); const cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05); if(cr<3) out.push(cr.toFixed(1)+' '+el.tagName+' '+el.className+' '+el.textContent.trim().slice(0,20)); });
              return out.slice(0,4); }""",t)
            bad.append((t,r))
        for x in bad: print(x)
        print(await ev("""()=>[...document.querySelectorAll('#endIn .rpane')].map(p=>{ const o=[]; p.querySelectorAll('*').forEach(el=>{ const c=getComputedStyle(el).backgroundColor; const m=c.match(/[\\d.]+/g); if(m&&+m[0]>230&&+m[1]>230&&(m[3]==null||+m[3]>.5)) o.push(el.tagName+'.'+el.className); }); return p.dataset.r+': '+[...new Set(o)].slice(0,5).join(' '); })"""))
        await pg.click('#endIn .rtabs button[data-r=sum]'); await pg.wait_for_timeout(200); await pg.screenshot(path='dev/tests/out/qa_rec.png')
        await ev("()=>{ const b=$('btnDone'); if(b) b.click(); }"); await pg.wait_for_timeout(1200)
        for _ in range(3):
            if await pg.locator('#btnBack').count() and await pg.locator('#btnBack').is_visible(): await pg.click('#btnBack'); await pg.wait_for_timeout(900)
        await ev("()=>{ const d=document.querySelector('#hubLives details'); if(d){ d.open=true; } const s=document.querySelector('#hubLives summary'); }"); await pg.wait_for_timeout(300)
        print('hub:', await ev("""()=>{ const w=document.querySelector('#hubLives'); if(!w) return 'no hub'; const lum=c=>{ const m=c.match(/[\\d.]+/g).map(Number); const f=v=>{v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}; return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2]); };
          const bgOf=el=>{ while(el){ const c=getComputedStyle(el).backgroundColor; const m=c.match(/[\\d.]+/g); if(m&&(m[3]==null||+m[3]>.5)) return c; el=el.parentElement; } return 'rgb(255,255,255)'; };
          let n=0,bad=[]; w.querySelectorAll('.rpane').forEach(p=>p.hidden=false); w.querySelectorAll('*').forEach(el=>{ if(![...el.childNodes].some(x=>x.nodeType===3&&x.textContent.trim())||!el.offsetParent) return; n++; const a=lum(getComputedStyle(el).color), b=lum(bgOf(el)); const cr=(Math.max(a,b)+.05)/(Math.min(a,b)+.05); if(cr<3&&el.tagName!=='BUTTON') bad.push(cr.toFixed(1)+' '+el.tagName+' '+el.textContent.trim().slice(0,15)); }); return n+' texts, bad '+bad.length+' '+bad.slice(0,4).join(' | '); }"""))
        await pg.screenshot(path='dev/tests/out/qa_hub.png', full_page=True)
        print('errs',errs[:6]); await b.close()
asyncio.run(main())
