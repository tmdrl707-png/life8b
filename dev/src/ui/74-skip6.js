/* 74-skip6: (11-14 뒤 선생님 요청으로 '6살로' 단추는 없앴다. 5살로 건너뛰는 단추는 ui/79-tutorial의 `#btnSkip5`.)
   여섯 살이 되었을 때 한 번만: 이제 집 밖으로 나갈 수 있다는 안내. */
(function(){
  { const _bp=beginPeriod; beginPeriod=function(){ const r=_bp.apply(this,arguments); try{ const L=G.life; if(L&&L.age===6&&L.f&&!L.f.g6s){ L.f.g6s=1; toast(L.f.g6?'여섯 살이 되었어요. 집 아래쪽 문으로 나가 동네를 돌아다녀 보세요.':'여섯 살이 되었어요. 이제 집 아래쪽 문으로 나가 동네를 돌아다닐 수 있어요.'); } }catch(e){} return r; }; }
})();
