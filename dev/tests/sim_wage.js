(()=>{ // 월급 통계: 30·40·50살에 일하는 사람의 월수입(L.inc, 만 원)을 모아 나라의 보통 월급(C.med)과 견준다
const CS=(window.SIMC||'KR').split(','), N=window.SIMN||150, out={};
const q=(a,p)=>{ const s=a.slice().sort((x,y)=>x-y); return s.length?s[Math.floor((s.length-1)*p)]:0; };
for(const c of CS){ const C=COUNTRIES[c], at={30:[],40:[],50:[]}, wk={30:0,40:0,50:0}, al={30:0,40:0,50:0};
  for(let n=0;n<N;n++){ const L=new Life({c});
    for(const A of [30,40,50]){ L.runAuto(A); if(L.dead) break; al[A]++; if(L.job&&!L.f.school&&L.inc>0){ wk[A]++; at[A].push(L.inc); } } }
  const r=A=>`${A}살 일함${Math.round(wk[A]*100/Math.max(1,al[A]))}% 중위 ${fmtPay(q(at[A],.5))}(${(q(at[A],.5)/C.med).toFixed(2)}배) 평균 ${(at[A].reduce((x,y)=>x+y,0)/Math.max(1,at[A].length)/C.med).toFixed(2)}배`;
  out[c]=`보통 월급 ${fmtPay(C.med)}(약 $${Math.round(C.med*10000/KRW_PER_USD)}) | ${r(30)} | ${r(40)} | ${r(50)}`; }
return out; })()
