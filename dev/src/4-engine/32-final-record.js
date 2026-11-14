/* =====================================================================
   [같은 1초에 태어난 사람들] 같은 순간 지구 곳곳에서 태어난 네 사람의 삶이 나란히 흘러간다
   [마지막 기록] 무엇으로 세상을 떠났는지, 같은 해 태어난 사람들 가운데 얼마나 살았는지
   ===================================================================== */
// 세상을 떠난 까닭: 나이 · 나라의 형편 · 지역에 따라 흔한 원인이 다르다 (WHO 세계 사망 원인 통계를 바탕으로 한 단순화)
const CAUSE={
  pneu:['폐렴(하기도 감염)','하기도 감염(폐렴 등)은 전 세계 사망 원인 4위이고, 다섯 살 미만 아이를 가장 많이 앗아 가는 감염병입니다 (WHO)'],
  diar:['설사병','설사병은 다섯 살 미만 어린이 사망의 주요 원인 가운데 하나이며, 깨끗한 물과 경구수분보충염(ORS)으로 대부분 막을 수 있습니다 (WHO)'],
  mal:['말라리아','2022년 말라리아로 약 60만 8천 명이 숨졌고, 그 대부분이 아프리카의 다섯 살 미만 어린이였습니다 (WHO)'],
  neo:['조산·출생 합병증','신생아 질환(조산·출생 시 질식 등)은 2019년 약 200만 명의 목숨을 앗아 간, 세계 사망 원인 5위입니다 (WHO)'],
  malnu:['영양실조','2023년 세계 약 7억 명이 굶주림을 겪었습니다 (FAO 2024)'],
  measles:['홍역','홍역은 백신으로 막을 수 있지만 2023년에도 10만 명 넘게 홍역으로 숨졌습니다 (WHO)'],
  congen:['선천성 질환','태어날 때부터 지닌 질환은 신생아 사망의 큰 원인 가운데 하나입니다 (WHO)'],
  road:['교통사고','교통사고로 해마다 약 119만 명이 숨지고, 5~29세 사망 원인 1위입니다 (WHO 2023)'],
  drown:['익사','물에 빠져 해마다 약 23만 6천 명이 숨집니다 (WHO)'],
  fall:['추락 사고','떨어지는 사고는 의도하지 않은 부상 사망 원인 가운데 두 번째로 많습니다 (WHO)'],
  violence:['분쟁·폭력','2024년 분쟁과 폭력으로 집을 떠난 사람은 1억 2천만 명을 넘었습니다 (UNHCR)'],
  tb:['결핵','결핵으로 2022년 약 130만 명이 숨졌고, 감염병 가운데 가장 많은 목숨을 앗아 갑니다 (WHO 2023)'],
  hiv:['에이즈(HIV 관련 질환)','2023년 HIV 관련 질환으로 약 63만 명이 숨졌습니다 (UNAIDS 2024)'],
  matern:['출산 합병증','2020년 임신·출산과 관련해 약 28만 7천 명의 여성이 숨졌고, 그 약 70%가 사하라 이남 아프리카였습니다 (WHO 2023)'],
  ihd:['심장병(허혈성 심장 질환)','허혈성 심장 질환은 전 세계 사망 원인 1위로, 모든 사망의 약 16%를 차지합니다 (WHO)'],
  stroke:['뇌졸중','뇌졸중은 전 세계 사망 원인 2위로, 모든 사망의 약 11%를 차지합니다 (WHO)'],
  copd:['만성 폐쇄성 폐질환','만성 폐쇄성 폐질환은 전 세계 사망 원인 3위입니다 (WHO)'],
  cancer:['암','암은 세계 사망 원인 가운데 큰 부분을 차지하며, 2022년 약 970만 명이 암으로 숨졌습니다 (IARC)'],
  diab:['당뇨병 합병증','당뇨병으로 2019년 약 150만 명이 숨졌습니다 (WHO)'],
  kidney:['신장 질환','신장 질환은 2019년 세계 사망 원인 10위였습니다 (WHO)'],
  dement:['치매(알츠하이머병 등)','치매는 세계 사망 원인 7위이고, 고령 인구가 늘며 계속 늘고 있습니다 (WHO)'],
  liver:['간 질환','간경변 등 간 질환은 중년층 사망의 주요 원인 가운데 하나입니다 (WHO)'],
  old:['노환','나이가 들어 몸의 여러 기능이 함께 약해졌습니다'],
  leuk:['소아암(백혈병 등)','해마다 약 40만 명의 어린이·청소년이 암 진단을 받습니다 (WHO)']
};
const CANCER_OF={KR:'폐암',JP:'폐암',CN:'폐암',US:'폐암',IN:'구강암',NG:'유방암',BR:'폐암',RU:'폐암',GB:'폐암',DE:'폐암',EG:'간암',MN:'간암',VN:'간암',TH:'간암',ID:'폐암',PK:'유방암',BD:'폐암',ET:'유방암',ZA:'폐암',MX:'전립선암'};
const pickWC=o=>{ const ks=Object.keys(o).filter(k=>o[k]>0); let r=R()*ks.reduce((t,k)=>t+o[k],0); for(const k of ks){ r-=o[k]; if(r<0) return k; } return ks[0]; };
function causeOf(L){ if(L.cz) return L.cz; const a=L.lifespan||L.age, C=L.C, t=C.tier, af=C.rg==='AF', sudden=L.cause==='sudden', hz=C.hz||[];
  let w;
  if(a<1) w={neo:t<=2?.45:.55,pneu:t<=2?.25:.08,diar:t<=2?.12:0,mal:af?.1:0,congen:t<=2?.06:.3,malnu:t<=1?.06:0};
  else if(a<5) w={pneu:.3,diar:t<=2?.2:.03,mal:af?.25:0,malnu:t<=2?.12:0,measles:t<=2?.06:0,drown:.06,road:.06,congen:t>=3?.2:.03};
  else if(a<15) w={road:.25,drown:.14,mal:af?.15:0,leuk:.14,fall:.06,pneu:.08,diar:t<=2?.06:0,violence:hz.includes('unrest')?.15:0};
  else if(sudden&&a<50) w={road:.45,drown:.08,fall:.08,violence:hz.includes('unrest')?.25:.04,ihd:a>35?.12:.03};
  else if(a<50) w={tb:t<=2?.18:.02,hiv:/^(ZA|BW|LS|SZ|MZ|ZW|ZM|MW|NA|UG|KE|TZ)$/.test(L.c)?.25:af?.08:.01,matern:L.sex===1&&a<45&&t<=2?.12:0,cancer:.2,ihd:.12,liver:.08,road:.12,mal:af?.06:0};
  else if(a<75) w={ihd:.24,stroke:.17,cancer:.24,copd:.08,diab:.06,kidney:.04,tb:t<=2?.05:0,liver:.05,pneu:.04};
  else w={ihd:.22,stroke:.16,cancer:.12,dement:a>=80?.14:.06,copd:.08,pneu:.1,diab:.04,kidney:.04,old:a>=88?.2:.06};
  const k=pickWC(w), c=CAUSE[k]; let n=c[0]; if(k==='cancer'&&CANCER_OF[L.c]){ n=CANCER_OF[L.c]; if(n==='전립선암'&&L.sex===1) n='유방암'; if(n==='유방암'&&L.sex===0) n='폐암'; }
  return L.cz={k,n,nt:c[1]}; }
// 같은 해 이 나라에서 태어난 사람 가운데 몇 %가 그 나이를 넘겨 사는가 (이 게임의 사망 확률 모형으로 계산)
function survTo(C,age){ let S=1; for(let a=0;a<age;a++){ const q=a<5?C.u5/1000*(a===0?.6:.1):a<40?.0002+C.u5/60000+(C.hz.includes('unrest')?.0015:0):(.0005+.05*Math.exp(.095*(a-C.ref))); S*=1-clamp(q,0,.95); } return S; }

Object.assign(Life.prototype,{
  // 같은 1초에 태어난 네 사람 (실제 출생 비율대로 나라가 정해진다)
  makeComps(){ if(this.comps) return this.comps; const out=[];
    for(let i=0;i<4;i++){ let X; try{ X=new Life({lite:1}); X.lite=1; X.ws=this.ws; X.runAuto(); }catch(e){ continue; }
      const cz=causeOf(X), ms=X.mem.filter(m=>m.big).map(m=>[m.a,String(m.t).replace(/\s+/g,' ').slice(0,70)]).slice(0,40);
      out.push({n:X.name,c:X.c,cn:X.C.n,sex:X.sex,set:X.set,town:X.town,fam:FAM[X.famI].n,ls:X.lifespan,cause:cz.n,jobs:(X.jobs||[]).map(j=>[j.a,j.n]),marA:X.ppl&&X.ppl.spouse?(X.f.marA||null):null,kb:(X.kids||[]).map(k=>k.b),ed:[X.f.elem?1:0,X.f.sec?1:0,X.f.hs?1:0,X.f.univ?1:0],uA:X.f.univA||19,ret:X.f.retired?1:0}); }
    return this.comps=out; },
  // 그 사람의 지금(내 나이 때) 모습
  compNow(p,a){ if(p.ls<a) return `${p.ls}세에 세상을 떠남 (${p.cause})`; if(a<3) return '아기'; if(a<7) return '어린 시절'; const ed=p.ed||[0,0,0,0];
    let st; if(a<=12) st=ed[0]?'초등학교에 다니는 중':'학교 대신 집안일을 돕는 중'; else if(a<=15) st=ed[1]?'중학교에 다니는 중':'일을 돕는 중'; else if(a<=18) st=ed[2]?'고등학교에 다니는 중':'일하는 중';
    else if(ed[3]&&a<(p.uA||19)+4) st='대학생'; else { const j=(p.jobs||[]).filter(x=>x[0]<=a).slice(-1)[0]; st=j?`${j[1]}(으)로 일하는 중`.replace('(으)로',josa(j[1],'으로','로').slice(j[1].length)):'일자리를 찾는 중'; if(a>=70) st='일을 내려놓고 지내는 중'; }
    const k=(p.kb||[]).filter(b=>b<=a).length; return st+(p.marA&&p.marA<=a?' · 결혼함':'')+(k?` · 아이 ${k}명`:''); },
  compPlan(){ const out=[]; if(!this.comps||this.lite) return out; const a=this.age, step=this.step;
    this.comps.forEach(p=>{ if(p.ls>=a&&p.ls<a+step) out.push({dyn:{txt:`같은 1초에 태어난 ${p.cn}의 ${josa(p.n,'이','가')} ${p.ls}세에 세상을 떠났다. (${p.cause})`,fx:{},sc:'farewell',y:p.ls-a,nt:null},m:null,done:0}); });
    return out; }
});

