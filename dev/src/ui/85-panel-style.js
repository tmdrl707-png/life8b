/* 85-panel-style: '내 정보'(마이페이지)와 '기록'(기억) 창을 게임 화면(오른쪽 위 메뉴·새로 알게 된 것 카드)과 같은 모습으로 다시 꾸민다 (11-14 선생님 요청)
   - 위쪽은 남색 띠(제목·탭), 아래는 따뜻한 종이색 바탕에 둥근 카드. 본문 글씨는 Pretendard(읽기 편한 글씨)로 키우고, 제목만 게임 글씨(Galmuri11).
   - 카드 제목 앞에는 칸마다 다른 색 네모, 기록은 '나이' 머리글로 묶고 고른 길은 알약 모양, 장면 표시는 '▶ 장면 보기'.
   - 내용을 만드는 코드(openInfo·openMem)는 그대로 두고 CSS와 기록 묶기만 더한다. 휴대폰 가로(높이 480px 이하)는 따로 줄여 맞춘다. */
(function(){
  const st=document.createElement('style'); st.textContent=`
#sheet:has(.box.info),#sheet:has(.box.mem){background:rgba(10,14,22,.58);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
#sheet .box.info,#sheet .box.mem{--pp:#FBF7EE;--pl:#EADFC8;--pk:#2A2F3A;--pm:#7B6F58;padding:0!important;gap:0!important;border:0!important;border-radius:20px!important;background:var(--pp)!important;color:var(--pk);
  box-shadow:0 22px 60px rgba(0,0,0,.55),0 0 0 3px #1B2436,0 0 0 5px rgba(255,255,255,.55)!important;width:min(94vw,46rem)!important;max-height:92%!important;overflow:auto;display:flex;flex-direction:column;font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;font-size:1.02rem;scrollbar-width:thin}
#sheet .box.info .ihead,#sheet .box.mem .ihead{position:sticky;top:0;margin:0;padding:16px 64px 12px 22px;background:linear-gradient(170deg,#2E3C58 0%,#1B2436 100%);border-bottom:0;box-shadow:0 4px 14px rgba(20,28,44,.28);z-index:4}
#sheet .box.info .ihead .place,#sheet .box.mem .ihead .place{display:inline-block;font-size:.76rem;font-weight:800;letter-spacing:.06em;color:#1B2436;background:#F6C453;border-radius:999px;padding:2px 10px;margin:0}
#sheet .box.info .ihead h2,#sheet .box.mem .ihead h2{margin:8px 0 12px;font-family:"Galmuri11","Pretendard",sans-serif;font-size:1.32rem;line-height:1.35;color:#fff;font-weight:400;letter-spacing:.01em;word-break:keep-all}
#sheet .box.info .itabs,#sheet .box.mem .itabs{gap:8px;padding:0 0 2px}
#sheet .box.info .itabs button,#sheet .box.mem .itabs button{border:1.5px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#D5DDEE;border-radius:999px;padding:8px 15px;font:700 .93rem "Pretendard","Noto Sans KR",sans-serif;min-height:38px;transition:background .15s,color .15s}
#sheet .box.info .itabs button:hover,#sheet .box.mem .itabs button:hover{background:rgba(255,255,255,.18)}
#sheet .box.info .itabs button.on,#sheet .box.mem .itabs button.on{background:#F6C453;border-color:#F6C453;color:#1B2436}
#sheet .box.info .xclose,#sheet .box.mem .xclose{position:sticky;top:14px;align-self:flex-end;margin:14px 16px -54px 0;width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.7);background:rgba(255,255,255,.14);color:#fff;font-size:17px;box-shadow:none;z-index:6;flex:none}
#sheet .box.info .xclose:hover,#sheet .box.mem .xclose:hover{background:#E5645F;border-color:#fff}
#sheet .box.info .ibody{padding:18px 20px 6px;gap:14px}
#sheet .box.info .icard{--ac:#4C9BFF;background:#fff;border:1.5px solid var(--pl);border-radius:16px;padding:14px 16px 10px;gap:2px;box-shadow:0 2px 0 rgba(120,100,60,.08)}
#sheet .box.info .icard:nth-child(4n+2){--ac:#FFB020}#sheet .box.info .icard:nth-child(4n+3){--ac:#3FBF7F}#sheet .box.info .icard:nth-child(4n){--ac:#E5645F}
#sheet .box.info .icard h3{margin:0 0 6px;font:700 1.08rem "Pretendard","Noto Sans KR",sans-serif;color:var(--pk);align-items:center;gap:9px}
#sheet .box.info .icard h3::before{content:"";flex:none;width:12px;height:12px;border-radius:4px;background:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 25%,transparent)}
#sheet .box.info .icard h3 small{font-size:.8rem;color:var(--pm);font-weight:500}
#sheet .box.info .irow{grid-template-columns:6.8em 1fr;gap:12px;padding:10px 0;border-top:1px solid #F1E9D8;font-size:1.02rem;line-height:1.6}
#sheet .box.info .icard h3+.irow{border-top:0}
#sheet .box.info .irow .ik{color:var(--pm);font-weight:700;font-size:.9rem;padding-top:2px}
#sheet .box.info .irow .iv{color:var(--pk)}
#sheet .box.info .isub{color:var(--pm);font-size:.88rem;line-height:1.55}
#sheet .box.info .ibig{font-size:1.1rem}
#sheet .box.info .pcard{border:1.5px solid #F0E6D0;border-radius:12px;background:#FFFCF5}
#sheet .box.info .jrow{font-size:.98rem;gap:10px}
#sheet .box.info .jrow .rt,#sheet .box.info .rbar .rt{height:12px;border-radius:6px;background:#EFE7D5}
#sheet .box.info .jrow .rt i{background:linear-gradient(90deg,#FFB020,#E2703A);border-radius:6px}
#sheet .box.info .axgrid{gap:8px}
#sheet .box.info .axgrid div{background:#FFFCF5;border:1.5px solid #F0E6D0;border-radius:12px;padding:8px 2px}
#sheet .box.info #btnOk{margin:10px 20px 20px;border-radius:14px;border:0;background:linear-gradient(180deg,#3A4A68,#1B2436);color:#fff;font:800 1rem "Pretendard",sans-serif;min-height:48px;box-shadow:0 4px 0 #0F1624}
#sheet .box.info #btnOk:active{transform:translateY(2px);box-shadow:0 2px 0 #0F1624}
/* 기록 */
#sheet .box.mem>.isub{margin:14px 22px 2px;padding:8px 12px;background:#F4ECD8;border-radius:12px;color:var(--pm);font-size:.88rem;line-height:1.55}
#sheet .box.mem .mlist{padding:6px 20px 22px;gap:10px}
#sheet .box.mem .mgrp{position:sticky;top:0;z-index:2;display:flex;align-items:baseline;gap:8px;margin:10px -4px 0;padding:8px 6px 6px;background:linear-gradient(180deg,var(--pp) 70%,rgba(251,247,238,0));font-family:"Galmuri11","Pretendard",sans-serif}
#sheet .box.mem .mgrp b{font-size:1.1rem;color:#fff;background:#2E3C58;border-radius:999px;padding:3px 13px;font-weight:400}
#sheet .box.mem .mgrp span{font-size:.82rem;color:var(--pm);font-family:"Pretendard",sans-serif;font-weight:600}
#sheet .box.mem .mcard{position:relative;grid-template-columns:1fr;gap:0;background:#fff;border:1.5px solid var(--pl);border-left:6px solid #B8C7D8;border-radius:14px;padding:12px 14px;box-shadow:0 2px 0 rgba(120,100,60,.07)}
#sheet .box.mem .mcard.big{border-left-color:#E2703A;background:#FFF7EC}
#sheet .box.mem .mcard.sc:hover{border-color:#E2703A;transform:translateY(-1px)}
#sheet .box.mem .mage{display:none}
#sheet .box.mem .mtx{display:flex;flex-direction:column;gap:6px}
#sheet .box.mem .mtx .mq{color:var(--pm);font-size:.9rem;line-height:1.55;padding-left:10px;border-left:3px solid #E3D8BF}
#sheet .box.mem .mtx .ml{align-self:flex-start;color:#1D4E9E;background:#E4EEFC;border-radius:999px;padding:3px 12px;font-weight:700;font-size:.92rem;line-height:1.45}
#sheet .box.mem .mtx .mr{font-size:1.04rem;line-height:1.65;color:var(--pk);word-break:keep-all}
#sheet .box.mem .mtags{margin-top:2px}
#sheet .box.mem .scmark{background:#2E3C58;border-radius:999px;padding:2px 10px 2px 8px;font-size:.74rem}
#sheet .box.mem .scmark::before{content:"";display:inline-block;margin-right:5px;border:4px solid transparent;border-left:7px solid #F6C453;border-right:0;vertical-align:-1px}
@media (max-height:480px){
  #sheet .box.info,#sheet .box.mem{width:min(96vw,44rem)!important;max-height:95%!important;font-size:.95rem;border-radius:16px!important}
  #sheet .box.info .ihead,#sheet .box.mem .ihead{padding:9px 56px 8px 16px}
  #sheet .box.info .ihead h2,#sheet .box.mem .ihead h2{font-size:1.08rem;margin:5px 0 8px}
  #sheet .box.info .itabs button,#sheet .box.mem .itabs button{padding:5px 12px;font-size:.85rem;min-height:32px}
  #sheet .box.info .xclose,#sheet .box.mem .xclose{width:34px;height:34px;margin:9px 11px -43px 0;top:9px}
  #sheet .box.info .ibody{padding:12px 14px 4px;gap:10px}#sheet .box.info .icard{padding:10px 12px 6px}
  #sheet .box.info .irow{padding:7px 0;font-size:.95rem}#sheet .box.info .irow .ik{font-size:.84rem}
  #sheet .box.info #btnOk{margin:8px 14px 14px;min-height:40px}
  #sheet .box.mem>.isub{margin:10px 14px 0}#sheet .box.mem .mlist{padding:4px 14px 16px;gap:8px}#sheet .box.mem .mcard{padding:9px 11px}
  #sheet .box.mem .mtx .mr{font-size:.97rem}
}
@media (max-width:420px){#sheet .box.info .irow{grid-template-columns:5.4em 1fr}}`;
  document.head.appendChild(st);
  // 기록: 같은 나이의 기억을 '5살 · 2031년' 머리글 아래로 묶는다
  function group(){ const ml=$('sheetBox').querySelector('.mlist'); if(!ml||ml.dataset.g) return; ml.dataset.g='1'; let last=null;
    [...ml.children].forEach(c=>{ const g=c.querySelector&&c.querySelector('.mage'); if(!g) return; const age=g.firstChild?g.firstChild.textContent.trim():'', yr=(g.querySelector('small')||{}).textContent||'';
      if(age!==last){ last=age; const h=document.createElement('div'); h.className='mgrp'; h.innerHTML='<b>'+esc(age)+'</b><span>'+esc(yr)+'</span>'; ml.insertBefore(h,c); } }); }
  const _om=openMem; openMem=function(){ const r=_om.apply(this,arguments); try{ group(); }catch(e){} return r; };
})();
