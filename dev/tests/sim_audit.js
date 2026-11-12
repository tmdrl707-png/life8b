(()=>{ // 여러 삶을 자동으로 살려 모든 기록 문장을 모은다 (어색한 점 찾기용)
const CS=(window.SIMC||'KR,KR,KR,KR,US,JP,CN,IN,NG,ET,BR,DE,ID,PK,BD,EG,MX,PH,VN,GB,FR,RU,CD,KE,TR,SA,AF,HT,NE,AU').split(','), N=window.SIMN||120;
const out=[]; const LP=Life.prototype, r0=LP.remember;
let cur=null; LP.remember=function(e){ if(cur&&e&&e.t){ const f=this.f||{}, j=this.job; cur.push({a:e.a,t:String(e.t),q:e.q?String(e.q):'',sc:e.sc||'',st:{k:(this.kids||[]).length,m:f.family?1:f.widow?2:0,j:j?j.kind:'',ji:f.job||'',h:this.house>0?1:0,sch:f.school?1:0,ret:f.retired?1:0,sp:this.ppl&&this.ppl.spouse?1:0,pre:this.ppl&&this.ppl.pre?1:0}}); } return r0.apply(this,arguments); };
const lives=[];
for(let n=0;n<N;n++){ const c=CS[n%CS.length]; cur=[]; let L; try{ L=new Life({c}); L.runAuto(); }catch(e){ lives.push({c,err:String(e).slice(0,200)}); continue; }
  lives.push({c,set:L.set,w:Math.round(L.w*100),age:L.age,job:L.job?L.job.n:'-',ev:cur}); }
LP.remember=r0; return lives; })()
