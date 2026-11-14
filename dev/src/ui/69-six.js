/* ========== [2-1·2-2] 69-six: 여섯 가지 능력치 화면 · 열리는 안내 · 삶을 시작하기 전 설문 · 상호작용의 무게 (2026-11-14) ==========
   계산은 engine/62-six.js. 이 조각은 화면과 상호작용만 맡는다.
   1) 게임 화면 위쪽: 여섯 능력치 표시 — 시안 A 막대 · B 동그라미 · C 육각형 · D 점 다섯 칸 (ls 'life8b_sixhud', 개발자 모드에서 바꿈)
   2) 열리는 안내: 그 나이가 되면 가운데 카드로 '새로 알게 된 것'과 올리고 내리는 방법을 짧게 (한 번만)
   3) 집·동네의 사람·동물·물건과의 상호작용이 관계·경험·지식·기술을 넉넉히 움직이게(tinyGain 감싸기), 한 해에 오르는 횟수를 늘림,
      아직 얻을 것이 남은 사람·물건 위에 반짝이 표시, 한 해 내내 손을 놓은 능력치는 해가 바뀔 때 조금 준다
   4) 고등학생(16~18살) 용돈: 해마다 받고, 쓰고 남은 만큼 모인다(engine). 어른이 되면 첫 통장이 된다
   5) 삶을 시작하기 전 '소중한 것' 설문 3문항 — 엔딩과 같은 밤하늘 화면. 고른 것은 L.val.p에 남고 행복의 무게가 된다
   6) 내 정보 '삶의 모양'(육각형)·'내 행복을 만드는 것' — 시안 M1 육각형+카드 · M2 막대 목록 (ls 'life8b_sixinfo') */
Object.assign(AX_COL,SIX_COL);
const SIX_IC={
  h:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/><path d="M6.6 11.6h2.8l1.4-2.4 2 4.6 1.4-2.2h3.2"/>',
  r:'<circle cx="8.6" cy="8" r="3"/><circle cx="16.4" cy="9" r="2.4"/><path d="M3.2 19.2c0-3.3 2.4-5.6 5.4-5.6s5.4 2.3 5.4 5.6"/><path d="M14.6 14.1c2.9-.4 5.8 1.4 5.8 4.9"/>',
  e:'<circle cx="12" cy="12" r="8.4"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z"/>',
  k:'<path d="M3.4 5.6c3-1 6-1 8.6.9v12.9c-2.6-1.9-5.6-1.9-8.6-.9z"/><path d="M20.6 5.6c-3-1-6-1-8.6.9v12.9c2.6-1.9 5.6-1.9 8.6-.9z"/>',
  t:'<path d="M5 19.5l8.2-8.2"/><path d="M10.6 7.4l3.6-3.6 6 6-3.6 3.6z"/>',
  m:'<path d="M5 7.8c0-1.6 3.1-2.9 7-2.9s7 1.3 7 2.9-3.1 2.9-7 2.9-7-1.3-7-2.9z"/><path d="M5 7.8v4.1c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9V7.8"/><path d="M5 11.9V16c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9v-4.1"/>',
  lock:'<rect x="5.5" y="11" width="13" height="9" rx="2"/><path d="M8.2 11V8.2a3.8 3.8 0 0 1 7.6 0V11"/>'};
const sixIc=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SIX_IC[k]}</svg>`;
// 행복 얼굴 (0~4단계)
function joyFace(j,sz){ const lv=j>=72?4:j>=58?3:j>=42?2:j>=28?1:0, cv=[-3.4,-1.6,0,2,3.6][lv], col=['#7C8A96','#9A8FB8','#E0A33A','#E2853A','#E2703A'][lv];
  return `<svg class="jface" viewBox="0 0 32 32" width="${sz||28}" height="${sz||28}" role="img" aria-label="행복 ${['많이 낮음','낮음','보통','높음','아주 높음'][lv]}"><circle cx="16" cy="16" r="14" fill="${col}"/><circle cx="11" cy="13" r="1.9" fill="#2A2622"/><circle cx="21" cy="13" r="1.9" fill="#2A2622"/><path d="M10 ${20.5-cv*.3} Q16 ${20.5+cv} 22 ${20.5-cv*.3}" stroke="#2A2622" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`; }
document.head.insertAdjacentHTML('beforeend',`<style>
#hRes .six{margin:4px 0 3px;--g:#E3E7EC}
.six .ic{display:inline-grid;place-items:center;width:15px;height:15px;color:var(--c)}.six .ic svg{width:100%;height:100%}
.six .lock{color:#9AA5B0}.six .lock .ic{color:#AAB4BE}
.six .st{color:#E0A33A;font-size:.7em;margin-right:1px}.six .ic{position:relative}.six .ic .st{position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:8px;line-height:1;margin:0;letter-spacing:-1px;white-space:nowrap}
.six .pu{animation:sixUp 1.4s ease}.six .pd{animation:sixDn 1.4s ease}
@keyframes sixUp{0%,100%{background:transparent}25%{background:rgba(78,154,71,.22)}}
@keyframes sixDn{0%,100%{background:transparent}25%{background:rgba(208,87,87,.22)}}
.six .si{border-radius:6px}
.sA{display:grid;grid-template-columns:1fr 1fr;gap:3px 12px}
.sA .si{display:grid;grid-template-columns:15px 3.1em minmax(0,1fr) auto;align-items:center;gap:4px;font-size:.72rem;font-weight:700;color:#33404C;padding:0 2px}
.sA .bt{height:6px;border-radius:9px;background:var(--g);overflow:hidden}.sA .bt i{display:block;height:100%;background:var(--c);border-radius:9px;transition:width .6s}
.sA .mt{font-size:.66rem;font-weight:700;color:#5A6A78;white-space:nowrap}.sA .mt.neg{color:#C0392B}
.sA .lk{font-size:.66rem;font-weight:600;color:#9AA5B0}
.sB{display:flex;align-items:center;gap:8px}.sB .jw,.sC .jw,.sD .jw{display:flex;flex-direction:column;align-items:center;font-size:.6rem;font-weight:700;color:#5A6A78;gap:1px}
.sB .rings{display:flex;flex:1;justify-content:space-between;gap:2px}
.sB .si{display:flex;flex-direction:column;align-items:center;gap:1px;font-size:.62rem;font-weight:700;color:#33404C;padding:1px 2px}
.sB .rg{position:relative;width:30px;height:30px}.sB .rg svg.r{position:absolute;inset:0;transform:rotate(-90deg)}.sB .rg .ic{position:absolute;inset:7.5px}
.sC{display:flex;align-items:center;gap:6px}.sC svg.hx{width:76px;height:70px;flex:none}
.sC .lg{display:grid;grid-template-columns:1fr 1fr;gap:1px 8px;flex:1;min-width:0}
.sC .si{display:flex;align-items:center;gap:3px;font-size:.68rem;font-weight:700;color:#33404C;padding:0 2px;white-space:nowrap}.sC .si .ic{width:13px;height:13px}
.sC .d{font-size:.6rem;font-weight:800}.six .d.up{color:#3A8A3A}.six .d.dn{color:#C0392B}
.sD{display:flex;align-items:center;gap:8px}.sD .lg{display:grid;grid-template-columns:1fr 1fr;gap:2px 10px;flex:1}
.sD .si{display:grid;grid-template-columns:15px 3.1em auto;align-items:center;gap:4px;font-size:.72rem;font-weight:700;color:#33404C;padding:0 2px}
.sD .dots{display:flex;gap:3px}.sD .dots i{width:8px;height:8px;border-radius:50%;background:var(--g)}.sD .dots i.on{background:var(--c)}.sD .dots i.half{background:linear-gradient(90deg,var(--c) 50%,var(--g) 50%)}
@media (max-height:460px){
  .sA{grid-template-columns:1fr 1fr 1fr;gap:2px 8px}.sA .si{grid-template-columns:13px 2.5em minmax(0,1fr);font-size:.64rem;gap:3px}.sA .si .mt{display:none}.six .ic{width:13px;height:13px}
  .sB .rg{width:25px;height:25px}.sB .rg .ic{inset:6px}.sB .si{font-size:.56rem}
  .sC svg.hx{width:58px;height:54px}.sC .lg{grid-template-columns:1fr 1fr 1fr}.sC .si{font-size:.6rem}
  .sD{gap:5px}.sD .lg{grid-template-columns:1fr 1fr 1fr;gap:2px 5px}.sD .si{grid-template-columns:12px 2.3em auto;font-size:.58rem;gap:2px}.sD .dots i{width:5px;height:5px}.sD .dots{gap:2px}.sD .si>span:nth-child(2){display:none}.sD .si{grid-template-columns:12px auto}.sD .si.lock{grid-template-columns:12px auto}.sA .si.lock span:nth-child(2){display:none}.sA .si.lock{grid-template-columns:13px auto}
}
/* 열리는 안내 */
#sixU{position:absolute;inset:0;z-index:45;display:grid;place-items:center;background:rgba(11,19,30,.55);padding:16px}#sixU[hidden]{display:none}
#sixU .cd{background:linear-gradient(180deg,#13203A 0%,#1C2C44 100%);color:#F0F4F8;border-radius:18px;padding:22px 26px 20px;max-width:min(31rem,94%);max-height:94%;overflow:auto;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.5),inset 0 0 0 1px rgba(255,255,255,.08);animation:sixIn .7s cubic-bezier(.22,1,.36,1)}
@keyframes sixIn{from{opacity:0;transform:translateY(14px) scale(.97)}}
#sixU .bi{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;margin:0 auto 10px;background:var(--c);box-shadow:0 0 0 6px rgba(255,255,255,.07),0 0 30px var(--c)}#sixU .bi svg{width:36px;height:36px;color:#fff}
#sixU .lb{font-size:.82rem;color:#FFC9A8;font-weight:700;letter-spacing:.06em}#sixU h2{margin:.15rem 0 .6rem;font-size:1.6rem}
#sixU p{margin:.35rem 0;line-height:1.6;color:#DCE4EC;text-wrap:balance}#sixU .wh{font-size:.9rem;color:#AFC0CD;background:rgba(255,255,255,.06);border-radius:10px;padding:.5rem .8rem;margin-top:.7rem}
#sixU .wh b{color:#FFC9A8}#sixU button{margin-top:14px;min-width:9rem}
@media (max-height:460px){#sixU .cd{padding:12px 18px}#sixU .bi{width:46px;height:46px;margin-bottom:4px}#sixU .bi svg{width:26px;height:26px}#sixU h2{font-size:1.25rem;margin:0 0 .3rem}#sixU p{margin:.2rem 0;font-size:.92rem;line-height:1.45}#sixU .wh{margin-top:.4rem;padding:.35rem .6rem;font-size:.82rem}#sixU button{margin-top:8px}}
/* 삶을 시작하기 전에 */
#s-vow{position:fixed;inset:0;z-index:150;overflow:auto;color:#F0F4F8;background:radial-gradient(ellipse at 50% 0%,rgba(56,112,208,.22) 0%,transparent 65%),radial-gradient(ellipse at 85% 90%,rgba(226,112,58,.14) 0%,transparent 55%),linear-gradient(180deg,#0B131E 0%,#131F2E 55%,#192738 100%)}
#s-vow[hidden]{display:none}#s-vow canvas{position:fixed;inset:0;pointer-events:none}
#s-vow .in{position:relative;max-width:min(64rem,96vw);margin:0 auto;min-height:100dvh;box-sizing:border-box;padding:clamp(12px,3vh,30px) max(24px,env(safe-area-inset-right,0px)) clamp(12px,3vh,28px) max(24px,env(safe-area-inset-left,0px));display:flex;flex-direction:column;gap:clamp(8px,2vh,18px)}
#s-vow .pg{height:3px;border-radius:9px;background:rgba(255,255,255,.12)}#s-vow .pg i{display:block;height:100%;border-radius:9px;background:#FFC9A8;transition:width .6s}
#s-vow .hd{display:flex;justify-content:space-between;font-size:.88rem;color:#FFC9A8;font-weight:700}#s-vow .hd span:last-child{color:#AFC0CD;font-weight:500}
#s-vow .bd{flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(8px,2.2vh,20px);animation:slowReveal 1.1s cubic-bezier(.22,1,.36,1)}
#s-vow .big{font-size:clamp(1.25rem,3.2vw,1.9rem);font-weight:700;line-height:1.45;text-wrap:balance;margin:0}
#s-vow .soft{color:#C3D0DC;line-height:1.7;margin:0;max-width:44rem;text-wrap:pretty}
#s-vow .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1.6vh,14px)}
#s-vow .cards button{all:unset;box-sizing:border-box;cursor:pointer;border:1.5px solid rgba(255,255,255,.26);border-radius:14px;padding:clamp(10px,2.2vh,20px) 16px;font-size:clamp(.92rem,1.6vw,1.06rem);line-height:1.5;color:#EEF3F6;background:rgba(255,255,255,.04);transition:background .25s,border-color .25s,transform .25s;text-wrap:balance}
#s-vow .cards button:hover,#s-vow .cards button:focus-visible{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.5)}
#s-vow .cards button.on{border-color:#FFC9A8;background:rgba(255,201,168,.16);transform:translateY(-2px)}
#s-vow .ft{display:flex;justify-content:space-between;gap:10px}#s-vow .btn{background:transparent;color:#fff;border-color:#6B7E8D}#s-vow .btn.primary{background:var(--fox);border-color:var(--fox)}#s-vow .btn[disabled]{opacity:.35}
#s-vow .vals{display:flex;flex-wrap:wrap;gap:8px}#s-vow .vals>span{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.08);font-weight:700}#s-vow .vals .ic{width:18px;height:18px;color:var(--c);display:inline-grid}#s-vow .vals .ic svg{width:100%;height:100%}#s-vow .vals b{color:#FFC9A8;letter-spacing:.1em}
@media (max-height:460px){#s-vow .cards button{padding:7px 12px;font-size:.88rem}#s-vow .big{font-size:1.15rem}#s-vow .soft{font-size:.9rem;line-height:1.5}}
@media (max-width:560px){#s-vow .cards{grid-template-columns:1fr 1fr}}
/* 내 정보 */
.sixw{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:14px;align-items:center}@media (max-width:640px){.sixw{grid-template-columns:1fr}}
.sixc{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sixc>div{border-radius:12px;padding:8px 10px;background:rgba(127,140,150,.1);display:flex;flex-direction:column;gap:3px;border-left:4px solid var(--c)}
.sixc .t1{display:flex;align-items:center;gap:6px;font-weight:800}.sixc .t1 .ic{width:18px;height:18px;color:var(--c);display:inline-grid}.sixc .t1 b{margin-left:auto;font-size:1.1rem}
.sixc .t2{font-size:.8rem;color:#5A6A78;line-height:1.4}.sixc .lockd{opacity:.55;border-left-color:#AAB4BE}
.sixl{display:flex;flex-direction:column;gap:9px}.sixl .rw{display:grid;grid-template-columns:22px 5.4em minmax(0,1fr) 2.6em;gap:8px;align-items:center}.sixl .rw .ic{width:20px;height:20px;color:var(--c);display:inline-grid}
.sixl .rw .bt{height:10px;border-radius:9px;background:#E3E7EC;overflow:hidden}.sixl .rw .bt i{display:block;height:100%;background:var(--c)}.sixl .rw b{text-align:right}.sixl .tip{grid-column:2/-1;font-size:.8rem;color:#5A6A78;margin-top:-5px}
.vstar{color:#E0A33A}
.jtop{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.jbig{display:flex;flex-direction:column;gap:2px}.jbig b{font-size:2.2rem;line-height:1;font-variant-numeric:tabular-nums}.jbig span{font-weight:700;color:#5A6A78}
.jbig em{font-style:normal;font-weight:800}.jbig em.up{color:#3A8A3A}.jbig em.dn{color:#C0392B}.jbig small{font-weight:500}
.jspw{flex:1;min-width:180px}.jsp{width:100%;height:auto;display:block}.jsp .jt{font-size:9px;fill:#7C8A96}
.jstack{display:flex;height:16px;border-radius:9px;overflow:hidden;background:#E3E7EC;margin:4px 0 6px}.jstack i{display:block;height:100%;transition:width .6s}
.jlg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:.8rem;color:#5A6A78}.jlg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.jhint{margin:.6rem 0 .2rem;padding:.5rem .8rem;border-radius:10px;background:rgba(224,163,58,.12);line-height:1.5}
.jrows{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:8px}@media (max-width:640px){.jrows{grid-template-columns:1fr}}
.jrw{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:center}.jrw.off{opacity:.55}
.jr{position:relative;display:inline-block}.jr svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.jr .ic{position:absolute;inset:25%;color:var(--c);display:grid}.jr .ic svg{position:static;transform:none}
.jn{display:flex;flex-direction:column;gap:1px;min-width:0}.jn>span{font-size:.78rem;color:#5A6A78;line-height:1.35}
.js{font-size:.78rem;font-weight:800;padding:2px 8px;border-radius:999px;white-space:nowrap}.js.ok{background:#E5F3EA;color:#2F7A4F}.js.mid{background:#F3EFE6;color:#7A6A3A}.js.low{background:#FBE7E4;color:#B0402E}
.jvals{display:flex;flex-wrap:wrap;gap:8px}.jvals>span{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:rgba(127,140,150,.12);font-weight:700}.jvals .ic{width:18px;height:18px;color:var(--c);display:inline-grid}.jvals .ic svg{width:100%;height:100%}
</style>`);

/* ---------- 1) 위쪽 표시 ---------- */
const sixHudV=()=>{ const v=ls('life8b_sixhud'); return /^[ABCD]$/.test(v)?v:'B'; };
const sixInfoV=()=>{ const v=ls('life8b_sixinfo'); return /^M[12]$/.test(v)?v:'M1'; };
const SIX_FX={};
function sixState(L){ const v=L.sixNow(), H=(L.hist||[]).filter(x=>x.a<L.age), prev=H.length?H[H.length-1]:null, val=(L.val&&L.val.p)||{};
  return SIX.map(k=>({k,open:L.sixOpen(k),v:clamp(v[k]||0,0,100),d:prev&&prev[k]!=null?Math.round(v[k])-prev[k]:0,star:val[k]||0,at:SIX_AGE[k]})); }
function sixMoneyTxt(L){ const a=L.age, f=L.f; if(!L.sixOpen('m')) return ''; if(a<19&&!(f.job&&!f.school)&&!f.univ){ const pk=typeof pocket==='function'?pocket(L):null; return `<span class="mt" title="모은 용돈">${fmtWon((f.sv||0)+(pk?pk.left:0))}</span>`; }
  return `<span class="mt${L.cash<0?' neg':''}" title="${L.cash<0?'빚':'가진 돈'}">${fmtWon(L.cash)}</span>`; }
const icS=x=>`<span class="ic">${sixIc(x.k)}${x.star?`<span class="st">${'★'.repeat(Math.min(3,x.star))}</span>`:''}</span>`;
const sixStar=x=>x.star?`<span class="st">${'★'.repeat(Math.min(3,x.star))}</span>`:'';
const sixFxCls=k=>{ const z=SIX_FX[k]; return z&&performance.now()<z.u?' '+z.c:''; };
function sixTitle(x){ return x.open?`${SIX_N[x.k]} ${Math.round(x.v)}`:`${SIX_AGE[x.k]}살에 열려요`; }
function sixHud(L){ const S=sixState(L), V=sixHudV(), j=L.s.j||50;
  if(V==='A') return `<div class="six sA">${S.map(x=>x.open?`<div class="si${sixFxCls(x.k)}" style="--c:${SIX_COL[x.k]}" title="${sixTitle(x)}">${icS(x)}<span>${SIX_N[x.k]}</span><div class="bt"><i style="width:${Math.max(2,x.v).toFixed(1)}%"></i></div>${x.k==='m'?sixMoneyTxt(L):''}</div>`
    :`<div class="si lock" title="${sixTitle(x)}"><span class="ic">${sixIc('lock')}</span><span>?</span><span class="lk">${x.at}살에</span></div>`).join('')}</div>`;
  const jw=`<div class="jw">${joyFace(j,V==='B'?30:26)}<span>행복</span></div>`;
  if(V==='B'){ const C=2*Math.PI*12.5; return `<div class="six sB">${jw}<div class="rings">${S.map(x=>`<div class="si${x.open?'':' lock'}${sixFxCls(x.k)}" style="--c:${SIX_COL[x.k]}" title="${sixTitle(x)}"><div class="rg"><svg class="r" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12.5" fill="none" stroke="var(--g)" stroke-width="3.4"/>${x.open?`<circle cx="15" cy="15" r="12.5" fill="none" stroke="var(--c)" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${(C*x.v/100).toFixed(1)} ${C.toFixed(1)}"/>`:''}</svg><span class="ic">${sixIc(x.open?x.k:'lock')}</span></div><span>${x.open?sixStar(x)+SIX_N[x.k]:x.at+'살'}</span></div>`).join('')}</div></div>`; }
  if(V==='C'){ const n=6, cx=40, cy=37, R=31, pt=(i,v)=>{ const an=-Math.PI/2+i*2*Math.PI/n; return [cx+Math.cos(an)*R*v/100,cy+Math.sin(an)*R*v/100]; }, poly=f=>S.map((x,i)=>pt(i,f(x)).map(z=>z.toFixed(1)).join(',')).join(' ');
    let g=`<polygon points="${poly(()=>100)}" fill="rgba(124,149,174,.08)" stroke="#AAB6C2" stroke-width="1"/><polygon points="${poly(()=>50)}" fill="none" stroke="#D8E0E8" stroke-width="1"/>`;
    g+=`<polygon points="${poly(x=>x.open?x.v:0)}" fill="rgba(226,112,58,.22)" stroke="#E2703A" stroke-width="1.8" stroke-linejoin="round"/>`;
    S.forEach((x,i)=>{ const p=pt(i,100); g+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${x.open?SIX_COL[x.k]:'#C4CCD4'}"/>`; });
    return `<div class="six sC">${jw}<svg class="hx" viewBox="0 0 80 74" role="img" aria-label="삶의 모양">${g}</svg><div class="lg">${S.map(x=>x.open?`<div class="si${sixFxCls(x.k)}" style="--c:${SIX_COL[x.k]}" title="${sixTitle(x)}"><span class="ic">${sixIc(x.k)}</span>${sixStar(x)}${SIX_N[x.k]}${x.d?` <span class="d ${x.d>0?'up':'dn'}">${x.d>0?'▲':'▼'}${Math.abs(x.d)}</span>`:''}</div>`:`<div class="si lock" title="${sixTitle(x)}"><span class="ic">${sixIc('lock')}</span>${x.at}살</div>`).join('')}</div></div>`; }
  return `<div class="six sD">${jw}<div class="lg">${S.map(x=>{ if(!x.open) return `<div class="si lock" title="${sixTitle(x)}"><span class="ic">${sixIc('lock')}</span><span>?</span><span class="lk">${x.at}살</span></div>`;
    const q=x.v/20; return `<div class="si${sixFxCls(x.k)}" style="--c:${SIX_COL[x.k]}" title="${sixTitle(x)}">${icS(x)}<span>${SIX_N[x.k]}</span><span class="dots">${[0,1,2,3,4].map(i=>`<i class="${q>=i+.75?'on':q>=i+.3?'half':''}"></i>`).join('')}</span></div>`; }).join('')}</div></div>`; }
(function(){ const _rh=renderHud; renderHud=function(){ const r=_rh.apply(this,arguments); const L=G.life, el=$('hRes'); if(!L||!el) return r;
  try{ const now=performance.now(), last=G._six||{}, cur=L.sixNow(); SIX.forEach(k=>{ if(last[k]!=null&&L.sixOpen(k)&&Math.abs(cur[k]-last[k])>=.35) SIX_FX[k]={c:cur[k]>last[k]?'pu':'pd',u:now+1400}; }); G._six=Object.assign({},cur);
    el.innerHTML=sixHud(L); }catch(e){ console.warn(e); }
  return r; }; })();

/* ---------- 2) 열리는 안내 ---------- */
const SIX_MEET={
  h:L=>['몸이 튼튼해야 무엇이든 할 수 있어요.','뛰어놀고, 잘 먹고, 푹 자면 올라요. 다치거나 아프거나 무리하면 내려가요.','집 안을 걸어 다니며 <b>침대·마당</b>에서 놀아 보세요.'],
  r:L=>['곁에 있는 사람들과 얼마나 가까운지예요.','가족에게 다가가 말을 걸고, 부탁을 들어주면 가까워져요. 오래 찾지 않으면 조금씩 멀어져요.',`<b>${L.ppl&&L.ppl.mom?'엄마':'가족'}</b>나 집에 있는 동물에게 다가가 A를 눌러 보세요.`],
  e:L=>['처음 해 보는 일이 쌓여 경험이 돼요.','처음 만져 보는 물건, 처음 가 보는 곳, 새로운 놀이가 경험을 키워요. 같은 일만 되풀이하면 잘 늘지 않아요.','<b>부엌·소파·텔레비전</b>처럼 아직 안 해 본 것을 찾아보세요.'],
  k:L=>L.f.elem?[`${L.sch&&L.sch.elem||'초등학교'}에 들어갔어요. 이제 지식이 자라요.`,'수업을 듣고, 책을 읽고, 문제를 풀면 올라요. 궁금한 건 선생님께 물어보세요. 오래 쓰지 않으면 조금씩 잊어요.','학교 <b>내 자리</b>와 <b>도서관</b>, 집의 <b>책상</b>에서 해 볼 수 있어요.']
    :['학교에 다니지 못해도 배울 수 있어요.','어른들에게 묻고, 보고 따라 하고, 책을 구해 읽으면 지식이 자라요. 오래 쓰지 않으면 조금씩 잊어요.','동네 <b>어르신</b>이나 집의 <b>책상</b>에서 시작해 보세요.'],
  t:L=>L.f.sec?[`${L.sch&&L.sch.mid||'중학교'}에 들어갔어요. 이제 손에 익은 솜씨, 기술이 보여요.`,'만들고, 고치고, 꾸준히 연습하면 올라요. 나중에 일을 하면 쌓이고, 오래 손을 놓으면 무뎌져요.','집의 <b>책상·부엌·마당</b>, 동네 <b>체육관</b>과 <b>일터</b>를 찾아보세요.']
    :['열세 살, 이제 손에 익은 솜씨가 보여요.','일을 돕고, 만들고, 고치고, 연습하면 올라요. 오래 손을 놓으면 무뎌져요.','집의 <b>부엌·마당</b>이나 동네 <b>밭과 가게</b>에서 일을 거들어 보세요.'],
  m:L=>(L.f.job&&!L.f.school)?['이제 번 돈을 모을 수 있어요.','벌고 남은 돈이 모여 재산이 돼요. 물건을 사거나 큰일이 생기면 줄어요.','동네 <b>가게·시장</b>에서 무엇을 살지, 얼마나 모을지 정해 보세요.']
    :[`이제 해마다 용돈 ${fmtWon(allowYear(L))}을 받아요.`,'쓰고 남은 용돈은 차곡차곡 모여, 어른이 될 때 나의 첫 통장이 돼요. 사고 싶은 것을 사면 그만큼 줄어요.','동네 <b>가게·시장·식당</b>에서 쓸 수 있어요. 아껴 두면 모여요.']};
function sixUEl(){ let d=$('sixU'); if(!d){ d=document.createElement('div'); d.id='sixU'; d.hidden=true; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); ($('s-game')||document.body).appendChild(d); } return d; }
function sixUnlockShow(L,k){ const d=sixUEl(), t=SIX_MEET[k](L); paused=true; IN.jx=IN.jy=0; IN.id=null;
  d.innerHTML=`<div class="cd" style="--c:${SIX_COL[k]}"><div class="bi">${sixIc(k)}</div><div class="lb">새로 알게 된 것</div><h2>${SIX_N[k]}</h2><p>${esc(t[0])}</p><p>${esc(t[1])}</p><p class="wh">${t[2]}</p><button class="btn primary" id="sixUOk">알겠어요</button></div>`;
  d.hidden=false; L.f.unS=L.f.unS||{}; L.f.unS[k]=1; G._six=null; SIX_FX[k]={c:'pu',u:performance.now()+2600};
  const ok=()=>{ d.hidden=true; d.innerHTML=''; paused=false; lastT=performance.now(); renderHud(); persist(); }; $('sixUOk').onclick=ok; $('sixUOk').focus(); }
setInterval(()=>{ try{ const L=G.life, d=$('sixU'); if(!L||!L.f||(d&&!d.hidden)||$('s-game').hidden||!$('sheet').hidden||(typeof dlgOpen==='function'&&dlgOpen())||G.hardPause) return;
  const U=L.f.un||{}, S=L.f.unS||(L.f.unS={}); const k=SIX.find(k=>U[k]!=null&&U[k]===L.age&&!S[k]); if(k) sixUnlockShow(L,k); }catch(e){} },700);
addEventListener('keydown',e=>{ const d=$('sixU'); if(d&&!d.hidden&&(e.key==='Enter'||e.key===' '||e.key==='Escape')){ e.preventDefault(); e.stopImmediatePropagation(); const b=$('sixUOk'); if(b) b.click(); } },true);

/* ---------- 3) 상호작용의 무게 ---------- */
// 한 번에 오르는 몫을 키운다 (말 걸기·만져 보기·문제·미니 게임·사기 모두 tinyGain을 지난다)
const SIX_BOOST={r:3,e:3.2,k:4,t:2.2,h:1.8};
Object.assign(TK_CAP,{B:6,T:7,K:8,Y:8,A:6,O:6});
tinyGain=(old=>function(L,g,why){ const g2={}, Y=tkYear(L); Y.c=Y.c||{};
  for(const k in g){ const v=g[k]; g2[k]=v>0?v*(SIX_BOOST[k]||1):v; if(v>0) Y.c[k]=(Y.c[k]||0)+1; }
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
// 한 해 내내 손을 놓은 것은 해가 바뀔 때 조금 준다 (지금 플레이하는 삶만)
(function(){ const P=Life.prototype, _e=P.endPeriod; P.endPeriod=function(){ const L=this, a=L.age, live=typeof G!=='undefined'&&G.life===L&&!L._auto, Y=live&&L.cur?(L.cur.tk||{}):null, c=(Y&&Y.c)||{};
  const res=_e.apply(this,arguments); if(!live||L.dead||a<2||!res||!Array.isArray(res.entries)) return res;
  const op=k=>L.f.un&&L.f.un[k]!=null&&L.f.un[k]<=a, s=L.s, lost=[];
  if(op('r')&&!c.r&&s.r>22){ for(const k in (L.rel||{})) L.rel[k]=Math.max(0,L.rel[k]-2.5); s.r=L.relAgg(); lost.push(['올해는 가까운 사람들과 이야기를 거의 나누지 못했다.',{r:-2}]); }
  if(op('h')&&a>=5&&!c.h&&s.h>30){ s.h=Math.max(30,s.h-1.5); lost.push(['올해는 몸을 별로 움직이지 않았다.',{h:-2}]); }
  if(op('k')&&!c.k&&s.k>sixExp('k',a)*.65){ s.k=Math.max(sixExp('k',a)*.65,s.k-1.5); lost.push(['올해는 책도 문제도 거의 펼치지 않았다.',{k:-2}]); }
  if(op('t')&&!c.t&&s.t>sixExp('t',a)*.65){ s.t=Math.max(sixExp('t',a)*.65,s.t-1.2); lost.push(['올해는 손으로 무언가를 만들거나 연습하지 않았다.',{t:-1}]); }
  if(op('e')&&!c.e&&s.e>sixExp('e',a)*.75){ s.e=Math.max(sixExp('e',a)*.75,s.e-.8); lost.push(['올해는 새로 해 본 일이 별로 없었다.',{e:-1}]); }
  lost.forEach(([t,fx])=>res.entries.push({t,fx,big:0}));
  try{ const H=L.hist[L.hist.length-1]; if(H&&H.a===a) SIX.forEach(k=>{ if(k!=='m'&&s[k]!=null) H[k]=Math.round(s[k]); }); }catch(e){}
  return res; }; })();

/* ---------- 4) 고등학생 용돈 ---------- */
pocket=(old=>function(L){ if(L.age>=16&&L.age<19){ const y=L.age, P=L.f.pk; if(!P||P.y!==y) L.f.pk={y,left:allowYear(L)}; return L.f.pk; } return old(L); })(pocket);

/* ---------- 5) 삶을 시작하기 전에: 소중한 것 ---------- */
const VOW_Q=[
  ['먼 훗날 삶을 돌아볼 때, 무엇이 있으면 "잘 살았다"고 느낄까요?',{h:'아프지 않고 튼튼하게 오래 산 것',r:'곁에 마음을 나눌 사람들이 있었던 것',e:'가 보지 못한 곳, 해 보지 못한 일이 별로 없는 것',k:'세상을 많이 알고 깊이 생각해 본 것',t:'누구보다 잘하는 나만의 솜씨가 있었던 것',m:'돈 걱정 없이 넉넉하게 산 것'}],
  ['몹시 힘든 날, 가장 큰 힘이 되어 줄 것은 무엇일까요?',{h:'푹 자고 일어난 가뿐한 몸',r:'내 이야기를 끝까지 들어 주는 사람',e:'훌쩍 떠나 처음 보는 풍경',k:'책과 배움 속에서 찾은 답',t:'손에 익은 일에 몰두하는 시간',m:'넉넉하게 모아 둔 돈'}],
  ['어른이 된 나에게 딱 하나만 선물할 수 있다면?',{h:'건강한 몸',r:'언제든 기댈 수 있는 사람들',e:'세상 곳곳을 겪어 본 기억',k:'넓고 깊은 앎',t:'무엇이든 해내는 솜씨',m:'넉넉한 돈'}]];
const VOW_LIFE={h:'튼튼한 몸으로 오래 걷는 삶',r:'곁의 사람들과 마음을 나누는 삶',e:'새로운 곳과 새로운 일을 겪어 보는 삶',k:'세상을 알고 깊이 생각하는 삶',t:'나만의 솜씨로 무언가를 해내는 삶',m:'걱정 없이 넉넉한 삶'};
const VOW={st:0,a:[],ord:[],done:null};
function vowEl(){ let s=$('s-vow'); if(s) return s; s=document.createElement('section'); s.id='s-vow'; s.hidden=true; s.innerHTML='<canvas aria-hidden="true"></canvas><div class="in"></div>'; document.body.appendChild(s);
  addEventListener('resize',()=>{ if(!s.hidden) vowStars(); }); return s; }
function vowStars(){ const cv=$('s-vow').querySelector('canvas'), w=innerWidth, h=innerHeight; cv.width=w; cv.height=h; const c=cv.getContext('2d'); const n=Math.round(Math.min(130,Math.max(60,w*h/9000)));
  for(let i=0;i<n;i++){ c.beginPath(); c.arc(Math.random()*w,Math.random()*h,Math.random()*1.5+.4,0,6.2832); c.fillStyle=`rgba(255,228,205,${(Math.random()*.7+.15).toFixed(2)})`; c.fill(); } }
function vowOpen(done){ const s=vowEl(); VOW.st=0; VOW.a=[]; VOW.done=done; VOW.ord=VOW_Q.map(()=>SIX.slice().sort(()=>Math.random()-.5)); s.hidden=false; vowStars(); vowDraw(); }
function vowPicks(){ const p={}; VOW.a.forEach(k=>{ if(k) p[k]=(p[k]||0)+1; }); return p; }
function vowDraw(){ const s=$('s-vow'), box=s.querySelector('.in'), st=VOW.st, N=VOW_Q.length, tot=N+2;
  const head=lab=>`<div class="pg"><i style="width:${Math.round((st+1)/tot*100)}%"></i></div><div class="hd"><span>${lab}</span><span>${st+1} / ${tot}</span></div>`;
  if(st===0){ box.innerHTML=`${head('삶을 시작하기 전에')}<div class="bd"><p class="big">곧 지구 어딘가에서 한 아이가 태어납니다. 그 아이가 바로 당신입니다.</p>
      <p class="soft">어느 나라, 어떤 집에서 태어날지는 아무도 고를 수 없습니다. 하지만 무엇을 소중히 여기며 살지는 지금 정할 수 있습니다.</p>
      <p class="soft">세 가지 질문에 마음 가는 대로 답해 주세요. 정답은 없습니다.</p></div><div class="ft"><span></span><button class="btn primary" id="vNext">시작하기 →</button></div>`; }
  else if(st<=N){ const q=VOW_Q[st-1], cur=VOW.a[st-1];
    box.innerHTML=`${head('소중한 것 · 질문 '+st)}<div class="bd"><p class="big">${esc(q[0])}</p><div class="cards" role="radiogroup">${VOW.ord[st-1].map(k=>`<button type="button" role="radio" aria-checked="${cur===k}" data-k="${k}" class="${cur===k?'on':''}">${esc(q[1][k])}</button>`).join('')}</div></div>
      <div class="ft"><button class="btn" id="vPrev">← 이전</button><button class="btn primary" id="vNext" ${cur?'':'disabled'}>다음 →</button></div>`;
    box.querySelector('.cards').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; VOW.a[st-1]=b.dataset.k; box.querySelectorAll('.cards button').forEach(x=>{ x.classList.toggle('on',x===b); x.setAttribute('aria-checked',x===b); }); $('vNext').disabled=false; clearTimeout(VOW.tm); VOW.tm=setTimeout(()=>{ if(VOW.st===st&&VOW.a[st-1]){ VOW.st++; vowDraw(); } },700); }; }
  else { const p=vowPicks(), ks=SIX.filter(k=>p[k]).sort((x,y)=>p[y]-p[x]), top=ks[0], even=ks.length===3;
    box.innerHTML=`${head('당신이 소중히 여기는 것')}<div class="bd"><p class="soft">당신은</p><p class="big">${even?'여러 가지를 고루 아끼는 삶':esc(VOW_LIFE[top])}을 바라고 있습니다.</p>
      <div class="vals">${ks.map(k=>`<span style="--c:${SIX_COL[k]}"><span class="ic">${sixIc(k)}</span>${SIX_N[k]} <b>${'★'.repeat(p[k])}</b></span>`).join('')}</div>
      <p class="soft">이 마음을 안고 태어납니다. 살다 보면 생각이 달라질 수도 있어요. 삶의 마지막에, 무엇이 정말 소중했는지 다시 돌아보게 될 거예요.</p></div>
      <div class="ft"><button class="btn" id="vPrev">← 다시 고르기</button><button class="btn primary" id="vNext">태어나기 →</button></div>`; }
  const pv=$('vPrev'); if(pv) pv.onclick=()=>{ clearTimeout(VOW.tm); VOW.st=st>N?1:Math.max(0,st-1); if(st>N) VOW.a=[]; vowDraw(); };
  $('vNext').onclick=()=>{ clearTimeout(VOW.tm); if(st>N){ s.hidden=true; const f=VOW.done; VOW.done=null; if(f) f({p:vowPicks(),a:VOW.a.slice(),t:Date.now()}); return; } VOW.st++; vowDraw(); };
  const fb=box.querySelector('.cards button.on')||box.querySelector('.cards button')||$('vNext'); if(fb) fb.focus({preventScroll:true}); }
// 삶을 시작할 때마다 먼저 묻는다
birth=(old=>function(o){ vowOpen(v=>{ old(o); if(G.life) G.life.val=v; }); })(birth);

/* ---------- 6) 내 정보 ---------- */
const SIX_TIP={h:'뛰어놀기·운동·쉬기로 올라요. 다치고 아프면 내려가요.',r:'말 걸기·부탁 들어주기로 가까워져요. 오래 안 찾으면 멀어져요.',e:'처음 해 보는 일·처음 가는 곳에서 늘어요.',k:'수업·책·문제 풀기로 올라요. 안 쓰면 조금 잊어요.',t:'만들기·고치기·연습·일로 늘어요. 손을 놓으면 무뎌져요.',m:'모으면 늘고, 사고 쓰면 줄어요.'};
function sixInfoBody(L,tab){ const S=sixState(L), a=L.age, V=sixInfoV(), j=Math.round(L.s.j||0);
  if(tab==='shape'){ const v={}; S.forEach(x=>v[x.k]=x.open?x.v:0); const ov=radarOverlays(L,a).map(o=>({a:o.a,v:Object.assign({},o.v)}));
    const card=x=>x.open?`<div style="--c:${SIX_COL[x.k]}"><div class="t1"><span class="ic">${sixIc(x.k)}</span>${SIX_N[x.k]}${x.star?` <span class="vstar">${'★'.repeat(x.star)}</span>`:''}<b>${Math.round(x.v)}</b></div><div class="t2">${x.d?`<span class="d ${x.d>0?'up':'dn'}" style="color:${x.d>0?'#3A8A3A':'#C0392B'};font-weight:800">${x.d>0?'▲':'▼'}${Math.abs(x.d)}</span> · `:''}${SIX_TIP[x.k]}${x.k==='m'?' '+sixMoneyTxt(L).replace(/<[^>]+>/g,''):''}</div></div>`
      :`<div class="lockd" style="--c:#AAB4BE"><div class="t1"><span class="ic">${sixIc('lock')}</span>?<b></b></div><div class="t2">${x.at}살에 알게 돼요</div></div>`;
    const row=x=>x.open?`<div class="rw" style="--c:${SIX_COL[x.k]}"><span class="ic">${sixIc(x.k)}</span><span>${SIX_N[x.k]}${x.star?` <span class="vstar">${'★'.repeat(x.star)}</span>`:''}</span><div class="bt"><i style="width:${x.v.toFixed(1)}%"></i></div><b>${Math.round(x.v)}${x.d?`<small style="color:${x.d>0?'#3A8A3A':'#C0392B'}">${x.d>0?'▲':'▼'}${Math.abs(x.d)}</small>`:''}</b><span class="tip">${SIX_TIP[x.k]}</span></div>`
      :`<div class="rw" style="--c:#AAB4BE;opacity:.55"><span class="ic">${sixIc('lock')}</span><span>?</span><div class="bt"></div><b></b><span class="tip">${x.at}살에 알게 돼요</span></div>`;
    const hx=`${radarSVG(v,ov,{lock:S.filter(x=>!x.open).map(x=>x.k)})}${radarLegend(ov)}`;
    const top=V==='M1'?`<div class="sixw"><div>${hx}</div><div class="sixc">${S.map(card).join('')}</div></div>`:`<div class="sixw"><div class="sixl">${S.map(row).join('')}</div><div>${hx}</div></div>`;
    return `<section class="icard"><h3>삶의 모양 <small>꽉 찬 정육각형이 만점(100) · ★ 내가 소중히 여긴 것</small></h3>${top}</section>
      <section class="icard"><h3>나이에 따라</h3>${lineChartSVG(L)||'<p class="isub">한 해가 지나면 그래프가 생겨요</p>'}</section>`; }
  return sixJoyBody(L,S); }
// '내 행복을 만드는 것': 지금 행복 · 행복을 받쳐 주는 여섯 가지(몫) · 처음에 고른 소중한 것 · 그 밖의 것
function sixRing(k,v,open,sz){ const C=2*Math.PI*12.5; return `<span class="jr" style="--c:${open?SIX_COL[k]:'#AAB4BE'};width:${sz}px;height:${sz}px"><svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12.5" fill="none" stroke="#E3E7EC" stroke-width="3.4"/>${open?`<circle cx="15" cy="15" r="12.5" fill="none" stroke="var(--c)" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${(C*clamp(v,0,100)/100).toFixed(1)} ${C.toFixed(1)}"/>`:''}</svg><span class="ic">${sixIc(open?k:'lock')}</span></span>`; }
function sixJoyBody(L,S){ const j=Math.round(L.s.j||0), a=L.age, H=(L.hist||[]).filter(h=>h.j!=null&&h.a<a), prev=H.length?H[H.length-1]:null, dj=prev?j-prev.j:0;
  const w=L.valW(), c=L.joyComps(), p=(L.val&&L.val.p)||{}, op=S.filter(x=>x.open), lk=S.filter(x=>!x.open);
  // 행복의 흐름(작은 선)
  let spark=''; if(H.length>=2){ const pts=H.concat([{a,j}]), a0=pts[0].a, a1=Math.max(a0+1,a), X=v=>4+(v-a0)/(a1-a0)*232, Y=v=>44-clamp(v,0,100)*.4;
    spark=`<svg class="jsp" viewBox="0 0 240 48" role="img" aria-label="나이에 따른 행복"><line x1="4" x2="236" y1="24" y2="24" stroke="#E3E7EC" stroke-dasharray="3 3"/><polyline fill="none" stroke="#E2703A" stroke-width="2.2" stroke-linejoin="round" points="${pts.map(h=>X(h.a).toFixed(1)+','+Y(h.j).toFixed(1)).join(' ')}"/><circle cx="${X(a).toFixed(1)}" cy="${Y(j).toFixed(1)}" r="3.4" fill="#E2703A"/><text x="4" y="47" class="jt">${a0}살</text><text x="236" y="47" text-anchor="end" class="jt">지금</text></svg>`; }
  const word=j>=72?'아주 행복해요':j>=58?'행복한 편이에요':j>=42?'그럭저럭 지내요':j>=28?'조금 힘들어요':'많이 힘들어요';
  // 몫: 무게 × 값. 아직 모르는 것은 한 칸으로
  const part=k=>w[k]*c[k], tot=SIX.reduce((s,k)=>s+part(k),0)||1, lkS=lk.reduce((s,x)=>s+part(x.k),0);
  const seg=op.map(x=>`<i style="width:${(part(x.k)/tot*100).toFixed(1)}%;background:${SIX_COL[x.k]}" title="${SIX_N[x.k]}"></i>`).join('')+(lkS?`<i style="width:${(lkS/tot*100).toFixed(1)}%;background:#C4CCD4" title="아직 모르는 것"></i>`:'');
  const st=v=>v>=65?['든든해요','ok']:v>=45?['보통이에요','mid']:['부족해요','low'];
  const best=op.slice().sort((x,y)=>part(y.k)-part(x.k))[0], need=op.filter(x=>(x.k!=='m'||a>=16)&&(!best||x.k!==op.slice().sort((p1,p2)=>part(p2.k)-part(p1.k))[0].k)).sort((x,y)=>w[y.k]*(100-c[y.k])-w[x.k]*(100-c[x.k]))[0];
  const rows=op.map(x=>{ const s=st(c[x.k]); return `<div class="jrw">${sixRing(x.k,x.v,1,34)}<div class="jn"><b>${SIX_N[x.k]}${x.star?` <span class="vstar">${'★'.repeat(x.star)}</span>`:''}</b><span>${SIX_TIP[x.k]}</span></div><span class="js ${s[1]}">${s[0]}</span></div>`; }).join('')
    +lk.map(x=>`<div class="jrw off">${sixRing(x.k,0,0,34)}<div class="jn"><b>?</b><span>${x.at}살에 알게 돼요</span></div><span class="js"></span></div>`).join('');
  const ks=SIX.filter(k=>p[k]).sort((x,y)=>p[y]-p[x]), JP=L.joyParts?L.joyParts():null, nm={n:'나라의 형편',c:'함께 웃는 문화'};
  return `<section class="icard"><h3>지금 나의 행복</h3><div class="jtop">${joyFace(j,62)}<div class="jbig"><b>${j}</b><span>${word}${dj?` <em class="${dj>0?'up':'dn'}">${dj>0?'▲':'▼'}${Math.abs(dj)}</em> <small>지난해보다</small>`:''}</span></div>${spark?`<div class="jspw">${spark}</div>`:''}</div></section>
    <section class="icard"><h3>행복을 받쳐 주는 것 <small>지금 행복을 이루는 몫</small></h3><div class="jstack" role="img" aria-label="행복을 이루는 몫">${seg}</div>
      <div class="jlg">${op.map(x=>`<span><i style="background:${SIX_COL[x.k]}"></i>${SIX_N[x.k]}</span>`).join('')}${lkS?'<span><i style="background:#C4CCD4"></i>아직 모르는 것</span>':''}</div>
      ${best&&need&&best.k!==need.k?`<p class="jhint">지금 행복을 가장 많이 받쳐 주는 것은 <b style="color:${SIX_COL[best.k]}">${SIX_N[best.k]}</b>, 채우면 가장 많이 좋아질 것은 <b style="color:${SIX_COL[need.k]}">${SIX_N[need.k]}</b>${need.k==='r'?'예요':'이에요'}.</p>`:''}
      <div class="jrows">${rows}</div><p class="isub">★이 붙은 것은 내 행복에 더 크게 닿아요. 큰 기쁨이나 슬픔은 행복을 한 번에 크게 바꾸기도 해요.</p></section>
    <section class="icard"><h3>삶을 시작할 때 소중하다고 고른 것</h3>${ks.length?`<div class="jvals">${ks.map(k=>`<span style="--c:${SIX_COL[k]}"><span class="ic">${sixIc(k)}</span>${SIX_N[k]} <span class="vstar">${'★'.repeat(p[k])}</span></span>`).join('')}</div>${L.val&&L.val.a&&L.val.a.length?`<p class="isub">"${esc(VOW_Q[0][1][L.val.a[0]]||'')}"을 가장 먼저 골랐어요. 살아 보니 정말 그런지 지켜보세요.</p>`:''}`:'<p class="isub">이 삶은 소중한 것을 고르지 않고 시작했어요. 여섯 가지가 비슷하게 행복에 닿아요.</p>'}</section>
    ${JP?`<section class="icard"><h3>그 밖에 영향을 주는 것</h3>${Object.keys(nm).map(k=>`<div class="happy"><span>${nm[k]}</span><div class="hbar">${barSvg(JP[k]||0)}</div><span class="num">${(JP[k]||0)>=0?'+':''}${(JP[k]||0).toFixed(0)}</span></div>`).join('')}<p class="isub">태어난 나라의 형편과, 곁의 사람들과 함께 웃는 문화도 행복을 바꿉니다.</p></section>`:''}`; }
openInfo=(old=>function(tab){ old(tab); try{ const t=tab||'me'; if(t!=='shape'&&t!=='joy') return; const b=$('sheetBox').querySelector('.ibody'); if(b) b.innerHTML=sixInfoBody(G.life,t); }catch(e){ console.warn(e); } })(openInfo);
// 진로 이야기 대화창의 작은 그림 카드도 육각형으로

/* ---------- 개발자 모드: 시안 고르기 ---------- */
openDev=(old=>function(){ old(); try{ const d=$('devP'), box=d&&d.querySelector('.dbox'); if(!G.tok||!box||box.querySelector('#sixDev')) return;
  const sg=(k,arr,cur)=>`<div class="seg" data-six="${k}">${arr.map(([v,t])=>`<button data-v="${v}" class="${cur===v?'on':''}">${t}</button>`).join('')}</div>`;
  const row=document.createElement('div'); row.id='sixDev'; row.style.cssText='display:flex;flex-direction:column;gap:8px';
  row.innerHTML=`<div class="drow"><label>능력치 표시</label>${sg('life8b_sixhud',[['A','A 막대'],['B','B 동그라미'],['C','C 육각형'],['D','D 점']],sixHudV())}</div>
    <div class="drow"><label>내 정보</label>${sg('life8b_sixinfo',[['M1','육각형+카드'],['M2','막대 목록']],sixInfoV())}<button class="btn" id="vowTry">'소중한 것' 설문 미리 보기</button></div>`;
  const err=$('devErr'); box.insertBefore(row,err); row.querySelectorAll('.seg').forEach(s=>s.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; ls(s.dataset.six,b.dataset.v); [...s.children].forEach(x=>x.classList.toggle('on',x===b)); if(G.life) renderHud(); });
  $('vowTry').onclick=()=>{ d.hidden=true; vowOpen(v=>{ if(G.life){ G.life.val=v; renderHud(); } }); }; }catch(e){ console.warn(e); } })(openDev);
// 개발자 모드로 시작한 삶은 '새로 알게 된 것' 카드를 띄우지 않는다 (시험·확인용)
devStart=(old=>function(){ const r=old.apply(this,arguments); try{ const L=G.life; if(L&&L.f){ L.f.unS=L.f.unS||{}; SIX.forEach(k=>L.f.unS[k]=1); } }catch(e){} return r; })(devStart);
