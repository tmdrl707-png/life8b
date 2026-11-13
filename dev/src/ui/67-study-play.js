/* ========== [2-2 상호작용] 놀이터·운동장 미니 게임, 가게·식당에서 사기 (11-13 밤 선생님 점검) ==========
   1) 미니 게임(타이밍): 움직이는 힘 막대를 알맞은 곳에서 멈춘다(누르기·A·스페이스). 세 번 해서 가장 좋은 기록.
      - 놀이터(4~14살): 병뚜껑 날리기 · 체육관/마을 운동장(7살~): 제자리멀리뛰기
      - 한 해에 세 판까지 행복·기술(멀리뛰기는 건강)이 조금 오른다. 기록이 좋을수록 조금 더.
   2) 사기: 가게·시장(물건), 식당·카페(먹을 것)에서 아래 대화창으로 고른다. 어린이는 한 해 용돈 안에서, 어른은 가진 돈에서.
      값은 그 나라 보통 벌이에 맞춰 정해진다. 한 해에 세 번까지 기분·능력이 조금 오른다.
   3) 학교 안 '내 자리' 책상 위에 이름표. */
const MG_CAP=3, BUY_CAP=3;
// ---------- 1) 미니 게임 ----------
function mgSpotAt(){ const L=G.life, a=L&&L.age; if(!L||W.car) return null;
  if(W.map==='out'&&a>=4&&a<=14&&OUT.patch&&OUT.patch.play){ const p=OUT.patch.play; if(distTo({r:p})<.9) return {type:'mg',th:'cap',n:L.spotName('play'),lab:`${L.spotName('play')} · 병뚜껑 날리기`}; }
  if(W.map==='gym'&&a>=7&&a<75&&typeof PLACE_IN!=='undefined'){ for(const f of PLACE_IN.gym.f) if(f[5]==='g_mat'&&distTo({r:f.slice(1,5)})<1.1) return {type:'mg',th:'jump',n:L.spotName('gym'),lab:'매트 · 제자리멀리뛰기'}; }
  return null; }
const MG_TH={cap:{t:'병뚜껑 날리기',how:'힘 막대가 초록 칸에 올 때 누르면 병뚜껑이 멀리 날아가요.',unit:'cm',max:300,mem:'놀이터에서 병뚜껑을 {d}cm나 날렸다.',fx:{j:.45,t:.3}},
  jump:{t:'제자리멀리뛰기',how:'힘 막대가 초록 칸에 올 때 누르면 멀리 뛰어요.',unit:'cm',max:260,mem:'체육관에서 제자리멀리뛰기 {d}cm를 뛰었다.',fx:{h:.4,j:.3}}};
function openMini(nr){ if(dlgOpen()||!$('sheet').hidden) return; const L=G.life, T=MG_TH[nr.th], Y=tkYear(L); Y.mg=Y.mg||0;
  const age=L.age, sp=age<8?.75:age<13?1:age<60?1.15:.8, zone=age<8?.2:age<13?.16:.13;   // 막대 속도·초록 칸 너비
  const best=(L.f.mgBest||{})[nr.th]||0;
  sheet(`<div class="place">${esc(nr.n)} · 놀이</div><h2>${T.t}</h2><p class="small sub">${T.how} 세 번 해 봐요.${best?` 나의 최고 기록 ${best}${T.unit}`:''}</p>
    <canvas id="mgCv" width="560" height="150" style="width:100%;max-width:560px;display:block;margin:6px auto;border-radius:8px;background:#F4EBDC"></canvas>
    <p id="mgMsg" class="ibig" style="text-align:center;min-height:1.5em;margin:4px 0">1번째</p>
    <div class="opts"><button id="mgGo" type="button">지금! (A·스페이스)</button><button id="mgEnd" type="button">그만하기</button></div>`,'event');
  const cv=$('mgCv'), x=cv.getContext('2d'), z0=.62+R()*.2, tries=[]; let t0=performance.now(), stopAt=null, fly=0, done=false, raf=0;
  const val=t=>{ const u=((t-t0)/1000*sp)%2; return u<1?u:2-u; };   // 0→1→0 왕복
  function score(v){ const d=Math.abs(v-(z0+zone/2)); const s=d<=zone/2?1-d/(zone/2)*.25:Math.max(0,.75-(d-zone/2)*2.2); return s; }
  function frame(now){ if(!cv.isConnected){ cancelAnimationFrame(raf); return; } const W0=cv.width, H0=cv.height; x.clearRect(0,0,W0,H0);
    // 땅과 거리 눈금
    x.fillStyle='#E6D6BC'; x.fillRect(0,H0-34,W0,34); x.fillStyle='#8A643C'; x.font='12px sans-serif'; x.textAlign='center';
    for(let i=0;i<=6;i++){ const px=60+i*75; x.fillRect(px,H0-34,2,8); x.fillText(Math.round(T.max*i/6)+T.unit,px,H0-12); }
    tries.forEach((d,i)=>{ const px=60+d/T.max*450; x.fillStyle=['#5890F0','#2F8F5A','#C2577A'][i]; x.beginPath(); x.arc(px,H0-38,5,0,7); x.fill(); });
    // 힘 막대
    const v=stopAt!=null?stopAt:val(now), bx=60, bw=450, by=18;
    x.fillStyle='#D8C8A8'; x.fillRect(bx,by,bw,16); x.fillStyle='#7FC88A'; x.fillRect(bx+z0*bw,by,zone*bw,16);
    x.fillStyle='#283038'; x.fillRect(bx+v*bw-2,by-5,4,26);
    // 날아가는 것
    if(stopAt!=null){ const d=tries[tries.length-1]||0, k=Math.min(1,(now-fly)/700), px=60+d/T.max*450*k, py=H0-40-Math.sin(k*Math.PI)*60;
      x.fillStyle=nr.th==='cap'?'#C23B56':'#E2703A'; x.beginPath(); x.arc(px,py,nr.th==='cap'?6:8,0,7); x.fill(); }
    if(!done) raf=requestAnimationFrame(frame); }
  raf=requestAnimationFrame(frame);
  function go(){ if(done||stopAt!=null) return; stopAt=val(performance.now()); fly=performance.now(); const d=Math.round(score(stopAt)*T.max*(.85+R()*.15)); tries.push(d);
    $('mgMsg').textContent=`${tries.length}번째 · ${d}${T.unit}`+(score(stopAt)>.9?' · 아주 좋아요!':'');
    setTimeout(()=>{ if(!cv.isConnected) return; if(tries.length>=3) finish(); else { stopAt=null; t0=performance.now()-R()*800; $('mgMsg').textContent=`${tries.length+1}번째`; } },900); }
  function finish(){ done=true; cancelAnimationFrame(raf); const b=Math.max(0,...tries); L.f.mgBest=L.f.mgBest||{}; const rec=b>(L.f.mgBest[nr.th]||0); if(rec) L.f.mgBest[nr.th]=b;
    let up=[]; if(Y.mg<MG_CAP&&tries.length){ Y.mg++; const g={}, m=.6+b/T.max*.6; for(const k in T.fx) g[k]=T.fx[k]*m; up=tinyGain(L,g,''); if(rec&&b>T.max*.6) L.remember({a:L.age,t:T.mem.replace('{d}',b),sp:nr.th==='cap'?'play':'gym'}); }
    closeSheet(); renderHud(); persist();
    dlgRun([{who:nr.n,t:tries.length?`가장 좋은 기록은 ${b}${T.unit}${rec?' · 나의 새 기록!':''}`+(Y.mg>=MG_CAP&&!up.length?' (올해는 놀이로 오르는 것이 다 찼어요)':''):'다음에 또 해 보자.',up}]); }
  $('mgGo').onclick=go; $('mgEnd').onclick=()=>{ if(!done) finish(); };
  const key=e=>{ if($('sheet').hidden||!cv.isConnected){ removeEventListener('keydown',key,true); return; } if(e.key===' '||e.key==='Enter'||e.key==='a'||e.key==='A'){ e.preventDefault(); e.stopImmediatePropagation(); go(); } };
  addEventListener('keydown',key,true); }
// ---------- 2) 가게·식당에서 사기 ----------
// [이름, 값(보통 한 달 벌이에 대한 비율), 오르는 것, 사고 나서 한 줄, 누구(c 어린이 · y 청소년 · a 어른)]
const BUY={
  shop:[['과자 한 봉지',.0006,{j:.4},'바삭바삭, 아껴 먹었다.','cya'],['색연필',.003,{t:.4,j:.2},'새 색연필로 그림을 그렸다.','cy'],['작은 장난감',.004,{j:.5,e:.2},'한동안 이 장난감만 가지고 놀았다.','c'],['공책과 볼펜',.002,{k:.3,t:.2},'새 공책 첫 장에 이름을 또박또박 썼다.','ya'],['가족에게 줄 간식',.002,{r:.5,j:.2},'집에 가져가니 다들 반가워했다.','ya']],
  market:[['제철 과일',.003,{h:.3,r:.3},'가족과 나눠 먹었다. 달았다.','cya'],['운동화',.02,{h:.3,j:.4},'새 운동화를 신고 동네를 한 바퀴 뛰었다.','ya'],['옷 한 벌',.025,{j:.5,e:.1},'거울 앞에서 몇 번이나 돌아보았다.','ya'],['공',.006,{h:.4,t:.2},'공을 들고 바로 놀이터로 달려갔다.','c']],
  rest:[['국수 한 그릇',.003,{j:.3,h:.2},'따뜻한 국물에 몸이 풀렸다.','cya'],['가족과 외식',.012,{r:.6,j:.4},'오랜만에 둘러앉아 웃었다.','a'],['친구와 떡볶이(간식)',.002,{r:.4,j:.3},'수다가 끝나지 않았다.','y']],
  cafe:[['달콤한 음료',.0015,{j:.35},'한 모금에 기분이 좋아졌다.','ya'],['조각 케이크',.002,{j:.4},'포크로 조금씩 아껴 먹었다.','cya'],['책 한 권 들고 오래 앉아 있기',.0015,{k:.3,j:.2},'창가 자리에서 책을 끝까지 읽었다.','a']]};
const BUY_AT={shop:['s_goods','s_shelf'],market:['m_goods','m_fruit','m_cloth'],rest:['r_table'],cafe:['c_table','c_sofa']};   // 주인 곁(미션·! 자리)과 겹치지 않게 진열대·식탁에서
function buySpotAt(){ const L=G.life, m=W.map; if(!L||!BUY_AT[m]||typeof PLACE_IN==='undefined'||!PLACE_IN[m]) return null; if(L.age<6) return null;
  for(const f of PLACE_IN[m].f) if(BUY_AT[m].includes(f[5])&&distTo({r:f.slice(1,5)})<1.1) return {type:'buy',m,n:L.spotName(m),lab:`${L.spotName(m)} · ${m==='rest'||m==='cafe'?'사 먹기':'물건 사기'}`};
  return null; }
function pocket(L){ const y=L.age; if(L.age>=19) return null; const P=L.f.pk; if(!P||P.y!==y) L.f.pk={y,left:L.C.med*(.008+.012*clamp(L.w,0,1))*(L.age<13?.6:1)}; return L.f.pk; }
function openBuy(nr){ if(dlgOpen()) return; const L=G.life, grp=L.age<13?'c':L.age<19?'y':'a', list=(BUY[nr.m]||[]).filter(it=>it[4].includes(grp)), pk=pocket(L), Y=tkYear(L); Y.buy=Y.buy||0;
  const have=pk?pk.left:Math.max(0,L.cash), price=it=>Math.max(.05,L.C.med*it[1]);
  const opts=list.map(it=>`${it[0]} · ${fmtWon(price(it))}`).concat(['그냥 둘러본다']);
  const who=PLACE_IN[nr.m]?PLACE_IN[nr.m].n[0]:nr.n;
  dlgRun([{who,t:pk?`무엇을 살까? (올해 남은 용돈 ${fmtWon(pk.left)})`:`무엇을 살까? (가진 돈 ${fmtWon(L.cash)})`,opts,then:i=>{ const it=list[i]; if(!it) return [{who,t:pickOne(['또 오렴.','구경 잘 했어요?','다음에 또 와요.'])}];
    const pr=price(it); if(pr>have+.001) return [{who:'',t:pk?'용돈이 모자라 다음에 사기로 했다.':'돈이 모자라 다음에 사기로 했다.'}];
    if(pk) pk.left-=pr; else L.cash-=pr;
    let up=[]; if(Y.buy<BUY_CAP){ Y.buy++; up=tinyGain(L,it[2],''); }
    if(Y.buy===1) L.remember({a:L.age,t:`${L.spotName(nr.m)}에서 ${it[0]}${josa(it[0],'을','를').slice(it[0].length)} 샀다. ${it[3]}`,sp:nr.m});
    renderHud(); persist(); return [{who:'',t:it[3],up}]; }}]); }
// nearExtra · A 버튼에 잇기
(()=>{ const _ne=nearExtra; nearExtra=function(){ return mgSpotAt()||buySpotAt()||_ne(); };
  const _act=$('btnAct').onclick; $('btnAct').onclick=function(){ if(near&&$('sheet').hidden){ if(near.type==='mg'){ openMini(near); return; } if(near.type==='buy'){ openBuy(near); return; } } return _act.apply(this,arguments); }; })();
// ---------- 3) 학교 '내 자리' 이름표 ----------
(()=>{ const _d=draw; draw=function(t){ _d(t); try{ if(!qzSchoolMap(W.map)||!draw.cam||!qzCan(G.life)) return; const d=INT.f[MY_DESK], cx=draw.cam.x, cy=draw.cam.y;
  const sx=((d[1]+d[3]/2)*PX-cx)*SC, sy=((d[2]-.2)*PX-cy)*SC; if(sy>HUDH-10&&sy<VH) label('내 자리',sx,sy,10,'#FFF6DC','#283038'); }catch(e){} }; })();
