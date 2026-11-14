/* [3 엔딩·기록] 41-start.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

// 교사용 기록에 남길 한 사람의 삶 (글자만 저장: 다시 그릴 때는 모두 이스케이프한다)
function lifeRecord(L,o){ const a=L.lifespan, cz=causeOf(L), by=L.by||2026; let rows=[];
  try{ const doc=new DOMParser().parseFromString(lifeStory(L).replace(/<br\s*\/?>/gi,' · ').replace(/<\/(li|p|div|span|b)>/gi,'$& '),'text/html'); const dts=[...doc.querySelectorAll('dt')]; rows=dts.map(dt=>[dt.textContent.trim(),(dt.nextElementSibling?dt.nextElementSibling.textContent:'').replace(/\s+/g,' ').trim()]).filter(r=>r[0]&&r[1]); }catch(e){}
  rows.splice(Math.min(2,rows.length),0,['사인',cz.n],['향년',`${a}세 (${L.C.n} 기대수명 약 ${L.C.le}세)`]);
  const big=L.mem.filter(m=>m.big&&m.t), pick=[]; const n=Math.min(14,big.length); for(let i=0;i<n;i++) pick.push(big[Math.floor(i*big.length/n)]);
  // 삶의 모양이 가장 넓었던 때, 나이에 따른 흐름(최대 24점), 평균 행복, 돈
  const H=(L.hist||[]).filter(h=>h.t!=null), st=Math.max(1,Math.ceil(H.length/24)), hs=H.filter((h,i)=>i%st===0||i===H.length-1).map(h=>[h.a,h.j,h.k,h.t,h.e,h.r,h.h,h.m]), pk=peakOf(L);
  const avgJ=H.length?Math.round(H.reduce((x,h)=>x+(h.j||0),0)/H.length):null;
  return {name:L.name,c:L.c,set:L.set,famI:L.famI,age:a,by,top:o.top,n:L.n,town:L.town,nw:Math.round(L.nw||0),kids:o.kids,title:o.title,epi:o.epi,cause:cz.n,sex:L.sex,
    peak:pk?[pk.a,pk.j,pk.k,pk.t,pk.e,pk.r,pk.h,pk.m]:null,val:L.val&&L.val.p||null,hist:hs,avgJ,earned:Math.round(L.earned||0),maxNW:Math.round(L.maxNW||0),le:L.C.le,
    rows:rows.slice(0,24).map(r=>[r[0].slice(0,30),r[1].slice(0,200)]),mem:pick.map(m=>[m.a,String(m.t).replace(/\s+/g,' ').slice(0,140)]),ans:o.ans||[],notes:o.notes||[],sum:o.sum||'',hpf:L.hp?(()=>{ const hp=L.hp, n=Math.max(1,hp.cnt||1), r={}; ['m','n','r','g','c','h'].forEach(k=>r[k]=Math.round((hp[k]||0)/n)); return r; })():null,top3:o.top3&&o.top3.length?o.top3:null,fav:o.fav!=null?o.fav:null,t:Date.now()}; }

// 마친 삶 하나를 자세히: 숫자 요약 · 오각형 · 나이에 따른 흐름 · 이야기 표 · 기억에 남은 일 · 남긴 말 (교사용 기록과 내 기록에서 함께 쓴다)

