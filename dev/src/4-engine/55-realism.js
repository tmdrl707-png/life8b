/* ========== 현실감 다듬기 (11-13) ==========
   여러 판을 돌려 보니 같은 이야기가 한 삶에 지나치게 자주 나왔다(한국 기준: 축구 국가대표 응원 7번 이상, 태풍에 지붕이 날아감 5번,
   '우리 동네 대표'로 대회에 거듭 나감 등). 그래서
   · 주제 예산(THB): 같은 주제가 다시 나오기까지의 간격(해)과 한 삶에서의 최대 횟수. 달력·큰 사건·해의 사건·작은 장면 모두에 적용된다.
     실제로 겪은 일(remember)을 세어 Life.thN / Life.thL 에 남긴다(저장되며, 예전 저장에는 없어도 된다).
   · 큰 재해 피해(지붕이 날아감·집이 잠김·피란 …)는 나라 형편에 따라 한 삶에 1~4번까지.
   · 달력의 같은 일 하나는 한 삶에 CAL_MAX번까지 (학기·시험처럼 해마다 꼭 있는 일은 제외).
   · 운동: 나라에서 인기 있는 종목 가운데 '내 운동'(f.spt)을 정해 {sport} 자리에 쓴다. 국가대표 경기는 그 나라 대표 종목 그대로.
   · 구경·응원·집에서 쉬기 같은 소극적인 작은 선택은 '확실'(실패하지 않는다). */
const THB=[ // [이름, 문장 규칙, 간격(해), 최대 횟수] — 간격·횟수는 (L)=>값 으로도 쓴다
  ['natTeam',/국가대표|대표 선수들이 이긴|대표팀이 이긴|대표 팀이 이긴|큰 경기가 있는 날|대표팀 경기|대표 팀 경기|슈퍼볼|월드컵/,4,5],
  ['sportRep',/동네 대표로|대표 선수로 뛴|동네 대회에서|학교 대항 .{0,10}대회|마을 대항 .{0,10}대회|팀 선수를 뽑는다|지역 대회에 나갔/,3,L=>L.f.ch&&L.f.ch.athlete!=null?6:3],
  ['hzSevere',/지붕[^.]{0,8}날아|집이 (엉망|무너|부서|불에|물에)|집 안까지 물|대피소|피란|피난|구조를 기다|마을이 (물에|재에)|동네가 물에 잠|벽에 금이|집을 잃|크게 부서|살림이 물에|물이 들이쳐/,L=>[6,6,8,12,15][L.C.tier]||8,L=>[4,4,3,2,1][L.C.tier]||2],
  ['storm',/태풍|폭풍|허리케인|사이클론|토네이도/,3,L=>L.C.tier>=4?6:9],
  ['quake',/지진|땅이 (크게 )?흔들/,L=>L.c==='JP'?3:6,L=>L.c==='JP'?8:4],
  ['flood',/홍수|물에 잠|강물이 넘|큰비|물이 불어/,4,L=>L.C.tier>=4?5:7],
  ['drought',/가뭄|비가 오지 않|우물이 말|물이 귀/,5,L=>L.C.tier>=4?2:6],
  ['fire',/산불|숲에 큰불/,6,3],
  ['heat',/폭염|숨이 막히는 더위/,3,7],
  ['cold',/한파|영하 30|혹독한 추위/,4,6],
  ['checkup',/건강검진/,4,6],
  ['prices',/물가가 크게 올랐/,8,4],
  ['housePx',/집값이 (다시 )?오른/,6,4],
  ['homecome',/귀성|고향에 다녀오려면|고향으로 가는 길/,3,8],
  ['vacation',/휴가/,2,12],
  ['tornado',/토네이도/,6,3],
  // 사람과의 작은 일도 같은 장면이 몇 해마다 되풀이되지 않게
  ['friendSick',/친구 .{0,14}아프다는 소식/,8,2], ['fundraise',/돕는 모금/,8,3], ['moveHelp',/이삿짐을 나르/,10,2], ['oldFriend',/안부를 물어 왔다|오랜만에 보자고/,6,4],
  ['doctorEx',/운동을 권했다/,10,2], ['kidGreet',/동네 아이가 인사를/,8,3], ['bossTeach',/일을 가르쳐 달라고/,8,3],
];
const thbVal=(v,L)=>typeof v==='function'?v(L):v;
function thbKeys(t){ t=String(t||''); const ks=[]; for(const th of THB) if(th[1].test(t)) ks.push(th); return ks; }
// 사건 하나가 품은 모든 문장(질문과 결과)을 이어 붙인다 — 결과에만 큰 피해가 들어 있는 사건도 잡아내기 위해
function thbText(x){ if(!x) return ''; const p=[]; const add=v=>{ if(Array.isArray(v)) v.forEach(add); else if(typeof v==='string') p.push(v); };
  add(x.txt); add(x.txts); (x.opts||[]).forEach(o=>{ add(o.l); add(o.res); add(o.ok); add(o.fail); }); return p.join(' / '); }
function thbOK(L,x){ if(!x||(x.txt==null&&!x.opts)) return true; if(x._thb===undefined) x._thb=thbKeys(thbText(x)); if(!x._thb.length) return true;
  const N=L.thN||{}, A=L.thL||{}, a=L.age;
  for(const th of x._thb){ const k=th[0]; if((N[k]||0)>=thbVal(th[3],L)) return false; if(A[k]!=null&&a-A[k]<thbVal(th[2],L)) return false; }
  return true; }
const CAL_MAX=5;
(function(){ const P=Life.prototype;
  // 겪은 일을 센다
  const _rem=P.remember; P.remember=function(o){ const r=_rem.apply(this,arguments);
    try{ if(o&&o.t&&o.a!=null){ const ks=thbKeys(o.t+' / '+(o.q||'')); if(ks.length){ const N=this.thN||(this.thN={}), A=this.thL||(this.thL={}); ks.forEach(th=>{ N[th[0]]=(N[th[0]]||0)+1; A[th[0]]=o.a; }); } } }catch(e){}
    return r; };
  // 큰 사건 · 해의 사건 · 작은 장면 · 미션: inC로 걸러진다
  const _inC=P.inC; P.inC=function(x){ if(!_inC.call(this,x)) return false; return thbOK(this,x); };
  // 달력의 일
  const _cc=P.calCtx; P.calCtx=function(ev,st,sy){ if(ev&&ev.id!=null&&ev.txt!=null){ if(!thbOK(this,ev)) return null;
      const n=this.calN&&this.calN[ev.id]; if(n){ const lim=ev.mx||(!ev.k&&!ev.ex&&!ev.c.some(t=>/^(x1|x2|yr:|ep:|svc|army)/.test(t))?CAL_MAX:0); if(lim&&n>=lim) return null; } }
    return _cc.call(this,ev,st,sy); };
  const _cd=P.calDo; P.calDo=function(k,oi){ const it=this.cur&&this.cur.cal&&this.cur.cal[k], ev=it&&!it.done&&!it.dyn?this.calEv(it):null; const r=_cd.apply(this,arguments);
    if(r&&ev&&ev.id!=null){ const N=this.calN||(this.calN={}); N[ev.id]=(N[ev.id]||0)+1; } return r; };
})();

/* ---------- 명절 음식: 명절 문장에는 평소 음식 대신 그 명절의 음식을 (추수감사절의 햄버거, 추석의 김치찌개 같은 어색함을 없앤다) ---------- */
const FEST_FOOD={KR:'송편과 전',US:'칠면조 요리',JP:'오세치 요리',VN:'반쯩(찹쌀떡)',PH:'레촌(통돼지 구이)',MX:'죽은 자의 빵',RU:'올리비에 샐러드',GB:'구운 감자와 소시지',
  ID:'크투팟(쌀떡)과 렌당',MY:'크투팟과 렌당',IN:'단 과자와 커리',PK:'시어 쿠르마(우유 국수)',BD:'판타 밧과 생선 튀김',TR:'바클라바',EG:'카흐크 과자',FR:'푸아그라와 케이크',CN:'만두(자오쯔)'};
/* ---------- 운동: '내 운동'과 나라의 대표 종목 ---------- */
const SPORT_POOL={KR:['축구','야구','농구','배구','배드민턴','태권도'],JP:['야구','축구','농구','배구'],CN:['농구','탁구','배드민턴','축구'],US:['미식축구','야구','농구','축구'],
  IN:['크리켓','배드민턴','하키','축구'],PK:['크리켓','하키','축구'],BD:['크리켓','축구'],PH:['농구','배구','배드민턴'],ID:['배드민턴','축구','배구'],VN:['축구','배드민턴','배구'],
  GB:['축구','럭비','크리켓','테니스'],FR:['축구','럭비','농구','핸드볼'],DE:['축구','핸드볼','농구'],IT:['축구','배구','농구'],ES:['축구','농구','테니스'],RU:['아이스하키','축구','농구'],
  BR:['축구','배구','풋살'],MX:['축구','야구','복싱'],AR:['축구','농구','하키'],CA:['아이스하키','농구','축구'],AU:['호주식 풋볼','크리켓','럭비','축구'],NG:['축구','농구','달리기'],
  ET:['달리기','축구'],KE:['달리기','축구','럭비'],EG:['축구','핸드볼','스쿼시'],TR:['축구','농구','배구'],IR:['레슬링','축구','배구'],TH:['무에타이','축구','배구']};
(function(){ const P=Life.prototype;
  P.mySport=function(){ const f=this.f; if(f.spt) return f.spt; const C=this.C, pool=SPORT_POOL[this.c]||[C.sport,'축구','달리기'].filter((x,i,a)=>a.indexOf(x)===i);
    f.spt=R()<.4?pool[0]:pool[Math.floor(R()*pool.length)]; return f.spt; };
  // {sport}: 국가대표·큰 경기는 그 나라의 대표 종목, 그 밖(동네 놀이·대회·모임·선수 생활)은 내 운동
  const RX_NAT=/국가대표|대표 선수들이|대표팀|대표 팀|큰 경기가 있는 날|온 나라가|이긴 날|중계/;
  const JS=/^(을\(를\)|이\(가\)|은\(는\)|와\(과\)|\(으\)로|과\(와\)|를\(을\)|가\(이\)|는\(은\))/;
  const _tx=P.tx; P.tx=function(s){ if(s&&typeof s==='string'&&s.indexOf('{fest}')>=0&&s.indexOf('{food}')>=0&&FEST_FOOD[this.c]){ const w=FEST_FOOD[this.c]; s=s.replace(/\{food\}(을\(를\)|이\(가\)|은\(는\)|와\(과\)|\(으\)로|과\(와\)|를\(을\)|가\(이\)|는\(은\))?/g,(m,p)=>{ if(!p) return w; const pr={'을(를)':['을','를'],'이(가)':['이','가'],'은(는)':['은','는'],'와(과)':['과','와'],'(으)로':['으로','로'],'과(와)':['과','와'],'를(을)':['을','를'],'가(이)':['이','가'],'는(은)':['은','는']}[p]; return josa(w,pr[0],pr[1]); }); }
    if(s&&typeof s==='string'&&s.indexOf('{sport}')>=0){ const w=RX_NAT.test(s)?this.C.sport:this.mySport();
      s=s.replace(/\{sport\}(을\(를\)|이\(가\)|은\(는\)|와\(과\)|\(으\)로|과\(와\)|를\(을\)|가\(이\)|는\(은\))?/g,(m,p)=>{ if(!p) return w; const pr={'을(를)':['을','를'],'이(가)':['이','가'],'은(는)':['은','는'],'와(과)':['과','와'],'(으)로':['으로','로'],'과(와)':['과','와'],'를(을)':['을','를'],'가(이)':['이','가'],'는(은)':['은','는']}[p]; return josa(w,pr[0],pr[1]); }); }
    return _tx.call(this,s); };
  // 선수로 뛰는 팀 이름도 종목에 맞게
  const _co=companyOf; companyOf=function(L,j){ if(j&&j.id==='athlete'){ const sp=L.mySport(), t=L.place||L.town; if(sp!=='축구') return L.c==='KR'?`${t} ${sp}단`:`${t} ${sp} 팀`; } return _co(L,j); };
})();

/* ---------- 큰 사건: 재해는 나라 형편에 맞게, 운동 대회는 운동을 하는 사람에게 한 번 ---------- */
(function(){
  const fixM=(head,x)=>{ MAJORS.forEach(m=>{ const t=Array.isArray(m.txt)?m.txt[0]:m.txt; if(String(t).startsWith(head)) Object.assign(m,x); }); };
  fixM('큰비로 강물이 넘쳐 동네가 물에 잠겼다',{maxTier:3}); fixM('땅이 크게 흔들렸다. 지진이다',{maxTier:3}); fixM('큰 폭풍이 다가온다는 소식이 왔다',{maxTier:3});
  fixM('비가 오지 않아 물이 귀해졌다',{maxTier:2}); fixM('숨이 막히는 더위가 며칠째',{maxTier:3}); fixM('혹독한 추위와 큰 눈으로 길이 끊겼다',{maxTier:3});
  fixM('산불이 번져 연기가 하늘을 덮었다',{set:'R'});
  fixM('{sport} 대회에 우리 동네 대표로',{rep:0,req:'sporty'}); fixM('{sport} 동네 대회에서 결승에',{rep:0});
})();

/* ---------- 해마다 반복되던 일 · 나라에 맞지 않던 일 ---------- */
(function(){
  // 해의 사건 가운데 돈·일의 흐름과 어긋나는 것 (집은 '집 마련' 선택으로만 생기고, 일은 '일자리' 흐름으로만 잃는다)
  EVENTS.forEach(e=>{ const t=String(e.txt||'');
    if(t==='오래 일한 끝에 내 집을 마련했다.') e.a=[999,999];
    if(t==='일자리를 잃고 몇 달을 쉬었다.') e.txt='일감이 줄어 몇 달 동안 벌이가 시원찮았다.';
    if(t==='집세가 올라 더 작은 집으로 옮겼다.') e.req='renter';
    if(t==='자녀가 독립해 집이 조용해졌다.') e.req='grownkid'; });
  // 종교의 날: 어느 나라에서나 자연스러운 모습으로 (수호성인 행렬은 남유럽·중남미, 탁발 공양은 동남아의 일)
  try{ const ca=RELF['가톨릭']; ca.forEach((x,i)=>{ if(/수호성인 축일/.test(x[1])) ca[i]=[0,'축일 미사가 끝나고 성당 마당에서 신자들과 음식을 나눠 먹었다.',null]; });
    const bu=RELF['불교']; bu.forEach((x,i)=>{ if(/스님들께 밥을 공양/.test(x[1])) bu[i]=[0,'절에 쌀과 초를 올리고 가족의 건강을 빌었다.',null]; }); }catch(e){}
  // 나라를 대표하는 동물을 '보러 가는' 일은 동물이 귀한 곳에서만 어울린다 (한국의 까치처럼 흔한 새는 나들이 대상이 아니다)
  try{ if(COUNTRIES.KR) COUNTRIES.KR.animal='두루미'; }catch(e){}
  // 달력: 전국 단위로 '온 나라가' 들썩이는 응원은 몇 해에 한 번
  CAL.forEach(ev=>{ const t=String(ev.txt||'');
    if(/국가대표 경기를 보며|축구 국가대표|국가대표 경기를 보았다|슈퍼볼 경기/.test(t)){ ev.cd=Math.max(ev.cd||0,4); ev.mx=4; }
    if(/김장|꽃놀이\(하나미\)|본오도리|추수감사절, 온 가족이|홍바오|귀성 기차표/.test(t)){ ev.mx=6; ev.cd=Math.max(ev.cd||0,2); }
    if(/토네이도 경보/.test(t)){ ev.cd=Math.max(ev.cd||0,6); ev.mx=3; }
    if(/사이클론 경보가 울려 마을 대피소/.test(t)){ ev.cd=Math.max(ev.cd||0,6); }
    if(/^부모님 없이 맞는/.test(t)){ ev.mx=2; ev.cd=Math.max(ev.cd||0,5); }
    // 야간 자율 학습·PC방은 동아시아 학교의 모습, 노래방은 동아시아·동남아와 살림이 넉넉한 나라에서
    if(/^밤늦게까지 남아 공부하는 자율 학습/.test(t)) ev.c.push('rg:EA');
    if(/^동네 노래방\(가라오케\)/.test(t)) ev.c.push('t3|rg:SE|rg:EA');
  });
})();

/* ---------- 작은 선택: 소극적인 선택은 실패하지 않는다 ---------- */
const RX_HONEST=/돌려 드린다|돌려준다|돌려 준다|사실대로|솔직하게 말|정직하게|그대로 드린다|주인을 찾아|경찰서에 맡/;
const RX_PASSIVE=/구경|들여다본|바라본|올려다본|웃는다|웃어 준|까르르|잠든다|안긴다|품에|귀 기울|듣는다|감사한다|떠올린다|돌아본다|생각한다|응원|지켜본|지켜보|멀리서만|집에 있|집에서 (쉰|쉬|조용|지낸)|쉰다|쉬기로|듣기만|소리만|할 일을 먼저|그냥 |넘어간|모른 척|관심 없|귀찮|빠진다|빠지겠|거절|사양|돌아선|평소처럼|하던 일을|참는다|기다린다|미룬다|양보한다|따른다/;
(function(){ const P=Life.prototype, _op=P.optP;
  SCENES.forEach(sc=>{ if(sc.req==='dying') sc.opts.forEach(o=>o.sure=1); });   // 마지막 시간의 선택(고맙다는 말 …)은 실패하지 않는다
  P.optP=function(o){ if(o&&o.sure) return null; if(this.age<6&&o&&optGain(o).g<=4) return null;   // 아기·어린아이의 작은 선택(웃기, 들여다보기 …)은 실패하지 않는다
    if(o&&RX_PASSIVE.test(String(o.l||''))&&optGain(o).g<=3) return null;
    if(o&&!o.tr&&optGain(o).g<=1) return null;                                // 얻는 것이 아주 작은 선택(행복 +1 같은)도 확실
    if(o&&RX_HONEST.test(String(o.l||''))) return null;                        // 정직·양심의 선택은 '내가 그렇게 한다'는 것 (실패하지 않는다)
    return _op.call(this,o); };
})();

/* ---------- 달력: 한 해를 짤 때와 일이 일어날 때 사이에 형편이 바뀌면(집을 샀다, 일을 잃었다 …) 맞지 않게 된 일은 건너뛴다 ---------- */
(function(){ const P=Life.prototype, _ev=P.calEv, RX_STATE=/^!?(rent|house|kid|nokid|fam|sgl|wid|w|nj|ret|debt|mar|pet|gk|inf|frm|uniS|mig|jk:|jn:)/;
  P.calEv=function(it){ const ev=_ev.call(this,it); if(!ev||!it||it.dyn||it.done||!ev.c) return ev;
    const tk=ev.c.filter(t=>RX_STATE.test(t)); if(tk.length&&this.calCtx({c:tk},this.stageOf(),sysOf(this))==null) return null; return ev; };
})();
/* ---------- 새로 더한 달력의 일 (맨 뒤에 더해야 예전 저장의 번호가 바뀌지 않는다) ---------- */
Y(65,95,'ret','*','{penN}이(가) 들어오는 날, 시장에 가서 좋아하는 과일을 샀다.','j2',{cd:4,sc:'money'});
Y(65,95,'ret kid','*','자녀들이 보내 준 돈으로 한 달 살림을 꾸렸다. 고마운 마음과 미안한 마음이 함께였다.','j1 r2',{cd:6,sc:'money'});
Y(16,18,'h !rg:EA','*','시험 기간이다. 방과 후 학교 도서관에 남아 공부하는 친구들이 많다.',[['도서관 불이 꺼질 때까지 남는다','k2 D h-1','도서관 불이 꺼질 때까지 남아 공부했다.'],['집중이 잘되는 곳을 따로 찾는다','k2 C','집 근처 조용한 곳에서 내 속도로 공부했다.'],['친구들과 놀러 나간다','j2 k-2','친구들과 밤늦게까지 놀았다. 시험지가 조금 낯설었다.']],{k:'h_night',sc:'school'});
setPd(CAL[CAL.length-1].opts);
/* ---------- 예전 저장: 달력의 일 번호가 바뀌었으면 올해 남은 일을 다시 짠다 ---------- */
const CAL_SIG=CAL.length;
(function(){ const _ld=Life.load; Life.load=function(o){ const L=_ld.call(this,o);
  try{ if(L.calSig!==CAL_SIG){ if(L.cur&&L.cur.cal){ if(!L.cur.cal.some(it=>it.done)) L.cur.cal=null; else L.cur.cal.forEach(it=>{ if(!it.done&&!it.dyn) it.done=1; }); }
      if(L.calSig!=null||L.calUsed) L.calUsed={}; L.calN={}; L.calSig=CAL_SIG; } }catch(e){}
  return L; }; })();
(function(){ const P=Life.prototype, _pc=P.planCal; P.planCal=function(){ this.calSig=CAL_SIG; return _pc.apply(this,arguments); }; })();
