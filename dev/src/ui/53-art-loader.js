/* ========== 그림 자원 (제미나이로 그린 건물·나무·탈것·바닥·장면) ========== */
// 그림이 다 오기 전이나 못 받으면 예전 도트 그림으로 그린다
const WR=3;   // 바깥·방 바닥 그림의 해상도 배율
const WRO=2.5;   // 넓어진 바깥 지도는 조금 낮춰 (휴대폰 캔버스 크기 한도)
const ART={ok:false,spr:null,tex:null,M:ART_MAP,T:{},P:{}};
function artLoad(src){ return new Promise((res,rej)=>{ const im=new Image(); im.decoding='async'; im.onload=()=>res(im); im.onerror=rej; im.src=src; }); }
Promise.all([artLoad('art/spr.webp'),artLoad('art/tex.webp')]).then(([s,t])=>{ ART.spr=s; ART.tex=t; ART.ok=true; worldLayer.k=null; roomLayer.k=null; CACHE.forEach((v,k)=>{ if(/^(VHD|VLO|AHD)/.test(k)) CACHE.delete(k); }); }).catch(()=>{});
function artHas(n){ return ART.ok&&!!ART.M.spr[n]; }
// 상자(w×h) 안에 맞춰, 아래 가운데(cx,by)에 붙여 그린다
function artDraw(x,n,cx,by,w,h,flip){ const r=ART.M.spr[n]; if(!r) return null; const s=Math.min(w/r[2],h/r[3]), dw=r[2]*s, dh=r[3]*s;
  if(flip){ x.save(); x.translate(cx,0); x.scale(-1,1); x.drawImage(ART.spr,r[0],r[1],r[2],r[3],-dw/2,by-dh,dw,dh); x.restore(); }
  else x.drawImage(ART.spr,r[0],r[1],r[2],r[3],cx-dw/2,by-dh,dw,dh); return [dw,dh]; }
// 바닥 무늬: 계절·지역에 맞게 물들인다 (128px 한 장 = 2칸)
const TEX_TINT={0:['soft-light','#E8FFB0',.35],2:['color','#C8A050',.5],3:['screen','#F4F8FC',.82],4:['color','#D8B878',.55]};
function artTex(name,tint){ const key=name+'|'+(tint||''); if(ART.T[key]) return ART.T[key]; const i=ART.M.tex.indexOf(name); if(i<0) return null;
  const c=mk(128,128), x=c.getContext('2d'); x.drawImage(ART.tex,i*128,0,128,128,0,0,128,128);
  if(tint){ const [op,col,a]=tint.split(','); x.globalCompositeOperation=op; x.globalAlpha=+a; x.fillStyle=col; x.fillRect(0,0,128,128); x.globalCompositeOperation='source-over'; x.globalAlpha=1; }
  return ART.T[key]=c; }
function artPat(x,name,tint,sc){ const t=artTex(name,tint); if(!t) return '#88C860'; const p=x.createPattern(t,'repeat'); if(p.setTransform) p.setTransform(new DOMMatrix().scale(sc||.25)); return p; }
// 지형 글자 → 무늬
function groundTint(t,sp){ if(sp===3&&!'wrkh'.includes(t)) return TEX_TINT[3].join(','); if('gftc'.includes(t)&&TEX_TINT[sp]&&sp!==3) return TEX_TINT[sp].join(','); return ''; }
function groundFill(x,t,sp){ const ts=groundTint(t,sp);
  switch(t){ case 'f': return artPat(x,sp===3?'g':'f',ts); case 't': return artPat(x,'g',sp===3?ts:'multiply,#9AB880,.55');
    case 'c': return artPat(x,'c',ts); case 'p': return artPat(x,'p',ts); case 'k': return artPat(x,'k','',.19); case 'r': return artPat(x,'r','');
    case 'h': return artPat(x,'r','multiply,#8890A0,.6'); case 'd': return artPat(x,'d',ts); case 'w': return artPat(x,'w','');
    case 's': return artPat(x,'s',''); case 'z': return artPat(x,'s','multiply,#F0C890,.5'); }
  return artPat(x,'g',ts); }
// 건물 종류 → 그림 이름 (지붕 색이 푸르거나 잿빛이면 유럽식 집)
function bldArt(kd,pal){ if(kd==='house'){ const r=(pal&&pal.roof)||'#C8503A', R=parseInt(r.slice(1,3),16), B=parseInt(r.slice(5,7),16); return B>R?'house_eu':'house'; } return kd; }
function treeArt(type,sp){ if(type==='palm'||type==='cactus'||type==='bush') return type; if(type==='pine') return sp===3?'pine_sn':'pine'; return ['tree_sp','tree','tree_au','tree_wi','tree'][sp]||'tree'; }
function softShadow(x,cx,cy,rx,ry,a){ x.fillStyle=`rgba(20,40,24,${a||.22})`; x.beginPath(); x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); x.fill(); }

// ----- 바깥 지도 (고해상도)
const _worldLayer=worldLayer;
worldLayer=function(){ if(!ART.ok) return _worldLayer(); const L=G.life, key=worldKey(); if(worldLayer.k===key) return worldLayer.c;
  const T=terrain(), sp=spOf(L), U=visU(L), W0=OUT.w*PX, H0=OUT.h*PX+LAYER_TOP;
  const c=worldLayer.c&&worldLayer.c.wr===WRO&&worldLayer.c.width===Math.round(W0*WRO)?worldLayer.c:mk(Math.round(W0*WRO),Math.round(H0*WRO)), x=c.getContext('2d'); c.wr=WRO;
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,c.width,c.height); x.setTransform(WRO,0,0,WRO,0,0); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
  const oy=LAYER_TOP;
  // 맨 위 여백도 풀밭으로
  x.fillStyle=groundFill(x,'g',sp); x.fillRect(0,0,W0,oy);
  for(let y=0;y<OUT.h;y++){ let i=0; while(i<OUT.w){ const t=T[y][i]; let j=i+1; while(j<OUT.w&&T[y][j]===t) j++; x.fillStyle=groundFill(x,t,sp); x.fillRect(i*PX,y*PX+oy,(j-i)*PX+.5,PX+.5); i=j; } }
  // 경계: 풀과 길 사이는 부드러운 그늘, 차도는 연석
  for(let y=0;y<OUT.h;y++) for(let i=0;i<OUT.w;i++){ const t=T[y][i], px=i*PX, py=y*PX+oy, nb=(a,b)=>(T[y+b]&&T[y+b][i+a])||'x', soft=q=>'gftcb'.includes(q);
    if(t==='k'||t==='p'||t==='d'){ const ec=t==='k'?'rgba(150,150,140,.9)':'rgba(170,140,90,.55)';
      if(soft(nb(0,-1))){ x.fillStyle=ec; x.fillRect(px,py,PX,1.2); x.fillStyle='rgba(30,60,20,.16)'; x.fillRect(px,py-1.5,PX,1.5); }
      if(soft(nb(0,1))){ x.fillStyle=ec; x.fillRect(px,py+PX-1.2,PX,1.2); }
      if(soft(nb(-1,0))){ x.fillStyle=ec; x.fillRect(px,py,1.2,PX); } if(soft(nb(1,0))){ x.fillStyle=ec; x.fillRect(px+PX-1.2,py,1.2,PX); } }
    if(t==='r'){ const kk=nb(0,-1)==='k'||nb(0,-1)==='p', kb=nb(0,1)==='k'||nb(0,1)==='p'; if(kk){ x.fillStyle='#E4E4DC'; x.fillRect(px,py,PX,1.6); } if(kb){ x.fillStyle='#4A525A'; x.fillRect(px,py+PX-1.4,PX,1.4); } }
    if(t==='w'){ if(nb(0,-1)!=='w'&&nb(0,-1)!=='x'){ x.fillStyle='rgba(255,255,255,.55)'; x.fillRect(px,py,PX,1.4); } } }
  const poleKind=(U&&L.C.tier>1&&!(L.C.tier===2&&L.C.gni<2))||L.C.tier>=3?'lamp':'pole';
  for(let y=1;y<OUT.h-1;y++) for(let i=1;i<OUT.w-1&&i<OUT.hw[0];i++){ if(T[y][i]!=='k'&&T[y][i]!=='p') continue; const nr=['r','d'].some(q=>T[y+1][i]===q||T[y-1][i]===q); if(!nr||(i*5+y*3)%13!==0) continue;
    const px=i*PX+4, py=y*PX+oy+PX-1; softShadow(x,px+3,py,5,1.6,.18); artDraw(x,poleKind,px,py+1,14,poleKind==='lamp'?27:29); }
  for(let i=0;i<OUT.w;i+=2){ if(roadGap(i)) continue; if((U&&L.C.tier>1)||L.C.tier>=3||i>=OUT.hw[0]+4){ x.fillStyle='#F0F0E8'; x.fillRect(i*PX+4,(OUT.RY+1)*PX+oy-1,8,1.6); } }
  for(let y=0;y<OUT.h;y+=2){ x.fillStyle='#F2C14E'; x.fillRect((OUT.hw[0]+OUT.hw[2]/2)*PX-1,y*PX+oy+4,1.6,8); }
  // 먼 곳의 명소
  const lt=L.C.lt, mp=OUT.patch.mount, LMA={mt:'lm_mt',wt:'lm_mt',cs:'lm_mt',tp:'lm_tp',ct:'lm_ct',ds:'lm_ds'};
  if(LMA[lt]&&artHas(LMA[lt])) artDraw(x,LMA[lt],mp[0]*PX+44,mp[1]*PX+oy+82,96,100);
  else if(lt==='mt'||lt==='wt'||lt==='cs'||lt==='ct'||lt==='tp'||lt==='ds'||lt==='fr'){ x.imageSmoothingEnabled=false; x.drawImage(landmarkSprite(lt==='wt'||lt==='cs'?'mt':lt,sp),mp[0]*PX,mp[1]*PX+oy-14); x.imageSmoothingEnabled=true; }
  if(lt==='wt'){ x.imageSmoothingEnabled=false; x.drawImage(cached('FALL',40,60,(fx)=>{ const P=(X,Y,Wd,H,cc)=>pr(fx,X,Y,Wd,H,cc); P(0,0,40,60,'#8A8070'); P(12,0,16,60,'#9ACCF8'); for(let i=0;i<8;i++) P(14+(i%3)*4,i*8,2,6,'#FFFFFF'); P(0,0,40,3,'#6A6050'); }),(OUT.patch.mount[0]+7)*PX,oy-8); x.imageSmoothingEnabled=true; }
  // 건물
  const ks=bldList().sort((p,q)=>p.b[1]+p.b[3]-(q.b[1]+q.b[3]));
  for(const {k,b} of ks){ const w=Math.round(b[2]*PX), h=Math.round(b[3]*PX), bx=Math.round(b[0]*PX), by=Math.round(b[1]*PX)+oy;
    if(k==='bus'){ softShadow(x,bx+17,by+15,16,3); artDraw(x,'busstop',bx+16,by+16,36,30); continue; }
    const enter=k in ENTER&&(k!=='work'||!!L.f.job)&&(k!=='elem'||(L.age>=7&&L.age<=12&&L.f.elem));
    const kd=kindOf(k), an=bldArt(kd,L.C.pal[kd]);
    if(!artHas(an)){ x.imageSmoothingEnabled=false; x.drawImage(buildingSprite(kd,w,h,L.C.pal[kd],enter),bx-1,by-10); x.imageSmoothingEnabled=true; continue; }
    softShadow(x,bx+w/2+3,by+h+1,w*.56,4.2,.24);
    artDraw(x,an,bx+w/2,by+h+2,w+8,h+26);
    if(L.C.tier>=2&&!(L.C.tier===2&&L.C.gni<2)&&['house','apt','school','office','hospital','hall','hanok','cafe','shop','studio'].includes(kd)){ [bx+5,bx+w-5].forEach(bxx=>artDraw(x,'bush',bxx,by+h+4,15,13)); } }
  // 놀이터
  const pl=OUT.patch.play; softShadow(x,pl[0]*PX+32,pl[1]*PX+oy+37,22,3.4); artDraw(x,'play',pl[0]*PX+32,pl[1]*PX+oy+38,52,38);
  // 나무
  OUT.trees.forEach(tr=>softShadow(x,tr[0]*PX+1,tr[1]*PX+oy+3.5,8,2.6,.24));
  OUT.trees.slice().sort((a,b)=>a[1]-b[1]).forEach(tr=>{ const ty=treeTypeFor(L.C.rg,Math.round(tr[0]*7+tr[1]*13)), n=treeArt(ty,sp); artDraw(x,n,tr[0]*PX,tr[1]*PX+oy+5,ty==='bush'?19:25,ty==='palm'?34:ty==='bush'?17:30); });
  if(lt==='fr') for(let i=0;i<7;i++) artDraw(x,treeArt(treeTypeFor(L.C.rg,i+3),sp),(mp[0]+.2+(i%4)*1.3)*PX+8,(mp[1]+.5+Math.floor(i/4)*2.6)*PX+oy+20,25,30);
  if(lt==='ds') for(let i=0;i<3;i++) artDraw(x,'cactus',(mp[0]+.6+i*1.6)*PX+8,(mp[1]+4.6)*PX+oy+20,16,22);
  worldLayer.k=key; worldLayer.c=c; return c; };

// ----- 방 안 (고해상도)
const FLOOR_SC={wood:.16,tile:.2,lino:.2,tatami:.4,earth:.25,concrete:.25,rock:.22};
const FLOOR_ART={home:'wood',tatami:'tatami',carpet:'wood',earth:'earth',school:'lino',office:'tile',factory:'concrete',farm:'earth',herd:'earth',shop:'tile',hosp:'lino',mine:'rock',fish:'concrete',tour:'tile',dream:'wood',part:'tile'};
const FURN_ART={ desk:{office:'w_desk',factory:'w_machine',farm:'w_hay',herd:'w_hay',shop:'w_goods',tour:'w_goods',hosp:'w_bed',mine:'w_cart',fish:'w_fish',dream:'w_easel',part:'w_goods'},
  board:{office:'w_white',factory:'w_belt',farm:'w_fence',herd:'w_fence',shop:'w_goods',tour:'w_rack',hosp:'w_white',mine:'w_cart',fish:'w_fish',dream:'w_easel',part:'w_rack'} };
const FURN_UP={board:30,shelf:22,piano:16,counter:12,tv:16,bed:10,sofa:10,desk:16,table:14,radio:12,hearth:12,mat:0};
const _roomLayer=roomLayer;
roomLayer=function(map){ if(!ART.ok) return _roomLayer(map); const L=G.life, kind=intKind(map), ph=map==='home'&&poorHome(L), key=['RA',map,kind,L.famI,L.C.rg,ph?1:0].join('|'); if(roomLayer.k===key) return roomLayer.c;
  const W0=IW*PX, H0=IH*PX+LAYER_TOP, c=mk(W0*WR,H0*WR), x=c.getContext('2d'), oy=LAYER_TOP; c.wr=WR; x.setTransform(WR,0,0,WR,0,0); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
  const fk=map!=='home'?kind:L.C.code==='JP'?'tatami':(['ME','CA'].includes(L.C.rg)||['AF','IR','PK','IN'].includes(L.C.code))?'carpet':L.C.tier<=1||(L.set==='R'&&poorHome(L))?'earth':'home';
  { const fn=FLOOR_ART[fk]||'wood'; x.fillStyle=artPat(x,fn,'',FLOOR_SC[fn]||.2); } x.fillRect(0,oy,W0,IH*PX);
  if(fk==='carpet'){ x.save(); x.translate(3.5*PX,oy+3.3*PX); x.fillStyle=artPat(x,'carpet','',.4); x.fillRect(0,0,7*PX,4*PX); x.restore(); x.strokeStyle='rgba(60,30,20,.35)'; x.lineWidth=.8; x.strokeRect(3.5*PX,oy+3.3*PX,7*PX,4*PX); }
  // 벽과 창문
  const wall={home:['#F0E4C8','#D8C8A0'],school:['#E8EEDC','#C8D4B8'],office:['#DCE4EC','#B8C4D0'],factory:['#C8CCD0','#A8ACB0'],farm:['#C8A070','#A88050'],herd:['#C8A070','#A88050'],shop:['#F8ECD8','#E0CCB0'],hosp:['#F4F8FC','#D8E4EC'],mine:['#7A6A58','#5A4A38'],fish:['#C8D8E0','#A8B8C8'],tour:['#F8ECD8','#E0CCB0'],dream:['#EDE0F0','#D0C0D8']}[kind]||['#F0E4C8','#D8C8A0'];
  const wg=x.createLinearGradient(0,4,0,oy+PX*1.15); wg.addColorStop(0,shade(wall[0],1.04)); wg.addColorStop(1,wall[0]); x.fillStyle=wg; x.fillRect(0,4,W0,PX*1.3+LAYER_TOP-4);
  x.fillStyle=wall[1]; x.fillRect(0,oy+PX*1.15,W0,3); x.fillStyle=shade(wall[1],.85); x.fillRect(0,oy+PX*1.15+2.4,W0,.6);
  for(let i=0;i<3;i++){ const wx=(1.4+i*4.4)*PX; x.fillStyle='#6A5848'; x.fillRect(wx-1,oy-7,24,16); const sg=x.createLinearGradient(0,oy-5,0,oy+7); sg.addColorStop(0,'#BFE3F8'); sg.addColorStop(1,'#8CC4EC'); x.fillStyle=sg; x.fillRect(wx+1,oy-5,20,12);
    x.fillStyle='rgba(255,255,255,.6)'; x.beginPath(); x.moveTo(wx+3,oy+5); x.lineTo(wx+9,oy-5); x.lineTo(wx+12,oy-5); x.lineTo(wx+6,oy+5); x.fill(); x.fillStyle='#6A5848'; x.fillRect(wx+10.5,oy-5,1,12); x.fillRect(wx+1,oy+.5,20,1);
    x.fillStyle='#E8B8B0'; x.fillRect(wx-3,oy-8,4,17); x.fillRect(wx+21,oy-8,4,17); x.fillStyle='#C89088'; x.fillRect(wx-3,oy-9,28,2); x.fillStyle='#F0E8D8'; x.fillRect(wx-2,oy+9,26,2); }
  x.fillStyle='#4A3A30'; x.fillRect(0,4,W0,1.4);
  x.fillStyle='#8A6A48'; x.fillRect(IDOOR[0]*PX-12,oy+IH*PX-8,24,8); x.fillStyle='#C8A070'; x.fillRect(IDOOR[0]*PX-10,oy+IH*PX-6,20,2);
  const fl=furnOf(map);
  const gs=x.createLinearGradient(0,oy+PX*1.15+3,0,oy+PX*1.15+12); gs.addColorStop(0,'rgba(40,30,20,.24)'); gs.addColorStop(1,'rgba(40,30,20,0)'); x.fillStyle=gs; x.fillRect(0,oy+PX*1.15+3,W0,9);
  const items=fl.map(f=>[ph&&FURN_POOR[f[0]]||f[0],f[1],f[2],f[3],f[4]]); if(map==='home'&&L.famI===0) items.push(['piano',12,4.2,1.5,.7]);
  items.sort((a,b)=>(a[2]+a[4])-(b[2]+b[4])).forEach(([t,fx,fy,fw,fh])=>{ const X0=fx*PX, Y0=fy*PX+oy, w=fw*PX, h=fh*PX;
    const an=(map!=='home'&&FURN_ART[t]&&FURN_ART[t][kind])||t;
    softShadow(x,X0+w/2+1,Y0+h,w*.52,Math.max(2,h*.28),.22);
    if(artHas(an)) artDraw(x,an,X0+w/2,Y0+h+1,an==='mat'?w+2:w+4,an==='mat'?h+4:h+(FURN_UP[t]||14));
    else { x.imageSmoothingEnabled=false; x.drawImage(furnSprite(t,Math.round(w),Math.round(h),kind),Math.round(X0)-1,Math.round(Y0)-1); x.imageSmoothingEnabled=true; } });
  if(map==='home'){ x.fillStyle=U2(L)?artPat(x,'k','',.19):artPat(x,'g',TEX_TINT[spOf(L)]?TEX_TINT[spOf(L)].join(','):''); x.fillRect(10.8*PX,5.6*PX+oy,2.8*PX,3.4*PX); x.strokeStyle='rgba(60,50,40,.35)'; x.lineWidth=.8; x.strokeRect(10.8*PX,5.6*PX+oy,2.8*PX,3.4*PX);
    artDraw(x,U2(L)?'bush':treeArt(treeTypeFor(L.C.rg,3),spOf(L)),12.2*PX,5.9*PX+oy+20,22,26); }
  roomLayer.k=key; roomLayer.c=c; return c; };
function U2(L){ return visU(L); }

// ----- 탈것: 그림 몸체 + 고해상도 사람 (자리 맞춤)
const _VEH_LO=VEH_LO;
VEH_LO=function(kind,col,w,h){ if(!ART.ok) return _VEH_LO(kind,col,w,h); const n=kind==='car'?'car':kind==='cycle'?'cycle':kind==='moto'?'moto':'horse';
  return cached(['VLOA',kind,col].join('|'),w*HD,h*HD,(x)=>{ x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high'; x.scale(HD,HD);
    const box={car:[w-1,h],cycle:[w,h*.62],moto:[w,h*.7],horse:[w,h*.95]}[n]; artDraw(x,n,w/2,h,box[0],box[1]);
    if(n==='car'&&col&&col.toUpperCase()!=='#C2577A'){ x.globalCompositeOperation='hue'; x.fillStyle=col; x.fillRect(0,0,w,h); x.globalCompositeOperation='destination-in'; artDraw(x,n,w/2,h,box[0],box[1]); x.globalCompositeOperation='source-over'; } }); };
function drawAnimal(ctx,s,x,y){ if(s.hi) drawSpr(ctx,s,x+6-sprW(s)/2,y+12-sprH(s)); else ctx.drawImage(s,x,y); }
// 동물: 고해상도 (drawSpr로 그린다)
const _animalSprite=animalSprite;
animalSprite=function(kind,fr,face){ if(!ART.ok||!artHas(kind)) return _animalSprite(kind,fr,face); const sz={dog:[16,13],cat:[13,12],chick:[8,8]}[kind]||[12,12];
  const c=cached(['AHD',kind,fr,face].join('|'),sz[0]*HD,(sz[1]+1)*HD,(x)=>{ x.imageSmoothingEnabled=true; x.scale(HD,HD); artDraw(x,kind,sz[0]/2,sz[1]+1-(fr?.6:0),sz[0],sz[1],face<0); }); c.hi=HD; return c; };

// ----- 장면 그림: 사건 창·엔딩의 장면을 손그림 일러스트로 (없으면 예전 그림)
const SC_ART=new Set(['house','flood','quake','storm','drought','heat','cold','fire','volcano','sea','unrest','baby','birth','farewell','wedding','sick','hosp','school','grad','noschool','job','harvest','jobloss','money','mine','fest','sport','travel','pet','friend','stage','town','life']);
const SC_RURAL=new Set(['house','school','birth','baby','job','hosp']);
const SC_IMG={};
const SC_REG=new Set(['life','farewell']), RG_ART={EA:'EA',SE:'SE',SA:'SA',AF:'AF',ME:'ME',CA:'ME',LA:'LA',EU:'WE',NA:'WE',OC:'WE'};
const SC_VAR=new Set(["baby_AF", "baby_EA", "baby_LA", "baby_ME", "baby_SA", "baby_SE", "baby_WE", "fest_AF", "fest_LA", "fest_ME", "fest_SA", "fest_SE", "fest_WE", "hosp_AF", "hosp_LA", "hosp_ME", "hosp_SA", "hosp_SE", "hosp_WE", "house_AF", "house_LA", "house_ME", "house_SA", "house_SE", "job_AF", "job_LA", "job_ME", "job_SA", "job_SE", "job_WE", "school_AF", "school_LA", "school_ME", "school_SA", "school_SE", "school_WE", "school_r", "wedding_AF", "wedding_EA", "wedding_LA", "wedding_ME", "wedding_SA", "wedding_SE", "wedding_WE"]);
// 집 밖으로 나가는 장면(town): 나이 4단계(6·13·19·75세) × 지역 7곳
const townStage=a=>a<10?6:a<19?13:a<75?19:75;
// 엔딩·기억의 일상 장면: 'life@end_meal_EA'처럼 종류 뒤에 그림 이름을 붙여 넘긴다
const SC_END=new Set(['end_grandkids','end_couple','end_garden','end_friends','end_album','end_birthday','end_rain_window','end_dawn_walk','end_moving','end_stargaze','end_playground','end_bench','end_neighbors','end_videocall','end_exercise','end_study_night','end_fishing','end_window_night']);
function scHas(n){ if(!n) return false; if(SC_END.has(n)) return true; return /^end_meal_(EA|SE|SA|AF|ME|LA|WE)$/.test(n)||/^town(6|13|19|75)_(EA|SE|SA|AF|ME|LA|WE)$/.test(n)||/^life_(EA|SE|SA|AF|ME|LA|WE)_[mf]$/.test(n); }
function scHash(t){ let h=7; t=String(t||''); for(let i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return h; }
// 종류·문장·나이로 알맞은 그림을 골라 '종류@그림이름'을 돌려준다 (일상(life)과 집 밖(town)만, 나머지는 그대로)
function scVar(kind,txt,age,L){ try{ const g=L&&L.C&&RG_ART[L.C.rg]; if(!g||age==null) return kind;
    if(kind==='town') return 'town@town'+townStage(age)+'_'+g;
    if(kind!=='life') return kind; const t=String(txt||''), meal='end_meal_'+g;
    const R=[[/손주|손자|손녀/,'end_grandkids'],[/생일|케이크|촛불/,'end_birthday'],[/사진|앨범/,'end_album'],[/낚시/,'end_fishing'],[/별을|별이|밤하늘|달을|달이/,'end_stargaze'],[/텃밭|정원|화분|꽃을 심|씨앗/,'end_garden'],
      [/영상통화|전화|편지|소식을 전/,'end_videocall'],[/이웃/,'end_neighbors'],[/산책|바닷가|바다를/,'end_dawn_walk'],[/운동|체조|달리기/,'end_exercise'],[/빗소리|비가 내|비 오는/,'end_rain_window'],[/이사/,'end_moving'],
      [/먹|밥|식사|음식|요리|부엌|반찬|저녁상/,meal],[/친구/,age<60?'end_friends':'end_couple'],[/배우자|아내|남편|부부|둘이서/,age>=50?'end_couple':'end_friends'],[/퇴근|일을 마치|하루를 마치/,'end_bench'],[/공부|책을|숙제/,age<30?'end_study_night':'end_rain_window'],[/놀|술래|운동장|공차기/,age<13?'end_playground':'end_friends']];
    for(const [re,n] of R) if(re.test(t)) return 'life@'+n;
    const pool=age<13?['end_playground','end_birthday',meal,'end_stargaze']:age<30?['end_friends','end_study_night',meal,'end_bench','end_rain_window','end_stargaze']:age<60?[meal,'end_bench','end_neighbors','end_birthday','end_rain_window','end_exercise','end_moving']:['life_'+g+(L.sex===0?'_m':'_f'),'end_couple','end_garden','end_grandkids','end_album','end_window_night','end_videocall','end_fishing','end_dawn_walk',meal];
    return 'life@'+pool[scHash(t+'|'+age)%pool.length]; }catch(e){ return kind; } }
const scBase=k=>String(k||'').split('@')[0];
function scArtName(kind,L){ if(kind==='title') return 'title'; kind=String(kind||''); if(kind.includes('@')){ const [b,n]=kind.split('@'); return scHas(n)?n:scArtName(b,L); }
  if(!SC_ART.has(kind)) return null; const C=L&&L.C, g=C&&RG_ART[C.rg];
  if(g&&kind==='town') return 'town'+townStage(L.age||0)+'_'+g;
  if(g&&kind==='life') return 'life_'+g+(L.sex===0?'_m':'_f'); if(g&&kind==='farewell') return 'farewell_'+g;
  if(C&&SC_RURAL.has(kind)&&(C.tier<=1||(C.tier===2&&L.set==='R'))) return (kind==='baby'?'birth':kind)+'_r';
  if(g){ const k=(kind==='birth'&&g!=='EA'&&g!=='WE')?'baby':kind; if(SC_VAR.has(k+'_'+g)) return k+'_'+g; }
  return kind; }
function scImg(n){ let e=SC_IMG[n]; if(!e){ e=SC_IMG[n]={im:null}; artLoad('art/sc/'+n+'.webp').then(im=>e.im=im).catch(()=>{}); } return e.im; }
function scPreload(kinds,L){ kinds.forEach(k=>{ const n=scArtName(k,L); if(n) scImg(n); }); }
const _drawScene=drawScene;
drawScene=function(x,kind,t,L){ const n=scArtName(kind,L), im=n&&scImg(n);
  if(!im) return _drawScene(x,scBase(kind),t,L);
  const sm=x.imageSmoothingEnabled; x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
  const z=1.05+.035*Math.sin(t*.22), w=160*z, h=80*z, dx=(160-w)/2+Math.sin(t*.15)*2.2, dy=(80-h)/2+Math.cos(t*.13)*1.2;
  x.drawImage(im,dx,dy,w,h);
  // 살짝 움직이는 빛 알갱이
  x.globalCompositeOperation='screen'; for(let i=0;i<7;i++){ const px=(i*29+t*(3+i%3))%170-5, py=(i*17+Math.sin(t*.7+i)*6+80)%80; x.fillStyle=`rgba(255,240,200,${.10+.08*Math.sin(t*1.3+i)})`; x.beginPath(); x.arc(px,py,1.1+(i%3)*.5,0,7); x.fill(); }
  x.globalCompositeOperation='source-over'; x.imageSmoothingEnabled=sm; };

// ----- 사람: 손그림 건물과 어울리도록 부드러운 갈색 테두리와 은은한 명암을 입힌다
const _personSprite=personSprite;
function paintedSprite(s,key,r){ return cached(key,s.width,s.height,(x,c)=>{ const t=mk(s.width,s.height), tx=t.getContext('2d'); tx.drawImage(s,0,0);
    const gr=tx.createLinearGradient(0,0,s.width,s.height); gr.addColorStop(0,'rgba(255,248,230,.10)'); gr.addColorStop(.55,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(60,30,40,.16)');
    tx.globalCompositeOperation='source-atop'; tx.fillStyle=gr; tx.fillRect(0,0,s.width,s.height); tx.globalCompositeOperation='source-over';
    const o=mk(s.width,s.height), ox=o.getContext('2d'); for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; ox.drawImage(s,Math.cos(a)*r,Math.sin(a)*r); }
    ox.globalCompositeOperation='source-in'; ox.fillStyle='#4A3428'; ox.fillRect(0,0,s.width,s.height);
    x.drawImage(o,0,0); x.drawImage(t,0,0); }); }
personSprite=function(o){ const s=_personSprite(o); if(o.half) return s; const key=['PO',o.dir,o.fr|0,o.blink?1:0,o.st,o.skin,o.hair,o.body,o.pants,o.long?1:0,o.hat||'',o.sty|0].join('|');
  const c=paintedSprite(s,key,1.7); c.hi=s.hi; return c; };

// ----- 휴대폰: 게임 화면에서는 가로로 (안드로이드는 전체 화면 + 가로 고정, 아이폰은 돌려 달라는 안내)
(function(){ const game=$('s-game'); if(!game) return;
  const sync=()=>document.body.classList.toggle('ingame',!game.hidden);
  new MutationObserver(sync).observe(game,{attributes:true,attributeFilter:['hidden']}); sync();
  const go=async()=>{ try{ const el=document.documentElement; if(!document.fullscreenElement&&el.requestFullscreen) await el.requestFullscreen({navigationUI:'hide'}); }catch(e){} try{ if(screen.orientation&&screen.orientation.lock) await screen.orientation.lock('landscape'); }catch(e){}
    setTimeout(()=>{ if(innerHeight>innerWidth){ const p=document.querySelector('#rotateTip p'); if(p) p.textContent='이 휴대폰은 자동으로 돌릴 수 없어요. 화면 회전 잠금을 풀고 휴대폰을 직접 가로로 돌려 주세요.'; } },900); };
  const g=$('rotGo'), s=$('rotSkip'); if(g) g.onclick=go; if(s) s.onclick=()=>{ document.body.classList.add('portraitOK'); };
  addEventListener('resize',()=>{ if(typeof resize==='function'&&!game.hidden) resize(); });
})();

// 사건 창의 장면: '종류@그림'이어도 제목은 기본 종류로, 일상·집 밖 장면은 그 나이에 맞는 그림으로
sceneHTML=function(kind){ const b=scBase(kind); return kind?`<canvas class="scene" width="640" height="320" data-sc="${kind}"></canvas><div class="scene-cap">— ${SCENE_TITLE[b]||'삶'} —</div>`:''; };
const _popupSc=popup;
popup=function(tag,txt,fx,after,cls,sc,nt){ if((sc==='life'||sc==='town')&&G.life){ const m=/^(\d+)살/.exec(String(tag||'')); sc=scVar(sc,txt,m?+m[1]:G.life.age,G.life); } return _popupSc(tag,txt,fx,after,cls,sc,nt); };

