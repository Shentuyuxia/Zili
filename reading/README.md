# 阅读 · Reading (字里 Zili)

The app's Reading tab reads this folder.

- `YYYY-MM-DD.json`: one day's texts, written each morning by a scheduled task.
- `lib.json`: the library (课文库) — the original 33 Zili texts. Shown when there is no dated text yet, and always listed in the sidebar.
- `index.json`: list of dates and titles. Rebuild with `node tools/reading.js` (also fills missing glossary pinyin and checks every file).
- `config.json`: which HSK levels get a text each day, length per level, weekday themes, topics to avoid.
- `weekly.json`: the weekly review (Sundays).
- `records.json`: **唱片盒** (record box: Mandarin songs from Hong Kong, Taiwan and Singapore, with a short introduction in simple Chinese and EN/DE/PT translations; a search link, no lyrics) and **茶余饭后** (small stories and customs of the Chinese-speaking world, simple Chinese + EN/DE/PT). Shown in the Reading tab beside the texts; the app shows only the helper languages the learner chose.
- `jieqi.json`: **二十四节气** — fixed, hand-written texts for the 24 solar terms (not touched by the daily tasks). See below.

## Item format

```json
{"lang":"zh","level":"HSK3","kind":"feature","section":"饮食",
 "title":"中文标题","title_en":"English title","title_de":"Deutscher Titel","title_pt":"Título em português",
 "dek":"一句中文导语（可选）",
 "paragraphs":["中文段落……"],
 "paragraphs_en":["English translation, same number of paragraphs"],
 "paragraphs_de":["Deutsche Übersetzung, gleiche Absatzzahl"],
 "paragraphs_pt":["Tradução em português do Brasil, mesmo número de parágrafos"],
 "glossary":[{"w":"词语","p":"cí yǔ","en":"word; expression","de":"Wort; Ausdruck","pt":"a palavra; a expressão"}],
 "grammar":"One short note in English on a structure in the text.",
 "grammar_de":"Dieselbe Notiz auf Deutsch.",
 "grammar_pt":"A mesma nota em português.",
 "questions":["中文问题？"],
 "sources":[]}
```

- Helper languages: English, German and Brazilian Portuguese (`_en`, `_de`, `_pt`). Each reader chooses which of them to see; the app shows only the chosen ones.
- Simplified characters only; the app converts to Traditional and adds pinyin itself. Never put pinyin into `paragraphs`.
- Texts are original. Topics are light and everyday (city life, food, internet slang, study and work, free time, customs, nature); no politics.
- Level guide: HSK1 very short sentences and the most common words; each level up adds length, vocabulary and structures (see `config.json`).

## 二十四节气 (`jieqi.json`)

Fixed texts in the spirit of Shiori: one term, two levels (HSK2 for children and beginners, HSK4 for adults), each with a classical poem.

- The Reading tab has two views: **今日** (the day's graded texts) and **书架** (Bookshelf: fixed collections). The 书架 page lists all 24 terms by season (`terms` in `jieqi.json`: season, name, usual date, EN/DE name); terms that aren't open yet show their date. Below it is the library (`lib.json`, 课文库).
- An item opens on its `date` (the term's date in the first year, e.g. `"2026-10-23"` for 霜降). On that day it also appears first in the 今日 list, and stays at the end of that list until the next term. From the second year on, only month and day count, so the cycle repeats every year.
- Item format = the normal format above, plus:

```json
{"kind":"jieqi","section":"节气","term":"霜降","date":"2026-10-23",
 "poem":{"title":"山行","author":"杜牧","dynasty":"唐",
         "lines":["远上寒山石径斜，","白云生处有人家。","停车坐爱枫林晚，","霜叶红于二月花。"],
         "explain_zh":"简单的白话解释（点词可查）",
         "explain_en":"English explanation","explain_de":"Deutsche Erklärung","explain_pt":"Explicação em português"}}
```

- `node tools/reading.js` checks this file too (term, date, poem) and fills glossary pinyin.
- Dates of the terms: Hong Kong Observatory calendar (hko.gov.hk). Every cultural fact needs a source you opened; folk sayings are labelled as sayings.
- **Sources — preference of the app's owner:** do not use Xinhua (新华网/新华社), People's Daily (人民日报/人民网), CCTV/CGTN or similar central state outlets. Prefer Hong Kong and Taiwan media (e.g. 香港天文台, 端传媒, 报导者, 中央社 culture pages, 中国时报), museums and heritage institutions, encyclopedias, scholarly sources, and mainland culture/feature outlets such as 澎湃新闻 (The Paper) or 文汇报 culture pages. When sources disagree on a fact, write the version they share, or name the difference.
- All 24 terms are written (48 texts). Sources used throughout: dates — 農業部 / 臺北市立天文科學教育館 and the Hong Kong Observatory; the three 候 of each term — 国立天文台 暦Wiki (七十二候, Chinese version); customs — 香港教育局, 星島教室, 康健雜誌, 淡江時報, Marie Claire 台灣, Our China Story, 米芝蓮指南; each item lists its own sources.
- Poems are all classical (pre-1912) and public domain; excerpts are marked （节选）.
- Pinyin: if the app shows a wrong reading for a polyphone in a phrase (长得, 北风卷地), add the phrase to `dict/pyphrase.txt`.
