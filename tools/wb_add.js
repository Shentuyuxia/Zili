#!/usr/bin/env node
// Word bank for 字里 Zili: data/zh-HSK1.json … data/zh-HSK6.json
//   node tools/wb_add.js HSK3 new_rows.json   → append rows, skipping words already anywhere in the bank
//   node tools/wb_add.js --check              → validate all files and print counts against the targets
// Row (8 or 9 strings): [word (Simplified), pos, pinyin, English, German, example, example_en, example_de, tag?]
//   pos: n · v · adj · adv · mw (measure word) · pron · num · prep · conj · part (particle) · interj · idiom · expr
//   pinyin: tone marks, one syllable per character, spaces between syllables ("yǔ sǎn"). Leave it "" and it is filled in.
//   tag (optional): "net" (internet slang) or "young" (young people's life).
// Run `npm install` once first (it brings pinyin-pro).
const fs = require("fs"), path = require("path");
const { pinyin } = require("pinyin-pro");
const D = path.join(__dirname, "..", "data");
const LV = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];
const TARGET = { HSK1: 300, HSK2: 500, HSK3: 600, HSK4: 1000, HSK5: 1300, HSK6: 1500 };
const POS = new Set(["", "n", "v", "adj", "adv", "mw", "pron", "num", "prep", "conj", "part", "interj", "idiom", "expr"]);
const HAN = /[㐀-鿿]/;
const file = lv => path.join(D, `zh-${lv}.json`);
const load = lv => fs.existsSync(file(lv)) ? JSON.parse(fs.readFileSync(file(lv), "utf8")) : [];
const save = (lv, rows) => fs.writeFileSync(file(lv), JSON.stringify(rows));
function py(w) {
  const a = pinyin(w, { type: "array" });
  if (w.length > 1 && w.endsWith("儿") && !/(女儿|儿子|儿童|婴儿|幼儿|孤儿|儿女|健儿)$/.test(w)) a[a.length - 1] = "r";
  return a.join(" ").replace(/ r$/, "r");
}
function bad(r, strict) {
  if (!Array.isArray(r) || r.length < 8 || r.length > 9 || !r.every(x => typeof x === "string")) return "needs 8 or 9 strings";
  if (!HAN.test(r[0]) || /[A-Za-z]/.test(r[0])) return "word must be Chinese characters";
  if (!POS.has(r[1])) return `unknown pos "${r[1]}"`;
  if (!r[3].trim() || !r[4].trim()) return "English and German meaning needed";
  if (strict) {
    if (!r[1]) return "pos missing";
    if (!r[5] || !HAN.test(r[5])) return "example sentence missing";
    if (!r[6].trim() || !r[7].trim()) return "example translations missing";
  }
  if (r[8] && !["net", "young"].includes(r[8])) return `unknown tag "${r[8]}"`;
  return null;
}
function check() {
  let ok = true; const seen = new Map(); const counts = [];
  for (const lv of LV) {
    const rows = load(lv); counts.push(`${lv} ${rows.length}/${TARGET[lv]}`);
    for (const r of rows) {
      const e = bad(r, false); if (e) { ok = false; console.log(`  ${lv}: ${e}: ${JSON.stringify(r).slice(0, 80)}`); }
      if (seen.has(r[0])) { ok = false; console.log(`  duplicate: ${r[0]} (${seen.get(r[0])} and ${lv})`); }
      seen.set(r[0], lv);
    }
  }
  console.log("zh", counts.join(" · "), "· total", seen.size);
  return ok;
}
if (process.argv[2] === "--check") process.exit(check() ? 0 : 1);
const [lv, f] = process.argv.slice(2);
if (!LV.includes(lv) || !f) { console.log("usage: node tools/wb_add.js HSK3 rows.json | --check"); process.exit(2); }
const have = new Set(LV.flatMap(x => load(x).map(r => r[0])));
const rows = load(lv); let added = 0, skipped = 0;
for (const r0 of JSON.parse(fs.readFileSync(f, "utf8"))) {
  const r = Array.isArray(r0) ? r0.map(x => String(x == null ? "" : x).trim()) : r0;
  if (Array.isArray(r) && r.length >= 3 && !r[2]) r[2] = py(r[0]);
  if (Array.isArray(r) && r.length === 9 && !r[8]) r.pop();
  const e = bad(r, true);
  if (e || have.has(r[0])) { skipped++; console.log("  skip:", Array.isArray(r) ? r[0] : r, e || "duplicate"); continue; }
  rows.push(r); have.add(r[0]); added++;
}
save(lv, rows);
console.log(`zh-${lv}: +${added} (skipped ${skipped}) → ${rows.length}`);
