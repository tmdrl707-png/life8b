/* [2-2 상호작용] 66-play-fixes.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

/* ---------- 일곱 살 아래: '지식 조금 ↑' 같은 칸 대신 부모님 말로 (11-14) ---------- */
const PV_LINE={h:'쑥쑥 크네. 튼튼해졌구나!',j:'웃는 걸 보니 나도 기분이 좋다.',k:'오, 이런 것도 알게 됐네!',t:'손으로 하는 게 점점 좋아지는구나.',e:'새로운 걸 해 봤구나. 잘했어.',r:'다들 너를 참 좋아하는구나.'};
(()=>{ const _ds=dlgShow; dlgShow=function(){ const L=G.life, it=DLG.q[0];
  if(L&&L.age<7&&it&&it.up&&it.up.length){ const key=Object.keys(PV_LINE).find(k=>it.up.some(u=>String(u).startsWith(AX_N[k]||STAT[k]||'?')))||'j';
    const who=R()<.5?'아빠':'엄마';
    DLG.q[0]=Object.assign({},it,{up:null}); if(!it.opts) DLG.q.splice(1,0,{who,t:PV_LINE[key]}); }
  return _ds.apply(this,arguments); }; })();
