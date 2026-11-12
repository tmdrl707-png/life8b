/* ===== 기존 사건의 효과를 새 체계로 바꾼다 (불러올 때 한 번) =====
   · 공부 밖의 활동(연습·훈련·동아리·대회·아르바이트·자격증·일을 배움)은 지식 대신 기술로
   · 거짓말·모른 척·약속 어기기는 관계(신뢰)를 깎고, 솔직함·약속 지키기·사과는 조금 올린다
   · 한 선택에서 크게 오르는 축은 두 개까지(각 +3), 나머지는 +1, 내리는 쪽은 −3까지 (큰 사건은 조금 더 넓게)
   · 재난·사고 사건에는 건강 감소를 붙인다 (한 번에 25까지) */
const RX_SKILL=/연습|훈련|동아리|대회|아르바이트|알바|자격증|기술|일을 배|배워 본다|배운다|실력|수습|견습|인턴|코딩|악기|만들어|고쳐|손에 익|부업|봉사|공모전|작품|무대|리더|반장|회장|부장|맡아/,
  RX_STUDY=/공부|시험|책|수업|숙제|복습|예습|학원|과외|도서관|문제집|강의/,
  RX_LIE=/거짓말|속인다|속여|속였|모른 척|약속을 어|핑계|베낀다|베꼈|훔친|몰래|뒷담|떠넘|발뺌|숨긴다|숨겼/,
  RX_TRUST=/솔직|약속을 지|사과한다|사과했|정직|돌려준다|돌려주었|돌려줬|책임진다|책임졌|사실대로/,
  RX_NOVEL=/처음|새로운|새로 |도전|떠난다|가 본다|가 보기로|배워 본다|여행|모험|낯선|외국|해외|직접 해 본다|나가 본다|참가|신청한다|지원한다/, RX_STAY=/집에 있는다|쉰다|가지 않는다|안 간다|빠진다|미룬다|거절|포기|하지 않는다|그만둔다|다음에/,
  RX_HURT=/다쳤|다친|부러|입원|꿰맸|사고를 당|사고가 났|화상|쓰러|깔렸|물에 빠/,
  DIS_SC=/^(flood|quake|storm|fire|volcano|drought|heat|cold)$/;
const CONV={opt:0,skill:0,trust:0,cap:0,hurt:0};
function convFx(fx,txt,big,lab){ if(!fx) return fx; const g=Object.assign({},fx), AX=['h','j','k','r','t','e'];
  if(RX_SKILL.test(txt)&&!RX_STUDY.test(txt)&&((g.k||0)>0||!AX.some(k=>(g[k]||0)>0))){ const t=Math.min(3,Math.max(1,Math.round(((g.k||0)>0?g.k:2)*.8))); g.t=(g.t||0)+t; if(g.k>0) g.k=Math.max(0,g.k-t)||undefined; CONV.skill++; }
  if(lab&&RX_NOVEL.test(lab)&&!RX_STAY.test(lab)){ g.e=(g.e||0)+2; CONV.novel=(CONV.novel||0)+1; }
  if(RX_LIE.test(txt)){ g.r=Math.min(g.r||0,0)-2; CONV.trust++; } else if(RX_TRUST.test(txt)&&(g.r||0)<2){ g.r=(g.r||0)+1; CONV.trust++; }
  const up=big?4:3, dn=big?-5:-3, pos=AX.filter(k=>(g[k]||0)>0).sort((a,b)=>g[b]-g[a]);
  pos.forEach((k,i)=>{ const lim=i<2?(big&&k==='j'?6:up):1; if(g[k]>lim){ g[k]=lim; CONV.cap++; } });
  AX.forEach(k=>{ if((g[k]||0)<0){ const lim=k==='h'?(big?-12:-6):k==='j'&&big?-6:dn; if(g[k]<lim){ g[k]=lim; CONV.cap++; } } });
  for(const k in g) if(g[k]===undefined||g[k]===0&&AX.includes(k)) delete g[k];
  return g; }
(function(){
  CAL.forEach(ev=>{ const base=String(ev.txt||'');
    (ev.opts||[]).forEach(o=>{ CONV.opt++; o.fx=convFx(o.fx||{},[o.l,o.res,o.fail].flat().filter(Boolean).join(' '),false,o.l); });
    if(!ev.opts&&ev.fx){ const g=Object.assign({},ev.fx); if(RX_HURT.test(base)){ g.h=Math.min(g.h||0,-8); CONV.hurt++; } else if(DIS_SC.test(ev.sc||'')||ev.c&&ev.c.some(t=>/^hz:/.test(t))){ g.h=Math.min(g.h||0,-3); CONV.hurt++; } if(g.h<-25) g.h=-25; ev.fx=g; }
    else if(!ev.opts&&!ev.fx&&RX_HURT.test(base)&&!ev.run){ ev.fx={h:-8}; CONV.hurt++; } });
  SCENES.forEach(sc=>sc.opts.forEach(o=>{ CONV.opt++; o.fx=convFx(o.fx||{},[o.l,o.res].join(' '),false,o.l); }));
  MAJORS.forEach(m=>m.opts.forEach(o=>{ CONV.opt++; const tx=[m.txt,o.l,o.ok,o.fail].flat().filter(Boolean).join(' '); o.okFx=convFx(o.okFx||{},tx,true,o.l); o.failFx=convFx(o.failFx||{},tx,true); }));
  if(typeof QUESTS!=='undefined') QUESTS.forEach(q=>{ if(q.fx){ CONV.opt++; q.fx=convFx(q.fx,[q.ask,q.ok].join(' '),false); } });
})();
// 검사: 한 선택에서 크게 오르는 축 두 개, 각 +3(큰 사건 +4, 행복 +6) 이하
function convCheck(){ const bad=[], AX=['h','j','k','r','t','e'], chk=(fx,big,w)=>{ const p=AX.filter(k=>(fx[k]||0)>1); if(p.length>2||p.some(k=>fx[k]>(big?(k==='j'?6:4):3))) bad.push(w); };
  CAL.forEach(ev=>(ev.opts||[]).forEach(o=>chk(o.fx||{},false,ev.txt))); SCENES.forEach(sc=>sc.opts.forEach(o=>chk(o.fx||{},false,sc.txt))); MAJORS.forEach(m=>m.opts.forEach(o=>{ chk(o.okFx||{},true,m.txt); chk(o.failFx||{},true,m.txt); })); return bad; }

