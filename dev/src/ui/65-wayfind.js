/* ========== [2-1 세계·화면] 길 찾기 (2026-11-13) ==========
   건물이 어디 있는지 알기 어렵고, 누군가를 찾아가는 미션이 힘들다는 의견에 따라:
   1) 큰 지도(미니맵을 누르면)에 '갈 수 있는 곳' 목록 — 가까운 순. 하나를 누르면 그곳까지 길 안내가 켜진다.
   2) 길 안내: 화면 바닥에 발자국 점선, 위쪽 가운데에 '○○까지 N칸' 띠(✕로 끄기). 도착하면 저절로 꺼진다.
   3) 미션을 받으면 따로 고르지 않아도 그 미션의 목적지로 길 안내가 켜진다.
   4) 미니맵이 충분히 크게 보일 때(어린 나이, 동네가 좁을 때) 건물 이름을 미니맵에 적는다.
   길은 0.5칸 격자에서 목적지로부터 거리를 재어(너비 우선 탐색) 가장 가까운 쪽으로 이어 그린다. */
const WF={grid:null,gk:'',dist:null,dk:'',path:[],t:0};
G.guide=null;
const wfRes=.5;
function wfTarget(){ const L=G.life; if(!L||W.map!=='out') return null;
  if(L.q){ const t=targets().find(x=>x.type==='q'); if(t){ const p=t.m==='out'?t.p:(OUT.b[t.m==='home'?'home':t.m]?doorOf(t.m==='home'?'home':t.m):null); if(p) return {p,n:t.n,q:1}; } }
  const g=G.guide; if(!g) return null; if(g.z!==W.zone) return null; const b=OUT.b[g.k]; if(!b) return null;
  return {p:OUT.s[g.k]||doorOf(g.k),n:g.n}; }
function wfGrid(){ const key=[W.zone,G.life.age,W.car?1:0,worldKey()].join('|'); if(WF.gk===key) return WF.grid;
  const nx=Math.ceil(OUT.w/wfRes), ny=Math.ceil(OUT.h/wfRes), gr=new Uint8Array(nx*ny), sol=solidsFor('out');
  for(let j=0;j<ny;j++) for(let i=0;i<nx;i++){ const x=(i+.5)*wfRes, y=(j+.5)*wfRes; gr[j*nx+i]=blocked('out',x,y,.28,sol)?0:1; }
  WF.grid={nx,ny,gr}; WF.gk=key; WF.dk=''; return WF.grid; }
function wfDist(p){ const G0=wfGrid(), key=WF.gk+'|'+p[0].toFixed(1)+','+p[1].toFixed(1); if(WF.dk===key) return WF.dist;
  const {nx,ny,gr}=G0, d=new Int32Array(nx*ny).fill(-1), q=new Int32Array(nx*ny); let h=0,t=0;
  // 목적지 칸이 막혀 있으면(건물 문 앞 등) 가장 가까운 빈 칸에서 시작
  let ci=clamp(Math.floor(p[0]/wfRes),0,nx-1), cj=clamp(Math.floor(p[1]/wfRes),0,ny-1);
  if(!gr[cj*nx+ci]){ let best=null,bd=1e9; for(let dj=-6;dj<=6;dj++) for(let di=-6;di<=6;di++){ const i=ci+di,j=cj+dj; if(i<0||j<0||i>=nx||j>=ny||!gr[j*nx+i]) continue; const dd=di*di+dj*dj; if(dd<bd){ bd=dd; best=[i,j]; } } if(best){ ci=best[0]; cj=best[1]; } }
  d[cj*nx+ci]=0; q[t++]=cj*nx+ci;
  while(h<t){ const c=q[h++], i=c%nx, j=(c-i)/nx, v=d[c]+1;
    if(i>0&&gr[c-1]&&d[c-1]<0){ d[c-1]=v; q[t++]=c-1; } if(i<nx-1&&gr[c+1]&&d[c+1]<0){ d[c+1]=v; q[t++]=c+1; }
    if(j>0&&gr[c-nx]&&d[c-nx]<0){ d[c-nx]=v; q[t++]=c-nx; } if(j<ny-1&&gr[c+nx]&&d[c+nx]<0){ d[c+nx]=v; q[t++]=c+nx; } }
  WF.dist=d; WF.dk=key; return d; }
function wfPath(p){ const G0=wfGrid(), d=wfDist(p), {nx,ny}=G0; let i=clamp(Math.floor(W.x/wfRes),0,nx-1), j=clamp(Math.floor(W.y/wfRes),0,ny-1);
  if(d[j*nx+i]<0){ let best=null,bd=1e9; for(let dj=-3;dj<=3;dj++) for(let di=-3;di<=3;di++){ const a=i+di,b=j+dj; if(a<0||b<0||a>=nx||b>=ny) continue; const v=d[b*nx+a]; if(v>=0&&v<bd){ bd=v; best=[a,b]; } } if(!best) return null; [i,j]=best; }
  const out=[]; let c=j*nx+i, g=0; while(d[c]>0&&g++<2000){ const ci=c%nx, cj=(c-ci)/nx; out.push([(ci+.5)*wfRes,(cj+.5)*wfRes]);
    let nb=c; for(const n of [c-1,c+1,c-nx,c+nx]){ if(n<0||n>=d.length) continue; const ni=n%nx; if(Math.abs(ni-ci)>1) continue; if(d[n]>=0&&d[n]<d[nb]) nb=n; } if(nb===c) break; c=nb; }
  return out; }
// 위쪽 가운데 안내 띠
function wfBar(t,steps){ let b=$('guideBar'); if(!t){ if(b) b.hidden=true; return; }
  if(!b){ document.head.insertAdjacentHTML('beforeend',`<style>#guideBar{position:absolute;left:50%;transform:translateX(-50%);top:calc(var(--hudH,150px) + 4px);z-index:6;background:rgba(40,48,56,.88);color:#FFF6DC;border:2px solid #F2C14E;border-radius:999px;padding:3px 6px 3px 14px;font-size:.86rem;display:flex;gap:8px;align-items:center;white-space:nowrap;pointer-events:auto}
#guideBar b{color:#F2C14E;font-weight:700} #guideBar button{background:none;border:0;color:#FFF6DC;font-size:1rem;padding:0 6px;cursor:pointer}
@media (max-height:460px){ #guideBar{font-size:.72rem;padding:2px 4px 2px 10px} }</style>`);
    $('s-game').insertAdjacentHTML('beforeend','<div id="guideBar" hidden><span></span><button type="button" aria-label="길 안내 끄기">✕</button></div>'); b=$('guideBar');
    b.querySelector('button').onclick=e=>{ e.stopPropagation(); const L=G.life; WF.off=L&&L.q?'q'+L.q.i+'-'+L.q.st:'g'; G.guide=null; wfBar(null); }; }
  const s=b.querySelector('span'), txt=`길 안내 · <b>${esc(t.n)}</b>까지 ${steps}칸`; if(s.innerHTML!==txt) s.innerHTML=txt; b.hidden=false; }
// 화면에 발자국 점선
const _wfDraw=draw; draw=function(t){ _wfDraw(t); try{ const L=G.life; if(!L||!draw.cam||W.map!=='out'||!$('s-game')||$('s-game').hidden){ wfBar(null); return; }
  const tg=wfTarget(), sig=tg&&tg.q?'q'+L.q.i+'-'+L.q.st:'g'; if(!tg||WF.off===sig){ WF.path=[]; wfBar(null); return; }
  const now=performance.now(); if(now-WF.t>250||!WF.path.length){ WF.t=now; WF.path=wfPath(tg.p)||[]; }
  const P=WF.path; if(Math.hypot(tg.p[0]-W.x,tg.p[1]-W.y)<1.6){ if(!tg.q&&G.guide){ toast(`${tg.n}에 도착했어요.`,'news'); G.guide=null; } WF.path=[]; wfBar(null); return; }
  if(!P.length){ wfBar(null); return; }
  wfBar(tg,Math.round(P.length*wfRes));
  const cx=Math.round(draw.cam.x), cy=Math.round(draw.cam.y), r=Math.max(2,SC*1.4);
  g.save(); for(let k=2;k<P.length;k+=2){ const sx=(P[k][0]*PX-cx)*SC, sy=(P[k][1]*PX-cy)*SC; if(sx<-10||sx>VW+10||sy<HUDH-10||sy>VH+10) continue;
    g.fillStyle='rgba(40,48,56,.55)'; g.beginPath(); g.arc(sx,sy,r+1.5,0,7); g.fill(); g.fillStyle=tg.q?'#8FB8F8':'#F2C14E'; g.beginPath(); g.arc(sx,sy,r,0,7); g.fill(); }
  g.restore(); }catch(e){} };
// 미니맵: 건물 이름(충분히 클 때) + 길 안내 점선
const _wfMini=drawMini; drawMini=function(t){ _wfMini(t); try{ if(W.map!=='out') return; const c=$('mini'), x=c.getContext('2d'), L=G.life, v=viewRect(), k=Math.min(c.width/v[2],c.height/v[3]), ox=(c.width-v[2]*k)/2, oy=(c.height-v[3]*k)/2;
  const P=(px,py)=>[ox+(px-v[0])*k,oy+(py-v[1])*k];
  if(WF.path&&WF.path.length){ x.fillStyle='#F2C14E'; for(let i=0;i<WF.path.length;i+=3){ const p=P(...WF.path[i]); x.fillRect(p[0]-2,p[1]-2,4,4); } }
  if(k<5) return; x.font=`bold ${Math.round(clamp(k*1.5,15,22))}px ${LABEL_FONT}`; x.textAlign='center'; x.textBaseline='middle'; x.lineJoin='round';
  for(const key in OUT.b){ if(key==='bus') continue; const b=OUT.b[key]; if(!inReach(b[0]+b[2]/2,b[1]+b[3])) continue; const p=P(b[0]+b[2]/2,b[1]+b[3]/2), nm=key==='home'?'우리 집':L.spotName(key);
    x.lineWidth=4; x.strokeStyle='#283038'; x.strokeText(nm,p[0],p[1]); x.fillStyle='#FFFFFF'; x.fillText(nm,p[0],p[1]); } }catch(e){} };
// 큰 지도 아래 '갈 수 있는 곳' 목록
const _wfMaps=openMaps; openMaps=function(tab){ _wfMaps(tab); try{ if(tab!=='town'||W.map!=='out') return; const L=G.life, cv=$('bigMap'); if(!cv) return;
  const me=[W.x,W.y], list=Object.keys(OUT.b).filter(k=>k!=='bus'&&inReach(OUT.b[k][0]+OUT.b[k][2]/2,OUT.b[k][1]+OUT.b[k][3])).map(k=>{ const p=OUT.s[k]||doorOf(k); return {k,n:k==='home'?'우리 집':L.spotName(k),d:Math.round(Math.hypot(p[0]-me[0],p[1]-me[1]))}; }).sort((a,b)=>a.d-b.d);
  if(!list.length) return;
  if(!$('wfCss')) document.head.insertAdjacentHTML('beforeend',`<style id="wfCss">.wflist{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 4px}.wflist button{border:1.5px solid #283038;background:#FFF6DC;color:#283038;border-radius:8px;padding:4px 10px;font-size:.86rem;cursor:pointer}.wflist button small{color:#6b6f7a;margin-left:4px}.wflist button.on{background:#F2C14E}</style>`);
  const cur=G.guide&&G.guide.z===W.zone?G.guide.k:null;
  cv.insertAdjacentHTML('afterend',`<p class="small sub" style="margin:8px 0 0">갈 곳을 누르면 그곳까지 길을 안내해요.</p><div class="wflist">${list.map(o=>`<button type="button" data-k="${o.k}" class="${o.k===cur?'on':''}">${esc(o.n)}<small>${o.d}칸</small></button>`).join('')}</div>`);
  $('sheetBox').querySelectorAll('.wflist button').forEach(b=>b.onclick=()=>{ const o=list.find(x=>x.k===b.dataset.k); G.guide={k:o.k,n:o.n,z:W.zone}; WF.off=0; WF.path=[]; closeSheet(); toast(`길 안내: ${o.n}`,'news'); });
}catch(e){} };
