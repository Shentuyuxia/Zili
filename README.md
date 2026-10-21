# 字里 Zili

Chinesisch lesen und Vokabeln lernen · Read Chinese and learn words · 中文阅读与词汇闪卡

Built on the same structure as 字里行间 · Entrelinhas, with Chinese as the language you learn:

- **Today**: spaced-repetition flashcards from the HSK 1–6 word bank (`data/zh-HSK*.json`) and your own words; daily goal and streak.
- **Read**: a new graded text every morning per HSK level (`reading/`), plus the library. Tap any word for pinyin and meaning, save it to your words. Pinyin on/off, Simplified/Traditional, English and German translations, read-aloud, weekly review. "My articles": paste or import your own Chinese texts.
- **Dictionary**: every word in a text can be tapped — about 217,000 entries with English (CC-CEDICT) and German (HanDeDict), offline once loaded. Texts are split into words by frequency (jieba's method), so 研究生命 reads 研究/生命, not 研究生/命.
- **Tones, shadowing, strokes**: optional tone colours (1 red · 2 green · 3 blue · 4 purple · neutral grey); in the word sheet you can hear the sentence, record yourself and play original → yours (the recording stays in memory, nothing is uploaded); stroke-order animation and tracing for 5,091 common characters (Simplified and Traditional), radical highlighted.
- **Dictionary** (🔍 in the bottom bar / tab row): search by characters, pinyin (with or without tones, e.g. `lv`, `zhong1guo2`, `zhōngguó`), English or German (word bank); offline handwriting recognition on a 米字格 pad (own matcher on Make Me a Hanzi stroke medians, `dict/hw.txt`); speech input via the browser's speech recognition. Word view: readings, EN/DE, HSK, read aloud, stroke order, add to words.
- **Word bank**: all 5,000 words of the HSK 2.0 lists (HSK 1–6) with pinyin, English and German; example sentences are added a few hundred at a time.
- **Add words**, **Practice pile**, **Word list**, **Progress**, **Settings & backup**, sync across devices (email login or your own GitHub repo).
- Interface in Deutsch, English, 简体中文 or 繁體中文.

Everything stays in the browser unless you sign in to sync. See `privacy.html`.

## Tools

```sh
npm install
node tools/reading.js          # fill glossary pinyin, check the texts, rebuild reading/index.json
node tools/wb_add.js --check   # check the word bank
node tools/wb_add.js HSK3 rows.json   # add word-bank rows
python3 tools/build_dict.py      # rebuild dict/ (sources: tools/src/README.md)
python3 tools/build_hw.py         # dict/hw.txt handwriting templates (after build_strokes)
python3 tools/build_pyindex.py    # dict/py.txt pinyin search index (after build_dict)
python3 tools/build_strokes.py    # rebuild strokes/ (needs tools/src/hwd = npm hanzi-writer-data)
python3 tools/build_wordbank.py  # add missing official HSK words; tools/zh_fix.json holds hand corrections
```

Stroke order: [Hanzi Writer](https://github.com/chanind/hanzi-writer) (MIT) with data from Make Me a Hanzi (Arphic Public License, `strokes/ARPHICPL.TXT`).
Dictionary data: CC-CEDICT (CC BY-SA 4.0) and HanDeDict (CC BY-SA 3.0); the adapted files in `dict/` are CC BY-SA 4.0, see `dict/LICENSE.md`. Word frequencies from jieba (MIT), HSK levels from complete-hsk-vocabulary (MIT).
Pinyin in the app comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT); Traditional characters from OpenCC tables (Apache-2.0); fonts: Chinese text in LXGW WenKai / 霞鹜文楷 (SIL OFL 1.1, `fonts/wenkai/OFL.txt`), Traditional in LXGW WenKai TC (SIL OFL 1.1, `fonts/wenkaitc/OFL.txt`), interface in LXGW Neo XiHei (IPA font licence, see `fonts/`).
