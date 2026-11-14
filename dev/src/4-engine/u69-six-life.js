/* [4 내용(엔진)] 69-six.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */
// 한 해 내내 손을 놓은 것은 해가 바뀔 때 조금 준다 (지금 플레이하는 삶만)
(function(){ const P=Life.prototype, _e=P.endPeriod; P.endPeriod=function(){ const L=this, a=L.age, live=typeof G!=='undefined'&&G.life===L&&!L._auto, Y=live&&L.cur?(L.cur.tk||{}):null, c=(Y&&Y.c)||{};
  const res=_e.apply(this,arguments); if(!live||L.dead||a<2||!res||!Array.isArray(res.entries)) return res;
  const op=k=>L.f.un&&L.f.un[k]!=null&&L.f.un[k]<=a, s=L.s, lost=[];
  if(op('r')&&!c.r&&s.r>22){ for(const k in (L.rel||{})) L.rel[k]=Math.max(0,L.rel[k]-2.5); s.r=L.relAgg(); lost.push(['올해는 가까운 사람들과 이야기를 거의 나누지 못했다.',{r:-2}]); }
  if(op('h')&&a>=5&&!c.h&&s.h>30){ s.h=Math.max(30,s.h-1.5); lost.push(['올해는 몸을 별로 움직이지 않았다.',{h:-2}]); }
  if(op('k')&&!c.k&&s.k>sixExp('k',a)*.65){ s.k=Math.max(sixExp('k',a)*.65,s.k-1.5); lost.push(['올해는 책도 문제도 거의 펼치지 않았다.',{k:-2}]); }
  if(op('t')&&!c.t&&s.t>sixExp('t',a)*.65){ s.t=Math.max(sixExp('t',a)*.65,s.t-1.2); lost.push(['올해는 손으로 무언가를 만들거나 연습하지 않았다.',{t:-1}]); }
  if(op('e')&&!c.e&&s.e>sixExp('e',a)*.75){ s.e=Math.max(sixExp('e',a)*.75,s.e-.8); lost.push(['올해는 새로 해 본 일이 별로 없었다.',{e:-1}]); }
  lost.forEach(([t,fx])=>res.entries.push({t,fx,big:0}));
  try{ const H=L.hist[L.hist.length-1]; if(H&&H.a===a) SIX.forEach(k=>{ if(k!=='m'&&s[k]!=null) H[k]=Math.round(s[k]); }); }catch(e){}
  return res; }; })();

/* ---------- 4) 고등학생 용돈 ---------- */
pocket=(old=>function(L){ if(L.age>=16&&L.age<19){ const y=L.age, P=L.f.pk; if(!P||P.y!==y) L.f.pk={y,left:allowYear(L)}; return L.f.pk; } return old(L); })(pocket);
