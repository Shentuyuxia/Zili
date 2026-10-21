#!/usr/bin/env python3
"""Build dict/hw.txt: compact stroke templates for offline handwriting recognition in the dictionary.

For every character in strokes/ (same set as the stroke-order animation), each stroke's median line from
Make Me a Hanzi (via hanzi-writer-data, Arphic Public License) is resampled to 6 points, normalised to the
character's box and quantised to 0–63 (one character of B64 per coordinate). Characters are sorted by frequency.
Line format: <char><12 chars per stroke …>
Run: python3 tools/build_hw.py   (after tools/build_strokes.py)
"""
import glob, json, math, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
NPT = 6

def resample(pts, n):
    if len(pts) == 1: return [pts[0]] * n
    seg = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    L = sum(seg) or 1e-9; out = []; 
    for k in range(n):
        t = L * k / (n - 1); acc = 0
        for i, d in enumerate(seg):
            if acc + d >= t or i == len(seg) - 1:
                f = 0 if d == 0 else min(1, max(0, (t - acc) / d))
                out.append((pts[i][0] + f * (pts[i + 1][0] - pts[i][0]), pts[i][1] + f * (pts[i + 1][1] - pts[i][1]))); break
            acc += d
    return out

jb = {}
for line in open(os.path.join(ROOT, "tools", "src", "jieba.txt"), encoding="utf8"):
    p = line.split()
    if len(p) >= 2 and len(p[0]) == 1: jb[p[0]] = int(p[1])
chars = {}
for f in glob.glob(os.path.join(ROOT, "strokes", "*.json")):
    chars.update(json.load(open(f, encoding="utf8")))
lines = []
for c in sorted(chars, key=lambda c: -jb.get(c, 0)):
    med = [[(x, 900 - y) for x, y in s] for s in chars[c]["medians"]]   # data has y up; flip to screen coordinates
    xs = [p[0] for s in med for p in s]; ys = [p[1] for s in med for p in s]
    x0, y0 = min(xs), min(ys); size = max(max(xs) - x0, max(ys) - y0, 1)
    ox = (size - (max(xs) - x0)) / 2; oy = (size - (max(ys) - y0)) / 2   # centre in a square box
    code = ""
    for s in med:
        for x, y in resample(s, NPT):
            code += B64[min(63, round((x - x0 + ox) / size * 63))] + B64[min(63, round((y - y0 + oy) / size * 63))]
    lines.append(c + code)
open(os.path.join(ROOT, "dict", "hw.txt"), "w", encoding="utf8").write("\n".join(lines) + "\n")
print(len(lines), "characters")
