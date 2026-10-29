import json, os, soundfile as sf
from kokoro_onnx import Kokoro
from misaki import zh
d=json.load(open('/home/claude/zili/data/pinyin-course.json'))
chars={}
for L in d['lessons']:
  for g in L.get('groups',[]):
    for it in g['items']:
      if isinstance(it['t'],int) and 1<=it['t']<=4 and len(it['c'])==1: chars[it['c']]=it['t']
  for p in L.get('pairs',[]):
    for c,py in ((p[0],p[1]),(p[2],p[3])):
      pass
json.dump(chars,open('cards.json','w'),ensure_ascii=False)
k=Kokoro("kk/kokoro-v1.0.onnx","kk/voices-v1.0.bin"); g2p=zh.ZHG2P()
os.makedirs('cards_raw',exist_ok=True)
for c in chars:
  ph=g2p(c)
  ph=ph[0] if isinstance(ph,tuple) else ph
  a,sr=k.create(ph,voice='zf_xiaoxiao',speed=0.9,lang='z',is_phonemes=True)
  sf.write(f'cards_raw/{ord(c):x}.wav',a,sr)
print(len(chars))
