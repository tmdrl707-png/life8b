/* [2-3 시간·사건 진행] 78-feedback.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

/* ---------- 2) 0살 처음: 위쪽 '내 정보'·'기억' 단추 안내 (한 번만) ---------- */
{ const _bp=beginPeriod; beginPeriod=function(){ const r=_bp.apply(this,arguments);
    try{ const L=G.life; if(L&&L.f&&L.age===0&&!L.f.gInfo){ L.f.gInfo=1; setTimeout(()=>{ try{ toast("위쪽의 '내 정보'에서 나와 가족을 볼 수 있고, '기억'에서 지나온 일을 다시 볼 수 있어요."); }catch(e){} },1400); } }catch(e){}
    return r; }; }

/* ---------- 4) 몸이 아플 때: 얼마나 쉬어야 하는지 보여 주고, 아파서 쉰 해는 '몸을 안 움직였다'로 치지 않는다 ---------- */
{ setInterval(()=>{ try{ const L=G.life, sk=$('hSick'); if(L&&G.running&&G.sickT>0&&!L.f.dying&&sk&&!sk.hidden) sk.textContent=`몸이 아파요 · 쉬는 중 · 약 ${Math.ceil(G.sickT)}초 남음`; }catch(e){} },400);
  const _ss=startSick; startSick=function(){ const r=_ss.apply(this,arguments); try{ const L=G.life; if(L&&L.f) L.f.sy=L.age; }catch(e){} return r; };
  const P=Life.prototype, _ep=P.endPeriod; P.endPeriod=function(){ try{ const L=this, Y=L.cur&&L.cur.tk; if(Y&&typeof G!=='undefined'&&G.life===L){ Y.c=Y.c||{};
        if(!Y.c.h){ const walked=(W.walk||0)-(G._walk0||0); if(L.f.sy===L.age||G.sickT>0||walked>=(L.age<7?40:80)) Y.c.h=1; }
        if(!Y.c.r&&((Y.n||0)>=2||Object.keys(Y.who||{}).length>=1||(L.q&&L.q.st===2))) Y.c.r=1;   /* 말을 건 사람·마친 미션도 '이야기를 나눔'으로(11-22 점검 CONT-06) */ G._walk0=W.walk||0; } }catch(e){}
    return _ep.apply(this,arguments); }; }
