# 字里 Zili

Chinesisch lesen und Vokabeln lernen · Read Chinese and learn words · 中文阅读与词汇闪卡

Built on the same structure as 字里行间 · Entrelinhas, with Chinese as the language you learn:

- **Today**: spaced-repetition flashcards from the HSK 1–6 word bank (`data/zh-HSK*.json`) and your own words; daily goal and streak.
- **Read**: a new graded text every morning per HSK level (`reading/`), plus the library. Tap any word for pinyin and meaning, save it to your words. Pinyin on/off, Simplified/Traditional, English and German translations, read-aloud, weekly review. "My articles": paste or import your own Chinese texts.
- **Dictionary**: every word in a text can be tapped — about 217,000 entries with English (CC-CEDICT) and German (HanDeDict), offline once loaded. Texts are split into words by frequency (jieba's method), so 研究生命 reads 研究/生命, not 研究生/命.
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
python3 tools/build_wordbank.py  # add missing official HSK words; tools/zh_fix.json holds hand corrections
```

Dictionary data: CC-CEDICT (CC BY-SA 4.0) and HanDeDict (CC BY-SA 3.0); the adapted files in `dict/` are CC BY-SA 4.0, see `dict/LICENSE.md`. Word frequencies from jieba (MIT), HSK levels from complete-hsk-vocabulary (MIT).
Pinyin in the app comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT); Traditional characters from OpenCC tables (Apache-2.0); font LXGW Neo XiHei (IPA font licence, see `fonts/`).
