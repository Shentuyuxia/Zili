# 阅读 · Reading (字里 Zili)

The app's Reading tab reads this folder.

- `YYYY-MM-DD.json`: one day's texts, written each morning by a scheduled task.
- `lib.json`: the library (课文库) — the original 33 Zili texts. Shown when there is no dated text yet, and always listed in the sidebar.
- `index.json`: list of dates and titles. Rebuild with `node tools/reading.js` (also fills missing glossary pinyin and checks every file).
- `config.json`: which HSK levels get a text each day, length per level, weekday themes, topics to avoid.
- `weekly.json`: the weekly review (Sundays).

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
