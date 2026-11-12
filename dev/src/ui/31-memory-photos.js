/* ========== 추억 사진: 그 일이 있었던 날의 한 장면을 필름 사진처럼 그린다 ==========
   실제 사진이 아니라 그림이다. 배경은 흐리게(얕은 심도), 사람은 또렷하게 그린 뒤
   빛 번짐 · 필름 입자 · 주변부 어두움 · 바랜 색 · 필름 카메라 날짜 표시를 더해 '그날 찍은 사진'처럼 보이게 한다. */
let PH_W=320, PH_H=240;
function phRng(seed){ let a=seed>>>0; return ()=>{ a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function phC(w,h){ const c=document.createElement('canvas'); c.width=w||PH_W; c.height=h||PH_H; return c; }
// 줄였다 키우기를 거듭해 부드럽게 흐린다 (모든 브라우저에서 같은 결과)
function phBlur(src,lv){ if(lv<=0) return src; let c=src; const ws=[];
  for(let i=0;i<lv;i++){ const n=phC(Math.max(2,c.width>>1),Math.max(2,c.height>>1)), x=n.getContext('2d'); x.imageSmoothingQuality='high'; x.drawImage(c,0,0,n.width,n.height); ws.push(c.width); c=n; }
  for(let i=lv-1;i>=0;i--){ const w=ws[i], h=Math.round(w*src.height/src.width), n=phC(w,h), x=n.getContext('2d'); x.imageSmoothingQuality='high'; x.drawImage(c,0,0,w,h); c=n; }
  return c; }
const phMix=(a,b,t)=>{ const p=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)], A=p(a), B=p(b); return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join(''); };
const phDark=(c,t)=>phMix(c,'#000000',t), phLight=(c,t)=>phMix(c,'#FFFFFF',t);
function phLin(x,x0,y0,x1,y1,st){ const g=x.createLinearGradient(x0,y0,x1,y1); st.forEach((s,i)=>g.addColorStop(s[0],s[1])); return g; }
function phRad(x,cx,cy,r0,r1,st){ const g=x.createRadialGradient(cx,cy,r0,cx,cy,r1); st.forEach(s=>g.addColorStop(s[0],s[1])); return g; }
function phRR(x,X,Y,w,h,r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); }
function phEl(x,cx,cy,rx,ry,fill){ x.beginPath(); x.ellipse(cx,cy,Math.max(.5,rx),Math.max(.5,ry),0,0,Math.PI*2); x.fillStyle=fill; x.fill(); }
// 옷 색: 실제 옷처럼 채도가 낮은 색
const PH_TOP=['#2F3E5C','#E9E4DA','#8A2F3A','#5E6B4E','#B9A27F','#3E5F7A','#C9B8A0','#6B4E3D','#D8D4CC','#4A4A52','#A8483A','#7B8FA6'];
const PH_BOT=['#2B3445','#3A3F4A','#5A4A3C','#24303E','#6E6A62','#1F2328'];
const PH_HAIR=['#1B1512','#2A1E17','#3B2A1E','#5A3E2A','#7A5634','#B08A58','#D8C090'];
// 사람: 머리·몸·팔·다리를 둥근 모양으로, 왼쪽 위에서 빛이 드는 것처럼 음영을 준다
function phHuman(x,o){
  const cx=o.cx, by=o.by, h=o.h, kind=o.kind||'adult', kid=kind==='kid', teen=kind==='teen', elder=kind==='elder';
  const hr=h*(kid?.118:teen?.078:.068), sw=h*(kid?.27:.24)*(o.male?1.1:1), skin=o.skin||'#D8A07A', hair=elder?'#C8C6C0':(o.hair||'#1B1512');
  const top=o.top||'#2F3E5C', bot=o.bot||'#2B3445', headCY=by-h+hr*1.05, shY=headCY+hr*1.45, hipY=by-h*(kid?.3:.47);
  x.save(); const tl=o.tilt!=null?o.tilt:Math.sin(cx*12.9898+by*78.233)*.035; x.translate(cx,by); x.rotate(tl); x.translate(-cx,-by);
  // 그림자 (발밑이 땅에 닿아 보이도록)
  phEl(x,cx,by+1,sw*.95,h*.035,'rgba(20,15,10,.32)'); phEl(x,cx,by,sw*.55,h*.015,'rgba(10,8,6,.4)');
  // 다리 또는 치마
  if(o.dress){ x.beginPath(); x.moveTo(cx-sw*.38,hipY-h*.05); x.lineTo(cx+sw*.38,hipY-h*.05); x.lineTo(cx+sw*(o.gown?1.05:.62),by); x.lineTo(cx-sw*(o.gown?1.05:.62),by); x.closePath(); x.fillStyle=phLin(x,cx-sw,0,cx+sw,0,[[0,phLight(o.dressCol||top,.15)],[.6,o.dressCol||top],[1,phDark(o.dressCol||top,.25)]]); x.fill(); }
  else if(!o.sit){ const lw=sw*.34; [-1,1].forEach(s=>{ phRR(x,cx+s*sw*.2-lw/2,hipY-2,lw,by-hipY,lw*.45); x.fillStyle=phLin(x,cx-sw,0,cx+sw,0,[[0,phLight(bot,.12)],[1,phDark(bot,.3)]]); x.fill(); phEl(x,cx+s*sw*.2+s*1,by-1.5,lw*.62,lw*.32,'#18181B'); }); }
  // 몸통
  x.beginPath(); x.moveTo(cx-sw*.5,shY+hr*.35); x.quadraticCurveTo(cx-sw*.5,shY,cx-sw*.3,shY-hr*.1); x.lineTo(cx+sw*.3,shY-hr*.1); x.quadraticCurveTo(cx+sw*.5,shY,cx+sw*.5,shY+hr*.35);
  x.lineTo(cx+sw*.42,hipY+(o.dress?-h*.03:h*.02)); x.lineTo(cx-sw*.42,hipY+(o.dress?-h*.03:h*.02)); x.closePath();
  x.fillStyle=phLin(x,cx-sw*.6,shY,cx+sw*.6,hipY,[[0,phLight(top,.18)],[.55,top],[1,phDark(top,.32)]]); x.fill();
  x.save(); x.clip(); x.fillStyle=phLin(x,cx-sw*.5,0,cx+sw*.5,0,[[0,'rgba(255,255,255,.08)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.22)']]); x.fillRect(cx-sw,shY-hr,sw*2,h); for(let i=0;i<3;i++){ x.fillStyle='rgba(0,0,0,.06)'; x.fillRect(cx-sw*.3+i*sw*.25,shY+h*.06,1.5,h*.25); } x.restore();
  if(o.tie){ x.fillStyle='#E9E4DA'; x.beginPath(); x.moveTo(cx-sw*.1,shY-hr*.1); x.lineTo(cx+sw*.1,shY-hr*.1); x.lineTo(cx,shY+h*.12); x.closePath(); x.fill(); phRR(x,cx-1.2,shY,2.4,h*.14,1); x.fillStyle=o.tie; x.fill(); }
  // 팔
  const aw=sw*.17, arm=(sx,ex,ey)=>{ x.strokeStyle=phLin(x,sx-aw,0,sx+aw,0,[[0,phLight(top,.1)],[1,phDark(top,.22)]]); x.lineWidth=aw; x.lineCap='round'; x.beginPath(); x.moveTo(sx,shY+aw*.6); x.quadraticCurveTo(sx+(ex-sx)*.15,(shY+ey)/2,ex,ey-aw*.2); x.stroke(); phEl(x,ex,ey+aw*.25,aw*.38,aw*.48,phDark(skin,.05)); };
  const pose=o.pose||'down';
  if(pose==='hold'){ arm(cx-sw*.46,cx-sw*.05,shY+h*.2); arm(cx+sw*.46,cx+sw*.12,shY+h*.22); }
  else if(pose==='up'){ arm(cx-sw*.46,cx-sw*.7,shY-h*.16); arm(cx+sw*.46,cx+sw*.72,shY-h*.17); }
  else if(pose==='wave'){ arm(cx-sw*.46,cx-sw*.55,hipY); arm(cx+sw*.46,cx+sw*.75,shY-h*.14); }
  else if(pose==='link'){ arm(cx-sw*.46,cx-sw*.62,hipY-h*.02); arm(cx+sw*.46,cx+sw*.68,shY+h*.18); }
  else { arm(cx-sw*.46,cx-sw*.56,hipY+h*.02); arm(cx+sw*.46,cx+sw*.56,hipY+h*.02); }
  // 목과 머리
  phRR(x,cx-hr*.32,headCY+hr*.6,hr*.64,hr*.75,hr*.2); x.fillStyle=phDark(skin,.12); x.fill();
  phEl(x,cx,headCY,hr*.9,hr,phRad(x,cx-hr*.35,headCY-hr*.35,hr*.1,hr*1.3,[[0,phLight(skin,.18)],[.7,skin],[1,phDark(skin,.25)]]));
  if(o.back){ phEl(x,cx-hr*.92,headCY+hr*.05,hr*.14,hr*.22,phDark(skin,.1)); phEl(x,cx+hr*.92,headCY+hr*.05,hr*.14,hr*.22,phDark(skin,.1));
    x.fillStyle=phRad(x,cx-hr*.3,headCY-hr*.5,hr*.1,hr*1.2,[[0,phLight(hair,.22)],[1,hair]]); x.beginPath(); x.ellipse(cx,headCY-hr*.12,hr*.97,hr*(o.long?1.05:.92),0,0,Math.PI*2); x.fill();
    if(o.long){ phRR(x,cx-hr*.9,headCY,hr*1.8,hr*(kid?1.4:1.9),hr*.5); x.fill(); } }
  else {
    // 머리카락: 정수리를 덮고, 긴 머리는 어깨까지
    x.fillStyle=phLin(x,cx,headCY-hr,cx,headCY+hr,[[0,phLight(hair,.15)],[1,hair]]);
    x.beginPath(); x.ellipse(cx,headCY-hr*.12,hr*.98,hr*.95,0,Math.PI*1.02,Math.PI*1.98); x.quadraticCurveTo(cx+hr*.4,headCY-hr*.55,cx,headCY-hr*.5); x.quadraticCurveTo(cx-hr*.5,headCY-hr*.45,cx-hr*.95,headCY-hr*.05); x.closePath(); x.fill();
    if(o.long){ phRR(x,cx-hr*1.02,headCY-hr*.3,hr*.34,hr*2.1,hr*.17); x.fill(); phRR(x,cx+hr*.68,headCY-hr*.3,hr*.34,hr*2.1,hr*.17); x.fill(); }
    if(o.veil){ x.fillStyle='rgba(250,250,248,.55)'; x.beginPath(); x.moveTo(cx-hr*.8,headCY-hr*.7); x.quadraticCurveTo(cx-hr*2.4,headCY+h*.3,cx-hr*1.6,by-h*.25); x.lineTo(cx+hr*1.6,by-h*.25); x.quadraticCurveTo(cx+hr*2.4,headCY+h*.3,cx+hr*.8,headCY-hr*.7); x.closePath(); x.fill(); }
    if(o.cap){ x.fillStyle='#1C1E24'; x.beginPath(); x.moveTo(cx-hr*1.5,headCY-hr*.75); x.lineTo(cx,headCY-hr*1.15); x.lineTo(cx+hr*1.5,headCY-hr*.75); x.lineTo(cx,headCY-hr*.42); x.closePath(); x.fill(); x.fillStyle='#D8B040'; x.fillRect(cx+hr*.9,headCY-hr*.8,1.2,hr*.9); }
    if(o.hat){ phEl(x,cx,headCY-hr*.55,hr*1.6,hr*.35,o.hat); phEl(x,cx,headCY-hr*.8,hr*.8,hr*.45,phDark(o.hat,.1)); }
    // 얼굴: 작게 (흐려져도 사람 얼굴로 읽히도록)
    // 얼굴은 만화처럼 그리지 않고, 빛과 그늘로만 (눈두덩 · 코 밑 · 입술)
    const ey=headCY+hr*.06, fd=o.face==null?0:o.face; phEl(x,cx+fd*hr*.2-hr*.33,ey,hr*.2,hr*.1,'rgba(55,32,24,.42)'); phEl(x,cx+fd*hr*.2+hr*.33,ey,hr*.2,hr*.1,'rgba(55,32,24,.42)');
    phEl(x,cx+fd*hr*.2,headCY+hr*.3,hr*.1,hr*.05,'rgba(80,45,35,.22)'); phEl(x,cx+fd*hr*.2,headCY+hr*.5,hr*.2,hr*.07,'rgba(150,70,62,.38)');
    phEl(x,cx-hr*.25,headCY-hr*.35,hr*.35,hr*.2,'rgba(255,240,225,.18)');
  }
  x.restore(); return {headCY,hr,shY,hipY}; }
// 아기 포대기
function phBaby(x,cx,cy,s,skin,col){ phEl(x,cx,cy,s*1.25,s*.8,phRad(x,cx-s*.4,cy-s*.4,s*.1,s*1.4,[[0,'#FFFFFF'],[1,col||'#F2E6EE']])); phEl(x,cx-s*.45,cy-s*.05,s*.42,s*.4,phRad(x,cx-s*.55,cy-s*.15,1,s*.5,[[0,phLight(skin,.2)],[1,skin]]));
  phEl(x,cx-s*.55,cy-s*.07,s*.05,s*.03,'#3A2A24'); phEl(x,cx-s*.35,cy-s*.07,s*.05,s*.03,'#3A2A24'); }
// 하늘·땅·나무·건물
function phSky(x,top,mid,bot,hz){ x.fillStyle=phLin(x,0,0,0,hz,[[0,top],[.65,mid],[1,bot]]); x.fillRect(0,0,PH_W,hz+2); }
function phClouds(x,r,n,col,y0,y1){ for(let i=0;i<n;i++){ const cx=r()*PH_W, cy=y0+r()*(y1-y0), s=20+r()*40; for(let j=0;j<5;j++) phEl(x,cx+(r()-.5)*s*1.6,cy+(r()-.5)*s*.3,s*(.5+r()*.5),s*(.25+r()*.2),col); } }
function phHills(x,r,y,col,amp){ x.fillStyle=col; x.beginPath(); x.moveTo(0,PH_H); x.lineTo(0,y); for(let i=0;i<=8;i++) x.lineTo(i*PH_W/8,y-amp*(.3+r()*.7)); x.lineTo(PH_W,PH_H); x.closePath(); x.fill(); }
function phTree(x,cx,by,s,leaf,r){ x.fillStyle='#4A3628'; x.fillRect(cx-s*.06,by-s*.9,s*.12,s*.9); for(let i=0;i<7;i++) phEl(x,cx+(r()-.5)*s*.8,by-s*(.95+r()*.6),s*(.32+r()*.18),s*(.28+r()*.15),i%3?leaf:phLight(leaf,.18)); }
function phPalm(x,cx,by,s){ x.strokeStyle='#6A5238'; x.lineWidth=s*.07; x.beginPath(); x.moveTo(cx,by); x.quadraticCurveTo(cx+s*.15,by-s*.6,cx+s*.05,by-s*1.2); x.stroke(); x.strokeStyle='#3E6A3A'; x.lineWidth=s*.05; for(let i=0;i<7;i++){ const a=i/7*Math.PI*2; x.beginPath(); x.moveTo(cx+s*.05,by-s*1.2); x.quadraticCurveTo(cx+s*.05+Math.cos(a)*s*.35,by-s*1.35,cx+s*.05+Math.cos(a)*s*.6,by-s*1.2+Math.abs(Math.sin(a))*s*.25+s*.1); x.stroke(); } }
function phBuilding(x,X,Y,w,h,wall,roof,r,win){ x.fillStyle=phLin(x,X,0,X+w,0,[[0,phLight(wall,.1)],[1,phDark(wall,.18)]]); x.fillRect(X,Y,w,h); if(roof){ x.fillStyle=roof; x.beginPath(); x.moveTo(X-w*.06,Y); x.lineTo(X+w/2,Y-h*.32); x.lineTo(X+w*1.06,Y); x.closePath(); x.fill(); }
  const cols=Math.max(1,Math.floor(w/22)), rows=Math.max(1,Math.floor(h/26)); for(let i=0;i<cols;i++) for(let j=0;j<rows;j++){ const wx=X+6+i*(w-12)/cols, wy=Y+7+j*(h-14)/rows; x.fillStyle=win||(r()<.3?'#F2D9A0':'#7F93A6'); x.fillRect(wx,wy,(w-12)/cols-6,(h-14)/rows-9); } }
function phBokeh(x,r,n,cols,y0,y1,s){ x.save(); x.globalCompositeOperation='lighter'; for(let i=0;i<n;i++){ const cx=r()*PH_W, cy=y0+r()*(y1-y0), rr=(s||10)*(.5+r()), c=cols[i%cols.length]; x.fillStyle=phRad(x,cx,cy,0,rr,[[0,c+'AA'],[.7,c+'55'],[1,c+'00']]); x.beginPath(); x.arc(cx,cy,rr,0,7); x.fill(); } x.restore(); }
function phText(x,t,cx,cy,size,col,bg,w){ x.save(); x.font=`700 ${size}px "Pretendard","Apple SD Gothic Neo",sans-serif`; const tw=Math.min(w||999,x.measureText(t).width+size*1.2); if(bg){ x.fillStyle=bg; x.fillRect(cx-tw/2,cy-size*.9,tw,size*1.8); } x.fillStyle=col; x.textAlign='center'; x.textBaseline='middle'; x.fillText(t,cx,cy,tw-size); x.restore(); }

// 그 삶의 사람들 모습 (같은 사람은 사진마다 같은 옷 색·머리색으로)
function phCast(L,r){ const skin=(L.look&&L.look.skin)||'#D8A07A', hair=(L.look&&L.look.hair)||'#1B1512', rg=L.C.rg, lk=k=>{ L.looks=L.looks||{}; return L.looks[k]||(L.looks[k]=randLook(rg,L.look)); };
  const one=(k,o)=>{ const l=lk(k); return Object.assign({skin:l.skin,hair:PH_HAIR[Math.floor(hashStr(k+L.name)*3)%3],top:PH_TOP[Math.floor(hashStr(k+'t'+L.name)*PH_TOP.length)],bot:PH_BOT[Math.floor(hashStr(k+'b'+L.name)*PH_BOT.length)]},o); };
  return { me:o=>Object.assign({skin,hair,top:PH_TOP[Math.floor(hashStr('me'+L.name)*PH_TOP.length)],bot:PH_BOT[Math.floor(hashStr('mb'+L.name)*PH_BOT.length)],male:L.sex===0,long:L.sex===1},o),
    p:(k,o)=>one(k,o) }; }
function hashStr(s){ let h=2166136261; for(const c of String(s)) h=Math.imul(h^c.charCodeAt(0),16777619); return (h>>>0)/4294967296; }

// 사람을 따로 그려 붙인다. 해를 등진 사람은 어둡게(실루엣), 해 쪽 가장자리는 밝게(역광)
function phFig(x,o,sunX){ const t=phC(), tx=t.getContext('2d'); phHuman(tx,o);
  if(o.sil){ const rim=phC(), rx=rim.getContext('2d'); rx.drawImage(t,0,0); rx.globalCompositeOperation='source-in'; rx.fillStyle=o.rimCol||'#FFE0A8'; rx.fillRect(0,0,PH_W,PH_H); const dx=(sunX==null?160:sunX)<o.cx?-2.2:2.2;
    x.save(); x.globalAlpha=.8; x.drawImage(phBlur(rim,1),dx*.8,-1); x.restore(); x.drawImage(rim,dx,-.6); tx.globalCompositeOperation='source-atop'; tx.fillStyle=`rgba(22,16,14,${o.sil})`; tx.fillRect(0,0,PH_W,PH_H); }
  x.drawImage(t,0,0); }
function phSunset(bx,lx,r,hz,sx,sy){ phSky(bx,'#4E5C8E','#E89A72','#FFD9A0',hz); phClouds(bx,r,4,'rgba(255,190,160,.45)',10,hz*.55); phEl(bx,sx,sy,16,16,'#FFF4D8');
  lx.fillStyle=phRad(lx,sx,sy,0,170,[[0,'rgba(255,236,190,.95)'],[.25,'rgba(255,200,140,.45)'],[1,'rgba(255,170,110,0)']]); lx.fillRect(0,0,PH_W,PH_H); }
// 손: 손가락 하나(어른) · 아기 주먹 · 열쇠를 쥔 손
function phFinger(x,x0,y0,x1,y1,w,skin){ x.save(); x.lineCap='round'; x.strokeStyle=phLin(x,0,y0-w,0,y0+w,[[0,phLight(skin,.12)],[.6,skin],[1,phDark(skin,.28)]]); x.lineWidth=w; x.beginPath(); x.moveTo(x0,y0); x.lineTo(x1,y1); x.stroke();
  phEl(x,x1+w*.18,y1-w*.08,w*.32,w*.24,phLight(skin,.3)); x.strokeStyle=phDark(skin,.2); x.lineWidth=1; for(const f of [.45,.7]){ const kx=x0+(x1-x0)*f, ky=y0+(y1-y0)*f; x.beginPath(); x.arc(kx,ky,w*.25,-.6,.6); x.stroke(); } x.restore(); }
function phBadge(x,cx,cy,rot,co,name,col){ x.save(); x.translate(cx,cy); x.rotate(rot); x.strokeStyle=col||'#2858A8'; x.lineWidth=5; x.beginPath(); x.moveTo(-8,-60); x.lineTo(-30,-200); x.moveTo(8,-60); x.lineTo(30,-200); x.stroke();
  phRR(x,-46,-62,92,120,6); x.fillStyle='#FBFBF8'; x.fill(); x.fillStyle=col||'#2858A8'; x.fillRect(-46,-62,92,22); phRR(x,-30,-30,34,40,2); x.fillStyle='#C8D0D8'; x.fill();
  phText(x,co,0,-51,9,'#FFFFFF',null,86); phText(x,name,10,24,11,'#1E2B37',null,80); x.fillStyle='#9AA4AE'; x.fillRect(8,-24,30,3); x.fillRect(8,-16,24,3); x.restore(); }
// 장면 고르기: 기억의 종류와 그 삶의 나라·계절·나이
// 기억 한 줄을 읽고 어떤 장면의 사진이 어울릴지 고른다. 글에 나온 구체적인 말을 먼저 보고, 그래도 모르면 기억에 붙은 종류를 쓴다.
const CARD_RULES=[
  [/홍수|물에 잠|강물이 넘|큰비|몬순/,'flood'],[/지진|땅이 크게 흔들/,'quake'],[/폭풍|태풍|허리케인|지붕이 날|큰바람|토네이도/,'storm'],[/가뭄|비가 오지 않|우물이 말|물이 귀/,'drought'],[/폭염|무더위|열대야/,'heat'],[/한파|눈보라|큰 눈|난방이|꽁꽁/,'cold'],[/산불|숲에 큰불|불이 나|화재/,'fire'],[/화산|용암/,'volcano'],
  [/태어났|출산|갓난|아기가 |첫걸음|돌잔치|동생이 태어/,'baby'],[/떠나보|세상을 떠|돌아가셨|장례|먼 길을/,'farewell'],[/결혼|혼례|웨딩|혼인|가정을 꾸/,'wedding'],
  [/입원|수술|병원|진료|응급실|주사/,'hosp'],[/아파|열이|앓|돌림병|말라리아|콜레라|감기|독감|진단/,'sick'],[/졸업/,'grad'],[/집을 샀|집을 짓|새 집|입주|집이 생|새 아파트/,'house'],
  [/일자리를 잃|해고|사람을 줄|문을 닫|실직|파산/,'jobloss'],
  [/달리기|결승|운동회|체육|경기|대회|선수|축구|농구|야구|줄다리기|넘어져|계주|이어달리기/,'sport'],
  [/무대|발표회|재롱|공연|연주|합창|콘서트|대본/,'stage'],
  [/축제|명절|잔치|행사|제사|설날|추석/,'fest'],
  [/시험|입학|수업|교실|성적|수능|공부|합격|숙제|선생님|학교/,'school'],
  [/일으켜|도와|손을 잡|짝꿍|친구|고백|좋아하는|함께 웃|같이 놀|이웃/,'friend'],
  [/출근|퇴근|야근|회사|직장|면접|공장|농사|농장|논밭|어장|그물|광산|일터|일자리|손님|장사|납품/,'job'],
  [/돈|월급|빚|물가|살림|저금|통장|사업|가게/,'money'],[/바다|파도|해변|배를|물고기/,'sea'],[/이사|도시로|떠난다|다른 나라|여행|기차|버스|공항|고향/,'travel'],[/강아지|고양이|동물|반려/,'pet']];
function cardKind(t){ t=String(t||''); for(const [re,k] of CARD_RULES) if(re.test(t)) return k; return null; }
function photoKind(m){ const k=cardKind(m.t); if(k) return k; if(m.sc&&m.sc!=='job'&&m.sc!=='money'&&m.sc!=='life') return m.sc; return m.a>=6&&/친구|같이|함께|이웃/.test(m.t)?'friend':m.a>=19&&/여행|바다|산|길/.test(m.t)?'travel':'life'; }
function drawPhoto(cv,m,L,idx){
  if(!L.look) L.look=randLook(L.C.rg);
  const seed=Math.floor(hashStr(m.t+m.a+L.name)*1e9)+idx*7919, r=phRng(seed), C=L.C, kind=photoKind(m), a=m.a, U=L.set==='U';
  const sp=C.sp[(a+Math.floor(r()*4))%4], arid=!!C.arid, tropic=/^(SE|AF|LA|OC|SA)$/.test(C.rg)&&!SOUTH4.includes(L.c)&&!NORTH4.includes(L.c);
  const leaf=arid?'#8A8A4E':sp===0?'#7DA65A':sp===1?'#3F6E35':sp===2?'#B8742E':'#6E6A5C', grass=arid?'#C8B07A':sp===3&&!tropic?'#E8ECEE':sp===2?'#9C8A4A':'#5E8A3E';
  const cast=phCast(L,r), me=cast.me, P=cast.p, myKind=a<6?'kid':a<13?'kid':a<19?'teen':a>=65?'elder':'adult';
  const bg=phC(), bx=bg.getContext('2d'), fg=phC(), fx=fg.getContext('2d'), lt=phC(), lx=lt.getContext('2d');
  let tone='#F2C48D', toneA=.25, blurBg=2, bokeh=null, night=false;
  const out=(sky1,sky2,sky3,hz)=>{ phSky(bx,sky1,sky2,sky3,hz); phClouds(bx,r,3,'rgba(255,255,255,.55)',10,hz*.6); };
  const ground=(hz,col)=>{ bx.fillStyle=phLin(bx,0,hz,0,PH_H,[[0,phDark(col,.05)],[1,phLight(col,.05)]]); bx.fillRect(0,hz,PH_W,PH_H-hz); };
  const scenery=hz=>{ if(C.lt==='mt'||C.lt==='wt'){ phHills(bx,r,hz-10,phMix('#7E8FA3','#FFFFFF',.2),60); } phHills(bx,r,hz,phDark(leaf,.15),18); };
  const town=(hz)=>{ const walls=['#D9CDB8','#C9B49A','#E6DED0','#B8A48C','#9FA7AF']; for(let i=0;i<6;i++){ const w=40+r()*40, h=(U?50:24)+r()*(U?70:20), X=i*58-10+r()*10; phBuilding(bx,X,hz-h,w,h,walls[i%walls.length],U?null:'#8A5A44',r); } };
  const people=(n,y,h,o)=>{ for(let i=0;i<n;i++){ const l=randLook(C.rg); phHuman(bx,Object.assign({cx:r()*PH_W,by:y+r()*6,h:h*(.8+r()*.3),skin:l.skin,hair:PH_HAIR[i%3],top:PH_TOP[i%PH_TOP.length],bot:PH_BOT[i%PH_BOT.length],long:r()<.5,kind:'adult'},o||{})); } };
  let done=true; const sunX=r()<.5?70:250;
  switch(kind){
    case 'baby': { // 아기의 작은 주먹이 내 손가락을 꼭 쥐었다
      bx.fillStyle=phLin(bx,0,0,PH_W,PH_H,[[0,'#B89CA4'],[1,'#7E6A66']]); bx.fillRect(0,0,PH_W,PH_H); for(let i=0;i<9;i++) phEl(bx,r()*PH_W,r()*PH_H,40+r()*60,10+r()*16,i%2?'rgba(255,240,240,.18)':'rgba(60,40,40,.18)');
      const ad=L.sex===1?((L.look&&L.look.skin)||'#D8A07A'):((L.looks&&L.looks.spouse&&L.looks.spouse.skin)||(L.look&&L.look.skin)||'#D8A07A'), bs=phLight((L.look&&L.look.skin)||'#D8A07A',.12);
      phRR(fx,-30,150,150,80,30); fx.fillStyle=phLin(fx,0,150,0,230,[[0,'#F2E8EE'],[1,'#C8B4BE']]); fx.fill();
      phFinger(fx,360,176,176,128,40,ad); phEl(fx,350,214,76,62,phDark(ad,.05));
      phEl(fx,150,140,44,36,phRad(fx,136,126,2,50,[[0,phLight(bs,.18)],[.8,bs],[1,phDark(bs,.25)]])); for(let i=0;i<4;i++){ phEl(fx,160+i*11-14,110+i*2,7,10,phRad(fx,158+i*11-14,106+i*2,1,10,[[0,phLight(bs,.2)],[1,phDark(bs,.12)]])); }
      phRR(fx,96,150,26,30,4); fx.fillStyle='#FFFFFF'; fx.fill();
      const k=m.kid!=null&&L.kids[m.kid]; if(k) phText(fx,k.given,109,165,7,'#8A6A70',null,26);
      lx.fillStyle=phRad(lx,40,20,0,200,[[0,'rgba(255,240,220,.35)'],[1,'rgba(255,240,220,0)']]); lx.fillRect(0,0,PH_W,PH_H); tone='#F7C9A0'; toneA=.3; blurBg=3; break; }
    case 'birth': { // 포대기에 싸인 갓난아기와 이름표
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#A89484'],[1,'#7A6A5E']]); bx.fillRect(0,0,PH_W,PH_H); for(let i=0;i<10;i++) phEl(bx,r()*PH_W,r()*PH_H,50,14,'rgba(255,240,230,.14)');
      const bs=(L.look&&L.look.skin)||'#D8A07A'; phEl(fx,170,140,120,78,phRad(fx,140,110,10,150,[[0,'#F6F0F2'],[1,'#CDBCC6']])); for(let i=0;i<5;i++){ fx.strokeStyle='rgba(180,160,170,.35)'; fx.lineWidth=3; fx.beginPath(); fx.arc(170,150,40+i*16,3.6,5.6); fx.stroke(); }
      phEl(fx,128,118,40,36,phRad(fx,118,106,3,46,[[0,phLight(bs,.2)],[1,bs]])); phEl(fx,118,92,44,20,'#E8C8D4'); fx.strokeStyle=phDark(bs,.35); fx.lineWidth=1.5; fx.beginPath(); fx.arc(116,120,5,.3,2.8); fx.stroke(); fx.beginPath(); fx.arc(138,120,5,.3,2.8); fx.stroke(); phEl(fx,128,134,5,2.5,phDark(bs,.25));
      fx.save(); fx.translate(250,206); fx.rotate(-.08); phRR(fx,-54,-16,108,32,3); fx.fillStyle='#FFFDF6'; fx.fill(); fx.strokeStyle='#E8B4C0'; fx.lineWidth=2; fx.stroke(); phText(fx,`${L.name} 아기`,0,-3,10,'#5A4A48',null,104); phText(fx,`${L.by}. ${1+Math.floor(r()*12)}. ${1+Math.floor(r()*28)}.`,0,9,7,'#8A7A78',null,100); fx.restore();
      phFinger(fx,-10,200,70,170,22,(L.looks&&L.looks.mom&&L.looks.mom.skin)||bs); tone='#F7C9A0'; toneA=.3; blurBg=3; break; }
    case 'school': if(!/대학/.test(m.t)){ // 교문으로 들어가는 뒷모습
      const hz=150; out(sp===0?'#8DB8E6':'#7FA9DA','#BBD3EC','#E6EEF4',hz); scenery(hz); const wall=C.rg==='NA'||C.rg==='EU'?'#B5654A':'#E2DCCF'; phBuilding(bx,40,70,240,84,wall,null,r,'#8EA4B8'); ground(hz,U?'#B8B4AA':grass);
      bx.fillStyle='#8A8E94'; bx.fillRect(40,96,14,90); bx.fillRect(266,96,14,90); const sch=L.sch||{}, nm=m.t.includes(sch.mid||'@')?sch.mid:m.t.includes(sch.high||'@')||m.t.includes(sch.voc||'@')?(L.f.hs==='voc'?sch.voc:sch.high):sch.elem;
      if(nm){ fx.fillStyle='#F5F1E8'; fx.fillRect(56,98,208,34); phText(fx,nm,160,108,11,'#2A3A5A',null,200); phText(fx,L.c==='KR'?'입학을 축하합니다':m.t.includes('입학')?'환영합니다':'',160,123,9,'#A8483A',null,200); }
      if(sp===0&&(C.rg==='EA'||L.c==='KR')) for(let i=0;i<50;i++) phEl(lx,r()*PH_W,r()*PH_H,1.5+r()*2,1+r()*1.2,'rgba(255,214,226,.85)');
      phFig(fx,me({cx:140,by:268,h:a<9?140:170,kind:myKind,back:true}),sunX); phRR(fx,124,166,34,40,8); fx.fillStyle=['#C2405A','#3870D0','#E8B030','#2F8F7A'][Math.floor(r()*4)]; fx.fill();
      phFig(fx,P(a<13?'mom':'friend',{cx:196,by:280,h:a<13?220:172,kind:a<13?'adult':myKind,long:a<13||L.sex===1,back:true}),sunX); tone='#F6E2B8'; toneA=.2; break; } else { done=false; break; }
    case 'grad': if(/대학/.test(m.t)){ // 하늘로 던진 학사모
      out('#5E92D0','#9EC0E6','#DCE8F2',PH_H); for(let i=0;i<8;i++){ const cx=30+r()*260, cy=30+r()*160, sz=14+r()*26, rt=(r()-.5)*1.2; fx.save(); fx.translate(cx,cy); fx.rotate(rt); fx.fillStyle='#16181E'; fx.beginPath(); fx.moveTo(-sz,0); fx.lineTo(0,-sz*.45); fx.lineTo(sz,0); fx.lineTo(0,sz*.45); fx.closePath(); fx.fill(); fx.fillStyle='#22252C'; fx.fillRect(-sz*.4,0,sz*.8,sz*.35); fx.strokeStyle='#D8B040'; fx.lineWidth=1.5; fx.beginPath(); fx.moveTo(0,0); fx.lineTo(sz*.5,sz*.5); fx.stroke(); fx.restore(); }
      for(let i=0;i<6;i++) phFig(bx,{cx:20+i*58,by:300,h:150,kind:'adult',top:'#16181E',bot:'#16181E',pose:'up',back:true,skin:randLook(C.rg).skin,hair:PH_HAIR[i%3],sil:.5},sunX);
      phText(fx,L.sch&&L.sch.univ?L.sch.univ:'',250,224,9,'rgba(255,255,255,.85)',null,130); tone='#F2E2C0'; toneA=.18; blurBg=1; break; } else { done=false; break; }
    case 'wedding': {
      { const hz=170; phSunset(bx,lx,r,hz,sunX,hz-30); ground(hz,'#6A6058'); bx.strokeStyle='#E8D8C8'; bx.lineWidth=12; bx.beginPath(); bx.arc(160,200,110,Math.PI,0); bx.stroke(); for(let i=0;i<22;i++){ const t=Math.PI+i/21*Math.PI; phEl(bx,160+Math.cos(t)*110,200+Math.sin(t)*110,8,7,['#F4C6CE','#FFFFFF','#E89AAA'][i%3]); }
        const SAw=/^(IN|PK|BD|NP|LK)$/.test(L.c), meW=L.sex===1, bride={dress:true,gown:true,dressCol:SAw?'#B8232E':'#FBFAF6',top:SAw?'#B8232E':'#FBFAF6',long:true,veil:!SAw,kind:'adult',pose:'link',sil:.55,face:.6}, groom={top:'#1E222A',bot:'#1E222A',male:true,kind:'adult',pose:'link',sil:.65,face:-.6};
        phFig(fx,Object.assign(meW?me(bride):P('spouse',bride),{cx:138,by:300,h:240}),sunX); phFig(fx,Object.assign(meW?P('spouse',groom):me(groom),{cx:188,by:300,h:262}),sunX); tone='#FFC890'; toneA=.32; break; } }
    case 'job': case 'jobloss': { const jk=(L.job&&L.job.kind)||'office'; if(/^(farm|herd|fish|tour|mine|part)$/.test(jk)){ done=false; break; }
      // 일터 책상 위: 사원증(회사 이름과 내 이름), 화면, 커피 잔
      const jb=(L.jobs||[]).find(j=>j.co&&m.t.includes(j.co))||(L.jobs||[]).slice(-1)[0]||{}, co=jb.co||L.f.co||'';
      const back={office:['#DCE4EC','#9AB0C4'],factory:['#A8B0B8','#6A747E'],hosp:['#EEF3F6','#C4D2DC'],school:['#E8E2D2','#2E4A3C'],shop:['#F4E6D0','#C8A070'],dream:['#EDE0F0','#9A86A8']}[jk]||['#E4E0D8','#A8A098'];
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,back[0]],[1,phDark(back[0],.2)]]); bx.fillRect(0,0,PH_W,PH_H); for(let i=0;i<5;i++){ bx.fillStyle=back[1]; bx.fillRect(10+i*66,30+r()*20,44,60+r()*30); }
      people(2,190,130,{}); bx.fillStyle='#7A5E46'; bx.fillRect(0,170,PH_W,70);
      if(kind==='jobloss'){ phRR(fx,120,120,150,90,4); fx.fillStyle='#C8A878'; fx.fill(); fx.fillStyle='#B08E5E'; fx.fillRect(120,120,150,14); phEl(fx,160,112,18,24,'#5E8A3E'); phRR(fx,200,96,30,32,3); fx.fillStyle='#E8E4DC'; fx.fill(); tone='#9EAAB8'; toneA=.3; }
      else { phRR(fx,150,60,150,96,4); fx.fillStyle='#22262C'; fx.fill(); fx.fillStyle=phLin(fx,0,66,0,148,[[0,'#BFE0F8'],[1,'#7FA8D0']]); fx.fillRect(156,66,138,82); for(let i=0;i<5;i++){ fx.fillStyle='rgba(255,255,255,.5)'; fx.fillRect(166,76+i*13,60+r()*60,5); }
        fx.fillStyle='#2A2E36'; fx.fillRect(210,156,30,20); phRR(fx,150,180,150,22,3); fx.fillStyle='#3A3E46'; fx.fill(); phRR(fx,30,150,40,46,6); fx.fillStyle='#F4F2EE'; fx.fill(); phEl(fx,50,152,20,6,'#6A4A34'); tone='#F2DCB8'; toneA=.22; }
      phBadge(fx,92,170,-.18,co,L.name,{hosp:'#2F8F7A',school:'#B4501E',factory:'#5A6878'}[jk]); blurBg=3; break; }
    case 'house': if(L.set==='U'||C.tier>=3){ // 새 집 현관 앞, 열쇠를 쥔 손
      bx.fillStyle=phLin(bx,0,0,PH_W,0,[[0,'#D8D2C8'],[1,'#B8B0A4']]); bx.fillRect(0,0,PH_W,PH_H); phRR(bx,150,10,130,230,3); bx.fillStyle=U?'#5A6470':'#7A5234'; bx.fill(); phEl(bx,260,130,6,6,'#D8C080'); phRR(bx,200,40,40,18,2); bx.fillStyle='#E8E4DC'; bx.fill(); phText(bx,String(100+Math.floor(r()*1800)),220,49,10,'#2A2E36');
      const sk=(L.look&&L.look.skin)||'#D8A07A'; phEl(fx,70,190,60,46,sk); for(let i=0;i<4;i++) phFinger(fx,90,160+i*13,140,150+i*14,14,sk);
      fx.strokeStyle='#C8C0B0'; fx.lineWidth=3; fx.beginPath(); fx.arc(150,128,14,0,7); fx.stroke(); for(const [kx,ky,rt] of [[160,100,-.5],[176,120,.2]]){ fx.save(); fx.translate(kx,ky); fx.rotate(rt); fx.fillStyle='#D8C890'; phRR(fx,-6,-30,12,18,5); fx.fill(); fx.fillRect(-2.5,-12,5,30); fx.fillRect(2,4,5,3); fx.fillRect(2,10,4,3); fx.restore(); }
      tone='#F4D8A8'; toneA=.25; blurBg=3; break; } else { done=false; break; }
    case 'sick': if(a>=13){ // 링거 줄이 있는 손, 창으로 드는 빛
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#6E7A84'],[1,'#4E5A64']]); bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#C8D4DC'; bx.fillRect(180,0,140,120); phEl(bx,80,60,22,34,'rgba(230,240,248,.9)'); bx.fillStyle='#A0A8B0'; bx.fillRect(78,90,3,100);
      phRR(fx,-20,150,360,110,20); fx.fillStyle=phLin(fx,0,150,0,240,[[0,'#C4CED4'],[1,'#7E8C96']]); fx.fill(); const sk=(L.look&&L.look.skin)||'#D8A07A';
      phEl(fx,190,170,60,26,sk); for(let i=0;i<4;i++) phFinger(fx,210,160+i*9,262,168+i*8,10,sk); fx.fillStyle='#FFFFFF'; fx.fillRect(160,160,24,20); fx.strokeStyle='rgba(200,220,235,.9)'; fx.lineWidth=2; fx.beginPath(); fx.moveTo(172,166); fx.quadraticCurveTo(120,100,80,92); fx.stroke();
      if((L.f.family&&L.ppl.spouse)||a<30){ const hs=(L.looks&&L.looks.spouse&&L.looks.spouse.skin)||(L.looks&&L.looks.mom&&L.looks.mom.skin)||sk; phEl(fx,250,196,50,22,hs); for(let i=0;i<4;i++) phFinger(fx,230,190+i*8,190,180+i*7,9,hs); }
      lx.fillStyle=phRad(lx,260,40,0,200,[[0,'rgba(255,250,235,.4)'],[1,'rgba(255,250,235,0)']]); lx.fillRect(0,0,PH_W,PH_H); tone='#C8D8E4'; toneA=.28; blurBg=3; break; } else { done=false; break; }
    case 'school': return m.a>=19?GN('library'):m.a>=13?GN(n%2?'school':'bag'):GN('school');
    case 'friend': { // 해 질 녘 벤치의 두 사람 (역광)
      const hz=160; phSunset(bx,lx,r,hz,sunX,hz-26); phHills(bx,r,hz,'#5A5048',12); ground(hz,'#4E4A40'); phTree(bx,30,hz+8,90,'#3E4A34',r); fx.fillStyle='#3A2C22'; fx.fillRect(70,216,190,7); fx.fillRect(80,222,5,18); fx.fillRect(244,222,5,18);
      phFig(fx,me({cx:130,by:276,h:a<13?150:196,kind:myKind,pose:'link',sil:.6,back:true}),sunX); phFig(fx,P('friend',{cx:192,by:278,h:a<13?146:192,kind:myKind,long:L.sex===1,pose:'link',sil:.6,back:true}),sunX); tone='#F8B878'; toneA=.32; break; }
    case 'friend': return m.a<13?GN('play'):m.a<20?GN(n%2?'friend':'park'):GN(n%3===0?'coffee':n%3===1?'park':'friend');
    case 'harvest': { const hz=150; phSunset(bx,lx,r,hz,sunX,hz-40); scenery(hz); for(let i=0;i<12;i++){ bx.fillStyle=i%2?'#C8A040':'#B88E30'; bx.beginPath(); bx.moveTo(160,hz); bx.lineTo(-300+i*80,PH_H); bx.lineTo(-260+i*80,PH_H); bx.closePath(); bx.fill(); }
      phFig(fx,me({cx:150,by:270,h:190,kind:'adult',hat:'#D8B870',pose:'hold',sil:.55}),sunX); phFig(fx,P('spouse',{cx:226,by:260,h:160,kind:'adult',long:L.sex===0,hat:'#C8A060',sil:.55}),sunX); tone='#F4C880'; toneA=.3; break; }
    default: done=false;
  }
  if(!done) switch(kind){
    case 'birth': case 'baby': { // 창가 햇살 아래, 포대기에 싸인 아기를 안은 사람
      bx.fillStyle=phLin(bx,0,0,PH_W,0,[[0,'#F4E6D2'],[1,'#C8B49A']]); bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#FFF6E4'; bx.fillRect(18,22,96,120); for(let i=0;i<7;i++){ bx.fillStyle='rgba(200,180,150,.35)'; bx.fillRect(18,28+i*17,96,4); }
      bx.fillStyle='#EDE5DA'; bx.fillRect(0,170,PH_W,70); phRR(bx,150,150,190,70,10); bx.fillStyle='#F8F6F2'; bx.fill();
      const own=kind==='birth', holder=own?P('mom',{long:true}):(L.sex===1?me({kind:'adult'}):P('spouse',{long:true,male:false}));
      const h1=phHuman(fx,Object.assign({cx:172,by:300,h:290,pose:'hold',kind:'adult'},holder));
      const kid=m.kid!=null&&L.kids[m.kid]; phBaby(fx,182,h1.shY+52,30,own?((L.look&&L.look.skin)||'#D8A07A'):holder.skin);
      { const other=own?P('dad',{male:true}):(L.sex===1?P('spouse',{male:true}):me({kind:'adult'})); phHuman(bx,Object.assign({cx:268,by:330,h:300,kind:'adult'},other)); }
      const nm=own?L.name:(kid?kid.n:''); if(nm){ fx.save(); fx.translate(70,206); fx.rotate(-.06); phRR(fx,-46,-14,92,28,3); fx.fillStyle='#FFFDF6'; fx.fill(); fx.strokeStyle='#E8B4C0'; fx.lineWidth=2; fx.stroke(); phText(fx,nm+' 아기',0,0,11,'#5A4A48',null,90); fx.restore(); }
      tone='#F7C9A0'; toneA=.32; blurBg=3; break; }
    case 'school': case 'grad': case 'noschool': {
      const hz=150; out(sp===0?'#8DB8E6':'#7FA9DA','#BBD3EC','#E6EEF4',hz); scenery(hz);
      if(kind!=='noschool'){ const wall=C.rg==='NA'||C.rg==='EU'?'#B5654A':'#E2DCCF'; phBuilding(bx,30,62,260,90,wall,null,r,'#8EA4B8'); bx.fillStyle='#6E7A86'; bx.fillRect(150,112,20,40);
        const sch=L.sch||{}, isU=/대학|대학교/.test(m.t), nm=isU?sch.univ:m.t.includes(sch.mid||'@')?sch.mid:m.t.includes(sch.high||'@')||m.t.includes(sch.voc||'@')?(L.f.hs==='voc'?sch.voc:sch.high):sch.elem;
        if(nm){ const ban=kind==='grad'?(L.c==='KR'?'졸업을 축하합니다':'졸업식'):(L.c==='KR'?'입학을 축하합니다':'환영합니다'); bx.fillStyle='#F5F1E8'; bx.fillRect(60,70,200,30); phText(bx,nm,160,79,10,'#2A3A5A',null,190); phText(bx,ban,160,92,9,'#A8483A',null,190); } }
      ground(hz,U?'#B8B4AA':grass);
      if(sp===0&&/^(EA)$/.test(C.rg)||(sp===0&&L.c==='KR')) for(let i=0;i<40;i++) phEl(lx,r()*PH_W,r()*PH_H,1.5+r()*2,1+r()*1.2,'rgba(255,214,226,.8)');
      if(kind==='grad'){ const k=/대학/.test(m.t); phHuman(fx,me({cx:150,by:272,h:200,kind:k?'adult':myKind,dress:k,gown:false,dressCol:'#1E2028',top:k?'#1E2028':undefined,cap:k,pose:'up'})); phHuman(fx,P('mom',{cx:250,by:280,h:190,long:true,kind:'adult'})); phHuman(bx,P('friend',{cx:60,by:250,h:150,kind:k?'adult':myKind,cap:k,dress:k,dressCol:'#1E2028'})); }
      else if(kind==='noschool'){ bx.fillStyle='#B89A6A'; bx.fillRect(0,hz+20,PH_W,30); phHuman(fx,me({cx:150,by:270,h:170,kind:'kid',pose:'up'})); phEl(fx,150,104,16,13,'#C2683A'); phHuman(bx,P('sib',{cx:250,by:250,h:120,kind:'kid'})); }
      else { phHuman(fx,me({cx:130,by:276,h:a<9?150:190,kind:myKind,pose:'down'})); phRR(fx,112,166,36,46,8); fx.fillStyle='#C2405A'; fx.fill(); phHuman(fx,P('mom',{cx:220,by:290,h:230,long:true,kind:'adult'})); }
      tone='#F6E2B8'; toneA=.2; break; }
    case 'wedding': { // 꽃 아치 아래 두 사람
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#F4EDE4'],[1,'#D8C8B6']]); bx.fillRect(0,0,PH_W,PH_H); bokeh=['#FFE2A8','#FFD0C0','#FFFFFF'];
      bx.strokeStyle='#E8D8C8'; bx.lineWidth=16; bx.beginPath(); bx.arc(160,170,120,Math.PI,0); bx.stroke(); for(let i=0;i<26;i++){ const t=Math.PI+i/25*Math.PI; phEl(bx,160+Math.cos(t)*120,170+Math.sin(t)*120,9,8,['#F4C6CE','#FFFFFF','#E89AAA'][i%3]); }
      const SAw=/^(IN|PK|BD|NP|LK)$/.test(L.c), bride={dress:true,gown:true,dressCol:SAw?'#B8232E':'#FBFAF6',top:SAw?'#B8232E':'#FBFAF6',long:true,veil:!SAw,kind:'adult',pose:'link'}, groom={top:SAw?'#E8DCC0':'#1E222A',bot:SAw?'#E8DCC0':'#1E222A',tie:SAw?null:'#2A2E38',male:true,kind:'adult',pose:'link'};
      const meW=L.sex===1, sp=L.ppl&&L.ppl.spouse; phHuman(fx,Object.assign(meW?me(bride):P('spouse',bride),{cx:132,by:300,h:240})); phHuman(fx,Object.assign(meW?P('spouse',groom):me(groom),{cx:192,by:300,h:262}));
      phEl(fx,150,226,14,11,'#F2B8C4'); phEl(fx,144,222,7,6,'#FFFFFF'); tone='#FFD8B8'; toneA=.3; blurBg=3; break; }
    case 'job': case 'jobloss': case 'hosp': case 'mine': case 'harvest': {
      const jb=(L.jobs||[]).find(j=>j.co&&m.t.includes(j.co))||(L.jobs||[]).slice(-1)[0], jk=kind==='hosp'?'hosp':kind==='mine'?'mine':kind==='harvest'?'farm':(L.job&&L.job.kind)||(jb&&/농부|farm/.test(jb.n)?'farm':'office');
      if(/^(farm|herd|fish|tour)$/.test(jk)){ const hz=128; out('#84AEDB','#B4CCE4','#E4EAEE',hz); scenery(hz); ground(hz,jk==='fish'?'#4E7A9A':grass);
        if(jk==='farm'){ for(let i=0;i<9;i++){ bx.fillStyle=i%2?phDark(grass,.12):phLight(grass,.06); bx.beginPath(); bx.moveTo(160,hz); bx.lineTo(-200+i*90,PH_H); bx.lineTo(-150+i*90,PH_H); bx.closePath(); bx.fill(); } phFig(fx,me({cx:170,by:250,h:180,kind:'adult',hat:'#D8B870',pose:'hold',sil:.35}),sunX); }
        else if(jk==='fish'){ bx.fillStyle='#8A5A3C'; bx.beginPath(); bx.moveTo(40,190); bx.lineTo(280,190); bx.lineTo(250,224); bx.lineTo(70,224); bx.closePath(); bx.fill(); phHuman(fx,me({cx:160,by:206,h:150,kind:'adult',top:'#D8A040'})); }
        else { for(let i=0;i<5;i++) phEl(bx,40+i*60+r()*20,190+r()*10,18,11,'#E8E2D6'); phHuman(fx,me({cx:200,by:260,h:180,kind:'adult',hat:'#6A5040'})); }
        tone='#F4D49A'; toneA=.25; }
      else if(jk==='mine'){ bx.fillStyle='#1E1A18'; bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle=phRad(bx,160,120,10,200,[[0,'#5A4A3C'],[1,'#141210']]); bx.fillRect(0,0,PH_W,PH_H); night=true; bokeh=['#FFD890'];
        phHuman(fx,me({cx:160,by:270,h:220,kind:'adult',top:'#E8A030',hat:'#E8C030'})); lx.fillStyle=phRad(lx,160,64,0,90,[[0,'rgba(255,240,200,.7)'],[1,'rgba(255,240,200,0)']]); lx.fillRect(0,0,PH_W,PH_H); tone='#E8B070'; toneA=.3; }
      else if(jk==='factory'){ bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#8A939C'],[1,'#5A6268']]); bx.fillRect(0,0,PH_W,PH_H); for(let i=0;i<5;i++){ bx.fillStyle='#C8D2DA'; bx.fillRect(10+i*64,10,50,40); } bx.fillStyle='#3E4850'; bx.fillRect(0,150,PH_W,40); for(let i=0;i<4;i++) phRR(bx,20+i*80,110,60,44,6), bx.fillStyle='#6A7A88', bx.fill();
        phHuman(fx,me({cx:170,by:280,h:220,kind:'adult',top:'#E8C030',hat:'#F0F0F0'})); tone='#C8D4DE'; toneA=.2; }
      else if(jk==='hosp'){ bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#E8EEF2'],[1,'#C4D0D8']]); bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#F8FBFC'; bx.fillRect(200,24,96,110); bx.fillStyle='#A8C0D0'; bx.fillRect(206,30,84,98);
        phHuman(fx,me({cx:140,by:290,h:240,kind:'adult',top:'#F6F8FA',tie:null})); tone='#D8E6F0'; toneA=.22; }
      else if(jk==='school'){ bx.fillStyle='#E8E2D2'; bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#2E4A3C'; bx.fillRect(30,30,260,96); phText(bx,L.tx('{co}').slice(0,14),160,50,10,'rgba(240,240,230,.8)'); bx.fillStyle='#B89A6A'; for(let i=0;i<4;i++) bx.fillRect(10+i*80,180,60,50); phHuman(fx,me({cx:200,by:290,h:240,kind:'adult',pose:'wave'})); people(3,250,110,{kind:'kid',back:true}); }
      else { // 사무실 · 가게 · 작업실
        bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#EDE8E0'],[1,'#C8C0B4']]); bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#BFD2E0'; bx.fillRect(16,16,150,96); for(let i=0;i<5;i++){ bx.fillStyle='#8EA2B4'; bx.fillRect(22+i*28,40+r()*20,20,72); }
        const co=(jb&&jb.co)||L.f.co; if(co) { bx.fillStyle='#2A3240'; bx.fillRect(190,30,120,30); phText(bx,co,250,45,12,'#F2EEE6',null,116); }
        bx.fillStyle='#8A6A4E'; bx.fillRect(0,196,PH_W,44); bx.fillStyle='#2A2E36'; phRR(bx,196,140,90,58,4); bx.fill(); bx.fillStyle='#9CC8F0'; bx.fillRect(202,146,78,44);
        phHuman(fx,me({cx:120,by:300,h:250,kind:'adult',top:jk==='office'?'#E9E4DA':undefined,tie:jk==='office'&&L.sex===0?'#2F3E5C':null,pose:kind==='jobloss'?'down':'hold'}));
        if(kind==='jobloss'){ phRR(fx,90,200,70,44,3); fx.fillStyle='#C8A878'; fx.fill(); } tone=kind==='jobloss'?'#A8B4C0':'#F2DCB8'; toneA=.22; }
      if(kind==='jobloss'){ tone='#9EAAB8'; toneA=.3; }
      break; }
    case 'house': case 'money': {
      if(kind==='money'){ bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#3A3028'],[1,'#1E1A16']]); bx.fillRect(0,0,PH_W,PH_H); lx.fillStyle=phRad(lx,200,60,0,220,[[0,'rgba(255,220,160,.55)'],[1,'rgba(255,220,160,0)']]); lx.fillRect(0,0,PH_W,PH_H);
        bx.fillStyle='#7A5A3E'; bx.fillRect(0,170,PH_W,70); fx.save(); fx.translate(150,196); fx.rotate(-.08); fx.fillStyle='#F2EEE4'; fx.fillRect(-60,-22,80,54); fx.fillStyle='#E6E0D2'; fx.fillRect(-14,-30,80,54); for(let i=0;i<6;i++){ fx.fillStyle='#9A948A'; fx.fillRect(-8,-22+i*7,60*(.5+r()*.5),2); } fx.restore();
        phRR(fx,226,176,38,52,4); fx.fillStyle='#2A2C30'; fx.fill(); fx.fillStyle='#A8C090'; fx.fillRect(231,181,28,12);
        phHuman(bx,me({cx:150,by:330,h:300,kind:a>=65?'elder':'adult',pose:'hold'})); night=true; tone='#F0B878'; toneA=.35; blurBg=1; break; }
      const hz=170; out('#7FA9DA','#B4CCE4','#E8EEF2',hz); scenery(hz); ground(hz,U?'#B8B4AA':grass);
      if(U){ phBuilding(bx,40,30,240,142,L.C.rg==='EA'?'#E6E2DA':'#D8C8B0',null,r); bx.fillStyle='#5A6470'; bx.fillRect(140,130,40,42); }
      else { phBuilding(bx,70,96,180,76,C.tier<=2?'#C8A478':'#EDE6D8',C.tier<=2?'#8A6A44':'#9A4A3A',r); bx.fillStyle='#6A4A34'; bx.fillRect(146,136,28,36); }
      phTree(bx,24,hz+6,70,leaf,r); phTree(bx,300,hz+8,60,leaf,r);
      phHuman(fx,me({cx:120,by:290,h:200,kind:a>=65?'elder':'adult',pose:'wave'})); if(L.f.family&&L.ppl.spouse) phHuman(fx,P('spouse',{cx:180,by:292,h:196,kind:'adult',long:L.sex===0,male:L.sex===1}));
      L.kidsHome().slice(0,2).forEach((k,i)=>phHuman(fx,P('kid'+i,{cx:230+i*34,by:296,h:110,kind:'kid',long:k.sex===1})));
      tone='#F4D8A8'; toneA=.22; break; }
    case 'farewell': { // 해 질 녘, 흰 꽃과 촛불
      const hz=150; out('#4A4E78','#C88A78','#F0B888',hz); phHills(bx,r,hz,'#3A3448',14); ground(hz,'#4E4652');
      for(let i=0;i<4;i++){ const l=randLook(C.rg); phHuman(bx,{cx:70+i*58,by:hz+40,h:96,skin:l.skin,hair:PH_HAIR[i%3],top:'#1E1E24',bot:'#1E1E24',back:true,kind:'adult',long:i%2}); }
      for(let i=0;i<14;i++) phEl(fx,60+r()*200,206+r()*30,13,11,['#F8F6F0','#EDEAE0','#FFFFFF'][i%3]); for(let i=0;i<5;i++) phEl(fx,70+i*45,214+r()*12,4,4,'#E8D888');
      fx.fillStyle='#F2EEE4'; fx.fillRect(268,160,12,46); lx.fillStyle=phRad(lx,274,152,0,40,[[0,'rgba(255,210,140,.85)'],[1,'rgba(255,210,140,0)']]); lx.fillRect(0,0,PH_W,PH_H); phEl(fx,274,154,3,6,'#FFE8A0');
      tone='#E8A890'; toneA=.3; break; }
    case 'sick': { // 병실 또는 집 방, 침대
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#E2E8EC'],[1,'#B8C4CC']]); bx.fillRect(0,0,PH_W,PH_H); bx.fillStyle='#F6F8F8'; bx.fillRect(196,20,110,120); bx.fillStyle='rgba(180,200,215,.6)'; bx.fillRect(202,26,98,108);
      bx.fillStyle='#9AA4AC'; bx.fillRect(64,40,3,170); phRR(bx,52,40,26,34,4); bx.fillStyle='rgba(230,240,248,.8)'; bx.fill();
      phRR(fx,30,176,280,70,12); fx.fillStyle='#F4F6F6'; fx.fill(); phRR(fx,40,160,96,30,14); fx.fillStyle='#FFFFFF'; fx.fill();
      const h=phHuman(fx,me({cx:92,by:320,h:250,kind:a>=65?'elder':myKind})); phRR(fx,30,196,280,60,14); fx.fillStyle=phLin(fx,0,196,0,256,[[0,'#DCE6EE'],[1,'#B8C8D4']]); fx.fill();
      if(L.f.family&&L.ppl.spouse&&a>=25) phHuman(fx,P('spouse',{cx:250,by:330,h:300,kind:a>=65?'elder':'adult',long:L.sex===0})); else if(a<19) phHuman(fx,P('mom',{cx:250,by:330,h:300,kind:'adult',long:true}));
      tone='#C8D8E4'; toneA=.28; break; }
    case 'fest': case 'stage': {
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#141828'],[1,'#3A2A30']]); bx.fillRect(0,0,PH_W,PH_H); night=true; bokeh=['#FFC870','#FF8A5A','#FFE6A8','#8AC8FF'];
      if(kind==='stage'){ lx.fillStyle=phLin(lx,160,0,160,240,[[0,'rgba(255,240,210,.55)'],[1,'rgba(255,240,210,0)']]); lx.beginPath(); lx.moveTo(130,0); lx.lineTo(190,0); lx.lineTo(240,210); lx.lineTo(80,210); lx.closePath(); lx.fill(); bx.fillStyle='#4A3424'; bx.fillRect(0,200,PH_W,40); phHuman(fx,me({cx:160,by:206,h:150,kind:myKind,pose:'up'})); people(8,262,90,{back:true}); }
      else { for(let i=0;i<3;i++){ bx.strokeStyle='rgba(40,30,30,.8)'; bx.lineWidth=1; bx.beginPath(); bx.moveTo(0,30+i*24); bx.quadraticCurveTo(160,60+i*24,PH_W,26+i*24); bx.stroke(); }
        people(7,236,120,{}); phHuman(fx,me({cx:150,by:290,h:220,kind:myKind,pose:'wave'})); }
      tone='#F0A060'; toneA=.3; blurBg=3; break; }
    case 'sport': { const hz=110; out('#7FB0E0','#B8D0E8','#DDE8F0',hz); bx.fillStyle='#9AA4AE'; bx.fillRect(0,hz-30,PH_W,30); for(let i=0;i<40;i++) phEl(bx,r()*PH_W,hz-24+r()*20,3,3,PH_TOP[i%PH_TOP.length]);
      ground(hz,'#4E8A3A'); for(let i=0;i<6;i++){ bx.fillStyle=i%2?'#558F40':'#4A8236'; bx.fillRect(0,hz+i*22,PH_W,22); }
      people(3,200,120,{}); phHuman(fx,me({cx:170,by:280,h:210,kind:myKind,pose:'up',top:'#C2405A'})); phEl(fx,110,250,12,12,'#F4F4F0'); tone='#F6DCA8'; toneA=.18; break; }
    case 'travel': case 'sea': case 'town': {
      const hz=kind==='sea'||C.lt==='cs'||C.lt==='wt'?150:140; out('#6FA2DA','#A8C6E6','#E6EEF2',hz);
      if(kind==='sea'||/^(cs|wt)$/.test(C.lt)){ bx.fillStyle=phLin(bx,0,hz,0,PH_H,[[0,'#3E7EA8'],[1,'#7AB4CC']]); bx.fillRect(0,hz,PH_W,PH_H-hz); for(let i=0;i<30;i++){ bx.fillStyle='rgba(255,255,255,.35)'; bx.fillRect(r()*PH_W,hz+r()*60,20+r()*30,1.5); } bx.fillStyle='#E8D8B0'; bx.fillRect(0,210,PH_W,30); if(tropic) phPalm(bx,40,214,90); }
      else if(kind==='town'){ town(hz); ground(hz,'#A8A49C'); people(5,hz+40,90,{}); }
      else { scenery(hz); ground(hz,grass); bx.fillStyle='#6E6A64'; bx.beginPath(); bx.moveTo(150,hz); bx.lineTo(176,hz); bx.lineTo(260,PH_H); bx.lineTo(60,PH_H); bx.closePath(); bx.fill(); }
      if(kind!=='town'&&C.landmark){ bx.fillStyle='rgba(255,255,255,.6)'; }
      phHuman(fx,me({cx:200,by:286,h:200,kind:a>=65?'elder':myKind,back:kind!=='town',pose:kind==='town'?'down':'wave'})); if(L.f.family&&L.ppl.spouse&&a>=25) phHuman(fx,P('spouse',{cx:250,by:290,h:196,kind:'adult',long:L.sex===0,back:kind!=='town'}));
      tone='#F6D8A0'; toneA=.2; break; }
    case 'friend': case 'pet': { const hz=150; out('#E8A878','#F4C49A','#F8E0C0',hz); scenery(hz); ground(hz,grass); phTree(bx,40,hz+10,90,leaf,r); phTree(bx,290,hz+10,80,leaf,r);
      bx.fillStyle='#7A5A3E'; bx.fillRect(80,214,170,8); phHuman(fx,me({cx:130,by:280,h:a<13?150:200,kind:myKind,pose:'link'})); if(kind==='pet'){ phEl(fx,210,262,26,18,'#C89A60'); phEl(fx,232,246,14,12,'#B8884E'); phEl(fx,238,244,2,2,'#1E1A16'); }
      else phHuman(fx,P('friend',{cx:196,by:282,h:a<13?146:196,kind:myKind,long:L.sex===1,pose:'link'}));
      tone='#F8B878'; toneA=.32; break; }
    case 'cold': { const hz=150; out('#B8C8D8','#D8E2EA','#EEF2F4',hz); phHills(bx,r,hz,'#E8EEF2',20); ground(hz,'#F0F4F6'); town(hz+4); for(let i=0;i<120;i++) phEl(lx,r()*PH_W,r()*PH_H,1+r()*1.6,1+r()*1.6,'rgba(255,255,255,.85)');
      phHuman(fx,me({cx:160,by:286,h:200,kind:myKind,top:'#3E4A5E',hat:'#A8483A'})); tone='#C8D8E8'; toneA=.25; break; }
    case 'flood': case 'storm': case 'quake': case 'drought': case 'heat': case 'fire': case 'volcano': case 'unrest': {
      const hz=150, gray=kind==='flood'||kind==='storm'; out(gray?'#5A6470':kind==='fire'||kind==='volcano'?'#6A4A3E':kind==='drought'||kind==='heat'?'#E8C890':'#9AA2AA',gray?'#7A848E':'#C8A888','#C8C4BC',hz); town(hz);
      if(kind==='flood'){ bx.fillStyle=phLin(bx,0,hz-20,0,PH_H,[[0,'#6A6A5A'],[1,'#8A8670']]); bx.fillRect(0,hz-20,PH_W,PH_H); for(let i=0;i<40;i++){ bx.fillStyle='rgba(220,220,200,.3)'; bx.fillRect(r()*PH_W,hz-10+r()*90,30,1.5); } }
      else if(kind==='drought'){ ground(hz,'#C8A070'); bx.strokeStyle='#8A6A48'; bx.lineWidth=1; for(let i=0;i<30;i++){ bx.beginPath(); let px=r()*PH_W, py=hz+r()*90; bx.moveTo(px,py); for(let j=0;j<4;j++){ px+=(r()-.5)*30; py+=(r()-.3)*14; bx.lineTo(px,py); } bx.stroke(); } }
      else ground(hz,kind==='quake'?'#8A847A':'#7A7468');
      if(kind==='storm'){ for(let i=0;i<160;i++){ lx.strokeStyle='rgba(220,230,240,.35)'; lx.beginPath(); const px=r()*PH_W, py=r()*PH_H; lx.moveTo(px,py); lx.lineTo(px-6,py+16); lx.stroke(); } }
      if(kind==='fire'||kind==='volcano'){ lx.fillStyle=phRad(lx,240,hz,10,160,[[0,'rgba(255,140,60,.6)'],[1,'rgba(255,140,60,0)']]); lx.fillRect(0,0,PH_W,PH_H); for(let i=0;i<12;i++) phEl(bx,200+r()*120,30+r()*80,30,20,'rgba(80,70,70,.45)'); }
      if(kind==='quake') for(let i=0;i<10;i++) phEl(bx,r()*PH_W,hz+20+r()*60,10+r()*14,5+r()*6,'#9A948A');
      phHuman(fx,me({cx:150,by:290,h:200,kind:a>=65?'elder':myKind,top:kind==='flood'?'#E8B030':undefined,back:true})); if(a<19) phHuman(fx,P('dad',{cx:210,by:296,h:230,kind:'adult',male:true,back:true}));
      tone=kind==='heat'||kind==='drought'?'#F0C080':kind==='fire'?'#F09060':'#A8B0B8'; toneA=.3; break; }
    default: { // 삶: 저녁 밥상에 둘러앉은 가족
      bx.fillStyle=phLin(bx,0,0,0,PH_H,[[0,'#4A3A2E'],[1,'#2A2220']]); bx.fillRect(0,0,PH_W,PH_H); lx.fillStyle=phRad(lx,160,40,0,220,[[0,'rgba(255,214,150,.6)'],[1,'rgba(255,214,150,0)']]); lx.fillRect(0,0,PH_W,PH_H); bokeh=['#FFD8A0'];
      const fam=a<19?[['mom',{long:true}],['dad',{male:true}]]:L.f.family&&L.ppl.spouse?[['spouse',{long:L.sex===0,male:L.sex===1}]]:[['friend',{long:L.sex===1}]];
      fam.forEach(([k,o],i)=>phHuman(bx,P(k,Object.assign({cx:90+i*140,by:270,h:230,kind:'adult',pose:'hold'},o))));
      phHuman(bx,me({cx:160,by:300,h:a<13?190:240,kind:a>=65?'elder':myKind,pose:'hold'}));
      phRR(fx,0,210,PH_W,40,4); fx.fillStyle='#8A5E3E'; fx.fill(); for(let i=0;i<5;i++){ phEl(fx,40+i*60,214,18,7,'#F2EEE6'); phEl(fx,40+i*60,212,12,4,['#C86A3A','#7AA048','#E8C060','#B8483A','#F0E0C0'][i]); }
      bokeh=null; night=true; tone='#F6B870'; toneA=.32; blurBg=2; }
  }
  // 배경에 결(벽·땅·하늘의 얼룩)을 입히고, 먼 곳은 공기에 묻혀 옅어진다
  phTexture(bx,r,.22,8); phTexture(bx,r,.12,3);
  // 합치기: 배경은 흐리게, 사람은 또렷하게 · 사진기를 든 손처럼 살짝 기울고, 한가운데가 아닌 곳을 담는다
  const out2=cv.getContext('2d'); cv.width=PH_W; cv.height=PH_H; out2.imageSmoothingEnabled=true; out2.imageSmoothingQuality='high';
  const zoom=1.06+r()*.12, rot=(r()-.5)*.045, ox=(r()-.5)*PH_W*.08, oy=(r()-.5)*PH_H*.05;
  const cam=()=>{ out2.setTransform(1,0,0,1,0,0); out2.translate(PH_W/2+ox,PH_H/2+oy); out2.rotate(rot); out2.scale(zoom,zoom); out2.translate(-PH_W/2,-PH_H/2); };
  out2.fillStyle='#222'; out2.fillRect(0,0,PH_W,PH_H); cam();
  out2.drawImage(phBlur(bg,blurBg),0,0,PH_W,PH_H);
  if(bokeh){ const bk=phC(), kx=bk.getContext('2d'); phBokeh(kx,r,night?26:14,bokeh,0,PH_H*.75,night?14:10); out2.save(); out2.globalCompositeOperation='screen'; out2.drawImage(phBlur(bk,1),0,0); out2.restore(); }
  out2.drawImage(phBlur(fg,1),0,0,PH_W,PH_H); out2.globalAlpha=.18; out2.drawImage(fg,0,0); out2.globalAlpha=1;   // 초점이 맞은 곳
  out2.save(); out2.globalCompositeOperation='screen'; out2.drawImage(phBlur(lt,1),0,0); out2.restore();
  out2.setTransform(1,0,0,1,0,0);
  // 렌즈의 빛 번짐: 밝은 곳이 부드럽게 퍼진다
  const glow=phBlur(cv,3); out2.save(); out2.globalCompositeOperation='screen'; out2.globalAlpha=night?.32:.13; out2.drawImage(glow,0,0); out2.restore();
  // 한쪽에서 드는 빛
  const ls=r()<.5; out2.save(); out2.globalCompositeOperation='soft-light'; out2.fillStyle=phLin(out2,0,0,PH_W,0,ls?[[0,'rgba(255,245,225,.55)'],[1,'rgba(0,0,20,.45)']]:[[0,'rgba(0,0,20,.45)'],[1,'rgba(255,245,225,.55)']]); out2.fillRect(0,0,PH_W,PH_H); out2.restore();
  finishFilm(out2,r,{tone,toneA,night,age:L.lifespan?(L.lifespan-a)/Math.max(30,L.lifespan):.3,date:[L.by+a,1+Math.floor(r()*12),1+Math.floor(r()*28)]});
}
// 얼룩진 결: 아주 작은 무작위 점을 부드럽게 키워 겹친다
function phTexture(x,r,a,sc,mask){ const w=Math.ceil(PH_W/sc), h=Math.ceil(PH_H/sc), t=phC(w,h), tx=t.getContext('2d'), im=tx.createImageData(w,h);
  for(let i=0;i<im.data.length;i+=4){ const v=110+r()*36; im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255; } tx.putImageData(im,0,0);
  x.save(); x.globalCompositeOperation=mask?'source-atop':'overlay'; x.globalAlpha=mask?a*.5:a; x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high'; if(mask) x.globalCompositeOperation='source-atop'; x.drawImage(t,0,0,PH_W,PH_H); x.restore(); }
// 필름 느낌: 색 보정 · 바램 · 빛 번짐 · 주변부 어두움 · 입자 · 날짜
function finishFilm(x,r,o){ const W=PH_W,H=PH_H;
  x.save(); x.globalCompositeOperation='soft-light'; x.globalAlpha=o.toneA; x.fillStyle=o.tone; x.fillRect(0,0,W,H); x.restore();
  const fade=.05+Math.min(.5,o.age)*.35;   // 오래된 기억일수록 더 바래 있다
  x.save(); x.globalCompositeOperation='color'; x.globalAlpha=fade*.5; x.fillStyle='#C8A078'; x.fillRect(0,0,W,H); x.restore();
  x.save(); x.globalCompositeOperation='screen'; x.globalAlpha=.08+fade*.25; x.fillStyle='#4A3C34'; x.fillRect(0,0,W,H); x.restore();
  if(r()<.4){ x.save(); x.globalCompositeOperation='screen'; const lx=r()<.5?0:W, ly=r()*H; x.fillStyle=phRad(x,lx,ly,0,140,[[0,'rgba(255,120,40,.45)'],[1,'rgba(255,120,40,0)']]); x.fillRect(0,0,W,H); x.restore(); }
  x.fillStyle=phRad(x,W/2,H/2,H*.35,W*.72,[[0,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${o.night?.6:.42})`]]); x.fillRect(0,0,W,H);
  // 대비 곡선 · 색 번짐(빨강·파랑이 한 칸씩 어긋남) · 입자
  try{ const im=x.getImageData(0,0,W,H), d=im.data, s=new Uint8ClampedArray(d), cv2=v=>{ const t=v/255; return 255*(t<.5?2*t*t*.9+t*.1:1-2*(1-t)*(1-t)*.9-(1-t)*.1); };
    for(let y=0;y<H;y++) for(let xx=0;xx<W;xx++){ const i=(y*W+xx)*4, ir=(y*W+Math.min(W-1,xx+1))*4, ib=(y*W+Math.max(0,xx-1))*4, n=(r()-.5)*(o.night?40:28), c=(r()-.5)*8;
      d[i]=cv2(s[ir])+n+c; d[i+1]=cv2(s[i+1])+n; d[i+2]=cv2(s[ib+2])+n*.9-c; }
    x.putImageData(im,0,0); }catch(e){}
  const [y,mo,da]=o.date, s=`'${String(y).slice(2)} ${String(mo).padStart(2,' ')} ${String(da).padStart(2,' ')}`;
  x.save(); x.font='bold 15px "Courier New",Courier,monospace'; x.textAlign='right'; x.textBaseline='bottom'; x.shadowColor='rgba(255,90,0,.9)'; x.shadowBlur=5; x.fillStyle='#FFB060'; x.fillText(s,W-12,H-9); x.restore(); }

/* ---------- 실제 사진: 위키백과·위키미디어 공용의 자유 이용 사진 (저작자와 라이선스를 함께 표시) ----------
   PHOTO_WIKI: 도시·명소·음식·축제·동물·대학 이름 → [파일 이름, 썸네일 경로, 저작자, 라이선스]
   PHOTO_GEN: 장면 종류 → 같은 형식의 사진 몇 장 (사람 얼굴이 드러나지 않는 사진 위주로 골랐다) */
const PH_BASE='https://upload.wikimedia.org/wikipedia/commons/';
// 사람이 나오는 장면이나 분위기 사진은 사건과 어긋나기 쉽다. 글과 확실히 맞는 종류만 실제 사진을 쓰고, 나머지는 그 장면을 그림으로 그린다.
const GEN_ALWAYS=new Set(['baby','home_baby','toy','hosp','wedding','grad','flood','quake','storm','drought','heat','cold','fire','volcano','harvest','harvest_a','sea','farewell','house','job_office','job_factory','job_farm','job_fish','job_hosp','job_shop','job_mine','job_herd','job_dream','job_school','job_part','job_drive']);
const GEN_NEED={play:/놀이터|그네|미끄럼|연날리기|연을/,bike:/자전거/,coffee:/커피|카페/,study:/공부|숙제|필기|노트|연필/,school:/수업|교실|선생님/,money:/돈|월급|통장|저금|빚|물가/,sick:/아파|열이|감기|앓|독감/,pet:/강아지|고양이|동물/,sport:/달리기|운동|체육|경기|대회|결승|계주|트랙/,library:/도서관/,bag:/가방|책가방/};
function photoSrc(m,L,idx){ const C=L.C, t=String(m.t||''), kind=photoKind(m), sch=L.sch||{}, n=Math.floor(hashStr(t+'|'+m.a)*97);
  const W=k=>k&&PHOTO_WIKI[k]?{p:PHOTO_WIKI[k],place:k}:null, GN=k=>{ const a=PHOTO_GEN[k]; if(!a||!a.length) return null; if(!GEN_ALWAYS.has(k)&&!(GEN_NEED[k]&&GEN_NEED[k].test(t))) return null; return {p:a[n%a.length]}; };
  // 그 무렵 하던 일의 일터 사진 (운전은 차, 관광 일은 그 나라 명소, 날품팔이·건설은 공사장)
  const jobPh=j=>{ const n=j?j.n:(L.job&&L.job.n)||'', jk=j?(j.k||jobKindOf(j.n)):((L.job&&L.job.kind)||'office');
    if(/운전|택시|버스|화물/.test(n)) return GN('job_drive'); if(jk==='tour') return W(C.landmark)||GN('travel');
    return GN('job_'+jk)||GN('job_office'); };
  const asia=/^(EA|SE|SA)$/.test(C.rg), U=L.set==='U', home=()=>U?(W(L.town)||W(C.city)):(W(L.region)||GN(asia?'village_a':'village')||W(C.city));
  if(m.a===0&&kind==='birth') return home();
  if(/장난감|인형|블록/.test(t)) return GN('toy');
  if((kind==='sick'||kind==='hosp')&&/병원|입원|수술|진료/.test(t)) return GN('hosp');
  // 작은 장면(놀이터·책상·시장 같은 곳)의 기억: 그 장소에 어울리는 사진
  if(m.sp&&!m.big&&!/^(sick|hosp|farewell|fest|travel|sea)$/.test(kind)){ const sp=m.sp, a=m.a;
    if(a<3&&/^(mom|dad|gran|sib|kid|yard|table|tv)$/.test(sp)) return GN('home_baby');
    if(sp==='table') return W(C.food)||GN('home');
    if(sp==='work') return jobPh((L.jobs||[]).filter(x=>x.a<=a).pop());
    if((sp==='far'||sp==='mount')&&C.landmark) return W(C.landmark)||GN('travel');
  }
  if(sch.univ&&t.includes(sch.univ)) return W(sch.univ)||GN('grad');
  if(C.landmark&&t.includes(C.landmark)) return W(C.landmark)||GN('travel');
  if(C.food&&t.includes(C.food)) return W(C.food)||GN('life');
  if(C.fest&&t.includes(C.fest)) return W(C.fest)||GN('fest');
  if(C.animal&&t.includes(C.animal)) return W(C.animal)||GN('pet');
  if(/도시|큰 거리/.test(t)&&t.includes(C.city)) return W(C.city);
  switch(kind){
    case 'town': return home();
    case 'travel': return /여행|명소|구경|관광|소풍|나들이/.test(t)?(W(C.landmark)||GN('travel')):null;
    case 'sea': return /^(wt|cs)$/.test(C.lt)?(W(C.landmark)||GN('sea')):GN('sea');
    case 'fest': return W(C.fest)||GN('fest');
    case 'job': case 'jobloss': { if(!/출근|퇴근|야근|회사|직장|면접|공장|농사|농장|논밭|어장|광산|일터|일자리|해고|실직/.test(t)) return null; const js=L.jobs||[]; return jobPh(js.find(x=>x.co&&t.includes(x.co))||js.filter(x=>x.a<=m.a).pop()); }
    case 'harvest': return GN(asia?'harvest_a':'harvest');
    case 'life': return m.a<3?GN('home_baby'):/먹|밥|음식|요리|맛/.test(t)?(W(C.food)||GN('life')):null;
    default: return GN(kind);
  } }
const jobKindOf=n=>{ for(const id in JOBS){ if(G.life&&G.life.tx(JOBS[id].n)===n) return JOBS[id].kind; } return sigKind(n); };
// 위키미디어 주소 만들기 (MediaWiki와 같은 방식으로 파일 이름을 바꾼다)
const mwEnc=f=>encodeURIComponent(f).replace(/'/g,'%27').replace(/%3B/gi,';').replace(/%40/gi,'@').replace(/%24/gi,'$').replace(/%2C/gi,',').replace(/%3A/gi,':');
function phURL(p){ const f=mwEnc(p[0]), h=p[1]; return h.endsWith('!')?`${PH_BASE}${h.slice(0,-1)}/${f}`:`${PH_BASE}thumb/${h}/${f}/500px-${f}`; }
const phFnv=t=>{ let h=0x811c9dc5; for(let i=0;i<t.length;i++){ h^=t.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return h.toString(16).padStart(8,'0'); };
const PH_CACHE=new Map();
// 미리 받아 둔 사진(이 사이트의 ph 폴더)을 먼저 쓰고, 없으면 위키미디어에서 직접 불러온다. 한 번 부른 사진은 다시 받지 않는다.
function phGet(p){ const k=p[0]; if(PH_CACHE.has(k)) return PH_CACHE.get(k);
  const local=location.protocol.startsWith('http')?phLoad('ph/'+phFnv(p[0])+'.jpg',4000):Promise.reject('no');
  const pr=local.catch(()=>phLoad(phURL(p))); PH_CACHE.set(k,pr); pr.catch(()=>PH_CACHE.delete(k)); return pr; }
function phLoad(src,ms){ return new Promise((ok,no)=>{ const i=new Image(); i.crossOrigin='anonymous'; const tm=setTimeout(()=>no('timeout'),ms||9000); i.onload=()=>{ clearTimeout(tm); ok(i); }; i.onerror=()=>{ clearTimeout(tm); no('err'); }; i.src=src; }); }
// 실제 사진을 필름 사진처럼: 살짝 기울고 당겨 찍은 구도 + 바랜 색 · 입자 · 날짜
function drawRealPhoto(cv,img,m,L,idx){ const w0=PH_W,h0=PH_H; PH_W=480; PH_H=360; try{ drawRealPhoto0(cv,img,m,L,idx); } finally{ PH_W=w0; PH_H=h0; } }
function drawRealPhoto0(cv,img,m,L,idx){ const r=phRng(Math.floor(hashStr(m.t+'|'+m.a)*1e9)), x=cv.getContext('2d'); cv.width=PH_W; cv.height=PH_H;
  const s=Math.max(PH_W/img.naturalWidth,PH_H/img.naturalHeight)*(1.04+r()*.1), w=img.naturalWidth*s, h=img.naturalHeight*s;
  x.save(); x.translate(PH_W/2,PH_H/2); x.rotate((r()-.5)*.03); x.imageSmoothingQuality='high'; x.drawImage(img,-w/2+(r()-.5)*(w-PH_W)*.5,-h/2+(r()-.5)*(h-PH_H)*.4,w,h); x.restore();
  const kind=photoKind(m), night=/fest|stage|farewell|life/.test(kind);
  finishFilm(x,r,{tone:kind==='sick'||kind==='hosp'?'#C8D8E4':kind==='farewell'?'#E8A890':'#F2C48D',toneA:.22,night,age:L.lifespan?(L.lifespan-m.a)/Math.max(30,L.lifespan):.3,date:[(L.by||2026)+m.a,1+Math.floor(r()*12),1+Math.floor(r()*28)]}); }
// 기억 하나의 사진: 실제 사진을 먼저 찾고, 없거나 불러오지 못하면 그림으로
async function drawMemPhoto(cv,m,L,idx){ const src=photoSrc(m,L,idx);
  if(src&&src.p&&(src.place||/^(town|travel|sea|fest|harvest)$/.test(photoKind(m)))){ try{ const img=await phGet(src.p); drawRealPhoto(cv,img,m,L,idx); return src; }catch(e){} }
  drawPhoto(cv,m,L,idx); return null; }
function photoCredit(src){ if(!src||!src.p) return '그림'; const f=src.p[0], a=(src.p[2]||'').replace(/\s+/g,' ').trim().slice(0,32);
  return `<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(f.replace(/ /g,'_'))}" target="_blank" rel="noopener">사진${src.place?' · '+esc(src.place):''}: ${esc(a||'위키미디어 공용')} · ${esc(src.p[3]||'')}</a>`; }
