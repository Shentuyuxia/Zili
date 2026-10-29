import json, os, numpy as np, soundfile as sf, pyworld as pw
FP=5; R='/home/claude/zili/'
def lv(l): return 150*(330/150)**((np.asarray(l)-1)/4)
def C(code,n):
  u=np.linspace(0,1,n); c=np.clip
  if code=='1': L=5-0.1*u
  elif code=='2': L=np.where(u<.15,3,3+2*(c(u-.15,0,1)/.85)**1.4)
  elif code=='3': L=np.where(u<.4,2.3-1.3*(u/.4)**.8,np.where(u<.68,1-0.05*(u-.4)/.28,0.95+3.3*(c(u-.68,0,1)/.32)**1.2))
  elif code=='3h': L=2.2-1.2*(1-(1-u)**1.5)          # half third: 21
  elif code=='4': L=5.2-4.3*(1-(1-u)**1.6)
  elif code=='4h': L=5.1-3.2*(1-(1-u)**1.6)           # non-final 4th: 52
  else: L=np.full(n,float(code))                   # neutral: a fixed level
  return lv(L)
def syl(c,code,dur,accent=False):
  x,sr=sf.read(f'cards_raw/{ord(c):x}.wav'); x=x.astype(np.float64)
  f0,tt=pw.harvest(x,sr,f0_floor=70,f0_ceil=600,frame_period=FP); sp=pw.cheaptrick(x,f0,tt,sr); ap=pw.d4c(x,f0,tt,sr)
  h=int(sr*FP/1000); e=np.nan_to_num(np.array([np.sqrt(np.mean(x[i*h:(i+1)*h]**2)+1e-12) if x[i*h:(i+1)*h].size else 0 for i in range(len(f0))]))
  keep=np.where(e>e.max()*0.02)[0]; a0,a1=keep[0],keep[-1]
  v=np.where((f0>0)&(e>e.max()*0.18))[0]; v=v[(v>=a0)&(v<=a1)]; v0,v1=v[0],v[-1]
  nv=max(8,int(dur*1000/FP))
  idx=np.concatenate([np.arange(a0,v0),np.linspace(v0,v1,nv),np.arange(v1+1,min(a1+1,len(f0)))])
  ii=np.clip(np.round(idx).astype(int),0,len(f0)-1); sp2=sp[ii]; ap2=ap[ii].copy(); nf=np.zeros(len(ii)); pre=v0-a0
  nf[pre:pre+nv]=C(code,nv); ref=np.median(ap[v0:v1+1],axis=0)
  for k in range(pre,pre+nv): ap2[k]=np.minimum(ap2[k],ref)
  y=pw.synthesize(np.ascontiguousarray(nf),np.ascontiguousarray(sp2),np.ascontiguousarray(ap2),sr,FP)
  if accent:
    env=np.ones(len(y)); s0=int(pre*h); s1=min(len(y),s0+int(.1*sr)); env[s0:s1]=np.linspace(1.25,1,s1-s0); y=y*env
  y=y/np.max(np.abs(y)); return y,sr
NEUT={'1':'2','2':'3','3':'4','4':'1.3'}
def word(w,tones):
  parts=[]
  for i,(c,t) in enumerate(zip(w,tones)):
    last=i==len(w)-1
    if t=='0': code=NEUT.get(tones[i-1],'2.5'); d=.17; amp=.55
    elif t=='3': code='3' if last else '3h'; d=.62 if last else .26; amp=1
    elif t=='4': code='4' if last else '4h'; d=.38 if last else .26; amp=1
    else: code=t; d=.45 if last else .3; amp=1
    if not last and tones[i+1]=='0' and t!='3': d=.38
    if not last and tones[i+1]=='0' and t=='3': code='3h'; d=.32
    y,sr=syl(c,code,d,accent=(t=='4')); parts.append(y*amp)
  out=parts[0]; xf=int(.02*sr)
  for p in parts[1:]:
    gap=np.zeros(int(.03*sr)); out=np.concatenate([out,gap,p])
  out=out/np.max(np.abs(out))*.85; fo=int(.03*sr); out[-fo:]*=np.linspace(1,0,fo)
  return np.concatenate([np.zeros(int(.03*sr)),out,np.zeros(int(.05*sr))]),sr
d=json.load(open(R+'data/pinyin-course.json'))
os.makedirs(R+'audio/words',exist_ok=True); os.makedirs('words_out',exist_ok=True); done={}
V={'ā':1,'á':2,'ǎ':3,'à':4,'ē':1,'é':2,'ě':3,'è':4,'ī':1,'í':2,'ǐ':3,'ì':4,'ō':1,'ó':2,'ǒ':3,'ò':4,'ū':1,'ú':2,'ǔ':3,'ù':4,'ǖ':1,'ǘ':2,'ǚ':3,'ǜ':4}
for L in d['lessons']:
  for g in L.get('groups',[]):
    for it in g['items']:
      if len(it['c'])<2: continue
      tones=str(it.get('say') or it['t']); name='-'.join('%x'%ord(c) for c in it['c'])
      if name not in done:
        y,sr=word(it['c'],tones); sf.write(f'words_out/{name}.wav',y,sr)
        os.system(f'ffmpeg -v error -y -i words_out/{name}.wav -ac 1 -ar 32000 -b:a 64k {R}audio/words/{name}.mp3'); done[name]=1
        g2,_=pw.harvest(y,sr,f0_floor=70,f0_ceil=600,frame_period=40); print(it['c'],tones,' '.join(str(int(q)) for q in g2 if q>0))
      it['au']=f'audio/words/{name}.mp3'
# pair characters without a card
for L in d['lessons']:
  for p in L.get('pairs',[]):
    for c,py in ((p[0],p[1]),(p[2],p[3])):
      f=f'audio/cards/{ord(c):x}.mp3'
      if os.path.exists(R+f): continue
      t=next((str(V[ch]) for ch in py if ch in V),'1'); code=t
      y,sr=syl(c,code,{'1':.55,'2':.55,'3':.8,'4':.42}[t],accent=t=='4'); y=y*.85
      y=np.concatenate([np.zeros(int(.03*sr)),y,np.zeros(int(.05*sr))]); fo=int(.03*sr)
      sf.write('words_out/p.wav',y,sr); os.system(f'ffmpeg -v error -y -i words_out/p.wav -ac 1 -ar 32000 -b:a 64k {R}{f}'); print('pair',c,t)
open(R+'data/pinyin-course.json','w').write(json.dumps(d,ensure_ascii=False,indent=1))
