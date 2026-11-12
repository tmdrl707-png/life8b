/* =====================================================================
   [나라의 제도] 군 복무 · 정년과 연금 · 의료보험 · 공식/비공식 일자리 · 직급 · 해외 취업 · 계모임 · 모바일 결제
   - 제도는 2026년 무렵의 모습을 바탕으로 한다 (태어난 아이가 어른이 될 무렵에는 바뀌어 있을 수 있다)
   - oop: 병원비 가운데 내 주머니에서 직접 내는 몫(%) — WHO 세계보건지출 자료(2019, IndexMundi 정리)
   - inf: 일하는 사람 가운데 비공식 일자리(계약서·사회보험 없음)의 비율(%) — ILO 자료(위키백과 목록 정리, 2014~2025)
   - cs: 군 복무 [개월, 시작 나이, 대상(0 남자 · 2 남녀 모두), 특징]  특징: lot 추첨 · buy 돈을 내고 면제 · univ 대학생은 미룰 수 있음 · sel 일부만 소집 · sat 주말 훈련 · q 설문·검사만
   - ra: 정년(연금을 받기 시작하는 나이) [남, 여] — 위키백과 Retirement age 등
   - hi 의료보험(제도 이름) · pen 일하며 붓는 연금 · sp [나이, 이름] 보험료를 내지 않아도 받는 노인 수당
   - ros 동네 저축 모임 · mm 휴대폰 결제 · mig 일하러 많이 떠나는 나라 · ns 대학 졸업 뒤 나라 봉사 제도
   ===================================================================== */
const INST={
  KR:{cs:[18,19,0,'univ'],ra:[60,60],oop:30,inf:27,hi:'국민건강보험',pen:'국민연금',sp:[65,'기초연금'],ros:'계모임',mm:'간편결제'},
  KP:{cs:[96,17,2,''],oop:30,inf:60},
  JP:{ra:[65,65],oop:13,inf:15,hi:'국민건강보험',pen:'후생연금',mm:'QR 결제'},
  CN:{cs:[24,18,0,'sel'],ra:[63,58],oop:35,inf:55,hi:'주민 의료보험',pen:'기본 양로보험',sp:[60,'도시·농촌 주민 기초 양로금'],ros:'후이(合会)',mm:'위챗페이·알리페이'},
  TW:{cs:[12,18,0,'univ'],ra:[65,65],oop:35,inf:20,hi:'전민건강보험',mm:'모바일 결제'},
  MN:{cs:[12,18,0,'buy'],ra:[60,55],oop:35,inf:42,hi:'건강보험',mig:['한국','일본']},
  IN:{ra:[60,60],oop:55,inf:88,hi:'아유시만 바라트(PM-JAY) 건강 카드',pen:'직원 적립 기금(EPF)',sp:[60,'국가 노령 연금'],ros:'치트 펀드',mm:'UPI',mig:['아랍에미리트','사우디아라비아','카타르','쿠웨이트','오만']},
  PK:{ra:[60,60],oop:54,inf:84,hi:'세핫 사훌랏 건강 카드',pen:'EOBI 연금',ros:'커미티(돈 모으기 모임)',mm:'이지페이사',mig:['사우디아라비아','아랍에미리트','카타르','영국']},
  BD:{ra:[59,59],oop:73,inf:84,ros:'소미티(저축 모임)',mm:'비캐시(bKash)',mig:['사우디아라비아','말레이시아','아랍에미리트','오만','카타르']},
  NP:{ra:[58,58],oop:58,inf:82,mm:'모바일 지갑',mig:['말레이시아','카타르','아랍에미리트','사우디아라비아','한국']},
  LK:{ra:[60,60],oop:46,inf:67,mig:['쿠웨이트','사우디아라비아','카타르']},
  AF:{oop:79,inf:86,mig:['이란','파키스탄','튀르키예']},
  ID:{ra:[65,65],oop:35,inf:81,hi:'BPJS 건강보험',pen:'BPJS 고용 연금',ros:'아리산',mm:'QRIS 결제',mig:['말레이시아','대만','홍콩','사우디아라비아','한국']},
  PH:{ra:[60,60],oop:49,inf:70,hi:'필헬스(PhilHealth)',pen:'SSS 연금',sp:[60,'노인 사회 연금'],ros:'팔루와간',mm:'지캐시(GCash)',mig:['사우디아라비아','아랍에미리트','홍콩','싱가포르','대만']},
  VN:{cs:[24,18,0,'univ'],ra:[62,60],oop:43,inf:68,hi:'건강보험(BHYT)',pen:'사회보험 연금',ros:'후이(hụi)',mm:'모모(MoMo)',mig:['일본','대만','한국']},
  TH:{cs:[24,21,0,'lot univ'],ra:[60,60],oop:9,inf:63,hi:'30바트 보편 의료 제도',pen:'사회보장 기금',sp:[60,'노인 생활 수당'],mm:'프롬프트페이'},
  MM:{cs:[24,18,2,''],oop:76,inf:81,mig:['태국','말레이시아']},
  KH:{cs:[24,18,0,''],oop:64,inf:89,mig:['태국','한국']},
  LA:{oop:42,inf:90,mig:['태국']},
  MY:{ra:[60,60],oop:35,inf:30,hi:'공공병원 진료',pen:'직원 적립 기금(EPF)'},
  SG:{cs:[24,18,0,''],ra:[63,63],oop:30,inf:10,hi:'메디세이브(의료 저축)',pen:'중앙 적립 기금(CPF)'},
  UZ:{cs:[12,18,0,'buy'],ra:[60,55],oop:58,inf:60,mig:['러시아','한국','카자흐스탄']},
  KZ:{cs:[12,18,0,''],ra:[63,61],oop:34,inf:25,hi:'의무 건강보험'},
  TJ:{oop:71,inf:65,mig:['러시아','카자흐스탄']}, KG:{cs:[12,18,0,'buy'],oop:46,inf:59,mig:['러시아','카자흐스탄']},
  IR:{cs:[21,18,0,'univ'],ra:[60,55],oop:39,inf:50,hi:'건강보험(살라마트)',pen:'사회보장 기금 연금'},
  TR:{cs:[6,20,0,'buy univ'],ra:[65,65],oop:17,inf:28,hi:'일반건강보험(SGK)',pen:'SGK 연금',ros:'골드 데이(알튼 귄)'},
  IQ:{ra:[60,60],oop:50,inf:68},
  SA:{ra:[60,60],oop:17,inf:20,hi:'국민 무료 공공의료'},
  AE:{cs:[11,18,0,''],oop:13,inf:15},
  EG:{cs:[24,18,0,'univ'],ra:[60,60],oop:63,inf:71,hi:'보편적 건강보험(일부 지역부터)',pen:'사회보험 연금',ros:'가메이야',mm:'인스타페이',mig:['사우디아라비아','쿠웨이트','아랍에미리트']},
  DZ:{cs:[12,19,0,''],ra:[60,55],oop:33,inf:45,mig:['프랑스']},
  MA:{cs:[12,19,2,'sel'],ra:[63,63],oop:47,inf:70,ros:'다레트',mig:['스페인','프랑스','이탈리아']},
  IL:{cs:[32,18,2,''],ra:[67,65],oop:21,inf:10,hi:'공적 건강보험(쿠파트 홀림)'},
  YE:{oop:81,inf:77}, SY:{oop:54,inf:60}, SD:{oop:67,inf:94}, SS:{oop:60,inf:95},
  NG:{ra:[60,60],oop:71,inf:93,hi:'국민건강보험(NHIA)',pen:'퇴직 연금 계좌(RSA)',ros:'에수수(아조)',mm:'핀테크 송금 앱',mig:['영국','캐나다','미국'],ns:'국가 청년 봉사단(NYSC)'},
  GH:{ra:[60,60],oop:36,inf:78,hi:'국민건강보험(NHIS)',pen:'SSNIT 연금',ros:'수수',mm:'모바일 머니(MoMo)',mig:['영국','미국','캐나다'],ns:'국가 봉사(National Service)'},
  CI:{ra:[60,60],oop:37,inf:92,ros:'톤틴',mm:'오렌지 머니'}, SN:{ra:[60,60],oop:51,inf:89,ros:'톤틴',mm:'웨이브(Wave)',mig:['프랑스','스페인','이탈리아']},
  CM:{ra:[60,60],oop:73,inf:87,ros:'은잔기(톤틴)',mm:'MTN 모바일 머니'}, ML:{cs:[24,18,2,'sel'],oop:31,inf:95,ros:'톤틴',mig:['프랑스','코트디부아르']},
  NE:{oop:46,inf:98}, BF:{oop:35,inf:94}, TD:{cs:[36,20,0,'sel'],oop:57,inf:97},
  ET:{ra:[60,60],oop:38,inf:85,hi:'지역사회 건강보험(CBHI)',ros:'에쿠브',mm:'텔레비르',mig:['사우디아라비아','아랍에미리트','레바논']},
  KE:{ra:[60,60],oop:24,inf:86,hi:'사회건강보험(SHA)',pen:'NSSF 연금',sp:[70,'이누아 잠이(노인 현금 지원)'],ros:'차마',mm:'엠페사(M-Pesa)',mig:['사우디아라비아','아랍에미리트','카타르','영국']},
  TZ:{ra:[60,60],oop:22,inf:94,ros:'비코바(마을 저축 은행)',mm:'엠페사(M-Pesa)'},
  UG:{ra:[60,60],oop:38,inf:95,ros:'마을 저축·대출 모임(VSLA)',mm:'MTN 모바일 머니',mig:['사우디아라비아','아랍에미리트']},
  RW:{oop:12,inf:84,hi:'지역 건강보험(무투엘)',mm:'MTN 모바일 머니'},
  CD:{oop:39,inf:97,ros:'리켈렘바',mm:'엠페사(M-Pesa)'},
  AO:{cs:[24,20,0,'sel'],ra:[60,60],oop:37,inf:92},
  MZ:{oop:10,inf:96,mm:'엠페사(M-Pesa)',mig:['남아프리카공화국']},
  ZA:{ra:[60,60],oop:6,inf:35,hi:'공공 진료소(기본 진료 무료)',sp:[60,'노인 수당(SASSA)'],ros:'스톡벨'},
  ZW:{oop:24,inf:88,mig:['남아프리카공화국','영국']}, MW:{oop:17,inf:87,mig:['남아프리카공화국']}, ZM:{oop:10,inf:84,mm:'MTN 모바일 머니'},
  SO:{oop:60,inf:82,ros:'하그바드',mm:'모바일 머니'}, MG:{oop:33,inf:96},
  ER:{cs:[18,18,2,''],oop:43,inf:90},
  US:{ra:[67,67],oop:11,inf:18,hi:'직장 의료보험·메디케이드',pen:'사회보장 연금',mm:'모바일 송금 앱'},
  CA:{ra:[65,65],oop:15,inf:12,hi:'공공 의료보험(메디케어)',pen:'캐나다 연금(CPP)'},
  MX:{cs:[12,18,0,'lot sat'],ra:[65,65],oop:42,inf:56,hi:'IMSS 사회보장 의료',pen:'AFORE 개인 연금 계좌',sp:[65,'노인 복지 연금(펜시온 파라 엘 비에네스타르)'],ros:'탄다',mig:['미국']},
  GT:{oop:56,inf:83,mig:['미국']}, HN:{oop:53,inf:83,mig:['미국']}, SV:{oop:28,inf:67,mig:['미국']}, HT:{oop:43,inf:92,ros:'솔',mig:['도미니카공화국','칠레','미국']},
  CU:{cs:[24,17,0,''],oop:11,inf:30,hi:'무료 공공의료'},
  CO:{cs:[18,18,0,'sel'],ra:[62,57],oop:15,inf:56,hi:'EPS 건강보험',mig:['스페인','미국']},
  VE:{ra:[60,55],oop:18,inf:58,mig:['콜롬비아','페루','칠레','스페인']},
  PE:{ra:[65,65],oop:28,inf:72,ros:'훈타'}, BO:{cs:[12,18,0,''],oop:24,inf:84,sp:[60,'렌타 디그니다드'],ros:'파사나쿠',mig:['아르헨티나','스페인']},
  BR:{cs:[12,18,0,'sel'],ra:[65,62],oop:25,inf:37,hi:'SUS(통합 보건 시스템)',pen:'INSS 연금',sp:[65,'BPC 노인 수당'],mm:'픽스(Pix)'},
  AR:{ra:[65,60],oop:28,inf:52,hi:'공공병원',sp:[65,'노인 보편 연금(PUAM)']},
  CL:{ra:[65,60],oop:33,inf:27,sp:[65,'보편 보장 연금(PGU)']},
  RU:{cs:[12,18,0,'univ'],ra:[65,60],oop:37,inf:19,hi:'의무건강보험(OMS)',pen:'국가 연금'},
  UA:{ra:[60,60],oop:51,inf:20,mig:['폴란드','체코','독일']}, BY:{cs:[18,18,0,'univ'],oop:26,inf:15},
  AZ:{cs:[18,18,0,''],oop:68,inf:60}, AM:{cs:[24,18,0,''],oop:85,inf:48}, GE:{cs:[11,18,0,''],oop:47,inf:56},
  PL:{ra:[65,60],oop:20,inf:9,hi:'국민건강기금(NFZ)'}, LT:{cs:[9,18,0,'lot'],oop:32,inf:3}, EE:{cs:[8,18,0,''],oop:24,inf:2}, LV:{cs:[11,18,0,'sel'],oop:36,inf:2},
  DE:{cs:[0,18,0,'q'],ra:[67,67],oop:13,inf:2,hi:'공적 건강보험',pen:'법정 연금'},
  FR:{ra:[64,64],oop:9,inf:3,hi:'공적 건강보험(카르트 비탈)',pen:'일반 연금'},
  GB:{ra:[68,68],oop:17,inf:7,hi:'NHS(국민보건서비스)',pen:'국가 연금'},
  IT:{ra:[67,67],oop:23,inf:3,hi:'국가 보건 서비스(SSN)'}, ES:{ra:[67,67],oop:22,inf:2,hi:'공공 의료'},
  GR:{cs:[12,19,0,''],ra:[67,67],oop:35,inf:4}, CY:{cs:[14,18,0,''],oop:31,inf:2},
  AT:{cs:[6,18,0,''],ra:[65,65],oop:19,inf:1}, CH:{cs:[5,19,0,''],ra:[65,65],oop:25,inf:1},
  FI:{cs:[6,18,0,''],ra:[65,65],oop:17,inf:2}, NO:{cs:[12,19,2,'sel'],ra:[67,67],oop:14,inf:1}, SE:{cs:[9,18,2,'sel'],ra:[67,67],oop:14,inf:3,mm:'스위시(Swish)'}, DK:{cs:[4,18,2,'lot'],ra:[67,67],oop:14,inf:3},
  AU:{ra:[67,67],oop:16,inf:10,hi:'메디케어'}, NZ:{ra:[65,65],oop:12,inf:10}
};
// 소득 수준에 따른 기본값 (자료가 없는 나라)
function instOf(L){ if(L._inst&&L._inst.c===L.c) return L._inst; const t=L.C.tier, I=INST[L.c]||{}, rgMig={SA:['걸프 지역 나라들'],SE:['말레이시아'],AF:['남아프리카공화국','걸프 지역 나라들'],LA:['미국','스페인'],EE:['독일','폴란드'],CA:['러시아'],ME:['걸프 지역 나라들'],OC:['오스트레일리아','뉴질랜드'],EA:['일본'],EU:['독일'],NA:['캐나다']}[L.C.rg];
  const o=Object.assign({c:L.c,oop:[55,45,30,15][t-1],inf:[90,75,45,10][t-1],ra:t>=4?[65,65]:t===3?[62,60]:t===2?[60,60]:null,mig:rgMig||['이웃 나라']},I);
  Object.defineProperty(L,'_inst',{value:o,enumerable:false,configurable:true,writable:true}); return o; }
const retAgeOf=L=>{ const r=instOf(L).ra; return r?r[L.sex]:null; };
// 이번 삶의 남은 군 복무가 있는가 (한국은 원래의 흐름을 따른다)
function csOK(L){ const I=instOf(L), cs=I.cs, f=L.f; if(!cs||(!cs[0]&&!cs[3].includes('q'))||L.c==='KR'||f.svcDone||f.svc) return false; if(cs[2]!==2&&L.sex!==0) return false; if(cs[2]===2&&L.sex===1&&cs[0]>24) return false; if(cs[3].includes('univ')&&((L.age<19&&f.sec)||f.retry)) return false; if(f.svcDefA===L.age) return false; return L.age+L.step>cs[1]&&L.age<=cs[1]+10; }
function csFlag(L,k){ const cs=instOf(L).cs; return !!cs&&cs[3].split(' ').includes(k); }
// 빈칸 값: 그 나라 제도의 이름
function instVars(L){ const I=instOf(L), f=L.f, cs=I.cs;
  return {hiN:I.hi||'의료 지원 제도',penN:I.pen||'연금',spN:I.sp?I.sp[1]:'노인 수당',spA:I.sp?I.sp[0]:65,rosN:I.ros||'동네 저축 모임',mmN:I.mm||'휴대폰 송금',migTo:f.migTo||pickOne(I.mig),svcM:cs?cs[0]:18,svcY:cs?(cs[0]>=24?Math.round(cs[0]/12)+'년':cs[0]+'개월'):'',raA:retAgeOf(L)||60,oopP:I.oop,infP:I.inf,nsN:I.ns||'',
    rank:rankName(L),rank2:rankName(L,1)||'한 단계 위',abrTo:f.abrS||pickOne(['미국','영국','독일','일본','캐나다','오스트레일리아','프랑스','네덜란드']),stdTo:pickOne(L.C.tier>=3?['미국','영국','독일','캐나다','오스트레일리아']:['영국','미국','중국','말레이시아','튀르키예','러시아','독일'])}; }

/* ---------- 직급: 같은 일을 오래 하면 한 계단씩 오른다 ---------- */
const RANKS={
  office:{KR:['사원','대리','과장','차장','부장','임원'],JP:['평사원','주임','계장','과장','부장','임원'],CN:['직원','주관','매니저','총감','부총경리','총경리'],d:['신입 직원','주임','팀장','부서장','본부장','임원']},
  civil:{KR:['9급 주무관','8급 주무관','7급 주무관','6급 주무관','5급 사무관','4급 서기관'],d:['하급 공무원','주임 공무원','계장','과장','국장','차관보']},
  police:{KR:['순경','경장','경사','경위','경감','경정'],d:['순경','경사','경위','경감','경정','총경']},
  teacher:{d:['교사','부장 교사','교감','교장']}, nurse:{d:['간호사','책임 간호사','수간호사','간호부장']},
  doctor:{KR:['인턴','전공의','전문의','교수','병원장'],d:['수련의','전공의','전문의','과장','병원장']},
  engineer:{d:['주니어 엔지니어','엔지니어','시니어 엔지니어','수석 엔지니어','기술 이사']},
  factory:{d:['생산직 사원','조장','반장','현장 관리자','공장장']},
  cook:{d:['보조 요리사','요리사','수석 요리사','주방장','내 식당의 주인']}, hair:{d:['보조 미용사','미용사','실장','원장']},
  vendor:{d:['노점 상인','가게 상인','도매 상인']}, shopown:{d:['작은 가게 주인','두 번째 가게의 주인','가게 여러 곳의 주인']},
  driver:{d:['운전기사','고참 기사','배차 책임자','운수 회사 사장']}, builder:{d:['잡부','기능공','반장','현장 소장']},
  artist:{d:['신인 예술가','중견 예술가','이름난 예술가','거장']}, athlete:{d:['유망주','주전 선수','국가대표','전설적인 선수']}, creator:{d:['초보 창작자','구독자 1만 명 창작자','구독자 10만 명 창작자','구독자 100만 명 창작자']},
  farm:{d:['남의 땅을 부치는 농부','내 땅이 있는 농부','큰 농장의 주인']}, abroad:{d:['외국인 노동자','숙련 노동자','현장 반장']},
  k_fish:{d:['선원','갑판장','선장','배 주인']}, k_herd:{d:['목동','가축 주인','큰 목장의 주인']}, k_mine:{d:['광부','숙련 광부','갱 반장']}, k_tour:{d:['안내원','숙련 안내원','관광 회사 대표']},
  k_office:{d:['신입 직원','주임','팀장','부서장','임원']}, k_hosp:{d:['간호사','책임 간호사','수간호사']}, k_factory:{d:['생산직 사원','조장','반장','현장 관리자']}, k_shop:{d:['점원','숙련공','가게 주인']}, k_farm:{d:['일꾼','반장','농장 관리인']}
};
function rankList(L){ const id=L.f.job; if(!id||id==='day') return null; let R0=RANKS[id]; if(!R0&&id==='sig'){ const j=L.job; R0=j&&RANKS['k_'+j.kind]; } return R0?(R0[L.c]||R0.d):null; }
function rankName(L,up){ const r=rankList(L); if(!r) return ''; return r[clamp((L.f.rk||0)+(up?1:0),0,r.length-1)]; }
function rankCan(L){ const r=rankList(L), f=L.f; return !!r&&(f.rk||0)<r.length-1&&L.age-(f.rkA!=null?f.rkA:(L.jobs&&L.jobs.length?L.jobs[L.jobs.length-1].a:L.age))>=3; }
Object.assign(Life.prototype,{
  rankUp(n){ const r=rankList(this), f=this.f; if(!r) return null; const old=f.rk||0; f.rk=clamp(old+(n||1),0,r.length-1); if(f.rk===old) return null; f.rkA=this.age; f.rkMax=Math.max(f.rkMax||0,f.rk); f.rkCo=f.co;
    this.inc=this.payClamp(this.inc*1.16); this.maxInc=Math.max(this.maxInc,this.inc); f.rkTop=r[f.rk]; return r[f.rk]; }
});
// 일자리를 얻을 때: 직급은 처음부터, 공식(계약서·사회보험) 일자리인지가 정해진다
const _setJob0=setJob;
setJob=function(L,id){ const prev=L.f.job, j=_setJob0(L,id); if(prev!==id){ L.f.rk=0; L.f.rkA=L.age; }
  const I=instOf(L), base=I.inf/100, k=j.kind, mul={office:.25,school:.2,hosp:.3,factory:.6,shop:1,dream:1,tour:.9,mine:.8,fish:1.3,herd:1.3,farm:1.3,part:1.15}[k]||1;
  L.f.inf=['civil','police','teacher','doctor','nurse'].includes(id)?R()<base*.12:R()<clamp(base*mul,0,.98);
  if(id==='abroad'){ L.f.migTo=pickOne(I.mig); L.f.migA=L.age; } return j; };

/* ---------- 연금: 공식 일자리에서 오래 일한 사람 · 노인 수당 · 가족의 도움 ---------- */
pension=function(L){ const C=L.C, f=L.f, I=instOf(L), t=C.tier, y=f.frmY||0;
  let p=y>=10?C.med*[.18,.26,.36,.5][t-1]*Math.min(1.2,.6+y/50)*(1+(f.rkMax||0)*.06):0;
  if(I.sp&&L.age>=I.sp[0]) p=Math.max(p,C.med*(t>=4?.22:.14)); else if(I.sp) p=Math.max(p,C.med*.08);
  const kids=(L.kids||[]).length; if(p<C.med*.15) p+=C.med*Math.min(kids,3)*.06;     // 연금이 적으면 자녀들이 보태 준다
  return Math.max(p,C.med*(t>=3?.12:.08)); };

/* ---------- 달력의 결과 처리 (제도) ---------- */
function svcStart(L,v,t,part){ const f=L.f, m=instOf(L).cs[0]; if(part){ f.svcDone=1; f.svcN=1; f.svcA=L.age; return {t,big:1}; } f.svc=[L.age+1,L.age+1+Math.max(1,Math.ceil(m/12))]; f.svcN=(f.svcN||0)+1; f.svcA=L.age; return {t,big:1}; }
Object.assign(CALRUN,{
  // 군 복무: 지금 간다 · 미룬다 · 돈을 내고 면제 · 추첨
  // 군 복무 (svc 그냥 · svcU 대학생은 미룸 · svcB 돈 내고 면제 · svcLot 추첨 · svcSel 일부만 소집 · svcQ 설문)
  svc:{post:(L,ok,oi,v)=>svcStart(L,v,`${v.svcY} 동안의 군 복무를 시작했다. 머리를 짧게 자르고 훈련소로 들어갔다.`)},
  svcU:{post:(L,ok,oi,v)=>{ const f=L.f; if(oi===1&&f.univ&&f.school){ f.svcDef=(f.svcDef||0)+1; f.svcDefA=L.age; return {t:'졸업한 뒤에 다녀오기로 했다.'}; } return svcStart(L,v,`${v.svcY} 동안의 군 복무를 시작했다.`); }},
  svcB:{post:(L,ok,oi,v)=>{ if(oi===1){ L.f.svcDone=1; return {t:'정해진 돈을 내고 짧은 훈련만 받았다. 모아 둔 돈이 크게 줄었다.',fx:{'@':-3}}; } return svcStart(L,v,`${v.svcY} 동안의 군 복무를 시작했다.`); }},
  svcLot:{post:(L,ok,oi,v)=>{ const f=L.f, TH=L.c==='TH', sat=csFlag(L,'sat');
    if(oi===2) return svcStart(L,v,TH?'먼저 지원한 덕에 복무 기간이 조금 짧아졌다.':`먼저 지원해 ${v.svcY} 동안 복무하게 되었다.`);
    if(R()<.38) return svcStart(L,v,TH?'빨간 쪽지였다. 2년 동안 군에 가게 되었다.':`추첨에서 뽑혔다. ${v.svcY} 동안 ${sat?'토요일마다 훈련에 나가게':'복무하게'} 되었다.`,sat);
    f.svcDone=1; return {t:TH?'검은 쪽지였다. 면제다! 함께 온 친구들과 얼싸안았다.':'추첨에서 뽑히지 않아 복무가 면제되었다.',fx:{j:4}}; }},
  svcSel:{post:(L,ok,oi,v)=>{ if(R()<.8){ L.f.svcDone=1; return {t:'신체검사를 받았지만 소집되지는 않았다. 지원한 사람들로 자리가 대부분 채워졌다.'}; } return svcStart(L,v,`소집 명단에 이름이 올랐다. ${v.svcY} 동안 복무하게 되었다.`); }},
  svcQ:{post:(L,ok,oi)=>{ L.f.svcDone=1; if(oi===1){ L.f.svcN=1; L.f.svcA=L.age; return {t:'설문에 답한 뒤 군에 지원했다. 몇 달 뒤 기초 훈련을 받았다.',fx:{h:2,r:2}}; } return {t:'설문에 답했다. 지금은 지원자 위주라 소집되지 않았다.'}; }},
  svcEnd:{post:L=>{ L.f.svcDone=1; L.f.svc=null; return {big:1}; }},
  rankUp:{post:(L,ok,oi)=>{ if(!ok) return null; const n=L.rankUp(); return n?{t:`${n}(으)로 승진했다! 월급도 함께 올랐다.`.replace('(으)로',josa(n,'으로','로').slice(n.length)),fx:{j:4},big:1}:null; }},
  rankUp0:{post:(L,ok,oi)=>{ if(!ok||oi!==0) return null; const n=L.rankUp(); return n?{t:`${n}(으)로 승진했다!`.replace('(으)로',josa(n,'으로','로').slice(n.length)),fx:{j:3},big:1}:null; }},
  migBack:{post:(L,ok,oi)=>{ if(oi!==0) return null; const f=L.f, sav=L.C.med*(6+R()*10); L.cash+=sav; L.mEv+=sav; f.migBack=f.migTo; if(f.ch) delete f.ch.migIn; setJob(L,L.set==='R'?'farm':'shopown'); return {t:`몇 해 동안 모은 돈을 들고 고향에 돌아왔다. 그 돈으로 ${L.set==='R'?'땅을 조금 더 사고 농사를 다시 지었다':'작은 가게를 열었다'}.`,big:1}; }},
  abrGo:{post:(L,ok,oi,v)=>{ if(oi!==0) return null; if(R()>[.45,.6,.8,.92][L.C.tier-1]) return {t:'입학 허가는 받았지만, 학비와 생활비를 댈 수 있다는 증빙이 모자라 비자가 나오지 않았다.',fx:{j:-3}}; L.f.abrS=v.stdTo; (L.f.ch||(L.f.ch={})).abrT=L.age; return {t:`${v.stdTo}의 대학원에 입학했다. 공항에서 가족과 오래 손을 흔들었다.`,big:1,fx:{'@':-4}}; }},
  abrDone:{post:L=>{ const f=L.f, to=f.abrS; f.abrDone=to; f.abrS=null; if(f.job){ L.inc=L.payClamp(L.inc*1.2); } else f.needJob=1; return {t:`${to}에서 대학원 공부를 마쳤다. 학위증을 받던 날, 고향 가족과 영상 통화를 했다.`,big:1,fx:{k:6,j:5}}; }},
  rosca:{post:(L,ok,oi)=>{ if(oi!==0) return null; const turn=R(); return turn<.25?{t:'이번 달 곗돈을 탈 차례가 일찍 돌아왔다. 목돈이 생겼다.',fx:{'@':2,j:2}}:turn>.92?{t:'모임의 한 사람이 돈을 들고 사라져 손해를 보았다.',fx:{'@':-2,j:-3,r:-1}}:{t:'다달이 꼬박꼬박 돈을 넣었다. 몇 달 뒤 내 차례가 오면 목돈이 된다.',fx:{'@':1,r:1}}; }},
  formal:{post:L=>{ L.f.inf=0; return {t:'이제 계약서가 있는 일자리다. 월급에서 연금과 건강보험료가 빠져나가기 시작했다.',fx:{j:2}}; }}
});

