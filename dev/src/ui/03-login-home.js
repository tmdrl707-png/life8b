/* ========== 로그인 · 계정 홈 ========== */
$('modeNote').textContent=Store.fb?'기록은 내 계정에 저장되어, 집에서도 같은 아이디로 이어서 할 수 있어요.':'지금은 이 기기에만 저장됩니다. (Firebase 미설정)';
async function doLogin(create){
  const id=$('uid').value.trim(), pw=$('upw').value; $('loginErr').textContent='';
  if(id.length<2){ $('loginErr').textContent='아이디는 2자 이상으로 적어 주세요.'; return; }
  if(pw.length<6){ $('loginErr').textContent='비밀번호는 6자 이상이어야 해요.'; return; }
  $('btnLogin').disabled=true;
  try{ G.data=await Store.login(id,pw,create,$('keep').checked); G.teacher=false; G.troom=null; $('upw').value=''; openHub(); if(Store.created&&$('hubNow')) $('hubNow').insertAdjacentHTML('afterbegin',`<p class="small" style="margin:0;padding:8px 10px;border-radius:8px;background:#FFF4E0;color:#6A4A10">${Store.created==='reset'?`‘${esc(id)}’의 비밀번호를 새로 정했어요.`:`‘${esc(id)}’ 아이디를 새로 만들었어요.`} 다음부터는 방금 정한 비밀번호로 들어오면 돼요.</p>`); }
  catch(e){ $('loginErr').textContent=Store.msg(e); }
  $('btnLogin').disabled=false;
}
$('loginForm').onsubmit=e=>{ e.preventDefault(); doLogin(null); };
$('btnLogout').onclick=()=>{ Store.logout(); G.data=null; G.life=null; $('who').textContent=''; show('login'); };
function openHub(){
  $('who').textContent=Store.sess?Store.sess.id+' 님':''; const sv=G.data.save;
  $('hubNow').innerHTML = sv
    ? `<div class="stack-s"><p class="sub small">이어서 살 수 있는 삶</p><h2>${esc(sv.name)} · ${sv.age}세</h2><p>${COUNTRIES[sv.c||'KR'].n} ${SETN[sv.set]} · ${FAM[sv.famI].n} · 선택 ${sv.n}번</p></div><button class="btn primary" id="btnResume">이어서 살기</button>`
    : (G.data.room&&G.data.roomDone&&G.data.roomDone[G.data.room])
    ? `<div class="stack-s"><h2>이 반에서의 삶을 마쳤어요</h2><p class="sub">수업 시간에는 다시 태어나는 대신, 같은 1초에 태어난 사람들과 우리 반 친구들의 삶을 둘러봅니다.</p></div><button class="btn primary" id="btnBrowse">다른 삶 둘러보기</button><p class="small sub">혼자 다시 살아 보고 싶다면 선생님께 여쭤본 뒤 아래에서 '방 나가기'를 누르세요.</p>`
    : `<div class="stack-s"><h2>새로운 삶이 기다리고 있어요</h2><p class="sub">어디서, 어떤 가정에서 태어날지는 고를 수 없습니다.</p></div><button class="btn primary" id="btnNew">태어나기</button>`;
  G.teacher=false; G.troom=null;
  if(sv) $('btnResume').onclick=()=>{ G.life=Life.load(sv); G.sec=secOf(G.life); startGame(); }; else if($('btnNew')) $('btnNew').onclick=()=>birth(); else $('btnBrowse').onclick=openBrowse;
  const lv=G.data.lives||[];
  $('hubLives').outerHTML=`<div id="hubLives">${lv.length?`<ul class="lives">${lv.slice().reverse().map(l=>`<li><details><summary>${lifeSummaryHTML(l)}</summary>${lifeDetailHTML(l)}</details></li>`).join('')}</ul>`:'<p class="sub">아직 마친 삶이 없습니다.</p>'}</div>`;
  renderHubRoom(); show('hub');
}
// 다른 삶 둘러보기: 내가 방금 산 삶과 같은 1초에 태어난 사람들 · 우리 반 친구들이 '보여 줘도 좋아요'라고 한 삶
const BR={tab:'comp',mem:null};
async function openBrowse(){ BR.tab='comp'; BR.mem=null; show('browse'); renderBrowse(); if(G.data&&G.data.room){ try{ const r=await Store.roomGet(G.data.room); BR.mem=(r&&r.members)||{}; }catch(e){ BR.mem={}; } if(BR.tab==='class') renderBrowse(); } }
function renderBrowse(){ [...$('brTabs').children].forEach(b=>b.classList.toggle('on',b.dataset.v===BR.tab)); const lv=(G.data&&G.data.lives)||[], me=lv[lv.length-1];
  if(BR.tab==='comp'){ const cs=me&&me.comps||[]; $('brBody').innerHTML=!me?'<p class="sub">아직 마친 삶이 없어요.</p>':`<p class="sub">${esc(me.name)}(${esc((COUNTRIES[me.c]||COUNTRIES.KR).n)}, ${me.age}세)과 같은 1초에 태어난 사람들입니다. 태어난 곳과 가정이 달랐을 뿐, 같은 순간에 시작한 삶이에요.</p>`+(cs.length?cs.map(p=>`<div class="panel stack-s brc"><h3>${esc(p.n)} <span class="small sub">${esc(p.cn)} ${p.set?SETN[p.set]||'':''} · ${p.sex?'여':'남'} · ${esc(p.fam||'')}</span></h3><p><b>${p.ls}세</b>까지 살았습니다.${p.cause?` 사인: ${esc(p.cause)}.`:''}${p.jobs&&p.jobs.length?` 일: ${p.jobs.map(esc).join(' → ')}.`:''}${p.mar?' 가정을 꾸렸고':''}${p.kids?` 아이 ${p.kids}명을 두었습니다.`:p.mar?'습니다.':''}</p><p class="small sub">${p.ls>me.age?`${esc(me.name)}보다 ${p.ls-me.age}년 더 살았어요.`:p.ls<me.age?`${esc(me.name)}보다 ${me.age-p.ls}년 먼저 삶을 마쳤어요.`:'같은 나이에 삶을 마쳤어요.'}</p></div>`).join(''):'<p class="sub">이 삶에는 같은 1초에 태어난 사람들의 기록이 없어요. (예전 버전에서 마친 삶)</p>'); }
  else { if(!G.data||!G.data.room){ $('brBody').innerHTML='<p class="sub">학급 방에 들어가 있을 때만 볼 수 있어요.</p>'; return; } if(BR.mem==null){ $('brBody').innerHTML='<p class="sub">불러오는 중…</p>'; return; }
    const all=[]; let hidden=0; Object.values(BR.mem).forEach(m=>Object.values(m.past||{}).forEach(p=>{ if(p.share) all.push(p); else hidden++; })); all.sort((a,b)=>b.t-a.t);
    $('brBody').innerHTML=`<p class="sub">친구들이 '보여 줘도 좋아요'라고 고른 삶만 보입니다. 누가 산 삶인지는 보이지 않고, 게임 속 이름으로만 나옵니다.${hidden?` (공개하지 않은 삶 ${hidden}개)`:''}</p>`+(all.length?all.map(p=>`<div class="panel stack-s brc"><h3>${p.title?`「${esc(p.title)}」`:'제목 없는 삶'} <span class="small sub">${esc(p.name||'')} · ${esc((COUNTRIES[p.c]||{}).n||'')} · ${p.age}세${p.cause?` (${esc(p.cause)})`:''}</span></h3>${p.epi?`<q>${esc(p.epi)}</q>`:''}${p.ans&&p.ans.length?`<ul class="ans">${p.ans.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`).join(''):'<p class="sub">아직 공개된 삶이 없어요.</p>'); } }
$('brTabs').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; BR.tab=b.dataset.v; renderBrowse(); };
$('btnBrBack').onclick=()=>openHub();
function renderHubRoom(msg){
  const code=G.data.room;
  $('hubRoom').innerHTML = code
    ? `<h3>학급 방 · ${esc(code)}</h3><p class="small sub">이 방에서는 선생님이 여는 시간에 맞춰 반 전체가 같은 나이로 삽니다. 수업이 끝난 뒤에도 그 해 안에서는 계속 살 수 있어요.</p><div class="row"><button class="btn" id="btnBrowse2">다른 삶 둘러보기</button><button class="btn ghost" id="btnRoomOut">방 나가기</button></div>`
    : `<h3>학급 방</h3><label class="field" for="roomCode">선생님이 알려 준 방 코드<input id="roomCode" maxlength="12" autocapitalize="off"></label><p class="err">${esc(msg||'')}</p><div class="row"><button class="btn" id="btnRoomIn">방에 들어가기</button></div><p class="small sub">방에 들어가지 않으면 혼자서 내 속도로 삽니다.</p>`;
  if(code&&$('btnBrowse2')) $('btnBrowse2').onclick=openBrowse;
  if(code) $('btnRoomOut').onclick=()=>{ G.data.room=null; Store.save(G.data,true); renderHubRoom(); };
  else $('btnRoomIn').onclick=async()=>{ const c=cleanCode($('roomCode').value); if(!c) return renderHubRoom('방 코드를 적어 주세요.'); const r=await Store.roomGet(c); if(!r) return renderHubRoom('그런 방이 없어요. 코드를 다시 확인해 주세요.'); G.data.room=c; Store.save(G.data,true); renderHubRoom(); };
}
// 페이지 위의 작은 도트 그림 (보이는 동안만 움직인다)
function pixLoop(id,kind){ const c=$(id); if(!c) return; if(c.width===160){ c.width=640; c.height=320; } const x=c.getContext('2d'); x.setTransform(c.width/160,0,0,c.width/160,0,0); x.imageSmoothingEnabled=false; const t0=performance.now();
  const f=()=>{ if(!c.offsetParent) return; x.clearRect(0,0,160,80); try{ drawScene(x,kind,(performance.now()-t0)/1000,kind==='title'?null:G.life); }catch(e){} requestAnimationFrame(f); }; f(); }
// 엔딩 슬라이드: 컴퓨터·휴대폰 가로처럼 넓은 화면에서는 글(왼쪽)과 그림·그래프(오른쪽)로 나누고, 한 화면에 들어오게 맞춘다
const END_WIDE=window.matchMedia?matchMedia('(min-aspect-ratio: 5/4) and (min-width: 600px)'):{matches:false};
const END_VIS='figure:not(.oneline),svg,canvas,.rbox,.ncard,blockquote:not(.bigq),.again';
function endWide(){
  const sl=document.querySelector('#endIn .slide'); if(!sl) return;
  // 원래 순서로 되돌린 뒤 다시 나눈다 (화면을 돌렸을 때도 쓰임)
  if(sl.classList.contains('split')){ const kids=[...sl.querySelectorAll(':scope>.sl-txt>*,:scope>.sl-vis>*')].sort((a,b)=>(+a.dataset.o)-(+b.dataset.o)); sl.innerHTML=''; kids.forEach(k=>sl.appendChild(k)); }
  sl.querySelectorAll(':scope>.dl2').forEach(w=>{ const o=w._orig; if(o){ [...w.querySelectorAll('dl')].forEach(d=>[...d.children].forEach(c=>o.appendChild(c))); w.replaceWith(o); } });
  sl.classList.remove('split','cols2','even');
  if(!END_WIDE.matches) return;
  const kids=[...sl.children]; kids.forEach((k,i)=>k.dataset.o=i);
  const vis=kids.filter(k=>k.matches(END_VIS)), txt=kids.filter(k=>!vis.includes(k));
  const th=txt.reduce((a,k)=>a+k.getBoundingClientRect().height,0);
  if(vis.length&&txt.length&&th>=60){
    const L=document.createElement('div'), R=document.createElement('div'); L.className='sl-txt'; R.className='sl-vis'+(vis.length>1&&vis.every(v=>v.matches('.rbox'))?' duo':'');
    txt.forEach(k=>L.appendChild(k)); vis.forEach(k=>R.appendChild(k)); sl.append(L,R); sl.classList.add('split'); if(vis.length===1&&vis[0].matches('svg')) sl.classList.add('even'); return; }
  // 글만 있는 긴 슬라이드: 넘치면 두 단으로
  if(sl.scrollHeight>sl.clientHeight+4){
    const dl=sl.querySelector(':scope>dl.whoami'); if(dl){ const ks=[...dl.children], half=Math.ceil(ks.filter(k=>k.tagName==='DT').length/2); let n=0, cut=ks.length;
      ks.forEach((k,i)=>{ if(k.tagName==='DT'&&n++===half&&cut===ks.length) cut=i; });
      const w=document.createElement('div'); w.className='dl2'; w._orig=dl; w.dataset.o=dl.dataset.o; const a=document.createElement('dl'), b=document.createElement('dl'); a.className=b.className='whoami';
      ks.forEach((k,i)=>(i<cut?a:b).appendChild(k)); w.append(a,b); dl.replaceWith(w); if(sl.scrollHeight<=sl.clientHeight+4) return; }
    if(txt.length>1) sl.classList.add('cols2'); }
}
if(END_WIDE.addEventListener) END_WIDE.addEventListener('change',()=>{ if(!$('s-end').hidden) endWide(); });
// 태어나는 순간: 나라 → 사는 곳 → 가정 형편 → 함께 사는 가족 순서로, 칸이 돌아가는 동안 화면을 눌러 직접 멈춘다 (11-14 선생님 요청)
// 결과는 이미 정해져 있다(L). 누르는 순간 그 칸이 실제 결과로 멈춘다. 오래 안 누르면 저절로 멈춘다.
let BROLL=0;
function birthReveal(cards){
  const box=$('bInfo'), sec=$('s-birth'), my=++BROLL;
  const still=(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||navigator.webdriver;   // 움직임 줄이기·자동 시험에서는 바로 보여 줌
  const names=['태어날 나라','사는 곳','가정 형편','함께 사는 가족'];
  box.innerHTML=cards.map((c,i)=>`<div class="roll wait"><b>?</b><span>${names[i]||'&nbsp;'}</span></div>`).join('');
  const els=[...box.children]; let hint=$('bHint'); if(!hint){ hint=document.createElement('p'); hint.id='bHint'; hint.className='small sub'; box.parentNode.insertBefore(hint,box); }
  const fin=i=>{ els[i].classList.remove('spin','wait'); els[i].classList.add('done'); els[i].innerHTML=`<b>${esc(cards[i].b)}</b><span>${esc(cards[i].s)}</span>`; };
  const tap=()=>{ if(my!==BROLL){ document.removeEventListener('click',tap); return; } if(ready) stop=true; };
  const end=()=>{ sec.classList.remove('rolling'); document.removeEventListener('click',tap); hint.textContent=''; };
  if(still){ cards.forEach((_,i)=>fin(i)); end(); return; }
  sec.classList.add('rolling'); let i=0, stop=false, auto=0, ready=true;
  document.addEventListener('click',tap);   // 화면 아무 데나 눌러도 된다
  const next=()=>{ if(my!==BROLL) return;
    if(i>=cards.length){ end(); return; }
    const k=i, el=els[k], pool=cards[k].pool; let n=0; clearTimeout(auto);
    el.classList.remove('wait'); el.classList.add('spin'); el.lastChild.textContent='▶ 눌러서 멈추기';
    hint.textContent=`${k+1} / ${cards.length}  ·  ${names[k]||''} — 화면을 눌러 멈춰 보세요`;
    auto=setTimeout(()=>{ stop=true; },9000);
    const tick=()=>{ if(my!==BROLL) return;
      if(stop){ clearTimeout(auto); stop=false; fin(k); i++; ready=false; setTimeout(()=>{ ready=true; next(); },450); return; }
      el.firstChild.textContent=pool[Math.floor(Math.random()*pool.length)]; n++; setTimeout(tick,70); };
    tick(); };
  setTimeout(next,400);
}
function birth(o){
  const L=G.life=new Life(o&&o.c?o:undefined); G.sec=CFG.PERIOD_SEC;
  const C=L.C; $('bTitle').textContent=`${C.n} · ${SETN[L.set]}`; $('bLine').textContent=`${FAM[L.famI].n}의 ${SEX[L.sex]}아이`;
  const fam=['엄마','아빠'].concat(L.gran?['할머니']:[],L.sib?['동생']:[]);
  birthReveal([
    {b:C.n,s:`세계에서 태어나는 아기 1000명 중 ${(()=>{ const v=birthShare(L.c)*1000; return v>=10?Math.round(v):v>=1?v.toFixed(1):v.toFixed(2); })()}명`,pool:CKEYS.map(k=>COUNTRIES[k].n)},
    {b:SETN[L.set],s:`사는 곳 (도시 ${Math.round(C.pU*100)}% · 농촌 ${Math.round((1-C.pU)*100)}%)`,pool:['도시','농촌']},
    {b:FAM[L.famI].n.replace(' 가정',''),s:'가정 형편',pool:FAM.map(f=>f.n.replace(' 가정',''))},
    {b:fam.join(' · '),s:'함께 사는 가족',pool:['엄마 · 아빠','엄마 · 아빠 · 할머니','엄마 · 아빠 · 동생','엄마 · 아빠 · 할머니 · 동생']}]);
  $('bName').value=L.given; $('bSur').textContent=L.sur?`· 성은 아빠(${L.ppl.dad.n})를 따라 '${L.sur}'`:'· 이 나라에서는 성 없이 이름만 쓰는 사람이 많아요';
  $('bFact').textContent=`${C.fact} 태어난 곳은 ${L.town}, 아빠는 ${L.ppl.dad.n}, 엄마는 ${L.ppl.mom.n}입니다.`;
  $('bCmp').innerHTML=cmpHTML(L); renderBSet();
  if(!L.look) L.look=randLook(C.rg); show('birth'); pixLoop('birthCv','country');
}
$('btnLive').onclick=()=>{ const L=G.life; L.setGiven($('bName').value.trim()||L.given); if(L.mem[0]) L.mem[0].t=`${L.birthText()} 이름은 ${L.name}.`; L.opt={card:G.opts.card,ask:0,soft:G.opts.soft==null?1:G.opts.soft}; L.yl=+G.opts.yl||60; L.pace=L.yl<=35?'short':'normal'; G.sec=secOf(L); persist(true); startGame(); };

