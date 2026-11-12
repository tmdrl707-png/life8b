(()=>{ const out=[]; for(const c of ['KR','US','IN','NG','CN','DE']){ let L; for(let i=0;i<30;i++){ L=new Life({c}); L.runAuto(18); if(!L.dead&&L.f.sec) break; }
  if(!L.f.sec){ out.push(c+' 중등 없음'); continue; } const ch=univMenu(L,19);
  out.push(`${c} 흥미:${DIRS[L.f.dir].n} | ${ch.q}`); ch.opts.forEach(o=>out.push(`   ${o.label} — ${o.sub||''} — ${o.p==null?'확실':Math.round(o.p*100)+'%'}`));
  L.f.univDone=1; L.age=23; const jm=jobMenu(L,'어떤 일?'); jm.opts.forEach(o=>out.push(`   [일] ${o.label} — ${o.sub||''} — ${o.p==null?'확실':Math.round(o.p*100)+'%'}`)); }
 return out; })()
