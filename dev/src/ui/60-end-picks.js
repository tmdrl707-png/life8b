/* ---------- [3 엔딩·기록] 엔딩: 나의 기록 고르기 (마지막 장 앞) · 개인 기록에 장면과 한 마디로 남기기 ---------- */
// 장면 그림 (기록에는 나라·사는 곳·성별만 있으므로 그것으로 그림 이름을 정한다)
function scThumb(kind,who,cls){ let n=null; try{ n=scArtName(kind,who)||scArtName('life',who); }catch(e){}
  const tt=(typeof SCENE_TITLE!=='undefined'&&SCENE_TITLE[String(kind||'').split('@')[0]])||'삶';
  return `<span class="${cls||'scimg'}" data-t="${esc(tt)}">${n?`<img src="art/sc/${n}.webp" alt="${esc(tt)}" loading="lazy" onerror="this.remove()">`:''}</span>`; }
const recWho=l=>({C:COUNTRIES[l.c||'KR']||COUNTRIES.KR,set:l.set,sex:l.sex,f:{}});
// 고를 거리: 큰 일·내가 고른 일·장면이 있는 기억을 앞에, 삶 전체에서 고르게 12개
function pickCands(L){ const M=(L.mem||[]).filter(m=>m.a>0&&m.t&&!/^(몸이 많이 약해져|크게 아파 집에서)/.test(m.t)), a=L.lifespan||L.age;
  // 어린 시절 · 청소년 · 어른 · 노년에서 고루 (예전에는 점수가 같으면 앞의 기억만 남아 30대 뒤가 빠졌다)
  const sc=m=>memScore(m)+(m.q&&m.l?1:0)+(m.f?-1:0)+m.a*1e-4, best=(arr,n)=>arr.slice().sort((x,y)=>sc(y)-sc(x)).slice(0,n);
  if(a<15) return best(M,12).sort((x,y)=>x.a-y.a);
  const e2=Math.max(30,Math.round(a*.6)), parts=[M.filter(m=>m.a<13),M.filter(m=>m.a>=13&&m.a<20),M.filter(m=>m.a>=20&&m.a<e2),M.filter(m=>m.a>=e2)].filter(x=>x.length);
  const per=Math.max(2,Math.floor(12/parts.length)), out=[]; parts.forEach(p=>out.push(...best(p,per)));
  if(out.length<12) best(M.filter(m=>!out.includes(m)),12-out.length).forEach(m=>out.push(m));
  return out.slice(0,12).sort((x,y)=>x.a-y.a); }
function pickSlideHTML(L,C,scKind){ const cut=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
  return `<div id="pkBox" class="pkbox"><p class="soft">가장 기억에 남는 순간 3가지를 골라 주세요. 고른 장면이 다음 장에서 스쳐 지나가고, 기록 카드와 '지나온 삶'에 남아요.</p>
    <h3 class="pkh">가장 기억에 남는 순간 <small id="pkN">0 / 3</small></h3>
    <div class="pkgrid">${C.map((m,i)=>`<button type="button" class="pk" data-i="${i}">${scThumb(scKind(m),L,'pkimg')}<span class="pka">${m.a}살</span><span class="pkt">${esc(cut(memT(m),70))}</span><span class="pkno"></span><span class="pkstar" data-s="${i}" title="가장 기억에 남는 한 장면">★ 대표 장면</span></button>`).join('')||'<p class="small">고를 만한 기억이 없어요.</p>'}</div>
    <p class="small sub">고른 순간에서 <b>★ 대표 장면</b>을 누르면 그 장면이 이 삶을 대표하는 그림이 돼요. 고르지 않으면 첫 번째로 고른 순간이 대표가 돼요.</p></div>`; }
function pickWire(box,PK){ const paint=()=>{ box.querySelectorAll('.pk').forEach(b=>{ const i=+b.dataset.i, k=PK.sel.indexOf(i); b.classList.toggle('on',k>=0); b.classList.toggle('fav',PK.fav===i&&k>=0); b.querySelector('.pkno').textContent=k>=0?k+1:''; }); const n=$('pkN'); if(n) n.textContent=`${PK.sel.length} / 3`; };
  box.querySelectorAll('.pk').forEach(b=>b.onclick=e=>{ const i=+b.dataset.i;
    if(e.target.closest('.pkstar')){ if(!PK.sel.includes(i)){ if(PK.sel.length>=3) return; PK.sel.push(i); } PK.fav=i; paint(); return; }
    const k=PK.sel.indexOf(i); if(k>=0){ PK.sel.splice(k,1); if(PK.fav===i) PK.fav=null; } else { if(PK.sel.length>=3){ toast('세 가지까지 고를 수 있어요. 고른 것을 한 번 더 누르면 빠져요.'); return; } PK.sel.push(i); } paint(); });
  paint(); }
function pickOut(PK,C,scKind,sum){ const mems=PK.sel.map(i=>C[i]).filter(Boolean), top3=mems.map(m=>[m.a,String(memT(m)).replace(/\s+/g,' ').slice(0,140),scKind(m)]);
  const fi=PK.fav!=null?PK.sel.indexOf(PK.fav):-1; return {mems,top3,fav:top3.length?(fi>=0?fi:0):null,sum:String(sum||'').slice(0,40)}; }
// 기록 안에서: '나의 기록' 장 (대표 장면 · 한 마디 · 세 순간)
function mineHTML(l){ const T=l.top3||[]; if(!T.length&&!l.sum) return ''; const who=recWho(l), f=T[l.fav!=null?l.fav:0];
  return `<section class="icard mine">${f?`<figure class="mcover">${scThumb(f[2],who,'mimg')}<figcaption>${f[0]}살 · ${esc(f[1])}</figcaption></figure>`:''}
    ${l.sum?`<p class="msum">“${esc(l.sum)}”</p>`:''}${T.length?`<h3>가장 기억에 남는 순간</h3><ol class="mlist3">${T.map((m,i)=>`<li>${scThumb(m[2],who,'mthumb')}<div><b>${m[0]}살${i===(l.fav!=null?l.fav:0)?' · ★ 대표 장면':''}</b><span>${esc(m[1])}</span></div></li>`).join('')}</ol>`:''}</section>`; }
{ const _lt=lifeTabs; lifeTabs=function(l,o){ const h=_lt(l,o), mine=mineHTML(l); if(!mine) return h;
    // '나의 기록'을 맨 앞 장으로 끼워 넣는다
    const wrap=document.createElement('div'); wrap.innerHTML=h; const w=wrap.firstElementChild, nav=w.querySelector('.rtabs'), first=nav.querySelector('button');
    nav.insertAdjacentHTML('afterbegin','<button type="button" role="tab" data-r="mine" class="on" aria-selected="true">나의 기록</button>'); first.classList.remove('on'); first.setAttribute('aria-selected','false');
    w.querySelectorAll(':scope>.rpane').forEach(p=>p.hidden=true); nav.insertAdjacentHTML('afterend',`<div class="rpane" data-r="mine">${mine}<button type="button" class="btn rnext" data-go="${first.dataset.r}">다음: ${first.textContent} ▶</button></div>`);
    return wrap.innerHTML; }; }
lifeDetailHTML=function(l){ return lifeTabs(l); };
// 지나온 삶 목록: 대표 장면 + 한 마디 (눌러서 펼치면 자세히)
lifeSummaryHTML=function(l){ const C=COUNTRIES[l.c||'KR']||COUNTRIES.KR, T=l.top3||[], f=T[l.fav!=null?l.fav:0];
  const kind=f?f[2]:'life'; return `<span class="lsrow">${scThumb(kind,recWho(l),'lsimg')}<span class="lstx"><b>${esc(l.title||'제목 없는 삶')}</b><span>${esc(l.name)} · ${l.age}세 · ${esc(C.n)} ${SETN[l.set]||''}${l.cause?' · '+esc(l.cause):''}</span>${l.sum?`<q>${esc(l.sum)}</q>`:''}<em>눌러서 자세히 보기</em></span></span>`; };
document.head.insertAdjacentHTML('beforeend',`<style>
.pkbox{display:flex;flex-direction:column;gap:10px}.pkh{margin:4px 0 0;font-size:1.05rem}.pkh small{font-weight:400;opacity:.8;margin-left:6px}
.pkgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(13.5rem,1fr));gap:8px}
.pk{all:unset;cursor:pointer;position:relative;display:grid;grid-template-columns:76px 1fr;grid-template-rows:auto 1fr auto;gap:2px 10px;padding:8px;border-radius:12px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.18);min-height:72px}
.pk:hover{border-color:rgba(255,201,168,.7)} .pk.on{border-color:#FFC9A8;background:rgba(255,201,168,.16)} .pk.fav{border-color:#F2C14E;box-shadow:0 0 0 2px rgba(242,193,78,.5)}
.pkimg{grid-row:1/4;width:76px;height:52px;border-radius:8px;overflow:hidden;background:rgba(255,255,255,.12);display:block;position:relative}
.pkimg img,.mthumb img,.lsimg img,.mimg img{width:100%;height:100%;object-fit:cover;display:block}
.pkimg:empty::after,.mthumb:empty::after,.lsimg:empty::after,.mimg:empty::after{content:attr(data-t);position:absolute;inset:0;display:grid;place-items:center;font-size:.72rem;opacity:.75}
.pka{font-weight:800;font-size:.85rem;color:#FFC9A8}.pkt{font-size:.88rem;line-height:1.4}
.pkno{position:absolute;top:-8px;left:-8px;width:24px;height:24px;border-radius:50%;background:#FFC9A8;color:#2A2622;font-weight:800;display:none;place-items:center;font-size:.85rem}.pk.on .pkno{display:grid}
.pkstar{display:none;justify-self:end;font-size:.75rem;font-weight:800;padding:2px 8px;border-radius:999px;border:1px solid #F2C14E;color:#F2C14E}.pk.on .pkstar{display:inline-block}.pk.fav .pkstar{background:#F2C14E;color:#2A2622}
.pksum input{font:inherit;padding:10px 12px;border-radius:10px;border:1.5px solid rgba(255,255,255,.35);background:rgba(255,255,255,.95);color:#1E2B37}
.mine .mcover{margin:0;display:flex;flex-direction:column;gap:6px}.mimg{display:block;position:relative;width:100%;aspect-ratio:2/1;border-radius:12px;overflow:hidden;background:#E8E2D4}
.mine figcaption{font-size:.88rem;opacity:.8}.msum{font-size:1.25rem;font-weight:800;margin:6px 0;color:#B4501E}
.mlist3{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}.mlist3 li{display:flex;gap:10px;align-items:center}
.mthumb{flex:none;width:84px;height:56px;border-radius:8px;overflow:hidden;position:relative;background:#E8E2D4;display:block}.mlist3 div{display:flex;flex-direction:column;font-size:.9rem}
.lsrow{display:inline-flex;gap:12px;align-items:center;vertical-align:middle;width:calc(100% - 24px)}.lsimg{flex:none;width:96px;height:64px;border-radius:10px;overflow:hidden;position:relative;background:#E8E2D4;display:block}
.lstx{display:flex;flex-direction:column;gap:2px;min-width:0}.lstx q{font-weight:700;color:#B4501E}.lstx em{font-size:.78rem;opacity:.65;font-style:normal}
</style>`);

