#!/usr/bin/env node
// Build dict/pyfix.txt: word readings that differ from what pinyin-pro guesses.
// For every multi-character word in the dictionary (dict/d/*.json) whose CC-CEDICT reading pinyin-pro gets wrong
// (polyphones like 种草 zhòng cǎo, 教书 jiāo shū; neutral tones like 时候 shí hou), store the dictionary reading.
// Tone sandhi of 一 and 不 (yí gè, bú shì) is kept from pinyin-pro, since the dictionary gives citation tones.
// The app applies these per segmented word, before pinyin-pro. Line format: "word<TAB>syllable syllable …".
// Run: node tools/build_pyfix.js   (after python3 tools/build_dict.py; needs npm install)
const fs = require("fs"), path = require("path");
const { pinyin } = require("pinyin-pro");
const ROOT = path.join(__dirname, ".."), D = path.join(ROOT, "dict", "d");
const HAN = /^[㐀-鿿]+$/;
const seg = new Set(); for (const line of fs.readFileSync(path.join(ROOT, "dict", "seg.txt"), "utf8").split("\n")) if (line && line[0] !== "#") for (const w of line.split(" ")) if (w) seg.add(w);
const norm = s => s.toLowerCase().replace(/\s+/g, " ").trim();
let n = 0, total = 0; const out = [];
for (const f of fs.readdirSync(D)) {
  const shard = JSON.parse(fs.readFileSync(path.join(D, f), "utf8"));
  for (const [w, rows] of Object.entries(shard)) {
    if (w.length < 2 || w.length > 8 || !HAN.test(w) || !seg.has(w)) continue;
    total++;
    let cands = rows.map(r => r[0]).filter(p => p && p[0] === p[0].toLowerCase());
    if (!cands.length) cands = rows.map(r => r[0].toLowerCase());
    const pp = pinyin(w, { type: "array" });
    const ppS = norm(pp.join(" "));
    // pinyin-pro applies 一/不 sandhi; compare with those syllables taken from pinyin-pro
    const fixd = c => { const syl = norm(c).split(" "); if (syl.length !== w.length) return null; return [...w].map((ch, i) => (ch === "一" || ch === "不") ? pp[i] : syl[i]); };
    const opts = cands.map(fixd).filter(Boolean);
    if (!opts.length) continue;
    const best = opts[0], bestS = norm(best.join(" "));
    if (bestS === ppS) continue;
    // pinyin-pro matches a later reading: only override when the first (main) reading differs just by neutral tones (朋友 péng you)
    if (opts.some(o => norm(o.join(" ")) === ppS)) {
      const strip = x => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const onlyNeutral = best.every((s, i) => s === pp[i] || (strip(s) === strip(pp[i]) && s === strip(s)));
      if (!onlyNeutral) continue;
    }
    if (best.some(s => !/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/.test(s))) continue;
    out.push(w + "\t" + best.join(" ")); n++;
  }
}
// hand corrections win (tools/pyfix_extra.txt)
const extra = new Map();
for (const l of fs.readFileSync(path.join(__dirname, "pyfix_extra.txt"), "utf8").split("\n")) { if (!l || l[0] === "#") continue; const i = l.indexOf("\t"); if (i > 0) extra.set(l.slice(0, i), l.slice(i + 1).trim()); }
for (let i = out.length - 1; i >= 0; i--) if (extra.has(out[i].split("\t")[0])) out.splice(i, 1);
for (const [w, p] of extra) { if (p.split(" ").length !== w.length) { console.log("  skipped (syllables ≠ characters):", w); continue; } out.push(w + "\t" + p); }
out.sort();
fs.writeFileSync(path.join(ROOT, "dict", "pyfix.txt"), out.join("\n") + "\n");
console.log(`${n} of ${total} words corrected`);
