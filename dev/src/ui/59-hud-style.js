/* ---------- [2-1 세계·화면] 화면 다듬기: 미니맵·상태란 폭을 줄이고 반투명하게, 작은 사건은 오른쪽 위에서 충분히 오래 ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
#mini{width:168px!important;height:124px!important}
@media (min-width:900px) and (min-height:560px){ #mini{width:182px!important;height:134px!important} .hud{max-width:660px!important} }
.hud{max-width:600px!important}
.hud .gbox,#miniRad,#hQuest li,#hMission,#hSick{background:rgba(253,251,245,.74)!important;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}
.hud .gbox{box-shadow:0 4px 14px rgba(0,0,0,.18)!important}
#toasts{left:auto!important;right:max(12px,env(safe-area-inset-right,0px))!important;transform:none!important;top:calc(12px + env(safe-area-inset-top,0px))!important;width:min(31vw,25rem)!important;gap:8px!important;z-index:12!important}
#toasts .toast{position:relative;overflow:hidden;font-size:1rem;line-height:1.55;padding:10px 14px 13px;border-radius:12px;background:rgba(255,253,246,.95);box-shadow:0 8px 22px rgba(0,0,0,.28);animation:tin .35s ease-out}
#toasts .toast.year{background:rgba(30,40,50,.92);color:#fff;font-size:1.06rem}
#toasts .toast::after{content:'';position:absolute;left:0;bottom:0;height:3px;width:100%;background:#E2703A;opacity:.85;animation:tbar var(--dur,8s) linear forwards}
#toasts .toast.out{opacity:0;transform:translateX(30px);transition:opacity .4s,transform .4s}
@keyframes tin{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes tbar{from{width:100%}to{width:0}}
@media (max-height:460px){ #toasts{width:min(36vw,20rem)!important} #toasts .toast{font-size:.86rem;padding:7px 10px 9px} #mini{width:120px!important;height:88px!important} }
.decbar{position:relative;height:26px;border-radius:999px;background:#EEE7D8;overflow:hidden;margin:-4px 0 8px}
.decbar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#9CC9A6,#5FA374);transition:width .25s linear}
.decbar.hot i{background:linear-gradient(90deg,#F2A08A,#D9573C)}
.decbar span{position:relative;display:block;text-align:center;font-size:.84rem;font-weight:700;line-height:26px;color:#283038}
</style>`);

