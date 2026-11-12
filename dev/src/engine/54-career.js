/* ========== 진로: 흥미 분야 → 대학 학과 · 일자리 후보 (11-13) ==========
   · 진로 이야기(중요 대화)에서 흥미 분야 f.dir를 정한다: 12~14살 부모님 · 15~17살 담임 선생님(진로 상담) · 17~18살 진학 상담(목표 학과 f.major).
     화면 쪽 대화는 ui/62-dialog-more.js. 대화를 놓치면 그때까지의 삶의 모양(오각형)으로 저절로 정해진다(ensureDir).
   · 대학 갈림길(19살, 재수하면 21살): 도전·적정·안정(2년제) 여러 학교와 흥미 분야의 학과를 함께 보여 준다(univMenu).
   · 일자리 고르기: 흥미 분야의 일을 후보에 더한다(jobMenu 감싸기). */
const DIRS={
  sci: {n:'과학·기술',       ser:'공학·자연 계열', ax:['k','t'], tr:'C', maj:['컴퓨터공학과','전자공학과','기계공학과','화학공학과','건축학과','생명과학과','물리학과'], jc:'컴퓨터정보과', jobs:['engineer','factory','sig'], ex:'컴퓨터공학·기계공학 → 엔지니어'},
  care:{n:'사람 돌보기·의료', ser:'의약·보건 계열', ax:['r','k'], tr:'K', maj:['의예과','간호학과','물리치료학과','심리학과','사회복지학과'], jc:'간호조무과', jobs:['nurse','doctor','hair'], ex:'간호학·의학 → 간호사·의사'},
  edu: {n:'가르치기·말과 글', ser:'교육·인문 계열', ax:['k','r'], tr:'D', maj:['수학교육과','국어교육과','국어국문학과','영어영문학과','유아교육과'], jc:'유아교육과', jobs:['teacher','civil'], ex:'교육학·국문학 → 교사'},
  biz: {n:'장사·회사·돈',     ser:'경영·경제 계열', ax:['r','e'], tr:'B', maj:['경영학과','경제학과','무역학과','호텔관광경영학과'], jc:'경영과', jobs:['office','shopown','vendor'], ex:'경영학·경제학 → 회사원·가게 주인'},
  art: {n:'예술·만들기',      ser:'예술 계열',      ax:['j','t'], tr:'C', maj:['디자인학과','실용음악과','영상학과','조리학과'], jc:'디자인과', jobs:['artist','creator','cook','hair'], ex:'디자인·음악·요리 → 예술가·요리사'},
  body:{n:'몸으로 하는 일·운동',ser:'체육 계열',    ax:['t','e'], tr:'B', maj:['체육교육과','경찰행정학과','체육학과','스포츠레저학과'], jc:'경찰행정과', jobs:['athlete','police','builder','driver'], ex:'체육·경찰행정 → 선수·경찰관'},
  pub: {n:'나라·사회를 위한 일',ser:'사회·법 계열', ax:['k','e'], tr:'G', maj:['정치외교학과','행정학과','법학과','사회학과','사회복지학과'], jc:'행정과', jobs:['civil','police'], ex:'행정학·법학 → 공무원·경찰관'}
};
const DIR_KEYS=Object.keys(DIRS);
// 학과마다 들어가기 어려운 정도: 그 대학의 보통 합격선에 더하는 값(성적 0~1 기준). 의예과는 어느 대학이든 최상위 성적이어야 한다
const MAJ_MD={'의예과':.32,'수학교육과':.1,'국어교육과':.09,'체육교육과':.06,'간호학과':.08,'컴퓨터공학과':.07,'전자공학과':.06,'화학공학과':.06,'경영학과':.05,'경제학과':.04,'정치외교학과':.05,'법학과':.06,'건축학과':.04,'물리치료학과':.05,'실용음악과':.05,'경찰행정학과':.04,'심리학과':.03};
// 대학 층과 상관없이 넘어야 하는 성적 (의대는 어느 대학이든 최상위)
const MAJ_ABS={'의예과':.86,'간호학과':.4,'수학교육과':.5,'국어교육과':.5,'체육교육과':.45};
const majNeed=(ti,m)=>ti===3?0:Math.min(.97,Math.max(UT_NEED[ti]+(MAJ_MD[m]||0),MAJ_ABS[m]||0));
const MAJ_HARD={}; for(const k in MAJ_MD) MAJ_HARD[k]=-MAJ_MD[k];   // (예전 이름, 화면에서 씀)
const NEW_MAJ=['전자공학과','물리치료학과','국어교육과','영어영문학과','유아교육과','무역학과','호텔관광경영학과','영상학과','체육교육과','경찰행정학과','스포츠레저학과','정치외교학과','행정학과','사회학과','실용음악과','조리학과','체육학과'];
NEW_MAJ.forEach(m=>{ if(!MAJORS_U.includes(m)) MAJORS_U.push(m); });
Object.assign(MAJOR_JOB,{'전자공학과':'engineer','국어교육과':'teacher','영어영문학과':'teacher','유아교육과':'teacher','무역학과':'office','호텔관광경영학과':'office','영상학과':'creator','체육교육과':'teacher','경찰행정학과':'police','스포츠레저학과':'office','정치외교학과':'civil','행정학과':'civil','사회학과':'office','물리치료학과':'office',
  '실용음악과':'artist','조리학과':'cook','체육학과':'teacher','컴퓨터정보과':'office','사회복지과':'civil','간호조무과':'office','경영과':'office','디자인과':'artist','경찰행정과':'police','행정과':'civil','어문학과':'teacher'});
const MAJ_DIR={'어문학과':'edu','국어국문학과':'edu','디자인학과':'art'}; DIR_KEYS.forEach(d=>DIRS[d].maj.concat(DIRS[d].jc).forEach(m=>{ if(!MAJ_DIR[m]) MAJ_DIR[m]=d; }));
// 다른 나라에서는 '국어'를 그 나라 말로
const majLoc=(L,m)=>L.c==='KR'?m:m.replace(/^국어국문학과$/,'어문학과').replace(/^국어교육과$/,'언어교육과');
MAJ_DIR['언어교육과']='edu'; MAJOR_JOB['언어교육과']='teacher';
/* ---------- 공부 수준과 대학의 층 ----------
   성적 q(0~1, 시험이 있으면 그 결과, 없으면 쌓아 온 학업 수준)로 지금 갈 만한 층을 정한다.
   층: 0 최상위(이름난 대학) · 1 중상위 4년제 · 2 지역 4년제 · 3 2년제(전문대·직업대학). 합격선 UT_NEED. */
const UT_NEED=[.9,.62,.2,0];
function acadQ(L){ const f=L.f; return f.uex!=null?f.uex:Phi((L.acInit()-50)/17)*.9+.05; }
function myTier(L){ const q=acadQ(L); for(let i=0;i<4;i++) if(q>=UT_NEED[i]-.02) return i; return 3; }
function tierWord(L,i){ return (L.c==='KR'?['최상위권 대학','중상위권 4년제 대학','지역 4년제 대학','전문대학(2년제)']:['이름난 대학','4년제 대학','지역 대학','직업대학(2년제)'])[i]; }
const TECH_U=/KAIST|POSTECH|UNIST|DGIST|GIST|공과|공업|IIT|MIT|칼텍|기술원|Tech/i;
/* 지역 4년제 · 2년제(전문대·직업대학) 실제 학교 이름. 없는 나라는 4년제는 UNIV[1], 2년제는 '○○ 기술대학' */
const UNIV2={
  KR:[['강원대학교','충북대학교','제주대학교','군산대학교','목포대학교','순천대학교','창원대학교','한밭대학교','동아대학교','영남대학교','조선대학교','계명대학교','청주대학교','전주대학교','동의대학교','대구대학교'],['인하공업전문대학','수원과학대학교','동양미래대학교','부산정보대학교','대구보건대학교','전주기전대학','대덕대학교','서울여자간호대학교','충북보건과학대학교','한국폴리텍대학','경남정보대학교','광주보건대학교']],
  JP:[['신슈대학','이바라키대학','야마가타대학','가고시마대학','오이타대학','시마네대학'],['도쿄 디지털 전문학교','오사카 조리 전문학교','나고야 복지 전문학교','후쿠오카 간호 전문학교','삿포로 공업 전문학교']],
  CN:[['허난대학','광시대학','구이저우대학','윈난대학','허베이대학','난창대학'],['선전 직업기술대학','베이징 정보직업기술대학','난징 기계직업기술대학','우한 철도직업기술대학']],
  US:[['캘리포니아 주립대학교 프레즈노','오하이오 대학교','노던 일리노이 대학교','웨스턴 미시간 대학교','뉴멕시코 주립대학교','아칸소 대학교'],['산타모니카 칼리지','마이애미 데이드 칼리지','휴스턴 커뮤니티 칼리지','노던 버지니아 커뮤니티 칼리지','시카고 시티 칼리지','패서디나 시티 칼리지']],
  CA:[['레이크헤드 대학교','맥마스터 대학교','빅토리아 대학교','윈저 대학교'],['센테니얼 칼리지','조지 브라운 칼리지','세네카 칼리지','발렌시아 칼리지']],
  GB:[['플리머스 대학교','사우샘프턴 대학교','허더즈필드 대학교','리버풀 존무어스 대학교','셰필드 핼럼 대학교'],['맨체스터 칼리지','리즈 시티 칼리지','버밍엄 메트로폴리탄 칼리지','브리스톨 시티 칼리지']],
  AU:[['뉴캐슬 대학교','울런공 대학교','태즈메이니아 대학교','제임스 쿡 대학교'],['TAFE 뉴사우스웨일스','TAFE 퀸즐랜드','홀름스 인스티튜트']],
  DE:[['뒤스부르크에센 대학교','브레멘 대학교','키 대학교','로스토크 대학교','킨 대학교'],['뮌헨 응용과학대학','함부르크 응용과학대학','베를린 직업학교','쾰른 응용과학대학']],
  FR:[['푸아티에 대학교','리모주 대학교','브레스트 대학교','디종 대학교'],['파리 이공 기술대학(IUT)','리옹 기술대학(IUT)','마르세유 기술대학(IUT)']],
  IN:[['안드라 대학교','칼리컷 대학교','케랄라 대학교','구자라트 대학교','푸네 대학교'],['정부 폴리테크닉 대학','델리 산업훈련원(ITI)','뭄바이 폴리테크닉','첸나이 폴리테크닉']],
  BR:[['파라나 연방대학교','세아라 연방대학교','페르남부쿠 연방대학교','바이아 연방대학교'],['상파울루 연방 기술교육원','미나스제라이스 연방 기술교육원','리우 SENAI 기술학교']],
  MX:[['베라크루스 대학교','푸에블라 자치대학교','과나후아토 대학교'],['멕시코 기술대학','과달라하라 기술대학','몬테레이 기술대학']],
  NG:[['베닌 대학교','포트하코트 대학교','엔수카 나이지리아 대학교','일로린 대학교'],['라고스 폴리테크닉','이바단 폴리테크닉','카두나 폴리테크닉']],
  ZA:[['노스웨스트 대학교','로즈 대학교','포트헤어 대학교'],['요하네스버그 TVET 대학','케이프타운 TVET 대학','더반 TVET 대학']],
  ID:[['디포네고로 대학교','브라위자야 대학교','하사누딘 대학교'],['반둥 폴리테크닉','수라바야 폴리테크닉','메단 폴리테크닉']],
  PH:[['비콜 대학교','실리만 대학교','산카를로스 대학교'],['마닐라 기술대학','TESDA 직업훈련원','케손시티 기술대학']],
  VN:[['후에 대학교','껀터 대학교','다낭 대학교'],['하노이 직업대학','호찌민 직업대학','다낭 직업대학']],
  TR:[['아타튀르크 대학교','카라데니즈 기술대학교','에르지예스 대학교'],['이스탄불 직업학교','앙카라 직업학교']],
  EG:[['탄타 대학교','만수라 대학교','아시우트 대학교'],['카이로 기술대학','알렉산드리아 기술대학']],
  RU:[['사마라 국립대학교','우랄 연방대학교','극동 연방대학교'],['모스크바 기술전문학교','상트페테르부르크 기술전문학교']],
  PL:[['그단스크 대학교','루블린 마리아 퀴리 대학교','우치 대학교'],['바르샤바 직업학교','크라쿠프 직업학교']],
  IT:[['페루자 대학교','칼리아리 대학교','트렌토 대학교'],['밀라노 직업기술학교','나폴리 직업기술학교']],
  ES:[['세비야 대학교','말라가 대학교','무르시아 대학교'],['마드리드 직업교육센터','바르셀로나 직업교육센터']],
  TH:[['콘캔 대학교','송클라 대학교','부라파 대학교'],['방콕 직업기술대학','치앙마이 직업기술대학']],
  PK:[['페샤와르 대학교','발루치스탄 대학교'],['라호르 정부 기술대학','카라치 정부 기술대학']],
  BD:[['치타공 대학교','쿨나 대학교'],['다카 폴리테크닉','치타공 폴리테크닉']],
  KE:[['에젤튼 대학교','마세노 대학교'],['나이로비 기술훈련원','몸바사 기술훈련원']]
};
function tierName(L,i,d){ const C=L.C, UN=UNIV[L.c], fit=a=>{ const x=a.filter(n=>d==='sci'||!TECH_U.test(n)); return x.length?x:a; }, town=(L.set==='U'&&L.town)||C.city;
  if(i===0) return UN?pickOne(fit(UN[0])):`${C.city} 국립대학교`;
  if(i===1) return UN?pickOne(fit(UN[1])):`${C.city} 대학교`;
  // 지역 4년제·2년제도 실제 학교 이름으로 (UNIV2: [지역 4년제, 2년제·직업대학])
  const U2=UNIV2[L.c];
  if(i===2) return U2?pickOne(fit(U2[0])):(UN&&UN[1].length?pickOne(fit(UN[1])):`${C.city} 대학교`);
  return U2?pickOne(U2[1]):`${C.city} 기술대학`; }
// 그 층에서 성적으로 바라볼 만한 학과들 (너무 어려운 학과는 후보에서 뺀다)
function majorsFor(L,d,ti){ const D=DIRS[d]; if(ti===3) return [D.jc]; const q=acadQ(L), need=UT_NEED[ti];
  const ok=D.maj.filter(m=>q>=majNeed(ti,m)-.1); return (ok.length?ok:[D.maj.slice().sort((a,b)=>(MAJ_MD[a]||0)-(MAJ_MD[b]||0))[0]]).map(m=>majLoc(L,m)); }
function pickMajor(L,d,ti,prefer,not){ let ms=majorsFor(L,d,ti); if(not&&ms.length>1) ms=ms.filter(m=>m!==not); return prefer&&ms.includes(prefer)?prefer:pickOne(ms); }
// 지금의 삶의 모양(오각형·건강)과 쌓인 성향으로 본 분야별 점수
// 축마다 보통 크기가 달라(관계·행복은 크고 기술·경험은 작다) 보통 값에 견준 비율로 본다
const AX_BASE={j:38,k:21,t:13,e:18,r:49}, TR_BASE={D:20,B:9,K:12,C:12,G:4};
function dirScore(L,d){ const D=DIRS[d], s=L.s, f=L.f; let v=D.ax.reduce((a,k)=>a+(s[k]!=null?s[k]:AX_BASE[k])/AX_BASE[k],0)/D.ax.length*50; v+=(L.tr[D.tr]||0)/TR_BASE[D.tr]*6; if(f.dirs&&f.dirs[d]) v+=f.dirs[d]*6; let h=7; for(const c of String(L.name||'')+d) h=(Math.imul(h,31)+c.charCodeAt(0))>>>0; return v+(h%1000)/1000*8; }   // 비슷하면 사람마다 다르게
function dirRank(L){ return DIR_KEYS.slice().sort((a,b)=>dirScore(L,b)-dirScore(L,a)); }
// 오각형에서 가장 돋보이는 두 축 (말로 보여 줄 때)
function topAxes(L){ return ['j','k','t','e','r'].filter(k=>L.s[k]!=null).sort((a,b)=>L.s[b]/AX_BASE[b]-L.s[a]/AX_BASE[a]).slice(0,2); }
function ensureDir(L){ const f=L.f; if(!f.dir) f.dir=(f.major&&MAJ_DIR[f.major])||dirRank(L)[0]; if(!f.major||!MAJ_DIR[f.major]||MAJ_DIR[f.major]!==f.dir&&!(f.dirs&&f.dirs[MAJ_DIR[f.major]])) f.major=pickMajor(L,f.dir,Math.min(2,myTier(L))); return f.dir; }
// 관심 분야 둘: 가장 큰 것과 그다음 (진로 이야기에서 고른 횟수 → 삶의 모양 순)
function dirPair(L){ const f=L.f, A=ensureDir(L), r=Object.keys(f.dirs||{}).filter(d=>d!==A&&DIRS[d]).sort((a,b)=>f.dirs[b]-f.dirs[a]).concat(dirRank(L).filter(d=>d!==A)); return [A,r[0]]; }
function setDir(L,d,w){ const f=L.f; f.dir=d; f.dirs=f.dirs||{}; f.dirs[d]=(f.dirs[d]||0)+(w||1); }
// 진로 이야기를 할 때인가: 1 부모님(12~14) · 2 진로 상담(15~17, 학교에 다닐 때) · 3 진학 상담(17~18, 중·고등학교를 다닐 때)
function careerDue(L){ if(!L||!L.cur||L.f.dying||L.sick) return 0; const f=L.f, a=L.age;
  if(f.univ||f.job) return 0;
  if(!f.dirT1&&a>=12&&a<=14) return 1;
  if(f.school&&!f.dirT2&&a>=15&&a<=17) return 2;
  if(f.school&&f.sec&&!f.dirT3&&a>=17&&a<=18) return 3;
  return 0; }
(function(){ const P=Life.prototype, _ca=P.choiceAt;
  P.choiceAt=function(a){ const f=this.f; if((a===19||(a===21&&f.retry))&&f.sec) return univMenu(this,a); return _ca.call(this,a); };
})();
function univMenu(L,a){
  const f=L.f, C=L.C, t=L.tr, sch=L.sch, KR=L.c==='KR', again=a===21, U=L.set==='U';
  const [A,B]=dirPair(L), q=acadQ(L), my=myTier(L), acc=KR?0:[-.2,-.08,0,.03][C.tier-1];
  // 붙을 확률: 성적이 그 대학·학과의 합격선보다 얼마나 높은가 + 형편·성실함·고등학교
  const pOf=(ti,m)=>{ const need=majNeed(ti,m.replace('언어교육과','국어교육과'));
    const mg=q-need; return clamp(.58+clamp(mg,-.4,.15)*1.3+(mg>.15?(mg-.15)*.5:0)+(L.w-.5)*.12+Math.min(t.D,40)*.002+acc+(again?.04:0)+(f.hs==='gen'?.02:0),.04,.93); };
  const enter=(nm,mj,jc)=>()=>{ f.univ=1; f.school=1; f.univA=a; f.retry=0; sch.univ=nm; f.major=mj; f.jc=jc?1:0; f.uTier=jc?3:undefined; };
  const fail=[again?'이번에도 합격하지 못했다. 다른 길을 찾아보기로 했다.':'불합격 소식을 들었다. 눈앞이 캄캄했다.',{j:-6},()=>{ f.retry=0; f.school=again?0:f.school; if(again) f.needJob=1; else f.uFail=1; }];
  const o=(label,sub,p,ok,fl)=>({label,sub,p:p==null?null:clamp(p,.03,.97),ok,fail:fl});
  const app=(kind,ti,d,prefer,not)=>{ const m=pickMajor(L,d,ti,prefer,not), nm=tierName(L,ti,d), jc=ti===3;
    return o(`${kind} · ${nm} ${m}`,`${DIRS[d].ser} · ${tierWord(L,ti)}`,pOf(ti,m),
      jc?[`${nm} ${m}에 합격했다. 2년 동안 일에 바로 쓰는 기술을 배운다.`,{k:5,j:5},enter(nm,m,1)]:[`${nm} ${m}에 합격했다!${f.uex!=null?' 성적표를 몇 번이고 다시 보았다.':''}`,{k:8,j:ti===0?9:7},()=>{ enter(nm,m)(); f.uTier=ti; }],fail); };
  const opts=[];
  if(f.uOffer&&!again){ const om=f.major;
    opts.push(o(`수시로 합격한 ${f.uOffer} ${om}에 입학한다`,'이미 붙어 둔 곳 · 확실',null,[`${f.uOffer} ${om}에 입학했다. 입학식 날, 학교 이름이 새겨진 점퍼를 처음 입었다.`,{k:8,j:8},enter(f.uOffer,om)]));
    if(my<=1){ const x=app('정시로 도전',Math.max(0,my-1),A,f.major); x.sub='떨어지면 수시로 붙은 곳에 간다 · '+x.sub; x.fail=[`정시에서는 떨어졌다. 수시로 붙어 둔 ${f.uOffer}에 입학했다.`,{j:-2},enter(f.uOffer,om)]; opts.push(x); } }
  else {
    let r;
    if(my>0) r=app('도전',my-1,A,f.major);                              // 한 층 위
    else { const hard=DIRS[A].maj.filter(m=>(MAJ_MD[m]||0)>=.08).map(m=>majLoc(L,m)).filter(m=>majorsFor(L,A,0).includes(m)); r=app('도전',0,A,hard[0]||f.major); }
    opts.push(r); const rm=r.label.split(' ').pop();
    opts.push(app('적정',my,A,my>0?f.major:null,my===0?rm:null));
    if(B) opts.push(app('적정',my,B));
    if(my<3) opts.push(app('안정',my+1,my+1>=3?A:(B||A))); }
  opts.push(o('바로 일자리를 구한다',f.hs==='voc'?'배운 기술을 살린다':'돈을 먼저 번다',null,[f.hs==='voc'?'배운 기술로 일자리를 알아보기로 했다.':'일자리를 알아보기로 했다.',{j:2,r:2,k:f.hs==='voc'?3:0},()=>{ f.needJob=1; f.retry=0; f.school=0; }]));
  if(!again) opts.push(U? o('1년 동안 하고 싶은 일을 찾아본다','아르바이트를 하며',null,['아르바이트를 하며 하고 싶은 일을 찾아다녔다.',{j:4,k:2},()=>{setJob(L,'day');t.C+=3}])
                 : o('부모님의 일을 잇는다','',null,['부모님 곁에서 집안일과 농사를 배우기 시작했다.',{r:5,h:2},()=>{setJob(L,'farm')}]));
  if(f.wantWork&&!again){ const k=opts.findIndex(x=>x.label==='바로 일자리를 구한다'); if(k>0) opts.unshift(opts.splice(k,1)[0]); }
  const lvl=josa(KR?(f.uex!=null?'수능 성적':'내신과 모의고사'):(f.uex!=null?'시험 성적':'그동안의 성적'),'으로','로');
  return {q:again?`다시 본 시험의 결과가 나왔다. ${lvl} 보면 ${tierWord(L,my)} 정도가 알맞다.`:f.uOffer?`${f.uOffer}에 합격해 두었다. 어른이 되는 문턱에 섰다.`:`어른이 되는 문턱에 섰다. ${lvl} 보면 ${tierWord(L,my)} 정도가 알맞다. 어느 학교에 원서를 낼까?`,opts}; }
// 일자리 고르기: 흥미 분야의 일을 더한다 (전체 4~5개)
(function(){ const _jm=jobMenu; jobMenu=function(L,q,keep){ const r=_jm(L,q,keep), f=L.f; if(!f.dir||!DIRS[f.dir]) return r; const D=DIRS[f.dir];
  const have=new Set(r.opts.map(x=>x.job).filter(Boolean)); r.opts.forEach(x=>{ if(x.job&&D.jobs.includes(x.job)&&x.sub&&!/관심 분야/.test(x.sub)) x.sub=`관심 분야(${D.n}) · `+x.sub; });
  const add=D.jobs.filter(id=>id!==f.job&&!have.has(id)).map(id=>jobInfo(L,id)).filter(j=>j&&jobOK(L,j)&&(j.sig||j.kind!=='dream'||dreamOK(L,j.id))).slice(0,keep?1:2);
  const at=keep&&r.opts[0]&&r.opts[0].keep?1:0;
  add.forEach((j,i)=>r.opts.splice(at+i,0,{label:j.n,sub:`관심 분야(${D.n}) · 한 달에 약 ${fmtPay(jobPayMid(L,j))}`,p:clamp(jobP(L,j)+.08,.03,.97),job:j.id}));
  r.opts=r.opts.slice(0,5); return r; }; })();
(function(){ const _d=dreamOK; dreamOK=function(L,id){ const f=L.f; if(id==='artist'&&/실용음악|디자인/.test(f.major||'')) return true; if(id==='athlete'&&f.dir==='body'&&L.age<=30&&L.s.h>=62) return true; if(id==='creator'&&f.dir==='art') return true; return _d(L,id); }; })();
// 수시 합격 발표 때도 흥미 분야의 학과로
// 수시: 학교도 성적에 맞게(성적이 낮으면 지역 4년제) — 원래 처리는 이름난 대학·중상위만 고르던 것
(function(){ const R0=CALRUN.susiR, _p=R0.post; R0.post=(L,...x)=>{ ensureDir(L); const f=L.f, had=f.uOffer, r=_p(L,...x);
  if(f.uOffer&&f.uOffer!==had&&r&&r.t){ const my=myTier(L), ti=Math.min(2,Math.max(0,f.susi===0?my-1:my)); if(ti>=1){ const nm=tierName(L,ti,f.dir); r.t=r.t.replace(f.uOffer,nm); f.uOffer=nm; } }
  return r; }; })();
