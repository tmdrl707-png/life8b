/* ========== 화면 다듬기 (3판): 닫기 버튼 · 더 큰 알림 · 미니맵 아래 오각형 · 내 정보 메뉴 · 기억 카드 ========== */
// 닫을 수 있는 창에는 오른쪽 위에 늘 보이는 ✕
(function(){ const _sheet=sheet; sheet=function(html,cls){ _sheet(html,cls); const box=$('sheetBox'); if(!box) return; const ok=$('btnOk');
  if(ok||/\bclosable\b/.test(cls||'')){ const b=document.createElement('button'); b.className='xclose'; b.type='button'; b.setAttribute('aria-label','닫기'); b.textContent='✕';
    b.onclick=()=>{ const k=$('btnOk'); if(k) k.click(); else closeSheet(); }; box.insertBefore(b,box.firstChild); } }; })();
// 작은 알림: 더 크게, 글이 길수록 더 오래, 누르면 바로 닫힘
(function(){ const _fl=flash; flash=function(place,t,fx,tr,bad){ _fl(place,t,fx,tr,bad); const f=$('flash'); clearTimeout(flash.t); const ms=clamp(3200+String(t||'').length*55,3800,8000);
  flash.t=setTimeout(()=>f.hidden=true,ms); f.onclick=()=>{ clearTimeout(flash.t); f.hidden=true; }; }; })();
// ---- 미니맵 아래 작은 오각형 (최소화할 수 있다)
function miniRadarSVG(v){ const cx=100, cy=98, R=58, ang=i=>-Math.PI/2+i*2*Math.PI/5, pt=(i,val)=>[cx+Math.cos(ang(i))*R*val/100,cy+Math.sin(ang(i))*R*val/100];
  const poly=f=>AXES.map((k,i)=>pt(i,f(k)).map(z=>z.toFixed(1)).join(',')).join(' ');
  let g=`<polygon points="${poly(()=>100)}" fill="rgba(124,149,174,.08)" stroke="#7C95AE" stroke-width="1.6"/><polygon points="${poly(()=>50)}" fill="none" stroke="#D8E0E8"/><polygon points="${poly(k=>clamp(v[k]||0,0,100))}" fill="rgba(226,112,58,.3)" stroke="#E2703A" stroke-width="2.4" stroke-linejoin="round"/>`;
  AXES.forEach((k,i)=>{ const q=pt(i,128); g+=`<text x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="700" fill="${AX_COL[k]}">${AX_N[k]} ${Math.round(v[k]||0)}</text>`; });
  return `<svg viewBox="-28 0 256 196" class="mrad" role="img" aria-label="삶의 모양 ${AXES.map(k=>AX_N[k]+' '+Math.round(v[k]||0)).join(', ')}">${g}</svg>`; }
let MINIRAD_OFF=false; try{ MINIRAD_OFF=localStorage.getItem('life8b_minirad')==='0'; }catch(e){}
function renderMiniRad(){ const L=G.life, hud=$('hud'); if(!L||!hud) return; let el=$('miniRad');
  if(!el){ el=document.createElement('div'); el.id='miniRad'; el.className='gbox'; ($('s-game')||document.body).appendChild(el);
    el.onclick=e=>{ if(e.target.closest('.mrtog')){ MINIRAD_OFF=!MINIRAD_OFF; try{ localStorage.setItem('life8b_minirad',MINIRAD_OFF?'0':'1'); }catch(er){} renderMiniRad(); } else if(!MINIRAD_OFF&&$('sheet').hidden) openInfo('shape'); }; }
  const mw=$('miniWrap'), r=mw?mw.getBoundingClientRect():null, pr=el.offsetParent?el.offsetParent.getBoundingClientRect():{top:0,left:0}, qs=document.querySelector('#hud ~ .qchips, #qChips, .qtags');
  let top=r?r.bottom-pr.top+8:110; const chips=[...document.querySelectorAll('#hQuest li')].filter(x=>x.offsetParent); chips.forEach(c=>{ const b=c.getBoundingClientRect(); if(b.left<(r?r.right:200)) top=Math.max(top,b.bottom-pr.top+6); });
  el.style.top=top+'px'; el.style.left=(r?r.left-pr.left:12)+'px'; if(r) el.style.width=MINIRAD_OFF?'auto':Math.min(r.width,190)+'px';
  el.classList.toggle('off',MINIRAD_OFF);
  el.innerHTML=MINIRAD_OFF?`<button class="mrtog" type="button" aria-label="삶의 모양 펼치기">⬠ 삶의 모양 ＋</button>`:`<div class="mrhd"><span>삶의 모양</span><button class="mrtog" type="button" aria-label="삶의 모양 접기">－</button></div>${miniRadarSVG(L.s)}`; }
(function(){ const _rh=renderHud; renderHud=function(){ _rh.apply(this,arguments); try{ renderMiniRad(); }catch(e){} }; addEventListener('resize',()=>{ try{ renderMiniRad(); }catch(e){} }); })();
// ---- 내 정보: 메뉴로 나눈다
const INFO_TABS=[['me','개인 정보'],['others','다른 사람들'],['fam','우리 가족'],['shape','삶의 모양'],['trait','성향'],['joy','내 행복을 만드는 것']];
function infoRow(k,v){ return `<div class="irow"><div class="ik">${k}</div><div class="iv">${v}</div></div>`; }
function openInfo(tab){ tab=tab||'me'; const L=G.life, C=L.C, f=L.f, a=L.age, P=L.ppl||{};
  let body='';
  if(tab==='me'){ const sc=L.sch||{}, hi=L.tx('{high}'), school=a<7?'아직 학교에 갈 나이가 아니에요':f.univ&&f.school?`${sc.univ} 학생`:a<=12?(f.elem?`${sc.elem} ${a-6}학년`:'학교에 다니지 못하고 있어요'):a<=18?(f.sec?(a>=16&&f.hs?`${hi} 학생`:`${sc.mid} 학생`):f.elem?`${sc.elem}까지 다녔어요 · 지금은 일을 도와요`:'학교에 다니지 못했어요 · 일을 도와요'):f.univDone?`${sc.univ} 졸업`:f.sec?`${f.hs?hi:sc.mid} 졸업`:f.elem?`${sc.elem} 졸업`:'학교에 다니지 못했어요';
    const j=L.job, ratio=L.inc/C.med, I=instOf(L), rk=rankName(L), svcNow=L._army||(f.svc&&a>=f.svc[0]&&a<f.svc[1]);
    const job=a<19?'—':svcNow?'군 복무 중이에요':j?`<b>${esc(f.co||'')} · ${j.n}${rk&&rk!==j.n?` (${esc(rk)})`:''}</b>${f.job==='abroad'&&f.migTo?` · ${esc(f.migTo)}에서`:''}<div class="isub">한 달에 약 ${fmtPay(L.inc)} · 이 나라 보통 벌이의 ${ratio>=10?Math.round(ratio):ratio.toFixed(1)}배</div><div class="isub">${f.inf?'비공식 일자리 (계약서·사회보험이 없어요)':`공식 일자리 (${esc(I.pen||'연금')}·건강보험)`}</div>`:f.retired?`일을 내려놓았어요<div class="isub">연금·가족의 도움 한 달에 약 ${fmtPay(L.inc)}</div>`:(f.univ&&f.school?'대학생':'일을 쉬는 중');
    const places=['집']; if(a>=6) places.push('동네'); if(a>=13) places.push('큰길 건너'); if(a>=19) places.push('일터가 있는 곳'); if(canDrive()) places.push(`${L.C.landmark}(${C.veh.n})`);
    const wtxt=L.w>=.7?'넉넉한 편':L.w>=.45?'보통':L.w>=.25?'빠듯한 편':'어려운 편', lastM=L.money&&L.money.length?L.money[L.money.length-1]:null, adult=a>=19||f.univ;
    body=`<section class="icard"><h3>나</h3>${infoRow('이름',`<b>${esc(L.name)}</b> · ${a}살 (${stageOf(a)})`)}${infoRow('사는 곳',`${C.n} · ${esc(L.town||'')} (${SETN[L.set]})`)}${infoRow('태어난 가정',`${FAM[L.famI].n} · 지금 살림은 ${wtxt}${L.fam&&L.fam.rel?`<div class="isub">가족의 종교: ${esc(L.fam.rel)}</div>`:''}`)}${infoRow('학교',school)}${infoRow('하는 일',job)}</section>
      ${adult?`<section class="icard"><h3>돈</h3>${infoRow('가진 돈',`<b class="${L.cash<0?'neg':''}">${fmtWon(L.cash)}</b>${L.cash<0?' (빚)':''}`)}${infoRow('집',L.house?`${fmtWon(L.house)} · 모두 합하면 ${fmtWon(L.nw)}`:'아직 내 집이 없어요')}${lastM?infoRow(`지난 ${lastM.step>1?lastM.step+'년':'해'}`,`번 돈 ${fmtWon(lastM.inc)} · 쓴 돈 ${fmtWon(lastM.spend)}<div class="isub">이자 ${lastM.int>=0?'+':''}${fmtWon(lastM.int)}${lastM.ev?` · 큰일 ${lastM.ev>0?'+':''}${fmtWon(lastM.ev)}`:''}</div>`):''}${infoRow('빚 한도',`${fmtWon(L.debtLimit())}<div class="isub">이보다 빚이 많으면 큰돈이 드는 선택을 할 수 없어요</div>`)}${moneySvg(L)}</section>`:''}
      <section class="icard"><h3>나라와 제도</h3>${infoRow('병원비',`직접 내는 몫 약 ${I.oop}% (WHO)${I.hi?`<div class="isub">${esc(I.hi)}</div>`:''}`)}${infoRow('일자리',`비공식 일자리 약 ${I.inf}% (ILO) · ${retAgeOf(L)?`정년 ${retAgeOf(L)}세`:'정해진 정년 없음'}`)}${I.cs&&I.cs[0]&&(I.cs[2]===2||L.sex===0)?infoRow('군 복무',I.cs[0]>=24?Math.round(I.cs[0]/12)+'년':I.cs[0]+'개월'):''}${infoRow('갈 수 있는 곳',places.join(' → '))}<p class="isub">${esc(C.fact)}</p></section>
      <section class="icard"><h3>지금까지</h3>${infoRow('선택',`${L.n}번 · 뜻대로 안 된 일 ${L.fail||0}번 · 놓친 순간 ${L.miss}번`)}${G.room?infoRow('학급 방',esc(G.room)):''}${jobsTable(L)}</section>`; }
  else if(tab==='others'){ body=`<section class="icard"><h3>같은 1초에 태어난 사람들 <small>지금 ${a}살 무렵</small></h3>${L.comps&&L.comps.length?`<div class="plist">${L.comps.map(p=>`<div class="pcard"><b>${esc(p.n)}</b><span class="isub">${esc(p.cn)} · ${p.sex?'여':'남'}</span><p>${esc(L.compNow(p,a))}</p></div>`).join('')}</div>`:'<p class="isub">아직 없어요</p>'}</section>
      <section class="icard"><h3>친구와 이웃</h3>${infoRow('친구',P.friend?esc(P.friend.n):'—')}${L.f.pet?infoRow('반려동물',esc(L.f.pet.n)):''}${relBars(L,['friend','nb','coll'])}</section>`; }
  else if(tab==='fam'){ const fam=[], rel={mom:'엄마',dad:'아빠',gran:'할머니',sib:'동생',spouse:'배우자'}; PERSON_KEYS.forEach(k=>{ if(!L.spotOK(k)||k==='kid') return; fam.push(rel[k]&&P[k]?`${rel[k]} ${P[k].n}`:L.spotName(k)); }); L.kidsHome().forEach(k=>fam.push(`${k.sex?'딸':'아들'} ${k.n}`));
    const fs=f.widow&&P.spouse?`${esc(P.spouse.n)}님과는 ${f.widA}살에 사별했어요`:f.family?`${esc(P.spouse?P.spouse.n:'배우자')}님과 가정을 꾸렸어요${f.grandkid?' · 손주가 있어요':''}`:'아직 가정을 꾸리지 않았어요';
    body=`<section class="icard"><h3>함께 사는 사람</h3><p class="ibig">${fam.length?fam.map(esc).join(' · '):'혼자 살아요'}</p>${infoRow('가정',fs)}${L.kids.length?infoRow('아이',L.kids.map(k=>esc(k.given)).join(', ')):''}</section>
      ${L.fam?`<section class="icard"><h3>가족 한 사람 한 사람</h3><div class="plist">${L.famList().map(r=>`<div class="pcard"><b>${esc(r[0])}</b><span class="isub">${esc(r[1])}</span><p>${esc(r[2])}</p></div>`).join('')}</div></section>`:''}
      <section class="icard"><h3>가까운 정도 <small>친밀도 0~100</small></h3>${relBars(L)}<p class="isub">가족은 천천히, 친구와 동료는 연락이 없으면 빨리 멀어집니다. 함께하는 선택을 하면 가까워져요.</p></section>`; }
  else if(tab==='shape'){ const v=L.s, ov=radarOverlays(L,a), H=(L.hist||[]).filter(x=>x.a<a&&x.t!=null), prev=H.length?H[H.length-1]:null;
    body=`<section class="icard"><h3>삶의 모양 <small>꽉 찬 정오각형이 만점(100)</small></h3>${radarSVG(v,ov)}${radarLegend(ov)}
      <div class="axgrid">${AXES.map(k=>{ const d=prev?Math.round(v[k])-prev[k]:0; return `<div><span style="color:${AX_COL[k]}">${AX_N[k]}</span><b>${Math.round(v[k])}</b>${d?`<small class="${d>0?'up':'dn'}">${d>0?'▲':'▼'}${Math.abs(d)}</small>`:'<small>　</small>'}</div>`; }).join('')}</div>
      <p class="isub">직접 다가가서 고른 일은 삶의 모양을 키우고, 그냥 지나간 일은 조금만 키웁니다. 다섯 가지를 한꺼번에 키우기는 어려워요.</p></section>
      <section class="icard"><h3>나이에 따라</h3>${lineChartSVG(L)||'<p class="isub">한 해가 지나면 그래프가 생겨요</p>'}</section>
      <section class="icard"><h3>건강과 재산 <small>오각형 밖에 따로</small></h3>${resBars(L)}</section>`; }
  else if(tab==='trait'){ const top=L.topTrait(), tot=Object.values(L.tr).reduce((s,x)=>s+x,0);
    body=`<section class="icard"><h3>성향</h3><p class="ibig">${tot?`지금까지는 <b>'${TRAIT[top]}'</b>이 가장 많아요`:'아직 쌓인 것이 없어요'}</p>${traitPanel(L)}<p class="isub">어떤 성향으로 골랐는지가 쌓여, 이어지는 일의 확률을 조금씩 바꿉니다.</p></section>`; }
  else { const s=L.s, me=L.moneyEase(), ws=L.workSat(), tg=L.joyTarget(), parts=[['건강',s.h,.25],['곁의 사람들(관계)',s.r,.25],['돈 걱정 없음',me,.15],['일과 꿈',ws,.20],['겪어 본 것들(경험)',s.e,.15]];
    const JP=L.joyParts(), nm={n:'나라의 형편',g:'감사하는 마음',c:'함께 웃는 문화'};
    body=`<section class="icard"><h3>올해 행복을 만드는 것 <small>지금 행복 ${Math.round(s.j)}</small></h3>${parts.map(([n,v,w])=>`<div class="jrow"><span>${n}<small> ×${Math.round(w*100)}%</small></span><div class="rt"><i style="width:${Math.round(clamp(v,0,100))}%"></i></div><b>${Math.round(v)}</b></div>`).join('')}
      <p class="isub">이 다섯 가지를 합한 값(지금 ${Math.round(tg)})을 향해 행복이 해마다 조금씩 움직입니다. 큰 기쁨이나 슬픔은 한 번에 크게 바꾸기도 해요.</p></section>
      <section class="icard"><h3>그 밖에 영향을 주는 것</h3>${Object.keys(nm).map(k=>`<div class="happy"><span>${nm[k]}</span><div class="hbar">${barSvg(JP[k])}</div><span class="num">${JP[k]>=0?'+':''}${JP[k].toFixed(0)}</span></div>`).join('')}<p class="isub">돈만이 아니라 곁의 사람들, 작은 일에도 감사하는 마음, 함께 웃는 문화가 행복을 크게 바꿉니다.</p></section>`; }
  sheet(`<div class="ihead"><div class="place">내 정보</div><h2>${esc(L.name)} · ${a}살 · ${L.by+a}년</h2><nav class="itabs" role="tablist">${INFO_TABS.map(([k,n])=>`<button role="tab" data-t="${k}" class="${k===tab?'on':''}" aria-selected="${k===tab}">${n}</button>`).join('')}</nav></div><div class="ibody">${body}</div><button class="btn" id="btnOk">닫기</button>`,'info closable');
  $('btnOk').onclick=closeSheet; $('sheetBox').querySelectorAll('.itabs button').forEach(b=>b.onclick=()=>{ openInfo(b.dataset.t); });
  const on=$('sheetBox').querySelector('.itabs .on'); if(on) on.scrollIntoView({block:'nearest',inline:'center'}); }
function relBars(L,only){ const rel=Object.entries(L.rel||{}).filter(([k])=>!only||only.includes(k)).sort((a,b)=>b[1]-a[1]); if(!rel.length) return '<p class="isub">아직 없어요</p>';
  return `<div class="rels">${rel.map(([k,x])=>`<div class="rbar"><span class="rl">${REL_N[k]||k}</span><div class="rt"><i class="rel" style="width:${Math.round(x)}%"></i></div><span class="rv">${Math.round(x)}</span></div>`).join('')}</div>`; }
$('btnInfo').onclick=()=>openInfo('me');
// ---- 기억: 표 대신 카드
openMem=function(flt){ const L=G.life, all=L.mem.slice().reverse(), test={all:()=>true,big:m=>m.big,fam:m=>m.fam||/엄마|아빠|아내|남편|아들|딸|손주|동생|형|누나|언니|오빠|할머니|할아버지|가족/.test(m.t+(m.q||'')),pick:m=>!!m.q}[flt], list=all.filter(test).slice(0,80);
  const tab=(k,n)=>`<button data-f="${k}" class="${flt===k?'on':''}">${n}</button>`;
  sheet(`<div class="ihead"><div class="place">기억</div><h2>${esc(L.name)}의 기억</h2><nav class="itabs">${tab('all','전체')}${tab('big','큰 일')}${tab('pick','내가 고른 일')}${tab('fam','가족')}</nav></div>
    <p class="isub">선택 ${L.n}번 · 놓친 순간 ${L.miss}번 · 최근 기억부터 ${list.length}개 · <span class="scmark">장면</span> 표시가 있는 기억을 누르면 그 장면을 다시 봅니다</p>
    <div class="mlist">${list.length?list.map((m,i)=>`<article class="mcard${m.big?' big':''}${m.sc?' sc':''}" data-i="${i}"><div class="mage">${m.a}살<small>${L.by+m.a}년</small></div><div class="mtx">${m.q?`<p class="mq">${esc(m.q)}</p>`:''}${m.l?`<p class="ml">→ ${esc(m.l)}</p>`:''}<p class="mr">${esc(memT(m))}${m.rp>1?` <span class="rp">×${m.rp}</span>`:''}</p>${m.f||m.sc?`<div class="mtags">${m.f?'<span class="tag">뜻대로 안 됨</span>':''}${m.sc?'<span class="scmark">장면</span>':''}</div>`:''}</div></article>`).join(''):'<p class="isub">아직 없어요</p>'}</div>
    <button class="btn" id="btnOk">닫기</button>`,'mem closable');
  $('btnOk').onclick=closeSheet;
  $('sheetBox').querySelectorAll('.itabs button').forEach(b=>b.onclick=()=>openMem(b.dataset.f));
  $('sheetBox').querySelector('.mlist').onclick=e=>{ const c=e.target.closest('.mcard.sc'); if(!c) return; const m=list[+c.dataset.i]; popup(`${m.a}살의 기억`,memT(m),null,()=>openMem(flt),'',m.sc,m.q?`${m.q}${m.l?' → '+m.l:''}`:null); }; };
$('btnMem').onclick=()=>openMem('all');

