(()=>{ // 여러 삶을 자동으로 살려 돈의 흐름을 본다
const CS=(window.SIMC||'KR,KR,KR,US,IN,NG,CN,BR,DE,ID,PK,ET').split(','), out=[];
for(let n=0;n<48;n++){ const c=CS[n%CS.length]; let L=new Life({c}); L.runAuto(); const med=L.C.med;
  let minCash=0, minA=0; (L.money||[]).forEach(e=>{ if(e.cash<minCash){ minCash=e.cash; minA=e.a; } });
  const last=(L.money||[]).slice(-1)[0];
  out.push([c,L.age,L.job?L.job.n:'-',Math.round(L.cash/med),Math.round(L.house/med),Math.round(minCash/med),minA,Math.round(med*12/10000)+'만/년']); }
const big=out.filter(x=>x[5]< -120).length;
return {cols:'나라 나이 일 마지막현금(월급배) 집(월급배) 최저현금(월급배) 그때나이 보통연봉',big, rows:out.map(r=>r.join(' '))};
})()
