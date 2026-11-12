/* ---------- [3 엔딩·기록] 인생 기록: 위쪽 메뉴로 넘겨 본다 ---------- */
const REC_TABS=[['sum','한눈에'],['shape','삶의 모양'],['life','돈과 행복'],['story','이야기'],['mem','기억에 남은 일'],['words','남긴 말']];
function lifeTabs(l,o){ o=o||{}; const C=COUNTRIES[l.c||'KR']||COUNTRIES.KR, mk=x=>x&&{a:x[0],j:x[1],k:x[2],t:x[3],e:x[4],r:x[5],h:x[6]}, H=(l.hist||[]).map(mk), pk=mk(l.peak), nw=l.nw||0;
  const kp=[[`${l.age}세`,`향년 · ${C.n} 기대수명 약 ${l.le||C.le}세`],[l.cause||'—','삶을 마친 이유'],[`${l.n||0}번`,'직접·자동으로 한 선택'],[fmtWon(nw),nw<0?'남긴 빚':'남긴 재산']];
  if(l.avgJ!=null) kp.push([`${l.avgJ}점`,'평생 평균 행복']); if(l.earned) kp.push([fmtWon(l.earned),'평생 번 돈']); if(l.maxNW&&l.maxNW>nw) kp.push([fmtWon(l.maxNW),'재산이 가장 많았을 때']);
  if(l.kids) kp.push([`${l.kids}명`,'아이']); if(l.top&&TRAIT[l.top]) kp.push([TRAIT[l.top],'가장 많이 고른 성향']);
  const none=t=>`<p class="rempty">${t}</p>`, li=(arr,f)=>`<ul class="rl">${arr.map(f).join('')}</ul>`;
  let shape=''; if(pk){ const v={}; AXES.forEach(k=>v[k]=pk[k]); shape+=`<section class="icard"><h3>오각형이 가장 넓었던 때 <small>${pk.a}살 무렵</small></h3>${radarSVG(v,[])}</section>`; }
  if(H.length>1){ try{ shape+=`<section class="icard"><h3>나이에 따라 달라진 것들</h3>${lineChartSVG({hist:H},pk?pk.a:null)}</section>`; }catch(e){} }
  const words=[(l.ans||[]).length?`<section class="icard"><h3>마지막 질문의 답</h3>${li(l.ans,x=>`<li>${esc(x)}</li>`)}</section>`:'',
    (l.notes||[]).length?`<section class="icard"><h3>삶의 중간에 남긴 말</h3>${li(l.notes,x=>`<li>${x[0]}살 · ${esc(x[1])}</li>`)}</section>`:'',
    `<section class="icard"><h3>남기는 한마디</h3><q>${esc(l.epi?'“'+l.epi+'”':'남긴 말 없음')}</q></section>`].join('');
  const panes={card:o.card||'',
    sum:`<section class="icard"><h3>${esc(l.title||'제목 없는 삶')} <small>${esc(l.name||'')} · ${esc(C.n)} ${SETN[l.set]||''}</small></h3><div class="kpi">${kp.map(c=>`<div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('')}</div></section>`,
    shape:shape||none('그래프로 볼 만큼 긴 기록이 없어요.'),
    life:(()=>{ const HN={m:'살림(돈)',n:'나라의 형편',r:'곁의 사람들',g:'감사하는 마음',c:'함께 웃는 문화',h:'건강'}, f=l.hpf, mx=f?Math.max(1,...Object.values(f).map(Math.abs)):1;
      const mk=[[fmtWon(l.earned||0),'평생 번 돈 (배우자 포함)'],[fmtWon(l.maxNW||0),'재산이 가장 많았을 때'],[fmtWon(nw),nw<0?'남긴 빚':'남긴 재산 (집 포함)']].concat(l.avgJ!=null?[[`${l.avgJ}점`,'평생 평균 행복 (100점 만점)']]:[]);
      return (l.earned||l.maxNW?`<section class="icard"><h3>돈</h3><div class="kpi">${mk.map(c=>`<div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('')}</div><p class="small">그 나라 돈을 한국 돈으로 바꾼 근사치입니다.</p></section>`:'')
        +(f?`<section class="icard"><h3>행복을 더하거나 깎은 것 <small>한 해 평균</small></h3>${Object.keys(HN).map(k=>`<div class="hbar"><span>${HN[k]}</span><i style="width:${Math.max(2,Math.abs(f[k])/mx*100)}%;background:${f[k]>=0?'#8FD3B0':'#E8A0A0'}"></i><b>${f[k]>0?'+':''}${f[k]}</b></div>`).join('')}<p class="small">무엇이 이 삶의 행복을 받쳐 주었고 무엇이 깎았는지 견주어 보세요.</p></section>`:''); })(),
    story:(l.rows||[]).length?`<section class="icard"><dl class="whoami">${l.rows.map(r=>`<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl></section>`:none('기록된 이야기가 없어요.'),
    mem:(l.mem||[]).length?`<section class="icard">${li(l.mem,m=>`<li><b>${m[0]}살</b> · ${esc(m[1])}</li>`)}</section>`:none('기억에 남은 큰 일이 없어요.'),
    words};
  const tabs=(o.card?[['card','기록 카드']]:[]).concat(REC_TABS);
  return `<div class="ldt rtabs-wrap"><nav class="itabs rtabs" role="tablist">${tabs.map(([k,n],i)=>`<button type="button" role="tab" data-r="${k}" class="${i?'':'on'}" aria-selected="${!i}">${n}</button>`).join('')}</nav>
    ${tabs.map(([k],i)=>`<div class="rpane" data-r="${k}"${i?' hidden':''}>${panes[k]}${i<tabs.length-1?`<button type="button" class="btn rnext" data-go="${tabs[i+1][0]}">다음: ${tabs[i+1][1]} ▶</button>`:''}</div>`).join('')}</div>`; }
function recTab(w,k){ w.querySelectorAll(':scope>.rtabs button').forEach(x=>{ const on=x.dataset.r===k; x.classList.toggle('on',on); x.setAttribute('aria-selected',on); if(on) x.scrollIntoView({block:'nearest',inline:'center'}); });
  w.querySelectorAll(':scope>.rpane').forEach(p=>p.hidden=p.dataset.r!==k); }
document.addEventListener('click',e=>{ const b=e.target&&e.target.closest?e.target.closest('.rtabs button, .rpane .rnext'):null; if(!b) return; const w=b.closest('.rtabs-wrap'); if(!w) return; e.preventDefault(); recTab(w,b.dataset.r||b.dataset.go); });
// '지나온 삶'과 교사용 기록에서도 같은 메뉴로
lifeDetailHTML=function(l){ return lifeTabs(l); };

