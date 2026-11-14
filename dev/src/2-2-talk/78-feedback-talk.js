/* [2-2 상호작용] 78-feedback.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

/* ---------- 1) 미션(파란색)이 일반 말 걸기보다 먼저 ----------
   미션 주는 사람·가야 할 곳 가까이에 있으면(2.6칸 안) 그 사람에게 말 걸기·물건 만져 보기보다 미션이 먼저 뜬다. */
{ const _ne=nearExtra; nearExtra=function(){ const r=_ne.apply(this,arguments);
    try{ const L=G.life; if(L&&L.q&&r&&(r.type==='t'||r.type==='o')){ let best=null, bd=2.6;
        for(const tg of targets()){ if(tg.type!=='q'||tg.m!==W.map) continue; const d=Math.hypot(tg.p[0]-W.x,tg.p[1]-W.y); if(d<bd){ bd=d; best=tg; } }
        if(best) return best; } }catch(e){}
    return r; }; }
