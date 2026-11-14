/* ========== 62-six: 여섯 가지 능력치와 행복 (2026-11-14) ==========
   능력치: 건강(h) · 관계(r) · 경험(e) · 지식(k) · 기술(t) · 재산(m). 행복(j)은 이 여섯에서 만들어지는 마지막 값이다.
   - 학생에게 보이는 차례(f.un): 건강 0살 → 관계 2살 → 경험 4살(집 안에서만 지낼 때) → 지식 7살(초등학교) → 기술 13살(중학교) → 재산 16살(고등학교, 처음엔 용돈 모으기).
     보이지 않을 때도 값은 뒤에서 그대로 움직인다. f.un[k]=그 능력치가 열린 나이(예전 저장은 -1), f.unS[k]=안내 카드를 보았음.
   - 재산(m): 0~15살은 집 형편, 16~18살은 모은 용돈(f.sv), 어른은 순자산(월 보통 벌이의 몇 배)과 벌이로 0~100을 매긴다. 돈이 많아질수록 행복에 더하는 몫은 줄어든다.
   - 행복의 목표값: 여섯 값에 무게를 곱해 더한다. 무게는 삶을 시작할 때 고른 '소중한 것'(L.val.p, 0~3번 고름)으로 커진다.
     지식·기술·경험은 그 나이의 보통값(SIX_EXP)과 견주어 매긴다(어린아이가 지식이 낮다고 불행하지 않도록).
   새 필드는 모두 없을 때 기본값으로 채워서, 예전 저장도 그대로 이어진다(Life.load 감싸기). */
const SIX=['h','r','e','k','t','m'];
const SIX_N={h:'건강',r:'관계',e:'경험',k:'지식',t:'기술',m:'재산'};
const SIX_COL={h:'#4E9A47',r:'#D0577F',e:'#2B97B0',k:'#3870D0',t:'#7A5AC8',m:'#C9922A'};
const SIX_AGE={h:0,r:2,e:4,k:7,t:13,m:16};
// 오각형(행복·지식·기술·경험·관계)을 여섯 능력치의 육각형으로 바꾼다 (같은 배열·객체를 고쳐 써서, 이를 쓰는 화면이 모두 따라온다)
AXES.splice(0,AXES.length,...SIX); Object.assign(AX_N,SIX_N); STAT.m='재산';
// 그 나이의 보통값(직접 돌아다니며 고른 삶 기준): [나이, 값] 사이를 곧게 잇는다
const SIX_EXP={k:[[0,5],[7,15],[13,30],[19,45],[30,55],[45,62],[90,58]],t:[[0,0],[10,5],[13,10],[19,25],[30,45],[45,60],[90,55]],e:[[0,3],[7,12],[13,20],[19,28],[30,36],[50,44],[90,48]]};
function sixExp(k,a){ const T=SIX_EXP[k]; if(a<=T[0][0]) return T[0][1]; for(let i=1;i<T.length;i++){ const [a1,v1]=T[i]; if(a<=a1){ const [a0,v0]=T[i-1]; return v0+(v1-v0)*(a-a0)/(a1-a0); } } return T[T.length-1][1]; }
// 소중한 것 → 행복의 무게
const VAL_BASE={h:.20,r:.22,e:.15,k:.12,t:.13,m:.18};
const VAL_PICK=.9;           // 한 번 고를 때마다 그 무게에 더하는 비율
Life.prototype.valW=function(){ const p=(this.val&&this.val.p)||{}, w={}; let s=0; SIX.forEach(k=>{ w[k]=VAL_BASE[k]*(1+VAL_PICK*Math.min(3,p[k]||0)); s+=w[k]; }); SIX.forEach(k=>w[k]/=s); return w; };
// 고등학생 용돈: 한 해에 보통 한 달 벌이의 10~30% (집 형편에 따라)
function allowYear(L){ return L.C.med*(.10+.20*clamp(L.w,0,1)); }
Life.prototype.moneyIdx=function(){ const C=this.C, a=this.age, f=this.f;
  if(a<16&&!f.job) return clamp(this.w*100,3,97);
  if(a<19&&!f.univ&&!(f.job&&!f.school)){ const al=allowYear(this), sv=Math.max(0,(f.sv||0)+(f.pk&&f.pk.y===a?f.pk.left:0)); return clamp(20+36*sv/(al*2.6)+(this.w-.5)*16,4,94); }
  const nwM=(this.cash+this.house)/Math.max(C.med,1e-9); let m=nwM>=0?34+10*Math.log2(1+nwM/6):34-26*Math.min(1,-nwM/24);
  const inc=this.inc||0; if(f.job&&!f.school) m+=clamp(8*Math.log2(Math.max(.1,inc/C.med)),-10,10); else if(f.school) m+=2; else if(!f.retired&&a<65) m-=6;
  m+=clamp((30-a)*1.2,0,13);   // 갓 어른이 된 때는 모은 돈이 없는 것이 보통이다
  return clamp(m,2,98); };
Life.prototype.sixNow=function(){ const s=this.s; s.m=Math.round(this.moneyIdx()*10)/10; return {h:s.h,r:s.r,e:s.e,k:s.k,t:s.t,m:s.m}; };
// 행복의 목표값 (0~100). 돈은 많을수록 덜 보탠다
// 행복에 들어가는 여섯 값(0~100, 그 나이에 견준 값)
Life.prototype.joyComps=function(){ const s=this.s, a=this.age, rel=k=>clamp(55+(s[k]-sixExp(k,a))*1.3,0,100), mi=this.moneyIdx();
  return {h:s.h,r:s.r,e:rel('e'),k:a<7?55:rel('k'),t:a<10?55:clamp(.6*rel('t')+.4*this.workSat(),0,100),m:100*(1-Math.exp(-mi/40))/(1-Math.exp(-2.5))}; };
Life.prototype.joyTarget=function(){ const w=this.valW(), c=this.joyComps(); let v=0; SIX.forEach(k=>v+=w[k]*c[k]); return v-1; };
// 열린 능력치: 이번에 새로 열린 것들을 돌려준다
Life.prototype.unlockCheck=function(){ const f=this.f, U=f.un||(f.un={}), a=this.age, n=[]; SIX.forEach(k=>{ if(U[k]==null&&a>=SIX_AGE[k]){ U[k]=a; n.push(k); } }); return n; };
Life.prototype.sixOpen=function(k){ const U=this.f.un; return !!U&&U[k]!=null; };
(function(){ const P=Life.prototype;
  const _sp=P.startPeriod; P.startPeriod=function(){ const r=_sp.apply(this,arguments); try{ this.unlockCheck(); this.sixNow(); }catch(e){} return r; };
  const _end=P.endPeriod; P.endPeriod=function(){ const a=this.age, f=this.f;
    // 고등학생: 쓰고 남은 용돈은 모은다
    if(a>=16&&a<19){ const al=allowYear(this), left=f.pk&&f.pk.y===a?f.pk.left:al; f.sv=Math.max(0,(f.sv||0)+left); }
    const res=_end.apply(this,arguments);
    // 어른이 되면 모은 용돈이 첫 통장이 된다
    if(a<19&&this.age>=19&&f.sv>0){ this.cash+=f.sv; const t=`모아 둔 용돈 ${fmtWon(f.sv)}이 나의 첫 통장이 되었다.`; f.sv0=f.sv; f.sv=0; if(res&&Array.isArray(res.entries)) res.entries.push({t,fx:null,big:0}); this.remember({a:this.age,t}); }
    try{ this.sixNow(); const H=this.hist[this.hist.length-1]; if(H&&H.a===a) H.m=Math.round(this.s.m); this.unlockCheck(); }catch(e){}
    return res; };
  const _load=Life.load; Life.load=function(o){ const L=_load.call(this,o);
    try{ const f=L.f; if(!f.un){ f.un={}; f.unS={}; SIX.forEach(k=>{ if(L.age>=SIX_AGE[k]){ f.un[k]=-1; f.unS[k]=1; } }); } f.unS=f.unS||{}; L.sixNow(); }catch(e){} return L; };
})();
