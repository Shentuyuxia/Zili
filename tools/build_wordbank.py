#!/usr/bin/env python3
"""Fill data/zh-HSK1…6.json with every word of the official HSK 2.0 lists (150/150/300/600/1300/2500).

- Rows that are already there (with hand-written examples) are kept as they are, at their level.
- Missing official words are added at their official level with pinyin and English from the HSK list
  and German from HanDeDict; the example fields stay "" and are written later (nightly task).
- Words HanDeDict has no German for are listed in tools/src/no_de.json; give them German by hand with
  `python3 tools/build_wordbank.py --de tools/de_extra.json` ({"word": "German", ...}).

Needs tools/src/hsk.json and the built dictionary (python3 tools/build_dict.py).
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
D = os.path.join(ROOT, "data")
LV = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"]
POS = {"n": "n", "nr": "n", "ns": "n", "nt": "n", "nz": "n", "t": "n", "f": "n", "s": "n", "vn": "v",
       "v": "v", "vd": "v", "a": "adj", "ad": "adj", "an": "adj", "b": "adj", "z": "adj", "d": "adv",
       "m": "num", "q": "mw", "r": "pron", "p": "prep", "c": "conj", "u": "part", "y": "part",
       "e": "interj", "o": "interj", "i": "idiom", "l": "expr", "j": "n"}
EXTRA_DE = os.path.join(ROOT, "tools", "de_extra.json")
FIX = os.path.join(ROOT, "tools", "zh_fix.json")  # {"word": {"py": …, "en": …, "de": …, "pos": …}} hand corrections, applied last

def load(lv):
    f = os.path.join(D, f"zh-{lv}.json")
    return json.load(open(f, encoding="utf8")) if os.path.exists(f) else []

def save(lv, rows):
    json.dump(rows, open(os.path.join(D, f"zh-{lv}.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))

def dict_entry(w):
    f = os.path.join(ROOT, "dict", "d", "%02x.json" % (ord(w[0]) % 128))
    return json.load(open(f, encoding="utf8")).get(w)

BAD = re.compile(r"^(\(bound form\)|classifier|see |used in |(old |archaic |erhua |Japanese |unofficial |ancient )?variant of|Taiwan pr|\(classical\)|\(literary\)|\(archaic\)|surname|abbr\. for|\(onom\.|radical in Chinese|Kangxi radical|Radikal|ZEW)", re.I)
def short(t, n=2, cap=70):
    parts = [p.strip() for p in re.split(r";\s*", t or "") if p.strip()]
    good = [p for p in parts if not BAD.match(p)]
    out = "; ".join((good or parts)[:n])
    out = re.sub(r"\s*\((Tw|old|literary|dialect)\)", "", out)
    return fit(out, cap)

def fit(s, cap):
    """shorten at a separator, never in the middle of a word"""
    if len(s) <= cap:
        return s
    for sep in ["; ", ", ", " "]:
        i = s.rfind(sep, 0, cap)
        if i > cap // 3:
            return s[:i].rstrip(" ;,(")
    return s[:cap]

def de_short(t):
    parts = [p.strip() for p in re.split(r"[;,]\s*", t or "") if p.strip()]
    parts = [p for p in parts if not re.match(r"^(Radikal|ZEW|Zähleinheitswort|Variante)", p)]
    return fit(", ".join(dict.fromkeys(parts[:3])), 70)

COMMON = {}
def common_readings(words):
    """most common reading of each word, from pinyin-pro (needs `npm install`)"""
    import subprocess, tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf8") as fh:
        json.dump(words, fh, ensure_ascii=False); name = fh.name
    js = "const {pinyin}=require('pinyin-pro');const w=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));const o={};for(const x of w)o[x]=pinyin(x);console.log(JSON.stringify(o))"
    out = subprocess.run(["node", "-e", js, name], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    os.unlink(name); return json.loads(out)

def pick_form(e):
    forms = e["forms"]
    if len(forms) == 1:
        return forms[0]
    norm = lambda x: x.lower().replace(" ", "")
    want = norm(COMMON.get(e["simplified"], ""))
    def score(f):
        py = f["transcriptions"]["pinyin"]; m = f.get("meanings") or [""]
        good = sum(1 for x in m if not BAD.match(x))
        return (norm(py) == want, not py[:1].isupper(), good > 0, good)
    return max(forms, key=score)

def main():
    extra = json.load(open(EXTRA_DE, encoding="utf8")) if os.path.exists(EXTRA_DE) else {}
    hsk = json.load(open(os.path.join(ROOT, "tools", "src", "hsk.json"), encoding="utf8"))
    banks = {lv: load(lv) for lv in LV}
    have = {r[0] for lv in LV for r in banks[lv]}
    no_de, added = [], {lv: 0 for lv in LV}
    official = []
    for e in hsk:
        old = [int(x[4:]) for x in e.get("level", []) if x.startswith("old-")]
        if old:
            official.append((min(old), e.get("frequency", 99999), e))
    official.sort(key=lambda x: (x[0], x[1]))
    COMMON.update(common_readings([e["simplified"] for _, _, e in official if len(e["forms"]) > 1]))
    for lvn, _, e in official:
        w = e["simplified"]
        if w in have or not re.match(r"^[㐀-鿿]+$", w):
            continue
        f0 = pick_form(e)
        py = f0["transcriptions"]["pinyin"]
        en = short("; ".join(f0["meanings"]))
        de = extra.get(w, "")
        if not de:
            rows = dict_entry(w) or []
            want = py.lower().replace(" ", "")
            row = next((r for r in rows if r[0].lower().replace(" ", "") == want and r[2]), None) or next((r for r in rows if r[2]), None)
            de = de_short(row[2]) if row else ""
        if not de:
            no_de.append({"w": w, "py": py, "en": en, "level": lvn})
            continue
        pos = next((POS[p] for p in e.get("pos", []) if p in POS), "")
        banks[LV[lvn - 1]].append([w, pos, py, en, de, "", "", ""])
        have.add(w); added[LV[lvn - 1]] += 1
    fix = json.load(open(FIX, encoding="utf8")) if os.path.exists(FIX) else {}
    nfix = 0
    for lv in LV:
        for r in banks[lv]:
            f = fix.get(r[0])
            if f:
                for k, i in (("pos", 1), ("py", 2), ("en", 3), ("de", 4)):
                    if k in f: r[i] = f[k]
                nfix += 1
    print("fixed", nfix)
    for lv in LV:
        save(lv, banks[lv])
    json.dump(no_de, open(os.path.join(ROOT, "tools", "src", "no_de.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
    print("added", added, "· without German:", len(no_de))
    print("counts", {lv: len(banks[lv]) for lv in LV})

if __name__ == "__main__":
    main()
