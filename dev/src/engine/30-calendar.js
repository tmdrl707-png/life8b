/* =====================================================================
   [한 해의 달력] 한 해(열두 달)에 일어나는 일 열 가지 안팎
   - 나라마다 학교가 시작하는 달, 방학, 시험(이름·시기·점수 방식)이 다르다
   - 학생 때는 학교·시험·입시 이야기가 중심, 어른이 되면 일·가족·돈·건강
   - 갓난아기 때처럼 특별한 일이 없는 해는 몇 가지만
   ===================================================================== */

/* ---------- [데이터] 나라별 학교의 한 해와 시험 ----------
   st 새 학년이 시작하는 달 · sv 여름(긴) 방학 · wv 겨울(짧은) 방학 · n 한 반 학생 수
   x1 중학교를 마칠 때 보는 나라 시험 {n 이름, m 달, a 나이, f 점수 방식, gate 성적으로 고등학교가 갈림}
   x2 대학에 가기 위한 시험 {n 이름, m 달, a 나이, f 점수 방식, re 다시 보는 사람이 많음} */
const SYS_RG={
  EA:{st:9,sv:7,wv:1,n:42}, SE:{st:7,sv:4,wv:12,n:40}, SA:{st:4,sv:5,wv:12,n:45}, CA:{st:9,sv:7,wv:1,n:30},
  ME:{st:9,sv:7,wv:1,n:35}, AF:{st:9,sv:8,wv:12,n:55}, EU:{st:9,sv:7,wv:12,n:25}, EE:{st:9,sv:7,wv:1,n:27},
  NA:{st:9,sv:7,wv:12,n:25}, LA:{st:2,sv:1,wv:7,n:35}, OC:{st:2,sv:12,wv:7,n:26}
};
const SYS={
  KR:{st:3,sv:8,wv:1,n:25,x2:{n:'대학수학능력시험(수능)',m:11,a:18,f:'kr9',re:1}},
  KP:{st:4,sv:8,wv:1,n:35,x2:{n:'대학 입학시험',m:3,a:18,f:'pct'}},
  CN:{st:9,sv:7,wv:1,n:45,x1:{n:'중카오(고등학교 입학시험)',m:6,a:15,f:'cnzk',gate:1},x2:{n:'가오카오(대학 입학시험)',m:6,a:18,f:'cn750',re:1}},
  TW:{st:9,sv:7,wv:1,n:30,x1:{n:'고교 입학 학력평가',m:5,a:15,f:'pct',gate:1},x2:{n:'대학 학과능력시험',m:1,a:18,f:'pct',re:1}},
  JP:{st:4,sv:8,wv:1,n:32,x1:{n:'고교 입시',m:2,a:15,f:'jpH',gate:1},x2:{n:'대학입학 공통테스트',m:1,a:18,f:'jp',re:1}},
  IN:{st:4,sv:5,wv:12,n:40,x1:{n:'10학년 보드 시험',m:3,a:15,f:'in10',gate:1},x2:{n:'12학년 보드 시험과 JEE·NEET',m:4,a:18,f:'in12',re:1}},
  PK:{st:4,sv:6,wv:12,n:45,x1:{n:'매트릭(10학년) 시험',m:3,a:15,f:'pk',gate:1},x2:{n:'12학년 시험과 대학 입학시험',m:5,a:18,f:'pk',re:1}},
  BD:{st:1,sv:6,wv:12,n:50,x1:{n:'SSC(중등 졸업) 시험',m:2,a:16,f:'bd'},x2:{n:'HSC 시험과 대학 입학시험',m:4,a:18,f:'bd',re:1}},
  ID:{st:7,sv:6,wv:12,n:36,x2:{n:'UTBK(대학 입학시험)',m:4,a:18,f:'utbk'}},
  PH:{st:8,sv:5,wv:12,n:45,x2:{n:'대학 입학시험',m:10,a:17,f:'pct'}},
  VN:{st:9,sv:6,wv:1,n:42,x1:{n:'고등학교 입학시험',m:6,a:15,f:'vn30',gate:1},x2:{n:'고교 졸업·대학 입학시험',m:6,a:18,f:'vn30',re:1}},
  TH:{st:5,sv:3,wv:10,n:40,x2:{n:'TGAT·A레벨 대학 입학시험',m:3,a:18,f:'pct'}},
  MY:{st:1,sv:11,wv:6,n:35,x2:{n:'SPM(중등교육 수료시험)',m:11,a:17,f:'pct'}},
  NG:{st:9,sv:8,wv:12,n:55,x1:{n:'BECE(중학교 졸업시험)',m:6,a:15,f:'pct'},x2:{n:'WAEC 졸업시험과 JAMB 입학시험',m:5,a:17,f:'waec',re:1}},
  GH:{st:9,sv:8,wv:12,n:50,x1:{n:'BECE(중학교 졸업시험)',m:6,a:15,f:'pct',gate:1},x2:{n:'WASSCE(고교 졸업시험)',m:8,a:18,f:'waec'}},
  KE:{st:1,sv:8,wv:12,n:50,x1:{n:'KJSEA(중학 과정 평가)',m:11,a:15,f:'pct'},x2:{n:'KCSE(고교 졸업시험)',m:11,a:17,f:'kcse'}},
  TZ:{st:1,sv:6,wv:12,n:60,x1:{n:'중등 2학년 전국시험',m:11,a:15,f:'pct'},x2:{n:'중등 4학년 졸업시험(CSEE)',m:11,a:17,f:'kcse'}},
  UG:{st:2,sv:8,wv:12,n:60,x2:{n:'UCE·UACE 졸업시험',m:11,a:18,f:'pct'}},
  ET:{st:9,sv:7,wv:1,n:55,x1:{n:'8학년 지역 시험',m:6,a:14,f:'pct'},x2:{n:'고교 졸업 전국시험',m:7,a:18,f:'pct'}},
  ZA:{st:1,sv:12,wv:7,n:40,x2:{n:'매트릭(고교 졸업시험)',m:11,a:18,f:'za'}},
  EG:{st:9,sv:7,wv:1,n:50,x1:{n:'중학교 졸업시험',m:6,a:15,f:'pct',gate:1},x2:{n:'타나위야 아마(고교 졸업시험)',m:6,a:18,f:'eg',re:1}},
  TR:{st:9,sv:7,wv:1,n:32,x1:{n:'LGS(고등학교 입학시험)',m:6,a:14,f:'lgs',gate:1},x2:{n:'YKS(대학 입학시험)',m:6,a:18,f:'trR',re:1}},
  IR:{st:9,sv:7,wv:3,n:32,x2:{n:'콘쿠르(대학 입학시험)',m:7,a:18,f:'irR',re:1}},
  RU:{st:9,sv:7,wv:1,n:27,x1:{n:'OGE(9학년 졸업시험)',m:6,a:15,f:'ru100'},x2:{n:'EGE(통일 국가시험)',m:6,a:17,f:'ru100'}},
  UZ:{st:9,sv:7,wv:1,n:30,x2:{n:'대학 입학 시험(DTM)',m:7,a:18,f:'pct',re:1}},
  US:{st:9,sv:7,wv:12,n:25,x2:{n:'SAT',m:5,a:17,f:'sat'}},
  CA:{st:9,sv:7,wv:12,n:26,x2:{n:'주 졸업시험',m:6,a:17,f:'pct'}},
  MX:{st:9,sv:7,wv:12,n:38,x1:{n:'고등학교 입학시험',m:6,a:15,f:'pct',gate:1},x2:{n:'EXANI-II(대학 입학시험)',m:5,a:18,f:'mx'}},
  BR:{st:2,sv:1,wv:7,n:35,x2:{n:'ENEM(국가 고교 평가)',m:11,a:17,f:'enem',re:1}},
  AR:{st:3,sv:1,wv:7,n:30}, CO:{st:2,sv:12,wv:6,n:35,x2:{n:'ICFES 국가시험',m:8,a:17,f:'pct'}},
  DE:{st:9,sv:7,wv:12,n:25,x2:{n:'아비투어(고교 졸업시험)',m:4,a:18,f:'abi'}},
  FR:{st:9,sv:7,wv:12,n:28,x1:{n:'브르베(중학교 졸업시험)',m:6,a:15,f:'bac'},x2:{n:'바칼로레아',m:6,a:18,f:'bac'}},
  GB:{st:9,sv:7,wv:12,n:28,x1:{n:'GCSE 시험',m:5,a:16,f:'gcse'},x2:{n:'A레벨 시험',m:6,a:18,f:'alv'}},
  IT:{st:9,sv:6,wv:12,n:24,x2:{n:'마투리타(고교 졸업시험)',m:6,a:18,f:'pct'}},
  ES:{st:9,sv:6,wv:12,n:25,x2:{n:'PAU(대학 입학시험)',m:6,a:18,f:'pct'}},
  AU:{st:2,sv:12,wv:7,n:25,x2:{n:'ATAR 졸업시험',m:10,a:17,f:'pct'}}
};
function sysOf(L){ if(L._sys&&L._sys.c===L.c) return L._sys; const o=Object.assign({st:9,sv:7,wv:1,n:40},SYS_RG[L.C.rg]||{},SYS[L.c]||{});
  if(!o.x2&&L.C.tier>=2) o.x2={n:'대학 입학시험',m:(o.st+8)%12+1,a:18,f:'pct'}; o.c=L.c; Object.defineProperty(L,'_sys',{value:o,enumerable:false,configurable:true,writable:true}); return o; }
// 명절이 드는 달: 이슬람 명절은 해마다 11일쯤 빨라진다
const FEST_M=[[/춘절|설 명절|설날|뗏|새해 첫 참배|새해 명절|새해 축제|호주의 날|팀카트/,1],[/카니발|와이탕이/,2],[/노루즈|성 패트릭|봄맞이/,3],[/송끄란|띤잔|삐마이|벵골 새해|부활절|유월절|왕의 날|물 축제|물 뿌리기|성주간/,4],
  [/하지|쿠팔라|성 요한|여름맞이/,6],[/나담|혁명 기념일|캐나다의 날|노래 축제/,7],[/8월 축제|홈오워/,8],[/추석|9월 축제|수확 축제/,9],[/디왈리|다사인|체추/,10],[/추수감사절|죽은 자의 날|모닥불의 밤/,11],[/크리스마스|정카누/,12]];
function eidMonth(yr){ return new Date(Date.UTC(2026,2,20)-Math.round((yr-2026)*10.875)*864e5).getUTCMonth()+1; }
function festMonth(L,yr){ const f=L.C.fest||''; if(/이드|르바란|하리 라야|라마단 명절/.test(f)) return new Date(Date.UTC(2026,2,20)-Math.round((yr-2026)*10.875)*864e5).getUTCMonth()+1;
  if(/타바스키/.test(f)) return new Date(Date.UTC(2026,4,27)-Math.round((yr-2026)*10.875)*864e5).getUTCMonth()+1; for(const [re,m] of FEST_M) if(re.test(f)) return m; return null; }
const mOf=(sy,k)=>((sy.st-1+k)%12+12)%12+1;        // 새 학년 시작에서 k달 뒤

/* ---------- [데이터] 과목 · 동아리 · 대학 학과 ---------- */
const HOBBIES=['축구','그림 그리기','기타 연주','텃밭 가꾸기','뜨개질','독서','요리','사진 찍기','낚시','체스','춤','등산','노래','코딩','별 보기','수영','농구','달리기','피아노','글쓰기','배드민턴','종이접기','새 관찰','목공','자전거 타기','바둑','배구','크리켓','연날리기','탁구'];
const HOB_OK={크리켓:['IN','PK','BD','LK','GB','AU','NZ','ZA','AF'],바둑:['KR','CN','JP','TW'],'코딩':null};
const SUBJ_E=['국어','수학','사회','과학','영어'], SUBJ_M=['국어','수학','영어','과학','사회','역사','기술·가정','정보'];
const CLUBS=['수학 탐구반','방송부','밴드부','과학 실험반','농구부','댄스부','도서부','사진반','로봇 코딩반','영어 회화반','미술부','합창단','토론반','축구부'];
const MAJORS_U=['컴퓨터공학과','경영학과','간호학과','수학교육과','기계공학과','국어국문학과','생명과학과','심리학과','건축학과','경제학과','화학공학과','사회복지학과','디자인학과','물리학과','법학과','의예과'];

/* ---------- 시험 점수 만들기: 실력(ac)에 그날의 운이 더해진다 ---------- */
const Phi=z=>{ const t=1/(1+.2316419*Math.abs(z)), d=.3989423*Math.exp(-z*z/2), p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return z>0?1-p:p; };
const gr9=p=>{ const q=1-clamp(p,0,1); return q<.04?1:q<.11?2:q<.23?3:q<.40?4:q<.60?5:q<.77?6:q<.89?7:q<.96?8:9; };
const gr5=p=>{ const q=1-clamp(p,0,1); return q<.10?1:q<.34?2:q<.66?3:q<.90?4:5; };
const rnd=(x,a,b)=>Math.round(clamp(x,a,b));
function fmtRank(n){ n=Math.max(1,Math.round(n)); if(n<10000) return n.toLocaleString('ko-KR'); const man=Math.floor(n/10000), ch=Math.round((n%10000)/1000); return `${man}만${ch?' '+ch+'천':''}`; }
const EXF={
  kr9:p=>['국어','수학','영어','탐구1','탐구2'].map(s=>`${s} ${gr9(p+gauss()*.07)}`).join(' · ')+'등급',
  cn750:p=>{ const s=rnd(255+p*430+gauss()*12,160,725); return `총점 ${s}점(750점 만점). ${s>=520?'본과 1차 합격선(一本线)을 넘었다':s>=430?'본과 합격선은 넘었다':'전문대 합격선에 걸렸다'}`; },
  cnzk:p=>`총점 ${rnd(300+p*380+gauss()*12,200,700)}점(750점 만점)`,
  jp:p=>`${rnd(380+p*520+gauss()*15,250,960)}점(1000점 만점)`,
  jpH:p=>p>.35?'1지망 고등학교에 합격했다':'1지망은 떨어지고, 2지망 사립 고등학교에 합격했다',
  in10:p=>`${(58+p*40).toFixed(1)}%`,
  in12:p=>`보드 시험 ${(57+p*41).toFixed(1)}% · JEE 전국 ${fmtRank((1-p)*1200000+1)}등`,
  pk:p=>`${rnd(540+p*540,330,1095)}점(1100점 만점)`,
  bd:p=>{ const g=Math.min(5,2.5+p*2.7); return g>=5?'GPA 5.00 만점':`GPA ${g.toFixed(2)}(5.00 만점)`; },
  utbk:p=>`평균 ${rnd(380+p*370,300,780)}점`,
  vn30:p=>`${(13.5+p*15).toFixed(2)}점(세 과목 30점 만점)`,
  waec:p=>{ const g=['A1','B2','B3','C4','C5','C6','D7','E8','F9'], pick=()=>g[clamp(Math.floor((1-clamp(p+gauss()*.12,0,.999))*9),0,8)], e=pick(), m=pick(); const cr=clamp(Math.round(2+p*7+gauss()),0,9); return `영어 ${e} · 수학 ${m} 등 9과목 중 ${cr}과목 C6 이상, JAMB ${rnd(130+p*230,100,360)}점(400점 만점)`; },
  kcse:p=>`평균 ${['E','D-','D','D+','C-','C','C+','B-','B','B+','A-','A'][clamp(Math.floor(p*12),0,11)]}등급`,
  za:p=>p>.5?'학사 학위 진학 자격(배철러 합격)':p>.25?'디플로마 진학 자격':'고교 졸업 자격',
  eg:p=>`${(55+p*44).toFixed(1)}%`,
  lgs:p=>`${rnd(240+p*255,150,500)}점(500점 만점)`,
  trR:p=>`전국 ${fmtRank((1-p)*2500000+1)}등`,
  irR:p=>`전국 ${fmtRank((1-p)*1000000+1)}등`,
  ru100:p=>`수학 ${rnd(38+p*58+gauss()*5,20,100)} · 러시아어 ${rnd(45+p*52+gauss()*5,24,100)}점(100점 만점)`,
  sat:p=>`${Math.round(clamp(820+p*720+gauss()*30,500,1600)/10)*10}점(1600점 만점)`,
  mx:p=>`${rnd(820+p*430,700,1300)}점`,
  enem:p=>`평균 ${rnd(420+p*380,350,800)}점`,
  abi:p=>`평균 ${clamp(3.7-p*2.75,1,4).toFixed(1)}점(1.0이 가장 좋음)`,
  bac:p=>{ const s=clamp(8.5+p*10+gauss()*.6,5,19.6); return `${s.toFixed(1)}점(20점 만점)${s>=16?' · 최우수':s>=14?' · 우수':s>=12?' · 양호':s>=10?' · 합격':' · 재시험 대상'}`; },
  gcse:p=>`9~1등급 중 평균 ${clamp(3+p*5.8,1,9).toFixed(1)}등급`,
  alv:p=>['A*','A','B','C','D','E'].slice(clamp(Math.floor((1-p)*5),0,4)).slice(0,3).join(' · '),
  pct:p=>`${rnd(42+p*54,20,99)}점(100점 만점)`
};

/* ---------- [데이터] 달력의 사건들 ----------
   Y(시작나이, 끝나이, 조건, 달, 문장, 결과, 덧붙임)
   조건(띄어쓰기로 여럿, 모두 맞아야 함): e 초등학생 · m 중학생 · h 고등학생 · hg 일반고 · hv 직업계고 · s 초·중·고 학생 · u 대학생 · rt 재수생
     ns 학교에 다니지 않는 아이 · w 일하는 사람 · jk:farm|shop 그런 일 · jn:운전 일 이름 · nj 일이 없는 어른 · ret 일을 내려놓음
     fam 배우자와 함께 · sgl 혼자 · kb·kp·ke·km·kh·ku 그 나이의 아이가 있음(아기·유아·초·중·고·대학 나이) · ka 다 큰 자녀 · gk 손주
     par 부모님이 살아 계심 · sib 동생 · U 도시 · R 농촌 · KR 같은 나라 코드(!KR 그 나라가 아닐 때) · rg:AF 지역 · t3 소득 수준 3 이상 · t2 2 이하
     m0 남자 · f1 여자 · g=3 / g>1 / g<4 학년 · house 집 있음 · rent 집 없음 · debt 빚 · car 탈것 · x1 · x2 그 나라에 그런 시험이 있음 · ac+ 공부를 잘함 · ac- 공부가 힘듦
   달: 숫자(그 달) · 's2'(새 학년 두 달째) · 'sv' 여름방학 · 'wv' 겨울방학 · 'x1'·'x2' 시험 달 · '*' 아무 때 · [여럿 중 하나]
   결과: 'k2 j1' 같은 변화(그냥 일어나는 일) 또는 [[선택지, 변화, 결과 문장], …] (고르는 일. 확률은 수치와 성향이 만든다)
   덧붙임: k 해마다 하나씩만 고르는 묶음 · once 평생 한 번 · cd n 다시 일어나기까지 n년 · w 뽑힐 무게 · ex 시험 결과 종류 · big 중요한 기억 · sc 사진 종류 · run 결과에 따른 처리 */
const CAL=[];
const pickV=s=>typeof s==='string'&&s.includes('||')?pickOne(s.split('||')):s;   // 여러 문장 가운데 하나
function Y(a0,a1,cond,mon,txt,res,x){ const o=Object.assign({a:[a0,a1],c:cond?cond.split(' '):[],mon,txt},x||{}); if(typeof txt==='string'&&txt.includes('||')){ o.txts=txt.split('||'); o.txt=o.txts[0]; }
  const isFx=x=>typeof x==='string'&&/^([@$%hjkrHVMx]-?\d+\s*)+$/.test(x.trim());
  if(Array.isArray(res)) o.opts=res.map(r=>{ const p=parseFx(r[1]); if(isFx(r[3])) Object.assign(p.fx,parseFx(r[3]).fx); return {l:r[0],res:r[2],fail:isFx(r[3])?(r[4]||null):(r[3]||null),...p}; }); else { const p=parseFx(res||''); o.fx=p.fx; o.tr=p.tr; }
  o.id=CAL.length; CAL.push(o); const cc=o.c.filter(t=>/^[A-Z]{2}$/.test(t)); if(cc.length===1){ o.cc=cc[0]; (CAL_C[cc[0]]||(CAL_C[cc[0]]=[])).push(o); } else CAL_G.push(o); }
const CAL_G=[], CAL_C={};   // 나라 하나에만 쓰는 사건은 따로 모아, 그 나라에 태어난 삶에서만 살핀다

/* ---------- 결과에 따른 처리 (run) ----------
   pre: 결과 문장을 만들기 전에 (빈칸 값 정하기) · post: 결과가 정해진 뒤 (덧붙일 문장과 변화) */
const CALRUN={
  leader:{post:(L,ok,oi)=>oi!==0?null:ok&&R()<.55?{t:'개표 결과, 반장에 뽑혔다!',fx:{r:3,j:3}}:{t:'아쉽게 몇 표 차이로 떨어졌다.',fx:{j:-1}}},
  contest:{post:(L,ok,oi)=>{ const p=Phi((L.ac-55)/15)*(ok?1:.5); return p>.8&&R()<.6?{t:'금상을 받았다! 조회 시간에 이름이 불렸다.',fx:{j:4,k:1}}:p>.5&&R()<.6?{t:'장려상을 받았다.',fx:{j:2}}:{t:'상은 못 탔지만 배운 게 많았다.'}; }},
  crush:{pre:(L,v)=>{ const yes=R()<.4+(L.s.r-50)/200+L.tr.K*.003; L._crushOK=yes; v.crushRes=yes?`${josa(v.crush,'이','가')} 수줍게 고개를 끄덕였다.`:`${josa(v.crush,'은','는')} 미안하다며 웃었다. 그래도 좋은 친구로 남았다.`; },
         post:(L,ok,oi)=>oi===0&&ok?(L._crushOK?{fx:{j:4,r:2}}:{fx:{j:-3}}):null},
  hsWish:{post:(L,ok,oi)=>{ L.f.hsWish=['gen','voc','sp'][oi]; return null; }},
  susi:{post:(L,ok,oi)=>{ L.f.susi=oi; return null; }},
  susiR:{post:L=>{ const f=L.f; if(f.susi==null||f.susi===2) return {t:'수시 합격자 발표 날, 친구들의 환호와 한숨 사이에서 나는 묵묵히 정시 원서를 준비했다.'};
      const q=Phi((L.ac-50)/17), p=clamp((f.susi===0?.22:.55)+(q-.5)*.7,.05,.92);
      if(R()<p){ const un=pickUniv(L,f.susi===0?Math.max(q,.9):q*.85), mj=f.major||pickOne(MAJORS_U); f.uOffer=un; f.major=mj; return {t:`수시 합격자 발표 날. ${un} ${mj} 최초 합격! 화면 속 ‘합격’ 두 글자를 몇 번이나 다시 보았다.`,fx:{j:8},big:1}; }
      return {t:'수시 합격자 발표 날. 여섯 장 가운데 합격은 없었다. 이제 수능 점수로 정시에 도전한다.',fx:{j:-6}}; }},
  pay:{post:L=>{ const r=clamp(.3+gauss()*2+(L.s.k-50)/40+(L.tr.D>20?.5:0),-4,9); const before=L.inc; L.inc=L.payClamp(L.inc*(1+r/100)); L.maxInc=Math.max(L.maxInc,L.inc);
      return {t:`${Math.abs(r)<.3?'월급이 그대로였다.':r>0?`월급이 ${r.toFixed(1)}% 올랐다.`:`일감이 줄어 월급이 ${(-r).toFixed(1)}% 깎였다.`} 이제 한 달에 약 ${josa(fmtPay(L.inc),'을','를')} 받는다.`,fx:{j:r>2?2:r<0?-2:0}}; }},
  checkup:{post:L=>L.s.h<48&&R()<.6?{t:'혈압과 혈당이 높다는 결과가 나왔다. 식단을 바꾸고 걷기 시작했다.',fx:{h:2,j:-1}}:{t:'모두 정상이었다. 의사가 지금처럼만 지내라고 했다.',fx:{j:1}}},
  harvest:{post:L=>{ const x=R()+(L.C.hz.includes('drought')?-.15:0); return x>.7?{t:'올해는 풍년이었다. 창고가 가득 찼다.',fx:{'@':2,j:3}}:x<.2?{t:'가뭄과 병충해로 거둔 것이 절반으로 줄었다.',fx:{'@':-2,j:-3}}:{t:'평년만큼 거두었다. 땀 흘린 만큼 거두었다.',fx:{'@':1,j:1}}; }},
  tax:{post:()=>R()<.65?{t:'세금을 조금 돌려받았다.',fx:{'@':1}}:{t:'세금을 더 내야 했다.',fx:{'@':-1}}},
  invest:{post:(L,ok,oi)=>{ if(oi!==1) return null; const up=R()<.55, v=up?Math.round(8+R()*25):-Math.round(8+R()*22); return {t:up?`주가가 올라 모은 돈이 ${v}% 늘었다.`:`주가가 떨어져 모은 돈이 ${-v}% 줄었다.`,fx:{'%':v,j:up?2:-3}}; }},
  scholar:{post:(L,ok)=>ok&&L.ac>52?{t:'성적 장학금을 받았다! 등록금의 절반을 아꼈다.',fx:{'@':3,j:3}}:{t:'아깝게 장학금 기준에 못 미쳤다.'}},
  exch:{post:(L,ok,oi)=>oi===0&&ok&&R()<.6?{t:`교환학생에 뽑혀 ${pickOne(['독일 베를린','미국 보스턴','일본 교토','프랑스 리옹','캐나다 밴쿠버','호주 멜버른','싱가포르'])}에서 한 학기를 보냈다.`,fx:{k:4,j:4,r:2},big:1}:oi===0?{t:'이번에는 뽑히지 못했다.'}:null},
  petGet:{post:(L,ok,oi,v)=>{ if(oi!==0) return null; L.f.pet={n:v.petN,sp:v.petSp,a:L.age,life:v.petSp==='강아지'?11+Math.floor(R()*6):13+Math.floor(R()*6)}; return null; }},
  petDie:{post:L=>{ if(L.f.pet) L.f.pet.dA=L.age; return null; }},
  hobPick:{post:(L,ok,oi,v)=>{ const n=[v.hobA,v.hobB,v.hobC][oi]; if(!n) return null; L.f.hob=(L.f.hob||[]).concat([{n,lv:1,a:L.age}]); return null; }},
  hobUp:{post:(L,ok,oi,v)=>{ const h=(L.f.hob||[]).find(x=>x.n===v.hob); if(!h) return null; h.lv+=1+(R()<.3?1:0); return {t:`(${h.n} Lv.${h.lv})`}; }},
  hobShow:{post:(L,ok,oi,v)=>{ if(oi!==0) return null; const h=(L.f.hob||[]).find(x=>x.n===v.hob); const lv=h?h.lv:1; return ok&&lv>=6&&R()<.5?{t:'상을 받았다! 사람들이 실력을 알아보기 시작했다.',fx:{j:3}}:{t:'상은 못 받았지만 다음이 기대된다.'}; }},
  twins:{post:L=>{ L.f.twins=1; L.f.kWant=Math.max(L.f.kWant||0,(L.kids||[]).length+2); return null; }},
  parentMtg:{post:L=>L.acInit()>=60?{t:'“늘 성실하고, 질문을 잘 하는 학생입니다.” 돌아오는 길에 부모님이 웃으셨다.',fx:{j:2,r:1}}:L.ac<40?{t:'“조금만 더 집중하면 충분히 잘할 수 있어요.” 그날 저녁 가족회의가 열렸다.',fx:{k:1}}:{t:'“친구들과 잘 지내는 밝은 학생입니다.” 부모님이 어깨를 토닥여 주셨다.',fx:{r:1}}},
  intern:{post:(L,ok)=>ok&&R()<.6?{t:`${L.c==='KR'?pickOne(['한빛전자','미래금융','다온소프트','세움건설','푸른제약']):L.C.city+' '+pickOne(['무역','은행','통신','방송국'])}에서 인턴으로 일하게 되었다.`,fx:{k:3,j:2}}:{t:'모두 떨어졌다. 다음 기회를 노린다.',fx:{j:-2}}}
};

/* ---------- 비슷한 일이 연달아 되풀이되지 않게 ----------
   같은 갈래(무대·홍수·유행병·대회 결승·이사·큰 실수·성적)의 일은 정해 둔 햇수만큼 띄운다.
   해마다 하나씩 고르는 묶음(봄·가을 행사, 유행병)은 최근 몇 해 안에 나온 것을 피한다. */
const THEMES=[['stage',/발표회|학예회|재롱잔치|음악회|합창|무대에 서/,3],['flood',/물에 잠|홍수|강물이 넘|넘칠 거라|물이 불어나/,10],['epi',/유행|돌림병|말라리아|뎅기|콜레라|홍역|독감|감염병/,5],
  ['sportF',/대회에서 결승|결승에 올/,5],['move',/이사를 (간|가)|멀리 이사/,8],['oops',/크게 실수|큰 실수/,8],['grade',/성적이 (갑자기|떨어)|성적 걱정/,4]];
function themeOf(t){ t=String(t||''); for(const th of THEMES) if(th[1].test(t)) return th; return null; }
const SOFTK={spring:3,autumn:3,sem2:2,ex1:2,ep_out:12,ep_flu:6,chore:2};
/* ---------- 달력: 고르기 · 일어나기 ---------- */
Object.assign(Life.prototype,{
  // 결혼 갈림길 전에 먼저 만나 사귀는 사람 (결혼할 때 같은 사람이 나온다)
  preSpouse(){ const P=this.ppl||(this.ppl={}); if(!P.pre) P.pre=this.makeSpouse(); return P.pre; },
  // 문장에 이름만 나오면 누군지 모른다: 처음 나오는 이름 앞에 관계를 붙인다 (이미 '아내 ○○'처럼 써 있으면 그대로)
  relTag(s){ if(!s||typeof s!=='string') return s; const P=this.ppl||{}, yr=this.cur&&this.cur.yr||{}, me=this.sex, list=[];
    const add=(p,rel)=>{ const n=p&&(p.n||p); if(n&&typeof n==='string'&&n.length>=2&&n!==this.name) list.push([n,rel]); };
    add(P.spouse,me===0?'아내':'남편'); add(P.pre,'사귀는 사람'); add(P.mom,'엄마'); add(P.dad,'아빠'); add(P.gran,'할머니');
    add(P.sib,'동생'); add(P.friend,'친구'); add(P.teacher,'선생님'); add(P.coll,'동료'); add(P.coll2,'후배'); add(P.boss,'윗사람');
    (this.kids||[]).forEach(k=>add(k,k.sex===1?'딸':'아들'));
    ((this.fam&&this.fam.sibs)||[]).forEach(b=>{ if(b&&b.n) add(b,b.d>0?'동생':b.sex===1?(me===0?'누나':'언니'):(me===0?'형':'오빠')); });
    add(yr.hr,'담임 선생님'); add(yr.mate,'짝꿍'); add(yr.mate2,'반 친구'); add(yr.crush,'좋아하는 친구');
    if(s.trim().length<=12) return s;
    const rels={}; list.forEach(([n,r])=>{ (rels[n]=rels[n]||new Set()).add(r); }); const seen={}; list.sort((x,y)=>y[0].length-x[0].length);
    for(const [n,rel] of list){ if(seen[n]||rels[n].size>1) continue; seen[n]=1; const i=s.indexOf(n); if(i<0) continue;
      const before=s.slice(Math.max(0,i-9),i); if(/(아내|남편|엄마|아빠|어머니|아버지|할머니|할아버지|동생|형|누나|언니|오빠|친구|선생님|담임|동료|후배|상사|윗사람|부장|과장|팀장|사장|아들|딸|손주|손자|손녀|짝꿍|연인|배우자|사람|이웃|아이|첫째|둘째|셋째|넷째|막내)\s*$/.test(before)) continue;
      if(i>0&&/[가-힣A-Za-z]/.test(s[i-1])) continue;
      s=s.slice(0,i)+rel+' '+s.slice(i); }
    return s; },
  // 지금 어느 학교에 다니는가
  stageOf(){ const f=this.f, a=this.age; if(f.retry) return 'rt'; if(f.univ&&f.school) return 'u';
    if(a>=7&&a<=12) return f.elem&&f.school!==0?'e':'ns'; if(a>=13&&a<=15) return f.sec?'m':'ns'; if(a>=16&&a<=18) return f.sec&&f.hs?'h':'ns'; return a<7?'pre':'adult'; },
  gradeOf(st){ const a=this.age; return st==='e'?a-6:st==='m'?a-12:st==='h'?a-15:st==='u'?Math.max(1,a-(this.f.univA||19)+1):0; },
  acInit(){ if(this.ac==null) this.ac=clamp(48+(this.s.k-50)*.5+FAM[this.famI].w*18+gauss()*9,15,90); return this.ac; },
  kidIn(a0,a1){ const ks=(this.kids||[]).map((k,i)=>({k,i,a:this.age-k.b})).filter(x=>x.a>=a0&&x.a<=a1); return ks.length?pickOne(ks):null; },
  // 사건 하나의 조건을 따진다. 맞으면 그 사건에 쓸 값(ctx)을, 아니면 null
  calCtx(ev,st,sy){ const f=this.f, a=this.age, C=this.C, ctx={st}; let g=null;
    for(const tk of ev.c){ let ok=true;
      if(tk[0]==='!'&&!/^!([A-Z]{2}|fl:)/.test(tk)) ok=this.calCtx({c:[tk.slice(1)]},st,sy)==null;
      else if(tk.includes('|')&&!/^(rg:|hz:|jk:|jn:|rel:|!?fl:|!?[A-Z]{2}\|)/.test(tk)) ok=tk.split('|').some(t=>this.calCtx({c:[t]},st,sy)!=null);
      else if(tk==='e'||tk==='m'||tk==='h'||tk==='u'||tk==='rt'||tk==='ns') ok=st===tk;
      else if(tk==='s') ok=/^[emh]$/.test(st);
      else if(tk==='hg') ok=f.hs==='gen'; else if(tk==='hv') ok=f.hs==='voc'; else if(tk==='pre') ok=a<7;
      else if(tk==='w') ok=!!f.job&&!f.school&&!this._army; else if(tk==='nj') ok=this.reqOK('nojob'); else if(tk==='ret') ok=!!f.retired;
      else if(tk==='fam') ok=!!f.family; else if(tk==='sgl') ok=!f.family&&!f.widow&&a>=19; else if(tk==='wid') ok=!!f.widow;
      else if(/^k[bpemhua]$/.test(tk)){ const R_={kb:[0,2],kp:[3,6],ke:[7,12],km:[13,15],kh:[16,18],ku:[19,24],ka:[25,60]}[tk]; const kd=this.kidIn(R_[0],R_[1]); ok=!!kd; if(kd){ ctx.ki=kd.i; ctx.ka=kd.a; } }
      else if(tk==='gk') ok=!!f.grandkid; else if(tk==='par') ok=!f.pgone; else if(tk==='sib') ok=!!this.sib&&a<30;
      else if(tk==='U'||tk==='R') ok=this.set===tk;
      else if(tk==='t1') ok=C.tier===1; else if(tk==='t2') ok=C.tier<=2; else if(tk==='t3') ok=C.tier>=3; else if(tk==='t4') ok=C.tier>=4;
      else if(tk==='m0') ok=this.sex===0; else if(tk==='f1') ok=this.sex===1;
      else if(tk==='house') ok=!!this.house; else if(tk==='rent') ok=!this.house&&a>=25&&!!f.job; else if(tk==='debt') ok=this.cash<0;
      else if(tk==='car') ok=a>=C.veh.age&&a<75;
      else if(tk==='x1') ok=!!sy.x1&&a===sy.x1.a;
      else if(tk==='x2') ok=!!sy.x2&&(ctx.ka!=null?ctx.ka===sy.x2.a:(a===sy.x2.a||st==='rt'));
      else if(tk==='ac+') ok=this.acInit()>=60; else if(tk==='ac-') ok=this.acInit()<40;
      else if(tk==='army') ok=!f.army&&!f.retry;
      else if(tk.startsWith('ep:')) ok=epiOn(this,tk.slice(3)); else if(tk==='epInj') ok=false;
      else if(tk.startsWith('jk:')){ const j=this.job; ok=!!j&&tk.slice(3).split('|').includes(j.kind); }
      else if(tk.startsWith('jn:')){ const j=this.job; ok=!!j&&new RegExp(tk.slice(3)).test(j.n); }
      else if(tk.startsWith('rg:')) ok=tk.slice(3).split('|').includes(C.rg);
      else if(tk.startsWith('hz:')) ok=tk.slice(3).split('|').some(h=>C.hz.includes(h));
      else if(tk==='coast') ok=/^(wt|cs)$/.test(C.lt); else if(tk==='inland') ok=!/^(wt|cs)$/.test(C.lt);
      else if(tk.startsWith('yr:')){ const Y=+tk.slice(3), y0=this.by+a; ok=Y>=y0&&Y<y0+this.step; if(ok) ctx.yo=Y-y0; }
      else if(tk.startsWith('rel:')){ const r=this.fam&&this.fam.rel||''; ok=tk.slice(4).split('|').some(x=>r.includes(x)); }
      else if(tk==='sec') ok=!!f.sec;
      else if(tk==='gpal') ok=!this.fam||this.fam.gp.some(g=>g.al); else if(tk==='nogp') ok=!!this.fam&&!this.fam.gp.some(g=>g.al);
      else if(tk==='pet') ok=!!(f.pet&&!f.pet.dA); else if(tk==='petOld') ok=!!(f.pet&&!f.pet.dA&&a-f.pet.a>=Math.max(10,f.pet.life||13));
      else if(tk==='noedu') ok=!f.sec&&a>=19; else if(tk==='gpdead') ok=!!(this.fam&&this.fam.gp.some(g=>!g.al&&g.dA!=null)); else if(tk==='pardead') ok=!!(this.fam&&(!this.fam.mom.al||!this.fam.dad.al));
      else if(tk==='hob') ok=!!(f.hob&&f.hob.length);
      else if(tk.startsWith('fl:')||tk.startsWith('!fl:')){ const neg=tk[0]==='!', m=tk.slice(neg?4:3).match(/^(\w+)([<>])?(\d+)?$/), ch=f.ch||{}, v=m&&ch[m[1]]; let r=v!=null; if(r&&m[2]) r=m[2]==='>'?a-v>=+m[3]:a-v<+m[3]; ok=neg?!r:r; }
      else if(tk==='w+') ok=this.w>=.62; else if(tk==='w-') ok=this.w<.36; else if(tk==='p0') ok=this.famI===0; else if(tk==='p2') ok=this.famI===2;
      else if(tk==='inf') ok=!!f.job&&!!f.inf&&!f.school; else if(tk==='frm') ok=!!f.job&&!f.inf&&!f.school;
      else if(tk==='cs') ok=csOK(this); else if(tk.startsWith('cs:')) ok=csFlag(this,tk.slice(3)); else if(tk==='uniS') ok=!!(f.univ&&f.school); else if(tk==='svc') ok=!!this._army; else if(tk==='svcL') ok=!!(f.svc&&a+this.step>=f.svc[1]); else if(tk==='mig') ok=f.job==='abroad'&&!f.school;
      else if(/^rk[<>=]\d$/.test(tk)){ const r=f.rk||0, n=+tk[3]; ok=!!f.job&&(tk[2]==='>'?r>n:tk[2]==='<'?r<n:r===n); } else if(tk==='rkUp') ok=!!f.job&&rankCan(this);
      else if(tk==='oop+') ok=instOf(this).oop>=45; else if(tk==='oop-') ok=instOf(this).oop<25; else if(tk==='hi') ok=!!instOf(this).hi;
      else if(tk==='sp'){ const sp=instOf(this).sp; ok=!!sp&&a>=sp[0]; } else if(tk==='ros') ok=!!instOf(this).ros; else if(tk==='mm') ok=!!instOf(this).mm;
      else if(tk==='kid') ok=(this.kids||[]).length>0; else if(tk==='nokid') ok=!(this.kids||[]).length; else if(tk==='univD') ok=!!f.univDone; else if(tk==='abrS') ok=!!f.abrS;
      else if(tk==='kidOld') ok=(this.kids||[]).length>0; else if(tk==='mar') ok=!!f.family||!!f.widow; else if(tk==='crt'){ const m=marAgeOf(this); ok=!f.family&&!f.widow&&a>=Math.max(18,m-6)&&a<m; }
      else if(/^g[=<>]\d+$/.test(tk)){ if(g==null) g=this.gradeOf(st); const n=+tk.slice(2), op=tk[1]; ok=op==='='?g===n:op==='>'?g>n:g<n; }
      else if(/^![A-Z]{2}(\|[A-Z]{2})*$/.test(tk)) ok=!tk.slice(1).split('|').includes(this.c);
      else if(/^[A-Z]{2}(\|[A-Z]{2})*$/.test(tk)) ok=tk.split('|').includes(this.c);
      if(!ok) return null; }
    return ctx; },
  // 사건이 일어나는 달 (1~12)
  calMonth(spec,sy){ if(typeof spec==='number') return spec; spec=String(spec);
    if(spec[0]==='['){ const xs=spec.slice(1,-1).split(','); return this.calMonth(pickOne(xs).trim(),sy); }
    if(spec==='*') return null; if(spec==='sv') return sy.sv; if(spec==='wv') return sy.wv;
    if(spec==='x1') return sy.x1?sy.x1.m:null; if(spec==='x2') return sy.x2?sy.x2.m:null;
    if(spec[0]==='s') return mOf(sy,+spec.slice(1)); return +spec||null; },
  // 올해의 달력을 짠다: 해마다 돌아오는 일(같은 묶음에서 하나씩) + 그 해만의 일, 모두 열 가지 안팎
  planCal(){ const a=this.age, f=this.f; if(f.dying||this.dead||this.lite) return [];
    if(f.svc&&a>=f.svc[1]){ f.svcDone=1; f.svc=null; }
    if(f.svc&&f.univ&&f.school){ f.svcLeft=Math.max(1,f.svc[1]-Math.max(a,f.svc[0])); f.svc=null; }      // 대학에 들어가면 남은 복무는 졸업 뒤로
    if(f.svcLeft&&!f.school&&f.univDone){ f.svc=[a,a+f.svcLeft]; f.svcLeft=0; }
    const st=this.stageOf(), sy=sysOf(this), used=this.calUsed||(this.calUsed={}), two=this.step>1;
    this._army=(this.c==='KR'&&this.sex===0&&a>=19&&a<=20&&!f.army&&!f.retry&&!f.univ)||!!(f.svc&&a>=f.svc[0]&&a<f.svc[1]);   // 군 복무 중에는 일터의 일이 없다
    const N0=a<1?3:a<3?2:a<7?4:a<13?10:a<19?11:a>=80?5:a>=70?7:10, N=this.pace==='short'?Math.max(2,Math.round(N0*.5)):N0;
    const byK={}, pool=[], thA=this.thA||(this.thA={});
    const pool0=CAL_C[this.c]?CAL_G.concat(CAL_C[this.c]):CAL_G;
    pool0.forEach(ev=>{ if(a<ev.a[0]||a>ev.a[1]) return; const u=used[ev.id]; if(u!=null&&(ev.once||(ev.cd&&a-u<ev.cd))) return;
      const th=ev.th===undefined?(ev.th=themeOf(ev.txt)):ev.th; if(th&&thA[th[0]]!=null&&a-thA[th[0]]<th[2]&&!(ev.k&&/^ep_pan/.test(ev.k))&&!ev.c.some(t=>t.startsWith('yr:'))) return;
      const ctx=this.calCtx(ev,st,sy); if(!ctx) return; const x={ev,ctx}; if(ev.k) (byK[ev.k]=byK[ev.k]||[]).push(x); else pool.push(x); });
    const wpick=arr=>{ let r=R()*arr.reduce((t,x)=>t+(x.ev.w||1),0); for(const x of arr){ r-=x.ev.w||1; if(r<0) return x; } return arr[arr.length-1]; };
    for(const k in byK){ const g=SOFTK[k]; if(!g) continue; const fresh=byK[k].filter(x=>used[x.ev.id]==null||a-used[x.ev.id]>=g); if(fresh.length) byK[k]=fresh; else if(/^ep_/.test(k)) delete byK[k]; else byK[k]=[byK[k].reduce((b,x)=>(used[x.ev.id]||0)<(used[b.ev.id]||0)?x:b)]; }
    let sel=Object.keys(byK).map(k=>wpick(byK[k]));
    if(sel.length>N){ sel.sort((p,q)=>(q.ev.ex||q.ev.big?1:0)-(p.ev.ex||p.ev.big?1:0)); sel=sel.slice(0,N); }
    // 해마다 그 나라만의 일(어린이 1 · 학생 2 · 어른 3가지)과 하는 일에 딸린 일(1가지)을 먼저 자리 잡게 한다
    const take=(test,n)=>{ for(let g=0;g<n&&sel.length<N;g++){ const idx=[]; pool.forEach((x,i)=>{ if(test(x.ev)) idx.push(i); }); if(!idx.length) return; let r=R()*idx.reduce((s,i)=>s+(pool[i].ev.w||1),0), j=0; for(;j<idx.length-1;j++){ r-=pool[idx[j]].ev.w||1; if(r<0) break; } sel.push(pool.splice(idx[j],1)[0]); } };
    take(ev=>ev.cc===this.c,a<7?1:a<13?2:3); if(f.job&&!f.school) take(ev=>ev.c.some(t=>t.startsWith('jk:')),1);
    while(sel.length<N&&pool.length){ const w=pool.map(x=>(x.ev.w||1)*(x.ev.once?1.4:1)*(x.ev.c.length>1?1.2:1)*(x.ev.c.some(t=>/^(e|m|h|u|rt|ns|w)$/.test(t))?1.6:1)); let r=R()*w.reduce((s,y)=>s+y,0), i=0; for(;i<pool.length-1;i++){ r-=w[i]; if(r<0) break; } sel.push(pool.splice(i,1)[0]); }
    // 달 정하기: 정해진 달이 있으면 그 달, 없으면 덜 붐비는 달에
    sel.forEach(x=>{ const th=x.ev.th; if(th) thA[th[0]]=a; });
    const cnt={}, span=two?24:12, out=[];
    const fm=festMonth(this,this.by+a);
    sel.forEach(x=>{ if(x.ctx.yo!=null){ x.m=(this.calMonth(x.ev.mon,sy)||1+Math.floor(R()*12))+12*x.ctx.yo; if(x.m!=null) cnt[x.m]=(cnt[x.m]||0)+1; return; } let m=/\{fest\}/.test(x.ev.txt+(x.ev.opts?x.ev.opts.map(o=>o.res).join(''):''))&&fm&&(x.ev.mon==='*'||x.ev.mon==='wv')?fm:this.calMonth(x.ev.mon,sy); if(m!=null&&two&&(x.ev.y2||(x.ev.k&&x.ev.k.startsWith('army')&&f.univ))) m+=12; else if(m!=null&&two&&!x.ev.fix&&!(x.ev.k&&x.ev.k.startsWith('army'))&&R()<.5) m+=12; x.m=m; if(m!=null) cnt[m]=(cnt[m]||0)+1; });
    sel.filter(x=>x.m==null).forEach(x=>{ let best=null, bc=99; for(let t=0;t<8;t++){ const m=1+Math.floor(R()*span); const c=cnt[m]||0; if(c<bc){ bc=c; best=m; } } x.m=best; cnt[best]=(cnt[best]||0)+1; });
    sel.forEach(x=>out.push({id:x.ev.id,m:x.m,ctx:x.ctx,done:0,k:x.ev.k?0:1}));
    // 가족 이야기도 같은 달력에 (해마다 한두 가지에서 여러 가지까지)
    this.famPlan().concat(this.compPlan()).forEach(x=>{ let m=x.m; if(m==null){ let best=1, bc=99; for(let t=0;t<6;t++){ const mm=1+Math.floor(R()*12); if((cnt[mm]||0)<bc){ bc=cnt[mm]||0; best=mm; } } m=best; }
      if(two&&(x.dyn.y===1||(x.dyn.y==null&&R()<.5))) m+=12; cnt[m]=(cnt[m]||0)+1; out.push({dyn:x.dyn,m,ctx:{st},done:0,k:1}); });
    out.sort((p,q)=>p.m-q.m||p.k-q.k);
    // 학생이면 올해의 담임·반·친구
    if(/^[emh]$/.test(st)){ const P=this.ppl||{}, sex=this.sex, c=this.c, nm=sx=>joinName(c,pickSur(this),pickGiven(this,sx,'now'),sx===1);
      this.cur.yr={cls:1+Math.floor(R()*(c==='KR'?(this.set==='U'?9:3):5)),hr:joinName(c,pickSur(this),pickGiven(this,R()<(st==='e'?.75:.55)?1:0,'mid'),true),mate:nm(sex),mate2:nm(R()<.5?0:1),crush:nm(1-sex),n:Math.round(sy.n*(this.set==='R'?.7:1)*(.85+R()*.3))}; }
    return out; },
  // 사건 문장의 빈칸 값
  calVars(ev,it){ if(it.v) return it.v; const f=this.f, P=this.ppl||{}, sch=this.sch||{}, st=it.ctx.st, sy=sysOf(this), yr=this.cur&&this.cur.yr||{}, c=this.c, KR=c==='KR';
    if(!P.coll||P.coll.co!==f.co){ const nm=sx=>joinName(c,pickSur(this),pickGiven(this,sx,'mid'),sx===1); P.coll={n:nm(R()<.5?0:1),co:f.co}; P.boss={n:nm(R()<.7?0:1)}; P.coll2={n:joinName(c,pickSur(this),pickGiven(this,R()<.5?0:1,'now'),false)}; }
    const kd=it.ctx.ki!=null?this.kids[it.ctx.ki]:null, ka=it.ctx.ka;
    const hs=this.f.hob||[], hp=HOBBIES.filter(h=>!hs.some(x=>x.n===h)&&(!HOB_OK[h]||HOB_OK[h].includes(this.c))&&!(h==='코딩'&&this.C.tier<=1)).sort(()=>R()-.5);
    const pt=this.f.pet, sp=pickOne(['강아지','고양이']); const v={petSp:sp,petN:pickOne(sp==='강아지'?['초코','보리','두부','콩이','맥스','토토','해피','바둑이']:['나비','루나','치즈','모모','까미','레오','코코','달이']),pet:pt?pt.n:'반려동물',petAge:pt?this.age-pt.a+1:1,hobA:hp[0],hobB:hp[1],hobC:hp[2],hob:hs.length?pickOne(hs).n:'취미',g:this.gradeOf(st),G:st==='e'?sch.elem:st==='m'?sch.mid:st==='h'?(f.hs==='voc'?sch.voc:sch.high):st==='u'?sch.univ:'학교',cls:yr.cls||1,N:yr.n||sy.n,hr:yr.hr||(P.teacher?P.teacher.n:'담임'),
      mate:yr.mate||'짝꿍',mate2:yr.mate2||'반 친구',crush:yr.crush||'그 친구',sub:pickOne(st==='e'?SUBJ_E:SUBJ_M),club:pickOne(CLUBS),x1:sy.x1?sy.x1.n:'졸업 시험',x2:sy.x2?sy.x2.n:'대학 입학시험',
      coll:P.coll.n,coll2:P.coll2.n,boss:KR?P.boss.n:P.boss.n,bff:P.friend?P.friend.n:'친구',kn:kd?kd.n:'아이',kg:ka!=null?Math.max(1,ka-6):1,major:f.major||pickOne(MAJORS_U),voc:sch.voc||'직업학교',
      trip:pickOne(['국립중앙과학관','에버랜드','국립중앙박물관','서울대공원 동물원','롯데월드','독립기념관','국립생태원','경주 불국사']),kTrip:pickOne(['경주','제주도','강원도 설악산','전주 한옥마을','부산','안동 하회마을']),
      kTrip2:pickOne(['제주도','경주','부산','강릉','전주','일본 오사카','베트남 다낭']),comment:pickOne(['친구들과 사이좋게 지내며 맡은 일을 책임감 있게 해냄','수업 시간에 질문이 많고 탐구심이 뛰어남','발표할 때 자신감이 넘치고 목소리가 또렷함','어려운 문제도 끝까지 해결하려는 끈기가 있음','어려움을 겪는 친구를 먼저 돕는 따뜻한 마음을 지님','독서를 즐기며 생각을 글로 잘 표현함']),
      chore:/농부/.test(this.C.work)?this.C.work.replace(/농부$/,'농사'):/어부|양식/.test(this.C.work)?'고기잡이':/목동|양치기|가우초|목장/.test(this.C.work)?'가축 돌보기':this.set==='R'?'밭일':'집안일',jobT:pickOne(['소방관','바리스타','방송 PD','간호사','로봇 공학자','요리사','기자','수의사','웹툰 작가']),crushRes:''};
    v.commentQ=`“${v.comment}”${josa(v.comment,'1','0').slice(-1)==='1'?'이라고':'라고'}`;
    if(/\{lover\}/.test(ev.txt+(ev.txts||[]).join('')+JSON.stringify(ev.opts||[]))) v.lover=this.preSpouse().n;
    Object.assign(v,instVars(this)); v.__t=ev.txts?pickOne(ev.txts):ev.txt;
    const run=ev.run&&CALRUN[ev.run]; if(run&&run.pre) run.pre(this,v); it.v=v; return v; },
  calOptP(o){ let pos=0; for(const k in o.fx) if(o.fx[k]>0&&k in this.s) pos+=o.fx[k]; return pos>3?this.optP(o):null; },
  fillV(s,v){ if(!s) return s; s=specText(this,String(s)); return this.tx(String(s).replace(/\{(\w+)\}(을\(를\)|이\(가\)|은\(는\)|와\(과\)|\(으\)로|과\(와\)|를\(을\)|가\(이\)|는\(은\))?/g,(m,k,p)=>{ const w=v[k]; if(w==null) return m; if(!p) return w; const pr={'을(를)':['을','를'],'이(가)':['이','가'],'은(는)':['은','는'],'와(과)':['과','와'],'(으)로':['으로','로'],'과(와)':['과','와'],'를(을)':['을','를'],'가(이)':['이','가'],'는(은)':['은','는']}[p]; return josa(w,pr[0],pr[1]); })); },
  // 시험 결과: 실력(ac) + 준비(bonus) + 그날의 운
  exam(kind,bonus,v){ const f=this.f, sy=sysOf(this), KR=this.c==='KR'; this.acInit();
    const perf=this.ac+bonus+gauss()*7, p=clamp(Phi((perf-50)/17),.003,.997);
    this.ac=clamp(this.ac+(bonus>0?1.2:bonus<0?-.6:0)+(this.s.k-this.ac)*.04,5,98);
    const sc=(b)=>rnd(b+gauss()*6,20,100);
    if(kind==='dict'){ const s=Math.round(clamp(55+p*50+gauss()*6,30,100)/10)*10; return {p,t:`받아쓰기 ${s}점.${s===100?' 처음으로 100점을 받아 냉장고에 붙였다.':s<60?' 틀린 글자를 열 번씩 다시 썼다.':''}`}; }
    if(kind==='unit') return {p,t:`${v.sub} ${sc(52+p*46)}점.`};
    if(kind==='sch'){ const subs=['국어','수학','영어'].sort(()=>R()-.5).slice(0,2).concat([pickOne(SUBJ_M.slice(3))]), N=v.N||sy.n, rk=Math.max(1,Math.min(N,Math.round((1-p)*N+.5)));
      return {p,t:`${subs.map(s=>`${s} ${sc(40+p*56)}`).join(' · ')}점. 반 ${N}명 중 ${rk}등.${KR&&this.stageOf()==='h'?` 내신 ${gr5(p)}등급.`:''}`}; }
    if(kind==='mock') return {p,t:KR?`국어 ${gr9(p+gauss()*.07)} · 수학 ${gr9(p+gauss()*.07)} · 영어 ${gr9(p+gauss()*.07)} · 탐구 ${gr9(p+gauss()*.07)}·${gr9(p+gauss()*.07)}등급.`:`${sc(40+p*56)}점.`};
    if(kind==='x1'&&sy.x1){ f.mex=p; return {p,t:`${sy.x1.n} 결과: ${EXF[sy.x1.f](p)}.`}; }
    if(kind==='x2'&&sy.x2){ f.uex=f.retry&&f.uex!=null?Math.max(p,f.uex*.5+p*.5):p; return {p,t:`${KR?'수능 성적':sy.x2.n+' 결과'}: ${EXF[sy.x2.f](p)}.`}; }
    if(kind==='gpa'){ const g=KR?clamp(2.4+p*2.1+gauss()*.12,1.5,4.5):clamp(2.1+p*1.9+gauss()*.1,1.3,4); return {p,t:`평점 ${g.toFixed(2)}(${KR?'4.5':'4.0'} 만점).`}; }
    if(kind==='cert') return {p,t:p>.35?'합격! 자격증이 생겼다.':'아쉽게 떨어졌다. 다음 회차에 다시 도전한다.'};
    return {p,t:''}; },
  // 달력의 사건 하나를 일으킨다 (oi: 고른 선택지, 그냥 일어나는 일은 없음)
  calEv(it){ return it.dyn||CAL[it.id]; },
  calDo(k,oi){ const it=this.cur&&this.cur.cal&&this.cur.cal[k]; if(!it||it.done) return null; const ev=this.calEv(it); if(!ev){ it.done=1; return null; }
    const v=this.calVars(ev,it), run=ev.run&&CALRUN[ev.run];
    const q=this.fillV(v.__t||ev.txt,v); let t, fx={}, ok=true, p=null, tr=null, bonus=0, o=null; this._why=q;
    if(ev.opts){ o=ev.opts[oi==null?0:oi]||ev.opts[0]; p=this.calOptP(o); ok=p==null||R()<p; this.n++;
      if(ok){ fx=Object.assign({},o.fx); t=this.fillV(pickV(o.res),v); if(o.tr){ this.tr[o.tr]++; tr=o.tr; } bonus=(o.fx.k||0)*1.5+3; }
      else { for(const key in o.fx) if(o.fx[key]<0) fx[key]=o.fx[key]; t=o.fail?this.fillV(pickV(o.fail),v):ev.ex?pickOne(['긴장해서 아는 문제도 몇 개 틀렸다.','시간이 모자라 마지막 문제들을 서둘러 풀었다.','계획한 만큼 공부하지는 못했다.']):failTx(this.fillV(o.l,v)); this.fail++; bonus=-4; } }
    else { fx=Object.assign({},ev.fx); t=q; bonus=this.cur.study||0; }
    if(ev.opts&&ev.ex) this.cur.study=ok?bonus*.5:-2;
    let big=!!ev.big;
    if(ev.ex){ const r=this.exam(ev.ex,bonus,v); if(r.t) t+=' '+r.t; }
    let xr={}; this._calM=it.m;
    if(run&&run.post){ const r=run.post(this,ok,oi==null?0:oi,v); if(r){ if(r.t) t+=(t?' ':'')+this.fillV(r.t,v); if(r.fx) for(const key in r.fx) fx[key]=(fx[key]||0)+r.fx[key]; if(r.big) big=true; if(r.sick) xr.sick=r.sick; if(r.die) xr.die=1; } }
    const chA=this.age+(it.m>12?1:0), setF=nm=>{ if(!nm) return; (f0.ch||(f0.ch={}))[nm]=chA; if(nm==='move'||nm==='moveC2'){ f0.vSet='U'; f0.placeN=(f0.placeN||0)+1; } else if(nm==='backHome'){ f0.vSet=this.set; f0.placeN=(f0.placeN||0)+1; } }, f0=this.f, oi0=oi==null?0:oi;
    if(ev.set) setF(typeof ev.set==='string'?ev.set:ev.set[oi0]); if(ev.setOK&&ok) setF(typeof ev.setOK==='string'?ev.setOK:ev.setOK[oi0]);
    if(ev.clr&&f0.ch) ev.clr.split(' ').forEach(n=>delete f0.ch[n]);
    this.apply(fx); if(it.dyn) this.famAct(ev.act); else this.calUsed[ev.id]=this.age; it.done=1; it.t=t; it.ok=ok; it.q=ev.opts?q:null; it.fx=fx; delete it.v;
    const age=this.age+(it.m>12?1:0), sc=ev.sc||sceneKindOf(t); this._why=null;
    const base=t; if(ev.opts&&!ev.ex) t=this.vary(base,q); else t=this.pv(base);
    this.remember({a:age,t:base,q:ev.opts?q:undefined,l:o?this.fillV(o.l,v):undefined,big:big?1:0,sc,cal:1,nt:ev.nt||undefined,f:ok?undefined:1,fam:it.dyn?1:undefined});
    return Object.assign({t,q:ev.opts?q:null,fx,p,ok,tr,big,sc,label:o?this.fillV(o.l,v):null,m:it.m,nt:ev.nt||null,fam:!!it.dyn},xr); },
  // 아직 일어나지 않은 달력의 일을 마저 정한다 (해가 끝날 때). 고르는 일은 확률이 가장 높은 선택으로
  calAuto(){ const out=[]; if(!this.cur||!this.cur.cal) return out; this._auto=1; try{
    this.cur.cal.forEach((it,k)=>{ if(it.done) return; const ev=this.calEv(it); let bi=null; if(ev&&ev.opts){ let bp=-1; bi=0; ev.opts.forEach((o,i)=>{ const p=this.calOptP(o); const pp=(p==null?.5:p)-(this.optBlocked&&this.optBlocked(o,'c')?2:0); if(pp>bp){ bp=pp; bi=i; } }); }
      const r=this.calDo(k,bi); if(r) out.push(r); }); }finally{ this._auto=0; }
    return out; },
  ensureCal(){ if(this.cur&&!this.cur.cal&&!this.pending) this.cur.cal=this.planCal(); return this.cur&&this.cur.cal; },
  // 올해의 큰 사건을 미리 정해 둔다 (교사용 '중요 사건' 수가 정확하도록)
  planMajors(n){ const a=this.age, C=this.C, el=[], w=[], thA=this.thA||(this.thA={});
    MAJORS.forEach((m,i)=>{ const u=this.usedM[i]; if(!this.inC(m)||a<m.a[0]||a>m.a[1]||(m.set!=='*'&&m.set!==this.set)||!this.reqOK(m.req)) return;
      if(m.hz&&!C.hz.includes(m.hz)) return; const th=m.th===undefined?(m.th=themeOf(m.txt)):m.th; if(th&&thA[th[0]]!=null&&a-thA[th[0]]<th[2]) return; if(m.maxTier&&C.tier>m.maxTier) return; if(m.minTier&&C.tier<m.minTier) return; if(u!=null&&(!m.rep||a-u<(m.repY||9))) return;
      el.push(i); w.push((th&&th[0]==='grade'&&C.tier<=2?.35:1)*(m.c?2.2:1)*(m.hz?1.6:1)*(m.req&&/^(jk:|sig)/.test(m.req)?1.5:1)*(m.money||1)); });
    const out=[]; while(out.length<n&&el.length){ let r=R()*w.reduce((s,y)=>s+y,0), i=0; for(;i<el.length-1;i++){ r-=w[i]; if(r<0) break; } out.push(el.splice(i,1)[0]); w.splice(i,1); }
    out.forEach(i=>{ const th=MAJORS[i].th; if(th) thA[th[0]]=a; });
    return out; },
  majorOK(i){ const m=MAJORS[i], a=this.age, u=this.usedM[i]; return !!m&&a>=m.a[0]&&a<=m.a[1]&&this.reqOK(m.req)&&!(u!=null&&(!m.rep||a-u<(m.repY||9))); }
});
// 대학 고르기: 시험 성적(q, 0~1)이 높을수록 이름난 대학
function pickUnivQ(L,q){ const UN=UNIV[L.c]; if(!UN) return `${L.C.city} 대학교`; const top=q>=.93||(q>=.8&&R()<(q-.75)*2.5); return pickOne(top?UN[0]:UN[1]); }

/* ---------- [데이터] 달력의 사건들 (Y 함수의 설명은 months.js) ---------- */
// ── 갓난아기 (특별한 일만 몇 가지)
Y(0,0,'t3','*','처음으로 예방접종을 맞았다. 주삿바늘이 들어가자 온 동네가 떠나가게 울었다.','h2',{once:1,sc:'baby'});
Y(0,0,'t2','*','엄마 품에 안겨 보건소에 갔다. 줄을 한참 선 끝에 예방주사를 맞았다.','h2',{once:1,sc:'baby'});
Y(0,0,'','*','처음으로 몸을 뒤집었다. 가족들이 박수를 쳤다.','h1 j1',{once:1});
Y(0,0,'','*','아랫니 두 개가 하얗게 올라왔다. 무엇이든 입으로 가져간다.','j1',{once:1});
Y(0,1,'','*','밤새 열이 나서 엄마가 한숨도 못 잤다. 다음 날 아침에야 열이 내렸다.','h-1 r1',{once:1,sc:'sick'});
Y(1,1,'','*','“엄마”, “아빠” 다음으로 처음 한 말은 “맘마”였다.','k1 r1',{once:1});
Y(1,2,'','*','혼자 숟가락을 들고 밥을 먹어 보았다. 반은 바닥에 흘렸다.','k1 j1',{once:1});
Y(1,2,'U t3','*','어린이집에 처음 갔다. 첫 주 내내 문 앞에서 울었지만, 둘째 주부터는 손을 흔들었다.','r2 k1',{once:1});
Y(2,2,'','*','기저귀를 떼었다. 처음으로 혼자 화장실에 다녀왔다.','k1 j2',{once:1});
Y(2,2,'','*','두 단어를 이어서 말하기 시작했다. “아빠 어디?”','k2',{once:1});

// ── 유아기 (3~6살)
Y(3,5,'U t3','3','유치원에 입학했다. 이름표를 단 가방이 몸보다 컸다.','r2 k1 j1',{once:1,sc:'school'});
Y(3,5,'R','*','엄마를 따라 장터에 갔다. 사람이 너무 많아 손을 꼭 잡았다.','k1 r1',{once:1});
Y(3,6,'U t3','12','유치원 재롱잔치 무대에 섰다.',[['맨 앞줄에서 신나게 춤춘다','j3 B','맨 앞줄에서 신나게 춤을 췄다. 객석의 엄마가 휴대폰으로 찍고 있었다.'],['떨려서 선생님 옆에 꼭 붙어 있는다','r1','선생님 손을 잡고 끝까지 무대에 서 있었다.']],{cd:1,sc:'stage'});
Y(3,6,'','*','동네 형, 누나들을 따라 처음으로 멀리까지 놀러 나갔다. 돌아오니 해가 지고 있었다.','j2 h1 B',{once:1});
Y(3,6,'','*','감기에 걸려 일주일 동안 콧물을 달고 살았다.','h-1',{cd:2,sc:'sick'});
Y(3,6,'KR U','*','손발에 물집이 잡히는 수족구병에 걸려 유치원을 열흘 쉬었다.','h-2',{once:1,sc:'sick'});
Y(4,6,'','*','혼자 이름을 쓸 수 있게 되었다. 삐뚤빼뚤한 글씨로 냉장고에 붙였다.','k2 j1',{once:1});
Y(4,6,'','*','처음으로 치과에 갔다. 의자가 위로 올라가자 무서워서 눈을 꼭 감았다.','h1',{once:1,sc:'hosp'});
Y(4,6,'','*','숲에 소풍을 갔다. 도토리를 주머니 가득 주워 왔다.','j2 k1 C',{once:1});
Y(5,6,'','*','키가 한 뼘 컸다. 문틀에 연필로 그은 줄이 또 하나 늘었다.','h1 j1',{once:1});
Y(5,6,'t3','*','자전거 보조바퀴를 뗐다. 열 번 넘어지고 열한 번째에 혼자 달렸다.','h2 B',{once:1});
Y(5,6,'t2','*','엄마를 도와 물을 길으러 갔다. 작은 통에 물을 가득 담아 왔다.','h1 r2 D',{once:1});
Y(6,6,'KR','12','초등학교 입학 통지서가 왔다. 새 책가방을 메고 거울 앞에서 한참 서 있었다.','j3',{once:1,sc:'school'});
Y(6,6,'!KR t2','*','이웃 언니가 학교에서 배운 글자를 가르쳐 주었다. 흙바닥에 글자를 써 보았다.','k2 r1',{once:1});

// ── 초등학교: 해마다 돌아오는 일
Y(7,12,'e g>1 KR','3','{G} {g}학년 {cls}반이 되었다. 담임은 {hr} 선생님, 첫 짝은 {mate}.','r1',{k:'new',sc:'school'});
Y(7,12,'e g>1 !KR t3','s0','새 학년이 시작되었다. {G} {g}학년, 담임은 {hr} 선생님. 반 친구는 {N}명이다.','r1',{k:'new',sc:'school'});
Y(7,12,'e g>1 t2','s0','새 학년이 되었다. 교실 하나에 {N}명이 빽빽하게 앉는다. 담임은 {hr} 선생님.','r1',{k:'new',sc:'school'});
Y(7,8,'e KR','s1','받아쓰기 시험 날이다.',[['어젯밤 엄마와 열 번 연습했다','k2 D','또박또박 받아썼다.'],['자신 있다며 그냥 본다','j1 B','자신 있게 받아썼다.']],{k:'ex1',ex:'dict',sc:'school'});
Y(9,12,'e','s2','{sub} 단원평가가 있다.',[['교과서를 처음부터 다시 읽는다','k2 D','교과서를 꼼꼼히 다시 읽고 시험을 보았다.'],['문제집을 한 권 풀어 본다','k2 C','문제집을 풀며 모르는 것을 찾아 두었다.'],['오늘은 친구들과 논다','j2 r1','시험 전날 친구들과 실컷 놀았다.']],{k:'ex1',ex:'unit',sc:'school'});
Y(7,8,'e !KR','s2','처음 보는 시험지를 받았다. 이름 쓰는 칸부터 천천히 채웠다.','k1',{k:'ex1',ex:'unit',sc:'school'});
Y(7,12,'e','s7','2학기 {sub} 시험을 보았다.','k1',{k:'sem2',ex:'unit',sc:'school'});
Y(7,12,'e KR','5','운동회 날이다. 청군과 백군으로 나뉘었다.',[['계주 선수로 나간다','h2 B','바통을 받아 힘껏 달렸다. 우리 편이 이겼다!','바통을 떨어뜨려 꼴찌로 들어왔다. 그래도 친구들이 박수를 쳐 주었다.'],['줄다리기에 온 힘을 다한다','h1 r2 D','줄다리기에서 끝까지 버텼다.'],['응원단장을 맡는다','r3 j2 K','목이 쉬도록 응원했다.']],{k:'spring',sc:'sport'});
Y(7,12,'e !KR','s3','학교 체육 대회가 열렸다. 반 대항 {sport} 시합이 있다.',[['선수로 뛴다','h2 B','땀을 흠뻑 흘리며 끝까지 뛰었다.'],['목청껏 응원한다','r2 K','반 친구들과 목이 쉬도록 응원했다.']],{k:'spring',sc:'sport'});
Y(7,12,'e KR','[4,10]','현장체험학습으로 {trip}에 갔다. 김밥 도시락을 {mate}와(과) 나눠 먹었다.','j3 k1 r1',{k:'autumn',sc:'travel'});
Y(7,12,'e !KR','[s2,s8]','학교에서 {city}의 박물관으로 견학을 갔다. 버스 창밖만 보고 있어도 신이 났다.','j2 k2',{k:'autumn',sc:'travel'});
Y(7,12,'e KR','8','여름방학이다.',[['할머니 댁에서 지낸다','r3 j2 K','시골 할머니 댁에서 개울에 발 담그고 수박을 먹었다.'],['수영장과 캠프에 간다','h2 j2','물놀이를 하며 까맣게 탔다.'],['그림일기와 독서록을 미리 끝낸다','k2 D','방학 숙제를 미리 끝내고 마음 편히 놀았다.']],{k:'vacS'});
Y(7,12,'e !KR t3','sv','긴 방학이다.',[['가족과 여행을 간다','j3 r2','가족과 먼 곳으로 여행을 다녀왔다.'],['동네 친구들과 실컷 논다','j2 r2','해가 질 때까지 친구들과 놀았다.'],['도서관 독서 프로그램에 다닌다','k3 C','방학 내내 도서관에서 책을 스무 권 읽었다.']],{k:'vacS'});
Y(7,12,'e t2','sv','방학 동안 집안일을 도왔다.',[['{chore}을(를) 거든다','r2 h1 D','어른들 곁에서 일을 배웠다. 손에 굳은살이 생겼다.'],['동생들을 돌본다','r3 K','동생들을 씻기고 먹이며 방학을 보냈다.'],['틈틈이 교과서를 읽는다','k2','일을 마치고 등잔 아래서 교과서를 읽었다.']],{k:'vacS'});
Y(7,12,'e KR','11','학예회를 준비한다.',[['연극 주인공에 지원한다','j2 B','주인공을 맡아 대사를 외웠다.'],['합창에서 화음을 맞춘다','r2 D','친구들과 화음을 맞췄다.'],['무대 뒤에서 소품을 만든다','k1 C','종이로 왕관과 나무를 만들었다.']],{k:'autumn',sc:'stage'});
Y(7,12,'e !KR','s3','학교 발표회 날이다. 반마다 노래와 춤을 준비했다.',[['앞에 나가 발표한다','j2 B','떨렸지만 끝까지 발표했다.'],['친구 발표를 돕는다','r2 K','친구 발표 자료를 함께 들고 서 있었다.']],{k:'autumn',sc:'stage'});
Y(7,12,'e KR gpal','1','설날이다. 할아버지, 할머니께 세배를 드리고 세뱃돈을 받았다.','j3 r2',{k:'holiday',sc:'fest'});
Y(7,12,'e KR nogp','1','설날 아침, 차례를 지내고 온 가족이 떡국을 먹었다. 친척 어른들께 세뱃돈을 받았다.','j3 r2',{k:'holiday',sc:'fest'});
Y(7,12,'e !KR','wv','{fest} 날이 다가왔다. 온 가족이 모여 {food}을(를) 나눠 먹었다.','j3 r2',{k:'holiday',sc:'fest'});
Y(7,12,'e KR','12','통지표를 받았다. {commentQ} 적혀 있었다.','k1',{k:'sem2',sc:'school'});
// ── 초등학교: 그 해만의 일
Y(8,8,'e KR','*','구구단 7단에서 자꾸 틀렸다. {hr} 선생님 앞에서 다시 외워야 한다.',[['밤마다 거꾸로도 외운다','k3 D','거꾸로 외우기까지 해서 단번에 통과했다.'],['노래로 만들어 외운다','k2 C','노래로 흥얼거리다 보니 외워졌다.']],{once:1,sc:'school'});
Y(9,11,'e','*','반장 선거가 열린다.',[['손을 들고 나간다','B r1','칠판 앞에서 공약을 말했다. “급식 줄을 공평하게!”'],['{mate}을(를) 추천한다','r2 K','친구를 추천했다. 친구가 고맙다며 웃었다.'],['조용히 지켜본다','','조용히 투표만 했다.']],{once:1,sc:'school',run:'leader'});
Y(9,10,'e KR','6','생존수영 수업을 받았다. 물에 누워 뜨는 법을 배웠다.','h2 k1',{once:1,sc:'sport'});
Y(7,12,'e','*','짝꿍 {mate}와(과) 크게 다퉜다. 책상 가운데 금을 그었다.',[['먼저 사과한다','r3 K','먼저 미안하다고 했다. 금은 다음 날 지워졌다.'],['선생님께 말씀드린다','r1','선생님이 둘을 화해시켜 주셨다.'],['며칠 말을 안 한다','j-1','며칠 서먹하게 지냈다.']],{cd:3,sc:'friend'});
Y(7,12,'e','*','{mate}의 생일 파티에 초대받았다.',[['직접 만든 카드를 선물한다','r3 K','삐뚤빼뚤 쓴 카드를 받고 친구가 크게 웃었다.'],['같이 놀 게임을 준비한다','j2 r2','다 같이 게임을 하며 신나게 놀았다.']],{cd:2,sc:'friend'});
Y(9,12,'e','*','교내 {sub} 경시대회가 열린다.',[['나가 본다','k2 B','머리를 쥐어짜며 끝까지 풀었다.'],['응원만 한다','r1','친구들을 응원했다.']],{cd:2,sc:'school',run:'contest'});
Y(9,12,'e','*','학교 도서관에서 한 달 동안 책을 가장 많이 빌린 학생에 뽑혔다.','k3 j2 C',{once:1,sc:'school'});
Y(9,12,'e','*','칠판 글씨가 흐릿하게 보인다. 안과에 갔더니 안경을 써야 한다고 했다.','h-1 k1',{once:1,sc:'hosp'});
Y(10,12,'e U t3','*','처음으로 휴대폰이 생겼다.',[['약속한 시간만 쓴다','D j1','엄마와 정한 시간만 쓰기로 했다.'],['밤늦게까지 게임을 한다','j2 h-2','몰래 밤늦게까지 게임을 했다. 아침에 일어나기 힘들었다.']],{once:1});
Y(11,12,'e','*','요즘 들어 이유 없이 짜증이 난다. 거울 앞에 서 있는 시간이 늘었다.','j-1 k1',{once:1});
Y(12,12,'e KR','10','6학년 수학여행으로 {kTrip}에 갔다. 밤새 베개 싸움을 했다.','j4 r3',{k:'autumn',w:6,sc:'travel'});
Y(12,12,'e KR','11','졸업 앨범 사진을 찍었다. 반 친구들과 운동장에 누워 하늘을 보고 찍었다.','r2 j2',{once:1,sc:'school'});
Y(13,13,'m KR','2','{elem} 졸업식 날. 6학년 담임 선생님이 한 명 한 명 이름을 불러 주셨다.','j3 r2',{k:'grad',big:1,sc:'grad'});
Y(13,13,'m KR','1','중학교 배정 결과가 나왔다. {bff}와(과) 같은 {mid}다!','j2 r1',{k:'assign',sc:'school'});
Y(12,12,'e !KR','[s9,s10]','초등학교 마지막 시험을 보았다. 이 성적이 중학교 진학에 쓰인다.','k2',{once:1,ex:'unit',sc:'school'});
Y(8,12,'e t2','*','교과서가 모자라 세 명이 한 권을 나눠 본다. 내 차례가 오기를 기다렸다.','k1 r2',{once:1,sc:'school'});
Y(7,12,'e t1','*','교실이 모자라 나무 그늘 아래에서 수업을 했다. 바람이 불면 공책이 날아갔다.','k1 j1',{once:1,sc:'school'});
Y(7,12,'e t2 R','*','학교까지 한 시간을 걸어간다. 비가 온 날은 진흙길에 신발이 벗겨졌다.','h2 D',{once:1});
Y(7,12,'e','*','수두에 걸려 일주일 동안 학교에 못 갔다. 친구들이 쓴 편지가 왔다.','h-2 r1',{once:1,sc:'sick'});
Y(7,12,'e KR','*','태권도 승급 심사를 보았다.',[['발차기를 백 번 더 연습한다','h2 D','파란 띠를 땄다.'],['자신 있게 그냥 본다','B','긴장했지만 무사히 띠를 바꿨다.']],{cd:2,sc:'sport'});
Y(7,12,'e','*','{bff}와(과) 비밀 기지를 만들었다. 둘만 아는 암호도 정했다.','r3 j2',{once:1,sc:'friend'});
Y(9,12,'e','*','수업 시간에 발표를 했다가 친구들이 웃었다.',[['다음에도 손을 든다','B k1','다음 시간에 또 손을 들었다. 이번엔 박수를 받았다.'],['당분간 조용히 있는다','j-1','한동안 손을 들지 않았다.']],{once:1,sc:'school'});
Y(7,9,'e','*','이가 흔들려 실로 묶어 뽑았다. 지붕 위로 던지며 소원을 빌었다.','j1',{once:1});
Y(8,11,'e','*','길에서 다친 새를 주웠다.',[['상자에 담아 돌봐 준다','K r1','며칠 돌봐 주었더니 새가 날아갔다.'],['어른에게 맡긴다','D','동물병원에 데려다주었다.']],{once:1,sc:'pet'});

// ── 학교에 다니지 못하는 아이
Y(7,18,'ns R','*','새벽에 일어나 {chore}을(를) 거들었다. 해가 뜨기 전에 벌써 땀이 흘렀다.','h1 r1 D',{k:'chore'});
Y(7,18,'ns U','*','시장에서 물건을 날랐다. 하루 품삯으로 빵을 사서 동생과 나눠 먹었다.','h1 r2',{k:'chore'});
Y(7,14,'ns','*','친구들이 교복을 입고 학교에 가는 모습을 오래 바라보았다.','j-3',{once:1});
Y(8,16,'ns','*','저녁마다 마을에 글을 가르치는 교실이 열린다.',[['일이 끝나면 꼭 간다','k4 D','지친 몸으로도 빠지지 않고 다녔다. 이제 내 이름과 숫자를 쓸 수 있다.'],['너무 피곤해서 쉰다','h1','일이 너무 고되 쉬었다.']],{once:1,sc:'school'});
Y(7,14,'ns','*','동생을 업고 하루 종일 돌보았다. 동생이 처음으로 내 이름을 불렀다.','r3 K',{once:1});
Y(9,18,'ns','*','처음으로 내가 번 돈을 엄마께 드렸다. 엄마가 오래 손을 잡아 주셨다.','r3 j2',{once:1});
Y(7,18,'ns R','[s5,s6]','큰비가 와서 밭이 물에 잠겼다. 온 가족이 나가 둑을 쌓았다.','h-1 r2',{cd:3,sc:'flood'});
Y(10,18,'ns','*','이웃 어른이 도시에 가서 일하자고 한다.',[['가족 곁에 남는다','r2','가족 곁에 남기로 했다.'],['따라가 본다','B k2 r-2','도시에서 몇 달 일하며 많은 것을 보았다. 돈도 조금 모았다.']],{once:1,sc:'travel'});
Y(7,18,'ns','*','마을 잔치에서 {music}에 맞춰 밤새 춤을 췄다.','j3 r2',{cd:2,sc:'fest'});
Y(10,18,'ns','*','라디오에서 나오는 영어 강좌를 몰래 따라 했다.','k3 C',{once:1});

// ── 중학교: 해마다 돌아오는 일
Y(13,13,'m KR','3','{G}에 입학했다. 처음 입은 교복 넥타이를 아빠가 매 주셨다. 1학년 {cls}반, 담임은 {hr} 선생님.','j2 r1',{k:'new',sc:'school'});
Y(13,13,'m !KR','s0','중학교 첫날. 복도도 교실도 낯설다. {N}명의 새 친구 이름을 외우는 데 일주일이 걸렸다.','j1 r1',{k:'new',sc:'school'});
Y(14,15,'m','s0','{G} {g}학년 {cls}반이 되었다. 담임은 {hr} 선생님. {mate}와(과) 같은 반이 되었다.','r1',{k:'new',sc:'school'});
Y(13,13,'m KR','4','자유학기라 시험 대신 진로 체험을 했다. {jobT} 체험을 하며 하루를 보냈다.','k2 j2 C',{k:'mid1',sc:'job'});
Y(14,15,'m KR','4','중간고사가 2주 남았다.',[['계획표를 짜서 매일 공부한다','k3 D','계획표대로 매일 공부했다.'],['{mate}와(과) 스터디를 한다','k2 r2 K','친구와 서로 문제를 내 주며 공부했다.'],['학원 시험 대비반에 다닌다','k3','학원에서 기출문제를 풀었다.'],['전날 몰아서 한다','j2','전날 밤을 새워 몰아서 공부했다.']],{k:'mid1',ex:'sch',sc:'school'});
Y(13,15,'m !KR','s2','새 학년 첫 시험 기간이다.',[['계획표를 짜서 매일 공부한다','k3 D','계획표대로 매일 공부했다.'],['친구들과 모여 공부한다','k2 r2 K','친구들과 서로 가르쳐 주며 공부했다.'],['전날 몰아서 한다','j2','전날 밤을 새워 몰아서 공부했다.']],{k:'mid1',ex:'sch',sc:'school'});
Y(13,15,'m !KR','s4','1학기 기말고사를 보았다.','k1',{k:'fin1',ex:'sch',sc:'school'});
Y(14,15,'m KR','7','1학기 기말고사를 보았다.','k1',{k:'fin1',ex:'sch',sc:'school'});
Y(13,13,'m KR','7','자유학기 마지막 주, 한 학기 동안 만든 진로 포트폴리오를 반 친구들 앞에서 발표했다.','k2 j2 B',{k:'fin1',sc:'school'});
Y(13,15,'m','s7','2학기 중간고사를 보았다.','k1',{k:'sem2',ex:'sch',sc:'school'});
Y(13,15,'m KR','12','2학기 기말고사를 보았다. 이번 학기 성적표가 집으로 갔다.','k1',{k:'sem2',ex:'sch',sc:'school'});
Y(13,15,'m KR','5','체육대회 날. 반티를 맞춰 입었다.',[['계주 마지막 주자로 뛴다','h2 B','마지막 바퀴에서 두 명을 제쳤다.','코너에서 미끄러져 넘어졌다. 무릎에 반창고를 붙이고 웃었다.'],['피구에서 끝까지 살아남는다','h1 D','피구에서 마지막까지 살아남았다.','시작하자마자 공에 맞아 밖으로 나왔다.'],['응원 플래카드를 만든다','r3 K','밤새 만든 플래카드가 응원상을 받았다.']],{k:'spring',sc:'sport'});
Y(13,15,'m !KR','s3','학교 대항 {sport} 대회가 열린다.',[['대표 선수로 뛴다','h3 B','학교 대표로 뛰었다. 온 학교가 응원했다.'],['응원석에서 소리친다','r2 j1','목이 쉬도록 응원했다.']],{k:'spring',sc:'sport'});
Y(13,13,'m KR','[5,6]','2박 3일 수련회를 갔다. 마지막 밤 캠프파이어에서 부모님 편지를 읽다가 울었다.','r3 j2',{k:'autumn',sc:'travel'});
Y(14,14,'m KR','10','수학여행으로 {kTrip2}에 갔다. 숙소에서 밤새 이야기꽃을 피웠다.','j4 r3',{k:'autumn',sc:'travel'});
Y(13,15,'m !KR','[s2,s8]','학교에서 {landmark}(으)로 견학을 갔다. 친구들과 사진을 잔뜩 찍었다.','j3 k1 r1',{k:'autumn',once:1,sc:'travel'});
Y(13,15,'m KR','8','여름방학이다.',[['학원 특강을 듣는다','k3 j-1','방학 내내 학원 특강을 들었다.'],['책을 읽고 가족 여행을 간다','k1 j3 r2','책 몇 권을 읽고 가족과 바다에 다녀왔다.'],['게임을 실컷 한다','j3 h-1','원 없이 게임을 했다. 개학이 코앞이다.']],{k:'vacS'});
Y(13,15,'m !KR t3','sv','방학이다.',[['보충수업에 다닌다','k3','방학에도 보충수업을 들었다.'],['아르바이트를 해 본다','B r1 k1','동네 가게에서 처음으로 일해 보았다.'],['친구들과 실컷 논다','j3 r2','친구들과 방학을 신나게 보냈다.']],{k:'vacS'});
Y(13,15,'m t2','sv','방학 동안 일을 도와야 한다.',[['일하며 틈틈이 공부한다','k2 D','일을 마치면 밤에 교과서를 폈다.'],['가족 일에 힘을 보탠다','r3 h1','가족의 일을 도왔다. 다들 고마워했다.']],{k:'vacS'});
Y(13,15,'m KR','[10,11]','학교 축제다.',[['무대에서 공연한다','j3 B','밴드 공연을 했다. 친구들이 핸드폰 불빛을 흔들었다.','공연 도중 마이크가 꺼졌다. 그래도 끝까지 불렀다.'],['반 부스를 운영한다','r3 D','반 친구들과 떡볶이 부스를 열었다.'],['구경하며 즐긴다','j2','이것저것 구경하며 하루를 즐겼다.']],{k:'autumn',sc:'fest'});
Y(13,15,'m KR','1','겨울방학, 설날이 왔다. 친척 어른들이 “공부는 잘하니?” 하고 물으셨다.','r1 j1',{k:'holiday',sc:'fest'});
Y(13,15,'m !KR','wv','{fest} 연휴에 친척들이 모였다. 어른들이 장래 희망을 물으셨다.','r2 j1',{k:'holiday',sc:'fest'});
// ── 중학교: 그 해만의 일
Y(13,15,'m','*','동아리를 고른다.',[['{club}','C j2','{club}에 들어갔다.'],['운동부','h3 r1','운동부에 들어가 아침마다 뛰었다.'],['봉사 동아리','K r2','봉사 동아리에서 주말마다 복지관에 갔다.']],{once:1,sc:'school'});
Y(13,15,'m','*','반 단체 채팅방에서 {mate2}을(를) 놀리는 말이 오간다.',[['그만하자고 말한다','B K r2','“그만하자.” 한마디에 분위기가 바뀌었다. {mate2}이(가) 나중에 고맙다고 했다.'],['선생님께 몰래 알린다','K D','선생님께 알렸다. 반 회의가 열렸다.'],['모른 척한다','j-2','모른 척했다. 마음 한구석이 계속 불편했다.']],{once:1,sc:'friend'});
Y(13,15,'m','*','{crush}이(가) 자꾸 신경 쓰인다.',[['용기 내어 고백한다','B j2','고백했다. {crushRes}'],['친구로 지낸다','r2','좋은 친구로 지내기로 했다.']],{once:1,sc:'friend',run:'crush'});
Y(13,15,'m','*','{sub} 수행평가 조별 과제를 맡았다. 한 명이 아무것도 하지 않는다.',[['내가 더 맡아 끝낸다','k2 D j-1','밤늦게까지 남은 몫까지 해냈다.'],['솔직하게 이야기한다','B r1','이야기해 보니 사정이 있었다. 같이 마무리했다.','이야기를 꺼냈다가 분위기만 어색해졌다.']],{cd:2,sc:'school'});
Y(14,15,'m','*','엄마와 크게 다퉜다. 문을 쾅 닫고 방에 들어갔다.',[['먼저 사과한다','r3 K','밤에 먼저 사과했다. 엄마도 미안하다고 하셨다.','사과하려다 또 말다툼이 되었다. 다음 날 아침에야 풀렸다.'],['며칠 말을 안 한다','j-2 r-1','며칠 냉랭하게 지냈다.']],{once:1});
Y(13,15,'m','*','키가 한 해 동안 10센티미터 넘게 컸다. 작년 바지가 껑충 짧아졌다.','h2',{once:1});
Y(13,15,'m','*','교내 {sub} 경시대회에 나갔다.',[['한 달 동안 준비한다','k3 D','한 달을 준비해 대회에 나갔다.'],['그냥 경험 삼아 나간다','C','경험 삼아 나가 보았다.']],{cd:2,sc:'school',run:'contest'});
Y(13,15,'m','*','학생회 선거에 나가 볼까?',[['출마한다','B r1','친구들과 피켓을 들고 아침마다 교문 앞에 섰다.'],['친구 선거 운동을 돕는다','r2 K','친구의 선거 운동원이 되었다.']],{once:1,sc:'school',run:'leader'});
Y(14,15,'m','*','{bff}와(과) 오해가 생겨 몇 주째 말을 안 한다.',[['편지를 쓴다','r3 K','편지를 건넸다. 다음 날 {bff}이(가) 먼저 웃으며 인사했다.'],['시간이 해결하길 기다린다','r-1','시간이 흐르며 조금씩 다시 가까워졌다.']],{once:1,sc:'friend'});
Y(13,15,'m U','*','학원을 하나 더 다닐지 정해야 한다.',[['다닌다','k3 j-1','일주일에 네 번 학원에 갔다. 집에 오면 밤 열 시였다.'],['혼자 공부해 본다','k2 D','인터넷 강의와 문제집으로 혼자 공부했다.'],['운동을 시작한다','h3 j1','학원 대신 운동을 시작했다.']],{once:1,sc:'school'});
Y(13,15,'m','*','휴대폰을 보다가 밤 두 시에 잠들었다. 다음 날 수업 시간 내내 졸았다.','h-2 k-1',{cd:2});
Y(15,15,'m KR','10','고등학교 진학 상담을 했다. {hr} 선생님이 성적표를 펼쳐 놓으셨다.',[['일반고에서 대학을 준비한다','k1 D','일반고에 원서를 쓰기로 했다.'],['특성화고에서 기술을 배운다','k1 B','특성화고에 원서를 쓰기로 했다.'],['과학고·외고에 도전한다','k2 B','특목고 입시를 준비하기로 했다.']],{k:'hsplan',sc:'school',run:'hsWish'});
Y(16,16,'h KR','2','{mid} 졸업식. 교복 위에 꽃다발을 안고 친구들과 사진을 찍었다.','j3 r2',{k:'grad',big:1,sc:'grad'});
Y(13,15,'m x1','x1','{x1}을(를) 앞두고 있다. 이 시험으로 갈 수 있는 고등학교가 정해진다.',[['매일 밤늦게까지 공부한다','k4 D h-2','몇 달 동안 밤늦게까지 공부했다.'],['과외·학원의 도움을 받는다','k3','과외 선생님과 기출문제를 풀었다.'],['잘하는 과목에 집중한다','k2 C','잘하는 과목을 더 끌어올렸다.']],{x1:1,ex:'x1',big:1,sc:'school'});

// ── 고등학교: 해마다 돌아오는 일
Y(16,16,'h KR hg','3','{G} 1학년 {cls}반. 첫 야간자율학습이 밤 아홉 시에 끝났다.','k2 j-1',{k:'new',sc:'school'});
Y(16,16,'h KR hv','3','{G} 1학년 {cls}반. 첫 실습 시간에 이름이 새겨진 작업복을 받았다.','k2 j2',{k:'new',sc:'school'});
Y(16,16,'h !KR','s0','고등학교 첫날. {G}, 반 친구는 {N}명이다. 담임은 {hr} 선생님.','j1 r1',{k:'new',sc:'school'});
Y(16,16,'h CN','s0','고등학교 입학 첫 주는 군사훈련이었다. 햇볕 아래 줄을 맞추며 새 친구들과 친해졌다.','h2 r2',{k:'new',w:4,sc:'school'});
Y(17,18,'h','s0','{G} {g}학년 {cls}반이 되었다. 담임은 {hr} 선생님.','r1',{k:'new',sc:'school'});
Y(16,18,'h KR','3','전국연합학력평가를 보았다.','k1',{k:'mock1',ex:'mock',sc:'school'});
Y(16,18,'h KR','4','중간고사가 다가온다. 내신 한 등급이 입시를 바꾼다.',[['오답 노트를 만든다','k3 D','틀린 문제를 모두 오답 노트에 정리했다.'],['{mate}와(과) 서로 설명해 준다','k2 r2 K','서로 가르쳐 주며 공부했다.'],['학원 내신 대비반에 다닌다','k3','학원에서 학교별 기출문제를 풀었다.'],['밤샘으로 몰아친다','k2 h-2','며칠 밤을 새웠다.']],{k:'mid1',ex:'sch',sc:'school'});
Y(16,18,'h !KR','s2','새 학기 첫 시험이 다가온다.',[['도서관에서 계획대로 공부한다','k3 D','계획대로 꾸준히 공부했다.'],['친구들과 스터디를 한다','k2 r2 K','서로 가르쳐 주며 공부했다.'],['벼락치기를 한다','k2 h-1','벼락치기로 밤을 새웠다.']],{k:'mid1',ex:'sch',sc:'school'});
Y(16,18,'h','s4','기말고사를 보았다.','k1',{k:'fin1',ex:'sch',sc:'school'});
Y(16,17,'h','s7','2학기 중간고사를 보았다.','k1',{k:'sem2',ex:'sch',sc:'school'});
Y(16,17,'h KR','12','2학기 기말고사. 이번 학년 생활기록부가 마무리되었다.','k1',{k:'sem2',ex:'sch',sc:'school'});
Y(16,17,'h KR','[5,6]','체육대회와 축제가 이어졌다.',[['밴드 공연 무대에 선다','j4 B','축제 무대에서 노래했다. 생애 첫 앙코르를 받았다.'],['반 대항 축구에 나간다','h2 r2','반 대항 축구 결승에서 골을 넣었다.'],['그 시간에 자습한다','k2 D j-1','다들 노는 동안 자습실에서 공부했다.']],{k:'spring',sc:'fest'});
Y(16,17,'h !KR','[s3,s8]','학교 축제가 열렸다.',[['공연을 준비한다','j3 B','친구들과 연습한 공연을 무대에 올렸다.'],['친구들과 즐긴다','j2 r2','친구들과 하루 종일 축제를 즐겼다.']],{k:'spring',sc:'fest'});
Y(17,17,'h KR','[4,10]','2학년 수학여행으로 {kTrip2}에 갔다. 고등학생 때의 마지막 여행이었다.','j4 r3',{k:'autumn',sc:'travel'});
Y(16,17,'h KR','8','여름방학이다. 사실 방학이라기보다 보충수업 기간이다.',[['독서실에서 하루 열 시간 공부한다','k4 h-2 D','방학 내내 독서실 불이 꺼질 때까지 있었다.'],['진로 활동 보고서를 쓴다','k2 C','관심 있는 주제로 탐구 보고서를 썼다. 생활기록부에 들어갔다.'],['며칠은 푹 쉰다','j3 h2','며칠은 늦잠을 자고 친구들과 놀았다.']],{k:'vacS'});
Y(16,17,'h !KR','sv','방학이다.',[['방학 보충 수업에 다닌다','k3','방학에도 보충수업을 들었다.'],['아르바이트를 한다','B r1','방학 동안 아르바이트로 돈을 벌었다.'],['봉사활동을 한다','K r2','방학 동안 봉사활동을 했다.']],{k:'vacS'});
Y(16,17,'h KR','1','겨울방학. 학원에서 다음 학년 진도를 미리 나갔다.','k2 j-1',{k:'holiday'});
Y(16,17,'h !KR','wv','{fest} 연휴에도 책을 펴 놓고 있었다. 어른들이 “이제 다 컸네” 하셨다.','k1 r1',{k:'holiday',sc:'fest'});
// ── 고3 (한국): 모의평가 · 수시 · 수능
Y(18,18,'h KR hg','6','6월 모의평가를 보았다. 수능을 내는 기관이 낸 첫 시험이다.','k1',{k:'mock2',ex:'mock',sc:'school'});
Y(18,18,'h KR hg','8','수능 D-100. 교실 뒤 칠판에 커다란 숫자가 붙었다.',[['하루 계획을 시간 단위로 짠다','k3 D h-1','시간 단위 계획표를 책상에 붙였다.'],['매일 30분은 걷는다','h3 j1','저녁마다 운동장을 걸으며 머리를 식혔다.']],{k:'vacS',sc:'school'});
Y(18,18,'h KR hg','9','수시 원서 여섯 장을 써야 한다.',[['꿈꾸던 대학 위주로 높여 쓴다','B','상향 지원으로 여섯 장을 채웠다.'],['적정·안정 대학을 섞는다','D','적정과 안정 지원을 섞어 원서를 냈다.'],['수시는 쓰지 않고 정시에 건다','C','수시를 쓰지 않고 수능에 모든 것을 걸었다.']],{k:'susi',sc:'school',run:'susi'});
Y(18,18,'h KR hg','11','수능 날. 도시락을 싸 주신 엄마가 교문 앞에서 손을 흔드셨다.',[['평소처럼 차분하게','D','심호흡을 하고 평소처럼 문제를 풀었다.'],['어려운 문제는 과감히 넘긴다','B','어려운 문제는 넘기고 아는 문제부터 풀었다.']],{k:'x2',ex:'x2',big:1,sc:'school'});
Y(18,18,'h KR hg','12','','',{k:'susiR',sc:'school',run:'susiR'});
Y(18,18,'h KR hv','[4,5]','{voc}에서 준비한 자격증 실기시험을 보았다.',[['실습실에 남아 연습한다','k3 D','방과 후 실습실에 남아 연습했다.'],['선배에게 요령을 배운다','r2 k2','선배에게 요령을 배웠다.']],{k:'cert',ex:'cert',sc:'job'});
Y(18,18,'h hv','[s5,s8]','현장 실습을 나갔다. 공장의 기계 소리가 교실과는 달랐다.','k3 h-1',{k:'intern',sc:'job'});
Y(18,18,'h KR hv','10','취업 박람회에서 처음으로 면접을 보았다.',[['또박또박 대답한다','B k1','준비한 대로 대답했다. 2차 면접 연락이 왔다.'],['솔직하게 모르는 것은 모른다고 한다','D','솔직하게 대답했다. 면접관이 고개를 끄덕였다.']],{k:'fair',sc:'job'});
// ── 고등학교: 나라별 입시
Y(17,18,'h !KR x2','x2','{x2}이(가) 다가온다. 인생에서 가장 큰 시험이라고 다들 말한다.',[['하루 열두 시간씩 공부한다','k4 h-2 D','몇 달 동안 하루 열두 시간씩 책상 앞에 앉았다.'],['학원·과외로 마지막 정리를 한다','k3','학원에서 마지막 정리를 했다.'],['잠과 운동을 챙기며 준비한다','k2 h2','잠과 운동을 챙기며 꾸준히 준비했다.']],{x2:1,ex:'x2',big:1,sc:'school'});
Y(16,17,'h IN','*','친구들이 하나둘 JEE·NEET 준비를 위해 코타의 학원 도시로 떠난다.',[['나도 코타로 간다','k4 r-3 j-2','코타의 학원 기숙사에서 하루 열네 시간 공부했다.'],['집에서 온라인 강의로 준비한다','k2 r1','집에서 온라인 강의로 준비했다.']],{once:1,sc:'school'});
Y(16,18,'h CN','*','저녁 자습이 밤 열 시에 끝난다. 기숙사 불이 꺼지면 손전등을 켜고 문제집을 풀었다.','k3 h-2',{cd:2,sc:'school'});
Y(16,18,'h US','*','운전면허 시험을 보았다.',[['주차를 백 번 연습한다','D','평행 주차까지 한 번에 통과했다.'],['자신 있게 본다','B','한 번 떨어지고 두 번째에 붙었다.']],{once:1,sc:'travel'});
Y(17,17,'h US','5','졸업 무도회(프롬)가 열렸다.',[['{crush}에게 같이 가자고 한다','B j2','꽃을 들고 물었다. {crushRes}'],['친구들과 단체로 간다','r3 j2','친구들과 다 같이 가서 밤새 춤췄다.']],{once:1,sc:'fest',run:'crush'});
Y(17,17,'h US','11','대학 지원서 에세이를 쓴다.',[['내가 겪은 가장 힘든 일을 쓴다','k2 B','가장 힘들었던 순간과 그 뒤에 배운 것을 썼다.'],['좋아하는 것에 대해 쓴다','k2 C','좋아하는 것에 빠져 지낸 시간을 썼다.']],{once:1,sc:'school'});
Y(16,18,'h GB|FR|DE','*','진로 상담 선생님과 대학 전공을 이야기했다.','k2',{once:1,sc:'school'});
// ── 고등학교: 그 해만의 일
Y(16,18,'h','*','성적이 몇 달째 제자리다.',[['공부 방법을 바꿔 본다','k3 C','공부 방법을 바꾸자 조금씩 오르기 시작했다.'],['잠깐 쉬며 마음을 다잡는다','j2 h2','주말에 푹 쉬고 다시 시작했다.'],['더 오래 앉아 있는다','k2 h-2 D','잠을 줄여 더 오래 공부했다.']],{once:1,sc:'school'});
Y(16,18,'h','*','아빠와 진로 때문에 의견이 부딪쳤다.',[['내가 원하는 길을 설명한다','B r1','밤늦게까지 이야기했다. 아빠가 결국 응원해 주셨다.'],['부모님 뜻을 따르기로 한다','r2 j-2','부모님 뜻을 따르기로 했다.']],{once:1});
Y(16,18,'h','*','{crush}와(과) 학교 앞 분식집에서 자주 마주친다.',[['같이 공부하자고 한다','B r2','같이 공부하는 사이가 되었다. {crushRes}'],['인사만 한다','','인사만 하고 지나쳤다.']],{once:1,sc:'friend',run:'crush'});
Y(16,18,'h','*','{sub} 시간에 발표한 탐구 주제가 칭찬을 받았다. 선생님이 생활기록부에 적어 주셨다.','k3 j2 C',{once:1,sc:'school'});
Y(16,18,'h','[s1,s4,s7]','시험 기간에 장염에 걸렸다. 사흘을 앓고 시험을 보았다.','h-3 k-1',{once:1,sc:'sick'});
Y(16,18,'h','*','{bff}이(가) 전학을 간다. 마지막 날 서로의 공책에 편지를 적어 주었다.','r2 j-2',{once:1,sc:'friend'});
Y(16,18,'h U','*','편의점 아르바이트를 해 볼까?',[['한다','B r1','주말마다 편의점에서 일했다. 처음 받은 월급으로 엄마께 선물을 드렸다.'],['공부에 집중한다','k2 D','공부에 집중하기로 했다.']],{once:1,sc:'job'});
Y(16,18,'h','*','학교 대표로 {sub} 대회에 나가게 되었다.',[['한 달 동안 매달린다','k3 D','한 달 동안 매달려 대회에 나갔다.'],['즐기며 나간다','j2 C','즐기는 마음으로 나갔다.']],{once:1,sc:'school',run:'contest'});
Y(16,18,'h','*','밤에 잠이 오지 않는다. 시험 생각만 하면 가슴이 두근거린다.',[['상담 선생님을 찾아간다','h2 j2','상담 선생님과 이야기하니 마음이 한결 가벼워졌다.'],['친구에게 털어놓는다','r2 j1','친구도 똑같다고 했다. 둘이 웃었다.']],{once:1});
Y(16,18,'h KR','5','스승의 날, 반 친구들과 몰래 칠판을 꾸몄다. {hr} 선생님이 울컥하셨다.','r2 j2',{once:1,sc:'school'});

// ── 대학생
Y(19,20,'u KR','[2,3]','새내기 오리엔테이션에서 {major} 동기들을 처음 만났다.','r3 j2',{k:'uNew',sc:'school'});
Y(19,20,'u !KR','s0','대학 첫 학기가 시작되었다. {univ} 캠퍼스가 넓어서 강의실을 찾다 지각했다.','j2 k1',{k:'uNew',sc:'school'});
Y(21,24,'u','s0','새 학기다.',[['전공 수업을 꽉 채운다','k3 D','전공 수업으로 시간표를 꽉 채웠다.'],['듣고 싶던 교양을 듣는다','k2 C j1','듣고 싶던 교양 수업을 골랐다.']],{k:'uNew',sc:'school'});
Y(19,24,'u KR','2','수강신청 날, 아침 10시 정각에 클릭했다.',[['광클한다','B','원하던 수업을 대부분 잡았다.'],['남는 수업으로 짠다','j-1','남는 수업으로 시간표를 겨우 채웠다.']],{k:'reg',sc:'school'});
Y(19,24,'u','s4','기말고사를 보았다. 학기 성적이 나왔다.','k2',{k:'uFin',ex:'gpa',sc:'school'});
Y(19,24,'u','s9','2학기 기말고사가 끝났다.','k2',{k:'uFin2',ex:'gpa',sc:'school'});
Y(19,24,'u','sv','방학이다.',[['아르바이트로 돈을 모은다','D r1','방학 내내 아르바이트를 했다.','@1'],['배낭여행을 떠난다','j4 C','배낭 하나 메고 낯선 도시를 걸었다.'],['자격증·어학 공부를 한다','k3','자격증 시험을 준비했다.']],{k:'uVac'});
Y(19,20,'u KR','[3,4]','{major} MT를 갔다. 밤새 동기들과 이야기했다.','r3 j2',{once:1,sc:'friend'});
Y(19,24,'u','*','동아리 홍보 부스를 돈다.',[['{club} 동아리에 든다','j3 r2','동아리방이 두 번째 집이 되었다.','동아리 면접에서 떨어졌다. 다음 학기를 노린다.'],['봉사 동아리에 든다','K r3','주말마다 아이들 공부를 봐 주었다.']],{once:1,sc:'friend'});
Y(19,24,'u','*','성적 장학금을 받을 수 있을까?',[['한 학기 바짝 공부한다','k3 D','도서관 단골이 되었다.'],['아르바이트와 함께 한다','r1 D','일과 공부를 함께 했다.']],{once:1,sc:'money',run:'scholar'});
Y(20,24,'u','*','교환학생 모집 공고가 났다.',[['지원한다','B C k2','지원서를 냈다.'],['국내에서 학업에 집중한다','D k1','학업에 집중하기로 했다.']],{once:1,sc:'travel',run:'exch'});
Y(20,24,'u','*','조별 과제 발표가 내일인데 한 명이 연락이 안 된다.','k1 j-1',{once:1,sc:'school'});
Y(21,24,'u','*','휴학을 할까 고민된다.',[['한 학기 쉬며 일해 본다','k1 r1 j2','한 학기 동안 일하며 진로를 생각했다.'],['쉬지 않고 졸업한다','D','쉬지 않고 학기를 이어 갔다.']],{once:1});
Y(21,24,'u','*','여름 인턴십에 지원했다.',[['열 군데에 지원한다','D k1','열 군데에 지원서를 냈다.'],['한 곳에 공을 들인다','B k1','가고 싶은 곳 하나에 공을 들였다.']],{once:1,sc:'job',run:'intern'});
Y(22,24,'u','*','졸업 논문(작품)의 마감이 다가온다.',[['교수님을 자주 찾아간다','k3 r1','교수님의 조언을 받아 고쳐 나갔다.'],['혼자 끝까지 파고든다','k3 C','밤을 새우며 혼자 파고들었다.']],{once:1,sc:'school'});
Y(19,24,'u','*','캠퍼스 축제에 유명한 가수가 왔다. 운동장이 사람으로 꽉 찼다.','j3 r1',{cd:2,sc:'fest'});
Y(19,24,'u','*','자취방 월세가 올랐다.','@-1 j-1',{once:1,sc:'money'});
// ── 재수 (한 해 더 시험을 준비하는 사람)
Y(19,20,'rt','2','친구들이 대학 새내기가 될 때, 나는 다시 공부를 시작했다.',[['재수 학원 종합반에 다닌다','k3 D','아침 일곱 시부터 밤 열 시까지 학원에 있었다.'],['독학으로 준비한다','k2 C','도서관에서 혼자 계획을 세워 공부했다.']],{fix:1,k:'rt1',sc:'school'});
Y(19,20,'rt KR','6','재수생으로 6월 모의평가를 보았다.','k1',{fix:1,k:'rt2',ex:'mock',sc:'school'});
Y(19,20,'rt','*','공부가 손에 잡히지 않는 날이 이어졌다. 대학에 간 {bff}의 사진을 보면 마음이 복잡했다.','j-3',{fix:1,k:'rt3'});
Y(19,20,'rt','x2','다시 {x2}을(를) 보는 날이다.',[['작년의 실수를 떠올리며 침착하게','D','작년과 달리 끝까지 침착했다.'],['모든 것을 쏟아붓는다','B','모든 것을 쏟아부었다.']],{fix:1,k:'rtX',ex:'x2',big:1,sc:'school'});
// ── 군 복무 (한국 남자)
Y(19,20,'KR m0 army','[2,3]','입영 통지서가 왔다. 머리를 짧게 깎았다. 엄마가 눈물을 보이셨다.','r2 j-2',{k:'army1',sc:'job'});
Y(19,20,'KR m0 army','5','훈련소 수료식에 가족이 왔다. 아빠가 말없이 어깨를 두드려 주셨다.','h3 r3',{k:'army2',sc:'job'});
Y(19,20,'KR m0 army','9','첫 휴가를 나왔다. 집밥이 이렇게 맛있는 줄 몰랐다.','j4 r2',{k:'army3'});

// ── 일하는 어른: 해마다 돌아오는 일
Y(19,69,'w','*','올해 월급이 정해졌다.','',{k:'pay',run:'pay',sc:'money'});
Y(19,69,'w KR','[1,9]','명절 연휴다.',[['고향에 내려간다','r3 j1','막히는 길을 뚫고 고향에 갔다. 가족이 모두 모였다.','@-1','길이 너무 막혀 열 시간 넘게 차 안에 있었다. 도착하니 다들 자고 있었다.'],['푹 쉰다','h2 j2','오랜만에 늦잠을 자며 푹 쉬었다.'],['연휴에도 일한다','D j-1','연휴에도 일했다. 수당이 조금 더 나왔다.','@1']],{k:'fest',sc:'fest'});
Y(19,69,'w !KR','*','{fest} 연휴가 왔다.',[['가족과 함께 보낸다','r3 j2','가족이 모두 모여 {food}을(를) 나눠 먹었다.','@-1'],['쉬지 않고 일한다','D','연휴에도 일했다. 수당이 조금 더 나왔다.','@1']],{k:'fest',sc:'fest'});
Y(19,69,'w t3','[7,8]','여름휴가다.',[['멀리 여행을 간다','j4 r2','오래 꿈꾸던 곳으로 여행을 다녀왔다.','@-2','태풍 때문에 비행기가 뜨지 않아 여행을 접었다.'],['가까운 바다에 다녀온다','j3 h1','가까운 바다에서 며칠 쉬었다.','@-1','가는 날부터 비가 쏟아져 숙소에만 있었다.'],['집에서 푹 쉰다','h2 j1','집에서 아무것도 하지 않고 쉬었다.']],{k:'vac',sc:'travel'});
Y(30,69,'w KR','*','건강검진을 받았다.','',{k:'health',run:'checkup',sc:'hosp'});
Y(40,69,'w !KR t3','*','건강검진을 받았다.','',{k:'health',run:'checkup',sc:'hosp'});
Y(19,69,'w jk:office','12','송년회가 열렸다. {boss} 부장이 한 해 수고했다며 건배를 했다.','r2 j1',{k:'year',sc:'job'});
// ── 일하는 어른: 하는 일에 따라
Y(19,69,'w jk:office','*','{coll}와(과) 함께 맡은 프로젝트의 마감이 다가온다.',[['밤을 새워 끝낸다','k2 h-3 D','밤을 새워 마감을 지켰다. {boss} 부장이 어깨를 두드렸다.','$3'],['일을 나눠 효율적으로 끝낸다','k2 r2 K','일을 잘 나눠 제때 끝냈다.']],{cd:2,sc:'job'});
Y(19,69,'w jk:office','*','회의에서 내 아이디어를 발표하게 되었다.',[['자신 있게 발표한다','B k2','발표가 끝나자 박수가 나왔다.','$4'],['꼼꼼히 자료를 준비한다','D k2','꼼꼼한 자료 덕분에 질문에 모두 답했다.']],{cd:3,sc:'job'});
Y(19,69,'w jk:office','*','가장 친한 동료 {coll}이(가) 회사를 떠난다.','r-2 j-1',{cd:6,sc:'job'});
Y(19,69,'w jk:office','*','실수로 중요한 메일을 잘못 보냈다.',[['바로 솔직하게 알린다','D B','바로 알리고 수습했다. 오히려 믿음을 얻었다.'],['조용히 혼자 수습한다','k1 j-2','밤늦게까지 혼자 수습했다.']],{once:1,sc:'job'});
Y(19,69,'w jk:office','*','{city}(으)로 사흘간 출장을 갔다.','k2 j1',{cd:3,sc:'travel'});
Y(19,69,'w jk:factory','*','이번 달 생산 목표가 크게 늘었다. 잔업이 이어진다.',[['잔업을 한다','D h-2','잔업 수당이 붙었다.','@1'],['정시에 퇴근한다','h1 j1','정시에 퇴근해 가족과 저녁을 먹었다.']],{cd:2,sc:'job'});
Y(19,69,'w jk:factory','*','기계가 갑자기 멈췄다.',[['안전 수칙대로 전원부터 끈다','D','수칙대로 해서 다친 사람이 없었다.'],['직접 손을 넣어 고친다','B h-4','고치다가 손을 다쳤다.']],{once:1,sc:'job'});
Y(19,69,'w jk:factory','*','야간 교대 근무 주간이다. 낮과 밤이 바뀌니 몸이 무겁다.','h-2',{cd:3,sc:'job'});
Y(19,69,'w jk:farm','[3,4,5]','씨를 뿌리는 철이다. 하늘을 보며 비를 기다린다.',[['이웃과 품앗이로 한다','r3 K','이웃과 서로 일을 거들었다.'],['새 품종을 심어 본다','C k1','새 품종을 심어 보았다.']],{k:'farm1',sc:'harvest'});
Y(19,69,'w jk:farm','[9,10,11]','수확 철이다.','',{k:'farm2',run:'harvest',sc:'harvest'});
Y(19,69,'w jk:farm','*','시장에 내놓은 작물 값이 크게 떨어졌다.',[['창고에 두었다가 판다','D','몇 달 기다려 제값을 받았다.','@1'],['헐값에라도 판다','j-2','헐값에 팔았다.','@-1']],{cd:3,sc:'money'});
Y(19,69,'w jk:shop','*','단골손님이 이사를 간다며 인사하러 왔다.','r2 j1',{cd:4,sc:'job'});
Y(19,69,'w jk:shop','*','가게 임대료가 오른다는 연락이 왔다.',[['버틴다','D','허리띠를 졸라맸다.','@-2'],['더 싼 곳으로 옮긴다','B','가게를 옮겼다. 손님이 조금 줄었다.','@-1 j-1']],{cd:4,sc:'money'});
Y(19,69,'w jk:shop','*','새 메뉴(상품)를 내놓았다.',[['과감하게 바꾼다','B C','반응이 좋아 손님이 늘었다.','@2'],['조금씩 바꾼다','D','조금씩 반응을 보았다.']],{cd:3,sc:'job'});
Y(19,69,'w jk:hosp','*','야간 근무 중 응급 환자가 들어왔다.',[['침착하게 처치한다','D k2','침착하게 처치했다. 환자가 고비를 넘겼다.'],['선배를 바로 부른다','r2','선배와 함께 고비를 넘겼다.']],{cd:2,sc:'hosp'});
Y(19,69,'w jk:hosp','*','퇴원한 환자의 가족이 손편지를 보내왔다.','j4 r2',{cd:4,sc:'hosp'});
Y(19,69,'w jk:school','[3,9]','올해 담임을 맡은 반의 아이들 이름을 외웠다.','r2 k1',{k:'schoolY',sc:'school'});
Y(25,69,'w jk:school','*','졸업한 제자가 찾아와 고맙다고 했다.','j4 r3',{cd:4,sc:'school'});
Y(19,69,'w jn:운전|택시|버스|화물','*','장거리 운행을 맡았다. 새벽에 출발해 밤늦게 돌아왔다.','h-2 @1',{cd:2,sc:'job'});
Y(19,69,'w jn:운전|택시|버스|화물','*','손님이 두고 내린 지갑을 발견했다.',[['주인을 찾아 돌려준다','K r2','주인이 고맙다며 음료수를 건넸다.'],['경찰서에 맡긴다','D','경찰서에 맡겼다.']],{once:1,sc:'job'});
Y(19,69,'w jk:part','*','일감이 끊긴 날이 이어졌다.',[['새벽 인력시장에 나간다','D h-1','새벽마다 나가 일을 구했다.','@1'],['다른 일을 배워 본다','C k2','다른 일을 배우기 시작했다.']],{cd:2,sc:'jobloss'});
Y(19,69,'w jk:part','[7,8]','한여름 땡볕 아래에서 일했다.','h-3 @1',{cd:2,sc:'heat'});
Y(19,69,'w jk:dream','*','내 작품(무대)을 처음 보는 사람들 앞에 내놓았다.',[['반응을 그대로 받아들인다','B k2','좋은 말도 쓴소리도 모두 받아 적었다.'],['나만의 길을 지킨다','C j2','내 방식을 지키기로 했다.']],{cd:2,sc:'stage'});
Y(19,69,'w jk:fish|herd|mine|tour','*','날씨가 험해 며칠 일을 쉬었다.','@-1 j-1',{cd:2});
// ── 가족
Y(25,75,'fam','*','결혼기념일이다.',[['{spouse}에게 편지를 쓴다','r4 K','오랜만에 편지를 썼다. {spouse}이(가) 한참 웃었다.'],['둘이 외식을 한다','j3 r2','둘이서 근사한 저녁을 먹었다.','@-1']],{cd:2,sc:'wedding'});
Y(25,70,'fam','*','{spouse}와(과) 집안일 때문에 다퉜다.',[['먼저 대화를 청한다','r3 K','차분히 이야기했다. 할 일을 다시 나눴다.','대화가 또 말다툼이 되었다. 하루가 지나서야 풀렸다.'],['서로 시간을 갖는다','j-1','하루 지나니 조금 풀렸다.']],{cd:3});
Y(19,40,'sgl','*','친구의 결혼식에 갔다.','r2 @-1',{cd:2,sc:'wedding'});
Y(19,45,'sgl','*','{coll}이(가) 좋은 사람을 소개해 주겠다고 한다.',[['만나 본다','B r2','만나서 이야기를 나눴다. 좋은 사람이었다.'],['지금은 괜찮다고 한다','j1','지금은 혼자가 편하다고 말했다.']],{cd:4,sc:'friend'});
Y(19,60,'par','*','부모님 생신이다.',[['직접 찾아뵙는다','r4 K','찾아뵙고 미역국을 끓여 드렸다.','@-1'],['선물과 전화로 대신한다','r1','선물을 보내고 전화를 드렸다.','@-1']],{cd:2});
Y(40,65,'par','*','아빠가 병원에 입원하셨다.',[['휴가를 내고 곁을 지킨다','r4 K','휴가를 내고 병실을 지켰다.','@-1'],['형제들과 돌아가며 돌본다','r2 D','형제들과 돌아가며 돌봤다.']],{once:1,sc:'hosp'});
Y(25,60,'sec','*','고등학교 동창회에 갔다. {bff}은(는) 여전히 그대로였다.','r3 j2',{cd:5,sc:'friend'});
// ── 아이 키우기
Y(19,60,'kb','*','아이가 밤새 울어 한숨도 못 잤다. 새벽에야 둘 다 잠들었다.','h-2 r2',{k:'kid0'});
Y(19,60,'kb','*','{kn}이(가) 첫걸음을 뗐다. 휴대폰 영상으로 몇 번이나 돌려 보았다.','j5 r3',{once:1,sc:'baby'});
Y(19,60,'kp U t3','*','{kn}의 어린이집 대기 순번이 드디어 왔다.','j2',{once:1});
Y(19,60,'kp','*','{kn}이(가) 유치원 발표회에서 노래를 불렀다. 맨 앞줄에서 손을 흔들었다.','j4 r2',{cd:2,sc:'stage'});
Y(19,65,'ke','[3,4]','{kn}의 {kg}학년 학부모 상담 주간이다.',[['직접 가서 선생님을 만난다','r2 K','선생님이 {kn}이(가) 친구를 잘 돕는다고 하셨다.||선생님이 {kn}이(가) 요즘 발표할 때 손을 자주 든다고 하셨다.||선생님이 {kn}이(가) 엉뚱한 질문으로 반을 웃게 한다고 하셨다.||선생님과 {kn}의 친구 관계를 오래 이야기했다. 집에서는 몰랐던 모습이었다.'],['전화로 상담한다','D','짧게 전화로 상담했다.']],{k:'kidSch',sc:'school',cd:2});
Y(19,65,'ke KR','5','{kn}의 운동회. 계주에서 {kn}이(가) 넘어졌다가 다시 일어나 끝까지 달렸다.','j4 r3',{cd:2,sc:'sport'});
Y(19,65,'ke','*','{kn}이(가) 학원을 하나 더 보내 달라고 한다.',[['보내 준다','r2','학원비가 늘었다.','@-1'],['집에서 같이 공부한다','r3 K','저녁마다 {kn}과(와) 같이 책상에 앉았다.']],{once:1,sc:'money'});
Y(19,65,'km','*','사춘기 {kn}이(가) 방문을 잠그고 말을 안 한다.',[['기다려 준다','r2 K','며칠 뒤 {kn}이(가) 먼저 이야기를 꺼냈다.'],['단호하게 대화를 청한다','B r-1','대화는 했지만 서로 상처도 남았다.']],{once:1});
Y(19,65,'km','*','{kn}의 중간고사 성적표가 왔다.',[['결과보다 노력을 칭찬한다','r3 K','{kn}이(가) 다음엔 더 해 보겠다고 했다.'],['부족한 과목을 함께 짚는다','D r1','함께 공부 계획을 세웠다.']],{cd:2,sc:'school'});
Y(19,70,'kh KR','11','{kn}의 수능 날. 시험장 교문 앞에서 한참을 서 있었다.','r3 j1',{k:'kidX',sc:'school'});
Y(19,70,'kh !KR x2','x2','{kn}이(가) {x2}을(를) 보았다. 결과를 기다리는 동안 밥이 넘어가지 않았다.','r3 j1',{k:'kidX',sc:'school'});
Y(19,70,'ku','*','{kn}이(가) 대학 기숙사로 떠났다. 빈방에 한참 서 있었다.','j-1 r2',{once:1});
Y(19,70,'kh','*','{kn}의 학원비와 교육비가 만만치 않다.','@-2',{cd:2,sc:'money'});
Y(45,85,'ka','*','다 큰 {kn}이(가) 결혼할 사람을 데려왔다.','j5 r3',{once:1,sc:'wedding'});
Y(45,85,'ka','*','{kn}이(가) 첫 월급으로 내복을 사 왔다.','j5 r3',{once:1});
Y(50,95,'gk','*','손주가 놀러 왔다. 하루 종일 업어 주느라 허리가 아팠지만 웃음이 떠나지 않았다.','j5 r3 h-1',{cd:2,sc:'baby'});
// ── 돈
Y(25,69,'w t3','*','연말정산 결과가 나왔다.','',{once:0,cd:3,run:'tax',sc:'money'});
Y(25,69,'w','*','모아 둔 돈을 어떻게 굴릴까?',[['적금에 넣는다','D','차곡차곡 적금을 부었다.','%2'],['주식에 넣어 본다','B C','주식을 샀다.'],['그대로 둔다','','그대로 두었다.']],{cd:4,sc:'money',run:'invest'});
Y(25,69,'rent KR','*','전세 계약 기간이 끝나 간다. 집주인이 보증금을 올려 달라고 한다.',[['대출을 받아 올려 준다','D','대출을 받아 보증금을 올려 주었다.','@-4'],['더 작은 집으로 이사한다','B','더 작은 집으로 이사했다.','@-1 j-2']],{cd:4,sc:'house'});
Y(25,69,'house','*','집 보일러(지붕)가 고장 났다.','@-1 j-1',{cd:5,sc:'house'});
Y(25,69,'debt','*','대출 금리가 올랐다. 다달이 내는 이자가 늘었다.',[['씀씀이를 줄인다','D j-1','외식과 쇼핑을 줄였다.','@1'],['부업을 시작한다','B h-2','주말에 부업을 시작했다.','@2']],{cd:3,sc:'money'});
Y(25,69,'car','*','차가 고장 나 정비소에 맡겼다.','@-1',{cd:4,sc:'travel'});
Y(25,69,'','*','오랜만에 연락 온 친구가 돈을 빌려 달라고 한다.',[['빌려준다','K r2','빌려주었다. 반년 뒤 돌려받았다.'],['정중히 거절한다','D','정중히 거절했다. 친구도 이해했다.']],{once:1,sc:'money'});
Y(25,69,'w','*','물가가 많이 올랐다. 장바구니가 가벼워졌다.','@-1 j-1',{cd:4,sc:'money'});
// ── 건강 · 이웃 · 마을
Y(30,70,'','*','허리가 자주 아프다.',[['운동을 시작한다','h4 D','저녁마다 걷고 스트레칭을 했다.','사흘 하고 그만두었다. 허리는 여전히 아프다.'],['병원에서 치료를 받는다','h3','몇 주 동안 물리치료를 받았다.','@-1']],{once:1,sc:'hosp'});
Y(42,70,'','*','작은 글씨가 잘 안 보인다. 돋보기안경을 맞췄다.','k1',{once:1});
Y(19,75,'','*','동네 {sport} 모임에 나가 볼까?',[['나간다','h3 r3','주말마다 땀을 흘렸다. 새 친구들이 생겼다.','몇 번 나갔지만 어울리기가 쉽지 않았다.'],['혼자 운동한다','h2','혼자 꾸준히 운동했다.']],{once:1,sc:'sport'});
Y(19,80,'','*','이웃집에 큰일이 생겼다.',[['음식을 만들어 간다','K r3','음식을 만들어 갔다. 이웃이 두 손을 잡았다.'],['조용히 일손을 돕는다','r2 D','조용히 일손을 도왔다.']],{cd:5});
Y(19,80,'','*','{city}에서 큰 선거가 열렸다. 투표소에 가서 한 표를 행사했다.','k1',{cd:4});
Y(19,85,'','*','봉사활동을 할까?',[['주말마다 나간다','K r3 j2','주말마다 봉사를 나갔다.','몇 번 나가다 일이 바빠 그만두었다.'],['기부로 대신한다','K','작은 돈을 기부했다.','@-1']],{cd:6});
Y(19,85,'','*','{landmark}에 처음 가 보았다. 사진으로만 보던 곳이었다.','j3 k1',{once:1,sc:'travel'});
Y(19,85,'','*','몇 년 만에 독감에 걸렸다. 일주일을 앓았다.','h-2',{cd:4,sc:'sick'});
Y(19,85,'','*','{fest} 날, 마을 사람들과 함께 {music}을(를) 들으며 밤늦게까지 어울렸다.','j3 r2',{cd:3,sc:'fest'});
// ── 나이 든 뒤
Y(60,95,'ret','*','아침마다 공원을 걷는다. 같은 시간에 걷는 이웃들과 인사를 나눈다.','h2 r2',{k:'r1'});
Y(60,95,'ret','*','텃밭에 상추와 고추를 심었다.','h2 j2',{cd:2,sc:'garden'});
Y(60,95,'ret t3','*','복지관의 스마트폰 교실에 다닌다. 손주에게 처음으로 영상 통화를 걸었다.','k2 r2 j2',{once:1});
Y(60,95,'ret','*','오래된 사진첩을 꺼내 보았다. 젊은 날의 {bff}이(가) 웃고 있었다.','j2 r1',{once:1,sc:'farewell'});
Y(65,95,'','*','오랜 친구의 장례식에 다녀왔다. 돌아오는 길이 유난히 길었다.','j-4 r1',{cd:4,sc:'farewell'});
Y(65,95,'','*','병원 정기 검진 날이다. 의사가 혈압을 조심하라고 했다.','h1',{cd:2,sc:'hosp'});
Y(65,95,'ret','*','젊은이들에게 내가 아는 것을 가르쳐 줄 기회가 생겼다.',[['기꺼이 가르친다','K r3 j3','내 이야기를 귀 기울여 듣는 눈빛들이 고마웠다.'],['조용히 지낸다','h1','조용히 지냈다.']],{once:1});
Y(65,95,'ret','*','연금(가족의 도움)이 들어오는 날, 손주 용돈부터 챙겼다.','j2 r2',{cd:3,sc:'money'});
// ── 어린 시절 누구에게나 (학교에 다니든 아니든)
Y(7,18,'KR','9','추석이다. 송편을 빚다가 모양이 이상하다고 다 같이 웃었다.','r2 j2',{k:'holiday',sc:'fest'});
Y(7,18,'!KR','*','{fest} 날이 왔다. 온 가족이 모여 {food}을(를) 나눠 먹고 밤늦게까지 이야기꽃을 피웠다.','j3 r2',{k:'holiday',sc:'fest'});
Y(7,18,'','*','온 가족이 둘러앉아 {food}을(를) 먹었다. 오랜만에 다 같이 크게 웃었다.','j2 r2',{cd:2,sc:'life'});
Y(7,18,'sib','*','동생과 리모컨(장난감) 때문에 싸웠다.',[['양보한다','r2 K','양보했더니 동생이 나중에 간식을 나눠 주었다.'],['끝까지 지킨다','B j1','결국 엄마가 둘 다 혼내셨다.']],{cd:3});
Y(7,18,'','*','감기 몸살로 사흘을 앓았다. 엄마가 끓여 준 죽이 유난히 맛있었다.','h-2 r1',{cd:3,sc:'sick'});
Y(7,18,'','*','길에서 강아지가 졸졸 따라왔다.',[['집에 데려가자고 조른다','K j2','가족회의 끝에 강아지를 키우게 되었다.'],['주인을 찾아 준다','D r1','전단지를 붙여 주인을 찾아 주었다.']],{once:1,sc:'pet'});
Y(7,18,'','*','사촌 형(언니)의 결혼식에 갔다. 처음으로 정장을 입어 보았다.','r2 j2',{once:1,sc:'wedding'});
Y(9,18,'','*','아빠 회사(일)가 어렵다는 이야기를 우연히 들었다. 그날 밤 잠이 오지 않았다.','j-2 r1',{once:1,sc:'money'});
Y(9,18,'','*','처음으로 혼자 {city}에 가는 버스를 탔다. 창밖의 큰 건물들을 오래 보았다.','k2 j2 B',{once:1,sc:'travel'});
Y(7,18,'','*','밤하늘에 별똥별이 떨어졌다. 소원을 빌었다.','j2 C',{once:1});
Y(10,18,'','*','할머니(할아버지)께서 편찮으시다는 연락을 받고 온 가족이 찾아뵈었다.','r2 j-1',{once:1,sc:'hosp'});
Y(7,18,'U','*','우리 집이 이사를 했다. 새 방의 벽지를 내가 골랐다.','j2 k1',{once:1,sc:'house'});
Y(7,18,'R','*','마을 어른들과 함께 모내기(씨뿌리기)를 거들었다. 새참으로 먹은 국수가 꿀맛이었다.','h2 r2',{cd:3,sc:'harvest'});
Y(10,18,'','*','처음으로 스스로 용돈 기입장을 써 보았다.','k2 D',{once:1,sc:'money'});
Y(12,18,'','*','{bff}이(가) 힘든 일이 있다며 밤늦게 연락해 왔다.',[['바로 만나러 간다','r4 K','한참 이야기를 들어 주었다. {bff}이(가) 고맙다고 했다.'],['메시지로 위로한다','r2','늦게까지 메시지를 주고받았다.']],{once:1,sc:'friend'});
Y(7,18,'t2','[s5,s6,s7]','한 해 중 가장 비가 많이 오는 철이다. 지붕이 새서 양동이를 받쳐 두었다.','j-1',{cd:2,sc:'flood'});
Y(7,18,'t3','[7,8]','폭염 특보가 이어졌다. 선풍기 앞을 떠날 수 없었다.','h-1',{cd:3,sc:'heat'});
// ── 어른 누구에게나 (덧붙임)
Y(19,40,'','*','처음으로 혼자 살 집을 구하러 다녔다. 열 곳을 보고 나서야 마음에 드는 곳을 찾았다.','k1 j1 B',{once:1,sc:'house'});
Y(19,69,'w','*','{coll}의 결혼식 축의금을 냈다.','r2 @-1',{cd:3,sc:'wedding'});
Y(19,69,'w','*','새로 온 후배 {coll2}에게 일을 가르쳐 주게 되었다.',[['차근차근 알려 준다','K r3','후배가 금세 일을 익혔다.'],['혼자 해 보게 둔다','D','실수하며 배우게 두었다. 후배가 조금 서운해했다.']],{once:1,sc:'job'});
Y(19,69,'w','*','퇴근길에 {coll}와(과) 한잔하며 속 이야기를 나눴다.','r3 j1',{cd:2,sc:'friend'});
Y(25,69,'w','*','일을 더 잘하고 싶어 공부를 시작할까?',[['자격증 공부를 한다','k4 D h-1','밤마다 공부해 자격증을 땄다.','$3'],['지금 일에 집중한다','j1','지금 하는 일에 집중했다.']],{cd:6,sc:'school'});
Y(30,69,'','*','몇 년 만에 혼자만의 여행을 떠났다.','j4 h1',{cd:5,sc:'travel'});
Y(19,69,'nj','*','일자리를 찾으러 다닌다.',[['원서를 스무 곳에 낸다','D','원서를 스무 곳에 냈다. 두 곳에서 면접 연락이 왔다.'],['아는 사람에게 부탁한다','r2','아는 사람이 일자리를 알아봐 주겠다고 했다.']],{k:'nj1',sc:'job'});
Y(19,69,'nj','*','일이 없으니 하루가 길다. 통장 잔고가 자꾸 줄어든다.','j-3 @-1',{k:'nj2',sc:'money'});
// ── 학교 밖에서 일하며 자라는 아이 (덧붙임)
Y(7,18,'ns','*','장날이다. 새벽부터 짐을 이고 시장으로 걸어갔다.',[['큰 소리로 손님을 부른다','B r1','목청껏 손님을 불러 물건을 다 팔았다.'],['조용히 셈을 맡는다','k2 D','셈을 맡아 한 푼도 틀리지 않았다.']],{cd:2,sc:'job'});
Y(7,18,'ns','*','먼 우물까지 물을 길으러 다녀왔다. 오는 길에 친구들과 노래를 불렀다.','h2 r2',{cd:2});
Y(10,18,'ns','*','동네 수리공 아저씨가 일을 배워 보겠느냐고 물었다.',[['배운다','k3 D','아저씨 곁에서 고치는 법을 하나씩 배웠다.'],['지금 일을 계속한다','r1','하던 일을 계속했다.']],{once:1,sc:'job'});
Y(7,18,'ns','*','저녁이면 공터에서 동네 아이들과 {sport}을(를) 했다. 공은 헝겊을 뭉쳐 만든 것이었다.','h2 j3 r2',{cd:2,sc:'sport'});
Y(7,18,'ns rg:AF|SA|SE','*','모기에 물린 뒤 열이 오르내렸다. 보건소에서 약을 받아 왔다.','h-3',{cd:3,sc:'sick'});
Y(12,18,'ns','*','이웃 마을 결혼 잔치에서 일을 거들고 품삯과 음식을 받아 왔다.','r2 j2',{cd:3,sc:'wedding'});
Y(7,18,'ns','*','{bff}와(과) 강가에서 물고기를 잡았다. 저녁 반찬이 생겼다.','j3 r2 h1',{cd:3,sc:'sea'});
Y(9,18,'ns','*','마을에 처음으로 전기가 들어왔다(새 휴대폰 충전소가 생겼다). 밤에도 불이 환했다.','j3 k1',{once:1});
Y(11,18,'ns','*','도시에서 돌아온 형이 학교 이야기를 들려주었다.',[['다시 학교에 가고 싶다고 말한다','B k1','가족에게 공부하고 싶다고 말했다. 다들 말없이 고개를 끄덕였다.'],['지금 할 일에 집중한다','D r1','지금 할 일에 마음을 쏟기로 했다.']],{once:1});
Y(7,18,'ns R','[s8,s9]','추수가 끝났다. 마을 사람들이 모여 잔치를 열었다.','j3 r2',{cd:2,sc:'harvest'});
// ── 십대 누구에게나 (덧붙임)
Y(13,18,'','*','처음으로 친구들끼리만 놀러 갔다. 돌아오는 길에 버스를 놓쳐 한참 걸었다.','j3 r2 B',{once:1,sc:'travel'});
Y(13,18,'','*','좋아하는 가수(선수)의 경기를 보러 갔다. 목이 쉬도록 소리를 질렀다.','j4',{once:1,sc:'stage'});
Y(13,18,'','*','거울 속 얼굴에 여드름이 잔뜩 났다. 사진 찍기가 싫어졌다.','j-1',{once:1});
Y(13,18,'','*','할머니(할아버지)께 처음으로 내 고민을 이야기했다. “다 지나간다.” 그 한마디가 오래 남았다.','r3 j2',{once:1});
// ── 다른 나라 학교의 행사 (해마다 다른 일이 되도록)
Y(9,18,'s !KR','[s5,s6]','학교 과학 박람회가 열린다.',[['직접 실험을 준비한다','k3 C','페트병 로켓을 만들어 운동장에 쏘아 올렸다.'],['친구 팀을 돕는다','r2 K','친구 팀의 발표 자료를 함께 만들었다.']],{k:'spring',sc:'school'});
Y(7,18,'s !KR','[s3,s7]','학교 음악회가 열렸다.',[['합창단으로 무대에 선다','j3 r2','반 친구들과 화음을 맞춰 노래했다.'],['악기를 연주한다','j3 B','떨리는 손으로 끝까지 연주했다.'],['객석에서 박수를 친다','j1','친구들 무대에 손뼉을 쳤다.']],{k:'spring',sc:'stage'});
Y(7,18,'s !KR','*','학교에서 나라의 기념일 행사가 열렸다. 깃발을 들고 운동장을 행진했다.','r2 j1',{k:'autumn',sc:'fest'});
Y(9,18,'s !KR','[s1,s7]','학교 연극을 올린다.',[['배역을 맡는다','j3 B','무대 위에서 대사를 한 줄도 틀리지 않았다.'],['조명과 무대 뒤를 맡는다','k2 D','무대 뒤에서 조명을 맡았다. 막이 내리자 다 같이 껴안았다.']],{k:'autumn',sc:'stage'});
Y(9,18,'s !KR','*','{city}의 과학관으로 견학을 갔다. 공룡 뼈 앞에서 한참 서 있었다.','k3 j2 C',{k:'autumn',once:1,sc:'travel'});
Y(9,18,'s !KR t3','*','이틀 동안 학교 캠프를 갔다. 처음으로 친구들과 텐트에서 잤다.','r3 j3',{k:'autumn',once:1,sc:'travel'});
Y(9,18,'s t2','*','학교 근처 마을 청소의 날. 반 친구들과 길을 쓸고 나무를 심었다.','r2 K',{k:'autumn',sc:'school'});
Y(13,18,'s !KR','[s4,s9]','학부모 상담 날, 부모님이 학교에 오셨다. 선생님이 무엇을 말씀하실지 조마조마했다.','r1',{k:'autumn',sc:'school',run:'parentMtg'});
Y(9,18,'ns sib','*','저녁마다 학교에 다니는 동생의 숙제를 봐 주었다. 동생이 배운 것을 나도 같이 배웠다.','k2 r3 K',{cd:2});
Y(10,18,'ns','*','빌린 휴대폰으로 영상을 보며 새로운 기술을 혼자 익혔다.','k3 C',{cd:3});
Y(9,18,'ns R','*','우리 집 염소(소)가 새끼를 낳았다. 밤새 곁을 지켰다.','j3 K',{cd:3,sc:'pet'});
Y(10,18,'ns','*','{bff}이(가) 도시로 일하러 떠났다. 마을 어귀까지 배웅했다.','r1 j-2',{once:1,sc:'travel'});
Y(9,18,'ns','*','마을 대항 {sport} 대회가 열렸다.',[['선수로 뛴다','h3 B','온 마을이 응원하는 앞에서 뛰었다.'],['응원을 이끈다','r3 K','북을 치며 응원을 이끌었다.']],{cd:2,sc:'sport'});
Y(12,18,'ns','*','가족이 아파 모아 둔 품삯을 병원비에 보탰다.','r3 j-1',{once:1,sc:'hosp'});

/* ---------- [데이터] 사건사고 · 특이한 경험 · 나라마다의 삶 (Y 함수의 설명은 months.js) ----------
   nt: 그 일과 관련된 실제 통계 한 줄 (출처를 함께 적었다) */

// ── 사건사고: 다치고, 잃어버리고, 놀라고, 가까스로 피하는 일
Y(1,5,'t2','*','부엌의 뜨거운 냄비에 손을 데었다. 엄마가 찬물에 오래 손을 담가 주었다.','h-3',{once:1,sc:'sick',nt:'화상으로 해마다 약 18만 명이 숨지며, 대부분 소득이 낮은 나라에서 일어납니다 (WHO)'});
Y(2,6,'','*','시장에서 엄마 손을 놓쳐 한참 길을 잃었다. 울고 있는데 가게 아주머니가 엄마를 찾아 주었다.','j-2 r1',{once:1});
Y(3,8,'','*','높은 곳에서 뛰어내리다 이마가 찢어져 세 바늘을 꿰맸다.','h-2 B',{once:1,sc:'hosp'});
Y(6,14,'','*','자전거를 타다 내리막에서 넘어졌다. 무릎과 팔꿈치가 다 까졌다.','h-2',{cd:4,sc:'sick'});
Y(7,16,'','*','계단에서 미끄러져 팔이 부러졌다. 한 달 동안 깁스를 했다. 친구들이 깁스에 낙서를 해 주었다.','h-4 r2',{once:1,sc:'hosp'});
Y(5,16,'coast|R','*','물놀이를 하다 깊은 곳에 빠졌다. 근처에 있던 어른이 끌어내 주었다.',[['그 뒤로 수영을 배운다','h3 D','수영 강습에 다니기 시작했다.'],['한동안 물가에 가지 않는다','j-1','한동안 물가에 가지 않았다.']],{once:1,sc:'sea',nt:'물에 빠져 해마다 약 23만 6천 명이 숨지고, 특히 어린이·청소년에게 많습니다 (WHO)'});
Y(4,14,'t2','*','동네 개에게 다리를 물렸다. 보건소에서 광견병 주사를 여러 번 맞았다.','h-3',{once:1,sc:'hosp',nt:'광견병으로 해마다 약 5만 9천 명이 숨지며, 거의 모두 개에게 물린 경우입니다 (WHO)'});
Y(8,60,'R rg:AF|SA|SE|LA','*','밭으로 가는 길에 뱀에게 물렸다. 마을 사람들이 오토바이로 보건소까지 데려다주었다.','h-6',{once:1,sc:'hosp',nt:'뱀에게 물려 해마다 8만~14만 명이 숨지고, 그 세 배쯤이 장애를 얻습니다 (WHO)'});
Y(13,75,'U','*','붐비는 버스(지하철)에서 지갑(휴대폰)을 소매치기당했다.','j-3 @-1',{once:1,sc:'money'});
Y(19,85,'','*','길에서 지갑을 주웠다. 안에 현금과 신분증이 들어 있다.',[['주인을 찾아 돌려준다','K r2','경찰서에 맡겼다. 며칠 뒤 주인이 고맙다며 연락해 왔다.'],['못 본 척 지나간다','j-1','그냥 지나쳤다. 마음이 한동안 찜찜했다.']],{once:1});
Y(30,90,'t3','*','“택배 주소가 잘못되었습니다”라는 문자가 왔다. 링크가 걸려 있다.',[['누르지 않고 지운다','D k1','수상해서 지웠다. 나중에 뉴스에서 같은 문자 사기를 보았다.'],['무심코 누른다','j-3 @-2','눌렀다가 개인정보가 빠져나가 돈을 잃었다.']],{once:1,sc:'money',nt:'전화·문자를 이용한 사기 피해는 해마다 늘고 있어, 모르는 링크는 누르지 않는 것이 가장 좋은 예방입니다'});
Y(19,85,'','*','집을 비운 사이 도둑이 들었다. 서랍이 모두 열려 있었다.','j-4 @-2',{once:1,sc:'house'});
Y(5,80,'t2','*','등잔(가스) 불이 커튼에 옮겨붙었다. 온 가족이 물을 퍼 날라 겨우 껐다.','h-1 j-3',{once:1,sc:'fire'});
Y(5,80,'','*','상한 음식을 먹고 밤새 배앓이를 했다.','h-2',{cd:6,sc:'sick'});
Y(1,12,'t2','*','홍역이 동네에 돌았다. 열꽃이 온몸에 피어 열흘을 앓았다.','h-5',{once:1,sc:'sick',nt:'홍역은 백신 두 번으로 막을 수 있지만, 2023년에도 약 10만 명 넘게 홍역으로 숨졌습니다 (WHO)'});
Y(1,60,'rg:AF','*','모기에 물린 뒤 말라리아에 걸렸다. 열이 오르내리며 일주일을 앓았다.','h-6',{cd:5,sc:'sick',nt:'2022년 말라리아로 약 60만 8천 명이 숨졌고, 그 대부분이 아프리카의 다섯 살 미만 어린이였습니다 (WHO 세계 말라리아 보고서 2023)'});
Y(5,70,'rg:SE|SA|LA','*','뎅기열에 걸려 열이 펄펄 끓었다. 며칠 동안 혈소판 수치를 재며 입원했다.','h-5',{once:1,sc:'hosp',nt:'뎅기열은 세계 인구의 절반가량이 걸릴 위험이 있는 곳에 살고, 2023년 보고된 환자 수가 역대 가장 많았습니다 (WHO)'});
Y(5,70,'t2 rg:AF|SA','*','마을에 콜레라가 돌았다. 우물물을 반드시 끓여 마시라는 안내가 돌았다.',[['물을 꼭 끓여 마신다','D h2','끓인 물만 마셨다. 가족 모두 무사히 지나갔다.'],['괜찮겠지 하고 그냥 마신다','h-4','며칠 동안 심한 설사로 고생했다.']],{once:1,sc:'sick',nt:'안전한 식수를 쓰지 못하는 사람이 2022년 약 22억 명입니다 (WHO·UNICEF JMP)'});
Y(15,65,'w jk:factory|part','*','일하던 곳에서 떨어지는 자재에 다칠 뻔했다.',[['그 뒤로 안전모를 꼭 쓴다','D h1','동료들에게도 안전모를 쓰자고 했다.'],['운이 좋았다며 넘긴다','','별일 없었다며 넘겼다.']],{once:1,sc:'job',nt:'일하다 다치거나 일 때문에 얻은 병으로 해마다 약 290만 명이 숨집니다 (ILO 2023)'});
Y(16,75,'car','*','교차로에서 신호를 어긴 차와 부딪힐 뻔했다. 한참 동안 손이 떨렸다.','j-2',{once:1,sc:'travel',nt:'교통사고로 해마다 약 119만 명이 숨지고, 5~29세 사망 원인 1위입니다 (WHO 2023)'});
Y(15,60,'rg:SE|AF|SA|LA','*','오토바이(오토바이 택시)를 타고 가다 빗길에 넘어졌다. 다리에 큰 상처가 났다.','h-4',{once:1,sc:'hosp',nt:'교통사고 사망자의 절반 넘게가 보행자·자전거·오토바이를 탄 사람입니다 (WHO 2023)'});
Y(19,80,'','*','교통사고를 당했다.',[['병원에서 끝까지 치료받는다','h-2 D','석 달 동안 재활 치료를 받았다.','@-2'],['일 때문에 대충 치료하고 나간다','h-5','허리가 오래 아팠다.']],{once:1,w:.6,sc:'hosp',nt:'교통사고로 해마다 2천만~5천만 명이 다칩니다 (WHO)'});
Y(5,80,'t2','*','며칠째 전기가 들어오지 않았다. 밤에는 촛불(휴대폰 손전등)을 켜고 지냈다.','j-1',{cd:3,nt:'2022년 전 세계 약 6억 8,500만 명이 전기 없이 살았고, 그 80%가 사하라 이남 아프리카에 삽니다 (IEA·세계은행 SDG7 보고서 2024)'});
Y(5,80,'t2','*','마을 수도가 끊겨 사흘 동안 먼 곳까지 물을 길으러 다녔다.','h-1 j-1',{cd:4});
Y(13,18,'s','*','시험 시간에 옆자리 친구가 답을 보여 달라고 한다.',[['거절한다','D B','거절했다. 친구는 서운해했지만 나중에 이해했다.'],['보여 준다','r1 j-2','보여 줬다. 둘 다 들킬까 봐 시험 내내 조마조마했다.']],{once:1,sc:'school'});
Y(12,18,'s t3','*','누군가 내 사진을 우스꽝스럽게 바꿔 단체 채팅방에 올렸다.',[['선생님과 부모님께 알린다','B r1','어른들이 나서서 사진이 지워지고 사과를 받았다.'],['아무렇지 않은 척한다','j-4','아무렇지 않은 척했지만 며칠 밤잠을 설쳤다.']],{once:1,sc:'friend',nt:'괴롭힘을 겪으면 혼자 견디지 않아도 돼요. 한국 117(학교폭력 신고·상담) · 청소년상담 1388'});
Y(10,80,'hz:quake','*','한밤중에 땅이 크게 흔들렸다. 가족이 모두 이불을 뒤집어쓰고 밖으로 뛰어나갔다.','j-3 h-1',{cd:6,sc:'quake'});
Y(5,80,'hz:storm','[7,8,9]','태풍이 지나가며 지붕 한쪽이 날아갔다. 이웃들과 함께 고쳤다.','j-2 r2 @-1',{cd:3,sc:'storm'});
Y(5,80,'hz:flood','*','큰비로 집 안까지 물이 찼다. 가구를 높은 곳으로 옮기며 밤을 새웠다.','j-3 @-1',{cd:3,sc:'flood',nt:'2000~2019년 홍수는 기후 관련 재해 가운데 가장 잦았고, 피해를 입은 사람이 16억 명이 넘습니다 (UNDRR 2020)'});
Y(5,80,'hz:drought','*','몇 달째 비가 오지 않아 우물이 말랐다. 물 한 통을 아껴 썼다.','j-3 h-1',{cd:3,sc:'drought'});
Y(5,80,'hz:heat','[6,7,8]','기온이 45도 가까이 오르는 폭염이 이어졌다. 낮에는 밖에 나가지 않았다.','h-2',{cd:3,sc:'heat',nt:'2000~2019년 폭염 관련 사망은 해마다 약 49만 명으로 추정됩니다 (Lancet Planetary Health 2021)'});
Y(5,80,'hz:fire','*','근처 산에서 난 불의 연기가 며칠 동안 마을을 덮었다.','h-2 j-1',{cd:4,sc:'fire'});
Y(5,80,'hz:cold','[12,1,2]','영하 30도 가까운 추위가 이어졌다. 수도관이 얼어 터졌다.','h-1 @-1',{cd:3,sc:'cold'});
Y(3,80,'hz:unrest','*','총소리가 가까워져 가족이 짐을 싸 이웃 마을 친척 집으로 피난을 갔다. 몇 주 뒤에야 돌아왔다.','j-6 h-2 r2',{cd:6,sc:'travel',nt:'2024년 전쟁·박해·폭력으로 집을 떠난 사람은 1억 2천만 명을 넘었습니다 (UNHCR)'});
Y(3,80,'hz:volcano','*','화산이 연기를 내뿜어 하늘이 잿빛이 되었다. 마스크를 쓰고 다녔다.','h-1 j-1',{cd:6,sc:'volcano'});

// ── 특이한 경험: 자주 오지는 않지만, 오면 평생 이야기하는 일
Y(5,90,'EG|ES|MA|DZ|TN|LY|SA|YE|SO yr:2027','8','8월 2일 낮, 해가 달에 완전히 가려지는 개기일식을 보았다. 대낮에 별이 보였다.','j5 k3 C',{w:60,sc:'travel',nt:'2027년 8월 2일 개기일식은 이집트 룩소르 부근에서 6분 넘게 이어져, 21세기 육지에서 볼 수 있는 가장 긴 개기일식 가운데 하나입니다'});
Y(5,90,'AU|NZ yr:2028','7','7월 22일, 하늘이 갑자기 어두워지는 개기일식을 가족과 함께 보았다.','j5 k3 C',{w:60,sc:'travel'});
Y(5,90,'ZA|BW|NA|AU yr:2030','11','11월 25일, 개기일식이 지나갔다. 해가 검은 고리로 변하는 순간 모두 탄성을 질렀다.','j5 k3 C',{w:60,sc:'travel'});
Y(5,90,'NG|CM|TD|SD|EG|SA|IR|AF|PK|IN|CN yr:2034','3','3월 20일, 개기일식이 하늘을 가로질렀다. 학교 운동장에서 일식 안경을 쓰고 다 함께 올려다보았다.','j5 k3 C',{w:60,sc:'travel'});
Y(5,90,'CN|KP|JP yr:2035','9','9월 2일 아침, 개기일식으로 하늘이 몇 분 동안 밤처럼 어두워졌다.','j5 k3 C',{w:60,sc:'travel'});
Y(5,90,'US yr:2045','8','8월 12일, 미국을 서쪽에서 동쪽으로 가로지르는 개기일식을 보았다. 사람들이 길에 차를 세우고 하늘을 보았다.','j5 k3 C',{w:60,sc:'travel'});
Y(20,90,'yr:2061','[7,8]','76년 만에 돌아온 핼리 혜성을 보았다. 다음에 돌아오는 2134년에는 이 세상에 없겠지 싶어 오래 바라보았다.','j5 k3 C',{w:60,nt:'핼리 혜성은 약 76년마다 태양 가까이 돌아오며, 2061년 여름에 다시 가까워집니다'});
Y(4,90,'MA|ES|PT yr:2030','[6,7]','우리나라가 함께 여는 월드컵이 열렸다. 온 동네가 경기 날마다 들썩였다.','j4 r2',{w:60,sc:'sport'});
Y(4,90,'UY|AR|PY yr:2030','6','월드컵 100주년을 기념해 개막 경기가 우리나라에서 열렸다. 거리마다 국기가 걸렸다.','j4 r2',{w:60,sc:'sport'});
Y(4,90,'SA yr:2034','*','우리나라에서 월드컵이 열렸다. 새로 지은 경기장에 가족과 함께 갔다.','j4 r2',{w:60,sc:'sport'});
Y(2,90,'US yr:2028','[7,8]','로스앤젤레스 올림픽이 열렸다. 텔레비전 앞에서 온 가족이 응원했다.','j3 r2',{w:60,sc:'sport'});
Y(4,90,'AU yr:2032','[7,8]','브리즈번 올림픽이 열렸다. 학교에서 단체로 경기를 보러 갔다.','j4 r2',{w:60,sc:'sport'});
Y(4,90,'FR yr:2030','2','프랑스 알프스에서 겨울 올림픽이 열렸다. 스키 점프를 처음 보았다.','j3',{w:60,sc:'sport'});
Y(4,90,'US yr:2034','2','솔트레이크시티에서 겨울 올림픽이 열렸다. 하키 결승전을 끝까지 보았다.','j3',{w:60,sc:'sport'});
Y(8,90,'t3','*','처음으로 비행기를 탔다. 구름 위에서 내려다본 땅이 장난감 같았다.','j4 k2 C',{once:1,w:.8,sc:'travel'});
Y(19,90,'t2','*','처음으로 비행기를 탔다. 일자리를 찾아 먼 도시로 가는 길이었다. 창문에 얼굴을 붙이고 한참 내려다보았다.','j3 k2 C',{once:1,w:.4,sc:'travel'});
Y(6,90,'inland','*','난생처음 바다를 보았다. 끝이 보이지 않았다. 바닷물이 정말 짰다.','j5 k2 C',{once:1,sc:'sea'});
Y(10,90,'rg:AF|SE|SA|LA|ME','*','다른 나라에 갔다가 태어나서 처음으로 눈을 보았다. 손바닥 위에서 금세 녹아 버렸다.','j5 C',{once:1,w:.4,sc:'cold'});
Y(6,90,'NO|SE|FI|IS|CA|RU','[12,1,2]','밤하늘에 초록빛 오로라가 커튼처럼 일렁였다. 모두 말없이 올려다보았다.','j5 C',{once:1,w:.8});
Y(6,90,'','*','지역 방송국 기자가 길에서 인터뷰를 요청했다. 그날 저녁 뉴스에 내 얼굴이 3초 나왔다.','j4 B',{once:1,w:.4,sc:'stage'});
Y(18,90,'','*','장난삼아 산 복권이 작은 금액에 당첨되었다.','j3 @1',{once:1,w:.4,sc:'money'});
Y(10,90,'','*','{sport} 국가대표 선수를 우연히 만나 사인을 받았다.','j4',{once:1,w:.4,sc:'sport'});
Y(14,80,'','*','물에 빠진 아이를 보고 뛰어들어 건져 냈다. 마을 사람들이 나를 칭찬했다.','r5 j4 B',{once:1,w:.2,sc:'sea'});
Y(18,70,'','*','헌혈을 처음 했다. 내 피가 누군가에게 간다고 생각하니 뿌듯했다.','K j2',{once:1,w:.7,sc:'hosp'});
Y(20,70,'t3','*','42.195킬로미터 마라톤을 완주했다. 결승선에서 다리가 풀렸다.','h4 j4 D',{once:1,w:.4,sc:'sport'});
Y(15,75,'','*','가장 높은 산에 올랐다. 정상에서 본 해돋이를 평생 잊지 못할 것 같다.','h3 j4 B',{once:1,w:.6,sc:'travel'});
Y(25,90,'','*','오래전에 연락이 끊겼던 먼 친척이 수소문 끝에 찾아왔다. 할머니의 옛 사진을 가져왔다.','r4 j3',{once:1,w:.4});
Y(12,80,'t3','*','장난처럼 올린 짧은 영상이 갑자기 수십만 번 재생되었다. 며칠 동안 모르는 사람들이 알아보았다.','j3 r1',{once:1,w:.3});
Y(25,90,'t3','*','다른 나라에서 길을 잃었다. 말이 통하지 않았지만 낯선 사람이 목적지까지 데려다주었다.','j3 k2 C',{once:1,w:.4,sc:'travel'});
Y(30,90,'','*','오래된 상자에서 할아버지가 쓴 편지 묶음을 발견했다. 처음 알게 된 가족의 이야기가 있었다.','k2 r3',{once:1,w:.5,sc:'farewell'});
Y(8,70,'','*','밤하늘에 유성우가 쏟아졌다. 한 시간 동안 별똥별을 서른 개 넘게 세었다.','j3 C',{once:1,w:.5});
Y(10,80,'KE|TZ|UG|IN|NP|LK|BW|ZA|ZW|ZM|NA','*','들판에 코끼리 무리가 나타났다. 멀리서 숨죽이고 지켜보았다.','j3 C',{once:1,w:.6});
Y(30,90,'','*','우연히 들른 시골 장터에서 어린 시절 단짝 {bff}을(를) 수십 년 만에 다시 만났다.','r4 j4',{once:1,w:.5,sc:'friend'});
Y(25,42,'fam','*','쌍둥이를 가졌다는 소식을 들었다.',[['두 배로 기뻐한다','j4 r2','두 배로 바빠질 앞날을 그려 보았다.'],['걱정부터 앞선다','j1 D','살림을 다시 계산해 보았다.']],{once:1,w:.15,sc:'baby',run:'twins'});
Y(25,80,'t3','*','지역 신문에 내가 쓴 글이 실렸다. 오려서 냉장고에 붙여 두었다.','j3 k2',{once:1,w:.4});
Y(19,80,'','*','길에서 쓰러진 사람에게 심폐소생술을 했다. 구급차가 올 때까지 멈추지 않았다.','K B r3',{once:1,w:.2,sc:'hosp'});
Y(30,90,'','*','이웃 할머니께 스마트폰 사용법을 가르쳐 드렸다. 손주와 처음 영상 통화가 되자 눈물을 보이셨다.','K r3',{once:1,w:.5});
Y(20,85,'','*','다른 나라에서 온 사람들과 한 달 동안 함께 지내며 일했다. 서로의 나라 요리를 해 먹었다.','k3 r3 C',{once:1,w:.4,sc:'travel'});

// ── 세계의 일 (같은 해에 태어난 사람 모두가 함께 겪는 가상의 미래 사건)
Y(5,90,'yr:2033','*','세계 경기가 크게 가라앉았다. 뉴스마다 일자리가 줄어든다는 소식이었다.','j-2',{w:40,sc:'money',nt:'(이 게임 속 가상의 미래) 실제로 지난 60년 동안 선진국 경제는 대략 10년에 한 번꼴로 침체를 겪었습니다 (IMF)'});
Y(5,90,'yr:2041','*','새로운 감염병이 세계로 퍼졌다. 몇 달 동안 학교와 일터가 문을 닫고 사람들이 집에 머물렀다.','j-3 h-1 r-1',{w:40,sc:'sick',nt:'(이 게임 속 가상의 미래) 실제로 2020년 코로나19 때 한때 16억 명 넘는 학생이 학교에 가지 못했습니다 (UNESCO)'});
Y(10,90,'yr:2048','*','기계가 사람 대신 하는 일이 크게 늘었다. 많은 사람이 새 일을 배우러 다시 학교에 갔다.','k2 j-1',{w:40,sc:'job',nt:'(이 게임 속 가상의 미래)'});
Y(10,90,'yr:2055','*','기록적인 더위가 지구 곳곳을 덮친 해였다. 바닷가 마을들이 높은 둑을 쌓기 시작했다.','h-1 j-1',{w:40,sc:'heat',nt:'(이 게임 속 가상의 미래) 실제로 2024년은 관측 이래 가장 더운 해였습니다 (WMO)'});

// ── 나라마다의 삶
// 인도
Y(6,80,'IN','*','기차 침대칸을 타고 이틀 동안 달려 친척 집에 갔다. 역마다 짜이를 파는 소리가 들렸다.','j3 r2',{cd:4,sc:'travel'});
Y(8,80,'IN','[3,4,5]','동네 공터에서 크리켓 시합이 열렸다. 해가 질 때까지 공을 던졌다.','h2 j3 r2',{cd:2,sc:'sport'});
Y(10,80,'IN','*','사촌의 결혼식이 사흘 동안 이어졌다. 손에 헤나 무늬를 그리고 밤새 춤을 췄다.','j4 r3',{cd:3,sc:'wedding'});
Y(5,80,'IN','[6,7,8]','몬순 비가 쏟아졌다. 골목이 무릎까지 잠겨 바지를 걷고 다녔다.','j-1',{cd:2,sc:'flood'});
Y(12,80,'IN U','*','가족과 극장에서 세 시간짜리 볼리우드 영화를 보았다. 중간 휴식 시간에 사모사를 먹었다.','j3 r2',{cd:3,sc:'stage'});
Y(8,80,'IN','*','길 한가운데 소가 누워 있어 오토릭샤가 한참 멈춰 섰다.','j1',{once:1,sc:'travel'});
Y(19,80,'IN','*','시장 노점에서도 휴대폰 QR 코드로 돈을 냈다. 할머니는 아직도 신기해하셨다.','k1',{once:1,sc:'money',nt:'인도의 휴대폰 즉시 결제(UPI)는 2024년 한 해 거래가 1,300억 건을 넘었습니다 (인도결제공사 NPCI)'});
Y(5,40,'IN U','[11,12,1]','겨울 스모그가 도시를 뒤덮었다. 학교가 며칠 문을 닫았다.','h-2',{cd:3,sc:'cold',nt:'세계 인구의 99%가 WHO 권고 기준보다 나쁜 공기를 마시며 삽니다 (WHO 2022)'});
Y(14,30,'IN','*','명절에 친척 어른들이 결혼 상대 이야기를 꺼냈다.',[['아직은 공부(일)가 먼저라고 말한다','B','공부를 먼저 하겠다고 말씀드렸다.'],['어른들 뜻을 듣는다','r2','조용히 들었다.']],{once:1,sc:'wedding'});
Y(25,80,'IN','*','조리용 가스 실린더가 떨어져 배달을 기다리며 이웃집 불을 빌렸다.','r2',{once:1});
// 중국
Y(6,80,'CN','[1,2]','춘절 귀성 기차표를 구하느라 온 가족이 휴대폰 앞에 매달렸다. 스무 시간 넘게 기차를 타고 고향에 갔다.','r3 j1',{cd:2,sc:'travel',nt:'춘절 무렵 40일 동안 중국에서는 연인원 90억 회 넘는 이동이 일어납니다 (중국 교통운수부 2024)'});
Y(3,80,'CN','[1,2]','춘절에 어른들이 빨간 봉투(홍바오)에 세뱃돈을 넣어 주셨다. 요즘은 휴대폰으로도 보낸다.','j3 r2',{cd:2,sc:'fest'});
Y(55,90,'CN','*','저녁마다 광장에서 이웃들과 음악에 맞춰 춤(광장무)을 춘다.','h3 r3 j2',{once:1,sc:'friend'});
Y(22,45,'CN U','*','아침 아홉 시부터 밤 아홉 시까지, 일주일에 엿새 일하는 날이 이어졌다.',[['버틴다','D h-3','버텼다. 보너스가 나왔다.','@1'],['일을 줄이자고 말한다','B','팀장과 이야기해 근무를 조금 줄였다.']],{once:1,sc:'job'});
Y(19,80,'CN','11','11월 11일 쇼핑 축제 날, 장바구니에 담아 둔 물건이 반값이 되었다.','j2 @-1',{cd:3,sc:'money'});
Y(19,80,'CN','*','시속 300킬로미터 고속철을 타고 출장을 갔다. 창밖 풍경이 그림처럼 흘러갔다.','j2',{once:1,sc:'travel'});
Y(25,45,'CN kb','*','아이를 시골의 할머니·할아버지께 맡기고 도시에서 일했다. 영상 통화로 아이 얼굴을 보았다.','j-3 @1',{once:1,w:.6});
Y(5,30,'CN U','*','공유 자전거를 타고 동네를 한 바퀴 돌았다.','h2',{once:1});
// 나이지리아
Y(3,80,'NG','*','몇 시간째 전기가 나가 발전기를 돌렸다. 기름값이 걱정이었다.','j-1 @-1',{cd:2,nt:'나이지리아 사람 열에 넷가량은 전기를 쓰지 못합니다 (세계은행·IEA SDG7 보고서)'});
Y(10,70,'NG U','*','오카다(오토바이 택시) 뒷자리에 타고 꽉 막힌 길을 비집고 지나갔다.','j1',{once:1,sc:'travel'});
Y(10,80,'NG','*','결혼식에 온 가족이 같은 천으로 맞춘 옷(아소에비)을 입고 갔다.','j3 r3',{cd:3,sc:'wedding'});
Y(20,26,'NG u','*','대학 교수들의 파업으로 몇 달 동안 수업이 멈췄다. 졸업이 한 해 늦어질지도 모른다.','j-3',{once:1,sc:'school',nt:'나이지리아 대학 교수 노조의 파업은 2022년에 8개월 동안 이어졌습니다'});
Y(22,45,'NG','*','친구들이 하나둘 외국으로 떠난다. 나도 떠나야 할까?',[['남아서 여기서 길을 찾는다','r2 D','남기로 했다.'],['외국 일자리를 알아본다','C B','외국 일자리와 비자를 알아보기 시작했다.']],{once:1,sc:'travel'});
Y(10,80,'NG','*','동네 졸로프 라이스 요리 대결에서 엄마의 냄비가 제일 먼저 비었다.','j3 r2',{once:1});
Y(19,80,'NG','*','기름값이 갑자기 두 배로 올라 버스 요금도 따라 올랐다.','j-2 @-1',{once:1,sc:'money'});
// 파키스탄
Y(5,80,'PK','*','하루에 몇 시간씩 정해 놓고 전기가 끊기는 날이 이어졌다(로드셰딩).','j-1',{cd:3});
Y(8,80,'PK','*','파키스탄과 인도의 크리켓 경기가 열리는 날, 거리가 텅 비었다. 모두 텔레비전 앞에 모였다.','j3 r2',{cd:3,sc:'sport'});
Y(5,80,'PK','*','이드를 앞두고 아빠와 가축 시장에 가서 양을 골랐다.','j3 r2',{cd:3});
Y(5,80,'PK hz:flood','[7,8]','큰 홍수로 마을이 물에 잠겼다. 학교 건물이 임시 대피소가 되었다.','j-4 h-2',{cd:6,sc:'flood',nt:'2022년 파키스탄 홍수로 약 3,300만 명이 피해를 입었습니다 (UN)'});
Y(10,80,'PK','*','화려한 그림으로 꾸민 트럭들이 줄지어 지나갔다. 그림 속 새와 꽃을 하나하나 세어 보았다.','j1 C',{once:1});
// 인도네시아
Y(5,80,'ID','*','르바란을 앞두고 온 가족이 고향으로 귀성(무딕)을 떠났다. 배와 버스를 갈아타며 하루를 꼬박 갔다.','r3 j2',{cd:2,sc:'travel'});
Y(15,70,'ID U','*','앱으로 부른 오토바이 택시(오젝)를 타고 학교(일터)에 갔다.','j1',{once:1,sc:'travel'});
Y(6,80,'ID hz:quake','*','학교에서 지진·쓰나미 대피 훈련을 했다. 높은 곳으로 달리는 길을 외웠다.','k2',{cd:4,sc:'school'});
Y(10,80,'ID','*','금요일마다 바틱 무늬 옷을 입고 학교(일터)에 간다.','j1',{once:1});
Y(5,80,'ID','*','동네 와룽(작은 식당)에서 나시고렝을 먹었다. 주인아주머니가 한 숟갈 더 얹어 주셨다.','j2 r1',{once:1});
Y(5,80,'ID hz:volcano','*','화산재가 날려 비행기가 뜨지 못했다. 마당에 잿빛 가루가 쌓였다.','h-1',{once:1,sc:'volcano'});
// 콩고민주공화국
Y(6,80,'CD','*','콩고강을 따라 큰 배를 타고 며칠 동안 갔다. 배 위에 시장이 열렸다.','j2 k2',{once:1,sc:'sea'});
Y(5,80,'CD','*','라디오에서 콩고 룸바가 흘러나오자 온 가족이 일어나 춤을 췄다.','j3 r2',{cd:3,sc:'stage'});
Y(10,40,'CD','*','동네 형들이 광산에서 일하러 떠났다. 나도 따라갈까 하는 생각이 들었다.',[['학교(지금 일)에 남는다','k1 D','남기로 했다.'],['따라간다','h-4 @1','광산에서 몇 달 일했다. 기침이 오래 갔다.']],{once:1,sc:'job',nt:'콩고민주공화국은 전 세계 코발트의 약 70%를 생산합니다 (미국 지질조사국 2024)'});
Y(5,80,'CD','*','우기에 도로가 진흙탕이 되어 트럭이 며칠씩 멈춰 섰다. 시장의 물건값이 올랐다.','j-1',{cd:3});
// 에티오피아
Y(5,80,'ET','*','엄마가 커피콩을 볶아 커피 세레모니(분나)를 열었다. 이웃이 모여 세 잔을 다 마셨다.','r3 j2',{cd:2});
Y(6,80,'ET','9','9월 에티오피아 새해(엔쿠타타시)가 왔다. 들판에 노란 꽃이 가득 피었다.','j3',{cd:2,sc:'fest',nt:'에티오피아 달력은 열세 달이고, 그레고리력보다 7~8년 늦게 셉니다'});
Y(8,40,'ET','*','이른 아침 고원의 흙길을 친구들과 달렸다. 언젠가 마라톤 선수가 되고 싶다.','h4 j2 D',{once:1,sc:'sport'});
Y(5,80,'ET','*','엄마가 구운 인제라를 가족이 한 쟁반에 둘러앉아 손으로 나눠 먹었다.','r2 j2',{once:1});
// 미국
Y(6,80,'US','*','가족과 며칠 동안 차를 몰고 몇 개 주를 지나는 여행을 했다. 휴게소마다 다른 간식을 샀다.','j4 r2',{cd:4,sc:'travel'});
Y(6,18,'US','10','핼러윈 밤, 직접 만든 옷을 입고 이웃집을 돌며 사탕을 받았다.','j3 r1',{cd:2,sc:'fest'});
Y(10,80,'US','2','슈퍼볼 경기가 있는 날, 친구 집에 모여 피자를 먹으며 응원했다.','j3 r2',{cd:2,sc:'sport'});
Y(20,80,'US','*','병원비 청구서를 받고 깜짝 놀랐다. 보험이 다 내 주지 않았다.','j-3 @-2',{once:1,sc:'money'});
Y(22,40,'US','*','다달이 학자금 대출을 갚는다. 다 갚으려면 아직 십 년이 남았다.','j-2 @-1',{once:1,sc:'money'});
Y(5,80,'US','[4,5]','토네이도 경보가 울려 가족이 지하실로 내려가 기다렸다.','j-2',{cd:4,sc:'storm'});
Y(19,40,'US','*','일 때문에 다른 주로 이사를 했다. 짐을 트럭 한 대에 다 실었다.','k1 r-2',{once:1,sc:'house'});
// 방글라데시
Y(5,80,'BD','*','사이클론 경보가 울려 마을 대피소로 갔다. 다음 날 돌아오니 지붕이 날아가 있었다.','j-3 @-1',{cd:4,sc:'storm',nt:'방글라데시의 사이클론 대피소와 조기 경보 덕분에 사이클론 사망자는 1970년 이후 크게 줄었습니다'});
Y(6,80,'BD','*','우기에는 배를 타고 학교(장터)에 간다.','j1',{cd:3,sc:'sea'});
Y(16,40,'BD U','*','의류 공장에서 일을 시작했다. 내가 만든 셔츠가 먼 나라로 간다고 한다.','k1 @1',{once:1,sc:'job',nt:'방글라데시는 세계에서 손꼽히는 의류 수출국이고, 수출의 80% 이상이 옷입니다'});
Y(5,80,'BD','4','벵골 새해(포헬라 보이샤크)에 빨간색·흰색 옷을 입고 거리 행진에 나갔다.','j3 r2',{cd:2,sc:'fest'});
Y(10,70,'BD U','*','다카의 꽉 막힌 길을 사이클 릭샤를 타고 지나갔다. 종소리가 쉴 새 없이 울렸다.','j1',{once:1,sc:'travel'});
// 브라질
Y(5,80,'BR','2','카니발이다. 동네 거리 행렬(블로코)을 따라 밤새 삼바를 추었다.','j4 r3',{cd:2,sc:'fest'});
Y(6,80,'BR','*','동네 공터에서 맨발로 축구를 했다. 언젠가 국가대표가 될 거라고 말했다.','h2 j3',{cd:2,sc:'sport'});
Y(10,80,'BR coast','*','주말에 해변에서 가족과 아사이를 먹으며 하루를 보냈다.','j3 r2',{cd:3,sc:'sea'});
Y(15,80,'BR U','*','버스에서 강도를 만났다. 다행히 다친 사람은 없었다.','j-4 @-1',{once:1,w:.6});
Y(5,80,'BR','12','성탄 전야에 온 가족이 모여 밤 열두 시까지 기다렸다가 함께 밥을 먹었다.','r3 j2',{cd:2,sc:'fest'});
// 이집트
Y(5,80,'EG','*','라마단 저녁마다 거리에 걸린 등불(파누스)이 반짝였다.','j2',{cd:2,sc:'fest'});
Y(8,80,'EG','*','가족과 나일강에서 작은 돛배(펠루카)를 탔다.','j3 r2',{once:1,sc:'sea'});
Y(8,80,'EG','*','학교에서 기자의 피라미드로 견학을 갔다. 생각보다 훨씬 거대했다.','k3 j3',{once:1,sc:'travel'});
Y(19,80,'EG','*','빵과 기름값이 한 해 사이 크게 올랐다.','j-2 @-1',{cd:4,sc:'money'});
// 탄자니아 · 케냐 · 우간다
Y(16,80,'TZ|KE|UG','*','휴대폰 송금(모바일 머니)으로 고향의 부모님께 돈을 보냈다. 몇 초면 도착한다.','r2',{once:1,sc:'money',nt:'케냐 성인의 대부분이 휴대폰 송금 서비스를 씁니다 (케냐 중앙은행)'});
Y(10,70,'KE|TZ|UG','*','화려하게 꾸민 미니버스(마타투·달라달라)에 빽빽하게 끼어 탔다. 음악이 쿵쿵 울렸다.','j1',{once:1,sc:'travel'});
Y(8,40,'KE','*','고원의 아침 공기를 마시며 친구들과 달리기를 했다. 동네 형은 마라톤 대회에 나간다고 한다.','h4 D',{once:1,sc:'sport'});
Y(10,80,'TZ','*','멀리 킬리만자로의 눈 덮인 봉우리가 구름 사이로 보였다.','j2',{once:1});
// 필리핀
Y(5,80,'PH','*','지프니를 타고 학교(일터)에 갔다. 요금을 앞사람에게 건네며 운전석까지 전달했다.','j1 r1',{once:1,sc:'travel'});
Y(6,80,'PH','*','동네 농구 코트에서 해가 질 때까지 시합을 했다.','h2 j3',{cd:2,sc:'sport'});
Y(5,80,'PH','*','외국에서 일하는 친척(OFW)이 커다란 선물 상자(발릭바얀 박스)를 보내왔다.','j3 r2',{cd:3,nt:'필리핀은 해외 노동자가 보내는 송금이 GDP의 약 9%를 차지합니다 (필리핀 중앙은행)'});
Y(5,80,'PH','*','동네 피에스타 날, 집집마다 음식을 차려 놓고 지나가는 사람을 불러 먹였다.','j3 r3',{cd:2,sc:'fest'});
Y(10,80,'PH','*','가족 모임에서 노래방 기계로 밤늦게까지 노래를 불렀다.','j3 r2',{cd:2,sc:'stage'});
Y(5,80,'PH','9','9월부터 크리스마스 노래가 거리에 흘러나오기 시작했다.','j2',{cd:3,sc:'fest'});
// 멕시코
Y(3,80,'MX','11','죽은 자의 날, 제단에 금잔화와 할머니 사진을 올려 두고 가족이 모였다.','r3 j2',{cd:2,sc:'fest'});
Y(15,15,'MX f1','*','열다섯 살 생일에 킨세아녜라 잔치를 열었다. 드레스를 입고 아빠와 첫 춤을 추었다.','j5 r3',{once:1,sc:'wedding'});
Y(5,80,'MX U','*','지진 경보 사이렌이 울려 모두 건물 밖으로 나갔다.','j-1 k1',{cd:3,sc:'quake'});
Y(18,40,'MX','*','친척 몇 명이 일자리를 찾아 북쪽 국경을 넘어갔다.',[['나도 떠날 준비를 한다','B','국경 너머의 일자리를 알아보았다.'],['여기에 남는다','r2','고향에 남기로 했다.']],{once:1,sc:'travel'});
Y(5,80,'MX','*','길모퉁이 타코 노점에서 가족과 늦은 저녁을 먹었다.','j2 r2',{once:1});
// 베트남
Y(5,80,'VN','*','오토바이 한 대에 온 가족 넷이 타고 시장에 갔다.','j2 r1',{once:1,sc:'travel'});
Y(5,80,'VN','[8,9]','중추절 밤, 별 모양 등불을 들고 골목을 돌았다. 월병을 나눠 먹었다.','j3 r2',{cd:2,sc:'fest'});
Y(5,80,'VN','*','아침마다 길가의 작은 의자에 앉아 쌀국수를 먹는다.','j2',{once:1});
// 러시아 · 동유럽
Y(5,80,'RU|UA|BY','[6,7,8]','여름 내내 시골 다차(별장 텃밭)에서 감자를 캐고 강에서 수영했다.','h2 j3 r2',{cd:2,sc:'garden'});
Y(6,80,'RU','5','5월 9일, 할아버지 사진을 들고 거리 행진에 함께 나섰다.','r2',{cd:3,sc:'fest'});
Y(10,80,'RU|FI|EE','[1,2]','친구들과 바냐(사우나)에서 몸을 데운 뒤 눈밭에 뛰어들었다.','h2 j3',{cd:3,sc:'cold'});
// 일본
Y(6,80,'JP','9','9월 1일 방재의 날, 학교에서 지진 대피 훈련을 했다. 방석 같은 두건을 머리에 썼다.','k1',{cd:3,sc:'school'});
Y(20,20,'JP','1','성인식 날, 정장(기모노)을 입고 동창들과 다시 만났다.','j4 r3',{once:1,sc:'fest'});
Y(5,80,'JP','8','오봉 연휴에 조부모님 댁에 가서 마을의 본오도리 춤을 추었다.','r3 j2',{cd:2,sc:'fest'});
Y(16,18,'JP','8','고시엔(고교 야구 대회)을 텔레비전으로 보며 우리 지역 학교를 응원했다.','j2',{cd:2,sc:'sport'});
Y(22,45,'JP','*','막차를 놓쳐 회사 근처에서 밤을 보냈다.','h-2 j-2',{once:1,sc:'job'});
// 한국
Y(8,80,'KR','11','온 가족이 모여 김장을 했다. 손이 빨갛게 얼었지만 막 버무린 김치에 수육을 싸 먹었다.','r3 j2',{cd:2,sc:'fest'});
Y(25,70,'KR U','*','윗집 발소리가 밤늦게까지 쿵쿵 울렸다.',[['쪽지를 정중하게 써 붙인다','D r1','다음 날 윗집에서 귤 한 봉지와 사과 쪽지가 왔다.'],['참는다','j-2','참았다. 잠을 설쳤다.']],{once:1,sc:'house'});
Y(5,80,'KR','[1,9]','명절 귀성길에 고속도로가 주차장처럼 막혔다. 휴게소 호두과자가 꿀맛이었다.','r2 j1',{cd:3,sc:'travel'});
Y(10,80,'KR','*','여름밤, 동네 치킨집에서 가족과 축구 국가대표 경기를 보며 소리를 질렀다.','j3 r2',{cd:3,sc:'sport'});
// 튀르키예 · 이란 · 중동
Y(5,80,'TR','*','하루에도 몇 번씩 작은 유리잔에 차이를 마신다. 손님이 오면 늘 차부터 낸다.','r2',{once:1});
Y(5,80,'IR|AF|TJ|AZ|TR|IQ','3','노루즈(봄 새해)를 맞아 식탁에 일곱 가지 상징물(하프트 신)을 차리고 친척 집을 돌았다.','j3 r3',{cd:2,sc:'fest'});
Y(19,80,'IR','*','물가가 한 해 사이 크게 올라 장바구니가 가벼워졌다.','j-2 @-1',{cd:4,sc:'money'});
Y(6,40,'AF','[3,4]','언덕 위에서 연날리기 시합을 했다. 친구의 연줄을 끊었다.','j3 h1',{cd:2,sc:'play'});
Y(5,80,'SA|AE|QA|KW|OM|BH','*','한낮 기온이 50도 가까이 오르자 사람들이 해가 진 뒤에야 쇼핑몰과 공원으로 나왔다.','j1',{cd:3,sc:'heat'});
// 유럽
Y(5,80,'DE|AT|CZ','12','크리스마스 마켓에서 따뜻한 음료를 마시며 회전목마를 탔다.','j3 r2',{cd:2,sc:'fest'});
Y(5,80,'FR|IT|ES','8','8월 한 달 동안 가족이 바닷가로 긴 휴가를 떠났다. 도시가 텅 비었다.','j4 r2',{cd:2,sc:'sea'});
Y(15,80,'GB|IE','*','동네 펍의 퀴즈 대회에 친구들과 팀을 짜서 나갔다.','r3 j2',{cd:3,sc:'friend'});
Y(16,30,'DE|AT|CH','*','학교와 회사를 오가며 기술을 배우는 직업 훈련(아우스빌둥)을 시작했다.','k3 @1',{once:1,w:.6,sc:'job'});
Y(18,80,'NL|DK','*','비가 와도 자전거를 타고 출근(등교)한다. 자전거 도로가 자동차 길보다 넓다.','h2',{once:1,sc:'travel'});
// 남아프리카 · 남부 아프리카
Y(5,80,'ZA','*','계획 정전(로드셰딩) 시간표를 보고 그 전에 밥을 지었다.','j-1',{cd:2});
Y(5,80,'ZA','9','유산의 날, 이웃들이 모여 고기를 굽는 브라이를 열었다.','j3 r3',{cd:2,sc:'fest'});
// 서아프리카 (사헬)
Y(5,80,'NE|ML|BF|TD|SN|MR','*','모래바람(하르마탄)이 불어 하늘이 누렇게 변했다. 천으로 입과 코를 가렸다.','h-1',{cd:2,sc:'drought'});
Y(5,80,'NE|ML|BF|TD|SN|GN','*','타바스키(희생제) 날, 새 옷을 입고 이웃에게 고기를 나눠 주었다.','j3 r3',{cd:2,sc:'fest'});
// 라틴아메리카
Y(5,80,'rg:LA','*','동네 성당 축일에 거리 행진과 불꽃놀이가 밤늦게까지 이어졌다.','j3 r2',{cd:3,sc:'fest'});
Y(8,80,'rg:LA','*','온 동네가 모여 축구 국가대표 경기를 보았다. 골이 들어가자 냄비를 두드렸다.','j3 r2',{cd:3,sc:'sport'});
Y(15,40,'rg:LA','*','물가가 너무 올라 월급날 바로 장을 봐 두었다.','j-1',{cd:4,sc:'money'});
// 태평양 섬나라
Y(5,80,'rg:OC !AU !NZ','*','해수면이 높아져 바닷물이 밭까지 들어왔다. 어른들이 마을을 옮길지 의논했다.','j-2',{cd:5,sc:'sea',nt:'태평양 섬나라들은 해수면 상승에 가장 먼저 영향을 받는 곳 가운데 하나입니다 (IPCC)'});
Y(5,80,'AU|NZ','12','크리스마스에 해변에서 바비큐를 했다. 한여름의 성탄절이다.','j3 r2',{cd:2,sc:'sea'});
// 동남아시아
Y(5,80,'TH|MM|LA|KH','4','물 축제(송끄란) 날, 거리에서 모르는 사람과도 물을 뿌리며 웃었다.','j4 r2',{cd:2,sc:'fest'});
Y(5,80,'MY|SG|BN','*','이웃의 명절마다 서로 집을 열어 손님을 맞는 ‘오픈 하우스’에 다녀왔다.','r3 j2',{cd:3,sc:'fest'});
// 중앙아시아
Y(5,80,'KZ|KG|UZ|TJ|TM|MN','*','넓은 초원에서 말을 타고 달렸다. 바람이 얼굴을 세게 때렸다.','h2 j3',{cd:3});
Y(19,45,'UZ|TJ|KG','*','일자리를 찾아 러시아로 떠나는 기차에 올랐다.',[['떠난다','B @2 r-2','몇 해 동안 러시아 공사장에서 일하며 집에 돈을 보냈다.'],['남는다','r2','고향에 남았다.']],{once:1,w:.7,sc:'travel'});
// ── 취미: 한번 시작하면 해마다 조금씩 늘고, 사람도 만나게 된다
Y(7,40,'','*','시간이 날 때 무엇을 해 볼까?',[['{hobA}','j2 C','{hobA}을(를) 시작했다. 생각보다 재미있다.'],['{hobB}','j2 h1','{hobB}을(를) 시작했다. 주말이 기다려졌다.'],['{hobC}','j2 r1','{hobC}을(를) 시작했다. 같이 하는 친구가 생겼다.']],{once:1,w:3,run:'hobPick'});
Y(8,95,'hob','*','{hob} 실력이 조금 늘었다.','j2',{cd:2,w:2,run:'hobUp'});
Y(10,90,'hob','*','{hob} 모임에서 오래 갈 친구를 사귀었다.','r4 j2',{once:1,sc:'friend'});
Y(10,80,'hob','*','동네 {hob} 대회(발표회)에 나가 볼까?',[['나간다','B j2','떨렸지만 끝까지 해냈다.'],['구경만 한다','j1','다른 사람들의 실력을 구경했다.']],{cd:5,run:'hobShow'});
Y(30,90,'hob','*','{hob}을(를) 하는 동안은 걱정이 다 사라졌다. 이 시간이 있어 버틸 수 있었다.','j3 h1',{cd:6});
// ── 배우자와 함께 사는 날들
Y(22,80,'fam','*','{spouse}와(과) 오랜만에 둘이서 동네를 천천히 걸었다. 별말 없이도 좋았다.','r3 j2',{cd:3,sc:'friend'});
Y(22,70,'fam','*','{spouse}이(가) 다니던 일자리를 잃었다.',[['내가 더 일해 버틴다','D h-2','한동안 일을 더 맡아 살림을 버텼다.','@1'],['함께 새 일을 찾는다','K r3','함께 구인 공고를 뒤졌다. 몇 달 뒤 새 일을 찾았다.']],{once:1,w:.7,sc:'jobloss'});
Y(22,70,'fam','*','{spouse}이(가) 내 취미에 재미를 붙여 둘이 함께하는 날이 늘었다.','r3 j3',{once:1,w:.6});
Y(22,60,'fam','*','{spouse}의 생일에 깜짝 상을 차렸다.','r3 j2',{cd:4});
Y(22,45,'fam rg:SA|ME','*','결혼한 뒤 몇 해 동안 시부모님(대가족)과 한집에 살았다.',[['어른들께 맞춰 지낸다','r3 j-1','어른들께 살림을 배우며 지냈다.'],['우리 식구끼리 따로 나가 살자고 한다','B j2 r-1','몇 해 뒤 우리 식구끼리 살림을 차렸다.']],{once:1,sc:'house'});
Y(22,70,'fam t2','*','집안의 땅에 {spouse}와(과) 함께 우리 집을 짓기 시작했다. 친척들이 일손을 보탰다.','r3 j3 @-2',{once:1,w:.6,sc:'house'});
Y(30,85,'fam','*','{spouse}이(가) 크게 아파 몇 주 동안 병원에 있었다. 밤마다 곁을 지켰다.','r4 j-3 @-1',{once:1,w:.6,sc:'hosp'});
Y(45,90,'fam','*','{spouse}와(과) 젊은 날 처음 만났던 곳에 다시 가 보았다.','r3 j3',{once:1,w:.6});
// ── 아이를 키우는 날들 (아이 이름과 나이에 맞춰)
Y(19,60,'kb','*','{kn}이(가) 처음으로 “엄마(아빠)”라고 불렀다. 그날 하루 종일 웃음이 났다.','j5 r3',{once:1,sc:'baby'});
Y(19,60,'kb','*','{kn}이(가) 밤새 열이 나 응급실에 다녀왔다. 새벽에야 열이 내렸다.','h-1 r2 @-1',{once:1,sc:'hosp'});
Y(19,60,'kp','*','{kn}이(가) 그려 준 가족 그림을 벽에 붙였다. 모두 활짝 웃고 있었다.','j4 r3',{once:1});
Y(19,60,'kp','*','{kn}이(가) 잠들기 전에 “사랑해”라고 속삭였다.','j5 r3',{once:1});
Y(19,60,'kp|ke','*','{kn}을(를) 데리고 장날(놀이공원) 구경을 갔다. 솜사탕 하나에 세상을 다 가진 얼굴이었다.','j3 r3 @-1',{cd:3});
Y(19,60,'ke','*','{kn}이(가) 학교에서 크게 혼나고 왔다.',[['먼저 이야기를 들어 준다','K r3','이야기를 들어 보니 친구를 감싸 주다 생긴 일이었다.'],['따끔하게 꾸짖는다','D r-1','따끔하게 꾸짖었다. {kn}이(가) 한동안 말이 없었다.']],{cd:4,sc:'school'});
Y(19,60,'ke|km','*','{kn}이(가) 학원(과외)을 그만두고 싶다고 한다.',[['원하는 대로 해 준다','K j1','그 시간에 {kn}은(는) 그림을 그리기 시작했다.'],['조금만 더 해 보자고 한다','D','조금 더 다니기로 했다.']],{once:1,sc:'school'});
Y(19,65,'km|kh','*','{kn}이(가) 친구 문제로 며칠째 방에서 나오지 않는다.',[['문 앞에 좋아하는 간식을 두고 기다린다','K r3','사흘째 되던 밤, {kn}이(가) 먼저 말을 걸어왔다.'],['억지로 문을 열고 이야기한다','B r-2','이야기는 했지만 서로 상처가 남았다.']],{once:1});
Y(19,70,'kh','*','{kn}이(가) 원하는 진로가 내 생각과 다르다.',[['아이의 꿈을 믿어 준다','K r4','{kn}이(가) 고맙다며 울었다.'],['안정적인 길을 권한다','D r-2','{kn}은(는) 내 말을 따랐지만 한동안 말수가 줄었다.']],{once:1,sc:'school'});
Y(19,70,'ku','*','{kn}이(가) 첫 월급으로 부모님 선물을 사 왔다.','j5 r3',{once:1});
Y(40,90,'ka','*','{kn}이(가) 손주를 데리고 왔다. 집 안이 오랜만에 시끌벅적했다.','j5 r3',{cd:3,sc:'baby'});
Y(45,90,'ka','*','{kn}이(가) 일하는 도시로 이사를 가게 되었다. 공항(터미널)까지 배웅했다.','j-2 r1',{once:1,sc:'travel'});
/* 결혼 갈림길 몇 해 전부터: 처음 만나고, 사귀고, 다투고, 가족에게 인사하기 (결혼할 때 같은 사람) */
Y(18,60,'crt !fl:met','*','친구의 소개로 {lover}을(를) 처음 만났다. 이야기가 끊이지 않아 시간 가는 줄 몰랐다.',[['다음에 또 보자고 먼저 연락한다','B r2','{lover}와(과) 주말마다 만나게 되었다.'],['천천히 알아 가기로 한다','K r1','몇 달 동안 천천히 서로를 알아 갔다.']],{once:1,k:'court',set:['met','met'],sc:'friend'});
Y(18,60,'crt fl:met !fl:dating','*','{lover}와(과) 처음으로 둘이서 하루를 보냈다. 헤어지기가 아쉬웠다.',[['마음을 털어놓는다','B j2','{lover}도 같은 마음이었다. 우리는 사귀기 시작했다.'],['좋은 친구로 지내자고 한다','K','한동안 친구처럼 지냈지만, 결국 서로의 마음을 알게 되었다.']],{once:1,k:'court',set:['dating','dating'],sc:'friend'});
Y(18,60,'crt fl:dating','*','{lover}와(과) 사소한 일로 크게 다퉜다. 며칠째 연락이 없다.',[['먼저 연락해 사과한다','K r2','먼저 사과했다. 다투고 나서 오히려 더 가까워졌다.'],['상대가 먼저 연락하길 기다린다','j-1','일주일 뒤에야 겨우 화해했다.']],{once:1,k:'court',sc:'friend'});
Y(18,60,'crt fl:dating','*','{lover}이(가) 가족에게 나를 소개하고 싶다고 한다.',[['떨리지만 인사드리러 간다','r3 B','{lover}의 가족과 저녁을 먹었다. 생각보다 따뜻한 사람들이었다.'],['조금 더 시간을 갖자고 한다','D','아직은 이르다며 다음으로 미뤘다.']],{once:1,k:'court',sc:'friend'});
/* 노년: 가족과 함께 보내는 시간 */
Y(60,95,'ka','*','{kn}이(가) 주말에 혼자 집에 들렀다. 오랜만에 둘이 마주 앉았다.',[['젊은 날 이야기를 들려준다','r2 j2','처음 듣는 이야기라며 {kn}이(가) 눈을 반짝였다.'],['요즘 사는 이야기를 묻는다','K r2','{kn}의 고민을 끝까지 들어 주었다. 돌아가는 뒷모습이 한결 가벼워 보였다.']],{cd:4,w:2,sc:'friend'});
Y(62,95,'gk','*','손주가 놀러 와서 같이 동네를 걷자고 조른다.',[['손을 잡고 천천히 걷는다','r3 j2','손주와 동네 가게에서 아이스크림을 하나씩 사 먹었다.'],['집에서 옛날 놀이를 가르쳐 준다','r2 C','처음 해 보는 놀이에 손주가 깔깔 웃었다.']],{cd:3,w:2,sc:'friend'});
Y(62,95,'gk','*','손주에게 {food} 만드는 법을 가르쳐 주었다. 온 부엌이 엉망이 됐지만 둘 다 웃었다.','r3 j3',{cd:5,w:2,sc:'life'});
Y(60,95,'kid','*','생일에 흩어져 살던 가족이 모두 모였다. 다 같이 케이크의 촛불을 불었다.','r3 j4',{cd:4,w:2,sc:'fest'});
Y(60,92,'kid','*','자녀들이 다 같이 가족 여행을 가자고 한다.',[['무릎이 아파도 따라나선다','r3 j3 h-1','오랜만에 온 가족이 한 지붕 아래에서 잤다. 사진을 백 장도 넘게 찍었다.'],['집에서 맛있는 것을 해 놓고 기다린다','r2 j1','여행에서 돌아온 가족에게 따뜻한 밥을 차려 주었다.']],{cd:6,w:2,sc:'travel'});
Y(60,90,'fam','*','{spouse}와(과) 젊을 때 자주 가던 곳에 다시 가 보았다.',[['그때 이야기를 하며 걷는다','r3 j3','걸음은 느려졌지만 이야기는 끝이 없었다.'],['조용히 손을 잡고 앉아 있는다','r2 G','말없이 앉아 있어도 마음이 편했다.']],{cd:5,w:2,sc:'travel'});
Y(60,95,'kid','*','온 가족이 사진관에 가서 가족사진을 찍었다. 의자 한가운데에 앉으니 쑥스러웠다.','r2 j3',{cd:8,sc:'life'});
Y(65,95,'ka','*','상자를 정리하다 {kn}이(가) 어릴 때 그린 그림을 찾았다. 한참을 들여다보았다.','j2 r1',{cd:8,sc:'life'});
// ── 나이 들어 감
Y(27,45,'','*','거울 속에서 첫 흰머리를 발견했다.','j-1',{once:1});
Y(40,60,'','*','계단을 오르다 숨이 차 잠깐 쉬었다. 예전 같지 않다는 생각이 들었다.','h-1',{once:1});
Y(50,80,'','*','어린 시절 살던 동네에 가 보았다. 다니던 학교 자리에 큰 건물이 서 있었다.','j1 r1',{once:1,w:.7});
Y(60,95,'','*','손때 묻은 앨범을 넘기며 아이들(조카들)에게 옛날이야기를 들려주었다.','r3 j2',{cd:6});
Y(70,95,'','*','기억이 깜빡깜빡한다. 안경을 쓴 채로 안경을 찾았다.','j-1',{once:1});
// ── 살림과 물건
Y(20,60,'w t3','*','자동차를 살까?',[['할부로 산다','j3 @-4','차를 샀다. 출퇴근 시간이 크게 줄었다.'],['대중교통으로 버틴다','D @1','버스와 지하철로 다니며 돈을 모았다.']],{once:1,w:.8,sc:'travel'});
Y(20,60,'w t2','*','오토바이를 한 대 장만할까?',[['돈을 모아 산다','j3 @-2','오토바이를 샀다. 장에 가기도, 일하러 가기도 한결 쉬워졌다.'],['걸어 다닌다','h2','계속 걸어 다녔다.']],{once:1,w:.8,sc:'travel'});
Y(15,40,'t2|t3','*','처음으로 내 돈으로 휴대폰(컴퓨터)을 샀다.','j3 k1 @-1',{once:1,w:.8});
Y(25,70,'','*','친척 장례식에 부조금을 냈다.','r2 @-1',{cd:4,sc:'farewell'});
Y(25,70,'rent','*','집세가 올라 생활비가 빠듯해졌다.','j-2 @-1',{cd:4,sc:'money'});
Y(25,80,'','*','마을(동네) 모임에서 어려운 이웃을 돌보는 일을 맡게 되었다.','r4 K',{once:1,w:.7});
// ── 반려동물: 함께 자라고, 먼저 떠난다
Y(6,70,'t3|U','*','동물 보호소에서 눈이 마주친 {petSp}을(를) 데려올까?',[['데려와 “{petN}”라고 이름 짓는다','j4 K','{petN}이(가) 우리 가족이 되었다.'],['아직은 돌볼 자신이 없다','D','다음에 꼭 오겠다고 약속했다.']],{once:1,w:1.5,sc:'pet',run:'petGet'});
Y(7,95,'pet','*','{pet}이(가) 내가 집에 오면 꼬리를 흔들며(골골거리며) 맞아 준다. 하루의 피로가 풀렸다.','j3',{cd:3,sc:'pet'});
Y(7,95,'pet','*','{pet}이(가) 아파 동물병원에 다녀왔다.','j-2 @-1',{cd:5,sc:'pet'});
Y(7,95,'petOld','*','{pet}이(가) {petAge}살로 무지개다리를 건넜다. 늘 앉던 창가 자리가 오래 비어 있었다.','j-6',{w:20,sc:'pet',run:'petDie'});
// ── 다시 배우는 사람들
Y(20,60,'noedu','*','어릴 때 다니지 못한 학교 공부를 다시 해 볼까?',[['야간 학교에 다닌다','k5 D j2','일을 마치고 밤마다 공부했다. 이제 신문을 읽을 수 있다.'],['지금 일에 집중한다','','지금 하는 일에 집중했다.']],{once:1,w:1.2,sc:'school'});
Y(19,60,'kp|ke','*','{kn}이(가) 다닐 학교를 정해야 한다.',[['가까운 공립학교에 보낸다','r1','집 가까운 학교에 보냈다. 동네 친구가 많이 생겼다.'],['돈이 들어도 사립학교에 보낸다','@-2 k1','사립학교에 보냈다. 학비 때문에 허리띠를 졸라맸다.']],{once:1,sc:'school'});
Y(19,60,'kb','*','일하는 동안 {kn}을(를) 누가 돌볼까?',[['할머니·할아버지께 부탁한다','r2','부모님이 손주를 맡아 주셨다.'],['어린이집(돌보미)에 맡긴다','@-1','어린이집에 맡기고 다시 일을 나갔다.'],['일을 쉬고 직접 키운다','r3 @-2','한동안 일을 쉬고 아이 곁에 있었다.']],{once:1,sc:'baby'});
Y(15,60,'','*','오랜 친구와 크게 다투고 한동안 연락을 끊었다.',[['먼저 연락해 사과한다','r3 K B','먼저 연락했다. 몇 달 만에 다시 웃으며 만났다.'],['시간이 지나길 기다린다','r-2','결국 몇 해 동안 연락이 끊겼다.']],{once:1,sc:'friend'});
Y(20,90,'gpdead|pardead','*','돌아가신 분의 기일에 가족이 모여 옛이야기를 나눴다.','r3 j1',{cd:3,sc:'farewell',nt:'사별을 겪은 사람 가운데 다수는 깊은 슬픔 속에서도 한두 해 사이에 일상을 되찾아 갑니다 (Bonanno 2004)'});

