/* ========== 옆 동네로 (11-13) ==========
   우리 동네 지도(예전 지도 그대로)의 가장자리 길을 따라가면, 집 안에서 밖으로 나가듯 다른 지도로 넘어간다.
     · 서쪽 큰길 끝 → 옆 동네 (10살부터)    · 남쪽 길 끝 → 강가 마을 (13살부터)    · 동쪽 큰길 끝(탈것으로) → 큰 도시 (어른)
   - 지금 있는 지도는 W.zone (0 우리 동네). 지도가 바뀌면 OUT의 내용(크기·건물·길·나무·밭 …)을 그 지도 것으로 바꿔 끼우므로
     그리기·부딪힘·지나가는 사람·말 걸기는 예전 코드를 그대로 쓴다.
   - 우리 동네의 장소·장면(!)·미션이 다른 지도에 있으면, 화살표가 그쪽으로 가는 길(지도 가장자리)을 가리킨다.
   - 각 지도의 장소 이름·장면·미션은 engine/56-zone-places. */
const ZKEYS=['w','h','RY','b','deco','s','patch','roads','hw','fields','trees'];
const ZOFF=[-60,-60,0,0];                       // 그 지도에 없는 풍경(산·바다 …)은 지도 밖에
const ZONES=[{ id:0, data:Object.fromEntries(ZKEYS.map(k=>[k,OUT[k]])),
    gates:[{to:1,t:[-1,24,1.9,2],dir:[-1,0],sx:94.6,sy:23,age:10,beyond:[-8,25],sign:[2.4,23.1],nm:'옆 동네'},
           {to:2,t:[31.2,51.1,1.4,2],dir:[0,1],sx:31.7,sy:1.2,age:13,beyond:[31.9,60],sign:[34.6,50.6],nm:'강가 마을'},
           {to:3,t:[123.1,24,2,2],dir:[1,0],sx:1.3,sy:25,age:19,beyond:[132,25],sign:[121,23.1],nm:'큰 도시'},
           {to:4,t:[61.2,-1,1.4,1.9],dir:[0,-1],sx:46.7,sy:46.6,age:13,beyond:[61.9,-8],sign:[64.6,1.6],nm:'산과 숲'}], enter:[], as:{}, water:[], sand:[] }];
// 지도 하나 만들기: 건물 · 길 · 풍경을 받아 이웃집과 나무를 채운다
function mkZone(id,o){ const Z={w:o.w,h:o.h,RY:o.RY,b:o.b,deco:[],s:Object.assign({},o.s||{}),patch:Object.assign({play:ZOFF,nature:ZOFF,mount:ZOFF,sea:ZOFF,sand:ZOFF},o.patch||{}),roads:o.roads,hw:[9999,0,0,0],fields:o.fields||[],trees:[]};
  for(const k in Z.b){ const b=Z.b[k]; if(!Z.s[k]) Z.s[k]=[b[0]+b[2]/2,b[1]+b[3]+.6]; }
  Object.defineProperty(Z.b,'home',{value:ZOFF,enumerable:false,writable:true,configurable:true});   // 그리는 코드가 '우리 집' 자리를 찾을 때를 위해 (보이지 않음)
  const near=(x,y,r,p)=>x>r[0]-p&&x<r[0]+r[2]+p&&y>r[1]-p&&y<r[1]+r[3]+p, hit=(r,p)=>Object.values(Z.b).some(b=>near(r[0]+r[2]/2,r[1]+r[3]/2,[b[0]-r[2]/2,b[1]-r[3]/2,b[2]+r[2],b[3]+r[3]],p))
    ||Z.deco.some(d=>near(r[0]+r[2]/2,r[1]+r[3]/2,[d[0]-r[2]/2,d[1]-r[3]/2,d[2]+r[2],d[3]+r[3]],p))||Z.roads.some(q=>near(r[0]+r[2]/2,r[1]+r[3]/2,[q[0]-r[2]/2,q[1]-r[3]/2,q[2]+r[2],q[3]+r[3]],p))
    ||Object.values(Z.patch).some(q=>near(r[0]+r[2]/2,r[1]+r[3]/2,[q[0]-r[2]/2,q[1]-r[3]/2,q[2]+r[2],q[3]+r[3]],p))||Z.fields.some(q=>near(r[0]+r[2]/2,r[1]+r[3]/2,[q[0]-r[2]/2,q[1]-r[3]/2,q[2]+r[2],q[3]+r[3]],p))
    ||(o.water||[]).some(q=>near(r[0]+r[2]/2,r[1]+r[3]/2,[q[0]-r[2]/2,q[1]-r[3]/2,q[2]+r[2],q[3]+r[3]],p));
  // 이웃집: 길 양쪽에 일정한 간격으로 (다른 것과 겹치면 건너뛴다)
  const dw=o.dw||3.6, dh=o.dh||3, gap=o.gap||7;
  Z.roads.forEach((q,ri)=>{ const hor=q[2]>q[3];
    if(hor) for(let x=2;x<Z.w-dw-1;x+=gap){ for(const up of [1,0]){ const y=up?q[1]-dh-1.6:q[1]+q[3]+1.2, r=[x+(hash(x,ri*7+up)-.5)*1.2,y,dw,dh]; if(r[1]<1.2||r[1]+r[3]>Z.h-1.4) continue; if(!hit(r,1.1)) Z.deco.push(r.concat(o.zl?o.zl(r):'A')); } }
    else for(let y=2;y<Z.h-dh-1;y+=gap){ for(const lf of [1,0]){ const x=lf?q[0]-dw-1.4:q[0]+q[2]+1.2, r=[x,y+(hash(y,ri*5+lf)-.5)*1.2,dw,dh]; if(r[0]<1.2||r[0]+r[2]>Z.w-1.4) continue; if(!hit(r,1.1)) Z.deco.push(r.concat(o.zl?o.zl(r):'A')); } } });
  // 나무: 가장자리와 빈터에 (길·건물·물가는 비운다)
  const T=Z.trees, vr=Z.roads.filter(r=>r[3]>r[2]), hr=Z.roads.filter(r=>r[2]>r[3]), bl=Object.values(Z.b).concat(Z.deco), pats=Object.values(Z.patch);
  for(let x=0;x<Z.w;x+=1){ if(vr.some(r=>x+.5>r[0]-1.2&&x+.5<r[0]+r[2]+1.2)) continue; if(!(o.noTop)) T.push([x+.5,.45]); T.push([x+.5,Z.h-.45]); }
  for(let y=1;y<Z.h-1;y++){ if(hr.some(r=>y+.5>r[1]-1.4&&y+.5<r[1]+r[3]+1.4)||(o.water||[]).some(r=>y+.5>r[1]-1&&y+.5<r[1]+r[3]+1)) continue; if(!o.openW) T.push([.45,y+.5]); if(!o.openE) T.push([Z.w-.45,y+.5]); }
  const dens=o.trees==null?.42:o.trees;
  for(let gy=3;gy<Z.h-2;gy+=3.4) for(let gx=2.5;gx<Z.w-2;gx+=3.6){ const x=gx+(hash(Math.round(gx*10)+id,Math.round(gy*10))-.5)*1.6, y=gy+(hash(Math.round(gy*10),Math.round(gx*10)+7+id)-.5)*1.4;
    if(hash(Math.round(x*3)+id*5,Math.round(y*3)+11)>dens) continue;
    if(bl.some(b=>near(x,y,b,1.3))||bl.some(b=>x>b[0]+b[2]/2-1.4&&x<b[0]+b[2]/2+1.4&&y>b[1]+b[3]&&y<b[1]+b[3]+3)) continue;
    if(pats.some(p=>near(x,y,p,1))||Z.fields.some(f=>near(x,y,f,.7))||Z.roads.some(r=>near(x,y,r,1.7))||(o.water||[]).some(r=>near(x,y,r,1.2))) continue;
    if(Object.values(Z.s).some(p=>Math.hypot(p[0]-x,p[1]-y)<1.6)) continue;
    T.push([Math.round(x*10)/10,Math.round(y*10)/10]); }
  return {id,data:Z,gates:o.gates,enter:o.enter||[],as:o.as||{},water:o.water||[],sand:o.sand||[],title:o.title,force:o.force,pave:o.pave}; }

// 옆 동네: 집과 작은 가게, 공원과 연못, 작은 도서관·체육관·사원 (오른쪽 큰길 끝이 우리 동네)
ZONES[1]=mkZone(1,{w:96,h:48,RY:22, roads:[[0,22,96,2],[30,0,1.4,48],[62,0,1.4,48],[0,38,96,1.4]], openE:1,
  b:{ z1lib:[10,5,5,4], z1school:[36,4,8,5], z1shop:[50,15,4,3], z1wor:[68,4,6,5], z1rest:[78,15,4,3.4], z1gym:[36,27,6,4], z1friend:[84,28,4,3.4] },
  patch:{ play:[4,26,5,4], nature:[12,27,14,9] }, fields:[[66,30,8,2],[48,42,8,2]],
  s:{ z1park:[19,26.3] }, enter:['z1lib','z1shop','z1rest','z1gym','z1friend'],
  as:{ z1lib:'lib', z1school:'elem', z1shop:'shop', z1wor:'@wor', z1rest:'rest', z1gym:'gym', z1friend:'friend' },
  gates:[{to:0,t:[95.1,22,2,2],dir:[1,0],sx:1.2,sy:25,beyond:[104,23],sign:[92.5,21.1],nm:'우리 동네'}],
  zl:r=>r[1]>30?'B':'A', title:()=>'옆 동네' });
// 강가 마을: 큰 강과 다리, 들판과 장터 (위쪽 길 끝이 우리 동네)
ZONES[2]=mkZone(2,{w:96,h:48,RY:14, roads:[[0,14,96,2],[31,0,1.4,48],[66,0,1.4,23],[0,38,96,1.4]], noTop:1,
  b:{ z2clinic:[10,6,5,3.4], z2market:[40,5,7,4.5], z2hall:[52,6,5,3.4], z2rest:[74,17,4,3.4], z2barn:[80,30,6,4] },
  patch:{ nature:[84,4,8,6] }, fields:[[4,31,10,3],[17,31,10,3],[36,31,12,3],[52,31,10,3],[4,41,12,3],[20,41,8,3],[40,41,12,3],[70,41,12,3]],
  water:[[0,24,31,4],[32.4,24,63.6,4]], sand:[[0,23,31,1],[32.4,23,63.6,1],[0,28,31,1],[32.4,28,63.6,1]],
  s:{ z2river:[18,22.4], z2bridge:[31.7,26.2], z2field:[42,30.2] }, enter:['z2clinic','z2market','z2hall','z2rest'],
  as:{ z2clinic:'hosp', z2market:'market', z2hall:'hall', z2rest:'rest', z2barn:'@barn' },
  gates:[{to:0,t:[31,-1,1.4,1.9],dir:[0,-1],sx:31.9,sy:50.9,beyond:[31.7,-8],sign:[34.4,1.6],nm:'우리 동네'}],
  zl:()=>'A', force:'R', title:L=>{ const w=FACTS[L.c]&&FACTS[L.c].water; return w&&/(강|천)$/.test(w)?`${w} 강가 마을`:'강가 마을'; } });
// 큰 도시: 높은 건물과 넓은 길, 광장·박물관·역·백화점 (왼쪽 큰길 끝이 우리 동네)
ZONES[3]=mkZone(3,{w:100,h:48,RY:24, roads:[[0,24,100,2],[28,0,1.6,48],[56,0,1.6,48],[84,0,1.6,48],[0,10,100,1.4],[0,38,100,1.4]], openW:1, trees:.25, dw:4.4, dh:4, gap:6.5,
  b:{ z3hall:[4,13,9,6], z3tower:[14,27,8,7], z3mall:[32,12,11,7], z3lib:[60,13,8,6], z3hosp:[88,12,9,7], z3cafe:[32,28,4,3], z3bank:[40,27.5,5,4], z3station:[60,27.5,9,4.5], z3cinema:[88,28,8,5] },
  patch:{ play:[4,40,5,4], nature:[62,40,16,6.5] },
  s:{ z3plaza:[6.5,39.4], z3park:[70,39.4] }, enter:['z3lib','z3hosp','z3cafe','z3bank','z3station','z3mall'],
  as:{ z3hall:'@hall', z3tower:'@office', z3mall:'@mall', z3lib:'lib', z3hosp:'hosp', z3cafe:'cafe', z3bank:'bank', z3station:'station', z3cinema:'@studio' },
  gates:[{to:0,t:[-1,24,1.9,2],dir:[-1,0],sx:122.6,sy:25,beyond:[-8,25],sign:[3.2,23.1],nm:'우리 동네'}],
  zl:r=>'C', force:'U', pave:1, title:L=>L.town&&L.town!==L.C.city?`${L.C.city} 시내`:'시내 한복판' });
// 산과 숲: 숲길과 계곡, 산장과 산속 사원, 꼭대기 전망대 (아래쪽 길 끝이 우리 동네)
ZONES[4]=mkZone(4,{w:96,h:48,RY:36, roads:[[0,36,96,2],[46,7,1.4,41]], trees:.62, gap:11,
  b:{ z4view:[44,2.6,4,3], z4lodge:[56,30,5,3.6], z4temple:[16,6,6,4.5], z4shop:[36,39.6,4,3] },
  patch:{ nature:[8,24,12,8] }, water:[[0,19,46,2],[47.4,19,48.6,2]], sand:[[0,18,46,1],[47.4,18,48.6,1],[0,21,46,1],[47.4,21,48.6,1]],
  s:{ z4peak:[46.7,7.8], z4valley:[14,23.4], z4trail:[48.6,28] }, enter:['z4lodge','z4shop'],
  as:{ z4view:'@kiosk', z4lodge:'rest', z4temple:'@wor', z4shop:'shop' },
  gates:[{to:0,t:[46,46.1,1.4,2],dir:[0,1],sx:61.9,sy:1.2,beyond:[46.7,56],sign:[49.4,46.2],nm:'우리 동네'}],
  zl:()=>'A', force:'R', title:()=>'산과 숲' });
ZONES[0].title=()=>'우리 동네';
// 그 지도의 건물 안: 우리 동네의 비슷한 곳과 같은 모양(가구·사람·만져 볼 것)으로
const ZIN={z4lodge:'rest',z4shop:'shop',z1lib:'lib',z1shop:'shop',z1rest:'rest',z1gym:'gym',z1friend:'friend',z2clinic:'hosp',z2market:'market',z2hall:'hall',z2rest:'rest',z3lib:'lib',z3hosp:'hosp',z3cafe:'cafe',z3bank:'bank',z3station:'station',z3mall:'market'};
for(const k in ZIN) if(PLACE_IN[ZIN[k]]) PLACE_IN[k]=PLACE_IN[ZIN[k]];
W.zone=0; W.zt=0;
let zoneOfSpot=k=>SPOT_ZONE[k]||0;
function zoneTitle(z){ const L=G.life; try{ return ZONES[z].title(L); }catch(e){ return ''; } }
// 지도 바꾸기
function setZone(z,x,y){ const Z=ZONES[z]; if(!Z) return; const old=W.zone;
  ZONES[old].enter.forEach(k=>delete ENTER[k]); Object.assign(OUT,Z.data); Z.enter.forEach(k=>ENTER[k]='');
  W.zone=z; if(x!=null){ W.x=x; W.y=y; } W.zt=performance.now();
  terrain.k=null; worldLayer.k=null; miniBase.k=null; delete NPCMAP.out; draw.cam=null; near=null;
  if(old!==z&&G.life&&x!=null){ zoneFade(); toast(`${zoneTitle(z)}에 왔어요.${z?' 돌아갈 때는 들어온 길을 따라가세요.':''}`); } }
function zoneFade(){ let d=$('zfade'); if(!d){ d=document.createElement('div'); d.id='zfade'; d.style.cssText='position:fixed;inset:0;background:#141a20;opacity:0;pointer-events:none;transition:opacity .35s;z-index:30'; document.body.appendChild(d); }
  d.style.transition='none'; d.style.opacity='.85'; void d.offsetWidth; d.style.transition='opacity .45s'; d.style.opacity='0'; }
// 집·학교·일터 같은 우리 동네의 실내로 옮겨졌으면(집으로 돌아가 누움, 새해 등) 우리 동네 지도로
const ZMAP0=new Set(['home','elem','mid','work'].concat(Object.keys(PLACE_IN).filter(k=>!ZIN[k])));
function zoneSync(){ if(W.zone&&W.map!=='out'&&ZMAP0.has(W.map)) setZone(0); }
// 화면을 이루는 것들: 지도마다 따로 (그림 캐시·도시와 시골의 모습)
const _wk=worldKey; worldKey=function(){ return _wk()+'|z'+W.zone; };
const _tr=terrain; terrain=function(){ if(terrain._z!==W.zone){ terrain.k=null; terrain._z=W.zone; } const T=_tr(); if(W.zone&&!T._zp){ T._zp=1; const Z=ZONES[W.zone];
    const road=(x,y)=>onRoad(x+.5,y+.5,0);
    Z.sand.forEach(r=>{ for(let y=Math.floor(r[1]);y<r[1]+r[3];y++) for(let x=Math.floor(r[0]);x<r[0]+r[2];x++) if(T[y]&&T[y][x]&&!road(x,y)) T[y][x]='s'; });
    Z.water.forEach(r=>{ for(let y=Math.floor(r[1]);y<r[1]+r[3];y++) for(let x=Math.floor(r[0]);x<r[0]+r[2];x++) if(T[y]&&T[y][x]&&!road(x,y)) T[y][x]='w'; });
    if(Z.pave){ const nt=OUT.patch.nature, pl=OUT.patch.play; for(let y=0;y<OUT.h;y++) for(let x=0;x<OUT.w;x++){ const t=T[y][x]; if('gft'.includes(t)&&!inRect(x+.5,y+.5,nt,.5)&&!inRect(x+.5,y+.5,pl,.3)) T[y][x]='k'; } } }
  return T; };
const _visU=visU; visU=function(L){ if(W.zone&&ZONES[W.zone].force) return ZONES[W.zone].force==='U'; return _visU(L); };
const _kindOf=kindOf; kindOf=function(key){ const Z=ZONES[W.zone], a=Z&&Z.as&&Z.as[key]; if(!a) return _kindOf(key);
  if(a==='@wor') return /모스크/.test(worName(G.life))?'dome':'hall';
  if(a==='@mall'){ const C=G.life.C; return C.tier>=2&&!(C.tier===2&&C.gni<2)?'office':'market'; }
  if(a[0]==='@') return a.slice(1); return _kindOf(a); };
const _sol=solidsFor; solidsFor=function(map){ const o=_sol(map); if(map==='out'&&W.zone) ZONES[W.zone].water.forEach(r=>o.push(r)); return o; };
const _reach=reachOf; reachOf=function(a){ return W.zone&&W.map==='out'?[0,0,OUT.w,OUT.h]:_reach(a); };
// 지나가는 사람들: 그 지도의 길과 건물 앞에
const _npcBuild=npcBuild; npcBuild=function(map){ if(map!=='out'||!W.zone) return _npcBuild(map); const forest=W.zone===4;
  const L=G.life, list=[], P=o=>list.push(Object.assign({kind:'p',dir:0,fr:0,wt:R()*2,tx:null,spd:1.2,r:1.4,moving:false},o)), city=W.zone===3, RY=OUT.RY, walk=[];
  for(let x=5;x<OUT.w-3;x+=7) walk.push([x,RY-.65],[x+3.5,RY+2.65]);
  bldList().forEach(o=>{ if(o.deco&&!city) return; walk.push([o.b[0]+o.b[2]/2+1.2,o.b[1]+o.b[3]+1.3]); });
  for(let i=walk.length-1;i>0;i--){ const j=Math.floor(hash(i,7+W.zone)*(i+1)); [walk[i],walk[j]]=[walk[j],walk[i]]; }
  const n=city?28:W.zone===2?12:forest?9:18;
  for(let i=0;i<n;i++){ const p=walk[i%walk.length], lk=randLook(L.C.rg); P({key:'w'+i,x:p[0],y:p[1],ax:p[0],ay:p[1],look:lk,st:R()<(city?.08:.18)?'kid':R()<.15?'elder':'adult',long:R()<.5,r:3.5,spd:1+R()*.6}); }
  const pl=OUT.patch.play; if(pl[0]>0) for(let i=0;i<3;i++){ const lk=randLook(L.C.rg); P({key:'k'+i,x:pl[0]+1.5+i*1.2,y:pl[1]+pl[3]+.6,ax:pl[0]+2.5,ay:pl[1]+pl[3]+.6,look:lk,st:'kid',long:i%2===1,r:1.6,spd:1.8}); }
  const nt=OUT.patch.nature; if(nt[0]>0) for(let i=0;i<2;i++){ const lk=randLook(L.C.rg); P({key:'e'+i,x:nt[0]+2+i*4,y:nt[1]-.8,ax:nt[0]+2+i*4,ay:nt[1]-.8,look:lk,st:'elder',long:i%2===0,r:2,spd:.7}); }
  if(W.zone===2){ const fd=OUT.fields[0]; for(let i=0;i<3;i++) list.push({kind:'a',a:'chick',x:fd[0]+2+i*.7,y:fd[1]-.8,ax:fd[0]+2.5,ay:fd[1]-.8,r:1.6,wt:R(),tx:null,spd:.8,face:1,fr:0});
    list.push({kind:'a',a:'dog',x:20,y:RY+3,ax:20,ay:RY+3,r:3,wt:1,tx:null,spd:1.4,face:1,fr:0}); }
  else if(W.zone===1) list.push({kind:'a',a:'cat',x:50,y:RY-1.2,ax:50,ay:RY-1.2,r:2,wt:1,tx:null,spd:1,face:1,fr:0});
  const vk=L.C.veh.kind, kinds=city||L.C.tier>=3?['car','car','car',vk]:[vk,vk,'cycle','car'], rows=city?[RY,10,38]:[RY];
  rows.forEach((ry,ri)=>{ const cnt=city?(ri?4:8):W.zone===2?3:5; for(let i=0;i<cnt;i++){ const right=i%2===0, k=kinds[i%kinds.length], y0=ri?ry+(right?.35:1.05):(right?ry+.62:ry+1.58); list.push({kind:'v',v:k,x:(i*23+3+ri*11)%OUT.w,y:y0,vx:(right?1:-1)*(k==='car'?3.2:2.4),col:pickOne(CLOTHES),look:randLook(L.C.rg)}); } });
  NPCMAP[map]=list; return list; };
const _whoOf=whoOf; whoOf=function(n){ const r=_whoOf(n); if(W.map==='out'&&W.zone&&r&&r.role==='nb') r.n=W.zone===3?'지나가던 사람':W.zone===2?'마을 사람':W.zone===4?'등산객':'옆 동네 사람'; return r; };
// 걷기: 다른 지도에서는 그 지도의 건물 문으로 들어간다. 걷거나 탈것을 타고 가장자리 길에 닿으면 다른 지도로
function zoneWalk(dx,dy){ const r=.3, sol=solidsFor('out');
  let h=blocked('out',W.x+dx,W.y,r,sol); if(!h) W.x+=dx; else if(h[4]) say(h[4]);
  h=blocked('out',W.x,W.y+dy,r,sol); if(!h) W.y+=dy; else if(h[4]) say(h[4]);
  if(dy<0) for(const k of ZONES[W.zone].enter){ const d=doorOf(k); if(Math.abs(W.x-d[0])<.6&&W.y>d[1]&&W.y<d[1]+.45){ W.map=k; W.x=IDOOR[0]; W.y=8.6; W.dir=3; W.car=false; break; } } }
const _tryMove=tryMove; tryMove=function(dx,dy){ zoneSync();
  if(W.map==='out'&&W.zone&&!(W.car&&C_VEH()!=='horse')) zoneWalk(dx,dy); else _tryMove(dx,dy);
  if(W.map!=='out') return; const L=G.life;
  for(const g of ZONES[W.zone].gates){ if(!inRect(W.x,W.y,g.t)) continue; if(dx*g.dir[0]+dy*g.dir[1]<=0||performance.now()-W.zt<800) continue;
    if(g.age&&L.age<g.age){ say('아직은 혼자 가기엔 먼 곳이에요.'); W.zt=performance.now(); continue; }
    setZone(g.to,g.sx,g.sy); break; } };
const _lb=loopBody; loopBody=function(t){ zoneSync(); return _lb(t); };
// 할 일(!·미션)이 다른 지도에 있으면: 그쪽으로 가는 지도 가장자리를 가리킨다
function zoneExit(to){ const Z=ZONES[W.zone]; let g=Z.gates.find(q=>q.to===to)||Z.gates.find(q=>q.to===0)||Z.gates[0]; return g?g.beyond:[W.x,W.y]; }
const _targets=targets; targets=function(){ const L=G.life, out=_targets(); if(!L||!L.cur) return out;
  out.forEach(t=>{ let sp=null; if(t.type==='s'){ const c=L.cur.scenes[t.k]; sp=c&&SCENES[c.i].spot; } else if(t.type==='q'&&L.q){ const d=QUESTS[L.q.i]; sp=L.q.st===1?d.target:d.giver; }
    if(!sp) return; const z=t.m==='out'?zoneOfSpot(sp):t.m==='home'&&typeof homeZone==='function'?homeZone():0;
    if(z!==W.zone){ t.m='out'; t.p=zoneExit(z); t.key=null; } else if(t.m==='out'&&!t.p) t.p=OUT.s[sp]||zoneExit(0); });
  return out; };
// 미니맵: 지도 이름과 다른 지도로 가는 길
const _dm=drawMini; drawMini=function(t){ _dm(t); if(W.map!=='out') return; const c=$('mini'), x=c.getContext('2d'), L=G.life, v=viewRect(), k=Math.min(c.width/v[2],c.height/v[3]), ox=(c.width-v[2]*k)/2, oy=(c.height-v[3]*k)/2;
  if(W.zone) $('miniTag').textContent=zoneTitle(W.zone);
  ZONES[W.zone].gates.forEach(g=>{ if(g.age&&L.age<g.age&&(g.age>=13||L.age<9)) return; const gx=clamp(g.t[0]+g.t[2]/2,0,OUT.w), gy=clamp(g.t[1]+g.t[3]/2,0,OUT.h);
    if(gx<v[0]-1||gx>v[0]+v[2]+1||gy<v[1]-1||gy>v[1]+v[3]+1) return; const px=ox+(gx-v[0])*k, py=oy+(gy-v[1])*k;
    x.fillStyle='#283038'; x.fillRect(px-4,py-4,9,9); x.fillStyle='#F2C14E'; x.fillRect(px-3,py-3,7,7); }); };
// 화면: 다른 지도로 가는 길에 이정표
const _draw=draw; draw=function(t){ zoneSync(); _draw(t); try{ if(W.map!=='out'||!draw.cam) return; const L=G.life, cx=Math.round(draw.cam.x), cy=Math.round(draw.cam.y);
  ZONES[W.zone].gates.forEach(g=>{ const sx=(g.sign[0]*PX-cx)*SC, sy=(g.sign[1]*PX-cy)*SC; if(sx<-80||sx>VW+80||sy<HUDH-10||sy>VH) return;
    const arrow=g.dir[0]<0?'← ':g.dir[1]<0?'↑ ':'', tail=g.dir[0]>0?' →':g.dir[1]>0?' ↓':'', wait='';
    label(arrow+(g.to===0?'우리 동네':zoneTitle(g.to))+tail+wait,sx,sy,11,'#283038','#F8F8F0','#F2C14E'); }); }catch(e){} };
// 새해: 탈것을 더는 못 타게 된 나이에 큰 도시에 있으면 집으로 (돌아올 길이 없으므로)
const _bpZ=beginPeriod; beginPeriod=function(){ const r=_bpZ.apply(this,arguments); if(W.zone===3&&W.map==='out'&&G.life&&!canDrive()){ W.car=false; W.map='home'; W.x=7; W.y=8; zoneSync(); } return r; };
