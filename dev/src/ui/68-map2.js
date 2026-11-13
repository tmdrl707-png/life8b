/* ========== [2-1 세계·화면] 지도 다시 짜기 (11-13 밤 선생님 점검, 자료는 engine/60-map2) ==========
   1) 우리 동네: 중학교(오른쪽 위, 13살부터)와 고등학교(오른쪽 아래, 16살부터 아래 큰길 너머가 열림)를 나눈다.
   2) 옆 동네 지도들은 어른(19살)부터. 서쪽 옆 동네 = 대학가(대학생의 학교), 동쪽 큰 도시 = 일터(도시에서 하는 일),
      농사·가축·고기잡이·광산 일은 우리 동네 일터. 남쪽 강가 마을·북쪽 산과 숲은 놀러 가는 곳.
   3) 할 일(!·미션)의 장소가 바뀐 건물(고등학교·대학교·일터)이면, 그 건물이 있는 지도로 화살표·길 안내가 간다. */
(()=>{ const Z0=ZONES[0], B0=Z0.data.b;
  // 1) 고등학교: 아래 큰길 너머 오른쪽 (그 자리의 이웃집·나무는 비운다)
  const HB=[46,43.6,8,5]; B0.high=HB; Z0.data.s.high=[HB[0]+HB[2]/2,HB[1]+HB[3]+.6]; ENTER.high='';
  const over=(r,p)=>r[0]<HB[0]+HB[2]+p&&r[0]+r[2]>HB[0]-p&&r[1]<HB[1]+HB[3]+p&&r[1]+r[3]>HB[1]-p;
  for(let i=Z0.data.deco.length-1;i>=0;i--) if(over(Z0.data.deco[i],1)) Z0.data.deco.splice(i,1);
  for(let i=Z0.data.trees.length-1;i>=0;i--){ const t=Z0.data.trees[i]; if(over([t[0]-.3,t[1]-.3,.6,.6],.8)) Z0.data.trees.splice(i,1); }
  // 2) 일터: 도시에서 하는 일이면 큰 도시에, 농사·가축·고기잡이·광산 일이면 우리 동네에 (안 쓰는 쪽 건물은 지도 밖으로)
  const WK=B0.work; delete B0.work; Object.defineProperty(B0,'work',{get(){ return workZone(G.life)===0?WK:ZOFF; },enumerable:true,configurable:true});
  const Z3=ZONES[3], B3=Z3.data.b, TW=B3.z3tower; delete B3.z3tower;
  Object.defineProperty(B3,'work',{get(){ return workZone(G.life)===3?TW:ZOFF; },enumerable:true,configurable:true});
  Object.defineProperty(B3,'z3tower',{get(){ return workZone(G.life)===3?ZOFF:TW; },enumerable:true,configurable:true});
  Z3.data.s.work=[TW[0]+TW[2]/2,TW[1]+TW[3]+.6]; Z3.enter.push('work');
  // 서쪽 옆 동네 = 대학가: 옆 동네 학교 자리에 대학교
  const Z1=ZONES[1], B1=Z1.data.b; B1.univ=B1.z1school; delete B1.z1school; Z1.data.s.univ=[B1.univ[0]+B1.univ[2]/2,B1.univ[1]+B1.univ[3]+.6];
  Z1.as.univ='@school'; Z1.enter.push('univ'); Z1.title=()=>'옆 동네 대학가';
  // 옆 동네 지도들은 모두 어른부터
  Z0.gates.forEach(g=>{ g.age=19; if(g.to===1) g.nm='옆 동네 대학가'; });
})();
// 대학교 안: 강의실
PLACE_IN.univ={kind:'school',role:'teacher',n:['교수님','강의실 자리','같은 과 친구','창가','책장','학생 식당'],p0:[7,2.4],p2:[10.8,6.2],peer:1,seats:[[4.8,5.2,'adult',3],[8.2,6.8,'adult',3]],
  f:[['board',4,.62,6,.45,'u_board'],['desk',4.3,4.3,1,.6,'u_desk'],['desk',7.7,4.3,1,.6,'u_desk'],['desk',4.3,5.9,1,.6,'u_desk'],['desk',7.7,5.9,1,.6,'u_desk'],['shelf',.9,8.3,2.6,.7,'u_shelf']]};
Object.assign(PLAY,{u_desk:PL('강의실 책상',null,null,[['강의 내용을 노트에 빼곡히 정리했다.','k t'],['조별 과제 회의를 했다. 역할을 나눴다.','r t'],['시험 기간, 빈 강의실에서 밤늦게까지 공부했다.','k']]),
  u_shelf:PL('책장',null,null,[['전공 책을 펼쳐 한 장을 끝까지 읽었다.','k'],['선배가 남기고 간 필기 노트를 발견했다.','k r']]),
  u_board:PL('칠판',null,null,[['교수님 판서를 따라 적다가 질문을 했다.','k r']])});
// 장소 → 지금의 건물 (중학교/고등학교/대학교)
(()=>{ const _p=posOfSpot; posOfSpot=function(key,idx){ return _p(spotRoute(G.life,key),idx); }; })();
// 할 일의 장소가 다른 지도의 건물이면 그 지도로
(()=>{ const _t=targets; targets=function(){ const L=G.life, out=_t(); if(!L||!L.cur) return out;
  out.forEach(t=>{ if(t.qz) return; let sp=null, idx=0; if(t.type==='s'){ const c=L.cur.scenes[t.k]; sp=c&&SCENES[c.i].spot; idx=c?c.i:0; } else if(t.type==='q'&&L.q){ const d=QUESTS[L.q.i]; sp=L.q.st===1?d.target:d.giver; }
    if(!sp) return; const k=spotRoute(L,sp); let z;
    if(k==='univ') z=1; else if(k==='work') z=workZone(L); else if(k!==sp) z=0; else return;
    if(z!==W.zone){ t.m='out'; t.p=zoneExit(z); t.key=null; return; }
    const pos=posOfSpot(sp,idx); t.m=pos.m; t.p=pos.p; if(pos.n&&t.type==='s') t.n=pos.n; });
  return out; }; })();
// 건물 안에 있을 때 맞는 지도로, 다른 지도로 옮겨도 일터·고등학교 문이 그대로
(()=>{ const _zs=zoneSync; zoneSync=function(){ const L=G.life;
    if(W.map==='work'){ const wz=workZone(L); if(W.zone!==wz) setZone(wz); return; }
    if(W.map==='univ'){ if(W.zone!==1) setZone(1); return; }
    if(W.map==='high'){ if(W.zone!==0) setZone(0); return; }
    _zs(); };
  const _sz=setZone; setZone=function(z,x,y){ _sz(z,x,y); ENTER.work=''; if(W.zone===0) ENTER.high=''; else delete ENTER.high; }; })();
