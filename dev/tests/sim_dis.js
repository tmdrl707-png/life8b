(()=>{ // 재해: 50살까지 살리며 '재해 큰 사건'(MAJORS 가운데 hz가 있는 것, 분쟁 빼고)을 겪은 횟수 → 10년에 몇 번
const CS=(window.SIMC||'KR').split(','), N=window.SIMN||150, out={};
const DT=new Map(); MAJORS.forEach(m=>{ if(m.hz&&m.hz!=='unrest') DT.set(m.txt,m.hz); });
for(const c of CS){ let n=0, y=0, by={};
  for(let i=0;i<N;i++){ const L=new Life({c}); L.runAuto(50); y+=L.dead?L.lifespan:L.age;
    (L.mem||[]).forEach(m=>{ const h=m.q&&DT.get(m.q); if(h){ n++; by[h]=(by[h]||0)+1; } }); }
  out[c]=`10년에 ${(n*10/y).toFixed(2)}번 (${Object.entries(by).map(([k,v])=>k+' '+(v*10/y).toFixed(2)).join(', ')}) hz=${COUNTRIES[c].hz.join('/')}`; }
return out; })()
