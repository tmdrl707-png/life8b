class Life{
  constructor(o){
    o=o||{};
    this.ws = o.ws!=null ? o.ws : Math.floor(R()*1e9);   // 이 삶의 세계: 언제 어디서 감염병이 도는지 (학급 방은 방 코드로 맞춘다)
    this.c = o.c || drawCountryKey(); const C=COUNTRIES[this.c];
    this.set = o.set || (R()<C.pU?'U':'R');
    this.sex = o.sex!=null ? o.sex : drawIdx(P_SEX);
    this.famI= o.famI!=null ? o.famI : drawIdx(C.fam);
    this.sib = o.sib!=null ? o.sib : R()<C.sib;
    this.gran= o.gran!=null ? o.gran : R()<C.gran[this.set==='U'?0:1];
    this.w = clamp(C.w0+FAM[this.famI].w,0,1);
    this.s = {h:C.hb-6+R()*8, j:54+R()*8, k:3, r:48+R()*8};
    this.tr= {D:0,B:0,K:0,C:0,G:0};
    this.age=0; this.pi=0; this.f={}; this.used={}; this.done={}; this.recent=[];
    this.mem=[]; this.hist=[]; this.news=[]; this.n=0; this.miss=0; this.cross=0;
    this.cur=null; this.pending=null; this.dead=false; this.usedM={}; this.q=null; this.fail=0;
    this.inc=0; this.maxInc=0; this.jobs=[]; this.hp={m:0,n:0,r:0,g:0,c:0,h:0,cnt:0};
    this.cash=0; this.house=0; this.money=[]; this.mEv=0; this.mHouse=0; this.earned=0; this.maxNW=0; this.kids=[]; this.sick=0;
    initPeople(this); initFamily(this,o);
    this.given = o.given || pickGiven(this,this.sex,'now'); this.name=myName(this,this.given);
    this.mem.push({a:0,t:this.birthText(),big:1,sc:'birth'});
  }
  // 태어난 날의 기록: 어디서, 어떤 형편의 집에서, 부모님은 누구이고 형제자매는 몇인지
  birthText(){ const C=this.C, f=this.fam, P=this.ppl; if(!f) return `${C.n} ${this.town}의 ${FAM[this.famI].n}에서 태어났다. 아빠는 ${P.dad.n}, 엄마는 ${P.mom.n}.`;
    const old=f.sibs.filter(s=>s.d<0).sort((x,y)=>x.d-y.d), terms=old.map(s=>sibTerm(this,s)), n=old.length;
    const sibT=!n?'첫째다.':n===1?`위로 ${josa(terms[0],'이','가')} 있다.`:n===2?`위로 ${josa(terms[0],'과','와')} ${josa(terms[1],'이','가')} 있다.`:`위로 형제자매가 ${n}명(${terms.join('·')}) 있다.`;
    return `${this.by}년, ${C.n} ${this.town}의 ${FAM[this.famI].n}에서 ${this.sex?'여자':'남자'}아이로 태어났다. ${sibT} ${this.f.dad0?`엄마 ${f.mom.n}(${f.mom.a0}세, ${f.mom.job})가 혼자 나를 키운다. 아빠는 곁에 없다.`:`아빠 ${f.dad.n}(${f.dad.a0}세, ${f.dad.job}), 엄마 ${f.mom.n}(${f.mom.a0}세, ${f.mom.job}).`}${f.rel&&f.rel!=='종교 없음'?` 가족은 ${f.rel}을(를) 믿는다.`.replace('을(를)',josa(f.rel,'을','를').slice(f.rel.length)):''}`; }
  setGiven(g){ g=String(g||'').trim().slice(0,8); if(!g) return; const old=this.name; this.given=g; this.name=myName(this,g); }
  // '@지역' 표시는 그 지역의 모든 나라, 'KR,JP'처럼 쓰면 그 나라들만
  inC(x){ if(!x.c) return true; const rg=this.C.rg; return x.c.split(',').some(t=>t[0]==='@'?t.slice(1)===rg:t===this.c); }
  get C(){ return COUNTRIES[this.c]; }
  // 문장 속 {food} {fest} … {friend} {spouse} {kid} {elem} {univ} {co} 자리를 그 나라·그 사람의 것으로 채우고 조사도 맞춘다
  tx(s){ if(!s) return s; s=specText(this,String(s)); if(s.indexOf('{')<0) return this.relTag(s); const C=this.C, P=this.ppl||{}, sch=this.sch||{}, k=this.kids&&this.kids.length?this.kids[this.kids.length-1]:null;
    const job=s.includes('{job')&&this.f.job?jobInfo(this,this.f.job):null;
    const map={food:C.food,fest:C.fest,sport:C.sport,city:C.city,landmark:C.landmark,work:C.work,animal:C.animal,music:C.music,country:C.n,job:job?job.n:'일',
      me:this.name, mom:P.mom?P.mom.n:'엄마', dad:P.dad?P.dad.n:'아빠', gran:P.gran?P.gran.n:'할머니', sib:P.sib?P.sib.n:'동생', friend:P.friend?P.friend.n:'친구', teacher:P.teacher?P.teacher.n:'선생님',
      spouse:P.spouse?P.spouse.n:'배우자', kid:k?k.n:'아이', town:this.town||C.city, elem:sch.elem||'초등학교', mid:sch.mid||'중학교', high:(this.f.hs==='voc'?sch.voc:sch.high)||'고등학교', univ:sch.univ||'대학교', co:this.f.co||'일터', veh:C.veh.n, sea:this.spotName('sea'), lwork:this.set==='R'&&!/농|어부|고기|양식|목동|양치기|가축|목장|가우초|재배|낙타|순록/.test(C.work)?'농사':C.work};
    return this.relTag(String(s).replace(/\{(\w+)\}(을\(를\)|이\(가\)|은\(는\)|와\(과\)|\(으\)로|과\(와\)|를\(을\)|가\(이\)|는\(은\))?/g,(m,k,p)=>{ const w=map[k]; if(w==null) return m; if(!p) return w;
      const pair={'을(를)':['을','를'],'이(가)':['이','가'],'은(는)':['은','는'],'와(과)':['과','와'],'(으)로':['으로','로'],'과(와)':['과','와'],'를(을)':['을','를'],'가(이)':['이','가'],'는(은)':['은','는']}[p]; return josa(w,pair[0],pair[1]); }).split(C.fest+' 날').join(/(날|일)$/.test(C.fest)?C.fest:C.fest+' 날')); }
  static load(o){ const L=Object.assign(Object.create(Life.prototype),o); L.pending=null; if(!Array.isArray(L.recent)) L.recent=[];
    // Firebase는 빈 {}·[]를 저장하지 않아 불러오면 사라진다(8살에 선택한 적이 없던 삶이 '화면 문제'로 멈춤) → 비어 있던 칸을 되살린다
    for(const k of ['done','used','usedM','f','tr']) if(L[k]==null||typeof L[k]!=='object') L[k]={}; for(const k of ['hist','news','money','mem','jobs','kids']) if(!Array.isArray(L[k])) L[k]=L[k]&&typeof L[k]==='object'?Object.values(L[k]):[];
    if(!L.c){ L.c='KR'; L.f.elem=L.age>=7?1:0; L.f.sec=L.age>=13?1:0; }
    if(!COUNTRIES[L.c]) L.c='KR';
    if(!L.fam){ try{ initFamily(L,{sib:L.sib,dad:1,keep:1}); L.fam.sibs.forEach(s=>{ if(s.d<=L.age) s.born=1; }); L.refreshSib(); }catch(e){} }
    L.tr=Object.assign({D:0,B:0,K:0,C:0,G:0},L.tr); L.hp=L.hp||{m:0,n:0,r:0,g:0,c:0,h:0,cnt:0}; L.jobs=L.jobs||[];
    if(L.f.job&&!jobInfo(L,L.f.job)){ const old={office:'office',dream:'artist',shop:'shopown',farm:'farm',part:'day'}[L.f.job]||'day'; L.f.job=old; }
    if(L.inc==null) L.inc=L.f.job?jobPayMid(L,jobInfo(L,L.f.job)):0; if(L.maxInc==null) L.maxInc=L.inc;
    if(!L.ppl){ const nm=L.name; L.s=L.s||{k:50}; initPeople(L); L.given=nm; L.name=myName(L,nm); }
    if(L.cash==null){ L.cash=0; L.house=0; L.money=[]; L.mEv=0; L.mHouse=0; L.earned=0; L.maxNW=0; } L.kids=L.kids||[]; if(L.f.kid&&!L.kids.length) L.kids.push({given:'아이',n:'아이',sex:0,b:L.f.kidBorn||L.age});
    if(L.cur&&L.cur.plan==null){ L.cur.plan=0; L.cur.mDone=0; L.cur.el=0; }
    return L; }
  dump(){ const o=Object.assign({},this); delete o.pending; return JSON.parse(JSON.stringify(o)); }
  get step(){ return this.age<19?1:2; }
  get job(){ return jobInfo(this,this.f.job); }
  get nw(){ return this.cash+this.house; }
  housePrice(){ const C=this.C; return C.house*(this.set==='U'?(this.c==='KR'&&this.town!=='서울'?.55:1):C.tier>=3?.4:.3); }
  kidsHome(){ return (this.kids||[]).filter(k=>this.age-k.b<20); }
  spotName(key){ if(key==='sib'&&this.fam&&this.ppl.sib){ const s=this.homeSibs().sort((x,y)=>Math.abs(x.d)-Math.abs(y.d))[0]; if(s) return sibTerm(this,s); }
    if(key==='work'){ const j=this.job; return j?WORKN[j.kind]:'일터'; }
    if(key==='kid'){ const kh=this.kidsHome(); if(kh.length) return kh[0].given; if(this.f.dying&&this.kids.length) return this.kids[0].given; return '손주'; }
    if(key==='spouse'&&this.ppl&&this.ppl.spouse) return this.ppl.spouse.given;
    const n=this.C.spot[key]||SPOTS[key].n; return Array.isArray(n)?n[this.set==='U'?0:1]:n; }
  kidHome(){ return this.kidsHome().some(k=>this.age-k.b>=3); }
  // 지금 그 장소·사람을 만날 수 있는가
  spotOK(key){
    const f=this.f, a=this.age; if(a<ZONE_AGE[SPOTS[key].z]) return false; if(SPOTS[key].z==='D') return a<75;
    const fm=this.fam;
    switch(key){ case 'mom': return !f.pgone&&(!fm||fm.mom.al&&f.div!=='mom'); case 'dad': return !f.pgone&&(!fm||fm.dad.al&&f.div!=='dad'); case 'gran': return this.gran&&!f.ggone; case 'sib': return this.sib&&(fm?this.homeSibs().length>0:a<26);
      case 'spouse': return !!f.family; case 'kid': return this.kidHome()||!!f.grandkid||(!!f.dying&&this.kids.length>0); case 'work': return !!f.job; case 'elem': return a>=7&&a<=12&&!!f.elem; case 'mid': return a>18||!!f.sec; }
    return true;
  }
  reqOK(req){ if(!req) return true; const f=this.f, C=this.C, inc=(this.inc||0)+(f.family?f.spInc||0:0);
    if(req==='sporty'){ const ch=f.ch||{}; return ch.sportKid!=null||ch.athlete!=null||(f.hob||[]).some(h=>/축구|농구|야구|배구|달리기|수영|태권도|크리켓|운동|체조|테니스|배드민턴|탁구|자전거|씨름|레슬링|권투|럭비|하키|스키|골프|무술|등산/.test(h.n)); }
    if(req==='parents') return !f.pgone; if(req==='lmM') return !/^(wt|cs)$/.test(C.lt); if(req==='lmS') return /^(wt|cs)$/.test(C.lt);
    if(req==='sig') return f.job==='sig'; if(req==='nojob') return this.age>=19&&!f.job&&!f.school&&!f.retired;
    if(req.startsWith('jk:')){ const j=this.job; return !!j&&req.slice(3).split('|').includes(j.kind); }
    if(req==='job') return !!f.job; if(req==='dying') return !!f.dying;
    if(req==='nohouse') return !this.house&&this.age>=25&&this.cash>-C.med*8&&(!!f.job||!!f.family);
    if(req==='renter') return !this.house&&!!f.job; if(req==='cash') return this.cash>C.med*4;
    if(req==='debtH') return !!this.house&&-this.cash*.05>inc*12*.35;
    if(req==='debt0') return !this.house&&this.cash<-Math.max(inc,C.med*.5)*12*.8;
    if(req==='single') return !f.family&&!f.widow&&this.age>marAgeOf(this)&&this.age<50;
    if(req==='kidhome') return this.kidsHome().some(k=>this.age-k.b>=7);
    if(req==='grownkid') return (this.kids||[]).some(k=>this.age-k.b>=24);
    return !!f[req]; }
  // 올해 할 수 있는 작은 선택 2~3개를 고른다 (최근에 한 것은 뒤로). 마지막 시간에는 집 안의 장면만
  pickScenes(n0,skip){
    const a=this.age, n=n0||(a<3?2:3), el=[], dy=!!this.f.dying;
    SCENES.forEach((sc,i)=>{ if((sc.req==='dying')!==dy) return; if(this.inC(sc)&&a>=sc.a[0]&&a<=sc.a[1]&&(sc.set==='*'||sc.set===this.set)&&this.spotOK(sc.spot)&&this.reqOK(sc.req)&&(!this.sick||SPOTS[sc.spot].z==='H')) el.push(i); });
    for(let i=el.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [el[i],el[j]]=[el[j],el[i]]; }
    const rc=this.recent||(this.recent=[]); el.sort((x,y)=>rc.indexOf(x)-rc.indexOf(y));   // 안 해 본 것(-1)이 먼저
    // 여섯 살부터는 집 안의 일을 한 해에 하나까지만 골라, 밖으로 나가 보게 한다
    const out=[], spots=Object.assign({},skip||{}); let home=Object.keys(spots).filter(k=>SPOTS[k].z==='H').length;
    for(const pass of [0,1]) for(const i of el){ const sp=SCENES[i].spot, isH=SPOTS[sp].z==='H'; if(spots[sp]||out.length>=n) continue; if(pass===0&&a>=6&&isH&&home>=1&&!dy&&!this.sick) continue; spots[sp]=1; if(isH) home++; out.push(i); }
    return out;
  }
  // 함께 살 사람: 그 나라의 이름, 하는 일, 버는 돈
  makeSpouse(){ const sx=1-this.sex, sur=pickSur(this,this.sur), given=pickGiven(this,sx,'now'), works=this.sex===1?R()<.95:R()<this.C.flfp;
    return {given,sur,n:joinName(this.c,sur,given,sx===1),sex:sx,works,inc:works?this.C.med*(.55+R()*.6):0}; }
  marry(sp){ const f=this.f, C=this.C; if(f.family) return; f.family=1; this.ppl.spouse=sp; delete this.ppl.pre; f.spInc=sp.inc; f.marA=this.age; (f.ch||(f.ch={})).married=this.age;
    f.kWant=Math.min(7,poisson(C.tfr/C.marShare)); const wed=C.med*({KR:4,IN:8,PK:6,BD:5,NG:4,CN:4,JP:3}[this.c]||2.5); this.cash-=wed; this.mEv-=wed; }
  // 큰 갈림길: 작은 선택으로 쌓인 수치와 성향이 '이루어질 확률'을 만든다
  choiceAt(a){
    const L=this, s=this.s, f=this.f, t=this.tr, U=this.set==='U', cap=(x,m)=>Math.min(x,m), C=this.C, sch=this.sch;
    const o=(label,p,ok,fail)=>({label,p:p==null?null:clamp(p,.03,.97),ok,fail});
    if(a===13&&f.elem&&!f.sec){ let b=C.sec[U?0:1];      // 모두가 중학교에 가지는 못하는 나라
      if(this.c==='AF'&&this.sex===1) return {q:'초등학교를 마쳤다. 하지만 이 나라에서는 2021년부터 여자아이가 중학교에 다닐 수 없게 되었다.',opts:[
        o('집에서 혼자 책을 읽으며 공부를 이어 간다',null,['책을 구해 혼자 공부를 이어 갔다.',{k:3,j:-2},()=>{f.school=0}]),
        o('집안일과 생업을 돕는다',null,['학교 대신 가족의 일을 돕기 시작했다.',{r:4,j:-3},()=>{f.school=0}]) ]};
      return {q:'초등학교를 마쳤다. 다음 길은?',opts:[
        o(`${sch.mid}에 진학한다`,b+FAM[this.famI].w*.6+s.k/100*.15+cap(t.D,30)*.004,[`${sch.mid}에 진학했다.`,{k:4,j:4},()=>{f.sec=1}],['학비와 먼 거리 때문에 진학하지 못하고 일을 돕기 시작했다.',{j:-6},()=>{f.school=0}]),
        o('집안일과 생업을 돕는다',null,['학교를 떠나 가족의 일을 돕기 시작했다.',{r:5},()=>{f.school=0}]) ]}; }
    if(a===16&&f.sec){ const KR=this.c==='KR', sy=sysOf(this), gate=sy.x1&&sy.x1.gate&&f.mex!=null, gp=gate?clamp(.12+f.mex*1.15,.08,.97):null, opts=[
      o(KR?`${sch.high}(일반고)에 간다`:gate?`${sch.high}(일반 고등학교)에 지원한다`:`${sch.high}에서 공부를 계속한다`,gp,[gate?`${sy.x1.n} 성적으로 ${sch.high}에 합격했다.`:`${sch.high}에 진학했다.`,{k:3},()=>{f.hs='gen'}],[`${sy.x1?sy.x1.n:'시험'} 성적이 합격선에 조금 못 미쳤다. ${sch.voc}에 가게 되었다.`,{j:-5},()=>{f.hs='voc'}]),
      o(KR?`${sch.voc}(특성화고)에서 기술을 배운다`:`${sch.voc}에서 직업 기술을 배운다`,null,[`${sch.voc}에서 기술을 배우기 시작했다.`,{k:2,j:2},()=>{f.hs='voc'}]) ];
      if(KR&&f.hsWish==='sp'){ const nm=`${this.town||C.city} ${pickOne(['과학','외국어','국제'])}고등학교`; opts.unshift(o(`${nm}(특목고)에 지원한다`,clamp(.08+Phi((this.acInit()-62)/12)*.7,.05,.85),[`${nm}에 합격했다! 합격 문자를 받고 가족 모두가 소리를 질렀다.`,{k:5,j:6},()=>{f.hs='gen'; sch.high=nm}],[`${nm}에는 떨어졌다. ${sch.high}(일반고)로 배정되었다.`,{j:-4},()=>{f.hs='gen'}])); }
      if(KR&&f.hsWish==='voc') opts.reverse();
      if(!U){ const city=C.city; opts.push(o(`${city}의 고등학교로 떠난다`,.3+s.k/100*.4+L.w*.15+cap(t.B,30)*.005,[`${city}의 고등학교에 합격해 기숙사 생활을 시작했다.`,{k:5,r:-4},()=>{f.hs='gen'; sch.high=`${city} ${pickOne(['중앙','제1','국립'])} 고등학교`}],[`합격하지 못해 ${sch.high}에 갔다.`,{j:-4},()=>{f.hs='gen'}])); }
      return {q:`${josa(sch.mid,'을','를')} 마쳤다. 어느 고등학교에 갈까?`,opts}; }
    if(a===19||(a===21&&f.retry)){ const sy=sysOf(this), KR=this.c==='KR', q0=f.uex!=null?f.uex:Phi((this.acInit()-50)/17)*.9+.05, again=a===21;
      const base=KR?.3:[-.15,-.02,.15,.3][C.tier-1], pU=base+q0*.5+L.w*.12+cap(t.D,40)*.004+(f.hs==='gen'?.05:0)+(again?.05:0), un=pickUnivQ(this,q0), mj=f.major||pickOne(MAJORS_U);
      const enter=(nm)=>()=>{ f.univ=1; f.school=1; f.univA=a; f.retry=0; sch.univ=nm; f.major=mj; };
      const opts=[];
      if(f.uOffer&&!again) opts.push(o(`수시로 합격한 ${f.uOffer}에 입학한다`,null,[`${f.uOffer} ${mj}에 입학했다. 입학식 날, 학교 이름이 새겨진 점퍼를 처음 입었다.`,{k:8,j:8},enter(f.uOffer)]));
      else opts.push(o(`${KR?(again?'다시 ':'정시로 '):''}대학(${un} ${mj})에 지원한다`,pU,[`${un} ${mj}에 합격했다!${f.uex!=null?' 성적표를 몇 번이고 다시 보았다.':''}`,{k:8,j:6},enter(un)],[again?'이번에도 합격하지 못했다. 다른 길을 찾아보기로 했다.':'불합격 소식을 들었다. 눈앞이 캄캄했다.',{j:-6},()=>{ f.retry=0; f.school=again?0:f.school; if(again) f.needJob=1; else f.uFail=1; }]));
      opts.push(o('바로 일자리를 구한다',null,[f.hs==='voc'?'배운 기술로 일자리를 알아보기로 했다.':'일자리를 알아보기로 했다.',{j:2,r:2,k:f.hs==='voc'?3:0},()=>{ f.needJob=1; f.retry=0; f.school=0; }]));
      if(!again) opts.push(U? o('1년 동안 하고 싶은 일을 찾아본다',null,['아르바이트를 하며 하고 싶은 일을 찾아다녔다.',{j:4,k:2},()=>{setJob(L,'day');t.C+=3}])
                 : o('부모님의 일을 잇는다',null,['부모님 곁에서 집안일과 농사를 배우기 시작했다.',{r:5,h:2},()=>{setJob(L,'farm')}]));
      if(!f.sec) opts.shift();
      return {q:again?'다시 본 시험의 결과가 나왔다. 대학에 지원할 차례다.':f.uOffer?`${f.uOffer}에 합격해 두었다. 어른이 되는 문턱에 섰다.`:'어른이 되는 문턱에 섰다.',opts}; }
    if(a===25&&f.job) return jobMenu(L,'스물다섯, 지금 하는 일을 계속할까, 다른 일에 도전할까?',1);
    if(a===marAgeOf(this)&&!f.family){ const sp=this.ppl.pre||this.makeSpouse(), nm=sp.n, dated=!!(f.ch&&f.ch.dating!=null), drop=()=>{ delete this.ppl.pre; };
      return {q:dated?`${josa(nm,'과','와')} 사귄 지 몇 해가 지났다. 앞으로를 어떻게 할까?`:`${josa(nm,'과','와')} 만난 지 몇 해가 지났다. 곁에 누구와 함께할까?`,opts:[
      o(`${josa(nm,'과','와')} 가정을 꾸린다`,C.marP+s.r/100*.3+cap(t.K,60)*.004+(L.w-.5)*.1,[`${josa(nm,'과','와')} 결혼했다. 고마운 사람들이 모두 모여 축하해 주었다.`,{j:10,r:8},()=>{this.marry(sp)}],[`${josa(nm,'과','와')}는 끝내 헤어졌다. 아직 인연이 아니었다.`,{j:-5},drop]),
      o('일과 꿈에 집중한다',null,['일과 꿈에 더 많은 시간을 썼다.',{k:5,j:2,r:-3,$:8},drop]),
      o('친구·이웃과 가깝게 지낸다',null,['친구와 이웃이 가족 같아졌다.',{r:8,j:3},drop]) ]}; }
    if(a===45) return {q:'인생의 한가운데에 섰다.',opts:[
      o('일을 바꿔 새로 도전한다',null,['새로운 일을 찾아보기로 했다.',{k:2},()=>{f.needJob=2}]),
      o('건강을 챙긴다',null,['몸을 돌보는 일을 가장 먼저 두기로 했다.',{h:10}]),
      o('가족·친구와 시간을 보낸다',null,['소중한 사람들과 보내는 시간을 늘렸다.',{r:10,j:5}]) ]};
    const ra=retAgeOf(this);
    if(f.job&&!f.inf&&!f.school&&!f.retCh&&ra&&a+this.step>ra&&a<70&&f.job!=='abroad'){ f.retCh=1; const I=instOf(this), pn=I.pen||'연금';
      return {q:`이 나라의 정년(${ra}세)이 다가왔다. ${f.co||'일터'}에서 일한 날들을 정리할 때다.`,opts:[
        o(`정년퇴직하고 ${josa(pn,'을','를')} 받으며 쉰다`,null,[`${f.co||'일터'}에서 정년퇴직했다. 동료들이 꽃다발을 안겨 주었다. 이제 다달이 ${josa(pn,'이','가')} 들어온다.`,{j:6,h:3},()=>{this.retire()}]),
        o('계약직으로 다시 일한다 (월급은 줄어든다)',null,['정년 뒤에도 같은 일터에서 계약직으로 일을 이어 갔다. 월급은 줄었지만 아침에 나갈 곳이 있었다.',{k:2,j:2},()=>{ this.inc=this.payClamp(this.inc*.62); f.inf=1; }]),
        o('그동안 모은 돈으로 작은 가게를 연다',.55+this.s.r/400,['작은 가게를 열었다. 평생 처음 내 가게의 문을 여는 아침이었다.',{j:6},()=>{ setJob(this,'shopown'); f.inf=1; }],['가게를 알아보다 마땅한 곳을 찾지 못해 그냥 쉬기로 했다.',{j:-2},()=>{this.retire()}]) ]}; }
    if(a===61&&!f.retired&&!f.retCh) return {q:'예순을 넘겼다. 남은 시간을 어떻게 쓸까?',opts:[
      o('하던 일을 계속한다',null,['익숙한 일을 계속 이어 갔다.',{j:2,h:-3,k:2}]),
      o('일을 내려놓고 하고 싶던 것을 한다',null,['일을 내려놓고 미뤄 둔 것들을 시작했다.',{j:8,h:3},()=>{this.retire()}]),
      o('이웃과 아이들을 돕는다',null,['이웃과 아이들을 돌보며 지냈다.',{r:10,j:5},()=>{this.retire()}]) ]};
    return null;
  }
  // 월급은 그 나라 보통 벌이의 일정 범위 안에서 움직인다 (일의 종류에 따라 위쪽 끝이 다르다)
  payClamp(m){ const j=this.job, C=this.C; return clamp(m,C.med*.12,C.med*Math.max(4,(j?j.mul:1)*(j&&j.kind==='dream'?5:2.6))); }
  retire(){ this.f.job=null; this.f.retired=1; this.inc=pension(this); }
  // 행복은 돈만으로 정해지지 않는다: 살림 · 나라의 형편 · 관계 · 감사하는 마음 · 함께 웃는 문화 · 건강이 함께 만든다
  joyParts(){ const s=this.s, C=this.C, debt=this.cash<0?Math.min(6,-this.cash/(C.med*12)*.8)*(this.house?.4:1):0;
    return { m:(this.w-.5)*16-debt, n:clamp(Math.log2(C.gni/5)*1.2,-4,4), r:(s.r-50)*.22, g:Math.min(this.tr.G,40)*.35, c:C.joy, h:(s.h-50)*.08 }; }
  // 수치가 높을수록 더 올리기는 어려워진다. 감사하는 마음이 쌓이면 나쁜 일에 덜 흔들린다
  apply(fx){ if(!fx) return; const C=this.C; for(const k in fx){ const v=fx[k];
    if(k==='$'){ if(this.f.job&&v){ this.inc=this.payClamp(this.inc*(1+v/100)); this.maxInc=Math.max(this.maxInc,this.inc); } continue; }
    if(k==='x'){ if(this.f.job&&v){ const old=loseJob(this); this.remember({a:this.age,t:old.id===this.job.id?`${old.n} 일감이 끊겼다. 한동안 이곳저곳을 다니며 일을 구했다.`:`${old.n} 일을 잃고 ${this.job.n} 일을 시작했다.`,big:1,sc:'jobloss',q:this._why}); } continue; }
    if(k==='@'){ const d=v*C.med*(v<0?(this._mScale||1):1); this.cash+=d; this.mEv+=d; continue; }
    if(k==='%'){ if(this.cash>0){ const d=this.cash*v/100; this.cash+=d; this.mEv+=d; } continue; }
    if(k==='H'){ if(v>0&&!this.house){ let p=this.housePrice()*v/100; const can=(Math.max(this.cash,0)+this.debtCap()*.5)/.2; if(p>can) p=Math.max(can,p*.35); /* 집값의 20% 남짓은 모은 돈으로 — 모자라면 더 작은 집 */ this.house=p; this.cash-=p; this.mHouse-=p; this.f.houseA=this.age; this.f.houseN=(this.f.houseN||0)+1; }
      else if(v<0&&this.house){ this.cash+=this.house; this.mHouse+=this.house; this.house=0; } continue; }
    if(k==='V'){ if(this.house) this.house*=1+v/100; continue; }
    if(k==='M'){ if(!this.f.family) this.marry(this.ppl.pre||this.makeSpouse()); continue; }
    if(!(k in this.s)) continue;
    let d=v; if(v>0) d=v*Math.min(1,(104-this.s[k])/60); else if(k==='j') d=v*(1-Math.min(this.tr.G,40)*.01);
    this.s[k]=clamp(this.s[k]+d,0,100); } }
  // 한 해(어른은 두 해)를 시작한다: 작은 선택들, 그해의 큰 사건 수, 아플지
  startPeriod(){
    if(this.dead) return null; const a=this.age, f=this.f; this.trimMem();
    if(!f.dying&&!this.pending&&!this.done[a]){ const ch=this.choiceAt(a); if(ch) this.pending=ch; }
    if(!f.dying&&!this.pending&&f.needJob) this.pending=this.jobChoice();
    if(!this.cur){ const ps=clamp(.06+(60-this.s.h)/100*.45+(a>=65?.15:0)+(a<5?.1:0)+(this.C.tier<=2?.05:0),.03,.6);
      this.sick=0; const ml=f.dying?[]:this.planMajors(this.pace==='short'?(a<19?1:2):(a<6?1:a<19?2:3)); this.cur={scenes:this.pickScenes().map(i=>({i,done:0})),t:null,plan:ml.length,ml,mDone:0,el:0,cal:null,sk:!f.dying&&R()<ps?{at:.22+R()*.45,n:illnessOf(this)}:null}; }
    this.ensureCal();
    return this.cur;
  }
  // 아픔: 며칠 집에서 앓아눕는다 (화면에서는 집으로 돌아가 느리게 움직인다)
  getSick(name){ const n=name||(this.cur&&this.cur.sk?this.cur.sk.n:illnessOf(this)); if(this.cur) this.cur.sk=null; this.sick=1;
    const fx={h:-3,j:-2}; this.apply(fx); const cost=this.C.tier<=2?.3:0; if(this.age>=19&&cost){ const d=-cost*this.C.med; this.cash+=d; this.mEv+=d; }
    const t=`${josa(n,'으로','로')} 며칠 동안 집에서 앓아누웠다.`; this.remember({a:this.age,t,ev:1,sc:'sick'}); return {n,t,fx}; }
  getWell(){ this.sick=0; }
  jobChoice(){ const second=this.f.needJob===2, lost=this.f.lostJob&&jobInfo(this,this.f.lostJob); return jobMenu(this,lost?`${lost.n} 일을 잃은 뒤 ${this.job?this.job.n+' 일로':'임시로'} 버티고 있다. 하던 일과 비슷한 일자리를 다시 알아볼까?`:second?'어떤 일에 새로 도전해 볼까?':this.f.univDone?`${josa(this.sch.univ,'을','를')} 마쳤다. 어떤 일을 할까?`:'어떤 일을 하며 살까?',second); }
  // 대학에 떨어졌을 때: 한 해 더 준비할까, 일을 시작할까
  retryChoice(){ const sy=sysOf(this), f=this.f, re=(sy.x2&&sy.x2.re)||this.c==='KR';
    const opts=[{label:'일자리를 알아본다',p:null,ok:['일자리를 알아보기로 했다.',{j:1},()=>{ f.needJob=1; f.school=0; }]}];
    if(re&&this.age<21) opts.unshift({label:this.c==='KR'?'재수를 한다 (한 해 더 준비해 다시 수능을 본다)':'한 해 더 준비해 다시 시험을 본다',p:null,ok:['한 해 더 준비해 다시 도전하기로 했다.',{k:2,j:-2},()=>{ f.retry=1; f.school=1; }]});
    return {q:'대학에 떨어졌다. 앞으로 어떻게 할까?',opts}; }
  choose(i){
    const ch=this.pending, o=ch.opts[i]; this.pending=null; this.done[this.age]=1; this.cross++; this._why=ch.q; const mq={q:ch.q,l:o.label};
    let ok=true; if(o.p!=null) ok=R()<o.p;
    if(ch.job){                                   // 일자리 고르기
      this.f.needJob=0;
      if(o.keep) { const t=`지금 하는 일(${this.job.n})을 계속하기로 했다.`; this.remember(Object.assign({a:this.age,t,big:1,sc:'job'},mq)); return {t,fx:{j:2},p:null,ok:true,label:o.label,sc:'job'}; }
      if(ok){ const j=setJob(this,o.job), fx={j:6,k:2}; this.apply(fx); const t=`${this.f.co}에서 ${j.n} 일을 시작했다. 첫 달 월급은 약 ${josa(fmtPay(this.inc),'이었다','였다')}.`; this.remember(Object.assign({a:this.age,t,big:1,sc:'job'},mq)); return {t,fx,p:o.p,ok,label:o.label,sc:'job'}; }
      const want=jobInfo(this,o.job), fx={j:-5};
      if(!this.f.job){ const fb=['sig'].concat(Object.keys(JOBS)).filter(id=>id!==o.job&&famOfJob(this,id)===famOfJob(this,o.job)&&famOfJob(this,id)!=='dream').map(id=>jobInfo(this,id)).filter(x=>jobOK(this,x)&&jobP(this,x)>=.5).sort((p,q)=>jobP(this,q)-jobP(this,p))[0];
        const j=setJob(this,fb?fb.id:this.set==='R'?'farm':'day'); this.apply(fx); const t=`${want.n}의 꿈은 이루지 못했다. 우선 ${this.f.co}에서 ${j.n} 일을 시작했다. 한 달에 약 ${josa(fmtPay(this.inc),'을','를')} 번다.`; this.remember(Object.assign({a:this.age,t,big:1,sc:'jobloss'},mq)); return {t,fx,p:o.p,ok,label:o.label,sc:'jobloss'}; }
      this.apply(fx); const t=`${want.n}에 도전했지만 뜻을 이루지 못했다. 하던 일(${this.job.n})을 계속했다.`; this.remember(Object.assign({a:this.age,t,big:1,sc:'jobloss'},mq)); return {t,fx,p:o.p,ok,label:o.label,sc:'jobloss'};
    }
    const r=ok?o.ok:o.fail; if(r[2]) r[2](); this.apply(r[1]);
    const sc=sceneKindOf(r[0]); this.remember(Object.assign({a:this.age,t:r[0],big:1,sc},mq,ok?{}:{f:1})); this._why=null;
    if(this.f.uFail){ this.f.uFail=0; this.pending=this.retryChoice(); }
    else if(this.f.needJob) this.pending=this.jobChoice();      // 일자리를 구하기로 했다면 바로 이어서 고른다
    return {t:r[0],fx:r[1],p:o.p,ok,label:o.label,sc};
  }
  // 한 해 안에서도 새 일이 계속 생긴다: 끝낸 일은 치우고 새 장면을 하나 더한다
  spawn(){ if(!this.cur) return -1; this.cur.scenes=this.cur.scenes.filter(c=>!c.done); const skip={}; this.cur.scenes.forEach(c=>skip[SCENES[c.i].spot]=1);
    const live=this.cur.scenes.map(c=>c.i), got=this.pickScenes(live.length+1,skip).filter(i=>!live.includes(i)); if(!got.length) return -1; this.cur.scenes.push({i:got[0],done:0}); return got[0]; }
  // 작은 선택이 '잘될 확률': 관련 수치와 쌓인 성향이 만든다. 얻는 것이 없는 선택은 확률이 없다
  optP(o){ const pos=Object.keys(o.fx).filter(k=>o.fx[k]>0&&k in this.s); if(!pos.length&&!o.tr) return null; const st=((pos.length?this.s[pos[0]]:this.s.j)+60)/2; return clamp(.62+(st-50)/100*.5+Math.min(o.tr?this.tr[o.tr]:0,40)*.004,.25,.95); }
  doScene(k,oi){
    this._why=null; const c=this.cur.scenes[k]; if(!c||c.done) return null; const sc=SCENES[c.i], o=sc.opts[oi], p=this.optP(o), ok=p==null||R()<p;
    const sq=this.tx(Array.isArray(sc.txt)?sc.txt[this.set==='U'?0:1]:sc.txt), sl=this.tx(o.l);
    let fx=o.fx, t=this.tx(o.res); if(!ok){ fx={}; for(const key in o.fx) if(o.fx[key]<0) fx[key]=o.fx[key]; t=failTx(this.tx(o.l)); this.fail++; }
    const base=t; t=this.vary(base,sq);
    c.done=1; this.n++; this.apply(fx); if(o.tr) this.tr[o.tr]++;
    if((sc.spot==='mom'||sc.spot==='dad')&&o.tr==='K') this.f.pv=(this.f.pv||0)+1;
    this.recent.push(c.i); if(this.recent.length>30) this.recent.shift();
    this.remember({a:this.age,t:base,q:sq,l:sl,tr:ok?(o.tr||''):'',sc:sc.req==='dying'?'farewell':undefined,sp:sc.spot,f:ok?undefined:1});
    return {t,fx,tr:o.tr,p,ok};
  }
  // 그해의 큰 사건: 한 해에 정해진 수만큼 찾아온다. rep 표시가 있는 일은 여섯 해가 지나면 다시 일어날 수 있다
  // 큰 사건 선택지의 '될 가능성': 얻는 것이 클수록 어렵고(위험과 보상), 관련 능력치와 쌓인 성향이 높일수록 쉬워진다. 선택지마다 고유한 난이도도 조금씩 다르다
  majorP(o){ let sum=0,n=0,tb=0; for(const c of o.deps){ if(c in this.s&&c!=='h'){ sum+=this.s[c]; n++; } else if(c==='h'){ sum+=this.s.h; n++; } else if(c==='w'){ sum+=this.w*100; n++; } else if(c in this.tr) tb+=Math.min(this.tr[c],40)*.0025; }
    let gain=0; for(const k in (o.okFx||{})) if(o.okFx[k]>0&&k in this.s) gain+=o.okFx[k]; let loss=0; for(const k in (o.failFx||{})) if(o.failFx[k]<0&&k in this.s) loss-=o.failFx[k];
    let h=7; for(const c of String(o.l)) h=(Math.imul(h,31)+c.charCodeAt(0))>>>0; const jit=((h%1000)/1000-.5)*.26;
    return clamp(.74-gain*.04+loss*.006+((n?sum/n:50)-50)/100*.42+tb+jit,.08,.93); }
  majorLeft(){ const c=this.cur; if(!c||this.f.dying) return 0; if(!c.ml) return Math.max(0,c.plan-c.mDone); let n=0; for(let k=c.mDone;k<c.ml.length;k++) if(this.majorOK(c.ml[k])) n++; return n; }
  addMajor(){ const c=this.cur; if(!c||!c.ml||c.noMore) return false; const got=this.planMajors(8).filter(i=>!c.ml.includes(i)); if(!got.length){ c.noMore=1; return false; } c.ml.push(got[0]); c.plan=c.ml.length; return true; }
  major(){ if(!this.cur||this.f.dying) return null; if(this.cur.m!=null) return this.cur.m; const c=this.cur;
    if(!c.ml){ c.ml=new Array(c.mDone).fill(-1).concat(this.planMajors(Math.max(0,c.plan-c.mDone))); c.plan=c.ml.length; }
    while(c.mDone<c.ml.length){ const i=c.ml[c.mDone]; if(i>=0&&this.majorOK(i)) return c.m=i; c.mDone++; } return null; }
  majorOld(){ if(!this.cur||this.f.dying) return null; if(this.cur.m!=null) return this.cur.m; const a=this.age, C=this.C, el=[], w=[];
    MAJORS.forEach((m,i)=>{ const u=this.usedM[i]; if(!this.inC(m)||a<m.a[0]||a>m.a[1]||(m.set!=='*'&&m.set!==this.set)||!this.reqOK(m.req)) return;
      if(m.hz&&!C.hz.includes(m.hz)) return; if(m.maxTier&&C.tier>m.maxTier) return; if(m.minTier&&C.tier<m.minTier) return;
      if(u!=null&&(!m.rep||a-u<6)) return;
      el.push(i); w.push((m.c?2.2:1)*(m.hz?1.6:1)*(m.req&&/^(jk:|sig)/.test(m.req)?1.5:1)*(m.money||1)); });   // 그 나라·지역에만 있는 일, 재해, 하는 일·돈과 관련된 일이 더 자주
    if(!el.length) return null; const s=w.reduce((x,y)=>x+y,0); let x=R()*s; for(let i=0;i<el.length;i++){ x-=w[i]; if(x<0) return this.cur.m=el[i]; } return this.cur.m=el[0]; }
  chooseMajor(oi){ const i=this.cur.m, m=MAJORS[i], o=m.opts[oi], p=this.majorP(o), ok=R()<p, fx=ok?o.okFx:o.failFx;
    this.usedM[i]=this.age; this.cur.m=null; this.cur.mDone++; if(ok&&m.rk&&this.f.job) this.rankUp(); const mq=this.tx(m.txt), ml=this.tx(o.l); this._why=mq;
    this._mScale=m.medical?this.C.medCost:1; this.apply(fx); this._mScale=1;
    const base=this.tx(ok?o.ok:o.fail), t=this.vary(base,mq); this._why=null; this.n++; if(!ok) this.fail++; if(o.tr) this.tr[o.tr]++;
    const sc=m.sc||m.hz||sceneKindOf(m.txt), sick=(sc==='sick'||sc==='hosp')&&!ok||(fx.h||0)<=-8; this.remember({a:this.age,t:base,q:mq,l:ml,big:1,sc,f:ok?undefined:1}); return {t,fx,p,ok,label:o.l,sc,sick}; }
  // 미션: 부탁 → 다녀오기 → 돌아와 알리기
  questOffer(){ if(this.q||!this.cur||this.f.dying||this.sick) return null; const a=this.age, el=[]; QUESTS.forEach((q,i)=>{ const z=SPOTS[q.target].z; if(this.inC(q)&&a>=q.a[0]&&a<=q.a[1]&&(q.set==='*'||q.set===this.set)&&this.spotOK(q.giver)&&this.spotOK(q.target)&&(z!=='D'||a<75)&&this.reqOK(q.req)&&this.lastQ!==i) el.push(i); }); if(!el.length) return null; return this.q={i:pickOne(el),st:0}; }
  questAccept(yes){ if(!yes){ this.lastQ=this.q.i; this.q=null; } else this.q.st=1; }
  questP(){ const q=QUESTS[this.q.i]; return clamp(.58+((this.s[q.stat]+60)/2-50)/100*.5+Math.min(this.tr[q.tr],40)*.005,.3,.95); }
  questDo(){ const p=this.questP(); this.q.ok=R()<p?1:0; this.q.st=2; return {p,ok:this.q.ok}; }
  questEnd(){ const q=QUESTS[this.q.i], ok=!!this.q.ok, fx=ok?q.fx:{}, t=this.tx(ok?q.ok:q.fail); this.apply(fx); this.tr[q.tr]++; this.n++; if(!ok) this.fail++; if(q.giver==='mom'||q.giver==='dad') this.f.pv=(this.f.pv||0)+1; this.remember({a:this.age,t,tr:q.tr,q:this.tx(q.ask),l:'부탁을 들어주었다'}); this.lastQ=this.q.i; this.q=null; return {t,fx,ok}; }
  // 해를 넘기기 전 남은 일을 '확률이 가장 높은 선택'으로 정한다 (교사용). 확률 표시가 없는 갈림길 선택은 100%로 본다
  autoResolve(){ const log=[]; let g=0;
    while(this.pending&&g++<6){ const ch=this.pending; let bi=0,bp=-1; ch.opts.forEach((o,i)=>{ const p=o.p==null?1:o.p; if(p>bp){ bp=p; bi=i; } }); const q=ch.q, r=this.choose(bi); log.push({kind:ch.job?'일자리 고르기':'큰 갈림길',q,label:r.label,p:r.p,ok:r.ok,t:r.t,sc:r.sc}); }
    if(this.cur&&!this.f.dying){ let gg=0;
      while(this.cur.mDone<this.cur.plan&&gg++<8){ const mi=this.major(); if(mi==null){ this.cur.mDone++; continue; } const m=MAJORS[mi]; let bi=0,bp=-1; m.opts.forEach((o,i)=>{ const p=this.majorP(o); if(p>bp){ bp=p; bi=i; } }); const q=this.tx(m.txt), r=this.chooseMajor(bi); log.push({kind:'큰 사건',q,label:this.tx(r.label),p:r.p,ok:r.ok,t:r.t,sc:r.sc}); } }
    if(this.cur) this.cur.scenes.forEach((c,k)=>{ if(c.done) return; const sc=SCENES[c.i]; let bi=-1,bp=-1; sc.opts.forEach((o,i)=>{ const p=this.optP(o); if(p!=null&&p>bp){ bp=p; bi=i; } }); this.doScene(k,bi<0?0:bi); });
    if(this.q){ if(this.q.st===1) this.questDo(); if(this.q.st===2) this.questEnd(); else this.q=null; }
    this.ensureCal(); log.cal=this.calAuto();
    return log; }
  evP(e){ let p=e.p; const s=this.s; for(const m of (e.m||'').split(' ')){ if(!m) continue; const key=m.slice(0,-1), x=key==='w'?this.w:s[key]/100; p*= m.slice(-1)==='+'?.4+1.2*x:1.6-1.2*x; } return clamp(p,.005,.6); }
  // 돈: 번 돈 − 쓴 돈(생활비·집세·아이·학비) ± 이자. 모자라면 먼저 모은 돈을 쓰고, 그래도 모자라면 빚을 진다
  // 빚은 두 가지: 집을 사며 진 대출(집값의 80%까지)과 그 밖의 빚(신용대출). 그 밖의 빚은 한도(debtCap)를 넘지 못한다 —
  // 한도에 닿으면 버는 만큼만 쓰며 살림을 줄이고, 처음 크게 넘칠 때는 채무 조정(개인회생)을 받는다. 노년의 빚이 끝없이 불어나지 않게.
  debtCap(){ const C=this.C, yi=(this.inc||0)*12; return Math.max(12*C.med*(C.tier>=3?1.5:1),yi*(C.tier>=3?1.2:.8)); }
  debtParts(){ const d=Math.max(0,-this.cash), mort=this.house?Math.min(d,this.house*.8):0; return {mort,uns:d-mort}; }
  ledger(step){ const C=this.C, f=this.f, a=this.age, med=C.med, U=this.set==='U', t=C.tier;
    if(a<19&&!f.univ){ this.mEv=0; this.mHouse=0; return null; }
    let inc=0, tuition=0;
    let student=false; if(f.school&&f.univ){ student=true; inc=med*.25*12*.5; tuition=C.tuition*med*(1-[1,.5,.1][this.famI]); }
    else if(f.retry){ student=true; inc=0; tuition=med*12*.25*(1-[1,.5,.1][this.famI]); }
    else inc=(this.inc||0)*12;
    if(f.family) inc+=(f.spInc||0)*12*(a>=65?.45:1);
    const kh=this.kidsHome().length, ae=1+(f.family?.6:0)+.3*kh, old=(f.retired||a>=65)?.8:1;
    const living=student?12*med*.12:12*med*(t<=2?.32:.42)*ae*old, home=student?0:(this.house?this.house*.012:12*med*(t<=2?(U?.15:.05):(U?.2:.1))), kids=student?0:kh*12*med*(this.c==='KR'?.3:.18);
    const needs=living+home+kids+tuition;   // 대학생은 대개 부모님 집에서 지낸다
    // 꼭 써야 하는 돈(먹고 자고 아이 키우는 최소한). 벌이가 그보다 많으면 사람들은 버는 만큼에 맞춰 줄여 산다
    const ess=student?needs:(living*.62+home*.7+kids*.55)*(this.house?.9:1);
    const dp=this.debtParts(), cap=this.debtCap();
    // 남는 돈의 일부를 모은다. 빚이 있으면 갚는 데 더 많이 쓴다(집 대출은 매달 갚아 나간다)
    let spend, tight=0;
    if(inc>=needs) spend=needs+(this.cash<0?.45:.85)*(inc-needs);
    else if(inc>=ess) spend=this.cash<0?inc*.9:inc*.97;                       // 넉넉하지 않아도 버는 만큼에 맞춰 산다
    else if(this.cash>ess-inc) spend=ess;                                      // 모아 둔 돈으로 메운다
    else if(dp.uns<cap) spend=inc+Math.max(0,this.cash)/step+(ess-inc-Math.max(0,this.cash)/step)*.6;   // 조금씩 빌려 쓴다
    else { spend=Math.max(inc,0)*.92; tight=1; }                                  // 더는 빌릴 수 없다: 버는 만큼만 쓰며 버틴다
    if(this.mEv<0) spend-=Math.min(-this.mEv/step*.6,Math.max(0,spend-ess));   // 큰돈이 든 해에는 다른 씀씀이를 줄인다
    const rate=this.cash>=0?(t>=3?.01:.02):null, intr=rate!=null?this.cash*rate:-(dp.mort*.035+dp.uns*.06);
    const before=this.cash-this.mEv-this.mHouse;   // 이번 해 큰일로 바뀌기 전 돈
    this.cash+=(inc-spend+intr)*step; this.earned+=inc*step;
    // 그 밖의 빚이 한도의 1.8배를 넘으면: 처음 한 번은 채무 조정으로 줄이고, 그 뒤로는 한도에서 더 늘지 않는다(줄여 살며 버틴다)
    let note=null; const d2=this.debtParts();
    if(d2.uns>cap*1.8){ if(!f.rehab&&a>=19){ f.rehab=a; const cut=d2.uns-cap*.4; this.cash+=cut; note=`빚이 감당할 수 없을 만큼 불어나 법원의 채무 조정(개인회생)을 받았다. 빚의 일부를 줄여 받고, 몇 해 동안 아껴 쓰며 나머지를 갚아 나가기로 했다.`; }
      else this.cash+=d2.uns-cap*1.8; }
    if(this.house) this.house*=Math.pow(1+(U?(t>=3?.012:.01):.003)+gauss()*.02,step);
    const e={a,step,inc:inc*step,spend:spend*step,int:intr*step,ev:this.mEv,hb:this.mHouse,cash:this.cash,house:this.house,prev:before,need:needs*step,ess:ess*step};
    if(tight) e.tight=1; if(note) e.note=note;
    f.tightY=tight?(f.tightY||0)+step:0;
    this.mEv=0; this.mHouse=0; this.money.push(e); if(this.money.length>60) this.money.shift(); this.maxNW=Math.max(this.maxNW||0,this.nw); return e; }
  // 한 해(어른은 두 해)를 마무리한다
  endPeriod(){
    const a=this.age, step=this.step, s=this.s, f=this.f, C=this.C, out=[]; this._why=null;
    const add=(t,fx,big,sc,x)=>{ t=this.tx(t); this.apply(fx); out.push(Object.assign({t,fx:fx||null,big:big?1:0,sc:sc||(big?sceneKindOf(t):null)},x||{})); this.remember(Object.assign({a,t,big:big?1:0,ev:1,sc:big?(sc||sceneKindOf(t)):null},x||{})); };
    if(this.cur){ this.ensureCal(); const left=this.calAuto(); if(left.length&&this.cur.el>0) out.push({t:`올해 남은 일 ${left.length}가지는 저절로 지나갔다. (${left.slice(0,2).map(r=>(r.m>12?r.m-12:r.m)+'월').join(', ')}${left.length>2?' …':''})`,fx:null,big:0}); }
    if(this.cur) this.epiEnd();
    if(this.cur) this.miss+=this.cur.scenes.filter(x=>!x.done).length+(this.q&&this.q.st>0?1:0); this.q=null; this.sick=0;
    if(a===1&&this.c==='KR'){ const d=pickOne(DOL); add(`돌잔치에서 ${josa(d[0],'을','를')} 잡았다. ${d[1]}`,d[2],0); }
    if(!this.fam){
    if(this.gran&&!f.ggone&&a>=9&&R()<.13){ f.ggone=1; add(`할머니(${this.ppl.gran?this.ppl.gran.n:''})가 먼 길을 떠나셨다. 할머니의 옛이야기가 오래 생각났다.`,{j:-6},1,'farewell'); }
    if(!f.pgone&&a>=51&&R()<.2){ f.pgone=1; const near=(f.pv||0)>=6, inh=C.med*[80,15,0][this.famI]*(C.tier>=3?1:.5);
      add(`${near?'부모님을 떠나보냈다. 함께 보낸 시간이 많아 고마운 마음이 더 컸다.':'부모님을 떠나보냈다. 더 자주 찾아뵐걸 하는 마음이 남았다.'}${inh>0?` 부모님이 남겨 주신 ${fmtWon(inh)}을 물려받았다.`:''}`,{j:near?-5:-10},1,'farewell'); if(inh>0){ this.cash+=inh; this.mEv+=inh; } }
    }
    // 함께 늙어 가던 사람이 먼저 떠나기도 한다
    if(f.family&&!f.widow&&a>=50&&this.ppl.spouse){ const qs=(.0005+.05*Math.exp(.095*(a+(this.sex===0?-2:2)-C.ref)))*(this.sex===0?.8:1.25);
      if(R()<1-Math.pow(1-clamp(qs,0,.6),step)){ const sp=this.ppl.spouse; f.widow=1; f.widA=a; f.family=0; f.spInc=0; add(`평생을 함께한 ${josa(sp.n,'이','가')} 먼저 세상을 떠났다. 함께 걷던 길이 오래 생각났다.`,{j:-12,r:-6},1,'farewell'); } }
    // 아이: 그 나라 출산율에 맞춰 원하는 만큼, 두 해 이상 터울을 두고
    if(f.family&&this.kids.length<(f.kWant||0)&&a<44&&a-(f.lastKid==null?-9:f.lastKid)>=2&&R()<(a<38?.55:.25)*Math.min(step,1.6)){
      const sx=R()<.512?0:1, sur=this.sex===0?this.sur:(this.ppl.spouse?this.ppl.spouse.sur:this.sur), given=this.newGiven(sx);
      const k={given,sur,n:joinName(this.c,sur,given,sx===1),sex:sx,b:a}; this.kids.push(k); f.kid=1; if(f.kidBorn==null) f.kidBorn=a; f.lastKid=a;
      const ki=this.kids.length-1, ord=['첫째','둘째','셋째','넷째','다섯째','여섯째','일곱째'][ki];
      if(f.twins){ f.twins=0; const sx2=R()<.5?sx:1-sx, g2=this.newGiven(sx2); const k2={given:g2,sur,n:joinName(this.c,sur,g2,sx2===1),sex:sx2,b:a}; this.kids.push(k2);
        add(`쌍둥이 ${josa(k.n,'과','와')} ${josa(k2.n,'이','가')} 태어났다. 두 아이가 동시에 울 때면 정신이 하나도 없었다.`,{j:12,r:8},1,'baby',{kid:ki}); }
      else add(`${ord} 아이 ${josa(k.n,'이','가')} 태어났다. 작은 손이 내 손가락을 꼭 쥐었다.`,{j:10,r:6},1,'baby',{kid:ki}); }
    if(this.kids.length&&!f.grandkid&&a-this.kids[0].b>=30&&R()<.3*step){ f.grandkid=1; add(`${this.kids[0].n}에게서 손주가 태어났다.`,{j:8,r:5},1,'baby'); }
    const el=[]; EVENTS.forEach((e,i)=>{ if(this.inC(e)&&a>=e.a[0]&&a<=e.a[1]&&(e.set==='*'||e.set===this.set)&&this.reqOK(e.req)&&!(e.once&&this.used[i])) el.push(i); });
    for(let i=el.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [el[i],el[j]]=[el[j],el[i]]; }
    if(!f.dying) for(const i of el){ const e=EVENTS[i]; if(R()<1-Math.pow(1-this.evP(e),step)){ this.used[i]=1; add(e.txt,e.fx,0); break; } }
    if(f.school) s.k+=(f.univ?3:2)*step;
    if(a<30) s.h+=(C.hb-s.h)*.03; if(a>40) s.h-=.4*step; if(a>60) s.h-=.5*step; if(a>75) s.h-=.6*step; if(f.dying) s.h-=6;
    // 살림: 어릴 때는 가족의 형편, 어른이 되면 내가 버는 돈과 모은 돈이 그 나라 보통 벌이에 비해 어떤지
    if(a>=19&&!f.school){
      if(f.job&&!f.inf) f.frmY=(f.frmY||0)+step;
      if(f.job){ const j=this.job; this.inc*=1+(.012+(C.tier>=3?.006:.012))*step+gauss()*(['farm','fish','herd','shop','dream','tour'].includes(j.kind)?.06:.025); this.inc=this.payClamp(this.inc); this.maxInc=Math.max(this.maxInc,this.inc); }
      else if(f.retired) this.inc=pension(this); else this.inc=C.med*.25;
      if(a>=70&&f.job){ this.retire(); add('나이가 들어 일을 내려놓았다.',{j:2},1,'job'); }
    }
    const led=this.ledger(step); if(led) out.push({t:'',money:led,big:0}); if(led&&led.note){ this.apply({j:-5}); out.push({t:led.note,fx:{j:-5},big:1,sc:'money'}); this.remember({a,t:led.note,big:1,sc:'money'}); }
    // 빚이 집값보다 커지면 버티지 못하고 집을 판다
    if(this.house&&this.cash<-(this.house*.8+this.debtCap())){ const hv=this.house; this.cash+=hv; this.house=0; const t=`늘어난 빚을 감당하지 못해 살던 집을 팔았다. 집을 판 돈으로 빚의 대부분을 갚고 다시 세 들어 살게 되었다.`; this.apply({j:-6,h:-2}); out.push({t,fx:{j:-6,h:-2},big:1,sc:'house'}); this.remember({a,t,big:1,sc:'house'}); }
    if(a>=19&&!f.school){ const hh=(this.inc||0)+(f.family?(f.spInc||0)*.6:0), wt=clamp(.5+.22*Math.log2(Math.max(hh,.1)/C.med)+clamp(this.nw/(C.med*12*15),-.12,.12),.02,.98); this.w+=(wt-this.w)*.3; }
    // 행복: 돈보다 관계·감사·문화가 더 크게 움직인다
    const P=this.joyParts(); let tgt=46; for(const k in P){ tgt+=P[k]; this.hp[k]=(this.hp[k]||0)+P[k]*step; } this.hp.cnt+=step;
    s.j+=(clamp(tgt,5,98)-s.j)*.06*step; s.r+=(50-s.r)*.015*step+(f.family?.3:0);
    for(const k in s) s[k]=clamp(s[k],0,100);
    this.hist.push({a,h:Math.round(s.h),j:Math.round(s.j),k:Math.round(s.k),r:Math.round(s.r),m:Math.round(this.inc*10)/10,nw:Math.round(this.nw)});
    // 삶의 끝: 대개는 한동안 집에서 앓다가 떠난다. 젊은 나이의 사고나 갑작스러운 병은 예고 없이 찾아온다
    const die=(cause)=>{ this.dead=true; this.lifespan=a; this.cause=cause; this.cur=null; this.news=out; return {entries:out,dead:true}; };
    if(this._epiDie){ f.dying=0; return die('epi'); }
    if(f.dying){ const rec=a<13?.3:a<60?.22:a<75?.1:.04;
      if(a<99&&R()<rec){ f.dying=0; s.h=Math.max(s.h,45); add('기적처럼 몸이 회복되었다. 다시 일어나 밖으로 나갈 수 있게 되었다.',{j:8,r:3},1,'life'); }
      else return die('ill'); }
    else { const qy = a<5 ? C.u5/1000*(a===0?.6:.1)*[.6,1,1.35][this.famI] : a<40 ? .0002+C.u5/60000+(C.hz.includes('unrest')?.0015:0) : (.0005+.05*Math.exp(.095*(a-C.ref)))*(1.7-s.h/100*1.4);
      const qe=Math.max(qy*.45,qy-epiBase(this,a));
      if(a>=99 || R()<1-Math.pow(1-clamp(qe,0,.7),step)){
        if(a>=13&&a<40&&R()<.55) return die('sudden');
        if(a>=40&&R()<.12) return die('sudden');
        f.dying=1; f.dyA=a+step;
        out.push({t:a<13?'열이 오르고 기운이 하나도 없다. 엄마 아빠가 밤낮으로 곁을 지킨다.':'몸이 많이 약해졌다. 의사는 이제 집에서 가족과 함께 시간을 보내는 것이 좋겠다고 했다.',fx:null,big:1,sc:'sick',dying:1});
        this.remember({a:a+step,t:a<13?'크게 아파 집에서 지냈다. 가족이 밤낮으로 곁을 지켰다.':'몸이 많이 약해져, 남은 시간을 집에서 가족과 보내기로 했다.',big:1,sc:'sick'}); } }
    if(a===0&&f.school===undefined) f.school=0;
    this.age+=step; this.pi++; this.cur=null; const b=this.age, sch=this.sch;
    const big=(t,fx,sc)=>{ if(fx) this.apply(fx); out.push({t,fx:fx||null,big:1,sc}); this.remember({a:b,t,big:1,sc}); };
    if(f.dying){ this.news=out; return {entries:out,dead:false}; }
    if(b===6) out.push({t:'여섯 살이 되었다. 이제 혼자 동네에 나갈 수 있다.',fx:null,big:1,sc:'town'});
    const ui=this.set==='U'?0:1, enroll=()=>{ f.school=1; f.elem=1; };
    if(b===7){ if(R()<clamp(C.edu[ui]+FAM[this.famI].w*.5,.05,1)){ enroll(); big(`${sch.elem}에 입학했다. 담임은 ${this.ppl.teacher.n} 선생님이었다. 옆자리에 앉은 ${josa(this.ppl.friend.n,'과','와')} 금세 친해졌다.`,{k:3,r:2},'school'); }
      else big('또래들이 학교에 가는 날, 형편과 먼 거리 때문에 입학하지 못했다.',{j:-3},'noschool'); }
    if(b>=8&&b<=10&&!f.elem&&R()<.25){ enroll(); big(`늦었지만 ${sch.elem}에 다니게 되었다.`,{k:3},'school'); }
    if(b===13&&!f.elem&&f.school!==0) f.school=0;
    if(b===13){ if(f.elem&&C.sec[ui]>=.95){ f.sec=1; big(`열세 살, 올봄부터 ${sch.mid}에 다닌다. 이제 큰길 건너편까지 다닐 수 있다.`,null,'school'); } else out.push({t:'열세 살이 되었다. 큰길 건너편까지 다닐 수 있다.',fx:null,big:1,sc:'town'}); }
    if(b===19){ if(!f.univ) f.school=0; const hn=this.tx('{high}'); out.push({t:`어른이 되었다.${f.hs?' '+josa(hn,'을','를')+' 졸업했다.':''} 일터가 있는 곳까지 갈 수 있다.`,fx:null,big:1,sc:f.hs?'grad':'town'}); }
    if(b>=C.veh.age&&a<C.veh.age&&b>=10) out.push({t:`이제 ${josa(C.veh.n,'을','를')} 탈 수 있다. 길 위에서 '${C.veh.n} 타기'를 눌러 보자.`,fx:null,big:1,sc:'travel'});
    if((b===21||b===22)&&this.sex===0&&this.c==='KR'&&!f.army){ f.army=1; big('군 복무를 마쳤다. 1년 6개월이 생각보다 빨리 지나갔다.',{h:3,r:2},'job'); }
    if(f.univ&&f.school&&b>=(f.univA||19)+(f.jc?2:4)){ f.school=0; f.univDone=1; f.needJob=1; big(`${josa(sch.univ,'을','를')} 졸업했다.`,{k:4,j:4},'grad'); }
    if(b===75||b===76){ if(!f.noVeh){ f.noVeh=1; out.push({t:`이제 ${josa(C.veh.n,'은','는')} 타지 않기로 했다. 천천히 걸어서 다닌다.`,fx:null,big:1,sc:'town'}); } }
    this.news=out; return {entries:out,dead:false};
  }
  // 아이 이름을 바꾸면 기억 속 이름도 함께 바뀐다
  renameKid(i,given){ const k=this.kids[i]; given=String(given||'').trim().slice(0,8); if(!k||!given||given===k.given) return; const old=k.n; k.given=given; k.n=joinName(this.c,k.sur||this.sur,given,k.sex===1);
    this.mem.forEach(m=>{ if(m.t&&m.t.includes(old)) m.t=m.t.split(josa(old,'이','가')).join(josa(k.n,'이','가')).split(old).join(k.n); }); }
  // 자동 진행 (교사용 '나이 건너뛰기'와 점검용)
  // 아무거나 고르되, 화면에서 막히는 선택(돈이 부족해요 등)은 고르지 않는다
  autoPick(list,kind){ const ok=list.map((o,i)=>i).filter(i=>!(this.optBlocked&&this.optBlocked(list[i],kind))); const pool=ok.length?ok:list.map((o,i)=>i); return pool[Math.floor(R()*pool.length)]; }
  runAuto(until){ let g=0; while(!this.dead&&this.age<(until==null?999:until)&&g++<200){ this.startPeriod(); let gg=0; while(this.pending&&gg++<4) this.choose(this.autoPick(this.pending.opts,'ch')); if(this.cur.sk&&R()<.7) this.getSick(); this.cur.scenes.forEach((c,k)=>{ if(R()<.8) this.doScene(k,this.autoPick(SCENES[c.i].opts,'s')); }); for(let m=0;m<this.cur.plan;m++) if(R()<.8&&this.major()!=null) this.chooseMajor(this.autoPick(MAJORS[this.cur.m].opts,'m')); this.endPeriod(); } return this; }
  // ── 기억: 상황(q) · 내 선택(l) · 결과(t)를 함께 남긴다. 같은 상황의 같은 결과는 새로 쌓지 않고 몇 번이었는지 센다
  // 여러 삶에 똑같이 나오던 문장은 삶마다 다른 표현 하나로 (같은 삶 안에서는 늘 같은 표현)
  pv(t){ const a=typeof RES_ALT!=='undefined'&&RES_ALT[t]; if(!a) return t; if(this.vs==null) this.vs=Math.floor(Math.random()*1e9); let h=this.vs>>>0; for(const c of t) h=(Math.imul(h,31)+c.charCodeAt(0))>>>0; const i=h%(a.length+1); return i?a[i-1]:t; }
  findMem(t,q){ t=this.pv(t); for(let i=this.mem.length-1;i>=0;i--){ const m=this.mem[i]; if(m.t===t&&(m.q||'')===(q||'')) return m; } return null; }
  remember(o){ if(o.t) o.t=this.pv(o.t); if(o.q&&o.q===o.t) delete o.q; if(o.q&&o.q.length>90) o.q=o.q.slice(0,89)+'…'; for(const k in o) if(o[k]===undefined) delete o[k]; if(this._auto) o.au=1;
    const p=(o.kid!=null||o.a===0)?null:this.findMem(o.t,o.q);
    if(p){ p.rp=(p.rp||1)+1; p.a2=o.a; if(o.big) p.big=1; return p; }
    this.mem.push(o); return o; }
  // 같은 결과가 다시 나오면 화면에는 다른 문장으로 (기억에는 처음 문장과 횟수가 남는다)
  vary(t,q){ if(q&&q.length>90) q=q.slice(0,89)+'…'; const p=this.findMem(t,q), n=p?(p.rp||1):0; if(!n) return this.pv(t);
    const vs=RES_VAR[t]; if(vs&&n<=vs.length) return this.tx(vs[n-1]);
    const tt=this.pv(t); return /^[가-힣]/.test(tt)?['이번에도 ','또다시 ','늘 그랬듯 '][Math.min(2,n-1)]+tt:tt; }
  // 기억이 너무 많아지면, 기억이 가장 많이 쌓인 해에서 덜 중요한 것부터 덜어 낸다
  trimMem(cap){ cap=cap||MEMCAP; const M=this.mem; if(!M||M.length<=cap) return; const keep=m=>m.big||m.kid!=null||m.a===0;
    let g=0; while(M.length>cap&&g++<400){ const cnt={}; M.forEach(m=>{ if(!keep(m)) cnt[m.a]=(cnt[m.a]||0)+1; }); let ba=null,bc=0; for(const a in cnt) if(cnt[a]>bc){ bc=cnt[a]; ba=+a; } if(ba==null) break;
      let bi=-1, bs=1e9; M.forEach((m,i)=>{ if(m.a!==ba||keep(m)) return; const sc=(m.au?0:2)+(m.q?1:0)+(m.nt?2:0)+(m.rp?1:0); if(sc<bs){ bs=sc; bi=i; } }); if(bi<0) break; M.splice(bi,1); } }
  // 아이 이름: 형제끼리 같은 이름이 되지 않게
  newGiven(sx){ const used=new Set((this.kids||[]).map(k=>k.given).concat([this.given])); let g; for(let t=0;t<10;t++){ g=pickGiven(this,sx,'now'); if(!used.has(g)) break; } return g; }
  topTrait(){ return Object.keys(this.tr).sort((x,y)=>this.tr[y]-this.tr[x])[0]; }
}
// 사건 문장으로 장면 그림의 종류를 짐작한다
function sceneKindOf(t){ t=String(t||'');
  const R=[[/홍수|물에 잠|강물이 넘|큰비|우기에 길|몬순/,'flood'],[/지진|땅이 크게 흔들/,'quake'],[/폭풍|태풍|큰바람|허리케인|사이클론|토네이도/,'storm'],[/가뭄|비가 오지 않|물이 귀/,'drought'],[/더위|폭염/,'heat'],[/추위|눈보라|큰 눈|겨울|난방/,'cold'],[/산불|불이|숲에 큰불/,'fire'],[/화산/,'volcano'],[/바닷물|파도|먼바다/,'sea'],[/어수선|분쟁/,'unrest'],
    [/태어났|동생이 태어|손주/,'baby'],[/떠나보|떠나셨|먼 길을/,'farewell'],[/결혼|가정을 꾸|잔치|혼사/,'wedding'],[/입원|아파|병|열이|돌림병|말라리아|진단|앓/,'sick'],[/졸업/,'grad'],[/집을 샀|집이 생|우리 집|새 아파트|집을 짓|지은 집/,'house'],[/시험|입학|학교|성적|수능|공부|합격/,'school'],
    [/일자리를 잃|사람을 줄|문을 닫|실직/,'jobloss'],[/월급|돈|사업|물가|살림|빚/,'money'],[/일|직장|면접|회사|농사|공장/,'job'],[/축제|행사|명절|잔치/,'fest'],[/대회|경기|선수|결승|달리기/,'sport'],[/이사|도시로|떠난다|다른 나라|여행/,'travel'],[/강아지|동물/,'pet'],[/친구|고백|좋아하는/,'friend'],[/무대|발표회/,'stage']];
  for(const [re,k] of R) if(re.test(t)) return k; return 'life'; }

