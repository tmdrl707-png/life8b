/* ========== 이사·자취: 집의 위치가 실제로 바뀐다 (11-14) ==========
   삶의 `f.res`={z:지도(0 우리 동네·1 대학가·3 큰 도시), i:이웃집 번호(-1은 처음 집), k:'family'|'alone'|'couple'}.
   · 가족이 이사하는 사건·집을 산 일 → 같은 지도의 다른 이웃집 자리로 (아이는 갈 수 있는 범위 안에서)
   · 대학생(19살~) → 대학가의 자취방, 큰 도시에서 일하면 그 도시의 집, 결혼하면 신혼집
   · 혼자·부부가 살면 부모님·형제는 집 안에 없다. 대학을 마치고 일이 없으면 가족 집으로 돌아온다
   · 지도의 `home` 건물은 getter라서 이사하면 문과 건물이 그 자리로 옮겨 간다 (예전 집은 이웃집이 된다) */
const RES_H0=[3,3,5,4];
const RES_POOL={};   // 지도별 처음 이웃집 목록 (번호가 바뀌지 않게 따로 간직)
[0,1,3].forEach(z=>{ RES_POOL[z]=ZONES[z].data.deco.map(d=>d.slice()); });
const RES_ANCHOR={0:[RES_H0[0]+2.5,RES_H0[1]+2],1:[40,6.5],3:[18,30.5]};
const resOf=L=>{ const f=L&&L.f; if(!f) return {z:0,i:-1,k:'family'}; if(!f.res) f.res={z:0,i:-1,k:'family'}; return f.res; };
const homeZone=()=>{ const L=G.life; return L?resOf(L).z:0; };
const resRect=(L,z)=>{ const r=resOf(L); if(r.z!==z) return null; if(z===0&&r.i<0) return RES_H0; const p=RES_POOL[z]&&RES_POOL[z][r.i]; return p?p.slice(0,4):(z===0?RES_H0:null); };
let RES_L=null;   // 지금 지도에 반영한 삶
// 지도의 '우리 집'이 지금 삶의 집을 가리키게 한다
[0,1,3].forEach(z=>{ const D=ZONES[z].data, B=D.b, hb=Object.getOwnPropertyDescriptor(B,'home'); if(hb&&!hb.configurable) return; delete B.home;
  Object.defineProperty(B,'home',{get(){ const L=RES_L; const r=L?resRect(L,z):(z===0?RES_H0:null); return r||ZOFF; },enumerable:true,configurable:true});
  delete D.s.home; Object.defineProperty(D.s,'home',{get(){ const b=B.home; return [b[0]+b[2]/2,b[1]+b[3]+.6]; },enumerable:true,configurable:true}); });
[1,3].forEach(z=>{ if(!ZONES[z].enter.includes('home')) ZONES[z].enter.push('home'); });
// 이웃집 목록을 지금 삶에 맞게 다시 짠다 (내 집으로 쓰는 집은 빼고, 비운 처음 집은 이웃집으로)
function applyRes(L){ RES_L=L; if(!L) return; const r=resOf(L);
  [0,1,3].forEach(z=>{ const D=ZONES[z].data, pool=RES_POOL[z], mine=r.z===z&&r.i>=0?r.i:-9;
    const list=pool.filter((_,k)=>k!==mine).map(d=>d.slice()); if(z===0&&!(r.z===0&&r.i<0)) list.push(RES_H0.concat('A'));
    D.deco.length=0; list.forEach(d=>D.deco.push(d)); });
  RES_SIG=resSig(L); terrain.k=null; worldLayer.k=null; miniBase.k=null; delete NPCMAP.out; delete NPCMAP.home; }
const RES_IDS=new WeakMap(); let RES_N=0, RES_SIG='';
const resSig=L=>{ if(!RES_IDS.has(L)) RES_IDS.set(L,++RES_N); const r=resOf(L); return RES_IDS.get(L)+':'+r.z+'.'+r.i+r.k; };
const resSync=()=>{ const L=G.life; if(L&&L.f&&resSig(L)!==RES_SIG) applyRes(L); };
// 마음에 드는 이웃집 고르기: 아이는 갈 수 있는 범위 안에서, 어른은 일터·대학 가까이에서
const ageBox=a=>a<10?[31.9,23.75]:a<13?[31.9,40.5]:a<16?[61.9,40.5]:a<19?[61.9,52]:[999,999];
function pickLot(L,z){ const r=resOf(L), pool=RES_POOL[z]||[], a=L.age, box=ageBox(a), job=L.job&&L.f.job;
  let anc=RES_ANCHOR[z]; if(z===0&&a>=19&&job&&workZone(L)===0) anc=[69,9]; if(z===0&&a<19) anc=RES_ANCHOR[0];
  const cands=[]; pool.forEach((d,i)=>{ if(z===r.z&&i===r.i) return; if(z===0&&(d[0]+d[2]>box[0]||d[1]+d[3]>box[1])) return; cands.push([i,Math.hypot(d[0]+d[2]/2-anc[0],d[1]+d[3]/2-anc[1])]); });
  if(z===0&&!(r.z===0&&r.i<0)&&a>=19) cands.push([-1,Math.hypot(RES_H0[0]+2.5-anc[0],RES_H0[1]+2-anc[1])+8]);
  if(!cands.length) return r.z===z?r.i:-1; cands.sort((x,y)=>x[1]-y[1]); const top=cands.slice(0,Math.min(4,cands.length));
  return top[Math.floor(hash((L.famI|0)*31+a,z*7+3)*top.length)][0]; }
function moveTo(L,z,k,msg){ const r=resOf(L), i=pickLot(L,z); L.f.res={z,i,k,t:L.age,n:(r.n||0)+1}; if(k==='family') L.f.fh={z,i};
  L.f.resMsg=msg||''; if(msg) L.remember({a:L.age,t:msg,big:1,sc:'house'}); if(G.life===L) applyRes(L); return L.f.res; }
// 해마다 사는 곳을 살핀다
const RES_TXT={alone0:'대학 근처에 작은 자취방을 얻어 혼자 살기 시작했다.',alone3:'일하는 도시에 작은 집을 얻어 혼자 살기 시작했다.',couple:'둘이 함께 살 새 집으로 옮겼다. 짐을 풀고 나란히 앉았다.',own:'내 집을 마련해 이사했다. 새 집의 열쇠가 묵직했다.',back:'가족이 있는 집으로 돌아왔다. 익숙한 냄새가 났다.',alone1:'대학 근처에 작은 자취방을 얻어 혼자 살기 시작했다.'};
function resCheck(L){ const f=L.f; if(!f||L.dead) return; const r=resOf(L), a=L.age; if(!f.fh) f.fh={z:r.z,i:r.i};
  const job=!!f.job&&!!L.job, wz=job?workZone(L):0, own=L.house>0;
  let want, msg='';
  if(r.k==='couple'&&!f.family) want=f.widow?{z:r.z,k:'couple'}:{z:r.z,k:'alone'};
  else if(f.family) want={z:wz===3?3:0,k:'couple'};
  else if(own&&a>=19) want={z:wz===3?3:0,k:'alone'};
  else if(a>=19&&isUnivStudent(L)) want={z:1,k:'alone'};
  else if(a>=19&&job&&wz===3) want={z:3,k:'alone'};
  else if(r.k==='alone'&&a>=19&&(job||f.retired)&&r.n>0&&r.z===0) want={z:0,k:'alone'};
  else want={z:f.fh.z,k:'family'};
  if(want.z===r.z&&want.k===r.k){ if(own&&a>=19&&!f.ownMoved){ f.ownMoved=1; moveTo(L,want.z,want.k,RES_TXT.own); } return; }
  if(want.k==='family'){ const fh=f.fh; L.f.res={z:fh.z,i:fh.i,k:'family',t:a,n:(r.n||0)+1}; L.f.resMsg=r.k==='family'?'':RES_TXT.back; if(L.f.resMsg) L.remember({a,t:RES_TXT.back,big:1,sc:'house'}); if(G.life===L) applyRes(L); return; }
  if(own&&a>=19) msg=RES_TXT.own; else if(want.k==='alone') msg=r.k==='couple'?'혼자 지낼 작은 집으로 옮겼다.':RES_TXT['alone'+want.z]||RES_TXT.alone0; else msg=RES_TXT.couple;
  if(own&&a>=19) f.ownMoved=1;
  moveTo(L,want.z,want.k,msg); }
{ const P=Life.prototype, _sp=P.startPeriod; P.startPeriod=function(){ const r=_sp.apply(this,arguments); try{ resCheck(this); }catch(e){} return r; };
  // 가족이 이사하는 사건 글
  const MOVE=/(우리 집이 이사를 했다|다른 주로 이사를 했다|이사했다\. 아침|가까이로 이사했다|사는 동네로 이사|함께 도시로 옮겼다|높은 곳으로 이사했다|더 (작은|큰) 집으로 이사했다)/;
  const _rem=P.remember; P.remember=function(o){ const r=_rem.apply(this,arguments); try{ const t=o&&o.t; if(t&&MOVE.test(t)&&this.f&&!o.mv){ const x=resOf(this), city=/도시로 옮겼다/.test(t);
      const z=city?3:x.z, k=x.k, i=pickLot(this,z); this.f.res={z,i,k,t:this.age,n:(x.n||0)+1}; if(k==='family') this.f.fh={z,i}; this.f.resMsg='집을 옮겼어요. 지도에서 우리 집 자리가 달라졌어요.'; if(G.life===this) applyRes(this); } }catch(e){} return r; };
  // 혼자·부부가 사는 집에는 부모님·형제가 없다
  const _so=P.spotOK; P.spotOK=function(key){ if(this.f&&this.f.res&&this.f.res.k!=='family'&&(key==='mom'||key==='dad'||key==='gran'||key==='sib')) return false; return _so.apply(this,arguments); }; }
// 지도 바꾸기·그리기에 맞춘다
{ const _wk=worldKey; worldKey=function(){ resSync(); const L=G.life, r=L&&L.f&&L.f.res; return _wk()+'|h'+(r?r.z+'.'+r.i:''); };
  const _zs=zoneSync; zoneSync=function(){ resSync(); if(W.map==='home'){ const hz=homeZone(); if(W.zone!==hz) setZone(hz); return; } return _zs(); };
  const _sz=setZone; setZone=function(){ const r=_sz.apply(this,arguments); if(W.zone!==0&&!ZONES[W.zone].enter.includes('home')) delete ENTER.home; else ENTER.home=''; return r; };
  const _zos=zoneOfSpot; zoneOfSpot=function(k){ return k==='home'?homeZone():_zos(k); };
  const _bp=beginPeriod; beginPeriod=function(){ const r=_bp.apply(this,arguments); try{ const L=G.life; if(L&&L.f&&L.f.resMsg){ const m=L.f.resMsg; L.f.resMsg=''; toast(m); } }catch(e){} return r; };
  const _dmR=drawMini; drawMini=function(t){ _dmR(t); try{ const L=G.life; if(W.map==='home'&&L&&L.f&&L.f.res&&L.f.res.k!=='family') $('miniTag').textContent=L.f.res.k==='alone'?'내 방 안':'우리 집 안'; }catch(e){} }; }
// 집 안 미니맵: 가족이 누구인지 글자로 (엄·아·할·형제·짝·아이)
{ const _dmH=drawMini; drawMini=function(t){ _dmH(t); try{ if(W.map!=='home') return; const c=$('mini'), x=c.getContext('2d'), L=G.life;
    const s=Math.floor(Math.min(c.width/IW,c.height/IH)*.94), ox=Math.round((c.width-IW*s)/2), oy=Math.round((c.height-IH*s)/2), fs=Math.max(11,Math.round(s*.7)), rr=Math.max(7,Math.round(fs*.68));
    const CH={mom:'엄',dad:'아',gran:L.spotName('gran').slice(0,1),sib:L.spotName('sib').slice(0,1),spouse:'짝',kid:'애'}, COL={mom:'#D2557A',dad:'#3F6FCF',gran:'#8A6BB8',sib:'#E08A2E',spouse:'#C0475E',kid:'#2E9E7A'};
    x.textAlign='center'; x.textBaseline='middle'; x.font=`bold ${fs}px sans-serif`;
    (NPCMAP.home||[]).forEach(n=>{ if(n.kind!=='p'||!n.key) return; const k=/^kid/.test(n.key)?'kid':n.key; if(!CH[k]) return; const px=ox+Math.round(n.x*s), py=oy+Math.round(n.y*s);
      x.fillStyle='#283038'; x.beginPath(); x.arc(px,py,rr+1,0,6.3); x.fill(); x.fillStyle=COL[k]; x.beginPath(); x.arc(px,py,rr,0,6.3); x.fill(); x.fillStyle='#fff'; x.fillText(CH[k],px,py+.5); });
  }catch(e){} }; }
