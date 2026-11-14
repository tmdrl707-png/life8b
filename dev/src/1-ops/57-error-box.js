/* ---------- [1 운영] 오류 알림: 화면에 무엇이 잘못됐는지 보여 주고, 최근 오류를 개발자 모드에서 볼 수 있게 남긴다 ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>#errBox{position:fixed;left:12px;bottom:12px;z-index:400;max-width:min(36rem,92vw);background:#FFF4F2;color:#5A1E18;border:2px solid #C0392B;border-radius:12px;padding:10px 14px;font-size:.85rem;box-shadow:0 10px 26px rgba(0,0,0,.35)}#errBox[hidden]{display:none}#errBox b{display:block;margin-bottom:4px}#errBox code{font-size:.78rem;word-break:break-all;display:block;max-height:6em;overflow:auto}#errBox button{margin-top:6px;font:inherit;font-size:.8rem;padding:3px 10px;border-radius:8px;border:1px solid #C0392B;background:#fff;cursor:pointer}</style>`);
const ERR_SEEN=new Set();
function reportErr(e,where){ try{ const msg=String(e&&e.message||e||'알 수 없는 오류').slice(0,200), at=(e&&e.stack?String(e.stack).split('\n').slice(1,3).join(' ').replace(/\s+/g,' ').slice(0,220):''), key=where+msg;
    if(/Failed to fetch|NetworkError|Load failed|network/i.test(msg)) return; console.error('[80억 분의 1]',where,e);
    const log=ls('life8b_errs')||[]; if(!ERR_SEEN.has(key)){ log.unshift({t:Date.now(),w:where,m:msg,at,scr:[...document.querySelectorAll('section,#s-game,#s-end')].filter(x=>!x.hidden).map(x=>x.id).join(',')}); ls('life8b_errs',log.slice(0,10)); }
    if(ERR_SEEN.has(key)) return; ERR_SEEN.add(key);
    let b=$('errBox'); if(!b){ b=document.createElement('div'); b.id='errBox'; document.body.appendChild(b); }
    b.innerHTML=`<b>화면에 문제가 생겼어요 (${esc(where)}). 게임은 계속 이어집니다.</b>이 상자를 캡처해서 알려 주시면 고칠 수 있어요.<code>${esc(msg)}${at?' · '+esc(at):''}</code><button type="button">닫기</button>`; b.hidden=false; b.querySelector('button').onclick=()=>b.hidden=true; }catch(_){ } }
addEventListener('error',ev=>{ if(ev&&ev.target&&ev.target!==window&&ev.target.tagName) return; reportErr(ev.error||ev.message,'화면'); });
addEventListener('unhandledrejection',ev=>reportErr(ev.reason,'저장·불러오기'));

