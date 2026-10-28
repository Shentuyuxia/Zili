#!/usr/bin/env python3
"""Pinyin chart for the 拼音课: for every Mandarin syllable, one common character per tone.

  python3 tools/build_pychart.py   →  data/pinyin-chart.json  {"ma": ["妈","麻","马","骂"], ...}  ("" = no common character)

Uses dict/py.txt (syllable → words with tone digits) and dict/seg.txt (word frequency cost: lower = more common).
Characters from the HSK word bank are preferred. The app plays the character (system voice reads characters reliably).
"""
import json, os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
cost = {}; c = None
for line in open(os.path.join(ROOT, "dict", "seg.txt"), encoding="utf8"):
    line = line.strip()
    if line.startswith("#"): c = int(line[1:]); continue
    for w in line.split():
        if len(w) == 1 and w not in cost: cost[w] = c
hsk = {}
for i, lv in enumerate(["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"]):
    for r in json.load(open(os.path.join(ROOT, "data", f"zh-{lv}.json"), encoding="utf8")):
        for ch in r[0]:
            hsk.setdefault(ch, i)
MAXCOST = 13  # ignore rare characters
# the default (most common) reading of every character, from pinyin-pro: a polyphone is used only for its main reading,
# because the system voice reads a single character with its main reading (吗 → ma, never mǎ)
import subprocess, tempfile
chars = sorted(cost)
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf8") as fh:
    json.dump(chars, fh, ensure_ascii=False); tmp = fh.name
js = "const {pinyin}=require('pinyin-pro');const a=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));const o={};for(const c of a)o[c]=pinyin(c,{toneType:'num'});console.log(JSON.stringify(o))"
main = json.loads(subprocess.run(["node", "-e", js, tmp], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
os.unlink(tmp)
out = {}
for line in open(os.path.join(ROOT, "dict", "py.txt"), encoding="utf8"):
    key, _, rest = line.rstrip("\n").partition("\t")
    if not re.fullmatch(r"[a-zv]+", key): continue
    cand = {1: [], 2: [], 3: [], 4: []}
    for x in rest.split(" "):
        w, _, t = x.rpartition(":")
        if len(w) == 1 and t in ("1", "2", "3", "4") and re.fullmatch(r"[一-鿿]", w):
            cand[int(t)].append(w)
    if not any(cand.values()): continue
    row = []
    for t in (1, 2, 3, 4):
        want = key + str(t)
        ok = [w for w in cand[t] if (w in hsk or cost.get(w, 99) <= 10) and cost.get(w, 99) <= MAXCOST and main.get(w, "").replace("ü", "v") == want]
        ok.sort(key=lambda w: (hsk.get(w, 9), cost.get(w, 99)))
        row.append(ok[0] if ok else "")
    if any(row): out[key.replace("v", "ü")] = row
json.dump(out, open(os.path.join(ROOT, "data", "pinyin-chart.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(len(out), "syllables;", sum(1 for r in out.values() for x in r if x), "syllable+tone cells with a character")
for k in ["ma", "ba", "lü", "nü", "zhi", "ji", "qu", "xue", "er", "e", "o", "yi", "wu", "yu"]: print(k, out.get(k))
