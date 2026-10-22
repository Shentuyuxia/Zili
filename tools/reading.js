#!/usr/bin/env node
// Reading texts for 字里 Zili.
//   node tools/reading.js            → fill missing glossary pinyin, validate every day file, rebuild reading/index.json
//   node tools/reading.js --check    → validate only (exit 1 on problems)
// Also checks reading/lib.json (library) and reading/jieqi.json (二十四节气: fixed texts opened on their date).
// Run `npm install` once first (it brings pinyin-pro).
const fs = require("fs"), path = require("path");
const { pinyin } = require("pinyin-pro");
const ROOT = path.join(__dirname, "..", "reading");
const LEVELS = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];
const HAN = /[㐀-鿿]/;
const checkOnly = process.argv.includes("--check");

function py(w) {
  const a = pinyin(w, { type: "array" });
  if (w.length > 1 && w.endsWith("儿") && !/(女儿|儿子|儿童|婴儿|幼儿|孤儿|儿女|健儿)$/.test(w)) a[a.length - 1] = "r";
  return a.join(" ").replace(/ r$/, "r");
}

let problems = 0;
const bad = (f, i, msg) => { problems++; console.log(`  ${path.basename(f)} item ${i}: ${msg}`); };

function checkItem(f, it, i) {
  if (it.kind === "picks") return;
  if (it.lang !== "zh") bad(f, i, `lang must be "zh"`);
  if (!LEVELS.includes(it.level)) bad(f, i, `level must be one of ${LEVELS.join(", ")}`);
  if (!it.title) bad(f, i, "title missing");
  const p = it.paragraphs || [];
  if (!p.length) bad(f, i, "paragraphs missing");
  p.forEach((x, k) => { if (!HAN.test(x)) bad(f, i, `paragraph ${k} has no Chinese`); if (/[a-zāáǎàēéěè]{3,}/.test(x) && /[āáǎàēéěèīíǐìōóǒòūúǔù]/.test(x)) bad(f, i, `paragraph ${k} seems to contain pinyin`); });
  for (const k of ["paragraphs_en", "paragraphs_de"]) {
    if (!Array.isArray(it[k]) || it[k].length !== p.length) bad(f, i, `${k} must have ${p.length} entries (has ${(it[k] || []).length})`);
  }
  for (const g of it.glossary || []) {
    if (!g.w || !HAN.test(g.w)) bad(f, i, `glossary entry without Chinese word: ${JSON.stringify(g)}`);
    if (!g.en || !g.de) bad(f, i, `glossary "${g.w}" needs en and de`);
  }
}

// 二十四节气 items additionally need a term, an opening date and (optionally) a well-formed poem
function checkJieqi(f, it, i) {
  if (!it.term || !HAN.test(it.term)) bad(f, i, `jieqi item needs "term" (e.g. "霜降")`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(it.date || "")) bad(f, i, `jieqi item needs "date" as YYYY-MM-DD (the day it opens)`);
  if (it.poem) {
    const pm = it.poem;
    if (!pm.title || !pm.author) bad(f, i, "poem needs title and author");
    if (!Array.isArray(pm.lines) || !pm.lines.length || !pm.lines.every(l => HAN.test(l))) bad(f, i, "poem.lines must be a list of Chinese lines");
    if (!pm.explain_en || !pm.explain_de) bad(f, i, "poem needs explain_en and explain_de");
  }
}

// dictionary readings where pinyin-pro guesses wrong (dict/pyfix.txt, built by tools/build_pyfix.js)
const PYFIX = new Map();
try { for (const l of fs.readFileSync(path.join(__dirname, "..", "dict", "pyfix.txt"), "utf8").split("\n")) { const i = l.indexOf("\t"); if (i > 0) PYFIX.set(l.slice(0, i), l.slice(i + 1)); } } catch (e) {}
function fill(it) {
  let n = 0;
  for (const g of it.glossary || []) {
    if (!g.w) continue;
    const fix = PYFIX.get(g.w);
    // fill empty pinyin; also replace pinyin that was filled automatically (equals pinyin-pro's guess) when the dictionary knows better
    if (!g.p) { g.p = fix || py(g.w); n++; }
    else if (fix && g.p !== fix && g.p.replace(/\s+/g, " ") === py(g.w)) { g.p = fix; n++; }
  }
  return n;
}

const files = fs.readdirSync(ROOT).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().reverse();
const days = []; let filled = 0;
for (const name of [...files, "lib.json", "jieqi.json"]) {
  const f = path.join(ROOT, name); if (!fs.existsSync(f)) continue;
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  (d.items || []).forEach((it, i) => { if (!checkOnly) filled += fill(it); checkItem(f, it, i); if (name === "jieqi.json") checkJieqi(f, it, i); });
  if (!checkOnly) fs.writeFileSync(f, JSON.stringify(d, null, 1) + "\n");
  if (name !== "lib.json" && name !== "jieqi.json") days.push({ date: d.date || name.slice(0, 10), items: (d.items || []).map((it, i) => ({ i, lang: it.lang, title: it.title, kind: it.kind, level: it.level, hour: it.hour })) });
}
if (!checkOnly) {
  fs.writeFileSync(path.join(ROOT, "index.json"), JSON.stringify({ updated: new Date().toISOString().replace(/\.\d+Z$/, "Z"), days }, null, 1) + "\n");
  console.log(`index.json: ${days.length} days, ${days.reduce((a, d) => a + d.items.length, 0)} items; pinyin filled for ${filled} glossary words`);
}
console.log(problems ? `${problems} problem(s)` : "check: ok");
process.exit(problems ? 1 : 0);
