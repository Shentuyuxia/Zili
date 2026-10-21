// Source content for 字里 (authored in Simplified Chinese). Format: lexicon lines "词|de|en", articles below.
const LEX=`
我|ich|I
家|Zuhause; Familie|home; family
有|haben|have
四|vier|four
口|Person (Zählwort)|counter for people
人|Mensch|person
爸爸|Papa|dad
是|sein|to be
老师|Lehrer/in|teacher
妈妈|Mama|mom
会|können|can; know how to
做饭|kochen|cook
好吃|lecker|delicious
一个|ein|a; one
弟弟|jüngerer Bruder|younger brother
很|sehr|very
爱|lieben|love
我们|wir|we
的|Possessivpartikel|possessive particle
早上|am Morgen|in the morning
七点|sieben Uhr|seven o'clock
起床|aufstehen|get up
刷牙|Zähne putzen|brush teeth
洗脸|Gesicht waschen|wash one's face
去|gehen|go
学校|Schule|school
上课|Unterricht haben|have class
中午|Mittag|noon
和|und; mit|and; with
朋友|Freund/in|friend
一起|zusammen|together
吃饭|essen|eat a meal
晚上|Abend|evening
写作业|Hausaufgaben machen|do homework
然后|dann|then
睡觉|schlafen|sleep
一只|ein (Tier)|one (animal)
小猫|Kätzchen|kitten
可爱|süß|cute
它|es|it
喜欢|mögen|like
吃|essen|eat
鱼|Fisch|fish
狗|Hund|dog
跑|rennen|run
得|(Partikel)|(particle)
快|schnell|fast
动物|Tier|animal
今天|heute|today
天气|Wetter|weather
好|gut|good
太阳|Sonne|sun
大|groß|big
公园|Park|park
里|in|in
很多|viele|many
花|Blume|flower
下雨|regnen|rain
的时候|wenn; als|when
在|im; in|at; in
看书|lesen|read books
春天|Frühling|spring
最|am meisten|most
每天|jeden Tag|every day
都|immer|always
地铁站|U-Bahn-Station|subway station
附近|in der Nähe|nearby
咖啡店|Café|café
买|kaufen|buy
一杯|eine Tasse|a cup
热|heiß|hot
咖啡|Kaffee|coffee
店员|Verkäufer/in|shop assistant
总是|immer|always
笑|lächeln|smile
着|(Partikel)|(particle)
跟|mit; zu|with
打招呼|grüßen|say hello
虽然|obwohl|although
并|(verneint)|not at all
太|zu|too
熟|vertraut|familiar
这种|diese Art|this kind
小小|klein|tiny
习惯|Gewohnheit|habit
让|lassen|let; make
一天|ein Tag|a day
开始|Anfang|beginning
变得|werden|become
轻松|entspannt|relaxed
了|(Partikel)|(particle)
许多|viele|many
有时候|manchmal|sometimes
窗边|am Fenster|by the window
人来人往|Menschen kommen und gehen|people coming and going
觉得|finden|feel
城市|Stadt|city
温柔|sanft|gentle
学习|lernen|study
门|(Zählwort für Fächer)|(counter for subjects)
外语|Fremdsprache|foreign language
重要|wichtig|important
坚持|durchhalten|persist
只|nur|only
需要|brauchen|need
二十|zwanzig|twenty
分钟|Minute|minute
但|aber|but
要|müssen|must
保持|beibehalten|keep up
下去|weitermachen|continue
不必|nicht nötig|need not
一开始|am Anfang|at first
背|auswendig lernen|memorize
生词|neue Wörter|new words
可以|können|may
先|zuerst|first
从|von|from
常用|häufig|frequently used
词|Wort|word
多|viel|much
听|hören|listen
说|sprechen|speak
比|als|compared with
死记硬背|Auswendiglernen|rote memorization
更|mehr|more
有效|wirksam|effective
中秋节|Mondfest|Mid-Autumn Festival
传统|Tradition|tradition
节日|Feiertag|festival
农历|Mondkalender|lunar calendar
八月|August|eighth month
十五|fünfzehn|fifteen
这一天|dieser Tag|this day
家人|Familienmitglieder|family members
聚|sich versammeln|gather
一起|zusammen|together
月饼|Mondkuchen|mooncake
赏月|den Mond betrachten|admire the moon
月亮|Mond|moon
人们|Menschen|people
相信|glauben|believe
圆圆|rund|round
象征|symbolisieren|symbolize
团圆|zusammenkommen|reunion
大家|alle|everyone
一边|gleichzeitig|while
讲|erzählen|tell
故事|Geschichte|story
关于|über|about
又|sowohl ... als auch|both ... and
甜|süß|sweet
香|duftend|fragrant
不可缺少|unentbehrlich|indispensable
美食|Köstlichkeit|delicacy
不|nicht|not
看|sehen; schauen|look; see
也|auch|also
一|eins|one
就|dann; eben|just; then
下|unten; nach|down; after
中|in; Mitte|middle; in
国|Land|country
中国|China|China
每|jeder|each; every
年|Jahr|year
每年|jedes Jahr|every year
亮|hell|bright
`;
// [id, level, audience, title{zh,de,en}, sentences [zh, de, en]]
const ARTICLES=[
["k1","1","kids",{zh:"我的家",de:"Meine Familie",en:"My family"},[
["我家有四口人。","Bei uns zu Hause sind wir vier Personen.","Our family has four people."],
["爸爸是老师。","Papa ist Lehrer.","Dad is a teacher."],
["妈妈会做饭，很好吃。","Mama kann kochen, und es schmeckt sehr lecker.","Mom can cook, and the food is delicious."],
["我有一个弟弟。","Ich habe einen jüngeren Bruder.","I have a younger brother."],
["我们很爱我们的家。","Wir lieben unsere Familie sehr.","We love our family very much."]]],
["k2","1","kids",{zh:"我的一天",de:"Mein Tag",en:"My day"},[
["早上七点，我起床。","Um sieben Uhr morgens stehe ich auf.","At seven in the morning, I get up."],
["我刷牙、洗脸。","Ich putze mir die Zähne und wasche mein Gesicht.","I brush my teeth and wash my face."],
["我去学校上课。","Ich gehe in die Schule und habe Unterricht.","I go to school for class."],
["中午，我和朋友一起吃饭。","Mittags esse ich zusammen mit meinen Freunden.","At noon I eat lunch with my friends."],
["晚上，我写作业，然后睡觉。","Abends mache ich Hausaufgaben und gehe dann schlafen.","In the evening I do my homework and then go to sleep."]]],
["k3","1","kids",{zh:"小猫和动物",de:"Die Katze und die Tiere",en:"The kitten and animals"},[
["我有一只小猫。","Ich habe eine kleine Katze.","I have a kitten."],
["小猫很可爱。","Die kleine Katze ist sehr süß.","The kitten is very cute."],
["它喜欢吃鱼。","Sie frisst sehr gern Fisch.","It likes to eat fish."],
["狗跑得很快。","Hunde rennen sehr schnell.","Dogs run very fast."],
["我喜欢动物。","Ich mag Tiere.","I like animals."]]],
["k4","1","kids",{zh:"今天的天气",de:"Das Wetter heute",en:"Today's weather"},[
["今天天气很好。","Das Wetter ist heute sehr schön.","The weather is very nice today."],
["太阳很大，我们去公园。","Die Sonne scheint stark, wir gehen in den Park.","The sun is strong, so we go to the park."],
["公园里有很多花。","Im Park gibt es viele Blumen.","There are many flowers in the park."],
["下雨的时候，我们在家看书。","Wenn es regnet, lesen wir zu Hause Bücher.","When it rains, we read books at home."],
["我最喜欢春天。","Am liebsten mag ich den Frühling.","I like spring the most."]]],
["a1","3","adult",{zh:"城市的早晨",de:"Ein Morgen in der Stadt",en:"A morning in the city"},[
["每天早上，我都会在地铁站附近的咖啡店买一杯热咖啡。","Jeden Morgen kaufe ich in einem Café nahe der U-Bahn-Station einen heißen Kaffee.","Every morning I buy a cup of hot coffee at a café near the subway station."],
["店员总是笑着跟我打招呼，虽然我们并不太熟。","Die Verkäuferin begrüßt mich immer lächelnd, obwohl wir uns kaum kennen.","The shop assistant always greets me with a smile, although we don't know each other well."],
["这种小小的习惯，让我一天的开始变得轻松了许多。","Diese kleine Gewohnheit macht den Start in meinen Tag deutlich entspannter.","This small habit has made the start of my day much more relaxed."],
["有时候我会在窗边看人来人往，觉得城市也很温柔。","Manchmal sehe ich am Fenster den Menschen zu und finde die Stadt richtig sanft.","Sometimes I watch the people coming and going by the window and feel the city is gentle too."]]],
["a2","3","adult",{zh:"学习的方法",de:"Wie man lernt",en:"How to learn"},[
["学习一门外语，最重要的是坚持。","Beim Lernen einer Fremdsprache kommt es vor allem aufs Durchhalten an.","When learning a foreign language, the most important thing is persistence."],
["每天只需要花二十分钟，但要保持下去。","Man braucht nur zwanzig Minuten am Tag, aber man muss dranbleiben.","You only need twenty minutes a day, but you have to keep it up."],
["不必一开始就背下很多生词，可以先从常用的词开始。","Am Anfang muss man nicht gleich viele neue Wörter auswendig lernen; man kann mit den häufigen Wörtern beginnen.","You don't need to memorize many new words right away; you can start with common words."],
["多听、多说，比死记硬背更有效。","Viel hören und viel sprechen ist wirksamer als stures Auswendiglernen.","Listening and speaking a lot is more effective than rote memorization."]]],
["a3","3","adult",{zh:"中秋节",de:"Das Mondfest",en:"The Mid-Autumn Festival"},[
["中秋节是中国的传统节日，每年农历八月十五。","Das Mondfest ist ein traditionelles chinesisches Fest und fällt auf den 15. Tag des achten Mondmonats.","The Mid-Autumn Festival is a traditional Chinese festival, held on the fifteenth day of the eighth lunar month."],
["这一天，家人会聚在一起，吃月饼、赏月亮。","An diesem Tag kommt die Familie zusammen, isst Mondkuchen und betrachtet den Mond.","On this day, families gather, eat mooncakes and admire the moon."],
["人们相信，圆圆的月亮象征着团圆。","Man glaubt, dass der runde Mond für Zusammenhalt steht.","People believe that the round moon symbolizes reunion."],
["大家一边吃月饼，一边讲关于月亮的故事。","Während alle Mondkuchen essen, erzählen sie sich Geschichten über den Mond.","While eating mooncakes, everyone tells stories about the moon."],
["月饼又甜又香，是节日里不可缺少的美食。","Mondkuchen ist süß und duftet herrlich; er gehört unbedingt zum Fest.","Mooncakes are both sweet and fragrant, an essential treat of the festival."]]]
];
module.exports={LEX,ARTICLES};
