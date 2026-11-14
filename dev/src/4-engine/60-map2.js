/* 60-map2: 선생님 플레이 점검(11-13 밤) — 동네 지도 다시 짜기 (화면 쪽은 ui/68-map2)
   - 중학교(오른쪽 위)와 고등학교(오른쪽 아래)를 나눈다. 고등학생(16~18살, 고등학교 진학)의 '학교' 장소는 고등학교로 간다.
   - 옆 동네 지도들은 어른(19살)부터: 서쪽은 대학가(대학생의 '학교'가 여기로), 동쪽 큰 도시에는 일터(농사·고기잡이·가축·광산 일은 우리 동네),
     남쪽 강가 마을·북쪽 산과 숲은 놀러 가는 곳. 어른이 되면 '놀러 가 보렴' 미션으로 처음 알려 준다.
   - 새 미션은 목록 맨 뒤에. */
Object.assign(ZONE_AGE,{W:19,S:19,N:19});
Object.assign(SPOTS,{ high:{z:'B',n:'고등학교'}, univ:{z:'W',n:'대학교'} });
SPOTS.mid.n='중학교';
SPOT_ZONE.high=0; SPOT_ZONE.univ=1;
const RURAL_WORK=['farm','herd','fish','mine'];
function workZone(L){ const j=L&&L.job; return j&&!RURAL_WORK.includes(j.kind)?3:0; }
function isUnivStudent(L){ const f=L.f; return L.age>=19&&!!f.univ&&!!f.school&&!f.univDone; }
// '학교' 장소가 지금 어느 건물인가: 중학생 → 중학교, 고등학생 → 고등학교, 대학생 → 대학가의 대학교
function spotRoute(L,key){ if(!L) return key; if(key==='mid'){ if(L.age>=16&&L.age<=18&&L.f.hs) return 'high'; if(isUnivStudent(L)) return 'univ'; } return key; }
(()=>{ const P=Life.prototype, _sn=P.spotName, _ok=P.spotOK;
  P.spotName=function(key){ const s=this.sch||{}; if(key==='high') return (this.f.hs==='voc'?s.voc:s.high)||'고등학교'; if(key==='univ') return s.univ||'대학교'; return _sn.call(this,key); };
  P.spotOK=function(key){ if(key==='high') return this.age>=16&&this.age<=18&&!!this.f.hs; if(key==='univ') return this.age>=19&&this.age<75; return _ok.call(this,key); }; })();
// 어른이 되면 다른 지도를 처음 알려 주는 '놀러 가 보렴' 미션
CC=null;
Q(19,40,'*','dad','"이제 탈것도 있으니 산에 한번 다녀와 보렴. 동네 북쪽 길 끝으로 가면 산이 나온단다."','z4peak','꼭대기 전망대에서 동네를 내려다본다.','멀리 우리 동네 지붕들이 보였다. 세상이 생각보다 넓었다.','안개가 껴서 아무것도 안 보였다. 그래도 공기는 상쾌했다.','e4 h2','K','h');
Q(19,40,'*','mom','"날도 더운데 남쪽 강가 마을에 가서 바람 좀 쐬고 오렴. 강물이 그렇게 시원하대."','z2river','강물에 발을 담그고 한참 앉아 있는다.','물수제비를 뜨며 오랜만에 실컷 웃었다.','물이 생각보다 차가워 금방 나왔다. 그래도 개운했다.','j4 e3','K','h');
Q(19,30,'*','dad','"서쪽 옆 동네에 대학가가 있단다. 대학 구경 한번 가 보렴."','univ','대학 안을 한 바퀴 둘러보고 게시판을 읽어 본다.','강의실과 도서관을 둘러보니 배우고 싶은 것이 생겼다.','방학이라 문이 대부분 닫혀 있었다.','k2 e3','K','k');
Q(19,40,'*','mom','"동쪽 큰길 끝에는 큰 도시가 있대. 일자리도 많다더라. 한번 가 보렴."','z3plaza','도시 광장을 걸으며 높은 건물들을 올려다본다.','사람과 차가 끝없이 오갔다. 여기서 일하는 내 모습을 떠올려 보았다.','길을 잃어 한참 헤맸다. 그래도 큰 도시 구경은 했다.','e4 k1','K','r');
// 어른이 된 첫 몇 해에는 이 미션들이 먼저 나온다
(()=>{ const P=Life.prototype, _qo=P.questOffer; const FIRST=new Set(); QUESTS.forEach((q,i)=>{ if(['z4peak','z2river','univ','z3plaza'].includes(q.target)&&q.a[0]===19) FIRST.add(i); });
  P.questOffer=function(){ if(this.q||!this.cur||this.f.dying||this.sick) return _qo.call(this); const a=this.age;
    if(a>=19&&a<=24){ const seen=this.f.zq||(this.f.zq={}); const el=[...FIRST].filter(i=>{ const q=QUESTS[i]; return !seen[q.target]&&a<=q.a[1]&&this.spotOK(q.giver)&&this.spotOK(q.target)&&this.lastQ!==i; });
      if(el.length&&R()<.7){ const i=pickOne(el); seen[QUESTS[i].target]=1; return this.q={i,st:0}; } }
    return _qo.call(this); }; })();
