import json, os, sys, numpy as np, soundfile as sf, pyworld as pw
chars=json.load(open('cards.json'))
FP=5
def lv(l): return 150*(330/150)**((l-1)/4)
def contour(t,n):
  u=np.linspace(0,1,n); 
  if t==1: L=5-0.1*u
  elif t==2: L=np.where(u<.15,3,3+2*(np.clip(u-.15,0,1)/.85)**1.4)
  elif t==3: L=np.where(u<.4,2.3-1.3*(u/.4)**.8,np.where(u<.68,1-0.05*(u-.4)/.28,0.95+3.3*(np.clip(u-.68,0,1)/.32)**1.2))
  else: L=5.2-4.3*(1-(1-u)**1.6)
  return lv(L)
TD={1:.55,2:.55,3:.8,4:.42}
os.makedirs('cards_out',exist_ok=True); rep={}
for c,t in chars.items():
  x,sr=sf.read(f'cards_raw/{ord(c):x}.wav'); x=x.astype(np.float64)
  f0,tt=pw.harvest(x,sr,f0_floor=70,f0_ceil=600,frame_period=FP); sp=pw.cheaptrick(x,f0,tt,sr); ap=pw.d4c(x,f0,tt,sr)
  e=np.nan_to_num(np.array([np.sqrt(np.mean(x[int(i*sr*FP/1000):int((i+1)*sr*FP/1000)]**2)+1e-12) for i in range(len(f0))]))
  keep=np.where(e>e.max()*0.02)[0]; a0,a1=keep[0],keep[-1]
  v=np.where(f0>0)[0]; v=v[(v>=a0)&(v<=a1)]
  if len(v)<5: rep[c]='novoice'; continue
  v0,v1=v[0],v[-1]
  nv=int(TD[t]*1000/FP)
  idx=np.concatenate([np.arange(a0,v0),np.linspace(v0,v1,nv),np.arange(v1+1,min(a1+1,len(f0)))])
  ii=np.clip(np.round(idx).astype(int),0,len(f0)-1)
  sp2=sp[ii]; ap2=ap[ii].copy(); nf=np.zeros(len(ii))
  pre=v0-a0; nf[pre:pre+nv]=contour(t,nv)
  ref=np.median(ap[v0:v1+1],axis=0)
  for k in range(pre,pre+nv): ap2[k]=np.minimum(ap2[k],ref)
  y=pw.synthesize(np.ascontiguousarray(nf),np.ascontiguousarray(sp2),np.ascontiguousarray(ap2),sr,FP)
  # amplitude: 4th tone a bit of accent at the start
  if t==4:
    env=np.ones(len(y)); s0=int(pre*FP/1000*sr); s1=min(len(y),s0+int(.12*sr)); env[s0:s1]=np.linspace(1.25,1,s1-s0); y=y*env
  y=y/np.max(np.abs(y))*0.85
  fo=int(.03*sr); y[-fo:]*=np.linspace(1,0,fo); fi=int(.005*sr); y[:fi]*=np.linspace(0,1,fi)
  y=np.concatenate([np.zeros(int(.03*sr)),y,np.zeros(int(.05*sr))])
  sf.write(f'cards_out/{ord(c):x}.wav',y,sr)
  g,_=pw.harvest(y,sr,f0_floor=70,f0_ceil=600,frame_period=40); rep[c]=' '.join(str(int(q)) for q in g if q>0)
for c in list(rep)[:12]: print(c,chars.get(c),rep[c])
print('novoice',[c for c,r in rep.items() if r=='novoice'])
