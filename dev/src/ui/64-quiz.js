/* ========== [2-2 상호작용] 문제 풀기 (시험판, 2026-11-13) ==========
   학교(초·중·고)와 학원의 칠판에 다가가면 '칠판 · 문제 풀기'. 꼭 하지 않아도 되는, 다른 물건과 같은 상호작용이다.
   - 나이로 학년을 정해(7살 초1 … 18살 고3) 그 학년에 맞는 수학 문제를 하나 낸다(숫자는 그때그때 바뀜).
   - 아래 대화창에서 네 개 가운데 고른다. 맞히면 지식이 오르고, 틀리면 풀이를 보여 주고 아주 조금만 오른다.
   - 한 해에 지식이 오르는 문제는 QZ_CAP개까지(그 뒤로는 풀어도 오르지 않는다고 알려 줌).
   - 문제는 모두 직접 만든 계산 문제이다(교과서·기출을 옮기지 않음). 나중에 과목·문제를 늘릴 때 QZ_BANK에 더한다. */
const QZ_CAP=4;
const qzR=(a,b)=>a+Math.floor(R()*(b-a+1));
const qzPick=a=>a[Math.floor(R()*a.length)];
const qzFrac=(n,d)=>{ const g=(x,y)=>y?g(y,x%y):x, k=g(Math.abs(n),d)||1; n/=k; d/=k; return d===1?String(n):`${n}/${d}`; };
// 보기 넷: 정답 + 그럴듯한 틀린 답(겹치지 않게)
function qzOpts(ans,wrong){ const a=String(ans), out=[a]; for(const w of wrong){ const s=String(w); if(!out.includes(s)) out.push(s); if(out.length>=4) break; }
  let k=1; while(out.length<4&&typeof ans==='number'){ const s=String(ans+k*(k%2?1:-1)*(1+Math.floor(k/2))); if(!out.includes(s)) out.push(s); k++; }
  for(let k=1;out.length<4&&k<12;k++){ const d=k%2?(k+1)/2:-k/2, s=a.replace(/\d+/,m=>String(Math.max(0,+m+d))); if(!out.includes(s)) out.push(s); }
  for(let i=out.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; } return {opts:out,ans:a}; }
// 학년별 문제 만들기: [단원 이름, ()=>{q, ans, wrong[], ex}]
const QZ_BANK={
  1:[['덧셈',()=>{ const a=qzR(2,9), b=qzR(2,9); return {q:`${a} + ${b} = ?`,ans:a+b,wrong:[a+b+1,a+b-1,a+b+2],ex:`${a}에서 ${b}만큼 더 세면 ${a+b}예요.`}; }],
     ['뺄셈',()=>{ const a=qzR(10,18), b=qzR(2,9); return {q:`${a} − ${b} = ?`,ans:a-b,wrong:[a-b+1,a-b-1,a+b],ex:`${a}에서 ${b}만큼 거꾸로 세면 ${a-b}예요.`}; }],
     ['수의 크기',()=>{ const n=[qzR(10,99),qzR(10,99),qzR(10,99),qzR(10,99)]; const m=Math.max(...n); return {q:`가장 큰 수는? (${n.join(', ')})`,ans:m,wrong:n.filter(x=>x!==m),ex:`십의 자리부터 견주면 ${m}이 가장 커요.`}; }]],
  2:[['두 자리 덧셈',()=>{ const a=qzR(15,59), b=qzR(15,39); return {q:`${a} + ${b} = ?`,ans:a+b,wrong:[a+b+10,a+b-10,a+b-1],ex:`일의 자리끼리, 십의 자리끼리 더해요. 받아올림을 잊지 마세요.`}; }],
     ['곱셈구구',()=>{ const a=qzR(2,9), b=qzR(2,9); return {q:`${a} × ${b} = ?`,ans:a*b,wrong:[a*b+a,a*b-b,a+b],ex:`${a}를 ${b}번 더하면 ${a*b}예요.`}; }],
     ['시각',()=>{ const h=qzR(1,11), m=qzPick([15,30,45]); return {q:`${h}시 ${m}분에서 30분 뒤는 몇 시 몇 분?`,ans:m+30>=60?(m===30?`${h+1}시`:`${h+1}시 ${m-30}분`):`${h}시 ${m+30}분`,wrong:[`${h}시 ${(m+20)%60}분`,`${h+1}시 ${m}분`,`${h}시 ${m}분`],ex:`60분이 넘으면 한 시간으로 올려요.`}; }]],
  3:[['나눗셈',()=>{ const b=qzR(2,9), q=qzR(2,9); return {q:`${b*q} ÷ ${b} = ?`,ans:q,wrong:[q+1,q-1,b],ex:`${b} × ${q} = ${b*q} 이니까 몫은 ${q}예요.`}; }],
     ['곱셈',()=>{ const a=qzR(12,49), b=qzR(2,6); return {q:`${a} × ${b} = ?`,ans:a*b,wrong:[a*b+b,a*b-10,a*b+10],ex:`${Math.floor(a/10)*10}×${b}와 ${a%10}×${b}를 따로 구해 더해요.`}; }],
     ['분수',()=>{ const d=qzPick([4,5,6,8]), a=qzR(1,d-2), b=qzR(a+1,d-1); return {q:`더 큰 분수는? ${a}/${d} 와 ${b}/${d}`,ans:`${b}/${d}`,wrong:[`${a}/${d}`,'둘이 같다','알 수 없다'],ex:`분모가 같으면 분자가 큰 쪽이 커요.`}; }]],
  4:[['큰 수의 곱셈',()=>{ const a=qzR(21,89), b=qzR(11,29); return {q:`${a} × ${b} = ?`,ans:a*b,wrong:[a*b+a,a*b-b,a*(b-10)],ex:`${a}×${b-b%10}과 ${a}×${b%10}을 더해요.`}; }],
     ['분수의 덧셈',()=>{ const d=qzPick([5,7,8,9]), a=qzR(1,3), b=qzR(1,Math.min(3,d-1-a)); return {q:`${a}/${d} + ${b}/${d} = ?`,ans:`${a+b}/${d}`,wrong:[`${a+b}/${d*2}`,`${a*b}/${d}`,`${a+b+1}/${d}`,`${a+b-1}/${d}`,`${a+b}/${d+1}`],ex:`분모가 같으면 분자끼리 더해요.`}; }],
     ['각도',()=>{ const a=qzR(30,80), b=qzR(30,70); return {q:`삼각형의 두 각이 ${a}°, ${b}°일 때 나머지 한 각은?`,ans:`${180-a-b}°`,wrong:[`${360-a-b}°`,`${180-a}°`,`${90-a+b}°`],ex:`삼각형 세 각의 합은 180°예요.`}; }]],
  5:[['약수와 배수',()=>{ const a=qzPick([12,18,20,24,30,36]), b=qzPick([8,12,15,16,18,20].filter(x=>x!==a)); const g=(x,y)=>y?g(y,x%y):x, G0=g(a,b); return {q:`${a}와 ${b}의 최대공약수는?`,ans:G0,wrong:[a*b/G0,G0*2,G0+1],ex:`두 수를 모두 나누어떨어지게 하는 가장 큰 수는 ${G0}예요.`}; }],
     ['넓이',()=>{ const w=qzR(4,15), h=qzR(3,12); return {q:`밑변 ${w}cm, 높이 ${h}cm인 삼각형의 넓이는?`,ans:`${w*h/2}cm²`,wrong:[`${w*h}cm²`,`${w+h}cm²`,`${(w+h)*2}cm²`],ex:`(밑변 × 높이) ÷ 2 = ${w*h/2}`}; }],
     ['분수의 곱셈',()=>{ const a=qzR(1,4), b=qzR(a+1,7), c=qzR(1,4), d=qzR(c+1,7); return {q:`${a}/${b} × ${c}/${d} = ? (기약분수)`,ans:qzFrac(a*c,b*d),wrong:[qzFrac(a+c,b+d),qzFrac(a*d,b*c),`${a*c}/${b+d}`],ex:`분자는 분자끼리, 분모는 분모끼리 곱하고 약분해요.`}; }]],
  6:[['비와 비율',()=>{ const b=qzPick([20,25,40,50]), a=qzR(1,b/5)*5; return {q:`${b}명 가운데 ${a}명은 몇 %?`,ans:`${a/b*100}%`,wrong:[`${a}%`,`${b-a}%`,`${Math.round(b/a*10)}%`],ex:`${a} ÷ ${b} × 100 = ${a/b*100}%`}; }],
     ['소수의 나눗셈',()=>{ const b=qzPick([2,4,5]), q=qzR(11,49)/10; const a=Math.round(q*b*10)/10; return {q:`${a} ÷ ${b} = ?`,ans:q,wrong:[Math.round(q*100)/10,Math.round((q+.1)*10)/10,Math.round(q*b*100)/100],ex:`${b} × ${q} = ${a}`}; }],
     ['원',()=>{ const r=qzR(2,10); return {q:`반지름 ${r}cm인 원의 둘레는? (원주율 3.14)`,ans:`${Math.round(r*2*3.14*100)/100}cm`,wrong:[`${Math.round(r*3.14*100)/100}cm`,`${Math.round(r*r*3.14*100)/100}cm`,`${r*2*3}cm`],ex:`지름 × 원주율 = ${r*2} × 3.14`}; }]],
  7:[['정수의 계산',()=>{ const a=qzR(-9,-2), b=qzR(3,12); return {q:`(${a}) + ${b} − (${a}) × 2 = ?`,ans:a+b-a*2,wrong:[a+b+a*2,-(a+b-a*2),a+b],ex:`곱셈을 먼저: (${a})×2 = ${a*2}, 그리고 빼면 더하기가 돼요.`}; }],
     ['일차방정식',()=>{ const x=qzR(-6,9), a=qzR(2,7), b=qzPick([-9,-7,-5,-3,-2,2,3,4,6,8]); return {q:`${a}x ${b<0?'−':'+'} ${Math.abs(b)} = ${a*x+b} 일 때 x = ?`,ans:x,wrong:[x+1,-x||2,a*x],ex:`${b<0?'양변에 '+Math.abs(b)+'를 더하고':'양변에서 '+b+'를 빼고'} ${a}로 나눠요.`}; }],
     ['소인수분해',()=>{ const all=[[12,'2²×3'],[18,'2×3²'],[20,'2²×5'],[36,'2²×3²'],[45,'3²×5'],[60,'2²×3×5'],[72,'2³×3²']], n=qzPick(all); return {q:`${n[0]}을 소인수분해하면?`,ans:n[1],wrong:all.filter(x=>x!==n).sort(()=>R()-.5).map(x=>x[1]),ex:`가장 작은 소수부터 차례로 나눠요.`}; }]],
  8:[['연립방정식',()=>{ const x=qzR(1,6), y=qzR(1,6); return {q:`x + y = ${x+y}, x − y = ${x-y} 일 때 x는?`,ans:x,wrong:[y,x+y,x+1],ex:`두 식을 더하면 2x = ${2*x}`}; }],
     ['일차함수',()=>{ const a=qzR(-4,5)||2, b=qzR(-5,5), x1=qzR(0,3); return {q:`일차함수 y = ${a}x ${b<0?'−':'+'} ${Math.abs(b)} 의 기울기는?`,ans:a,wrong:[b,-a,a+b],ex:`y = ax + b 에서 x 앞의 수 a가 기울기예요.`}; }],
     ['지수법칙',()=>{ const m=qzR(2,6), n=qzR(2,5); return {q:`a^${m} × a^${n} = ?`,ans:`a^${m+n}`,wrong:[`a^${m*n}`,`2a^${m+n}`,`a^${Math.abs(m-n)}`],ex:`밑이 같으면 지수끼리 더해요.`}; }]],
  9:[['제곱근',()=>{ const n=qzR(4,15); return {q:`√${n*n} = ?`,ans:n,wrong:[n*2,n*n/2,n+1],ex:`${n} × ${n} = ${n*n}`}; }],
     ['이차방정식',()=>{ const p=qzR(1,5), q=qzR(p+1,7); return {q:`x² − ${p+q}x + ${p*q} = 0 의 두 근의 합은?`,ans:p+q,wrong:[p*q,-(p+q),p],ex:`(x−${p})(x−${q}) = 0 → 두 근 ${p}, ${q}`}; }],
     ['피타고라스 정리',()=>{ const t=qzPick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17]]); return {q:`직각삼각형의 두 변이 ${t[0]}, ${t[1]}일 때 빗변은?`,ans:t[2],wrong:[t[0]+t[1],t[2]+1,t[1]+1],ex:`${t[0]}² + ${t[1]}² = ${t[2]}²`}; }]],
  10:[['다항식',()=>{ const a=qzR(1,5), b=qzR(1,5); return {q:`(x + ${a})(x + ${b}) 를 전개했을 때 x의 계수는?`,ans:a+b,wrong:[a*b,a+b+1,2*a],ex:`x² + (${a}+${b})x + ${a*b}`}; }],
      ['이차함수',()=>{ const p=qzPick([-4,-3,-2,-1,1,2,3,4]), q=qzPick([-5,-3,-2,-1,1,2,4,5]); return {q:`y = (x ${p<0?'+':'−'} ${Math.abs(p)})² ${q<0?'−':'+'} ${Math.abs(q)} 의 꼭짓점은?`,ans:`(${p}, ${q})`,wrong:[`(${-p}, ${q})`,`(${p}, ${-q})`,`(${q}, ${p})`],ex:`y = (x − p)² + q 의 꼭짓점은 (p, q)`}; }],
      ['경우의 수',()=>{ const n=qzR(3,6); return {q:`${n}명 가운데 반장 1명, 부반장 1명을 뽑는 경우의 수는?`,ans:n*(n-1),wrong:[n*(n-1)/2,n*2,n*n],ex:`${n} × ${n-1} = ${n*(n-1)}`}; }]],
  11:[['지수와 로그',()=>{ const b=qzPick([2,3,5]), k=qzR(2,5); return {q:`log${['₂','₃','₅'][[2,3,5].indexOf(b)]} ${b**k} = ?`,ans:k,wrong:[b**k/b,k+1,b],ex:`${b}을 ${k}번 곱하면 ${b**k}`}; }],
      ['등차수열',()=>{ const a=qzR(1,9), d=qzR(2,6), n=qzR(5,10); return {q:`첫째항 ${a}, 공차 ${d}인 등차수열의 제${n}항은?`,ans:a+(n-1)*d,wrong:[a+n*d,a*d*n,a+(n-2)*d],ex:`${a} + (${n}−1) × ${d}`}; }],
      ['삼각함수',()=>{ const t=qzPick([['sin 30°','1/2'],['cos 60°','1/2'],['tan 45°','1'],['sin 90°','1'],['cos 0°','1'],['sin 0°','0']]); return {q:`${t[0]} 의 값은?`,ans:t[1],wrong:['√3/2','√2/2','2'].filter(x=>x!==t[1]),ex:`특수각의 값을 떠올려 보세요.`}; }]],
  12:[['미분',()=>{ const a=qzR(2,5), n=qzR(2,4), x=qzR(1,3); return {q:`f(x) = ${a}x^${n} 일 때 f′(${x}) = ?`,ans:a*n*x**(n-1),wrong:[a*x**n,a*n*x**n,n*x**(n-1)],ex:`f′(x) = ${a*n}x^${n-1}`}; }],
      ['확률',()=>{ const r=qzR(2,5), b=qzR(2,5); return {q:`빨간 공 ${r}개, 파란 공 ${b}개에서 하나를 꺼낼 때 빨간 공일 확률은?`,ans:qzFrac(r,r+b),wrong:[qzFrac(b,r+b),`${r}/${b}`,'1/2'].filter(x=>x!==qzFrac(r,r+b)),ex:`${r} ÷ ${r+b}`}; }],
      ['수열의 합',()=>{ const n=qzR(5,20); return {q:`1 + 2 + … + ${n} = ?`,ans:n*(n+1)/2,wrong:[n*n/2|0,n*(n-1)/2,n*(n+1)],ex:`n(n+1)/2 = ${n}×${n+1}/2`}; }]]
};
// ---------- 과목 넓히기(11-14): 영어 단어 · 과학 상식 · 사회 상식 · 대학 공부 · 직장 상식 (모두 직접 쓴 짧은 문제) ----------
const qzBandOf=a=>a<=12?'e':a<=15?'m':'h';
const QZ_ENG={
  e:[['apple','사과'],['dog','개'],['cat','고양이'],['book','책'],['water','물'],['school','학교'],['friend','친구'],['bread','빵'],['rain','비'],['moon','달'],['tree','나무'],['milk','우유'],['bird','새'],['hand','손'],['eat','먹다'],['run','달리다']],
  m:[['borrow','빌리다'],['decide','결정하다'],['enough','충분한'],['difficult','어려운'],['language','언어'],['library','도서관'],['important','중요한'],['travel','여행하다'],['collect','모으다'],['believe','믿다'],['healthy','건강한'],['future','미래'],['weather','날씨'],['invent','발명하다'],['quiet','조용한'],['village','마을'],['dangerous','위험한'],['remember','기억하다'],['practice','연습하다']],
  h:[['achieve','이루다'],['environment','환경'],['opportunity','기회'],['evidence','증거'],['society','사회'],['influence','영향을 주다'],['necessary','필요한'],['consume','소비하다'],['tradition','전통'],['ability','능력'],['advantage','이점'],['responsible','책임이 있는'],['participate','참여하다'],['improve','향상시키다'],['economy','경제'],['solution','해결책'],['decrease','줄어들다'],['require','요구하다'],['support','지지하다']]};
const qzEng=b=>{ const L=QZ_ENG[b], [w,m]=qzPick(L), wr=L.filter(x=>x[1]!==m).sort(()=>R()-.5).slice(0,3).map(x=>x[1]); return {q:`'${w}'의 뜻은?`,ans:m,wrong:wr,ex:`'${w}'는 '${m}'라는 뜻이에요.`}; };
// [질문, 답, [틀린 답 셋], 풀이]
const QZ_SCI={
  e:[['물이 얼어 얼음이 되기 시작하는 온도는?','0℃',['100℃','10℃','−10℃'],'물은 0℃에서 얼기 시작해요.'],['식물이 잎에서 양분을 만들 때 쓰는 기체는?','이산화탄소',['산소','질소','수소'],'잎은 빛과 이산화탄소, 물로 양분을 만들어요.'],['지구가 태양 둘레를 한 바퀴 도는 데 걸리는 시간은?','1년',['하루','한 달','10년'],'지구가 태양을 한 바퀴 도는 시간이 1년이에요.'],['피를 온몸으로 보내는 몸의 기관은?','심장',['폐','위','간'],'심장이 펌프처럼 피를 보내요.'],['태양계에서 가장 큰 행성은?','목성',['지구','화성','금성'],'목성이 가장 커요.']],
  m:[['물을 이루는 화학식은?','H₂O',['CO₂','O₂','NaCl'],'물은 수소 둘과 산소 하나로 이뤄져요.'],['힘의 단위는?','뉴턴(N)',['줄(J)','와트(W)','미터(m)'],'힘의 단위는 뉴턴이에요.'],['지구 대기에서 가장 많은 기체는?','질소',['산소','아르곤','이산화탄소'],'공기의 약 78%가 질소예요.'],['빛은 1초에 대략 얼마나 갈까?','약 30만 km',['약 340 m','약 3만 km','약 3천 km'],'빛은 1초에 약 30만 km를 가요.'],['세포 안에서 에너지를 만드는 곳은?','미토콘드리아',['핵','리보솜','세포막'],'세포 호흡은 미토콘드리아에서 일어나요.']],
  h:[['100m를 20초에 달렸을 때 평균 속력은?','5 m/s',['20 m/s','2 m/s','0.2 m/s'],'속력은 거리 ÷ 시간 = 100 ÷ 20 = 5예요.'],['DNA에서 아데닌(A)과 짝을 이루는 염기는?','티민(T)',['구아닌(G)','시토신(C)','우라실(U)'],'DNA에서 A는 T와, G는 C와 짝이에요.'],['pH 7인 용액은?','중성',['산성','염기성','알 수 없다'],'pH 7은 중성이에요.'],['지구 온난화를 일으키는 대표적인 온실가스는?','이산화탄소',['헬륨','네온','아르곤'],'이산화탄소가 대표적인 온실가스예요.'],['다른 물체의 도움 없이 운동하는 물체가 계속 같은 속도로 움직이려는 성질은?','관성',['중력','마찰','부력'],'관성은 운동 상태를 유지하려는 성질이에요.']]};
const QZ_SOC={
  e:[['우리나라의 수도는?','서울',['부산','대전','전주'],'우리나라의 수도는 서울이에요.'],['한글날은 몇 월 며칠일까?','10월 9일',['3월 1일','8월 15일','12월 25일'],'한글날은 10월 9일이에요.'],['지도에서 보통 위쪽이 가리키는 방위는?','북쪽',['남쪽','동쪽','서쪽'],'지도의 위쪽이 북쪽이에요.'],['세계에서 가장 넓은 바다는?','태평양',['대서양','인도양','북극해'],'태평양이 가장 넓어요.'],['사람이 가장 많이 사는 대륙은?','아시아',['아프리카','유럽','남아메리카'],'세계 사람의 절반 넘게가 아시아에 살아요.']],
  m:[['법을 만드는 일을 하는 곳은?','국회',['법원','정부','학교'],'입법은 국회가 맡아요.'],['조선을 세운 사람은?','이성계',['왕건','김유신','궁예'],'1392년에 이성계가 조선을 세웠어요.'],['3·1 운동이 일어난 해는?','1919년',['1910년','1945년','1950년'],'3·1 운동은 1919년이에요.'],['사려는 사람은 늘고 물건은 그대로면 값은 어떻게 될까?','오른다',['내려간다','변함없다','0원이 된다'],'수요가 늘면 값이 오르기 쉬워요.'],['적도 가까운 곳은 대체로 기온이 어떨까?','높다',['낮다','영하다','알 수 없다'],'적도 근처는 햇빛을 많이 받아 더워요.']],
  h:[['민주 선거의 기본 원칙이 아닌 것은?','강제 선거',['보통 선거','평등 선거','비밀 선거'],'보통·평등·직접·비밀 선거가 기본 원칙이에요.'],['물가가 전반적으로 계속 오르는 현상은?','인플레이션',['디플레이션','환율','저축'],'물가가 오르는 것이 인플레이션이에요.'],['4·19 혁명이 일어난 해는?','1960년',['1950년','1972년','1980년'],'4·19 혁명은 1960년이에요.'],['국제연합(UN) 본부가 있는 도시는?','뉴욕',['제네바','파리','런던'],'UN 본부는 뉴욕에 있어요.'],['한 나라 안에서 일정 기간 새로 만든 재화·서비스 가치의 합은?','국내총생산(GDP)',['소비자물가지수','환율','경상수지'],'이를 국내총생산이라고 해요.']]};
const qzFact=(T,b)=>{ const [q,a,w,ex]=qzPick(T[b]); return {q,ans:a,wrong:w,ex}; };
// 대학 공부(19~) · 직장 상식: 대학은 흥미 분야(f.dir)에 맞는 문제를 하나 섞는다
const QZ_UNI={
  all:[['글을 쓸 때 남의 글을 출처 없이 가져다 쓰는 일은?','표절',['인용','요약','참고'],'출처를 밝히면 인용, 밝히지 않으면 표절이에요.'],['자료 1, 2, 3, 4, 100의 중앙값은?','3',['22','4','100'],'크기순으로 가운데 값이 중앙값이라서 3이에요.'],['설문에서 전체 가운데 실제로 조사하는 일부를 뭐라고 할까?','표본',['모집단','평균','분산'],'전체는 모집단, 그 일부가 표본이에요.']],
  sci:[['2진수 101은 10진수로?','5',['3','6','7'],'4 + 0 + 1 = 5예요.']],
  care:[['성인의 보통 체온은 대략?','36.5℃',['33℃','38.5℃','40℃'],'건강한 어른의 체온은 36~37℃예요.']],
  edu:[['맞춤법이 맞는 것은?','할 수 있다',['할수 있다','할 수있다','할수있다'],"'수'는 앞뒤를 띄어 써요."]],
  biz:[['원금 100만 원, 연 5% 단리로 2년이면 이자는?','10만 원',['5만 원','10만 2500원','20만 원'],'100만 × 0.05 × 2 = 10만 원이에요.']],
  art:[['빛의 삼원색은?','빨강·초록·파랑',['빨강·노랑·파랑','시안·마젠타·노랑','검정·하양·회색'],'빛은 빨강·초록·파랑을 섞어요.']],
  body:[['운동 전에 준비운동을 하는 가장 큰 까닭은?','부상을 줄이려고',['땀을 많이 내려고','더 빨리 지치려고','숨을 참으려고'],'근육과 관절을 풀어 다치기 어렵게 해요.']],
  pub:[['계약서에 서명하기 전에 가장 먼저 할 일은?','내용을 꼼꼼히 읽는다',['일단 서명한다','남에게 맡긴다','읽지 않는다'],'서명하면 내용에 책임을 져요.']]};
const QZ_JOB=[['월급에서 세금·보험료를 빼기 전의 금액은?','세전 월급',['세후 월급','실수령액','용돈'],'빼기 전이 세전, 뺀 뒤 받는 돈이 실수령액이에요.'],['일하다가 다쳤을 때 도움을 받는 보험은?','산재보험',['국민연금','고용보험','자동차보험'],'일 때문에 다치면 산업재해보상보험이 있어요.'],['한 주에 일하는 법정 기준 시간은 보통 몇 시간?','40시간',['35시간','48시간','52시간'],'하루 8시간, 주 5일이 기준이에요.'],['일하다 실수를 했을 때 가장 알맞은 행동은?','바로 알리고 함께 고친다',['혼자 숨긴다','남 탓을 한다','모른 척한다'],'빨리 알릴수록 고치기 쉬워요.'],['일을 시작하기 전에 꼭 확인할 것은?','일하는 시간과 임금',['회사 건물 높이','사장님 취미','점심 메뉴'],'근로계약서에 시간과 임금이 적혀 있어요.']];
function qzMakeMore(L,mode){ const Q=L.f.quiz||{}, b=qzBandOf(L.age); let C;
  if(mode==='u'){ const d=(L.f.dir&&QZ_UNI[L.f.dir])?[['대학 공부 · 기초',QZ_UNI.all],['대학 공부 · 전공',QZ_UNI[L.f.dir]]]:[['대학 공부 · 기초',QZ_UNI.all]]; const [u,T]=qzPick(d), [q,a,w,ex]=qzPick(T); return {g:0,unit:u,q,ex,...qzOpts(a,w)}; }
  if(mode==='j'){ const [q,a,w,ex]=qzPick(QZ_JOB); return {g:0,unit:'직장 상식',q,ex,...qzOpts(a,w)}; } }
const qzGrade=a=>clamp(a-6,1,12);
const qzGradeName=g=>g<=6?`초등 ${g}학년`:g<=9?`중학교 ${g-6}학년`:`고등학교 ${g-9}학년`;
function qzMake(L){ const g=qzGrade(L.age), bank=QZ_BANK[g], Q=L.f.quiz||{}, last=Q.u;
  const bd=qzBandOf(L.age); let all=bank.slice(); if(L.age>=9) all.push(['영어 단어',()=>qzEng(bd)]); all.push(['과학 상식',()=>qzFact(QZ_SCI,bd)],['사회 상식',()=>qzFact(QZ_SOC,bd)]);
  let pool=all.filter(b=>b[0]!==last); if(!pool.length) pool=all; const [unit,fn]=qzPick(pool), p=fn(); const o=qzOpts(p.ans,p.wrong); return {g:bank.some(b=>b[0]===unit)?g:0,unit,q:p.q,ex:p.ex,...o}; }
// 상식 문제(도서관): 이 게임의 193개 나라 자료로 만든다 — 큰 도시·즐겨 먹는 음식·명절·지역·기대수명·아기가 많이 태어나는 나라
const QZ_GEN=[
  ['세계의 도시',()=>{ const c=qzBig(), w=qzVals(c,'city'); return {q:`${c.n}에서 가장 큰 도시는?`,ans:c.city,wrong:w,ex:`${c.n}의 가장 큰 도시는 ${c.city}예요.`}; }],
  ['세계의 음식',()=>{ const c=qzBig(), w=qzVals(c,'food'); return {q:`${c.n} 사람들이 즐겨 먹는 음식은?`,ans:c.food,wrong:w,ex:`${c.n}에서는 ${c.food}${josa(c.food,'을','를').slice(c.food.length)} 즐겨 먹어요.`}; }],
  ['세계의 명절',()=>{ const c=qzBig(), w=qzVals(c,'fest'); return {q:`${c.n}의 큰 명절·축제는?`,ans:c.fest,wrong:w,ex:`${c.n}의 큰 명절은 ${c.fest}예요.`}; }],
  ['세계의 지역',()=>{ const c=qzBig(), rg=RGN_N[c.rg], w=Object.keys(RGN_N).filter(k=>k!==c.rg).sort(()=>R()-.5).slice(0,3).map(k=>RGN_N[k]); return {q:`${c.n}${josa(c.n,'은','는').slice(c.n.length)} 어느 지역에 있을까?`,ans:rg,wrong:w,ex:`${c.n}${josa(c.n,'은','는').slice(c.n.length)} ${rg}에 있어요.`}; }],
  ['기대수명',()=>{ const [a,b]=qzOthers(null,2).sort((x,y)=>y.le-x.le); if(a.le===b.le) return QZ_GEN[0][1](); return {q:`태어난 아기가 평균적으로 더 오래 사는 나라는?`,ans:a.n,wrong:[b.n],ex:`기대수명은 ${a.n} 약 ${a.le}살, ${b.n} 약 ${b.le}살이에요.`,two:1}; }],
  ['세계의 아기',()=>{ const [a,b]=qzOthers(null,2).sort((x,y)=>y.births-x.births); if(a.births===b.births) return QZ_GEN[0][1](); return {q:`한 해에 아기가 더 많이 태어나는 나라는?`,ans:a.n,wrong:[b.n],ex:`한 해에 ${a.n}에서 약 ${a.births}만 명, ${b.n}에서 약 ${b.births}만 명이 태어나요.`,two:1}; }]];
QZ_GEN.push(['과학 상식',()=>qzFact(QZ_SCI,qzBandOf(G.life?G.life.age:12))],['사회 상식',()=>qzFact(QZ_SOC,qzBandOf(G.life?G.life.age:12))]);
const qzBigList=()=>qzBigList.c||(qzBigList.c=CKEYS.map(k=>COUNTRIES[k]).filter(c=>c.births>=25||['KR','JP','GB','FR','DE','IT','ES','CA','AU'].includes(c.code)));
function qzBig(){ const L=G.life; if(L&&R()<.2) return L.C; return qzPick(qzBigList()); }
function qzVals(c,k){ const seen=new Set([c[k]]), out=[]; for(const x of qzBigList().slice().sort(()=>R()-.5)){ if(seen.has(x[k])) continue; seen.add(x[k]); out.push(x[k]); if(out.length>=3) break; } return out; }
function qzOthers(c,n){ const pool=qzBigList().filter(x=>!c||(x.code!==c.code&&x.city!==c.city&&x.food!==c.food&&x.fest!==c.fest)); const out=[]; while(out.length<n&&pool.length){ out.push(pool.splice(Math.floor(R()*pool.length),1)[0]); } return out; }
function qzMakeGen(L){ const Q=L.f.quiz||{}; let pool=QZ_GEN.filter(b=>b[0]!==Q.gu); const [unit,fn]=qzPick(pool), p=fn();
  if(p.two){ const opts=[p.ans,p.wrong[0]].sort(()=>R()-.5); return {g:0,unit,q:p.q,ex:p.ex,opts,ans:p.ans}; }
  const o=qzOpts(p.ans,p.wrong); return {g:0,unit,q:p.q,ex:p.ex,...o}; }
// 어디서 푸나: 학교(초·중·고) 안의 '내 자리' 책상, 학원 책상 → 교과 수학 문제 / 도서관 탁자 → 상식 문제
const MY_DESK=1;   // INT.f에서 내 자리로 쓰는 책상 (앞줄 가운데)
const qzCan=L=>L&&L.age>=7&&L.age<=18;
const qzSchoolMap=m=>m==='elem'||m==='mid'||m==='high';
function qzSpotAt(){ const L=G.life, m=W.map; if(!L||W.car) return null;
  if(qzSchoolMap(m)&&qzCan(L)){ const d=INT.f[MY_DESK]; if(distTo({r:d.slice(1)})<1.25) return {type:'z',mode:'s',k:'mydesk',n:'내 자리',lab:'내 자리 · 문제 풀기'}; }
  if(L.age>=19){ if(m==='univ'&&typeof PLACE_IN!=='undefined'&&PLACE_IN.univ) for(const f of PLACE_IN.univ.f) if(f[5]==='u_desk'&&distTo({r:f.slice(1,5)})<1.15) return {type:'z',mode:'u',k:'u_desk',n:'강의실 책상',lab:'강의실 책상 · 전공 문제'};
    if(m==='work'&&L.f.job){ const d=INT.f[MY_DESK]; if(d&&distTo({r:d.slice(1)})<1.25) return {type:'z',mode:'j',k:'w_desk',n:'내 자리',lab:'내 자리 · 직장 상식 문제'}; } }
  if(typeof PLACE_IN!=='undefined'&&PLACE_IN[m]){ const PI=PLACE_IN[m];
    if(m==='study'&&qzCan(L)) for(const f of PI.f) if(f[5]==='st_desk'&&distTo({r:f.slice(1,5)})<1.2) return {type:'z',mode:'s',k:'st_desk',n:'학원 책상',lab:'학원 책상 · 문제 풀기'};
    if(PI.kind==='school'&&m!=='study'&&L.age>=7) for(const f of PI.f) if(f[5]==='l_table'&&distTo({r:f.slice(1,5)})<1.2) return {type:'z',mode:'g',k:'l_table',n:L.spotName(m),lab:'책 읽기 · 상식 문제'}; }
  return null; }
(()=>{ const _ne=nearExtra; nearExtra=function(){ const z=qzSpotAt(); if(z) return z; return _ne(); };
  const _act=$('btnAct').onclick; $('btnAct').onclick=function(){ if(near&&(near.type==='z'||near.qz)&&$('sheet').hidden){ openQuiz(near); return; } return _act.apply(this,arguments); };
})();
// 학교에 처음 다닐 때(그리고 중학교·고등학교에 올라갈 때) 한 번만: 내 자리를 파란 표시로 알려 준다
const qzBand=a=>a<=12?'e':a<=15?'m':'h';
function qzIntro(L){ if(!qzCan(L)) return null; const a=L.age, sch=a<=12?'elem':a>=16&&L.f.hs?'high':'mid'; if(a<=12?!L.f.elem:a>=16?!L.f.hs:!L.f.sec) return null;
  const Q=L.f.quiz||{}; if(Q.band===qzBand(a)) return null; const d=INT.f[MY_DESK];
  return {type:'q',qz:1,mode:'s',m:sch,p:[d[1]+d[3]/2,d[2]+d[4]+.75],n:'내 자리 · 문제 풀기',lab:'내 자리 · 문제 풀기',key:null}; }
(()=>{ const _tg=targets; targets=function(){ const out=_tg(); try{ const L=G.life, t=L&&L.cur&&qzIntro(L); if(t){ out.push(t);
  if(L.f.qzTold!==qzBand(L.age)){ L.f.qzTold=qzBand(L.age); setTimeout(()=>toast(`${L.age<=12?'학교':L.age<=15?'중학교':'고등학교'} 내 자리에서 문제를 풀 수 있어요. 파란 표시를 찾아가 보세요. 맞히면 지식이 자라요.`,'news'),400); } } }catch(e){} return out; }; })();
function openQuiz(nr){ if(dlgOpen()) return; const L=G.life, gen=nr.mode==='g', adv=nr.mode==='u'||nr.mode==='j'; if(!gen&&!adv&&!qzCan(L)) return;
  const Q=L.f.quiz||(L.f.quiz={n:0,ok:0,u:''}), Y=tkYear(L); Y.qz=Y.qz||0; if(!gen&&!adv) Q.band=qzBand(L.age);
  const p=adv?qzMakeMore(L,nr.mode):gen?qzMakeGen(L):qzMake(L), who=adv?`${nr.n} · ${p.unit}`:gen?`${nr.n||'도서관'} · 상식 · ${p.unit}`:`${nr.n||'내 자리'} · ${p.g?qzGradeName(p.g)+' ':''}${p.unit}`;
  dlgRun([{who,t:p.q,opts:p.opts,then:i=>{ const ok=p.opts[i]===p.ans; if(ok&&!gen&&!adv&&p.g&&typeof L.acInit==='function'){ L.acInit(); L.ac=clamp(L.ac+.6,5,98); } Q.n++; if(gen||adv) Q.gu=p.unit; else Q.u=p.unit; if(ok) Q.ok++;
    let up=[], tail=''; if(Y.qz<QZ_CAP){ Y.qz++; up=tinyGain(L,adv?{k:ok?.5:.12,e:ok?.3:0}:gen?{k:ok?.4:.1,e:ok?.25:0}:{k:ok?.55:.12},''); } else tail=' (올해는 문제로 오르는 지식이 다 찼어요)';
    if(Y.qz===1&&ok) L.remember({a:L.age,t:adv?`${p.unit} 문제를 풀며 하나 더 알게 되었다.`:gen?`도서관에서 책을 읽다가 ${p.unit}에 대해 새로 알았다.`:`내 자리에서 ${p.unit} 문제를 풀었다.`,sp:adv?(nr.mode==='u'?'univ':'work'):gen?'lib':'desk'});
    renderHud(); persist();
    return [{who,t:(ok?`정답! ${p.ans}. `:`아쉬워요. 답은 ${p.ans}. `)+p.ex+tail,up}]; }}]); }
