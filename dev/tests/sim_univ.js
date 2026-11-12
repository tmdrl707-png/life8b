(()=>{ // 성적 수준별 대학 후보 (나라마다): 공부를 못하던 아이가 의예과에 지원하는 일이 없는지
const out=[]; for(const c of ['KR','US','IN','NG','CN','DE']){ let L; for(let i=0;i<30;i++){ L=new Life({c}); L.runAuto(18); if(!L.dead&&L.f.sec) break; }
  if(!L.f.sec){ out.push(c+' 중등 없음'); continue; }
  for(const ac of [25,50,70,88]){ L.ac=ac; delete L.f.uex; delete L.f.uOffer; L.f.dir='care'; L.f.dirs={care:3,sci:1}; L.f.major=null; const ch=univMenu(L,19);
    out.push(`${c} 학업 ${ac} (성적 ${Math.round(acadQ(L)*100)}) | ${ch.q}`); ch.opts.forEach(o=>out.push(`   ${o.label} — ${o.sub||''} — ${o.p==null?'확실':Math.round(o.p*100)+'%'}`)); } }
 return out; })()
