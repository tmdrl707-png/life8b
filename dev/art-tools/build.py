import numpy as np, json, os
from PIL import Image
from scipy import ndimage as nd
D='/mnt/user-data/uploads/Downloads/'
def key(a):
    r,g,b=a[...,0],a[...,1],a[...,2]
    d=np.sqrt((r-255)**2+g**2+(b-255)**2)
    al=np.clip((d-60)/80,0,1)
    rgb=a.copy(); spill=np.minimum(r,b)-g
    m=spill>18
    rgb[...,0]=np.where(m,np.minimum(r,g*1.25+22),r)
    rgb[...,2]=np.where(m,np.minimum(b,g*1.15+18),b)
    return rgb,al
def cut(a,names,cols,rows,minarea=1500):
    rgb,al=key(a); mask=nd.binary_closing(al>.5,iterations=2); lab,n=nd.label(mask)
    H,W=mask.shape; cells={}
    for i,sl in enumerate(nd.find_objects(lab)):
        if (lab[sl]==i+1).sum()<minarea: continue
        cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
        c=min(cols-1,int(cx/(W/cols))); r=min(rows-1,int(cy/(H/rows))); cells.setdefault(r*cols+c,[]).append(i+1)
    out={}
    for ci,nm in enumerate(names):
        if nm is None: continue
        m=np.isin(lab,cells.get(ci,[]))
        ys,xs=np.where(m); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        A=(al*nd.binary_dilation(m,iterations=3))[y0:y1,x0:x1]
        out[nm]=Image.fromarray(np.dstack([rgb[y0:y1,x0:x1],A*255]).clip(0,255).astype(np.uint8),'RGBA')
    return out
bld=np.asarray(Image.open(D+'life8b_art_bld.png').convert('RGB')).astype(np.float32)
SH=572
sheets=[['house','apt','shop','school'],['cafe','market','office','hospital'],['hanok','hall','station','barn'],['studio','flat','tin','thatch'],
 ['factory','mine','port','kiosk'],['dome','ger','stilt','adobe'],['schoolS','clinic','tinS','house_eu'],['busstop','play','lamp','pole'],
 ['tree','tree_sp','tree_au','tree_wi','pine','pine_sn','palm','bush','cactus'],
 ['car','bus','truck','cycle','moto','horse','dog','cat','chick']]
spr={}
for si,nm in enumerate(sheets):
    cols=3 if len(nm)==9 else 2
    spr.update(cut(bld[si*SH:(si+1)*SH],nm,cols,len(nm)//cols))
tex=np.asarray(Image.open(D+'life8b_art_tex.png').convert('RGB')).astype(np.float32)
fur=['bed','sofa','tv','table','desk','counter','shelf','piano','mat','radio','hearth','board']
spr.update(cut(tex[SH:2*SH],fur,4,3))
wk=np.asarray(Image.open(D+'life8b_art_work.png').convert('RGB')).astype(np.float32)
spr.update(cut(wk,['w_desk','w_machine','w_hay','w_goods','w_bed','w_cart','w_fish','w_easel','w_white','w_belt','w_fence','w_rack'],4,3))
lm=np.asarray(Image.open(D+'life8b_art_lm.png').convert('RGB')).astype(np.float32)
spr.update(cut(lm,['lm_mt','lm_tp','lm_ct','lm_ds'],2,2))
# size limits (max dimension)
LIM={'tree':130,'tree_sp':130,'tree_au':130,'tree_wi':130,'pine':130,'pine_sn':130,'palm':140,'bush':110,'cactus':120,'lamp':110,'pole':110,
 'car':150,'bus':200,'truck':170,'cycle':130,'moto':130,'horse':150,'dog':80,'cat':80,'chick':56}
for k in fur: LIM[k]=170
for k in ['lm_mt','lm_tp','lm_ct','lm_ds']: LIM[k]=300
for k in ['w_desk','w_machine','w_hay','w_goods','w_bed','w_cart','w_fish','w_easel','w_white','w_belt','w_fence','w_rack']: LIM[k]=150
for k,im in spr.items():
    lim=LIM.get(k,270); s=min(1,lim/max(im.size))
    if s<1: spr[k]=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
# shelf pack
items=sorted(spr.items(),key=lambda kv:-kv[1].height); AW=2048; x=y=rh=0; pos={}
for k,im in items:
    if x+im.width+2>AW: x=0; y+=rh+2; rh=0
    pos[k]=[x,y,im.width,im.height]; x+=im.width+2; rh=max(rh,im.height)
at=Image.new('RGBA',(AW,y+rh),(0,0,0,0))
for k,im in items: at.paste(im,(pos[k][0],pos[k][1]))
at.save('/home/claude/life8b/art/spr.webp',quality=88,method=6)
# textures
def seam(t):
    t=t.astype(np.float32); n=t.shape[0]; r=np.roll(np.roll(t,n//2,0),n//2,1)
    v=1-np.abs(np.linspace(-1,1,n)); w=np.minimum.outer(v,v)[...,None]; w=np.clip(w*2.2,0,1)
    return (t*w+r*(1-w)).clip(0,255).astype(np.uint8)
def cells(a,cols,rows):
    rgb,al=key(a); mask=al>.5; lab,n=nd.label(nd.binary_opening(mask,iterations=3)); H,W=mask.shape; res={}
    for i,sl in enumerate(nd.find_objects(lab)):
        h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start
        if h<60 or w<60: continue
        cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
        res[min(rows-1,int(cy/(H/rows)))*cols+min(cols-1,int(cx/(W/cols)))]=sl
    return res
T1=tex[0:SH]; c1=cells(T1,5,3)
T3=tex[2*SH:3*SH]; c3=cells(T3,4,2)
TN={0:'g',1:'f',2:'p',3:'w',5:'r',6:'k',10:'s',11:'c',14:'d'}
TN3={0:'wood',1:'tile',2:'earth',3:'tatami',4:'carpet',5:'lino',6:'concrete',7:'rock'}
texs={}
for src,cc,mp in [(T1,c1,TN),(T3,c3,TN3)]:
    for ci,nm in mp.items():
        sl=cc[ci]; h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start; m=int(min(h,w)*.08)
        s=min(h,w)-2*m; y0=sl[0].start+(h-s)//2; x0=sl[1].start+(w-s)//2
        if nm in ('d','rock'): s=int(min(h,w)*.68); y0=sl[0].start+m; x0=sl[1].start+m
        t=src[y0:y0+s,x0:x0+s]
        im=Image.fromarray(t.clip(0,255).astype(np.uint8)).resize((128,128),Image.LANCZOS)
        texs[nm]=im if nm in('carpet','tatami') else Image.fromarray(seam(np.asarray(im)))
tn=list(texs); ta=Image.new('RGB',(128*len(tn),128))
for i,k in enumerate(tn): ta.paste(texs[k],(i*128,0))
ta.save('/home/claude/life8b/art/tex.webp',quality=86,method=6)
json.dump({'spr':pos,'tex':tn},open('/home/claude/life8b/art/atlas.json','w'))
print(at.size, os.path.getsize('/home/claude/life8b/art/spr.webp'), os.path.getsize('/home/claude/life8b/art/tex.webp'), sorted(set(TN.values())|set(TN3.values())))
