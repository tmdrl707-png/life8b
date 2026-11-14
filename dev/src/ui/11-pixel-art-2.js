/* ========== 그래픽 2판: 포켓몬·스타듀밸리식 탑다운 도트 ==========
   - 사람: 16×24, 머리가 큰 비율, 눈 반짝임·볼터치, 머리 모양 4가지, 걸을 때 팔다리가 엇갈린다
   - 건물: 지붕이 높이의 절반 가까이, 처마 밑 그림자 띠, 창틀·덧창·화단, 층마다 띠, 문 계단
   - 나무: 잎 덩어리 세 겹, 햇빛은 왼쪽 위에서 */
const SHADOW_C='rgba(24,40,28,.30)';
function dropShadow(c,x,y,w){ x=Math.round(x); y=Math.round(y); c.fillStyle=SHADOW_C; c.fillRect(x-(w>>1)+2,y-1,w-4,1); c.fillRect(x-(w>>1),y,w,2); c.fillRect(x-(w>>1)+2,y+2,w-4,1); }

/* ---------- 사람 ---------- */
/* ---------- 사람 (5판) ----------
   포켓몬·스타듀밸리 같은 인디 도트 게임처럼, 머리와 몸통을 또렷하게 그리고 다리는 짧게 줄였다.
   나이에 따라 몸의 비율이 달라진다: 걸음마(2~5살) · 어린이(6~12살) · 어른 · 노인. */

/* ---------- 나무 ---------- */
function treeSprite(type,sp,v){
  return cached(['T2',type,sp,v].join('|'),16,20,(x,c)=>{ const P=(X,Y,W,H,cc)=>pr(x,X,Y,W,H,cc), col=type==='palm'||type==='bush'?TREE_COL[1]:TREE_COL[sp];
    const blob=(cx,cy,r,c1,c2,c3)=>{ for(let yy=Math.floor(cy-r);yy<=Math.ceil(cy+r);yy++) for(let xx=Math.floor(cx-r);xx<=Math.ceil(cx+r);xx++){ const dx=xx+.5-cx, dy=yy+.5-cy, q=dx*dx+dy*dy; if(q>r*r||xx<0||xx>15||yy<0||yy>19) continue; const sd=(dx+dy)/r; P(xx,yy,1,1,sd>.45?c3:sd>-.1?c2:c1); } };
    if(type==='palm'){ P(7,8,2,11,'#9A7048'); P(7,10,2,1,'#7A5030'); P(8,14,1,1,'#7A5030'); P(8,8,1,11,'#7A5A38'); P(6,18,4,1,'#7A5030'); const f='#4AA040', fD='#2E7A2A', fL='#6CC058';
      P(2,4,12,2,f); P(1,6,3,2,fD); P(12,6,3,2,fD); P(5,2,6,2,f); P(4,1,2,1,fD); P(10,1,2,1,fD); P(7,5,2,2,'#8A5A30'); P(3,4,4,1,fL); P(6,2,3,1,fL); P(9,6,2,1,fD); }
    else if(type==='pine'){ const f=sp===3?'#E8EEF4':'#3A7A48', fD=sp===3?'#B8C4D0':'#24583A', fL=sp===3?'#FFFFFF':'#58A068'; for(let i=0;i<4;i++){ const w=4+i*3; P(8-w/2,2+i*3,w,3,f); P(8,2+i*3,w/2,3,fD); P(8-w/2,2+i*3,w/2-1,1,fL); } P(7,14,2,5,'#7A5030'); P(8,14,1,5,'#5E3E24'); }
    else if(type==='bush'){ blob(5,12.5,4.5,shade(col[0],1.15),col[0],col[1]); blob(11,12.5,4.5,shade(col[0],1.15),col[0],col[1]); blob(8,10.5,5,shade(col[0],1.2),col[0],col[1]); P(3,16,10,1,col[2]); P(6,9,2,1,shade(col[0],1.4)); if(sp===0||sp===2){ P(4,12,1,1,'#FFFFFF'); P(10,10,1,1,'#FFFFFF'); P(8,14,1,1,'#FFE890'); } }
    else if(type==='cactus'){ P(6,4,4,14,'#4A9A50'); P(2,8,3,2,'#4A9A50'); P(2,6,2,3,'#4A9A50'); P(11,9,3,2,'#4A9A50'); P(12,7,2,3,'#4A9A50'); P(8,4,2,14,'#3A7A40'); P(6,5,1,10,'#6AB870'); }
    else { P(6,13,4,6,'#8A5A30'); P(8,13,2,6,'#6A4220'); P(5,18,6,1,'#6A4220'); P(7,15,1,2,'#A87848');
      blob(5,8,4.2,col[0],shade(col[0],.92),col[1]); blob(11,8,4.2,col[0],shade(col[0],.92),col[1]); blob(8,6,5.6,shade(col[0],1.1),col[0],col[1]); blob(8,10,5,col[0],col[1],col[1]);
      for(let i=0;i<5;i++){ const a=2+Math.floor(hash(v+i,3)*11), b=4+Math.floor(hash(i,v+5)*8); P(a,b,2,1,col[2]); }
      P(4,3,3,1,shade(col[0],1.3)); P(3,4,2,1,shade(col[0],1.3)); P(7,2,2,1,shade(col[0],1.3)); P(9,12,3,1,col[2]); P(5,13,2,1,col[2]);
      if(sp===0){ P(6,5,1,1,'#FFFFFF'); P(11,7,1,1,'#FFFFFF'); P(8,10,1,1,'#FFE0EC'); } }
    outline(c); }); }

/* ---------- 건물 ---------- */
const NEWB=['gable','hanok','thatch','tin','flat','awning'];
function signIcon(P,ic,sx,sy){ P(sx,sy,7,7,'#FFFFFF'); P(sx,sy,7,1,'#E8E4DC');
  if(ic==='cross'){ P(sx+3,sy+1,1,5,'#E04848'); P(sx+1,sy+3,5,1,'#E04848'); } else if(ic==='clock'){ P(sx+1,sy+1,5,5,'#F8E8B0'); P(sx+3,sy+2,1,2,INK); P(sx+3,sy+3,2,1,INK); }
  else if(ic==='bag'){ P(sx+1,sy+3,5,3,'#E07040'); P(sx+2,sy+1,3,2,'#E07040'); } else if(ic==='cup'){ P(sx+1,sy+2,4,4,'#8E5B3A'); P(sx+5,sy+3,1,2,'#8E5B3A'); P(sx+2,sy,1,1,'#B8B0A8'); }
  else if(ic==='flag'){ P(sx+1,sy+1,1,5,'#606870'); P(sx+2,sy+1,4,3,'#E2703A'); } else if(ic==='bus'){ P(sx+1,sy+1,5,4,'#3870D0'); P(sx+2,sy+2,3,1,'#9ED0F0'); P(sx+1,sy+5,1,1,INK); P(sx+5,sy+5,1,1,INK); }
  else if(ic==='fish'){ P(sx+1,sy+3,4,2,'#3870D0'); P(sx+5,sy+2,1,4,'#3870D0'); } else if(ic==='star'){ P(sx+3,sy+1,1,5,'#E8B030'); P(sx+1,sy+3,5,1,'#E8B030'); } }
function buildingSprite(kind,w,h,pal,enter){
  const st=Object.assign({},BSTYLE[kind]||BSTYLE.house,pal||{});
  if(!NEWB.includes(st.rt)||st.stilt) return buildingSpriteBase(kind,w,h,pal,enter);
  return cached(['B2',kind,w,h,st.wall,st.roof,enter?1:0].join('|'),w+2,h+12,(x,c)=>{
    const P=(X,Y,W,H,cc)=>pr(x,X+1,Y+10,W,H,cc), wall=st.wall, wL=shade(wall,1.07), wD=shade(wall,.86), wDD=shade(wall,.66), roof=st.roof, rD=shade(roof,.74), rDD=shade(roof,.56), rL=shade(roof,1.28),
      glass='#8EC8EE', glassD='#5E9CD0', gL='#E4F6FF', frame=shade(wall,.55), rt=st.rt;
    const rh=rt==='flat'?(kind==='apt'||kind==='office'||kind==='hospital'||kind==='school'?7:6):rt==='awning'?Math.round(h*.3):Math.round(h*.46);
    const dw=Math.min(12,Math.max(8,Math.round(w*.16))), dh=Math.min(15,h-rh-3), dx=Math.floor(w/2-dw/2), dy=h-dh;
    const win=(X,Y,W,H,lit,shut,box)=>{ P(X-1,Y-1,W+2,H+2,frame); P(X,Y,W,H,lit?'#FFE9A8':glass); if(!lit){ P(X,Y+Math.floor(H/2),W,H-Math.floor(H/2),glassD); P(X,Y,Math.max(1,Math.floor(W/2)-1),1,gL); P(X+1,Y+1,1,Math.max(1,H-3),gL); }
      else { P(X,Y+H-2,W,2,'#F0C870'); P(X+1,Y+1,1,2,'#FFF8E0'); }
      if(W>=6) P(X+Math.floor(W/2),Y,1,H,frame); if(H>=7) P(X,Y+Math.floor(H/2),W,1,frame);
      P(X-2,Y+H+1,W+4,1,wL); if(shut){ P(X-3,Y-1,2,H+2,shut); P(X+W+1,Y-1,2,H+2,shut); P(X-3,Y+2,2,1,shade(shut,.7)); P(X+W+1,Y+2,2,1,shade(shut,.7)); }
      if(box){ P(X-1,Y+H+1,W+2,2,'#7A5236'); for(let i=0;i<W;i+=2) P(X+i,Y+H,1,1,['#E04870','#F8D040','#FFFFFF'][(i/2|0)%3]); P(X,Y+H+1,W,1,'#3E8A3A'); } };
    if(rt==='flat'){
      // ----- 평지붕 건물: 옥상 난간, 층마다 띠, 창문 줄
      P(0,rh,w,h-rh,wall); P(0,rh,w,1,wL); P(w-3,rh,3,h-rh,shade(wall,.92)); P(0,rh+1,1,h-rh,wL);
      P(0,0,w,rh,roof); P(0,0,w,2,rL); P(0,2,w,1,shade(roof,1.1)); P(0,rh-2,w,2,rD); P(0,rh,w,2,wDD);   // 옥상 난간과 그림자
      if(st.tank){ P(w-12,-8,7,8,'#5A80A8'); P(w-12,-8,7,2,'#8AB0D0'); P(w-10,0,1,3,'#48484A'); P(w-7,0,1,3,'#48484A'); }
      else if(kind==='apt'||kind==='office'||kind==='hospital'){ P(4,-4,7,4,'#B4BCC4'); P(4,-4,7,1,'#D0D8E0'); P(5,-3,1,3,'#8A939B'); P(w-12,-3,6,3,'#A0A8B0'); P(w-6,-9,1,9,'#80888E'); P(w-8,-6,5,1,'#80888E'); }
      if(kind==='school'){ const cx=Math.floor(w/2); P(cx-6,-8,12,9,wall); P(cx-6,-8,12,1,wL); P(cx+3,-8,3,9,shade(wall,.9)); P(cx-7,-10,14,3,roof); P(cx-7,-10,14,1,rL); P(cx-3,-6,6,6,'#F8F0D8'); P(cx-3,-6,6,1,'#C8B888'); P(cx,-5,1,3,INK); P(cx,-3,2,1,INK); P(cx-1,-12,2,2,'#E8C050'); }
      // 문 위 차양
      if(rt==='flat'){
        if(kind==='office'||kind==='hospital'){ const flr=9; for(let yy=rh+3;yy+6<=h-3;yy+=flr){ if(yy+6>dy-2&&true){ } P(2,yy,w-4,6,glassD); P(2,yy,w-4,2,glass); for(let xx=2;xx<w-2;xx+=8) P(xx,yy,1,6,frame); P(2,yy,w-4,1,gL); for(let xx=4;xx<w-8;xx+=11) P(xx,yy+2,3,1,gL); P(0,yy+6,w,1,wD); P(0,yy+7,w,1,wDD); }
          if(kind==='hospital'){ P(0,h-7,w,2,'#58B878'); } }
        else { const ww=kind==='school'?9:6, gap=kind==='school'?8:kind==='apt'?7:5, flr=kind==='apt'?10:9; let row=0;
          for(let yy=rh+3;yy+6<=h-4;yy+=flr,row++){ P(0,yy-2,w,1,wD); for(let xx=3,i=0;xx+ww<=w-2;xx+=ww+gap,i++){ if(yy+6>dy-3&&xx+ww>dx-3&&xx<dx+dw+3) continue; const lit=hash(xx*3+row,yy)<.2; win(xx,yy,ww,6,lit,null,false);
              if(kind==='apt'){ P(xx-1,yy+8,ww+2,1,wDD); P(xx-1,yy+7,ww+2,1,wL); if(hash(xx,yy+9)<.3) P(xx+1,yy+5,Math.min(4,ww-2),2,'#B0B8C0'); else if(hash(xx+2,yy)<.3) P(xx+Math.floor(ww/2),yy+6,2,2,'#E8A0B0'); } } } }
      }
    }
    else if(rt==='awning'){
      // ----- 가게: 윗 간판 띠, 줄무늬 차양, 큰 유리창, 문
      P(0,rh-3,w,h-rh+3,wall); P(w-3,rh-3,3,h-rh+3,shade(wall,.92)); P(0,rh-3,1,h-rh+3,wL); P(0,0,w,rh-3,wall); P(0,0,w,3,roof); P(0,0,w,1,rL); P(0,3,w,rh-6,shade(roof,1.12)); P(0,rh-5,w,2,rD);
      const sgx=dx+dw+3, ic=st.sign; const n=Math.max(4,Math.round(w/6)); for(let i=0;i<n;i++){ const xx=Math.floor(w*i/n), ww=Math.ceil(w/n); P(xx,rh-3,ww,5,i%2?'#FFFFFF':roof); P(xx,rh-3,ww,1,i%2?'#F0ECE4':rL); P(xx,rh+2,ww,1,i%2?'#E0DCD2':rD); if(i%2===0) P(xx+1,rh+3,ww-2,1,rD); else P(xx+1,rh+3,ww-2,1,'#E8E4DA'); }
      P(0,rh+4,w,1,'rgba(40,30,20,.25)');
      const ww=Math.floor((w-dw)/2)-6; if(ww>=4){ [3,w-3-ww].forEach(X=>{ const Y=rh+6, H=Math.max(6,h-3-Y-3); P(X-1,Y-1,ww+2,H+2,frame); P(X,Y,ww,H,glass); P(X,Y+Math.floor(H*.55),ww,H-Math.floor(H*.55),glassD); P(X+1,Y+1,2,1,gL); P(X+1,Y+2,1,2,gL);
        if(kind==='cafe'){ P(X+2,Y+H-3,3,3,'#8E5B3A'); P(X+ww-5,Y+H-3,3,3,'#C2784A'); P(X+3,Y+H-5,1,2,'#F8F0E0'); }
        else { for(let i=0;i<ww-3;i+=4){ P(X+1+i,Y+H-4,3,4,['#E05838','#3870D0','#40A048','#E8B030'][(i/4|0)%4]); P(X+1+i,Y+H-5,3,1,'#FFFFFF'); } }
        P(X-1,Y+H+1,ww+2,1,wL); }); }
      if(kind==='market'){ P(2,h-4,6,4,'#B88A58'); P(3,h-5,4,2,'#E85030'); P(w-9,h-4,6,4,'#B88A58'); P(w-8,h-5,4,2,'#F0B030'); }
      if(ic&&sgx+7<w) { P(sgx-1,rh+7,0,0,wall); signIcon(P,ic,sgx,Math.max(1,rh-12)); }
    }
    else {
      // ----- 지붕이 큰 집 (맞배·기와·초가·함석)
      P(0,rh-2,w,h-rh+2,wall); P(w-3,rh-2,3,h-rh,shade(wall,.9)); P(0,rh,1,h-rh,wL);
      if(kind!=='barn') for(let yy=rh+4;yy<h-4;yy+=4) P(1,yy,w-3,1,shade(wall,.93));       // 널빤지 선
      P(0,h-3,w,3,wDD); for(let xx=1;xx<w-1;xx+=5) P(xx,h-3,3,1,shade(wDD,1.25)); P(0,h-3,w,1,shade(wDD,1.1));  // 돌 기단
      // 굴뚝
      if(kind==='house'||kind==='hall'||kind==='studio') { const cxx=Math.round(w*.72); P(cxx,-6,5,8,'#9A5A48'); P(cxx,-6,5,1,'#C88070'); P(cxx-1,-7,7,2,'#6A4038'); P(cxx+4,-5,1,6,'#7A4838'); }
      // 지붕판
      P(-1,0,w+2,rh,roof); P(-1,0,w+2,2,rL); P(-1,rh-3,w+2,3,rD);
      if(rt==='gable') { P(-1,2,Math.floor(w*.33),rh-5,shade(roof,1.07)); P(w-Math.floor(w*.28),2,Math.floor(w*.28)+1,rh-5,shade(roof,.9));
        for(let y=3;y<rh-3;y+=3){ P(-1,y,w+2,1,shade(roof,.82)); for(let xx=(y%2)*3-1;xx<w+1;xx+=6) P(xx,y+1,1,2,shade(roof,.82)); } }
      if(rt==='tin'){ for(let xx=-1;xx<w+1;xx+=3){ P(xx,2,1,rh-5,shade(roof,.78)); P(xx+1,2,1,rh-5,shade(roof,1.12)); } P(-1,Math.floor(rh/2),w+2,1,shade(roof,.9)); for(let xx=2;xx<w;xx+=9) P(xx,Math.floor(rh/2)-1,1,1,'#5A5A5A'); }
      if(rt==='thatch') for(let y=2;y<rh-3;y+=2) for(let xx=(y%4)-1;xx<w+1;xx+=4){ P(xx,y,2,1,shade(roof,.82)); P(xx+2,y+1,1,1,shade(roof,1.12)); }
      if(rt==='hanok'){ P(-4,rh-5,4,3,roof); P(w+1,rh-5,3,3,rD); for(let xx=0;xx<w;xx+=3){ P(xx,2,1,rh-5,shade(roof,.8)); P(xx+1,2,1,rh-5,shade(roof,1.1)); } P(-1,0,w+2,2,'#E8E8E0'); P(-1,1,w+2,1,'#B8BCC0'); P(-1,rh-3,w+2,1,'#E8E8E0'); }
      P(-1,rh,w+2,2,wDD); P(-1,rh+2,w+2,1,shade(wall,.78));      // 처마 밑 그림자 띠
      // 창문과 덧창
      const wy=rh+4, wh=Math.min(8,dh-5);
      if(st.win==='two'){ const ww=Math.min(10,Math.floor((w-dw)/2)-8); if(ww>=4){ const shut=kind==='house'||kind==='hall'?(hash(w,h)<.5?'#3E7A58':'#8A4A3A'):null; win(5,wy,ww,wh,false,shut,kind==='house'&&hash(h,w)<.6); win(w-5-ww,wy,ww,wh,hash(w+h,3)<.15,shut,false); } }
      else if(st.win==='barn'){ P(dx-5,dy-4,dw+10,dh+4,shade(wall,.78)); P(dx-5,dy-4,dw+10,1,'#E8D8C8'); for(let i=0;i<dw+10;i+=1) if(i%2===0) P(dx-5+i,dy-3,1,dh+3,shade(wall,.7)); P(dx-5,dy-4,1,dh+4,'#E8D8C8'); P(dx+dw+4,dy-4,1,dh+4,'#E8D8C8'); P(dx-4,dy-3,2,2,'#E8D8C8'); for(let i=0;i<dh+3;i++){ P(dx-4+Math.floor(i*(dw+8)/(dh+3)),dy-3+i,1,1,'#E8D8C8'); P(dx+dw+3-Math.floor(i*(dw+8)/(dh+3)),dy-3+i,1,1,'#E8D8C8'); } }
      else if(st.win==='small'){ win(4,wy,5,5,false,null,false); win(w-9,wy,5,5,false,null,false); }
      if(st.sign){ const sgx=dx+dw+3; if(sgx+7<w) signIcon(P,st.sign,sgx,dy-9); }
    }
    // ----- 문 (프레임 + 널 + 손잡이 + 계단)
    const door=enter;
    if(rt==='flat'&&(kind==='apt'||kind==='office'||kind==='hospital'||kind==='school')){ P(dx-3,dy-4,dw+6,2,rDD); P(dx-3,dy-4,dw+6,1,rL); P(dx-3,dy-2,dw+6,1,'rgba(30,20,20,.3)');
      P(dx-1,dy-2,dw+2,dh+2,frame); P(dx,dy-1,dw,dh+1,door?'#FFE9A8':glassD); if(!door){ P(dx,dy-1,dw,3,glass); P(dx+Math.floor(dw/2),dy-1,1,dh+1,frame); P(dx+1,dy,1,3,gL); } else { P(dx+1,dy,dw-2,dh-1,'#FFF6D0'); P(dx+Math.floor(dw/2),dy-1,1,dh+1,'#E8C060'); } }
    else if(rt!=='awning'||true){ P(dx-1,dy-1,dw+2,dh+1,frame); P(dx,dy,dw,dh,door?'#FFE9A8':'#8A5A3A'); if(!door){ P(dx,dy,dw,1,shade('#8A5A3A',.75)); P(dx+1,dy+2,dw-2,Math.max(2,Math.floor(dh/2)-2),shade('#8A5A3A',.88)); P(dx+1,dy+dh-5,dw-2,3,shade('#8A5A3A',.88)); P(dx,dy,1,dh,shade('#8A5A3A',1.18)); P(dx+dw-3,dy+Math.floor(dh/2),1,2,'#F2C14E'); }
      else { P(dx+1,dy+1,dw-2,dh-1,'#FFF6D0'); P(dx+Math.floor(dw/2),dy+1,1,dh-1,'#E8C060'); } }
    P(dx-2,h,dw+4,1,'#B8B0A4'); P(dx-1,h+1,dw+2,1,'#9A9288');
    if(door){ P(dx-1,h,dw+2,1,'#E2703A'); }
    outline(c);
  }); }
