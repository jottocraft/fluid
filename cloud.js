// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAzvQw_Pzt2WD9xge88VueFsqxfN-pLYkw",
    authDomain: "fluid-ui.firebaseapp.com",
    databaseURL: "https://fluid-ui.firebaseio.com",
    projectId: "fluid-ui",
    storageBucket: "fluid-ui.appspot.com",
    messagingSenderId: "444063761692"
  };
  firebase.initializeApp(config);
  var firestore = firebase.firestore();
  var database = firestore.collection("Sites");

fluid.cloudInit = function() {
  console.log("Starting Fluid Cloud")
  database.doc(fluid.cloudConfig.cloudUser).get().then(function(doc) {
      if (doc.exists) {
        fluid.thisSite = doc.data()[fluid.cloudConfig.cloudProject]
        if (fluid.thisSite !== undefined) {
          if (fluid.thisSite.splash.title !== "") {
            $("body").append(`
              <div class="cloud splash" title="` + fluid.thisSite.splash.title + `">
                ` + fluid.thisSite.splash.content + `
              </div>
              `)
              fluid.splash(".cloud.splash")
          }
        }
      }
    });
}

if (typeof fluid == "undefined") { if (!fluid.cloudEnabled) { throw "Error: Fluid Cloud requires Fluid UI 3 or later" }}
if (!fluid.cloudConfig) {
$.getJSON($("link[rel=manifest]").attr("href"), function(data) {
  if (data.cloudProject == undefined) { throw "Error: Found web app manifest, but the cloudProject key is not set"} else { fluid.cloudConfig = data; }
  fluid.cloudInit();
}).fail(function() {
    throw "Error: Could not access site manifest. Ensure that your site has a web app manifest and that it is linked properly, or that you have the fluid.cloudConfig variable set."
  });
} else{
  fluid.cloudInit();
}
