/* ========== 선택지의 '될 가능성' 2판 (11-13) ==========
   한 장면 안의 선택지들이 늘 비슷한 확률(60%대)로 보이던 것을 바꾼다.
   · 얻는 것이 클수록 어렵고(위험과 보상), 잃을 것이 있는 선택은 조금 쉽다. 말에 '도전·대회·고백' 같은 낱말이 있으면 더 어렵다.
   · 같은 장면 안에서는 선택지끼리 확률 차이가 적어도 0.3쯤 나도록 펼친다(쉬운 길 · 보통 · 어려운 길).
   · 얻는 것이 하나도 없는 선택(쉰다·미룬다)은 '확실'(null) — 늘 그대로 이루어진다.
   · 실제 확률 = 기본 + 그 선택이 쓰는 능력치·성향 + 선택지마다 고유한 난이도(pd). 숫자는 화면 표시와 실제 계산이 같다. */
const RX_RISK=/도전|대회|고백|지원한다|지원해|나선다|뛰어든다|발표|처음으로|혼자서|직접 |밤새|크게|과감|무리|사업|창업|출마|투자|협상|따진다|맞선다/, RX_SAFE=/쉰다|미룬다|그냥|조용히|따른다|지켜본다|기다린다|넘긴다|물어본다|함께 /;
function optGain(o){ let g=0,l=0; for(const k in (o.fx||{})){ const v=o.fx[k]; if(!(k in {j:1,k:1,t:1,e:1,r:1,h:1})) continue; if(v>0) g+=v; else l-=v; } return {g,l}; }
function optRaw(o){ const {g,l}=optGain(o), lab=String(o.l||''); let h=11; for(const c of lab) h=(Math.imul(h,33)+c.charCodeAt(0))>>>0;
  return -g*.045+Math.min(l,8)*.012+(RX_RISK.test(lab)?-.08:0)+(RX_SAFE.test(lab)?.06:0)+((h%1000)/1000-.5)*.12; }
// 한 장면(선택지 묶음)의 난이도를 정한다. 확률이 매겨지는 선택지가 둘 이상이면 서로 넉넉히 벌어지게
function setPd(opts){ if(!opts||!opts.length) return; const live=opts.filter(o=>optGain(o).g>0||o.tr);
  live.forEach(o=>{ o.pd=optRaw(o); }); opts.forEach(o=>{ if(o.pd==null) o.pd=null; });
  if(live.length<2) return; const srt=live.slice().sort((a,b)=>b.pd-a.pd), mx=srt[0].pd, mn=srt[srt.length-1].pd, mid=(mx+mn)/2, want=live.length>=3?.34:.26;
  if(mx-mn<want) srt.forEach((o,i)=>{ o.pd=mid+want/2-want*i/(srt.length-1); }); }
SCENES.forEach(sc=>setPd(sc.opts)); CAL.forEach(ev=>setPd(ev.opts));
(function(){ const P=Life.prototype;
  // 작은 선택(지도 위 '!')
  P.optP=function(o){ const {g}=optGain(o); if(!g&&!o.tr) return null; if(o.pd===undefined) o.pd=optRaw(o);
    const pos=Object.keys(o.fx).filter(k=>o.fx[k]>0&&k in this.s), st=((pos.length?this.s[pos[0]]:this.s.j)+60)/2;
    return clamp(.7+(st-50)/100*.5+Math.min(o.tr?this.tr[o.tr]:0,40)*.004+(o.pd||0),.12,.95); };
  // 달력의 선택: 얻는 것이 있으면 모두 확률이 있다 (예전에는 크게 얻는 선택만)
  P.calOptP=function(o){ let pos=0; for(const k in o.fx) if(o.fx[k]>0&&k in this.s) pos+=o.fx[k]; if(!pos&&!o.tr) return null; return this.optP(o); };
})();
