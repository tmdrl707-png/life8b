/* ========== 교사용 기록: 교사용 모드에서 산 삶도 저장해 이어서 하고, 마친 삶은 제목과 함께 남긴다 ==========
   이 기기(localStorage)에 늘 저장하고, Firebase가 있으면 데이터베이스에도 함께 둔다.
   로그인한 선생님은 자기 계정 칸에, 로그인하지 않았으면 교사용 공용 칸에 저장된다. */
const TStore={ data:null, timer:null,
  key(){ return Store.sess?'u'+String(Store.sess.uid||Store.sess.id).replace(/[^\w-]/g,''):'shared'; },
  fresh(d){ d=d||{}; if(!d.saves||typeof d.saves!=='object') d.saves={}; if(!Array.isArray(d.lives)) d.lives=d.lives?Object.values(d.lives):[]; d.t=d.t||0; return d; },
  async load(){ const k=this.key(); let d=ls('life8b_tdata_'+k);
    if(Store.fb){ try{ const r=await Store.db('GET','tdata/'+k); if(r&&(!d||(r.t||0)>(d.t||0))) d=r; }catch(e){} }
    this.data=this.fresh(d); this.k=k; return this.data; },
  dirty:new Set(),
  // what: 저장한 삶 하나의 id, 'lives'(마친 삶 목록), 없으면 전부. 데이터베이스에는 바뀐 칸만 보낸다
  save(now,what){ const d=this.data; if(!d) return; d.t=Date.now(); const k=this.k||this.key(); this.k=k; ls('life8b_tdata_'+k,d); clearTimeout(this.timer);
    if(what) this.dirty.add(what); else { this.dirty.add('lives'); Object.keys(d.saves).forEach(x=>this.dirty.add(x)); this.dirty.add('*del'); }
    const go=async()=>{ if(!Store.fb) return; const ds=[...this.dirty]; this.dirty.clear();
      try{ for(const w of ds){ if(w==='lives') await Store.db('PUT','tdata/'+k+'/lives',d.lives); else if(w==='*del') await Store.db('PUT','tdata/'+k+'/saves',d.saves); else await Store.db('PUT','tdata/'+k+'/saves/'+w,d.saves[w]||null); }
        await Store.db('PUT','tdata/'+k+'/t',d.t); }catch(e){} };
    if(now) go(); else this.timer=setTimeout(go,2000); } };
function tPersist(now){ const L=G.life; if(!L||!G.tid) return; const d=TStore.data||(TStore.data=TStore.fresh(ls('life8b_tdata_'+TStore.key())));
  if(L.dead) delete d.saves[G.tid];
  else { d.saves[G.tid]={dump:L.dump(),name:L.name,age:L.age,c:L.c,set:L.set,famI:L.famI,n:L.n,room:G.troom||null,sec:G.sec,t:Date.now()};
    const ks=Object.keys(d.saves).sort((a,b)=>d.saves[b].t-d.saves[a].t); ks.slice(12).forEach(k=>{ delete d.saves[k]; TStore.dirty.add(k); }); }
  TStore.save(now,G.tid); }
const tNewId=()=>'t'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);
async function renderTRec(){ $('tSaves').innerHTML='<p class="small sub">기록을 불러오는 중…</p>'; const d=await TStore.load();
  const sv=Object.entries(d.saves).sort((a,b)=>b[1].t-a[1].t);
  const when=t=>{ const x=new Date(t); return `${x.getMonth()+1}/${x.getDate()} ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`; };
  $('tSaves').innerHTML=sv.length?`<ul class="lives">${sv.map(([id,s])=>`<li><b>${esc(s.name)}</b> · ${s.age}세 · ${esc((COUNTRIES[s.c]||{}).n||'')} ${SETN[s.set]||''} · ${esc((FAM[s.famI]||{}).n||'')} · 선택 ${s.n||0}번${s.room?` · ${esc(s.room)} 방`:''}<span class="small sub"> · ${when(s.t)}</span><div class="row" style="margin-top:6px"><button class="btn primary" data-go="${esc(id)}">이어서 살기</button><button class="btn ghost" data-del="${esc(id)}">지우기</button></div></li>`).join('')}</ul>`:'<p class="small sub">이어서 할 삶이 없습니다. 아래에서 새 삶을 시작하면 자동으로 저장됩니다.</p>';
  const lv=d.lives.slice().sort((a,b)=>(b.t||0)-(a.t||0));
  $('tLives').innerHTML=lv.length?lv.map((l,i)=>`<li><details><summary>${lifeSummaryHTML(l)}</summary>${lifeDetailHTML(l)}<div class="row" style="margin-top:6px"><button class="btn ghost" data-ldel="${i}">이 기록 지우기</button></div></details></li>`).join(''):'<li class="sub">아직 마친 삶이 없습니다.</li>';
  $('tSaves').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const id=b.dataset.go, s=d.saves[id]; if(!s) return; G.teacher=true; G.tid=id; G.sec=s.sec||60; G.troom=s.room&&TR.code===s.room?s.room:null; G.life=Life.load(s.dump); startGame(); });
  $('tSaves').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ if(b.dataset.armed!=='1'){ b.dataset.armed='1'; b.textContent='정말 지울까요?'; return; } delete d.saves[b.dataset.del]; TStore.save(true,b.dataset.del); renderTRec(); });
  $('tLives').querySelectorAll('[data-ldel]').forEach(b=>b.onclick=()=>{ if(b.dataset.armed!=='1'){ b.dataset.armed='1'; b.textContent='정말 지울까요?'; return; } const l=lv[+b.dataset.ldel]; d.lives=d.lives.filter(x=>x!==l); TStore.save(true,'lives'); renderTRec(); }); }
function openTeacherBody(){ $('tGate').hidden=true; $('tBody').hidden=false; show('teacher'); renderTRoom(); TStore.load().then(d=>{ const s=Object.entries(d.saves).sort((a,b)=>b[1].t-a[1].t)[0], c=$('btnTCont'); if(c){ c.hidden=!s; c.onclick=()=>{ if(!s) return; G.teacher=true; G.tid=s[0]; G.sec=s[1].sec||60; G.troom=s[1].room&&TR.code===s[1].room?s[1].room:null; G.life=Life.load(s[1].dump); startGame(); }; } }); }
// 학생 아이디 관리
const TI={list:[],loaded:0};
async function renderTIds(reload){ const box=$('tIdList'); if(!box) return;
  if(Store.fb&&Store.mode==='auth'){ box.innerHTML='<p class="small sub">이 프로젝트는 Firebase 인증 방식이라 아이디 목록을 볼 수 없습니다. (인증을 끈 방식에서 쓸 수 있어요)</p>'; return; }
  if(reload||!TI.loaded){ box.innerHTML='<p class="small sub">불러오는 중…</p>'; try{ TI.list=await Store.adminList(); TI.loaded=1; $('tIdClosed').checked=await Store.closed(); }catch(e){ box.innerHTML=`<p class="err">${esc(Store.msg(e))}</p>`; return; } }
  const f=$('tIdFilter').value.trim().toLowerCase(), fl=TI.list.filter(o=>!f||o.id.toLowerCase().includes(f)), when=t=>{ if(!t) return ''; const x=new Date(t); return `${x.getMonth()+1}/${x.getDate()} ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`; };
  box.innerHTML=fl.length?`<p class="small sub">아이디 ${TI.list.length}개${f?` · 검색 ${fl.length}개`:''}</p><ul class="lives">${fl.map(o=>`<li><div class="idrow"><span><b>${esc(o.id)}</b>${o.open?' <span class="small" style="color:#B4501E">· 비밀번호 정하는 중</span>':''}<span class="small sub">${o.last?' · 마지막 저장 '+when(o.last):''}${!o.data?' · 기록 없음':''}</span></span><span class="btns"><button class="btn ghost" data-iv="${esc(o.id)}">기록 보기</button><button class="btn ghost" data-ir="${esc(o.id)}">비밀번호 초기화</button><button class="btn ghost" data-id="${esc(o.id)}">아이디 지우기</button></span></div><div class="stack-s" data-ibox="${esc(o.id)}" hidden></div></li>`).join('')}</ul>`:`<p class="small sub">${TI.list.length?'찾는 아이디가 없습니다.':'아직 만들어진 아이디가 없습니다.'}</p>`;
  const get=id=>TI.list.find(o=>o.id===id), say=(t,bad)=>{ const m=$('tIdMsg'); m.textContent=t; m.style.color=bad?'#B3261E':'#2F6B3A'; };
  box.querySelectorAll('[data-iv]').forEach(b=>b.onclick=async()=>{ const o=get(b.dataset.iv), bx=box.querySelector(`[data-ibox="${CSS.escape(o.id)}"]`); if(!bx.hidden){ bx.hidden=true; return; } bx.hidden=false; bx.innerHTML='<p class="small sub">불러오는 중…</p>';
    try{ const d=await Store.adminUser(o), lv=(d.lives||[]).slice().reverse(), sv=d.save;
      bx.innerHTML=`${sv?`<p class="small"><b>지금 살고 있는 삶</b> · ${esc(sv.name)} · ${sv.age}세 · ${esc((COUNTRIES[sv.c||'KR']||COUNTRIES.KR).n)} ${SETN[sv.set]||''} · 선택 ${sv.n||0}번</p>`:'<p class="small sub">지금 살고 있는 삶은 없습니다.</p>'}${lv.length?`<ul class="lives">${lv.map(l=>`<li><details><summary>${lifeSummaryHTML(l)}</summary>${lifeDetailHTML(l)}</details></li>`).join('')}</ul>`:'<p class="small sub">마친 삶이 아직 없습니다.</p>'}`; }catch(e){ bx.innerHTML=`<p class="err">${esc(Store.msg(e))}</p>`; } });
  box.querySelectorAll('[data-ir],[data-id]').forEach(b=>b.onclick=async()=>{ const isR=!!b.dataset.ir, o=get(b.dataset.ir||b.dataset.id);
    if(b.dataset.armed!=='1'){ b.dataset.armed='1'; b.textContent=isR?'정말 초기화?':'정말 지울까요? (기록도 함께 사라져요)'; return; }
    try{ if(isR){ await Store.adminReset(o); o.open=true; say(`‘${o.id}’의 비밀번호를 초기화했습니다. 다음에 그 아이디로 들어올 때 적는 비밀번호가 새 비밀번호가 됩니다.`); } else { await Store.adminDelete(o); TI.list=TI.list.filter(x=>x!==o); say(`‘${o.id}’ 아이디와 그 기록을 지웠습니다.`); } renderTIds(); }catch(e){ say(Store.msg(e),1); } }); }
$('tIdFilter').oninput=()=>renderTIds(); $('btnTIdReload').onclick=()=>renderTIds(true);
$('btnTIdAdd').onclick=async()=>{ const ids=[...new Set($('tIdAdd').value.split(/[\n,]+/).map(x=>x.trim()).filter(Boolean))], bad=ids.filter(x=>x.length<2||x.length>10), ok=ids.filter(x=>x.length>=2&&x.length<=10), m=$('tIdMsg');
  if(!ids.length){ m.style.color='#B3261E'; m.textContent='등록할 아이디를 한 줄에 하나씩 적어 주세요.'; return; }
  try{ const n=await Store.adminAdd(ok); $('tIdAdd').value=bad.join('\n'); m.style.color='#2F6B3A'; m.textContent=`${n}개를 등록했습니다.${ok.length-n?` (이미 있는 ${ok.length-n}개는 그대로 둠)`:''}${bad.length?` 2~10자가 아닌 ${bad.length}개는 남겨 두었어요.`:''} 학생이 그 아이디로 들어와 처음 적는 비밀번호가 비밀번호가 됩니다.`; renderTIds(true); }catch(e){ m.style.color='#B3261E'; m.textContent=Store.msg(e); } };
$('tIdClosed').onchange=async()=>{ const m=$('tIdMsg'); try{ await Store.setClosed($('tIdClosed').checked); m.style.color='#2F6B3A'; m.textContent=$('tIdClosed').checked?'이제 등록한 아이디로만 들어올 수 있습니다. (새 아이디는 만들어지지 않아요)':'이제 처음 쓰는 아이디도 그대로 만들어집니다.'; }catch(e){ m.style.color='#B3261E'; m.textContent=Store.msg(e); $('tIdClosed').checked=!$('tIdClosed').checked; } };

