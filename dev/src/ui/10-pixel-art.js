/* ========== 도트 그래픽 ==========
   게임보이 컬러 시절의 탑뷰 RPG처럼: 한 칸 16×16 도트, 칸마다 몇 가지 명암, 바깥쪽 한 도트 테두리.
   모든 그림은 코드로 직접 찍는 오리지널 도트이며, 한 번 그린 것은 저장해 두고 다시 쓴다. */
const PX=16, INK='#283038';
function mk(w,h){ const c=document.createElement('canvas'); c.width=Math.max(1,w|0); c.height=Math.max(1,h|0); return c; }
const CACHE=new Map();
function cached(key,w,h,fn){ let c=CACHE.get(key); if(!c){ c=mk(w,h); const x=c.getContext('2d'); x.imageSmoothingEnabled=false; fn(x,c); CACHE.set(key,c); if(CACHE.size>1500) CACHE.delete(CACHE.keys().next().value); } return c; }
function hexRGB(c){ const n=parseInt(c.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
function shade(c,f){ const [r,g,b]=hexRGB(c), m=v=>Math.max(0,Math.min(255,Math.round(f<1?v*f:v+(255-v)*(f-1)))); return '#'+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,'0')).join(''); }
// 칠해진 도트 바로 바깥의 빈 칸에 테두리를 찍는다
function outline(c,col){ const x=c.getContext('2d'), w=c.width, h=c.height, d=x.getImageData(0,0,w,h), a=d.data, o=new Uint8ClampedArray(a), [r,g,b]=hexRGB(col||INK);
  for(let y=0;y<h;y++) for(let i=0;i<w;i++){ const k=(y*w+i)*4; if(a[k+3]>0) continue;
    if((i>0&&a[k-1])||(i<w-1&&a[k+7])||(y>0&&a[k-w*4+3])||(y<h-1&&a[k+w*4+3])){ o[k]=r;o[k+1]=g;o[k+2]=b;o[k+3]=255; } }
  d.data.set(o); x.putImageData(d,0,0); return c; }
function flipX(src){ const c=mk(src.width,src.height), x=c.getContext('2d'); x.translate(src.width,0); x.scale(-1,1); x.drawImage(src,0,0); return c; }
const pr=(x,X,Y,W,H,c)=>{ x.fillStyle=c; x.fillRect(X,Y,W,H); };
function hash(a,b){ let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263))|0; h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967296; }   // 0 이상 1 미만의 고정된 무작위 값

/* ---------- 사람 ----------
   o: {dir 0아래 1왼쪽 2오른쪽 3위, fr 0서기 1·2걷기, st 'baby'|'kid'|'adult'|'elder', skin, hair, body, pants, long} */
const SKINS=['#FCE0C4','#F4C8A0','#E0A878','#C88850','#A06838','#784828'];
const SKIN_W={EA:[.4,.5,.1,0,0,0],SE:[0,.3,.5,.2,0,0],SA:[0,.1,.4,.4,.1,0],CA:[.3,.5,.2,0,0,0],ME:[.1,.4,.4,.1,0,0],AF:[0,0,0,.15,.45,.4],EU:[.6,.3,.1,0,0,0],EE:[.7,.3,0,0,0,0],NA:[.35,.2,.2,.15,.1,0],LA:[.1,.25,.35,.2,.1,0],OC:[.2,.1,.2,.3,.2,0]};
const HAIRS_DARK=['#2A2420','#3B2A20','#1E1A18'], HAIRS_LIGHT=['#E8C070','#8A5A30','#B05030','#5A3A20','#2A2420'];
const CLOTHES=['#E05838','#3870D0','#40A048','#E8B030','#9050C0','#E07098','#30A0A0','#F08030','#5868C8','#C84860'];
function randLook(rg,base){ const w=SKIN_W[rg]||SKIN_W.EA; let si=drawIdx(w); if(base){ si=clamp(base.si+(R()<.7?0:R()<.5?-1:1),0,5); }
  const light=['EU','EE','NA'].includes(rg)&&R()<.45;
  return {si,skin:SKINS[si],hair:light?pickOne(HAIRS_LIGHT):pickOne(HAIRS_DARK),body:pickOne(CLOTHES),pants:pickOne(['#384868','#484040','#586878','#283850','#6A5040'])}; }
function personSpriteOld(o){
  const key=['P',o.dir,o.fr,o.st,o.skin,o.hair,o.body,o.pants,o.long?1:0,o.hat||''].join('|');
  if(o.dir===2){ return cached(key,16,16,(x,c)=>{ drawSpr(x,personSprite(Object.assign({},o,{dir:1})),0,0); const f=flipX(c); x.clearRect(0,0,16,16); x.drawImage(f,0,0); }); }
  return cached(key,16,16,(x,c)=>{
    const P=(X,Y,W,H,col)=>pr(x,X,Y,W,H,col), sk=o.skin, skD=shade(sk,.85), hr=o.hair, hrD=shade(hr,.75), hrL=shade(hr,1.35), bd=o.body, bdD=shade(bd,.75), pt=o.pants, sh='#403030', d=o.dir, fr=o.fr, st=o.st;
    if(st==='baby'){                       // 기어 다니는 아기
      if(d===1){ const a=fr===1?1:0; P(3,9,8,4,bd); P(3,12,8,1,bdD); P(2+a,13,2,1,sk); P(8-a,13,2,1,sk); P(9,6,5,5,sk); P(9,6,5,1,hr); P(12,5,2,2,hr); P(10,8,1,1,INK); P(13,10,1,1,skD); }
      else { const a=fr===1?1:0; P(5,9,6,4,bd); P(5,12,6,1,bdD); P(3,10+a,2,2,sk); P(11,11-a,2,2,sk); P(5,3,6,6,sk); P(5,8,6,1,skD); P(6,2,4,2,hr); if(d===0){ P(6,5,1,1,INK); P(9,5,1,1,INK); } else P(5,3,6,4,hr); }
      outline(c); return; }
    const kid=st==='kid', el=st==='elder', yo=kid?2:el?1:0;     // 아이는 몸이 짧고, 노인은 조금 굽었다
    const bodyY=8+yo, bodyH=kid?3:4, legY=bodyY+bodyH, legH=kid?1:2;
    // 다리
    const L1=fr===1?1:0, L2=fr===2?1:0;
    if(d===1){ if(fr===0){ P(6,legY,4,legH,pt); P(5,legY+legH,5,1,sh); } else { P(5,legY,2,legH+L1-L2,pt); P(9,legY,2,legH+L2-L1,pt); P(4,legY+legH+L1-L2,3,1,sh); P(9,legY+legH+L2-L1,3,1,sh); } }
    else { P(5,legY,2,legH-L2,pt); P(9,legY,2,legH-L1,pt); P(5,legY+legH-L2,2,1,sh); P(9,legY+legH-L1,2,1,sh); }
    // 긴 머리는 몸 뒤로
    if(o.long&&d!==3){ if(d===1){ P(9,3+yo,3,7,hr); } else { P(3,4+yo,1,6,hr); P(12,4+yo,1,6,hr); } }
    // 몸과 팔
    if(d===1){ P(5,bodyY,6,bodyH,bd); P(5,bodyY+bodyH-1,6,1,bdD); const sw=fr===1?1:fr===2?-1:0; P(7+sw,bodyY+1,2,bodyH-1,bdD); P(7+sw,bodyY+bodyH,2,1,sk); }
    else { P(4,bodyY,8,bodyH,bd); P(4,bodyY+bodyH-1,8,1,bdD); P(10,bodyY,2,bodyH,bdD); const a1=fr===1?1:0, a2=fr===2?1:0;
      P(3,bodyY+a1,1,bodyH-1,bd); P(12,bodyY+a2,1,bodyH-1,bdD); P(3,bodyY+bodyH-1+a1,1,1,sk); P(12,bodyY+bodyH-1+a2,1,1,sk); if(o.long&&d===3) P(4,bodyY,8,2,hr); }
    // 머리
    const hy=1+yo;
    if(d===3){ P(3,hy,10,7,hr); P(4,hy,6,1,hrL); P(3,hy+6,10,1,hrD); }
    else if(d===1){ P(4,hy+1,7,6,sk); P(4,hy+6,7,1,skD); P(4,hy,8,3,hr); P(9,hy+1,3,5,hr); P(10,hy+5,2,1,hrD); P(5,hy,3,1,hrL); P(5,hy+3,1,1,hr); P(5,hy+4,1,2,INK); P(4,hy+6,1,1,skD); }
    else { P(4,hy+1,8,6,sk); P(4,hy+6,8,1,skD); P(3,hy,10,3,hr); P(3,hy+3,1,3,hr); P(12,hy+3,1,3,hr); P(4,hy+3,2,1,hr); P(10,hy+3,2,1,hr); P(5,hy,3,1,hrL); P(5,hy+4,1,2,INK); P(10,hy+4,1,2,INK); P(4,hy+5,1,1,shade(sk,.9)); }
    if(o.hat){ P(2,hy-1,12,2,o.hat); P(4,hy-2,8,1,o.hat); }
    if(el){ if(d===1) P(3,bodyY+1,1,legY+legH-bodyY,'#7A5A3C'); else if(d!==3) P(13,bodyY+1,1,legY+legH-bodyY,'#7A5A3C'); }
    outline(c);
  });
}
/* ---------- 탈것 · 동물 (오른쪽을 향한 그림, 왼쪽은 뒤집는다) ---------- */
function vehicleSprite2(kind,face,col,rider){
  const rk=rider?[rider.skin,rider.hair,rider.body,rider.pants||'',rider.st||'',rider.long?1:0,rider.sty|0].join(','):'';
  const key=['V2',kind,face,col,rk].join('|'), w=kind==='car'?28:kind==='horse'?30:kind==='moto'?28:26, h=kind==='car'?18:kind==='horse'?30:28;
  if(face<0) return cached(key,w,h,(x)=>x.drawImage(flipX(vehicleSprite(kind,1,col,rider)),0,0));
  return cached(key,w,h,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X,Y,W,H,cc), cD=shade(col,.7), cL=shade(col,1.35), tire='#303038', rim='#A8B0B8';
    const ln=(x0,y0,x1,y1,cc,t)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1); for(let i=0;i<=n;i++) P(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),t||1,t||1,cc); };
    const wheel=(cx,cy,th)=>{ [[-1,-3],[0,-3],[1,-3],[-2,-2],[2,-2],[-3,-1],[3,-1],[-3,0],[3,0],[-3,1],[3,1],[-2,2],[2,2],[-1,3],[0,3],[1,3]].forEach(([dx,dy])=>P(cx+dx,cy+dy,1,1,tire));
      if(th){ [[-1,-2],[0,-2],[1,-2],[-2,-1],[2,-1],[-2,0],[2,0],[-2,1],[2,1],[-1,2],[0,2],[1,2]].forEach(([dx,dy])=>P(cx+dx,cy+dy,1,1,'#484852')); }
      P(cx,cy,1,1,rim); if(!th){ P(cx-2,cy,1,1,rim); P(cx+2,cy,1,1,rim); P(cx,cy-2,1,1,rim); P(cx,cy+2,1,1,rim); } };
    // 타는 사람: 걷는 그림과 똑같은 사람의 윗몸을 안장에 앉히고, 굽힌 다리와 앞으로 뻗은 팔만 더 그린다
    const R=rider?Object.assign({pants:'#384868',st:'adult'},rider):null;
    const seat=(sx,sy,hand,foot)=>{ if(!R) return; const st=R.st==='baby'||R.st==='tod'?'kid':R.st, D=personDims(st), pt=R.pants, ptD=shade(pt,.8);
      const half=personSprite({dir:2,fr:0,st,skin:R.skin,hair:R.hair,body:R.body,pants:pt,long:R.long,sty:R.sty|0,half:1});
      ln(sx,sy,foot[0],foot[1]-1,pt,2); P(foot[0]-1,foot[1],4,1,'#3A2E2E');                       // 굽힌 다리와 신발
      x.drawImage(half,sx-8,sy-23);                                                            // 윗몸 (엉덩이가 안장 위에)
      const shY=sy-D.tH+1; ln(sx+1,shY,hand[0]-1,hand[1],shade(R.body,.85),2); P(hand[0],hand[1],2,2,R.skin); };
    if(kind==='car'){ P(1,8,26,6,col); P(1,12,26,2,cD); P(6,3,15,6,col); P(8,4,5,4,'#BFE3F5'); P(14,4,5,4,'#BFE3F5'); P(8,4,2,1,'#FFFFFF'); P(2,8,4,1,cL); P(25,9,2,2,'#FFE9A8'); P(1,10,1,2,'#E05050');
      P(4,13,5,4,tire); P(19,13,5,4,tire); P(6,14,1,2,rim); P(21,14,1,2,rim); }
    else if(kind==='cycle'){
      wheel(5,23); wheel(20,23);
      ln(5,23,10,18,col); ln(5,23,11,23,col); ln(11,23,10,18,col); ln(10,18,17,18,col); ln(11,23,17,18,col); ln(17,18,20,23,col);
      P(17,14,1,4,'#505860'); P(16,14,3,1,'#505860'); P(8,17,4,1,'#3A3030'); P(10,22,3,2,'#404850');
      seat(10,17,[16,13],[12,23]); P(17,14,1,1,'#505860'); }
    else if(kind==='moto'){
      wheel(5,23,1); wheel(22,23,1);
      P(7,18,13,3,col); P(8,17,10,1,col); P(8,17,4,1,cL); P(7,20,13,1,cD); P(10,21,6,2,'#4A4C54'); P(3,19,6,1,'#7A7E86'); P(19,13,1,7,'#606870'); P(18,13,3,1,'#606870'); P(21,16,2,2,'#FFE9A8');
      P(7,16,6,1,'#2E2A2A'); seat(10,16,[18,12],[14,21]); }
    else { const b='#9A6A40', bD=shade(b,.75), bL=shade(b,1.2);
      P(4,15,18,7,b); P(4,15,18,1,bL); P(4,21,18,1,bD); P(20,8,5,9,b); P(22,6,6,5,b); P(27,8,1,2,b); P(25,8,1,1,INK); P(22,4,2,3,bD); P(19,8,2,7,'#4A3020'); P(2,15,3,6,'#4A3020');
      P(5,22,2,7,bD); P(9,22,2,7,b); P(16,22,2,7,bD); P(20,22,2,7,b); P(5,28,2,1,'#2A2020'); P(9,28,2,1,'#2A2020'); P(16,28,2,1,'#2A2020'); P(20,28,2,1,'#2A2020');
      P(8,13,8,3,'#C04040'); P(8,15,8,1,'#8A2A2A'); seat(12,14,[21,11],[14,21]); }
    outline(c); });
}
function animalSprite(kind,fr,face){
  const key=['A',kind,fr,face].join('|');
  if(face<0) return cached(key,12,12,(x)=>x.drawImage(flipX(animalSprite(kind,fr,1)),0,0));
  return cached(key,12,12,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X,Y,W,H,cc), s=fr?1:0;
    if(kind==='chick'){ P(2,4,6,5,'#F8F8F0'); P(7,2,3,3,'#F8F8F0'); P(10,3,1,1,'#E8A030'); P(8,1,1,1,'#E04040'); P(8,3,1,1,INK); P(3+s,9,1,2,'#E8A030'); P(6-s,9,1,2,'#E8A030'); P(2,5,2,2,'#D8D8D0'); }
    else if(kind==='cat'){ P(1,5,7,4,'#E8A050'); P(7,2,4,4,'#E8A050'); P(7,1,1,1,'#E8A050'); P(10,1,1,1,'#E8A050'); P(9,3,1,1,INK); P(0,3,1,3,'#E8A050'); P(2+s,9,1,2,'#C88040'); P(6-s,9,1,2,'#C88040'); P(3,6,3,1,'#C88040'); }
    else { P(1,4,7,4,'#B08050'); P(7,2,4,4,'#B08050'); P(10,4,1,1,INK); P(7,2,1,3,'#7A5030'); P(8,3,1,1,INK); P(0,3,1,2,'#B08050'); P(2+s,8,1,3,'#8A6040'); P(6-s,8,1,3,'#8A6040'); }
    outline(c); });
}

/* ---------- 땅 칸 ---------- */
const GRASS=[['#D0F0A0','#A8D878','#78B850','#4A7830'],['#C0E890','#88C860','#58A040','#305820'],['#F0E0A8','#D8C078','#B89850','#786030'],['#FFFFFF','#E8EEF4','#C0CCD8','#8090A8'],['#F8E8C0','#EAD3A2','#D0B078','#A08050']];
// 땅 색 번호: 0 봄빛 · 1 짙은 초록 · 2 마른 빛 · 3 눈 · 4 사막
const spOf=L=>L.C.arid?4:L.C.sp[L.pi%4];
function groundTile(type,sp,v,fr){
  return cached(['G',type,sp,v,fr].join('|'),16,16,(x)=>{ const P=(X,Y,W,H,c)=>pr(x,X,Y,W,H,c), g=GRASS[sp];
    const tufts=(n,c1,c2)=>{ for(let i=0;i<n;i++){ const a=Math.floor(hash(v,i)*12)+1, b=Math.floor(hash(i,v+7)*12)+2; P(a,b,1,1,c1); P(a+1,b+1,1,1,c1); P(a+2,b,1,1,c1); if(c2) P(a+1,b-1,1,1,c2); } };
    if(type==='g'){ P(0,0,16,16,g[1]); tufts(2,g[2],g[0]); }
    else if(type==='t'&&sp===3){ P(0,0,16,16,g[1]); tufts(1,g[2]); }
    else if(type==='t'){ P(0,0,16,16,g[2]); for(let i=0;i<4;i++){ const a=i*4+1; P(a,4,1,4,g[3]); P(a+2,9,1,4,g[3]); P(a+1,3,1,2,g[1]); P(a+3,8,1,2,g[1]); } }
    else if(type==='f'){ P(0,0,16,16,g[1]); tufts(1,g[2]); const cs=sp===3?['#E8F0F8','#D0D8E0']:[['#F8F8F8','#F06080','#F8D030'][v%3],'#F8D030'], o=fr?1:0;
      [[3,3],[10,9]].forEach(([a,b])=>{ P(a+o,b,3,1,cs[0]); P(a+1+o,b-1,1,3,cs[0]); P(a+1+o,b,1,1,cs[1]); P(a+1,b+2,1,2,g[3]); }); }
    else if(type==='p'){ P(0,0,16,16,'#E8D4A0'); for(let i=0;i<4;i++) P(Math.floor(hash(v,i)*14)+1,Math.floor(hash(i,v)*14)+1,2,1,'#C8AC78'); }
    else if(type==='k'){ P(0,0,16,16,'#D8D8D0'); P(0,0,16,1,'#B8B8B0'); P(0,8,16,1,'#B8B8B0'); P(0,0,1,8,'#B8B8B0'); P(8,8,1,8,'#B8B8B0'); }
    else if(type==='r'){ P(0,0,16,16,'#6E767E'); for(let i=0;i<5;i++) P(Math.floor(hash(v,i)*15),Math.floor(hash(i,v+3)*15),1,1,i%2?'#626A72':'#7C848C'); }
    else if(type==='d'){ P(0,0,16,16,'#C8A878'); P(0,4,16,1,'#B09060'); P(0,11,16,1,'#B09060'); for(let i=0;i<3;i++) P(Math.floor(hash(v,i)*14),Math.floor(hash(i,v)*14),2,1,'#D8BC90'); }
    else if(type==='h'){ P(0,0,16,16,'#585E68'); for(let i=0;i<4;i++) P(Math.floor(hash(v,i)*15),Math.floor(hash(i,v+9)*15),1,1,'#4E545E'); }
    else if(type==='w'){ P(0,0,16,16,'#3C90E0'); const o=fr%4; for(let i=0;i<3;i++){ const yy=(i*5+2)%16, xx=(i*6+o*2+v*3)%14; P(xx,yy,3,1,'#9ACCF8'); P(xx+1,yy+1,2,1,'#62A8F0'); } }
    else if(type==='s'){ P(0,0,16,16,'#F0DCA0'); for(let i=0;i<4;i++) P(Math.floor(hash(v,i)*15),Math.floor(hash(i,v+5)*15),1,1,'#D8C080'); }
    else if(type==='z'){ P(0,0,16,16,'#E8D0A0'); P(0,10,16,6,'#E0C690'); for(let i=0;i<3;i++) P(Math.floor(hash(v,i)*13),Math.floor(hash(i,v)*6)+2,3,1,'#D0B07A'); }   // 사막 모래
  }); }
/* ---------- 나무 ---------- */
const TREE_COL=[['#F4B0C8','#E08AA8','#B8607E'],['#58A848','#3A8030','#285820'],['#E8A040','#C87828','#905018'],['#F4F8FC','#C8D4E0','#8898B0'],['#78A848','#58883A','#3A6028']];
function treeSprite(type,sp,v){
  return cached(['T',type,sp,v].join('|'),16,20,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X,Y,W,H,cc), col=type==='palm'||type==='bush'?TREE_COL[1]:TREE_COL[sp];
    if(type==='palm'){ P(7,8,2,11,'#9A7048'); P(7,10,2,1,'#7A5030'); P(8,14,1,1,'#7A5030'); const f='#4AA040', fD='#2E7A2A';
      P(2,4,12,2,f); P(1,6,3,2,fD); P(12,6,3,2,fD); P(5,2,6,2,f); P(4,1,2,1,fD); P(10,1,2,1,fD); P(7,5,2,2,'#8A5A30'); }
    else if(type==='pine'){ const f=sp===3?'#E8EEF4':'#3A7A48', fD=sp===3?'#B8C4D0':'#24583A'; for(let i=0;i<4;i++){ const w=4+i*3; P(8-w/2,2+i*3,w,3,f); P(8,2+i*3,w/2,3,fD); } P(7,14,2,5,'#7A5030'); }
    else if(type==='bush'){ P(2,9,12,8,col[0]); P(2,14,12,3,col[1]); P(4,8,8,2,col[0]); P(4,10,2,1,shade(col[0],1.25)); }
    else if(type==='cactus'){ P(6,4,4,14,'#4A9A50'); P(2,8,3,2,'#4A9A50'); P(2,6,2,3,'#4A9A50'); P(11,9,3,2,'#4A9A50'); P(12,7,2,3,'#4A9A50'); P(8,4,2,14,'#3A7A40'); }
    else { for(let yy=0;yy<14;yy++) for(let xx=0;xx<16;xx++){ const dx=(xx-7.5)/7.5, dy=(yy-6.5)/6.5; if(dx*dx+dy*dy<=1) P(xx,yy+1,1,1,dx+dy>.5?col[1]:col[0]); }
      P(4,3,3,1,shade(col[0],1.2)); P(3,4,2,1,shade(col[0],1.2)); P(9,9,2,1,col[2]); P(6,8,1,1,col[2]); P(6,14,4,5,'#8A5A30'); P(8,14,2,5,'#6A4220'); }
    outline(c); }); }
function treeTypeFor(rg,i){ const h=hash(i,31);
  if(['SE','OC','LA'].includes(rg)) return h<.45?'palm':h<.85?'round':'bush';
  if(rg==='ME') return h<.5?'palm':h<.8?'bush':'round';
  if(rg==='AF'||rg==='SA') return h<.25?'palm':h<.8?'round':'bush';
  if(['EE','CA'].includes(rg)) return h<.45?'pine':'round';
  if(['EU','NA'].includes(rg)) return h<.3?'pine':'round';
  return 'round'; }

/* ---------- 건물 ----------
   지붕 모양: gable 맞배 · flat 평지붕 · tin 함석 · hanok 기와 · thatch 초가 · dome 둥근 지붕 · saw 공장 톱니 · awning 차양 · canopy 역 · cave 광산 */
const BSTYLE={ house:{wall:'#F3E3C7',roof:'#C8503A',rt:'gable',win:'two'}, hanok:{wall:'#F1E7D6',roof:'#4F5D6B',rt:'hanok',win:'two'}, apt:{wall:'#DDE3EA',roof:'#8C99A6',rt:'flat',win:'grid'},
  school:{wall:'#F4E9CF',roof:'#5878B0',rt:'flat',win:'wide',sign:'clock'}, shop:{wall:'#FFF4E0',roof:'#E0A040',rt:'awning',win:'front',sign:'bag'}, cafe:{wall:'#F1E4D3',roof:'#8E5B3A',rt:'awning',win:'front',sign:'cup'},
  market:{wall:'#F6E7C8',roof:'#D46A4C',rt:'awning',win:'front',sign:'bag'}, office:{wall:'#A9C1D6',roof:'#5F7790',rt:'flat',win:'grid'}, hospital:{wall:'#F7FAFB',roof:'#9FB3BF',rt:'flat',win:'grid',sign:'cross'},
  hall:{wall:'#E6EBD9',roof:'#6E8B5E',rt:'gable',win:'two',sign:'flag'}, station:{wall:'#E3E6EF',roof:'#5E6C8F',rt:'canopy',win:'front',sign:'bus'}, barn:{wall:'#C65B4A',roof:'#7A2E24',rt:'gable',win:'barn'},
  studio:{wall:'#E9DDF0',roof:'#7B5EA7',rt:'gable',win:'two',sign:'star'}, flat:{wall:'#F2C88F',roof:'#C96B4B',rt:'flat',win:'two',tank:1}, tin:{wall:'#D8A46A',roof:'#9AA3A8',rt:'tin',win:'two'},
  thatch:{wall:'#D8B888',roof:'#C8A050',rt:'thatch',win:'two'}, factory:{wall:'#B8BCC4',roof:'#787E88',rt:'saw',win:'grid',chimney:1}, mine:{wall:'#8A7A68',roof:'#6A5A48',rt:'cave',win:'none'},
  port:{wall:'#C8D8E0',roof:'#3870A0',rt:'gable',win:'two',sign:'fish'}, kiosk:{wall:'#FFF0D0',roof:'#30A0A0',rt:'awning',win:'front',sign:'flag'}, dome:{wall:'#F3ECDD',roof:'#3F8FA8',rt:'dome',win:'two'},
  ger:{wall:'#F4F0E4',roof:'#E8E0CC',rt:'ger',win:'none'}, stilt:{wall:'#B88A58',roof:'#C8A050',rt:'thatch',win:'two',stilt:1}, adobe:{wall:'#D0A070',roof:'#B88858',rt:'adobe',win:'small'},
  schoolS:{wall:'#EFE4C8',roof:'#8C969E',rt:'tin',win:'two',sign:'clock'}, clinic:{wall:'#F2F2EA',roof:'#9AA3A8',rt:'tin',win:'two',sign:'cross'}, tinS:{wall:'#C9A27A',roof:'#8F989E',rt:'tin',win:'two'} };   // 살림이 어려운 나라의 학교·보건소·집
function buildingSpriteBase(kind,w,h,pal,enter){
  const st=Object.assign({},BSTYLE[kind]||BSTYLE.house,pal||{});
  return cached(['B',kind,w,h,st.wall,st.roof,enter?1:0].join('|'),w+2,h+12,(x,c)=>{
    const P=(X,Y,W,H,cc)=>pr(x,X+1,Y+10,W,H,cc), wall=st.wall, wD=shade(wall,.82), roof=st.roof, rD=shade(roof,.72), rL=shade(roof,1.25), glass='#9ED0F0', gL='#E0F4FF';
    if(st.rt==='ger'){ const cx=Math.floor(w/2), top=Math.round(h*.38), bw=w-6;
      for(let yy=0;yy<h-top;yy++){ const cut=yy<2?2-yy:0; P(3+cut,top+yy,bw-cut*2,1,st.wall); }
      P(3,top+4,bw,3,'#3870B0'); for(let xx=5;xx<bw;xx+=6) P(xx,top+5,3,1,'#F8F0D8'); P(3,h-3,bw,3,shade(st.wall,.85)); P(w-8,top,5,h-top-3,shade(st.wall,.9));
      for(let i=0;i<=top;i++){ const ww=Math.round(6+(i/top)*(w/2+1)); P(cx-ww,i,ww*2,1,i<3?'#7A5A3C':i%4===0?shade(st.roof,.85):st.roof); }
      for(let k=-3;k<=3;k++){ for(let i=3;i<top;i+=1){ const xx=cx+Math.round(k*(i/top)*(w/7)); P(xx,i,1,1,shade(st.roof,.8)); } }
      P(cx-6,h-15,12,15,'#C04838'); P(cx-5,h-14,10,14,'#E07038'); P(cx-1,h-14,2,14,'#F0B050'); if(enter) P(cx-7,h,14,1,'#E2703A'); outline(c); return; }
    const rh=st.rt==='flat'||st.rt==='adobe'||st.rt==='dome'?6:st.rt==='awning'||st.rt==='canopy'?Math.round(h*.3):st.rt==='saw'?10:st.rt==='cave'?h:Math.round(h*.46);
    // 벽
    if(st.rt!=='cave'){ P(0,rh-2,w,h-rh+2,wall); P(0,h-3,w,3,wD); P(w-3,rh-2,3,h-rh-1,shade(wall,.9)); }
    // 지붕
    if(st.rt==='gable'||st.rt==='hanok'||st.rt==='thatch'||st.rt==='tin'){
      P(-1,0,w+2,rh,roof); P(Math.floor(w/2),0,Math.ceil(w/2)+1,rh,rD); P(-1,rh-2,w+2,2,shade(roof,.6));
      if(st.rt==='gable') for(let y=3;y<rh-2;y+=3){ P(-1,y,w+2,1,shade(roof,.85)); for(let xx=(y%2)*3;xx<w;xx+=6) P(xx,y-2,1,2,shade(roof,.85)); }
      if(st.rt==='tin') for(let xx=0;xx<w;xx+=3) P(xx,0,1,rh-2,shade(roof,.8));
      if(st.rt==='thatch') for(let y=1;y<rh-2;y+=2) for(let xx=(y%4);xx<w;xx+=4) P(xx,y,2,1,shade(roof,.8));
      if(st.rt==='hanok'){ P(-3,rh-4,3,2,roof); P(w,rh-4,3,2,rD); for(let xx=1;xx<w;xx+=3) P(xx,1,1,rh-3,shade(roof,.85)); P(0,0,w,1,'#E8E8E0'); }
      P(0,0,Math.floor(w/2),1,rL); }
    else if(st.rt==='adobe'){ P(0,0,w,rh,shade(st.wall,.92)); P(0,0,w,1,shade(st.wall,1.15)); for(let xx=3;xx<w;xx+=7) P(xx,rh,2,2,'#6A4A2A'); P(Math.floor(w/2)-3,-4,6,4,shade(st.wall,.92)); }
    else if(st.rt==='flat'||st.rt==='dome'){ P(0,0,w,rh,roof); P(0,rh-2,w,2,rD); P(0,0,w,1,rL); if(st.tank){ P(w-10,-6,6,6,'#5A80A8'); P(w-10,-6,6,1,'#7AA0C8'); } else if(kind!=='dome') { P(4,-3,6,3,'#9AA4AC'); P(5,-2,4,1,'#B8C0C8'); }
      if(st.rt==='dome'){ const cx=Math.floor(w/2); for(let i=0;i<8;i++){ const ww=Math.round(Math.sqrt(64-(i-8)*(i-8))*1.6); P(cx-ww,-8+i,ww*2,1,i<3?rL:roof); } P(cx,-10,1,3,'#E8C050'); } }
    else if(st.rt==='saw'){ for(let xx=0;xx<w;xx+=10){ for(let i=0;i<8;i++) P(xx+i,8-i,10-i,1,i<2?rD:roof); P(xx,0,1,9,glass); } P(0,8,w,2,rD); if(st.chimney){ P(w-8,-9,5,18,'#8A6A58'); P(w-8,-9,5,2,'#5A4A40'); } }
    else if(st.rt==='awning'||st.rt==='canopy'){ P(0,0,w,rh-4,wall); P(0,0,w,2,roof); const n=Math.max(4,Math.round(w/6)); for(let i=0;i<n;i++) P(Math.floor(w*i/n),rh-5,Math.ceil(w/n),5,i%2?'#FFFFFF':roof); P(0,rh-1,w,1,rD); }
    else if(st.rt==='cave'){ for(let yy=0;yy<h;yy++){ const ww=Math.round(w*(.55+.45*yy/h)); P(Math.floor((w-ww)/2),yy,ww,1,yy<3?shade(wall,1.2):wall); } for(let i=0;i<6;i++) P(Math.floor(hash(w,i)*(w-6))+3,Math.floor(hash(i,h)*(h-8))+3,3,2,wD);
      const dw=Math.round(w*.42), dx=Math.floor((w-dw)/2); P(dx,h-Math.round(h*.55),dw,Math.round(h*.55),'#201810'); P(dx-1,h-Math.round(h*.55)-1,dw+2,2,'#7A5A30'); P(dx,h-3,dw,1,'#8A8070'); P(dx+3,h-6,6,3,'#606870'); }
    // 창문
    const winY=rh+2, door=enter, dw=Math.min(12,Math.max(8,Math.round(w*.16))), dh=Math.min(14,h-rh-3), dx=Math.floor(w/2-dw/2), dy=h-dh;
    const win=(X,Y,W,H)=>{ P(X,Y,W,H,'#5A6878'); P(X+1,Y+1,W-2,H-2,glass); P(X+1,Y+1,Math.max(1,Math.floor((W-2)/2)),1,gL); };
    if(st.win==='two'){ const ww=Math.min(10,Math.floor((w-dw)/2)-6); if(ww>=4){ win(4,winY+1,ww,Math.min(8,dh-4)); win(w-4-ww,winY+1,ww,Math.min(8,dh-4)); } }
    else if(st.win==='grid'||st.win==='wide'){ const ww=st.win==='wide'?10:6; for(let y=winY;y<h-dh-1||(y<h-8&&y+7<dy);y+=9) for(let xx=3;xx+ww<w-2;xx+=ww+4){ if(y+7>dy-1&&xx+ww>dx-2&&xx<dx+dw+2) continue; win(xx,y,ww,7); } }
    else if(st.win==='front'){ const ww=Math.floor((w-dw)/2)-5; if(ww>=4){ win(3,h-12,ww,9); win(w-3-ww,h-12,ww,9); } }
    else if(st.win==='small'){ win(4,winY+3,5,5); win(w-9,winY+3,5,5); }
    else if(st.win==='barn'){ P(dx-3,dy-3,dw+6,dh+3,shade(wall,.75)); }
    // 문
    if(st.rt!=='cave'){ P(dx,dy,dw,dh,door?'#FFE9A8':'#7A5236'); P(dx,dy,dw,1,shade('#7A5236',.7)); if(door){ P(dx+1,dy+1,dw-2,dh-1,'#FFF6D0'); P(dx-1,h,dw+2,1,'#E2703A'); } else P(dx+dw-3,dy+Math.floor(dh/2),1,1,'#F2C14E'); }
    // 간판 그림
    const sx=dx+dw+2, sy=dy-8; if(st.sign&&sx+7<w){ P(sx,sy,7,7,'#FFFFFF'); const ic=st.sign;
      if(ic==='cross'){ P(sx+3,sy+1,1,5,'#E04848'); P(sx+1,sy+3,5,1,'#E04848'); } else if(ic==='clock'){ P(sx+1,sy+1,5,5,'#F8E8B0'); P(sx+3,sy+2,1,2,INK); P(sx+3,sy+3,2,1,INK); }
      else if(ic==='bag'){ P(sx+1,sy+3,5,3,'#E07040'); P(sx+2,sy+1,3,2,'#E07040'); x.clearRect(sx+4,sy+12,1,1); } else if(ic==='cup'){ P(sx+1,sy+2,4,4,'#8E5B3A'); P(sx+5,sy+3,1,2,'#8E5B3A'); }
      else if(ic==='flag'){ P(sx+1,sy+1,1,5,'#606870'); P(sx+2,sy+1,4,3,'#E2703A'); } else if(ic==='bus'){ P(sx+1,sy+1,5,4,'#3870D0'); P(sx+2,sy+2,3,1,glass); P(sx+1,sy+5,1,1,INK); P(sx+5,sy+5,1,1,INK); }
      else if(ic==='fish'){ P(sx+1,sy+3,4,2,'#3870D0'); P(sx+5,sy+2,1,4,'#3870D0'); } else if(ic==='star'){ P(sx+3,sy+1,1,5,'#E8B030'); P(sx+1,sy+3,5,1,'#E8B030'); } }
    if(st.stilt){ const img=x.getImageData(0,0,c.width,c.height); x.clearRect(0,0,c.width,c.height); x.putImageData(img,0,-6); P(2,h-6,w-4,6,'rgba(40,30,20,.35)'); P(2,h-6,3,6,'#6A4A2A'); P(w-5,h-6,3,6,'#6A4A2A'); P(Math.floor(w/2)-8,h-6,3,6,'#6A4A2A'); P(Math.floor(w/2)+5,h-6,3,6,'#6A4A2A'); for(let i=0;i<3;i++) P(dx+1,h-5+i*2,dw-2,1,'#8A643C'); }
    outline(c);
  }); }
/* ---------- 집·학교·일터 안의 가구 ---------- */
function furnSprite(type,w,h,kind){
  return cached(['F',type,w,h,kind||''].join('|'),w+2,h+2,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X+1,Y+1,W,H,cc);
    const wood='#B88A58', wD='#8A643C';
    switch(type){
      case 'counter': P(0,0,w,h,'#C8D0D8'); P(0,h-3,w,3,'#98A0A8'); P(3,3,10,6,'#58606A'); P(5,4,2,2,'#E05038'); P(9,4,2,2,'#E05038'); P(w-14,3,10,6,'#A8C8E0'); P(w-12,4,6,3,'#E0F0F8'); break;
      case 'table': P(0,0,w,h,wood); P(0,h-3,w,3,wD); P(4,3,5,4,'#FFFFFF'); P(w-10,4,5,4,'#FFFFFF'); P(5,4,3,2,'#E8A040'); break;
      case 'sofa': P(0,0,w,h,'#7C93B8'); P(2,h-6,w-4,5,'#9FB3D3'); P(0,0,w,3,'#5A6E90'); P(0,0,3,h,'#5A6E90'); P(w-3,0,3,h,'#5A6E90'); break;
      case 'tv': P(0,0,w,h,'#22303B'); P(2,1,w-4,h-3,'#5E9BD1'); P(3,2,4,1,'#A8D0F0'); break;
      case 'bed': P(0,0,w,h,'#E5C7D2'); P(2,2,8,h-4,'#FFFFFF'); P(12,0,w-12,h,'#D48AA8'); P(12,h-3,w-12,3,'#B86A88'); break;
      case 'mat': P(0,0,w,h,'#D8B878'); for(let i=2;i<w;i+=4) P(i,0,1,h,'#B8985A'); for(let j=2;j<h;j+=4) P(0,j,w,1,'#C8A868'); P(0,0,w,1,'#A8884A'); P(0,h-1,w,1,'#A8884A'); break;
      case 'radio': P(Math.round(w/2)-6,h-3,12,3,wD); P(Math.round(w/2)-5,1,10,h-4,'#6A4A2E'); P(Math.round(w/2)-4,2,4,4,'#3A3A3A'); P(Math.round(w/2)+1,2,3,1,'#E8C040'); P(Math.round(w/2)+1,4,3,1,'#E8C040'); P(Math.round(w/2)+4,-2,1,4,'#888888'); break;
      case 'hearth': P(0,h-4,w,4,'#9A8A78'); P(3,2,10,h-6,'#5A5048'); P(5,1,6,2,'#E87030'); P(6,0,4,1,'#F8C040'); P(w-16,2,8,h-6,'#4A6A8A'); P(w-15,1,6,2,'#6A8AAA'); P(w-6,4,4,h-8,'#C89048'); break;
      case 'piano': P(0,0,w,h,'#2B2B2B'); for(let i=2;i<w-2;i+=3) P(i,h-5,2,4,'#F8F8F8'); break;
      case 'board':
        if(kind==='office'){ P(0,0,w,h,'#F8F8F8'); P(0,h-1,w,1,'#A8B0B8'); P(6,2,20,1,'#3870D0'); P(40,3,24,1,'#E05050'); P(70,2,14,2,'#40A048'); }
        else if(kind==='factory'){ P(0,0,w,h,'#585E68'); for(let i=0;i<w;i+=6) P(i,1,3,h-2,'#787E88'); P(10,0,8,h-1,'#C89048'); P(44,0,8,h-1,'#C89048'); }
        else if(kind==='farm'||kind==='herd'){ P(0,0,w,h,'#8A643C'); for(let i=4;i<w;i+=12){ P(i,1,1,h-2,'#C8C8C8'); P(i-2,1,5,2,'#787E88'); } }
        else if(kind==='shop'||kind==='tour'){ P(0,0,w,h,'#B88A58'); for(let i=2;i<w-4;i+=5) P(i,1,4,h-3,CLOTHES[(i/5|0)%CLOTHES.length]); }
        else if(kind==='hosp'){ P(0,0,w,h,'#C8E0F0'); for(let i=0;i<w;i+=8) P(i,0,1,h,'#A8C8E0'); }
        else if(kind==='mine'){ P(0,0,w,h,'#6A5A48'); P(20,1,4,4,'#F8D048'); P(60,1,4,4,'#F8D048'); }
        else if(kind==='fish'){ P(0,0,w,h,'#A8784A'); for(let i=0;i<w;i+=4){ P(i,0,1,h,'#D8C8A8'); } P(0,3,w,1,'#D8C8A8'); }
        else if(kind==='dream'){ P(0,0,w,h,'#EDE0F0'); P(6,0,16,h,'#3870D0'); P(30,0,14,h,'#E8B030'); P(52,0,18,h,'#E05838'); }
        else if(kind==='part'){ P(0,0,w,h,'#C89858'); P(8,1,10,5,'#F8F8F0'); P(26,1,8,5,'#F8E890'); P(44,1,12,5,'#F8F8F0'); }
        else { P(0,0,w,h,'#2F5D50'); P(0,h-1,w,1,'#8A643C'); P(6,2,20,1,'#E8E8E8'); P(40,3,24,1,'#E8E8E8'); P(10,4,14,1,'#E8E8E8'); }
        break;
      case 'shelf': P(0,0,w,h,'#8E6B4A'); { const cs=['#C2577A','#3F7FBF','#C98A12','#2F8F7A','#E2703A']; for(let i=0;i<Math.floor((w-4)/3);i++) P(2+i*3,2,2,h-4,cs[i%5]); } break;
      case 'desk':
        if(kind==='office'){ P(0,0,w,h,'#9AA6B4'); P(3,0,8,6,'#2A3440'); P(4,1,6,4,'#6AB0E8'); P(5,6,4,1,'#2A3440'); }
        else if(kind==='factory'){ P(0,0,w,h,'#8A9098'); P(2,2,w-4,h-4,'#5A6068'); P(3,3,3,2,'#E8C040'); P(w-6,3,3,2,'#60D060'); }
        else if(kind==='farm'||kind==='herd'){ P(0,0,w,h,'#E8C860'); for(let i=1;i<h;i+=2) P(0,i,w,1,'#C8A040'); }
        else if(kind==='shop'||kind==='tour'){ P(0,0,w,h,'#B88A58'); P(2,1,4,3,'#E05838'); P(7,1,4,3,'#40A048'); P(12,1,3,3,'#E8B030'); }
        else if(kind==='hosp'){ P(0,0,w,h,'#F4F8FC'); P(0,0,5,h,'#C8E0F0'); P(w-4,0,4,h,'#B8C8D8'); }
        else if(kind==='mine'){ P(0,2,w,h-2,'#707880'); P(1,0,w-2,3,'#A07848'); P(2,h-1,3,2,'#303038'); P(w-5,h-1,3,2,'#303038'); }
        else if(kind==='fish'){ P(0,0,w,h,'#A8784A'); P(2,2,w-4,h-4,'#C8E0F0'); P(4,3,5,2,'#5888C0'); }
        else if(kind==='dream'){ P(0,0,w,h,'#B88A58'); P(3,0,8,h-2,'#F8F4E8'); P(4,1,3,3,'#E05838'); P(7,3,3,2,'#3870D0'); }
        else { P(0,0,w,h,'#C8A070'); P(0,h-2,w,2,'#9A7448'); P(3,2,6,3,'#F8F4E8'); }
        break;
      default: P(0,0,w,h,wood);
    }
    outline(c); }); }
function floorTile(kind,v){ return cached(['FL',kind,v].join('|'),16,16,(x)=>{ const P=(X,Y,W,H,c)=>pr(x,X,Y,W,H,c);
  const m={home:['#DCB07A','#C8985E'],school:['#E8C890','#D4B076'],office:['#9AB0C8','#88A0BA'],factory:['#A8ACB0','#989CA0'],farm:['#C8A878','#B09060'],herd:['#C8A878','#B09060'],shop:['#E8E0D0','#D8CEBC'],hosp:['#F0F4F8','#DCE4EC'],mine:['#8A7A68','#786858'],fish:['#B89068','#A07850'],tour:['#E8E0D0','#D8CEBC'],dream:['#DCB07A','#C8985E'],part:['#C8C0B0','#B8B0A0']}[kind]||['#DCB07A','#C8985E'];
  if(kind==='tatami'){ P(0,0,16,16,'#D8D098'); P(0,0,16,1,'#8A8048'); P(0,0,1,16,'#8A8048'); for(let y=2;y<16;y+=2) P(1,y,15,1,'#CCC488'); return; }
  if(kind==='carpet'){ P(0,0,16,16,'#B84838'); P(2,2,12,12,'#C86048'); P(6,6,4,4,'#E8C060'); P(0,0,16,1,'#902C24'); if(v%2) P(7,1,2,2,'#E8C060'); return; }
  if(kind==='earth'){ P(0,0,16,16,'#B89068'); for(let i=0;i<4;i++) P(Math.floor(hash(v,i)*14),Math.floor(hash(i,v)*14),2,1,'#A07850'); return; }
  P(0,0,16,16,m[0]); if(['home','school','dream','fish'].includes(kind)){ P(0,7,16,1,m[1]); P(0,15,16,1,m[1]); P((v%2)*8+3,0,1,7,m[1]); P(((v+1)%2)*8+3,8,1,7,m[1]); } else { P(0,15,16,1,m[1]); P(15,0,1,16,m[1]); } }); }

/* ---------- 큰 사건의 장면 그림 (160×80 도트) ---------- */
function drawScene(x,kind,t,L){ if(kind==='house') kind='town';
  const W=160,H=80, P=(X,Y,Ww,Hh,c)=>pr(x,Math.round(X),Math.round(Y),Ww,Hh,c), sp=L?spOf(L):1, g=GRASS[sp];
  const look=(L&&L.look)||{skin:'#E0A878',hair:'#2A2420',body:'#E05838',pants:'#384868'};
  const person=(px,py,o)=>drawSpr(x,personSprite(Object.assign({dir:0,fr:0,st:'adult'},look,o||{})),Math.round(px),Math.round(py)-8);
  const sky=(c1,c2)=>{ for(let i=0;i<6;i++) P(0,i*9,W,9,shade(c1,1+(i*.04))); P(0,54,W,26,c2||g[1]); for(let i=0;i<12;i++) P((i*37+5)%W,56+(i*7)%22,3,1,g[2]); };
  const house=(px,py,w,h,col)=>x.drawImage(buildingSprite('house',w,h,{roof:col||'#C8503A'}),px,py);
  const tree=(px,py,ty)=>x.drawImage(treeSprite(ty||'round',sp,1),px,py);
  const sun=(px,py,c)=>{ P(px-5,py-5,10,10,c||'#F8D048'); P(px-7,py-2,14,4,c||'#F8D048'); P(px-2,py-7,4,14,c||'#F8D048'); };
  const cloud=(px,py,c)=>{ P(px,py,22,6,c||'#FFFFFF'); P(px+4,py-3,12,4,c||'#FFFFFF'); };
  const rain=(n,c,sl)=>{ for(let i=0;i<n;i++){ const xx=(i*29+t*90*(sl||1))%(W+20)-10, yy=(i*17+t*120)%H; P(xx,yy,1,4,c||'#A8C8F0'); } };
  const conf=n=>{ for(let i=0;i<n;i++){ const xx=(i*41)%W, yy=((i*23)+t*30)%60; P(xx,yy,2,2,CLOTHES[i%CLOTHES.length]); } };
  switch(kind){
    case 'flood': sky('#6A7A8A','#3C90E0'); cloud(10,8,'#8A98A8'); cloud(90,5,'#8A98A8'); house(20,30,40,32); house(96,34,34,28,'#3870A0'); P(0,50,W,30,'#3C90E0'); for(let i=0;i<8;i++) P((i*23+t*20)%W,52+(i%3)*8,8,1,'#9ACCF8'); rain(40); person(70,40,{dir:0}); break;
    case 'quake': { sky('#E8D8B8'); const s=Math.sin(t*30)*2; house(18+s,24,40,32); house(100-s,26,36,30,'#5878B0'); P(60,58,3,22,'#4A3828'); P(62,64,6,2,'#4A3828'); P(66,66,2,10,'#4A3828'); person(70+s,48,{dir:0}); for(let i=0;i<5;i++) P(10+i*30,12+(i%2)*4,6,1,'#806040'); } break;
    case 'storm': sky('#4A5868','#6A9050'); cloud(0,6,'#5A6878'); cloud(60,2,'#5A6878'); cloud(110,8,'#5A6878'); { const b=Math.sin(t*6)*3; tree(30+b,36,'palm'); tree(120+b,38,'round'); } house(60,32,40,30); rain(60,'#C8D8F0',2); break;
    case 'drought': sky('#F8D8A0','#D8B878'); sun(130,16,'#F8A030'); for(let i=0;i<10;i++){ P(10+i*15,62+(i%3)*5,10,1,'#9A7048'); P(14+i*15,62+(i%3)*5,1,5,'#9A7048'); } tree(30,36,'bush'); person(80,46,{dir:0}); P(96,60,8,6,'#7A9AC0'); break;
    case 'heat': sky('#F8C890','#D8C078'); sun(30,16,'#F86030'); for(let i=0;i<4;i++) P(60+i*20,20+Math.sin(t*4+i)*2,10,1,'#F8E0B0'); person(90,46,{dir:0}); P(84,38,28,3,'#E05838'); P(97,40,1,10,'#605048'); break;
    case 'cold': sky('#C8D8E8','#F4F8FC'); house(30,30,44,30,'#F4F8FC'); for(let i=0;i<40;i++) P((i*31+t*10)%W,(i*13+t*25)%H,2,2,'#FFFFFF'); P(108,52,10,10,'#FFFFFF'); P(110,44,6,8,'#FFFFFF'); P(111,46,1,1,INK); P(114,46,1,1,INK); P(112,48,2,1,'#E07030'); person(84,46,{dir:0,body:'#C84860'}); break;
    case 'fire': sky('#E89060','#8A7A50'); for(let i=0;i<5;i++){ tree(10+i*30,36,'round'); const f=Math.sin(t*8+i)*2; P(14+i*30,30+f,8,8,'#F86020'); P(16+i*30,26+f,4,6,'#F8C040'); } for(let i=0;i<6;i++) P(20+i*25,6+(t*10+i*7)%20,14,5,'#8A8080'); break;
    case 'volcano': sky('#A88078','#6A7A50'); for(let i=0;i<40;i++){ const ww=Math.round(60-i*1.2); P(80-ww,14+i,ww*2,1,i<4?'#E04020':'#6A5A50'); } P(76,10,8,6,'#F86020'); for(let i=0;i<5;i++) P(70+i*5,2-(t*8+i*3)%10,6,4,'#5A5050'); house(10,40,30,24); break;
    case 'sea': sky('#88B8E0','#3C90E0'); P(0,40,W,40,'#3C90E0'); for(let i=0;i<10;i++){ const yy=44+(i%4)*9, xx=(i*31+t*25)%W; P(xx,yy,12,2,'#9ACCF8'); } { const b=Math.sin(t*3)*3; P(60,34+b,36,6,'#8A5A30'); P(64,40+b,28,3,'#6A4220'); P(76,14+b,2,20,'#5A4030'); P(78,16+b,14,14,'#F4F0E0'); person(64,20+b,{dir:2}); } break;
    case 'unrest': sky('#A8A8B0','#B8B0A0'); for(let i=0;i<4;i++){ P(8+i*38,24,32,34,'#C8BCA8'); P(12+i*38,36,24,22,'#7A808A'); for(let y=36;y<58;y+=3) P(12+i*38,y,24,1,'#6A7078'); } house(130,26,26,30); P(136,40,8,6,'#F8D890'); person(140,34,{dir:0,st:'kid'}); break;
    case 'baby': case 'birth': sky('#F8E0E8','#F0D8C0'); P(56,46,48,18,'#E8C8A0'); P(56,46,48,3,'#C8A070'); P(68,40,24,10,'#FFFFFF'); drawSpr(x,personSprite(Object.assign({},look,{dir:0,fr:0,st:'baby'})),72,34); person(34,40,{body:'#3870D0',long:1}); person(110,40,{body:'#40A048'}); for(let i=0;i<5;i++){ const yy=10+((t*12+i*9)%20); P(20+i*30,yy,3,3,'#F070A0'); P(19+i*30,yy+1,5,1,'#F070A0'); } break;
    case 'farewell': for(let i=0;i<8;i++) P(0,i*7,W,7,['#F8C890','#F4B080','#F09878','#E08080','#C07890','#9070A0','#6A6898','#4A5888'][i]); P(0,56,W,24,'#4A5838'); sun(80,52,'#F8E0A0'); P(0,54,W,4,'#3A4830'); person(60,40,{dir:3}); person(80,40,{dir:3,long:1,body:'#C84860'}); for(let i=0;i<3;i++){ const xx=(30+i*40+t*12)%W; P(xx,14+i*6,4,1,INK); P(xx+4,13+i*6,3,1,INK); } break;
    case 'wedding': sky('#F8E8F0'); P(46,20,68,4,'#E8A0B8'); P(46,20,4,40,'#E8A0B8'); P(110,20,4,40,'#E8A0B8'); person(64,42,{body:'#283850'}); person(82,42,{body:'#FFFFFF',long:1}); conf(30); break;
    case 'sick': case 'hosp': sky('#E8F0F4','#DCE4EC'); P(30,40,70,20,'#FFFFFF'); P(30,36,16,8,'#E8EEF4'); P(30,56,70,4,'#B8C8D8'); drawSpr(x,personSprite(Object.assign({},look,{dir:0,st:'adult'})),34,30); P(110,20,24,18,'#283038'); for(let i=0;i<20;i++) P(112+i,28+(i===8?-5:i===9?4:0),1,1,'#60E070'); P(120,40,2,20,'#909AA4'); break;
    case 'school': case 'grad': sky('#B8E0F8'); x.drawImage(buildingSprite('school',72,44,null,true),44,14); tree(16,38); tree(130,38); person(40,52,{st:'kid'}); person(110,52,{st:'kid',body:'#3870D0',long:1}); if(kind==='grad'){ for(let i=0;i<5;i++){ const yy=10+((t*20+i*13)%30); P(20+i*28,yy,8,2,INK); P(23+i*28,yy-2,2,2,INK); } } break;
    case 'noschool': sky('#B8E0F8'); x.drawImage(buildingSprite('school',60,40,null,false),80,18); for(let i=0;i<10;i++) P(70+i*9,48,2,14,'#9A7048'); P(68,50,92,2,'#9A7048'); person(36,48,{st:'kid',dir:2}); P(26,58,10,6,'#7AA0C8'); break;
    case 'job': sky('#C8E0F0'); { const L2=L&&L.job, k=L2?L2.kind:'office'; const kd={office:'office',factory:'factory',farm:'barn',herd:'barn',shop:'shop',school:'school',hosp:'hospital',dream:'studio',fish:'port',mine:'mine',tour:'kiosk'}[k]||'shop'; x.drawImage(buildingSprite(kd,64,42,null,true),48,14); } person(30,46); person(120,46,{body:'#3870D0'}); for(let i=0;i<4;i++) P(20+i*36,8+Math.sin(t*3+i)*2,3,3,'#F8D048'); break;
    case 'harvest': sky('#C8E8F8',g[1]); for(let r=0;r<4;r++) for(let i=0;i<14;i++){ P(6+i*11,46+r*8,6,6,'#E8C040'); P(8+i*11,42+r*8,2,4,'#58A040'); } person(70,30); sun(140,14); break;
    case 'jobloss': sky('#A8B0B8','#9AA0A8'); x.drawImage(buildingSprite('office',60,44,null,false),50,14); P(64,40,34,10,'#F8F0E0'); P(66,43,30,1,'#C04040'); P(66,46,20,1,'#C04040'); person(30,48,{dir:2}); rain(15,'#C8D0D8'); break;
    case 'money': sky('#E8F0D8'); for(let i=0;i<5;i++){ const hgt=6+i*5; for(let j=0;j<hgt;j+=3){ P(30+i*22,62-j,14,3,'#F2C14E'); P(30+i*22,62-j,14,1,'#F8E090'); } } P(132,20,4,30,'#40A048'); P(126,20,16,4,'#40A048'); P(130,16,8,4,'#40A048'); person(8,46); break;
    case 'mine': sky('#B8C0C8','#8A7A68'); x.drawImage(buildingSprite('mine',70,46,null,true),46,14); P(20,62,120,2,'#605048'); for(let i=0;i<12;i++) P(20+i*10,64,2,2,'#605048'); person(120,44,{hat:'#E8B030'}); break;
    case 'fest': sky('#405078','#806040'); for(let i=0;i<9;i++){ P(i*18+4,10+(i%2)*4,1,6,'#2A2420'); P(i*18+1,16+(i%2)*4,7,8,['#E04040','#F8C040','#40A048'][i%3]); P(i*18+2,18+(i%2)*4,5,4,'#F8E890'); } for(let i=0;i<4;i++) person(20+i*34,46+Math.abs(Math.sin(t*5+i))*-4,{body:CLOTHES[i+2]}); break;
    case 'sport': sky('#B8E0F8','#58A040'); P(0,54,W,26,'#58A040'); P(0,66,W,1,'#F8F8F8'); P(130,40,2,22,'#F8F8F8'); P(130,40,22,2,'#F8F8F8'); P(150,40,2,22,'#F8F8F8'); { const bx=60+Math.sin(t*3)*30; P(bx,44-Math.abs(Math.sin(t*6))*14,6,6,'#F8F8F8'); P(bx+2,46-Math.abs(Math.sin(t*6))*14,2,2,INK); } person(40,46,{dir:2}); person(100,46,{dir:1,body:'#3870D0'}); break;
    case 'travel': sky('#A8D8F8'); P(0,58,W,6,'#6E767E'); for(let i=0;i<10;i++) P(i*18+(t*30)%18,61,8,1,'#F8F8F8'); { const v=L?L.C.veh.kind:'car'; drawSpr(x,vehicleSprite(v,1,'#C2577A',v==='car'?null:look),60,42); } tree(10,38); tree(140,38); P(110,10+Math.sin(t)*2,24,4,'#F8F8F8'); P(116,8+Math.sin(t)*2,4,8,'#F8F8F8'); break;
    case 'pet': sky('#C8E8F8'); house(10,26,40,32); person(70,44,{st:'kid'}); drawAnimal(x,animalSprite('dog',Math.floor(t*4)%2,-1),92,58); for(let i=0;i<3;i++) P(98+i*6,40-((t*10+i*4)%12),3,3,'#F070A0'); break;
    case 'friend': sky('#C8E8F8'); tree(14,36); tree(130,36); person(60,46,{st:'kid',dir:2}); person(78,46,{st:'kid',dir:1,body:'#3870D0',long:1}); P(72,36,4,4,'#F070A0'); P(71,37,6,2,'#F070A0'); break;
    case 'stage': sky('#202838','#403040'); P(20,56,120,10,'#8A5A30'); P(52,0,56,56,'#F8E89030'); for(let i=0;i<10;i++){ P(54+i*5,i*5,52-i*10>0?52-i*10:2,5,'rgba(248,232,144,0.18)'); } person(72,40,{body:'#E8B030'}); for(let i=0;i<8;i++) P(10+i*19,70,8,6,'#2A2430'); break;
    case 'town': sky('#B8E0F8'); house(10,28,40,30); x.drawImage(buildingSprite('shop',36,30,null,false),62,30); x.drawImage(buildingSprite('school',44,36,null,false),108,22); P(0,62,W,6,'#E8D4A0'); person(54,52,{st:L&&L.age<13?'kid':'adult'}); break;
    case 'title': { for(let i=0;i<8;i++) P(0,i*10,W,10,['#283858','#30406A','#3A4C7A','#465A8A','#566A98','#6A7CA8','#8090B8','#98A8C8'][i]); for(let i=0;i<14;i++) P((i*47)%W,(i*23)%40,1,1,'#F8F8F0');
      const cx=80, cy=58, r=30, rot=t*5;      // 천천히 도는 지구: 둥근 면 위에 대륙 무늬를 흘려 보낸다
      for(let yy=-r;yy<=r;yy++){ const ww=Math.round(Math.sqrt(r*r-yy*yy)); for(let xx=-ww;xx<ww;xx++){ const lon=Math.asin(clamp(xx/Math.max(ww,1),-1,1))/Math.PI*40+rot, u=((Math.floor(lon/3)%40)+40)%40, v=Math.floor((yy+r)/4);
          const land=(hash(u,v)+hash(u+1,v)*.6+hash(u,v+1)*.6)/2.2>.56; P(cx+xx,cy+yy,1,1,land?(xx>ww*.45?'#3E8A34':'#62B048'):(xx>ww*.45?'#2E78C8':'#3C90E0')); } }
      P(cx-r+6,cy-r+8,4,2,'rgba(255,255,255,.45)');
      [0,2,4,5].forEach((si,i)=>{ const px=[18,44,102,128][i]; drawSpr(x,personSprite({dir:0,fr:Math.floor(t*3+i)%3===1?1:0,st:'kid',skin:SKINS[si],hair:i===1?'#E8C070':'#2A2420',body:CLOTHES[i*2],pants:'#384868',long:i%2===1}),px,50-Math.abs(Math.round(Math.sin(t*4+i)*2))); }); } break;
    case 'country': { if(!L) break; const C=L.C; sky(sp===3?'#C8D8E8':C.arid?'#F0D8A8':'#A8D8F8');
      const lm=landmarkSprite(C.lt==='wt'||C.lt==='cs'?'mt':C.lt,sp); x.drawImage(lm,0,0,88,96,96,-4,66,72);
      if(C.lt==='wt'||C.lt==='cs'){ P(100,54,60,26,'#3C90E0'); for(let i=0;i<4;i++) P(104+i*14+(t*8%6),60+(i%2)*8,8,1,'#9ACCF8'); }
      const hk=typeof kindOf==='function'?kindOf('home'):'house'; x.drawImage(buildingSprite(hk,52,38,C.pal[hk],false),10,26);
      tree(70,36,treeTypeFor(C.rg,2)); tree(2,40,treeTypeFor(C.rg,5));
      const lk=L.look||{skin:'#E0A878',hair:'#2A2420'}; drawSpr(x,personSprite({dir:0,fr:0,st:'adult',skin:lk.skin,hair:lk.hair,body:'#3870D0',pants:'#384868',long:1}),64,58);
      drawSpr(x,personSprite({dir:0,fr:0,st:'adult',skin:lk.skin,hair:lk.hair,body:'#40A048',pants:'#484040'}),86,58);
      drawSpr(x,personSprite({dir:0,fr:Math.floor(t*2)%2,st:'baby',skin:lk.skin,hair:lk.hair,body:'#F8F0E0',pants:'#F8F0E0'}),76,64); } break;
    default: sky('#F8D8B0'); sun(80,34,'#F8E0A0'); tree(20,36); tree(124,36); house(52,30,52,30); person(70,52);
  }
}
const SCENE_TITLE={house:'우리 집',flood:'홍수',quake:'지진',storm:'폭풍',drought:'가뭄',heat:'폭염',cold:'혹한',fire:'산불',volcano:'화산',sea:'바다',unrest:'혼란',baby:'새 생명',birth:'탄생',farewell:'이별',wedding:'함께',sick:'아픔',hosp:'돌봄',school:'학교',grad:'졸업',noschool:'학교 밖',job:'일',harvest:'수확',jobloss:'시련',money:'살림',mine:'광산',fest:'축제',sport:'경기',travel:'길 위에서',pet:'친구',friend:'친구',stage:'무대',town:'세상이 넓어지다',life:'삶'};

