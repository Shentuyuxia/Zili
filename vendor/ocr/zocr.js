/* 字里 photo → text: PP-OCRv4 (PaddleOCR, Apache-2.0) detection + recognition models on ONNX Runtime Web (MIT).
   Small pipeline written for Zili without OpenCV: text-region detection → connected components → line crops → CTC decoding.
   Usage: await ZOCR.init(base); const text = await ZOCR.read(canvas);  Everything runs on the device. */
(function () {
  const Z = { det: null, rec: null, keys: null, ready: null };
  Z.init = function (base) {
    if (Z.ready) return Z.ready;
    Z.ready = (async () => {
      ort.env.wasm.numThreads = 1;            // GitHub Pages has no cross-origin isolation, so no threads
      ort.env.wasm.wasmPaths = new URL(base, location.href).href; // must be an absolute URL
      const opt = { executionProviders: ["wasm"], graphOptimizationLevel: "all" };
      const [det, rec, keys] = await Promise.all([
        ort.InferenceSession.create(base + "det.onnx", opt),
        ort.InferenceSession.create(base + "rec.onnx", opt),
        fetch(base + "keys.txt").then(r => r.text())]);
      Z.det = det; Z.rec = rec; Z.keys = keys.split("\n").filter((x, i, a) => i < a.length - 1 || x); Z.keys.push(" ");
    })().catch(e => { Z.ready = null; throw e; });
    return Z.ready;
  };
  function tensorFrom(ctxData, w, h, norm) { // BGR, CHW
    const n = w * h, f = new Float32Array(3 * n), d = ctxData;
    for (let i = 0; i < n; i++) {
      const r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
      if (norm) { f[i] = (b - .5) / .5; f[n + i] = (g - .5) / .5; f[2 * n + i] = (r - .5) / .5; }
      else { f[i] = (b - .406) / .225; f[n + i] = (g - .456) / .224; f[2 * n + i] = (r - .485) / .229; }
    }
    return new ort.Tensor("float32", f, [1, 3, h, w]);
  }
  function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  async function detect(src) {
    const W = src.width, H = src.height, lim = 960, s = Math.min(1, lim / Math.max(W, H));
    const w = Math.max(32, Math.ceil(W * s / 32) * 32), h = Math.max(32, Math.ceil(H * s / 32) * 32);
    const c = canvas(w, h), g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(src, 0, 0, W * s, H * s);
    const out = await Z.det.run({ [Z.det.inputNames[0]]: tensorFrom(g.getImageData(0, 0, w, h).data, w, h, false) });
    const prob = out[Z.det.outputNames[0]].data, ow = w, oh = h;
    const bin = new Uint8Array(ow * oh); for (let i = 0; i < bin.length; i++) bin[i] = prob[i] > .3 ? 1 : 0;
    const seen = new Uint8Array(ow * oh), boxes = [], stack = [];
    for (let i = 0; i < bin.length; i++) {
      if (!bin[i] || seen[i]) continue;
      let x0 = ow, y0 = oh, x1 = 0, y1 = 0, cnt = 0, sum = 0; stack.length = 0; stack.push(i); seen[i] = 1;
      while (stack.length) { const p = stack.pop(), x = p % ow, y = (p / ow) | 0; cnt++; sum += prob[p];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        for (const q of [p - 1, p + 1, p - ow, p + ow]) { if (q < 0 || q >= bin.length || seen[q] || !bin[q]) continue; if ((q === p - 1 && x === 0) || (q === p + 1 && x === ow - 1)) continue; seen[q] = 1; stack.push(q); } }
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1; if (bw < 4 || bh < 4 || sum / cnt < .55) continue;
      const d = bw * bh * 1.5 / (2 * (bw + bh)); // DB "unclip" for a rectangle
      boxes.push({ x: Math.max(0, (x0 - d) / s), y: Math.max(0, (y0 - d) / s), w: Math.min(W, (bw + 2 * d) / s), h: Math.min(H, (bh + 2 * d) / s) });
    }
    return boxes;
  }
  async function recognise(src, b) {
    let bw = Math.min(b.w, src.width - b.x), bh = Math.min(b.h, src.height - b.y); if (bw < 2 || bh < 2) return { text: "", conf: 0 };
    const vertical = bh > bw * 1.6;
    const H = 48, W = vertical ? Math.max(1, Math.round(bh / bw)) * H : Math.max(16, Math.min(1600, Math.round(H * bw / bh)));
    const c = canvas(W, H), g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    if (vertical) { // vertical text: cut the column into square character cells and lay them side by side, upright
      const cells = b.cells || (() => { const n = Math.max(1, Math.round(bh / bw)), c = bh / n; return Array.from({ length: n }, (_, i) => [i * c, c]); })();
      return recogniseCells(src, b, bw, cells);
    } else g.drawImage(src, b.x, b.y, bw, bh, 0, 0, W, H);
    const out = await Z.rec.run({ [Z.rec.inputNames[0]]: tensorFrom(g.getImageData(0, 0, W, H).data, W, H, true) });
    const t = out[Z.rec.outputNames[0]], [_, T, C] = t.dims, d = t.data; let text = "", last = 0, sum = 0, n = 0;
    for (let i = 0; i < T; i++) { let m = -1, mi = 0; for (let k = 0; k < C; k++) { const v = d[i * C + k]; if (v > m) { m = v; mi = k; } }
      if (mi !== 0 && mi !== last) { text += Z.keys[mi - 1] || ""; sum += m; n++; } last = mi; }
    return { text, conf: n ? sum / n : 0 };
  }
  async function recogniseCells(src, b, bw, cells) {
    const H = 48, W = cells.length * H, c = canvas(W, H), g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    cells.forEach(([y, ch], i) => { // keep each character's shape: fit it into a square cell
      const s = Math.min((H - 6) / bw, (H - 6) / ch), dw = bw * s, dh = ch * s;
      g.drawImage(src, b.x, b.y + y, bw, ch, i * H + (H - dw) / 2, (H - dh) / 2, dw, dh); });
    return decode(await Z.rec.run({ [Z.rec.inputNames[0]]: tensorFrom(g.getImageData(0, 0, W, H).data, W, H, true) }));
  }
  function decode(out) {
    const t = out[Z.rec.outputNames[0]], [_, T, C] = t.dims, d = t.data; let text = "", last = 0, sum = 0, n = 0;
    for (let i = 0; i < T; i++) { let m = -1, mi = 0; for (let k = 0; k < C; k++) { const v = d[i * C + k]; if (v > m) { m = v; mi = k; } }
      if (mi !== 0 && mi !== last) { text += Z.keys[mi - 1] || ""; sum += m; n++; } last = mi; }
    return { text, conf: n ? sum / n : 0 };
  }
  function splitRows(L, w, h, b, th) { // characters of a column = runs of rows that contain ink
    const ink = []; for (let y = b.y; y < b.y + b.h; y++) { let k = 0; for (let x = b.x; x < b.x + b.w; x++) if (L[y * w + x] < th) k++; ink.push(k > 0); }
    let runs = []; for (let i = 0; i < ink.length; i++) if (ink[i]) { if (runs.length && i - runs[runs.length - 1][1] <= Math.max(2, b.w * .12)) runs[runs.length - 1][1] = i; else runs.push([i, i]); }
    // join pieces of one character (e.g. 二, 三, 日 on top of 月) until each run is roughly square
    const out = [];
    for (const r of runs) { const p = out[out.length - 1]; if (p && (r[1] - p[0]) < b.w * 1.15 && ((p[1] - p[0]) < b.w * .7 || (r[1] - r[0]) < b.w * .35)) p[1] = r[1]; else out.push(r.slice()); }
    return out.map(([a, z]) => [Math.max(0, a - 2), Math.min(b.h - Math.max(0, a - 2), z - a + 5)]);
  }
  function inkBox(src) { // bounding box of the dark strokes (text darker than its paper)
    const w = src.width, h = src.height, d = src.getContext("2d").getImageData(0, 0, w, h).data;
    let sum = 0; const L = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) { L[i] = .3 * d[i * 4] + .59 * d[i * 4 + 1] + .11 * d[i * 4 + 2]; sum += L[i]; }
    const th = Math.min(sum / (w * h) - 35, 120);
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (L[y * w + x] < th) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return { x: 0, y: 0, w, h };
    const m = Math.round(Math.max(3, (x1 - x0) * .08));
    x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(w - 1, x1 + m); y1 = Math.min(h - 1, y1 + m);
    const b = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }; b.cells = splitRows(L, w, h, b, th); return b;
  }
  Z.readColumn = async function (src) { // a box the user drew around one vertical column
    const b = inkBox(src); if (b.h < b.w * 1.6 || !b.cells.length) return "";
    const r = await recognise(src, b); Z.lastCol = [b, r]; return r.conf > .4 ? r.text : "";
  };
  Z.read = async function (src) { // src: canvas
    if (src.height > src.width * 2.2) { const t = await Z.readColumn(src); if (t) return t; }
    let boxes = await detect(src); Z.lastBoxes = boxes.map(b => [Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h)]);
    if (!boxes.length) boxes = [{ x: 0, y: 0, w: src.width, h: src.height }];
    // reading order: lines top to bottom, then left to right
    // vertical columns read right to left (traditional layout); horizontal lines grouped into rows by their centre
    const vert = boxes.filter(b => b.h > b.w * 1.6).sort((a, b) => b.x - a.x), hor = boxes.filter(b => !(b.h > b.w * 1.6)).sort((a, b) => a.y - b.y);
    const rows = []; // boxes whose vertical extents overlap by more than half belong to one row
    for (const b of hor) { const r = rows.find(r => Math.min(r.y1, b.y + b.h) - Math.max(r.y0, b.y) > Math.min(r.y1 - r.y0, b.h) * .7);
      if (r) { r.items.push(b); r.y0 = Math.min(r.y0, b.y); r.y1 = Math.max(r.y1, b.y + b.h); } else rows.push({ y0: b.y, y1: b.y + b.h, items: [b] }); }
    rows.sort((a, b) => a.y0 - b.y0);
    boxes = rows.flatMap(r => r.items.sort((a, b) => a.x - b.x)).concat(vert);
    const lines = [];
    for (const b of boxes) { const r = await recognise(src, b); if (r.text && r.conf > .5) lines.push(r.text); }
    return lines.join("\n");
  };
  window.ZOCR = Z;
})();
