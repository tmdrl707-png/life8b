/* 80-friends: 지금 같이 플레이하는 친구들의 간단한 정보 보기 + 1대1 메시지 (11-14 선생님 요청)
   - 게임 화면 오른쪽 위의 그림 단추(#btnFr)를 누르면 오른쪽에 패널(#frPanel)이 열린다. 시간은 멈추지 않는다.
   - 앞으로 이 단추에서 게임 화면 설정·개인 설정·게임 속도(3단계) 같은 메뉴를 더해 간다 → 패널 위쪽에 탭 줄(FR_TABS)을 두었다. 지금은 '대화' 하나.
   - 데이터(Firebase `life8b/` 아래, 이 기기 방식이면 localStorage 흉내):
       online/<uid>            {id,nm,a,cn,st,t}   20초마다 갱신, 70초 안에 갱신된 사람만 '지금 플레이 중'
       dm/<내uid>_<상대uid>(정렬)/<푸시키>  {f,n,x,t}  메시지(80자까지)
       inbox/<받는이uid>/<보낸이uid>        {n,x,t}  마지막 메시지(안 읽음 표시용)
   - 교사용·개발자 모드와 로그인하지 않은 상태에서는 나타나지 않는다. */
(function(){
  const TTL=70000, BEAT=20000, MAXLEN=80;
  const FR_TABS=[{k:'chat',n:'대화'}];   // 나중에 {k:'ui',n:'화면'},{k:'me',n:'개인 설정'},{k:'speed',n:'게임 속도'} 같은 탭을 여기에 더한다
  // ---- 저장소: Firebase(REST) 또는 이 기기(localStorage) ----
  const LKEY='life8b_frdb';
  const lget=()=>{ try{ return JSON.parse(localStorage.getItem(LKEY)||'{}'); }catch(e){ return {}; } };
  const lput=o=>{ try{ localStorage.setItem(LKEY,JSON.stringify(o)); }catch(e){} };
  const walk=(o,p,mk)=>{ for(const k of p){ if(o[k]==null||typeof o[k]!=='object'){ if(!mk) return undefined; o[k]={}; } o=o[k]; } return o; };
  const DB={
    async get(path,last){ if(Store.fb){ const qs=last?`orderBy=%22%24key%22&limitToLast=${last}`:undefined; return Store.db('GET',path,undefined,qs); }
      const r=walk(lget(),path.split('/')); if(r==null) return null; if(last&&typeof r==='object'){ const ks=Object.keys(r).sort().slice(-last), o={}; ks.forEach(k=>o[k]=r[k]); return o; } return r; },
    async put(path,val){ if(Store.fb) return Store.db('PUT',path,val); const t=lget(), p=path.split('/'), k=p.pop(), par=walk(t,p,true); if(val==null) delete par[k]; else par[k]=val; lput(t); },
    async push(path,val){ if(Store.fb) return Store.db('POST',path,val); const key=Date.now().toString(36)+Math.random().toString(36).slice(2,5); await DB.put(path+'/'+key,val); return {name:key}; }
  };
  // ---- 내 정보 알리기 ----
  let me=null, beatOn=false;
  const net={put:null,get:null,t:0};   // 마지막 내 알림(put)·친구 목록 읽기(get)가 성공(true)/실패(false)했는지
  const can=()=>!!(G.life&&G.running&&!G.teacher&&!G.dev&&Store.sess&&!$('s-game').hidden);
  const myInfo=()=>{ const L=G.life; let st='',cn=''; try{ st=SETN[L.set]||''; cn=L.C.n||''; }catch(e){} return {id:Store.sess.id,nm:L.name||Store.sess.id,a:L.dead?L.lifespan:L.age,cn,st,t:Date.now()}; };
  async function beat(){ if(!can()){ if(beatOn&&Store.sess){ beatOn=false; try{ await DB.put('online/'+Store.uid(),null); }catch(e){} } return; }
    beatOn=true; try{ await DB.put('online/'+Store.uid(),myInfo()); net.put=true; net.t=Date.now(); }catch(e){ net.put=false; } }
  async function friends(){ let o=null; try{ o=await DB.get('online'); net.get=true; }catch(e){ net.get=false; } const me=Store.uid(), now=Date.now(), a=[];
    for(const k in (o||{})){ const v=o[k]; if(k===me||!v||now-(v.t||0)>TTL) continue; a.push(Object.assign({uid:k},v)); } a.sort((x,y)=>String(x.nm).localeCompare(String(y.nm),'ko')); return a; }
  const pair=(a,b)=>[a,b].sort().join('_');
  // ---- 안 읽음 ----
  const rd=()=>{ try{ return JSON.parse(localStorage.getItem('life8b_fr_read_'+(Store.sess&&Store.sess.id))||'{}'); }catch(e){ return {}; } };
  const setRd=(uid,t)=>{ try{ const r=rd(); r[uid]=t; localStorage.setItem('life8b_fr_read_'+Store.sess.id,JSON.stringify(r)); }catch(e){} };
  let inbox={};
  async function pollInbox(){ if(!can()) return; try{ inbox=(await DB.get('inbox/'+Store.uid()))||{}; }catch(e){ return; } badge(); if(panel&&!panel.hidden&&view==='list') drawList(); }
  const unreadOf=uid=>{ const m=inbox[uid]; return !!(m&&(m.t||0)>(rd()[uid]||0)); };
  const unreadN=()=>Object.keys(inbox).filter(unreadOf).length;
  // ---- 화면 ----
  const css=document.createElement('style'); css.textContent=`
#btnFr{position:fixed;right:calc(env(safe-area-inset-right,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);z-index:56;width:52px;height:52px;padding:0;border-radius:50%;border:2px solid #fff;background:linear-gradient(180deg,#6FB6FF 0%,#3A7BE8 100%);box-shadow:0 5px 14px rgba(40,90,200,.5);cursor:pointer;display:flex;align-items:center;justify-content:center}
#btnFr svg{width:30px;height:30px}#btnFr[hidden]{display:none}
#btnFr .bd{position:absolute;right:-4px;top:-4px;min-width:20px;height:20px;border-radius:10px;background:#E5484D;color:#fff;font:700 12px/20px inherit;text-align:center;padding:0 5px;border:2px solid #fff}
#btnFr .bd[hidden]{display:none}
#frPanel{position:fixed;right:0;top:0;bottom:0;width:min(340px,92vw);z-index:57;background:#FBF8F1;color:#222;box-shadow:-8px 0 28px rgba(0,0,0,.4);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px)}
#frPanel[hidden]{display:none}
#frPanel .fh{display:flex;align-items:center;gap:6px;padding:10px 12px;background:#2B5FB8;color:#fff}
#frPanel .fh b{flex:1;font-size:16px}
#frPanel .fh button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:8px;padding:5px 10px;font:inherit;cursor:pointer}
#frPanel .ft{display:flex;gap:4px;padding:6px 10px 0;border-bottom:1px solid #E3DCCB}
#frPanel .ft button{border:0;background:none;padding:6px 12px;font:700 14px inherit;color:#7A6F55;border-bottom:3px solid transparent;cursor:pointer}
#frPanel .ft button.on{color:#2B5FB8;border-bottom-color:#2B5FB8}
#frPanel .fb{flex:1;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px;min-height:0}
#frPanel .fe{color:#7A6F55;font-size:13px;line-height:1.6;text-align:center;padding:24px 8px}
#frPanel .fst{padding:6px 12px;font-size:12px;color:#7A6F55;background:#F3EEDF;border-bottom:1px solid #E3DCCB}#frPanel .fst.ok{color:#1E7A46}#frPanel .fst.bad{color:#B3261E;background:#FDEDEC}
#frPanel .fc{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid #E3DCCB;border-radius:12px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:inherit;width:100%}
#frPanel .fc .av{width:38px;height:38px;border-radius:50%;background:#CFE2FF;color:#2B5FB8;font:700 16px/38px inherit;text-align:center;flex:none}
#frPanel .fc .tx{flex:1;min-width:0}#frPanel .fc .tx b{display:block;font-size:15px}#frPanel .fc .tx span{display:block;font-size:12px;color:#7A6F55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#frPanel .fc .nw{width:10px;height:10px;border-radius:50%;background:#E5484D;flex:none}
#frPanel .fi{padding:8px 10px;border-radius:10px;background:#EEF4FF;font-size:12.5px;line-height:1.55}
#frPanel .ms{flex:1;overflow:auto;display:flex;flex-direction:column;gap:6px;min-height:0}
#frPanel .mb{max-width:82%;padding:7px 10px;border-radius:12px;font-size:14px;line-height:1.45;word-break:break-all;background:#fff;border:1px solid #E3DCCB;align-self:flex-start}
#frPanel .mb.me{align-self:flex-end;background:#DCEBFF;border-color:#BBD3F7}
#frPanel .mb i{display:block;font-style:normal;font-size:10.5px;color:#9A8F74;margin-top:2px}
#frPanel .fs{display:flex;gap:6px;padding:8px 10px;border-top:1px solid #E3DCCB;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}
#frPanel .fs input{flex:1;min-width:0;border:1px solid #CFC6B0;border-radius:10px;padding:9px 10px;font:inherit;font-size:15px;background:#fff;color:#222}
#frPanel .fs button{border:0;border-radius:10px;padding:0 14px;background:#2B5FB8;color:#fff;font:700 14px inherit;cursor:pointer}
@media (max-height:480px){#btnFr{width:44px;height:44px}#btnFr svg{width:25px;height:25px}}`; document.head.appendChild(css);
  const btn=document.createElement('button'); btn.id='btnFr'; btn.type='button'; btn.hidden=true; btn.title='함께 플레이하는 친구들'; btn.setAttribute('aria-label','함께 플레이하는 친구들');
  btn.innerHTML='<svg viewBox="0 0 32 32" fill="none"><path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h15A3.5 3.5 0 0 1 27 8.5v9a3.5 3.5 0 0 1-3.5 3.5H15l-5.2 4.6c-.6.5-1.5.1-1.5-.7V21h-.8A3.5 3.5 0 0 1 5 17.5z" fill="#fff"/><circle cx="11" cy="13" r="1.6" fill="#3A7BE8"/><circle cx="16" cy="13" r="1.6" fill="#3A7BE8"/><circle cx="21" cy="13" r="1.6" fill="#3A7BE8"/></svg><span class="bd" hidden></span>';
  ($('s-game')||document.body).appendChild(btn);
  const panel=document.createElement('div'); panel.id='frPanel'; panel.hidden=true; ($('s-game')||document.body).appendChild(panel);
  let view='list', cur=null, tab='chat', msgT=null, lastSend=0;
  function badge(){ const n=unreadN(), b=btn.querySelector('.bd'); b.hidden=!n; b.textContent=n>9?'9+':n; }
  const initial=s=>esc(String(s||'?').trim().slice(0,1));
  const sub=f=>`${f.a}살 · ${esc(f.cn||'')}${f.st?' · '+esc(f.st):''}`;
  function shell(body){ panel.innerHTML=`<div class="fh"><b>함께 플레이하는 친구</b><button id="frX" aria-label="닫기">닫기 ✕</button></div>
    <div class="ft">${FR_TABS.map(t=>`<button data-t="${t.k}" class="${t.k===tab?'on':''}">${t.n}</button>`).join('')}</div>${body}`;
    $('frX').onclick=closeP; }
  let list=[];
  // 연결 상태 한 줄: 내 알림과 목록 읽기가 모두 성공했을 때만 '연결됨'이라고 알린다
  function statusHTML(){ const ok=net.put===true&&net.get===true, bad=net.put===false||net.get===false;
    const t=!Store.fb?'이 기기 안에서만 이어져요 (같은 컴퓨터의 다른 창과만 만날 수 있어요)':ok?`연결됨 · 지금 나 말고 ${list.length}명이 플레이 중`:bad?'연결이 불안정해요 · 친구 목록이 맞지 않을 수 있어요':'연결 확인 중…';
    return `<div class="fst ${ok||!Store.fb?'ok':bad?'bad':''}">${ok||!Store.fb?'●':bad?'▲':'○'} ${t}</div>`; }
  function drawList(){ view='list'; clearInterval(msgT);
    shell(`${statusHTML()}<div class="fb" id="frB">${list.length?list.map(f=>`<button class="fc" data-u="${esc(f.uid)}"><span class="av">${initial(f.nm)}</span><span class="tx"><b>${esc(f.nm)}</b><span>${sub(f)}</span></span>${unreadOf(f.uid)?'<i class="nw"></i>':''}</button>`).join(''):(net.get===false?'<div class="fe">연결을 확인하지 못했어요.<br>인터넷이 연결되어 있는지 보고 잠시 뒤 다시 열어 보세요.</div>':'<div class="fe">지금 같이 플레이하는 친구가 없어요.<br>친구가 게임을 시작하면 여기에 나타나요.</div>')}</div>`);
    panel.querySelectorAll('.fc').forEach(b=>b.onclick=()=>openChat(b.dataset.u)); }
  async function refreshList(){ list=await friends(); if(!panel.hidden&&view==='list') drawList(); return list; }
  function bubbles(arr){ const meU=Store.uid(); return arr.map(m=>{ const d=new Date(m.t||0); return `<div class="mb ${m.f===meU?'me':''}">${esc(m.x)}<i>${m.f===meU?'':esc(m.n)+' · '}${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}</i></div>`; }).join(''); }
  async function loadMsgs(){ if(!cur) return; let o=null; try{ o=await DB.get('dm/'+pair(Store.uid(),cur.uid),40); }catch(e){ return; }
    const arr=Object.keys(o||{}).sort().map(k=>o[k]); const box=$('frMs'); if(!box||view!=='chat') return; const atEnd=box.scrollTop+box.clientHeight>=box.scrollHeight-30;
    box.innerHTML=arr.length?bubbles(arr):'<div class="fe">첫 인사를 건네 보세요.</div>'; if(atEnd||!box.dataset.f){ box.scrollTop=box.scrollHeight; box.dataset.f=1; }
    const last=arr.length?arr[arr.length-1].t:0; if(last) setRd(cur.uid,Math.max(last,Date.now())); const m=inbox[cur.uid]; if(m) badge(); }
  function openChat(uid){ const f=list.find(x=>x.uid===uid)||{uid,nm:'친구',a:'',cn:'',st:''}; cur=f; view='chat';
    panel.innerHTML=`<div class="fh"><button id="frBack">◀ 목록</button><b>${esc(f.nm)}</b><button id="frX">닫기 ✕</button></div>
      <div class="fb"><div class="fi"><b>${esc(f.nm)}</b> · ${sub(f)}<br>아이디: ${esc(f.id||'')}</div><div class="ms" id="frMs"><div class="fe">불러오는 중…</div></div></div>
      <form class="fs" id="frF"><input id="frIn" maxlength="${MAXLEN}" placeholder="메시지 (${MAXLEN}자까지)" autocomplete="off"><button type="submit">보내기</button></form>`;
    $('frX').onclick=closeP; $('frBack').onclick=()=>{ cur=null; refreshList().then(()=>{ if(view!=='list') drawList(); }); drawList(); };
    $('frF').onsubmit=async e=>{ e.preventDefault(); const inp=$('frIn'), x=inp.value.trim().slice(0,MAXLEN); if(!x||Date.now()-lastSend<1200) return; lastSend=Date.now(); inp.value='';
      const me=Store.uid(), nm=(G.life&&G.life.name)||Store.sess.id, t=Date.now();
      let ok=false; try{ await DB.push('dm/'+pair(me,f.uid),{f:me,n:nm,x,t}); ok=true; await DB.put('inbox/'+f.uid+'/'+me,{n:nm,x,t}); }catch(er){ if(!ok){ inp.value=x; toast('메시지를 보내지 못했어요. 인터넷을 확인하고 다시 눌러 보세요.','news'); } } loadMsgs(); };
    clearInterval(msgT); loadMsgs(); msgT=setInterval(loadMsgs,3500); setTimeout(()=>{ const i=$('frIn'); i&&i.focus(); },60); }
  function openP(){ if(!can()) return; panel.hidden=false; beat(); drawList(); refreshList(); pollInbox(); }
  function closeP(){ panel.hidden=true; clearInterval(msgT); cur=null; view='list'; badge(); }
  btn.onclick=()=>{ if(panel.hidden) openP(); else closeP(); };
  panel.addEventListener('click',e=>{ const t=e.target.closest('.ft button'); if(t&&t.dataset.t){ tab=t.dataset.t; drawList(); } });
  // ---- 주기 ----
  setInterval(()=>{ try{ btn.hidden=!can(); if(!can()){ if(!panel.hidden) closeP(); } }catch(e){} },1000);
  setInterval(()=>{ try{ beat(); }catch(e){} },BEAT);
  setInterval(()=>{ try{ pollInbox(); if(!panel.hidden&&view==='list') refreshList(); }catch(e){} },8000);
  addEventListener('pagehide',()=>{ try{ if(beatOn&&Store.sess) DB.put('online/'+Store.uid(),null); }catch(e){} });
  window.FRIENDS={open:openP,close:closeP,beat};   // 시험·개발용
})();
