/* [4 내용(엔진)] 77-move.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */
{ const P=Life.prototype, _sp=P.startPeriod; P.startPeriod=function(){ const r=_sp.apply(this,arguments); try{ resCheck(this); }catch(e){} return r; };
  // 가족이 이사하는 사건 글
  const MOVE=/(우리 집이 이사를 했다|다른 주로 이사를 했다|이사했다\. 아침|가까이로 이사했다|사는 동네로 이사|함께 도시로 옮겼다|높은 곳으로 이사했다|더 (작은|큰) 집으로 이사했다)/;
  const _rem=P.remember; P.remember=function(o){ const r=_rem.apply(this,arguments); try{ const t=o&&o.t; if(t&&MOVE.test(t)&&this.f&&!o.mv){ const x=resOf(this), city=/도시로 옮겼다/.test(t);
      const z=city?3:x.z, k=x.k, i=pickLot(this,z); this.f.res={z,i,k,t:this.age,n:(x.n||0)+1}; if(k==='family') this.f.fh={z,i}; this.f.resMsg='집을 옮겼어요. 지도에서 우리 집 자리가 달라졌어요.'; if(G.life===this) applyRes(this); } }catch(e){} return r; };
  // 혼자·부부가 사는 집에는 부모님·형제가 없다
  const _so=P.spotOK; P.spotOK=function(key){ if(this.f&&this.f.res&&this.f.res.k!=='family'&&(key==='mom'||key==='dad'||key==='gran'||key==='sib')) return false; return _so.apply(this,arguments); }; }
