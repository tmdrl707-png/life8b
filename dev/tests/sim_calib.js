(()=>{ // 나라마다 기대수명 맞추기용: 삶 NF개를 끝까지 살려 평균 수명을 잰다 (window.SIMC 나라, SIMN 삶 수)
const CS=(window.SIMC||'KR').split(','), N=window.SIMN||150, out={};
for(const c of CS){ let s=0; for(let i=0;i<N;i++){ const L=new Life({c}); L.runAuto(); s+=L.lifespan; } out[c]=[COUNTRIES[c].le,+(s/N).toFixed(2),+COUNTRIES[c].ref.toFixed(2)]; }
return out; })()
