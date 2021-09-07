$(".hsiantshau,.htshiantshau").hover(
  function(){
    $(".hsiantshau").css("transform","scale(1.15)");
    $(".htshiantshau").css("transform","scale(1.15)");
},function(){
    $(".hsiantshau").css("transform","scale(1)");
    $(".htshiantshau").css("transform","scale(1)");
})
$(".hhantsiinn,.hhantsuinn").hover(
  function(){
    $(".hhantsiinn").css("transform","scale(1.15)");
    $(".hhantsuinn").css("transform","scale(1.15)");
},function(){
    $(".hhantsiinn").css("transform","scale(1)");
    $(".hhantsuinn").css("transform","scale(1)");
})
$(".hhingjin,.hhinglin").hover(
  function(){
    $(".hhingjin").css("transform","scale(1.15)");
    $(".hhinglin").css("transform","scale(1.15)");
},function(){
    $(".hhingjin").css("transform","scale(1)");
    $(".hhinglin").css("transform","scale(1)");
})
var s = skrollr.init();
document.body.id = "skrollr-body";


var font=["源石黑體","源泉圓體","源流明體","源雲明體","全字庫楷書"]
var fontnum=0
var weightdata=["Light","Regular","Medium","Bold","Heavy"]
var fontweight=[[1,1,-1,1,1],[1,1,1,-1,-1],[-1,1,-1,1,1],[1,-1,-1,-1,-1],[-1,1,-1,-1,-1]]
var weightnum=1
var fontinfo=[['<h3 class="yellowfont">源石黑體</h3><p>「源石黑體」是基於思源黑體的開放原始碼漢字字型。採用接近傳統印刷體習慣的 KR 版本的字符為主，排列感整齊。數位時代流行的黑體多數都是強調 通用設計、粗細一致而銳利的風格，而源石黑體則透過喇叭口的造型，嘗試重現復古的黑體風格，有溫暖的氣息。</p>','<h3 class="yellowfont">源泉圓體</h3><p>「源泉圓體」是基於思源黑體的開放原始碼漢字字型。源泉圓體不只把筆畫全改圓，也將黑體的腳盡可能拔除，並加上封閉區域的內圓角處理，盡量逼近真實圓體的樣貌。</p>','<h3 class="yellowfont">源流明體</h3><p>「源流明體」是基於思源宋體的開放原始碼漢字字型。採用接近傳統印刷體習慣的 KR 版本的字符為主，排列感整齊。漢字寬度稍微壓縮，顯得比原始的思源宋體要稍微瘦長。 並且在橫筆的起筆與豎筆的起筆、收筆處加上粗細變化，重現彷彿鉛字的壓印感，具文學感與人文氣息。</p>','<h3 class="yellowfont">源雲明體</h3><p>「源雲明體」將具人文氣息的「源流明體」加工，於筆劃交接處做了朦朧處理，模擬墨暈或是及照相排印稍微過曝的效果，增加復古氣息及韻味。</p>','<h3 class="yellowfont">全字庫楷書</h3><p>「全字庫楷書」是國發會所提供的開源楷書字型，字體風格大致上與標楷體雷同，是一套收錄了包含許多罕用戶政用字等多達十一萬餘漢字的字型。筆畫書寫方式符合教育部標準，可以做為筆畫教學之參考。</p>'],['<h3 class="yellowfont">源石黑體</h3><p>「源石黑體 [Guân-sik Hik-thé] 」是自思源黑體所改 ê 開源漢字字型。內底以較倚傳統印刷習慣 ê KR 版本字符為主，鋪排起來較整齊。數位時代流行 ê 黑體大部份攏強調通用設計、骨格一致閣俐落 ê 風格，毋過源石黑體透過喇叭口 ê 造型，予較古早 ê 黑體風格重頭生，表現溫暖 ê 性格。</p>','<h3 class="yellowfont">源泉圓體</h3><p>「源泉圓體[Guân-tsuân Înn-thé]」是自思源黑體所改 ê 開源漢字字型。源泉圓體毋但共筆畫攏改做圓圓 ê，也共黑體 ê 跤盡量共抹掉，閣有共封密區域做內 ah-luh （アル 『圓角』）處理 ，倚近圓體 ê 模樣。</p>','<h3 class="yellowfont">源流明體</h3><p>「源流明體[Guân-liû Bîng-thé]」是自思源宋體所改 ê 開源漢字字型。內底以較倚傳統印刷習慣 ê KR 版本字符為主，鋪排起來較整齊。漢字有改較狹咧，字身比思源宋體閣較躼。而且佇橫筆佮直筆 ê 頭尾加上變化，重現鉛字印刷 ê 性格，較有文學感佮人文氣質。</p>','<h3 class="yellowfont">源雲明體</h3><p>「源雲明體[Guân-hûn Bîng-thé]」將人文氣質 ê 「源流明體」加工，佇筆畫相拄 ê 部份改較霧霧，模仿墨暈抑是翕相排印曝光過度 ê 效果，加添復古氣質佮韻味。</p>','<h3 class="yellowfont">全字庫楷書</h3><p>「全字庫楷書[Tsuân-jî-khòo khái-su]」是國發會所提供的開源楷書字型，字體風格佮標楷體相𫝛，包含足濟 ê 戶政用字等等攏總十一萬外漢字 ê 字型。筆畫 ê 書寫方式符合教育部標準，通做為筆畫教學 ê 參考。</p>']]
var phoneticdata=["台羅","白話字","方音","假名","台羅+方音","台羅+假名","白話字 + 方音","白話字 + 假名"]
var phoneticinfo=[["<h3 class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場所通行的羅馬字台語文系統。台羅由教育部整合自台灣語言音標方案（TLPA）與白話字（POJ）而來，教育部官方出版品、字典與公視台語台的各種節目皆是使用台羅系統。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是在台灣有悠久歷史的羅馬字台語文系統，留有非常多文獻，最初由傳教士所創並通行在教會，而後也流傳至民間，至今民間仍有許多白話字的愛用者推行與使用。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣第一份大眾媒體，即是以白話字書寫而成。</p>","<h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」由台灣省國語推行委員會方言組的朱兆祥教授設計，以注音符號為基礎，增補華語沒有的發音符號而成。台灣大學中文系退休教授吳守禮所著的《國臺對照活用辭典》及鄉土文學作家楊青矗所著的《台華雙語辭典》皆採方音符號。</p>","<h3 class='purplefont'>臺灣語假名</h3><p>「台灣語假名」為日治時期官方單位以日語假名拼寫台語所設計的標音系統，《台日大辭典》、《台灣俚俗諺覽》等日治時期重要台語研究文獻皆使用此套系統。</p>","<h3  class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場所通行的羅馬字台語文系統。台羅由教育部整合自台灣語言音標方案（TLPA）與白話字（POJ）而來，教育部官方出版品、字典與公視台語台的各種節目皆是使用台羅系統。</p><h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」由台灣省國語推行委員會方言組的朱兆祥教授設計，以注音符號為基礎，增補華語沒有的發音符號而成。台灣大學中文系退休教授吳守禮所著的《國臺對照活用辭典》及鄉土文學作家楊青矗所著的《台華雙語辭典》皆採方音符號。</p>","<h3 class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場所通行的羅馬字台語文系統。台羅由教育部整合自台灣語言音標方案（TLPA）與白話字（POJ）而來，教育部官方出版品、字典與公視台語台的各種節目皆是使用台羅系統。</p><h3 class='purplefont'>臺灣語假名</h3><p>「台灣語假名」為日治時期官方單位以日語假名拼寫台語所設計的標音系統，《台日大辭典》、《台灣俚俗諺覽》等日治時期重要台語研究文獻皆使用此套系統。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是在台灣有悠久歷史的羅馬字台語文系統，留有非常多文獻，最初由傳教士所創並通行在教會，而後也流傳至民間，至今民間仍有許多白話字的愛用者推行與使用。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣第一份大眾媒體，即是以白話字書寫而成。</p><h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」由台灣省國語推行委員會方言組的朱兆祥教授設計，以注音符號為基礎，增補華語沒有的發音符號而成。台灣大學中文系退休教授吳守禮所著的《國臺對照活用辭典》及鄉土文學作家楊青矗所著的《台華雙語辭典》皆採方音符號。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是在台灣有悠久歷史的羅馬字台語文系統，留有非常多文獻，最初由傳教士所創並通行在教會，而後也流傳至民間，至今民間仍有許多白話字的愛用者推行與使用。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣第一份大眾媒體，即是以白話字書寫而成。</p><h3 class='purplefont'>臺灣語假名</h3><p>「台灣語假名」為日治時期官方單位以日語假名拼寫台語所設計的標音系統，《台日大辭典》、《台灣俚俗諺覽》等日治時期重要台語研究文獻皆使用此套系統。</p>"],["<h3 class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場上主要 ê 羅馬字台語文系統。台羅是教育部自台灣語言音標方案（TLPA）與白話字（POJ）所整合 ê，教育部官方出版品、字典佮公視台語台 ê 各種節目攏是使用台羅系統。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是佇台灣有久長歷史 ê 羅馬字台語文系統，歷史上有濟濟 ê 文獻，寢頭是傳教士所創立，佇教會傳播佮使用，後來閣流傳至民間，到今民間猶有濟濟白話字的使用者咧推廣白話字 ê 書寫。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣史上頭一个大眾媒體，嘛是用白話字寫 ê。</p>","<h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」是台灣省國語推行委員會方言組 ê 朱兆祥教授所設計，以注音符號為基礎，閣加添華語無 ê 發音符號。台灣大學中文系退休教授吳守禮所寫 ê 《國臺對照活用辭典》佮鄉土文學作家楊青矗所寫 ê 《台華雙語辭典》攏採用方音符號。</p>","<h3 class='purplefont'>臺灣語假名</h3><p>「台灣語khá-nah」是一套日治時期官方單位用日語khá-nah來拼寫台語 ê 標音系統，《台日大辭典》、《台灣俚俗諺覽》等等日本時代重要台語研究文獻攏是用這套系統。</p>","<h3  class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場上主要 ê 羅馬字台語文系統。台羅是教育部自台灣語言音標方案（TLPA）與白話字（POJ）所整合 ê，教育部官方出版品、字典佮公視台語台 ê 各種節目攏是使用台羅系統。</p><h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」是台灣省國語推行委員會方言組 ê 朱兆祥教授所設計，以注音符號為基礎，閣加添華語無 ê 發音符號。台灣大學中文系退休教授吳守禮所寫 ê 《國臺對照活用辭典》佮鄉土文學作家楊青矗所寫 ê 《台華雙語辭典》攏採用方音符號。</p>","<h3 class='purplefont'>臺灣閩南語羅馬字拼音方案</h3><p>「台灣閩南語羅馬字拼音方案」簡稱「台羅」，是目前教育現場上主要 ê 羅馬字台語文系統。台羅是教育部自台灣語言音標方案（TLPA）與白話字（POJ）所整合 ê，教育部官方出版品、字典佮公視台語台 ê 各種節目攏是使用台羅系統。</p><h3 class='purplefont'>臺灣語假名</h3><p>「台灣語khá-nah」是一套日治時期官方單位用日語khá-nah來拼寫台語 ê 標音系統，《台日大辭典》、《台灣俚俗諺覽》等等日本時代重要台語研究文獻攏是用這套系統。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是佇台灣有久長歷史 ê 羅馬字台語文系統，歷史上有濟濟 ê 文獻，寢頭是傳教士所創立，佇教會傳播佮使用，後來閣流傳至民間，到今民間猶有濟濟白話字的使用者咧推廣白話字 ê 書寫。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣史上頭一个大眾媒體，嘛是用白話字寫 ê。</p><h3 class='purplefont'>臺灣方音符號</h3><p>「台灣方音符號」是台灣省國語推行委員會方言組 ê 朱兆祥教授所設計，以注音符號為基礎，閣加添華語無 ê 發音符號。台灣大學中文系退休教授吳守禮所寫 ê 《國臺對照活用辭典》佮鄉土文學作家楊青矗所寫 ê 《台華雙語辭典》攏採用方音符號。</p>","<h3 class='purplefont'>白話字</h3><p>「白話字（Pe̍h-ōe-jī）」是佇台灣有久長歷史 ê 羅馬字台語文系統，歷史上有濟濟 ê 文獻，寢頭是傳教士所創立，佇教會傳播佮使用，後來閣流傳至民間，到今民間猶有濟濟白話字的使用者咧推廣白話字 ê 書寫。《台灣府城教會報》（Tâi-oân-hú-siâⁿ Kàu-hōe-pò）是台灣史上頭一个大眾媒體，嘛是用白話字寫 ê。</p><h3 class='purplefont'>臺灣語假名</h3><p>「台灣語khá-nah」是一套日治時期官方單位用日語khá-nah來拼寫台語 ê 標音系統，《台日大辭典》、《台灣俚俗諺覽》等等日本時代重要台語研究文獻攏是用這套系統。</p>"]]
var phoneticimg=['https://i.imgur.com/Pwf2cdQ.png','https://i.imgur.com/Jwfotxf.png','https://i.imgur.com/0VduCZw.png','https://i.imgur.com/U8t0MPP.png','https://i.imgur.com/YQZZqF7.png','https://i.imgur.com/OAG8pmL.png','https://i.imgur.com/tA9prIy.png','https://i.imgur.com/d6ByDJ6.png']
var langnum=0 //0華文 1KIP漢羅 2白話字
var monofontimg=[['https://i.imgur.com/tC8zZEB.png','https://i.imgur.com/V6ubfSJ.png',0,'https://i.imgur.com/1ybmM9G.png','https://i.imgur.com/gben6cA.png'],['https://i.imgur.com/AeSTnzm.png','https://i.imgur.com/CAMogPD.png','https://i.imgur.com/J2b95Iq.png',0,0],[0,'https://i.imgur.com/1zaV7jZ.png',0,'https://i.imgur.com/mfPtOtA.png','https://i.imgur.com/vOlpd6J.png'],['https://i.imgur.com/I3CeWLK.png'],[0,'https://i.imgur.com/8COXxoY.png',0,0,0]]
var pojfontimg=[["https://i.imgur.com/70Kunnx.png","https://i.imgur.com/q0rRXlx.png",-1,"https://i.imgur.com/ZHrfecZ.png","https://i.imgur.com/QAHpzmg.png"],["https://i.imgur.com/lIG1021.png","https://i.imgur.com/hRJVMkb.png","https://i.imgur.com/ogqBKng.png",-1,-1],[-1,"https://i.imgur.com/zqAtmxs.png",-1,"https://i.imgur.com/ZWT8iNo.png","https://i.imgur.com/xFJLhM9.png"],["https://i.imgur.com/Zivxamq.png",-1,-1,-1,-1],[-1,"https://i.imgur.com/02c6LTG.png",-1,-1,-1]]
var tlfontimg=[["https://i.imgur.com/sLaBmRe.png","https://i.imgur.com/vuPbdm6.png",-1,"https://i.imgur.com/tp5Iouf.png","https://i.imgur.com/6Qmi7N9.png"],["https://i.imgur.com/O1VzDTX.png","https://i.imgur.com/C7G7rnV.png","https://i.imgur.com/pUUKj1r.png",-1,-1],[-1,"https://i.imgur.com/xzqk3TU.png",-1,"https://i.imgur.com/UJXGF6o.png","https://i.imgur.com/SMmKx63.png"],["https://i.imgur.com/hKdwr9q.png",-1,-1,-1,-1],[-1,"https://i.imgur.com/ackB4kg.png",-1,-1,-1]]
//phonetic[fontnum][weightnum][phoneticnum] 有沒有這套標音
phonetic[0]=[[0,1,2,3,-1,-1,-1,-1],[0,1,2,3,4,5,6,7],0,[0,1,2,3,4,-1,6,-1],[0,1,2,3,-1,-1,-1,-1]]//源石黑體LRBH的標音表
phonetic[1]=[[0,1,2,3,-1,-1,-1,-1],[0,1,2,3,4,5,6,7],[0,1,2,3,4,-1,6,-1],0,0]
phonetic[2]=[0,[0,1,2,3,4,5,6,7],0,[0,1,2,3,4,-1,6,-1],[0,1,2,3,-1,-1,-1,-1]]
phonetic[3]=[[0,1,2,3,4,5,6,7],0,0,0,0]
phonetic[4]=[0,[0,1,2,3,4,5,6,7],0,0,0]
var phoneticnum=0

//重製漢字圖片
function fontimgg(a){
  if (a==0) {
    $(".hj").attr('src',tlfontimg[fontnum][weightnum]);
  }else if (a==1) {
    $(".hj").attr('src',pojfontimg[fontnum][weightnum]);
  }else {
    $(".hj").attr('src',monofontimg[fontnum][weightnum]);
  }
  return 0;
}

//更新標音顯示&標音資訊&圖片標音
function phonetic(){
  var pinfo=phonetic[fontnum][weightnum][phoneticnum]
  $(".phonetic").text(phoneticdata[pinfo]);
  $(".phoneticinfo").html(phoneticinfo[langnum][pinfo]);
  $(".pi").attr('src',phoneticimg[pinfo]);
  return 0;
}

//更新字體顯示&字體資訊
function fonts(){
  $(".font").text(font[fontnum]);
  $(".fontinfo").html(fontinfo[langnum][fontnum]);
  return 0;
}
function fw(a){
  if(a==3||a==4){
    $(".cs").addClass("notallowed");
  }else{
    $(".cs").removeClass("notallowed");
  }
  
  return 0;
}

$(".zh").click(
  function(){
    if(langnum!=0){
      langnum=0;
      $(".zh").addClass("current");
      $(".kip").removeClass("current");
      $(".t1").html("提供 5 種字體風格、 8 種標音組合與不同粗細<br>共 72 套字型的台文標音字體大家族");
      $(".t2_1").text("下滑看更多介紹，右上角可以切換語言 ٩( 'ω' )و");
      $(".t2_2").html("目前網頁介紹尚無支援手機板<br>請用電腦瀏覽完整內容 ┗( T﹏T )┛");
      $(".t3_1").text("點擊右方選單，看看有哪些字型組合 (๑•̀ω•́)ノ");
      $(".t3_2").text("揤選單，看覓有偌濟種字型組合 (๑•̀ω•́)ノ");
      $(".t3_3").html("註：全部都做的話實在太多了，因此選單無法出現就代表<b>沒有</b>此款字型搭配，敬請見諒 ಥ_ಥ");
      $(".t4").text("↓當前字體標音組合的介紹 ٩(ˊᗜˋ*)و");
      $(".t5").text("多種搭配，一次滿足！");
      $(".t6").text("像礤冰料一樣繽紛多樣 (✪ω✪)");
      $(".t7").text("破音字、文白異讀及腔口差皆可支援 ヾ(´︶`*)ﾉ♬");
      $(".t8").html('<p>「字咍台語字型」支援《教育部台灣閩南語常用詞辭典》大部份讀音。破音字、文白異讀與腔口差（方音差）也都涵蓋其中，幾乎能完整支援各項用途。</p><p>透過<a href="https://zh.wikipedia.org/wiki/%E7%95%B0%E9%AB%94%E5%AD%97%E9%81%B8%E6%93%87%E5%99%A8" target="view_window"> IVS 技術</a>與「讀音選擇工具」，不用再像以往使用漢字標音字型時需要安裝好幾套破音字型檔案，切換字體風格也更加方便。讀音選擇工具還有附有《教育部台灣閩南語常用詞辭典》詞條資料，可提供及時參考。</p><p>但因為四種標音系統的轉換對應上較為複雜，目前暫時不支援含 er, ir, ee, ek, eng 韻母的讀音以及老泉腔第六調。此外，因教典的詞彙與讀音收錄以生活用詞為主，不包含許多漢字文讀音，故目前較不適合用來標註唐詩。較詳細的讀音收錄問題，歡迎各位有志之士至 Github 的<a href="https://github.com/ButTaiwan/taigivs/tree/main/readings" target="view_window">此頁</a>查看說明，未來版本或許可以加入更多讀音來源，並支援地方腔特殊韻母。</p>');
      $(".t9").text("漢羅混寫也OK！");
      $(".t10").text("字咍字型支援台語羅馬字，可滿足漢羅混寫需求OK (◍•ᴗ•◍)ゝ");
      $(".t11").text("字咍台語字型系列有補足思源與全字庫楷書所缺少的羅馬字聲調調符，支援漢羅混寫哦！");
      $(".t12").text("漢羅混寫（漢字與羅馬字並行寫作）是目前台語文最盛行的書寫方式，許多無法用漢字表示的外來語、合音字、虛詞…等，在書寫時就會以羅馬字表示；也有派別主張非本字的替代用字都要以羅馬字書寫，不同的標準各有主張。");
      $(".t13").text("開源、免費、可商用與改作");
      $(".t14").text("使用字型是完全免費的唷 ᕕ( ᐛ )ᕗ 你可以用來製作...");
      $(".t15").html("字咍台語字型的楷體漢字遵照 CC-by 4.0 授權釋出，明體、黑體、圓體漢字則依照 SIL Open Font License 釋出，這代表著如果想<b>改作字型</b>，會需依據各自的授權標準規定標註並發布。至於<b>使用字型</b>則是完全免費，也不須標註字型來源，印刷、社群圖文、影片、網頁、商業設計皆可！");
      $(".t16").text("詳細授權規範參考：");
      $(".t17").html('<div class="credit"><div class="description"><h1>關於這些字型</h1><p>字咍台語字型是 But Ko 繼「字嗨注音體」的續作，將 IVS 字型技術規格用在台語漢字標音用途。補足台灣本土語言基礎教育現場所缺乏的標音字型，並且進一步做到了不同標音系統的對應轉換，為台語漢字的教學增添新的工具。</p></div><div class="whiteline"></div><div class="author"><h2>作者｜柯志杰 But Ko</h2><p>「字嗨」社團發起人，提供字型圈自由討論的場地，現已成為台灣最大的字型交流社群。於 justfont blog 撰寫許多字體相關知識文章，著有《字型散步 Next 》。</p><p>本業為工程師，也同時熱衷於探尋中、日文各類印刷字體的由來與差異，亦涉入漢字編碼、字型技術，發表有 Unicode 補完計畫、源樣系列思源改作字型、字嗨注音體及其讀音選擇工具。</p></div><div class="helper"><h2>網頁設計｜陳建中 Tân Kiàn-tiong</h2><p>台科大設計系，台語學習資歷二年。撰有〈台語文字的字型發展現況〉上下兩篇，探討台語文在電腦環境中的顯示問題。</p><h2>網頁協力｜王皓梅</h2><p>台科大設計系商設組畢，現於 justfont 擔任實習生。</p></div></div>');
      fonts();
      phonetic();
    }
  }
);
$(".kip").click(
  function(){
    if(langnum!=1){
      langnum=1;
      $(".zh").removeClass("current");
      $(".kip").addClass("current");
      $(".t1").html("提供 5 種風格、8 種標音組合佮無仝字重<br>攏總 72 套字型 ê 台文標音字體大家族");
      $(".t2_1").text("下跤有字型特色紹介，正手爿頂懸通切換語言 ٩( 'ω' )و");
      $(".t2_2").html("目前網頁介紹猶無支援手機仔<br>請用電腦閱讀完整內容 ┗( T﹏T )┛");
      $(".t3_1").text("揤正手爿 ê 選單，看覓有偌濟種字型組合 (๑•̀ω•́)ノ");
      $(".t3_2").text("揤選單，看覓有偌濟種字型組合 (๑•̀ω•́)ノ");
      $(".t3_3").html("註：全部攏做的話實在傷濟矣，選單若無法出現就代表<b>無</b>這款字型組合，歹勢 ಥ_ಥ");
      $(".t4").text("↓目前字體佮標音組合 ê 介紹 ٩(ˊᗜˋ*)و");
      $(".t5").text("濟濟組合在你揀！");
      $(".t6").text("像礤冰料偌爾仔豐沛 (✪ω✪)");
      $(".t7").text("勾破、文白異讀、方音差攏會用得 ヾ(´︶`*)ﾉ♬");
      $(".t8").html('<p>「字咍台語字型」支援《教育部台灣閩南語常用詞辭典》大部份讀音。勾破、文白異讀佮腔口差攏會用得，通支援大部份 ê 情境佮需求。</p><p>透過<a href="https://zh.wikipedia.org/wiki/%E7%95%B0%E9%AB%94%E5%AD%97%E9%81%B8%E6%93%87%E5%99%A8" target="view_window"> IVS 技術 </a>佮「讀音選擇工具」，毋免閣像往過 ê 漢字標音字型安裝偌爾仔濟套勾破字型檔案，切換字體風格嘛閣較方便。讀音選擇工具閣隨備《教育部台灣閩南語常用詞辭典》詞條資料，會當隨時做參考。</p><p>毋過四種標音系統 ê 轉換對應較複雜，目前暫時無支援包含 er, ir, ee, ek, eng 韻母 ê 讀音佮老泉腔第六調。教典 ê 詞彙佮讀音嘛是以生活用詞為主，所以較書面 ê 漢字文讀音無支援蓋濟，所以目前較無適合用佇唐詩 ê 標音。較詳細 ê 讀音收錄問題，歡迎各位有志通去 <a href="https://github.com/ButTaiwan/taigivs/tree/main/readings" target="view_window"> Github ê頁面 </a>看覓，未來 ê 版本無的確會加入較濟 ê 讀音來源，閣支援地方腔口特殊韻母。</p>');
      $(".t9").text("混羅濫寫嘛 OK！");
      $(".t10").text("字咍字型支援台語羅馬字，漢羅濫寫嘛會通 (◍•ᴗ•◍)ゝ");
      $(".t11").text("字咍台語字型系列有共思源佮全字庫楷書所欠缺 ê 羅馬字聲調調符攢好，通支援漢羅濫寫--ooh！");
      $(".t12").text("漢羅濫寫是目前臺語文時行 ê 書寫方式，濟濟無法度用漢字表示 ê 外來語、合音字、虛詞...，就會寫羅馬字表示；嘛有人主張無本字 ê 替代用字攏愛以羅馬字書寫，無仝 ê 標準各有人主張。");
      $(".t13").text("開源、免費、通商業使用佮改作");
      $(".t14").text("使用字型毋但自由閣免錢--ooh! ᕕ( ᐛ )ᕗ 你會當用來做...");
      $(".t15").html("字咍台語字型 ê 楷體漢字照 CC-by 4.0 授權推出，明體、黑體、圓體漢字是照 SIL Open Font License 授權推出，這代表見若是欲<b>改作字型</b>，會需要照各自 ê 標準，詳細閱讀授權 ê 規定才隨發布。是講<b>使用字型</b>是完全免費，嘛無需要標示字型來源，印刷、社群圖文、影片、網頁、商業設計攏會通！");
      $(".16").text("詳細授權規範請參考：");
      $(".t17").html('<div class="credit"><div class="description"><h1>關於這捾字型</h1><p>字咍台語字型是 But Ko 繼「字嗨注音體」 ê 後一个作品，共 IVS 字型技術規格用佇台語漢字 ê 標音。補添台灣本土語言基礎教育現場所欠缺的標音字型，閣進一步達成無仝標音系統的對應佮轉換，為著台語漢字 ê 教學攢一个新 ê 家私。</p></div><div class="whiteline"></div><div class="author"><h2>作者｜柯志杰 But Ko</h2><p>「字嗨」社團發起人，提供字型圈自由討論 ê 平台，這久已經是台灣上大的字型交流社群。捌佇 justfont blog 寫過濟濟字體相關知識文章，著《字型散步 Next 》。</p><p>本業是工程師，研究中、日文各類印刷字體 ê 來源佮精差，嘛參與漢字編碼、字型技術，捌發表 Unicode 補完計畫、源樣系列思源改作字型、字嗨注音體佮讀音選擇工具。</p></div><div class="helper"><h2>網頁設計｜陳建中 Tân Kiàn-tiong</h2><p>台科大設計系，學習台語文兩冬爾。捌寫過〈台語文字的字型發展現況〉，討論台語文佇電腦環境的顯示問題。</p><h2>網頁協力｜王皓梅</h2><p>台科大設計系商設組出業，這馬佇 justfont 實習。</p></div></div>');
      fonts();
      phonetic();
    }
  }
);
//字型按鈕功能
$(".fontprev").click(
  function(){
    fontnum-=1;
    if(fontnum==-1){
      fontnum=4;
    };
    fonts();
    fw(fontnum);
    // 重置字重判斷
    if(fontweight[fontnum][weightnum]==-1){
      if(fontnum==3){
        weightnum=0;
      }else {
        weightnum=1;
      }
      $(".fontweight").text(weightdata[weightnum]);
    }
    fontimgg(phoneticnum);
  }
);
$(".fontnext").click(
  function(){
    fontnum+=1;
    if(fontnum==5){
      fontnum=0;
    };
    fonts();
    fw(fontnum);
    //重置字重判斷
    if(fontweight[fontnum][weightnum]==-1){
      if(fontnum==3){
        weightnum=0;
      }else {
        weightnum=1;
      }
      $(".fontweight").text(weightdata[weightnum]);
    }
    fontimgg(phoneticnum);
  }
);
//字重按鈕功能
$(".weightprev").click(
  function(){
    weightnum-=1
    //fontweight[fontnum][weightnum] 有沒有這個字重
    //weightdata[weightnum] 現在字重的名字
    if(weightnum<0){
      weightnum=4;
    }
    while(fontweight[fontnum][weightnum]==-1){
      weightnum-=1
      if(weightnum<0){
        weightnum=4;
      }
    }
    $(".fontweight").text(weightdata[weightnum]);
    //重置標音判斷
    if(phonetic[fontnum][weightnum][phoneticnum]==-1){
      phoneticnum=0;
      phonetic();
    }
    fontimgg(phoneticnum);
  }
);
$(".weightnext").click(
  function(){
    weightnum+=1
    //fontweight[fontnum][weightnum] 有沒有這個字重
    //weightdata[weightnum] 現在字重的名字
    if(weightnum>4){
      weightnum=0;
    }
    while(fontweight[fontnum][weightnum]==-1){
      weightnum+=1
      if(weightnum>4){
        weightnum=0;
      }
    }
    $(".fontweight").text(weightdata[weightnum]);
    //重置標音判斷
    if(phonetic[fontnum][weightnum][phoneticnum]==-1){
      phoneticnum=0;
      phonetic();
    }
    fontimgg(phoneticnum);
  }
);
//標音方式按鈕功能
$(".phoneticprev").click(
  function(){
    phoneticnum-=1
    if(phoneticnum==-1){
        phoneticnum=7
      }
    while(phonetic[fontnum][weightnum][phoneticnum]==-1){
      phoneticnum-=1
      if(phoneticnum==-1){
        phoneticnum=7
      }
    }
    var pinfo=phonetic[fontnum][weightnum][phoneticnum]
    phonetic();
    fontimgg(phoneticnum);
  }
);
$(".phoneticnext").click(
  function(){
    phoneticnum+=1
    if(phoneticnum==8){
        phoneticnum=0
      }
    while(phonetic[fontnum][weightnum][phoneticnum]==-1){
      phoneticnum+=1
      if(phoneticnum==8){
        phoneticnum=0
      }
    }
    var pinfo=phonetic[fontnum][weightnum][phoneticnum]
    phonetic();
    fontimgg(phoneticnum);
  }
);
