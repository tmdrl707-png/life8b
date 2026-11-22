/* ---------- [2-3 시간·사건 진행] 시간은 멈추지 않는다 (학생) ----------
   가운데 팝업의 중요한 선택(mode 'auto': 큰 사건·갈림길·달력)을 고르는 동안은 시간이 멈추고, 대화·미션·작은 일 창은 계속 흐른다.
   고르지 않은 창은 한 해가 끝날 때(resolveOpen) 정리된다: 'auto'는 무작위로 정해지고 'close'는 놓친 순간이 된다.
   교사용·개발자 모드와 '저장하기'·'나가기' 창에서는 시간이 멈춘다(G.hardPause). (11-14: 창마다 있던 '15초 안에 고르기'는 없앴다) */
const DEC={on:0,mode:null,next:null};
const flowOn=()=>!!(G.life&&!G.teacher&&!G.hardPause);
function decStart(){ const m=DEC.next; DEC.next=null; if(!m||!flowOn()||!$('sheetBox').querySelector('.opts button')){ DEC.on=0; return; }
  DEC.on=1; DEC.mode=m; }
function decAuto(){ const m=DEC.mode; DEC.on=0; if(m==='auto'){ const bs=[...$('sheetBox').querySelectorAll('.opts button:not([disabled])')]; if(bs.length){ G.autoPicked=1; bs[Math.floor(Math.random()*bs.length)].click(); G.autoPicked=0; toast('한 해가 지나가 저절로 정해졌어요.','news'); return; } }
  closeSheet(); if(m==='close') toast('한 해가 지나가 이 순간은 지나갔어요.'); }
// 열려 있는 창을 정리한다 (해가 끝날 때)
function resolveOpen(){ for(let i=0;i<8;i++){ if(dlgOpen()){ dlgClose(); continue; } if($('sheet').hidden) return; if(DEC.on){ decAuto(); continue; }
    const ok=$('btnOk')||$('sheetBox').querySelector('.btn.primary'); if(ok){ ok.click(); continue; } closeSheet(); } }
function flowTick(dt){ const L=G.life; if(!flowOn()||!L.cur) return;
  if(!$('sheet').hidden&&DEC.on&&DEC.mode==='auto') return;   // 11-14 선생님 요청: 가운데 팝업의 중요한 선택(큰 사건·갈림길·달력)에서는 시간이 멈추고, 대화·미션·작은 일에서는 계속 흐른다
  if(!caughtUp()){ L.cur.t-=dt; $('hTimer').style.width=Math.max(0,L.cur.t/G.sec*100)+'%'; }
  else { const r=G.roomInfo; $('hTimer').style.width=(r&&r.auto>0&&!r.paused?100-((Date.now()-r.t0)%(r.auto*60000))/(r.auto*600):100)+'%'; }
  L.cur.el=(L.cur.el||0)+dt; { const mn=monthNow(); if(mn!==G.mon){ G.mon=mn; renderMon(); } }
  if(G.sickT>0&&!L.f.dying){ G.sickT-=dt; if(G.sickT<=0){ G.sickT=0; L.getWell(); renderHud(); } }
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

/* 읽는 창(기억·내 정보·지도)을 보는 동안은 시간을 멈춘다: 해가 바뀌며 읽던 창이 갑자기 닫히지 않게(11-22 점검 UX-06) */
(function(){
  ['openMem','openInfo','openMaps'].forEach(n=>{ try{ const f=eval(n); if(typeof f==='function') eval(n+'=function(){ G.reading=1; return f.apply(this,arguments); }'); }catch(e){} });
  const _cs=closeSheet; closeSheet=function(){ G.reading=0; return _cs.apply(this,arguments); };
  const _ft=flowTick; flowTick=function(dt){ if(G.reading&&!$('sheet').hidden) return; if(G.reading&&$('sheet').hidden) G.reading=0; return _ft.apply(this,arguments); };
  // '새로 알게 된 것' 카드가 떠 있을 때 나가기를 누르면 카드를 먼저 닫는다(두 창이 겹치지 않게)
  const be=$('btnExit'), _ex=be&&be.onclick; if(be&&_ex) be.onclick=function(e){ const d=$('sixU'); if(d&&!d.hidden){ const ok=$('sixUOk'); if(ok) ok.click(); } return _ex.call(this,e); };
})();
