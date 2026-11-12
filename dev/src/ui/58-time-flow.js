/* ---------- [2-3 시간·사건 진행] 시간은 멈추지 않는다 (학생): 선택 창이 떠 있어도 한 해가 흐르고, 제한 시간이 지나면 저절로 정해진다 ----------
   큰 사건·큰 갈림길·달력의 고르는 일: 제한 시간(한 해 길이의 1/5, 최소 12초)이 지나면 무작위로 정해진다.
   작은 선택·미션: 제한 시간이 지나면 창이 닫히고, 그해가 끝날 때까지 하지 않으면 '놓친 순간'이 된다.
   교사용·개발자 모드와 '저장하기'·'나가기' 창에서는 예전처럼 시간이 멈춘다. */
const DEC={on:0,left:0,total:0,mode:null,next:null,tt:0};
const flowOn=()=>!!(G.life&&!G.teacher&&!G.hardPause);
const decWin=()=>Math.max(12,yearLen()*.2)*Math.min(2,RD());
function decStart(){ const m=DEC.next; DEC.next=null; if(!m||!flowOn()||!$('sheetBox').querySelector('.opts button')){ DEC.on=0; return; }
  DEC.on=1; DEC.mode=m; DEC.total=DEC.left=decWin(); DEC.tt=0;
  $('sheetBox').insertAdjacentHTML('afterbegin',`<div class="decbar" role="timer"><i></i><span></span></div>`); decRender(true); }
function decRender(force){ const b=$('sheetBox').querySelector('.decbar'); if(!b) return; b.querySelector('i').style.width=Math.max(0,DEC.left/DEC.total*100)+'%';
  const sec=Math.ceil(Math.max(0,DEC.left)); if(force||sec!==DEC.tt){ DEC.tt=sec; b.querySelector('span').textContent=DEC.mode==='auto'?`${sec}초 안에 고르지 않으면 저절로 정해져요`:`${sec}초 안에 고르지 않으면 이 순간은 지나가요`; b.classList.toggle('hot',sec<=5); } }
function decAuto(){ const m=DEC.mode; DEC.on=0; if(m==='auto'){ const bs=[...$('sheetBox').querySelectorAll('.opts button:not([disabled])')]; if(bs.length){ G.autoPicked=1; bs[Math.floor(Math.random()*bs.length)].click(); G.autoPicked=0; toast('시기를 놓쳐 저절로 정해졌어요.','news'); return; } }
  closeSheet(); if(m==='close') toast('고르지 않아 이 순간은 지나갔어요. 그해가 가기 전에 다시 다가갈 수 있어요.'); }
// 열려 있는 창을 정리한다 (해가 끝날 때)
function resolveOpen(){ for(let i=0;i<8;i++){ if(dlgOpen()){ dlgClose(); continue; } if($('sheet').hidden) return; if(DEC.on){ decAuto(); continue; }
    const ok=$('btnOk')||$('sheetBox').querySelector('.btn.primary'); if(ok){ ok.click(); continue; } closeSheet(); } }
function flowTick(dt){ const L=G.life; if(!flowOn()||!L.cur) return;
  if(!caughtUp()){ L.cur.t-=dt; $('hTimer').style.width=Math.max(0,L.cur.t/G.sec*100)+'%'; }
  else { const r=G.roomInfo; $('hTimer').style.width=(r&&r.auto>0&&!r.paused?100-((Date.now()-r.t0)%(r.auto*60000))/(r.auto*600):100)+'%'; }
  L.cur.el=(L.cur.el||0)+dt; { const mn=monthNow(); if(mn!==G.mon){ G.mon=mn; renderMon(); } }
  if(G.sickT>0&&!L.f.dying){ G.sickT-=dt; if(G.sickT<=0){ G.sickT=0; L.getWell(); renderHud(); } }
  if(DEC.on&&!$('sheet').hidden){ DEC.left-=dt; decRender(); if(DEC.left<=0) decAuto(); }
  if(!caughtUp()&&L.cur&&L.cur.t<=0){ resolveOpen(); if(!paused&&!L.dead) endPeriod(); } }
(function(){ const _sh=sheet; sheet=function(html,cls){ _sh(html,cls); decStart(); };
  const _cs=closeSheet; closeSheet=function(){ DEC.on=0; G.hardPause=0; return _cs.apply(this,arguments); };
  const tag=(name,mode)=>{ const f=window[name]; if(typeof f!=='function') return; window[name]=function(){ DEC.next=mode; try{ return f.apply(this,arguments); } finally{ DEC.next=null; } }; };
  tag('openMajor','auto'); tag('openCross','auto'); tag('fireCal','auto'); tag('openScene','close'); tag('openQuest','close'); })();

/* ---------- 저장하기 (예전 '멈춤'): 저장하고 쉬었다가 이어서 한다. 이 창에서는 시간이 멈춘다 ---------- */
function openSave(){ if(!G.life||!G.running||!$('sheet').hidden||dlgOpen()) return; persist(true); G.hardPause=1; const L=G.life, r=+(G.opts.read||1);
  sheet(`<div class="place">저장했어요 · ${L.age}살</div><h2>지금까지의 삶을 저장했어요</h2><p class="sub">${G.teacher?"교사용 모드의 '내 체험 기록'에 남아요.":'여기서 그만두고 나중에 같은 아이디로 들어오면 이어서 살 수 있어요.'}${caughtUp()?' 학급 방에서는 반 전체의 시간(선생님의 시계)은 계속 흐릅니다.':' 이 창이 열려 있는 동안은 시간이 멈춰 있어요.'}</p>
    <div class="stack-s"><b>글이 떠 있는 시간</b><div class="seg" id="pRead"><button data-v="1" class="${r>1?'':'on'}">보통</button><button data-v="1.8" class="${r>1?'on':''}">길게 (천천히 읽기)</button></div></div>
    <div class="row"><button class="btn primary" id="btnOk">▶ 이어서 살기</button><button class="btn" id="btnSaveQuit">저장하고 나가기</button><button class="btn" id="btnPMem">지난 기억 보기</button></div>`,'pause');
  $('pRead').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; G.opts.read=+b.dataset.v; ls('life8b_opts',G.opts); [...$('pRead').children].forEach(x=>x.classList.toggle('on',x===b)); };
  $('btnOk').onclick=closeSheet; $('btnPMem').onclick=()=>{ closeSheet(); $('btnMem').click(); };
  $('btnSaveQuit').onclick=()=>{ closeSheet(); $('btnExit').click(); setTimeout(()=>{ const q=$('btnQuit'); if(q) q.click(); },30); }; }
$('btnPause').onclick=openSave;
{ const ex=$('btnExit').onclick; $('btnExit').onclick=function(){ G.hardPause=1; return ex.apply(this,arguments); }; }

