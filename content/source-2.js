// Second content batch for 字里: graded texts by topic (classic / young / net) and tagged lexicon.
// Lexicon line: 词|de|en|tag  (tag: net = 网络用语, young = 年轻人, default core = 基础)
const LEX2=`
周末|Wochenende|weekend|young
带|mitnehmen; führen|take along
自行车|Fahrrad|bicycle
骑|fahren (Rad)|ride
冰淇淋|Eis|ice cream
玩|spielen|play
累|müde|tired
觉得|finden; meinen|think; feel
快乐|fröhlich|happy
跑步|joggen|run
商量|besprechen|discuss
计划|Plan|plan
爬山|wandern|hike
睡懒觉|lange schlafen|sleep in
决定|entscheiden|decide
逛|bummeln|stroll around
市场|Markt|market
看电影|ins Kino gehen|watch a movie
白|vergeblich|in vain
地铁|U-Bahn|subway
公司|Firma|company
开会|eine Besprechung haben|have a meeting
两个|zwei|two
回复|antworten|reply
邮件|E-Mail|email
同事|Kollege/Kollegin|colleague
午饭|Mittagessen|lunch
聊|sich unterhalten|chat
最近|in letzter Zeit|recently
悄悄|heimlich|secretly
看看|mal schauen|have a look
手机|Handy|phone
下班|Feierabend machen|finish work
以后|danach|afterwards
只|nur|only
想|wollen|want
沙发|Sofa|sofa
休息|sich ausruhen|rest
现在|jetzt|now
社交媒体|soziale Medien|social media
分享|teilen|share
照片|Foto|photo
常常|oft|often
停|anhalten|stop
看很久|lange anschauen|look at for a long time
不过|aber; allerdings|however
只能|nur können|can only
一面|Seite|side
所以|deshalb|therefore
关心|sich kümmern um|care about
真实|echt|real
追求|streben nach|pursue
点赞|liken|like (a post)
欧洲|Europa|Europe
找|suchen|look for
房子|Wohnung|apartment
并|überhaupt|at all
容易|einfach|easy
房租|Miete|rent
通常|normalerweise|usually
贵|teuer|expensive
网上|online|online
搜索|suchen|search
合适|passend|suitable
房源|Wohnungsangebot|listing
看房|Wohnung besichtigen|view an apartment
签合同|Vertrag unterschreiben|sign a contract
之前|vor|before
仔细|sorgfältig|carefully
清楚|klar|clear
条款|Klausel|clause
如果|wenn|if
问题|Problem; Frage|problem; question
房东|Vermieter/in|landlord
最好|am besten|best
等到|warten bis|wait until
搬|umziehen|move (house)
后悔|bereuen|regret
破防|emotional erschüttert sein|to be emotionally shaken|net
绝绝子|super genial (Slang)|absolutely amazing (slang)|net
内卷|Hyperkonkurrenz|involution: cutthroat competition|net
躺平|aussteigen aus dem Wettbewerb|"lying flat": opting out of the rat race|net
打工人|Lohnarbeiter (ironisch)|wage slave (ironic)|net
摸鱼|blaumachen; trödeln|slacking off at work|net
种草|Lust machen auf etwas|to hype something up|net
朋友圈|WeChat-Freundeskreis|WeChat Moments|net
奶茶|Bubble Tea|bubble tea
太|zu; so|too; so
好喝|lecker (Getränk)|tasty (drink)
激烈|heftig|fierce
努力|sich anstrengen|hard-working
咖啡|Kaffee|coffee
难|schwierig|difficult
真的|wirklich|really
这家|dieses|this
店|Laden|shop
好看|schön|nice to look at
出门|ausgehen|go out
在家|zu Hause|at home
一款|ein (Produkt)|a (product)
都|alle; immer|all; both
周一|Montag|Monday
上班|zur Arbeit gehen|go to work
真|wirklich; echt|really; real
周|Woche|week
五|fünf|five
们|Pluralsuffix|plural suffix
后|nach; hinter|after; behind
六|sechs|six
日|Tag|day
再|wieder; dann|again; then
这|dies|this
样|Art; Weise|kind; way
才|erst|only then
过|verbringen|spend (time)
八|acht|eight
点|Uhr|o'clock
坐|sitzen; fahren|sit; ride
非常|sehr|very
上|auf; an|on; up
午|Mittag|noon
上午|Vormittag|morning
开|abhalten; eröffnen|hold; open
还|noch|still
工作|Arbeit|work; job
偶尔|gelegentlich|occasionally
躺|liegen|lie down
轻松|entspannt|relaxed
自己|selbst|oneself
生活|Leben|life
张|Zählwort (flach)|counter for flat things
能|können|can
来|kommen|come
到|bis; ankommen|reach; arrive
别人|andere Menschen|other people
应该|sollten|should
而且|und außerdem|and moreover
定|festlegen|set; fix
问题|Problem; Frage|problem; question
进|hinein|enter
考试|Prüfung|exam
竞争|Konkurrenz|competition
款|Zählwort (Produkt)|counter for products
马上|sofort|immediately
问|fragen|ask
而|und; aber|and; but (verbindet Gegensätze)
轻|leicht|light
`;
const ARTICLES2=[
["k5","2","kids",{zh:"周末去公园",de:"Ein Ausflug in den Park",en:"A trip to the park"},[
["周末，爸爸带我去公园。","Am Wochenende nimmt Papa mich in den Park mit.","On the weekend, Dad takes me to the park."],
["公园里有很多人在跑步。","Im Park joggen viele Leute.","Many people are jogging in the park."],
["我和弟弟一起骑自行车。","Mein jüngerer Bruder und ich fahren zusammen Fahrrad.","My younger brother and I ride bicycles together."],
["玩累了，我们就吃冰淇淋。","Wenn wir vom Spielen müde sind, essen wir Eis.","When we are tired from playing, we eat ice cream."],
["我觉得周末真快乐！","Ich finde, das Wochenende ist wirklich schön!","I think the weekend is really happy!"]],"classic"],
["y1","2","adult",{zh:"周末的计划",de:"Pläne fürs Wochenende",en:"Weekend plans"},[
["周五晚上，我和朋友们一起商量周末的计划。","Am Freitagabend besprechen meine Freunde und ich die Pläne fürs Wochenende.","On Friday evening, my friends and I discuss our plans for the weekend."],
["有人想去爬山，有人想在家睡懒觉。","Manche wollen wandern gehen, andere lieber zu Hause lange schlafen.","Some want to go hiking, others want to sleep in at home."],
["最后我们决定周六去逛市场，周日再去看电影。","Am Ende beschließen wir, am Samstag über den Markt zu bummeln und am Sonntag ins Kino zu gehen.","In the end we decide to stroll through the market on Saturday and watch a movie on Sunday."],
["大家都说，这样的周末才不会白过。","Alle sagen, so ein Wochenende ist nicht vergeudet.","Everyone says that this way the weekend won't be wasted."]],"young"],
["y2","2","adult",{zh:"打工人的一天",de:"Ein Tag als Angestellte",en:"A day in the life of an office worker"},[
["早上八点，我坐地铁去公司，人非常多。","Um acht Uhr morgens fahre ich mit der U-Bahn ins Büro, und es ist sehr voll.","At eight in the morning I take the subway to the office, and it is very crowded."],
["上午开了两个会，还要回复很多邮件。","Am Vormittag habe ich zwei Besprechungen und muss viele E-Mails beantworten.","In the morning I have two meetings and still have many emails to answer."],
["中午我和同事一起吃午饭，聊聊最近的工作。","Mittags esse ich mit einer Kollegin zu Mittag und wir reden über die Arbeit.","At noon I have lunch with a colleague and we chat about recent work."],
["下午有点累，我偶尔也会悄悄摸鱼看看手机。","Nachmittags bin ich etwas müde, da schaue ich manchmal heimlich auf mein Handy statt zu arbeiten.","In the afternoon I'm a bit tired, so I sometimes secretly slack off and look at my phone."],
["下班以后，我只想躺在沙发上休息。","Nach Feierabend möchte ich nur noch auf dem Sofa liegen und mich ausruhen.","After work, all I want is to lie on the sofa and rest."]],"young"],
["y3","3","adult",{zh:"社交媒体上的生活",de:"Leben in den sozialen Medien",en:"Life on social media"},[
["现在很多年轻人喜欢在社交媒体上分享自己的生活。","Heute teilen viele junge Leute gern ihr Leben in den sozialen Medien.","Nowadays many young people like to share their lives on social media."],
["一张好看的照片，常常能让人停下来看很久。","Ein schönes Foto bringt die Leute oft dazu, lange hinzuschauen.","A beautiful photo often makes people stop and look at it for a long time."],
["不过，有时候大家只能看到别人最好的一面。","Allerdings sieht man oft nur die beste Seite der anderen.","However, sometimes we can only see the best side of other people."],
["所以，我们更应该关心真实的生活，而不是只追求点赞。","Deshalb sollten wir uns mehr um das echte Leben kümmern, statt nur nach Likes zu streben.","Therefore we should care more about real life instead of only chasing likes."]],"young"],
["y4","3","adult",{zh:"在欧洲找房子",de:"Eine Wohnung in Europa finden",en:"Finding an apartment in Europe"},[
["在大城市找房子并不容易，房租通常很贵。","In Großstädten eine Wohnung zu finden ist gar nicht einfach, und die Miete ist meist teuer.","Finding an apartment in a big city is not easy at all, and the rent is usually expensive."],
["很多人会在网上搜索合适的房源，然后去看房。","Viele suchen online nach passenden Wohnungsangeboten und besichtigen sie dann.","Many people search online for suitable listings and then go and view them."],
["签合同之前，一定要仔细看清楚条款。","Bevor man den Vertrag unterschreibt, sollte man die Klauseln genau durchlesen.","Before signing a contract, you must read the clauses carefully."],
["如果有问题，最好先问房东，不要等到搬进去以后再后悔。","Wenn etwas unklar ist, fragt man am besten vorher den Vermieter, statt es nach dem Einzug zu bereuen.","If there are any problems, it is best to ask the landlord first, rather than regret it after moving in."]],"young"],
["n1","2","adult",{zh:"网络用语",de:"Internet-Slang",en:"Internet slang"},[
["今天的考试太难了，我真的破防了。","Die Prüfung war heute so schwer, ich bin echt fertig mit den Nerven.","Today's exam was so hard, I'm really shaken."],
["这家奶茶店太好喝了，绝绝子！","Dieser Bubble-Tea-Laden ist so lecker, einfach der Hammer!","This bubble tea shop is so tasty, absolutely amazing!"],
["大家都很努力，竞争太激烈，真是内卷。","Alle strengen sich an und der Wettbewerb ist so hart, das ist echt Hyperkonkurrenz.","Everyone works hard and the competition is so fierce, it's really involution."],
["周末我不想出门，就在家躺平。","Am Wochenende habe ich keine Lust rauszugehen, ich bleibe einfach zu Hause und lasse es ruhen.","On the weekend I don't want to go out, I just stay home and opt out."],
["看到这款咖啡，我马上就想去种草。","Als ich diesen Kaffee sah, wollte ich ihn sofort auch unbedingt probieren.","When I saw this coffee, I immediately wanted to hype it up."],
["周一又要上班，我们都是打工人。","Montag geht die Arbeit wieder los, wir sind alle Lohnarbeiter.","Monday means work again, we are all wage slaves."]],"net"]
];
module.exports={LEX2,ARTICLES2};
