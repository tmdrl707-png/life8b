/* ========== 고해상도 캐릭터 ==========
   도트 대신 매끈한 선으로 그린다. 그림은 4배 크기(64×96)로 만들어 두고, 화면에는 원래 크기(16×24)로 부드럽게 줄여 그린다.
   몸의 비율은 나이에 따라: 걸음마(2~5살) · 어린이(6~12살) · 어른 · 노인. 걸을 때 팔다리가 엇갈려 흔들린다. */
const HD=4;
function drawSpr(ctx,s,x,y){ const k=s.hi||1; if(k>1){ const sm=ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(s,x,y,s.width/k,s.height/k); ctx.imageSmoothingEnabled=sm; } else ctx.drawImage(s,x,y); }
function sprW(s){ return s.width/(s.hi||1); } function sprH(s){ return s.height/(s.hi||1); }
const PD={tod:{R:4.1,T:3.4,L:1.9,W:5.8},kid:{R:4.25,T:4.4,L:3.0,W:6.1},adult:{R:4.5,T:6,L:5.0,W:7},elder:{R:4.5,T:5.8,L:4.4,W:7.4}};
function personSprite(o){
  const key=['HD',o.dir,o.fr|0,o.blink?1:0,o.st,o.skin,o.hair,o.body,o.pants,o.long?1:0,o.hat||'',o.sty|0,o.half?1:0].join('|');
  if(o.dir===2){ const c=cached(key,16*HD,24*HD,(x)=>{ x.drawImage(flipX(personSprite(Object.assign({},o,{dir:1}))),0,0); }); c.hi=HD; return c; }
  const c=cached(key,16*HD,24*HD,(x)=>{ x.imageSmoothingEnabled=true; x.scale(HD,HD); x.lineJoin='round'; x.lineCap='round'; drawPersonHD(x,o); }); c.hi=HD; return c; }
function drawPersonHD(x,o){
  const sk=o.skin||'#E8B890', skD=shade(sk,.8), hr=o.hair||'#2A1E17', hrD=shade(hr,.62), hrL=shade(hr,1.35), bd=o.body||'#3E7CB8', bdD=shade(bd,.72), bdL=shade(bd,1.18),
    pt=o.pants||'#384868', ptD=shade(pt,.72), sh='#3A2E2E', d=o.dir|0, fr=o.fr|0, st=o.st||'adult', sty=o.sty|0, ink='#2A2230', lw=.42;
  const E=(cx,cy,rx,ry,f,s,rot)=>{ x.beginPath(); x.ellipse(cx,cy,rx,ry,rot||0,0,Math.PI*2); if(f){ x.fillStyle=f; x.fill(); } if(s){ x.strokeStyle=s; x.lineWidth=lw; x.stroke(); } };
  const RR=(X,Y,W,H,r,f,s)=>{ x.beginPath(); x.roundRect(X,Y,W,H,r); if(f){ x.fillStyle=f; x.fill(); } if(s){ x.strokeStyle=s; x.lineWidth=lw; x.stroke(); } };
  const limb=(x0,y0,ang,len,w,f,s)=>{ x.save(); x.translate(x0,y0); x.rotate(ang); RR(-w/2,0,w,len,w/2,f,s); x.restore(); };
  if(st==='baby') return drawBabyHD(x,o,{sk,skD,hr,hrD,bd,bdD,bdL,E,RR,limb,ink});
  const P=PD[st]||PD.adult, half=!!o.half, foot=23.3, legTop=half?23.4:foot-P.L, tTop=legTop-P.T+.6, hcy=tTop-P.R+1.25, cx=8, R=P.R, W2=P.W/2;
  const sw=fr===1?1:fr===2?-1:0, stoop=st==='elder'&&d===1?-.6:0;
  // ---- 긴 머리(뒤)
  if(o.long&&d!==1) RR(cx-R-.1,hcy-.5,2*R+.2,(tTop-hcy)+P.T*.55,1.6,d===3?hr:hrD,shade(hr,.5));
  // ---- 다리와 신발
  if(!half){ const lg=P.L+.5, lw2=st==='adult'||st==='elder'?2.3:2.1;
    if(d===1){ const a1=sw*.38, a2=-sw*.38;
      limb(cx+.2,legTop,a2,lg,lw2,ptD,shade(pt,.5)); limb(cx-.2,legTop,a1,lg,lw2,pt,shade(pt,.5));
      [[cx+.2,a2,shade(sh,.85)],[cx-.2,a1,sh]].forEach(([lx0,an,col])=>{ const fx=lx0-Math.sin(an)*lg, fy=legTop+Math.cos(an)*lg; E(fx-.6,fy,1.55,.85,col,null); });
    } else { const l1=fr===1?.8:0, l2=fr===2?.8:0, gx=st==='tod'?1.15:1.3;
      RR(cx-gx-lw2/2,legTop,lw2,lg-l1,lw2/2,pt,shade(pt,.5)); RR(cx+gx-lw2/2,legTop,lw2,lg-l2,lw2/2,d===3?pt:ptD,shade(pt,.5));
      E(cx-gx-.15,legTop+lg-l1,1.45,.85,sh,null); E(cx+gx+.15,legTop+lg-l2,1.45,.85,sh,null); } }
  // ---- 팔(뒤쪽) · 몸통 · 팔(앞쪽)
  const armL=P.T-.4, aw=1.55;
  if(d===1){ limb(cx+.6,tTop+.9,-sw*.45,armL,aw,bdD,shade(bd,.5)); }
  RR(cx-W2+(d===1?.7:0)+stoop,tTop,P.W-(d===1?1.4:0),P.T,Math.min(2.2,P.W/2.6),bd,shade(bd,.5));
  if(d!==3&&d!==1){ x.beginPath(); x.moveTo(cx-1.2,tTop+.05); x.lineTo(cx,tTop+1.3); x.lineTo(cx+1.2,tTop+.05); x.closePath(); x.fillStyle=skD; x.fill(); }
  RR(cx-W2+(d===1?.7:0)+.5+stoop,tTop+.5,1.1,P.T-1.4,.55,bdL,null);                      // 빛을 받는 쪽
  RR(cx-W2+(d===1?.7:0)+stoop,tTop+P.T-1.1,P.W-(d===1?1.4:0),1.1,.4,ptD,null);            // 허리
  if(d===1){ limb(cx-.2,tTop+.9,sw*.45,armL,aw,bd,shade(bd,.5)); const an=sw*.45; E(cx-.2-Math.sin(an)*armL,tTop+.9+Math.cos(an)*armL,.85,.85,sk,skD); }
  else { const a1=(fr===2?.22:fr===1?-.1:0)+.12, a2=-((fr===1?.22:fr===2?-.1:0)+.12);
    limb(cx-W2+.35,tTop+.9,a1,armL,aw,bd,shade(bd,.5)); limb(cx+W2-.35,tTop+.9,a2,armL,aw,bd,shade(bd,.5));
    E(cx-W2+.35-Math.sin(a1)*armL,tTop+.9+Math.cos(a1)*armL,.85,.85,sk,skD); E(cx+W2-.35-Math.sin(a2)*armL,tTop+.9+Math.cos(a2)*armL,.85,.85,sk,skD); }
  // ---- 머리
  const hx=cx+(d===1?-.3+stoop:0);
  if(d===1) E(hx+R*.55,hcy+.4,.85,1.05,sk,skD);                                          // 귀
  E(hx,hcy,R,R*.98,sk,shade(sk,.55));
  if(d===0){ E(hx-R+.35,hcy+.6,.7,.95,sk,skD); E(hx+R-.35,hcy+.6,.7,.95,sk,skD); E(hx,hcy,R,R*.98,sk,null); }
  // 머리카락
  x.fillStyle=hr; x.strokeStyle=shade(hr,.5); x.lineWidth=lw;
  if(d===3){ E(hx,hcy-.15,R+.15,R*.98+.1,hr,shade(hr,.5)); E(hx-1.2,hcy-R*.45,1.6,.7,hrL,null,-.5); if(sty===2){ E(hx-R+.3,hcy-R+.6,1.3,1.3,hr,shade(hr,.5)); E(hx+R-.3,hcy-R+.6,1.3,1.3,hr,shade(hr,.5)); } }
  else if(d===1){ x.beginPath(); x.moveTo(hx-R*.95,hcy-.2); x.bezierCurveTo(hx-R*1.05,hcy-R*1.25,hx+R*1.25,hcy-R*1.3,hx+R*1.05,hcy+.4); x.lineTo(hx+R*.95,hcy+R*(o.long?1.1:.55)); x.lineTo(hx+R*.25,hcy+.2); x.quadraticCurveTo(hx-.4,hcy-R*.55,hx-R*.95,hcy-.2); x.closePath(); x.fill(); x.stroke();
    E(hx+.4,hcy-R*.55,1.4,.55,hrL,null,-.3); if(sty===2) E(hx+R*.75,hcy-R*.75,1.3,1.3,hr,shade(hr,.5)); if(sty===3) E(hx+.6,hcy-R*.7,R*.85,R*.5,hr,null); }
  else { x.beginPath(); x.moveTo(hx-R-.15,hcy+.9); x.bezierCurveTo(hx-R-.4,hcy-R*1.35,hx+R+.4,hcy-R*1.35,hx+R+.15,hcy+.9);
    if(sty===1){ x.lineTo(hx+R-.5,hcy+1.6); x.quadraticCurveTo(hx+1.2,hcy-R*.55,hx-.2,hcy-R*.45); x.quadraticCurveTo(hx-1.6,hcy-R*.2,hx-R+.4,hcy+1.6); }
    else if(sty===3){ x.lineTo(hx+R-.4,hcy-.2); x.quadraticCurveTo(hx,hcy-R*.75,hx-R+.4,hcy-.2); }
    else { x.lineTo(hx+R-.5,hcy-.1); x.quadraticCurveTo(hx+1.6,hcy-R*.25,hx+.9,hcy-R*.62); x.quadraticCurveTo(hx-.6,hcy-R*.05,hx-R+.6,hcy+.2); }
    x.closePath(); x.fill(); x.stroke();
    if(sty===2){ E(hx-R+.2,hcy-R+.5,1.35,1.35,hr,shade(hr,.5)); E(hx+R-.2,hcy-R+.5,1.35,1.35,hr,shade(hr,.5)); }
    if(sty===3){ [[-R+.4,-R*.5],[-1.6,-R*.95],[1.6,-R*.95],[R-.4,-R*.5]].forEach(([dx,dy])=>E(hx+dx,hcy+dy,1.5,1.3,hr,null)); }
    if(o.long){ RR(hx-R-.3,hcy,1.3,R+1.6,.6,hr,null); RR(hx+R-1,hcy,1.3,R+1.6,.6,hr,null); }
    E(hx-1.4,hcy-R*.62,1.5,.55,hrL,null,-.35); }
  // 얼굴
  if(d===0){ const ey=hcy+.75, ex=R>4.3?1.75:1.6;
    if(o.blink){ x.strokeStyle=ink; x.lineWidth=.5; x.beginPath(); x.moveTo(hx-ex-.5,ey); x.lineTo(hx-ex+.5,ey); x.moveTo(hx+ex-.5,ey); x.lineTo(hx+ex+.5,ey); x.stroke(); }
    else { E(hx-ex,ey,.55,.78,ink,null); E(hx+ex,ey,.55,.78,ink,null); E(hx-ex+.2,ey-.3,.2,.22,'#FFFFFF',null); E(hx+ex+.2,ey-.3,.2,.22,'#FFFFFF',null); }
    x.globalAlpha=.45; E(hx-ex-.9,ey+1.25,.85,.45,'#F07E7E',null); E(hx+ex+.9,ey+1.25,.85,.45,'#F07E7E',null); x.globalAlpha=1;
    x.strokeStyle='#A0504A'; x.lineWidth=.42; x.beginPath(); x.arc(hx,ey+1.2,.6,.25*Math.PI,.75*Math.PI); x.stroke();
    if(st==='elder'){ x.strokeStyle=skD; x.lineWidth=.3; x.beginPath(); x.moveTo(hx-ex-.5,ey-1); x.lineTo(hx-ex+.5,ey-1.1); x.moveTo(hx+ex-.5,ey-1.1); x.lineTo(hx+ex+.5,ey-1); x.stroke(); } }
  else if(d===1){ const ey=hcy+.7, ex=hx-R*.55;
    if(o.blink){ x.strokeStyle=ink; x.lineWidth=.5; x.beginPath(); x.moveTo(ex-.45,ey); x.lineTo(ex+.45,ey); x.stroke(); } else { E(ex,ey,.5,.78,ink,null); E(ex+.18,ey-.3,.18,.2,'#FFFFFF',null); }
    x.globalAlpha=.45; E(ex+.6,ey+1.25,.8,.42,'#F07E7E',null); x.globalAlpha=1;
    x.strokeStyle='#A0504A'; x.lineWidth=.42; x.beginPath(); x.moveTo(hx-R+.55,ey+1.75); x.lineTo(hx-R+1.25,ey+1.85); x.stroke(); }
  if(o.hat){ E(hx,hcy-R*.55,R+1.4,.9,o.hat,shade(o.hat,.5)); RR(hx-R*.75,hcy-R*1.25,R*1.5,R*.75,1.2,o.hat,shade(o.hat,.5)); }
  if(st==='elder'&&!half){ x.strokeStyle='#7A5A3C'; x.lineWidth=.7; x.beginPath(); if(d===1){ x.moveTo(cx-3,tTop+P.T-.5); x.lineTo(cx-3.4,foot+.3); } else if(d===0){ x.moveTo(cx+W2+.9,tTop+P.T-.6); x.lineTo(cx+W2+1.3,foot+.3); x.moveTo(cx+W2+.9,tTop+P.T-.6); x.quadraticCurveTo(cx+W2+.9,tTop+P.T-1.8,cx+W2,tTop+P.T-1.5); } x.stroke(); }
}
function drawBabyHD(x,o,K){ const {sk,skD,hr,hrD,bd,bdD,bdL,E,RR,limb,ink}=K, d=o.dir|0, fr=o.fr|0, a=fr===1?1:-1, dp='#F6F1E8';
  if(d===1){ // 기어 다닌다 (왼쪽을 본다)
    limb(10.5,19.2,-.35*a,3.2,1.7,bdD,shade(bd,.5)); limb(5.6,19.4,.4*a,3.2,1.6,sk,skD);
    E(9.8,18.8,4.3,2.7,bd,shade(bd,.5)); E(12.6,18.6,1.9,2.0,dp,'#C8C0B4'); E(8.6,17.4,2.2,.8,bdL,null);
    limb(11,19.6,.35*a,3.1,1.7,bd,shade(bd,.5)); limb(6.4,19.6,-.4*a,3.0,1.6,sk,skD); E(6.4-Math.sin(-.4*a)*3,22.6,.9,.6,sk,skD);
    E(5.2,15.4,3.6,3.5,sk,shade(sk,.55)); x.fillStyle=hr; x.beginPath(); x.arc(5.6,14.9,3.55,Math.PI*1.05,Math.PI*1.95); x.fill(); E(6.4,12.2,.9,.6,hr,null);
    E(3.1,15.6,.42,.62,ink,null); E(3.25,15.35,.15,.16,'#FFFFFF',null); x.globalAlpha=.45; E(3.6,16.8,.7,.4,'#F07E7E',null); x.globalAlpha=1; E(6.6,15.8,.6,.8,sk,skD); return; }
  // 앉아 있는 아기 (앞·뒤)
  E(8,20.3,4,3,bd,shade(bd,.5)); E(8,21.6,3.2,1.6,dp,'#C8C0B4'); E(5.5,23,1.4,.9,sk,skD); E(10.5,23,1.4,.9,sk,skD);
  limb(4.4,18.4,(a>0?2.2:.5),2.6,1.5,bd,shade(bd,.5)); limb(11.6,18.4,-(a>0?.5:2.2),2.6,1.5,bd,shade(bd,.5));
  E(8,14.2,4.2,4.0,sk,shade(sk,.55)); E(3.9,14.8,.8,1,sk,skD); E(12.1,14.8,.8,1,sk,skD); E(8,14.2,4.2,4,sk,null);
  if(d===3){ x.fillStyle=hr; x.beginPath(); x.arc(8,14.1,4.25,Math.PI,Math.PI*2); x.lineTo(12.2,15.5); x.quadraticCurveTo(8,17,3.8,15.5); x.closePath(); x.fill(); return; }
  x.fillStyle=hr; x.beginPath(); x.arc(8,14,4.15,Math.PI*1.08,Math.PI*1.92); x.quadraticCurveTo(8,11.8,4.2,12.4); x.fill(); E(8.6,10.3,.9,.6,hr,null,.4);
  if(o.blink){ x.strokeStyle=ink; x.lineWidth=.5; x.beginPath(); x.moveTo(5.9,15); x.lineTo(6.9,15); x.moveTo(9.1,15); x.lineTo(10.1,15); x.stroke(); }
  else { E(6.4,15,.55,.75,ink,null); E(9.6,15,.55,.75,ink,null); E(6.6,14.7,.2,.22,'#FFFFFF',null); E(9.8,14.7,.2,.22,'#FFFFFF',null); }
  x.globalAlpha=.5; E(5.2,16.3,.85,.45,'#F07E7E',null); E(10.8,16.3,.85,.45,'#F07E7E',null); x.globalAlpha=1; E(8,16.6,.55,.4,'#C8705A',null); }
// 탈것: 탄 사람까지 고해상도로
function vehicleSprite(kind,face,col,rider){
  const rk=rider?[rider.skin,rider.hair,rider.body,rider.pants||'',rider.st||'',rider.long?1:0,rider.sty|0].join(','):'';
  const key=['VHD',kind,face,col,rk].join('|'), w=kind==='car'?28:kind==='horse'?30:kind==='moto'?28:26, h=kind==='car'?18:kind==='horse'?30:28;
  if(face<0){ const c=cached(key,w*HD,h*HD,(x)=>x.drawImage(flipX(vehicleSprite(kind,1,col,rider)),0,0)); c.hi=HD; return c; }
  const c=cached(key,w*HD,h*HD,(x,cv)=>{ const lo=VEH_LO(kind,col,w,h); x.imageSmoothingEnabled=false; x.drawImage(lo,0,0,w*HD,h*HD);
    if(rider){ const R=Object.assign({pants:'#384868',st:'adult'},rider), st=R.st==='baby'||R.st==='tod'?'kid':R.st, P=PD[st]||PD.adult;
      const seat=kind==='cycle'?[10,17,[16,13],[12,23]]:kind==='moto'?[10,16,[18,12],[14,21]]:[12,14,[21,11],[14,21]], [sx,sy,hand,foot]=seat;
      x.save(); x.scale(HD,HD); x.imageSmoothingEnabled=true; x.lineCap='round';
      x.strokeStyle=R.pants; x.lineWidth=2.1; x.beginPath(); x.moveTo(sx,sy); x.lineTo(sx+2.8,sy+.4); x.lineTo(foot[0],foot[1]-.6); x.stroke();
      x.fillStyle='#3A2E2E'; x.beginPath(); x.ellipse(foot[0]+.4,foot[1],1.5,.8,0,0,Math.PI*2); x.fill();
      const half=personSprite({dir:2,fr:0,st,skin:R.skin,hair:R.hair,body:R.body,pants:R.pants,long:R.long,sty:R.sty|0,half:1}); x.drawImage(half,sx-8,sy-23,16,24);
      x.strokeStyle=shade(R.body,.9); x.lineWidth=1.5; x.beginPath(); x.moveTo(sx+.6,sy-P.T+1.6); x.lineTo(hand[0]-.4,hand[1]+.3); x.stroke();
      x.fillStyle=R.skin; x.beginPath(); x.arc(hand[0],hand[1]+.3,.85,0,Math.PI*2); x.fill(); x.restore(); }
  }); c.hi=HD; return c; }
// 탈것 몸체(도트) — 사람 없이
function VEH_LO(kind,col,w,h){ return cached(['VLO',kind,col].join('|'),w,h,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X,Y,W,H,cc), cD=shade(col,.7), cL=shade(col,1.35), tire='#303038', rim='#A8B0B8';
    const ln=(x0,y0,x1,y1,cc)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1); for(let i=0;i<=n;i++) P(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1,cc); };
    const wheel=(cx,cy,th)=>{ [[-1,-3],[0,-3],[1,-3],[-2,-2],[2,-2],[-3,-1],[3,-1],[-3,0],[3,0],[-3,1],[3,1],[-2,2],[2,2],[-1,3],[0,3],[1,3]].forEach(([dx,dy])=>P(cx+dx,cy+dy,1,1,tire)); if(th){ [[-1,-2],[0,-2],[1,-2],[-2,-1],[2,-1],[-2,0],[2,0],[-2,1],[2,1],[-1,2],[0,2],[1,2]].forEach(([dx,dy])=>P(cx+dx,cy+dy,1,1,'#484852')); } P(cx,cy,1,1,rim); };
    if(kind==='car'){ P(1,8,26,6,col); P(1,12,26,2,cD); P(6,3,15,6,col); P(8,4,5,4,'#BFE3F5'); P(14,4,5,4,'#BFE3F5'); P(8,4,2,1,'#FFFFFF'); P(2,8,4,1,cL); P(25,9,2,2,'#FFE9A8'); P(1,10,1,2,'#E05050'); P(4,13,5,4,tire); P(19,13,5,4,tire); P(6,14,1,2,rim); P(21,14,1,2,rim); }
    else if(kind==='cycle'){ wheel(5,23); wheel(20,23); ln(5,23,10,18,col); ln(5,23,11,23,col); ln(11,23,10,18,col); ln(10,18,17,18,col); ln(11,23,17,18,col); ln(17,18,20,23,col); P(17,14,1,4,'#505860'); P(16,14,3,1,'#505860'); P(8,17,4,1,'#3A3030'); P(10,22,3,2,'#404850'); }
    else if(kind==='moto'){ wheel(5,23,1); wheel(22,23,1); P(7,18,13,3,col); P(8,17,10,1,col); P(8,17,4,1,cL); P(7,20,13,1,cD); P(10,21,6,2,'#4A4C54'); P(3,19,6,1,'#7A7E86'); P(19,13,1,7,'#606870'); P(18,13,3,1,'#606870'); P(21,16,2,2,'#FFE9A8'); P(7,16,6,1,'#2E2A2A'); }
    else { const b='#9A6A40', bD=shade(b,.75), bL=shade(b,1.2); P(4,15,18,7,b); P(4,15,18,1,bL); P(4,21,18,1,bD); P(20,8,5,9,b); P(22,6,6,5,b); P(27,8,1,2,b); P(25,8,1,1,INK); P(22,4,2,3,bD); P(19,8,2,7,'#4A3020'); P(2,15,3,6,'#4A3020'); P(5,22,2,7,bD); P(9,22,2,7,b); P(16,22,2,7,bD); P(20,22,2,7,b); [5,9,16,20].forEach(xx=>P(xx,28,2,1,'#2A2020')); P(8,13,8,3,'#C04040'); P(8,15,8,1,'#8A2A2A'); }
    outline(c); }); }

