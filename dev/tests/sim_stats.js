(()=>{ // 실제 통계와 견주기: 나라마다 여러 삶을 끝까지 살려 사망·사인·재해·소득을 모은다 (window.SIMC 나라, window.SIMN 삶 수)
const CS=(window.SIMC||'KR,JP,US,DE,CN,BR,MX,IN,ID,BD,PK,NG,ET,CD').split(','), N=window.SIMN||300;
const DIS=/홍수|물에 잠|강물이 넘|지진|땅이 크게 흔들|태풍|사이클론|허리케인|폭풍|가뭄|폭염|산불|화산|쓰나미|한파|눈보라/;
const q=(a,p)=>{ const s=a.slice().sort((x,y)=>x-y); return s.length?s[Math.floor((s.length-1)*p)]:null; };
const out={};
for(const c of CS){ const C=COUNTRIES[c]; let u5=0,d5_19=0,u20=0,ages=[],cz={},cz20={},dis=0,disYears=0,yrs=0,sick20=0,inc=[],incW=[],work=0,adult=0;
  for(let n=0;n<N;n++){ const L=new Life({c}); L.runAuto(); const a=L.lifespan; ages.push(a);
    if(a<5) u5++; else if(a<20) d5_19++; if(a<20){ u20++; cz20[L.cause]=(cz20[L.cause]||0)+1; } cz[L.cause]=(cz[L.cause]||0)+1;
    const ds=new Set((L.mem||[]).filter(m=>DIS.test(m.t||'')).map(m=>m.a)); dis+=ds.size; yrs+=a;
    sick20+=(L.mem||[]).filter(m=>m.a<20&&/아파|앓|병원에 입원|열이/.test(m.t||'')).length;
    for(const h of (L.hist||[])) if(h.a>=30&&h.a<=50){ adult++; if(h.m>0){ work++; inc.push(h.m); } }
  }
  const med=C.med, top=o=>Object.entries(o).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([k,v])=>k+':'+Math.round(v*100/N)+'%').join(' ');
  out[c]=`le ${C.le} → 평균 ${Math.round(ages.reduce((x,y)=>x+y,0)/N)} 중위 ${q(ages,.5)} | u5 ${C.u5}‰ → ${Math.round(u5*1000/N)}‰ | 5~19살 ${Math.round(d5_19*1000/N)}‰ | 20살 전 사인 ${top(cz20)} | 전체 사인 ${top(cz)} | 재해 한 삶 ${(dis/N).toFixed(1)}번(10년에 ${(dis*10/yrs).toFixed(2)}) | 20살 전 아픈 기억 ${(sick20/N).toFixed(1)} | 30~50살 일함 ${Math.round(work*100/Math.max(1,adult))}% 월수입 중위 ${fmtPay(q(inc,.5)||0)} (보통 월급 ${fmtPay(med)}의 ${(q(inc,.5)/med).toFixed(2)}배, 하위10% ${(q(inc,.1)/med).toFixed(2)} 상위10% ${(q(inc,.9)/med).toFixed(2)})`;
}
return out; })()
