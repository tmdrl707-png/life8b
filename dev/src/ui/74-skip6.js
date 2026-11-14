/* 74-skip6: 집 안에서 '관계' 설명(2살)까지 들은 뒤에는 바로 6살로 건너뛰어 밖을 돌아다닐 수 있다 (11-14 선생님 요청)
   건너뛰는 동안의 해는 보통 삶처럼 자동으로 지나가며(작은 선택은 무작위), 기억은 그대로 남는다. 학급 방에서 반이 함께 움직이는 동안에는 쓰지 않는다. */
(function(){
  const row=document.querySelector('.hbtns'), pz=$('btnPause');
  const b=document.createElement('button'); b.id='btnSkip6'; b.type='button'; b.className='hbtn sk6'; b.hidden=true; b.textContent='6살로 ▶'; b.title='집 안에서 지내는 시기를 건너뛰고 6살로 가요';
  if(row) row.insertBefore(b,pz||null); else ($('s-game')||document.body).appendChild(b);
  const css=document.createElement('style'); css.textContent='.hbtn.sk6{background:linear-gradient(180deg,#E8F7E4 0%,#C8E8C0 100%);font-weight:700}#btnSkip6[hidden]{display:none}'; document.head.appendChild(css);
  const can=()=>{ const L=G.life; return !!(L&&L.f&&!G.teacher&&!caughtUp()&&G.running&&!L.dead&&L.age>=2&&L.age<6&&L.f.unS&&L.f.unS.r); };
  const show=()=>{ b.hidden=!can(); };
  const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ show(); }catch(e){} return r; };
  setInterval(()=>{ try{ show(); }catch(e){} },1500);
  const go=()=>{ if(!can()) return; const L=G.life; resolveOpen(); G.hardPause=0;
    const d=$('sixU'); if(d&&!d.hidden){ d.hidden=true; d.innerHTML=''; paused=false; }
    L.endPeriod(); if(!L.dead&&L.age<6) L.runAuto(6);
    if(L.dead){ G.running=false; finishLife(); return; }
    G.sickT=0; L.news=[]; W.car=false; W.zone&&typeof setZone==='function'&&setZone(0); W.map='home'; W.x=7; W.y=7.2; W.dir=0; NPCMAP={};
    L.f.g6=1; beginPeriod(); b.hidden=true; };
  b.onclick=()=>{ if(!can()) return; G.hardPause=1; const L=G.life, n=6-L.age;
    sheet(`<h2>6살로 건너뛸까요?</h2>
      <p class="sub">0~5살은 집 안에서 지내는 시기예요. 건너뛰면 지금(${L.age}살)부터 6살까지 <b>${n}년</b>이 한꺼번에 지나가요.</p>
      <ul class="small sub" style="text-align:left;margin:6px 0 10px 18px;padding:0;line-height:1.6"><li>그동안의 작은 선택은 저절로 정해져요.</li><li>지나간 일은 '기억'에 남아요.</li><li>6살이 되면 집 안에서 시작하고, 아래쪽 문으로 나가 동네를 돌아다닐 수 있어요.</li></ul>
      <div class="row"><button class="btn primary" id="btnSk6Go">6살로 가기</button><button class="btn" id="btnOk">아직 안 갈래요</button></div>`);
    const g=$('btnSk6Go'); if(g) g.onclick=()=>{ closeSheet(); go(); };
    const ok=$('btnOk'); if(ok) ok.onclick=()=>{ G.hardPause=0; closeSheet(); }; };
  // 6살이 되었을 때(건너뛰었든 그냥 살았든) 한 번만: 이제 집 밖으로 나갈 수 있다는 안내
  { const _bp=beginPeriod; beginPeriod=function(){ const r=_bp.apply(this,arguments); try{ const L=G.life; if(L&&L.age===6&&L.f&&!L.f.g6s){ L.f.g6s=1; toast(L.f.g6?'여섯 살이 되었어요. 집 아래쪽 문으로 나가 동네를 돌아다녀 보세요.':'여섯 살이 되었어요. 이제 집 아래쪽 문으로 나가 동네를 돌아다닐 수 있어요.'); } }catch(e){} return r; }; }
})();
