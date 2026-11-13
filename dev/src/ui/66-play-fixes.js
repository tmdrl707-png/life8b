/* ========== [2-1 세계·화면] 선생님 플레이 점검(11-13 밤) 반영: 화면 다듬기 ==========
   1) 개발자 창: 위쪽 가운데의 긴 띠 → 미니맵 바로 아래, 미니맵 너비의 네모 칸(여러 줄). 접으면 버튼 하나.
   2) 미니맵(밖): 갈 수 있는 곳 전체를 한꺼번에 보이지 않고, 나를 가운데 두고 일정한 크기(가로 약 30칸)만 보인다.
      갈 수 있는 곳이 넓어져도 글씨가 작아지지 않고, 내가 움직이면 미니맵도 따라 움직인다.
   3) 미니맵 조금 크게, 해를 넘길 때 '지나간 일' 글씨를 크고 같은 색으로, 내 정보 '삶의 모양'을 한 화면에. */
document.head.insertAdjacentHTML('beforeend',`<style id="playFixCss">
#devBar.side{top:var(--devTop,160px);left:var(--devLeft,8px);transform:none;width:var(--devW,190px);max-width:none;display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:6px;border-radius:10px;justify-content:stretch}
#devBar.side b{grid-column:1/-1;margin:0 0 2px;text-align:left}
#devBar.side button{text-align:center;padding:5px 4px;font-size:.74rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#devBar.side button[data-a=tog]{grid-column:1/-1}
#devBar.side.mini{width:auto;grid-template-columns:auto auto;align-items:center}
#devBar.side.mini b{grid-column:auto;margin:0 4px 0 0}
#devBar.side.mini button[data-a=tog]{grid-column:auto}
@media (max-height:460px){ #devBar.side{bottom:auto;gap:3px;padding:4px} #devBar.side button{font-size:.6rem;padding:3px 2px} #devBar.side b{font-size:.6rem} }
#mini{width:196px!important;height:144px!important}
@media (min-width:900px) and (min-height:560px){ #mini{width:212px!important;height:156px!important} }
@media (max-height:460px){ #mini{width:124px!important;height:91px!important} }
.autolist li{font-size:.95rem!important;gap:4px!important;color:#283038}
.autolist b{color:#283038!important;font-weight:600!important}
.autolist span{color:#2858A8!important;font-size:.9rem!important}
.autolist em{color:#283038!important;font-size:.92rem!important}
.autolist .k{font-size:.78rem!important;color:#B4501E!important}
@media (max-height:460px){ .autolist li{font-size:.8rem!important} .autolist em,.autolist span{font-size:.78rem!important} }
.shapew{display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:center}
.shapew .shaper{flex:1 1 240px;max-width:360px;display:flex;flex-direction:column;align-items:center}
.shapew .shaper svg{width:100%;height:auto;max-height:min(44vh,300px)}
.shapew .axgrid{flex:1 1 200px;grid-template-columns:repeat(5,1fr)}
@media (max-height:460px){ .shapew .shaper svg{max-height:52vh} .shapew .axgrid{grid-template-columns:1fr 1fr 1fr;gap:4px} .shapew .axgrid b{font-size:1rem} }
.happy{grid-template-columns:7.5rem minmax(0,1fr) 3rem!important;font-size:.85rem!important}
.happy .hbar svg{width:100%}
</style>`);
// 1) 개발자 창 자리: 미니맵(과 그 아래 할 일 표시) 바로 아래
function devBarPlace(){ const b=$('devBar'); if(!b||b.hidden) return; const inGame=!$('s-game').hidden&&$('s-end').hidden; b.classList.toggle('side',inGame); if(!inGame) return;
  const mw=$('miniWrap'); if(!mw||!mw.offsetParent) return; const r=mw.getBoundingClientRect(); let top=r.bottom+6;
  document.querySelectorAll('#hQuest li').forEach(c=>{ if(!c.offsetParent) return; const q=c.getBoundingClientRect(); if(q.left<r.right) top=Math.max(top,q.bottom+6); });
  b.style.setProperty('--devTop',Math.round(top)+'px'); b.style.setProperty('--devLeft',Math.round(r.left)+'px'); b.style.setProperty('--devW',Math.round(Math.max(150,r.width))+'px'); }
(()=>{ const _db=devBar; devBar=function(){ const r=_db.apply(this,arguments); try{ devBarPlace(); }catch(e){} return r; };
  const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ requestAnimationFrame(devBarPlace); }catch(e){} return r; };
  addEventListener('resize',()=>setTimeout(devBarPlace,120)); })();
// 2) 미니맵이 나를 따라 움직이는 창 (갈 수 있는 곳 안에서)
const MINI_SPAN=30;   // 미니맵에 보이는 가로 칸 수
function miniRect(){ const r=reachOf(G.life.age), c=$('mini'), asp=c?c.height/c.width:.74;
  const x0=Math.max(0,r[0]-1), y0=Math.max(0,r[1]-1), x1=Math.min(OUT.w,r[0]+r[2]+1), y1=Math.min(OUT.h,r[1]+r[3]+1), RW=x1-x0, RH=y1-y0;
  let w=Math.min(MINI_SPAN,RW), h=w*asp; if(h>RH){ h=RH; w=Math.min(RW,h/asp); }
  // 갈 수 있는 곳이 창보다 작으면 그대로, 크면 나를 가운데에
  const cx=W.map==='out'?W.x:OUT.s.home[0], cy=W.map==='out'?W.y:OUT.s.home[1];
  const x=RW<=w?x0+(RW-w)/2:clamp(cx-w/2,x0,x1-w), y=RH<=h?y0+(RH-h)/2:clamp(cy-h/2,y0,y1-h);
  return [x,y,w,h]; }
(()=>{ const _dmF=drawMini; drawMini=function(t){ const vr=viewRect; viewRect=miniRect; try{ return _dmF.apply(this,arguments); } finally{ viewRect=vr; } }; })();
