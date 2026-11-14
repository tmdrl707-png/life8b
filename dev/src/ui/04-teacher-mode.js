/* ========== 교사용 모드: 학급 방 운영 + 삶 골라 체험 ========== */
const TSEL={c:'?'};
$('btnTeacher').onclick=()=>openTeacher(); $('btnTeacher2').onclick=()=>openTeacher();
function openTeacher(){ if(G.tok) return openTeacherBody(); $('tGate').hidden=false; $('tBody').hidden=true; $('tCode').value=''; $('tErr').textContent=''; show('teacher'); }
$('btnTBack').onclick=()=>{ G.teacher=false; G.troom=null; if(Store.sess&&G.data) openHub(); else show('login'); };
$('btnTCode').onclick=()=>{ if($('tCode').value===CFG.TEACHER_CODE){ G.tok=1; openTeacherBody(); } else $('tErr').textContent='코드가 맞지 않습니다.'; };
// 교사용 나라 고르기: 지역별로 묶은 193개 나라
(function(){ const sel=$('tCountry'), byR={}; CKEYS.forEach(k=>{ const c=COUNTRIES[k]; (byR[c.rg]=byR[c.rg]||[]).push(k); });
  sel.innerHTML=Object.keys(REGIONS).map(r=>`<optgroup label="${REGIONS[r].n}">${(byR[r]||[]).sort((a,b)=>COUNTRIES[a].n.localeCompare(COUNTRIES[b].n,'ko')).map(k=>`<option value="${k}"${k==='KR'?' selected':''}>${COUNTRIES[k].n}</option>`).join('')}</optgroup>`).join('');
  })();
// 체험하기(선생님이 직접 해 보기): 나라(무작위 가능)·시작 나이·시간만 고른다
const TEXP={age:'0',time:'solo',sec:'60'};
(function(){ const sel=$('tCountry'); if(sel&&!sel.querySelector('option[value="?"]')){ sel.insertAdjacentHTML('afterbegin','<option value="?">무작위 (학생처럼)</option>'); sel.value='?'; TSEL.c='?'; } })();
function tExpSync(){ const room=TEXP.time==='room'; $('tSecSeg').hidden=room; $('tExpNote').textContent=room?(TR.code?`${TR.code} 방의 시간에 맞춰 삽니다. 방의 나이가 앞서 있으면 그 나이까지 빠르게 따라갑니다.`:'먼저 위에서 방을 열어 주세요.'):''; $('tExpErr').textContent=''; }
$('tExp').addEventListener('click',e=>{ const b=e.target.closest('.seg button'); if(!b) return; const seg=b.parentElement; TEXP[seg.dataset.k]=b.dataset.v; [...seg.children].forEach(x=>x.classList.toggle('on',x===b)); tExpSync(); });
$('btnTExp').onclick=()=>{ const room=TEXP.time==='room'; if(room&&!TR.code){ $('tExpErr').textContent='먼저 위에서 방을 열어 주세요.'; return; }
  const rnd=$('tCountry').value==='?', age=+TEXP.age; G.teacher=true; G.tid=tNewId(); G.troom=room?TR.code:null;
  if(rnd&&age===0){ birth(); return; }   // 학생과 똑같이: 무작위 출생 → 이름 짓기
  G.sec=room?60:+TEXP.sec; const mk=()=>new Life(rnd?undefined:{c:$('tCountry').value,set:'U',famI:1,sex:0});
  let X=mk(); if(age>0){ for(let i=0;i<40;i++){ X=mk().runAuto(age); if(!X.dead) break; } X.dead=false; } G.life=X; startGame(); };
$('btnROpen').onclick=async()=>{
  const c=cleanCode($('rCode').value); $('rErr').textContent='';
  if(!c){ $('rErr').textContent='방 코드를 적어 주세요. (예: 2-3)'; return; }
  if(Store.fb&&!Store.sess){ $('rErr').textContent='방을 운영하려면 먼저 선생님 아이디로 로그인해 주세요. (첫 화면에서 아이디를 만들고 로그인한 뒤, 계정 홈의 교사용 모드로 들어오세요)'; return; }
  try{ let r=await Store.roomGet(c);
    if(!r){ r={owner:Store.uid(),pi:0,t0:Date.now(),auto:0,paused:1,cfg:{soft:'1',prob:''}}; await Store.roomSet(c,r); }
    else if(Store.fb&&r.owner!==Store.uid()){ $('rErr').textContent='다른 선생님이 만든 방입니다. 다른 코드를 써 주세요.'; return; }
    TR.code=c; TR.room=r; clearInterval(TR.poll); TR.poll=setInterval(async()=>{ const x=await Store.roomGet(TR.code); if(x){ TR.room=x; renderTRoom(); } },4000); renderTRoom();
  }catch(e){ $('rErr').textContent=Store.msg(e); }
};
async function tSet(patch){ Object.assign(TR.room,patch); renderTRoom(); try{ await Store.roomSet(TR.code,patch); }catch(e){ $('rErr').textContent=Store.msg(e); } }
function renderRCfg(r){ const c=(r&&r.cfg)||{}; $('rCfg').querySelectorAll('.seg').forEach(sg=>{ const v=c[sg.dataset.c]==null?'':String(c[sg.dataset.c]); [...sg.children].forEach(b=>b.classList.toggle('on',b.dataset.v===v)); }); }
$('rCfg').addEventListener('click',e=>{ const b=e.target.closest('.seg button'); if(!b||!TR.room) return; const cfg=Object.assign({soft:'',prob:''},TR.room.cfg||{}); cfg[b.parentElement.dataset.c]=b.dataset.v; tSet({cfg}); });
function renderTRoom(){
  const r=TR.room; $('rPanel').hidden=!r; if(!r) return; renderRCfg(r); const pi=roomEffPi(r), mem=Object.values(r.members||{}).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  $('rNow').innerHTML=`<div><b class="num">${ageOfPi(pi)}살</b><span>${esc(TR.code)} 반의 지금 나이 · ${stageOf(ageOfPi(pi))}</span></div><div><b>${r.auto>0&&!r.paused?'자동 · '+r.auto+'분마다':'멈춤 (수동)'}</b><span>시간의 흐름</span></div><div><b class="num">${mem.length}명</b><span>들어온 학생</span></div>`;
  const pastHTML=m=>{ const ps=Object.values(m.past||{}).sort((a,b)=>a.t-b.t); return ps.length?`<ul class="past">${ps.map(p=>`<li><b>마친 삶</b> · ${esc(p.name||'')} · ${p.c&&COUNTRIES[p.c]?esc(COUNTRIES[p.c].n)+' · ':''}${p.age}세${p.cause?` (${esc(p.cause)})`:''}${p.title?` · 「${esc(p.title)}」`:''}${p.share?' · <span class="shr">친구 공개</span>':''}${p.epi?`<q>${esc(p.epi)}</q>`:''}${p.ans&&p.ans.length?`<ul class="ans">${p.ans.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</li>`).join('')}</ul>`:''; };
  $('rMembers').innerHTML=mem.length?mem.map(m=>m.past?`<li><b>${esc(m.id)}</b> · ${esc(m.name||'')} · ${m.dead?`${m.age}세에 삶을 마침`:m.age+'살'}${m.c&&COUNTRIES[m.c]?` · ${esc(COUNTRIES[m.c].n)}`:''} · 선택 ${m.n||0}번${pastHTML(m)}</li>`:`<li><b>${esc(m.id)}</b> · ${esc(m.name||'')} ${m.dead?`· ${m.age}세에 삶을 마침${m.title?` · 「${esc(m.title)}」`:''}${m.cause?` · ${esc(m.cause)}`:''}`:'· '+m.age+'살'}${m.c&&COUNTRIES[m.c]?` · ${esc(COUNTRIES[m.c].n)}`:''} · 선택 ${m.n||0}번${m.epi?`<q>${esc(m.epi)}</q>`:''}${m.ans&&m.ans.length?`<ul class="ans">${m.ans.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</li>`).join(''):'<li class="sub">아직 들어온 학생이 없습니다. 학생은 로그인 뒤 방 코드를 넣으면 됩니다.</li>';
}
$('rCtl').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!TR.room) return; const pi=roomEffPi(TR.room), now=Date.now(), a=b.dataset.a;
  if(a==='next') tSet({pi:Math.min(59,pi+1),t0:now});
  if(a==='prev') tSet({pi:Math.max(0,pi-1),t0:now});
  if(a==='auto') tSet({pi,t0:now,auto:+$('rAuto').value,paused:0});
  if(a==='pause') tSet({pi,t0:now,paused:1});
  if(a==='reset'){ if(!TR.armed){ TR.armed=true; b.textContent='정말 0살로? 한 번 더 누르기'; setTimeout(()=>{ TR.armed=false; b.textContent='0살로 되돌리기'; },4000); return; } TR.armed=false; b.textContent='0살로 되돌리기'; tSet({pi:0,t0:now,paused:1}); }
});


