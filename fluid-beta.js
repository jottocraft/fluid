/*!
Fluid JS Modules v3.0 beta 1

Copyright (c) 2017-2018 jottocraft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
 function getCookie(cname) {
     var name = cname + "=";
     var decodedCookie = decodeURIComponent(document.cookie);
     var ca = decodedCookie.split(';');
     for(var i = 0; i <ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') {
             c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
             return c.substring(name.length, c.length);
         }
     }
     return "";
 }

fluid = new Object;
fluid.cloudEnabled = true;
fluid.dark = function(theme) {
  if (theme == undefined) {
  $("body").toggleClass("dark");
  }
  if (theme == true) {
  $("body").addClass("dark");
  }
  if (theme == false) {
  $("body").removeClass("dark");
  }
  if ( $(".themeico").length ) {
    if (fluid.isDark()) {
      $(".themeico").text("brightness_low");
    } else {
      $(".themeico").text("brightness_high");
    }
  }
  document.cookie = "fluidIsDark=" + fluid.isDark();
}
fluid.isDark = function() {
  return $("body").hasClass("dark");
}
fluid.auto = function() {
  var hours = new Date().getHours()
  // Light: 6AM - 6PM Dark: 7PM - 5AM
  if (hours > 5 && hours < 19) {
    $("body").removeClass("dark");
  } else {
    $("body").addClass("dark");
  }
  if ( $(".themeico").length ) {
    if (fluid.isDark()) {
      $(".themeico").text("brightness_low");
    } else {
      $(".themeico").text("brightness_high");
    }
  }
  document.cookie = "fluidIsDark=auto";
}
fluid.tcoh = function() {
  $("body").addClass("litleceser");
  $('img').attr('src', 'https://i.imgur.com/uhZT30E.png');
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = 'https://i.imgur.com/uhZT30E.png';
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = "LITTLE CESERS HOT N READY FOR ONLY FIVE DOLALARS EXTRA MOST BESTEST IS ONLY SIX FOR EXTRA CHEESE AND PEPERONI AND THE NATIONS BEST PRICE"
}
/* Loader auto initilization */
setTimeout(function () {
try { $("loader").html('<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>');
}
catch(err) {
}
}, 1);
fluid.load = function(mode) {
  if (mode) {
    $("loader").removeClass("hidden");
  } else {
    $("loader").addClass("hidden");
  }
}
fluid.init = function() {
  if (getCookie("fluidIsDark") == "true") {
    $("body").addClass("dark");
  } else {
    if (getCookie("fluidIsDark") == "auto") {
      fluid.auto();
    } else {
      if (getCookie("fluidIsDark") == "false") {
    $("body").removeClass("dark");
  } else {
    if ($("body").hasClass("auto")) {
      fluid.auto();
    }
  }
  }
  }
  if (!$("body").hasClass("notwemoji")) {
  twemoji.parse(document.body);
}

  $( ".btns .btn" ).click(function(event) {
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
});
$( "div.nav.active li" ).click(function(event) {
$(this).siblings().removeClass("active")
$(this).addClass("active")
});

$( ".section.collapse .header" ).click(function(event) {
$(this).siblings(".body").toggleClass("collapsed")
});
}

$( document ).ready(fluid.init);


/* Cards */
menuopen = false;
fluid.cards = function(element, isModal) {
  var focus = $(element).hasClass('focus');
  if (focus) {
    if ( !$( "#pagewrapper" ).length ) {
    $( "body" ).wrapInner( "<div id='pagewrapper'></div>");
    $( "#pagewrapper" ).after( "<div id='focuscardwrapper' class='container'></div>" );
    $( "#pagewrapper" ).after( "<div id='splashscreen' style='display:none;margin-top: 100px;' class='container'><h1 style='font-size:5rem;' id='splashscreenname'></h1><div id='splashscreencnt'></div></div>" );
    $(".card.focus").appendTo("#focuscardwrapper");
    $(".splash").appendTo("#splashscreencnt");
    }
        $(element).css({top: window.scrollY + 200});
        if (menuopen) {
          fluid.cards.close.focus();
          $("#pagewrapper").addClass('blur');
          if (isModal) document.body.style.overflow = "hidden"
          $(element).removeClass('close');
          setTimeout(function() {$("#pagewrapper").attr("onclick","fluid.card.close('" + element + "');");}, 100)
        } else {
          $("#pagewrapper").addClass('blur');
          if (isModal) document.body.style.overflow = "hidden"
          $(element).removeClass('close');
          setTimeout(function() {$("#pagewrapper").attr("onclick","fluid.cards.close.focus();");}, 100)
        }
  } else {
    $("#pagewrapper").attr("onclick","");
    if (menuopen) {
      fluid.cards.close();
      $(element).removeClass('close');
    } else {
     menuopen = true;
     $(element).removeClass('close');
    }
  }
}
fluid.modal = function(element) {
  fluid.cards(element, true)
}
fluid.cards.close = function(element) {
  $(element).addClass('close');
  $('#pagewrapper').removeClass("blur");
  document.body.style.overflow = ""
  $("#pagewrapper").attr("onclick","");
  menuopen = false;
}
fluid.cards.close.focus = function() {
  $("#pagewrapper").attr("onclick","");
  $(".focus").addClass('close');
  $('#pagewrapper').removeClass("blur");
  document.body.style.overflow = ""
  menuopen = false;
}

fluid.splash = function(element) {
  fluid.splashScroll = window.scrollY;
  if ( !$( "#pagewrapper" ).length ) {
  $( "body" ).wrapInner( "<div id='pagewrapper'></div>");
  $( "#pagewrapper" ).after( "<div id='focuscardwrapper' class='container'></div>" );
  $( "#pagewrapper" ).after( "<div id='splashscreen' style='display:none;margin-top: 100px;' class='container'><h1 style='font-size:5rem;' id='splashscreenname'></h1><div id='splashscreencnt'></div></div>" );
  $(".card.focus").appendTo("#focuscardwrapper");
  $(".splash").appendTo("#splashscreencnt");
  }
  $("#pagewrapper").hide();
 var title = $(element).attr("title");
  $("#splashscreenname").html(title);
  $(element).show();
  $("#splashscreen").show();
}

fluid.unsplash = function() {
  $("#splashscreen").hide();
  $("#splashscreenname").html("");
  $(".splash").hide();
  $("#pagewrapper").show();
  window.scrollTo(0, fluid.splashScroll);
}

/* Fluid Commands */
// a key map of allowed keys
var allowedKeys = {
  38: 'up',
  40: 'down',
  119: 'f8'
};
var darkOverride = ['up', 'up', 'down', 'down', 'f8'];
var darkOverridePosition = 0;

var allowedKeysAuto = {
  38: 'up',
  40: 'down',
  118: 'f7'
};
var autoOverride = ['up', 'up', 'down', 'down', 'f7'];
var autoOverridePosition = 0;



document.addEventListener('keydown', function(e) {
  var key = allowedKeys[e.keyCode];
  var requiredKey = darkOverride[darkOverridePosition];
  if (key == requiredKey) {
    darkOverridePosition++;
    if (darkOverridePosition == darkOverride.length) {
      fluid.dark();
      darkOverridePosition = 0;
    }
  } else {
    darkOverridePosition = 0;
  }

  var key = allowedKeysAuto[e.keyCode];
  var requiredKey = autoOverride[autoOverridePosition];
  if (key == requiredKey) {
    autoOverridePosition++;
    if (autoOverridePosition == autoOverride.length) {
      fluid.auto();
      autoOverridePosition = 0;
    }
  } else {
    autoOverridePosition = 0;
  }

});



// a key map of allowed keys
var collapseKeysAuto = {
  38: 'up',
  40: 'down',
  121: 'f10'
};
var collapseOverride = ['up', 'up', 'down', 'down', 'f10'];
var collapseOverridePosition = 0;
document.addEventListener('keydown', function(e) {
  var key = collapseKeysAuto[e.keyCode];
  var requiredKey = collapseOverride[collapseOverridePosition];
  if (key == requiredKey) {
    collapseOverridePosition++;
    if (collapseOverridePosition == collapseOverride.length) {
      $('.section').addClass('collapse');fluid.init();
      collapseOverridePosition = 0;
    }
  } else {
    collapseOverridePosition = 0;
  }
});

// a key map of allowed keys
var emojiKeysAuto = {
  38: 'up',
  40: 'down',
  69: 'e'
};
var emojiOverride = ['up', 'up', 'down', 'down', 'e'];
var emojiOverridePosition = 0;
document.addEventListener('keydown', function(e) {
  var key = emojiKeysAuto[e.keyCode];
  var requiredKey = emojiOverride[emojiOverridePosition];
  if (key == requiredKey) {
    emojiOverridePosition++;
    if (emojiOverridePosition == emojiOverride.length) {
      twemoji.parse(document.body);
      emojiOverridePosition = 0;
    }
  } else {
    emojiOverridePosition = 0;
  }
});

//Twemoji
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
var twemoji=function(){"use strict";var twemoji={base:"https://twemoji.maxcdn.com/2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:fromCodePoint,toCodePoint:toCodePoint},onerror:function onerror(){if(this.parentNode){this.parentNode.replaceChild(createText(this.alt,false),this)}},parse:parse,replace:replace,test:test},escaper={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},re=/\ud83d[\udc68-\udc69](?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)(?:\ufe0f|\ud83c[\udffb-\udfff])\u200d[\u2640\u2642]\ufe0f|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|(?:\u002a)\ufe0f?\u20e3|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca-\udfcc]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd74\udd75\udd7a\udd90\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddd1-\udddd]|[\u261d\u26f7\u26f9\u270a-\u270d])(?:\ud83c[\udffb-\udfff]|)|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\u0023\u20e3|\u0030\u20e3|\u0031\u20e3|\u0032\u20e3|\u0033\u20e3|\u0034\u20e3|\u0035\u20e3|\u0036\u20e3|\u0037\u20e3|\u0038\u20e3|\u0039\u20e3|\ud800\udc00|\ud83c[\udc04\udccf\udd70\udd71\udd7e\udd7f\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude02\ude1a\ude2f\ude32-\ude3a\ude50\ude51\udf00-\udf21\udf24-\udf84\udf86-\udf93\udf96\udf97\udf99-\udf9b\udf9e-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcd-\udff0\udff3-\udff5\udff7-\udfff]|\ud83d[\udc00-\udc41\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfd\udcff-\udd3d\udd49-\udd4e\udd50-\udd67\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda4\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\udecb\udecd-\uded2\udee0-\udee5\udee9\udeeb\udeec\udef0\udef3-\udef8]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd4c\udd50-\udd6b\udd80-\udd97\uddc0\uddd0\uddde-\udde6]|[\u00a9\u00ae\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23e9-\u23f3\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26ce\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2705\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2728\u2733\u2734\u2744\u2747\u274c\u274e\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27a1\u27b0\u27bf\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299\ue50a]|(?:\u2639)(?:\ufe0f|(?!\ufe0e))/g,UFE0Fg=/\uFE0F/g,U200D=String.fromCharCode(8205),rescaper=/[&<>'"]/g,shouldntBeParsed=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,fromCharCode=String.fromCharCode;return twemoji;function createText(text,clean){return document.createTextNode(clean?text.replace(UFE0Fg,""):text)}function escapeHTML(s){return s.replace(rescaper,replacer)}function defaultImageSrcGenerator(icon,options){return"".concat(options.base,options.size,"/",icon,options.ext)}function grabAllTextNodes(node,allText){var childNodes=node.childNodes,length=childNodes.length,subnode,nodeType;while(length--){subnode=childNodes[length];nodeType=subnode.nodeType;if(nodeType===3){allText.push(subnode)}else if(nodeType===1&&!("ownerSVGElement"in subnode)&&!shouldntBeParsed.test(subnode.nodeName.toLowerCase())){grabAllTextNodes(subnode,allText)}}return allText}function grabTheRightIcon(rawText){return toCodePoint(rawText.indexOf(U200D)<0?rawText.replace(UFE0Fg,""):rawText)}function parseNode(node,options){var allText=grabAllTextNodes(node,[]),length=allText.length,attrib,attrname,modified,fragment,subnode,text,match,i,index,img,rawText,iconId,src;while(length--){modified=false;fragment=document.createDocumentFragment();subnode=allText[length];text=subnode.nodeValue;i=0;while(match=re.exec(text)){index=match.index;if(index!==i){fragment.appendChild(createText(text.slice(i,index),true))}rawText=match[0];iconId=grabTheRightIcon(rawText);i=index+rawText.length;src=options.callback(iconId,options);if(src){img=new Image;img.onerror=options.onerror;img.setAttribute("draggable","false");attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&!img.hasAttribute(attrname)){img.setAttribute(attrname,attrib[attrname])}}img.className=options.className;img.alt=rawText;img.src=src;modified=true;fragment.appendChild(img)}if(!img)fragment.appendChild(createText(rawText,false));img=null}if(modified){if(i<text.length){fragment.appendChild(createText(text.slice(i),true))}subnode.parentNode.replaceChild(fragment,subnode)}}return node}function parseString(str,options){return replace(str,function(rawText){var ret=rawText,iconId=grabTheRightIcon(rawText),src=options.callback(iconId,options),attrib,attrname;if(src){ret="<img ".concat('class="',options.className,'" ','draggable="false" ','alt="',rawText,'"',' src="',src,'"');attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&ret.indexOf(" "+attrname+"=")===-1){ret=ret.concat(" ",attrname,'="',escapeHTML(attrib[attrname]),'"')}}ret=ret.concat("/>")}return ret})}function replacer(m){return escaper[m]}function returnNull(){return null}function toSizeSquaredAsset(value){return typeof value==="number"?value+"x"+value:value}function fromCodePoint(codepoint){var code=typeof codepoint==="string"?parseInt(codepoint,16):codepoint;if(code<65536){return fromCharCode(code)}code-=65536;return fromCharCode(55296+(code>>10),56320+(code&1023))}function parse(what,how){if(!how||typeof how==="function"){how={callback:how}}return(typeof what==="string"?parseString:parseNode)(what,{callback:how.callback||defaultImageSrcGenerator,attributes:typeof how.attributes==="function"?how.attributes:returnNull,base:typeof how.base==="string"?how.base:twemoji.base,ext:how.ext||twemoji.ext,size:how.folder||toSizeSquaredAsset(how.size||twemoji.size),className:how.className||twemoji.className,onerror:how.onerror||twemoji.onerror})}function replace(text,callback){return String(text).replace(re,callback)}function test(text){re.lastIndex=0;var result=re.test(text);re.lastIndex=0;return result}function toCodePoint(unicodeSurrogates,sep){var r=[],c=0,p=0,i=0;while(i<unicodeSurrogates.length){c=unicodeSurrogates.charCodeAt(i++);if(p){r.push((65536+(p-55296<<10)+(c-56320)).toString(16));p=0}else if(55296<=c&&c<=56319){p=c}else{r.push(c.toString(16))}}return r.join(sep||"-")}}();