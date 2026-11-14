/* 창을 닫았다 다시 열었을 때(휴대폰이 탭을 되돌릴 때) 바닥·그림이 까맣게 비어 보이는 일을 막는다 (11-14)
   ① 화면이 다시 보이면 바닥 그림·스프라이트 캐시를 비워 새로 그린다 ② 캐시된 바닥이 비어 있으면 다시 그린다
   ③ 그림 파일(spr·tex)이 한 번 못 받아져도 몇 번 더 시도한다 */
(function(){
  const reset=()=>{ try{ worldLayer.k=null; roomLayer.k=null; CACHE.clear(); }catch(e){} };
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) reset(); });
  addEventListener('pageshow',reset);
  const blank=c=>{ try{ if(!c||!c.getContext||!c.width) return false; const x=c.getContext('2d'), w=c.width, h=c.height;
    return [[.5,.5],[.3,.6],[.7,.45],[.5,.8]].every(p=>x.getImageData((p[0]*w)|0,(p[1]*h)|0,1,1).data[3]===0); }catch(e){ return false; } };
  const guard=f=>{ let chk=0; const g=function(){ let c=f.apply(this,arguments); const t=Date.now();
    if(t-chk>1500){ chk=t; if(blank(c)){ g.k=null; c=f.apply(this,arguments); } } return c; }; return g; };
  worldLayer=guard(worldLayer); roomLayer=guard(roomLayer);
  let tries=0; const retry=()=>{ if(ART.ok||tries>=3) return; tries++;
    Promise.all([artLoad('art/spr.webp?v=1114&r='+tries),artLoad('art/tex.webp?r='+tries)]).then(([s,t])=>{ ART.spr=s; ART.tex=t; ART.ok=true; reset(); }).catch(()=>{}); };
  setInterval(retry,6000);
})();
