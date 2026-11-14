/* ========== 능력치 2판: 오각형 5축(행복·지식·기술·관계·경험) + 따로 보는 건강·재산 ==========
   행복  — 건강·관계·돈 걱정·일과 꿈·경험에서 해마다 계산되어 천천히 움직이고, 큰 사건은 직접 오르내린다
   지식  — 공부·진학·시험. 배운 것은 잘 줄지 않고 노년에 느리게 준다
   기술  — 학창 시절에는 공부 밖의 활동, 일을 시작한 뒤에는 경력·승진·자격증. 일을 쉬거나 분야를 바꾸면 준다
   관계  — 사람마다 친밀도를 따로 두고(가족은 천천히, 친구·동료는 빨리 멀어진다) 합쳐서 보여 준다
   경험  — 처음 해 보는 일은 크게, 같은 일을 또 하면 조금만 쌓인다 (줄지 않는다)
   건강  — 몸 상태(결과값). 나이가 들면 최대치가 내려가고, 사고·재난·병이 깎는다. 0은 삶이 끝난 뒤의 표시
   재산  — 실제 금액은 그대로, 화면에는 '쓸 수 있는 돈'을 막대로. 빚은 한도까지만 */
STAT.t='기술'; STAT.e='경험';
const AXES=['j','k','t','e','r'];                       // 오각형: 행복이 맨 위, 시계 방향
const AX_N={j:'행복',k:'지식',t:'기술',e:'경험',r:'관계'};
const REL_N={kin:'친척',mom:'엄마',dad:'아빠',gran:'할머니',sib:'형제자매',friend:'친구',spouse:'배우자',kids:'아이들',coll:'동료',nb:'이웃'};
const REL_FADE={kin:.5,mom:.6,dad:.6,gran:.6,sib:.8,friend:1.6,spouse:.7,kids:.6,coll:2,nb:1.1};
const REL_RX=[['spouse',/\{spouse\}|\{lover\}|배우자|남편|아내|연인|애인|신랑|신부|결혼/],['kids',/\{kid\}|아이가|아이를|아이와|아이의|딸|아들|손주|육아/],['friend',/\{friend\}|\{bff\}|친구|단짝|짝꿍|동창/],
  ['coll',/\{coll\d?\}|동료|후배|선배|팀장|사장|상사|직원|손님/],['mom',/엄마|어머니|\{mom\}|부모님/],['dad',/아빠|아버지|\{dad\}|부모님/],['gran',/할머니|할아버지|조부모/],['sib',/동생|언니|오빠|누나|형이|형과|형제|자매|\{sib\}/],['nb',/이웃|마을|동네|주민/]];
// 원래의 사망률 식은 예전 건강 눈금에 맞춰져 있어, 그 계산을 할 때만 예전 눈금으로 바꿔 넣는다 (기대수명이 나라 통계와 맞도록)
const H_OFF=15, AUTO_K=.35;
function hMaxAt(a){ return a<30?100:Math.max(38,100-(a-30)*.72); }
// 경험의 갈래: 처음이면 크게, 다시 하면 조금
const EXP_CATS=[['abroad',/외국|해외|다른 나라|비행기|공항|여권/],['travel',/여행|관광|구경을 갔|가 보았|명소|소풍|나들이/],['move',/이사|도시로 떠|이주|새 동네|고향을 떠/],['sea',/바다|해변|파도/],['mount',/산에 올|등산|정상|오름/],
  ['stage',/무대|공연|발표회|재롱|연극|합창|연주/],['contest',/대회|시합|결승|경기에 나/],['art',/그림|미술|전시|사진을 찍|만들기/],['music',/노래|악기|기타|피아노|밴드|춤/],['sport',/축구|농구|야구|달리기|수영|운동|체육|자전거|줄넘기/],
  ['firstjob',/일을 시작|첫 월급|첫 출근|입사|일자리를 얻/],['parttime',/아르바이트|알바|일당|품삯/],['volunteer',/봉사|기부|도와주는 일/],['lang',/외국어|영어|언어를|말을 배우/],['romance',/첫사랑|고백|연인|데이트|좋아하는 사람/],
  ['wedding',/결혼식|결혼했|혼례|가정을 꾸/],['parent',/아이가 태어|아기가 태어|태어났다\. 작은 손|쌍둥이/],['loss',/세상을 떠|장례|떠나보|먼 길을 떠나/],['disaster',/홍수|지진|태풍|폭풍|산불|화산|가뭄|물난리/],['hosp',/입원|수술|응급실/],
  ['pet',/강아지|고양이|반려|병아리|토끼/],['cook',/요리|음식을 만들|김장|빵을 구/],['fest',/축제|명절|잔치|설날|추석/],['camp',/캠핑|야영|별이 쏟|밤하늘/],['drive',/운전|면허|오토바이를|차를 몰/],
  ['tech',/컴퓨터|코딩|인공지능|휴대폰을 처음|게임을 만들/],['faith',/교회|성당|절에|사원|모스크|순례|예배/],['civic',/투표|선거|시위|모임 대표|동네 일/],['biz',/가게를 차|창업|사업을 시작|장사를 시작/],['cert',/자격증|면허를 땄|시험에 합격/],
  ['house',/집을 샀|새 집|내 집|집을 지/],['friendnew',/친구를 사귀|친구가 생|새 친구/],['nature',/숲|강가|호수|들판|폭포|동굴/],['read',/책 한 권|도서관|소설|시를 썼/],['school',/입학|졸업|새 학년|학교에 다니/],
  ['work2',/승진|팀장|반장이|맡게 되었/],['danger',/사고|다쳤|부러|꿰맸|빠졌|넘어져/],['news',/뉴스|소식이|세계 경기/]];
function expCat(t){ for(const [c,re] of EXP_CATS) if(re.test(t)) return c; return null; }
Life.prototype.relInit=function(){ const P=this.ppl||{}, f=this.f, fm=this.fam, a=this.age, R={}, base=this.s&&this.s.r!=null?this.s.r:55, adj=v=>clamp(v+(base-55)*.5,15,95);
  if(!fm||fm.mom.al) R.mom=adj(a<19?68:56); if(!f.dad0&&(!fm||(fm.dad.al&&f.div!=='dad'))) R.dad=adj(a<19?60:50);
  if(this.gran&&!f.ggone&&a<40) R.gran=adj(60); if(fm?fm.sibs.some(s=>s.born&&s.al):this.sib) R.sib=adj(56);
  if(a>=7) R.friend=adj(a<30?50:42); if(a>=6) R.nb=adj(34); if(f.job&&a>=19) R.coll=adj(38);
  if(f.family&&P.spouse&&!f.widow) R.spouse=adj(74); if(this.kids&&this.kids.length) R.kids=adj(74);
  this.rel=R; };
Life.prototype.relAgg=function(){ const v=Object.values(this.rel||{}).sort((a,b)=>b-a); const top=(v[0]||0)+(v[1]||0), rest=(v[2]||0)+(v[3]||0)+(v[4]||0); return clamp(.6*top/2+.4*rest/3,0,100); };
Life.prototype.relAdd=function(d,txt){ const R=this.rel||(this.rel={}); let keys=[]; for(const [k,re] of REL_RX) if(re.test(txt||'')&&k in R) keys.push(k);
  const tg=keys.length?keys:Object.keys(R), m=keys.length?1.1/Math.sqrt(keys.length):.35;
  tg.forEach(k=>{ let dd=d*m; if(dd>0) dd*=Math.max(.06,1-Math.pow(R[k]/105,2)); R[k]=Math.round(clamp(R[k]+dd,0,100)*10)/10; }); };
// 갈래마다 무게가 다르다: 누구나 겪는 일(학교·소식·운동)은 작게, 드물고 낯선 일(외국·이사·창업·새 언어·여행)은 크게. 낯선 일은 다시 해도 조금씩 더 쌓인다
const EXP_W={abroad:5,move:3.4,lang:3.4,biz:3.2,travel:2.6,volunteer:2.2,stage:2,camp:2,mount:1.8,sea:1.8,civic:1.8,contest:1.6,romance:1.6,wedding:1.6,parent:1.8,firstjob:1.4,cert:1.4,house:1.4,art:1.3,music:1.3,tech:1.3,drive:1.1,danger:1,disaster:1.2,pet:1,nature:1.1,faith:.9,cook:.9,fest:.8,parttime:1,work2:1,friendnew:.8,read:.8,sport:.7,loss:.9,hosp:.6,school:.4,news:.2};
const EXP_RE={abroad:1,move:1,lang:1,biz:1,travel:1,volunteer:1,stage:1,camp:1,mount:1,sea:1,contest:1,art:1,music:1,civic:1};
Life.prototype.expAdd=function(t){ const c=expCat(t); if(!c) return 0; const X=this.xc||(this.xc={}), n=(X[c]=(X[c]||0)+1); const s=this.s, w=EXP_W[c]||1;
  const d=(n===1?w*.55:EXP_RE[c]?w*.3/Math.sqrt(n):.1/n)*Math.max(.15,1-s.e/100); s.e=clamp(s.e+d,0,100); return d; };
// 용기·호기심 쪽을 직접 고르면 경험이 조금 더 쌓인다 (낯선 쪽으로 걸어가는 선택)
{ const LP=Life.prototype; ['doScene','chooseMajor','calDo'].forEach(fn=>{ const f0=LP[fn]; LP[fn]=function(...args){ const b0=this.tr?(this.tr.B||0)+(this.tr.C||0):0; const r=f0.apply(this,args);
  if(this.tr&&this.s&&!this._auto){ const d=(this.tr.B||0)+(this.tr.C||0)-b0; if(d>0&&this.s.e!=null) this.s.e=clamp(this.s.e+d*.16*Math.max(.15,1-this.s.e/100),0,100); } return r; }; }); }
// 저장된 옛 삶을 새 체계로 한 번 바꾼다 (지식·건강·행복은 그대로, 기술·경험·사람별 친밀도는 기록에서 다시 계산)
function ensureV2(L){ if(L.v===2) return; const s=L.s; s.h=clamp(s.h+H_OFF,0,hMaxAt(L.age));
  if(s.t==null){ let yrs=0; const J=L.jobs||[]; J.forEach((j,i)=>{ const end=i+1<J.length?J[i+1].a:(L.f.job?L.age:j.a+2); yrs+=Math.max(0,end-j.a); }); s.t=clamp(yrs*1.7+(L.age>=13?6:0),0,80); }
  if(s.e==null){ s.e=0; L.xc={}; (L.mem||[]).forEach(m=>{ if(m.a>0) for(let i=0;i<(m.rp||1);i++) L.expAdd([m.t,m.q,m.l].filter(Boolean).join(' ')); }); }
  if(!L.rel) L.relInit(); s.r=L.relAgg(); L.v=2; }
// 해마다: 행복은 목표값을 향해, 관계는 저절로 멀어지고, 기술은 일과 함께, 건강은 나이의 한계 안에서
Life.prototype.moneyEase=function(){ const C=this.C, a=this.age, f=this.f; if(a<19&&!f.job) return clamp(50+(this.w-.5)*90,5,95);
  const yr=Math.max(C.med*12,(this.inc||0)*12), debt=this.cash<0?Math.min(40,-this.cash/yr*(this.house?6:14)):0; return clamp(this.w*100-debt,0,100); };
Life.prototype.workSat=function(){ const f=this.f, a=this.age, s=this.s, j=this.job; if(f.dying) return 30; if(a<7) return 60;
  if(f.school) return clamp(45+(s.k-40)*.3+s.t*.1,15,90); if(f.job&&j) return clamp(38+s.t*.38+(j.kind==='dream'?10:0)+(this.inc>this.C.med*1.5?5:0)-(f.inf?5:0),10,95);
  if(f.retired||a>=65) return 58; return a<19?50:24; };
Life.prototype.joyTarget=function(){ const s=this.s; return .25*s.h+.25*s.r+.15*this.moneyEase()+.20*this.workSat()+.15*s.e; };
Life.prototype.debtLimit=function(){ const C=this.C, f=this.f, inc=(this.inc||0)*(this.age>=19&&!f.school?12:0); const tierK=[1.2,2,2.6,3][Math.max(0,(C.tier||2)-1)];
  if(inc>0) return inc*tierK+this.house*.7; if(f.univ&&f.school) return C.med*12*(C.tier>=3?2:.6); return C.med*3+this.house*.5; };
Life.prototype.spendable=function(){ return this.cash-this.C.med*3; };
// 이 선택을 지금 고를 수 있나: 모자라면 이유를 돌려준다 ('' 이면 고를 수 있다)
const RX_HARD=/등산|마라톤|철인|밤새|밤샘|야간|밤일|철야|원정|배낭|오지|장거리|멀리 떠|무리해서|격하게|산에 오른|대회에 나|전력으로|뛰어든다|헤엄쳐/, RX_WORK=/더 일한다|야근|부업|잔업|두 가지 일|밤늦게까지 일/;
Life.prototype.optCost=function(fx){ if(!fx) return 0; let c=0; if(fx['@']<0) c+=-fx['@']*this.C.med; if(fx.H>0&&!this.house) c+=this.housePrice()*fx.H/100; return c; };
Life.prototype.optBlocked=function(o,kind){ if(!o) return ''; const fx=kind==='m'?o.okFx:kind==='ch'?(o.ok&&o.ok[1]):o.fx, lab=String(o.l||o.label||''), s=this.s, a=this.age;
  if(a>=8&&s.h<66&&RX_HARD.test(lab)) return '건강이 좋지 않아요';
  if(a>=19&&s.h<38&&RX_WORK.test(lab)) return '몸이 버티기 어려워요';
  if(fx&&fx.H>0&&!this.house&&a>=16&&Math.max(this.cash,0)+this.debtCap()*.5<this.housePrice()*fx.H/100*.2*.35) return '돈이 부족해요';
  const c=this.optCost(fx); if(c>0&&a>=16&&!(fx&&fx.H>0)){ const after=this.cash-c+(fx&&fx.H>0?this.housePrice()*fx.H/100*.7:0); if(after< -this.debtLimit()*(c>=this.C.med*2?1:1.8)) return '돈이 부족해요'; }   // 작은 돈은 빚을 조금 더 지고라도 쓸 수 있다
  return ''; };
(function(){ const P=Life.prototype;
  const _apply=P.apply; P.apply=function(fx){ if(!fx) return; ensureV2(this); const g=Object.assign({},fx), s=this.s;
    if(this._auto) for(const k of ['j','k','t','e','r']) if(g[k]>0) g[k]*=AUTO_K;
    if(g.r){ this.relAdd(g.r,this._why||''); delete g.r; }
    // 직접 고르지 않고 저절로 지나간 일은 얻는 것이 적다 (돌아다니며 직접 고를수록 삶의 모양이 커진다): 위의 AUTO_K
    if(this._ctx==='cal'||this._ctx==='scene'){ if(g.j) g.j*=.5; if(g.k>0) g.k*=.4; }
    // 높이 올라갈수록 더 오르기 어렵다 (만점은 드물게)
    for(const k of ['k','t','e']) if(g[k]>0&&s[k]!=null) g[k]*=Math.max(.08,1-Math.pow(s[k]/108,2));

    if(g.h<0) g.h=Math.max(g.h,-25);
    const j0=s.j; _apply.call(this,g); if(this._inEnd) this._dj=(this._dj||0)+(s.j-j0);
    if(fx.h<0&&!this.dead) s.h=Math.min(s.h,hMaxAt(this.age));
    s.r=this.relAgg(); };
  const ctxWrap=(name,ctx)=>{ const o=P[name]; P[name]=function(){ const prev=this._ctx; this._ctx=ctx; try{ return o.apply(this,arguments); } finally{ this._ctx=prev; } }; };
  ctxWrap('calDo','cal'); ctxWrap('doScene','scene'); ctxWrap('chooseMajor','maj'); ctxWrap('choose','maj'); ctxWrap('questEnd','cal');
  const _rem=P.remember; P.remember=function(o){ const r=_rem.call(this,o); if(o&&o.a>0&&!this._noExp){ ensureV2(this); const e0=this.s.e, d=this.expAdd([o.t,o.q,o.l].filter(Boolean).join(' ')); if(this._auto&&d) this.s.e=e0+d*AUTO_K; } return r; };
  const _ar=P.autoResolve; P.autoResolve=function(){ const a=this._auto; this._auto=1; try{ return _ar.apply(this,arguments); } finally{ this._auto=a; } };
  // 사건의 조건에 지금 능력치를 쓸 수 있게: v:h<50, v:r>65, v:cash<-10 (돈은 보통 한 달 벌이의 몇 배)
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ const c=ev&&ev.c; if(c&&c.some(t=>t.startsWith('v:'))){ for(const t of c){ if(!t.startsWith('v:')) continue; const m=t.match(/^v:(\w+)([<>])(-?[\d.]+)$/); if(!m) continue; const v=m[1]==='cash'?this.cash/this.C.med:this.s[m[1]]; if(v==null||!(m[2]==='<'?v<+m[3]:v>+m[3])) return null; }
      return _cc.call(this,Object.assign({},ev,{c:c.filter(t=>!t.startsWith('v:'))}),st,sy); } return _cc.call(this,ev,st,sy); };
  const _rk=P.rankUp; P.rankUp=function(n){ const r=_rk.call(this,n); if(r&&this.s.t!=null) this.s.t=clamp(this.s.t+2.5*Math.max(.3,1-this.s.t/110),0,100); return r; };
  const _sp=P.startPeriod; P.startPeriod=function(){ ensureV2(this); return _sp.apply(this,arguments); };
  const _end=P.endPeriod; P.endPeriod=function(){ ensureV2(this); const s=this.s, f=this.f, a=this.age, step=this.step, school=!!f.school, univ=!!f.univ, jn=(this.jobs||[]).length, hadJob=!!f.job, jPre=s.j, k0=s.k;
    this._dj=0; this._inEnd=true; s.h-=H_OFF; let res; try{ res=_end.apply(this,arguments); } finally{ this._inEnd=false; s.h+=H_OFF; }
    // 지식: 학교에 다니는 해에 저절로 오르는 몫을 줄인다 (공부를 고른 해가 더 차이 나도록)
    if(school) s.k=Math.max(k0,s.k-(univ?1.7:1.2)*step);
    if(a>=65) s.k-=.25*step;
    if(f.ch&&f.ch.smoke!=null&&!(f.ch.quit!=null)) s.h-=.8*step;
    // 기술: 일하는 동안 쌓이고, 쉬거나 분야를 바꾸면 준다. 학교 대신 일을 돕는 아이도 손에 익는다
    const T=s.t; if(f.job&&!f.school&&a>=15) s.t+=(f.inf?1.6:2.1)*step*Math.max(.15,1-T/105);
    else if(!f.school&&!f.retired&&a>=19&&a<65) s.t-=1.3*step; else if(f.retired) s.t-=.6*step;
    else if(!f.school&&a>=10&&a<19) s.t+=1.1*step*Math.max(.2,1-T/90);
    if(hadJob&&(this.jobs||[]).length>jn&&jn>0) s.t*=.86;
    // 관계: 연락이 없으면 저절로 멀어진다. 새로 생긴 사람, 떠난 사람을 반영
    const R=this.rel, P=this.ppl||{}, fm=this.fam;
    for(const k in R) R[k]=Math.round(Math.max(k==='mom'||k==='dad'||k==='kids'||k==='spouse'?25:5,R[k]-REL_FADE[k]*step*(k==='coll'&&!f.job?2:1))*10)/10;
    if(fm){ if(!fm.mom.al) delete R.mom; if(!fm.dad.al) delete R.dad; }
    if(f.widow) delete R.spouse; if(f.ggone||a>=45) delete R.gran;
    if(this.age>=7&&R.friend==null) R.friend=48; if(this.age>=6&&R.nb==null) R.nb=34;
    if(f.job&&R.coll==null) R.coll=38; if(!f.job&&R.coll!=null&&R.coll<12) delete R.coll;
    if(f.family&&P.spouse&&!f.widow&&R.spouse==null) R.spouse=62; if(this.kids.length&&R.kids==null) R.kids=64;
    if(this.age<19&&R.mom==null&&R.dad==null&&R.kin==null) R.kin=45;   // 부모를 잃은 아이는 친척이 맡아 기른다
    s.r=this.relAgg();
    // 건강: 나이가 들면 최대치가 내려가고, 크게 다치거나 앓은 뒤에는 조금씩 회복한다
    const hm=hMaxAt(this.age); const hT=Math.min(hm,this.C.hb+H_OFF+6); if(!f.dying&&!this.dead&&s.h<hT-4) s.h+=Math.min(hT-4-s.h,1.8*step); s.h=Math.min(s.h,hm);
    // 행복: 목표값 = 건강 25% · 관계 25% · 돈 걱정 없음 15% · 일·꿈 20% · 경험 15%. 해마다 30%씩 다가간다
    s.j=clamp(jPre+(this._dj||0),0,100); const tg=clamp(50+2.2*(this.joyTarget()-60),2,98); s.j+=(1-Math.pow(.7,step))*(tg-s.j);
    for(const k of ['h','j','k','r','t','e']) s[k]=clamp(s[k],0,100);
    if(this.dead) s.h=0;
    const H=this.hist[this.hist.length-1]; if(H&&H.a===a) Object.assign(H,{h:Math.round(this.dead?0:s.h),j:Math.round(s.j),k:Math.round(s.k),r:Math.round(s.r),t:Math.round(s.t),e:Math.round(s.e)});
    return res; };
  const _load=Life.load; Life.load=function(o){ const L=_load.call(this,o); try{ ensureV2(L); }catch(e){} return L; };
})();
// 기술이 높을수록 원하는 일자리를 얻기 쉽다
jobP=(old=>(L,j)=>clamp(old(L,j)+(L.s&&L.s.t!=null?(L.s.t-35)/100*.35:0),.04,.96))(jobP);

