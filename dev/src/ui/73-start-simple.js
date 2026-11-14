/* 73-start-simple: 학생이 삶을 시작할 때 보는 설정은 '시간의 빠르기' 하나만 (11-14 선생님 요청)
   빠르게 = 한 해 1분 · 보통 = 3분 · 느리게 = 5분. 나머지(돌아보는 카드·무거운 장면 담담하게·확률 숫자)는 기본값으로 고정. */
const YL3=[[60,'빠르게 · 한 해 1분'],[180,'보통 · 한 해 3분'],[300,'느리게 · 한 해 5분']];
renderBSet=function(){ const o=G.opts; if(!YL3.some(x=>x[0]===+o.yl)) o.yl=180; o.card=1; o.soft=1; o.prob=2;
  $('bSet').innerHTML=`<h3>플레이 시간</h3>
    <div class="stack-s"><div class="seg" data-o="yl">${YL3.map(([v,t])=>`<button data-v="${v}" class="${+o.yl===v?'on':''}">${t}</button>`).join('')}</div>
    <p class="small sub">100살까지 산다면 <b>${lifeTimeText(o.yl)}</b> 안팎이 걸려요 (어른이 되면 한 번에 두 해씩 흘러요). 살아가는 중에는 위쪽의 '저장하기'로 저장하고 쉬었다가 이어서 할 수 있어요.</p></div>
    ${!G.teacher&&G.data&&G.data.room?`<p class="small sub notice">지금 '${esc(G.data.room)}' 반에 들어가 있어요. 선생님이 반 설정을 정해 두었다면 그 설정이 먼저 적용됩니다.</p>`:''}`; };
