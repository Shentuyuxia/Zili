#!/usr/bin/env python3
"""Example sentences for the 字里 Zili word bank (data/zh-HSK*.json).

  python3 tools/wb_examples.py --count              rows still without an example, per level
  python3 tools/wb_examples.py --todo 150           the next 150 rows without an example (lowest level first) as JSON
  python3 tools/wb_examples.py --apply rows.json    write examples (and corrections) back

rows.json is a list of objects, one per word:
  {"w": "词", "ex": "例句。", "ex_en": "English.", "ex_de": "Deutsch.",
   optional corrections: "pos", "py", "en", "de"}
Only words that are already in the bank are touched; the word itself and its level never change.
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
D = os.path.join(ROOT, "data")
LV = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"]
POS = {"", "n", "v", "adj", "adv", "mw", "pron", "num", "prep", "conj", "part", "interj", "idiom", "expr"}
HAN = re.compile(r"[㐀-鿿]")

def path(lv): return os.path.join(D, f"zh-{lv}.json")
def load(lv): return json.load(open(path(lv), encoding="utf8"))
def save(lv, rows): json.dump(rows, open(path(lv), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))

def count():
    for lv in LV:
        rows = load(lv); n = sum(1 for r in rows if not r[5].strip())
        print(f"{lv}: {n} of {len(rows)} without example")

def todo(n):
    out = []
    for lv in LV:
        for r in load(lv):
            if not r[5].strip():
                out.append({"level": lv, "w": r[0], "pos": r[1], "py": r[2], "en": r[3], "de": r[4]})
                if len(out) >= n:
                    print(json.dumps(out, ensure_ascii=False, indent=0)); return
    print(json.dumps(out, ensure_ascii=False, indent=0))

def apply(f):
    new = {x["w"]: x for x in json.load(open(f, encoding="utf8"))}
    done, errors = 0, []
    for lv in LV:
        rows = load(lv); changed = False
        for r in rows:
            x = new.get(r[0])
            if not x:
                continue
            ex, en, de = (x.get("ex") or "").strip(), (x.get("ex_en") or "").strip(), (x.get("ex_de") or "").strip()
            if not ex or not HAN.search(ex) or not en or not de:
                errors.append(f"{r[0]}: example and both translations needed"); continue
            if r[0] not in ex:
                errors.append(f"{r[0]}: example must contain the word"); continue
            if re.search(r"[āáǎàēéěèīíǐìōóǒòūúǔù]", ex):
                errors.append(f"{r[0]}: no pinyin in the example"); continue
            if "pos" in x and x["pos"] not in POS:
                errors.append(f"{r[0]}: unknown pos {x['pos']}"); continue
            for k, i in (("pos", 1), ("py", 2), ("en", 3), ("de", 4)):
                if x.get(k, "").strip() if isinstance(x.get(k), str) else False:
                    r[i] = x[k].strip()
            r[5], r[6], r[7] = ex, en, de
            done += 1; changed = True; new.pop(r[0])
        if changed:
            save(lv, rows)
    for w in new:
        errors.append(f"{w}: not in the word bank")
    print(f"updated {done} rows")
    for e in errors:
        print("  skipped:", e)
    return 0 if done else 1

if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--count"]: count()
    elif a[:1] == ["--todo"]: todo(int(a[1]) if len(a) > 1 else 150)
    elif a[:1] == ["--apply"] and len(a) > 1: sys.exit(apply(a[1]))
    else: print(__doc__)
