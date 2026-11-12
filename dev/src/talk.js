/* ========== 말 걸기 · 만져 보기 · 학교 밖 활동 · 인생 기록 메뉴 ==========
   1) 다가가 말 걸기: 퀘스트가 없어도 가족·선생님·친구·동료·동네 사람·동물과 짧은 말이 오간다 (한 해에 몇 번만 능력치가 조금 오른다)
   2) 만져 보기: 집 안의 물건(부엌·식탁·소파·텔레비전·침대·책상·마당), 학교의 칠판·책장·탁자, 밖의 나무와 밭을 나이에 맞게 가지고 논다
   3) 학교 밖 활동: 6~18살의 작은 선택에 동네·친구·시장·도서관에서 하는 활동을 더한다 (기술)
   4) 인생 기록: 엔딩의 기록 카드와 '지나온 삶'을 내 정보처럼 위쪽 메뉴로 넘겨 본다 */
document.head.insertAdjacentHTML('beforeend',`<style>
#btnAct.t{background:linear-gradient(180deg,#3FA06B 0%,#2E8355 100%)} #btnAct.t::before{content:"A";color:#2E8355}
.tchips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.tchips span{font-size:.78rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#E5F3EA;color:#2F7A4F}
.tq{margin:.2rem 0 .6rem;font-size:1.12rem;line-height:1.5;padding:10px 14px;border-radius:14px;background:#F3EFE6;border:1px solid #E3DDCF}
.rtabs-wrap{display:flex;flex-direction:column;gap:10px}.rtabs-wrap>.rtabs{position:sticky;top:0;z-index:1;padding:4px 0}
.rpane{display:flex;flex-direction:column;gap:10px}.rpane[hidden]{display:none}
.rpane .rnext{align-self:flex-end;font-size:.88rem;padding:6px 12px}
.rpane .kpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:8px}
.rpane .kpi>div{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:12px;background:rgba(127,140,150,.12)}
.rpane .kpi b{font-size:1.15rem}.rpane .kpi span{font-size:.82rem;opacity:.8}
.rpane ul.rl{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}
.rpane .rempty{opacity:.7;font-size:.9rem}
#s-end .rtabs-wrap>.rtabs{background:#162334;border-radius:12px;padding:6px}#s-end .rtabs button{background:rgba(255,255,255,.08);color:#EEF3F6;border-color:rgba(255,255,255,.3)}#s-end .rtabs button.on{background:#FFC9A8;color:#2A2622;border-color:#FFC9A8}
#dlg{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));width:min(760px,calc(100% - 24px));z-index:30;background:#FBFAF6;color:#1E2B37;border:3px solid #2A3440;border-radius:10px;box-shadow:inset 0 0 0 3px #FBFAF6,inset 0 0 0 5px #8C98A4,0 10px 24px rgba(0,0,0,.35);padding:16px 22px 18px;font-size:1.18rem;line-height:1.65;cursor:pointer;user-select:none}
#dlg[hidden]{display:none}
#s-game:has(#dlg:not([hidden])) #btnAct,#s-game:has(#dlg:not([hidden])) #btnCar{visibility:hidden}
#dlg .dn{position:absolute;top:-16px;left:16px;background:#2A3440;color:#fff;font-size:.88rem;font-weight:700;padding:3px 12px;border-radius:8px}
#dlg .dt{min-height:3.3em;white-space:pre-wrap;word-break:keep-all}
#dlg .dm{position:absolute;right:16px;bottom:8px;font-size:.9rem;color:#B4501E;animation:dlgb .8s steps(2) infinite}
@keyframes dlgb{50%{opacity:0}}
#dlg .dopts{position:absolute;right:10px;bottom:calc(100% + 8px);display:flex;flex-direction:column;gap:4px;background:#FBFAF6;border:3px solid #2A3440;border-radius:10px;padding:8px;min-width:12rem;max-width:min(26rem,90%);box-shadow:0 8px 18px rgba(0,0,0,.3)}
#dlg .dopts button{all:unset;cursor:pointer;padding:7px 12px 7px 26px;border-radius:6px;position:relative;font-size:1.02rem}
#dlg .dopts button.on,#dlg .dopts button:hover{background:#EEE7D8}
#dlg .dopts button.on::before{content:'▶';position:absolute;left:8px;font-size:.75rem;top:50%;transform:translateY(-50%)}
#dlg .tchips{margin-top:8px}
@media (max-height:460px){#dlg{font-size:1rem;padding:12px 18px 14px}#dlg .dt{min-height:2.6em}}
</style>`);

/* ---------- 나이 · 처지 ---------- */
const stg=a=>a<2?'B':a<6?'T':a<13?'K':a<19?'Y':a<62?'A':'O';
const TK_CAP={B:4,T:4,K:3,Y:3,A:3,O:3};          // 한 해에 능력치가 오르는 말 걸기·놀이의 수 (그 뒤로는 말만 오간다)
function tkYear(L){ const c=L.cur; if(!c) return {n:0,o:0,who:{},obj:{}}; return c.tk||(c.tk={n:0,o:0,who:{},obj:{}}); }
function tinyGain(L,g,why){ const s0=Object.assign({},L.s), p=L._ctx; L._why=why||''; L._ctx='scene'; try{ L.apply(g); } finally{ L._ctx=p; L._why=null; }
  const up=[]; for(const k of ['t','e','k','j','r','h']) if(L.s[k]!=null&&L.s[k]-s0[k]>.05) up.push((AX_N[k]||STAT[k])+' 조금 ↑'); return up; }
const chipT=up=>up&&up.length?`<div class="tchips">${up.map(u=>`<span>${esc(u)}</span>`).join('')}</div>`:'';
function tflash(place,t,up){ flash(place,t,null); const f=$('flash'); if(up&&up.length) f.insertAdjacentHTML('beforeend',chipT(up)); }


/* ---------- 아래 대화창: 한 글자씩 나오고, 누르면(또는 A·스페이스·엔터) 다음으로 ---------- */
const DLG={q:[],typing:0,tm:0,opts:null,sel:0,done:null};
function dlgEl(){ let d=$('dlg'); if(!d){ d=document.createElement('div'); d.id='dlg'; d.hidden=true; d.setAttribute('role','dialog'); ($('s-game')||document.body).appendChild(d); d.addEventListener('click',e=>{ const b=e.target.closest('.dopts button'); if(b){ e.stopPropagation(); dlgPick(+b.dataset.i); return; } dlgNext(); }); } return d; }
const dlgOpen=()=>!!($('dlg')&&!$('dlg').hidden);
// steps: {who, t, up} 글 한 장 · {who, t, opts:[…], then:i=>[다음 장들]} 글 + 선택지
function dlgRun(steps,done){ DLG.q=steps.slice(); DLG.done=done||null; paused=true; IN.jx=IN.jy=0; IN.id=null; dlgEl().hidden=false; dlgShow(); }
function dlgShow(){ const d=dlgEl(), it=DLG.q[0]; if(!it){ dlgClose(); return; }
  DLG.opts=null; clearInterval(DLG.tm); const txt=String(it.t||''); let i=0;
  d.innerHTML=`${it.who?`<span class="dn">${esc(it.who)}</span>`:''}<div class="dt"></div>${chipT(it.up)}`; const tEl=d.querySelector('.dt'), ch=d.querySelector('.tchips'); if(ch) ch.style.visibility='hidden';
  DLG.typing=1; const fin=()=>{ clearInterval(DLG.tm); DLG.typing=0; tEl.textContent=txt; if(ch) ch.style.visibility=''; if(it.opts) dlgOpts(it); else d.insertAdjacentHTML('beforeend','<span class="dm">▼</span>'); };
  DLG.fin=fin; const sp=26*Math.min(2,RD()); /* 천천히 읽기를 켜면 글자도 천천히 */ DLG.tm=setInterval(()=>{ i=Math.min(txt.length,i+1); tEl.textContent=txt.slice(0,i); if(i>=txt.length) fin(); },sp); }
function dlgOpts(it){ const d=dlgEl(); DLG.opts=it; DLG.sel=0; d.insertAdjacentHTML('beforeend',`<div class="dopts">${it.opts.map((o,i)=>`<button type="button" data-i="${i}" class="${i?'':'on'}">${esc(o)}</button>`).join('')}</div>`); }
function dlgNext(){ if(DLG.typing){ DLG.fin(); return; } if(DLG.opts) return; DLG.q.shift(); dlgShow(); }
function dlgPick(i){ const it=DLG.opts; if(!it) return; DLG.opts=null; DLG.q.shift(); const more=it.then?it.then(i)||[]:[]; DLG.q=more.concat(DLG.q); dlgShow(); }
function dlgClose(){ clearInterval(DLG.tm); const d=dlgEl(); d.hidden=true; d.innerHTML=''; paused=false; lastT=performance.now(); const f=DLG.done; DLG.done=null; if(f) f(); }
addEventListener('keydown',e=>{ if(!dlgOpen()) return; const k=e.key; e.preventDefault(); e.stopImmediatePropagation();
  if(DLG.opts){ const bs=[...$('dlg').querySelectorAll('.dopts button')]; if(k==='ArrowUp'||k==='w'||k==='ArrowDown'||k==='s'){ DLG.sel=(DLG.sel+(k==='ArrowUp'||k==='w'?-1:1)+bs.length)%bs.length; bs.forEach((b,j)=>b.classList.toggle('on',j===DLG.sel)); }
    else if(k===' '||k==='Enter') dlgPick(DLG.sel); else if(/^[1-9]$/.test(k)&&+k<=bs.length) dlgPick(+k-1); return; }
  if(k===' '||k==='Enter'||k==='Escape') dlgNext(); },true);

/* ---------- 1) 말 걸기 ---------- */
// 누구인지: 역할(가족·선생님·윗사람·친구·이웃·아이·어르신·동물)과 화면에 보일 이름
function whoOf(n){ const L=G.life, m=W.map;
  if(n.kind==='a') return {role:'pet',n:{cat:'고양이',dog:'강아지',chick:'병아리'}[n.a]||'동물'};
  if(m==='home'){ if(PERSON_KEYS.includes(n.key)) return {role:'fam',k:n.key,n:L.spotName(n.key)}; return {role:'fam',k:'kid',n:n.label||'아이'}; }
  if(m!=='out'){ const work=m==='work';
    if(n.key==='p0') return {role:work?'boss':'teacher',n:intNames(m)[0]};
    return {role:work?'coll':'mate',n:work?'동료':'반 친구'}; }
  if(n.key&&n.key[0]==='k') return {role:'kid',n:'놀던 아이'};
  return n.st==='kid'?{role:'kid',n:'동네 아이'}:n.st==='elder'?{role:'elder',n:'동네 어르신'}:{role:'nb',n:'이웃'}; }
// 대화: [나이 단계, 상대의 말, [[나의 말, 상대의 대답], …]]  {me} 내 이름 · {town} 사는 곳 · {cn} 나라
const TALK={
  fam:[['B',"'우리 아가, 엄마 해 봐. 엄마!'",[['옹알옹알 대답한다','손뼉을 치며 "방금 엄마라고 했지?" 하고 웃었다.'],['손가락을 꼭 잡는다','잡힌 손가락을 한참 빼지 않고 기다려 주었다.']]],
    ['B',"'누가 이렇게 일찍 깼을까?'",[['방긋 웃는다','"아이고, 웃었다!" 하며 나를 높이 안아 올렸다.'],['칭얼거린다','등을 토닥토닥하며 자장가를 불러 주었다.']]],
    ['T',"'오늘 뭐 하고 놀았어?'",[['블록 쌓았다고 자랑한다','"와, 그렇게 높이? 나중에 보여 줘." 하고 머리를 쓰다듬었다.'],['배고프다고 한다','"그럼 간식 먹을까?" 하고 손을 잡아끌었다.']]],
    ['T',"'{me}, 이건 무슨 색이게?'",[['빨강! 하고 외친다','"맞았어!" 하며 박수를 쳐 주었다.'],['모르겠다고 고개를 젓는다','"이건 파랑이야. 하늘 색이랑 같지?" 하고 알려 주었다.']]],
    ['K',"'학교에서 오늘 재미있는 일 있었어?'",[['친구 이야기를 신나게 한다','끝까지 들어 주고 "좋은 친구네." 하고 웃었다.'],['그냥 그랬다고 한다','"그런 날도 있지." 하며 과일을 깎아 주었다.']]],
    ['K',"'요즘 제일 하고 싶은 게 뭐야?'",[['배우고 싶은 걸 말한다','"그럼 같이 방법을 찾아보자." 하고 진지하게 들어 주었다.'],['놀고 싶다고 한다','"주말에 같이 놀러 가자." 하고 약속했다.']]],
    ['Y',"'요즘 무슨 고민 있니? 얼굴이 좀 피곤해 보여.'",[['솔직하게 털어놓는다','한참 듣더니 "말해 줘서 고마워." 하고 어깨를 감싸 주었다.'],['괜찮다고 한다','"언제든 이야기하고 싶으면 말해." 하고 더 묻지 않았다.']]],
    ['Y',"'저녁 같이 먹자. 오늘은 네가 좋아하는 거야.'",[['고맙다고 하고 같이 먹는다','식탁에서 오랜만에 웃음소리가 났다.'],['나중에 먹겠다고 한다','"그래, 남겨 둘게." 하고 그릇을 덮어 두었다.']]],
    ['A',"'요즘 일은 어때? 너무 무리하지 마.'",[['요즘 일을 이야기한다','고개를 끄덕이며 끝까지 들어 주었다.'],['걱정 말라고 웃는다','"그래도 밥은 꼭 챙겨 먹어." 하고 웃었다.']]],
    ['A',"'주말에 시간 있으면 같이 장 보러 갈래?'",[['같이 가자고 한다','오래간만에 둘이서 시장을 한 바퀴 돌았다.'],['다음 주에 가자고 한다','"그래, 꼭이다." 하고 달력에 적었다.']]],
    ['O',"'옛날 생각 나네. 너 어릴 때 말이야…'",[['그 이야기를 더 해 달라고 한다','처음 듣는 옛이야기가 이어졌다.'],['손을 잡아 드린다','말없이 손을 꼭 마주 잡았다.']]]],
  teacher:[['K',"'{me}, 요즘 책 읽는 건 어때?'",[['재미있게 읽은 책을 말한다','"그 책 좋지! 비슷한 책도 하나 알려 줄게." 하셨다.'],['어렵다고 말한다','"한 쪽씩만 읽어도 괜찮아." 하고 웃으셨다.']]],
    ['K',"'쉬는 시간인데 밖에 안 나가니?'",[['궁금한 걸 여쭤본다','칠판에 그림까지 그려 가며 설명해 주셨다.'],['곧 나간다고 한다','"뛰다가 다치지 말고!" 하셨다.']]],
    ['Y',"'진로 생각은 좀 해 봤니?'",[['하고 싶은 일을 말한다','"그 일을 하는 사람을 한번 만나 보면 좋겠다." 하고 방법을 알려 주셨다.'],['아직 모르겠다고 한다','"모르는 게 당연해. 이것저것 해 보렴." 하셨다.']]],
    ['Y',"'지난번 발표 잘하더라.'",[['고맙다고 한다','"다음엔 네가 친구들을 도와줘 볼래?" 하셨다.'],['떨렸다고 말한다','"떨리는데도 끝까지 한 게 대단한 거야." 하셨다.']]]],
  boss:[['A',"'요즘 일은 손에 좀 익었어?'",[['모르는 걸 여쭤본다','오래 일한 요령을 몇 가지 알려 주었다.'],['잘 지낸다고 한다','"힘든 거 있으면 말해." 하고 어깨를 두드렸다.']]],
    ['A',"'다음 달에 새 일을 맡아 볼 생각 있나?'",[['해 보겠다고 한다','"그럼 이번 주부터 옆에서 배워 봐." 하고 자료를 건넸다.'],['아직 이르다고 한다','"준비되면 말해." 하고 웃었다.']]],
    ['O',"'오랜만이에요. 요즘 어떻게 지내세요?'",[['요즘 이야기를 한다','옛날 일터 이야기로 한참 웃었다.'],['안부를 묻는다','서로 건강하자는 말로 인사를 마쳤다.']]]],
  mate:[['K',"'너 이따 뭐 해? 같이 놀래?'",[['좋다고 한다','학교 끝나고 놀 약속을 잡았다.'],['숙제가 있다고 한다','"그럼 내일 놀자!" 하고 새끼손가락을 걸었다.']]],
    ['K',"'이거 봐, 내가 그린 거야.'",[['잘 그렸다고 말한다','친구가 쑥스럽게 웃으며 그림을 하나 더 보여 주었다.'],['나도 그려 보겠다고 한다','둘이서 공책 한 바닥을 낙서로 채웠다.']]],
    ['Y',"'어제 그거 봤어? 진짜 웃기더라.'",[['같이 이야기한다','쉬는 시간 내내 웃음이 끊이지 않았다.'],['못 봤다고 한다','"그럼 내가 줄거리 말해 줄게!" 하고 신나게 이야기했다.']]],
    ['Y',"'시험 범위 너무 많지 않아?'",[['같이 공부하자고 한다','도서관에서 같이 공부하기로 했다.'],['걱정하지 말라고 한다','"그래, 어떻게든 되겠지." 하고 둘이 웃었다.']]]],
  coll:[['A',"'점심 뭐 먹을래요?'",[['같이 먹자고 한다','점심을 먹으며 서로 사는 이야기를 나눴다.'],['오늘은 바쁘다고 한다','"그럼 커피라도 나중에요." 하고 웃었다.']]],
    ['A',"'이거 어떻게 하는지 알아요?'",[['아는 만큼 알려 준다','"덕분에 살았어요." 하고 고마워했다.'],['같이 찾아보자고 한다','둘이 머리를 맞대고 방법을 찾아냈다.']]]],
  nb:[['T',"'아이고, 많이 컸네!'",[['인사를 꾸벅 한다','"인사도 잘하네." 하며 사탕을 하나 쥐여 주었다.'],['엄마 뒤에 숨는다','"부끄럼쟁이구나." 하고 웃었다.']]],
    ['K',"'학교 다녀오니? 어디 가는 길이야?'",[['가는 곳을 말한다','"차 조심하고!" 하고 손을 흔들어 주었다.'],['인사만 하고 간다','뒤에서 "착하네." 하는 말이 들렸다.']]],
    ['Y',"'{town}도 많이 변했지?'",[['어릴 때 이야기를 한다','옛날 {town} 이야기를 한참 들려주었다.'],['요즘 생긴 곳을 말한다','"그래? 나도 가 봐야겠네." 하고 웃었다.']]],
    ['A',"'날씨가 많이 바뀌었네요.'",[['이것저것 안부를 나눈다','동네 소식을 몇 가지 들었다.'],['짧게 인사한다','가볍게 고개를 숙여 인사했다.']]],
    ['O',"'오늘도 산책 나오셨어요?'",[['같이 걷자고 한다','둘이서 동네를 천천히 한 바퀴 걸었다.'],['건강하시라고 인사한다','"서로 그래야지요." 하고 웃었다.']]]],
  kid:[['T',"'같이 놀래?'",[['같이 뛰어논다','둘이 숨이 차도록 뛰어다녔다.'],['장난감을 보여 준다','서로 장난감을 바꿔 가며 놀았다.']]],
    ['K',"'너 몇 학년이야?'",[['내 학년을 말한다','"나랑 같네!" 하고 금세 친해졌다.'],['같이 놀자고 한다','새 친구와 공기놀이를 했다.']]],
    ['Y',"'형(누나)… 이거 어떻게 하는 거예요?'",[['천천히 가르쳐 준다','아이가 해내고는 크게 웃었다.'],['같이 해 보자고 한다','둘이서 끝까지 해냈다.']]],
    ['A',"'안녕하세요!'",[['반갑게 인사한다','아이가 꾸벅 인사하고 뛰어갔다.'],['이름을 물어본다','아이가 수줍게 이름을 알려 주었다.']]],
    ['O',"'할머니(할아버지), 안녕하세요!'",[['사탕을 하나 건넨다','아이 얼굴에 웃음이 번졌다.'],['쓰다듬어 준다','아이가 고개를 숙여 인사했다.']]]],
  elder:[['T',"'아이고, 예쁘다. 몇 살이니?'",[['손가락으로 나이를 편다','"그렇게나 컸어?" 하며 웃으셨다.'],['수줍게 웃는다','머리를 쓰다듬어 주셨다.']]],
    ['K',"'옛날에는 여기가 다 논밭이었단다.'",[['더 들려 달라고 한다','옛날 {town} 이야기를 한참 들려주셨다.'],['신기하다고 한다','"너희 때는 또 많이 바뀌겠지." 하셨다.']]],
    ['Y',"'공부하느라 힘들지?'",[['요즘 이야기를 한다','"그래도 젊을 때가 제일 좋은 때야." 하고 웃으셨다.'],['괜찮다고 한다','"밥 잘 먹고 다녀라." 하셨다.']]],
    ['A',"'젊은 사람이 바쁘겠구먼.'",[['안부를 여쭌다','건강하게 지내신다며 손을 잡아 주셨다.'],['무거운 짐을 들어 드린다','"고맙네, 복 받을 거야." 하셨다.']]],
    ['O',"'우리도 많이 늙었지요?'",[['옛 친구 이야기를 나눈다','함께 알던 사람들 이야기로 오후가 지나갔다.'],['같이 웃는다','"그래도 이렇게 만나니 좋네요." 하셨다.']]]],
  pet:[['*','{pet}가 나를 빤히 쳐다본다.',[['살살 쓰다듬는다','{pet}가 눈을 가늘게 뜨고 가만히 있었다.'],['손을 내밀어 기다린다','{pet}가 다가와 냄새를 킁킁 맡았다.']]]]
};
// 같은 해에 다시 말을 걸면: 짧은 인사만
const TALK_AGAIN={fam:['"또 왔어? 이리 와."','"배고프면 말해."','"오늘 하루도 고생했어."'],teacher:['"또 궁금한 거 있니?"','"복도에서 뛰지 마라!"'],boss:['"오늘도 잘 부탁해."','"잠깐 쉬었다 해."'],
  mate:['"아까 그거 재밌었지?"','"내일 보자!"'],coll:['"오늘도 힘냅시다."','"퇴근까지 조금만!"'],nb:['"또 보네요!"','"좋은 하루!"'],kid:['"또 놀자!"','"안녕!"'],elder:['"그래, 또 보자꾸나."','"조심히 다니거라."'],pet:['꼬리를 살랑 흔들었다.','하품을 크게 했다.']};
const TALK_WHY={fam:'가족',teacher:'선생님',boss:'선배',mate:'친구',coll:'동료',nb:'이웃',kid:'동네',elder:'이웃',pet:''};
function talkFill(L,s,pet){ return String(s).replace(/\{me\}/g,L.given||L.name).replace(/\{town\}/g,L.town||L.C.city||'우리 동네').replace(/\{cn\}/g,L.C.n).replace(/\{pet\}/g,pet||'동물'); }
const unq=t=>String(t).replace(/^'(.*)'$/,'$1');
function openTalk(nr){ if(dlgOpen()) return; const L=G.life, n=nr.npc, w=whoOf(n), st=stg(L.age), Y=tkYear(L), id=W.map+':'+(n.key||n.a||'');
  const famWhy=w.role==='fam'?(w.n||'가족'):TALK_WHY[w.role];
  if(Y.who[id]){ const pool=TALK_AGAIN[w.role]||TALK_AGAIN.nb; dlgRun([{who:w.role==='pet'?'':w.n,t:unq(pickOne(pool).replace(/^"|"$/g,''))}]); return; }
  if(st==='B'&&w.role!=='fam'&&w.role!=='pet'){ Y.who[id]=1; dlgRun([{who:w.n,t:'까꿍! 아이고, 예뻐라.'},{who:'',t:'나도 옹알옹알 대답했다.'}]); return; }
  let pool=(TALK[w.role]||TALK.nb).filter(d=>d[0]==='*'||d[0]===st); if(!pool.length) pool=(TALK[w.role]||TALK.nb).filter(d=>'BTKYAO'.indexOf(d[0])<='BTKYAO'.indexOf(st)); if(!pool.length) pool=TALK.nb;
  const d=pool[Math.floor(R()*pool.length)], q=unq(talkFill(L,d[1],w.n));
  dlgRun([{who:w.role==='pet'?'':w.n,t:q,opts:d[2].map(o=>talkFill(L,o[0],w.n)),then:i=>{ Y.who[id]=1; const o=d[2][i], ans=talkFill(L,o[1],w.n); let up=[];
    if(Y.n<TK_CAP[st]){ Y.n++; const g={j:.3}; if(w.role==='pet') g.j=.6; else if(w.role==='teacher') g.k=.5; else if(w.role==='boss') g.t=.5; else g.r=.8; up=tinyGain(L,g,famWhy); }
    renderHud(); persist(); return [{who:w.role==='pet'?'':w.n,t:ans,up}]; }}]); }

/* ---------- 2) 만져 보기 · 가지고 놀기 · 해 보기 ---------- */
// 놀이: [단계, 글, 오르는 것(t 기술 e 경험 k 지식 j 행복 h 건강 r 관계), 조건(U 도시 · R 시골 · r 잘사는 나라 · p 덜 잘사는 나라)]
const PLAY={
  counter:{n:'부엌',B:[['냄비 뚜껑을 숟가락으로 두드렸다. 땡땡 소리에 내가 더 놀랐다.','e j'],['찬장 문을 열었다 닫았다 했다. 안에 그릇이 잔뜩 있었다.','e t'],['밀가루 반죽을 손가락으로 꾹 눌러 보았다. 말랑말랑했다.','e t']],
    T:[['엄마 옆에서 콩나물(채소)을 하나하나 다듬었다.','t r'],['냄비와 그릇으로 소꿉놀이 밥상을 차렸다.','t j'],['반죽을 동글동글 빚어 작은 공을 만들었다.','t e']],
    K:[['처음으로 달걀 프라이를 해 보았다. 노른자가 터졌지만 맛있었다.','t e'],['가족 밥 짓는 일을 도우며 쌀 씻는 법을 배웠다.','t r'],['설거지를 맡아 그릇을 반짝반짝 닦았다.','t r']],
    Y:[['요리법을 찾아 볶음밥을 만들어 가족에게 내놓았다.','t e',''],['손님이 오신 날, 반찬 하나를 혼자 맡아 만들었다.','t r'],['장 볼 목록을 짜고 한 주 반찬값을 계산해 보았다.','t k']]},
  table:{n:'식탁',B:[['식탁 다리를 붙잡고 영차 일어섰다. 다리가 후들거렸다.','t h'],['식탁 밑에 들어가 앉아 있었다. 나만의 작은 집 같았다.','e j']],
    T:[['컵을 탑처럼 쌓다가 와르르 무너뜨렸다.','t j'],['숟가락으로 혼자 밥을 떠먹었다. 반은 흘렸다.','t h'],['색종이를 손으로 찢어 붙여 그림을 만들었다.','t e']],
    K:[['가족과 보드게임을 하며 셈을 빨리 하게 됐다.','k r'],['종이접기 책을 보고 학과 개구리를 접었다.','t'],['동생에게 가위바위보 대신 새 놀이를 만들어 가르쳤다.','t r']],
    Y:[['동생 숙제를 봐주며 설명하는 법을 익혔다.','t r'],['체스(장기·바둑) 판을 펴고 혼자 기보를 따라 두었다.','k t'],['가족 여행 계획표를 짜 보았다.','t e']]},
  sofa:{n:'소파',B:[['쿠션 사이에 얼굴을 묻고 까꿍 놀이를 했다.','j e'],['소파를 붙잡고 옆으로 한 발씩 걸었다.','t h']],
    T:[['쿠션으로 성을 쌓고 그 안에 숨었다.','t j'],['그림책을 거꾸로 들고 혼자 읽는 척을 했다.','k j']],
    K:[['소파에 누워 만화책을 한 권 다 읽었다.','k j'],['가족 앞에서 마술 공연을 열었다. 동전이 사라졌다!','t r'],['인형으로 인형극을 만들어 보여 주었다.','t r']],
    Y:[['외국어 영상을 보며 문장을 따라 말해 보았다.','k e','r'],['라디오에서 들은 외국 노래 가사를 받아 적어 보았다.','k e','p'],['기타(악기) 코드를 처음으로 잡아 보았다. 손가락이 아팠다.','t e']]},
  tv:{n:'텔레비전',B:[['화면 속 사람을 손바닥으로 탁탁 두드렸다.','e j'],['노래가 나오자 엉덩이를 들썩였다.','j h']],
    T:[['만화 주제가에 맞춰 춤을 췄다.','h j'],['화면 속 동물 이름을 따라 말했다.','k e']],
    K:[['자연 다큐멘터리를 보고 궁금한 걸 잔뜩 물어보았다.','k e'],['체조 방송을 보며 동작을 따라 했다.','h t']],
    Y:[['뉴스를 보며 가족과 세상 이야기를 했다.','k r'],['요리·만들기 방송을 보고 따라 해 보기로 했다.','t e']]},
  bed:{n:'침대',B:[['이불 속에 쏙 숨었다가 고개를 내밀었다. 까꿍!','j e'],['베개를 끌어안고 데굴데굴 굴렀다.','h j']],
    T:[['침대 위에서 콩콩 뛰다가 혼이 났다.','h j'],['인형들을 줄 세워 재우는 놀이를 했다.','t r']],
    K:[['자기 전에 일기를 썼다. 오늘 있었던 일을 세 줄로.','k t'],['손전등을 켜고 이불 속에서 책을 읽었다.','k e']],
    Y:[['잠들기 전 노래를 만들어 흥얼거려 보았다.','t j'],['내일 할 일 목록을 쓰고 잤다.','t k']]},
  desk:{n:'책상',B:[['종이를 구겨 바스락 소리를 냈다. 재미있어서 계속했다.','e t'],['연필을 꼭 쥐고 종이에 점을 콕콕 찍었다.','t e']],
    T:[['크레파스로 가족 얼굴을 그렸다.','t j'],['가위로 종이를 처음 잘라 보았다. 삐뚤빼뚤했다.','t e'],['블록으로 높은 탑을 쌓았다.','t k']],
    K:[['고장 난 시계를 뜯어 톱니바퀴를 들여다보았다.','t k'],['상자와 테이프로 로봇을 만들었다.','t e'],['좋아하는 만화 주인공을 따라 그렸다.','t j'],['색실로 팔찌를 엮어 친구에게 줄 선물을 만들었다.','t r']],
    Y:[['컴퓨터로 간단한 게임을 만들어 보았다.','t k','r'],['네 칸 만화를 그려 친구들에게 돌렸다.','t j'],['나무 조각으로 작은 모형을 깎았다.','t e'],['낡은 라디오를 고쳐 소리를 살려 냈다.','t k','p'],['영상을 찍고 자르고 이어 붙여 보았다.','t e','r']]},
  yard:{n:'마당',B:[['햇볕이 드는 곳에 앉아 바람을 느꼈다.','e j'],['흙을 한 줌 쥐었다가 놓았다. 손가락 사이로 흘러내렸다.','e t']],
    T:[['개미가 줄지어 가는 걸 한참 따라갔다.','k e'],['화분에 물을 주었다. 반은 바닥에 쏟았다.','t r'],['돌멩이를 모아 크기대로 줄 세웠다.','k t']],
    K:[['작은 텃밭에 씨앗을 심고 이름표를 꽂았다.','t k'],['닭(가축)에게 모이를 주고 달걀을 찾아 왔다.','t e','R'],['나뭇가지로 새총을 만들어 깡통을 맞혔다.','t j']],
    Y:[['자전거 바퀴를 직접 갈아 끼웠다.','t k'],['버려진 나무판으로 의자를 만들었다.','t e'],['가족과 함께 지붕(울타리)을 고쳤다.','t r']]},
  board:{n:'칠판',K:[['쉬는 시간, 칠판에 퀴즈를 내고 친구들이 맞혔다.','k r'],['칠판 가득 커다란 그림을 그렸다.','t j']],Y:[['쉬는 시간에 칠판에 수학 문제를 풀어 친구에게 설명했다.','k r'],['학급 행사 안내문을 칠판에 꾸며 썼다.','t r']]},
  shelf:{n:'도서 코너',K:[['처음 보는 나라 이야기책을 빌렸다.','k e'],['도서 정리를 도우며 책 분류법을 배웠다.','t k']],Y:[['진로 책을 한 권 빌려 읽었다.','k e'],['도서부 친구와 책 소개 쪽지를 만들어 붙였다.','t r']]},
  table2:{n:'뒤쪽 탁자',K:[['과학 상자로 움직이는 자동차를 만들었다.','t k'],['친구들과 실뜨기를 하며 손놀림이 빨라졌다.','t r']],Y:[['동아리 친구들과 발명품 아이디어를 그렸다.','t r'],['모둠 과제 포스터를 꾸몄다.','t r']]},
  tree:{n:'나무',T:[['떨어진 나뭇잎을 주워 모았다.','e j'],['나무껍질을 손으로 쓸어 보았다. 거칠거칠했다.','e k']],
    K:[['나무에 올라가 가지 위에 걸터앉았다.','h t e'],['나무에 붙은 곤충을 관찰해 공책에 그렸다.','k t'],['나뭇가지로 활을 만들어 보았다.','t e']],
    Y:[['나무 그늘에 앉아 풍경을 스케치했다.','t e'],['나무 아래서 친구와 악기 연습을 했다.','t r']]},
  field:{n:'밭',K:[['어른들 옆에서 김매기를 도왔다.','t h'],['밭에 씨앗을 줄 맞춰 심었다.','t k']],Y:[['수확한 채소를 시장에 낼 만큼 골라 담았다.','t k'],['물 대는 도랑을 고쳤다.','t h']]}
};
const VERB={B:'만져 보기',T:'가지고 놀기',K:'해 보기',Y:'해 보기'};
function playOK(L,c){ if(!c) return true; const tier=L.C.tier||2; return c==='U'?L.set==='U':c==='R'?L.set==='R':c==='r'?tier>=3:c==='p'?tier<=2:true; }
// 지금 가지고 놀 수 있는 것들: [키, 위치(사각형 또는 점)]
function touchables(){ const L=G.life, a=L.age, m=W.map, out=[]; if(a>=19) return out;
  if(m==='home'){ HOME.f.forEach(f=>out.push({k:f[0],r:f.slice(1)})); out.push({k:'yard',p:HOME.s.yard}); }
  else if(m==='elem'||m==='mid'){ if(a>=6) INT.f.forEach(f=>{ const k=f[0]==='table'?'table2':f[0]; if(PLAY[k]) out.push({k,r:f.slice(1)}); }); }
  else if(m==='out'){ if(a>=2) OUT.trees.forEach(t=>out.push({k:'tree',p:t})); if(a>=6&&L.set==='R') OUT.fields.forEach(f=>out.push({k:'field',r:f})); }
  return out.filter(o=>PLAY[o.k]&&PLAY[o.k][stg(a)]); }
const distTo=o=>o.p?Math.hypot(o.p[0]-W.x,o.p[1]-W.y):Math.hypot(Math.max(o.r[0]-W.x,0,W.x-o.r[0]-o.r[2]),Math.max(o.r[1]-W.y,0,W.y-o.r[1]-o.r[3]));
function nearExtra(){ const L=G.life; if(!L||W.car) return null; const st=stg(L.age); let best=null, bd=1.3;
  for(const n of (NPCMAP[W.map]||[])){ if(n.kind==='v') continue; const d=Math.hypot(n.x-W.x,n.y-W.y); if(d<bd){ bd=d; const w=whoOf(n); best={type:'t',npc:n,n:w.n,lab:`${w.n} · ${n.kind==='a'?'쓰다듬기':'말 걸기'}`}; } }
  for(const o of touchables()){ const d=distTo(o)+(o.p?.2:.35); if(d<bd){ bd=d; const P=PLAY[o.k], nm=o.k==='tv'&&(L.C.tier||2)<=1?'라디오':o.k==='yard'?L.spotName('yard'):P.n; best={type:'o',k:o.k,n:nm,lab:`${nm} · ${VERB[st]}`}; } }
  return best; }
function openTouch(nr){ if(dlgOpen()) return; const L=G.life, st=stg(L.age), P=PLAY[nr.k]; if(!P||!P[st]) return; const Y=tkYear(L);
  const all=P[st].filter(x=>playOK(L,x[2])), seen=Y.obj[nr.k]||[], fresh=all.filter(x=>!seen.includes(x[0])), it=(fresh.length?fresh:all)[Math.floor(R()*(fresh.length?fresh:all).length)];
  if(!it) return; Y.obj[nr.k]=seen.concat(it[0]); let up=[];
  if(fresh.length&&Y.o<TK_CAP[st]){ Y.o++; const m={B:.25,T:.3,K:.38,Y:.42}[st]||.3, g={}; it[1].split(' ').forEach(k=>{ g[k]=k==='j'?.4:k==='r'?.6:k==='t'?m:m*.6; }); up=tinyGain(L,g,nr.k==='counter'||nr.k==='table'?'가족':'');
    if(Y.o===1&&st!=='B') L.remember({a:L.age,t:it[0],sp:'desk'}); }
  renderHud(); persist(); dlgRun([{who:nr.n,t:it[0],up}]); }

/* ---------- 3) 학교 밖 활동 (6~18살 작은 선택) ---------- */
{ const cc0=CC; CC=null;
S(6,12,'*','play','동네 아이들이 긴 줄넘기를 한다.',[['줄을 같이 돌린다','t2 r1 D','줄 돌리는 박자를 처음으로 맞췄다.'],['쌩쌩이에 도전한다','t2 h1 B','쌩쌩이를 두 번 넘었다. 다리가 후들거렸다.'],['구경만 한다','','구경만 하다 해가 졌다.']]);
S(6,12,'*','friend','친구가 종이접기 책을 빌려 왔다.',[['어려운 학을 끝까지 접는다','t2 D','구겨진 종이학이 겨우 날개를 폈다.'],['친구에게 배운다','t1 r1','친구가 접는 순서를 천천히 보여 주었다.'],['딱지를 접어 논다','j2','딱지치기로 친구 딱지를 세 장 땄다.']]);
S(6,12,'*','nature',['공원에서 아이들이 곤충을 관찰하고 있다.','개울가에 올챙이가 가득하다.'],[['이름을 찾아 공책에 적는다','k2 t1 C','처음 보는 생물 이름을 공책에 적었다.'],['손으로 잡아 본다','e1 t1 B','손바닥 위에서 꼬물거렸다. 다시 놓아 주었다.'],['구경만 한다','j1','한참 들여다보았다.']]);
S(7,12,'*','friend','친구네 할아버지가 나무로 팽이를 깎고 계신다.',[['깎는 법을 배운다','t2 C','사포로 팽이 끝을 둥글게 다듬었다.'],['팽이를 돌려 본다','j2','팽이가 오래오래 돌았다.']]);
S(8,12,'*','shop',['가게 아저씨가 진열을 도와주면 사탕을 주겠다고 한다.','구멍가게 할머니가 물건 정리를 도와 달라신다.'],[['돕는다','t1 r1 D','과자 상자를 크기대로 줄 세웠다.'],['계산하는 법을 물어본다','k1 t1 C','거스름돈 세는 법을 배웠다.'],['바쁘다고 한다','','그냥 지나쳤다.']]);
S(6,12,'R','play','마을 아이들이 소(염소)를 몰고 들판으로 간다.',[['따라가 몰아 본다','t2 h1','막대기로 소를 몰아 개울까지 갔다.'],['풀피리를 불어 본다','t1 j1','풀피리 소리가 처음으로 났다.']]);
S(7,12,'*','play','공터에서 자전거 체인이 빠졌다.',[['체인을 직접 끼운다','t2 C','손이 시커멓게 됐지만 체인이 맞물렸다.'],['어른에게 도와 달라고 한다','r1 k1','동네 아저씨가 고쳐 주며 방법을 알려 주셨다.']]);
S(9,12,'*','friend','친구가 같이 동네 신문을 만들자고 한다.',[['기사를 쓴다','k2 t1','옆집 강아지 이야기를 기사로 썼다.'],['그림을 맡는다','t2 j1','첫 장 그림을 그렸다.'],['다음에 하자고 한다','','다음에 하자고 했다.']]);
S(9,12,'*','nature','나뭇가지와 끈으로 무언가 만들 수 있을 것 같다.',[['작은 뗏목을 만든다','t2 e1 C','뗏목이 개울에서 세 뼘쯤 떠갔다.'],['새집을 만든다','t2 K','새집을 나무에 매달았다.']]);
S(13,18,'*','study',['도서관 만들기 공간에서 무료 강좌가 열린다.','읍내 도서관에서 무료 컴퓨터 강좌가 열린다.'],[['신청해서 끝까지 듣는다','t3 D','내가 만든 작은 물건을 손에 쥐어 보았다.'],['한 번 가 본다','t1 C','처음 보는 기계를 한참 구경했다.'],['시험공부를 한다','k2','책상 앞에 앉아 문제집을 풀었다.']]);
S(13,18,'*','friend','친구가 같이 노래를 만들어 보자고 한다.',[['가사를 쓴다','t2 j1','둘이서 만든 노래를 처음 끝까지 불렀다.'],['악기를 맡는다','t2 D','손끝이 아프도록 같은 마디를 연습했다.'],['듣는 사람이 된다','r1','친구 노래를 들어 주었다.']]);
S(13,18,'*','market',['번화가 악기 가게 앞에서 기타 소리가 들린다.','장터에서 대장장이가 쇠를 두드린다.'],[['배우고 싶다고 말한다','t2 e1 B','한 시간 동안 손가락이 아프도록 배웠다.'],['한참 구경한다','k1 C','손놀림을 한참 지켜보았다.'],['지나간다','','그냥 지나갔다.']]);
S(14,18,'*','market','시장 상인이 주말에 일손이 필요하다고 한다.',[['일을 돕고 용돈을 번다','t2 @1 D','손님을 부르는 목소리가 제법 커졌다.'],['장사 요령을 묻는다','k1 t1 C','값을 매기는 법을 들었다.'],['거절한다','','주말에는 쉬었다.']]);
S(13,18,'*','play','동네 아이들이 공 차는 법을 가르쳐 달라고 한다.',[['코치를 맡아 준다','t2 r2 K','아이들이 내 이름을 부르며 따라왔다.'],['같이 뛴다','h2 j1','땀범벅이 되도록 뛰었다.']]);
S(13,18,'*','friend','친구가 고장 난 라디오를 들고 왔다.',[['같이 뜯어서 고쳐 본다','t2 C','나사 하나가 문제였다. 다시 소리가 났다!'],['수리점에 가 보자고 한다','r1 k1','수리점 아저씨가 고치는 걸 옆에서 보았다.']]);
S(13,18,'*','bus','정류장에 청소년 강좌 안내가 붙었다.',[['요리 강좌를 듣는다','t2 e1','처음으로 혼자 한 끼를 차렸다.'],['춤 강좌를 듣는다','t1 h1 j1','거울 앞에서 동작을 맞췄다.'],['관심 없다','','그냥 지나갔다.']]);
S(13,18,'R','nature','마을 어른이 바구니(그물) 짜는 법을 알려 주겠다고 하신다.',[['배운다','t3 r1 D','손끝이 갈라졌지만 한 줄을 끝까지 짰다.'],['다음에 배우겠다고 한다','','다음에 배우겠다고 했다.']]);
CC=cc0; }

/* ---------- 4) 인생 기록: 위쪽 메뉴로 넘겨 본다 ---------- */
const REC_TABS=[['sum','한눈에'],['shape','삶의 모양'],['story','이야기'],['mem','기억에 남은 일'],['words','남긴 말']];
function lifeTabs(l,o){ o=o||{}; const C=COUNTRIES[l.c||'KR']||COUNTRIES.KR, mk=x=>x&&{a:x[0],j:x[1],k:x[2],t:x[3],e:x[4],r:x[5],h:x[6]}, H=(l.hist||[]).map(mk), pk=mk(l.peak), nw=l.nw||0;
  const kp=[[`${l.age}세`,`향년 · ${C.n} 기대수명 약 ${l.le||C.le}세`],[l.cause||'—','삶을 마친 이유'],[`${l.n||0}번`,'직접·자동으로 한 선택'],[fmtWon(nw),nw<0?'남긴 빚':'남긴 재산']];
  if(l.avgJ!=null) kp.push([`${l.avgJ}점`,'평생 평균 행복']); if(l.earned) kp.push([fmtWon(l.earned),'평생 번 돈']); if(l.maxNW&&l.maxNW>nw) kp.push([fmtWon(l.maxNW),'재산이 가장 많았을 때']);
  if(l.kids) kp.push([`${l.kids}명`,'아이']); if(l.top&&TRAIT[l.top]) kp.push([TRAIT[l.top],'가장 많이 고른 성향']);
  const none=t=>`<p class="rempty">${t}</p>`, li=(arr,f)=>`<ul class="rl">${arr.map(f).join('')}</ul>`;
  let shape=''; if(pk){ const v={}; AXES.forEach(k=>v[k]=pk[k]); shape+=`<section class="icard"><h3>오각형이 가장 넓었던 때 <small>${pk.a}살 무렵</small></h3>${radarSVG(v,[])}</section>`; }
  if(H.length>1){ try{ shape+=`<section class="icard"><h3>나이에 따라 달라진 것들</h3>${lineChartSVG({hist:H},pk?pk.a:null)}</section>`; }catch(e){} }
  const words=[(l.ans||[]).length?`<section class="icard"><h3>마지막 질문의 답</h3>${li(l.ans,x=>`<li>${esc(x)}</li>`)}</section>`:'',
    (l.notes||[]).length?`<section class="icard"><h3>삶의 중간에 남긴 말</h3>${li(l.notes,x=>`<li>${x[0]}살 · ${esc(x[1])}</li>`)}</section>`:'',
    `<section class="icard"><h3>남기는 한마디</h3><q>${esc(l.epi?'“'+l.epi+'”':'남긴 말 없음')}</q></section>`].join('');
  const panes={card:o.card||'',
    sum:`<section class="icard"><h3>${esc(l.title||'제목 없는 삶')} <small>${esc(l.name||'')} · ${esc(C.n)} ${SETN[l.set]||''}</small></h3><div class="kpi">${kp.map(c=>`<div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('')}</div></section>`,
    shape:shape||none('그래프로 볼 만큼 긴 기록이 없어요.'),
    story:(l.rows||[]).length?`<section class="icard"><dl class="whoami">${l.rows.map(r=>`<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl></section>`:none('기록된 이야기가 없어요.'),
    mem:(l.mem||[]).length?`<section class="icard">${li(l.mem,m=>`<li><b>${m[0]}살</b> · ${esc(m[1])}</li>`)}</section>`:none('기억에 남은 큰 일이 없어요.'),
    words};
  const tabs=(o.card?[['card','기록 카드']]:[]).concat(REC_TABS);
  return `<div class="ldt rtabs-wrap"><nav class="itabs rtabs" role="tablist">${tabs.map(([k,n],i)=>`<button type="button" role="tab" data-r="${k}" class="${i?'':'on'}" aria-selected="${!i}">${n}</button>`).join('')}</nav>
    ${tabs.map(([k],i)=>`<div class="rpane" data-r="${k}"${i?' hidden':''}>${panes[k]}${i<tabs.length-1?`<button type="button" class="btn rnext" data-go="${tabs[i+1][0]}">다음: ${tabs[i+1][1]} ▶</button>`:''}</div>`).join('')}</div>`; }
function recTab(w,k){ w.querySelectorAll(':scope>.rtabs button').forEach(x=>{ const on=x.dataset.r===k; x.classList.toggle('on',on); x.setAttribute('aria-selected',on); if(on) x.scrollIntoView({block:'nearest',inline:'center'}); });
  w.querySelectorAll(':scope>.rpane').forEach(p=>p.hidden=p.dataset.r!==k); }
document.addEventListener('click',e=>{ const b=e.target.closest('.rtabs button, .rpane .rnext'); if(!b) return; const w=b.closest('.rtabs-wrap'); if(!w) return; e.preventDefault(); recTab(w,b.dataset.r||b.dataset.go); });
// '지나온 삶'과 교사용 기록에서도 같은 메뉴로
lifeDetailHTML=function(l){ return lifeTabs(l); };

/* ---------- 5) 개발자 모드: 나라·나이를 골라 바로 플레이, 엔딩 바로 보기 (저장하지 않는다) ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
#devP{position:fixed;inset:0;z-index:200;background:rgba(10,16,24,.72);display:grid;place-items:center;padding:16px}#devP[hidden]{display:none}
#devP .dbox{background:#FBFAF6;color:#1E2B37;border-radius:16px;max-width:44rem;width:100%;max-height:92vh;overflow:auto;padding:18px 20px;display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
#devP h2{margin:0;font-size:1.25rem}#devP .drow{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#devP label{font-weight:700;min-width:5.5rem}
#devP select,#devP input[type=number],#devP input[type=password]{font:inherit;padding:6px 10px;border-radius:8px;border:1.5px solid #C9C2B2;background:#fff}
#devP .seg button{font-size:.9rem}#devP .q button{border:1.5px solid #C9C2B2;background:#fff;border-radius:999px;padding:4px 10px;cursor:pointer;font:inherit;font-size:.88rem}
#devP .note{font-size:.85rem;color:#5A6A78;margin:0}#devP .err{color:#B03030;margin:0;font-size:.9rem}
#devBar{position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:120;display:flex;gap:4px;flex-wrap:wrap;justify-content:center;background:rgba(30,43,55,.88);padding:5px 8px;border-radius:12px;max-width:96vw}
#devBar[hidden]{display:none}#devBar.mini button:not([data-a=tog]){display:none}#devBar{font-size:.8rem}#devBar b{color:#FFC9A8;font-size:.8rem;align-self:center;margin-right:4px}
#devBar button{all:unset;cursor:pointer;color:#fff;font-size:.8rem;font-weight:700;padding:4px 9px;border-radius:8px;background:rgba(255,255,255,.12)}#devBar button:hover{background:rgba(255,255,255,.26)}
</style>`);
const DEV={c:'KR',set:'U',famI:1,sex:0,age:0,sec:20};
function devEl(){ let d=$('devP'); if(d) return d; d=document.createElement('div'); d.id='devP'; d.hidden=true; document.body.appendChild(d);
  const bar=document.createElement('div'); bar.id='devBar'; bar.hidden=true; document.body.appendChild(bar);
  bar.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) devAct(b.dataset.a); }); return d; }
function openDev(){ const d=devEl(); d.hidden=false;
  if(!G.tok){ d.innerHTML=`<div class="dbox"><h2>개발자 모드</h2><p class="note">교사용 모드와 같은 코드로 들어갑니다.</p><div class="drow"><input type="password" id="devCode" placeholder="코드" autocomplete="off"><button class="btn primary" id="devGo">들어가기</button><button class="btn" id="devX">닫기</button></div><p class="err" id="devErr"></p></div>`;
    const go=()=>{ if($('devCode').value===CFG.TEACHER_CODE){ G.tok=1; openDev(); } else $('devErr').textContent='코드가 맞지 않습니다.'; };
    $('devGo').onclick=go; $('devCode').onkeydown=e=>{ if(e.key==='Enter') go(); }; $('devX').onclick=()=>d.hidden=true; $('devCode').focus(); return; }
  const seg=(k,arr)=>`<div class="seg" data-k="${k}">${arr.map(([v,t])=>`<button data-v="${v}" class="${String(DEV[k])===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  d.innerHTML=`<div class="dbox"><h2>개발자 모드 <small class="note">나라와 시점을 골라 바로 확인 · 기록은 저장되지 않아요</small></h2>
    <div class="drow"><label for="devC">나라</label><select id="devC">${$('tCountry').innerHTML}</select></div>
    <div class="drow"><label>사는 곳</label>${seg('set',[['U','도시'],['R','농촌']])}</div>
    <div class="drow"><label>가정 형편</label>${seg('famI',[[0,'넉넉한'],[1,'보통'],[2,'어려운']])}</div>
    <div class="drow"><label>성별</label>${seg('sex',[[0,'남자'],[1,'여자']])}</div>
    <div class="drow"><label for="devA">시작 나이</label><input type="number" id="devA" min="0" max="100" value="${DEV.age}" style="width:6rem"><span class="q">${[0,1,3,6,10,13,16,19,25,35,45,60,75].map(a=>`<button data-a="${a}">${a}</button>`).join(' ')}</span></div>
    <p class="note">그 나이까지의 삶은 자동으로 채워집니다(무작위). 일찍 세상을 떠나는 나라라면 그 나이까지 산 삶이 나올 때까지 다시 뽑습니다.</p>
    <div class="drow"><label>한 해 길이</label>${seg('sec',[[60,'보통 60초'],[20,'빠르게 20초'],[8,'시연 8초']])}</div>
    <div class="drow"><button class="btn primary" id="devPlay">이 나이에서 플레이</button><button class="btn" id="devEndHere">이 나이에서 끝난 삶의 엔딩</button><button class="btn" id="devEndAll">끝까지 자동으로 살고 엔딩</button></div>
    <p class="err" id="devErr"></p>
    <p class="note">플레이 중에는 화면 위의 개발자 막대로 1년·5년 건너뛰기, 원하는 나이로 가기, 큰 사건 바로 열기, 엔딩 보기를 할 수 있어요. 엔딩에서는 처음 장·마지막 장으로 바로 갈 수 있어요.</p>
    <div class="drow"><button class="btn ghost" id="devX">닫기</button></div></div>`;
  $('devC').value=DEV.c; $('devC').onchange=()=>DEV.c=$('devC').value; $('devA').oninput=()=>DEV.age=clamp(+$('devA').value||0,0,100);
  d.querySelectorAll('.seg').forEach(sg=>sg.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; DEV[sg.dataset.k]=sg.dataset.k==='set'?b.dataset.v:+b.dataset.v; [...sg.children].forEach(x=>x.classList.toggle('on',x===b)); });
  d.querySelector('.q').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; DEV.age=+b.dataset.a; $('devA').value=DEV.age; };
  $('devX').onclick=()=>d.hidden=true; $('devPlay').onclick=()=>devStart('play'); $('devEndHere').onclick=()=>devStart('endHere'); $('devEndAll').onclick=()=>devStart('endAll'); }
function devLife(age){ const o={c:DEV.c,set:DEV.set,famI:+DEV.famI,sex:+DEV.sex}; let X=null;
  for(let i=0;i<60;i++){ X=new Life(Object.assign({},o)); if(age>0) X.runAuto(age); if(!X.dead) return X; } if(X){ X.dead=false; X.f.dying=0; } return X; }
function devStart(how){ const age=clamp(+$('devA').value||0,0,100); DEV.age=age; G.teacher=true; G.dev=true; G.tid=null; G.troom=null; G.sec=+DEV.sec; G.room=null;
  let L=devLife(how==='endAll'?0:age); if(!L){ $('devErr').textContent='삶을 만들지 못했어요.'; return; }
  $('devP').hidden=true; G.life=L;
  if(how==='play'){ startGame(); devBar(); return; }
  if(how==='endAll'&&!L.dead) L.runAuto(); if(!L.dead) devKill(L); devToEnd(); }
function devKill(L){ L.dead=true; L.lifespan=L.age; L.cause=L.cause||'sudden'; L.cur=null; L.f.dying=0; }
function devToEnd(){ G.running=false; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); try{ G.life.makeComps&&!G.life.comps&&G.life.makeComps(); }catch(e){} finishLife(); devBar(); }
function devBar(){ const b=$('devBar'); if(!b) return; if(!G.dev){ b.hidden=true; return; } b.hidden=false;
  const inEnd=!$('s-end').hidden;
  b.innerHTML=inEnd?`<b>개발자</b><button data-a="tog">${b.classList.contains('mini')?'펼치기 ▾':'접기 ▴'}</button><button data-a="first">◀◀ 처음 장</button><button data-a="prev">◀ 이전</button><button data-a="next">다음 ▶</button><button data-a="last">마지막 장 ▶▶</button><button data-a="menu">개발자 메뉴</button><button data-a="quit">끝내기</button>`
    :`<b class="dage">개발자 · ${G.life?G.life.age:''}살</b><button data-a="tog">${b.classList.contains('mini')?'펼치기 ▾':'접기 ▴'}</button><button data-a="y1">+1년</button><button data-a="y5">+5년</button><button data-a="age">나이로 가기</button><button data-a="major">큰 사건 열기</button><button data-a="end">여기서 엔딩</button><button data-a="endAll">끝까지 살고 엔딩</button><button data-a="menu">개발자 메뉴</button><button data-a="quit">끝내기</button>`; }
function devSkip(to){ const L=G.life; if(!L||L.dead) return; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet();
  L.pending=null; const r=L.endPeriod(); if(!(r&&r.dead)&&L.age<to) L.runAuto(to); if(L.dead){ devToEnd(); return; } beginPeriod(); renderHud(); devBar(); }
function devAct(a){ const L=G.life;
  if(a==='tog'){ const b=$('devBar'); b.classList.toggle('mini'); devBar(); return; }
  if(a==='menu'){ openDev(); return; }
  if(a==='quit'){ G.dev=false; G.teacher=false; G.running=false; G.life=null; $('devBar').hidden=true; if(dlgOpen()) dlgClose(); if(!$('sheet').hidden) closeSheet(); if(Store.sess&&G.data) openHub(); else show('login'); return; }
  if(a==='first'||a==='last'||a==='prev'||a==='next'){ if(!G.endNav) return; if(a==='prev') G.endNav(-1); else if(a==='next') G.endNav(1); else for(let i=0;i<60;i++) G.endNav(a==='first'?-1:1); return; }
  if(!L||L.dead) return;
  if(a==='y1') devSkip(L.age+1); else if(a==='y5') devSkip(L.age+5);
  else if(a==='age'){ const v=prompt('몇 살로 갈까요? (지금 '+L.age+'살)',L.age+10); const n=+v; if(v!=null&&n>L.age) devSkip(Math.min(110,n)); }
  else if(a==='major'){ if(!$('sheet').hidden||dlgOpen()) return; if(L.pending){ openCross(); return; } if(!L.majorLeft()) L.addMajor(); if(L.major()!=null) openMajor(); else toast('지금 열 수 있는 큰 사건이 없어요.'); }
  else if(a==='end'){ devKill(L); devToEnd(); }
  else if(a==='endAll'){ L.cur=null; L.runAuto(); if(!L.dead) devKill(L); devToEnd(); } }
(function(){ const t=$('btnTeacher'); if(t) t.insertAdjacentHTML('afterend','<button class="btn ghost" id="btnDev" style="align-self:center;color:#AFC0CD;border-color:rgba(175,192,205,.35);background:transparent">개발자 모드</button>');
  const t2=$('btnTeacher2'); if(t2) t2.insertAdjacentHTML('afterend','<button class="btn ghost" id="btnDev2">개발자 모드</button>');
  [$('btnDev'),$('btnDev2')].forEach(b=>{ if(b) b.onclick=openDev; });
  // 화면이 바뀔 때 개발자 막대를 맞춘다
  const _sh=show; show=function(n){ _sh(n); if(G.dev&&n!=='game'&&n!=='end'){ G.dev=false; } setTimeout(devBar,0); }; })();

(function(){ const _rh=renderHud; renderHud=function(){ _rh.apply(this,arguments); if(G.dev&&G.life){ const e=document.querySelector('#devBar .dage'); if(e) e.textContent=`개발자 · ${G.life.age}살`; } }; })();
