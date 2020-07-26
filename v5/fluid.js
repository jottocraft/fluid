/*!
Fluid UI JavaScript Modules v5 beta 1
Copyright (c) 2017-2020 jottocraft. All rights reserved.
Licenced under the GNU General Public License v2.0 (https://github.com/jottocraft/fluid/blob/master/LICENSE)
 */

//Define global Fluid UI JS object
window.fluid = {
  screens: {},
  externalScreens: {},
  contextMenuOpen: false,
  dst: new Date().getTimezoneOffset() < Math.max(new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset(), new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset()),
  currentTheme: null,
  includedThemes: ["midnight", "tome"],
  themes: {
    tome: { //Theme ID (object key). Used in fluid.theme().
      name: "Tome", //Theme display name
      icon: "bookmark_border", //Theme icon
      base: "dark", //"light" for themes with dark text on a light background, "dark" for themes with light text on a dark background
      colors: {
        background: "#18161d", //Page background color

        text: "#efefef", //Primary text color
        lightText: "#8e82a2", //Slightly less important text color (somewhere between text and secText)
        secText: "#6a6179", //Secondary text color

        elements: "#322e3c", //Clickable elements color (buttons, switches, etc.)
        elementText: "#ffffff", //Clickable elements text color
        elementHover: "#403a50", //Clickable elements hover color
        switchHead: "#cccccc", //Switch head color

        inputColor: "#2d2935", //Color for input elements (like text boxes)
        blocks: "#1a1721", //Color for block elements
        
        sidebarBorder: "#655d6f", //Outline color used for main sidebar item
        sidebarActive: "#55476b", //Color used for selected sidebar item

        cards: "#14101b", //Color used for cards

        theme: "#5c3e7b", //Theme color used for active buttons, switches, etc. Can be overriden to match the site brand colors.
        themeText: "#f8f0ff", //Text color used for text on top of the theme color

        elementHighlight: "#ffffff12", //Color used for highlight effects on elements. Should be at 5-10% opacity.
        acrylic: "#282333cc", //Color used for acrylic (transparent) elements. Should have enough contrast to make its contents clearly visible (around 85% opacity). Must also be visible over the page background color.
        lightAcrylic: "#28233366", //Color used for elements that are usually outlined when a background image is set. Should be more transparent and easily distinguishable from normal acrylic.
        backgroundTint: "#18161db3" //Background tint color used when a background image is set. Should be at about 60-70% opacity.
      }
    },
    midnight: {
      name: "Midnight",
      icon: "brightness_3",
      base: "dark",
      colors: {
        background: "#000000",

        text: "#ffffff",
        lightText: "#c1c1c1",
        secText: "#676767",

        elements: "#1b1b1b",
        elementText: "#ffffff",
        elementHover: "#0e0e0e",
        switchHead: "#ffffff",

        inputColor: "#1b1b1b",
        blocks: "#040404",
        
        sidebarBorder: "#353535",
        sidebarActive: "#292929",

        cards: "#0e0e0e",

        theme: "#4c4c4c",
        themeText: "#ffffff",

        elementHighlight: "#ffffff12",
        acrylic: "#000000cc",
        lightAcrylic: "#00000066",
        backgroundTint: "#000000b3"
      }
    }
  },
  config: { //These configuration settings affects how built-in UI elements behave. Users can bypass these restrictions using the web inspector.
    autoLoad: true, //Load Fluid UI JavaScript features automatically on pageload. If this is false, fluid.onLoad must be ran manually.
    defaultTheme: null, //The theme ID to use by default
    allowThemeMenu: true, //Show the "More" button in the theme selector. This disables all color themes.
    allowBackgroundImages: true, //Allow the user to set background images.
    allowedThemes: true //An array of theme IDs to allow, or true to allow all themes. Ignored if allowThemeMenu is false. Dark, light, and auto are always allowed.
  }
};

//Apply fluid config
if (typeof fluidConfig == "object") {
  //Apply fluid config from fluidConfig if provided
  if (fluidConfig.config) {
    Object.assign(fluid.config, fluidConfig.config);
  }

  //Add themes from config if provided
  if (fluidConfig.themes) {
    var ids = Object.keys(fluidConfig.themes);
    if (!ids.includes("dark") && !ids.includes("light")) {
      fluid.themes = Object.assign(fluidConfig.themes, fluid.themes);
    }
  }
}

//Set auto theme parameters based on DST
if (fluid.dst) {
  // WITH Daylight Savings Time
  // Light: 5AM - 6PM Dark: 7PM - 4AM
  fluid.auto = { darkStartPM: 19, darkEndAM: 4 }
} else {
  // NO Daylight Savings Time
  // Light: 6AM - 5PM Dark: 6PM - 5AM
  fluid.auto = { darkStartPM: 18, darkEndAM: 5 }
}

//Add system-wide dark mode listener
window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
  if ((fluid.currentTheme == "system") && !fluid.unsetStart) {
    fluid.theme("system", true);
  } else if ((window.localStorage.getItem("fluidTheme") == undefined) && fluid.unsetStart) {
    console.log("[FLUID UI] Detected a change in system-wide theme")
    if (e.matches) {
      fluid.theme("system", true);
    } else {
      fluid.theme("auto", true);
    }
  }
});

//Listen for window resize
window.onresize = function (event) {
  fluid.exitContextMenu(true);
  if (window.innerWidth <= 900) {
    $("body").addClass("collapsedSidebar");
  } else {
    if (window.localStorage.getItem("fluidSidebarCollapsed") == "true") {
      $("body").addClass("collapsedSidebar");
    } else {
      $("body").removeClass("collapsedSidebar");
    }
  }
};

fluid.includedFlexThemes = ["water", "highContrast"]
fluid.includedFluidThemes = ["midnight", "tome", "nitro"]
fluid.theme = function (requestedTheme, temporary) {
  // TOGGLE THEME SHORTCUT
  if (requestedTheme == "toggle") {
    if ($("body").hasClass("dark")) {
      return fluid.theme("light");
    } else {
      return fluid.theme("dark");
    }
  }

  // GET CURRENT THEME -----------------------
  var currentTheme = null;

  if ((fluid.currentTheme == "auto") || (fluid.currentTheme == "system")) {
    if ($("body").hasClass("dark")) currentTheme = "dark";
    if ($("body").hasClass("light")) currentTheme = "light";
  } else {
    currentTheme = fluid.currentTheme;
  }

  if (requestedTheme == undefined) return currentTheme;
  // -----------------------------------------

  // APPLY REQUESTED THEME -------------------
  if (requestedTheme && !requestedTheme.startsWith("image.")) {
    //Clear color theme classes
    Object.keys(fluid.themes).forEach(theme => {
      $("body").removeClass(theme);
    });

    //Set theme classes
    if ((requestedTheme == "light") || (fluid.themes[requestedTheme] && (fluid.themes[requestedTheme].base == "light"))) {
      $("body").removeClass("dark").addClass("light").addClass(requestedTheme);
    }
    if ((requestedTheme == "dark") || (fluid.themes[requestedTheme] && (fluid.themes[requestedTheme].base == "dark"))) {
      $("body").removeClass("light").addClass("dark").addClass(requestedTheme);
    }

    //Create color theme style element
    if (!$("style#fluidTheme")[0]) {
      $("body").append(`<style id="fluidTheme"></style>`);
    }

    //Set color theme vars
    if (fluid.themes[requestedTheme]) {
      var themeVars = "";
      Object.keys(fluid.themes[requestedTheme].colors).forEach(color => {
        themeVars += `--${color}: ${fluid.themes[requestedTheme].colors[color]};`
      });
      $("style#fluidTheme").html(`body.${requestedTheme} { ${themeVars} }`);
    } else {
      $("style#fluidTheme").html("");
    }
  }


  if (requestedTheme == "auto") {
    //Auto (time-based) theme
    var hours = new Date().getHours();

    if (hours > fluid.auto.darkEndAM && hours < fluid.auto.darkStartPM) {
      $("body").removeClass("dark").addClass("light");
    } else {
      $("body").removeClass("light").addClass("dark");
    }

  } else if (requestedTheme == "system") {
    //Auto (system-based) theme

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      $("body").removeClass("light").addClass("dark");
    } else {
      $("body").removeClass("dark").addClass("light");
    }
  }

  //Apply theme image
  if (requestedTheme.startsWith("image.")) {
    var imageURL = requestedTheme.split("image.")[1];

    if (imageURL) {
      $("body").addClass("themeImage");
      document.body.style.setProperty("--themeImage", "url('" + imageURL + "')");
    } else {
      document.body.style.removeProperty("--themeImage");
      $("body").removeClass("themeImage");
    }
  }
  // -----------------------------------------

  // SAVE THEME PREF AND UPDATE UI -------------------
  if (requestedTheme && requestedTheme.startsWith("image.")) {
    fluid.currentThemeImage = requestedTheme.split("image.")[1];

    if (fluid.currentThemeImage) {
      if (temporary !== true) {
        localStorage.setItem("fluidThemeImageURL", fluid.currentThemeImage);
        localStorage.setItem("fluidThemeImage", true);
      }

      $("#themeMenu #fluidThemeImage").addClass("active");
      $("#themeMenu #fluidThemeImageInput").show();
      $("#themeMenu #fluidThemeImageInput input").val(fluid.currentThemeImage);
    } else {
      if (temporary !== true) localStorage.setItem("fluidThemeImage", false);
      fluid.currentThemeImage = null;

      $("#themeMenu #fluidThemeImage").removeClass("active");
      $("#themeMenu #fluidThemeImageInput").hide();
      $("#themeMenu #fluidThemeImageInput input").val("");
    }
  } else if (requestedTheme) {
    if (temporary !== true) {
      localStorage.setItem("fluidTheme", requestedTheme);
    }

    fluid.currentTheme = requestedTheme;
    $(".btns.themeSelector .btn, .list.themeMenu .item").removeClass("active");
    $(".btns.themeSelector .btn." + requestedTheme.replace("#", "") + ", .list.themeMenu .item." + requestedTheme.replace("#", "")).addClass("active");
    $("#themeMenu .themeSettings").hide();
    $("#themeMenu .themeSettings." + requestedTheme.replace("#", "")).show();

    if ((requestedTheme == "auto") || (requestedTheme == "system")) {
      $(".btns.autoSubTheme .btn").removeClass("active");
      $(".btns.autoSubTheme .btn." + requestedTheme).addClass("active");
    }

    if (!["auto", "system", "light", "dark"].includes(requestedTheme)) {
      $(".btns.themeSelector .btn.more").addClass("active");
    } else {
      $(".btns.themeSelector .btn.more").removeClass("active");
    }
  }
  // -----------------------------------------

  // OTHER THEME THINGS ----------------------
  //Load chroma
  if (fluid.chroma.on && fluid.chroma.themeLink) {
    fluid.chroma.static(getComputedStyle(document.body).getPropertyValue("--background"))
  }

  if ((requestedTheme !== currentTheme) && (currentTheme !== null)) {
    //emit theme change event if the theme has changed
    document.dispatchEvent(new CustomEvent('fluidTheme', { detail: requestedTheme }))
  }
  // -----------------------------------------

}

fluid.themeMenu = function () {
  fluid.generateWrapper();
  $("#themeMenu").html(`
    <i onclick="fluid.cards.close('#themeMenu')" class="material-icons close">close</i>

    <h3><i class="material-icons">format_paint</i> Themes</h3>

    <div class="grid flex">

      <div style="max-width: 400px; --size: 400px;" class="item">
        <div class="themeMenu list select">
          <div onclick="fluid.theme('auto')" class="item auto system"><i class="material-icons">brightness_auto</i>Auto</div>
          <div onclick="fluid.theme('light')" class="item light"><i class="material-icons">brightness_high</i>Light</div>
          <div onclick="fluid.theme('dark')" class="item dark"><i class="material-icons">brightness_low</i>Dark</div>
          ${Object.keys(fluid.themes).map(k => {
    var theme = fluid.themes[k];
    if (fluid.config.allowedThemes === true ? false : !fluid.config.allowedThemes.includes(k)) return ``;
    return `<div onclick="fluid.theme('${k}')" class="item ${k}"><i class="material-icons">${theme.icon}</i>${theme.name}</div>`
  }).join("")}
        </div>
      </div>

      <div style="--size: 400px; padding: 20px;" class="item">
        <div style="display: none;" class="themeSettings auto system">
          <h5><i class="material-icons">miscellaneous_services</i> Auto Theme</h5>

          <p>You can change how a theme is automatically selected below. In order to match your system theme, you must be using a supported browser and OS.</p>

          <div class="btns row small autoSubTheme">
            <button onclick="fluid.theme('auto')" class="btn auto"><i class="material-icons">schedule</i> Time-based</button>
            <button onclick="fluid.theme('system')" class="btn system"><i class="material-icons">computer</i> System theme-based</button>
          </div>
        </div>

        ${fluid.config.allowBackgroundImages ? `
          <div>
            <h5><i class="material-icons">insert_photo</i> Background Image</h5>

            <div id="fluidThemeImage" class="switch"><span class="head"></span></div>
            <div class="label">Use a background image</div>

            <br /><br />

            <div style="display: none;" id="fluidThemeImageInput">
              <i class="inputIcon material-icons">link</i>
              <input class="inputIcon" placeholder="Background Image URL" />
            </div>
          </div>
        ` : ``}
      </div>

    </div>
  `);

  $(".switch#fluidThemeImage").click(e => {

    $(".switch#fluidThemeImage").toggleClass("active");

    if ($(".switch#fluidThemeImage").hasClass("active")) {

      if (window.localStorage.getItem("fluidThemeImageURL")) {
        $("#fluidThemeImageInput input").val(window.localStorage.getItem("fluidThemeImageURL"));
        $("#fluidThemeImageInput input").change();
      } else {
        $("#fluidThemeImageInput input").val("");
      }

      $("#fluidThemeImageInput").show();

    } else {
      fluid.theme("image.");
    }

  });

  $("#fluidThemeImageInput input").change(e => {
    if ($("#fluidThemeImageInput input").val()) {
      fluid.theme("image." + $("#fluidThemeImageInput input").val());
    } else {
      window.localStorage.removeItem("fluidThemeImageURL");
      fluid.theme("image.");
    }
  });

  if (fluid.currentThemeImage) {
    $("#themeMenu #fluidThemeImage").addClass("active");
    $("#themeMenu #fluidThemeImageInput").show();
    $("#themeMenu #fluidThemeImageInput input").val(fluid.currentThemeImage);
  }

  $(".list.themeMenu .item." + fluid.currentTheme).addClass("active");
  $("#themeMenu .themeSettings." + fluid.currentTheme).show();

  if ((fluid.currentTheme == "auto") || (fluid.currentTheme == "system")) {
    $(".btns.autoSubTheme .btn." + fluid.currentTheme).addClass("active");
  }

  fluid.cards("#themeMenu");
}

fluid.get = function (key) {
  return window.localStorage.getItem(key);
}
fluid.set = function (key, val, trigger) {
  if (key.startsWith("pref-")) {
    if ((String(val) == "true") || (String(val) == "false") || (val == undefined)) {
      //boolean value
      if (val == undefined) {
        if (fluid.get(key) !== null) {
          //toggle boolean value
          if (fluid.get(key) == "true") { val = false; } else { val = true; }
        } else {
          //no value to toggle, get value from switch activity
          val = !$("." + key).hasClass("active");
        }
      }
      if (String(val) == "true") {
        $(".switch." + key + ", .btn." + key + ", .checkbox." + key).addClass("active");
      } else {
        $(".switch." + key + ", .btn." + key + ", .checkbox." + key).removeClass("active");
      }
    } else {
      //value pref
      $(".btns." + key + " .btn, .radio." + key + " .checkbox").removeClass("active")
      $(".btns." + key + " .btn." + val + ", .radio." + key + " .checkbox." + val).addClass("active")
    }
    if (trigger == undefined) window.localStorage.setItem(key, val);
    if (trigger !== "load") {
      document.dispatchEvent(new CustomEvent(key, { detail: val }));
    }
  } else {
    console.error("Error: Calling fluid.set with invalid prefrence name. Make sure the name of your prefrence starts with 'pref-'. See https://fluid.jottocraft.com/#input-prefs.")
  }
}

window.addEventListener('storage', function (e) {
  if (e.key.startsWith("pref-")) {
    fluid.set(e.key, e.newValue, true)
  }
  if (e.key == "fluidTheme") {
    fluid.theme(e.newValue, true)
  }
});

fluid.onLoad = function () {
  //NOTE: fluid.onLoad should ONLY be loaded ON PAGE LOAD. Use fluid.init to initialize elements added after page load

  //Unsupported browser alert
  if (window.navigator.userAgent.includes('MSIE ') || window.navigator.userAgent.includes('Trident/')) {
    alert("Internet Explorer is not supported. Please upgrade to a modern browser like Microsoft Edge or Google Chrome.")
    throw "error: unsupported browser";
  }

  //Load initial prefrences
  //NOTE: DO NOT add a prefrence element after page load. It is extremely difficult to maintain good performance while making sure every prefrence element is on the same page
  for (var i = 0; i < Object.keys(window.localStorage).length; i++) {
    if (Object.keys(window.localStorage)[i].startsWith("pref-")) {
      fluid.set(Object.keys(window.localStorage)[i], window.localStorage.getItem(Object.keys(window.localStorage)[i]))
    }
  }

  //check initial user theme prefrence
  fluid.unsetStart = false;
  if (window.localStorage.getItem("fluidTheme") == null) {
    var unset = fluid.theme();
    if (unset == null) {
      fluid.unsetStart = true;
    }
  }

  //generate wrapper
  fluid.generateWrapper();

  fluid.init();
}

fluid.init = function () {
  fluid.themePageList = [];
  $(".btns.row.themeSelector").html(`
   <button onclick="fluid.theme('auto')" class="btn themeWindow auto system lightBox"><div class="autoSplit"></div><div class="themeName"><i class="material-icons">brightness_auto</i> Auto</div></button>
   <button onclick="fluid.theme('light')" class="btn themeWindow light lightBox"><div class="themeName"><i class="material-icons">brightness_high</i> Light</div></button>
   <button onclick="fluid.theme('dark')" class="btn themeWindow dark darkBox"><div class="themeName"><i class="material-icons">brightness_low</i> Dark</div></button>
   ${fluid.config.allowThemeMenu ? `<button onclick="fluid.themeMenu()" class="btn more"><div class="themeName"><i class="material-icons">more_horiz</i> More</div></button>` : ``}
  `);
  $(".themeWindow").prepend(`<div class="demoSecText"></div><div class="demoSecText short"></div><div class="demoBtn"><div class="demoBtnText"></div></div><div class="demoSwitch"><div class="demoHead"></div></div>`)
  $(".themeSelector").attr("themePage", 0)
  for (var i = 0; i < ($('.themeSelector').children().length - 2); i++) {
    if ($('.themeSelector .s' + i).children().length) fluid.themePageList.push(i);
  }


  if (window.localStorage.getItem("fluidTheme") !== null) {
    fluid.theme(window.localStorage.getItem("fluidTheme"), true)
  } else if (fluid.config.defaultTheme) {
    fluid.theme(fluid.config.defaultTheme, true);
  } else {
    if ((fluid.theme() == null) && fluid.unsetStart) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        fluid.theme("system", true);
      } else {
        fluid.theme("auto", true);
      }
    }
  }

  if (window.localStorage.getItem("fluidThemeImage") == "true") {
    if (window.localStorage.getItem("fluidThemeImageURL")) {
      fluid.theme("image." + window.localStorage.getItem("fluidThemeImageURL"));
    } else {
      window.localStorage.setItem("fluidThemeImage", false);
    }
  }

  if (window.localStorage.getItem("fluidSidebarCollapsed") == "true") {
    $("body").addClass("collapsedSidebar");
  }

  if (!$("body").hasClass("notwemoji")) {
    $.getScript("https://twemoji.maxcdn.com/v/latest/twemoji.min.js", function () {
      if (typeof twemoji !== "undefined") twemoji.parse(document.body);
    })
  }

  $(".btns:not(.themeSelector) .btn:not(.manual):not([init='true']), .list.select .item:not(.manual):not([init='true']), .sidenav .item:not(.manual):not([init='true']), .sidebar .item:not(.manual):not([init='true']), .radio .checkbox:not([init='true'])").click(function (event) {
    if (!($(this).parent().attr("class") || "").includes("pref-") && !($(this).parents(".radio").attr("class") || "").includes("pref-")) {
      //not a pref
      if ($(this).parent().hasClass("multiple")) {
        $(this).toggleClass("active")
      } else if ($(this).parents(".radio")[0]) {
        //radio button
        $(this).parent().siblings().children(".checkbox").removeClass("active")
        $(this).addClass("active")
      } else {
        $(this).siblings().removeClass("active")
        $(this).addClass("active")
      }
    }
    $(this).attr("init", "true")
  });

  $(".sidebar .collapse:not([init='true'])").click(function () {
    $('body').toggleClass('collapsedSidebar');
    if ($('body').hasClass('collapsedSidebar')) {
      window.localStorage.setItem("fluidSidebarCollapsed", "true");
    } else {
      window.localStorage.setItem("fluidSidebarCollapsed", "false");
    }
    $(this).attr("init", "true");
  })

  fluid.shouldSwitch = true;
  $(".switch:not([init='true']), .checkbox:not([init='true'])").click(function (event) {
    if (!$(this).parents(".radio")[0]) {
      //not a radio button
      if (fluid.shouldSwitch && !$(this).attr("class").includes("pref-")) {
        //not a pref
        $(this).toggleClass("active");
        fluid.shouldSwitch = false;
        setTimeout(() => fluid.shouldSwitch = true, 400)
      }
      $(this).attr("init", "true")
    }
  });

  $("#activecontextmenu:not([init='true'])").contextmenu(function (event) {
    event.preventDefault();
    $(this).attr("init", "true")
  });

  $(".btn:not([init='true']), .nav a:not([init='true']), .nav li:not([init='true'])").contextmenu(function (event) {
    fluid.contextMenu(event.target, event)
    $(this).attr("init", "true")
  });

  $(".contextmenu.list .item:not([init='true'])").click(function (event) {
    fluid.exitContextMenu(false);
    $(this).attr("init", "true")
  });

  $("div.nav.active li:not([init='true'])").click(function (event) {
    $(this).siblings().removeClass("active")
    $(this).addClass("active")
    $(this).attr("init", "true")
  });

  $(".section.collapse .header:not([init='true'])").click(function (event) {
    if ($(this).parent().hasClass("collapsed")) {
      if ($(this).parent().hasClass("one")) {
        $(this).parent().siblings().addClass("collapsed");
      }
    }
    $(this).parent().toggleClass("collapsed");
    $(this).attr("init", "true")
  });

  if (fluid.expBeh) {
    //experimental behavior
    $(".list .item:not([init='true']), a:not([init='true'])").contextmenu(function (event) {
      event.preventDefault(); fluid.bounceBack(event.target);
      $(this).attr("init", "true")
    });
  }
}

fluid.screen = function (requestedID, param, isBack) {

  //Function to load screen with ID
  function loadScreen(screenID, param, entry) {
    if (typeof fluid.screens[screenID] == "string") {
      //external screen
      if (fluid.externalScreens[screenID]) {
        //external screen already loaded
        fluid.externalScreens[screenID](param, entry);
      } else {
        //external screen not yet loaded
        $.getScript(fluid.screens[screenID], () => {
          if (fluid.externalScreens[screenID]) {
            fluid.externalScreens[screenID](param, entry);
          } else {
            console.error("[FLUID UI] Error: The scriptURL for screen '" + screenID + "' does not define fluid.externalScreens['" + screenID + "']");
          }
        });
      }
    } else {
      fluid.screens[screenID](param, entry);
    }
  }

  //mark screens as enabled for back button listener
  fluid.screensEnabled = true;

  //get url screen
  var urlScreen = null, urlParam = null;
  if (document.location.hash.startsWith("#/")) {
    if (document.location.hash.split("/")[1]) {
      urlScreen = document.location.hash.split("/")[1].split(".")[0];
      urlParam = document.location.hash.split("/")[1].split(".")[1];
    }
  }

  //update screen
  if (fluid.screens[requestedID]) {
    if (requestedID == fluid.defaultScreen ? param : true) {
      document.location.hash = "#/" + requestedID + (param ? "." + param : "");
    } else {
      history.replaceState({}, '', "#");
    }

    loadScreen(requestedID, param);
  } else {
    //load default screen because screen was not found or requestedID was undefined
    if (fluid.screens[urlScreen]) {
      loadScreen(urlScreen, urlParam, !isBack && (requestedID == undefined));
    } else if (fluid.defaultScreen && (isBack ? (!document.location.hash || (document.location.hash == "#")) : true)) {
      loadScreen(fluid.defaultScreen, param, requestedID == undefined);
    } else if (!isBack) {
      console.error("[FLUID UI] fluid.screen was called, but no screen could be found. Make sure you have defined the screen you are trying to navigate to or the default screen.");
    }
  }
}

window.onhashchange = function () {
  if (fluid.screensEnabled) {
    fluid.screen(undefined, undefined, true);
  }
}

fluid.tcoh = function () {
  $("body").addClass("litleceser");
  $('img').attr('src', 'https://i.imgur.com/uhZT30E.png');
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = 'https://i.imgur.com/uhZT30E.png';
  document.getElementsByTagName('head')[0].appendChild(link);
  document.title = "LITTLE CESERS HOT N READY FOR ONLY FIVE DOLALARS EXTRA MOST BESTEST IS ONLY SIX FOR EXTRA CHEESE AND PEPERONI AND THE NATIONS BEST PRICE"
}

fluid.chroma = { on: false, themeLink: false };
fluid.chroma.session = {};
fluid.chroma.supported = function (cb) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:54235/razer/chromasdk',
    success: function () {
      if (cb) cb(true);
    },
    error: function (error) {
      if (cb) cb(false);
    }
  })
}
fluid.chroma.init = function (profile, cb) {
  $.ajax({
    type: "POST",
    url: 'http://localhost:54235/razer/chromasdk',
    dataType: 'json',
    contentType: 'application/json',
    data: `{
          "title": "` + profile.title + `",
          "description": "` + profile.description + `",
          "author": {
              "name": "` + profile.author + `",
              "contact": "` + (profile.domain ? profile.domain : document.location.hostname) + `"
          },
          "device_supported": ` + JSON.stringify([
      "keyboard",
      "mouse",
      "headset",
      "mousepad",
      "keypad",
      "chromalink"]) + `,
          "category": "application"
      }`,
    success: function (res) {
      fluid.chroma.session = res
      fluid.chroma.heartbeatInterval = setInterval(function () {
        $.ajax({
          type: "PUT",
          url: fluid.chroma.session.uri + "/heartbeat",
          dataType: 'json',
          contentType: 'application/json'
        })
      }, 10000)
      setTimeout(function () {
        $("body").attr("onunload", "fluid.chroma.disable()");
        fluid.chroma.on = true;
        if (cb) cb();
      }, 2000)
    }
  })
}
fluid.chroma.disable = function (cb) {
  if (fluid.chroma.on) {
    $.ajax({
      type: "DELETE",
      url: fluid.chroma.session.uri,
      dataType: 'json',
      contentType: 'application/json',
      success: function () {
        fluid.chroma.on = false;
        fluid.chroma.session = {};
        window.clearInterval(fluid.chroma.heartbeatInterval);
        if (cb) cb();
      }
    })
  }
}
fluid.chroma.effect = function (color, array) {
  //color: static color used for everything except for keyboards
  //array: 2d array for custom effect for keyboards
  fluid.chroma.static(color, true);

  //color to bgr integer
  convertedArray = [];
  for (var i = 0; i < array.length; i++) {
    convertedArray.push([])
    for (var ii = 0; ii < array[i].length; ii++) {
      if (array[i][ii] == 0) {
        convertedArray[i].push(0)
      } else {
        if (array[i][ii] == null) {
          var rgb = tinycolor(color).toRgb();
          convertedArray[i].push(parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16))
        } else {
          var rgb = tinycolor(array[i][ii]).toRgb();
          convertedArray[i].push(parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16))
        }
      }
    }
  }

  $.ajax({
    type: "PUT",
    url: fluid.chroma.session.uri + "/keyboard",
    dataType: 'json',
    contentType: 'application/json',
    data: `{
      "effect": "CHROMA_CUSTOM",
      "param": ` + JSON.stringify(convertedArray) + `
    }`
  })
}
fluid.chroma.static = function (color, exKeyboard) {
  var rgb = tinycolor(color).toRgb();

  function static(endpoint) {
    $.ajax({
      type: "PUT",
      url: fluid.chroma.session.uri + endpoint,
      dataType: 'json',
      contentType: 'application/json',
      data: `{
      "effect": "CHROMA_STATIC",
      "param": {
          "color": ` + parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16) + `
      }
    }`
    })
  }
  if (exKeyboard == undefined) static("/keyboard");
  static("/mouse");
  static("/mousepad");
  static("/headset");
  static("/chromalink");
  static("/keypad");
}

fluid.contextMenu = function (target, event) {
  var element = target
  if ($(element).children("a").length == 1) element = $(element).children("a").children("i").get(0);
  if ($(element).siblings(".contextmenu").length == 1) {
    if (event) event.preventDefault();
    if (!fluid.contextMenuOpen) {
      $(element).addClass("outOfContext")
      document.body.style.overflow = "hidden";
      $("body").css("padding-right", "5px");
      fluid.contextMenuOpen = true;
      fluid.generateWrapper();

      var bodyRect = document.body.getBoundingClientRect(),
        elemRect = element.getBoundingClientRect(),
        left = elemRect.left - bodyRect.left - 5,
        top = elemRect.top - bodyRect.top;

      $("#activecontextmenu").css("left", left)
      $("#activecontextmenu").css("top", top)
      $("#activecontextmenu").css("display", "inline-block")
      $("#activecontextmenu").css("background", "transparent")
      $(element).parent().css("height", $(element).parent().height());
      $(element).parent().css("width", $(element).parent().width());
      $(element).parent().css("vertical-align", "middle");
      if ($(element).hasClass("material-icons")) {
        $(element).parent().parent().css("width", "44px")
        $(element).parent().parent().css("height", "44px")
        $("#pagewrapper, .sidebar, .navbar").attr("onclick", "fluid.exitContextMenu(true);");
      } else {
        $("#pagewrapper, .sidebar, .navbar").attr("onclick", "fluid.exitContextMenu(false);");
      }
      $(element).parent().addClass("contextMenuSource")
      if ($(element).hasClass("active")) { $(element).css("background-color", "#207bdf") } else {
        if ($("body").hasClass("outline")) {
          if ($("body").hasClass("dark")) { $(element).css("border", "1px solid #16181a") } else { $(element).css("border", "1px solid #dddddd") }
        }
        else { if ($("body").hasClass("dark")) { element.style = "background-color: var(--darker, #16181a);"; } else { element.style = "background-color: var(--darker, #dddddd);"; } }
      }
      $(element).siblings(".contextmenu").css("display", "inline-block");
      $(element).siblings(".contextmenu").css("margin-left", "-20px")
      $(element).siblings(".contextmenu").css("margin-right", "10px")
      $(element).parent().children().appendTo("#activecontextmenu");
      $("#activecontextmenu").css("width", $("body").width() - Number($("#activecontextmenu").css("left").slice(0, -2)))
      if ($(element).siblings('.contextmenu').css("right").charAt(0) == "-") {
        $(element).siblings('.contextmenu').css("right", 0)
        $(element).siblings(".contextmenu").css("margin-top", $(element).height() + 3)
      } else {
        $(element).siblings(".contextmenu").css("margin-top", $(element).height())
      }
      fluid.blur();
    }
  } else {
    if (fluid.expBeh) {
      event.preventDefault();
      fluid.bounceBack(element);
    }
  }
}

$(document).ready(function () {
  if (fluid.config.autoLoad) {
    fluid.onLoad();
  }
});

fluid.exitContextMenu = function (force) {
  if (fluid.contextMenuOpen) {
    fluid.unblur();
    $("#activecontextmenu").children(".contextmenu").css("display", "none");
    if (force) { wait = 0; } else { wait = 300; }
    setTimeout(function () {
      $("#activecontextmenu").children().appendTo(".contextMenuSource")
      $(".contextMenuSource").children(".btn, i").css("background-color", "");
      $(".contextMenuSource").children(".btn, i").css("border", "");
      $(".contextMenuSource").children(".btn, i").removeClass("outOfContext")
      $(".contextMenuSource").css("height", "");
      $("#pagewrapper, .sidebar, .navbar").attr("onclick", "");
      $(".contextMenuSource").removeClass("contextMenuSource")
      fluid.contextMenuOpen = false;
      document.body.style.overflow = "";
      $("body").css("padding-right", "");
    }, wait);
  }
}

fluid.bounceBack = function (ele) {
  if (!fluid.contextMenuOpen) {
    fluid.contextMenuOpen = true;

    fluid.blur();
    document.body.style.overflow = "hidden";
    $("body").css("padding-right", "5px");
    setTimeout(function () {
      fluid.unblur();
      document.body.style.overflow = "";
      $("body").css("padding-right", "");
    }, 200)
  }
}

fluid.blur = function () {
  $("#pagewrapper, .sidebar, .navbar").addClass("blur")
}

fluid.unblur = function () {
  $("#pagewrapper, .sidebar, .navbar").removeClass("blur")
}

/* Cards */
menuopen = false;
fluid.cards = function (element, stayOpen) {
  var focus = $(element).hasClass('focus');
  if (focus) {
    fluid.generateWrapper();
    $(element).css("top", "50px");
    if (menuopen) {
      fluid.cards.close(".focus");
      fluid.blur();
      document.body.style.overflow = "hidden"
      $("body").css("padding-right", "5px");
      $(element).addClass('container');
      $(element).removeClass('close');
      if (stayOpen !== "stayOpen") { setTimeout(function () { $("#pagewrapper, .sidebar, .navbar").attr("onclick", "fluid.card.close('" + element + "');"); }, 100) }
    } else {
      fluid.blur();
      document.body.style.overflow = "hidden"
      $("body").css("padding-right", "5px");
      $(element).addClass('container');
      $(element).removeClass('close');
      if (stayOpen !== "stayOpen") { setTimeout(function () { $("#pagewrapper, .sidebar, .navbar").attr("onclick", "fluid.cards.close('.focus');"); }, 100) }
    }
  } else {
    $("#pagewrapper, .sidebar, .navbar").attr("onclick", "");
    if (menuopen) {
      fluid.cards.close();
      $(element).removeClass('close');
    } else {
      menuopen = true;
      $(element).removeClass('close');
    }
  }
}
fluid.modal = function (element) {
  fluid.cards(element, true)
}
fluid.toast = function (title, text, icon, color) {
  fluid.generateWrapper();
  $("#activeAlert").hide();
  $("#activeAlert").html(`<div class="toast">
   <i style="color: ` + (color ? color : "var(--text)") + `" class="material-icons">` + icon + `</i>
   <i class="material-icons close" onclick="fluid.exitToast()">close</i>
   <div>
    <h5>` + (title || "") + `</h5>
    <p>` + (text || "") + `</p>
   </div>
  </div>`)
  $("#activeAlert").show("fade");
}
fluid.alert = function (title, body, icon, actions, color) {
  if (title && !body) {
    body = title;
    title = "Alert";
    icon = "notifications";
  }
  fluid.generateWrapper();
  $("#activeAlert").hide();
  $("#activeAlert").html(`<div class="card alert">
  <i class="material-icons close" onclick="fluid.exitAlert()">close</i>

   <i style="color: ` + (color ? color : "var(--text)") + `" class="material-icons">` + icon + `</i>
   <h5>` + title + `</h5>
   <div class="body">
    <div>` + body + `</div>
   </div>
   ` + (actions ? `<div class="footer">` + actions.map((action) => {
    return `<button onclick="fluid.exitAlert();` + (action.action || "") + `" class="btn">
     ` + (action.icon ? `<i class="material-icons">` + action.icon + `</i> ` : "") + action.name + `
     </button>`
  }).join("") + `</div>` : "") + `
  </div>`)
  fluid.wrapperBlur = $("#pagewrapper").hasClass("blur");
  fluid.blur();
  $('.card.focus:not(.close)').addClass("blur");
  if (fluid.wrapperBlur) {
    $("#activeAlert").show();
  } else {
    $("#activeAlert").show("fade");
  }
}
fluid.exitToast = function () {
  $("#activeAlert").hide("fade");
}
fluid.exitAlert = function () {
  if (fluid.wrapperBlur) {
    $("#activeAlert").hide();
  } else {
    $("#activeAlert").hide("fade");
    fluid.unblur();
  }
  $('.card.focus:not(.close)').removeClass("blur");
}
fluid.cards.close = function (element) {
  $(element).addClass('close');
  fluid.unblur();
  document.body.style.overflow = ""
  $("body").css("padding-right", "");
  $("#pagewrapper, .sidebar, .navbar").attr("onclick", "");
  menuopen = false;
}
fluid.generateWrapper = function () {
  if (!$("#pagewrapper").length) {
    $("body").wrapInner("<div id='pagewrapper'></div>");
    $("#pagewrapper").after(`<div style="position: fixed; left: 0px; width: 100%; z-index: 99999;"><div id='focuscardwrapper' class='container'></div></div>`);
    $("#pagewrapper").after("<div id='activecontextmenu' style='position:absolute'></div>");
    $("#pagewrapper").after("<div id='themeMenu' class='focus card close' style='z-index: 15; height: 100vh;'></div>");
    $("#pagewrapper").after("<div id='activeAlert' style='z-index: 99;'></div>");
    $("#pagewrapper").after("<div id='splashscreen' style='display:none;margin-top: 100px;' class='container'><h1 style='font-size:5rem;' id='splashscreenname'></h1><div id='splashscreencnt'></div></div>");
    $(".card.focus").appendTo("#focuscardwrapper");
    $(".splash").appendTo("#splashscreencnt");
    $(".sidebar").appendTo("body");
    $(".navbar").appendTo("body");
  }
}
fluid.splash = function (element) {
  document.body.style.overflow = "hidden";
  $(element).show();
}
fluid.unsplash = function () {
  document.body.style.overflow = "";
  $(".splashScreen").hide();
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



document.addEventListener('keydown', function (e) {
  var key = allowedKeys[e.keyCode];
  var requiredKey = darkOverride[darkOverridePosition];
  if (key == requiredKey) {
    darkOverridePosition++;
    if (darkOverridePosition == darkOverride.length) {
      fluid.theme("toggle");
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
      fluid.theme("auto");
      autoOverridePosition = 0;
    }
  } else {
    autoOverridePosition = 0;
  }

});