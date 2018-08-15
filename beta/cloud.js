/*!
Fluid UI Cloud Module v3.0.0 beta 3

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
  database.doc(fluid.config.cloud.cloudUser).get().then(function(doc) {
      if (doc.exists) {
        fluid.thisSite = doc.data()[fluid.config.cloud.cloudProject]
        if (fluid.thisSite !== undefined) {
          if (fluid.thisSite.splash.title !== "") {
            $("body").append(`
              <div class="cloud splash" title="` + fluid.thisSite.splash.title + `">
                ` + fluid.thisSite.splash.content + `
              </div>
              `)
              fluid.splash(".cloud.splash")
          }
          if (fluid.thisSite.toast.icon !== "") {
              fluid.toast(fluid.thisSite.toast.icon, fluid.thisSite.toast.text)
          }
        }
      }
    });
}

if (typeof fluid == "undefined") { if (!fluid.cloudEnabled) { throw "Error: Fluid Cloud requires Fluid UI 3 or above" }}
if (!fluid.config.cloud) {
$.getJSON($("link[rel=manifest]").attr("href"), function(data) {
  if (data.cloudProject == undefined) { throw "Error: Found web app manifest, but the cloudProject key is not set"} else { fluid.config.cloud = data; }
  fluid.cloudInit();
}).fail(function() {
    throw "Error: Could not access site manifest. Ensure that your site has a web app manifest and that it is linked properly, or that you have the fluid.config.cloud variable set."
  });
} else{
  fluid.cloudInit();
}
