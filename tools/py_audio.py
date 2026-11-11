#!/usr/bin/env python3
"""Recording kit for the pinyin course.

  python3 tools/py_audio.py sheet   -> writes recording-list.csv (what to record, in lesson order)
  python3 tools/py_audio.py link    -> finds your recordings in audio/py/ and wires them into the course

Name each recording exactly as in the list (e.g. ma1.mp3, ni2-hao3.mp3). .mp3, .m4a, .wav, .ogg all work.
Homophones share one file (妈 and 吗-like sounds with the same pinyin+tone need only one recording).
Items without a recording keep using the device voice, so you can record lesson by lesson.
"""
import json, os, sys, unicodedata, csv, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COURSE = os.path.join(ROOT, "data", "pinyin-course.json")
DIR = os.path.join(ROOT, "audio", "py")
EXT = (".mp3", ".m4a", ".wav", ".ogg")
TONE = {"̄": 1, "́": 2, "̌": 3, "̀": 4}


def numbered(py, say=None):
    """'nǐ hǎo' (say '23') -> 'ni2-hao3'; 'lǜ' -> 'lv4'."""
    out, k = [], 0
    for syl in py.replace("'", " ").split():
        t = 5
        base = ""
        for ch in unicodedata.normalize("NFD", syl):
            if ch in TONE:
                t = TONE[ch]
            elif unicodedata.combining(ch) == 0:
                base += ch
        base = unicodedata.normalize("NFC", base).replace("ü", "v")
        if say and k < len(say) and say[k].isdigit():
            t = int(say[k])
        out.append(base + ("" if t == 5 else str(t)))
        k += 1
    return "-".join(out)


def items(course):
    for L in course["lessons"]:
        for g in L.get("groups", []) or []:
            for it in g["items"]:
                yield L, it


def key(it):
    return numbered(it["py"], it.get("say"))


def sheet(course):
    seen, rows = set(), []
    for L, it in items(course):
        k = key(it)
        if k in seen:
            continue
        seen.add(k)
        rows.append([L["id"], k, it["c"], it["py"], it.get("say", "")])
    path = os.path.join(ROOT, "recording-list.csv")
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["lesson", "file name (without extension)", "read aloud", "pinyin", "actual tones if different"])
        w.writerows(rows)
    per = {}
    for r in rows:
        per[r[0]] = per.get(r[0], 0) + 1
    print("recordings needed:", len(rows), "| per lesson (first lesson that needs it):", per)
    print("wrote", path)


def link(course):
    os.makedirs(DIR, exist_ok=True)
    have = {}
    for fn in os.listdir(DIR):
        b, e = os.path.splitext(fn)
        if e.lower() in EXT:
            have[b.lower()] = fn
    n = miss = 0
    for L, it in items(course):
        k = key(it)
        if k in have:
            it["au"] = "audio/py/" + have[k]
            n += 1
        else:
            it.pop("au", None)
            miss += 1
    with open(COURSE, "w", encoding="utf-8") as f:
        json.dump(course, f, ensure_ascii=False, indent=1)
    print("linked", n, "items; still using device voice for", miss)
    print("Next: bump CACHE in sw.js and push.")


if __name__ == "__main__":
    c = json.load(open(COURSE, encoding="utf-8"))
    {"sheet": sheet, "link": link}.get(sys.argv[1] if len(sys.argv) > 1 else "", lambda _: print(__doc__))(c)
