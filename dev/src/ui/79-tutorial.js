/* ========== 79-tutorial: 0~5살 처음 안내 (11-14 선생님 요청) ==========
   시작 화면에서 '처음 안내 보기'(기본) 또는 '건너뛰고 6살부터'를 고른다 (G.opts.tut 1|0).
   · 안내 보기: 0살에 조작·대화·위쪽 메뉴·시간·능력치·건강을 차례로 짚어 준다 → '5살로 가기'로 1~4살은 저절로 지나간다
     → 5살에 관계(+경험)·미션·작은 선택·미니맵·'6살부터 집 밖' 안내 → 그 뒤는 보통 플레이.
   · 건너뛰기: 바로 6살, 집 안에서 시작하고 현관 문으로 나갈 수 있다.
   L.f.tut: 1 = 0살 안내 차례, 2 = 5살 안내 차례, 3 = 끝. 학급 방(반이 같은 나이로 움직임)에서는 나이를 건너뛰지 않고 안내만 한다. */
(function(){
  if(G.opts.tut==null) G.opts.tut=1;
  // ---- 시작 화면: 처음 안내 고르기 ----
  { const _r=renderBSet; renderBSet=function(){ const r=_r.apply(this,arguments); try{ const v=G.opts.tut===0?0:1;
      $('bSet').insertAdjacentHTML('beforeend',`<h3>처음 안내 (0~5살)</h3><div class="stack-s"><div class="seg" data-o="tut"><button data-v="1" class="${v?'on':''}">안내 보며 시작 ★추천</button><button data-v="0" class="${v?'':'on'}">건너뛰고 6살부터</button></div>
        <p class="small sub">${v?'0살에 조작법과 메뉴를, 5살에 미션과 지도를 알려 줘요. 그 사이(1~4살)는 저절로 지나가요.':'바로 여섯 살이 되어 집 밖 동네로 나갈 수 있어요. 처음 해 보는 사람에게는 안내를 추천해요.'}</p></div>`); }catch(e){} return r; }; }
  { const _bs=$('bSet').onclick; $('bSet').onclick=function(e){ const r=_bs?_bs.apply(this,arguments):undefined; try{ const sg=e.target.closest('.seg'); if(sg&&sg.dataset.o==='tut'){ ls('life8b_opts',G.opts); renderBSet(); } }catch(er){} return r; }; }

  // ---- 화면: 어둡게 덮고 한 곳만 밝히는 안내 카드 ----
  document.head.insertAdjacentHTML('beforeend',`<style>
#tut{position:absolute;inset:0;z-index:170}
#tut[hidden]{display:none}
#tut.nofocus{background:rgba(8,14,22,.66)}
#tut .ring{position:absolute;border-radius:14px;box-shadow:0 0 0 3px #FF9A62,0 0 18px 4px rgba(255,140,80,.55),0 0 0 9999px rgba(8,14,22,.66);transition:left .3s,top .3s,width .3s,height .3s;pointer-events:none}
#tut.nofocus .ring{display:none}
#tut .tc{position:absolute;left:50%;transform:translateX(-50%);width:min(27rem,calc(100% - 24px));box-sizing:border-box;padding:16px 18px 14px;border-radius:18px;color:#EEF3F6;
  background:radial-gradient(ellipse at 50% 0%,rgba(255,154,98,.14),transparent 70%),linear-gradient(180deg,#1A2839 0%,#131F2E 100%);border:1px solid rgba(255,201,168,.35);box-shadow:0 18px 40px rgba(0,0,0,.5);font-family:"Pretendard","Apple SD Gothic Neo",sans-serif;animation:tutIn .25s ease-out}
@keyframes tutIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
#tut .tc .lb{font-size:.78rem;font-weight:700;color:#FFC9A8;letter-spacing:.03em;display:flex;justify-content:space-between;gap:8px}
#tut .tc .lb .dots{display:flex;gap:4px;align-items:center}#tut .tc .lb .dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.22)}#tut .tc .lb .dots i.on{background:#FF9A62}
#tut .tc h2{margin:.35rem 0 .45rem;font-size:1.3rem;line-height:1.3;color:#fff;word-break:keep-all}
#tut .tc .tx{font-size:.95rem;line-height:1.65;color:#C9D6E1;word-break:keep-all}
#tut .tc .tx p{margin:0 0 .4rem}#tut .tc .tx b{color:#FFE7C9}
#tut .tc .tx .kb{display:inline-block;min-width:1.6em;text-align:center;padding:0 .35em;border-radius:6px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);font-weight:700;color:#fff;font-size:.88em}
#tut .tc .tx .blue{color:#8DB6FF;font-weight:800}#tut .tc .tx .org{color:#FF9A62;font-weight:800}
#tut .tc .bt{display:flex;gap:8px;justify-content:flex-end;margin-top:.7rem}
#tut .tc .bt button{font:inherit;font-weight:700;border-radius:999px;padding:8px 16px;cursor:pointer;border:1px solid rgba(255,255,255,.3);background:transparent;color:#DCE6EE}
#tut .tc .bt button.pr{border:0;background:linear-gradient(180deg,#FF9A62,#E2703A);color:#1A1208;box-shadow:0 4px 14px rgba(226,112,58,.4)}
@media (max-height:460px){ #tut .tc{padding:10px 14px 10px;width:min(30rem,calc(100% - 20px))} #tut .tc h2{font-size:1.05rem;margin:.2rem 0 .3rem} #tut .tc .tx{font-size:.8rem;line-height:1.5} #tut .tc .tx p{margin:0 0 .2rem} #tut .tc .bt{margin-top:.4rem} #tut .tc .bt button{padding:5px 13px;font-size:.85rem} }
</style>`);
  const box=document.createElement('div'); box.id='tut'; box.hidden=true; box.innerHTML='<div class="ring"></div><div class="tc" role="dialog" aria-modal="true"></div>'; ($('s-game')||document.body).appendChild(box);
  const ring=box.querySelector('.ring'), card=box.querySelector('.tc');
  const tutOpen=()=>!box.hidden;
  let T=null;   // {steps,i,done}
  function place(){ if(!T) return; const s=T.steps[T.i], el=s.el?(typeof s.el==='function'?s.el():document.querySelector(s.el)):null, R=box.getBoundingClientRect();
    const r=el&&el.offsetParent!==null?el.getBoundingClientRect():null;
    if(!r||!r.width){ box.classList.add('nofocus'); card.style.top='50%'; card.style.bottom=''; card.style.transform='translate(-50%,-50%)'; card.style.animation='none'; return; }
    box.classList.remove('nofocus'); const p=6, x=r.left-R.left-p, y=r.top-R.top-p, w=r.width+p*2, h=r.height+p*2;
    Object.assign(ring.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
    card.style.transform='translateX(-50%)'; card.style.animation='';
    const ch=card.offsetHeight, below=y+h+12, above=y-12-ch;
    if(below+ch<=R.height-8){ card.style.top=below+'px'; card.style.bottom=''; }
    else if(above>=8){ card.style.top=above+'px'; card.style.bottom=''; }
    else { card.style.top=''; card.style.bottom='10px'; }
    // 밝힌 곳 옆에 놓을 자리가 있으면 옆으로 (넓은 화면)
    if(R.width>=760&&x+w+20+card.offsetWidth<=R.width&&r.top-R.top<R.height*.5&&below+ch>R.height-8){ card.style.left=(x+w+16)+'px'; card.style.transform='none'; card.style.top=Math.max(8,y)+'px'; card.style.bottom=''; }
    else card.style.left='50%'; }
  function render(){ const s=T.steps[T.i], n=T.steps.length, last=T.i===n-1;
    card.innerHTML=`<div class="lb"><span>${esc(T.tag)} · ${T.i+1} / ${n}</span><span class="dots">${T.steps.map((_,k)=>`<i class="${k===T.i?'on':''}"></i>`).join('')}</span></div><h2>${s.h}</h2><div class="tx">${s.p}</div>
      <div class="bt">${T.i>0?'<button type="button" class="pv">이전</button>':''}<button type="button" class="pr nx">${last?(T.end||'시작하기'):'다음 ▶'}</button></div>`;
    card.querySelector('.nx').onclick=()=>{ if(last) close(); else { T.i++; render(); } };
    const pv=card.querySelector('.pv'); if(pv) pv.onclick=()=>{ T.i--; render(); };
    try{ s.on&&s.on(); }catch(e){}
    card.style.left='50%'; place(); requestAnimationFrame(place); card.querySelector('.nx').focus(); }
  function close(){ const d=T&&T.done; T=null; box.hidden=true; G.hardPause=0; paused=false; lastT=performance.now(); try{ renderHud(); }catch(e){} if(d) d(); }
  function run(tag,steps,end,done){ try{ resolveOpen(); }catch(e){} T={tag,steps,i:0,end,done}; G.hardPause=1; paused=true; IN.jx=IN.jy=0; IN.id=null; box.hidden=false; render(); }
  addEventListener('resize',()=>{ if(tutOpen()) place(); });
  addEventListener('keydown',e=>{ if(!tutOpen()) return; if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){ e.preventDefault(); e.stopImmediatePropagation(); card.querySelector('.nx').click(); } else if(e.key==='ArrowLeft'){ e.preventDefault(); e.stopImmediatePropagation(); const b=card.querySelector('.pv'); if(b) b.click(); } else { e.stopImmediatePropagation(); } },true);
  window.tutOpen=tutOpen;

  // ---- 나이 건너뛰기 (74의 6살로 가기와 같은 방식) ----
  function jump(age){ const L=G.life; resolveOpen(); G.hardPause=0; const d=$('sixU'); if(d&&!d.hidden){ d.hidden=true; d.innerHTML=''; paused=false; }
    L.endPeriod(); if(!L.dead&&L.age<age) L.runAuto(age);
    if(L.dead){ G.running=false; finishLife(); return false; }
    L.f.unS=L.f.unS||{}; SIX.forEach(k=>{ if(L.f.un&&L.f.un[k]!=null&&age===5) L.f.unS[k]=1; });   // 5살 안내가 관계·경험을 직접 알려 준다
    G.sickT=0; L.news=[]; W.car=false; if(W.zone&&typeof setZone==='function') setZone(0); W.map='home'; W.x=7; W.y=7.2; W.dir=0; NPCMAP={}; $('toasts').innerHTML='';
    beginPeriod(true); return true; }
  const ringOf=k=>()=>{ const i=SIX.indexOf(k), l=document.querySelectorAll('#hRes .si'); return l[i]||null; };
  const ME=k=>{ try{ return SIX_MEET[k](G.life); }catch(e){ return ['','','']; } };

  // ---- 0살 안내 ----
  function steps0(){ const L=G.life, room=!!G.room, h=ME('h');
    return [
      {h:`${esc(L.name)}의 삶이 시작되었어요`,p:`<p>0~5살은 <b>처음 안내</b> 시간이에요. 화면을 보는 법과 움직이는 법을 차례로 알려 줄게요.</p><p>안내가 떠 있는 동안은 시간이 멈춰 있어요.</p>`},
      {h:'움직이기',el:'#hint',p:`<p><b>휴대폰</b>: 화면을 누른 채 가고 싶은 쪽으로 끌면 걸어가요.</p><p><b>컴퓨터</b>: <span class="kb">←</span><span class="kb">↑</span><span class="kb">↓</span><span class="kb">→</span> 방향키나 <span class="kb">W</span><span class="kb">A</span><span class="kb">S</span><span class="kb">D</span>로 움직여요.</p>`},
      {h:'다가가서 누르기',p:`<p>사람·동물·물건 가까이 가면 오른쪽 아래에 <b>둥근 단추</b>가 떠요.</p><p>단추를 누르면(키보드는 <span class="kb">스페이스</span>·<span class="kb">엔터</span>) 말을 걸거나 만져 볼 수 있어요. <b>반짝이(✦)</b>가 있는 곳은 아직 해 볼 것이 남은 곳이에요.</p>`},
      {h:'대화창',p:`<p>말을 걸면 화면 <b>아래에 대화창</b>이 열려요. 글을 누르면 다음으로 넘어가요.</p><p>고를 것이 나오면 하나를 누르세요. 옆에 <b>잘될 확률</b>이 함께 보여요. 큰 일은 화면 가운데 창으로, 작은 소식은 오른쪽 위 알림으로 와요.</p>`},
      {h:'내 정보',el:'#btnInfo',p:`<p>나와 가족, <b>삶의 모양</b>(능력치 육각형), <b>내 행복을 만드는 것</b>을 볼 수 있어요.</p>`},
      {h:'기억',el:'#btnMem',p:`<p>지금까지 지나온 일들이 나이 순서대로 남아 있어요. 저절로 지나간 해의 일도 여기서 볼 수 있어요.</p>`},
      {h:'저장하기 · 나가기',el:()=>{ const a=$('btnPause'), b=$('btnExit'); return a&&b?{getBoundingClientRect:()=>{ const r1=a.getBoundingClientRect(), r2=b.getBoundingClientRect(); return {left:r1.left,top:Math.min(r1.top,r2.top),width:r2.right-r1.left,height:Math.max(r1.bottom,r2.bottom)-Math.min(r1.top,r2.top)}; },offsetParent:1}:null; },
        p:`<p><b>저장하기</b>를 누르면 저장되고 시간이 멈춰요. 쉬었다가 이어서 할 수 있어요.</p><p><b>나가기</b>로 그만두어도 같은 아이디로 들어오면 이어서 살 수 있어요.</p>`},
      {h:'흐르는 시간',el:'#hud .timer',p:`<p>이 막대가 줄어들면 <b>한 해</b>가 지나고 한 살 더 먹어요.</p><p>창이 떠 있어도 시간은 흘러요. 그해에 고르지 않은 일은 한 해가 끝날 때 저절로 정해져요.</p>`},
      {h:'능력치와 행복',el:'#hRes',p:`<p>위쪽 동그라미는 <b>건강·관계·경험·지식·기술·재산</b>, 맨 앞 얼굴은 <b>행복</b>이에요.</p><p>자물쇠는 나이가 들면 하나씩 열려요. 동그라미를 <b>누르면 설명</b>이 나와요.</p>`},
      {h:'처음 열린 능력치 · 건강',el:ringOf('h'),p:`<p>${esc(h[0])} ${esc(h[1])}</p><p>${h[2]}</p>`},
      {h:'이제 시작해요',p:`<p>집 안을 걸어 다니며 가족에게 다가가 보세요. 한 해씩 저절로 자라요.</p>${room?'':`<p>위쪽의 <b>5살로</b> 단추를 누르면 <b>언제든</b> 다섯 살로 건너뛸 수 있어요. 꼭 누르지 않아도 되고, 안 눌러도 다섯 살이 되면 <b>관계</b>와 <b>미션</b>을 알려 줄게요.</p>`}`}
    ]; }
  // ---- 5살 안내 ----
  function steps5(){ const L=G.life, r=ME('r'), e=ME('e');
    if(!L.q){ try{ L.questOffer(); }catch(er){} }
    const q=L.q&&typeof QUESTS!=='undefined'?QUESTS[L.q.i]:null, giver=q?giverName(q.giver):'';
    return [
      {h:'다섯 살이 되었어요!',el:'#btnMem',p:`<p>1~4살 동안 있었던 일은 <b>기억</b>에 남아 있어요. 궁금하면 나중에 열어 보세요.</p>`},
      {h:'새로 열린 능력치 · 관계',el:ringOf('r'),p:`<p>${esc(r[0])} ${esc(r[1])}</p><p>${r[2]}</p>`},
      {h:'그리고 경험',el:ringOf('e'),p:`<p>${esc(e[0])} ${esc(e[1])}</p>`},
      {h:'미션',el:'#miniWrap',p:`<p><span class="blue">파란 물음표(?)</span>는 <b>미션</b>이에요. 지도에서는 <span class="blue">파란 점</span>으로 보여요.</p><p>${giver?`지금은 <b>${esc(giver)}</b>에게 부탁받을 일이 있어요. `:''}부탁한 사람에게 가서 이야기를 듣고 → 말한 곳에 다녀와서 → 다시 알려 주면 끝나요.</p>`},
      {h:'미션으로 달라지는 것',el:'#hRes',p:`<p>미션을 하면 <b>능력치가 오르거나 내려요</b>. 잘 해내면 가족과 가까워지고, 뜻대로 안 되기도 해요.</p><p>미션을 끝내면 얼마 뒤 <b>새 미션</b>이 생겨요. <span class="org">주황 느낌표(!)</span>는 작은 고를 일이에요. 이것도 능력치를 바꿔요.</p>`},
      {h:'작은 지도',el:'#miniWrap',p:`<p>왼쪽 위는 지금 있는 곳의 <b>지도</b>예요. 깜빡이는 하얀 점이 나, <span class="blue">파란 점</span>은 미션, <span class="org">주황 점</span>은 고를 일이에요.</p><p>지도를 누르면 크게 볼 수 있어요.</p>`},
      {h:'여섯 살부터는 집 밖으로',el:'#miniWrap',p:`<p>지금은 집 안에서만 지내요. <b>여섯 살</b>이 되면 아래쪽 <b>현관 문</b>으로 나가 동네를 돌아다닐 수 있어요.</p><p>나이가 들수록 갈 수 있는 곳이 넓어지고, 지도도 동네 지도로 바뀌어요.</p>`},
      {h:'이제 직접 해 보세요',p:`<p>다섯 살 한 해는 자유롭게 지내요. <b>파란 미션</b>을 하나 해 보면 좋아요!</p><p>한 해가 지나 여섯 살이 되면 그때부터는 내 뜻대로 살아가요.</p>`}
    ]; }

  // ---- 언제 띄울지 ----
  function check(){ const L=G.life; if(!L||!L.f||!G.running||G.teacher||$('s-game').hidden||tutOpen()) return;
    const f=L.f; if(!f.tut||f.tut>=3) return;
    if(!$('sheet').hidden||(typeof dlgOpen==='function'&&dlgOpen())) return;
    const d=$('sixU'); if(d&&!d.hidden) return;
    if(L.age>5){ f.tut=3; return; }
    if(f.tut===1&&L.age<5){ f.unS=f.unS||{}; f.unS.h=1; f.gInfo=1;
      run('처음 안내',steps0(),'시작하기',()=>{ f.tut=2; persist(); }); return; }
    if(f.tut<=2&&L.age===5){ f.unS=f.unS||{}; SIX.forEach(k=>{ if(f.un&&f.un[k]!=null) f.unS[k]=1; });
      run('다섯 살 안내',steps5(),'시작하기',()=>{ f.tut=3; persist(); }); } }
  setInterval(()=>{ try{ check(); }catch(e){ console.warn(e); } },600);
  // 학급 방: 1~4살에 관계·경험 카드는 5살 안내에서 함께 (안내를 보는 삶만)
  { const _iv=sixUnlockShow; sixUnlockShow=function(L,k){ if(L&&L.f&&L.f.tut&&L.f.tut<3&&L.age<5&&(k==='r'||k==='e')) return; return _iv.apply(this,arguments); }; }
  // 74의 '6살로' 단추는 처음 안내 중(0~4살)에는 숨긴다

  // ---- '5살로' 단추: 0~4살 어느 때나 (의무 아님) ----
  { const b=document.createElement('button'); b.id='btnSkip5'; b.type='button'; b.hidden=true; b.innerHTML='<b>5살로 건너뛰기</b><span>언제든 누를 수 있어요</span>'; b.title='집 안에서 지내는 시기를 건너뛰어 5살로 가요'; ($('s-game')||document.body).appendChild(b);
    { const st=document.createElement('style'); st.textContent=`#btnSkip5{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 118px);transform:translateX(-50%);z-index:60;display:flex;flex-direction:column;align-items:center;gap:1px;padding:9px 22px 8px;border:2px solid #fff;border-radius:999px;background:linear-gradient(180deg,#FFB547 0%,#F0791F 100%);color:#fff;font:inherit;cursor:pointer;box-shadow:0 6px 18px rgba(240,121,31,.55),0 0 0 4px rgba(255,181,71,.35);animation:sk5p 1.8s ease-in-out infinite}#btnSkip5 b{font-size:17px;line-height:1.2;text-shadow:0 1px 2px rgba(0,0,0,.35)}#btnSkip5 span{font-size:11px;opacity:.92}#btnSkip5[hidden]{display:none}@keyframes sk5p{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.06)}}@media (max-height:480px){#btnSkip5{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);left:50%;padding:6px 16px 5px}#btnSkip5 b{font-size:14px}#btnSkip5 span{display:none}}`; document.head.appendChild(st); }
    const can=()=>{ const L=G.life; return !!(L&&L.f&&L.f.tut&&L.f.tut<3&&!G.teacher&&!G.room&&G.running&&!L.dead&&L.age<5&&!tutOpen()); };
    const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ b.hidden=!can(); }catch(e){} return r; }; setInterval(()=>{ try{ b.hidden=!can(); }catch(e){} },1000);
    b.onclick=()=>{ if(!can()||!$('sheet').hidden) return; G.hardPause=1; const L=G.life, n=5-L.age;
      sheet(`<h2>5살로 건너뛸까요?</h2><p class="sub">지금(${L.age}살)부터 5살까지 <b>${n}년</b>이 한꺼번에 지나가요. 그동안의 작은 선택은 저절로 정해지고, 지나간 일은 '기억'에 남아요. 5살이 되면 관계와 미션 안내가 나와요.</p><div class="row"><button class="btn primary" id="btnSk5Go">5살로 가기</button><button class="btn" id="btnOk">아직 안 갈래요</button></div>`);
      $('btnSk5Go').onclick=()=>{ closeSheet(); if(jump(5)) persist(); }; $('btnOk').onclick=()=>{ G.hardPause=0; closeSheet(); }; }; }

  // ---- 새 삶을 시작할 때 ----
  { const _go=$('btnLive').onclick; $('btnLive').onclick=function(){ const L=G.life, tut=G.opts.tut!==0;
      if(L&&L.f){ L.f.tut=tut?1:3; L.f.gInfo=1; if(tut){ L.f.unS=L.f.unS||{}; L.f.unS.h=1; } }
      const r=_go.apply(this,arguments);
      try{ if(!tut&&G.life&&!G.room&&!G.teacher&&G.life.age<6){ G.life.f.g6=1; jump(6); } }catch(e){ console.warn(e); }
      return r; }; }
})();
