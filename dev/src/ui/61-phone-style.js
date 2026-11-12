/* ---------- [2-1 세계·화면] 휴대폰 가로(낮은 화면): 글씨·창을 작게, 화면 가운데는 비워 둔다 ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  .hud{max-width:min(54vw,440px)!important}
  #mini{width:104px!important;height:76px!important} #miniWrap::after{font-size:.5rem!important;padding:1px 3px!important;top:5px!important;right:5px!important} #miniWrap span{font-size:.55rem!important}
  #miniRad{width:96px!important}
  #hQuest li{font-size:.62rem;padding:2px 6px}
  #toasts{width:min(29vw,16rem)!important;gap:4px!important;top:calc(6px + env(safe-area-inset-top,0px))!important}
  #toasts .toast{font-size:.7rem;line-height:1.38;padding:5px 8px 7px;border-radius:9px;box-shadow:0 4px 10px rgba(0,0,0,.25)}
  #toasts .toast.year{font-size:.74rem}
  #toasts .toast:nth-last-child(n+3){display:none}
  #toasts .toast .chip,#toasts .toast .mb{font-size:.6rem} #toasts .toast .nt{font-size:.62rem}
  #flash{top:auto!important;bottom:calc(8px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%)!important;animation:none!important;width:min(46vw,22rem)!important;padding:6px 10px!important;border-width:2px!important}
  #flash p{font-size:.76rem!important;line-height:1.4!important;margin:2px 0!important} #flash .place{font-size:.66rem!important} #flash .chip,#flash .tchips span{font-size:.6rem!important}
  #dlg{font-size:.84rem;padding:8px 14px 9px;width:min(560px,calc(100% - 40px));bottom:calc(6px + env(safe-area-inset-bottom,0px))} #dlg .dt{min-height:2.2em} #dlg .dn{font-size:.7rem;top:-13px}
  #dlg .dopts{min-width:9rem;padding:5px} #dlg .dopts button{font-size:.8rem;padding:5px 10px 5px 22px}
  #devBar{top:auto;bottom:calc(6px + env(safe-area-inset-bottom,0px));left:6px;transform:none;padding:3px 5px;gap:3px;max-width:62vw}
  #devBar button{font-size:.64rem;padding:3px 6px} #devBar b{font-size:.62rem}
  #sheet .box{padding:10px 14px!important;gap:6px!important}
  #sheet canvas.scene{max-height:30vh;width:auto!important;max-width:100%;display:block;margin:0 auto}
  #sheet .scene-cap{font-size:.62rem;margin-top:-2px}
  #sheet h2{font-size:1rem!important;line-height:1.4} #sheet .place{font-size:.7rem}
  #sheet .opts button{min-height:34px!important;font-size:.82rem!important;padding:6px 10px!important}
  .decbar{height:20px;margin:-2px 0 4px} .decbar span{font-size:.68rem;line-height:20px}
  #errBox{font-size:.68rem;padding:6px 10px;max-width:60vw}
  .ihead h2{font-size:.95rem} .itabs button{font-size:.76rem;padding:5px 10px}
  .hinfo{font-size:.68rem!important;padding:3px 7px!important} .hl b{font-size:.9rem!important} #hName,.hmon{font-size:.62rem!important}
  .hbtn{font-size:.64rem!important;padding:2px 6px!important;min-height:0!important}
  #miniWrap::after{display:none!important}
  #btnImp,#btnNext{font-size:.68rem!important;padding:5px 9px!important;min-height:0!important}
  #btnAct,#btnCar{font-size:.74rem!important;padding:6px 10px 6px 6px!important}
  #sheet .opts button span.pl{font-size:.6rem!important}
}
</style>`);
// 휴대폰에서는 개발자 막대를 처음부터 접어 둔다
{ const _db=devBar; devBar=function(){ const b=$('devBar'); if(b&&!b.dataset.init){ b.dataset.init=1; if(matchMedia('(max-height:560px)').matches) b.classList.add('mini'); } return _db.apply(this,arguments); }; }

