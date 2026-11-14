/* 82-devrec: 개발자 모드에 '기록·아이디' 탭 (11-14 선생님 요청)
   - 교사용 화면에 있던 '내 체험 기록'(#tRec)·'학생 아이디 관리'(#tIds)를 개발자 창으로 옮겼다. 창을 열 때 그 안으로 들어오고, 다시 그릴 때는 #devRecHome으로 돌려놓는다.
   - 저장된 삶을 자세히 본다(lifeNowHTML: 이름·나이·나라·사는 곳·형편·여섯 능력치·행복·돈·직업·최근 기억), 지금 삶·쉬는 삶·마친 삶을 하나씩 지울 수 있다.
   - 학생 아이디: 비밀번호 초기화·아이디 지우기·미리 등록·등록 전용은 예전 그대로(ui/02). */
(function(){
  const css=document.createElement('style'); css.textContent=`
#devP .dtabs{display:flex;gap:6px;border-bottom:2px solid #E3DCCB;margin:-2px 0 4px}
#devP .dtabs button{border:0;background:none;font:700 15px inherit;padding:8px 14px;color:#7A6F55;border-bottom:3px solid transparent;margin-bottom:-2px;cursor:pointer}
#devP .dtabs button.on{color:#1E2B37;border-bottom-color:#E2703A}
#devP .panel{border:1.5px solid #E3DCCB;border-radius:12px;padding:12px;background:#fff;display:flex;flex-direction:column;gap:8px}
#devP .panel h3{margin:0}#devP .lives{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
#devP .lives li{border:1px solid #E3DCCB;border-radius:10px;padding:8px 10px;background:#FBFAF6}
#devP .small{font-size:.85rem}#devP .sub{color:#5A6A78}
#devP .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#devP .btn{font:inherit;font-size:.88rem;padding:6px 12px;border-radius:8px;border:1.5px solid #8A94A0;background:#fff;color:#1E2B37;cursor:pointer}
#devP .btn.primary{background:#2B5FB8;border-color:#2B5FB8;color:#fff}#devP .btn.ghost{background:transparent}
#devP .btn.danger{border-color:#C2405A;color:#B03030}
#devP .idrow{display:flex;flex-wrap:wrap;gap:6px;justify-content:space-between;align-items:center}#devP .idrow .btns{display:flex;gap:6px;flex-wrap:wrap}
#devP input[type=text],#devP textarea{font:inherit;padding:6px 10px;border-radius:8px;border:1.5px solid #C9C2B2;width:100%;box-sizing:border-box}
#devP .nowL{border-left:4px solid #2B5FB8;padding:6px 10px;background:#F2F6FD;border-radius:0 10px 10px 0;margin:6px 0}
#devP .nowL h5{margin:0 0 4px;font-size:.95rem}
#devP .six{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:4px 10px;margin:4px 0}
#devP .six div{font-size:.84rem}#devP .six i{display:block;height:7px;border-radius:4px;background:#DDE3EC;margin-top:2px;overflow:hidden}#devP .six i b{display:block;height:100%;background:#4C9BFF}
#devP .six .lk{opacity:.5}
#devP ol.mm{margin:4px 0 0 18px;padding:0;font-size:.82rem;color:#3A4250}`;
  document.head.appendChild(css);
  const when=t=>{ if(!t) return ''; const x=new Date(t); return `${x.getMonth()+1}/${x.getDate()} ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`; };
  // ---- 저장된 삶 하나를 자세히 ----
  window.lifeNowHTML=function(dump){ let L; try{ L=Life.load(dump); }catch(e){ return '<p class="small sub">이 삶을 읽지 못했어요.</p>'; }
    try{ const C=L.C||{}, f=L.f||{}, v=L.sixNow(), job=(()=>{ try{ const j=L.job; return j&&(j.n||j.name)||''; }catch(e){ return ''; } })();
      const bars=SIX.map(k=>{ const open=L.sixOpen(k), n=Math.round(clamp(v[k]||0,0,100)); return `<div class="${open?'':'lk'}">${SIX_N[k]} <b>${open?n:'—'}</b>${open?'':` <span class="sub">(${SIX_AGE[k]}살에 열림)</span>`}<i><b style="width:${open?n:0}%"></b></i></div>`; }).join('');
      const mem=(L.mem||[]).slice(-6).map(m=>`<li>${m.a!=null?m.a+'살 · ':''}${esc(String(m.t||'').slice(0,90))}</li>`).join('');
      const fam=(FAM[L.famI]||{}).n||'';
      return `<div class="nowL"><h5>${esc(L.name)} · ${L.dead?(L.lifespan||L.age):L.age}세${L.dead?' (마침)':''}</h5>
        <p class="small">${esc(C.n||'')} ${SETN[L.set]||''} · ${esc(fam)} · ${L.sex?'여자':'남자'} · 선택 ${L.n||0}번${job?' · 일: '+esc(job):''}${f.retired?' · 은퇴':''}</p>
        <div class="six">${bars}</div>
        <p class="small">행복 <b>${Math.round((L.s&&L.s.j)||0)}</b> · 가진 돈 <b>${fmtWon(L.cash||0)}</b>${L.house?' · 집 '+fmtWon(L.house):''}${L.sick?' · 아픔':''}</p>
        ${mem?`<details><summary class="small">최근 기억 ${Math.min(6,(L.mem||[]).length)}개</summary><ol class="mm">${mem}</ol></details>`:''}</div>`; }catch(e){ return '<p class="small sub">자세히 보지 못했어요.</p>'; } };
  // ---- 학생 계정의 일부를 지우기 ----
  Store.adminPatch=async function(o,path,val){ if(this.fb){ await this.db('PUT','users/'+o.key+'/'+path,val===undefined?null:val); }
    else{ const a=ls('life8b_acc_'+o.id)||{}, d=a.data=a.data||{}, p=path.split('/'), k=p.pop(); let t=d; for(const x of p){ if(t[x]==null||typeof t[x]!=='object') return; t=t[x]; } if(val==null) delete t[k]; else t[k]=val; ls('life8b_acc_'+o.id,a); }
    ls('life8b_cache_'+o.id,null); };
  const arm=(b,txt)=>{ if(b.dataset.armed!=='1'){ b.dataset.armed='1'; b.dataset.t0=b.textContent; b.textContent=txt||'정말 지울까요?'; setTimeout(()=>{ if(b.isConnected&&b.dataset.armed==='1'){ b.dataset.armed='0'; b.textContent=b.dataset.t0; } },4000); return false; } return true; };
  // ---- 학생 계정 기록 보기 (자세히 + 하나씩 지우기) ----
  async function showUser(o,bx){ bx.hidden=false; bx.innerHTML='<p class="small sub">불러오는 중…</p>';
    let d; try{ d=await Store.adminUser(o); }catch(e){ bx.innerHTML=`<p class="err">${esc(Store.msg(e))}</p>`; return; } d=d||{};
    const lv=(d.lives||[]).map((l,i)=>({l,i})).reverse(), slots=Object.entries(d.slots||{});
    bx.innerHTML=`<p class="small sub">마지막 저장 ${when(d.t)||'—'}${d.room?' · 학급 방 '+esc(d.room):''}</p>
      <b class="small">지금 살고 있는 삶</b>${d.save?lifeNowHTML(d.save)+'<div class="row"><button class="btn danger" data-dsave>이 삶 지우기</button></div>':'<p class="small sub">없습니다.</p>'}
      ${slots.length?`<b class="small">쉬고 있는 삶 ${slots.length}개</b>${slots.map(([id,s])=>`${lifeNowHTML(s.d||s)}<div class="row"><button class="btn danger" data-dslot="${esc(id)}">이 삶 지우기</button></div>`).join('')}`:''}
      <b class="small">마친 삶 ${lv.length}개</b>${lv.length?`<ul class="lives">${lv.map(({l,i})=>`<li><details><summary>${lifeSummaryHTML(l)}</summary>${lifeDetailHTML(l)}<div class="row" style="margin-top:6px"><button class="btn danger" data-dlive="${i}">이 기록 지우기</button></div></details></li>`).join('')}</ul>`:'<p class="small sub">없습니다.</p>'}`;
    const redo=()=>showUser(o,bx), run=async(f)=>{ try{ await f(); }catch(e){ bx.insertAdjacentHTML('afterbegin',`<p class="err">${esc(Store.msg(e))}</p>`); return; } redo(); };
    const s1=bx.querySelector('[data-dsave]'); if(s1) s1.onclick=()=>{ if(arm(s1)) run(()=>Store.adminPatch(o,'save',null)); };
    bx.querySelectorAll('[data-dslot]').forEach(b=>b.onclick=()=>{ if(arm(b)) run(()=>Store.adminPatch(o,'slots/'+b.dataset.dslot,null)); });
    bx.querySelectorAll('[data-dlive]').forEach(b=>b.onclick=()=>{ if(arm(b)){ const i=+b.dataset.dlive; run(()=>Store.adminPatch(o,'lives',(d.lives||[]).filter((_,k)=>k!==i))); } }); }
  // renderTIds가 그린 뒤 '기록 보기'를 자세히 보기로 바꾼다
  { const _r=renderTIds; renderTIds=async function(){ const r=await _r.apply(this,arguments); try{ const box=$('tIdList'); box.querySelectorAll('[data-iv]').forEach(b=>b.onclick=()=>{ const o=TI.list.find(x=>x.id===b.dataset.iv), bx=box.querySelector(`[data-ibox="${CSS.escape(o.id)}"]`); if(!bx) return; if(!bx.hidden){ bx.hidden=true; return; } showUser(o,bx); }); }catch(e){} return r; }; }
  // 내 체험 기록에도 자세히 보기
  { const _t=renderTRec; renderTRec=async function(){ const r=await _t.apply(this,arguments); try{ const d=TStore.data; $('tSaves').querySelectorAll('li').forEach(li=>{ const g=li.querySelector('[data-go]'); if(!g||!d.saves[g.dataset.go]||li.querySelector('.nowL')) return; li.insertAdjacentHTML('beforeend',`<details><summary class="small">자세히 보기</summary>${lifeNowHTML(d.saves[g.dataset.go].dump)}</details>`); }); }catch(e){} return r; }; }
  // ---- 개발자 창에 탭 ----
  let tab='play';
  const home=()=>$('devRecHome');
  const stash=()=>{ const h=home(); ['tRec','tIds'].forEach(id=>{ const e=$(id); if(e&&h&&e.parentElement!==h) h.appendChild(e); }); };
  const _od=openDev;
  openDev=function(){ stash(); _od.apply(this,arguments); if(!G.tok) return; const d=$('devP'), box=d.querySelector('.dbox'); if(!box) return;
    const h2=box.querySelector('h2'), tabs=document.createElement('div'); tabs.className='dtabs';
    tabs.innerHTML=`<button data-t="play" class="${tab==='play'?'on':''}">체험</button><button data-t="rec" class="${tab==='rec'?'on':''}">기록·아이디</button>`; h2.insertAdjacentElement('afterend',tabs);
    tabs.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; tab=b.dataset.t; openDev(); };
    if(tab==='rec'){ [...box.children].forEach(c=>{ if(c===h2||c===tabs||c.querySelector('#devX')) return; c.style.display='none'; }); h2.innerHTML='개발자 모드 <small class="note">저장된 기록과 아이디 · 자세히 보기와 지우기</small>';
      const wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;gap:12px'; wrap.appendChild($('tRec')); wrap.appendChild($('tIds')); tabs.insertAdjacentElement('afterend',wrap);
      const r=$('tRec'); r.querySelector('h3').textContent='선생님 체험 기록 (교사용 모드에서 한 체험)'; renderTRec(); renderTIds(true);
      wrap.addEventListener('click',e=>{ if(e.target.closest('[data-go]')) setTimeout(()=>{ if(G.life&&G.running) d.hidden=true; },50); }); }
  };
})();
