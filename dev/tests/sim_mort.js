(()=>{ // 사망 통계: 20살까지 많이(5살 전·5~19살 사망, 사인), 끝까지 조금(기대수명). window.SIMC 나라, SIMN 20살까지 살릴 수(끝까지는 1/6)
const CS=(window.SIMC||'KR,NG').split(','), N=window.SIMN||1200, NF=Math.max(60,Math.round(N/6)), out={};
for(const c of CS){ const C=COUNTRIES[c]; let u5=0,d5=0,cz={},ages=[];
  for(let n=0;n<N;n++){ const L=new Life({c}); L.runAuto(20); if(L.dead){ if(L.lifespan<5) u5++; else d5++; cz[L.cause]=(cz[L.cause]||0)+1; } }
  for(let n=0;n<NF;n++){ const L=new Life({c}); L.runAuto(); ages.push(L.lifespan); }
  const m=ages.reduce((x,y)=>x+y,0)/NF;
  out[c]={le:C.le, mean:+m.toFixed(1), u5:C.u5, u5s:Math.round(u5*1000/N), d5_19:+(d5*1000/(N-u5)).toFixed(1), cause20:Object.entries(cz).map(([k,v])=>k+Math.round(v*100/(u5+d5||1))+'%').join(' ')};
}
return out; })()
