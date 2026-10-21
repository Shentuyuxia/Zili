#!/usr/bin/env python3
"""Build dict/py.txt: pinyin → words index for the dictionary search.
Line format:  <toneless syllables joined, ü as v>\t<word>:<tone digits> <word>:<tone digits> …   (most frequent first, max 40)
Words: HSK words, common words from the segmenter list (cost <= 15) and all single characters with stroke data.
Readings from the built dictionary (dict/d/*.json).  Run after tools/build_dict.py.
"""
import glob, json, os, re, unicodedata
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
cost = {}; c = 20
for line in open(os.path.join(ROOT, "dict", "seg.txt"), encoding="utf8"):
    line = line.rstrip("\n")
    if line.startswith("#"): c = int(line[1:]); continue
    for w in line.split(" "):
        if w: cost[w] = c
D = {}
for f in glob.glob(os.path.join(ROOT, "dict", "d", "*.json")):
    D.update(json.load(open(f, encoding="utf8")))
hsk = {w for w, rows in D.items() if any(len(r) > 3 for r in rows)}
strokechars = set()
for f in glob.glob(os.path.join(ROOT, "strokes", "*.json")):
    strokechars.update(json.load(open(f, encoding="utf8")).keys())
keep = {w for w in D if w in hsk or cost.get(w, 99) <= 15 or (len(w) == 1 and w in strokechars)}
MARK = {"̄": "1", "́": "2", "̌": "3", "̀": "4"}
def split(py):
    """'lǜ shī' -> ('lvshi', '41'): letters without tones (ü as v) and one tone digit per syllable (5 = neutral)"""
    letters, tones = "", ""
    for syl in py.lower().split():
        t = "5"; out = ""
        for ch in unicodedata.normalize("NFD", syl):
            if ch in MARK: t = MARK[ch]
            elif ch == "\u0308": out = out[:-1] + "v" if out.endswith("u") else out
            elif "a" <= ch <= "z": out += ch
        letters += out; tones += t
    return letters, tones
import subprocess, tempfile
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf8") as fh:
    json.dump(sorted(keep), fh, ensure_ascii=False); tmp = fh.name
js = "const {pinyin}=require('pinyin-pro');const w=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));const o={};for(const x of w)o[x]=pinyin(x,{toneType:'num',type:'array'}).join('');console.log(JSON.stringify(o))"
COMMON = json.loads(subprocess.run(["node", "-e", js, tmp], cwd=ROOT, capture_output=True, text=True, check=True).stdout); os.unlink(tmp)
def common_tones(w):  # pinyin-pro gives e.g. "ma3" / "zhong1guo2" -> "3" / "12"; neutral tone is 0 there
    return "".join(ch for ch in COMMON.get(w, "") if ch.isdigit()).replace("0", "5")
idx = {}
for w in keep:
    seen = set()
    for r in D[w]:
        if r[0][:1].isupper() and len(D[w]) > 1: continue   # skip surname / place readings when there are others
        k, t = split(r[0])
        if not k or (k, t) in seen: continue
        cm = COMMON.get(w, ""); cm_letters = "".join(ch for ch in cm if not ch.isdigit()).replace("ü", "v")
        seen.add((k, t)); rare = 0 if (t == common_tones(w) and k == cm_letters) else 6
        idx.setdefault(k, []).append((cost.get(w, 30) - (3 if w in hsk else 0) + rare, w, t))
with open(os.path.join(ROOT, "dict", "py.txt"), "w", encoding="utf8") as fh:
    for k in sorted(idx):
        rows = sorted(idx[k])[:40]
        fh.write(k + "\t" + " ".join(f"{w}:{t}" for _, w, t in rows) + "\n")
print(len(keep), "words,", len(idx), "keys")
