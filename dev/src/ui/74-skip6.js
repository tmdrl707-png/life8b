/* 74-skip6: 집 안에서 '관계' 설명(2살)까지 들은 뒤에는 바로 6살로 건너뛰어 밖을 돌아다닐 수 있다 (11-14 선생님 요청)
   건너뛰는 동안의 해는 보통 삶처럼 자동으로 지나가며(작은 선택은 무작위), 기억은 그대로 남는다. 학급 방에서 반이 함께 움직이는 동안에는 쓰지 않는다. */
(function(){
  const b=document.createElement('button'); b.id='btnSkip6'; b.className='abtn'; b.hidden=true; b.textContent='6살로 가기 ▶'; ($('s-game')||document.body).appendChild(b);
  const css=document.createElement('style'); css.textContent='#btnSkip6{right:max(12px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));background:var(--gb-paper);color:var(--gb-ink);padding:10px 16px;font-size:.9rem}#btnSkip6[hidden]{display:none}@media (max-height:460px){#btnSkip6{font-size:.8rem;padding:7px 12px;bottom:calc(10px + env(safe-area-inset-bottom,0px))}}'; document.head.appendChild(css);
  const can=()=>{ const L=G.life; return !!(L&&L.f&&!G.teacher&&!caughtUp()&&G.running&&!L.dead&&L.age>=2&&L.age<6&&L.f.unS&&L.f.unS.r); };
  const show=()=>{ b.hidden=!can(); };
  const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ show(); }catch(e){} return r; };
  setInterval(()=>{ try{ show(); }catch(e){} },1500);
  b.onclick=()=>{ if(!can()) return; const L=G.life; resolveOpen(); G.hardPause=0;
    const d=$('sixU'); if(d&&!d.hidden){ d.hidden=true; d.innerHTML=''; paused=false; }
    L.endPeriod(); if(!L.dead&&L.age<6) L.runAuto(6);
    if(L.dead){ G.running=false; finishLife(); return; }
    G.sickT=0; L.news=[]; W.car=false; W.map='out'; const dr=doorOf('home'); W.x=dr[0]; W.y=dr[1]+.9; W.dir=0; NPCMAP={};
    beginPeriod(); toast('여섯 살이 되었어요. 이제 집 밖으로 나가 동네를 돌아다녀 보세요.'); b.hidden=true; };
})();
