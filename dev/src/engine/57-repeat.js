/* ========== 되풀이 줄이기 2 (11-13 아침 점검) ==========
   30개 나라 210판을 다시 돌려 보니 아직 이런 것이 한 삶에 여러 번 나왔다.
   · 그 나라 큰 명절(팀카트·추수감사절·뗏 …)이 한 삶에 약 50번(해마다 두세 가지 명절 장면) → 명절 장면은 한 해에 하나, 한 삶에 18번까지
   · 운동회·방학·음악회·과학 박람회처럼 해마다 같은 질문 → 같은 일은 한 삶에 3번까지(명절 4번)
   · 큰 갈림길 가운데 되풀이되는 것(돌림병, 마음에 품은 일, 살림이 나아지지 않음 …)이 한 삶에 2~3번 → 2번까지, 잘사는 나라의 돌림병은 1번
   · 축구 국가대표 응원이 한국에서 한 삶에 약 4.7번 → 3번까지, 6년 간격
   · 잘사는 나라의 '태풍 소식'이 같은 문장으로 5번 → 3번까지, 문장도 여러 가지로 */
(function(){
  const T=n=>THB.find(t=>t[0]===n);
  const nt=T('natTeam'); if(nt){ nt[2]=6; nt[3]=3; }
  const sr=T('storm'); if(sr){ sr[2]=4; sr[3]=L=>L.C.tier>=4?3:L.C.tier>=3?5:8; }
  const pr=T('prices'); if(pr){ pr[1]=/물가가 크게 올랐|물가가 뛰었|물가가 치솟/; pr[2]=8; pr[3]=3; }
  const ck=T('checkup'); if(ck){ ck[3]=4; }
})();

/* ---------- 명절: 한 해에 두 장면(두 해면 넷), 한 삶에 FEST_MAX번까지 나이에 맞춰 나눠서 (그 나라 큰 명절 두 가지: C.fest · FACTS.fest2) ---------- */
const FEST_MAX=26, festPace=L=>Math.min(FEST_MAX,3+L.age*.32);   // 어린 시절에 다 쓰지 않도록 나이에 맞춰 조금씩
const festNames=L=>{ if(!L||!L.C) return []; if(L._fN&&L._fN.c===L.c) return L._fN.v; const F=typeof FACTS!=='undefined'&&FACTS[L.c]||{};
  const v=[L.C.fest,F.fest2].concat(L.c==='KR'?['설 명절']:[]).filter(x=>x&&x.length>=2);
  Object.defineProperty(L,'_fN',{value:{c:L.c,v},enumerable:false,configurable:true,writable:true}); return v; };
const festIn=(L,s)=>{ s=String(s||''); if(s.indexOf('{fest}')>=0||s.indexOf('{fest2}')>=0) return true; return festNames(L).some(n=>s.indexOf(n)>=0); };
(function(){ const P=Life.prototype;
  const isF=(L,x)=>{ const c=x._fsc||(x._fsc={}); if(c[L.c]===undefined) c[L.c]=festIn(L,thbText(x))?1:0; return c[L.c]; };
  const _ok=thbOK; thbOK=function(L,x){ if(!_ok(L,x)) return false; if(!x||(x.txt==null&&!x.opts)) return true;
    if(isF(L,x)){ const N=L.thN||{}, A=L.thL||{}; if((N.fest||0)>=festPace(L)) return false; if(A.fest===L.age&&(N.festA||0)>=2) return false; }
    return true; };
  const _rem=P.remember; P.remember=function(o){ const r=_rem.apply(this,arguments);
    try{ if(o&&o.a!=null&&festIn(this,(o.t||'')+' '+(o.q||''))){ const N=this.thN||(this.thN={}), A=this.thL||(this.thL={}); N.fest=(N.fest||0)+1; if(A.fest===o.a) N.festA=(N.festA||0)+1; else { A.fest=o.a; N.festA=1; } } }catch(e){}
    return r; };
  // 한 해(어른은 두 해)의 달력을 짤 때 명절 장면은 둘(두 해면 넷)까지만 남긴다
  const _pc=P.planCal; P.planCal=function(){ const out=_pc.apply(this,arguments); if(!Array.isArray(out)) return out;
    const lim=this.step>1?4:2; let n=0;
    return out.filter(it=>{ if(it.dyn) return true; const ev=CAL[it.id]; if(!ev||!isF(this,ev)) return true; n++; return n<=lim; }); };
})();

/* ---------- 해마다 돌아오는 학교·계절의 일: 같은 일은 한 삶에 3번까지 ---------- */
const SEAS_MAX={spring:3,autumn:3,vacS:3,vac:3,uVac:3,chore:3,h_night:3,health:3,kidX:3,fest:4,holiday:4};
(function(){ const P=Life.prototype;
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ if(ev&&ev.id!=null&&ev.k&&SEAS_MAX[ev.k]){ const n=this.calN&&this.calN[ev.id]; if(n&&n>=SEAS_MAX[ev.k]) return null; }
    return _cc.call(this,ev,st,sy); };
})();

/* ---------- 큰 갈림길의 되풀이: 한 삶에 2번까지 (몇 가지는 1번, 형편에 맞을 때만) ---------- */
(function(){ const P=Life.prototype;
  MAJORS.forEach((m,i)=>{ m._mi=i; });
  const set=(frag,o)=>{ const m=MAJORS.find(x=>String(Array.isArray(x.txt)?x.txt[0]:x.txt).indexOf(frag)>=0); if(m) Object.assign(m,o); };
  set('온 동네에 돌림병이',{mjCap:L=>L.C.tier>=3?1:2});
  set('일해도 살림이 좀처럼',{maxW:.58});
  set('나라 경제가 크게 흔들려',{mjCap:L=>L.C.tier>=4?1:2});
  set('오랫동안 마음에 품은 일',{mjCap:L=>2});
  set('일터가 어려워져 사람을 줄인다고',{mjCap:L=>2});
  const cap=(L,m)=>m.mjCap?m.mjCap(L):(m.rep?2:1);
  const _inC=P.inC; P.inC=function(x){ if(!_inC.call(this,x)) return false;
    if(x&&x._mi!=null){ const n=this.mjN&&this.mjN[x._mi]; if(n&&n>=cap(this,x)) return false; if(x.maxW!=null&&this.w>x.maxW) return false; }
    return true; };
  const _pm=P.planMajors; P.planMajors=function(n){ const out=_pm.apply(this,arguments); if(Array.isArray(out)){ const N=this.mjN||(this.mjN={}); out.forEach(i=>{ N[i]=(N[i]||0)+1; }); } return out; };
})();

/* ---------- 문장 다듬기: 잘사는 나라의 돌림병 ---------- */
(function(){ const P=Life.prototype;
  const SWAP={'온 동네에 돌림병이 돌았다.':L=>L.C.tier>=3?'독감이 크게 유행해 동네 병원마다 사람이 가득했다.':null};
  const _tx=P.tx; P.tx=function(s){ if(typeof s==='string'&&SWAP[s]){ const v=SWAP[s](this); if(v) s=v; } return _tx.call(this,s); };
})();

/* ---------- 어린아이가 할 수 없는 일: 잘사는 나라에서 열네 살 아래면 '장사해서 돈 벌기'는 고를 수 없다 ---------- */
(function(){ const P=Life.prototype, RX_TRADE=/음식을 판다|장사를 한다|장사한다|가게를 연다|물건을 판다|투자한다|대출/;
  const _ob=P.optBlocked; P.optBlocked=function(o,kind){ const r=_ob.apply(this,arguments); if(r) return r;
    if(o&&this.age<14&&this.C.tier>=3&&RX_TRADE.test(String(o.l||o.label||''))) return '아직 어려서 할 수 없어요';
    return ''; };
})();

/* ---------- 쉽게 할 수 있는 선택(텔레비전 보기, 늦잠, 실컷 놀기)은 실패하지 않는다 ---------- */
(function(){ const P=Life.prototype, RX_EASY=/텔레비전|티브이|휴대폰만|휴대폰을 본|게임만|게임을 실컷|늦잠|낮잠|빈둥|뒹군|만화만|실컷 논|집에 간다|집으로 간다|먼저 집에|그냥 잔다|자 버린다|딴짓/;
  const _op=P.optP; P.optP=function(o){ if(o&&RX_EASY.test(String(o.l||''))) return null; return _op.call(this,o); };
})();

/* ---------- 대유행: 첫해와 다음 해의 문장을 나누고, 백신은 둘째 해부터 한 번 ----------
   예전에는 대유행이 이어지는 2~3년 동안 해마다 "처음 보는 감염병이 퍼지고 있다"가 되풀이되었다. */
(function(){ const P=Life.prototype;
  const PAN1=()=>[EPI_EV.pan1k,EPI_EV.pan1a];
  const panNow=L=>{ try{ const e=epiCur(L); return e&&e.pan; }catch(er){ return null; } };
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ if(ev&&ev.id!=null&&(ev.k==='ep_pan'||ev.k==='ep_panv')){ const p=panNow(this);
      if(p){ if(ev.k==='ep_pan'&&PAN1().includes(ev.id)&&p.w>=2) return null;
        if(ev.k==='ep_panv'&&(p.w<1||this.f.pvS===p.s)) return null; } }
    return _cc.call(this,ev,st,sy); };
  const _cv=P.calVars; P.calVars=function(ev,it){ const had=!!it.v, v=_cv.apply(this,arguments);
    if(!had&&ev&&PAN1().includes(ev.id)){ const p=panNow(this); if(p&&p.w>=1) v.__t=ev.id===EPI_EV.pan1k?'감염병 대유행이 해를 넘겨 이어진다. 학교가 문을 열었다 닫았다를 되풀이한다.':'감염병 대유행이 해를 넘겨 이어진다. 환자가 다시 늘어 모임을 줄이라는 안내가 나왔다.'; }
    return v; };
  const pv=CALRUN.panVac; if(pv){ const _p=pv.post; pv.post=function(L,ok,oi){ const p=panNow(L); if(p) L.f.pvS=p.s; return _p.apply(this,arguments); }; }
})();

/* ---------- 그 밖의 달력 일: 같은 일은 한 삶에 3번까지 (학기·시험·군대·유행병 단계는 그대로) ---------- */
SEAS_MAX.ep_flu=3; SEAS_MAX.farm1=4; SEAS_MAX.farm2=4;
(function(){ const P=Life.prototype;
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ if(ev&&ev.id!=null&&ev.txt!=null&&!ev.k&&!ev.ex&&!ev.mx&&!ev.c.some(t=>/^(x1|x2|yr:|ep:|svc|army)/.test(t))){ const n=this.calN&&this.calN[ev.id]; if(n&&n>=3) return null; }
    return _cc.call(this,ev,st,sy); };
})();

/* ---------- 가족·신앙·동료 이야기(달력에 끼는 짧은 장면): 같은 문장이 이미 두 번 나왔으면 그해에는 건너뛴다 ----------
   "형제자매 단체 대화방에 어릴 적 사진이 올라왔다"가 한 삶에 평균 5번, 크리스마스 예배·희생제가 4~5번 나오던 것을 줄인다.
   형편이 바뀌는 일(act)·큰일(big)·고르는 일(opts)은 그대로 둔다. */
(function(){ const P=Life.prototype;
  const seen2=(L,t)=>{ if(!t||typeof t!=='string') return false; const p=L.findMem(t); return !!(p&&(p.rp||1)>=2); };
  const keep=(L,x)=>{ const d=x&&x.dyn; if(!d||d.act||d.big||d.opts||d.die) return true; return !seen2(L,d.txt); };
  ['famPlan','compPlan'].forEach(k=>{ const _f=P[k]; if(!_f) return; P[k]=function(){ const out=_f.apply(this,arguments); return Array.isArray(out)?out.filter(x=>keep(this,x)):out; }; });
  // 달력의 짧은 이야기(고르는 것이 없는 일)도 같은 문장이 두 번 나왔으면 건너뛴다
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ if(ev&&ev.id!=null&&!ev.opts&&typeof ev.txt==='string'&&ev.txt.indexOf('{')<0&&ev.txt.indexOf('||')<0&&seen2(this,ev.txt)) return null;
    return _cc.call(this,ev,st,sy); };
})();

/* ---------- 장면의 종류(그림·엔딩 분류): 낱말 하나에 걸려 엉뚱한 그림이 나오던 것을 바로잡는다 ----------
   예전 규칙의 문제: '일'(일요일·일찍·할 일)이면 모두 일터 그림, '먼 길을'이면 장례 그림(귀성길), '잔치'면 결혼식 그림(돌잔치),
   '아파'면 병원 그림(아파트), '대회'면 축구 그림(과학 발명 대회), '손주'면 갓난아기 그림(손주가 놀러 왔다). */
const SCENE_RX=[[/홍수|물에 잠|강물이 넘|큰비|몬순|우기에 길/,'flood'],[/지진|땅이 크게 흔들/,'quake'],[/폭풍|태풍|큰바람|허리케인|사이클론|토네이도/,'storm'],
  [/가뭄|비가 오지 않|물이 귀|우물이 말/,'drought'],[/폭염|더위가|무더위|땡볕/,'heat'],[/한파|눈보라|큰 눈|폭설|영하|혹독한 추위/,'cold'],[/산불|숲에 큰불|큰불|불이 났|불이 번/,'fire'],[/화산/,'volcano'],
  [/총소리|분쟁|피란|피난|어수선/,'unrest'],[/세상을 떠나|떠나셨|떠나보|장례|부고|숨을 거두|돌아가셨/,'farewell'],
  [/입영|입대|훈련소|군 복무|복무를 마|전역|고향에 다녀|귀성|고향으로 가는/,'travel'],
  [/태어났|태어난다|동생이 생|아기가 생|임신|출산/,'baby'],[/결혼식|결혼했|결혼한다|결혼을 했|혼례|혼사|가정을 꾸|신랑|신부/,'wedding'],
  [/강아지|고양이|반려동물|동물병원/,'pet'],
  [/입원|병원|진단|수술|앓|아파(?!트)|열이 나|열이 올|감기|독감|돌림병|말라리아|홍역|뎅기|콜레라|감염병|병세/,'sick'],
  [/졸업식|졸업했|졸업을/,'grad'],[/집을 샀|집이 생|새 아파트|집을 짓|지은 집|집값|계약서|전세|월세|보증금|청약|집주인|자취방|살 집/,'house'],
  [/바닷물|파도|먼바다|바다를 보|바닷가|해변/,'sea'],
  [/발명|과학 .{0,6}대회|글짓기|그리기 대회|미술 대회|경시대회|퀴즈|박람회/,'school'],[/노래 대회|합창|연주|웅변|말하기 대회|장기 자랑|무대|발표회|공연|연극|학예회|음악회/,'stage'],
  [/시험|입학|학교|성적|수능|공부|합격|숙제|학원|담임|교실|방학/,'school'],
  [/일자리를 잃|사람을 줄|문을 닫|실직|해고|일감이 끊/,'jobloss'],
  [/월급|돈|사업|물가|살림|빚|대출|저축|통장|투자|경기가 (크게 )?(가라앉|나빠)/,'money'],
  [/농사|밭일|밭에|논에|수확|추수|씨를 뿌|가축|모내기|과수원/,'harvest'],
  [/일자리|일터|직장|면접|회사|출근|퇴근|동료|사장|공장|가게|장사|손님|승진|야근|회식|출장|아르바이트|일감/,'job'],
  [/축제|행사|명절|잔치|설날|추석|크리스마스|성탄|이드|디왈리|새해/,'fest'],
  [/대회|선수|결승|달리기|운동회|체육대회|축구|야구|농구|배구|시합|올림픽|월드컵/,'sport'],
  [/이사|도시로|떠난다|다른 나라|여행|기차|비행기/,'travel'],[/친구|고백|좋아하는|짝꿍|단짝/,'friend']];
sceneKindOf=function(t){ t=String(t||''); for(const [re,k] of SCENE_RX) if(re.test(t)) return k; return 'life'; };

/* ---------- 나라·사는 곳에 맞지 않던 낱말 ---------- */
(function(){ const P=Life.prototype;
  const FIX=[
    [/집 보일러\(지붕\)가 고장 났다\./,L=>L.C.hz&&L.C.hz.includes('cold')||['KR','JP','CN','RU','DE','GB','FR','PL','UA','CA','US','KZ','MN','TR','IR','AF','KP'].includes(L.c)?'겨울 들머리에 집 보일러가 고장 났다.':'비가 새서 집 지붕을 고쳤다.'],
    [/버스와 지하철로 다니며 돈을 모았다\./,L=>L.set==='R'?'버스를 타고 다니며 돈을 모았다.':null],
    [/친구들과 PC방에서 밤을 보냈다\./,L=>L.c==='JP'?'친구들과 만화 카페에서 밤을 보냈다.':L.c==='CN'?'친구들과 인터넷 카페(왕바)에서 밤을 보냈다.':null]];
  const _tx=P.tx; P.tx=function(s){ if(typeof s==='string'&&s.length<200){ for(const [re,f] of FIX) if(re.test(s)){ const v=f(this); if(v) s=s.replace(re,v); } } return _tx.call(this,s); };
})();

/* ---------- 운동선수: 그 길을 걸어온 사람만, 서른 중반이면 지도자로 ----------
   점검에서 운동을 해 본 적 없는 스물다섯 살이 갑자기 프로 축구 선수가 되고(첫 월급 860만 원), 마흔 넘어서도 선수로 뛰었다.
   · 선수: 어릴 때 운동을 한 사람(ch.athlete·sportKid), 또는 몸 쓰는 일에 흥미가 있고 운동 취미가 있는 스물셋 아래
   · 서른셋부터 해마다 은퇴할 수 있고, 서른일곱이면 은퇴한다 → 같은 팀의 '{운동} 지도자'(코치)가 된다
   · 케냐의 '대표 일'이 마라톤 선수여서 마흔다섯 농부가 마라톤 선수가 되던 것은 '차 농장 일꾼'으로 바꿨다(engine/01, 케냐는 세계 3위 차 수출국). */
JOBS.coach={n:'{sport} 지도자',kind:'school',mul:1.0,sd:.3,edu:0,set:'*',diff:.3,stat:'h',tr:'K'};
JOB_FAM.coach='care';
(function(){ const P=Life.prototype, RX_SP=/축구|농구|야구|배구|달리기|수영|태권도|크리켓|배드민턴|탁구|럭비|하키|레슬링|복싱|씨름|체조|테니스|사이클|자전거/;
  const _d=dreamOK; dreamOK=function(L,id){ if(id==='athlete'){ const ch=L.f.ch||{}; if(ch.athlete!=null||ch.sportKid!=null) return L.age<=30;
      const hob=(L.f.hob||[]).map(h=>h.n).join(' '); return L.age<=23&&L.f.dir==='body'&&L.s.h>=65&&RX_SP.test(hob); }
    if(id==='coach') return !!L.f.wasAth; return _d(L,id); };
  const _jo=jobOK; jobOK=function(L,j){ if(j&&j.id==='coach'&&!L.f.wasAth) return false; return _jo(L,j); };
  const _co=companyOf; companyOf=function(L,j){ if(j&&j.id==='coach'&&L.f.athCo) return L.f.athCo; return _co(L,j); };
  const _ep=P.endPeriod; P.endPeriod=function(){ const r=_ep.apply(this,arguments);
    try{ const f=this.f, a=this.age; if(r&&!r.dead&&f.job==='athlete'&&!f.school&&a>=33&&(a>=37||R()<.22*this.step)){
        const old=this.job.n; f.wasAth=1; f.athCo=f.co; const j=setJob(this,'coach');
        const t=`${old} 생활을 마무리했다. 이제 ${f.co}에서 후배들을 가르치는 ${josa(j.n,'이','가')} 되었다.`;
        this.apply({j:2}); r.entries.push({t,fx:{j:2},big:1,sc:'sport'}); this.remember({a,t,big:1,sc:'sport'}); } }catch(e){}
    return r; };
})();

/* ---------- 아이가 없는데 자녀 이야기가 나오던 장면 ---------- */
(function(){ const P=Life.prototype;
  const _rq=P.reqOK; P.reqOK=function(req){ if(req==='haskid') return (this.kids||[]).length>0; return _rq.call(this,req); };
  SCENES.forEach(sc=>{ const t=String(Array.isArray(sc.txt)?sc.txt.join(' '):sc.txt); if(!sc.req&&/멀리 사는 자녀가/.test(t)) sc.req='haskid'; });
})();
