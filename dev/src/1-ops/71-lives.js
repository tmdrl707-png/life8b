/* ========== [1 운영] 아이디 하나에 여러 삶 (2026-11-14) ==========
   - 로그인하면 처음 화면에 '살고 있는 삶' 목록이 나오고, 원하는 삶을 골라 이어서 살거나 새로 태어날 수 있다(동시에 LV_MAX개까지).
   - 저장 형식: 지금 고른 삶은 예전처럼 data.save(그대로라 예전 저장·교사 화면과 호환), 그 밖의 삶은 data.slots[<id>] = {d: 삶, t: 시각}.
     data.cur = 지금 삶의 id. 예전 저장(save만 있음)은 처음 열 때 id를 붙인다.
   - Firebase에서는 저장할 때 slots를 빼고 PATCH로 보내(쉬고 있는 삶을 매번 다시 보내지 않으려고), 삶을 바꾸거나 지울 때만 users/<uid>/slots/<id>를 따로 쓴다.
     이 기기 저장(local)은 data를 통째로 저장한다. */
const LV_MAX=5;
const lvId=()=>'s'+Date.now().toString(36)+Math.floor(R()*1e4).toString(36);
function lvEnsure(d){ if(!d) return d; d.slots=d.slots||{}; if(d.save&&!d.cur) d.cur=lvId(); return d; }
Store.flush=async function(data){ if(!this.sess) return; lvEnsure(data);
  if(this.fb){ ls('life8b_cache_'+this.sess.id,data); const body=Object.assign({},data); delete body.slots; try{ await this.db('PATCH','users/'+this.sess.uid,body); }catch(e){} }
  else { const key='life8b_acc_'+this.sess.id, acc=ls(key); if(acc){ acc.data=data; ls(key,acc); } } };
Store.slotPut=async function(id,val){ if(!this.sess||!this.fb) return; try{ await this.db('PUT','users/'+this.sess.uid+'/slots/'+id,val); }catch(e){} };
// 지금 삶을 쉬는 칸으로 옮긴다
function lvStash(){ const d=G.data; lvEnsure(d); if(G.life&&!G.life.dead&&!G.teacher) d.save=G.life.dump();
  if(d.save&&d.cur){ const s={d:d.save,t:Date.now()}; d.slots[d.cur]=s; Store.slotPut(d.cur,s); } d.save=null; d.cur=null; G.life=null; }
function lvList(){ const d=lvEnsure(G.data), out=[]; if(d.save) out.push({id:d.cur,d:d.save,t:d.t||Date.now(),act:1}); for(const id in d.slots){ const s=d.slots[id]; if(s&&s.d) out.push({id,d:s.d,t:s.t||0}); } return out.sort((a,b)=>b.t-a.t); }
function lvGo(id){ const d=lvEnsure(G.data); if(!(d.save&&d.cur===id)){ const s=d.slots[id]; if(!s) return; lvStash(); delete d.slots[id]; Store.slotPut(id,null); d.save=s.d; d.cur=id; }
  G.life=Life.load(d.save); G.sec=secOf(G.life); Store.save(d,true); startGame(); }
function lvNew(){ lvStash(); G.data.cur=lvId(); Store.save(G.data,true); birth(); }
function lvDel(id){ const d=lvEnsure(G.data); if(d.save&&d.cur===id){ d.save=null; d.cur=null; G.life=null; } else { delete d.slots[id]; Store.slotPut(id,null); } Store.save(d,true); openHub(); }
const lvAgo=t=>{ const m=Math.round((Date.now()-t)/60000); return m<1?'방금':m<60?`${m}분 전`:m<1440?`${Math.round(m/60)}시간 전`:`${Math.round(m/1440)}일 전`; };
document.head.insertAdjacentHTML('beforeend',`<style>
.lvList{display:flex;flex-direction:column;gap:8px}.lvCard{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 12px;border-radius:12px;background:rgba(127,140,150,.1)}
.lvCard>div:first-child{flex:1;min-width:12rem;display:flex;flex-direction:column;gap:2px}.lvCard b{font-size:1.05rem}.lvBtns{display:flex;gap:6px}.lvBtns .btn{padding:.45rem .9rem}
.lvCard .btn.warn{background:#C0392B;border-color:#C0392B;color:#fff}.lvNote{font-size:.85rem;color:#7C8A96}
</style>`);
openHub=(old=>function(){ old(); try{ const d=lvEnsure(G.data); if(!d||!$('hubNow')) return;
  if(d.room&&d.roomDone&&d.roomDone[d.room]&&!lvList().length) return;   // 학급 방에서 삶을 마친 뒤: 예전처럼 '다른 삶 둘러보기'
  const L=lvList(); if(!L.length) return;   // 살고 있는 삶이 없으면 예전 화면(새로운 삶이 기다리고 있어요)
  const full=L.length>=LV_MAX, rd=!!(d.room&&d.roomDone&&d.roomDone[d.room]);
  $('hubNow').innerHTML=`<div class="stack-s"><p class="sub small">살고 있는 삶 ${L.length}/${LV_MAX} · 골라서 이어서 살 수 있어요</p><div class="lvList">${L.map(x=>{ const v=x.d, C=COUNTRIES[v.c||'KR']||COUNTRIES.KR;
      return `<div class="lvCard"><div><b>${esc(v.name||'')} · ${v.age}세</b><span class="sub small">${esc(C.n)} ${SETN[v.set]||''} · ${esc((FAM[v.famI]||{}).n||'')} · 선택 ${v.n||0}번 · ${lvAgo(x.t)}</span></div><div class="lvBtns"><button class="btn primary" data-go="${x.id}">이어서 살기</button><button class="btn" data-del="${x.id}">지우기</button></div></div>`; }).join('')}</div>
    ${full?`<p class="lvNote">삶은 ${LV_MAX}개까지 함께 살 수 있어요. 새로 태어나려면 하나를 끝까지 살거나 지워 주세요.</p>`:''}
    ${rd?'<button class="btn" id="btnBrowse">다른 삶 둘러보기</button>':`<button class="btn${full?'':' primary'}" id="btnNew" ${full?'disabled':''}>새로 태어나기</button>`}</div>`;
  $('hubNow').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>lvGo(b.dataset.go));
  $('hubNow').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ if(b.dataset.sure){ lvDel(b.dataset.del); return; } b.dataset.sure=1; b.classList.add('warn'); b.textContent='정말 지울까요? 한 번 더'; setTimeout(()=>{ if(b.isConnected){ delete b.dataset.sure; b.classList.remove('warn'); b.textContent='지우기'; } },3500); });
  if(rd) $('btnBrowse').onclick=openBrowse; else if(!full) $('btnNew').onclick=lvNew;
}catch(e){ console.warn(e); } })(openHub);
