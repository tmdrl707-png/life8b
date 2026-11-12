(()=>{ const n={}; for(let i=0;i<60;i++){ const L=new Life({c:['KR','US','CN','DE','BR','JP'][i%6]}); L.runAuto(17); const d=dirRank(L)[0]; n[DIRS[d].n]=(n[DIRS[d].n]||0)+1; } return n; })()
