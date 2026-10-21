# Source data (not committed)

`python3 tools/build_dict.py` and `python3 tools/build_wordbank.py` read these files. Get them like this:

```sh
cd tools/src
npm pack cc-cedict && tar xzf cc-cedict-*.tgz && cp package/data/all.js cedict.js && rm -rf package cc-cedict-*.tgz
git clone --depth 1 https://github.com/gugray/HanDeDict hd && cp hd/handedict.u8 . && rm -rf hd
pip download jieba --no-deps --no-binary :all: -d jb && tar xzf jb/jieba-*.tar.gz -C jb && cp jb/jieba-*/jieba/dict.txt jieba.txt && rm -rf jb
git clone --depth 1 https://github.com/drkameleon/complete-hsk-vocabulary hsk && cp hsk/complete.json hsk.json && rm -rf hsk
npm pack hanzi-writer-data && mkdir hwd && tar xzf hanzi-writer-data-*.tgz -C hwd --strip-components=1 && rm hanzi-writer-data-*.tgz
```
