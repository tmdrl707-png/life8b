/* [2-3 시간·사건 진행] 66-play-fixes.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */
// 5) 고르지 않고 시간이 다 되면: 가장 소극적인 선택('확실')이 골라진다. 확실한 것이 없으면 잘될 확률이 가장 높은 것(11-13 선생님 결정)
(()=>{ const _da=decAuto; decAuto=function(){ try{ if(DEC.mode==='auto'){ const bs=[...$('sheetBox').querySelectorAll('.opts button:not([disabled])')];
    if(bs.length){ let pick=bs.find(b=>b.querySelector('.sure'))||null;
      if(!pick){ let best=-1; bs.forEach(b=>{ const m=String(b.textContent).match(/(\d+)%/); const v=m?+m[1]:-1; if(v>best){ best=v; pick=b; } }); }
      if(pick){ DEC.on=0; G.autoPicked=1; pick.click(); G.autoPicked=0; toast('한 해가 지나가 저절로 정해졌어요.','news'); return; } } } }catch(e){}
  return _da.apply(this,arguments); }; })();
