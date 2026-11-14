/* ========== 게임 진행 ========== */
let near=null, lastT=0, paused=false;
function startGame(){
  const L=G.life; if(!L.look) L.look=randLook(L.C.rg); L.sick=0; G.sickT=0; if(!L.opt) L.opt={card:1,ask:1,soft:0};
  W.map='home'; W.x=7; W.y=5; W.car=false; W.dir=0; NPCMAP={}; show('game'); $('toasts').innerHTML=''; $('flash').hidden=true; $('sheet').hidden=true; $('hint').hidden=false; paused=false;
  G.room=G.teacher?(G.troom||null):((G.data&&G.data.room)||null); if(G.room&&!L.wsR&&L.age<=1){ let h=5381; for(const ch of String(G.room)) h=((h<<5)+h+ch.charCodeAt(0))>>>0; L.ws=h%1000000000; L.wsR=1; } G.roomPi=null; G.roomInfo=null; G.syncT=0; G.memT=0; G.told=false; G.spawnT=3;
  G.running=true; try{ resize(); beginPeriod(true); }catch(e){ if(typeof reportErr==='function') reportErr(e,'시작'); try{ renderHud(); }catch(e2){} }   // 시작 중 오류가 나도 게임은 이어진다
  lastT=performance.now(); requestAnimationFrame(loop);
}
const caughtUp=()=>G.room&&G.roomPi!=null&&G.life.pi>=G.roomPi;
const seasonOf=L=>L.C.seasons[L.pi%4];
function beginPeriod(first){
  const L=G.life; if(!L.comps){ try{ L.makeComps(); }catch(e){} }
  const cur=L.startPeriod(); if(cur.t==null) cur.t=G.sec; if(cur.mt==null) cur.mt=Math.min(12,G.sec*.2); if(cur.qt==null) cur.qt=9;
  NPCMAP={}; G.sickT=0;
  toast(`${L.by+L.age}년 · ${L.age}살 · ${seasonOf(L)}`,'year');
  const news=L.news||[]; L.news=[];
  news.filter(n=>!n.big&&n.t).forEach(n=>toast(n.t,'news',n.fx));
  const mn=news.find(n=>n.money); if(mn) moneyToast(mn.money);
  if(L.f.dying) goHomeBed();
  if(L.age<6&&W.map!=='home'){ W.map='home'; W.x=7; W.y=5; }
  if(W.map==='elem'&&!(L.age<=12&&L.f.elem)){ W.map='out'; const d=doorOf('elem'); W.x=d[0]; W.y=d[1]+.9; }
  if(!canDrive()&&(W.car||(W.map==='out'&&W.x>OUT.hw[0]-.5))){ W.car=false; W.map='home'; W.x=7; W.y=8; }
  if(first&&L.n===0&&L.age===0) toast('느낌표가 뜬 곳으로 기어가 보세요.');
  renderHud(); persist(); memberBeat();
  const bigs=news.filter(n=>n.big); let bi=0;                        // 중요한 일은 하나씩 장면 그림과 함께 큰 창으로
  const next=()=>{ if(bi<bigs.length){ const n=bigs[bi++]; if(n.kid!=null&&L.kids[n.kid]) nameKid(n,next); else if(softOn()&&(n.sc||sceneKindOf(n.t))==='farewell'){ toast(n.t,'news'); next(); } else popup(`${L.age}살 · ${n.dying?'마지막 시간':'삶의 중요한 순간'}`,n.t,n.fx,next,n.dying?'bad':'',n.sc||sceneKindOf(n.t)); } else if(L.pending) openCross(); };
  const catching=G.room&&G.roomPi!=null&&L.pi<G.roomPi-1, card=!first&&!catching&&!L.f.dying&&L.age>=3&&L.opt&&L.opt.card!==0&&G.sec>=30;
  const afterCard=()=>askSheet(L,next);
  if(card) yearCard(L,afterCard); else if(!catching) afterCard(); else next();
}
// 해마다 돈이 어떻게 바뀌었는지
function moneyToast(e){ const d=e.inc-e.spend+e.int+e.ev, y=e.step>1?e.step+'년':'해';
  toast(`돈 · 지난 ${y} 번 돈 ${fmtWon(e.inc)} − 생활비 ${fmtWon(e.spend)}${e.ev?` ${e.ev>0?'+':'−'} 큰일 ${fmtWon(Math.abs(e.ev))}`:''}${Math.abs(e.int)>=1?` ${e.int>0?'+':'−'} 이자 ${fmtWon(Math.abs(e.int))}`:''} → 가진 돈 ${fmtWon(e.cash)}${e.house?` · 집 ${fmtWon(e.house)}`:''}${e.tight?' · 빚이 많아 버는 만큼만 쓰며 아껴 살았다':''}`,'money'+(d<0?' dn':'')); G.moneyFlash=d>=0?'up':'dn'; }
// 아이 이름 짓기
function nameKid(n,after){ const L=G.life, k=L.kids[n.kid], sug=[k.given]; for(let i=0;i<6&&sug.length<4;i++){ const g=pickGiven(L,k.sex,'now'); if(!sug.includes(g)) sug.push(g); }
  sheet(`${sceneHTML('baby')}<div class="place">${L.age}살 · 새 생명</div><p class="evt">${esc(n.t)}</p>${chips(n.fx)}
    <label class="field" for="kidName">아이의 이름을 지어 주세요${k.sur?` <span class="sub small">· 성은 ${esc(k.sur)}</span>`:''}<input id="kidName" maxlength="8" value="${esc(k.given)}" autocomplete="off"></label>
    <div class="seg" id="kidSug">${sug.map(x=>`<button type="button" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><button class="btn primary" id="btnOk">이 이름으로 부르기 ▶</button>`,'event');
  $('kidSug').onclick=e=>{ const b=e.target.closest('button'); if(b) $('kidName').value=b.dataset.v; };
  $('btnOk').onclick=()=>{ L.renameKid(n.kid,$('kidName').value); closeSheet(); toast(`${L.kids[n.kid].n}, 반가워!`,'news'); renderHud(); persist(); after(); }; }
// 교사용: 해를 넘기며 남은 일을 확률이 가장 높은 선택으로 정하고, 중요한 일은 모아서 보여 준다
function teacherYearEnd(){ const L=G.life, a=L.age, log=L.autoResolve();
  const items=log.length?log.map(x=>`<li><span class="k">${esc(x.kind)}</span><b>${esc(x.q)}</b><span>→ ${esc(x.label)}${x.p!=null?` · 확률 ${Math.round(x.p*100)}%`:' · 확률 표시 없음(100%)'} · ${x.ok?'이루어짐':'뜻대로 되지 않음'}</span><em>${esc(x.t)}</em></li>`).join('')
    :'<li class="none"><b>없음</b><span>올해의 중요한 일은 모두 직접 골랐습니다.</span></li>';
  const cl=log.cal||[], calItems=cl.length?`<p class="small sub" style="margin:8px 0 2px">그 밖에 올해 지나간 일 ${cl.length}가지</p><ul class="autolist">${cl.map(r=>`<li><span class="k">${r.m>12?r.m-12:r.m}월</span>${r.q?`<b>${esc(r.q)}</b><span>→ ${esc(r.label||'')}${r.p!=null?` · 확률 ${Math.round(r.p*100)}%`:''}</span>`:''}<em>${esc(r.t)}</em></li>`).join('')}</ul>`:'';
  sheet(`<div class="place">${a}살 · 해를 넘기며</div><h2>${log.length?`고르지 않은 중요한 일 ${log.length}가지가 자동으로 정해졌어요`:'자동으로 정해진 중요한 일: 없음'}</h2><ul class="autolist">${items}</ul>${calItems}<p class="small sub">확률이 가장 높은 선택으로 정했습니다. 남은 작은 선택과 미션도 같은 방식으로 마무리했습니다.</p><button class="btn primary" id="btnOk">다음 해로 ▶</button>`,'cross big');
  renderHud(); $('btnOk').onclick=()=>{ closeSheet(); finishPeriod(); }; }
function memberBeat(dead){ if(!G.room||G.teacher||!Store.sess) return; const L=G.life; Store.memberPatch(G.room,{id:Store.sess.id,name:L.name,age:L.dead?L.lifespan:L.age,n:L.n,dead:dead?1:0,c:L.c,t:Date.now(),title:null,epi:null,ans:null,cause:null}); }
async function syncRoom(){
  const r=await Store.roomGet(G.room); if(!r||!G.running) return; G.roomInfo=r; G.roomPi=roomEffPi(r); const L=G.life;
  if(L.cur&&L.pi<G.roomPi){ const gap=G.roomPi-L.pi; L.cur.t=Math.min(L.cur.t,gap>1?3:1.2); if(gap>1&&!G.told){ G.told=true; toast(`반의 나이(${ageOfPi(G.roomPi)}살)까지 빠르게 따라가는 중이에요.`); } } else G.told=false;
  renderHud();
}
function renderHud(){
  const L=G.life; $('hAge').textContent=L.age+'살'; renderMon(); $('hName').textContent=`${L.name} · ${L.C.n} ${SETN[L.set]}${L.job?' · '+L.job.n:''}${G.room?' · '+G.room+' 반':''}`;
  const mo=$('hMoney'), adult=L.age>=19||L.f.univ; mo.hidden=!adult;
  if(adult){ mo.innerHTML=`<span class="${L.cash<0?'neg':''}">가진 돈 ${fmtWon(L.cash)}${L.cash<0?' (빚)':''}</span>${L.house?`<span>집 ${fmtWon(L.house)}</span>`:''}`; if(G.moneyFlash){ mo.classList.remove('up','dn'); void mo.offsetWidth; mo.classList.add(G.moneyFlash); G.moneyFlash=null; } }
  const sk=$('hSick'); sk.hidden=!isSick(); if(isSick()) sk.textContent=L.f.dying?'마지막 시간 · 집에서 가족과 함께':`몸이 아파요 · 집에서 쉬는 중`;
  const imp=$('btnImp'); imp.hidden=!G.teacher||!L.cur; if(G.teacher&&L.cur){ const left=L.majorLeft()+(L.pending?1:0); imp.textContent=left?`중요 사건 바로 보기 ▶ ${left}`:'올해 중요 사건 없음'; imp.classList.toggle('off',!left); }
  $('s-game').classList.toggle('tmode',!!G.teacher);
  $('hQuest').innerHTML='';   // 지도 위의 ! 표시로 알 수 있으니 글자 목록은 따로 두지 않는다 (11-14)
  const q=L.q, m=$('hMission');
  m.hidden=true;   // '미션 · ○○ 다녀오기' 글자는 없앴다 (11-14 개발자 피드백)
  $('btnNext').hidden=!!caughtUp()||!G.teacher; $('hWait').hidden=!caughtUp();
  if(caughtUp()) $('hWait').textContent=G.roomInfo&&G.roomInfo.auto>0&&!G.roomInfo.paused?'반 전체가 같은 해를 살고 있어요':'선생님이 다음 해를 열 때까지 이 해를 살아요';
  requestAnimationFrame(()=>{ const hh=$('hud').offsetHeight; $('s-game').style.setProperty('--hudH',(hh+6)+'px'); HUDH=hh; });
}
let HUDH=150;
function toast(t,cls,fx,tr){
  const d=document.createElement('div'); d.className='toast'+(cls?' '+cls:''); d.innerHTML=esc(t)+chips(fx,tr); $('toasts').appendChild(d);
  while($('toasts').children.length>4) $('toasts').firstChild.remove(); const dur=(cls==='year'?3500:/money/.test(cls||'')?8000:8500)*RD(); d.style.setProperty('--dur',dur+'ms'); setTimeout(()=>{ d.classList.add('out'); setTimeout(()=>d.remove(),450); },dur);
}
function chips(fx,tr){ let h=''; if(fx) for(const k in fx){ const v=fx[k]; if(!v) continue;
    if(k==='$') h+=`<span class="chip pay">월급 ${v>0?'+':'−'}${Math.abs(v)}%</span>`; else if(k==='x') h+=`<span class="chip dn">일자리를 잃음</span>`;
    else if(k==='@') h+=`<span class="chip ${v>0?'pay':'dn'}">돈 ${v>0?'+':''}${fmtWon(v*G.life.C.med)}</span>`; else if(k==='%') h+=`<span class="chip ${v>0?'pay':'dn'}">모은 돈 ${v>0?'+':'−'}${Math.abs(v)}%</span>`;
    else if(k==='H') h+=`<span class="chip pay">${v>0?'집을 마련함':'집을 팖'}</span>`; else if(k==='V') h+=`<span class="chip ${v>0?'pay':'dn'}">집값 ${v>0?'+':'−'}${Math.abs(v)}%</span>`; else if(k==='M') h+=`<span class="chip up">가정을 꾸림</span>`;
    else if(STAT[k]) h+=`<span class="chip ${v>0?'up':'dn'}">${STAT[k]} ${v>0?'+':'−'}${Math.abs(v)}</span>`; }
  return h?`<div class="chips">${h}</div>`:''; }
// 장면 그림: 창이 열려 있는 동안 조금씩 움직인다
function sceneHTML(kind){ return kind?`<canvas class="scene" width="640" height="320" data-sc="${kind}"></canvas><div class="scene-cap">— ${SCENE_TITLE[kind]||'삶'} —</div>`:''; }
function animScenes(){ const cs=[...$('sheetBox').querySelectorAll('canvas.scene')]; if(!cs.length) return; const t0=performance.now();
  const step=()=>{ if($('sheet').hidden) return; let alive=false; cs.forEach(c=>{ if(!c.isConnected) return; alive=true; const x=c.getContext('2d'); x.setTransform(c.width/160,0,0,c.width/160,0,0); x.imageSmoothingEnabled=false; x.clearRect(0,0,160,80); drawScene(x,c.dataset.sc,(performance.now()-t0)/1000,G.life); }); if(alive) requestAnimationFrame(step); }; step(); }
function popup(tag,txt,fx,after,cls,sc,nt){ if(softOn()&&/^(farewell|sick|hosp|unrest)$/.test(sc||'')) sc=null; if(G.life&&G.life.pv) txt=G.life.pv(txt); sheet(`${sceneHTML(sc)}<div class="place">${esc(tag)}</div><p class="evt">${esc(txt)}</p>${nt?`<p class="nt">${esc(nt)}</p>`:''}${chips(fx)}<button class="btn primary" id="btnOk">확인 ▶</button>`,'event '+(cls||'')); renderHud(); $('btnOk').onclick=()=>{ closeSheet(); if(after) after(); }; }
function flash(place,t,fx,tr,bad){ if(G.life&&G.life.pv) t=G.life.pv(t); const f=$('flash'); f.className='gbox'+(bad?' bad':''); f.innerHTML=`<div class="place">${esc(place)}</div><p>${esc(t)}</p>${chips(fx,tr)}`; f.hidden=false; f.style.animation='none'; void f.offsetWidth; f.style.animation=''; clearTimeout(flash.t); flash.t=setTimeout(()=>f.hidden=true,4500*RD()); }
function sheet(html,cls){ $('sheetBox').className='box gbox '+(cls||''); $('sheetBox').innerHTML=html; $('sheet').hidden=false; paused=true; IN.jx=IN.jy=0; IN.id=null; animScenes(); }
function closeSheet(){ $('sheet').hidden=true; paused=false; lastT=performance.now(); }
// 선택지의 '될 가능성' 표시: 0 숨김 · 1 모두 높음/보통/낮음 · 2 모두 숫자(기본). 학급 방의 선생님 설정이 먼저. 확률이 없는 선택은 '확실'
function roomCfg(k){ const r=G.roomInfo, c=r&&r.cfg; return !G.teacher&&c&&c[k]!=null&&c[k]!==''?c[k]:null; }
function probMode(){ const v=roomCfg('prob'); if(v!=null) return +v; return G.opts.prob==null?2:+G.opts.prob; }
function softOn(){ const v=roomCfg('soft'); if(v!=null) return +v===1; return !!(G.life&&G.life.opt&&G.life.opt.soft); }
const RD=()=>Math.max(1,+(G.opts.read||1));   // 글이 떠 있는 시간 배율 (천천히 읽기)
const pct=(p,big)=>{ const m=probMode(); if(!m) return ''; if(p==null||p>=.999) return `<span class="pl sure">${sureWord()}</span>`;
  const lv=p>=.65?['hi','높음']:p>=.4?['mid','보통']:['lo','낮음'];
  return m===2?`<span class="pl ${lv[0]}">잘될 확률 ${Math.round(p*100)}%</span>`:`<span class="pl ${lv[0]}">될 가능성 ${lv[1]}</span>`; };
function onOpts(fn){ $('sheetBox').querySelector('.opts').onclick=e=>{ const b=e.target.closest('button'); if(b) fn(+b.dataset.i); }; }
// 작은 선택
function openScene(k){
  const L=G.life, c=L.cur.scenes[k], sc=SCENES[c.i], txt=L.tx(Array.isArray(sc.txt)?sc.txt[L.set==='U'?0:1]:sc.txt), place=scenePos(c.i).n;
  sheet(`<div class="place">${esc(place)}</div><h2>${esc(txt)}</h2><div class="opts">${sc.opts.map((o,i)=>`<button data-i="${i}">${esc(L.tx(o.l))}${pct(L.optP(o))}</button>`).join('')}</div>`);
  gateUI('s',sc.opts); onOpts(i=>{ const r=L.doScene(k,i); closeSheet(); if(r) flash(place+(r.ok?' · 나의 선택':' · 뜻대로 되지 않음'),r.t,r.fx,r.tr,!r.ok); G.spawnT=4; renderHud(); persist(); });
}
// 큰 갈림길 (정해진 나이) · 일자리 고르기
function openCross(){
  const L=G.life, ch=L.pending, sc=ch.job?'job':sceneKindOf(ch.q);
  sheet(`${sceneHTML(sc)}<div class="place">${L.age}살 · ${ch.job?'일자리 고르기':'큰 갈림길'}</div><h2>${esc(ch.q)}</h2><div class="opts">${ch.opts.map((o,i)=>`<button data-i="${i}"><div>${esc(o.label)}${o.sub?`<small>${esc(o.sub)}</small>`:''}</div>${pct(o.p,1)}</button>`).join('')}</div><p class="small sub">${ch.job?'월급은 그 나라의 벌이를 한국 돈으로 바꾼 근사치입니다. 확률은 배운 것과 쌓아 온 수치·성향이 만듭니다.':'확률은 지금까지 쌓아 온 작은 선택들이 만들었습니다.'}</p>`,'cross big');
  gateUI('ch',ch.opts); onOpts(i=>{ const r=L.choose(i); popup(`${L.age}살 · ${r.label} · ${r.p==null?'결정':r.ok?'이루어짐':'이루어지지 않음'}`,r.t,r.fx,()=>{ renderHud(); persist(); if(L.pending) openCross(); },r.ok?'':'bad',r.sc||sc); });
}
// 그해의 큰 사건 (선택은 모두 확률)
function openMajor(){
  const L=G.life, m=MAJORS[L.cur.m], sc=m.sc||m.hz||sceneKindOf(m.txt);
  sheet(`${sceneHTML(sc)}<div class="place">${L.age}살 · 큰 사건</div><h2>${esc(L.tx(m.txt))}</h2><div class="opts">${m.opts.map((o,i)=>`<button data-i="${i}">${esc(L.tx(o.l))}${pct(L.majorP(o),1)}</button>`).join('')}</div><p class="small sub">어떤 선택도 결과를 보장하지 않습니다. 쌓아 온 것들이 확률을 바꿀 뿐입니다.</p>`,'cross big');
  gateUI('m',m.opts); onOpts(i=>{ const r=L.chooseMajor(i); popup(`${L.age}살 · ${L.tx(r.label)} · ${r.ok?'잘됨':'뜻대로 되지 않음'}${probMode()===2?` (확률 ${Math.round(r.p*100)}%)`:''}`,r.t,r.fx,()=>{ renderHud(); persist(); if(r.sick) startSick(); },r.ok?'':'bad',r.sc); });
}
// 미션: 부탁을 받고 → 다른 곳에 다녀와서 → 돌아와 알린다
function openQuest(){
  const L=G.life, q=L.q, d=QUESTS[q.i];
  if(q.st===0){ sheet(`<div class="place">${esc(giverName(d.giver))} · 부탁</div><h2>${esc(L.tx(d.ask))}</h2><div class="opts"><button data-i="1">할게요<span>${esc(L.spotName(d.target))}에 다녀오기</span></button><button data-i="0">지금은 어려워요</button></div>`,'quest');
    onOpts(i=>{ L.questAccept(!!i); closeSheet(); if(i) flash('미션 시작',`${L.spotName(d.target)}에 다녀오자. 지도의 파란 점을 보세요.`); renderHud(); persist(); }); }
  else if(q.st===1){ sheet(`<div class="place">미션 · ${esc(L.spotName(d.target))}</div><h2>${esc(L.tx(d.at))}</h2><div class="opts"><button data-i="0">해 본다${pct(L.questP())}</button></div>`,'quest');
    onOpts(()=>{ const r=L.questDo(); closeSheet(); flash('미션',r.ok?`잘 해냈다. ${giverName(d.giver)}에게 돌아가자.`:`뜻대로 되지 않았다. 일단 ${giverName(d.giver)}에게 돌아가자.`,null,null,!r.ok); renderHud(); persist(); }); }
  else { const r=L.questEnd(); popup(r.ok?'미션 완료':'미션 · 뜻대로 되지 않음',r.t,r.fx,()=>{ renderHud(); persist(); },r.ok?'':'bad'); }
}
function endPeriod(){
  const L=G.life; if(!L||L.dead) return;
  if(G.teacher){ if($('sheet').hidden) teacherYearEnd(); return; }
  if(L.pending) return; finishPeriod();
}
function finishPeriod(){ const L=G.life; if(!L||L.dead) return; const res=L.endPeriod(); G.sickT=0;
  if(res.dead){ G.running=false; memberBeat(true); finishLife(); return; }
  beginPeriod(); }
$('btnNext').onclick=()=>{ if(!G.teacher) return; if($('sheet').hidden&&!caughtUp()) endPeriod(); };
// 교사용: 그해의 중요 사건을 시간을 건너뛰어 바로 고른다
$('btnImp').onclick=()=>{ const L=G.life; if(!L||!L.cur||!$('sheet').hidden) return; if(L.pending){ openCross(); return; }
  if(!L.majorLeft()){ toast("올해 남은 중요 사건이 없어요. '다음 해로'를 눌러 보세요."); return; }
  const at=majorAt(L.cur.mDone), skip=Math.max(0,at-L.cur.el); L.cur.el=Math.max(L.cur.el,at); if(!caughtUp()) L.cur.t=Math.max(1,L.cur.t-skip);
  if(L.major()!=null) openMajor(); else { L.cur.mDone++; toast('지금 일어날 수 있는 중요 사건이 없어요.'); } renderHud(); };
// ── 한 해의 달력: 열두 달 동안 열 가지 안팎의 일이 일어난다 (어른은 두 해에 걸쳐)
function yearLen(){ if(caughtUp()){ const r=G.roomInfo; return r&&r.auto>0&&!r.paused?r.auto*60:150; } return G.sec; }
function calSpan(){ return G.life&&G.life.step>1?24:12; }
function monthNow(){ const L=G.life; if(!L||!L.cur) return 1; return Math.min(calSpan(),Math.floor((L.cur.el||0)/yearLen()*calSpan())+1); }
function ymOf(m){ const L=G.life; return {y:L.by+L.age+(m>12?1:0),m:m>12?m-12:m}; }
function calTag(){ const L=G.life, st=L.stageOf(), sch=L.sch||{}; return st==='e'?sch.elem:st==='m'?sch.mid:st==='h'?(L.f.hs==='voc'?sch.voc:sch.high):st==='u'?sch.univ:st==='rt'?'다시 도전하는 한 해':L.f.job?(L.f.co||'일터'):L.age<7?'우리 집':'우리 동네'; }
function renderMon(){ const L=G.life, el=$('hMon'); if(!L||!el) return; const cal=L.cur&&L.cur.cal, ym=ymOf(monthNow()); el.textContent=`${ym.m}월${cal&&cal.length?` · 올해의 일 ${cal.filter(x=>x.done).length}/${cal.length}`:''}`; }
function calToast(m,t,fx,nt,fam){ const d=document.createElement('div'); d.className='toast cal'+(fam?' fam':''); d.innerHTML=`<b class="mb">${m}월${fam?' · 가족':''}</b>${esc(t)}${nt?`<small class="nt">${esc(nt)}</small>`:''}${chips(fx)}`; $('toasts').appendChild(d);
  while($('toasts').children.length>4) $('toasts').firstChild.remove(); const dur=(nt?14000:11000)*RD(); d.style.setProperty('--dur',dur+'ms'); setTimeout(()=>{ d.classList.add('out'); setTimeout(()=>d.remove(),450); },dur); }
function fireCal(k){ const L=G.life, it=L.cur.cal[k], ev=L.calEv(it), ym=ymOf(it.m), head=`${ym.y}년 ${ym.m}월 · ${it.dyn?'가족':calTag()}`;
  if(!ev){ it.done=1; return; }
  if(ev.opts){ const v=L.calVars(ev,it), q=L.fillV(v.__t||ev.txt,v);
    sheet(`<div class="place calp">${esc(head)}</div><h2>${esc(q)}</h2><div class="opts">${ev.opts.map((o,i)=>`<button data-i="${i}">${esc(L.fillV(o.l,v))}${pct(L.calOptP(o))}</button>`).join('')}</div>`,'calq');
    gateUI('c',ev.opts); onOpts(i=>{ const r=L.calDo(k,i); closeSheet(); renderMon(); persist(); if(!r) return;
      if(r.big||ev.ex||ntFirst(L,r.nt)) popup(`${head} · ${r.label||''}${r.p!=null?(r.ok?' · 잘됨':' · 뜻대로 되지 않음'):''}`,r.t,r.fx,()=>{ renderHud(); if(r.die){ if(!caughtUp()) endPeriod(); else toast('몸이 몹시 약해졌다. 가족이 곁을 지킨다.'); } else if(r.sick) startSick(r.sick); },r.ok&&!r.die?'':'bad',r.sc,r.nt);
      else flash(`${ym.m}월 · ${r.p==null?'나의 선택':r.ok?'나의 선택':'뜻대로 되지 않음'}`,r.t,r.fx,r.tr,!r.ok); });
    return; }
  const r=L.calDo(k); renderMon(); persist(); if(!r) return;
  if(r.big&&softOn()&&r.sc==='farewell') calToast(ym.m,r.t,r.fx,r.nt,it.dyn);
  else if(r.big||ntFirst(L,r.nt)) popup(`${head} · ${r.big?(it.dyn?'가족 소식':'삶의 중요한 순간'):/가상/.test(r.nt||'')?'세상의 소식':'숫자로 보는 세상'}`,r.t,r.fx,()=>renderHud(),'',r.sc,r.nt); else calToast(ym.m,r.t,r.fx,r.nt,it.dyn); }
// 올해의 달력 보기
function openCal(){ const L=G.life; if(!L||!L.cur||!$('sheet').hidden) return; const cal=L.ensureCal()||[], now=monthNow(), y0=L.by+L.age;
  sheet(`<div class="place">${y0}년${L.step>1?`~${y0+1}년`:''} · ${esc(calTag())}</div><h2>올해의 일 ${cal.filter(x=>x.done).length}/${cal.length}</h2>
    <ul class="memlist callist">${cal.map(it=>{ const ym=ymOf(it.m); return `<li class="${it.done?'':'todo'}"><span class="a">${L.step>1?(ym.y%100)+'년 ':''}${ym.m}월</span><span>${it.done?esc(it.t):it.m<=now?'곧 일어날 일':'아직 오지 않은 날'}</span></li>`; }).join('')||'<li><span>올해는 조용히 지나간다.</span></li>'}</ul>
    <p class="small sub">한 해(어른은 두 해)가 흐르는 동안 달마다 일이 찾아옵니다. 고르는 일은 그때마다 창이 뜹니다.</p><button class="btn" id="btnOk">닫기</button>`);
  $('btnOk').onclick=closeSheet; }
// 그해의 큰 사건이 찾아오는 때 (한 해 안에서 흐른 시간, 초)
function majorAt(k){ const L=G.life, n=L.cur.plan; if(caughtUp()) return 10+k*40; const fr=n===1?[.45]:n===2?[.25,.65]:[.17,.47,.77]; return G.sec*(fr[k]!=null?fr[k]:.9); }
$('hMon').onclick=openCal;
$('btnAct').onclick=()=>{ if(!near||!$('sheet').hidden) return; if(near.type==='s') openScene(near.k); else if(near.type==='t') openTalk(near); else if(near.type==='o') openTouch(near); else openQuest(); };
$('btnCar').onclick=()=>{ const vk=C_VEH();
  if(!W.car){ if(vk==='horse'){ W.car=true; return; } const rd=OUT.roads.find(r=>inRect(W.x,W.y,r,.7)); if(rd){ W.car=true; if(rd===OUT.roads[0]) W.y=W.y<OUT.RY+1?OUT.RY+.6:OUT.RY+1.6; else { W.x=clamp(W.x,rd[0]+.35,rd[0]+rd[2]-.35); W.y=clamp(W.y,rd[1]+.35,rd[1]+rd[3]-.35); } } }
  else { if(inRect(W.x,W.y,OUT.hw,.6)) return say('여기서는 내릴 수 없어요.'); W.car=false; const rd=OUT.roads.find(r=>inRect(W.x,W.y,r,.1)); if(rd&&blocked('out',W.x,W.y,.3,solidsFor('out'))){ if(rd[2]>rd[3]) W.y=W.y<rd[1]+rd[3]/2?rd[1]-.5:rd[1]+rd[3]+.5; else W.x=W.x<rd[0]+rd[2]/2?rd[0]-.5:rd[0]+rd[2]+.5; } } };
// 내 정보: 지금 어떤 삶을 살고 있는지
$('btnInfo').onclick=()=>{
  const L=G.life, C=L.C, f=L.f, a=L.age;
  const fam=[], P=L.ppl||{}, rel={mom:'엄마',dad:'아빠',gran:'할머니',sib:'동생',spouse:'배우자'}; PERSON_KEYS.forEach(k=>{ if(!L.spotOK(k)) return; if(k==='kid') return; fam.push(k==='sib'?`${L.spotName('sib')} ${P[k]?P[k].n:''}`:rel[k]&&P[k]?`${rel[k]} ${P[k].n}`:L.spotName(k)); }); L.kidsHome().forEach(k=>fam.push(`${k.sex?'딸':'아들'} ${k.n}`));
  const sc=L.sch||{}, hi=L.tx('{high}'), school = a<7?'아직 학교에 갈 나이가 아니에요' : f.univ&&f.school?`${sc.univ} 학생` : a<=12?(f.elem?`${sc.elem} ${a-6}학년`:'학교에 다니지 못하고 있어요') : a<=18?(f.sec?(a>=16&&f.hs?`${hi} 학생`:`${sc.mid} 학생`):f.elem?`${sc.elem}까지 다녔어요 · 지금은 일을 도와요`:'학교에 다니지 못했어요 · 일을 도와요') : f.univDone?`${sc.univ} 졸업`:f.sec?`${f.hs?hi:sc.mid} 졸업`:f.elem?`${sc.elem} 졸업`:'학교에 다니지 못했어요';
  const j=L.job, ratio=L.inc/C.med;
  const I=instOf(L), rk=rankName(L), svcNow=L._army||(f.svc&&a>=f.svc[0]&&a<f.svc[1]);
  const job = a<19?'—' : svcNow?'군 복무 중이에요' : j?`${esc(f.co||'')} · ${j.n}${rk&&rk!==j.n?` (${esc(rk)})`:''}${f.job==='abroad'&&f.migTo?` · ${esc(f.migTo)}에서`:''}<br><span class="sub">한 달에 약 ${fmtPay(L.inc)} · 이 나라 보통 벌이(${fmtPay(C.med)})의 ${ratio>=10?Math.round(ratio):ratio.toFixed(1)}배<br>${f.inf?'비공식 일자리 (계약서·사회보험이 없어요)':`공식 일자리 (${esc(I.pen||'연금')}·건강보험에 가입되어 있어요)`}</span>` : f.retired?`일을 내려놓았어요<br><span class="sub">연금·가족의 도움 한 달에 약 ${fmtPay(L.inc)}</span>` : (f.univ&&f.school?'대학생':'일을 쉬는 중');
  const places=['집']; if(a>=6) places.push('동네'); if(a>=13) places.push('큰길 건너'); if(a>=19) places.push('일터가 있는 곳'); if(canDrive()) places.push(`${L.C.landmark}(${C.veh.n})`);
  const wtxt=L.w>=.7?'넉넉한 편':L.w>=.45?'보통':L.w>=.25?'빠듯한 편':'어려운 편', top=L.topTrait(), tot=Object.values(L.tr).reduce((s,v)=>s+v,0);
  const JP=L.joyParts(), nm={m:'살림',n:'나라의 형편',r:'곁의 사람들',c:'함께 웃는 문화',h:'건강'};
  const bars=Object.keys(nm).map(k=>`<div class="happy"><span>${nm[k]}</span><div class="hbar">${barSvg(JP[k])}</div><span class="num">${JP[k]>=0?'+':''}${JP[k].toFixed(0)}</span></div>`).join('');
  const lastM=L.money&&L.money.length?L.money[L.money.length-1]:null, adult=a>=19||f.univ;
  const money=adult?`<dt>가진 돈</dt><dd><b class="${L.cash<0?'neg':''}">${fmtWon(L.cash)}</b>${L.cash<0?' (빚)':''}${L.house?`<br>집 ${fmtWon(L.house)} · 모두 합하면 ${fmtWon(L.nw)}`:'<br><span class="sub">아직 내 집이 없어요</span>'}${lastM?`<br><span class="sub">지난 ${lastM.step>1?lastM.step+'년':'해'}: 번 돈 ${fmtWon(lastM.inc)} · 쓴 돈 ${fmtWon(lastM.spend)} · 이자 ${lastM.int>=0?'+':''}${fmtWon(lastM.int)}${lastM.ev?` · 큰일 ${lastM.ev>0?'+':''}${fmtWon(lastM.ev)}`:''}</span>`:''}${moneySvg(L)}</dd>`:'';
  sheet(`<div class="place">내 정보</div><h2>${esc(L.name)} · ${a}살 (${stageOf(a)}) · ${L.by+a}년</h2>
    <dl class="info"><dt>사는 곳</dt><dd>${C.n} · ${esc(L.town||'')} (${SETN[L.set]})</dd><dt>태어난 가정</dt><dd>${FAM[L.famI].n} · 지금 살림은 ${wtxt}${L.fam&&L.fam.rel?` · 가족의 종교: ${esc(L.fam.rel)}`:''}</dd><dt>함께 사는 사람</dt><dd>${fam.length?fam.join(' · '):'혼자 살아요'}</dd>
    <dt>학교</dt><dd>${school}</dd><dt>하는 일</dt><dd>${job}</dd>${money}<dt>나라의 제도</dt><dd><span class="sub">병원비 가운데 직접 내는 몫 약 ${I.oop}% (WHO)${I.hi?` · ${esc(I.hi)}`:''}<br>일하는 사람 가운데 비공식 일자리 약 ${I.inf}% (ILO)${retAgeOf(L)?` · 정년 ${retAgeOf(L)}세`:' · 정해진 정년 없음'}${I.cs&&I.cs[0]&&(I.cs[2]===2||L.sex===0)?` · 군 복무 ${I.cs[0]>=24?Math.round(I.cs[0]/12)+'년':I.cs[0]+'개월'}`:''}</span></dd><dt>가족</dt><dd>${f.widow&&P.spouse?`${esc(P.spouse.n)}과(와)는 ${f.widA}살에 사별했어요`.replace('과(와)',josa(P.spouse.n,'과','와').slice(P.spouse.n.length))+(L.kids.length?` · 아이 ${L.kids.map(k=>esc(k.given)).join(', ')}`:''):f.family?`${esc(P.spouse?P.spouse.n:'')}과(와) 가정을 꾸렸어요`.replace('과(와)',josa(P.spouse?P.spouse.n:'배우자','과','와').slice((P.spouse?P.spouse.n:'배우자').length))+(L.kids.length?` · 아이 ${L.kids.map(k=>esc(k.given)).join(', ')}`:'')+(f.grandkid?' · 손주 있음':''):'아직 가정을 꾸리지 않았어요'}</dd><dt>친구</dt><dd>${esc(P.friend?P.friend.n:'')}</dd>${L.f.pet?`<dt>반려동물</dt><dd>${esc(L.f.pet.n)} (${esc(L.f.pet.sp)}${L.f.pet.dA!=null?`, ${L.f.pet.dA}살 때 무지개다리를 건넘`:`, 함께한 지 ${a-L.f.pet.a}년`})</dd>`:''}${L.f.hob&&L.f.hob.length?`<dt>취미</dt><dd>${L.f.hob.map(h=>esc(h.n)+' Lv.'+h.lv).join(' · ')}</dd>`:''}
    <dt>갈 수 있는 곳</dt><dd>${places.join(' → ')}</dd>
    <dt>지금까지</dt><dd>선택 ${L.n}번 · 뜻대로 안 된 일 ${L.fail||0}번 · 놓친 순간 ${L.miss}번</dd>${G.room?`<dt>학급 방</dt><dd>${esc(G.room)}</dd>`:''}</dl>
    ${L.comps&&L.comps.length?`<div class="stack-s"><b style="font-weight:400">같은 1초에 태어난 사람들 · 지금 ${a}살 무렵</b><table class="famtbl">${L.comps.map(p=>`<tr><th>${esc(p.n)}</th><td>${esc(p.cn)} · ${p.sex?'여':'남'}</td><td>${esc(L.compNow(p,a))}</td></tr>`).join('')}</table></div>`:''}
    ${L.fam?`<div class="stack-s"><b style="font-weight:400">우리 가족</b><table class="famtbl">${L.famList().map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div>`:''}
    ${statPanel(L)}${jobsTable(L)}
    <div class="stack-s"><b style="font-weight:400">지금 내 행복을 만드는 것</b>${bars}<p class="small sub">돈(살림)만이 아니라 곁의 사람들과 함께 웃는 문화가 행복을 크게 바꿉니다.</p></div>
    <p class="small sub">${esc(C.fact)} 물가가 나라마다 달라서 같은 돈으로 살 수 있는 것도 다릅니다.</p><button class="btn" id="btnOk">닫기</button>`);
  $('btnOk').onclick=closeSheet;
};
// 능력치: 지금 값 막대 + 지난해와 비교 + 나이에 따른 변화 꺾은선
const STAT_COL={h:'#2F8F7A',j:'#E2703A',k:'#3870D0',r:'#C2577A'};
function statPanel(L){ const H=(L.hist||[]).filter(x=>x.a<L.age), prev=H.length?H[H.length-1]:null;
  const bars=Object.keys(STAT).map(k=>{ const v=Math.round(L.s[k]), d=prev?v-prev[k]:0;
    return `<div class="sbar"><span>${STAT[k]}</span><div class="tr" role="img" aria-label="${STAT[k]} ${v}"><i style="width:${v}%;background:${STAT_COL[k]}"></i><em style="left:50%"></em></div><span class="v"><b>${v}</b>${prev&&d?` <small class="${d>0?'up':'dn'}">${d>0?'▲':'▼'}${Math.abs(d)}</small>`:''}</span></div>`; }).join('');
  return `<div class="chart"><h3>능력치 <span class="sub small">(0~100 · 가운데 선이 50 · ▲▼는 지난해와 비교)</span></h3>${bars}${statLine(L)}</div>`; }
function statLine(L){ const H=(L.hist||[]).slice(); H.push({a:L.age,h:L.s.h,j:L.s.j,k:L.s.k,r:L.s.r}); if(H.length<3) return '';
  const W=480, Hh=150, pl=28, pr=8, pt=8, pb=20, a0=H[0].a, a1=Math.max(a0+1,H[H.length-1].a), X=a=>pl+(a-a0)/(a1-a0)*(W-pl-pr), Y=v=>pt+(1-v/100)*(Hh-pt-pb);
  let g=''; [0,25,50,75,100].forEach(v=>{ g+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#E2E8EE"/><text x="${pl-4}" y="${Y(v)+3}" text-anchor="end">${v}</text>`; });
  const step=Math.max(5,Math.ceil((a1-a0)/6/5)*5); for(let a=Math.ceil(a0/step)*step;a<=a1;a+=step) g+=`<text x="${X(a)}" y="${Hh-4}" text-anchor="middle">${a}살</text>`;
  const lines=Object.keys(STAT).map(k=>`<polyline points="${H.map(p=>X(p.a).toFixed(1)+','+Y(p[k]).toFixed(1)).join(' ')}" fill="none" stroke="${STAT_COL[k]}" stroke-width="2" stroke-linejoin="round"/>`).join('');
  return `<svg class="lchart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="나이에 따른 능력치 변화">${g}${lines}</svg><div class="lgd">${Object.keys(STAT).map(k=>`<span><i style="background:${STAT_COL[k]}"></i>${STAT[k]}</span>`).join('')}</div>`; }
function traitPanel(L){ const ks=Object.keys(TRAIT), mx=Math.max(1,...ks.map(k=>L.tr[k]||0)); if(!ks.some(k=>L.tr[k])) return '';
  return `<div class="chart"><h3>성향 <span class="sub small">(그 성향으로 고른 횟수)</span></h3>${ks.map(k=>`<div class="sbar"><span>${TRAIT[k]}</span><div class="tr"><i style="width:${(L.tr[k]||0)/mx*100}%;background:#7C95AE"></i></div><span class="v">${L.tr[k]||0}번</span></div>`).join('')}</div>`; }
function jobsTable(L){ const J=L.jobs||[]; if(!J.length) return '';
  return `<div class="stack-s"><b style="font-weight:400">거쳐 온 일</b><div class="tscroll"><table class="dtbl"><thead><tr><th>나이</th><th>일</th><th>일터</th><th>계기</th></tr></thead><tbody>${J.map(x=>`<tr><td class="a">${x.a}살</td><td>${esc(x.n)}</td><td>${esc(x.co||'')}</td><td class="q">${esc(x.why||'')}</td></tr>`).join('')}</tbody></table></div></div>`; }
// 해마다 가진 돈(집 포함)의 흐름
function moneySvg(L){ const h=(L.money||[]).map(m=>m.cash+m.house); if(h.length<2) return ''; const mx=Math.max(...h.map(Math.abs),1), n=h.length, W=200, H=44, y=v=>H/2-v/mx*(H/2-3);
  const pts=h.map((v,i)=>`${(i/(n-1)*W).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="msvg" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none"><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" stroke="#C0C8D0" stroke-width="1"/><polyline points="${pts}" fill="none" stroke="#3870D0" stroke-width="2"/></svg><span class="sub small">${L.money[0].a}살부터 지금까지 가진 돈(집 포함)의 흐름</span>`; }
function barSvg(v){ const w=Math.min(50,Math.abs(v)*3.2), pos=v>=0; return `<svg viewBox="0 0 100 8" width="100%" height="8" preserveAspectRatio="none"><rect x="0" y="3.5" width="100" height="1" fill="#C0C8D0"/><rect x="${pos?50:50-w}" y="0" width="${w}" height="8" fill="${pos?'#48B888':'#E07070'}"/><rect x="49.5" y="0" width="1" height="8" fill="#283038"/></svg>`; }
$('btnMem').onclick=()=>openMem('all');
function openMem(flt){ const L=G.life, all=L.mem.slice().reverse(), test={all:()=>true,big:m=>m.big,fam:m=>m.fam||/엄마|아빠|아내|남편|아들|딸|손주|동생|형|누나|언니|오빠|할머니|할아버지|가족/.test(m.t+(m.q||'')),pick:m=>!!m.q}[flt], list=all.filter(test).slice(0,80);
  const tab=(k,n)=>`<button data-f="${k}" class="${flt===k?'on':''}">${n}</button>`;
  sheet(`<h2>${esc(L.name)}의 기억</h2><p class="small sub">선택 ${L.n}번 · 놓친 순간 ${L.miss}번 · 주황 줄은 큰 일 · ▣ 표시 줄을 누르면 그 장면을 다시 봅니다</p>
    <div class="mtabs">${tab('all','전체')}${tab('big','큰 사건')}${tab('pick','내가 고른 순간')}${tab('fam','가족')}</div>
    <div class="tscroll"><table class="dtbl"><thead><tr><th>나이</th><th>그때의 상황 · 나의 선택</th><th>그 결과</th></tr></thead><tbody>${list.length?list.map((m,i)=>`<tr class="${m.sc?'sc':''} ${m.big?'big':''}" data-i="${i}"><td class="a">${m.a}살</td><td class="q">${m.q?esc(m.q):'<span class="sub">—</span>'}${m.l?`<br><b style="font-weight:600;color:#2858A8">→ ${esc(m.l)}</b>`:''}</td><td>${esc(memT(m))}${m.rp>1?` <span class="rp">×${m.rp}</span>`:''}${m.f?'<span class="tag">뜻대로 안 됨</span>':''}${m.sc?' <span class="sub">▣</span>':''}</td></tr>`).join(''):'<tr><td colspan="3" class="sub">아직 없어요</td></tr>'}</tbody></table></div>
    <p class="small sub">최근 기억부터 ${list.length}개를 보여 줍니다.</p><button class="btn" id="btnOk">닫기</button>`);
  $('btnOk').onclick=closeSheet;
  $('sheetBox').querySelectorAll('.mtabs button').forEach(b=>b.onclick=()=>openMem(b.dataset.f));
  $('sheetBox').querySelector('tbody').onclick=e=>{ const tr=e.target.closest('tr.sc'); if(!tr) return; const m=list[+tr.dataset.i]; popup(`${m.a}살의 기억`,memT(m),null,()=>openMem(flt),'',m.sc,m.q?`${m.q}${m.l?' → '+m.l:''}`:null); }; }
$('btnExit').onclick=()=>{ sheet(`<h2>잠시 멈출까요?</h2><p class="sub">${G.teacher?'지금까지의 삶은 교사용 모드의 \'내 체험 기록\'에 저장됩니다. 언제든 이어서 살 수 있어요.':'지금까지의 삶은 저장됩니다. 언제든 이어서 살 수 있어요.'}</p><div class="row"><button class="btn primary" id="btnQuit">저장하고 나가기</button><button class="btn" id="btnOk">계속 살기</button></div>`);
  $('btnOk').onclick=closeSheet; $('btnQuit').onclick=()=>{ G.running=false; closeSheet(); if(G.teacher){ persist(true); G.teacher=false; G.life=null; G.tid=null; openTeacherBody(); } else { persist(true); openHub(); } }; };
$('miniWrap').onclick=()=>{ if(!$('sheet').hidden) return; openMaps('town'); };
// 멈춤: 이 창이 열려 있는 동안 시간이 흐르지 않는다 (읽는 속도가 다른 학생을 위해)
function openPause(){ if(!G.life||!G.running||!$('sheet').hidden) return; const r=+(G.opts.read||1);
  sheet(`<div class="place">멈춤 · ${G.life.age}살</div><h2>시간이 멈춰 있어요</h2><p class="sub">${caughtUp()?'학급 방에서는 반 전체의 시간(선생님의 시계)은 계속 흐릅니다. 이 창이 열려 있는 동안 내 화면의 일만 멈춥니다.':'천천히 읽고 생각해도 괜찮아요. 준비되면 계속하기를 누르세요.'}</p>
    <div class="stack-s"><b>글이 떠 있는 시간</b><div class="seg" id="pRead"><button data-v="1" class="${r>1?'':'on'}">보통</button><button data-v="1.8" class="${r>1?'on':''}">길게 (천천히 읽기)</button></div></div>
    <div class="row"><button class="btn primary" id="btnOk">▶ 계속하기</button><button class="btn" id="btnPMem">지난 기억 다시 보기</button></div>`,'pause');
  $('pRead').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; G.opts.read=+b.dataset.v; ls('life8b_opts',G.opts); [...$('pRead').children].forEach(x=>x.classList.toggle('on',x===b)); };
  $('btnOk').onclick=closeSheet; $('btnPMem').onclick=()=>{ closeSheet(); $('btnMem').click(); }; }
$('btnPause').onclick=openPause;
addEventListener('keydown',e=>{ if($('s-game').hidden||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||'')) return; if(e.key!=='p'&&e.key!=='P'&&e.key!=='ㅔ') return; e.preventDefault(); if($('sheet').hidden) $('btnPause').click(); else if($('sheetBox').classList.contains('pause')) closeSheet(); });
// 동네와 나라 사이: 내가 사는 도시(시골이면 둘레 마을과 읍내)를 그림 지도로 보여 준다
function regionSVG(L){ const C=L.C, U=L.set==='U', sch=L.sch||{}, f=L.f||{}, town=L.town||C.city;
  let sd=0; for(const ch of town+L.c) sd=(sd*31+ch.charCodeAt(0))>>>0; const rnd=()=>((sd=(sd*1664525+1013904223)>>>0)/4294967296);
  const W=600, H=300; let h=`<svg class="wmap rmap" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(town)} 그림 지도">`;
  const lab=(x,y,t,o)=>{ o=o||{}; const fs=o.fs||13; return `<text x="${x}" y="${y}" font-size="${fs}" text-anchor="${o.a||'middle'}" fill="${o.c||'#33404C'}" stroke="#FFFDF6" stroke-width="3.2" paint-order="stroke" font-weight="${o.b?700:500}">${esc(t)}</text>`; };
  const pin=(x,y,col,t,big)=>`<circle cx="${x}" cy="${y}" r="${big?9:6}" fill="${col}" stroke="#283038" stroke-width="2"/>`+lab(x,y-(big?15:11),t,{b:big,fs:big?15:12});
  const rv=rnd()*0.6+0.2;
  if(U){ h+=`<rect width="${W}" height="${H}" fill="#E9E4D4"/>`;
    for(let i=0;i<7;i++){ const x=40+rnd()*520, y=30+rnd()*240, r=30+rnd()*50; h+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${['#DCD4BE','#E2DCC8','#D6E3C2'][i%3]}"/>`; }
    h+=`<path d="M -10 ${H*rv} C 150 ${H*rv-60}, 260 ${H*rv+80}, 380 ${H*rv+10} S 560 ${H*rv-40}, 620 ${H*rv+30}" fill="none" stroke="#9CC9EC" stroke-width="18" stroke-linecap="round"/>`;
    for(let i=1;i<6;i++) h+=`<line x1="${i*100}" y1="0" x2="${i*100+rnd()*40-20}" y2="${H}" stroke="#FFFFFF" stroke-width="${i===3?7:4}"/>`;
    for(let i=1;i<3;i++) h+=`<line x1="0" y1="${i*100}" x2="${W}" y2="${i*100+rnd()*30-15}" stroke="#FFFFFF" stroke-width="${i===1?7:4}"/>`;
    h+=`<ellipse cx="300" cy="150" rx="250" ry="120" fill="none" stroke="#F4D9A0" stroke-width="5" stroke-dasharray="2 0"/>`;
    h+=`<rect x="270" y="115" width="60" height="40" rx="6" fill="#C9B8E0" stroke="#7A68A0" stroke-width="2"/>`+lab(300,140,'도심',{b:1,fs:13});
    const spots=[['기차역',470,70,'#5A6878'],['시장',180,215,'#C8743A'],['큰 병원',420,225,'#C84B62'],[C.tier<=2?'공장 지대':'산업 단지',90,70,'#6E7E8E']];
    if(sch.univ&&f.univ) spots.push([sch.univ,520,170,'#3870D0']);
    spots.forEach(([t,x,y,c])=>h+=pin(x,y,c,t));
    const mx=150+rnd()*120, my=110+rnd()*80;
    if(f.job&&f.co&&!f.school) h+=pin(Math.min(560,mx+170),my+40,'#3870D0',f.co);
    else if(f.school&&L.age<19){ const sn=L.age<13?sch.elem:L.age<16?sch.mid:(f.hs==='voc'?sch.voc:sch.high); if(sn) h+=pin(mx+70,my-45,'#3870D0',sn); }
    h+=pin(mx,my,'#E2703A','우리 동네',1);
    h+=lab(W-14,22,`${C.city===town?'':C.city+' 방향 →'}`,{a:'end',fs:12,c:'#5A6878'});
  } else {
    h+=`<rect width="${W}" height="${H}" fill="#D6E5B4"/>`;
    for(let i=0;i<26;i++){ const x=rnd()*W, y=rnd()*H, w=40+rnd()*60, hh=24+rnd()*36; h+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${['#C8DA9C','#E4D79A','#BFD48C','#DCCB8C'][i%4]}" stroke="#B0C27C" stroke-width="1" transform="rotate(${rnd()*20-10} ${x} ${y})"/>`; }
    h+=`<path d="M -10 ${H*rv} C 120 ${H*rv+70}, 240 ${H*rv-70}, 360 ${H*rv+20} S 520 ${H*rv+60}, 620 ${H*rv-20}" fill="none" stroke="#8EC0E6" stroke-width="12" stroke-linecap="round"/>`;
    const vx=120+rnd()*80, vy=80+rnd()*120, tx=430+rnd()*60, ty=90+rnd()*100;
    h+=`<path d="M ${vx} ${vy} Q ${(vx+tx)/2} ${vy-60+rnd()*120}, ${tx} ${ty} T 620 ${ty-30}" fill="none" stroke="#B89A6A" stroke-width="6" stroke-dasharray="10 5"/>`;
    for(let i=0;i<3;i++){ const x=40+rnd()*300, y=30+rnd()*240; if(Math.hypot(x-vx,y-vy)<70) continue; h+=pin(x,y,'#8A9A6A','이웃 마을'); }
    h+=`<circle cx="${tx}" cy="${ty}" r="26" fill="#E8DCC0" stroke="#A08A60" stroke-width="2"/>`+lab(tx,ty+5,'읍내',{b:1});
    h+=pin(tx-34,ty+44,'#C8743A','장터')+pin(tx+40,ty+40,'#C84B62','보건소');
    if(sch.elem) h+=pin(vx+60,vy+46,'#3870D0',sch.elem);
    h+=pin(vx,vy,'#E2703A','우리 마을',1);
    h+=lab(W-14,22,`${C.city} 방향 →`,{a:'end',fs:12,c:'#5A6878'});
  }
  return h+'</svg>'; }
function openMaps(tab){ const L=G.life, C=L.C, g=GEO[L.c], km=g&&L.c!=='KR'?geoKm(GEO.KR,g):0, share=birthShare(L.c)*1000;
  const tabs=`<div class="mtabs" role="tablist"><button data-t="town" class="${tab==='town'?'on':''}">우리 동네</button><button data-t="city" class="${tab==='city'?'on':''}">${esc(L.set==='U'?(L.town||C.city):'우리 고장')}</button><button data-t="near" class="${tab==='near'?'on':''}">${esc(C.n)}</button><button data-t="world" class="${tab==='world'?'on':''}">세계 지도</button></div>`;
  const facts=`<div class="mfacts"><div><span>지역</span><b>${esc(RGN_N[C.rg]||'')}</b></div><div><span>대표 도시</span><b>${esc(C.city)}</b></div>${km?`<div><span>서울에서</span><b>약 ${km.toLocaleString()}km</b></div>`:`<div><span>사는 곳</span><b>${esc(L.town||'')}</b></div>`}<div><span>세계 아기 1000명 가운데</span><b>${share>=1?share.toFixed(1):share.toFixed(2)}명이 이 나라에서</b></div></div>`;
  let body;
  if(tab==='town') body=`<canvas id="bigMap" width="992" height="416"></canvas><div class="legend"><span><i style="background:#E2703A"></i>할 일</span><span><i style="background:#3870D0"></i>미션</span><span><i style="background:#FFFFFF"></i>나</span><span><i style="background:#58606A"></i>아직 못 가는 곳</span></div>`;
  else if(tab==='city') body=regionSVG(L)+`<p class="small sub">${L.set==='U'?`${esc(L.town||C.city)}의 그림 지도예요. 주황색이 우리 동네, 파란색이 다니는 학교·일터입니다.`:`${esc(L.town||'')} 둘레의 그림 지도예요. 장을 보고 병원에 가려면 읍내까지 걸어가야 합니다.`} 실제 거리와 모양은 다를 수 있어요.</p>`;
  else if(tab==='near') body=worldSVG(L,'near')+`<p class="small sub">주황색 점이 ${esc(C.n)}(수도 근처)예요. 회색 점은 이웃 나라들입니다.</p>`;
  else body=worldSVG(L,'world')+`<div class="legend"><span><i style="background:#E2703A"></i>내가 태어난 나라</span>${L.comps&&L.comps.length?'<span><i style="background:#3870D0"></i>같은 1초에 태어난 사람들</span>':''}${L.c!=='KR'?'<span><i style="background:#283038"></i>대한민국</span>':''}</div>${L.comps&&L.comps.length?`<p class="small sub">같은 1초에 태어난 ${L.comps.map(p=>esc(p.n)+'('+esc(p.cn)+')').join(', ')}</p>`:''}`;
  sheet(`<div class="place">${esc(C.n)} · ${esc(L.town||'')} (${SETN[L.set]})</div><h2>지도</h2>${tabs}${body}${facts}<button class="btn" id="btnOk">닫기</button>`);
  if(tab==='town') drawBigMap($('bigMap'));
  $('sheetBox').querySelectorAll('.mtabs button').forEach(b=>b.onclick=()=>openMaps(b.dataset.t));
  $('btnOk').onclick=closeSheet; }
addEventListener('visibilitychange',()=>{ if(document.hidden&&G.running) persist(true); });

// 지금 다가갈 수 있는 것들: 작은 선택(!)과 미션(?)
function targets(){
  const L=G.life, out=[]; if(!L||!L.cur) return out;
  L.cur.scenes.forEach((c,k)=>{ if(!c.done){ const sp=SCENES[c.i].spot, p=scenePos(c.i); out.push({type:'s',k,m:p.m,p:p.p,n:p.n,key:SPOTS[sp].z==='H'?sp:(sp==='elem'||sp==='mid'||sp==='work')?'p'+(c.i%INT.P.length):null}); } });
  if(L.q){ const d=QUESTS[L.q.i], p=L.q.st===1?Object.assign(posOfSpot(d.target,0),{n:L.spotName(d.target)}):posOfSpot(d.giver,0); out.push({type:'q',m:p.m,p:p.p,n:L.q.st===1?p.n:giverName(d.giver),key:L.q.st===1?null:(SPOTS[d.giver].z==='H'?d.giver:'p0')}); }
  return out;
}
// 한 프레임에서 오류가 나도 게임이 멈추지 않게: 오류는 화면에 알리고 다음 프레임을 이어 간다
function loop(t){ try{ loopBody(t); }catch(e){ if(typeof reportErr==='function') reportErr(e,'진행'); if(G.running) requestAnimationFrame(loop); } }
function loopBody(t){
  if(!G.running||!G.life) return; const dt=Math.min(.05,(t-lastT)/1000); lastT=t; const L=G.life;
  if(G.room){ G.syncT-=dt; if(G.syncT<=0){ G.syncT=4; syncRoom(); } G.memT-=dt; if(G.memT<=0){ G.memT=30; memberBeat(); } }
  if(!paused&&L.cur){
    let dx=IN.jx, dy=IN.jy; const k=IN.keys;
    if(k.arrowleft||k.a) dx-=1; if(k.arrowright||k.d) dx+=1; if(k.arrowup||k.w) dy-=1; if(k.arrowdown||k.s) dy+=1;
    const m=Math.hypot(dx,dy); if(m>1){ dx/=m; dy/=m; }
    // 출발·멈춤이 부드럽게: 속도가 서서히 붙고 서서히 줄어든다
    { const kk=Math.min(1,dt*(m>.05?16:22)); W.ax=(W.ax||0)+((m>.05?dx:0)-(W.ax||0))*kk; W.ay=(W.ay||0)+((m>.05?dy:0)-(W.ay||0))*kk; }
    const am=Math.hypot(W.ax,W.ay); W.moving=m>.05||am>.12;
    if(W.moving){ const sp=speedOf(L.age)*dt; tryMove(W.ax*sp,W.ay*sp); W.walk+=dt*(L.age<2?4:L.age<19?9:7)*Math.max(.6,Math.min(1,am)); if(m>.05) W.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
      const sf=Math.floor(W.walk/2); if(sf!==W.lsf){ W.lsf=sf; if(W.map==='out'&&!W.car&&L.age>=2){ W.fx=(W.fx||[]); W.fx.push({x:W.x,y:W.y,b:performance.now()/1000,dx:Math.round((Math.random()-.5)*4)}); if(W.fx.length>12) W.fx.shift(); } } }
    // 시간: 혼자일 때는 한 해가 흐르고, 학급 방에서 반과 같은 나이면 선생님(방의 시계)을 기다린다
    if(caughtUp()){ const r=G.roomInfo; $('hTimer').style.width=(r&&r.auto>0&&!r.paused?100-((Date.now()-r.t0)%(r.auto*60000))/(r.auto*600):100)+'%'; }
    else { L.cur.t-=dt; $('hTimer').style.width=Math.max(0,L.cur.t/G.sec*100)+'%'; }
    // 한 해 안에서도 일은 계속 생긴다: 작은 선택은 채워지고, 큰 사건과 미션이 찾아온다
    G.spawnT-=dt; if(G.spawnT<=0){ G.spawnT=5; if(L.cur.scenes.filter(c=>!c.done).length<3&&L.spawn()>=0) renderHud(); }
    const catching=G.room&&G.roomPi!=null&&L.pi<G.roomPi-1;   // 반을 따라잡는 동안에는 큰 사건과 미션을 쉰다
    if(!catching){ L.cur.qt-=dt; if(L.cur.qt<=0){ L.cur.qt=35; if(!L.q&&L.questOffer()) toast(`${giverName(QUESTS[L.q.i].giver)}에게 부탁받을 일이 생겼어요. 파란 물음표를 찾아가 보세요.`); }
    L.cur.el=(L.cur.el||0)+dt;
    if(L.cur.mDone>=L.cur.plan&&caughtUp()&&!L.f.dying&&L.cur.el>=majorAt(L.cur.mDone)) L.addMajor();   // 반이 같은 해에 머무는 동안에도 큰 일은 이어진다
    if(L.cur.mDone<L.cur.plan&&L.cur.el>=majorAt(L.cur.mDone)){ if(L.major()!=null) openMajor(); else L.cur.mDone++; }
    if($('sheet').hidden&&!L.pending){ const cal=L.ensureCal(); if(cal){ const k=cal.findIndex(x=>!x.done); if(k>=0&&L.cur.el>=(cal[k].m-.55)/calSpan()*yearLen()) fireCal(k); } } }
    { const mn=monthNow(); if(mn!==G.mon){ G.mon=mn; renderMon(); } }
    if(L.cur.sk&&!isSick()&&!paused&&L.cur.el>=(caughtUp()?20+L.cur.sk.at*80:L.cur.sk.at*G.sec)) startSick();
    if(G.sickT>0&&!L.f.dying){ G.sickT-=dt; if(G.sickT<=0){ G.sickT=0; L.getWell(); toast('몸이 다 나았어요! 다시 밖에 나갈 수 있어요.','news'); renderHud(); } }
    npcUpdate(dt);
    // 가까이 있는 것
    near=null; let best=1.5; if(!W.car||C_VEH()==='horse') for(const tg of targets()){ if(tg.m!==W.map) continue; const d=Math.hypot(tg.p[0]-W.x,tg.p[1]-W.y); if(d<best){ best=d; near=tg; } }
    if(!near&&typeof nearExtra==='function') near=nearExtra();   // 퀘스트·장면이 없으면: 사람에게 말 걸기, 물건 만져 보기
    const act=$('btnAct'); if(near){ const nm=near.lab||(near.n+(near.type==='q'?' · 미션':' · 다가가기')); if(act.hidden||act.dataset.k!==nm){ act.textContent=nm; act.dataset.k=nm; act.className='abtn'+(near.type==='q'?' q':near.type==='t'||near.type==='o'?' t':''); act.hidden=false; } } else act.hidden=true;
    const car=$('btnCar'), showCar=W.map==='out'&&canDrive()&&(W.car||C_VEH()==='horse'||onRoad(W.x,W.y,.7)); car.hidden=!showCar; if(showCar) car.textContent=W.car?'내리기':L.C.veh.n+' 타기';
    if(!caughtUp()&&L.cur.t<=0&&!paused) endPeriod();
  }
  else if(L.cur&&typeof flowTick==='function') flowTick(dt);
  if(G.running) draw(t/1000);
  requestAnimationFrame(loop);
}

