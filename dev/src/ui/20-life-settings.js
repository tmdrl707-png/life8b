/* ========== 이번 삶의 설정 (빠르기 · 한 해 돌아보기 · 멈춤 질문 · 이별 장면) ========== */
const PACE_PICKS={short:7,normal:10};   // 한 해(어른은 두 해)에 고르는 일의 평균 수 (자동 진행 200번으로 잰 값)
G.opts=Object.assign({pace:'normal',yl:60,card:1,ask:0,soft:1,prob:1,read:1},ls('life8b_opts')||{});   // 중학생 수업: 무거운 장면은 처음부터 '짧고 담담하게'
const secOf=L=>L&&L.yl?L.yl:L&&L.pace==='short'?35:CFG.PERIOD_SEC;   // 한 해(어른은 두 해)의 길이(초): 시작할 때 고른 값
// 100살까지 산다면 걸리는 시간 (어린 시절 19번 + 어른은 두 해씩 41번 = 60번)
function lifeTimeText(yl){ const m=Math.round(60*yl/60), h=Math.floor(m/60), mm=m%60; return h?`${h}시간${mm?' '+mm+'분':''}`:`${m}분`; }
// 기대수명까지 사는 데 드는 대략의 시간(분): 한 해의 길이 + 창을 읽고 고르는 시간 (자동 진행으로 잰 평균 선택 수 × 약 4초)
function paceMin(L,pace){ const le=L.C.le, per=Math.min(19,le)+Math.max(0,Math.ceil((le-19)/2)), sec=pace==='short'?35:CFG.PERIOD_SEC, pick=pace==='short'?PACE_PICKS.short:PACE_PICKS.normal; return Math.round(per*(sec+pick*4)/60/5)*5; }
function renderBSet(){ const o=G.opts, L=G.life, seg=(k,arr)=>`<div class="seg" data-o="${k}">${arr.map(([v,t])=>`<button data-v="${v}" class="${String(o[k])===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  $('bSet').innerHTML=`<h3>이번 삶의 설정</h3>
    <div class="stack-s"><b>시간의 빠르기</b>${seg('yl',[[35,'한 해 35초'],[60,'한 해 1분'],[120,'한 해 2분'],[300,'한 해 5분']])}<p class="small sub">100살까지 산다면 <b>${lifeTimeText(o.yl||60)}</b>이 걸려요 (어른이 되면 한 번에 두 해씩 흘러요). 선택을 고르는 동안에도 시간은 흐르고, 오래 고르지 않으면 저절로 정해져요.${(o.yl||60)<=35?' 한 해 35초는 달마다 일어나는 일과 큰 사건이 절반입니다.':''} '저장하기'를 누르면 다음 시간에 이어서 살 수 있어요.</p></div>
    <div class="stack-s"><b>한 해를 돌아보는 카드</b>${seg('card',[[1,'켜기'],[0,'끄기']])}<p class="small sub">해가 바뀔 때 지난해의 한 장면과 이 나라의 숫자 한 가지를 보여 줍니다.</p></div>
    <div class="stack-s"><b>무거운 장면 (가족과의 이별 · 큰 병 · 분쟁)</b>${seg('soft',[[0,'그대로 보기'],[1,'짧고 담담하게']])}<p class="small sub">'짧고 담담하게'를 고르면 가족과의 이별은 짧은 알림으로, 큰 병과 분쟁은 그림 없이 글로만 보여 줍니다. 일어나는 일 자체는 실제 통계 그대로입니다.</p></div>
    <div class="stack-s"><b>선택지에 '될 가능성' 보여 주기</b>${seg('prob',[[0,'보이지 않기'],[1,'큰 일만 높음·보통·낮음'],[2,'모두 숫자로']])}<p class="small sub">숫자가 보이면 '가장 높은 숫자 고르기'가 되기 쉬워요. 기본은 큰 갈림길과 큰 사건에서만 높음·보통·낮음으로 보여 줍니다.</p></div>
    <div class="stack-s"><b>글이 떠 있는 시간</b>${seg('read',[[1,'보통'],[1.8,'길게 (천천히 읽기)']])}<p class="small sub">잠깐 나타났다 사라지는 글을 더 오래 보여 줍니다. 살아가는 중에는 위쪽의 '저장하기'로 저장하고 쉬었다가 이어서 할 수 있어요.</p></div>
    ${!G.teacher&&G.data&&G.data.room?`<p class="small sub notice">지금 '${esc(G.data.room)}' 반에 들어가 있어요. 선생님이 반 설정을 정해 두었다면 그 설정이 먼저 적용됩니다.</p>`:''}`; }
$('bSet').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; const sg=b.closest('.seg'); if(!sg) return; const k=sg.dataset.o; G.opts[k]=k==='pace'?b.dataset.v:+b.dataset.v; if(G.life&&G.life.opt&&k==='soft') G.life.opt.soft=G.opts.soft; ls('life8b_opts',G.opts); renderBSet(); };
// 지금 태어나는 아기 평균 (나라별 출생아 수로 가중)
let WORLD=null;
function worldAvg(){ if(WORLD) return WORLD; let W=0; const o={le:0,u5:0,tfr:0,sec:0,edu:0};
  for(const k in COUNTRIES){ const c=COUNTRIES[k], w=c.births||0, pu=c.pU==null?.5:c.pU, mix=v=>Array.isArray(v)?v[0]*pu+v[1]*(1-pu):(v||0); W+=w; o.le+=c.le*w; o.u5+=c.u5*w; o.tfr+=(c.tfr||0)*w; o.sec+=mix(c.sec)*w; o.edu+=mix(c.edu)*w; }
  for(const k in o) o[k]/=W||1; return WORLD=o; }
const pct100=v=>Math.round(clamp(v,0,1)*100);
// 출생 화면의 비교표: 이 나라(사는 곳) · 대한민국 · 지금 태어나는 아기 평균
function cmpHTML(L){ const C=L.C, K=COUNTRIES.KR, W=worldAvg(), ui=L.set==='U'?0:1, I=instOf(L), KI=instOf({c:'KR',C:K}), at=(v,i)=>Array.isArray(v)?v[i]:v;
  const rows=[['기대수명',`${C.le}세`,`${K.le}세`,`${Math.round(W.le)}세`],
    ['다섯 살 전에 삶을 마치는 아이 (1000명 중)',`${C.u5}명`,`${K.u5}명`,`${Math.round(W.u5)}명`],
    [`초등학교에 다니는 아이 (100명 중${C.pU<.98?`, ${SETN[L.set]}`:''})`,`${pct100(at(C.edu,ui))}명`,`${pct100(at(K.edu,0))}명`,`${pct100(W.edu)}명`],
    [`중학교에 다니는 아이 (100명 중)`,`${pct100(at(C.sec,ui))}명`,`${pct100(at(K.sec,0))}명`,`${pct100(W.sec)}명`],
    ['여성 한 명이 낳는 아이 (평균)',`${C.tfr}명`,`${K.tfr}명`,`${W.tfr.toFixed(1)}명`],
    ['보통 한 달 벌이 (한국 돈으로)',fmtPay(C.med),fmtPay(K.med),'—'],
    ['병원비 가운데 직접 내는 몫',`${I.oop}%`,`${KI.oop}%`,'—'],
    ['계약서·사회보험 없이 일하는 사람 (100명 중)',`${I.inf}명`,`${KI.inf}명`,'—']];
  return `<table class="cmp"><thead><tr><th></th><th>${esc(C.n)}</th><th>대한민국</th><th>세계(약)</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td class="me">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table><p class="small sub">세계는 지금 태어나는 아기들의 평균(나라별 출생아 수로 가중)입니다. 출처는 이 게임의 나라 자료(UN·WHO·세계은행·ILO 통계를 바탕으로 정리)입니다.</p>`; }
// 한 해를 돌아볼 때 보여 줄 이 나라의 숫자 한 가지 (나이에 맞게, 대한민국 또는 세계와 견주어)
function factLine(L,a,m){ if(m){ const mt=memT(m); if(/^(farewell|sick|hosp|jobloss|unrest)$/.test(m.sc||sceneKindOf(mt))||/헤어|이혼|이별|세상을 떠|돌아가셨|숨을 거|장례|잃었|잃고|다쳤|사고|떠나보/.test(mt)) return null; }
  const C=L.C, K=COUNTRIES.KR, W=worldAvg(), kr=L.c==='KR', ui=L.set==='U'?0:1, I=instOf(L), KI=instOf({c:'KR',C:K}), at=(v,i)=>Array.isArray(v)?v[i]:v, vs=(x,y)=>kr?(y!=null?` 세계 평균은 약 ${y}입니다.`:''):` 대한민국은 약 ${x}입니다.`;
  const F={
    u5:()=>`${C.n}에서는 아이 1000명 가운데 약 ${C.u5}명이 다섯 살이 되기 전에 삶을 마칩니다.${vs(K.u5+'명',Math.round(W.u5)+'명')}`,
    edu:()=>`${C.n}${C.pU<.98?`의 ${SETN[L.set]}`:''}에서는 아이 100명 가운데 약 ${pct100(at(C.edu,ui))}명이 초등학교에 다닙니다.${vs(pct100(at(K.edu,0))+'명',pct100(W.edu)+'명')}`,
    sec:()=>`${C.n}${C.pU<.98?`의 ${SETN[L.set]}`:''}에서는 아이 100명 가운데 약 ${pct100(at(C.sec,ui))}명이 중학교에 다닙니다.${vs(pct100(at(K.sec,0))+'명',pct100(W.sec)+'명')}`,
    tfr:()=>`${C.n}에서 여성 한 명이 평생 낳는 아이는 평균 약 ${C.tfr}명입니다.${vs(K.tfr+'명',W.tfr.toFixed(1)+'명')}`,
    mar:()=>C.mar?`${C.n}에서 처음 결혼하는 나이는 보통 남자 ${C.mar[0]}세, 여자 ${C.mar[1]}세 무렵입니다.${kr?'':` 대한민국은 남자 ${K.mar[0]}세, 여자 ${K.mar[1]}세 무렵입니다.`}`:null,
    med:()=>`${C.n}의 보통 한 달 벌이는 한국 돈으로 약 ${fmtPay(C.med)}입니다.${kr?'':` 대한민국은 약 ${fmtPay(K.med)}입니다.`} 물가가 달라 같은 돈으로 살 수 있는 것도 다릅니다.`,
    inf:()=>`${C.n}에서 일하는 사람 100명 가운데 약 ${I.inf}명은 계약서나 사회보험 없이 일합니다 (ILO).${kr?'':` 대한민국은 약 ${KI.inf}명입니다.`}`,
    oop:()=>`${C.n}에서는 병원비 가운데 약 ${I.oop}%를 아픈 사람이 직접 냅니다 (WHO).${kr?'':` 대한민국은 약 ${KI.oop}%입니다.`}`,
    le:()=>`${C.n}에서 태어난 아기의 기대수명은 약 ${C.le}세입니다.${vs(K.le+'세',Math.round(W.le)+'세')}`,
    ra:()=>I.ra?`${C.n}의 정년(연금을 받기 시작하는 나이)은 ${I.ra[L.sex]}세입니다.${kr?'':` 대한민국은 ${KI.ra[L.sex]}세입니다.`}`:`${C.n}에는 정해진 정년이나 연금이 없는 일자리가 많습니다. 나이가 들어도 일하거나 가족에게 기대어 지냅니다.`};
  const keys=a<6?['u5','edu','tfr']:a<13?['edu','sec','u5']:a<19?['sec','mar','inf']:a<40?['med','inf','tfr','mar','oop']:a<60?['oop','inf','med','le']:['le','ra','oop'];
  const fit=k=>k==='tfr'?(a<6||L.sex===1||!!(m&&/^(baby|wedding)$/.test(m.sc||sceneKindOf(memT(m))))):k==='mar'?a>=16:true;   // 아이 수는 아기 때·여성·결혼/출산 장면에만
  for(let i=0;i<keys.length;i++){ const k=keys[(L.pi+i)%keys.length]; if(!fit(k)) continue; const t=F[k](); if(t) return t; } return null; }
// 기억 한 줄: 상황 → 내 선택 → 결과 (실패 문장의 앞머리 ‘선택’ — 은 떼어 낸다)
function memT(m){ let t=String(m.t||''); if(m.l){ const pre=`‘${m.l}’ — `; if(t.startsWith(pre)) t=t.slice(pre.length); } return t; }
function memHTML(m,cls){ return `${m.q?`<p class="mq">${esc(m.q)}${m.l?`<span class="ml">→ ${esc(m.l)}</span>`:''}</p>`:''}<p class="${cls||'evt'}">${esc(memT(m))}${m.rp>1?` <small class="rp">(그 뒤로도 ${m.rp-1}번 더)</small>`:''}</p>`; }
function memScore(m){ const k=photoKind(m); return (m.big?3:0)+(m.q&&!m.au?2:0)+(m.kid!=null?3:0)+(m.nt?1:0)+(/^(baby|wedding|grad|school|fest|travel|sport|stage)$/.test(k)?1:0)-(/^(money|jobloss|sick|hosp)$/.test(k)?2:0)-(m.ev&&!m.big?1:0)-(m.f?1:0); }
// 한 해(어른은 두 해)를 돌아보는 카드: 그해의 한 장면 · 달라진 것 · 이 나라의 숫자 · 같은 1초에 태어난 사람
function yearPick(L,a0,a1){ const M=L.mem.filter(m=>m.a>=a0&&m.a<a1&&m.a>0); if(!M.length) return null; return M.reduce((b,m)=>memScore(m)>=memScore(b)?m:b,M[0]); }
function yearCard(L,done){ const h=L.hist||[], last=h[h.length-1]; if(!last){ done(); return; }
  const a0=last.a, a1=L.age, m=yearPick(L,a0,a1), prev=h[h.length-2], d=prev?{h:Math.round(last.h-prev.h),j:Math.round(last.j-prev.j),k:Math.round(last.k-prev.k),t:Math.round((last.t||0)-(prev.t||0)),e:Math.round((last.e||0)-(prev.e||0)),r:Math.round(last.r-prev.r)}:null;
  const nt=(L.mem.filter(x=>x.a>=a0&&x.a<a1&&x.nt&&!(L.ntSeen||[]).includes(strHash(x.nt))).slice(-1)[0]||{}).nt, fact=(nt&&ntFirst(L,nt)?nt:null)||factLine(L,a0,m), cp=L.comps&&L.comps.length?L.comps[L.pi%L.comps.length]:null;
  sheet(`<div class="place">${L.by+a0}년 · ${a1-a0>1?`${a0}~${a1-1}살`:`${a0}살`}을 돌아보며</div>
    ${m?`<div class="ycard">${memHTML(m)}</div>`:'<p class="evt">조용히 지나간 한 해였다.</p>'}${d?chips(d):''}
    ${fact?`<p class="nt fact">${esc(fact)}</p>`:''}
    ${cp?`<p class="small sub">같은 1초에 태어난 ${esc(cp.n)}(${esc(cp.cn)}) · ${esc(L.compNow(cp,a0))}</p>`:''}
    <button class="btn primary" id="btnOk">${a1}살의 한 해로 ▶</button>`,'event year');
  $('btnOk').onclick=()=>{ closeSheet(); done(); }; }
// 삶의 중간에 멈춰 생각하기
const ASKS=[[5,L=>`${josa(L.name,'이','가')} 다섯 살이 되었습니다. 이 아이에게 한마디를 건넨다면?`,'예: 넘어져도 괜찮아, 천천히 자라렴'],
  [15,L=>`${josa(L.name,'은','는')} 열다섯 무렵, 지금의 당신과 비슷한 나이입니다. 당신의 열다섯과 무엇이 같고, 무엇이 다른가요?`,'예: 나는 학원에 다니는데, 이 아이는 …'],
  [30,L=>`서른 무렵입니다. 지금까지 ${L.name}의 선택 가운데 가장 잘한 선택은 무엇이었을까요?`,'예: 그때 공부를 포기하지 않은 것'],
  [50,L=>`쉰 무렵입니다. ${josa(L.name,'이','가')} 가장 고마워해야 할 사람은 누구일까요? 왜 그런가요?`,'예: 늘 곁에 있어 준 친구'],
  [70,L=>`일흔 무렵입니다. ${josa(L.name,'이','가')} 단 한 사람에게만 말을 건넬 수 있다면, 누구에게 무슨 말을 할까요?`,'예: 엄마에게, 고마웠다고']];
function askSheet(L,done){ if(!G.askOn){ done(); return; } if(!L.opt||L.opt.ask===0||L.f.dying||L.dead){ done(); return; } L.asked=L.asked||{};
  const x=ASKS.find(([m])=>L.age>=m&&L.age<m+4&&!L.asked[m]); if(!x){ done(); return; } const m=x[0], q=x[1](L); L.asked[m]=1;
  sheet(`<div class="place">잠시 멈춤 · ${L.age}살</div><h2>${esc(q)}</h2><label class="field" for="askIn">짧게 적어 보세요 <span class="sub small">· 마지막 장면에서 다시 보여 드려요</span><textarea id="askIn" maxlength="120" rows="3" placeholder="${esc(x[2])}"></textarea></label><div class="row"><button class="btn primary" id="btnAskOk">남기기</button><button class="btn" id="btnAskNo">건너뛰기</button></div>`,'ask');
  const fin=save=>{ const t=$('askIn').value.trim().slice(0,120); if(save&&t) (L.notes||(L.notes=[])).push({a:L.age,m,q,t}); closeSheet(); persist(); done(); };
  $('btnAskOk').onclick=()=>fin(true); $('btnAskNo').onclick=()=>fin(false); }
// 숫자(통계)가 붙은 일은 처음 한 번은 큰 창으로
const strHash=s=>{ let h=5381; for(const c of String(s)) h=((h<<5)+h+c.charCodeAt(0))>>>0; return h.toString(36); };
function ntFirst(L,nt){ if(!nt) return false; const k=strHash(nt), s=L.ntSeen||(L.ntSeen=[]); if(s.includes(k)) return false; s.push(k); return true; }
