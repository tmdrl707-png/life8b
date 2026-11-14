/* [2-3 시간·사건 진행] 69-six.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

/* ---------- 5) 삶을 시작하기 전에: 소중한 것 ---------- */
const VOW_Q=[
  ['먼 훗날 삶을 돌아볼 때, 무엇이 있으면 "잘 살았다"고 느낄까요?',{h:'아프지 않고 튼튼하게 오래 산 것',r:'곁에 마음을 나눌 사람들이 있었던 것',e:'가 보지 못한 곳, 해 보지 못한 일이 별로 없는 것',k:'세상을 많이 알고 깊이 생각해 본 것',t:'누구보다 잘하는 나만의 솜씨가 있었던 것',m:'돈 걱정 없이 넉넉하게 산 것'}],
  ['몹시 힘든 날, 가장 큰 힘이 되어 줄 것은 무엇일까요?',{h:'푹 자고 일어난 가뿐한 몸',r:'내 이야기를 끝까지 들어 주는 사람',e:'훌쩍 떠나 처음 보는 풍경',k:'책과 배움 속에서 찾은 답',t:'손에 익은 일에 몰두하는 시간',m:'넉넉하게 모아 둔 돈'}],
  ['어른이 된 나에게 선물할 수 있다면 무엇을 주고 싶나요?',{h:'건강한 몸',r:'언제든 기댈 수 있는 사람들',e:'세상 곳곳을 겪어 본 기억',k:'넓고 깊은 앎',t:'무엇이든 해내는 솜씨',m:'넉넉한 돈'}],
  ['가장 신나는 하루는 어떤 하루일까요?',{h:'몸을 마음껏 움직이며 뛰어논 하루',r:'좋아하는 사람들과 웃으며 보낸 하루',e:'처음 해 보는 일로 가득한 하루',k:'새로운 걸 알게 되어 눈이 반짝인 하루',t:'애쓴 일이 마침내 잘 풀린 하루',m:'갖고 싶던 것을 마음 편히 살 수 있었던 하루'}],
  ['먼 훗날 누군가 나를 이렇게 기억해 주면 좋겠어요.',{h:'늘 건강하고 씩씩했던 사람',r:'곁에 있으면 마음이 편해지던 사람',e:'용감하게 이것저것 해 보던 사람',k:'궁금한 건 끝까지 알아내던 사람',t:'뭐든 손으로 척척 해내던 사람',m:'살림을 든든하게 꾸리던 사람'}]];
const VOW_LIFE={h:'튼튼한 몸으로 오래 걷는 삶',r:'곁의 사람들과 마음을 나누는 삶',e:'새로운 곳과 새로운 일을 겪어 보는 삶',k:'세상을 알고 깊이 생각하는 삶',t:'나만의 솜씨로 무언가를 해내는 삶',m:'걱정 없이 넉넉한 삶'};
const VOW={st:0,a:[],ord:[],done:null};
function vowEl(){ let s=$('s-vow'); if(s) return s; s=document.createElement('section'); s.id='s-vow'; s.hidden=true; s.innerHTML='<canvas aria-hidden="true"></canvas><div class="in"></div>'; document.body.appendChild(s);
  addEventListener('resize',()=>{ if(!s.hidden) vowStars(); }); return s; }
function vowStars(){ const cv=$('s-vow').querySelector('canvas'), w=innerWidth, h=innerHeight; cv.width=w; cv.height=h; const c=cv.getContext('2d'); const n=Math.round(Math.min(130,Math.max(60,w*h/9000)));
  for(let i=0;i<n;i++){ c.beginPath(); c.arc(Math.random()*w,Math.random()*h,Math.random()*1.5+.4,0,6.2832); c.fillStyle=`rgba(255,228,205,${(Math.random()*.7+.15).toFixed(2)})`; c.fill(); } }
function vowOpen(done){ const s=vowEl(); VOW.st=0; VOW.a=[]; VOW.done=done; VOW.ord=VOW_Q.map(()=>SIX.slice().sort(()=>Math.random()-.5)); s.hidden=false; vowStars(); vowDraw(); }
function vowPicks(){ const p={}; VOW.a.forEach(l=>{ (Array.isArray(l)?l:[l]).forEach(k=>{ if(k) p[k]=(p[k]||0)+1; }); }); return p; }
function vowDraw(){ const s=$('s-vow'), box=s.querySelector('.in'), st=VOW.st, N=VOW_Q.length, tot=N+2;
  const head=lab=>`<div class="pg"><i style="width:${Math.round((st+1)/tot*100)}%"></i></div><div class="hd"><span>${lab}</span><span>${st+1} / ${tot}</span></div>`;
  if(st===0){ box.innerHTML=`${head('삶을 시작하기 전에')}<div class="bd"><p class="big">곧 지구 어딘가에서 한 아이가 태어납니다. 그 아이가 바로 당신입니다.</p>
      <p class="soft">어느 나라, 어떤 집에서 태어날지는 아무도 고를 수 없습니다. 하지만 무엇을 소중히 여기며 살지는 지금 정할 수 있습니다.</p>
      <p class="soft">다섯 가지 질문에 마음 가는 대로 답해 주세요. 마음에 드는 것은 여러 개 골라도 됩니다. 정답은 없습니다.</p></div><div class="ft"><span></span><button class="btn primary" id="vNext">시작하기 →</button></div>`; }
  else if(st<=N){ const q=VOW_Q[st-1], cur=VOW.a[st-1]||[];
    box.innerHTML=`${head('소중한 것 · 질문 '+st)}<div class="bd"><p class="big">${esc(q[0])}</p><p class="soft" style="margin:-.2rem 0 .5rem">마음에 드는 것을 모두 골라 보세요 (여러 개 가능)</p><div class="cards" role="group">${VOW.ord[st-1].map(k=>`<button type="button" role="checkbox" aria-checked="${cur.includes(k)}" data-k="${k}" class="${cur.includes(k)?'on':''}">${esc(q[1][k])}</button>`).join('')}</div></div>
      <div class="ft"><button class="btn" id="vPrev">← 이전</button><button class="btn primary" id="vNext" ${cur.length?'':'disabled'}>${st===N?'결과 보기 →':'다음 →'}</button></div>`;
    box.querySelector('.cards').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; const l=(VOW.a[st-1]=Array.isArray(VOW.a[st-1])?VOW.a[st-1]:[]), k=b.dataset.k, at=l.indexOf(k); if(at>=0) l.splice(at,1); else l.push(k);
      b.classList.toggle('on',at<0); b.setAttribute('aria-checked',at<0); $('vNext').disabled=!l.length; }; }
  else { const p=vowPicks(), ks=SIX.filter(k=>p[k]).sort((x,y)=>p[y]-p[x]), top=ks[0], even=ks.length>=3&&p[ks[0]]===p[ks[2]];
    box.innerHTML=`${head('당신이 소중히 여기는 것')}<div class="bd"><p class="soft">당신은</p><p class="big">${even?'여러 가지를 고루 아끼는 삶':esc(VOW_LIFE[top])}을 바라고 있습니다.</p>
      <div class="vals">${ks.map(k=>`<span style="--c:${SIX_COL[k]}"><span class="ic">${sixIc(k)}</span>${SIX_N[k]} <b>${'★'.repeat(Math.min(5,p[k]))}</b></span>`).join('')}</div>
      <p class="soft">이 마음을 안고 태어납니다. 살다 보면 생각이 달라질 수도 있어요. 삶의 마지막에, 무엇이 정말 소중했는지 다시 돌아보게 될 거예요.</p></div>
      <div class="ft"><button class="btn" id="vPrev">← 다시 고르기</button><button class="btn primary" id="vNext">태어나기 →</button></div>`; }
  const pv=$('vPrev'); if(pv) pv.onclick=()=>{ clearTimeout(VOW.tm); VOW.st=st>N?1:Math.max(0,st-1); if(st>N) VOW.a=[]; vowDraw(); };
  $('vNext').onclick=()=>{ clearTimeout(VOW.tm); if(st>N){ s.hidden=true; const f=VOW.done; VOW.done=null; if(f) f({p:vowPicks(),a:VOW.a.slice(),t:Date.now()}); return; } VOW.st++; vowDraw(); };
  const fb=box.querySelector('.cards button.on')||box.querySelector('.cards button')||$('vNext'); if(fb) fb.focus({preventScroll:true}); }
// 삶을 시작할 때마다 먼저 묻는다
birth=(old=>function(o){ vowOpen(v=>{ old(o); if(G.life) G.life.val=v; }); })(birth);
