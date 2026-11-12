/* ========== 시작 ========== */
(async function(){ const d=await Store.resume(); if(d){ G.data=d; openHub(); } })();
const _show=show; show=function(n){ _show(n); if(n==='login') pixLoop('titleCv','title'); };
pixLoop('titleCv','title');

// 교사용 기록에 남길 한 사람의 삶 (글자만 저장: 다시 그릴 때는 모두 이스케이프한다)
function lifeRecord(L,o){ const a=L.lifespan, cz=causeOf(L), by=L.by||2026; let rows=[];
  try{ const doc=new DOMParser().parseFromString(lifeStory(L).replace(/<br\s*\/?>/gi,' · ').replace(/<\/(li|p|div|span|b)>/gi,'$& '),'text/html'); const dts=[...doc.querySelectorAll('dt')]; rows=dts.map(dt=>[dt.textContent.trim(),(dt.nextElementSibling?dt.nextElementSibling.textContent:'').replace(/\s+/g,' ').trim()]).filter(r=>r[0]&&r[1]); }catch(e){}
  rows.splice(Math.min(2,rows.length),0,['사인',cz.n],['향년',`${a}세 (${L.C.n} 기대수명 약 ${L.C.le}세)`]);
  const big=L.mem.filter(m=>m.big&&m.t), pick=[]; const n=Math.min(14,big.length); for(let i=0;i<n;i++) pick.push(big[Math.floor(i*big.length/n)]);
  // 오각형이 가장 넓었던 때, 나이에 따른 흐름(최대 24점), 평균 행복, 돈
  const H=(L.hist||[]).filter(h=>h.t!=null), st=Math.max(1,Math.ceil(H.length/24)), hs=H.filter((h,i)=>i%st===0||i===H.length-1).map(h=>[h.a,h.j,h.k,h.t,h.e,h.r,h.h]), pk=peakOf(L);
  const avgJ=H.length?Math.round(H.reduce((x,h)=>x+(h.j||0),0)/H.length):null;
  return {name:L.name,c:L.c,set:L.set,famI:L.famI,age:a,by,top:o.top,n:L.n,town:L.town,nw:Math.round(L.nw||0),kids:o.kids,title:o.title,epi:o.epi,cause:cz.n,sex:L.sex,
    peak:pk?[pk.a,pk.j,pk.k,pk.t,pk.e,pk.r,pk.h]:null,hist:hs,avgJ,earned:Math.round(L.earned||0),maxNW:Math.round(L.maxNW||0),le:L.C.le,
    rows:rows.slice(0,24).map(r=>[r[0].slice(0,30),r[1].slice(0,200)]),mem:pick.map(m=>[m.a,String(m.t).replace(/\s+/g,' ').slice(0,140)]),ans:o.ans||[],notes:o.notes||[],sum:o.sum||'',top3:o.top3&&o.top3.length?o.top3:null,fav:o.fav!=null?o.fav:null,t:Date.now()}; }

// 마친 삶 하나를 자세히: 숫자 요약 · 오각형 · 나이에 따른 흐름 · 이야기 표 · 기억에 남은 일 · 남긴 말 (교사용 기록과 내 기록에서 함께 쓴다)
function lifeDetailHTML(l){
  const C=COUNTRIES[l.c||'KR']||COUNTRIES.KR, mk=x=>x&&{a:x[0],j:x[1],k:x[2],t:x[3],e:x[4],r:x[5],h:x[6]};
  const H=(l.hist||[]).map(mk), pk=mk(l.peak), nw=l.nw||0;
  const kp=[[`${l.age}세`,`향년 · ${C.n} 기대수명 약 ${l.le||C.le}세`],[l.cause||'—','삶을 마친 이유'],[`${l.n||0}번`,'직접·자동으로 한 선택'],[fmtWon(nw),nw<0?'남긴 빚':'남긴 재산']];
  if(l.avgJ!=null) kp.push([`${l.avgJ}점`,'평생 평균 행복']); if(l.earned) kp.push([fmtWon(l.earned),'평생 번 돈']); if(l.maxNW&&l.maxNW>nw) kp.push([fmtWon(l.maxNW),'재산이 가장 많았을 때']);
  if(l.kids) kp.push([`${l.kids}명`,'아이']); if(l.top&&TRAIT[l.top]) kp.push([TRAIT[l.top],'가장 많이 고른 성향']);
  let g=''; if(pk){ const v={}; AXES.forEach(k=>v[k]=pk[k]); g+=`<div class="dbox"><p class="rcap">오각형이 가장 넓었던 때 · ${pk.a}살 무렵</p>${radarSVG(v,[])}</div>`; }
  if(H.length>1){ try{ g+=`<div class="dbox"><p class="rcap">나이에 따라 달라진 것들</p>${lineChartSVG({hist:H},pk?pk.a:null)}</div>`; }catch(e){} }
  return `<div class="ldt"><div class="kpi">${kp.map(c=>`<div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('')}</div>${g?`<div class="gr">${g}</div>`:''}
    ${(l.rows||[]).length?`<h4>이 사람의 이야기</h4><dl class="whoami">${l.rows.map(r=>`<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>`:''}
    ${(l.mem||[]).length?`<h4>기억에 남은 일</h4><ul class="small" style="padding-left:18px;margin:0">${l.mem.map(m=>`<li>${m[0]}살 · ${esc(m[1])}</li>`).join('')}</ul>`:''}
    ${(l.notes||[]).length?`<h4>삶의 중간에 남긴 말</h4><ul class="small" style="padding-left:18px;margin:0">${l.notes.map(n=>`<li>${n[0]}살 · ${esc(n[1])}</li>`).join('')}</ul>`:''}
    ${(l.ans||[]).length?`<h4>마지막 질문의 답</h4><ul class="small" style="padding-left:18px;margin:0">${l.ans.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
    <q>${esc(l.epi?'“'+l.epi+'”':'남긴 말 없음')}</q></div>`; }
function lifeSummaryHTML(l){ const C=COUNTRIES[l.c||'KR']||COUNTRIES.KR; return `<b>${esc(l.title||'제목 없는 삶')}</b> · ${esc(l.name)} · ${l.age}세 · ${esc(C.n)} ${SETN[l.set]||''}${l.cause?' · '+esc(l.cause):''}`; }

