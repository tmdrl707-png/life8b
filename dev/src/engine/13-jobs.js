/* ---------- [데이터] 직업과 월급 ----------
   mul 그 나라 보통 월급의 몇 배 · sd 같은 일이라도 사람마다 벌이가 다른 정도 · edu 필요한 학교(0 없음 · 1 초등 · 2 중·고등 · 3 대학)
   set 사는 곳(* · U 도시 · R 농촌) · diff 그 일을 얻기 쉬운 정도 · stat 잘되는 데 쓰이는 수치 · tr 도움이 되는 성향
   kind 일터의 모습(office 사무실 · factory 공장 · farm 농장 · shop 가게 · school 학교 · hosp 병원 · dream 작업실 · fish 항구 · herd 목장 · mine 광산 · tour 관광지 · part 이곳저곳) */
const JOBS={
  day:     {n:'날품팔이',            kind:'part',   mul:.45,sd:.25,edu:0,set:'*',diff:.95,stat:'h',tr:'D'},
  farm:    {n:'농부',                kind:'farm',   mul:.55,sd:.4, edu:0,set:'R',diff:.92,stat:'h',tr:'D'},
  builder: {n:'건설 노동자',          kind:'part',   mul:.8, sd:.2, edu:0,set:'*',diff:.85,stat:'h',tr:'D'},
  vendor:  {n:'시장 상인',            kind:'shop',   mul:.75,sd:.5, edu:0,set:'*',diff:.85,stat:'r',tr:'B'},
  driver:  {n:'운전기사',            kind:'part',   mul:.85,sd:.2, edu:1,set:'*',diff:.8, stat:'h',tr:'D'},
  factory: {n:'공장 노동자',          kind:'factory',mul:.85,sd:.15,edu:1,set:'U',diff:.78,stat:'h',tr:'D'},
  cook:    {n:'요리사',              kind:'shop',   mul:.95,sd:.35,edu:1,set:'*',diff:.7, stat:'k',tr:'C'},
  hair:    {n:'미용사',              kind:'shop',   mul:.9, sd:.35,edu:1,set:'U',diff:.7, stat:'r',tr:'K'},
  shopown: {n:'가게 주인',            kind:'shop',   mul:1.2,sd:.7, edu:1,set:'*',diff:.5, stat:'r',tr:'B'},
  office:  {n:'회사원',              kind:'office', mul:1.25,sd:.25,edu:2,set:'U',diff:.5, stat:'k',tr:'D'},
  police:  {n:'경찰관',              kind:'office', mul:1.15,sd:.1, edu:2,set:'*',diff:.5, stat:'h',tr:'B'},
  nurse:   {n:'간호사',              kind:'hosp',   mul:1.35,sd:.15,edu:3,set:'*',diff:.5, stat:'k',tr:'K'},
  teacher: {n:'교사',                kind:'school', mul:1.25,sd:.1, edu:3,set:'*',diff:.48,stat:'k',tr:'K'},
  civil:   {n:'공무원',              kind:'office', mul:1.3,sd:.1, edu:3,set:'*',diff:.38,stat:'k',tr:'D'},
  engineer:{n:'엔지니어',            kind:'office', mul:1.9,sd:.3, edu:3,set:'U',diff:.36,stat:'k',tr:'C'},
  doctor:  {n:'의사',                kind:'hosp',   mul:3.2,sd:.35,edu:3,set:'*',diff:.16,stat:'k',tr:'D'},
  artist:  {n:'예술가',              kind:'dream',  mul:.9, sd:1.0,edu:0,set:'*',diff:.3, stat:'j',tr:'C'},
  athlete: {n:'{sport} 선수',        kind:'dream',  mul:1.4,sd:1.3,edu:0,set:'*',diff:.14,stat:'h',tr:'B'},
  creator: {n:'영상 창작자',          kind:'dream',  mul:1.0,sd:1.2,edu:1,set:'U',diff:.25,stat:'j',tr:'C'},
  abroad:  {n:'다른 나라에서 일하는 노동자',kind:'part',mul:2.4,sd:.4,edu:0,set:'*',diff:.4,stat:'h',tr:'B',maxTier:3}
};
const WORKN={office:'회사',factory:'공장',farm:'농장',shop:'가게',school:'학교',hosp:'병원',dream:'작업실',fish:'항구',herd:'목장',mine:'광산',tour:'관광 안내소',part:'일터'};
// 그 나라 대표 일의 모습은 이름으로 짐작한다
function sigKind(w){
  if(/간호사/.test(w)) return 'hosp'; if(/선수/.test(w)) return 'dream';
  if(/어부|양식|잠수부/.test(w)) return 'fish'; if(/목동|양치기|가우초|목장|털 깎는/.test(w)) return 'herd';
  if(/광산|광부/.test(w)) return 'mine'; if(/안내인|리조트|승무원|강사|셰르파/.test(w)) return 'tour';
  if(/회사원|은행원|회사 직원|항공사/.test(w)) return 'office'; if(/공장|기술자/.test(w)) return 'factory';
  if(/장인|제빵사|요리사|상인/.test(w)) return 'shop'; if(/농부|농장|일꾼|채취꾼/.test(w)) return 'farm';
  return 'part';
}
const SIG_MUL={office:1.6,hosp:1.5,mine:1.05,factory:.95,tour:.95,shop:.9,fish:.7,farm:.62,herd:.55,part:.7,dream:1.5};
function jobInfo(L,id){
  if(!id) return null;
  if(id==='sig'){ const w=L.C.work, kind=sigKind(w), hi=/정보기술|첨단|금융|은행/.test(w);
    return {id,n:w,kind,mul:SIG_MUL[kind]*(hi?1.2:1),sd:kind==='dream'?1:.4,edu:hi?3:kind==='office'||kind==='hosp'?2:0,set:'*',diff:hi?.35:kind==='office'?.5:.72,stat:kind==='office'?'k':'h',tr:'D',sig:1}; }
  const j=JOBS[id]; return j?Object.assign({id},j,{n:L.tx(j.n)}):null;
}
function eduLevel(L){ const f=L.f; return f.univDone?3:f.sec?2:f.elem?1:0; }
function jobOK(L,j){ if(!j) return false; const mj=L.f.major||'';
  // 의사·간호사·엔지니어는 그 공부를 한 사람만
  if(j.id==='doctor'&&mj!=='의예과') return false; if(j.id==='nurse'&&mj!=='간호학과') return false; if(j.id==='engineer'&&!/공학|건축|물리|생명|화학|컴퓨터/.test(mj)) return false;
  return eduLevel(L)>=j.edu && (j.set==='*'||j.set===L.set) && (!j.maxTier||L.C.tier<=j.maxTier); }
function jobP(L,j){ return clamp(j.diff+(L.s[j.stat]-50)/100*.5+(L.w-.5)*.15+Math.min(L.tr[j.tr]||0,40)*.005+(eduLevel(L)-j.edu)*.05,.04,.96); }
const EDU_PAY=[.65,.8,1,1.3];
function jobPayMid(L,j){ return L.C.med*j.mul*EDU_PAY[eduLevel(L)]*(L.set==='R'&&j.kind!=='tour'?.8:1); }
function gauss(){ let u=0,v=0; while(!u) u=R(); while(!v) v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
// 일자리 고르기 창: 그 나라의 대표 일 · 얻기 쉬운 일 · 꿈꿔 볼 만한 일
// 대학에서 배운 것과 이어지는 일
const MAJOR_JOB={'의예과':'doctor','간호학과':'nurse','수학교육과':'teacher','국어국문학과':'teacher','컴퓨터공학과':'engineer','기계공학과':'engineer','화학공학과':'engineer','건축학과':'engineer','물리학과':'engineer','생명과학과':'engineer','경영학과':'office','경제학과':'office','심리학과':'office','법학과':'civil','사회복지학과':'civil','디자인학과':'artist'};
// 일의 갈래: 일을 바꿀 때는 보통 비슷한 갈래 안에서 옮긴다
const JOB_FAM={day:'hand',farm:'hand',builder:'hand',driver:'hand',factory:'hand',abroad:'hand',vendor:'shop',cook:'shop',hair:'shop',shopown:'shop',office:'desk',police:'desk',civil:'desk',engineer:'desk',teacher:'care',nurse:'care',doctor:'care',artist:'dream',athlete:'dream',creator:'dream'};
function famOfJob(L,id){ if(id==='sig'){ const k=sigKind(L.C.work); return k==='office'?'desk':k==='hosp'?'care':k==='shop'?'shop':k==='dream'?'dream':'hand'; } return JOB_FAM[id]||'hand'; }
// 선수·예술가·창작자는 그 길을 걸어온 사람에게만 열린다
function dreamOK(L,id){ const ch=L.f.ch||{}, hob=(L.f.hob||[]).map(h=>h.n).join(' ');
  if(id==='athlete') return L.age<=30&&(ch.athlete!=null||ch.sportKid!=null);
  if(id==='artist') return ch.musicKid!=null||ch.stage!=null||L.f.major==='디자인학과'||/그림|노래|악기|기타|피아노|춤|사진|도예|공예|연극|작곡|글쓰기|뜨개/.test(hob);
  if(id==='creator') return ch.stage!=null||/영상|사진|그림|노래|춤|요리|게임|코딩|글쓰기/.test(hob);
  return true; }
function jobMenu(L,q,keep){
  const cur=L.f.job, all=['sig'].concat(Object.keys(JOBS)).filter(id=>id!==cur).map(id=>jobInfo(L,id)).filter(j=>jobOK(L,j)&&(j.sig||j.kind!=='dream'||dreamOK(L,j.id)));
  const pick=[], take=j=>{ if(j&&!pick.includes(j)) pick.push(j); };
  const mid=L.f.univDone&&MAJOR_JOB[L.f.major], mj=mid&&mid!==cur?all.find(j=>j.id===mid):null;
  if(mj) take(mj);
  // 일을 바꿀 때: 지금 하는 일과 비슷한 갈래의 일 (그 나라의 대표 일은 언제나 후보)
  const base=L.f.lostJob||cur, fam=base?famOfJob(L,base):null, near=keep&&base?all.filter(j=>j.sig||famOfJob(L,j.id)===fam):null, grad=!keep&&L.f.univDone?all.filter(j=>j.edu>=2):null;
  const pool=near&&near.length>=2?near:grad&&grad.length>=3?grad:all; delete L.f.lostJob;
  const want=keep?2:3;
  if(pool.some(j=>j.sig)) take(pool.find(j=>j.sig));
  const easy=pool.filter(j=>j.diff>=.7&&!j.sig); if(pick.length<want) take(easy.sort((a,b)=>b.mul-a.mul+(R()-.5)*.6)[0]);
  const hard=pool.filter(j=>j.diff<.7&&!j.sig).map(j=>({j,s:jobP(L,j)*Math.min(j.mul,2)*(j.id==='abroad'?.45:1)*(1+R()*1.4)})).sort((a,b)=>b.s-a.s); hard.forEach(x=>{ if(pick.length<want) take(x.j); });
  while(pick.length<want){ const r=pickOne(pool); if(!r) break; take(r); if(pool.length<=pick.length) break; }
  const opts=pick.slice(0,want).map(j=>j===mj?{label:`${j.n} (전공: ${L.f.major})`,sub:'배운 것을 살리는 일 · 한 달에 약 '+fmtPay(jobPayMid(L,j)),p:clamp(jobP(L,j)+.32,.05,.95),job:j.id}
    :{label:j.n,sub:(near&&famOfJob(L,j.id)===fam?'지금 일과 비슷한 일 · ':'')+'한 달에 약 '+fmtPay(jobPayMid(L,j)),p:clamp(jobP(L,j),.03,.97),job:j.id});
  if(keep&&cur) opts.unshift({label:'지금 하는 일을 계속한다',sub:jobInfo(L,cur).n+' · 한 달에 약 '+fmtPay(L.inc),p:null,keep:1});
  return {q,opts,job:1};
}
// 일자리 얻기
function setJob(L,id){
  const j=jobInfo(L,id); L.f.job=id; L.f.retired=0;
  L.inc=clamp(jobPayMid(L,j)*Math.exp(gauss()*j.sd*.6),L.C.med*.12,L.C.med*Math.max(4,j.mul*(j.kind==='dream'?5:2.6))); L.maxInc=Math.max(L.maxInc||0,L.inc);
  L.f.co=L.ppl?companyOf(L,j):''; L.jobs=L.jobs||[]; const last=L.jobs[L.jobs.length-1]; if(!last||last.n!==j.n) L.jobs.push(Object.assign({n:j.n,a:L.age,co:L.f.co,k:j.kind},L._why?{why:String(L._why).slice(0,60)}:{})); return j;
}
function loseJob(L){ const id=L.f.job, old=jobInfo(L,id); setJob(L,L.set==='R'?'farm':'day'); if(famOfJob(L,id)!=='hand'||eduLevel(L)>=3){ L.f.lostJob=id; L.f.needJob=2; } return old; }
// 그 나라의 연금·가족의 도움
function pension(L){ return L.C.med*(L.C.tier>=4?.5:L.C.tier===3?.3:.15); }


