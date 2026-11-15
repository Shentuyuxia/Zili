#!/usr/bin/env python3
"""Pre-generate natural Mandarin audio (Azure neural voice) for the word lists.

Words (column 0) and example sentences (column 5) of data/zh-HSK*.json become audio/tts/<hash>.mp3.
The app computes the same hash from the text (see ttsKey in index.html), so no index file is needed.
Usage: AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope python3 tools/build_tts.py [--limit 20] [--voice zh-CN-XiaoxiaoNeural]
Existing files are skipped, so it is safe to run again and again.
"""
import json, os, sys, glob, time, argparse, urllib.request, urllib.error
from xml.sax.saxutils import escape

def cyrb53(s, seed=0):  # identical to ttsKey() in index.html
    M=0xFFFFFFFF
    def imul(a,b): return (a*b)&M
    h1=(0xdeadbeef^seed)&M; h2=(0x41c6ce57^seed)&M
    for ch in s.encode("utf-16-le").decode("utf-16-le"):
        for c in (ord(ch),) if ord(ch)<0x10000 else ((0xD800+((ord(ch)-0x10000)>>10)),(0xDC00+((ord(ch)-0x10000)&0x3FF))):
            h1=imul(h1^c,2654435761); h2=imul(h2^c,1597334677)
    h1=imul(h1^(h1>>16),2246822507)^imul(h2^(h2>>13),3266489909); h1&=M
    h2=imul(h2^(h2>>16),2246822507)^imul(h1^(h1>>13),3266489909); h2&=M
    return format(h2&0x1FFFFF,"x").rjust(6,"0")+format(h1,"x").rjust(8,"0")

def texts(limit):
    seen=[]; s=set()
    for f in sorted(glob.glob("data/zh-HSK*.json")):
        for row in json.load(open(f,encoding="utf-8")):
            for i in (0,5):
                t=(row[i] if len(row)>i else "").strip()
                if t and t not in s: s.add(t); seen.append(t)
    return seen[:limit] if limit else seen

def synth(t,key,region,voice):
    ssml=f'<speak version="1.0" xml:lang="zh-CN" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="{voice}">{escape(t)}</voice></speak>'
    req=urllib.request.Request(f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1",data=ssml.encode("utf-8"),headers={
        "Ocp-Apim-Subscription-Key":key,"Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-24khz-48kbitrate-mono-mp3","User-Agent":"zili-tts"})
    for n in range(4):
        try:
            with urllib.request.urlopen(req,timeout=30) as r: return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429,500,502,503): time.sleep(2*(n+1)); continue
            raise
    raise RuntimeError("gave up on "+t)

if __name__=="__main__":
    ap=argparse.ArgumentParser(); ap.add_argument("--limit",type=int,default=0); ap.add_argument("--voice",default="zh-CN-XiaoxiaoNeural"); ap.add_argument("--test-hash",action="store_true")
    a=ap.parse_args()
    if a.test_hash:
        for t in ["我","我喜欢动物。","😀你好"]: print(t,cyrb53(t))
        sys.exit()
    key=os.environ["AZURE_SPEECH_KEY"]; region=os.environ["AZURE_SPEECH_REGION"]; os.makedirs("audio/tts",exist_ok=True)
    todo=[t for t in texts(a.limit) if not os.path.exists(f"audio/tts/{cyrb53(t)}.mp3")]
    print(len(todo),"to generate, characters:",sum(len(t) for t in todo))
    for n,t in enumerate(todo,1):
        open(f"audio/tts/{cyrb53(t)}.mp3","wb").write(synth(t,key,region,a.voice)); time.sleep(0.15)
        if n%50==0: print(n,"done")
