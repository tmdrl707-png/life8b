/* ========== 개발자 피드백(11-14 녹음) 반영 모음 ==========
   · 상태란은 더 투명하게, 한 해 막대는 미니맵 폭만큼만 짧게 미니맵 아래에 */
document.head.insertAdjacentHTML('beforeend',`<style>
.hud .hinfo{background:rgba(253,251,245,.42)!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.hud .timer{align-self:flex-start}
/* 내 정보 창: 글꼴·크기·색을 한 가지 규칙으로 (제목 1.05 · 본문 1 · 이름표 .92 · 보조 .86) */
#sheetBox .ibody,#sheetBox .itabs,#sheetBox .ibody *{font-family:inherit}
#sheetBox .ibody{color:#2E3A46;font-size:1rem;line-height:1.55;font-weight:400}
#sheetBox .icard h3{font-size:1.05rem;font-weight:800;color:#2E3A46}
#sheetBox .icard h3 small,#sheetBox .isub,#sheetBox .pcard small,#sheetBox .irow .iv small,#sheetBox .irow .iv .isub{font-size:.86rem;font-weight:400;color:#5F6B77;line-height:1.5}
#sheetBox .irow .ik,#sheetBox .whoami dt{font-size:.92rem;font-weight:700;color:#5F6B77}
#sheetBox .irow .iv,#sheetBox .ibig,#sheetBox .pcard p,#sheetBox .pcard div,#sheetBox .happy,#sheetBox .icard li,#sheetBox .icard p{font-size:1rem;font-weight:400;color:#2E3A46;line-height:1.55}
#sheetBox .irow .iv b,#sheetBox .ibig b,#sheetBox .pcard b{font-size:1rem;font-weight:800;color:#2E3A46}
#sheetBox .pcard>small{display:block}
#sheetBox .sixc .t2,#sheetBox .jn>span,#sheetBox .jlg,#sheetBox .sixl .tip{font-size:.86rem;color:#5F6B77}
#sheetBox .sixc .t1,#sheetBox .jn>b,#sheetBox .jn>strong{font-size:1rem;font-weight:800;color:#2E3A46}
#sheetBox .jsp .jt,#sheetBox .icard svg text{font-size:10px}
</style>`);
{ const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); try{ const t=document.querySelector('#hud .timer'), w=$('miniWrap'); if(t&&w) t.style.width=w.offsetWidth+'px'; }catch(e){} return r; }; }

/* ---------- 1) 미션(파란색)이 일반 말 걸기보다 먼저 ----------
   미션 주는 사람·가야 할 곳 가까이에 있으면(2.6칸 안) 그 사람에게 말 걸기·물건 만져 보기보다 미션이 먼저 뜬다. */
{ const _ne=nearExtra; nearExtra=function(){ const r=_ne.apply(this,arguments);
    try{ const L=G.life; if(L&&L.q&&r&&(r.type==='t'||r.type==='o')){ let best=null, bd=2.6;
        for(const tg of targets()){ if(tg.type!=='q'||tg.m!==W.map) continue; const d=Math.hypot(tg.p[0]-W.x,tg.p[1]-W.y); if(d<bd){ bd=d; best=tg; } }
        if(best) return best; } }catch(e){}
    return r; }; }

/* ---------- 2) 0살 처음: 위쪽 '내 정보'·'기억' 단추 안내 (한 번만) ---------- */
{ const _bp=beginPeriod; beginPeriod=function(){ const r=_bp.apply(this,arguments);
    try{ const L=G.life; if(L&&L.f&&L.age===0&&!L.f.gInfo){ L.f.gInfo=1; setTimeout(()=>{ try{ toast("위쪽의 '내 정보'에서 나와 가족을 볼 수 있고, '기억'에서 지나온 일을 다시 볼 수 있어요."); }catch(e){} },1400); } }catch(e){}
    return r; }; }

/* ---------- 3) 위쪽 능력치 동그라미를 누르면 설명 ---------- */
const STAT_INFO={
  h:{w:'몸이 얼마나 튼튼한지예요.',up:'뛰어놀기 · 운동하기 · 잘 먹고 푹 쉬기',dn:'다치거나 아플 때, 한 해 내내 몸을 안 움직였을 때, 나이가 들면서 조금씩'},
  r:{w:'곁에 있는 사람들과 얼마나 가까운지예요.',up:'가족·친구·이웃에게 말 걸기, 부탁 들어주기, 함께 놀기',dn:'오래 찾지 않거나 다투면 조금씩 멀어져요'},
  e:{w:'해 본 일, 가 본 곳이 얼마나 많은지예요.',up:'처음 만져 보는 물건, 처음 가 보는 곳, 새로운 놀이, 밭일, 여행',dn:'같은 일만 되풀이하면 잘 늘지 않아요'},
  k:{w:'배우고 익힌 것이 얼마나 쌓였는지예요.',up:'수업 듣기, 책 읽기, 문제 풀기, 도서관 가기',dn:'안 쓰면 조금씩 잊어요'},
  t:{w:'손으로 무언가를 해내는 재주와 일솜씨예요.',up:'만들기, 고치기, 그리기, 악기·운동 연습, 밭일, 일 해 보기',dn:'한동안 손을 놓으면 조금 무뎌져요'},
  m:{w:'모은 돈과 가진 재산이에요.',up:'용돈 모으기, 일해서 돈 벌기',dn:'쓰거나 빚이 생기면 줄어요'}
};
function statLevel(v){ return v>=66?'든든해요':v>=40?'보통이에요':'부족해요'; }
function openStatInfo(k){ const L=G.life; if(!L||!$('sheet').hidden||dlgOpen()) return;
  if(k==='joy'){ const j=Math.round(L.s.j||0);
    sheet(`<div class="place">행복</div><h2>행복 ${j}</h2><p class="sub">행복은 건강·관계·경험·지식 같은 능력치와, 삶을 시작할 때 '소중하다'고 고른 것에서 나오는 마지막 값이에요.</p>
      <ul class="small sub" style="text-align:left;margin:6px 0 10px 18px;padding:0;line-height:1.6"><li><b>올리려면</b> 여러 능력치를 골고루 채우고, 소중하게 여긴 것을 챙기세요.</li><li><b>내려가는 때</b> 몸이나 마음이 힘들거나 가까운 사람을 잃었을 때예요.</li></ul>
      <div class="row"><button class="btn primary" id="btnStatMore">자세히 보기</button><button class="btn" id="btnOk">닫기</button></div>`,'closable');
    $('btnOk').onclick=closeSheet; $('btnStatMore').onclick=()=>{ closeSheet(); openInfo('joy'); }; return; }
  const I=STAT_INFO[k]; if(!I) return; const S=sixState(L), x=S.find(z=>z.k===k); if(!x) return;
  if(!x.open){ sheet(`<div class="place">${SIX_N[k]}</div><h2>${SIX_N[k]} · ${x.at}살에 열려요</h2><p class="sub">${I.w}</p><p class="sub">아직은 알 수 없어요. ${x.at}살이 되면 나타나고, 그때부터 오르내려요.</p><div class="row"><button class="btn primary" id="btnOk">닫기</button></div>`,'closable'); $('btnOk').onclick=closeSheet; return; }
  const v=Math.round(x.v);
  sheet(`<div class="place">${SIX_N[k]}</div><h2><span class="ic" style="display:inline-grid;width:22px;height:22px;vertical-align:-4px;color:${SIX_COL[k]}">${sixIc(k)}</span> ${SIX_N[k]} ${v}${k==='m'?'':` · ${statLevel(x.v)}`}</h2><p class="sub">${I.w}</p>
    <ul class="small sub" style="text-align:left;margin:6px 0 10px 18px;padding:0;line-height:1.6"><li><b>올라요</b> ${I.up}</li><li><b>내려가요</b> ${I.dn}</li></ul>
    <div class="row"><button class="btn primary" id="btnStatMore">내 정보에서 보기</button><button class="btn" id="btnOk">닫기</button></div>`,'closable');
  $('btnOk').onclick=closeSheet; $('btnStatMore').onclick=()=>{ closeSheet(); openInfo('shape'); }; }
{ const hud=$('hud'); if(hud){ document.head.insertAdjacentHTML('beforeend','<style>#hRes{cursor:pointer}</style>'); hud.addEventListener('click',e=>{ try{ const el=e.target.closest('#hRes'); if(!el) return; if(e.target.closest('.jw')){ openStatInfo('joy'); return; }
      const si=e.target.closest('.si'); if(!si) return; const k=SIX[[...el.querySelectorAll('.si')].indexOf(si)]; if(k) openStatInfo(k); }catch(er){ console.warn(er); } }); } }

/* ---------- 4) 몸이 아플 때: 얼마나 쉬어야 하는지 보여 주고, 아파서 쉰 해는 '몸을 안 움직였다'로 치지 않는다 ---------- */
{ setInterval(()=>{ try{ const L=G.life, sk=$('hSick'); if(L&&G.running&&G.sickT>0&&!L.f.dying&&sk&&!sk.hidden) sk.textContent=`몸이 아파요 · 쉬는 중 · 약 ${Math.ceil(G.sickT)}초 남음`; }catch(e){} },400);
  const _ss=startSick; startSick=function(){ const r=_ss.apply(this,arguments); try{ const L=G.life; if(L&&L.f) L.f.sy=L.age; }catch(e){} return r; };
  const P=Life.prototype, _ep=P.endPeriod; P.endPeriod=function(){ try{ const L=this, Y=L.cur&&L.cur.tk; if(Y&&typeof G!=='undefined'&&G.life===L){ Y.c=Y.c||{};
        if(!Y.c.h){ const walked=(W.walk||0)-(G._walk0||0); if(L.f.sy===L.age||G.sickT>0||walked>=150) Y.c.h=1; } G._walk0=W.walk||0; } }catch(e){}
    return _ep.apply(this,arguments); }; }

/* ---------- 5) 실내 미니맵: 점이 무엇인지 이름표 (집·건물 안) ----------
   주황 점(작은 선택)·파란 점(미션)·회색 점(사람) 옆에 짧은 이름을 붙인다. */
{ const short=n=>{ n=String(n||'').replace(/\s*[·(].*$/,'').trim(); return n.length>4?n.slice(0,4):n; };
  const _dm=drawMini; drawMini=function(t){ _dm.apply(this,arguments);
    try{ if(W.map==='out'||!G.life) return; const c=$('mini'), x=c.getContext('2d'), s=Math.floor(Math.min(c.width/IW,c.height/IH)*.94), ox=Math.round((c.width-IW*s)/2), oy=Math.round((c.height-IH*s)/2), fs=Math.max(9,Math.round(c.height/13));
      x.save(); x.font=`700 ${fs}px sans-serif`; x.textBaseline='middle'; x.lineJoin='round'; x.lineWidth=3; x.strokeStyle='rgba(255,255,255,.92)';
      const put=(txt,px,py,col)=>{ if(!txt) return; const w=x.measureText(txt).width, X=Math.max(1,Math.min(c.width-w-1,px-w/2)), Y=Math.max(fs/2+1,Math.min(c.height-fs/2-1,py)); x.strokeText(txt,X,Y); x.fillStyle=col; x.fillText(txt,X,Y); };
      const used=[];   // 겹치는 글자는 건너뜀
      const free=(px,py)=>{ for(const u of used) if(Math.abs(u[0]-px)<fs*2.2&&Math.abs(u[1]-py)<fs*1.1) return false; used.push([px,py]); return true; };
      targets().forEach(k=>{ if(k.m!==W.map) return; const px=ox+k.p[0]*s, py=oy+k.p[1]*s-fs*.9; if(free(px,py)) put(short(k.n),px,py,k.type==='q'?'#1F4FBF':'#B4551F'); });
      if(W.map!=='home') (NPCMAP[W.map]||[]).forEach(n=>{ if(n.kind!=='p') return; let nm=''; try{ nm=whoOf(n).n; }catch(e){} const px=ox+n.x*s, py=oy+n.y*s-fs*.9; if(nm&&free(px,py)) put(short(nm),px,py,'#3C4A58'); });
      x.restore(); }catch(e){} }; }
