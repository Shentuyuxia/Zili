#!/usr/bin/env python3
"""Build strokes/NN.json: stroke-order data for Hanzi Writer (vendor/hanzi-writer.min.js).

Source: hanzi-writer-data (npm) in tools/src/hwd/, from Make Me a Hanzi — Arphic Public License (strokes/ARPHICPL.TXT).
Kept: the 3,500 most frequent characters (jieba frequencies), every character of the HSK lists, and their
Traditional forms (from CC-CEDICT). 256 shards by code point, so tapping a character loads one small file.
Run: python3 tools/build_strokes.py   (needs tools/src/hwd, tools/src/jieba.txt, tools/src/hsk.json, tools/src/cedict.js)
"""
import json, os, shutil
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "tools", "src")
OUT = os.path.join(ROOT, "strokes")
N_TOP, NSHARD = 3500, 256

jb = {}
for line in open(os.path.join(SRC, "jieba.txt"), encoding="utf8"):
    p = line.split()
    if len(p) >= 2 and len(p[0]) == 1:
        jb[p[0]] = int(p[1])
hsk = set(c for e in json.load(open(os.path.join(SRC, "hsk.json"), encoding="utf8")) for c in e["simplified"])
txt = open(os.path.join(SRC, "cedict.js"), encoding="utf8").read()
s2t = {}
for r in json.loads(txt[txt.index("{"):])["all"]:
    if len(r[0]) == 1 and len(r[1]) == 1 and r[0] != r[1]:
        s2t.setdefault(r[1], set()).add(r[0])
hwd = os.path.join(SRC, "hwd")
avail = {f[:-5] for f in os.listdir(hwd) if f.endswith(".json") and len(f) == 6}
simp = (set(sorted(jb, key=lambda c: -jb[c])[:N_TOP]) | hsk) & avail
chars = simp | ({t for c in simp for t in s2t.get(c, ())} & avail)
shards = [dict() for _ in range(NSHARD)]
for c in chars:
    d = json.load(open(os.path.join(hwd, c + ".json"), encoding="utf8"))
    shards[ord(c) % NSHARD][c] = d
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)
for i, s in enumerate(shards):
    json.dump(s, open(os.path.join(OUT, f"{i:02x}.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
shutil.copy(os.path.join(hwd, "ARPHICPL.TXT"), os.path.join(OUT, "ARPHICPL.TXT"))
open(os.path.join(OUT, "README.md"), "w").write(
    "# Stroke order data\n\nFrom [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data), based on "
    "[Make Me a Hanzi](https://github.com/skishore/makemeahanzi) by Shaunak Kishore, derived from Arphic fonts. "
    "Licensed under the Arphic Public License (`ARPHICPL.TXT`). Built by `tools/build_strokes.py`; "
    f"{len(chars)} characters in {NSHARD} files.\n")
print(len(chars), "characters")
