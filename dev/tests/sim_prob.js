(()=>{ // 장면마다 선택지 확률이 얼마나 다양한지
const L=new Life({c:'KR'}); L.runAuto(14); const rows=[]; let spread=[],nul=0,tot=0;
SCENES.slice(0,400).forEach(sc=>{ const ps=sc.opts.map(o=>L.optP(o)); tot+=ps.length; nul+=ps.filter(p=>p==null).length; const v=ps.filter(p=>p!=null); if(v.length>=2) spread.push(Math.max(...v)-Math.min(...v)); if(rows.length<12) rows.push(L.tx(Array.isArray(sc.txt)?sc.txt[0]:sc.txt).slice(0,24)+' → '+sc.opts.map((o,i)=>L.tx(o.l).slice(0,10)+' '+(ps[i]==null?'확실':Math.round(ps[i]*100)+'%')).join(' / ')); });
const cs=[]; CAL.slice(0,3000).forEach(ev=>{ if(!ev.opts) return; const v=ev.opts.map(o=>L.calOptP(o)).filter(p=>p!=null); if(v.length>=2) cs.push(Math.max(...v)-Math.min(...v)); });
const avg=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length*100);
return {장면_평균차이:avg(spread), 장면_확실비율:Math.round(nul/tot*100), 달력_평균차이:avg(cs), 예:rows};
})()
