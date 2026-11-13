/* ========== 세계 ==========
   단위는 칸(16×16 도트). 바깥은 왼쪽부터 동네(A) → 큰길 건너(B) → 일터가 있는 곳(C) → 탈것 전용 길 → 먼 곳(D, 그 나라의 명소).
   우리 집 · 초등학교 · 중·고등학교 · 일터는 문으로 들어갈 수 있다. */
const OUT={w:124,h:52, RY:24,
  // 동네(왼쪽 위, 6살부터) → 큰길 아래 동네(10살부터) → 큰길 건너(13살부터) → 일터가 있는 곳(어른) → 탈것 전용 길 → 먼 곳(탈것)
  b:{ home:[3,3,5,4], friend:[12,3,4,3.4], shop:[21,4,4,3], elem:[19,12,6,4],
      lib:[12,30,5,4],
      mid:[36,3,7,5], study:[47,4,4,4], gym:[53,11,6,4], market:[35,29,6,4], rest:[46,29,4,3.4], bus:[44,26.3,2,1.2],
      work:[66,3,6,6], cafe:[76,5,4,3], bank:[84,4,5,4], hosp:[66,29,5,4], hall:[76,29,5,3.4], post:[85,29,4,3.4], station:[74,44,6,3],
      far:[103,30,6,4] },
  // 들어갈 수 없는 이웃집·건물 (동네를 채운다) [x, y, 너비, 높이, 구역]
  deco:[[12,11,3.6,3,'A'],[26,10,3.6,3,'A'],[13,17,3.6,3,'A'],[25,17,3.6,3,'A'],
        [3,30,3.6,3,'A'],[21,30,3.6,3,'A'],[3,44,4,3,'A'],[13,44.5,3.6,3,'A'],[22,44,4,3.4,'A'],
        [36,12,4,3,'B'],[45,13,4,3.4,'B'],[53,29,4,3.4,'B'],[36,44,5,4,'B'],[47,44,4,3.4,'B'],[54,44,4,3,'B'],
        [66,13,4,4,'C'],[77,13,5,4,'C'],[85,13,4,3.4,'C'],[65,44,4,3.4,'C'],[85,44,4,3,'C'],
        [100,42,4,3,'D'],[110,42,4,3,'D'],[116,30,4,3,'D']],
  s:{ play:[5.5,13], nature:[5,19], mount:[102.7,10.8], sea:[119.5,18.8] },
  patch:{ play:[3,11,5,4], nature:[2,16.5,7,5], mount:[100,3,6,8], sea:[115,0,9,18], sand:[114.3,18,9.7,1.6] },
  roads:[[0,24,124,2],[31.2,0,1.4,52],[61.2,0,1.4,52],[0,41,92,1.4]], hw:[92,0,4,52],
  fields:[[9,8.5,9,1.6],[26,14.2,4,1.4],[3,36,8,2.4],[20,36,8,2.4],[41,18,8,1.8],[52,36,6,2],[78,19,8,2],[64,36,8,2],[100,20,9,3],[110,36,8,3]],
  trees:[] };
for(const k in OUT.b){ const b=OUT.b[k]; if(!OUT.s[k]) OUT.s[k]=[b[0]+b[2]/2,b[1]+b[3]+.6]; }
const natureWater=()=>{ const p=OUT.patch.nature; return [p[0]+.6,p[1]+.6,p[2]-1.2,p[3]-1.2]; };
// 나이에 따라 갈 수 있는 곳: 처음 집 밖에 나서면 동네 한 귀퉁이만, 자랄수록 넓어진다 (갈 수 없는 곳은 가려 둔다)
// 갈 수 있는 곳(11-13 다시 짬): 9살까지 동네 위쪽 → 12살까지 동네 아래쪽(아래 큰길 전까지) → 15살까지 큰길 건너(중학교) → 18살까지 아래 큰길 너머(고등학교) → 어른은 모두
function reachOf(a){ return a<10?[0,0,31.9,23.75]:a<13?[0,0,31.9,40.5]:a<16?[0,0,61.9,40.5]:a<19?[0,0,61.9,OUT.h]:[0,0,OUT.w,OUT.h]; }
function inReach(x,y){ const r=reachOf(G.life.age); return x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3]; }
function reachMsg(x,y){ const a=G.life.age, r=reachOf(a); return '아직은 혼자 가기엔 먼 곳이에요.'; }
const reachAge=a=>a<10?10:a<13?13:a<19?19:null;
const roadGap=i=>OUT.roads.some(r=>r[3]>r[2]&&i+1>=r[0]-.6&&i<=r[0]+r[2]+.6)||(i>=OUT.hw[0]-1&&i<=OUT.hw[0]+OUT.hw[2]+1);
function viewRect(){ const r=reachOf(G.life.age), x0=Math.max(0,r[0]-1.5), y0=Math.max(0,r[1]-1.5), x1=Math.min(OUT.w,r[0]+r[2]+1.5), y1=Math.min(OUT.h,r[1]+r[3]+1.5); return [x0,y0,x1-x0,y1-y0]; }
// 아직 갈 수 없는 곳은 구름처럼 가려 둔다 (가장자리는 부드럽게)
function drawFog(c,X,Y){ const r=reachOf(G.life.age); if(r[2]>=OUT.w&&r[3]>=OUT.h) return;
  const xr=X(r[0]+r[2]), yb=Y(r[1]+r[3]), L0=X(0)-80, T0=Y(0)-80, R0=X(OUT.w)+80, B0=Y(OUT.h)+80, col='28,40,52', E=14;
  c.save(); c.fillStyle=`rgba(${col},.95)`;
  if(r[2]<OUT.w){ c.fillRect(xr+E,T0,R0-xr-E,B0-T0); const g1=c.createLinearGradient(xr,0,xr+E,0); g1.addColorStop(0,`rgba(${col},0)`); g1.addColorStop(1,`rgba(${col},.95)`); c.fillStyle=g1; c.fillRect(xr,T0,E,B0-T0); }
  if(r[3]<OUT.h){ c.fillStyle=`rgba(${col},.95)`; c.fillRect(L0,yb+E,Math.min(xr,R0)-L0,B0-yb-E); const g2=c.createLinearGradient(0,yb,0,yb+E); g2.addColorStop(0,`rgba(${col},0)`); g2.addColorStop(1,`rgba(${col},.95)`); c.fillStyle=g2; c.fillRect(L0,yb,Math.min(xr,R0)-L0,E); }
  c.restore(); }
// 건물 목록: 이름 있는 건물 + 이웃집
function bldList(){ return Object.keys(OUT.b).map(k=>({k,b:OUT.b[k]})).concat(OUT.deco.map((d,i)=>({k:'deco'+i,b:d,deco:1}))); }
// 방 안의 가구: 집 · 학교/일터 · 동네 건물마다
function furnOf(m){ return m==='home'?HOME.f:(typeof PLACE_IN!=='undefined'&&PLACE_IN[m]&&PLACE_IN[m].f)||INT.f; }
// 나무: 가장자리를 두르고, 동네 곳곳에 고정된 자리로 (드나드는 길·건물·밭은 비운다)
(function(){ const T=OUT.trees, near=(x,y,r,p)=>x>r[0]-p&&x<r[0]+r[2]+p&&y>r[1]-p&&y<r[1]+r[3]+p;
  const vr=OUT.roads.filter(r=>r[3]>r[2]), hr=OUT.roads.filter(r=>r[2]>r[3]);
  for(let x=0;x<OUT.hw[0]-1;x++){ if(vr.some(r=>x+.5>r[0]-1.2&&x+.5<r[0]+r[2]+1.2)) continue; T.push([x+.5,.45]); T.push([x+.5,OUT.h-.45]); }
  for(let y=1;y<OUT.h-1;y++){ if(hr.some(r=>y+.5>r[1]-1.4&&y+.5<r[1]+r[3]+1.4)) continue; T.push([.45,y+.5]); }
  const bl=bldList().map(o=>o.b), pats=Object.values(OUT.patch);
  for(let gy=3;gy<OUT.h-2;gy+=3.4) for(let gx=2.5;gx<OUT.w-2;gx+=3.6){ const x=gx+(hash(Math.round(gx*10),Math.round(gy*10))-.5)*1.6, y=gy+(hash(Math.round(gy*10),Math.round(gx*10)+7)-.5)*1.4;
    if(hash(Math.round(x*3),Math.round(y*3)+11)>.42) continue;
    if(bl.some(b=>near(x,y,b,1.3))||bl.some(b=>x>b[0]+b[2]/2-1.4&&x<b[0]+b[2]/2+1.4&&y>b[1]+b[3]&&y<b[1]+b[3]+3)) continue;
    if(pats.some(p=>near(x,y,p,1))||OUT.fields.some(f=>near(x,y,f,.7))||OUT.roads.some(r=>near(x,y,r,1.7))||near(x,y,OUT.hw,1.6)) continue;
    if(Object.values(OUT.s).some(p=>Math.hypot(p[0]-x,p[1]-y)<1.6)) continue;
    T.push([Math.round(x*10)/10,Math.round(y*10)/10]); } })();
const ENTER={home:'',elem:'초등학교는 일곱 살부터, 학교에 다니는 동안 들어갈 수 있어요.',mid:'',work:'일터가 생기면 들어갈 수 있어요.',
  friend:'',shop:'',lib:'',study:'',gym:'',market:'',rest:'',cafe:'',bank:'',hosp:'',hall:'',post:'',station:''};   // 동네 건물도 들어가서 사람·물건과 만날 수 있다
const doorOf=k=>{ const b=OUT.b[k]; return [b[0]+b[2]/2,b[1]+b[3]]; };
const HOME={ s:{ mom:[2.6,2.7], table:[5.6,2.9], dad:[9,2.7], tv:[11.8,2.7], gran:[2.4,6.9], sib:[5.4,7.2], desk:[9,7.3], yard:[12.2,7.2], spouse:[7.4,4.8], kid:[4,5] },
  f:[['counter',1,1,3,.8],['table',4.8,1.1,1.6,.9],['sofa',8,1,2.2,.8],['tv',11,1,1.7,.5],['bed',.9,8.1,2.2,1],['desk',8.3,8.3,1.6,.7]] };
// 학교와 일터의 안: 같은 뼈대에 이름과 가구만 바꾼다 (P[0]·P[2]는 돌아다니는 사람)
const INT={ P:[[7,3],[3.2,5.2],[10.7,5.2],[12.6,3.3],[2.2,7.4],[11.6,7.5]],
  f:[['board',4,.62,6,.45],['desk',4.3,4.3,1,.6],['desk',6,4.3,1,.6],['desk',7.7,4.3,1,.6],['desk',4.3,5.9,1,.6],['desk',6,5.9,1,.6],['desk',7.7,5.9,1,.6],['shelf',.9,8.3,2.6,.7],['table',10.3,8.4,2.6,.7]],
  n:{ school:['선생님','내 자리','친구 자리','창가','도서 코너','급식실'], office:['팀장님','내 자리','동료','창가','회의실','휴게실'], factory:['반장님','내 기계','동료','창가','부품 창고','휴게실'],
      farm:['이웃 어르신','내 작업대','이웃 농부','창가','종자 창고','쉼터'], herd:['목장 주인','먹이 통','동료 목동','창가','건초 더미','쉼터'], shop:['단골손님','계산대','옆 가게 사장님','진열대','창고','쉼터'],
      hosp:['선배','진료실','동료','창가','약품실','휴게실'], dream:['선배','내 작업대','동료','창가','자료실','쉼터'], fish:['선장님','그물 손질대','동료 어부','창가','얼음 창고','쉼터'],
      mine:['반장님','장비대','동료 광부','환기구','장비 창고','쉼터'], tour:['손님','안내 데스크','동료','창가','지도 보관함','쉼터'], part:['사장님','내 자리','동료','창가','창고','휴게실'] } };
const IW=14, IH=10, IDOOR=[7,9.5];
const intKind=m=>m==='work'?((G.life.job||{}).kind||'part'):m==='home'?'home':(typeof PLACE_IN!=='undefined'&&PLACE_IN[m])?PLACE_IN[m].kind:'school';
const intNames=m=>(typeof PLACE_IN!=='undefined'&&PLACE_IN[m]&&PLACE_IN[m].n)||INT.n[intKind(m)]||INT.n.part;
const W={map:'home',x:7,y:5,dir:0,walk:0,car:false};
const PERSON_KEYS=['mom','dad','gran','sib','spouse','kid'];
// 장면·사람이 있는 위치: 사람은 돌아다니므로 지금 서 있는 곳
function posOfSpot(key,idx){
  if(SPOTS[key].z==='H'){ const n=PERSON_KEYS.includes(key)?npcFind('home',key):null; return {m:'home',p:n?[n.x,n.y]:HOME.s[key],n:G.life.spotName(key)}; }
  if(key==='elem'||key==='mid'||key==='high'||key==='work'){ const i=(idx||0)%INT.P.length, n=(i===0||i===2)?npcFind(key,'p'+i):null; return {m:key,p:n?[n.x,n.y]:INT.P[i],n:G.life.spotName(key)+' · '+intNames(key)[i]}; }
  return {m:'out',p:OUT.s[key],n:G.life.spotName(key)};
}
const scenePos=i=>posOfSpot(SCENES[i].spot,i);
const giverName=k=>(k==='elem'||k==='mid'||k==='high')?'선생님':k==='work'?intNames('work')[0]:G.life.spotName(k);
const inRect=(x,y,r,p)=>x>r[0]-(p||0)&&x<r[0]+r[2]+(p||0)&&y>r[1]-(p||0)&&y<r[1]+r[3]+(p||0);
const onRoad=(x,y,pad)=>OUT.roads.some(r=>inRect(x,y,r,pad));
function solidsFor(map){
  const L=G.life, a=L.age, out=[];
  if(map==='home'){ HOME.f.forEach(f=>out.push(f.slice(1))); if(L.famI===0) out.push([12,4.2,1.5,.7]); }
  else if(map!=='out') furnOf(map).forEach(f=>out.push(f.slice(1,5)));
  else{ bldList().forEach(o=>out.push(o.b.slice(0,4))); OUT.trees.forEach(t=>out.push([t[0]-.3,t[1]-.25,.6,.55])); out.push(OUT.patch.sea);
    if(L.set==='R') out.push(natureWater());
    if(!(W.car&&C_VEH()==='horse')) out.push(OUT.hw.concat(`여기부터는 ${josa(L.C.veh.n,'을','를')} 타야 갈 수 있어요.`)); }
  return out;
}
const C_VEH=()=>G.life.C.veh.kind;
// 그 자리에 설 수 있는가 (r: 몸 반지름)
function blocked(map,x,y,r,sol){
  if(map!=='out'){ const inDoor=Math.abs(x-IDOOR[0])<.7&&y>9; if(x<.7||x>IW-.7||y<1.25||(y>9.2&&!inDoor)) return 1; }
  else if(x<.4||x>OUT.w-.4||y<.4||y>OUT.h-.4) return 1;
  else if(!inReach(x,y)) return [0,0,0,0,reachMsg(x,y)];
  for(const s of sol) if(x+r>s[0]&&x-r<s[0]+s[2]&&y+r>s[1]&&y-r<s[1]+s[3]) return s; return 0; }
function tryMove(dx,dy){
  const L=G.life, r=.3, vk=C_VEH();
  if(W.car&&vk!=='horse'){ const nx=clamp(W.x+dx,.6,OUT.w-.6); let stop=!inReach(nx,W.y); if(stop) say('아직은 여기까지만 갈 수 있어요.'); else if(onRoad(nx,W.y,-.25)) W.x=nx; if(onRoad(W.x,W.y+dy,-.25)) W.y+=dy; return; }
  const sol=solidsFor(W.map), inside=W.map!=='out';
  let h=blocked(W.map,W.x+dx,W.y,r,sol); if(!h) W.x+=dx; else if(h[4]) say(h[4]);
  h=blocked(W.map,W.x,W.y+dy,r,sol); if(!h) W.y+=dy; else if(h[4]) say(h[4]);
  if(inside&&W.y>9.55){                                        // 문 밖으로
    if(W.map==='home'&&L.age<6){ W.y=9.1; say('아직 혼자 밖에 나갈 수 없어요.'); }
    else if(W.map==='home'&&isSick()){ W.y=9.1; say(L.f.dying?'몸이 많이 약해져 집 밖으로 나갈 수 없어요.':'몸이 아파 집에서 쉬어야 해요. 나을 때까지 기다려요.'); }
    else { const d=doorOf(W.map); W.map='out'; W.x=d[0]; W.y=d[1]+.9; W.dir=0; } }
  else if(!inside&&dy<0) for(const k in ENTER){ const d=doorOf(k); if(Math.abs(W.x-d[0])<.6&&W.y>d[1]&&W.y<d[1]+.45){   // 문 안으로
    if(k==='elem'&&!(L.age>=7&&L.age<=12&&L.f.elem)){ say(ENTER.elem); break; } if(k==='high'&&!(L.age>=16&&L.age<=18&&L.f.hs)){ say('고등학교는 그 학교 학생만 들어갈 수 있어요.'); break; } if(k==='work'&&!L.f.job){ say(ENTER.work); break; }
    W.map=k; W.x=IDOOR[0]; W.y=8.6; W.dir=3; W.car=false; break; } }
}
let lastSay=0; function say(t){ const n=Date.now(); if(n-lastSay<2600) return; lastSay=n; toast(t); }
const canDrive=()=>G.life.age>=G.life.C.veh.age&&G.life.age<75;
const VSPEED={car:10.5,moto:9,cycle:7,horse:8};
// 나이에 따라 달라지는 빠르기: 기어 다니는 아기 → 아장아장 → 뛰어다니는 아이 → 어른 → 느려지는 노년
function speedOf(a){ const base=W.car?VSPEED[C_VEH()] : a<2?.9 : a<6?2.2 : a<13?4.7 : a<19?5.2 : a<60?4.4 : a<75?3.3 : 2.3; return base*(G.life&&G.life.f.dying?.3:isSick()?.38:1); }
// 아플 때: 집으로 돌아가 침대 곁에서 느리게 움직인다
const isSick=()=>!!(G.life&&(G.life.f.dying||G.sickT>0));
function goHomeBed(){ W.car=false; W.map='home'; W.x=3.7; W.y=8.5; W.dir=1; NPCMAP={}; }
function startSick(name){ const L=G.life; if(L.f.dying||G.sickT>0) return; const r=L.getSick(name); G.sickT=caughtUp()?26:clamp(G.sec*.3,8,24); goHomeBed();
  flash('몸이 아파요 · 집으로',`${josa(r.n,'으로','로')} 몸져누웠다. 나을 때까지 집 안에서 천천히 움직여요.`,r.fx,null,true); renderHud(); persist(); }

/* ========== 함께 사는 사람들 · 동네 사람들 · 동물 · 오가는 탈것 ========== */
let NPCMAP={};
function npcFind(map,key){ const l=NPCMAP[map]; return l?l.find(n=>n.key===key):null; }
function famLook(key){ const L=G.life; L.looks=L.looks||{}; if(!L.looks[key]) L.looks[key]=randLook(L.C.rg,L.look); return L.looks[key]; }
function stageAt(age){ return age<2?'baby':age<6?'tod':age<13?'kid':age>=62?'elder':'adult'; }
function npcBuild(map){
  const L=G.life, list=[], P=(o)=>list.push(Object.assign({kind:'p',dir:0,fr:0,wt:R()*2,tx:null,spd:1.2,r:1.4,moving:false},o));
  if(map==='home'){ const a=L.age, male=L.sex===0;
    const fm=L.fam, hg=fm&&fm.gp.find(g=>g.home), ages={mom:fm?fm.mom.a0+a:a+28,dad:fm?fm.dad.a0+a:a+30,gran:hg?hg.a0+a:a+60,sib:L.ppl.sib&&L.ppl.sib.d!=null?a-L.ppl.sib.d:a-3,spouse:a,kid:L.kidHome()?a-(L.f.kidBorn||a):5};
    PERSON_KEYS.forEach(k=>{ if(!L.spotOK(k)) return; const p=HOME.s[k], lk=famLook(k), age=k==='kid'&&!L.kidHome()?6:ages[k];
      P({key:k,x:p[0],y:p[1],ax:p[0],ay:p[1],look:lk,st:stageAt(Math.max(0,age)),long:k==='mom'||k==='gran'||(k==='spouse'&&male)||(k==='sib'&&lk.si%2===0)||(k==='kid'&&lk.si%2===1),r:k==='gran'?1:1.6,spd:k==='gran'?.7:1.1}); });
    // 아이가 여럿이면 둘째·셋째도 집 안을 돌아다닌다
    if(!L.f.dying) L.kidsHome().slice(1,3).forEach((k,i)=>{ const age=a-k.b, lk=famLook('kid'+(i+2)); P({key:'kidx'+i,label:k.given,x:3+i*2.2,y:6.3,ax:3+i*2.2,ay:6.3,look:lk,st:stageAt(Math.max(0,age)),long:k.sex===1,r:1.5,spd:age<2?.4:1.3}); });
    if(L.set==='R'||L.C.tier<=2) list.push({kind:'a',a:'cat',x:12.2,y:6.5,ax:12.2,ay:6.8,r:1,wt:1,tx:null,spd:1,face:1,fr:0});
  } else if(map!=='out'&&typeof PLACE_IN!=='undefined'&&PLACE_IN[map]){ const PI=PLACE_IN[map], peer=L.age<13?'kid':L.age>=62?'elder':'adult';
    P({key:'p0',x:PI.p0[0],y:PI.p0[1],ax:PI.p0[0],ay:PI.p0[1],look:famLook('t_'+map),st:'adult',long:famLook('t_'+map).si%2===0,r:PI.r0||1.2});
    if(PI.p2) P({key:'p2',x:PI.p2[0],y:PI.p2[1],ax:PI.p2[0],ay:PI.p2[1],look:famLook('f_'+map),st:PI.peer?peer:'adult',long:famLook('f_'+map).si%2===1,r:2});
    (PI.seats||[]).forEach((p,i)=>list.push({kind:'p',key:'seat'+i,x:p[0],y:p[1],look:famLook('s'+i+map),st:p[2]==='peer'?peer:(p[2]||'adult'),dir:p[3]!=null?p[3]:0,fr:0,static:1,long:i%2===1}));
  } else if(map!=='out'){ const kind=intKind(map), kidSt=map==='work'?'adult':L.age<13?'kid':'adult';
    P({key:'p0',x:INT.P[0][0],y:INT.P[0][1],ax:INT.P[0][0],ay:INT.P[0][1]+.4,look:famLook('t_'+map),st:map==='work'?'adult':'adult',long:famLook('t_'+map).si%2===0,r:2.2});
    P({key:'p2',x:INT.P[2][0],y:INT.P[2][1],ax:INT.P[2][0],ay:INT.P[2][1],look:famLook('f_'+map),st:kidSt,long:famLook('f_'+map).si%2===1,r:1.6});
    [[4.8,5.3],[8.2,5.3],[6.5,6.9]].forEach((p,i)=>list.push({kind:'p',key:'seat'+i,x:p[0],y:p[1],look:famLook('s'+i+map),st:kidSt,dir:3,fr:0,static:1,long:i===1}));
  } else {
    const U=L.set==='U', n=U?22:14, RY=OUT.RY, walk=[]; for(let x=5;x<OUT.w-3;x+=8) walk.push([x,RY-.65],[x+4,RY+2.65]);
    bldList().forEach(o=>{ if(o.deco||o.k==='home'||o.k==='bus') return; walk.push([o.b[0]+o.b[2]/2+1.2,o.b[1]+o.b[3]+1.3]); });
    for(let i=walk.length-1;i>0;i--){ const j=Math.floor(hash(i,7)*(i+1)); [walk[i],walk[j]]=[walk[j],walk[i]]; }
    for(let i=0;i<n;i++){ const p=walk[i%walk.length], lk=randLook(L.C.rg); P({key:'w'+i,x:p[0],y:p[1],ax:p[0],ay:p[1],look:lk,st:R()<.2?'kid':R()<.15?'elder':'adult',long:R()<.5,r:3.5,spd:1+R()*.6}); }
    const pl=OUT.patch.play, eb=OUT.b.elem, lb=OUT.b.lib; [[pl[0]+2.5,pl[1]+4.6],[pl[0]+4.5,pl[1]+4.4],[eb[0]+eb[2]/2+2,eb[1]+eb[3]+1.4],[lb[0]+lb[2]/2+2,lb[1]+lb[3]+1.4]].forEach((p,i)=>{ const lk=randLook(L.C.rg); P({key:'k'+i,x:p[0],y:p[1],ax:p[0],ay:p[1],look:lk,st:'kid',long:i%2===1,r:1.6,spd:1.8}); });
    const hb=OUT.b.home; if(!U){ const fd=OUT.fields[0]; for(let i=0;i<3;i++) list.push({kind:'a',a:'chick',x:fd[0]+2+i*.7,y:fd[1]+fd[3]+.8,ax:fd[0]+2.5,ay:fd[1]+fd[3]+.8,r:1.6,wt:R(),tx:null,spd:.8,face:1,fr:0}); }
    else list.push({kind:'a',a:'cat',x:hb[0]+hb[2]+1.5,y:hb[1]+hb[3]+.6,ax:hb[0]+hb[2]+1.5,ay:hb[1]+hb[3]+.6,r:2,wt:1,tx:null,spd:1,face:1,fr:0});
    if(L.C.tier<=2&&R()<.7) list.push({kind:'a',a:'dog',x:22,y:OUT.RY-1.4,ax:22,ay:OUT.RY-1.4,r:3,wt:1,tx:null,spd:1.4,face:1,fr:0});
    if(L.C.tier<=2&&R()<.6) list.push({kind:'a',a:'dog',x:48,y:OUT.RY+3,ax:48,ay:OUT.RY+3,r:3,wt:1,tx:null,spd:1.4,face:1,fr:0});
    const vk=L.C.veh.kind, kinds=L.C.tier>=3?['car','car','car',vk]:[vk,vk,'cycle','car'];
    for(let i=0;i<(U?8:4);i++){ const right=i%2===0, k=kinds[i%kinds.length]; list.push({kind:'v',v:k,x:(i*29+3)%OUT.w,y:right?OUT.RY+.62:OUT.RY+1.58,vx:(right?1:-1)*(k==='car'?3.2:2.4),col:pickOne(CLOTHES),look:randLook(L.C.rg)}); }
  }
  NPCMAP[map]=list; return list;
}
function npcUpdate(dt){
  const list=NPCMAP[W.map]||npcBuild(W.map), sol=solidsFor(W.map), tkeys=new Set(targets().filter(t=>t.m===W.map).map(t=>t.key));
  for(const n of list){
    if(n.static) continue;
    if(n.kind==='v'){ n.x+=n.vx*dt; const near=Math.abs(n.x-W.x)<1.4&&Math.abs(n.y-W.y)<.8&&!W.car; if(near) n.x-=n.vx*dt; if(n.x>OUT.w+1.5) n.x=-1.5; if(n.x<-1.5) n.x=OUT.w+1.5; n.fr=(n.fr||0)+dt; continue; }
    const pd=Math.hypot(n.x-W.x,n.y-W.y);
    if(paused||(n.kind==='p'&&pd<1.3)||(n.key&&tkeys.has(n.key)&&pd<2.2)){ n.moving=false; if(n.kind==='p'&&pd<2.4) n.dir=Math.abs(W.x-n.x)>Math.abs(W.y-n.y)?(W.x<n.x?1:2):(W.y<n.y?3:0); continue; }
    if(n.wt>0){ n.wt-=dt; n.moving=false; continue; }
    if(n.tx==null){ for(let i=0;i<6;i++){ const tx=n.ax+(R()*2-1)*n.r, ty=n.ay+(R()*2-1)*n.r*.8; if(!blocked(W.map,tx,ty,.28,sol)){ n.tx=tx; n.ty=ty; break; } } if(n.tx==null){ n.wt=1; continue; } }
    const dx=n.tx-n.x, dy=n.ty-n.y, d=Math.hypot(dx,dy);
    if(d<.08){ n.tx=null; n.wt=.8+R()*2.6; n.moving=false; continue; }
    const st=Math.min(d,n.spd*dt), mx=dx/d*st, my=dy/d*st, r=n.kind==='a'?.2:.28;
    if(blocked(W.map,n.x+mx,n.y+my,r,sol)||Math.hypot(n.x+mx-W.x,n.y+my-W.y)<.7){ n.tx=null; n.wt=.4+R(); n.moving=false; continue; }
    n.x+=mx; n.y+=my; n.moving=true; n.fr=(n.fr||0)+dt*6;
    if(n.kind==='a') n.face=mx>=0?1:-1; else n.dir=Math.abs(mx)>Math.abs(my)?(mx<0?1:2):(my<0?3:0);
  }
}

/* ========== 입력: 화면 어디든 누르고 끌면 조이스틱, 키보드는 방향키/WASD ========== */
const IN={jx:0,jy:0,ox:0,oy:0,id:null,keys:{}};
const cv=$('cv'), g=cv.getContext('2d');
cv.addEventListener('pointerdown',e=>{ if(IN.id!==null) return; IN.id=e.pointerId; IN.ox=e.clientX; IN.oy=e.clientY; IN.jx=IN.jy=0; cv.setPointerCapture(e.pointerId); $('hint').hidden=true; });
cv.addEventListener('pointermove',e=>{ if(e.pointerId!==IN.id) return; const dx=e.clientX-IN.ox, dy=e.clientY-IN.oy, d=Math.hypot(dx,dy), m=46; if(d<8){ IN.jx=IN.jy=0; return; } const k=Math.min(d,m)/m/d; IN.jx=dx*k; IN.jy=dy*k; });
const up=e=>{ if(e.pointerId===IN.id){ IN.id=null; IN.jx=IN.jy=0; } };
cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
addEventListener('keydown',e=>{ if($('s-game').hidden||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||'')) return; IN.keys[e.key.toLowerCase()]=1; if((e.key===' '||e.key==='Enter')&&$('sheet').hidden&&!$('btnAct').hidden){ e.preventDefault(); $('btnAct').click(); } if(e.key.startsWith('Arrow')) e.preventDefault(); });
addEventListener('keyup',e=>{ IN.keys[e.key.toLowerCase()]=0; });

