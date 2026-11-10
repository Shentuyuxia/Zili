#!/usr/bin/env python3
"""List the course items that have no recording yet (data/pinyin-course.json).

  python3 tools/pinyin_audio_todo.py            summary per lesson
  python3 tools/pinyin_audio_todo.py --list     one line per item: lesson, character, pinyin, spoken tones

Recordings are optional: set item["au"] to a path and the app plays it instead of the device voice.
"""
import json, os, sys
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "pinyin-course.json"), encoding="utf8"))
seen, total = set(), 0
for L in D["lessons"]:
    todo = []
    for g in L.get("groups", []):
        for it in g["items"]:
            if it.get("au") or it["c"] in seen: continue
            seen.add(it["c"]); todo.append(it)
    for p in L.get("pairs", []):
        for c, py in ((p[0], p[1]), (p[2], p[3])):
            if c not in seen: seen.add(c); todo.append({"c": c, "py": py})
    total += len(todo)
    print(f'L{L["id"]:>2} {L["title"]["en"]:<32} {len(todo):>3} to record')
    if "--list" in sys.argv:
        for it in todo: print(f'     {it["c"]}\t{it["py"]}\t{it.get("say") or it.get("t") or ""}')
print("total unique items:", total)
