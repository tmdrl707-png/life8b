/* 83-autoresume: 게임 중에 새로고침(또는 탭이 다시 열림)해도 처음 화면이 아니라 하던 삶으로 바로 돌아온다 (11-14)
   - 삶이 돌아가는 동안 이 탭(sessionStorage)에 '지금 삶 번호'를 적어 둔다.
   - 로그인이 이어진 뒤 처음 열리는 처음 화면에서, 적어 둔 삶이 아직 있으면 바로 이어서 시작한다.
   - '나가기'로 일부러 처음 화면에 나가면 적어 둔 것을 지운다. */
(function(){
  const K='life8b_play';
  const get=()=>{ try{ return sessionStorage.getItem(K); }catch(e){ return null; } };
  const put=v=>{ try{ if(v==null) sessionStorage.removeItem(K); else sessionStorage.setItem(K,v); }catch(e){} };
  setInterval(()=>{ try{ if(G.running&&G.life&&!G.teacher&&!G.dev&&G.data&&Store.sess&&!$('s-game').hidden) put(String((G.data&&G.data.cur)||'1')); }catch(e){} },1000);
  let first=true;
  const _oh=openHub; openHub=function(){ const r=_oh.apply(this,arguments); const f=first; first=false;
    try{ if(!f){ put(null); return r; }
      const id=get(); if(!id||G.teacher||G.dev) return r;
      const d=G.data; if(!d) return r;
      if(d.save&&(d.cur===id||id==='1'||d.cur==null)){ G.life=Life.load(d.save); G.sec=secOf(G.life); startGame(); }
      else if(d.slots&&d.slots[id]&&typeof lvGo==='function') lvGo(id);
      else put(null);
    }catch(e){ put(null); console.warn(e); }
    return r; };
})();
