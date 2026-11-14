/* [2-2 상호작용] 69-six.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */

/* ---------- 3) 상호작용의 무게 ---------- */
// 한 번에 오르는 몫을 키운다 (말 걸기·만져 보기·문제·미니 게임·사기 모두 tinyGain을 지난다)
const SIX_BOOST={r:3,e:3.2,k:4,t:2.2,h:1.8};
Object.assign(TK_CAP,{B:6,T:7,K:8,Y:8,A:6,O:6});
tinyGain=(old=>function(L,g,why){ const g2={}, Y=tkYear(L); Y.c=Y.c||{};
  for(const k in g){ const v=g[k]; g2[k]=v>0?v*(L.sixOpen&&SIX.includes(k)&&!L.sixOpen(k)?.7:(SIX_BOOST[k]||1)):v;   /* 아직 안 열린 능력치는 조금만 */ if(v>0) Y.c[k]=(Y.c[k]||0)+1; }
  const up=old(L,g2,why)||[]; return up.filter(u=>{ const k=SIX.find(k=>u.startsWith(SIX_N[k]+' ')); return !k||L.sixOpen(k); }).map(u=>u.replace(' 조금 ↑',' ↑')); })(tinyGain);
// 아직 잠긴 능력치는 사건 칩에서도 감춘다
chips=(old=>function(fx,tr){ const L=G.life; if(fx&&L&&L.sixOpen){ const f2={}; for(const k in fx) if(!(SIX.includes(k)&&!L.sixOpen(k))) f2[k]=fx[k]; fx=f2; } return old(fx,tr); })(chips);
// 아직 얻을 것이 남은 사람·동물·물건 위에 반짝이
function sixSparkTargets(){ const L=G.life, out=[]; if(!L||L.age<1) return out; const st=stg(L.age), Y=tkYear(L), cap=TK_CAP[st];
  if(Y.n<cap) for(const n of (NPCMAP[W.map]||[])){ if(n.kind==='v') continue; const id=W.map+':'+(n.key||n.a||''); if(!Y.who[id]) out.push([n.x+.45,n.y-1.55]); }
  if(Y.o<cap) for(const o of touchables()){ const pool=playPool(o.k,st).filter(x=>playOK(L,x[2])), seen=Y.obj[o.k]||[]; if(!pool.some(x=>!seen.includes(x[0]))) continue; const p=o.p?[o.p[0]+.5,o.p[1]-.9]:[o.r[0]+o.r[2]*.82,o.r[1]+.15]; out.push(p); }
  return out; }
(()=>{ const _d=draw; draw=function(t){ _d(t); try{ if(!G.life||!draw.cam||paused&&!dlgOpen()) return; const cx=draw.cam.x, cy=draw.cam.y, s=SC*(.5+.1*Math.sin(t*4));
  for(const [x,y] of sixSparkTargets()){ const sx=(x*PX-cx)*SC, sy=(y*PX-cy)*SC; if(sy<HUDH-6||sy>VH||sx<0||sx>VW) continue;
    g.save(); g.translate(sx,sy); g.scale(s,s); g.beginPath(); g.moveTo(0,-5); g.quadraticCurveTo(.7,-.7,5,0); g.quadraticCurveTo(.7,.7,0,5); g.quadraticCurveTo(-.7,.7,-5,0); g.quadraticCurveTo(-.7,-.7,0,-5); g.closePath();
    g.fillStyle='#FFE27A'; g.strokeStyle='rgba(120,80,0,.65)'; g.lineWidth=.9; g.fill(); g.stroke(); g.restore(); } }catch(e){} }; })();

/* ---------- 어른·노인도 집과 동네의 물건과 함께 (11-14 플레이 점검: 19살부터 집 물건이 하나도 없었다) ---------- */
const PLAY_AO={
  counter:{A:[['퇴근길에 산 재료로 처음 보는 나라 요리를 만들어 보았다.','e t'],['가족 도시락을 싸며 손이 빨라졌다.','t r'],['한 달 장보기 영수증을 펼쳐 놓고 식비를 따져 보았다.','k t']],
    O:[['손주에게 줄 옛날 음식을 만들며 손맛을 전했다.','r t'],['약 먹을 시간을 적어 냉장고에 붙였다.','h k']]},
  table:{A:[['식탁에 모여 앉아 하루 있었던 일을 나누었다.','r j'],['가계부를 펴고 이번 달 쓸 돈을 나누어 적었다.','k t'],['오래 연락 못 한 친구에게 손편지를 썼다.','r']],
    O:[['오래된 사진첩을 펼쳐 옛이야기를 들려주었다.','r e'],['돋보기를 쓰고 신문을 천천히 읽었다.','k']]},
  sofa:{A:[['소파에 앉아 읽다 만 책을 끝까지 읽었다.','k j'],['가족과 나란히 앉아 영화를 보았다.','r j'],['배우고 싶던 악기를 다시 꺼내 연습했다.','t e']],
    O:[['짧게 낮잠을 자고 일어나 몸을 풀었다.','h j'],['라디오 노래를 따라 흥얼거렸다.','j e']]},
  tv:{A:[['다른 나라 소식을 보며 지도에서 그 나라를 찾아보았다.','k e'],['온라인 강의를 틀어 놓고 새 기술을 배웠다.','t k']],
    O:[['건강 체조 방송을 보며 따라 했다.','h'],['처음 보는 나라의 여행 방송을 보며 메모했다.','k e']]},
  bed:{A:[['일찍 누워 푹 잤다. 몸이 한결 가벼웠다.','h j'],['잠들기 전 스트레칭을 십 분 했다.','h']],
    O:[['일찍 자고 일찍 일어나 동네를 한 바퀴 걸었다.','h']]},
  desk:{A:[['일에 필요한 자격증 문제집을 풀었다.','k t'],['고장 난 물건을 설명서를 보며 직접 고쳤다.','t k'],['가 보고 싶은 곳의 여행 계획을 짰다.','e k']],
    O:[['살아온 이야기를 공책에 조금씩 적었다.','k e'],['고장 난 라디오를 손주와 함께 고쳤다.','t r']]},
  yard:{A:[['화분을 손질하고 새 모종을 심었다.','t h'],['이웃과 담 너머로 안부를 나누었다.','r'],['아침 일찍 맨손 체조를 했다.','h']],
    O:[['텃밭에 물을 주며 새싹을 살폈다.','h t'],['마당에 나온 이웃과 차 한 잔을 나누었다.','r j']]},
  tree:{A:[['나무 그늘 아래서 동네 사람들과 이야기를 나누었다.','r j'],['나무 사이를 천천히 걸으며 생각을 정리했다.','h e']],
    O:[['나무 아래 의자에 앉아 지나가는 아이들에게 인사했다.','r j']]},
  field:{A:[['새 품종 씨앗을 한 줄 심어 보았다.','t k'],['이웃 밭일을 거들고 품앗이로 도움을 받았다.','r t']],
    O:[['젊은이들에게 씨 뿌리는 때를 일러 주었다.','r k']]}};
for(const k in PLAY_AO) if(PLAY[k]) for(const st in PLAY_AO[k]) if(!PLAY[k][st]) PLAY[k][st]=PLAY_AO[k][st];
touchables=(old=>function(){ const r=old(), L=G.life; if(!L||L.age<19||(typeof PLACE_IN!=='undefined'&&PLACE_IN[W.map])) return r;
  const m=W.map, st=stg(L.age), out=[];
  if(m==='home'){ HOME.f.forEach(f=>out.push({k:f[0],r:f.slice(1)})); out.push({k:'yard',p:HOME.s.yard}); }
  else if(m==='out'){ OUT.trees.forEach(t=>out.push({k:'tree',p:t})); if(L.set==='R') OUT.fields.forEach(f=>out.push({k:'field',r:f})); }
  return r.concat(out.filter(o=>playPool(o.k,st).length)); })(touchables);

// 학교에 아직 안 다니는 아이에게 '학교에서 오늘…'을 묻지 않는다 (0~20살 점검, 11-14)
talkFill=(old=>function(L,s,pet){ let t=old(L,s,pet); if(L&&L.f&&!L.f.school&&!L.f.elem&&!L.f.sec) t=t.replace('학교에서 오늘 재미있는 일 있었어?','오늘 밖에서 재미있는 일 있었어?'); return t; })(talkFill);

// 아이에게 돈 드는 일은 '집 살림'으로 보인다 (엔진 64-young과 짝)
chips=(old=>function(fx,tr){ const L=G.life; if(fx&&L&&L.age<16&&fx['@']<0&&!L.f.job){ const f2=Object.assign({},fx); delete f2['@']; return old(f2,tr)+'<span class="chip dn">집 살림 −</span>'; } return old(fx,tr); })(chips);
