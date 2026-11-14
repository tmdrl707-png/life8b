(()=>{ // 엔진을 고칠 때 결과가 바뀌지 않았는지 보는 '기준값': 난수를 고정해 여러 삶을 끝까지 살리고 기록 전체의 지문을 낸다
let s=20261115; window.__rng=()=>{ s=(Math.imul(s,1103515245)+12345)>>>0; return s/4294967296; };
const D0=Date, FIX=Date.UTC(2026,10,15,3,0,0); window.Date=class extends D0{ constructor(...a){ a.length?super(...a):super(FIX); } static now(){ return FIX; } };
const CS=(window.SIMC||'KR,US,IN,NG,CN,BR,DE,ID,PK,ET,JP,MX,EG,FR,PH,BD,VN,TR,IR,TH').split(','), N=window.SIMN||40, upto=window.SIMU;
const h=t=>{ let x=2166136261; for(let i=0;i<t.length;i++){ x^=t.charCodeAt(i); x=Math.imul(x,16777619)>>>0; } return x.toString(16); };
const rows=[]; let all='';
for(let n=0;n<N;n++){ const L=new Life({c:CS[n%CS.length]}); L.runAuto(upto); const d=JSON.stringify(L.dump()); all+=d; rows.push(CS[n%CS.length]+' '+L.age+' '+h(d)); }
window.Date=D0; window.__rng=Math.random.__o||window.__rng; return {all:h(all), n:rows.length, rows};
})()
