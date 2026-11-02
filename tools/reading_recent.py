#!/usr/bin/env python3
"""Compact list of recent reading texts, so a scheduled task doesn't have to open the big day files.

  python3 tools/reading_recent.py [DAYS]     daily texts of the last DAYS days (default 14), newest first,
                                             then the titles of reading/lib.json
Each line: date · level · kind · section · title / title_en · grammar point (short)
"""
import datetime, glob, json, os, re, sys

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "reading")
n = int(sys.argv[1]) if len(sys.argv) > 1 else 14
cut = (datetime.date.today() - datetime.timedelta(days=n)).isoformat()
sh = lambda t, k: (lambda t: t if len(t) <= k else t[:k-1] + "…")(re.sub(r"\s+", " ", str(t or "")).strip())
for f in sorted(glob.glob(os.path.join(R, "20[0-9][0-9]-[0-9][0-9]-[0-9][0-9].json")), reverse=True):
    d = os.path.basename(f)[:10]
    if d < cut: break
    for it in json.load(open(f, encoding="utf-8")).get("items", []):
        print(" · ".join(x for x in [d, it.get("level"), it.get("kind"), it.get("section"),
              f"{it.get('title')} / {sh(it.get('title_en'), 50)}", "G: " + sh(it.get("grammar"), 60) if it.get("grammar") else ""] if x))
lib = os.path.join(R, "lib.json")
if os.path.exists(lib):
    items = json.load(open(lib, encoding="utf-8")).get("items", [])
    print(f"\nlib.json ({len(items)}): " + " | ".join(f"{i.get('level')} {i.get('title')}" for i in items))
