/* ---------- [1 운영] 개발자 모드: 나라·나이를 골라 바로 플레이, 엔딩 바로 보기 (저장하지 않는다) ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
#devP{position:fixed;inset:0;z-index:200;background:rgba(10,16,24,.72);display:grid;place-items:center;padding:16px}#devP[hidden]{display:none}
#devP .dbox{background:#FBFAF6;color:#1E2B37;border-radius:16px;max-width:44rem;width:100%;max-height:92vh;overflow:auto;padding:18px 20px;display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
#devP h2{margin:0;font-size:1.25rem}#devP .drow{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#devP label{font-weight:700;min-width:5.5rem}
#devP select,#devP input[type=number],#devP input[type=password]{font:inherit;padding:6px 10px;border-radius:8px;border:1.5px solid #C9C2B2;background:#fff}
#devP .seg button{font-size:.9rem}#devP .q button{border:1.5px solid #C9C2B2;background:#fff;border-radius:999px;padding:4px 10px;cursor:pointer;font:inherit;font-size:.88rem}
#devP .note{font-size:.85rem;color:#5A6A78;margin:0}#devP .err{color:#B03030;margin:0;font-size:.9rem}
#devBar{position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:120;display:flex;gap:4px;flex-wrap:wrap;justify-content:center;background:rgba(30,43,55,.88);padding:5px 8px;border-radius:12px;max-width:96vw}
#devBar[hidden]{display:none}#devBar.mini button:not([data-a=tog]){display:none}#devBar{font-size:.8rem}#devBar b{color:#FFC9A8;font-size:.8rem;align-self:center;margin-right:4px}
#devBar button{all:unset;cursor:pointer;color:#fff;font-size:.8rem;font-weight:700;padding:4px 9px;border-radius:8px;background:rgba(255,255,255,.12)}#devBar button:hover{background:rgba(255,255,255,.26)}
</style>`);
const DEV={c:'KR',set:'U',famI:1,sex:0,age:0,sec:20};
function devEl(){ let d=$('devP'); if(d) return d; d=document.createElement('div'); d.id='devP'; d.hidden=true; document.body.appendChild(d);
  const bar=document.createElement('div'); bar.id='devBar'; bar.hidden=true; document.body.appendChild(bar);
  bar.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) devAct(b.dataset.a); }); return d; }
function openDev(){ const d=devEl(); d.hidden=false;
  if(!G.tok){ d.innerHTML=`<div class="dbox"><h2>개발자 모드</h2><p class="note">교사용 모드와 같은 코드로 들어갑니다.</p><div class="drow"><input type="password" id="devCode" placeholder="코드" autocomplete="off"><button class="btn primary" id="devGo">들어가기</button><button class="btn" id="devX">닫기</button></div><p class="err" id="devErr"></p></div>`;
    const go=()=>{ if($('devCode').value===CFG.TEACHER_CODE){ G.tok=1; openDev(); } else $('devErr').textContent='코드가 맞지 않습니다.'; };
    $('devGo').onclick=go; $('devCode').onkeydown=e=>{ if(e.key==='Enter') go(); }; $('devX').onclick=()=>d.hidden=true; $('devCode').focus(); return; }
  const seg=(k,arr)=>`<div class="seg" data-k="${k}">${arr.map(([v,t])=>`<button data-v="${v}" class="${String(DEV[k])===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  d.innerHTML=`<div class="dbox"><h2>개발자 모드 <small class="note">나라와 시점을 골라 바로 확인 · 기록은 저장되지 않아요</small></h2>
    <div class="drow"><label for="devC">나라</label><select id="devC">${$('tCountry').innerHTML}</select></div>
    <div class="drow"><label>사는 곳</label>${seg('set',[['U','도시'],['R','농촌']])}</div>
    <div class="drow"><label>가정 형편</label>${seg('famI',[[0,'넉넉한'],[1,'보통'],[2,'어려운']])}</div>
    <div class="drow"><label>성별</label>${seg('sex',[[0,'남자'],[1,'여자']])}</div>
    <div class="drow"><label for="devA">시작 나이</label><input type="number" id="devA" min="0" max="100" value="${DEV.age}" style="width:6rem"><span class="q">${[0,1,3,6,10,13,16,19,25,35,45,60,75].map(a=>`<button data-a="${a}">${a}</button>`).join(' ')}</span></div>
    <p class="note">그 나이까지의 삶은 자동으로 채워집니다(무작위). 일찍 세상을 떠나는 나라라면 그 나이까지 산 삶이 나올 때까지 다시 뽑습니다.</p>
    <div class="drow"><label>한 해 길이</label>${seg('sec',[[8,'8초'],[20,'20초'],[35,'35초'],[60,'1분'],[120,'2분'],[300,'5분'],[600,'10분'],[1800,'30분'],[3600,'1시간']])}</div>
    <div class="drow"><button class="btn primary" id="devPlay">이 나이에서 플레이</button><button class="btn" id="devEndHere">이 나이에서 끝난 삶의 엔딩</button><button class="btn" id="devEndAll">끝까지 자동으로 살고 엔딩</button></div>
    <p class="err" id="devErr"></p>
    <p class="note">플레이 중에는 화면 위의 개발자 막대로 1년·5년 건너뛰기, 원하는 나이로 가기, 큰 사건 바로 열기, 엔딩 보기를 할 수 있어요. 엔딩에서는 처음 장·마지막 장으로 바로 갈 수 있어요.</p>
    ${(()=>{ const L=ls('life8b_errs')||[]; return L.length?`<details><summary class="note">이 기기에서 최근에 난 오류 ${L.length}개</summary><ul class="note">${L.map(x=>`<li>${new Date(x.t).toLocaleString('ko-KR')} · ${esc(x.w)} · ${esc(x.m)} <small>${esc(x.at||'')} [${esc(x.scr||'')}]</small></li>`).join('')}</ul><button class="btn ghost" id="devErrClr">오류 기록 지우기</button></details>`:''; })()}
    <div class="drow"><button class="btn ghost" id="devX">닫기</button></div></div>`;
  if($('devErrClr')) $('devErrClr').onclick=()=>{ ls('life8b_errs',null); openDev(); };
  $('devC').value=DEV.c; $('devC').onchange=()=>DEV.c=$('devC').value; $('devA').oninput=()=>DEV.age=clamp(+$('devA').value||0,0,100);
  d.querySelectorAll('.seg').forEach(sg=>sg.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; DEV[sg.dataset.k]=sg.dataset.k==='set'?b.dataset.v:+b.dataset.v; [...sg.children].forEach(x=>x.classList.toggle('on',x===b)); });
  d.querySelector('.q').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; DEV.age=+b.dataset.a; $('devA').value=DEV.age; };
  $('devX').onclick=()=>d.hidden=true; $('devPlay').onclick=()=>devStart('play'); $('devEndHere').onclick=()=>devStart('endHere'); $('devEndAll').onclick=()=>devStart('endAll'); }
function devLife(age){ const o={c:DEV.c,set:DEV.set,famI:+DEV.famI,sex:+DEV.sex}; let X=null;
  for(let i=0;i<60;i++){ X=new Life(Object.assign({},o)); if(age>0) X.runAuto(age); if(!X.dead) return X; } if(X){ X.dead=false; X.f.dying=0; } return X; }
function devStart(how){ const age=clamp(+$('devA').value||0,0,100); DEV.age=age; G.teacher=true; G.dev=true; G.tid=null; G.troom=null; G.sec=+DEV.sec; G.room=null;
  let L=devLife(how==='endAll'?0:age); if(!L){ $('devErr').textContent='삶을 만들지 못했어요.'; return; }
  $('devP').hidden=true; G.life=L;
  if(how==='play'){ startGame(); devBar(); return; }
  if(how==='endAll'&&!L.dead) L.runAuto(); if(!L.dead) devKill(L); devToEnd(); }
function devKill(L){ L.dead=true; L.lifespan=L.age; L.cause=L.cause||'sudden'; L.cur=null; L.f.dying=0; }
function devToEnd(){ G.running=false; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); try{ G.life.makeComps&&!G.life.comps&&G.life.makeComps(); }catch(e){} finishLife(); devBar(); }
function devBar(){ const b=$('devBar'); if(!b) return; if(!G.dev){ b.hidden=true; return; } b.hidden=false;
  const inEnd=!$('s-end').hidden;
  b.innerHTML=inEnd?`<b>개발자</b><button data-a="tog">${b.classList.contains('mini')?'펼치기 ▾':'접기 ▴'}</button><button data-a="first">◀◀ 처음 장</button><button data-a="prev">◀ 이전</button><button data-a="next">다음 ▶</button><button data-a="last">마지막 장 ▶▶</button><button data-a="menu">개발자 메뉴</button><button data-a="quit">끝내기</button>`
    :`<b class="dage">개발자 · ${G.life?G.life.age:''}살</b><button data-a="tog">${b.classList.contains('mini')?'펼치기 ▾':'접기 ▴'}</button><button data-a="y1">+1년</button><button data-a="y5">+5년</button><button data-a="age">나이로 가기</button><button data-a="major">큰 사건 열기</button><button data-a="end">여기서 엔딩</button><button data-a="endAll">끝까지 살고 엔딩</button><button data-a="menu">개발자 메뉴</button><button data-a="quit">끝내기</button>`; }
function devSkip(to){ const L=G.life; if(!L||L.dead) return; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet();
  L.pending=null; const r=L.endPeriod(); if(!(r&&r.dead)&&L.age<to) L.runAuto(to); if(L.dead){ devToEnd(); return; } beginPeriod(); renderHud(); devBar(); }
function devAct(a){ const L=G.life;
  if(a==='tog'){ const b=$('devBar'); b.classList.toggle('mini'); devBar(); return; }
  if(a==='menu'){ openDev(); return; }
  if(a==='quit'){ G.dev=false; G.teacher=false; G.running=false; G.life=null; $('devBar').hidden=true; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); if(Store.sess&&G.data) openHub(); else show('login'); return; }
  if(a==='first'||a==='last'||a==='prev'||a==='next'){ if(!G.endNav) return; if(a==='prev') G.endNav(-1); else if(a==='next') G.endNav(1); else for(let i=0;i<60;i++) G.endNav(a==='first'?-1:1); return; }
  if(!L||L.dead) return;
  if(a==='y1') devSkip(L.age+1); else if(a==='y5') devSkip(L.age+5);
  else if(a==='age'){ const v=prompt('몇 살로 갈까요? (지금 '+L.age+'살)',L.age+10); const n=+v; if(v!=null&&n>L.age) devSkip(Math.min(110,n)); }
  else if(a==='major'){ if(!$('sheet').hidden||dlgOpen()) return; if(L.pending){ openCross(); return; } if(!L.majorLeft()) L.addMajor(); if(L.major()!=null) openMajor(); else toast('지금 열 수 있는 큰 사건이 없어요.'); }
  else if(a==='end'){ devKill(L); devToEnd(); }
  else if(a==='endAll'){ L.cur=null; L.runAuto(); if(!L.dead) devKill(L); devToEnd(); } }
(function(){ const t=$('btnTeacher'); if(t) t.insertAdjacentHTML('afterend','<button class="btn ghost" id="btnDev" style="align-self:center;color:#AFC0CD;border-color:rgba(175,192,205,.35);background:transparent">개발자 모드</button>');
  const t2=$('btnTeacher2'); if(t2) t2.insertAdjacentHTML('afterend','<button class="btn ghost" id="btnDev2">개발자 모드</button>');
  [$('btnDev'),$('btnDev2')].forEach(b=>{ if(b) b.onclick=openDev; });
  // 화면이 바뀔 때 개발자 막대를 맞춘다
  const _sh=show; show=function(n){ _sh(n); if(G.dev&&n!=='game'&&n!=='end'){ G.dev=false; } setTimeout(devBar,0); }; })();

(function(){ const _rh=renderHud; renderHud=function(){ _rh.apply(this,arguments); if(G.dev&&G.life){ const e=document.querySelector('#devBar .dage'); if(e) e.textContent=`개발자 · ${G.life.age}살`; } }; })();

