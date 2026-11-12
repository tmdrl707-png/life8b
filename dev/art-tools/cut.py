import numpy as np, sys
from PIL import Image
from scipy import ndimage as nd
im=np.asarray(Image.open('/mnt/user-data/uploads/Downloads/life8b_art_bld.png').convert('RGB')).astype(np.float32)
SH=572
names=[['house','apt','shop','school'],['cafe','market','office','hospital'],['hanok','hall','station','barn'],['studio','flat','tin','thatch'],
 ['factory','mine','port','kiosk'],['dome','ger','stilt','adobe'],['schoolS','clinic','tinS','house_eu'],['busstop','play','lamp','pole'],
 ['tree','tree_sp','tree_au','tree_wi','pine','pine_sn','palm','bush','cactus'],
 ['car','bus','truck','cycle','moto','horse','dog','cat','chick']]
out='/home/claude/art/spr/'
def key(a):
    r,g,b=a[...,0],a[...,1],a[...,2]
    # magenta-ness: high r & b, low g
    m=np.minimum(r,b)-g   # ~255 for pure magenta
    d=np.sqrt((r-255)**2+(g)**2+(b-255)**2)
    alpha=np.clip((d-60)/80,0,1)   # soft edge
    # despill: pull magenta out of semi-transparent edges
    spill=np.clip(np.minimum(r,b)-g,0,None)
    k=(1-alpha)
    rgb=a.copy()
    lim=g+ (np.maximum(r,b)-g)*0  
    rgb[...,0]=np.where(spill>40, np.minimum(r, g+ (r-g)*0.35+ 30), r)
    rgb[...,2]=np.where(spill>40, np.minimum(b, g+ (b-g)*0.35+ 30), b)
    return rgb,alpha
for si,nm in enumerate(names):
    a=im[si*SH:(si+1)*SH]
    # crop off 4px border & rounded corners
    rgb,al=key(a)
    mask=al>0.5
    mask=nd.binary_closing(mask,iterations=2)
    lab,n=nd.label(mask)
    objs=nd.find_objects(lab)
    comps=[]
    for i,sl in enumerate(objs):
        area=(lab[sl]==i+1).sum()
        if area<1500: continue
        comps.append((sl,i+1,area))
    # merge components whose boxes overlap a grid cell: assign by cell
    cols=3 if len(nm)==9 else 2; rows=len(nm)//cols
    cells={}
    for sl,idx,area in comps:
        cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
        c=min(cols-1,int(cx/(1024/cols))); r=min(rows-1,int(cy/(SH/rows)))
        cells.setdefault(r*cols+c,[]).append((sl,idx))
    for ci,n_ in enumerate(nm):
        if ci not in cells: print('MISSING',n_); continue
        m=np.zeros(mask.shape,bool)
        for sl,idx in cells[ci]: m|=lab==idx
        ys,xs=np.where(m); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        # alpha = soft alpha limited to dilated component region
        reg=nd.binary_dilation(m,iterations=3)
        A=(al*reg)[y0:y1,x0:x1]
        C=rgb[y0:y1,x0:x1]
        o=np.dstack([C,A*255]).clip(0,255).astype(np.uint8)
        Image.fromarray(o,'RGBA').save(out+n_+'.png')
        print(n_,x1-x0,y1-y0)
