# 字里 Zili

> © 2026 申屠余夏 (Shentu Yuxia). **All rights reserved / Alle Rechte vorbehalten / 保留所有权利。** Free for personal, non-commercial learning in the app. Copying, redistribution, and any commercial or institutional use require prior written permission — see [LICENSE](LICENSE). Third-party components keep their own licences.


Chinesisch lesen und Vokabeln lernen · Read Chinese and learn words · 中文阅读与词汇闪卡

Built on the same structure as 字里行间 · Entrelinhas, with Chinese as the language you learn:

- **Today**: spaced-repetition flashcards from the HSK 1–6 word bank (`data/zh-HSK*.json`) and your own words; daily goal and streak.
- **Read**: a new graded text every morning per HSK level (`reading/`), plus a **书架** (Bookshelf) page with **二十四节气** — fixed texts for the 24 solar terms in two levels, each with a classical poem, opening on the term's date (`reading/jieqi.json`), and the library. Tap any word for pinyin and meaning, save it to your words. Pinyin on/off, Simplified/Traditional, English and German translations, read-aloud, weekly review. "My articles": paste or import your own Chinese texts.
- **Dictionary**: every word in a text can be tapped — about 217,000 entries with English (CC-CEDICT) and German (HanDeDict), offline once loaded. Texts are split into words by frequency (jieba's method), so 研究生命 reads 研究/生命, not 研究生/命.
- **Tones, shadowing, strokes**: optional tone colours (1 red · 2 green · 3 blue · 4 purple · neutral grey); in the word sheet you can hear the sentence, record yourself and play original → yours (the recording stays in memory, nothing is uploaded); stroke-order animation and tracing for 5,091 common characters (Simplified and Traditional), radical highlighted.
- **Dictionary** (🔍 in the bottom bar / tab row): search by characters, pinyin (with or without tones, e.g. `lv`, `zhong1guo2`, `zhōngguó`), English or German (word bank); offline handwriting recognition on a 米字格 pad (own matcher on Make Me a Hanzi stroke medians, `dict/hw.txt`); speech input via the browser's speech recognition; photo → text offline with Tesseract.js (Apache-2.0, `vendor/tesseract/`, Chinese LSTM data) — drag a box around the characters to read. Word view: readings, EN/DE, HSK, read aloud, stroke order, add to words.
- **Word bank**: all 5,000 words of the HSK 2.0 lists (HSK 1–6) with pinyin, English and German; example sentences are added a few hundred at a time.
- **字匣 (Word box)**: the HSK word bank and your own words, with the practice pile; **自己录入** (add your own word, from a photo, or as a list) is folded in at the top. The **dictionary** is its own page in the middle of the bottom bar (今日学习 · 阅读 · 字典 · 字匣 · 我的); if a word isn't in it, one tap opens 自己录入 with the word filled in.
- **Practice pile**, **Progress**, **Settings & backup**, sync across devices (email login or your own GitHub repo).
- Interface in Deutsch, English, 简体中文 or 繁體中文.

Everything stays in the browser unless you sign in to sync. See `privacy.html`.

## Project structure

No build step: the site is plain files served by GitHub Pages from `main` / `(root)`. Node and Python are only needed for the tools below.

```
index.html              the whole app: UI, styles and code in one file
sw.js                   offline cache
manifest.webmanifest    home-screen name and icons
privacy.html            privacy notice

reading/                ← daily graded texts (format and rules: reading/README.md)
  YYYY-MM-DD.json         one day's texts, one per HSK level
  lib.json                the library (课文库), always available
  index.json              list of dates and titles (built by tools/reading.js)
  config.json             levels, length per level, weekday themes, topics to avoid
  weekly.json             weekly review and quiz (Sundays)
  jieqi.json              二十四节气: fixed texts that open on each solar term's date (hand-written)

data/zh-HSK1…6.json     word bank: HSK 2.0 words with pinyin, EN, DE, examples
dict/                   offline dictionary, word segmentation, pinyin index, handwriting templates (generated)
strokes/                stroke-order data, sharded by character code (generated)
fonts/                  LXGW WenKai (text), WenKai TC (Traditional), Neo XiHei (UI), Latin fonts
vendor/                 Hanzi Writer, pinyin-pro, pdf.js and mammoth (for importing PDF / .docx)
supabase/schema.sql     table for email-login sync, shared with Entrelinhas and Shiori
tools/                  scripts below; tools/src/ holds downloaded source data (not committed, see tools/src/README.md)
```

## Daily content (automatic)

Scheduled Claude tasks write new content and push it to `main` (times in Europe/Berlin):

| When | Task | Writes |
|---|---|---|
| daily 02:47 | Word-bank examples | example sentences for the next 200 words in `data/` (and fixes to pinyin / meanings) |
| daily 05:43 and 06:13 | Daily reading | one text per level in `reading/config.json` → `reading/YYYY-MM-DD.json` |
| Sundays 18:13 | Weekly review | `reading/weekly.json` |

The app always fetches `reading/` and `data/` from the network first, so new texts appear as soon as they are pushed.
To change levels, lengths or themes, edit `reading/config.json`; the next run follows it.

## Tools

The `build_*` scripts regenerate the large data folders (`dict/`, `strokes/`, `data/`) from the original sources and are rarely needed; day-to-day you only use `reading.js`, `wb_add.js` and `wb_examples.py`.

```sh
npm install                    # once
npm run check                  # check all reading texts and the word bank
node tools/reading.js          # fill glossary pinyin, check the texts, rebuild reading/index.json
node tools/wb_add.js --check   # check the word bank
node tools/wb_add.js HSK3 rows.json   # add word-bank rows
python3 tools/wb_examples.py --count  # words still without an example sentence (--todo N / --apply rows.json: see the script)
python3 tools/build_dict.py      # rebuild dict/ (sources: tools/src/README.md)
python3 tools/build_hw.py         # dict/hw.txt handwriting templates (after build_strokes)
node tools/build_pyfix.js         # dict/pyfix.txt: dictionary readings where pinyin-pro guesses wrong (+ tools/pyfix_extra.txt hand fixes)
# dict/pyphrase.txt (edit by hand, no build): phrase readings applied across word boundaries, e.g. 长得 zhǎng de, 北风卷地 juǎn
python3 tools/build_pyindex.py    # dict/py.txt pinyin search index (after build_dict)
python3 tools/build_strokes.py    # rebuild strokes/ (needs tools/src/hwd = npm hanzi-writer-data)
python3 tools/build_wordbank.py  # add missing official HSK words; tools/zh_fix.json holds hand corrections
```

Stroke order: [Hanzi Writer](https://github.com/chanind/hanzi-writer) (MIT) with data from Make Me a Hanzi (Arphic Public License, `strokes/ARPHICPL.TXT`).
Dictionary data: CC-CEDICT (CC BY-SA 4.0) and HanDeDict (CC BY-SA 3.0); the adapted files in `dict/` are CC BY-SA 4.0, see `dict/LICENSE.md`. Word frequencies from jieba (MIT), HSK levels from complete-hsk-vocabulary (MIT).
Pinyin in the app comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT); Traditional characters from OpenCC tables (Apache-2.0); fonts: Chinese text in LXGW WenKai / 霞鹜文楷 (SIL OFL 1.1, `fonts/wenkai/OFL.txt`), Traditional in LXGW WenKai TC (SIL OFL 1.1, `fonts/wenkaitc/OFL.txt`), interface in LXGW Neo XiHei (IPA font licence, see `fonts/`).

## Local preview

```sh
python3 -m http.server     # then open http://localhost:8000
```

Open it over `http://`; double-clicking `index.html` (`file://`) can't load `reading/`, `data/` or `dict/`.
After changing `sw.js` caching rules, bump its `CACHE` version so phones pick up the change.
