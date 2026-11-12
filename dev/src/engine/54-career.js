/* ========== 진로: 흥미 분야 → 대학 학과 · 일자리 후보 (11-13) ==========
   · 진로 이야기(중요 대화)에서 흥미 분야 f.dir를 정한다: 12~14살 부모님 · 15~17살 담임 선생님(진로 상담) · 17~18살 진학 상담(목표 학과 f.major).
     화면 쪽 대화는 ui/62-dialog-more.js. 대화를 놓치면 그때까지의 삶의 모양(오각형)으로 저절로 정해진다(ensureDir).
   · 대학 갈림길(19살, 재수하면 21살): 도전·적정·안정(2년제) 여러 학교와 흥미 분야의 학과를 함께 보여 준다(univMenu).
   · 일자리 고르기: 흥미 분야의 일을 후보에 더한다(jobMenu 감싸기). */
const DIRS={
  sci: {n:'과학·기술',      ax:['k','t'], tr:'C', maj:['컴퓨터공학과','기계공학과','생명과학과','물리학과','화학공학과','건축학과'], jc:'컴퓨터정보과', jobs:['engineer','factory','sig'], ex:'컴퓨터공학·기계공학 → 엔지니어'},
  care:{n:'사람 돌보기·의료', ax:['r','k'], tr:'K', maj:['간호학과','의예과','사회복지학과','심리학과'], jc:'사회복지과', jobs:['nurse','doctor','hair'], ex:'간호학·의학 → 간호사·의사'},
  edu: {n:'가르치기·말과 글', ax:['k','r'], tr:'D', maj:['수학교육과','국어국문학과','심리학과'], jc:'유아교육과', jobs:['teacher','civil'], ex:'교육학·국문학 → 교사'},
  biz: {n:'장사·회사·돈',     ax:['r','e'], tr:'B', maj:['경영학과','경제학과'], jc:'경영과', jobs:['office','shopown','vendor'], ex:'경영학·경제학 → 회사원·가게 주인'},
  art: {n:'예술·만들기',      ax:['j','t'], tr:'C', maj:['디자인학과','실용음악과','조리학과'], jc:'디자인과', jobs:['artist','creator','cook','hair'], ex:'디자인·음악·요리 → 예술가·요리사'},
  body:{n:'몸으로 하는 일·운동',ax:['t','e'], tr:'B', maj:['체육학과','건축학과'], jc:'경찰행정과', jobs:['athlete','police','builder','driver'], ex:'체육·건축 → 선수·경찰관'},
  pub: {n:'나라·사회를 위한 일',ax:['k','e'], tr:'G', maj:['법학과','사회복지학과','경제학과'], jc:'행정과', jobs:['civil','police'], ex:'법학·행정 → 공무원·경찰관'}
};
const DIR_KEYS=Object.keys(DIRS);
// 학과마다 들어가기 어려운 정도 (확률에 더함)
const MAJ_HARD={'의예과':-.28,'간호학과':-.06,'수학교육과':-.08,'컴퓨터공학과':-.06,'경영학과':-.04,'법학과':-.08,'건축학과':-.04,'실용음악과':-.1,'체육학과':-.06};
['실용음악과','조리학과','체육학과'].forEach(m=>{ if(!MAJORS_U.includes(m)) MAJORS_U.push(m); });
Object.assign(MAJOR_JOB,{'실용음악과':'artist','조리학과':'cook','체육학과':'teacher','컴퓨터정보과':'office','사회복지과':'civil','유아교육과':'teacher','경영과':'office','디자인과':'artist','경찰행정과':'police','행정과':'civil'});
MAJOR_JOB['어문학과']='teacher';
const MAJ_DIR={'어문학과':'edu'}; DIR_KEYS.forEach(d=>DIRS[d].maj.concat(DIRS[d].jc).forEach(m=>{ if(!MAJ_DIR[m]) MAJ_DIR[m]=d; }));
// 지금의 삶의 모양(오각형·건강)과 쌓인 성향으로 본 분야별 점수
// 축마다 보통 크기가 달라(관계·행복은 크고 기술·경험은 작다) 보통 값에 견준 비율로 본다
const AX_BASE={j:38,k:21,t:13,e:18,r:49}, TR_BASE={D:20,B:9,K:12,C:12,G:4};
function dirScore(L,d){ const D=DIRS[d], s=L.s, f=L.f; let v=D.ax.reduce((a,k)=>a+(s[k]!=null?s[k]:AX_BASE[k])/AX_BASE[k],0)/D.ax.length*50; v+=(L.tr[D.tr]||0)/TR_BASE[D.tr]*6; if(f.dirs&&f.dirs[d]) v+=f.dirs[d]*6; let h=7; for(const c of String(L.name||'')+d) h=(Math.imul(h,31)+c.charCodeAt(0))>>>0; return v+(h%1000)/1000*8; }   // 비슷하면 사람마다 다르게
function dirRank(L){ return DIR_KEYS.slice().sort((a,b)=>dirScore(L,b)-dirScore(L,a)); }
// 오각형에서 가장 돋보이는 두 축 (말로 보여 줄 때)
function topAxes(L){ return ['j','k','t','e','r'].filter(k=>L.s[k]!=null).sort((a,b)=>L.s[b]/AX_BASE[b]-L.s[a]/AX_BASE[a]).slice(0,2); }
function ensureDir(L){ const f=L.f; if(!f.dir) f.dir=(f.major&&MAJ_DIR[f.major])||dirRank(L)[0]; if(!f.major||!MAJ_DIR[f.major]) f.major=DIRS[f.dir].maj[0]; return f.dir; }
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
  ensureDir(L); const D=DIRS[f.dir];
  const q0=f.uex!=null?f.uex:Phi((L.acInit()-50)/17)*.9+.05, base=KR?.3:[-.15,-.02,.15,.3][C.tier-1];
  const pU=base+q0*.5+L.w*.12+Math.min(t.D,40)*.004+(f.hs==='gen'?.05:0)+(again?.05:0);
  const tech=/KAIST|POSTECH|UNIST|DGIST|GIST|공과|공업|IIT|MIT|칼텍|기술원|Tech/i, fit=a=>{ const x=a.filter(n=>f.dir==='sci'||!tech.test(n)); return x.length?x:a; };
  const UN=UNIV[L.c], topN=UN?pickOne(fit(UN[0])):`${C.city} 국립대학교`, midN=UN?pickOne(fit(UN[1].filter(x=>x!==topN).length?UN[1].filter(x=>x!==topN):UN[1])):`${L.town||C.city} 대학교`, jcN=`${L.town||C.city} ${KR?'전문대학':'직업대학'}`;
  const loc=m=>L.c!=='KR'&&m==='국어국문학과'?'어문학과':m, ms=[f.major].concat(D.maj).map(loc).filter((m,i,a)=>m&&a.indexOf(m)===i&&MAJ_DIR[m]===f.dir), m1=ms[0], m2=ms[1]||m1;
  const enter=(nm,mj,jc)=>()=>{ f.univ=1; f.school=1; f.univA=a; f.retry=0; sch.univ=nm; f.major=mj; f.jc=jc?1:0; };
  const fail=[again?'이번에도 합격하지 못했다. 다른 길을 찾아보기로 했다.':'불합격 소식을 들었다. 눈앞이 캄캄했다.',{j:-6},()=>{ f.retry=0; f.school=again?0:f.school; if(again) f.needJob=1; else f.uFail=1; }];
  const o=(label,sub,p,ok,fl)=>({label,sub,p:p==null?null:clamp(p,.03,.97),ok,fail:fl});
  const pm=mj=>MAJ_HARD[mj]||0;
  const yes=(nm,mj,x)=>[`${nm} ${mj}에 합격했다!${f.uex!=null?' 성적표를 몇 번이고 다시 보았다.':''}${x||''}`,{k:8,j:7},enter(nm,mj)];
  const opts=[];
  if(f.uOffer&&!again){ const om=f.major;
    opts.push(o(`수시로 합격한 ${f.uOffer} ${om}에 입학한다`,'이미 붙어 둔 곳 · 확실',null,[`${f.uOffer} ${om}에 입학했다. 입학식 날, 학교 이름이 새겨진 점퍼를 처음 입었다.`,{k:8,j:8},enter(f.uOffer,om)]));
    if(topN!==f.uOffer) opts.push(o(`정시로 ${topN} ${m1}에 도전한다`,'떨어지면 수시로 붙은 곳에 간다',pU-.32+pm(m1),yes(topN,m1,' 수시로 붙은 곳 대신 한 단계 높은 곳을 골랐다.'),[`${topN}에는 떨어졌다. 수시로 붙어 둔 ${f.uOffer}에 입학했다.`,{j:-2},enter(f.uOffer,om)])); }
  else {
    opts.push(o(`도전 · ${topN} ${m1}`,`이름난 대학 · 관심 분야(${D.n})`,pU-.3+pm(m1),yes(topN,m1),fail));
    opts.push(o(`적정 · ${midN} ${m1}`,`관심 분야(${D.n}) · 4년제`,pU+pm(m1),yes(midN,m1),fail));
    if(m2!==m1) opts.push(o(`적정 · ${midN} ${m2}`,`같은 분야의 다른 학과 · 4년제`,pU+.06+pm(m2),yes(midN,m2),fail));
    opts.push(o(`안정 · ${jcN} ${D.jc}`,'2년제 · 빨리 졸업해 일을 시작한다',pU+.32,[`${jcN} ${D.jc}에 합격했다. 2년 동안 일에 바로 쓰는 기술을 배운다.`,{k:5,j:5},enter(jcN,D.jc,1)],fail)); }
  opts.push(o('바로 일자리를 구한다',f.hs==='voc'?'배운 기술을 살린다':'돈을 먼저 번다',null,[f.hs==='voc'?'배운 기술로 일자리를 알아보기로 했다.':'일자리를 알아보기로 했다.',{j:2,r:2,k:f.hs==='voc'?3:0},()=>{ f.needJob=1; f.retry=0; f.school=0; }]));
  if(!again) opts.push(U? o('1년 동안 하고 싶은 일을 찾아본다','아르바이트를 하며',null,['아르바이트를 하며 하고 싶은 일을 찾아다녔다.',{j:4,k:2},()=>{setJob(L,'day');t.C+=3}])
                 : o('부모님의 일을 잇는다','',null,['부모님 곁에서 집안일과 농사를 배우기 시작했다.',{r:5,h:2},()=>{setJob(L,'farm')}]));
  if(f.wantWork&&!again){ const k=opts.findIndex(x=>x.label==='바로 일자리를 구한다'); if(k>0) opts.unshift(opts.splice(k,1)[0]); }
  return {q:again?'다시 본 시험의 결과가 나왔다. 대학에 지원할 차례다.':f.uOffer?`${f.uOffer}에 합격해 두었다. 어른이 되는 문턱에 섰다.`:'어른이 되는 문턱에 섰다. 어디에 원서를 낼까?',opts}; }
// 일자리 고르기: 흥미 분야의 일을 더한다 (전체 4~5개)
(function(){ const _jm=jobMenu; jobMenu=function(L,q,keep){ const r=_jm(L,q,keep), f=L.f; if(!f.dir||!DIRS[f.dir]) return r; const D=DIRS[f.dir];
  const have=new Set(r.opts.map(x=>x.job).filter(Boolean)); r.opts.forEach(x=>{ if(x.job&&D.jobs.includes(x.job)&&x.sub&&!/관심 분야/.test(x.sub)) x.sub=`관심 분야(${D.n}) · `+x.sub; });
  const add=D.jobs.filter(id=>id!==f.job&&!have.has(id)).map(id=>jobInfo(L,id)).filter(j=>j&&jobOK(L,j)&&(j.sig||j.kind!=='dream'||dreamOK(L,j.id))).slice(0,keep?1:2);
  const at=keep&&r.opts[0]&&r.opts[0].keep?1:0;
  add.forEach((j,i)=>r.opts.splice(at+i,0,{label:j.n,sub:`관심 분야(${D.n}) · 한 달에 약 ${fmtPay(jobPayMid(L,j))}`,p:clamp(jobP(L,j)+.08,.03,.97),job:j.id}));
  r.opts=r.opts.slice(0,5); return r; }; })();
(function(){ const _d=dreamOK; dreamOK=function(L,id){ const f=L.f; if(id==='artist'&&/실용음악|디자인/.test(f.major||'')) return true; if(id==='athlete'&&f.dir==='body'&&L.age<=30&&L.s.h>=62) return true; if(id==='creator'&&f.dir==='art') return true; return _d(L,id); }; })();
// 수시 합격 발표 때도 흥미 분야의 학과로
(function(){ const R0=CALRUN.susiR, _p=R0.post; R0.post=(L,...x)=>{ ensureDir(L); return _p(L,...x); }; })();
