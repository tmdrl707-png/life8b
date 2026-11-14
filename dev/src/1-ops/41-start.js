/* ========== 시작 ========== */
(async function(){ const d=await Store.resume(); if(d){ G.data=d; openHub(); } })();
const _show=show; show=function(n){ _show(n); if(n==='login') pixLoop('titleCv','title'); };
pixLoop('titleCv','title');
