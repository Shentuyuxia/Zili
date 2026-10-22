# 阅读 · Reading (字里 Zili)

The app's Reading tab reads this folder.

- `YYYY-MM-DD.json`: one day's texts, written each morning by a scheduled task.
- `lib.json`: the library (课文库) — the original 33 Zili texts. Shown when there is no dated text yet, and always listed in the sidebar.
- `index.json`: list of dates and titles. Rebuild with `node tools/reading.js` (also fills missing glossary pinyin and checks every file).
- `config.json`: which HSK levels get a text each day, length per level, weekday themes, topics to avoid.
- `weekly.json`: the weekly review (Sundays).
- `jieqi.json`: **二十四节气** — fixed, hand-written texts for the 24 solar terms (not touched by the daily tasks). See below.

## Item format

```json
{"lang":"zh","level":"HSK3","kind":"feature","section":"饮食",
 "title":"中文标题","title_en":"English title","title_de":"Deutscher Titel",
 "dek":"一句中文导语（可选）",
 "paragraphs":["中文段落……"],
 "paragraphs_en":["English translation, same number of paragraphs"],
 "paragraphs_de":["Deutsche Übersetzung, gleiche Absatzzahl"],
 "glossary":[{"w":"词语","p":"cí yǔ","en":"word; expression","de":"Wort; Ausdruck"}],
 "grammar":"One short note in English on a structure in the text.",
 "grammar_de":"Dieselbe Notiz auf Deutsch.",
 "questions":["中文问题？"],
 "sources":[]}
```

- Simplified characters only; the app converts to Traditional and adds pinyin itself. Never put pinyin into `paragraphs`.
- Texts are original. Topics are light and everyday (city life, food, internet slang, study and work, free time, customs, nature); no politics.
- Level guide: HSK1 very short sentences and the most common words; each level up adds length, vocabulary and structures (see `config.json`).

## 二十四节气 (`jieqi.json`)

Fixed texts in the spirit of Shiori: one term, two levels (HSK2 for children and beginners, HSK4 for adults), each with a classical poem.

- An item opens on its `date` (the term's date in the first year, e.g. `"2026-10-23"` for 霜降). On that day it is first in the day's reading list; until the next term it stays at the end of the list; after that it lives on the 「二十四节气」 shelf below the archive. From the second year on, only month and day count, so the cycle repeats every year.
- Item format = the normal format above, plus:

```json
{"kind":"jieqi","section":"节气","term":"霜降","date":"2026-10-23",
 "poem":{"title":"山行","author":"杜牧","dynasty":"唐",
         "lines":["远上寒山石径斜，","白云生处有人家。","停车坐爱枫林晚，","霜叶红于二月花。"],
         "explain_zh":"简单的白话解释（点词可查）",
         "explain_en":"English explanation","explain_de":"Deutsche Erklärung"}}
```

- `node tools/reading.js` checks this file too (term, date, poem) and fills glossary pinyin.
- Dates of the terms: Hong Kong Observatory calendar (hko.gov.hk). Every cultural fact needs a source you opened; folk sayings are labelled as sayings.
- Written so far: 霜降 (10-23), 立冬 (11-07).
