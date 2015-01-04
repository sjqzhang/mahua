var Character={UNDER_LINE:"_",ZERO:"0",SLASH:"/",BACK_SLASH:"\\",SINGLE_QUOTE:"'",DOUBLE_QUOTE:'"',SPACE:" ",TAB:"\t",ENTER:"\r",LINE:"\n",LEFT_PARENTHESE:"(",RIGHT_PARENTHESE:")",LEFT_BRACKET:"[",RIGHT_BRACKET:"]",LEFT_BRACE:"{",RIGHT_BRACE:"}",LEFT_ANGLE_BRACE:"<",RIGHT_ANGLE_BRACE:">",STAR:"*",EXCLAMATION:"!",COLON:":",SEMICOLON:",",DECIMAL:".",DOLLAR:"$",QUESTION:"?",SHARP:"#",AT:"@",ADD:"+",MINUS:"-",PERCENT:"%",AND:"&",LESS:"<",isDigit:function(a){return"0"<=a&&"9">=a},isDigit16:function(a){return this.isDigit(a)||
"a"<=a&&"f">=a||"A"<=a&&"F">=a},isDigitOrDecimal:function(a){return this.isDigit(a)||a==this.DECIMAL},isLetter:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a},isLetterOrDigit:function(a){return this.isLetter(a)||this.isDigit(a)},isIdentifiers:function(a){return this.isLetterOrDigit(a)||a==this.UNDER_LINE},isLong:function(a){return"l"==a||"L"==a},isFloat:function(a){return"f"==a||"F"==a},isDouble:function(a){return"d"==a||"D"==a},isX:function(a){return"x"==a||"X"==a},isB:function(a){return"b"==a||
"B"==a},isBlank:function(a){return a==this.SPACE||a==this.TAB},isExponent:function(a){return"e"==a||"E"==a},isQuote:function(a){return a==this.DOUBLE_QUOTE||a==this.SINGLE_QUOTE}},HtmlEncode=function(){return{AND:"&amp;",LESS:"&lt;",BLANK:"&nbsp;",TAB:"&nbsp;&nbsp;&nbsp;&nbsp;",ESCAPE:"\\\\",CHARS:[Character.AND,Character.TAB,Character.SPACE,Character.LESS],ESCAPES:["&amp;","&nbsp;&nbsp;&nbsp;&nbsp;","&nbsp;","&lt;"],encodeChar:function(a){switch(a){case Character.SPACE:return this.BLANK;case Character.TAB:return this.TAB;
case Character.BACK_SLASH:return this.ESCAPE;case Character.AND:return this.AND;case Character.LESS:return this.LESS}return a},encode:function(a){for(var b=0;b<this.CHARS.length;b++)-1<a.indexOf(this.CHARS[b])&&(a=a.replace(RegExp(this.CHARS[b],"g"),this.ESCAPES[b]));-1<a.indexOf("\\")&&(a=a.replace(/\\/g,this.ESCAPE));return a},encodeWithLine:function(a,b){a=this.encode(a);-1<a.indexOf("\n")&&(a=a.replace(/\n/g,"</span>"+b));return a}}}(),HighLighter=function(){function a(a){return'<span class="'+
a+'">'}function b(a,b){return'<span class="'+a+'">'+b+"</span>"}return{COMMENT:"comment",STRING:"string",HEAD:"head",CDATA:"cdata",REG:"reg",number:function(a){return b("num",a)},keyword:function(a){return b("keyword",a)},string:function(a){return b("string",a)},comment:function(a){return b("comment",a)},variable:function(a){return b("variable",a)},regular:function(a){return b("reg",a)},annot:function(a){return b("annot",a)},head:function(a){return b("head",a)},attr:function(a){return b("attr",a)},
val:function(a){return b("val",a)},cdata:function(a){return b("cdata",a)},ns:function(a){return b("namespace",a)},commentStart:function(){return a("comment")},stringStart:function(){return a("string")},regStart:function(){return a("reg")},headStart:function(){return a("head")},cdataStart:function(){return a("cdata")}}}(),HashMap=function(a){this.hash={};this.index=0;this.hasKey=function(a){return!0==this.hash[a]};for(var b=0;b<a.length;b++)this.hash[a[b]]=!0},StringBuilder=function(a){this.append=
function(a){this.s+=a};this.has=function(a){return-1<this.s.indexOf(a)};this.clear=function(){this.s=""};this.toString=function(){return this.s};this.s=a};function AbstractParser(a){this.peek="";this.index=this.depth=this.line=0;this.words=new HashMap(a);this.result=new StringBuilder('<li rel="0">')}
AbstractParser.prototype={result:"",words:"",peek:"",code:"",index:0,depth:0,line:0,parse:function(a){this.code=a;this.scan();return this.result.toString()+"</li>"},isFinish:function(){return this.index>this.code.length},scan:function(){throw Error("scan\u65b9\u6cd5\u5fc5\u987b\u88ab\u5b50\u7c7b\u6240\u5b9e\u73b0");},dealBlank:function(a){for(void 0==a&&(a=!0);;this.readch())if(Character.isBlank(this.peek))this.result.append(HtmlEncode.encodeChar(this.peek));else if(a)if(this.peek==Character.LINE)this.genNewLine();
else break;else break},inheritDealSign:function(){},dealSign:function(){this.inheritDealSign();this.result.append(HtmlEncode.encodeChar(this.peek));this.readch()},dealNumber:function(){var a=this.index-1;if(this.peek==Character.ZERO)if(this.readch(),Character.isX(this.peek)){for(this.readch();this.index<this.code.length&&Character.isDigit16(this.peek);)this.readch();if(this.peek!=Character.DECIMAL){this.result.append(HighLighter.number(this.code.slice(a,this.index-1)));return}}else if(Character.isB(this.peek)){for(this.readch();this.index<
this.code.length&&Character.isDigit(this.peek);)this.readch();if(this.peek!=Character.DECIMAL){this.result.append(HighLighter.number(this.code.slice(a,this.index-1)));return}}else{if(this.peek!=Character.DECIMAL){this.result.append(HighLighter.number(Character.ZERO));return}}else{do this.readch();while(Character.isDigit(this.peek)||this.peek==Character.UNDER_LINE)}if(Character.isLong(this.peek))this.index==a+2&&this.code.charAt(a)==Character.DECIMAL?this.result.append(this.code.slice(a,this.index)):
this.result.append(HighLighter.number(code.slice(a,this.index))),this.readch();else{if(this.peek==Character.DECIMAL){do this.readch();while(Character.isDigit(this.peek));if(Character.isFloat(this.peek)||Character.isDouble(this.peek)){this.readch();a=code.slice(a,this.index-1);2<a.length&&(a=HighLighter.number(a));this.result.append(a);return}}if(Character.isExponent(this.peek)){this.readch();for((this.peek==Character.ADD||this.peek==Character.MINUS)&&this.readch();Character.isDigit(this.peek);)this.readch()}a=
code.slice(a,this.index-1);a.charAt(0)!=Character.DECIMAL&&!Character.isLetter(a.charAt(1))&&(a=HighLighter.number(a));this.result.append(a)}},readch:function(){this.peek=this.code.charAt(this.index++)},genNewLine:function(){this.result.append(this.getNewLine());this.line++},getNewLine:function(){return'&nbsp;</li><li rel="'+this.depth+'">'},isKeyword:function(a){return this.words.hasKey(a)}};$extend=function(a,b){for(var c in b)a[c]=b[c]};function CSeriesParser(a){AbstractParser.call(this,a)}
$extend(CSeriesParser.prototype,AbstractParser.prototype);
$extend(CSeriesParser.prototype,{dealString:function(a,b){var c=this.index-1,a=a||'"';for(void 0==b&&(b=!1);this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH){if(this.readch(),!b&&this.peek==Character.LINE)break}else if(this.peek==a||this.peek==Character.LINE)break;this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(c,this.index),this.getNewLine()+HighLighter.stringStart())));this.readch()},dealSingleComment:function(){var a=code.indexOf("\n",
this.index);this.index-=2;-1==a&&(a=this.code.length);this.result.append(HighLighter.comment(HtmlEncode.encode(this.code.slice(this.index,a))));this.index=a;this.readch()},dealMultiComment:function(){this.depth++;var a=this.code.indexOf("*/",this.index);this.index-=2;a=-1==a?this.code.length:a+2;this.result.append(HighLighter.comment(HtmlEncode.encodeWithLine(this.code.slice(this.index,a),this.getNewLine()+HighLighter.commentStart())));this.index=a;this.depth--;this.readch()},inheritDealSign:function(){this.peek==
Character.LEFT_BRACE?this.depth++:this.peek==Character.RIGHT_BRACE&&this.depth--}});function CompileParser(a){CSeriesParser.call(this,a)}$extend(CompileParser.prototype,CSeriesParser.prototype);
$extend(CompileParser.prototype,{dealChar:function(){var a=this.index-1;this.readch();this.peek==Character.BACK_SLASH&&this.readch();this.peek==Character.SINGLE_QUOTE&&this.readch();this.result.append(HighLighter.string(HtmlEncode.encode(this.code.slice(a,this.index))));this.readch()},dealWord:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isIdentifiers(this.peek)););a=code.slice(a,this.index-1);this.words.hasKey(a)&&(a=HighLighter.keyword(a));this.result.append(a)}});
function EcmascriptParser(a){CSeriesParser.call(this,a);this.isPerlReg=!0}$extend(EcmascriptParser.prototype,CSeriesParser.prototype);
$extend(EcmascriptParser.prototype,{scan:function(){for(this.readch();this.index<=this.code.length;)this.dealBlank(),this.peek==Character.SLASH?(this.readch(),this.peek==Character.SLASH?this.dealSingleComment():this.peek==Character.STAR?this.dealMultiComment():this.isPerlReg?(this.dealPerlReg(),this.isPerlReg=!0):(this.result.append("/"),this.isPerlReg=!1)):Character.isQuote(this.peek)?(this.dealString(this.peek,!0),this.isPerlReg=!0):Character.isDigitOrDecimal(this.peek)?(this.dealNumber(),this.isPerlReg=
!1):Character.isIdentifiers(this.peek)||this.peek==Character.DOLLAR?(this.dealWord(),this.isPerlReg=!1):(this.isPerlReg=this.peek==Character.RIGHT_PARENTHESE?!1:!0,this.dealSign())},dealWord:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isIdentifiers(this.peek)&&this.peek!=Character.DOLLAR););a=code.slice(a,this.index-1);this.words.hasKey(a)&&(a=HighLighter.keyword(a));this.result.append(a)},dealPerlReg:function(){var a=this.index-2;a:for(;this.index<=
this.code.length;){if(this.peek==Character.BACK_SLASH)this.readch();else if(this.peek==Character.LEFT_BRACKET)for(;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();else{if(this.peek==Character.RIGHT_BRACKET)continue a}else if(this.peek==Character.LINE)break;else if(this.peek==Character.SLASH)for(;this.index<=this.code.length;)if(this.readch(),!Character.isLetter(this.peek))break a;this.readch()}this.result.append(HighLighter.regular(HtmlEncode.encodeWithLine(this.code.slice(a,
this.index-1),this.getNewLine()+HighLighter.regStart())))}});
function JavascriptParser(){EcmascriptParser.call(this,"if,else,for,break,case,continue,function,true,switch,default,do,while,int,float,double,long,short,char,null,public,super,in,false,abstract,boolean,byte,class,const,debugger,delete,static,void,synchronized,this,import,enum,export,extends,final,finally,goto,implements,protected,throw,throws,transient,instanceof,interface,native,new,package,private,try,typeof,var,volatile,with,document,window,return,Function,String,Date,Array,Object,RegExp,Event,Math,Number".split(","))}
$extend(JavascriptParser.prototype,EcmascriptParser.prototype);$extend(JavascriptParser.prototype,{embedParse:function(a,b){this.depth=b;var c=this.parse(a);return c.slice(12,c.length-5)}});
function CssParser(){this.values=new HashMap("above,absolute,all,always,aqua,armenian,attr,aural,auto,avoid,baseline,behind,below,bidi-override,black,blink,block,blue,bold,bolder,both,bottom,braille,capitalize,caption,center,center-left,center-right,circle,close-quote,code,collapse,compact,condensed,continuous,counter,counters,crop,cross,crosshair,cursive,dashed,decimal,decimal-leading-zero,default,digits,disc,dotted,double,embed,embossed,e-resize,expanded,extra-condensed,extra-expanded,fantasy,far-left,far-right,fast,faster,fixed,format,fuchsia,gray,green,groove,handheld,hebrew,help,hidden,hide,high,higher,icon,inline-table,inline,inset,inside,invert,italic,justify,landscape,large,larger,left-side,left,leftwards,level,lighter,lime,line-through,list-item,local,loud,lower-alpha,lowercase,lower-greek,lower-latin,lower-roman,lower,low,ltr,marker,maroon,medium,message-box,middle,mix,move,narrower,navy,ne-resize,no-close-quote,none,no-open-quote,no-repeat,normal,nowrap,n-resize,nw-resize,oblique,olive,once,open-quote,outset,outside,overline,pointer,portrait,pre,print,projection,purple,red,relative,repeat,repeat-x,repeat-y,rgb,ridge,right,right-side,rightwards,rtl,run-in,screen,scroll,semi-condensed,semi-expanded,separate,se-resize,show,silent,silver,slower,slow,small,small-caps,small-caption,smaller,soft,solid,speech,spell-out,square,s-resize,static,status-bar,sub,super,sw-resize,table-caption,table-cell,table-column,table-column-group,table-footer-group,table-header-group,table-row,table-row-group,teal,text-bottom,text-top,thick,thin,top,transparent,tty,tv,ultra-condensed,ultra-expanded,underline,upper-alpha,uppercase,upper-latin,upper-roman,url,visible,wait,white,wider,w-resize,x-fast,x-high,x-large,x-loud,x-low,x-slow,x-small,x-soft,xx-large,xx-small,yellow".split(","));this.defaultDepth=
0;CSeriesParser.call(this,"ascent,azimuth,background-attachment,background-color,background-image,background-position,background-repeat,background,baseline,bbox,border-collapse,border-color,border-spacing,border-style,border-top,border-right,border-bottom,border-left,border-top-color,border-right-color,border-bottom-color,border-left-color,border-top-style,border-right-style,border-bottom-style,border-left-style,border-top-width,border-right-width,border-bottom-width,border-left-width,border-width,border,bottom,cap-height,caption-side,centerline,clear,clip,color,content,counter-increment,counter-reset,cue-after,cue-before,cue,cursor,definition-src,descent,direction,display,elevation,empty-cells,float,font-size-adjust,font-family,font-size,font-stretch,font-style,font-variant,font-weight,font,height,left,letter-spacing,line-height,list-style-image,list-style-position,list-style-type,list-style,margin-top,margin-right,margin-bottom,margin-left,margin,marker-offset,marks,mathline,max-height,max-width,min-height,min-width,orphans,outline-color,outline-style,outline-width,outline,overflow,padding-top,padding-right,padding-bottom,padding-left,padding,page,page-break-after,page-break-before,page-break-inside,pause,pause-after,pause-before,pitch,pitch-range,play-during,position,quotes,right,richness,size,slope,src,speak-header,speak-numeral,speak-punctuation,speak,speech-rate,stemh,stemv,stress,table-layout,text-align,top,text-decoration,text-indent,text-shadow,text-transform,unicode-bidi,unicode-range,units-per-em,vertical-align,visibility,voice-family,volume,white-space,widows,width,widths,word-spacing,x-height,z-index".split(","))}
$extend(CssParser.prototype,CSeriesParser.prototype);
$extend(CssParser.prototype,{scan:function(){for(this.readch();this.index<=this.code.length;)this.dealBlank(),this.peek==Character.SLASH?(this.readch(),this.peek==Character.SLASH?this.dealSingleComment():this.peek==Character.STAR?this.dealMultiComment():this.result.append("/")):this.peek==Character.SHARP&&0<this.depth?this.dealColor():Character.isQuote(this.peek)?this.dealString(this.peek):Character.isDigitOrDecimal(this.peek)?this.dealNum():Character.isLetter(this.peek)?this.dealWord():this.dealSign()},
dealNum:function(){for(var a=this.index-1,b;Character.isDigit(this.peek);)this.readch();if(this.peek==Character.DECIMAL)for(this.readch();Character.isDigit(this.peek);)this.readch();for(b=this.index-1;Character.isLetter(this.peek);)this.readch();var c=this.code.slice(b,this.index-1).toLowerCase();if("%"==c||2==c.length&&-1<"em px pt cm mm ex pc in".indexOf(c))b=this.index-1;a=this.code.slice(a,b);this.depth>this.defaultDepth&&(a=HighLighter.number(a));this.result.append(a);this.index=b;this.readch()},
dealWord:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isLetter(this.peek)&&this.peek!=Character.MINUS););a=this.code.slice(a,this.index-1);this.depth>this.defaultDepth&&(this.words.hasKey(a.toLowerCase())?a=HighLighter.keyword(a):this.values.hasKey(a.toLowerCase())&&(a=HighLighter.val(a)));this.result.append(a)},dealColor:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isDigit16(this.peek)););a=this.code.slice(a,
this.index-1);if(this.depth>this.defaultDepth&&(4==a.length||7==a.length))a=HighLighter.number(a);this.result.append(a)},embedParse:function(a,b){this.depth=defaultDepth=b;var c=this.parse(this.code);return c.slice(12,c.length-5)}});function MarkupParser(a){this.TEXT=0;this.MARK=1;this.state=this.TEXT;AbstractParser.call(this,a)}$extend(MarkupParser.prototype,AbstractParser.prototype);
$extend(MarkupParser.prototype,{dealString:function(a){void 0==a&&(a='"');var b=this.index-1;this.index=this.code.indexOf(a,this.index);-1==this.index&&(this.index=this.code.length-1);this.index++;this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(b,this.index),this.getNewLine()+HighLighter.stringStart())));this.readch()},dealComment:function(){this.depth++;var a=this.code.indexOf("--\>",this.index+4);-1==a&&(a=this.code.length-3);a+=3;this.result.append(HighLighter.comment(HtmlEncode.encodeWithLine(this.code.slice(this.index,
a),this.getNewLine()+HighLighter.commentStart())));this.index=a;this.depth--;this.readch()}});
function HtmlParser(){this.CSS=2;this.JS=3;this.javascript=this.css=this.auto=!1;this.autoWords=new HashMap("BR,HR,COL,IMG,AREA,BASE,LINK,META,FRAME,INPUT,PARAM,ISINDEX,BASEFONT,COLGROUP".split(","));this.attributes=new HashMap("abbr,accept-charset,accept,accesskey,action,align,behavior,bgcolor,bgproperties,border,bordercolor,bordercolordark,alink,alt,bordercolorlight,borderstyle,buffer,caption,cellpadding,cellspacing,archive,char,charoff,charset,checked,cite,class,classid,clear,code,codebase,axis,codetype,color,cols,colspan,compact,content,contentType,coords,data,vlink,datetime,declare,defer,dir,direction,disabled,dynsrc,encoding,enctype,errorPage,extends,face,file,flush,for,frame,frameborder,framespacing,urn,gutter,headers,height,href,hreflang,hspace,http-equiv,icon,id,import,info,isErrorPage,ismap,isThreadSafe,label,language,leftmargin,link,autoFlush,longdesc,loop,lowsrc,marginheight,marginwidth,maximizebutton,maxlength,media,method,methods,minimizebutton,multiple,name,nohref,noresize,background,noshade,nowrap,object,onabort,onblur,onchange,onclick,ondblclick,width,onerror,onfocus,onkeydown,onkeypress,onkeyup,onload,applicationname,rows,onmousemove,onmouseout,onmouseover,onmouseup,onreset,onselect,onsubmit,onunload,page,param,profile,prompt,property,readonly,rel,onmousedown,rev,rowspan,rules,runat,scheme,scope,scrollamount,scrolldelay,scrolling,vrml,selected,session,shape,showintaskbar,singleinstance,size,span,src,standby,start,style,summary,sysmenu,tabindex,target,text,title,topmargin,type,wrap,usemap,valign,value,valuetype,version,vspace,windowstate".split(","));MarkupParser.call(this,
"A,ABBR,ACRONYM,ADDRESS,APPLET,B,BDO,BIG,BLOCKQUOTE,BODY,BUTTON,CAPTION,CENTER,CITE,CODE,DD,DEL,DFN,DIR,DIV,DL,DT,EM,FIELDEST,FONT,FORM,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HTML,I,IFRAME,INS,KBD,LABEL,LEGEND,LI,MAP,MENU,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,P,PRE,Q,S,SAMP,SCRIPT,SELECT,SMALL,SPAN,STRIKE,STRONG,STYLE,SUB,SUP,TABLE,TBODY,TD,TEXTAREA,TFOOT,TH,THEAD,TITLE,TR,TT,U,EMBED,UL,VAR,PUBLIC".split(","))}$extend(HtmlParser.prototype,MarkupParser.prototype);
$extend(HtmlParser.prototype,{scan:function(){var a=0;for(this.readch();this.index<=this.code.length;)switch(this.dealBlank(),this.state){case this.TEXT:a=this.index-1;this.index=this.code.indexOf("<",a);if(-1==this.index){this.result.append(HtmlEncode.encodeWithLine(this.code.slice(a),this.getNewLine()));return}this.index>a&&this.result.append(HtmlEncode.encodeWithLine(this.code.slice(a,this.index),this.getNewLine()));this.readch();this.dealLeftAngleBracket();break;case this.MARK:Character.isQuote(this.peek)?
this.dealString(this.peek):this.peek==Character.SLASH?(this.readch(),this.peek==Character.RIGHT_ANGLE_BRACE?(this.result.append(HighLighter.keyword("/>")),this.state=this.TEXT,this.auto||this.depth--):this.result.append("/"),this.auto=!1,this.readch()):this.peek==Character.RIGHT_ANGLE_BRACE?(this.result.append(HighLighter.keyword(">")),this.readch(),this.state=this.TEXT,this.auto=!1,this.css?this.state=this.CSS:this.javascript&&(this.state=this.JS)):Character.isLetter(this.peek)?this.dealAttr():Character.isDigit(this.peek)?
this.dealNumber():(this.result.append(HtmlEncode.encodeChar(this.peek)),this.readch());break;case this.CSS:this.dealCss();break;case this.JS:this.dealJs()}},dealLeftAngleBracket:function(){this.readch();this.peek==Character.EXCLAMATION?"--"==this.code.substr(this.index,2)?(this.index-=2,this.dealComment()):("DOCTYPE"==this.code.substr(this.index,7).toUpperCase()?(this.result.append(HighLighter.keyword(HtmlEncode.encode(this.code.substr(this.index-2,9)))),this.index+=7,this.state=this.MARK,this.auto=
!0):this.result.append("&lt;!"),this.readch()):this.peek==Character.SLASH?this.dealEndWord():Character.isLetter(this.peek)?this.dealStartWord():(this.result.append(HtmlEncode.LESS+HtmlEncode.encodeChar(this.peek)),this.readch())},dealStartWord:function(){var a=this.index-1;do this.readch();while(Character.isLetterOrDigit(this.peek));a=this.code.slice(a,this.index-1);this.words.hasKey(a.toUpperCase())?("STYLE"==a.toUpperCase()?this.css=!0:"SCRIPT"==a.toUpperCase()&&(this.javascript=!0),a=HighLighter.keyword(HtmlEncode.LESS+
a),this.state=this.MARK,this.depth++):this.autoWords.hasKey(a.toUpperCase())?(a=HighLighter.keyword(HtmlEncode.LESS+a),this.state=this.MARK,this.auto=!0):a=HtmlEncode.LESS+a;this.result.append(a)},dealEndWord:function(){var a=this.index;do this.readch();while(Character.isLetterOrDigit(this.peek));a=this.code.slice(a,this.index-1);this.peek==Character.RIGHT_ANGLE_BRACE&&this.words.hasKey(a.toUpperCase())?(this.result.append(HighLighter.keyword(HtmlEncode.LESS+"/"+a+">")),this.readch(),this.state=this.TEXT,
this.depth--):this.result.append(HtmlEncode.LESS+"/"+a)},dealAttr:function(){var a=this.index-1;do this.readch();while(Character.isLetter(this.peek)||this.peek==Character.MINUS);a=this.code.slice(a,this.index-1);this.attributes.hasKey(a.toLowerCase())&&(a=HighLighter.attr(a));this.result.append(a)},dealCss:function(){for(var a=this.index-1,b;this.index<=this.code.length;){if(this.peek==Character.SLASH)this.readch(),this.peek==Character.STAR?(b=this.code.indexOf("*/",this.index),-1==b&&(b=this.code.length),
this.index=b):this.peek==Character.SLASH&&(b=this.code.indexOf("\n",this.index),-1==b&&(b=this.code.length),this.index=b);else if(Character.isQuote(this.peek))for(b=this.peek;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();else{if(this.peek==b)break}else if(this.peek==Character.LEFT_ANGLE_BRACE&&(b=this.code.substr(this.index-1,8).toLowerCase(),"</style>"==b))break;this.readch()}this.result.append((new CssParser).embedParse(this.code.slice(a,this.index-
1),this.depth));this.css=!1;this.state=this.TEXT},dealJs:function(){for(var a=this.index-1,b,c=!0;this.index<=this.code.length;){if(this.peek==Character.SLASH)if(this.readch(),this.peek==Character.STAR)b=this.code.indexOf("*/",this.index),-1==b&&(b=this.code.length),this.index=b+2;else if(this.peek==Character.SLASH)b=this.code.indexOf("\n",this.index),-1==b&&(b=this.code.length),this.index=b;else if(c){for(;this.index<=this.code.length;){if(this.peek==Character.BACK_SLASH)this.readch();else if(this.peek==
Character.SLASH)break;else if(this.peek==Character.LEFT_BRACKET)for(;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();else if(this.peek==Character.RIGHT_BRACKET)break;this.readch()}c=!0}else c=!1;else if(Character.isQuote(this.peek)){for(b=this.peek;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();else if(this.peek==b)break;c=!0}else if(this.peek==Character.LEFT_ANGLE_BRACE){if(b=this.code.substr(this.index,8).toLowerCase(),
"/script>"==b)break}else c=Character.isIdentifiers(this.peek)||this.peek==Character.DOLLAR||this.peek==Character.RIGHT_PARENTHESE?!1:!0;this.readch()}this.result.append((new JavascriptParser).embedParse(this.code.slice(a,this.index-1),this.depth));this.javascript=!1;this.state=this.TEXT}});
function JavaParser(){CompileParser.call(this,"if,else,for,break,case,continue,function,true,false,switch,default,do,while,int,float,double,long,throws,transient,abstract,assert,boolean,byte,class,const,enum,instanceof,try,volatilechar,extends,final,finally,goto,implements,import,protected,return,void,char,interface,native,new,package,private,protected,throw,short,public,return,strictfp,super,synchronized,this,static,null,String".split(","))}$extend(JavaParser.prototype,CompileParser.prototype);
$extend(JavaParser.prototype,{scan:function(){for(this.readch();this.index<=this.code.length;)this.dealBlank(),this.peek==Character.SLASH?(this.readch(),this.peek==Character.SLASH?this.dealSingleComment():this.peek==Character.STAR?this.dealMultiComment():this.result.append(Character.SLASH)):this.peek==Character.DOUBLE_QUOTE?this.dealString(this.peek):this.peek==Character.SINGLE_QUOTE?this.dealChar():this.peek==Character.AT?this.dealAnnot():Character.isDigitOrDecimal(this.peek)?this.dealNumber():Character.isIdentifiers(this.peek)?
this.dealWord():this.dealSign()},dealAnnot:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isLetterOrDigit(this.peek)););this.result.append(HighLighter.annot(HtmlEncode.encode(this.code.slice(a,--this.index))));this.readch()}});
function CPhpParser(){this.tag="";CSeriesParser.call(this,"and,or,xor,__FILE__,__LINE__,array,as,cfunction,class,const,declare,die,elseif,empty,enddeclare,endfor,endforeach,endif,endswitch,endwhile,extends,foreach,include,include_once,global,new,old_function,use,require,require_once,var,__FUNCTION__,__CLASS__,__METHOD__,abstract,interface,public,implements,extends,private,protected,throw,echo,exit,die".split(","))}$extend(CPhpParser.prototype,CSeriesParser.prototype);
$extend(CPhpParser.prototype,{scan:function(){for(this.readch();this.index<=this.code.length;)this.dealBlank(),this.peek==Character.SLASH?(this.readch(),this.peek==Character.SLASH?this.dealSingleComment():this.peek==Character.STAR?this.dealMultiComment():this.result.append("/")):Character.isQuote(this.peek)?this.dealString(this.peek):this.peek==Character.LEFT_ANGLE_BRACE?(this.readch(),this.peek==Character.LEFT_ANGLE_BRACE?(this.readch(),this.peek==Character.LEFT_ANGLE_BRACE?(this.readch(),this.dealMultiString()):
this.result.append(HtmlEncode.LESS+HtmlEncode.LESS+this.peek)):this.result.append(HtmlEncode.LESS+this.peek)):Character.isDigitOrDecimal(this.peek)?this.dealNumber():this.peek==Character.DOLLAR?this.dealVal():Character.isIdentifiers(this.peek)?this.dealWord():this.dealSign()},dealVal:function(){for(var a=this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isIdentifiers(this.peek)););this.result.append(HighLighter.val(this.code.slice(a,this.index-1)))},dealWord:function(){for(var a=
this.index-1;this.index<=this.code.length&&!(this.readch(),!Character.isIdentifiers(this.peek)););a=this.code.slice(a,this.index-1);this.words.hasKey(a)&&(a=HighLighter.keyword(a));this.result.append(a)},dealMultiString:function(){this.depth++;for(var a=this.index-4;this.index<=this.code.length&&Character.isIdentifiers(this.peek);)this.readch();var b=this.code.slice(a+3,this.index-1),c=this.code.indexOf("\n"+b,this.index),c=-1==c?this.code.length:c+(b.length+1);this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(a,
c),this.getNewLine()+HighLighter.stringStart())));this.index=c;this.depth--;this.readch()},embedParse:function(a,b){this.depth=b;var c=this.parse(a);return c.slice(12,c.length-5)}});function PhpParser(){this.PHP=4;HtmlParser.call(this)}$extend(PhpParser.prototype,HtmlParser.prototype);
$extend(PhpParser.prototype,{dealLeftAngleBracket:function(){this.readch();this.peek==Character.QUESTION?"php"==this.code.substr(this.index,3).toLowerCase()?(this.result.append(HighLighter.keyword(HtmlEncode.LESS+this.code.slice(this.index-1,this.index+3))),this.index+=3,this.dealPhp()):Character.isIdentifiers(this.code.charAt(this.index))?(this.result.append(HtmlEncode.LESS+"?"),this.readch()):(this.result.append(HighLighter.keyword(HtmlEncode.LESS+"?")),this.dealPhp()):(this.index--,HtmlParser.dealLeftAngleBracket.call(this))},
dealPhp:function(){this.readch();this.depth++;for(var a=this.index-1,b;this.index<=this.code.length;){if(this.peek==Character.SLASH)this.readch(),this.peek==Character.STAR?(b=this.code.indexOf("*/",this.index),-1==b&&(b=this.code.length),this.index=b):this.peek==Character.SLASH&&(b=this.code.indexOf("\n",this.index),-1==b&&(b=this.code.length),this.index=b);else if(Character.isQuote(this.peek))for(b=this.peek;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();
else{if(this.peek==b)break}else if(this.peek==Character.QUESTION&&(this.readch(),this.peek==Character.RIGHT_ANGLE_BRACE)){this.index--;break}this.readch()}a=(new CPhpParser).embedParse(this.code.slice(a,this.index-1),this.depth);a+=HighLighter.keyword("?>");this.index+=2;this.result.append(a);this.depth--}});function CAndCppParser(a){CompileParser.call(this,a)}$extend(CAndCppParser.prototype,CompileParser.prototype);
$extend(CAndCppParser.prototype,{scan:function(){for(this.readch();this.index<=this.code.length;)this.dealBlank(),this.peek==Character.SLASH?(this.readch(),this.peek==Character.SLASH?this.dealSingleComment():this.peek==Character.STAR?this.dealMultiComment():this.result.append(Character.SLASH)):this.peek==Character.DOUBLE_QUOTE?this.dealString(this.peek):this.peek==Character.SINGLE_QUOTE?this.dealChar():this.peek==Character.SHARP?this.dealHead():Character.isDigitOrDecimal(this.peek)?this.dealNumber():
Character.isIdentifiers(this.peek)?this.dealWord():this.dealSign()},dealHead:function(){for(var a=this.index-1;this.index<=this.code.length;)if(this.readch(),this.peek==Character.BACK_SLASH)this.readch();else if(this.peek==Character.LINE)break;this.result.append(HighLighter.head(HtmlEncode.encodeWithLine(this.code.slice(a,this.index-1),this.getNewLine()+HighLighter.headStart())))}});
function CParser(){CAndCppParser.call(this,"if,else,for,break,case,continue,function,struct,true,false,switch,default,do,while,int,float,double,long,signed,short,char,return,void,static,null,assert,byte,this,throw,new,public,return,strictfp,extends,final,finally,goto,implements,import,instanceof,unsigned,super,synchronized,boolean,enum,interface,native,package,private,protected,protected,extern,abstract,const,class,throws,transient,try,volatile,typedef,bool".split(","))}
$extend(CParser.prototype,CAndCppParser.prototype);
function CppParser(){CAndCppParser.call(this,"if,else,for,break,case,continue,function,true,false,switch,default,do,while,int,float,double,long,const_cast,private,short,char,return,void,static,null,whcar_t,volatile,uuid,explicit,extern,class,const,__finally,__exception,__try,virtual,using,signed,namespace,new,public,protected,__declspec,delete,unsigned,friend,goto,inline,mutable,deprecated,dllexport,dllimport,dynamic_cast,enum,union,bool,naked,typeid,noinline,noreturn,nothrow,register,this,reinterpret_cast,selectany,sizeof,static_cast,struct,template,thread,throw,try,typedef,typename".split(","))}
$extend(CppParser.prototype,CAndCppParser.prototype);
function ActionscriptParser(){EcmascriptParser.call(this,"as,class,const,delete,extends,finally,to,true,false,continue,in,instanceof,interface,internal,is,native,new,null,package,Boolean,uint,Infinity,return,undefined,private,protected,public,super,this,throw,import,include,Date,Error,RegExp,NaN,void,int,intrinsic,try,typeof,use,var,with,each,get,set,namespace,implements,function,XML,Object,static,break,dynamic,final,native,override,trace,String,Number,Date,Event,Array,XMLLIST,if,else,do,while,for,swtich,case".split(","))}
$extend(ActionscriptParser.prototype,EcmascriptParser.prototype);function XmlParser(){this.auto=!1;MarkupParser.call(this,[])}$extend(XmlParser.prototype,MarkupParser.prototype);
$extend(XmlParser.prototype,{scan:function(){var a=0;for(this.readch();this.index<=this.code.length;)switch(this.dealBlank(),this.state){case this.TEXT:a=this.index-1;this.index=this.code.indexOf("<",a);if(-1==this.index){this.result.append(HtmlEncode.encodeWithLine(this.code.slice(a),this.getNewLine()));return}this.index>a&&this.result.append(HtmlEncode.encodeWithLine(this.code.slice(a,this.index),this.getNewLine()));this.readch();this.dealLeftAngleBracket();break;case this.MARK:Character.isQuote(this.peek)?
this.dealString(this.peek):this.peek==Character.SLASH?(this.readch(),this.peek==Character.RIGHT_ANGLE_BRACE?(this.result.append(HighLighter.keyword("/>")),this.state=this.TEXT,this.auto||this.depth--):this.result.append("/"),this.auto=!1,this.readch()):this.peek==Character.RIGHT_ANGLE_BRACE?(this.result.append(HighLighter.keyword(">")),this.readch(),this.state=this.TEXT,this.auto=!1):Character.isLetter(this.peek)?this.dealAttr():Character.isDigit(this.peek)?this.dealNumber():(this.result.append(HtmlEncode.encodeChar(this.peek)),
this.readch())}},dealLeftAngleBracket:function(){this.readch();this.peek==Character.EXCLAMATION?"--"==this.code.substr(this.index,2)?(this.index-=2,this.dealComment()):"doctype"==this.code.substr(this.index,7).toLowerCase()?(this.result.append(HighLighter.keyword(HtmlEncode.encode(this.code.substr(this.index-2,9)))),this.index+=7,this.state=this.MARK,this.auto=!0,this.readch()):"[cdata["==this.code.substr(this.index,7).toLowerCase()?this.dealCdata():(this.result.append(HtmlEncode.LESS+"!"),this.readch()):
this.peek==Character.QUESTION?this.dealQuestion():this.peek==Character.SLASH?this.dealEndWord():Character.isLetter(this.peek)?this.dealStartWord():(this.result.append(HtmlEncode.LESS+HtmlEncode.enthis.codeChar(this.peek)),this.readch())},dealStartWord:function(){var a=this.index-1;do this.readch();while(Character.isLetterOrDigit(this.peek)||this.peek==Character.MINUS||this.peek==Character.COLON);a=this.code.slice(a,this.index-1);a=HighLighter.keyword(HtmlEncode.LESS+a);this.state=this.MARK;this.depth++;
this.result.append(a)},dealEndWord:function(){var a=this.index;do this.readch();while(Character.isLetterOrDigit(this.peek)||this.peek==Character.MINUS||this.peek==Character.COLON);a=this.code.slice(a,this.index-1);this.peek==Character.RIGHT_ANGLE_BRACE?(a=HighLighter.keyword(HtmlEncode.LESS+"/"+a+">"),this.readch(),this.state=this.TEXT,this.depth--):a=HtmlEncode.LESS+"/"+a;this.result.append(a)},dealAttr:function(){var a=this.index-1;do this.readch();while(Character.isLetterOrDigit(this.peek)||this.peek==
Character.MINUS);this.result.append(this.peek==Character.COLON?HighLighter.ns(this.code.slice(a,this.index-1)):HighLighter.attr(this.code.slice(a,this.index-1)))},dealQuestion:function(){var a=this.code.indexOf("?>",this.index);this.index-=2;a=-1==a?this.code.length:a+2;this.result.append(HighLighter.head(HtmlEncode.encodeWithLine(this.code.slice(this.index,a),this.getNewLine()+HighLighter.headStart())));this.index=a;this.readch()},dealCdata:function(){this.depth++;var a=this.code.indexOf("]]\>",
this.index+7);this.index-=2;a=-1==a?this.code.length:a+3;this.result.append(HighLighter.cdata(HtmlEncode.encodeWithLine(this.code.slice(this.index,a),this.getNewLine()+HighLighter.cdataStart())));this.index=a;this.depth--;this.readch()}});function UnknowParser(){}$extend(UnknowParser.prototype,AbstractParser.prototype);$extend(UnknowParser.prototype,{parse:function(a){a='<li name="0">'+HtmlEncode.encodeWithLine(a,'&nbsp;</li><li name="0"><span>')+"</li>";this.result.append(a);return a}});
(function(){var a=function(a){switch(a){case "js":case "javascript":case "ecmascript":case "jscript":return new JavascriptParser;case "as":case "as2":case "as3":case "actionscript":case "flash":return new ActionscriptParser;case "c":return new CParser;case "c++":case "cpp":case "cplusplus":return new CppParser;case "java":return new JavaParser;case "php":return new PhpParser;case "html":case "xhtml":case "htm":return new HtmlParser;case "css":return new CssParser;case "xml":return new XmlParser;default:return new UnknowParser}},
b=parent.window.$;setInterval(function(){b("*[class^=lang]",document).each(function(c,d){if(!b(d).data("hiboted")){syntax=d.getAttribute("class").toLowerCase().split("-")[1];code="textarea"==d.tagName.toLowerCase()?d.value:b(d).text();-1<code.indexOf("\r")&&(code=code.replace(/\r/g,""));var f=a(syntax);f.parse(code);d.style.display="none";b(d).data("hiboted",!0);var e=document.createElement("ol");e.className="hibot";e.innerHTML=f.result.toString();d.parentNode.insertBefore(e,d)}})},1E3)})();
