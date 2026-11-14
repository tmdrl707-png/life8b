/* 58-simple: 성향(성실함·용기·다정함·호기심·감사)은 2026-11-13 선생님 결정으로 뺐다.
   - 화면 어디에도 성향을 보이지 않는다(ui/21·40·41·52·55에서 지움).
   - 계산에 쓰이던 곳(일자리·미션·대학 확률, 행복의 바탕)이 흔들리지 않게, 해마다 나이에 맞는 '평균값'으로 고정한다.
     고른 선택과는 무관하다(자동으로 산 삶 40명의 나이별 평균).
   - 남겨진 말·한 문장에 쓰이던 topTrait은 오각형에서 가장 돋보이는 축으로 정한다. */
const TR_AVG=[[0,0,0,0,0,0],[6,2.9,3.2,5.1,3.5,.3],[10,9.8,5.6,9.9,7.2,1.6],[15,17.5,10.3,15.3,12.8,3.1],[20,25.7,15.5,19.9,16.3,4.8],[30,41.4,24.4,28.3,18.7,7.6],[45,65,36.2,39.7,21.8,11.8],[60,88.3,44.8,52.4,24.4,14.4],[80,104.7,50.9,62.7,26.2,18.8]];
function trNeutral(a){ a=a||0; let i=1; while(i<TR_AVG.length-1&&TR_AVG[i][0]<a) i++;
  const p=TR_AVG[i-1], q=TR_AVG[i], u=clamp((a-p[0])/(q[0]-p[0]),0,1), o={};
  'DBKCG'.split('').forEach((k,j)=>o[k]=Math.round(p[j+1]+(q[j+1]-p[j+1])*u)); return o; }
(()=>{ const P=Life.prototype, _sp=P.startPeriod;
  P.startPeriod=function(){ this.tr=trNeutral(this.age); return _sp.apply(this,arguments); };
  P.topTrait=function(){ const s=this.s||{}, m={r:'K',k:'C',e:'B',t:'D',j:'G'}; let best='r', bv=-1e9;
    for(const k in m){ const v=(s[k]!=null?s[k]:AX_BASE[k])/AX_BASE[k]; if(v>bv){ bv=v; best=k; } } return m[best]; };
  const _ld=Life.load; Life.load=function(o){ const L=_ld.call(Life,o); L.tr=trNeutral(L.age); return L; }; })();
