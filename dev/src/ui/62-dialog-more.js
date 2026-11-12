/* ========== [2-2 상호작용] 대화창 넓히기 (11-13) ==========
   1) 대화창에 작은 그림 카드(it.html)를 함께 띄울 수 있게 한다 — 진로 이야기의 '지금 나의 삶의 모양'(오각형).
   2) 지도의 '!' 작은 선택 가운데 사람이 나오는 것(가족·친구·선생님·동료 등)은 가운데 팝업 대신 아래 대화창에서 고른다.
      물건·장소의 일(TV·책상·놀이터 등)은 예전처럼 팝업. 선택지마다 될 가능성을 보여 주고, 결과에 바뀐 능력치를 표로 보여 준다.
   3) 진로 이야기(중요 대화): 12~14살 부모님 · 15~17살 담임 선생님(진로 상담) · 17~18살 진학 상담.
      흥미 분야와 목표 학과를 정하면 대학·일자리 후보가 그에 맞춰진다(engine/54-career.js). */
document.head.insertAdjacentHTML('beforeend',`<style>
#dlg .dimg{position:absolute;left:10px;bottom:calc(100% + 8px);width:min(180px,34vw);background:#FBFAF6;border:3px solid #2A3440;border-radius:10px;padding:4px 6px 2px;box-shadow:0 8px 18px rgba(0,0,0,.3)}
#dlg .dimg p{margin:0;font-size:.72rem;font-weight:700;color:#5A6878;text-align:center}
#dlg .dimg svg{width:100%;height:auto;display:block}
#dlg .dopts button small{display:block;font-size:.72rem;color:#6B6F7A;font-weight:400}
#dlg .dopts button .dp{font-size:.72rem;font-weight:700;margin-left:6px;padding:0 5px;border-radius:4px;background:#EEF1F5;color:#4A5A70}
#dlg .dopts button .dp.hi{background:#E5F3EA;color:#2F7A4F}#dlg .dopts button .dp.mid{background:#FBF1D9;color:#8A6410}#dlg .dopts button .dp.lo{background:#FBE5E9;color:#A8344B}
@media (max-height:460px){#dlg .dimg{width:min(130px,26vw)}#dlg .dopts button{font-size:.88rem;padding:5px 10px 5px 24px}}
</style>`);
// 1) 그림 카드 · 선택지의 작은 설명(sub)과 될 가능성(p)
(function(){ const _show=dlgShow; dlgShow=function(){ _show(); const it=DLG.q[0], d=$('dlg'); if(it&&it.html&&d) d.insertAdjacentHTML('beforeend',`<div class="dimg">${it.html}</div>`); };
  const _opts=dlgOpts; dlgOpts=function(it){ _opts(it); if(!it.sub&&!it.ps) return; const bs=$('dlg').querySelectorAll('.dopts button');
    bs.forEach((b,i)=>{ const p=it.ps?it.ps[i]:undefined; if(p!==undefined) b.insertAdjacentHTML('beforeend',dlgPct(p)); if(it.sub&&it.sub[i]) b.insertAdjacentHTML('beforeend',`<small>${esc(it.sub[i])}</small>`); }); }; })();
function dlgPct(p){ const m=probMode(); if(!m) return ''; if(p==null) return '<span class="dp">확실</span>'; const lv=p>=.65?['hi','높음']:p>=.4?['mid','보통']:['lo','낮음']; return `<span class="dp ${lv[0]}">${m===2?Math.round(p*100)+'%':'될 가능성 '+lv[1]}</span>`; }
const pentCard=L=>`<p>지금 나의 삶의 모양</p>${radarSVG(L.s,[])}`;

// 2) 사람이 나오는 작은 선택 → 대화창
const RX_PERSON=/(선생님|친구|짝꿍|동료|선배|후배|사장님|상사|팀장|이웃|손님|할머니|할아버지|엄마|아빠|어머니|아버지|동생|형|누나|언니|오빠|배우자|아내|남편|아이가|코치|감독|의사)/;
function scenePerson(L,sc){ if(['mom','dad','gran','sib','spouse','kid'].includes(sc.spot)) return L.spotName(sc.spot); if(sc.spot==='friend') return '친구';
  const t=L.tx(Array.isArray(sc.txt)?sc.txt[0]:sc.txt), m=t.match(RX_PERSON); return m?m[1].replace(/^아이가$/,'아이'):null; }
(function(){ const _os=openScene; openScene=function(k){ if(dlgOpen()) return; const L=G.life, c=L.cur&&L.cur.scenes[k]; if(!c) return; const sc=SCENES[c.i], who=scenePerson(L,sc);
  if(!who) return _os(k);
  const idx=sc.opts.map((o,i)=>i).filter(i=>!(L.optBlocked&&L.optBlocked(sc.opts[i],'s'))); if(!idx.length) return _os(k);
  const txt=L.tx(Array.isArray(sc.txt)?sc.txt[L.set==='U'?0:1]:sc.txt), place=scenePos(c.i).n;
  dlgRun([{who,t:txt,opts:idx.map(i=>L.tx(sc.opts[i].l)),ps:idx.map(i=>L.optP(sc.opts[i])),then:j=>{ const s0=Object.assign({},L.s), r=L.doScene(k,idx[j]); G.spawnT=4; renderHud(); persist();
    if(!r) return []; return [{who:'',t:r.t,up:qChips(s0,L.s)}]; }}]); }; })();

// 3) 진로 이야기
function careerWho(L,w){ const st=careerDue(L); if(!st||!w) return 0; if(st===1) return w.role==='fam'&&['mom','dad','gran'].includes(w.k)?1:0; return w.role==='teacher'?st:0; }
(function(){ const _ne=nearExtra; nearExtra=function(){ const r=_ne(); if(r&&r.type==='t'&&r.npc&&r.npc.kind!=='a'){ const w=whoOf(r.npc); if(careerWho(G.life,w)) r.lab=`${w.n} · 진로 이야기`; } return r; };
  const _ot=openTalk; openTalk=function(nr){ if(dlgOpen()) return; const L=G.life, w=whoOf(nr.npc), st=careerWho(L,w); if(st) return careerTalk(st,w); return _ot(nr); };
  const _bp=beginPeriod; beginPeriod=function(...a){ const r=_bp(...a); const L=G.life, st=L&&careerDue(L);
    if(st&&!L.dead) setTimeout(()=>toast(st===1?'진로 이야기 · 집에서 엄마나 아빠에게 말을 걸어 보세요. 앞으로의 길을 함께 이야기할 수 있어요.':st===2?'진로 상담 · 학교에서 담임 선생님께 말을 걸어 보세요.':'진학 상담 · 학교에서 담임 선생님께 말을 걸어 목표 학과를 정해 보세요.','news'),1500);
    return r; }; })();
const dirLab=d=>`${DIRS[d].n}`, dirSub=d=>DIRS[d].ex;
function careerTalk(st,w){ const L=G.life, f=L.f, rank=dirRank(L), ax=topAxes(L), html=pentCard(L), me=L.name, axT=`${josa(AX_N[ax[0]],'과','와')} ${AX_N[ax[1]]}`, axI=josa(axT,'이','가'), wa=josa(w.n,'과','와'), wi=josa(w.n,'이','가');
  const done=(t,mem,g)=>{ const s0=Object.assign({},L.s); tinyGain(L,g,'진로 이야기'); L.remember({a:L.age,t:mem,big:1}); renderHud(); persist(); return {up:qChips(s0,L.s)}; };
  if(st===1){ const cand=[rank[0],rank[1]].concat(DIR_KEYS.filter(d=>d!==rank[0]&&d!==rank[1]).sort(()=>R()-.5).slice(0,2));
    const poor=L.famI===2;
    dlgRun([{who:w.n,t:`${me}, 요즘 뭐가 제일 재미있니? 나중에 어떤 일을 하며 살고 싶은지 같이 이야기해 보자.`,html},
      {who:w.n,t:`내가 보기엔 너는 ${axI} 돋보여. 그래서 ${DIRS[rank[0]].n} 쪽도 잘 어울릴 것 같은데, 너는 어때?`,html,opts:cand.map(dirLab).concat('아직 잘 모르겠어요'),sub:cand.map(dirSub).concat('천천히 찾아봐도 괜찮아요'),then:i=>{ f.dirT1=L.age;
        if(i>=cand.length){ setDir(L,rank[0],.5); const x=done(`${wa} 진로 이야기를 했다. 아직은 잘 모르겠다고 솔직히 말했다.`,`${wa} 처음으로 진로 이야기를 했다. 아직은 잘 모르겠다고 말했다.`,{r:1.5,j:1});
          return [{who:w.n,t:'괜찮아. 지금 모르는 게 당연해. 이것저것 해 보다 보면 좋아하는 게 보일 거야.'},{who:'',t:'마음이 한결 가벼워졌다.',up:x.up}]; }
        const d=cand[i], D=DIRS[d]; setDir(L,d,2); const x=done('',`${wa} 진로 이야기를 했다. ${D.n} 쪽에 관심이 있다고 말했다.`,{r:1.5,j:1,e:1});
        return [{who:w.n,t:`${D.n} 쪽이구나! ${poor?'형편이 넉넉하진 않지만, ':''}네가 좋아하는 걸 찾았다니 응원할게. ${D.ex.split('→')[1].trim()} 같은 일이 있지.`},{who:'',t:`앞으로 ${D.n} 쪽을 조금 더 알아보기로 했다.`,up:x.up}]; }}]); return; }
  if(st===2){ const cur=f.dir, sug=rank[0]!==cur?rank[0]:rank[1], other=DIR_KEYS.filter(d=>d!==cur&&d!==sug).sort((a,b)=>dirScore(L,b)-dirScore(L,a))[0], cand=[cur,sug,other].filter(Boolean);
    dlgRun([{who:'',t:`진로 상담 시간이다. ${wi} 그동안의 생활기록부와 성적표를 펼쳐 놓으셨다.`,html},
      {who:w.n,t:`${axI} 돋보이는구나.${cur?` 지난번에 ${DIRS[cur].n} 쪽에 관심 있다고 했지?`:''} 선생님은 ${DIRS[sug].n} 쪽도 잘 맞을 것 같아. 어느 쪽을 더 알아볼까?`,html,
       opts:cand.map(d=>d===cur?`지금 관심 있는 ${DIRS[d].n} 쪽`:d===sug?`선생님이 권하는 ${DIRS[d].n} 쪽`:`${DIRS[d].n} 쪽도 궁금해요`),sub:cand.map(dirSub),then:i=>{ const d=cand[i], D=DIRS[d]; f.dirT2=L.age; setDir(L,d,2);
        const x=done('',`진로 상담에서 ${D.n} 쪽을 더 알아보기로 했다.`,{k:1.5,e:1,t:.8});
        return [{who:w.n,t:`좋아. ${D.n} 쪽이라면 ${(a=>a.length>1?josa(a[0],'이나','나')+' '+a[1]:a[0])(D.maj.slice(0,2).map(m=>L.c!=='KR'&&m==='국어국문학과'?'어문학과':m))} 같은 학과가 있어. ${josa(AX_N[D.ax[0]]||'건강','을','를')} 꾸준히 키우면 도움이 될 거야.`},{who:'',t:'상담실을 나오며 해야 할 일을 수첩에 적었다.',up:x.up}]; }}]); return; }
  // 3 진학 상담: 목표 학과
  ensureDir(L); const D=DIRS[f.dir], loc=m=>L.c!=='KR'&&m==='국어국문학과'?'어문학과':m, maj=D.maj.map(loc).slice(0,3), alt=rank.find(d=>d!==f.dir);
  const opts=maj.concat(`${DIRS[alt].n} 쪽 학과로 바꿔 본다`,'대학보다 바로 일을 배우고 싶어요'), sub=maj.map(m=>{ const j=MAJOR_JOB[m]&&jobInfo(L,MAJOR_JOB[m]); return (MAJ_HARD[m]<=-.2?'들어가기 매우 어려움 · ':MAJ_HARD[m]<=-.06?'들어가기 어려운 편 · ':'')+(j?`졸업 뒤 ${j.n} 등`:''); }).concat(DIRS[alt].ex,'졸업 뒤 바로 일자리를 찾는다');
  dlgRun([{who:'',t:`진학 상담. ${wi} 모의고사 성적표와 대학 목록을 펼쳐 놓으셨다.`,html},
    {who:w.n,t:`원서를 쓸 때가 다가오는구나. ${D.n} 쪽에서 어느 학과를 목표로 할까?`,opts,sub,then:i=>{ f.dirT3=L.age; let m, t;
      if(i<maj.length){ m=maj[i]; f.major=m; t=`${m}! 목표가 생겼으니 남은 시간을 잘 써 보자. 붙을 수 있는 곳과 도전할 곳을 함께 써 두자.`; }
      else if(i===maj.length){ setDir(L,alt,3); m=loc(DIRS[alt].maj[0]); f.major=m; t=`${DIRS[alt].n} 쪽으로 바꿔 보는구나. 그럼 ${josa(m,'을','를')} 목표로 해 보자.`; }
      else { f.wantWork=1; t='그것도 좋은 길이야. 대학에 안 가도 기술과 경험을 쌓으면 길은 많아. 원서는 혹시 몰라 하나만 써 두자.'; }
      const x=done('',m?`진학 상담에서 ${josa(m,'을','를')} 목표로 정했다.`:'진학 상담에서 대학보다 바로 일을 배우고 싶다고 말했다.',{k:1,e:1,j:.6});
      return [{who:w.n,t},{who:'',t:'목표를 정하자 마음이 조금 단단해졌다.',up:x.up}]; }}]); }
