/* ========== 능력치 2판 화면: 오각형 · 건강/재산 막대 · 제한된 선택지 · 엔딩의 삶의 모양 ========== */
const AX_COL={j:'#E2703A',k:'#3870D0',t:'#7A5AC8',e:'#2F8F7A',r:'#C2577A'};
const OV_COL={20:'#58A6D8',40:'#8E7CC3',60:'#C9A227'};
// 정오각형: 행복이 맨 위. 만점(100) 외곽선과 지금 모양을 함께, 숫자도 꼭짓점에
function radarSVG(v,ov,o){ o=o||{}; const W=340, H=300, cx=170, cy=158, R=104, n=AXES.length, ang=i=>-Math.PI/2+i*2*Math.PI/n, pt=(i,val)=>[cx+Math.cos(ang(i))*R*val/100,cy+Math.sin(ang(i))*R*val/100];
  const poly=vals=>AXES.map((k,i)=>pt(i,clamp(vals[k]||0,0,100)).map(x=>x.toFixed(1)).join(',')).join(' ');
  let g=''; [25,50,75].forEach(l=>g+=`<polygon points="${poly(Object.fromEntries(AXES.map(k=>[k,l])))}" class="rg"/>`);
  g+=`<polygon points="${poly(Object.fromEntries(AXES.map(k=>[k,100])))}" class="rfull"/>`;
  AXES.forEach((k,i)=>{ const p=pt(i,100); g+=`<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" class="rax"/>`; });
  (ov||[]).forEach(x=>{ g+=`<polygon points="${poly(x.v)}" fill="none" stroke="${OV_COL[x.a]||'#7C8A96'}" stroke-width="2" stroke-dasharray="5 4"/>`; });
  g+=`<polygon points="${poly(v)}" class="rnow"/>`;
  AXES.forEach((k,i)=>{ const p=pt(i,clamp(v[k]||0,0,100)); g+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.6" fill="${AX_COL[k]}"/>`;
    const q=pt(i,126), anc=Math.abs(q[0]-cx)<8?'middle':q[0]<cx?'end':'start';
    g+=`<text x="${q[0].toFixed(1)}" y="${(q[1]-2).toFixed(1)}" text-anchor="${anc}" class="rlab">${AX_N[k]}</text><text x="${q[0].toFixed(1)}" y="${(q[1]+15).toFixed(1)}" text-anchor="${anc}" class="rnum" fill="${AX_COL[k]}">${Math.round(v[k]||0)}</text>`; });
  return `<svg class="radar" viewBox="0 0 ${W} ${H}" role="img" aria-label="${AXES.map(k=>AX_N[k]+' '+Math.round(v[k]||0)).join(', ')}">${g}</svg>`; }
function histAt(L,a){ const H=L.hist||[]; let best=null; H.forEach(h=>{ if(h.t==null) return; if(Math.abs(h.a-a)<=1&&(!best||Math.abs(h.a-a)<Math.abs(best.a-a))) best=h; }); return best; }
function radarOverlays(L,upto){ return [20,40,60].filter(a=>a<upto-1).map(a=>({a,v:histAt(L,a)})).filter(x=>x.v); }
function radarLegend(ov,now){ return ov.length?`<div class="lgd rlgd"><span><i style="background:#E2703A"></i>${now||'지금'}</span>${ov.map(x=>`<span><i class="dash" style="border-color:${OV_COL[x.a]}"></i>${x.a}살 무렵</span>`).join('')}</div>`:''; }
// 건강·재산: 오각형과 따로
function healthState(h){ return h>=70?['정상','ok']:h>=40?['약함','mid']:h>0?['위험','bad']:['—','bad']; }
function resBars(L,compact){ const h=Math.round(L.s.h), hs=healthState(h), a=L.age, C=L.C, own=a>=19||L.f.univ||L.f.job;
  const hb=`<div class="rbar"><span class="rl">건강</span><div class="rt"><i class="${hs[1]}" style="width:${h}%"></i>${compact?'':`<em style="left:${hMaxAt(a)}%" title="이 나이의 최대치"></em>`}</div><span class="rv"><b>${h}</b>${compact?'':` <small>${hs[0]}</small>`}</span></div>`;
  let mb; if(!own){ const w=L.w; mb=`<div class="rbar"><span class="rl">살림</span><div class="rt"><i class="money" style="width:${Math.round(clamp(w,0,1)*100)}%"></i></div><span class="rv"><small>${w>=.7?'넉넉':w>=.45?'보통':w>=.25?'빠듯':'어려움'}</small></span></div>`; }
  else { const sp=L.spendable(), lim=L.debtLimit(), debt=L.cash<0?-L.cash:0, fill=sp>0?clamp(Math.log2(1+sp/C.med)/Math.log2(1+60),0,1):0, df=debt>0?clamp(debt/Math.max(lim,1),0,1):0;
    mb=`<div class="rbar"><span class="rl">재산</span><div class="rt">${df?`<i class="debt" style="width:${Math.round(df*100)}%"></i>`:`<i class="money" style="width:${Math.max(2,Math.round(fill*100))}%"></i>`}</div><span class="rv"><b class="${L.cash<0?'neg':''}">${fmtWon(L.cash)}</b>${compact?'':`<small>${df?` 빚 · 한도의 ${Math.round(df*100)}%`:` · 쓸 수 있는 돈 ${fmtWon(Math.max(0,sp))}`}</small>`}</span></div>`; }
  return `<div class="res${compact?' cmp':''}">${hb}${mb}</div>`; }
// 내 정보: 막대·꺾은선 대신 오각형
statPanel=function(L){ const v=L.s, ov=radarOverlays(L,L.age), H=(L.hist||[]).filter(x=>x.a<L.age&&x.t!=null), prev=H.length?H[H.length-1]:null;
  const rel=Object.entries(L.rel||{}).sort((a,b)=>b[1]-a[1]).slice(0,6);
  return `<div class="chart"><h3>삶의 모양 <span class="sub small">(0~100 · 꽉 찬 정오각형이 만점)</span></h3>${radarSVG(v,ov)}${radarLegend(ov)}
    <div class="axrow">${AXES.map(k=>{ const d=prev?Math.round(v[k])-prev[k]:0; return `<span><b style="color:${AX_COL[k]}">${AX_N[k]}</b> ${Math.round(v[k])}${d?` <small class="${d>0?'up':'dn'}">${d>0?'▲':'▼'}${Math.abs(d)}</small>`:''}</span>`; }).join('')}</div>
    <p class="small sub">행복은 건강·관계·돈 걱정·일과 꿈·경험에서 해마다 조금씩 만들어집니다. 다섯 가지를 한꺼번에 키우기는 어려워요. 시간과 힘은 한정되어 있으니까요.</p>
    ${lineChartSVG(L)}
    <h3>건강과 재산</h3>${resBars(L)}
    ${rel.length?`<h3>가까운 사람들 <span class="sub small">(친밀도)</span></h3><div class="rels">${rel.map(([k,x])=>`<div class="rbar"><span class="rl">${REL_N[k]||k}</span><div class="rt"><i class="rel" style="width:${Math.round(x)}%"></i></div><span class="rv">${Math.round(x)}</span></div>`).join('')}</div><p class="small sub">가족은 천천히, 친구와 동료는 연락이 없으면 빨리 멀어집니다.</p>`:''}</div>`; };
statLine=()=> '';
// 선택지: 지금 고를 수 없는 것은 흐리게 두고 이유를, 돈이 드는 것은 드는 돈을 적는다
function gateUI(kind,list){ const L=G.life, box=$('sheetBox'); if(!L||!box||!L.optBlocked||!list) return; const btns=[...box.querySelectorAll('.opts button[data-i]')];
  const fxOf=o=>kind==='m'?o.okFx:kind==='ch'?(o.ok&&o.ok[1]):o.fx, why=btns.map(b=>L.optBlocked(list[+b.dataset.i],kind)), all=why.every(Boolean);
  let n=0; btns.forEach((b,i)=>{ const o=list[+b.dataset.i]; if(!o) return; const c=L.age>=16?L.optCost(fxOf(o)):0;
    if(c>0) b.insertAdjacentHTML('beforeend',`<small class="cost">드는 돈 약 ${fmtWon(c)}</small>`);
    if(why[i]&&!all){ b.disabled=true; b.classList.add('off'); b.insertAdjacentHTML('beforeend',`<small class="why">${esc(why[i])}</small>`); n++; } });
  if(n) L.limN=(L.limN||0)+1; }
onOpts=function(fn){ $('sheetBox').querySelector('.opts').onclick=e=>{ const b=e.target.closest('button'); if(b&&!b.disabled) fn(+b.dataset.i); }; };
// 게임 화면 위쪽: 건강·재산 막대
(function(){ const _rh=renderHud; renderHud=function(){ _rh.apply(this,arguments); const L=G.life; if(!L) return; let el=$('hRes');
  if(!el){ const hl=document.querySelector('#hud .hinfo .hl'); if(!hl) return; el=document.createElement('div'); el.id='hRes'; hl.insertAdjacentElement('afterend',el); }
  el.innerHTML=resBars(L,true); const mo=$('hMoney'); if(mo) mo.hidden=true; }; })();
// 엔딩: 삶의 모양 (좋고 나쁨 없이 모양만 설명)
function shapeLine(L,v){ const ks=AXES.slice().sort((a,b)=>v[b]-v[a]), top=ks[0], low=ks[ks.length-1], sp=v[top]-v[low];
  const say={j:'스스로 느끼는 만족',k:'배움',t:'손에 익힌 기술',e:'여러 가지를 겪어 본 경험',r:'곁의 사람들과의 관계'};
  return sp<12?`${josa(L.name,'은','는')} 다섯 가지를 고르게 키운, 둥근 모양의 삶을 살았습니다.`:`${josa(L.name,'이','가')} 가장 많이 키운 것은 ${say[top]}이었습니다. 오각형은 ${AX_N[top]} 쪽으로 가장 길게 뻗어 있습니다.`; }
// 오각형의 넓이(다섯 축 값이 만드는 정오각형 모양의 면적)가 가장 컸던 해
function pentArea(h){ const v=AXES.map(k=>h[k]||0); let s=0; for(let i=0;i<5;i++) s+=v[i]*v[(i+1)%5]; return s*.5*Math.sin(2*Math.PI/5); }
function peakOf(L){ const H=(L.hist||[]).filter(h=>h.t!=null); let pk=null; H.forEach(h=>{ if(!pk||pentArea(h)>pentArea(pk)) pk=h; }); return pk; }
// 나이에 따른 다섯 축과 건강의 꺾은선
function lineChartSVG(L,mark){ const H=(L.hist||[]).filter(h=>h.t!=null); if(H.length<2) return ''; const W=640, Hh=250, pl=34, pr=12, pt=12, pb=28, A0=H[0].a, A1=Math.max(H[H.length-1].a,A0+1);
  const X=a=>pl+(a-A0)/(A1-A0)*(W-pl-pr), Y=v=>pt+(100-clamp(v,0,100))/100*(Hh-pt-pb);
  let g=''; [0,25,50,75,100].forEach(v=>{ g+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" class="lgrid"/><text x="${pl-6}" y="${Y(v)+4}" text-anchor="end" class="ltick">${v}</text>`; });
  const step=A1-A0>60?20:10; for(let a=Math.ceil(A0/step)*step;a<=A1;a+=step) g+=`<text x="${X(a)}" y="${Hh-8}" text-anchor="middle" class="ltick">${a}살</text>`;
  if(mark!=null) g+=`<line x1="${X(mark)}" x2="${X(mark)}" y1="${pt}" y2="${Hh-pb}" class="lmark"/><text x="${X(mark)+4}" y="${pt+11}" class="ltick lmk">가장 넓던 때</text>`;
  const ser=[...AXES.map(k=>[k,AX_COL[k],'']),['h','#5A8F4A','5 4']];
  ser.forEach(([k,c,d])=>{ g+=`<polyline fill="none" stroke="${c}" stroke-width="${k==='h'?2:2.4}" ${d?`stroke-dasharray="${d}"`:''} stroke-linejoin="round" points="${H.map(h=>`${X(h.a).toFixed(1)},${Y(h[k]).toFixed(1)}`).join(' ')}"/>`; });
  return `<svg class="lchart2" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="나이에 따른 행복·지식·기술·경험·관계·건강의 변화">${g}</svg><div class="lgd">${ser.map(([k,c,d])=>`<span><i style="background:${c}${d?';opacity:.7':''}"></i>${k==='h'?'건강':AX_N[k]}</span>`).join('')}</div>`; }
function shapeHTML(L){ const pk=peakOf(L)||L.s, v={}; AXES.forEach(k=>v[k]=pk[k]); const H=(L.hist||[]).filter(h=>h.t!=null), last=H.filter(h=>h.a<(L.lifespan||L.age)).slice(-1)[0];
  const ov=last&&pk&&last.a!==pk.a?[{a:'last',v:last}]:[];
  const sudden=last&&last.h>=60, cause=typeof causeOf==='function'?causeOf(L).n:'';
  return `<p class="big">${esc(shapeLine(L,v))}</p>
    <div class="rbox"><p class="rcap">오각형이 가장 넓었던 때 · ${pk.a!=null?pk.a+'살 무렵':''}</p>${radarSVG(v,ov.map(x=>({a:'last',v:x.v})))}<div class="lgd rlgd"><span><i style="background:#E2703A"></i>가장 넓었던 때${pk.a!=null?` (${pk.a}살)`:''}</span>${ov.length?`<span><i class="dash" style="border-color:#7C8A96"></i>마지막 해 (${last.a}살)</span>`:''}</div></div>
    <div class="rbox"><p class="rcap">나이에 따라 달라진 것들</p>${lineChartSVG(L,pk.a)}</div>
    <p class="soft">${sudden?`건강이 ${last.h}로 나쁘지 않았지만, 삶은 ${cause?esc(cause)+'(으)로 ':''}갑자기 끝났습니다. 건강이 좋아도 사고나 병은 예고 없이 찾아옵니다.`:'건강은 삶을 이어 가는 힘, 재산은 삶을 버티는 자원이라 오각형 밖에 따로 둡니다. 마지막 해 건강 0은 삶이 끝난 뒤의 표시입니다.'}</p>${resBars(Object.assign(Object.create(Object.getPrototypeOf(L)),L,{s:Object.assign({},L.s,{h:0})}))}
    <p class="note">오각형이 크다고 더 좋은 삶은 아닙니다. 모양이 저마다 다를 뿐입니다. 직접 고르며 산 해에는 오각형이 커지고, 그냥 지나간 해에는 조금만 자랍니다.${L.limN?` 살면서 돈이나 건강 때문에 고를 수 없던 선택이 ${L.limN}번 있었습니다.`:''}</p>`; }
