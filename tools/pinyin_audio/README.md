# Model syllables for the pinyin course (audio/cards/)

Each single-character card in `data/pinyin-course.json` has an `"au"` recording, named by the character's code point (`9a6c.mp3` = 马).

How they were made:
1. `gen_cards.py` (venv with `kokoro_onnx`, `misaki[zh]`; model files `kokoro-v1.0.onnx`, `voices-v1.0.bin`, Apache 2.0) reads each character with the voice `zf_xiaoxiao`.
2. `reshape.py` (`pyworld`, `soundfile`) keeps the consonant and the voice, and replaces the pitch with a clear textbook contour on one fixed range (level 1 ≈ 150 Hz, level 5 ≈ 330 Hz): 1st 55, 2nd 35, 3rd a full 214 (low part held, rise to level 4), 4th 51 with a stronger start. Voiced part: 0.55 s (1st/2nd), 0.8 s (3rd), 0.42 s (4th).

To replace a card with a real recording, overwrite its mp3 (same name) – the app needs no change.

Two-syllable words (`audio/words/<hex>-<hex>.mp3`) are built by `compose.py` from the same single-syllable readings: each syllable gets its contour in context (a non-final 3rd tone is a half 3rd, 21; a non-final 4th is 52; the neutral tone is short and its pitch depends on the tone before it; tone changes follow the item's `say` field, e.g. 你好 = 2+3, 一起 = 4+3, 不是 = 2+4). The same script also makes cards for minimal-pair characters that have no card yet. `data/pinyin-course.json` → `cardAu` maps every recorded character to its file.
