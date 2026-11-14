/* =====================================================================
   [가족] 부모님 · 형제자매 · 조부모 · 가족의 종교 · 가족에게 일어나는 일
   - 태어날 때: 부모님의 나이와 일, 위아래 형제자매(그 나라 출산율에 맞춰), 네 분의 조부모, 가족의 종교
   - 해마다: 동생이 태어나고, 형제자매가 학교에 가고 결혼해 집을 떠나고, 조부모·부모님이 나이 들어 떠나신다
   ===================================================================== */
// 가족의 종교 (대략의 비율 · Pew Research Center 2020, 각국 인구조사 등)
const RELG={
  KR:[['종교 없음',51],['개신교',20],['불교',17],['가톨릭',11]], KP:[['종교 없음',100]], JP:[['종교 없음',62],['불교',33],['기독교',2]],
  CN:[['종교 없음',52],['민간 신앙',22],['불교',18],['기독교',5],['이슬람',2]], TW:[['민간 신앙',44],['불교',21],['종교 없음',24],['기독교',6]], MN:[['불교',53],['종교 없음',39],['이슬람',3]],
  IN:[['힌두교',79],['이슬람',15],['기독교',2],['시크교',2],['불교',1]], PK:[['이슬람',96],['힌두교',2],['기독교',2]], BD:[['이슬람',91],['힌두교',8]], NP:[['힌두교',81],['불교',9],['이슬람',5]], LK:[['불교',70],['힌두교',13],['이슬람',10],['기독교',7]], AF:[['이슬람',100]],
  ID:[['이슬람',87],['개신교',7],['가톨릭',3],['힌두교',2]], PH:[['가톨릭',79],['개신교',10],['이슬람',6]], VN:[['종교 없음',73],['불교',15],['가톨릭',7]], TH:[['불교',93],['이슬람',5]], MM:[['불교',88],['기독교',6],['이슬람',4]], MY:[['이슬람',63],['불교',19],['기독교',9],['힌두교',6]], KH:[['불교',97]],
  NG:[['이슬람',50],['기독교',48],['전통 신앙',2]], ET:[['에티오피아 정교회',43],['이슬람',34],['개신교',19],['전통 신앙',3]], CD:[['개신교',45],['가톨릭',30],['기독교',20],['이슬람',2]],
  TZ:[['기독교',63],['이슬람',34]], KE:[['개신교',60],['가톨릭',20],['이슬람',11]], UG:[['개신교',45],['가톨릭',39],['이슬람',14]], ZA:[['기독교',80],['전통 신앙',10],['종교 없음',8]], GH:[['기독교',71],['이슬람',20],['전통 신앙',5]],
  SD:[['이슬람',97],['기독교',3]], SS:[['기독교',60],['전통 신앙',33],['이슬람',6]], EG:[['이슬람',90],['콥트 정교회',10]], MZ:[['기독교',59],['이슬람',19],['전통 신앙',18]], AO:[['가톨릭',41],['개신교',38],['전통 신앙',10]],
  CM:[['기독교',70],['이슬람',25]], CI:[['이슬람',42],['기독교',39],['전통 신앙',12]], MG:[['기독교',85],['전통 신앙',5]], ER:[['이슬람',50],['에리트레아 정교회',40]],
  US:[['개신교',40],['종교 없음',28],['가톨릭',20],['유대교',2],['이슬람',1]], CA:[['가톨릭',30],['종교 없음',35],['개신교',20],['이슬람',5]], MX:[['가톨릭',78],['개신교',11],['종교 없음',8]],
  BR:[['가톨릭',50],['개신교',31],['종교 없음',10]], AR:[['가톨릭',63],['종교 없음',19],['개신교',15]], CO:[['가톨릭',70],['개신교',17],['종교 없음',10]],
  RU:[['러시아 정교회',63],['종교 없음',20],['이슬람',10]], UA:[['우크라이나 정교회',75],['종교 없음',12],['가톨릭',9]], TR:[['이슬람',97]], IR:[['이슬람',99]], IQ:[['이슬람',98]], SA:[['이슬람',100]], IL:[['유대교',74],['이슬람',18],['기독교',2]],
  DE:[['종교 없음',45],['가톨릭',24],['개신교',22],['이슬람',6]], FR:[['가톨릭',47],['종교 없음',40],['이슬람',8]], GB:[['기독교',46],['종교 없음',37],['이슬람',6]], IT:[['가톨릭',80],['종교 없음',15]], ES:[['가톨릭',60],['종교 없음',36]], PL:[['가톨릭',85],['종교 없음',8]]
};
const RELG_RG={EA:[['종교 없음',60],['불교',25],['기독교',10]],SE:[['불교',35],['이슬람',35],['가톨릭',20],['개신교',10]],SA:[['이슬람',65],['힌두교',25],['불교',10]],CA:[['이슬람',85],['정교회',10],['종교 없음',5]],
  ME:[['이슬람',95],['기독교',4]],AF:[['기독교',50],['이슬람',40],['전통 신앙',10]],EU:[['가톨릭',40],['종교 없음',35],['개신교',15],['정교회',5]],EE:[['정교회',60],['종교 없음',20],['가톨릭',15],['이슬람',5]],
  NA:[['개신교',40],['종교 없음',28],['가톨릭',20]],LA:[['가톨릭',60],['개신교',25],['종교 없음',12]],OC:[['기독교',70],['종교 없음',25]]};
const pickW=arr=>{ let r=R()*arr.reduce((t,x)=>t+x[1],0); for(const x of arr){ r-=x[1]; if(r<0) return x[0]; } return arr[0][0]; };
// 부모님 일: 사는 곳 · 형편에 따라 (넉넉 · 보통 · 어려움)
const PJOB={R:[['농장 경영','정미소 주인','마을 가게 주인','교사','가축 농장 주인'],['농부','어부','목수','마을 가게 주인','버스 운전기사','대장장이'],['소농','농장 일꾼','날품팔이','목동','소작농','벽돌 굽는 일']],
  U:[['사업가','의사','엔지니어','회사 관리자','변호사','대학교수'],['회사원','교사','공무원','간호사','자영업자','택시 기사','공장 기술자'],['건설 노동자','시장 상인','공장 노동자','경비원','청소 노동자','배달 일','오토바이 택시 기사']]};
const MJOB={R:[['교사','가게 주인','보건소 간호사'],['농부','시장 상인','삯바느질','양계'],['농장 일꾼','시장 상인','날품팔이','물 긷는 일']],U:[['약사','교사','회사원','디자이너','의사'],['회사원','간호사','미용사','교사','가게 점원','은행원'],['가사 도우미','시장 상인','공장 노동자','식당 일','길거리 음식 장사']]};
// 아이가 자라는 동안 부모님이 헤어질 확률(대략, 나라별 이혼율을 바탕으로 한 추정)
const DIV={US:.3,RU:.35,UA:.3,BY:.3,KZ:.25,KR:.12,JP:.15,CN:.1,BR:.2,MX:.12,AR:.2,CO:.15,CL:.15,CA:.25,AU:.25,NZ:.25,GB:.25,FR:.28,DE:.25,ES:.25,IT:.15,PL:.18,SE:.3,DK:.3,FI:.3,NO:.28,PH:.01,IN:.015,PK:.03,BD:.04,AF:.01,IR:.08,TR:.08,EG:.08,SA:.08,ID:.06,VN:.05,TH:.1,NG:.05,ET:.08,CD:.05,KE:.06,ZA:.12};
const DIV_RG={EA:.1,SE:.06,SA:.02,CA:.12,ME:.06,AF:.06,EU:.25,EE:.3,NA:.25,LA:.18,OC:.2};
// 마흔 이후, 한 해 동안 세상을 떠날 확률 (그 나라의 수명 기준에 맞춘 곰페르츠 곡선)
const qAge=(C,x,k)=>x<40?.0015+C.u5/60000:clamp((.0005+.05*Math.exp(.095*(x-C.ref)))*(k||1),0,.85);
function aliveTo(C,x){ for(let y=Math.max(18,x-60);y<x;y++) if(R()<qAge(C,y,.95)) return false; return true; }
// 형제자매를 부르는 말 (나를 기준으로)
function sibTerm(L,s){ const fam=L.fam, me=L.sex, same=fam.sibs.filter(t=>t.al!==0&&t.born&&(t.d<0)===(s.d<0)&&t.sx===s.sx), base=s.d<0?(me===0?(s.sx===0?'형':'누나'):(s.sx===0?'오빠':'언니')):(s.sx===0?'남동생':'여동생');
  if(same.length<2) return base; const i=same.sort((x,y)=>x.d-y.d).indexOf(s), n=same.length;
  if(s.d<0) return (i===0?'큰':n===2?'작은':['','둘째 ','셋째 ','넷째 ','다섯째 '][i]||'')+base;
  return (i===n-1&&n>1?'막내 ':i===0?'큰 ':['','둘째 ','셋째 ','넷째 '][i]||'')+base; }
function initFamily(L,o){ const C=L.C, c=L.c, P=L.ppl, U=L.set==='U', w=L.famI, ord=nameOrder(c);
  const rel=pickW(RELG[c]||RELG_RG[C.rg]||[['종교 없음',1]]);
  // 가족의 종교에 맞는 이름 (인도의 무슬림·시크교 가정, 나이지리아·에티오피아의 무슬림 가정)
  const np=c==='IN'&&rel==='이슬람'?'IN_MUS':c==='IN'&&rel==='시크교'?'IN_SIKH':c==='NG'&&rel==='이슬람'?'NG_MUS':c==='NG'?'NG_CHR':c==='ET'&&rel==='이슬람'?'ET_MUS':null;
  if(np&&!(o&&o.keep)){ L.npool=np; L.sur=pickSur(L); const ms=ord==='kr'?pickSur(L,L.sur):L.sur; P.dad={n:joinName(c,L.sur,pickGiven(L,0,'mid'))}; P.mom={n:joinName(c,ms,pickGiven(L,1,'mid'),1)}; if(P.gran) P.gran={n:joinName(c,L.sur,pickGiven(L,1,'old'),1)}; }
  const sur=L.sur, momSur=ord==='kr'?String(P.mom.n).slice(0,1):pickSur(L,sur);
  const mMean=c==='KR'?33.5:c==='JP'?31.5:c==='CN'?28:[24,25.5,27.5,30.5][C.tier-1];
  const ma=Math.round(clamp(mMean+gauss()*4.5,17,44)), da=Math.round(clamp(ma+2.5+gauss()*3,ma-2,ma+14));
  const PJ=C.tier>=3&&U&&w===2?['건설 노동자','택배 기사','공장 노동자','경비원','청소 노동자','식당 일','대리운전 기사']:PJOB[L.set][w], dj=(!U&&C.tier<=2&&R()<.35&&/농|어부|고기|양식|목동|양치기|가축|목장|가우초|재배|낙타|순록/.test(C.work))?C.work:pickOne(PJ), mWork=R()<clamp((C.flfp||.5)*(U?1.05:.9),.05,.95), mj=mWork?pickOne(MJOB[L.set][w]):'집안일';
  // 형제자매: 한 집의 아이 수(나 포함)는 그 나라 출산율을 따른다
  let n=1+poisson(Math.max(.25,(C.tfr||2.2)-.6)); if(o&&o.sib===true) n=Math.max(n,2); if(o&&o.sib===false) n=1; n=Math.min(n,9);
  let older=Math.floor(R()*n); if(o&&o.sib===true&&older===n-1&&R()<.5) older=Math.max(0,n-2);
  const sibs=[]; let d=0;
  for(let i=0;i<older;i++){ d-=Math.max(1,Math.round(1.5+R()*2.5)); if(ma+d<17) break; sibs.push({d}); }
  d=0; for(let i=0;i<n-1-older;i++){ d+=Math.max(1,Math.round(1.5+R()*2.5)); if(ma+d>43) break; sibs.push({d}); }
  sibs.forEach(s=>{ s.sx=R()<.51?0:1; s.g=pickGiven(L,s.sx,'now'); s.n=joinName(c,sur,s.g,s.sx===1); s.born=s.d<=0?1:0; s.al=1; });
  // 조부모 네 분
  // 성: 친할아버지는 나와 같은 성, 외할아버지는 엄마의 본래 성. 한국·중국처럼 결혼해도 성을 바꾸지 않는 곳에서는 할머니들의 성이 따로 있다
  const gsur={친할아버지:sur,친할머니:ord==='kr'?pickSur(L,sur):sur,외할아버지:momSur,외할머니:ord==='kr'?pickSur(L,momSur):momSur};
  const gp=[['친할아버지',0,da],['친할머니',1,da],['외할아버지',0,ma],['외할머니',1,ma]].map(([k,sx,pa])=>{ const ag=Math.round(pa+(sx===0?27:24)+gauss()*4);
    return {k,sx,a0:ag,n:joinName(c,gsur[k],pickGiven(L,sx,'old'),sx===1),al:aliveTo(C,ag)?1:0}; });
  if(L.gran){ const g=gp.find(x=>x.sx===1&&x.al&&x.k==='친할머니')||gp.find(x=>x.sx===1&&x.al)||gp[1]; g.al=1; g.home=1; P.gran={n:g.n}; }
  L.fam={mom:{n:P.mom.n,a0:ma,job:mj,al:1},dad:{n:P.dad.n,a0:da,job:dj,al:1},sibs,gp,rel,home:w===0||(!U&&R()<.8)?'자가':R()<.5?'자가':'셋집'};
  const ab0={LA:.18,AF:.12,NA:.12,EE:.1,EU:.07,OC:.08}[C.rg]||.03; if(!(o&&o.dad)&&R()<ab0*(w===2?1.4:w===0?.5:1)) { L.f.div='dad'; L.f.dad0=1; }
  L.sib=sibs.some(s=>s.born); L.refreshSib(); }

Object.assign(Life.prototype,{
  // 지금 집에서 함께 지내는 형제자매 (나이가 가장 가까운 사람)
  homeSibs(){ const f=this.fam; if(!f) return []; return f.sibs.filter(s=>s.born&&s.al&&!s.away&&!s.mar&&this.age-s.d<30); },
  refreshSib(){ const f=this.fam; if(!f) return; const hs=this.homeSibs().sort((x,y)=>Math.abs(x.d)-Math.abs(y.d)); const s=hs[0]; if(s){ this.ppl.sib={n:s.n,sex:s.sx,d:s.d}; this.sib=true; } else { this.sib=false; } },
  sibAge(s){ return this.age-s.d; },
  famAge(p){ return p.a0+this.age; },
  sibName(s){ return sibTerm(this,s)+' '+(s.g||s.n); },
  // 가족 이야기: 이 기간(한 해 또는 두 해)에 가족에게 일어날 일들을 미리 정한다. 달력의 다른 일과 함께 달마다 찾아온다
  famPlan(){ const out=[], f=this.fam, a=this.age, step=this.step, C=this.C, L=this; if(!f||this.f.dying) return out;
    const add=(d)=>out.push({dyn:Object.assign({sc:'life'},d),m:d.m||null,done:0});
    const dadT=()=>this.f.step2&&f.step?'새아빠':'아빠';
    // 동생이 태어난다
    f.sibs.forEach((s,i)=>{ if(!s.born&&s.d>=a&&s.d<a+step) add({txt:`${s.sx?'여동생':'남동생'} ${josa(s.g,'이','가')} 태어났다. ${a<4?'작은 손가락을 만져 보았다.':a<13?'처음 안아 본 동생은 생각보다 무거웠다.':'나와는 '+s.d+'살 차이다. 이제 동생을 업어 줄 수 있다.'}`,fx:{j:4,r:3},big:i===f.sibs.findIndex(x=>x.d>0),sc:'baby',act:'born:'+i,y:s.d-a}); });
    // 조부모님
    f.gp.forEach((g,i)=>{ if(!g.al) return; for(let y=0;y<step;y++){ const ga=g.a0+a+y; if(R()<qAge(C,ga,1)){ add({txt:`${g.k}께서 ${ga}세로 세상을 떠나셨다.${g.home?' 늘 곁에 계시던 분이라 집이 텅 빈 것 같았다.':a<13?' 장례식에서 어른들이 우는 모습을 처음 보았다.':' 마지막으로 찾아뵌 날이 자꾸 떠올랐다.'}`,fx:{j:g.home?-10:-5,r:1},big:!!g.home||a<20,sc:'farewell',act:'gp:'+i,y}); break; } } });
    // 부모님: 나이에 따라 세상을 떠나시기도 한다 (어릴 때 잃는 일은 드물지만, 형편이 어려운 나라일수록 잦다)
    ['dad','mom'].forEach(k=>{ const p=f[k]; if(!p.al) return; for(let y=0;y<step;y++){ const pa=p.a0+a+y; let q=qAge(C,pa,k==='dad'?1.15:.9); if(pa<45) q+=C.tier<=2?.002:.0005; if(R()<q){
      const kid=a+y<19, other=f[k==='dad'?'mom':'dad'];
      add({txt:kid?`${k==='dad'?'아빠':'엄마'}가 ${pa}세에 갑자기 세상을 떠나셨다. ${other.al?`이제 ${k==='dad'?'엄마':'아빠'} 혼자 우리를 키우신다.`:'가족이 모두 흩어질 위기였다.'} 집안 형편이 크게 어려워졌다.`:`${k==='dad'?'아버지':'어머니'}께서 ${pa}세로 세상을 떠나셨다.${(this.f.pv||0)>=6?' 함께 보낸 시간이 많아 슬픔 속에도 고마움이 컸다.':' 더 자주 찾아뵐걸 하는 마음이 오래 남았다.'}`,
        fx:kid?{j:-14,h:-2}:{j:-8},big:true,sc:'farewell',act:'par:'+k,y,nt:kid&&C.tier<=2?'전 세계 1억 4천만 명 넘는 아이가 부모 중 한 사람 이상을 잃은 채 자랍니다 (UNICEF)':null}); break; } } });
    // 부모님이 헤어지신다 · 다시 가정을 꾸리신다
    if(a>=1&&a<=16&&f.mom.al&&f.dad.al&&!this.f.div&&R()<(DIV[this.c]!=null?DIV[this.c]:DIV_RG[C.rg]||.1)/16*step){ const withMom=R()<.85;
      add({txt:`부모님이 이혼하셨다. ${withMom?'엄마':'아빠'}와 함께 살게 되었다. ${a<6?'왜 '+(withMom?'아빠':'엄마')+'가 집에 오지 않는지 한동안 매일 물었다.':(withMom?'아빠':'엄마')+'는 한 달에 한두 번 만난다.'}`,fx:{j:-10,r:-3},big:true,sc:'house',act:withMom?'div:dad':'div:mom'}); }
    if(this.f.div&&!this.f.remar&&a<=17&&R()<.12*step){ const sx=this.f.div==='dad'?0:1, nm=joinName(this.c,pickSur(this,this.sur),pickGiven(this,sx,'mid'),sx===1);
      add({txt:`${sx?'아빠':'엄마'}가 ${josa(nm,'과','와')} 재혼했다. 새${sx?'엄마':'아빠'}와 한집에 살게 되었다. 처음엔 어색했지만 조금씩 익숙해졌다.`,fx:{j:-1,r:2},big:true,sc:'wedding',act:'remar:'+nm}); }
    // 형제자매가 자라고, 결혼하고, 떠난다
    f.sibs.forEach((s,i)=>{ if(!s.born||!s.al) return; const sa=this.sibAge(s), T=sibTerm(this,s);
      if(sa>=7&&sa<7+step&&s.d>0) add({txt:`${T} ${josa(s.g,'이','가')} 초등학교에 들어갔다. 내가 쓰던 가방을 물려주었다.`,fx:{r:2},act:''});
      if(sa>=19&&sa<19+step&&!s.away&&!s.job){ const ur=this.c==='KR'?.7:[.05,.15,.35,.5][C.tier-1]+(this.famI===0?.15:this.famI===2?-.08:0);
        if(R()<ur){ s.job='대학생'; add({txt:`${T} ${josa(s.g,'이','가')} ${C.city}의 대학에 합격했다. 온 가족이 축하 저녁을 먹었다.`,fx:{j:3,r:1},sc:'grad',act:'away:'+i+':0'}); }
        else { s.job=pickOne(PJOB[this.set][Math.min(2,this.famI+ (R()<.5?0:1))]); add({txt:`${T} ${josa(s.g,'이','가')} ${s.job} 일을 시작했다. 첫 품삯으로 ${a<13?'내게 과자를 사 주었다':'부모님께 선물을 사 드렸다'}.`,fx:{r:2},sc:'job'}); } }
      if(!s.mar&&sa>=Math.max(18,(C.mar?C.mar[s.sx]:26)-3)&&sa<=45&&R()<(C.marP||.7)*.17*step){ const sp=joinName(this.c,pickSur(this,this.sur),pickGiven(this,1-s.sx,'now'),s.sx===0);
        add({txt:`${T} ${josa(s.g,'이','가')} ${josa(sp,'과','와')} 결혼했다.`,opts:[{l:'결혼식에서 축사를 한다',fx:{r:3,j:2},tr:'B',res:`떨리는 목소리로 축사를 했다. ${T}${josa(T,'이','가').slice(T.length)} 울면서 웃었다.`,fail:'축사 도중 목이 메어 말을 잇지 못했다. 그래도 하객들이 큰 박수를 쳐 주었다.'},{l:'뒤에서 조용히 일손을 돕는다',fx:{r:2},tr:'K',res:'하객 안내와 뒷정리를 도맡았다. 가족들이 고마워했다.'}],sc:'wedding',act:'sibmar:'+i+':'+sp}); }
      if(!s.away&&sa>=17&&sa<=30&&R()<(C.tier<=2?.07:.05)*step){ const ab=R()<(C.tier<=2?.35:.15), dest=ab?pickOne(ABROAD[this.c]||ABROAD['@'+C.rg]||['외국']):C.city;
        add({txt:`${T} ${josa(s.g,'이','가')} 일자리를 찾아 ${dest}(으)로 떠났다.${ab?' 공항(버스 정류장)에서 손을 오래 흔들었다.':' 명절에만 집에 온다.'}`.replace('(으)로',josa(dest,'으로','로').slice(dest.length)),fx:{j:-2,r:-1},sc:'travel',act:'away:'+i+':'+(ab?1:0)}); }
      if(s.away===2&&R()<.25*step) add({txt:`외국에서 일하는 ${T}${josa(T,'이','가').slice(T.length)} 번 돈을 집에 보내왔다. 그 돈으로 ${pickOne(['지붕을 고쳤다','동생 학비를 냈다','부모님 약값을 마련했다'])}.`,fx:{'@':a>=19?1:0,j:2},sc:'money',nt:'2023년 저소득·중간소득 나라로 보내진 해외 송금은 약 6,560억 달러로, 많은 가정의 큰 버팀목입니다 (세계은행)'});
      if(s.mar&&!s.kid&&R()<.3*step){ const sx=R()<.5?0:1; add({txt:`${T}에게 ${sx?'딸':'아들'}이 태어났다. 내게 ${sx?'조카딸이':'조카가'} 생겼다.`,fx:{j:3,r:2},sc:'baby',act:'sibkid:'+i}); }
      if(s.d>0&&sa<5&&R()<C.u5/1000*.35*step) add({txt:`${T} ${josa(s.g,'이','가')} 열병을 앓다 세상을 떠났다. 작은 신발이 오래 문 앞에 놓여 있었다.`,fx:{j:-12,r:-2},big:true,sc:'farewell',act:'sibdie:'+i,nt:'2023년 전 세계에서 약 480만 명의 아이가 다섯 살 생일을 맞지 못했습니다 (UN IGME 2024)'});
      if(sa>=40&&R()<.02*step) add({txt:`${T} ${josa(s.g,'이','가')} 크게 아파 입원했다. 형제자매가 돌아가며 병실을 지켰다.`,fx:{r:3,j:-3},sc:'hosp'});
    });
    // 아이일 때: 부모님의 일과 살림
    if(a>=3&&a<=17){
      const pj=f.dad.al&&this.f.div!=='dad'?f.dad.job:f.mom.job, farm=/농|목동|소작|일꾼|어부/.test(pj), lastB=this.f.badY;
      if((lastB==null||a-lastB>=5)&&R()<.06*step){ this.f.badY=a; add({txt:farm?`가뭄으로 농사가 잘 안돼 ${f.dad.al&&this.f.div!=='dad'?dadT():'엄마'}가 하는 ${pj} 일로 버는 돈이 반으로 줄었다. 한동안 밥상이 조용했다.`:`${dadT()}가 다니던 일터가 문을 닫았다. 새 일을 구할 때까지 한동안 저녁 밥상이 조용했다.`,fx:{j:-4},sc:farm?'drought':'jobloss',act:'poorer'}); }
      else if(R()<.05*step) add({txt:`${f.mom.job==='집안일'?'아빠':pickOne(['엄마','아빠'])}의 일이 잘되어 집안 형편이 조금 나아졌다.`,fx:{j:3},sc:'money',act:'richer'});
      if(R()<.06*step) add({txt:`${pickOne(['엄마','아빠'])}가 몸이 안 좋아 며칠 입원하셨다. ${a<10?(this.gran&&!this.f.ggone?'할머니가 대신 밥을 챙겨 주셨다.':'옆집 어른이 대신 밥을 챙겨 주셨다.'):'그동안 집안일을 내가 맡아 했다.'}`,fx:{r:2,j:-2},sc:'hosp'});
      const hs=this.homeSibs(); if(hs.length&&R()<.15*step){ const T=sibTerm(this,pickOne(hs)), W=josa(T,'과','와'); add({txt:pickOne(a<6?[`${W} 이불 속에서 술래잡기를 하다 엄마한테 혼났다.`,`${T}가 업어 줘서 동네 한 바퀴를 돌았다.`.replace(T+'가',josa(T,'이','가'))]:[`${W} 밤늦게까지 이불 속에서 이야기를 나눴다.`,`${W} 리모컨 때문에 크게 싸웠다가 저녁에 슬쩍 화해했다.`,`${W} 함께 부모님 몰래 깜짝 생일상을 차렸다.`,`${T}에게 고민을 털어놓았다. 생각보다 진지하게 들어 주었다.`]),fx:{r:2,j:2},sc:'life'}); }
    }
    // 어른이 되어: 부모님이 나이 드시고, 돌봐 드려야 할 때가 온다
    if(a>=19){ ['dad','mom'].forEach(k=>{ const p=f[k]; if(!p.al) return; const pa=p.a0+a;
      if(pa>=58&&pa<58+step&&p.job!=='집안일') add({txt:`${k==='dad'?'아버지':'어머니'}께서 평생 하던 일(${p.job})을 내려놓으셨다. 작은 퇴임 잔치를 열어 드렸다.`,fx:{r:2,j:1},sc:'job'});
      if(pa>=75&&!p.care&&R()<.25*step) add({txt:`${k==='dad'?'아버지':'어머니'}께서 ${pa}세가 되시면서 혼자 지내기 어려워지셨다.`,opts:[{l:'모시고 함께 산다',fx:{r:5,j:-2,'@':-2},tr:'K',res:'방 하나를 비워 모셨다. 저녁마다 옛이야기를 들었다.'},{l:'가까이 살며 자주 찾아뵌다',fx:{r:3,'@':-1},tr:'D',res:'주말마다 찾아뵙고 장을 봐 드렸다.'},{l:C.tier>=3?'돌봄 시설에 모시고 자주 찾아간다':'형제자매와 돌아가며 모신다',fx:{r:1,j:1,'@':-1},res:C.tier>=3?'좋은 시설을 찾아 모셨다. 찾아갈 때마다 손을 오래 잡아 드렸다.':'형제자매와 돌아가며 모셨다.'}],sc:'life',act:'care:'+k,nt:C.tier>=3?'2050년이면 세계 인구 여섯 명 중 한 명이 65세 이상이 됩니다 (UN 세계인구전망 2022)':null}); });
      if(this.f.family&&!this.f.inlaw){ const me=this.sex; add({txt:`처음으로 ${me===0?'처가':'시댁'}에 인사를 갔다. ${me===0?'장모님이':'시어머니가'} 차려 주신 {food}을(를) 두 그릇이나 먹었다.`,fx:{r:2,j:1},sc:'wedding',act:'inlaw'}); }
      if(f.sibs.some(s=>s.born&&s.al&&(s.away||s.mar))&&R()<.25*step) add({txt:pickOne(['명절에 흩어져 살던 형제자매가 모두 모였다.'+(f.sibs.some(s=>s.kid)?' 조카들이 집 안을 뛰어다녔다.':''),'형제자매 단체 대화방에 어릴 적 사진이 올라왔다. 한참 웃었다.'].concat(!this.f.pgone?['형제자매가 부모님 생신 선물 비용을 나눠 냈다.']:['형제자매가 모여 부모님 산소(묘소)를 함께 찾아갔다.'])),fx:{r:3,j:2},sc:'life'});
      if(this.f.pgone&&f.sibs.filter(s=>s.al&&s.born).length>=2&&!this.f.inh2&&R()<.2){ add({txt:'부모님이 남기신 집을 두고 형제자매 사이에 의견이 갈렸다.',opts:[{l:'양보한다',fx:{r:3,j:-1},tr:'K',res:'내 몫을 양보했다. 형제자매와의 사이는 지켰다.'},{l:'공평하게 나누자고 한다',fx:{r:-1,'@':3},tr:'B',res:'공평하게 나누기로 했다. 한동안 서먹했다.'}],sc:'house',act:'inh2'}); }
    }
    // 가족의 종교와 명절
    const rf=RELF[f.rel], ru=this.f.relU||(this.f.relU={}), cf=C.fest||''; if(rf&&R()<.45){ const dup=x=>(x[2]==='eid'&&/이드|라마단|르바란|하리 라야|타바스키/.test(cf))||(/크리스마스|성탄/.test(x[1])&&/크리스마스/.test(cf))||(/디왈리/.test(x[1])&&/디왈리/.test(cf))||(/부활절/.test(x[1])&&/부활절/.test(cf)); const ok=rf.map((x,i)=>[x,i]).filter(([x,i])=>a>=Math.max(x[0],4)&&!dup(x)&&(ru[i]==null||(!x[3]&&a-ru[i]>=6&&((this.f.relN||{})[i]||0)<5))); if(ok.length){ const [e,i]=pickOne(ok); ru[i]=a; const rn=this.f.relN||(this.f.relN={}); rn[i]=(rn[i]||0)+1; add({txt:e[1],fx:{r:2,j:2},sc:'fest',m:e[2]==='eid'?eidMonth(this.by+a):e[2]||null}); } }
    return out; },
  // 가족 이야기가 실제로 일어날 때 상태를 바꾼다
  famAct(act){ if(!act) return; const f=this.fam, [k,x,y]=act.split(':');
    if(k==='born'){ const s=f.sibs[+x]; if(s){ s.born=1; this.refreshSib(); } }
    else if(k==='gp'){ const g=f.gp[+x]; if(g){ g.al=0; g.dA=this.age; if(g.home) this.f.ggone=1; } }
    else if(k==='par'){ const p=f[x]; p.al=0; p.dA=this.age; if(!f.mom.al&&!f.dad.al){ this.f.pgone=1; const inh=this.age>=25?this.C.med*[80,15,0][this.famI]*(this.C.tier>=3?1:.5):0; if(inh>0){ this.cash+=inh; this.mEv+=inh; this.remember({a:this.age,t:`부모님이 남겨 주신 ${fmtWon(inh)}을 물려받았다.`,ev:1}); } }
      if(this.age<19){ this.famI=Math.min(2,this.famI+1); this.w=clamp(this.w-.12,0,1); } }
    else if(k==='div'){ this.f.div=x; }
    else if(k==='remar'){ this.f.remar=1; this.f.step2=1; f.step={n:x+(y?':'+y:''),sx:this.f.div==='dad'?0:1}; }
    else if(k==='sibmar'){ const s=f.sibs[+x]; if(s){ s.mar=act.split(':').slice(2).join(':'); s.cb=(s.cb||0)+6; this.refreshSib(); } }
    else if(k==='away'){ const s=f.sibs[+x]; if(s){ s.away=y==='1'?2:1; this.refreshSib(); } }
    else if(k==='sibkid'){ const s=f.sibs[+x]; if(s) s.kid=(s.kid||0)+1; }
    else if(k==='sibdie'){ const s=f.sibs[+x]; if(s){ s.al=0; s.dA=this.age; this.refreshSib(); } }
    else if(k==='poorer'){ this.w=clamp(this.w-.06,0,1); }
    else if(k==='richer'){ this.w=clamp(this.w+.06,0,1); }
    else if(k==='care'){ f[x].care=1; f[x].cb=(f[x].cb||0)+12; }
    else if(k==='inlaw'){ this.f.inlaw=1; }
    else if(k==='inh2'){ this.f.inh2=1; } },
  // 내 정보의 가족 목록
  // 가까운 정도: 함께 보낸 시간과 나의 관계 수치가 만든다
  closeTo(p,isPar){ const base=isPar?55+(this.f.pv||0)*3:50; const v=base+(this.s.r-50)*.45+(p.cb||0); return v>=68?'가까운 사이':v>=45?'무난한 사이':'서먹한 사이'; },
  famList(){ const f=this.fam, a=this.age, out=[]; if(!f) return out;
    const st=p=>p.al?`${p.a0+a}세 · ${this.closeTo(p,1)}`:`${p.dA}살 때 세상을 떠나심`;
    if(f.dad) out.push([this.f.step2&&f.step&&f.step.sx===0?'아빠(따로 지냄)':'아빠',f.dad.n,`${st(f.dad)}${f.dad.al?' · '+f.dad.job:''}${this.f.div==='dad'&&f.dad.al?' · 따로 지냄':''}`]);
    if(f.mom) out.push(['엄마',f.mom.n,`${st(f.mom)}${f.mom.al?' · '+f.mom.job:''}${this.f.div==='mom'&&f.mom.al?' · 따로 지냄':''}`]);
    if(f.step) out.push([f.step.sx===0?'새아빠':'새엄마',f.step.n.split(':')[0],'함께 사는 가족']);
    f.sibs.filter(s=>s.born).sort((x,y)=>x.d-y.d).forEach(s=>out.push([sibTerm(this,s),s.n,s.al?`${a-s.d}세 · ${this.closeTo(s)}${s.mar?' · 결혼함':''}${s.away===2?' · 외국에서 일함':s.away?' · 집을 떠나 지냄':''}${s.kid?' · 아이 '+s.kid+'명':''}`:`${s.dA}살 때 세상을 떠남`]));
    const un=f.sibs.filter(s=>!s.born).length; if(un&&a<14) out.push(['','','']);
    f.gp.forEach(g=>out.push([g.k,g.n,g.al?`${g.a0+a}세${g.home?' · 함께 삶':''}`:g.dA!=null?`${g.dA}살 때 세상을 떠나심`:'내가 태어나기 전에 돌아가심']));
    return out.filter(r=>r[0]); }
});
// 형제자매가 일하러 떠나는 곳
const ABROAD={IN:['아랍에미리트 두바이','사우디아라비아','카타르'],PK:['사우디아라비아','아랍에미리트','영국'],BD:['사우디아라비아','말레이시아','카타르'],NP:['카타르','말레이시아','한국'],PH:['사우디아라비아','홍콩','싱가포르'],
  MX:['미국'],GT:['미국'],HN:['미국'],SV:['미국'],ID:['말레이시아','사우디아라비아','대만'],VN:['한국','일본','대만'],NG:['영국','캐나다','미국'],GH:['영국','미국'],ET:['사우디아라비아','레바논'],KE:['사우디아라비아','카타르','영국'],
  EG:['사우디아라비아','쿠웨이트'],MA:['스페인','프랑스'],DZ:['프랑스'],TR:['독일'],UA:['폴란드','독일'],UZ:['러시아','한국'],TJ:['러시아'],KG:['러시아'],KR:['미국','호주'],CN:['미국','캐나다'],
  AF:['파키스탄','이란','튀르키예'],SA:['카타르'],'@SA':['사우디아라비아','아랍에미리트'],'@SE':['말레이시아','싱가포르'],'@AF':['남아프리카공화국','사우디아라비아','프랑스'],'@LA':['미국','스페인'],'@EE':['독일','폴란드'],'@EU':['영국','독일'],'@ME':['카타르','아랍에미리트'],'@CA':['러시아','카자흐스탄'],'@OC':['호주','뉴질랜드'],'@EA':['미국','일본'],'@NA':['미국']};
// 가족의 종교가 지내는 날 [몇 살부터, 문장, 달]
const RELF={
  '이슬람':[[0,'라마단이 끝나는 이드 알피트르 날, 새 옷을 입고 친척 집을 돌며 인사했다. 어른들이 용돈을 주셨다.','eid'],[12,'라마단 한 달 동안 해가 떠 있는 동안 금식했다. 해 질 녘 대추야자 한 알이 그렇게 달 수 없었다.','eid'],[0,'이드 알아드하(희생제) 날, 고기를 이웃과 형편이 어려운 집에 나눠 주었다.',null],[5,'금요일 낮, 아빠를 따라 모스크에 갔다. 수많은 사람이 나란히 엎드려 기도했다.',null],[6,'저녁마다 이웃 선생님께 쿠란 읽는 법을 배웠다.',null,1]],
  '힌두교':[[0,'디왈리 밤, 집 안팎에 등불을 밝히고 이웃과 단 과자를 나눠 먹었다.',10],[0,'홀리 축제 날, 동네 사람들과 색 가루를 뒤집어쓰고 웃었다.',3],[6,'가족과 함께 사원에 가서 기도를 드렸다. 종소리가 오래 귀에 남았다.',null],[4,'락샤 반단 날, 형제자매끼리 손목에 실팔찌를 묶어 주며 서로를 지켜 주기로 약속했다.',8],[8,'나브라트리 아흐레 동안 밤마다 동네 사람들과 원을 그리며 춤을 췄다.',10]],
  '기독교':[[0,'크리스마스 예배에 가족과 함께 갔다. 성탄 노래를 목청껏 불렀다.',12],[0,'부활절 아침, 가족과 교회에 다녀와 함께 밥을 먹었다.',4],[8,'교회 성가대에서 노래를 불렀다. 처음으로 독창을 맡았다.',null,1]],
  '개신교':[[0,'크리스마스 예배에 가족과 함께 갔다. 성탄 노래를 목청껏 불렀다.',12],[6,'교회 여름 수련회에 갔다. 밤마다 친구들과 노래를 불렀다.',7],[0,'추수감사 예배에 집에서 키운 곡식과 과일을 가져갔다.',11]],
  '가톨릭':[[0,'성탄 미사에 가족과 함께 갔다. 촛불이 성당을 환하게 밝혔다.',12],[8,'첫영성체를 받았다. 하얀 옷을 입고 가족과 사진을 찍었다.',5,1],[0,'마을 수호성인 축일에 성당 앞 광장에서 행렬과 잔치가 열렸다.',null],[0,'부활절 아침, 성당 종이 크게 울렸다.',4]],
  '에티오피아 정교회':[[0,'팀카트(주님 세례 축일)에 하얀 옷을 입고 행렬을 따라 걸었다.',1],[0,'메스켈 축일에 큰 모닥불이 타오르는 것을 온 마을이 함께 지켜보았다.',9],[6,'부활절 전 오십 일 넘는 금식 기간에는 고기와 우유 없이 지냈다.',3]],
  '러시아 정교회':[[0,'1월 7일 정교회 성탄절, 가족과 함께 교회에 촛불을 켜러 갔다.',1],[0,'부활절에 색칠한 달걀을 두드려 깨뜨리는 놀이를 했다.',4]],
  '우크라이나 정교회':[[0,'1월 정교회 성탄절, 가족이 모여 열두 가지 음식을 차렸다.',1],[0,'부활절에 바구니에 빵과 달걀을 담아 축복을 받으러 갔다.',4]],
  '불교':[[0,'부처님 오신 날, 가족과 절에 가서 연등을 달았다.',5],[8,'절에서 하룻밤을 지내며 마음을 가라앉히는 법을 배웠다.',null,1],[0,'새벽에 집 앞을 지나는 스님들께 밥을 공양했다.',null]],
  '시크교':[[0,'바이사키 축제 날, 구루드와라(사원)에서 모두가 나란히 앉아 무료 음식(랑가르)을 함께 먹었다.',4],[6,'구루드와라 부엌에서 자원봉사로 짜파티를 수백 장 구웠다.',null],[0,'구루 나나크 탄생일, 밤새 사원에 불이 켜져 있었다.',11]],
  '유대교':[[0,'유월절 저녁, 가족이 둘러앉아 오래된 이야기를 함께 읽었다.',4],[0,'하누카 여드레 동안 밤마다 촛불을 하나씩 더 켰다.',12]],
  '콥트 정교회':[[0,'1월 7일 콥트 성탄절, 가족과 함께 밤 예배에 다녀왔다.',1],[0,'부활절 다음 날 샴 엘나심, 온 가족이 강가로 소풍을 갔다.',4]],
  '민간 신앙':[[0,'설에 조상께 차례를 지내고 온 가족이 모여 앉았다.',1],[0,'청명에 조상의 묘를 찾아 풀을 뽑고 절을 올렸다.',4]],
  '전통 신앙':[[0,'마을 어른들이 조상께 올리는 의식에 처음으로 함께했다. 북소리가 밤늦게까지 이어졌다.',null,1]]
};


