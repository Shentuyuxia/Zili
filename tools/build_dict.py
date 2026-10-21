#!/usr/bin/env python3
"""Build the offline dictionary of 字里 Zili.

Inputs (downloaded into tools/src/, not committed):
  tools/src/cedict.js     CC-CEDICT data as shipped in the npm package cc-cedict (data/all.js)   CC BY-SA 4.0
  tools/src/handedict.u8  HanDeDict, github.com/gugray/HanDeDict                                  CC BY-SA 3.0
  tools/src/jieba.txt     jieba's word-frequency list (jieba/dict.txt)                            MIT
  tools/src/hsk.json      complete-hsk-vocabulary complete.json, github.com/drkameleon            MIT

Outputs:
  dict/seg.txt            words for the segmenter, one per line: "word cost" (cost = rounded -log frequency)
  dict/d/NN.json          definitions, 128 shards by first character: {word: [[pinyin, en, de, hsk], ...]}
  dict/meta.json          version, counts, licences

Run:  python3 tools/build_dict.py      (see tools/src/README.md for where to get the inputs)
"""
import json, math, os, re, sys, unicodedata
from collections import defaultdict

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "tools", "src")
OUT = os.path.join(ROOT, "dict")
NSHARD = 128
HAN = re.compile(r"^[㐀-鿿豈-﫿〇]+$")

def shard(word):
    return ord(word[0]) % NSHARD

# ---------- pinyin: numbers → tone marks ----------
TONE = {"a": "āáǎà", "e": "ēéěè", "i": "īíǐì", "o": "ōóǒò", "u": "ūúǔù", "ü": "ǖǘǚǜ"}
def mark(syl):
    s = syl.replace("u:", "ü").replace("v", "ü").replace("U:", "Ü")
    m = re.match(r"^([A-Za-zÜü]+)([1-5])$", s)
    if not m:
        return s.replace("5", "")
    base, t = m.group(1), int(m.group(2))
    if t == 5:
        return base
    low = base.lower()
    if "a" in low: i = low.index("a")
    elif "e" in low: i = low.index("e")
    elif "ou" in low: i = low.index("o")
    else:
        i = max((k for k, c in enumerate(low) if c in "aeiouü"), default=-1)
    if i < 0:
        return base
    c = low[i]
    r = TONE[c][t - 1]
    if base[i].isupper():
        r = r.upper()
    return base[:i] + r + base[i + 1:]
def py_marks(numeric):
    return " ".join(mark(x) for x in numeric.split())
def py_key(numeric):
    return re.sub(r"[^a-z1-5ü]", "", numeric.lower().replace("u:", "ü").replace("v", "ü"))

# ---------- CC-CEDICT ----------
def clean_en(defs):
    if isinstance(defs, str):
        defs = defs.split("; ") if False else [defs]
    out = []
    for d in defs:
        d = re.sub(r"\s*\[[^\]]*\]", "", d)               # drop embedded pinyin [ni3 hao3]
        d = re.sub(r"([㐀-鿿]+)\|([㐀-鿿]+)", r"\2", d)  # trad|simp → simp
        d = d.strip()
        if d and d not in out:
            out.append(d)
    variant = [d for d in out if re.match(r"^(old |archaic |erhua |Japanese )?variant of|^see |^used in ", d)]
    real = [d for d in out if d not in variant]
    keep = real or variant
    s = "; ".join(keep[:6])
    return s[:220]

VARIANT = re.compile(r"^((old|archaic|erhua|Japanese|unofficial|ancient) )?variant of ")
def load_cedict():
    txt = open(os.path.join(SRC, "cedict.js"), encoding="utf8").read()
    data = json.loads(txt[txt.index("{"):].rstrip().rstrip(";"))["all"]
    ent = defaultdict(dict)  # simp → pykey → [pinyin_marked, en]
    for row in data:
        trad, simp, py, defs = row[0], row[1], row[2], row[3]
        if not HAN.match(simp) or len(simp) > 12:
            continue
        en = clean_en(defs)
        if not en:
            continue
        k = py_key(py)
        if k in ent[simp]:
            old = ent[simp][k]
            if en not in old[1] and not VARIANT.match(en):
                old[1] = (old[1] + "; " + en)[:260]
            elif VARIANT.match(old[1]) and not VARIANT.match(en):
                old[1] = en
        else:
            ent[simp][k] = [py_marks(py), en, py[:1].isupper()]
    return ent

# ---------- HanDeDict ----------
TAGS = r"(S|V|Adj|Adv|Konj|Präp|Pron|Num|Zähl|Int|Part|Interj|Eig|Pers|Geo|Org|Tech|Med|Bio|Chem|Math|Phys|Wirtsch|Rechtsw|Sport|Mus|Kunst|Lit|Rel|Philos|Psych|Gesch|Mil|Pol|Werk|Fam|Sprichw|Chengyu|Redew|vulg|ugs|Dialekt|kantonesisch|taiwanesisch|alt|übertr|u\.E\.|Abk|Zool|Bot|Astron|Geol|Comp|Internet|Kurzw|Ling|Arch|Agrar|Elektr|Fin|Ess|Kleidung|Sprachw|Tiermed|Fot|Film)"
TAG_RE = re.compile(r"\s*\((?:" + TAGS + r")(?:\s*,\s*[^()]*)?\)")
def clean_de(s):
    s = re.sub(r";?\s*Bsp\.:.*$", "", s)
    s = TAG_RE.sub("", s)
    s = re.sub(r"\s*\(u\.E\.\)", "", s)
    s = re.sub(r"\s+", " ", s).strip(" ;,")
    return s

def load_handedict():
    ent = defaultdict(dict)
    pat = re.compile(r"^(\S+) (\S+) \[([^\]]*)\] /(.*)/\s*$")
    for line in open(os.path.join(SRC, "handedict.u8"), encoding="utf8"):
        if line.startswith("#") or not line.strip():
            continue
        m = pat.match(line.strip("﻿"))
        if not m:
            continue
        trad, simp, py, body = m.groups()
        if not HAN.match(simp) or len(simp) > 12:
            continue
        parts = [clean_de(x) for x in body.split("/")]
        parts = [p for p in parts if p]
        if not parts:
            continue
        de = "; ".join(dict.fromkeys(parts))[:220]
        k = py_key(py)
        if k in ent[simp]:
            old = ent[simp][k]
            if de not in old[1]:
                old[1] = (old[1] + "; " + de)[:260]
        else:
            ent[simp][k] = [py_marks(py), de]
    return ent

# ---------- HSK 2.0 levels ----------
def load_hsk():
    lv = {}
    for e in json.load(open(os.path.join(SRC, "hsk.json"), encoding="utf8")):
        old = [int(x[4:]) for x in e.get("level", []) if x.startswith("old-")]
        if old:
            lv[e["simplified"]] = min(old)
    return lv

# ---------- jieba frequencies ----------
def load_jieba():
    f = {}
    for line in open(os.path.join(SRC, "jieba.txt"), encoding="utf8"):
        p = line.split()
        if len(p) >= 2 and HAN.match(p[0]):
            f[p[0]] = int(p[1])
    return f

def main():
    for n in ["cedict.js", "handedict.u8", "jieba.txt", "hsk.json"]:
        if not os.path.exists(os.path.join(SRC, n)):
            sys.exit(f"missing tools/src/{n} – see tools/src/README.md")
    ce, hd, hsk, jb = load_cedict(), load_handedict(), load_hsk(), load_jieba()
    print("cedict", len(ce), "handedict", len(hd), "hsk", len(hsk), "jieba", len(jb))

    # definitions: one entry per (word, reading); English from CEDICT, German from HanDeDict
    words = set(ce) | set(hd)
    shards = [dict() for _ in range(NSHARD)]
    n_en = n_de = 0
    for w in words:
        c, h = ce.get(w, {}), hd.get(w, {})
        keys = list(c) + [k for k in h if k not in c]
        rows = []
        for k in keys:
            cc, hh = c.get(k), h.get(k)
            # German reading with the same letters but a different tone/caps: attach to the CEDICT one
            if cc and not hh and len(c) == 1 and len(h) == 1:
                hh = next(iter(h.values()))
            if hh and not cc and len(c) == 1 and len(h) == 1 and keys[0] != k:
                continue
            py = (cc or hh)[0]
            en = cc[1] if cc else ""
            de = hh[1] if hh else ""
            if en: n_en += 1
            if de: n_de += 1
            rows.append([py, en, de])
        # proper-name readings (capitalised pinyin) after common ones
        rows.sort(key=lambda r: (r[0][:1].isupper(), 0 if r[1] and r[2] else 1))
        lv = hsk.get(w, 0)
        out = [r + ([lv] if lv else []) for r in rows[:6]]
        if out:
            shards[shard(w)][w] = out
    os.makedirs(os.path.join(OUT, "d"), exist_ok=True)
    for i, s in enumerate(shards):
        with open(os.path.join(OUT, "d", f"{i:02x}.json"), "w", encoding="utf8") as fh:
            json.dump(s, fh, ensure_ascii=False, separators=(",", ":"), sort_keys=True)

    # segmenter lexicon: jieba frequencies + every dictionary word; cost = -ln(freq/total), rounded
    total = sum(jb.values())
    seg = {}
    for w, f in jb.items():
        if len(w) <= 8 and (f >= 20 or w in words or len(w) == 1):
            seg[w] = f
    for w in words:
        if len(w) <= 8 and w not in seg:
            seg[w] = 1  # known word, unknown frequency: rare
    for w in hsk:
        if HAN.match(w):
            seg[w] = max(seg.get(w, 1), 50)
    lines = []
    for w, f in seg.items():
        cost = max(1, round(-math.log(f / total)))
        lines.append((cost, w))
    lines.sort()
    with open(os.path.join(OUT, "seg.txt"), "w", encoding="utf8") as fh:
        # grouped by cost: "#cost" header line, then the words of that cost separated by spaces
        cur = None; buf = []
        for cost, w in lines:
            if cost != cur:
                if buf: fh.write(" ".join(buf) + "\n")
                fh.write(f"#{cost}\n"); cur = cost; buf = []
            buf.append(w)
        if buf: fh.write(" ".join(buf) + "\n")
    meta = {"version": 1, "shards": NSHARD, "words": sum(len(s) for s in shards), "seg": len(seg),
            "en": n_en, "de": n_de,
            "sources": [
                {"name": "CC-CEDICT", "url": "https://cc-cedict.org/wiki/", "license": "CC BY-SA 4.0"},
                {"name": "HanDeDict", "url": "https://handedict.zydeo.net/", "license": "CC BY-SA 3.0"},
                {"name": "jieba dict.txt (word frequencies)", "url": "https://github.com/fxsjy/jieba", "license": "MIT"},
                {"name": "complete-hsk-vocabulary (HSK levels)", "url": "https://github.com/drkameleon/complete-hsk-vocabulary", "license": "MIT"}]}
    json.dump(meta, open(os.path.join(OUT, "meta.json"), "w"), indent=1)
    print(json.dumps(meta, ensure_ascii=False)[:300])

if __name__ == "__main__":
    main()
