/* 81-hub: 오른쪽 위 '모음' 단추 + 설정(톱니바퀴) + 화면 투명도·알림 자리 (11-14 선생님 요청)
   - 모음 단추(#btnHub, 네 칸 그림)를 누르면 아래로 메시지(#btnFr, ui/80)·설정(#btnSet)이 펼쳐진다. 새 메뉴는 HUB_ITEMS 순서대로 #hubTray에 더한다.
   - 설정 패널(#setPanel): 게임 속도(한 해 1·3·5분)·글이 떠 있는 시간·확률 표시·능력치 표시·화면 투명도·큰 글씨. 열어도 시간은 멈추지 않는다.
   - 미니맵을 뺀 화면 상자(상태란·미션·알림 카드·길 안내·안내 글)는 반투명(--hudA, 설정에서 3단계).
   - 작은 일 알림 카드(#toasts)는 상태란 바로 오른쪽에 붙는다(자리가 좁으면 상태란 아래). */
(function(){
  const LK='life8b_ui';
  const UI=Object.assign({a:'m'},ls(LK)||{});   // a: 투명도 s 진하게 · m 보통 · t 투명하게
  const ALPHA={s:.9,m:.72,t:.52};
  const saveUI=()=>ls(LK,UI);
  // ---- 스타일 ----
  const st=document.createElement('style'); st.textContent=`
:root{--hudA:.72}
.hud .hinfo,#hQuest li,#hMission,#hSick,#hint,#hWait{background:rgba(253,251,245,var(--hudA))!important;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
#miniWrap{background:rgba(253,251,245,.97)!important}
#toasts .toast{background:rgba(255,253,246,calc(var(--hudA) + .1))!important;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
#toasts .toast.year{background:rgba(30,40,50,calc(var(--hudA) + .1))!important}
#guideBar{background:rgba(40,48,56,calc(var(--hudA) + .05))!important}
#toasts{transition:left .25s,top .25s}
#hubWrap{position:fixed;right:calc(env(safe-area-inset-right,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);z-index:56;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
#hubWrap[hidden]{display:none}
#btnHub{position:relative;width:56px;height:56px;padding:0;border-radius:16px;border:2px solid #fff;background:linear-gradient(160deg,#3B4A63 0%,#222C3C 100%);box-shadow:0 6px 16px rgba(0,0,0,.4);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s}
#btnHub svg{width:40px;height:40px;transition:transform .25s}
#btnHub.on svg{transform:rotate(45deg) scale(.9)}
#btnHub .bd{position:absolute;right:-5px;top:-5px;min-width:20px;height:20px;border-radius:10px;background:#E5484D;color:#fff;font:700 12px/20px inherit;text-align:center;padding:0 5px;border:2px solid #fff}
#btnHub .bd[hidden]{display:none}
#hubTray{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
#hubTray[hidden]{display:none}
#hubTray .hi{display:flex;align-items:center;gap:8px;animation:hubIn .22s ease-out both}
#hubTray .hi:nth-child(2){animation-delay:.05s}#hubTray .hi:nth-child(3){animation-delay:.1s}
#hubTray .hi>span{background:rgba(30,38,50,.82);color:#fff;font-size:13px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap}
#hubTray .hi[hidden]{display:none}
@keyframes hubIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
#hubTray #btnFr{position:relative!important;right:auto!important;top:auto!important}
#btnSet{width:52px;height:52px;padding:0;border-radius:50%;border:2px solid #fff;background:linear-gradient(180deg,#9AA6B6 0%,#5E6B7E 100%);box-shadow:0 5px 14px rgba(40,50,70,.5);cursor:pointer;display:flex;align-items:center;justify-content:center}
#btnSet svg{width:30px;height:30px}
#setPanel{position:fixed;right:0;top:0;bottom:0;width:min(360px,94vw);z-index:57;background:#FBF8F1;color:#222;box-shadow:-8px 0 28px rgba(0,0,0,.4);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px)}
#setPanel[hidden]{display:none}
#setPanel .fh{display:flex;align-items:center;gap:6px;padding:10px 12px;background:#4A5568;color:#fff}
#setPanel .fh b{flex:1;font-size:16px}
#setPanel .fh button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:8px;padding:5px 10px;font:inherit;cursor:pointer}
#setPanel .sb{flex:1;overflow:auto;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:14px;min-height:0}
#setPanel .sg h4{margin:0 0 6px;font-size:14px;color:#3A4250}
#setPanel .sg p{margin:5px 0 0;font-size:12px;color:#6F6650;line-height:1.5}
#setPanel .sq{display:flex;border:2px solid #3A4250;border-radius:10px;overflow:hidden}
#setPanel .sq button{flex:1;border:0;border-left:1px solid #CFC6B0;background:#fff;color:#222;font:inherit;font-size:13px;padding:8px 4px;cursor:pointer}
#setPanel .sq button:first-child{border-left:0}
#setPanel .sq button.on{background:#3A4250;color:#fff;font-weight:700}
#setPanel .sq.off{opacity:.45;pointer-events:none}
#btnSkip5{top:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 14px)!important}
@media (max-height:480px){#btnHub{width:46px;height:46px;border-radius:13px}#btnHub svg{width:32px;height:32px}#btnSet{width:44px;height:44px}#btnSet svg{width:25px;height:25px}#hubWrap{gap:7px}#hubTray{gap:7px}#hubTray .hi>span{font-size:11px;padding:3px 8px}}`;
  document.head.appendChild(st);
  const applyA=()=>document.documentElement.style.setProperty('--hudA',ALPHA[UI.a]||.72); applyA();

  // ---- 모음 단추와 펼침 ----
  const game=$('s-game')||document.body;
  const wrap=document.createElement('div'); wrap.id='hubWrap'; wrap.hidden=true;
  wrap.innerHTML=`<button id="btnHub" type="button" title="메뉴 모음" aria-label="메뉴 모음" aria-expanded="false">
    <svg viewBox="0 0 40 40"><rect x="3" y="3" width="15" height="15" rx="4" fill="#4C9BFF"/><rect x="22" y="3" width="15" height="15" rx="4" fill="#A9B4C4"/><rect x="3" y="22" width="15" height="15" rx="4" fill="#FFC24B"/><rect x="22" y="22" width="15" height="15" rx="4" fill="#5CC98A"/>
      <circle cx="7.5" cy="10.5" r="1.4" fill="#fff"/><circle cx="10.5" cy="10.5" r="1.4" fill="#fff"/><circle cx="13.5" cy="10.5" r="1.4" fill="#fff"/>
      <circle cx="29.5" cy="10.5" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><path d="M10.5 25.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff"/><path d="M29.5 25.5v10M24.5 30.5h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>
    <span class="bd" hidden></span></button><div id="hubTray" hidden></div>`;
  game.appendChild(wrap);
  const tray=wrap.querySelector('#hubTray'), hub=wrap.querySelector('#btnHub');
  const item=(label,el)=>{ const d=document.createElement('div'); d.className='hi'; d.innerHTML=`<span>${label}</span>`; d.appendChild(el); tray.appendChild(d); return d; };
  // 메시지(ui/80의 단추를 옮겨 온다)
  const fr=$('btnFr'); let frItem=null; if(fr){ frItem=item('메시지',fr); }
  // 설정(톱니바퀴)
  const gear=document.createElement('button'); gear.id='btnSet'; gear.type='button'; gear.title='설정'; gear.setAttribute('aria-label','설정');
  gear.innerHTML='<svg viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.4z"/><circle cx="12" cy="12" r="3.2" fill="#5E6B7E"/></svg>';
  item('설정',gear);
  // (앞으로 더할 메뉴는 여기에 item('이름', 단추))
  const setOpen=v=>{ tray.hidden=!v; hub.classList.toggle('on',v); hub.setAttribute('aria-expanded',v?'true':'false'); };
  hub.onclick=()=>setOpen(tray.hidden);
  const inGame=()=>!!(G.life&&G.running&&!$('s-game').hidden);
  setInterval(()=>{ try{ const on=inGame(); wrap.hidden=!on; if(!on){ setOpen(false); if(!panel.hidden) closeP(); }
      if(frItem) frItem.hidden=!!fr.hidden;
      const fb=fr&&fr.querySelector('.bd'), hb=hub.querySelector('.bd'); const n=fb&&!fb.hidden?fb.textContent:''; hb.hidden=!n||!tray.hidden; hb.textContent=n; }catch(e){} },500);

  // ---- 설정 패널 ----
  const panel=document.createElement('div'); panel.id='setPanel'; panel.hidden=true; game.appendChild(panel);
  const sq=(k,arr,cur,off)=>`<div class="sq${off?' off':''}" data-k="${k}">${arr.map(([v,t])=>`<button type="button" data-v="${v}" class="${String(cur)===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  function draw(){ const L=G.life, room=!!(G.room&&!G.teacher), yl=(L&&L.yl)||+G.opts.yl||180, rp=roomCfg('prob');
    const sixV=(()=>{ try{ return sixHudV(); }catch(e){ return 'B'; } })(), big=document.documentElement.classList.contains('big');
    panel.innerHTML=`<div class="fh"><b>설정</b><button id="setX" type="button">닫기 ✕</button></div><div class="sb">
      <div class="sg"><h4>게임 속도</h4>${sq('yl',[[60,'빠르게 · 1분'],[180,'보통 · 3분'],[300,'느리게 · 5분']],yl,room||G.teacher)}
        <p>${room?'학급 방에서는 선생님이 반의 시간을 정해요.':G.teacher?'교사용 체험은 시작할 때 고른 속도로 흘러요.':`한 해가 흐르는 데 걸리는 시간이에요. 지금 해에도 바로 적용돼요. 100살까지 약 <b>${lifeTimeText(yl)}</b>.`}</p></div>
      <div class="sg"><h4>글이 떠 있는 시간</h4>${sq('read',[[1,'보통'],[1.8,'길게 (천천히 읽기)']],+(G.opts.read||1)>1?1.8:1)}<p>알림 카드가 화면에 머무는 시간이에요.</p></div>
      <div class="sg"><h4>잘될 확률 표시</h4>${sq('prob',[[0,'숨기기'],[1,'높음·보통·낮음'],[2,'숫자(%)']],rp!=null?+rp:(G.opts.prob==null?2:+G.opts.prob),rp!=null)}${rp!=null?'<p>선생님이 반 설정으로 정해 두었어요.</p>':''}</div>
      <div class="sg"><h4>능력치 표시 모양</h4>${sq('six',[['A','막대'],['B','동그라미'],['C','육각형'],['D','점']],sixV)}</div>
      <div class="sg"><h4>화면 상자 투명도</h4>${sq('a',[['s','진하게'],['m','보통'],['t','투명하게']],UI.a)}<p>지도를 뺀 상태란·알림·안내 상자가 비쳐 보이는 정도예요.</p></div>
      <div class="sg"><h4>글씨 크기</h4>${sq('big',[[0,'보통'],[1,'크게']],big?1:0)}</div>
    </div>`;
    $('setX').onclick=closeP;
    panel.querySelectorAll('.sq').forEach(s=>s.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; set(s.dataset.k,b.dataset.v); draw(); }); }
  function set(k,v){ const L=G.life;
    if(k==='yl'){ v=+v; if(!L||G.teacher||(G.room&&!G.teacher)) return; const old=L.yl||G.sec||v; L.yl=v; G.opts.yl=v; G.sec=secOf(L); if(L.cur&&L.cur.t>0) L.cur.t=L.cur.t*v/old; if(L.cur&&L.cur.el) L.cur.el=L.cur.el*v/old; ls('life8b_opts',G.opts); try{ persist(); }catch(e){} toast(`게임 속도: 한 해 ${v/60}분`); }
    else if(k==='read'){ G.opts.read=+v; ls('life8b_opts',G.opts); }
    else if(k==='prob'){ G.opts.prob=+v; ls('life8b_opts',G.opts); }
    else if(k==='six'){ ls('life8b_sixhud',v); }
    else if(k==='a'){ UI.a=v; saveUI(); applyA(); }
    else if(k==='big'){ const on=v==='1'; document.documentElement.classList.toggle('big',on); const bb=$('btnBig'); if(bb) bb.classList.toggle('on',on); setTimeout(placeToasts,50); }
    try{ renderHud(); }catch(e){} }
  function openP(){ try{ if(window.FRIENDS) FRIENDS.close(); }catch(e){} setOpen(false); panel.hidden=false; draw(); }
  function closeP(){ panel.hidden=true; }
  gear.onclick=()=>{ if(panel.hidden) openP(); else closeP(); };
  if(fr){ fr.addEventListener('click',()=>{ closeP(); setOpen(false); }); }

  // ---- 알림 카드 자리: 상태란 바로 오른쪽 ----
  function placeToasts(){ const t=$('toasts'), h=document.querySelector('.hud .hinfo'); if(!t||!h||$('s-game').hidden) return;
    const r=h.getBoundingClientRect(); if(!r.width) return; const W=innerWidth, hubW=(wrap.hidden?0:wrap.getBoundingClientRect().width)+24, room=W-r.right-10-hubW, s=t.style;
    if(room>=190){ s.setProperty('left',(r.right+10)+'px','important'); s.setProperty('top',r.top+'px','important'); s.setProperty('width',Math.min(room,400)+'px','important'); }
    else { s.setProperty('left',r.left+'px','important'); s.setProperty('top',(r.bottom+30)+'px','important'); s.setProperty('width',Math.min(r.width,360)+'px','important'); }
    s.setProperty('right','auto','important'); s.setProperty('transform','none','important'); }
  addEventListener('resize',()=>setTimeout(placeToasts,60)); setInterval(()=>{ try{ placeToasts(); }catch(e){} },700);
  { const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ placeToasts(); }catch(e){} return r; }; }
  window.HUB={open:()=>setOpen(true),close:()=>setOpen(false),settings:openP};
})();
