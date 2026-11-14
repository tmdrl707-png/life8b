/* [1 운영] 66-play-fixes.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */
// 1) 개발자 창 자리: 미니맵(과 그 아래 할 일 표시) 바로 아래
function devBarPlace(){ const b=$('devBar'); if(!b||b.hidden) return; const inGame=!$('s-game').hidden&&$('s-end').hidden; b.classList.toggle('side',inGame); if(!inGame) return;
  const mw=$('miniWrap'); if(!mw||!mw.offsetParent) return; const r=mw.getBoundingClientRect(); let top=r.bottom+6;
  document.querySelectorAll('#hQuest li').forEach(c=>{ if(!c.offsetParent) return; const q=c.getBoundingClientRect(); if(q.left<r.right) top=Math.max(top,q.bottom+6); });
  b.style.setProperty('--devTop',Math.round(top)+'px'); b.style.setProperty('--devLeft',Math.round(r.left)+'px'); b.style.setProperty('--devW',Math.round(Math.max(150,r.width))+'px'); }
(()=>{ const _db=devBar; devBar=function(){ const r=_db.apply(this,arguments); try{ devBarPlace(); }catch(e){} return r; };
  const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ requestAnimationFrame(devBarPlace); }catch(e){} return r; };
  addEventListener('resize',()=>setTimeout(devBarPlace,120)); })();
