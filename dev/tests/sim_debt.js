(()=>{ // 채무 조정까지 간 삶 하나의 돈 흐름 (월급 몇 달치 단위)
for(let i=0;i<80;i++){ const c=['KR','US','IN','NG','CN','BR'][i%6]; const L=new Life({c}); L.runAuto();
  if(L.f.rehab){ const m=L.C.med, r=x=>Math.round(x/m);
    return [c,L.f.rehab,'cap '+r(L.debtCap()),...L.money.filter(e=>e.a<=L.f.rehab+2).map(e=>`${e.a}: in${r(e.inc)} sp${r(e.spend)} nd${r(e.need)} ev${r(e.ev)} int${r(e.int)} cash${r(e.cash)} h${r(e.house)}${e.tight?' T':''}`)]; } }
return 'none'; })()
