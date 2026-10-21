// Third batch: 20 texts (kids, classic life, young people, internet trends). No politics.
const LEX3=`
书包|Schulranzen|schoolbag
红色|rot|red
本子|Heft|notebook
铅笔|Bleistift|pencil
检查|prüfen|check
上学|zur Schule gehen|go to school
重|schwer|heavy
苹果|Apfel|apple
切|schneiden|cut
西瓜|Wassermelone|watermelon
甜|süß|sweet
水果|Obst|fruit
对|für|for
身体|Körper|body
画画|malen|draw
图|Bild|picture
小动物|kleine Tiere|small animals
大树|großer Baum|big tree
飞|fliegen|fly
想象力|Fantasie|imagination
画家|Maler/in|painter
七岁|sieben Jahre alt|seven years old
蛋糕|Kuchen|cake
唱|singen|sing
生日歌|Geburtstagslied|birthday song
开心|fröhlich|happy
许|wünschen|make (a wish)
愿望|Wunsch|wish
吹灭|ausblasen|blow out
蜡烛|Kerze|candle
蓝色|blau|blue
天空|Himmel|sky
漂亮|schön|pretty
热闹|lebhaft|lively
黄色|gelb|yellow
温暖|warm|warm
泡|aufbrühen|brew
绿茶|grüner Tee|green tea
香味|Duft|aroma
出来|herauskommen|come out
窗边|am Fenster|by the window
安静|ruhig|quiet
时候|Moment|moment
周六|Samstag|Saturday
书店|Buchhandlung|bookshop
书架|Regal|bookshelf
一排排|reihenweise|in rows
知道|wissen|know
翻|blättern|browse
一会儿|eine Weile|a while
旧|alt|old
诗集|Gedichtband|poetry collection
回家|nach Hause gehen|go home
路上|unterwegs|on the way
一直|immer weiter|continuously
读|lesen|read
其中|darunter|among them
一首|ein (Gedicht)|a (poem)
目的地|Ziel|destination
重新|neu|again
认识|kennenlernen|get to know
座|Zählwort (Stadt)|counter for cities
沿着|entlang|along
河|Fluss|river
经过|vorbei an|pass
小店|kleiner Laden|small shop
老房子|altes Haus|old house
包子|Teigtasche|steamed bun
热腾腾|dampfend|steaming
比|als|than
任何|jede|any
导航|Navigation|navigation
雨|Regen|rain
午后|Nachmittag|afternoon
玻璃|Glas|glass
雨滴|Regentropfen|raindrop
落|fallen|fall
发出|erzeugen|make (a sound)
声音|Geräusch|sound
拿铁|Latte|latte
发现|bemerken|realise
已经|schon|already
两个小时|zwei Stunden|two hours
第一次|das erste Mal|first time
番茄|Tomate|tomato
炒|braten|stir-fry
蛋|Ei|egg
结果|Ergebnis|result
咸|salzig|salty
火候|Hitze|heat (cooking)
教学|Lehr-|teaching
视频|Video|video
明白|verstehen|understand
重要|wichtig|important
其实|eigentlich|actually
关键|entscheidend|key
耐心|Geduld|patience
道|Zählwort (Gericht)|counter for dishes
菜|Gericht|dish
健身房|Fitnessstudio|gym
身材|Figur|figure
精神|munter|energetic
练|trainieren|train
半个|eine halbe|half
次|Mal|time
坚持|durchhalten|persevere
一下子|plötzlich|suddenly
为难|in der Klemme sein|feel torn
临时|kurzfristig|at short notice
加班|Überstunden machen|work overtime
答应|zusagen|agree
总是|immer|always
礼貌|höflich|polite
拒绝|ablehnen|refuse
安排|Pläne|plans
帮忙|helfen|help
尴尬|peinlich|awkward
越来越|immer mehr|more and more
随时|jederzeit|at any time
养|halten|keep (a pet)
门口|Tür|door
心情|Stimmung|mood
钱|Geld|money
珍贵|kostbar|precious
陪伴|Gesellschaft|company
方便|praktisch|convenient
出行|reisen|travel
共享|geteilt|shared
解锁|entsperren|unlock
停车|parken|park
挡住|blockieren|block
人行道|Gehweg|pavement
自由|frei|free
风|Wind|wind
脸|Gesicht|face
流行|angesagt sein|be trendy
搭子|Buddy|buddy|net
伙伴|Partner|partner
饭|Essen|meal
亲密|eng|close
互相|gegenseitig|mutually
慢节奏|langsames Tempo|slow pace|net
赶时间|eilig|in a hurry
街道|Straße|street
小吃|Snack|snack
路线|Route|route
特别|besonders|especially
放松|entspannen|relax
焦虑|Angst|anxiety
控制|kontrollieren|control
完成|erledigen|complete
放下|weglegen|put down
节奏|Rhythmus|rhythm
鲜艳|leuchtend|bright
外套|Jacke|jacket
裙子|Rock|skirt
粉色|rosa|pink
活力|Energie|energy
试|versuchen|try
提供|bieten|provide
理解|verstehen|understand
照顾|sich kümmern|look after
辛苦|anstrengend|hard
道理|Einsicht|reason
松弛感|entspannte Gelassenheit|relaxed ease|net
多巴胺|Dopamin|dopamine|net
穿搭|Outfit|outfit|net
情绪价值|emotionaler Wert|emotional value|net
城市|Stadt|city
散步|spazieren gehen|walk
咖啡馆|Café|café
学|lernen|learn
做|machen|make
一道|ein (Gericht)|a (dish)
新|neu|new
每个|jede|each
一个人|allein|alone
餐厅|Restaurant|restaurant
年轻人|junge Leute|young people
养宠物|Haustier halten|keep a pet
小狗|kleiner Hund|little dog
陪|begleiten|accompany
单车|Fahrrad|bicycle
租|mieten|rent
一辆|ein (Fahrzeug)|a (vehicle)
城市里|in der Stadt|in the city
出门|exists
`;
const ARTICLES3=[
["k6","1","kids",{zh:"我的书包",de:"Mein Schulranzen",en:"My schoolbag"},[
["我有一个红色的书包。","Ich habe einen roten Schulranzen.","I have a red schoolbag."],
["书包里有书、本子和铅笔。","Im Ranzen sind Bücher, Hefte und Bleistifte.","There are books, notebooks and pencils in my bag."],
["每天上学前，我都要检查一下。","Vor jeder Schule prüfe ich ihn jeden Tag.","Every day before school, I check it."],
["我的书包很重，但是我很喜欢它。","Mein Ranzen ist schwer, aber ich mag ihn sehr.","My bag is heavy, but I love it."]],"classic"],
["k7","1","kids",{zh:"吃水果",de:"Obst essen",en:"Eating fruit"},[
["早上，我吃一个苹果。","Morgens esse ich einen Apfel.","In the morning I eat an apple."],
["中午，妈妈给我切了一个西瓜。","Mittags hat Mama mir eine Wassermelone geschnitten.","At noon, Mum cut a watermelon for me."],
["西瓜又甜又红。","Die Wassermelone ist süß und rot.","The watermelon is sweet and red."],
["水果对身体很好。","Obst ist sehr gut für den Körper.","Fruit is very good for the body."]],"classic"],
["k8","2","kids",{zh:"我会画画",de:"Ich kann malen",en:"I can draw"},[
["我喜欢画画，每个周末都画很多图。","Ich male gern und zeichne jedes Wochenende viele Bilder.","I like drawing and make lots of pictures every weekend."],
["我最喜欢画小动物和大树。","Am liebsten male ich kleine Tiere und große Bäume.","My favourite things to draw are small animals and big trees."],
["有一次，我画了一只会飞的猫。","Einmal habe ich eine Katze gemalt, die fliegen kann.","Once I drew a cat that can fly."],
["老师说我的画很有想象力。","Mein Lehrer sagt, meine Bilder sind sehr fantasievoll.","My teacher says my drawings are very imaginative."],
["以后我想当画家。","Später möchte ich Malerin werden.","Later I want to become a painter."]],"classic"],
["k9","2","kids",{zh:"生日快乐",de:"Alles Gute zum Geburtstag",en:"Happy birthday"},[
["今天是我的生日，我七岁了。","Heute ist mein Geburtstag, ich bin sieben Jahre alt.","Today is my birthday, I am seven years old."],
["爸爸妈妈做了一个大蛋糕。","Papa und Mama haben einen großen Kuchen gemacht.","Mum and Dad made a big cake."],
["朋友们唱生日歌，我很开心。","Die Freunde singen das Geburtstagslied, und ich freue mich sehr.","My friends sang happy birthday, and I was very happy."],
["我许了一个愿望，然后吹灭了蜡烛。","Ich habe mir etwas gewünscht und dann die Kerzen ausgepustet.","I made a wish and then blew out the candles."]],"classic"],
["k10","1","kids",{zh:"我喜欢的颜色",de:"Meine Lieblingsfarbe",en:"My favourite colour"},[
["我最喜欢的颜色是蓝色。","Meine Lieblingsfarbe ist Blau.","My favourite colour is blue."],
["蓝色的天空很漂亮。","Der blaue Himmel ist sehr schön.","The blue sky is very pretty."],
["红色很热闹，黄色很温暖。","Rot wirkt lebhaft, Gelb warm.","Red is lively, yellow is warm."],
["你喜欢什么颜色？","Welche Farbe magst du?","What colour do you like?"]],"classic"],
["a4","2","adult",{zh:"一杯茶的时间",de:"Die Zeit einer Tasse Tee",en:"The time of a cup of tea"},[
["下午三点，我常常泡一杯绿茶。","Um drei Uhr nachmittags koche ich oft einen grünen Tee.","At three in the afternoon I often brew a cup of green tea."],
["茶水慢慢变绿，香味也慢慢出来了。","Der Tee wird langsam grün, und sein Duft steigt allmählich auf.","The tea slowly turns green, and its aroma slowly rises."],
["我坐在窗边，什么也不想，只是喝茶。","Ich sitze am Fenster, denke an nichts und trinke einfach Tee.","I sit by the window, think of nothing, and just drink tea."],
["这一杯茶的时间，是我一天里最安静的时候。","Diese Zeit mit dem Tee ist der ruhigste Moment meines Tages.","This cup of tea is the quietest moment of my day."]],"classic"],
["a5","2","adult",{zh:"在书店里",de:"In der Buchhandlung",en:"In a bookshop"},[
["周六下午，我喜欢一个人去书店。","Am Samstagnachmittag gehe ich gern allein in eine Buchhandlung.","On Saturday afternoons I like to go to a bookshop alone."],
["书架一排排的，让人不知道先看哪一本。","Die Regale reihen sich aneinander, man weiß gar nicht, welches Buch man zuerst nehmen soll.","The shelves stand in rows, and you don't know which book to look at first."],
["我翻了一会儿，买了一本旧的诗集。","Ich blätterte eine Weile und kaufte einen alten Gedichtband.","I browsed for a while and bought an old poetry collection."],
["回家的路上，我一直在读其中的一首。","Auf dem Heimweg habe ich immer wieder eines der Gedichte gelesen.","On the way home I kept reading one of the poems."]],"classic"],
["a6","3","adult",{zh:"城市散步",de:"Spaziergang durch die Stadt",en:"A walk through the city"},[
["没有目的地的散步，可以让人重新认识一座城市。","Ein Spaziergang ohne Ziel kann helfen, eine Stadt neu kennenzulernen.","A walk without a destination can help you get to know a city again."],
["我沿着河边走，经过一家家小店和老房子。","Ich ging am Flussufer entlang, vorbei an kleinen Läden und alten Häusern.","I walked along the river, past small shops and old houses."],
["偶尔停下来，拍一张照片，或者吃一个热腾腾的包子。","Ab und zu bleibe ich stehen, mache ein Foto oder esse eine dampfende Teigtasche.","Now and then I stop to take a photo or eat a steaming bun."],
["这样的散步，比任何导航都更让人快乐。","So ein Spaziergang macht mehr Freude als jede Navigation.","Such a walk brings more joy than any navigation app."]],"classic"],
["a7","2","adult",{zh:"雨天的咖啡馆",de:"Ein Café an einem Regentag",en:"A café on a rainy day"},[
["下雨的午后，咖啡馆里很安静。","An einem regnerischen Nachmittag ist es im Café ganz still.","On a rainy afternoon the café is very quiet."],
["窗外的雨滴落在玻璃上，发出轻轻的声音。","Draußen fallen die Regentropfen auf die Scheibe und machen ein leises Geräusch.","Outside, raindrops fall on the glass with a soft sound."],
["我点了一杯拿铁，慢慢地看一本书。","Ich bestelle einen Latte und lese langsam in einem Buch.","I order a latte and slowly read a book."],
["雨停的时候，我才发现已经坐了两个小时。","Als der Regen aufhört, merke ich, dass ich schon zwei Stunden hier sitze.","When the rain stops, I realise I've been sitting here for two hours."]],"classic"],
["a8","3","adult",{zh:"学做一道菜",de:"Ein Gericht lernen",en:"Learning to cook a dish"},[
["我第一次学做番茄炒蛋，结果太咸了。","Zum ersten Mal habe ich Tomaten-Rührei gekocht, und es war viel zu salzig.","The first time I made tomato and egg stir-fry, it was far too salty."],
["后来我看了一个教学视频，才明白火候的重要。","Später habe ich ein Lehrvideo gesehen und verstanden, wie wichtig die richtige Hitze ist.","Later I watched a tutorial and understood how important the heat is."],
["做饭其实不难，关键是耐心。","Kochen ist eigentlich nicht schwer, entscheidend ist die Geduld.","Cooking isn't really difficult, the key is patience."],
["现在我每个周末都会做一道新菜。","Jetzt koche ich jedes Wochenende ein neues Gericht.","Now I cook a new dish every weekend."]],"classic"],
["y5","2","adult",{zh:"周末去健身房",de:"Am Wochenende ins Fitnessstudio",en:"Going to the gym at weekends"},[
["很多年轻人周末去健身房，不只是为了身材。","Viele junge Leute gehen am Wochenende ins Fitnessstudio, nicht nur für die Figur.","Many young people go to the gym at weekends, not just for their figure."],
["他们说，运动能让人更有精神。","Sie sagen, Sport macht munterer.","They say exercise makes you feel more energetic."],
["我每周去三次，每次只练半个小时。","Ich gehe dreimal pro Woche hin und trainiere jedes Mal nur eine halbe Stunde.","I go three times a week and train only half an hour each time."],
["重要的是坚持，而不是一下子练得太累。","Wichtig ist Beständigkeit, nicht, sich gleich total zu verausgaben.","What matters is consistency, not exhausting yourself all at once."]],"young"],
["y6","3","adult",{zh:"学会说不",de:"Nein sagen lernen",en:"Learning to say no"},[
["同事临时让我周末加班，我有点为难。","Eine Kollegin bittet mich kurzfristig, am Wochenende zu arbeiten, und ich bin hin- und hergerissen.","A colleague asks me at short notice to work at the weekend, and I feel torn."],
["以前我总是答应，然后很累。","Früher habe ich immer zugesagt und war dann total erschöpft.","I used to always say yes and then felt exhausted."],
["现在我学会了礼貌地拒绝。","Jetzt habe ich gelernt, höflich abzulehnen.","Now I've learned to decline politely."],
["我说：“这周我有安排，下次一定帮忙。”","Ich sagte: „Diese Woche habe ich schon etwas vor, nächstes Mal helfe ich gern.“","I said: \"I have plans this week, but I'll gladly help next time.\""]],"young"],
["y7","2","adult",{zh:"一个人吃饭",de:"Allein essen",en:"Eating alone"},[
["一个人吃饭，很多人以前觉得有点尴尬。","Früher fanden es viele etwas peinlich, allein essen zu gehen.","Many people used to find eating alone a bit awkward."],
["现在越来越多的年轻人喜欢一个人去餐厅。","Immer mehr junge Leute gehen gern allein ins Restaurant.","More and more young people like to go to restaurants on their own."],
["他们可以慢慢吃，也可以随时看手机。","Sie können in Ruhe essen und jederzeit aufs Handy schauen.","They can eat slowly and look at their phones whenever they like."],
["有时候，安静的一顿饭就是最好的放松。","Manchmal ist ein ruhiges Essen die beste Entspannung.","Sometimes a quiet meal is the best way to relax."]],"young"],
["y8","2","adult",{zh:"宠物陪伴",de:"Ein Haustier als Gefährte",en:"Pets as companions"},[
["在城市里生活，很多人养了一只小狗或小猫。","In der Stadt halten sich viele einen kleinen Hund oder eine Katze.","Living in the city, many people keep a little dog or cat."],
["下班回家，看到它们在门口等我，心情就好了。","Wenn ich nach Hause komme und sie an der Tür warten sehe, geht es mir gleich besser.","When I come home from work and see them waiting at the door, my mood lifts."],
["养宠物需要花时间，也需要花钱。","Ein Haustier kostet Zeit und Geld.","Pets need time and money."],
["但对很多人来说，这种陪伴很珍贵。","Doch für viele Menschen ist diese Gesellschaft sehr wertvoll.","But for many people, this companionship is precious."]],"young"],
["y9","3","adult",{zh:"租一辆单车",de:"Ein Leihrad mieten",en:"Renting a bike"},[
["在大城市里，骑单车是一种很方便的出行方式。","In Großstädten ist das Fahrrad ein sehr praktisches Verkehrsmittel.","In big cities, cycling is a very convenient way to get around."],
["很多人选择租一辆共享单车，用手机就能解锁。","Viele mieten sich ein Sharing-Rad und entsperren es einfach mit dem Handy.","Many people rent a shared bike and unlock it with their phone."],
["不过，停车的地方要注意，不要挡住人行道。","Man sollte aber auf den Abstellplatz achten und den Gehweg nicht blockieren.","However, pay attention to where you park and don't block the pavement."],
["骑车穿过城市，风吹在脸上，感觉非常自由。","Beim Radeln durch die Stadt weht der Wind ins Gesicht, und man fühlt sich richtig frei.","Cycling through the city with the wind on your face feels wonderfully free."]],"young"],
["n2","2","adult",{zh:"搭子文化",de:"Die Dazi-Kultur",en:"The \"buddy\" culture"},[
["现在流行“搭子”，就是一起做某件事的伙伴。","Heute ist das „Dazi“ beliebt, also ein Partner für eine gemeinsame Sache.","Now \"dazi\" is trendy, meaning a partner for doing something together."],
["有人是饭搭子，一起吃饭不用聊天。","Manche sind Essens-Dazi: man isst zusammen, ohne viel zu reden.","Some are meal buddies: you eat together without needing to chat."],
["有人是健身搭子，每周一起去运动。","Andere sind Fitness-Dazi und trainieren jede Woche zusammen.","Others are workout buddies and exercise together every week."],
["不用太亲密，却能互相陪伴，很多人都喜欢这种关系。","Man muss nicht eng befreundet sein und begleitet sich trotzdem. Viele mögen diese Art von Beziehung.","You don't need to be close, yet you keep each other company, and many people like this kind of relationship."]],"net"],
["n3","2","adult",{zh:"City Walk",de:"City Walk",en:"City Walk"},[
["最近，很多人喜欢“City Walk”，就是在城市里慢慢走。","In letzter Zeit mögen viele „City Walk“, also in der Stadt langsam herumzulaufen.","Lately many people enjoy \"City Walk\", which means slowly walking around a city."],
["他们不赶时间，看看街道，吃吃小吃。","Sie haben keine Eile, schauen sich Straßen an und probieren Snacks.","They take their time, look at the streets and try local snacks."],
["很多人会在朋友圈里分享路线。","Viele teilen ihre Routen im WeChat-Freundeskreis.","Many share their routes on WeChat Moments."],
["这种慢节奏的旅行，让人觉得特别放松。","Dieses langsame Reisen fühlt sich richtig entspannend an.","This slow way of travelling feels especially relaxing."]],"net"],
["n4","3","adult",{zh:"松弛感",de:"Gelassenheit",en:"Relaxed ease"},[
["年轻人常说，做人要有“松弛感”。","Junge Leute sagen oft, man solle eine „lockere Gelassenheit“ haben.","Young people often say you should have a sense of \"relaxed ease\"."],
["松弛感不是什么都不做，而是不被焦虑控制。","Lässigkeit heißt nicht, nichts zu tun, sondern sich von Sorgen nicht bestimmen zu lassen.","Relaxed ease doesn't mean doing nothing, but not being controlled by anxiety."],
["比如，工作完成以后，就放下手机好好休息。","Zum Beispiel: Wenn die Arbeit erledigt ist, legt man das Handy weg und ruht sich richtig aus.","For example, once work is done, you put down your phone and really rest."],
["生活有节奏，心情自然会好一些。","Wenn das Leben einen Rhythmus hat, wird die Stimmung ganz von selbst besser.","With a steady rhythm in life, your mood naturally improves."]],"net"],
["n5","2","adult",{zh:"多巴胺穿搭",de:"Dopamin-Outfits",en:"Dopamine dressing"},[
["最近流行“多巴胺穿搭”，颜色越鲜艳越好。","Derzeit ist „Dopamin-Outfit“ angesagt: je knalliger die Farben, desto besser.","Dopamine dressing is trending: the brighter the colours, the better."],
["黄色的外套，粉色的裙子，看起来很有活力。","Eine gelbe Jacke, ein rosa Rock, das wirkt richtig lebendig.","A yellow jacket and a pink skirt look full of energy."],
["我不常穿鲜艳的颜色，但是今天试了一下。","Ich trage selten knallige Farben, aber heute habe ich es ausprobiert.","I don't often wear bright colours, but today I tried it."],
["出门的时候，朋友说我看起来很开心。","Beim Rausgehen sagte meine Freundin, ich sähe so fröhlich aus.","When I went out, a friend said I looked very happy."]],"net"],
["n6","3","adult",{zh:"情绪价值",de:"Emotionaler Wert",en:"Emotional value"},[
["很多人说，身边要有能提供“情绪价值”的朋友。","Viele sagen, man sollte Freunde haben, die „emotionalen Wert“ geben.","Many people say you should have friends who provide \"emotional value\"."],
["也就是说，对方听你讲话，理解你，让你觉得被照顾。","Das heißt, der andere hört zu, versteht dich und lässt dich spüren, dass man für dich sorgt.","That means the other person listens, understands you, and makes you feel cared for."],
["一句“辛苦了”，有时候比很多道理更有用。","Ein „Du hast dich angestrengt“ hilft manchmal mehr als viele kluge Worte.","A simple \"you worked hard\" can sometimes help more than many wise words."],
["我们也可以试着，多给身边的人一点温暖。","Wir können auch versuchen, den Menschen um uns herum etwas mehr Wärme zu schenken.","We can also try to give the people around us a little more warmth."]],"net"]
];
module.exports={LEX3,ARTICLES3};
