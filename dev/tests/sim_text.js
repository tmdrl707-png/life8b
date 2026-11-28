(()=>{ // 문구 점검용(결과가 커서 sim.py 대신 파일로 저장해 쓰기 권장): 여러 나라의 0~20살 삶을 화면에서처럼 진행하며 학생이 보게 되는 글(질문·선택지·결과·연말 소식)을 모두 모은다
const CS=(window.SIMC||'KR,KR,US,GB,JP,CN,IN,NG,ET,BR,DE,ID,PK,BD,EG,MX,PH,VN,FR,RU,CD,KE,TR,SA,AF,HT,NE,AU,AR,ZA,KP,TZ,IT,CA,PE,MA').split(','), N=window.SIMN||144, UP=window.SIMU||21;
const out=[]; const seen=new Set();
const put=(L,k,t,id)=>{ if(t==null) return; t=String(t); if(!t.trim()) return; const key=L.c+'|'+k+'|'+t; if(seen.has(key)) return; seen.add(key); out.push([L.c,L.set,L.age,k,t,id==null?'':String(id)]); };
const pick=(L,list,kind)=>L.autoPick(list,kind);
for(let n=0;n<N;n++){ const c=CS[n%CS.length]; let L; try{ L=new Life({c}); }catch(e){ out.push([c,'',0,'ERR',String(e).slice(0,200),'']); continue; }
  let g=0;
  try{ while(!L.dead&&L.age<UP&&g++<60){
    L.startPeriod();
    let gg=0; while(L.pending&&gg++<4){ const ch=L.pending; put(L,'choiceQ',ch.q); ch.opts.forEach(o=>put(L,'choiceL',o.label)); const r=L.choose(pick(L,ch.opts,'ch')); if(r) put(L,'choiceR',r.t); }
    // 한 해 동안 장면이 몇 번 새로 생긴다
    for(let s=0;s<3;s++) L.spawn();
    const cal=(L.cur&&L.cur.cal)||[];
    cal.map((it,k)=>[it.m,k]).sort((a,b)=>a[0]-b[0]).forEach(([m,k])=>{ const it=L.cur.cal[k]; if(!it||it.done) return; const ev=L.calEv(it); if(!ev) return; const v=L.calVars(ev,it);
      put(L,'calQ',L.fillV(v.__t||ev.txt,v),ev.id); const os=ev.opts||[]; os.forEach(o=>put(L,'calL',L.fillV(o.l,v),ev.id));
      const r=L.calDo(k,os.length?pick(L,os,'c'):null); if(r){ put(L,'calR',r.t,ev.id); } });
    (L.cur.scenes||[]).forEach((c,k)=>{ const sc=SCENES[c.i]; if(!sc||c.done) return; put(L,'sceneQ',L.tx(Array.isArray(sc.txt)?sc.txt[L.set==='U'?0:1]:sc.txt),c.i); sc.opts.forEach(o=>put(L,'sceneL',L.tx(o.l),c.i)); const r=L.doScene(k,pick(L,sc.opts,'s')); if(r) put(L,'sceneR',r.t,c.i); });
    for(let m=0;m<(L.cur.plan||0);m++){ const mi=L.major(); if(mi==null) break; const M=MAJORS[mi]; put(L,'majorQ',L.tx(M.txt),mi); M.opts.forEach(o=>put(L,'majorL',L.tx(o.l),mi)); const r=L.chooseMajor(pick(L,M.opts,'m')); if(r) put(L,'majorR',r.t,mi); }
    const e=L.endPeriod(); ((e&&e.entries)||[]).forEach(x=>put(L,'year',x.t));
  } }catch(e){ out.push([c,L.set,L.age,'ERR',String(e&&e.stack||e).slice(0,300),'']); }
}
return out; })()
