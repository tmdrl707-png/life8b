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
#devP ol.mm{margin:4px 0 0 18px;padding:0;font-size:.82rem;color:#3A4250}
#devP .lvms{max-height:300px;min-height:120px;overflow:auto;display:flex;flex-direction:column;gap:6px;border:1px solid #E3DCCB;border-radius:10px;padding:8px;background:#FBFAF6}
#devP .lvb{max-width:82%;padding:6px 10px;border-radius:12px;background:#fff;border:1px solid #E3DCCB;font-size:.9rem;word-break:break-all;align-self:flex-start}
#devP .lvb.me{align-self:flex-end;background:#DCEBFF;border-color:#BBD3F7}#devP .lvb i{display:block;font-style:normal;font-size:.72rem;color:#8A8068;margin-top:2px}
#devP .recbox{margin-top:6px}#devP .dot{color:#E5484D}`;
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
  // ---- 지금 플레이 중인 학생: 목록 · 기록 보기 · 대화 (11-15 선생님 요청) ----
  //   목록은 학생이 20초마다 알리는 online/(70초 안)에서, 대화는 학생의 친구 패널과 같은 dm/·inbox/(ui/80-friends의 FRIENDS.dev)에서 읽고 쓴다.
  //   기록은 그 학생 계정에 마지막으로 저장된 삶(lifeNowHTML). 이 탭이 열려 있는 동안만 8초마다 새로 읽고, 학생 친구 목록에 '선생님'이 나타난다.
  let liveT=null, chatT=null, tab='play';
  const FD=()=>window.FRIENDS&&FRIENDS.dev;
  const stopLive=()=>{ clearInterval(liveT); clearInterval(chatT); liveT=chatT=null; try{ FD()&&FD().beat(false); }catch(e){} };
  function liveView(wrap,d){
    const body=document.createElement('div'); body.className='panel'; wrap.appendChild(body);
    let view='list', cur=null, list=null, ib={}; const recOpen={};
    const alive=()=>body.isConnected&&!d.hidden&&tab==='live';
    const nameOf=f=>esc(f.nm||f.id||'학생'), infoOf=f=>`아이디 ${esc(f.id||'')}${f.a!==''&&f.a!=null?' · '+f.a+'살':''}${f.cn?' · '+esc(f.cn):''}${f.st?' · '+esc(f.st):''}`;
    async function refresh(){ if(!alive()){ stopLive(); return; } const a=await FD().players(); const i=await FD().inbox(); if(a) list=a; else if(list==null) list=null; ib=i||{}; FD().beat(true); if(view==='list') drawList(); }
    function drawList(){ view='list'; cur=null; clearInterval(chatT); chatT=null;
      const st=!Store.fb?'이 기기 안에서만 이어져요(같은 컴퓨터의 다른 창과만 만날 수 있어요)':list===null?'연결을 확인하지 못했어요':'연결됨';
      const away=Object.keys(ib).filter(u=>FD().unread(ib,u)&&!(list||[]).some(f=>f.uid===u));
      body.innerHTML=`<h3>지금 플레이 중인 학생 <span class="small sub">${list?list.length+'명':''}</span></h3>
        <p class="small sub">${st} · 8초마다 새로 읽어요 · 이 탭이 열려 있는 동안 학생의 친구 목록에 '선생님'이 나타나요 · 기록은 마지막으로 저장된 삶이에요</p>
        ${list&&list.length?`<ul class="lives">${list.map(f=>`<li data-u="${esc(f.uid)}"><div class="idrow"><div><b>${nameOf(f)}</b> <span class="small sub">${infoOf(f)}</span></div><div class="btns"><button class="btn" data-rec>기록 보기</button><button class="btn primary" data-chat>대화${FD().unread(ib,f.uid)?' <span class="dot">●</span>':''}</button></div></div><div class="recbox" ${recOpen[f.uid]?'':'hidden'}>${recOpen[f.uid]||''}</div></li>`).join('')}</ul>`:`<p class="small sub">${list===null?'':'지금 플레이 중인 학생이 없어요. 학생이 삶을 시작하면 여기에 나타나요.'}</p>`}
        ${away.length?`<b class="small">답장이 온 학생 (지금은 접속 중이 아님)</b><ul class="lives">${away.map(u=>`<li data-u="${esc(u)}" data-away><div class="idrow"><div><b>${esc(ib[u].n||'학생')}</b> <span class="small sub">${esc(String(ib[u].x||'').slice(0,30))}</span></div><div class="btns"><button class="btn primary" data-chat>대화 <span class="dot">●</span></button></div></div></li>`).join('')}</ul>`:''}`;
      body.querySelectorAll('li[data-u]').forEach(li=>{ const uid=li.dataset.u, f=(list||[]).find(x=>x.uid===uid)||{uid,id:'',nm:(ib[uid]||{}).n||'학생',a:'',cn:'',st:''};
        const c=li.querySelector('[data-chat]'); if(c) c.onclick=()=>openChat(f);
        const r=li.querySelector('[data-rec]'); if(r) r.onclick=async()=>{ const bx=li.querySelector('.recbox'); if(!bx.hidden){ bx.hidden=true; delete recOpen[uid]; return; } bx.hidden=false; bx.innerHTML='<p class="small sub">불러오는 중…</p>';
          let dd; try{ dd=await Store.adminUser({key:uid,id:f.id}); }catch(e){ bx.innerHTML=`<p class="err">${esc(Store.msg(e))}</p>`; return; } dd=dd||{};
          const h=`<p class="small sub">마지막 저장 ${when(dd.t)||'—'} · 지금은 ${f.a}살${dd.room?' · 학급 방 '+esc(dd.room):''}</p>${dd.save?lifeNowHTML(dd.save):'<p class="small sub">저장된 삶이 아직 없어요.</p>'}`; recOpen[uid]=h; bx.innerHTML=h; }; }); }
    const bub=arr=>arr.map(m=>{ const x=new Date(m.t||0); return `<div class="lvb ${m.f===FD().uid?'me':''}">${esc(m.x)}<i>${m.f===FD().uid?'':esc(m.n)+' · '}${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}</i></div>`; }).join('');
    async function load(){ if(!alive()){ stopLive(); return; } if(!cur) return; let arr; try{ arr=await FD().thread(cur.uid); }catch(e){ return; } const box=body.querySelector('#lvMs'); if(!box||view!=='chat') return;
      const atEnd=box.scrollTop+box.clientHeight>=box.scrollHeight-30; box.innerHTML=arr.length?bub(arr):'<p class="small sub">첫 인사를 건네 보세요.</p>'; if(atEnd||!box.dataset.f){ box.scrollTop=box.scrollHeight; box.dataset.f=1; } FD().markRead(cur.uid); }
    function openChat(f){ cur=f; view='chat'; FD().markRead(f.uid);
      body.innerHTML=`<div class="idrow"><b>${nameOf(f)} <span class="small sub">${infoOf(f)}</span></b><button class="btn ghost" data-back>◀ 목록</button></div>
        <div class="lvms" id="lvMs"><p class="small sub">불러오는 중…</p></div>
        <form class="row" id="lvF" style="flex-wrap:nowrap"><input type="text" id="lvIn" maxlength="${FD().MAXLEN}" placeholder="메시지 (${FD().MAXLEN}자까지)" autocomplete="off"><button class="btn primary" type="submit" style="white-space:nowrap">보내기</button></form>`;
      body.querySelector('[data-back]').onclick=()=>{ refresh(); drawList(); };
      let last=0; body.querySelector('#lvF').onsubmit=async e=>{ e.preventDefault(); const inp=body.querySelector('#lvIn'), x=inp.value.trim(); if(!x||Date.now()-last<1000) return; last=Date.now(); inp.value='';
        try{ await FD().send(f.uid,x); }catch(er){ inp.value=x; inp.placeholder='보내지 못했어요. 다시 눌러 보세요'; } load(); };
      clearInterval(chatT); load(); chatT=setInterval(load,3500); setTimeout(()=>{ const i=body.querySelector('#lvIn'); i&&i.focus(); },60); }
    body.innerHTML='<p class="small sub">불러오는 중…</p>'; refresh().then(()=>{ if(view==='list') drawList(); }); clearInterval(liveT); liveT=setInterval(refresh,8000); }
  addEventListener('pagehide',()=>{ try{ FD()&&FD().beat(false); }catch(e){} });
  // ---- 개발자 창에 탭 ----
  const home=()=>$('devRecHome');
  const stash=()=>{ const h=home(); ['tRec','tIds'].forEach(id=>{ const e=$(id); if(e&&h&&e.parentElement!==h) h.appendChild(e); }); };
  const _od=openDev;
  openDev=function(){ stopLive(); stash(); _od.apply(this,arguments); if(!G.tok) return; const d=$('devP'), box=d.querySelector('.dbox'); if(!box) return;
    const h2=box.querySelector('h2'), tabs=document.createElement('div'); tabs.className='dtabs';
    tabs.innerHTML=`<button data-t="play" class="${tab==='play'?'on':''}">체험</button><button data-t="live" class="${tab==='live'?'on':''}">지금 플레이 중</button><button data-t="rec" class="${tab==='rec'?'on':''}">기록·아이디</button>`; h2.insertAdjacentElement('afterend',tabs);
    tabs.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; tab=b.dataset.t; openDev(); };
    if(tab==='live'){ [...box.children].forEach(c=>{ if(c===h2||c===tabs||c.querySelector('#devX')) return; c.style.display='none'; }); h2.innerHTML='개발자 모드 <small class="note">지금 플레이 중인 학생 · 기록 보기와 대화</small>';
      const wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;gap:12px'; tabs.insertAdjacentElement('afterend',wrap); liveView(wrap,d); }
    if(tab==='rec'){ [...box.children].forEach(c=>{ if(c===h2||c===tabs||c.querySelector('#devX')) return; c.style.display='none'; }); h2.innerHTML='개발자 모드 <small class="note">저장된 기록과 아이디 · 자세히 보기와 지우기</small>';
      const wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;gap:12px'; wrap.appendChild($('tRec')); wrap.appendChild($('tIds')); tabs.insertAdjacentElement('afterend',wrap);
      const r=$('tRec'); r.querySelector('h3').textContent='선생님 체험 기록 (교사용 모드에서 한 체험)'; renderTRec(); renderTIds(true);
      wrap.addEventListener('click',e=>{ if(e.target.closest('[data-go]')) setTimeout(()=>{ if(G.life&&G.running) d.hidden=true; },50); }); }
  };
})();
