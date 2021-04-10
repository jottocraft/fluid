//Import modules
const { minify } = require("terser");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const package = require("./package.json");

const glob = require("glob");
const mkdirp = require('mkdirp');
const rimraf = require("rimraf");
const cssnano = require("cssnano");
const ncp = require('ncp').ncp;

const hasDevRelease = fs.existsSync("dev/fluid.js") && fs.existsSync("www/dev") && package.devVersion;

//Delete existing output folders
rimraf.sync("./build/*");
rimraf.sync("./cdn/*");

//Run functions
minifyCSS();

//[1/4] Minify CSS
function minifyCSS() {
    console.log("\n[1/4] Minifying CSS...");

    //Minify files function
    function minifyFile(filePath) {
        //Minify CSS file at filePath
        return cssnano.process(fs.readFileSync(filePath, "utf8"), {
            from: filePath,
            to: filePath,
            map: { inline: false, sourcesContent: true }
        }, {
            preset: 'default'
        }).then(function (result) {
            //Make parent folder
            mkdirp.sync(path.join("build", filePath, ".."));

            //Write output files
            fs.writeFileSync(path.join("build", filePath), result.css, "utf8");
            fs.writeFileSync(path.join("build", filePath + ".map"), result.map.toString(), "utf8");
        });
    }

    //Minify files
    var promises = [];

    glob.sync("src/**/*.css").forEach(file => {
        promises.push(minifyFile(file));
    });

    if (hasDevRelease) {
        glob.sync("dev/**/*.css").forEach(file => {
            promises.push(minifyFile(file));
        });
    }

    Promise.all(promises).then(() => {
        console.log("[1/4] Done");
        minifyJS();
    })
}

//[2/4] Minify JavaScript
function minifyJS() {
    console.log("\n[2/4] Minifying JavaScript...");

    //Minify files function
    function minifyFile(filePath) {
        //Run terser
        return minify({
            [filePath.split("/").pop()]: fs.readFileSync(filePath, "utf8")
        }, {
            sourceMap: {
                url: filePath.split("/").pop() + ".map",
                includeSources: true
            }
        }).then((results) => {
            //Make parent folder
            mkdirp.sync(path.join("build", filePath, ".."));

            //Write output files
            fs.writeFileSync(path.join("build", filePath), results.code, "utf8");
            fs.writeFileSync(path.join("build", filePath + ".map"), results.map, "utf8");
        });
    }

    //Minify files
    var promises = [];
    glob.sync("src/**/*.js").forEach(file => {
        promises.push(minifyFile(file));
    });

    if (hasDevRelease) {
        glob.sync("dev/**/*.js").forEach(file => {
            promises.push(minifyFile(file));
        });
    }

    Promise.all(promises).then(() => {
        console.log("[2/4] Done");
        copyStatic();
    });
}

//[3/4] Copy static files
function copyStatic() {
    console.log("\n[3/4] Copying static files...");

    //Make output folders if they don't already exist
    mkdirp.sync("build");
    mkdirp.sync("cdn");

    //Copy CDN files
    var majorRelease = "v" + package.version.split(".")[0];
    mkdirp.sync("cdn/public/fluid/build/" + majorRelease + "/" + package.version);
    mkdirp.sync("cdn/public/fluid/build/" + majorRelease + "/latest");
    ncp("build/src", "cdn/public/fluid/build/" + majorRelease + "/" + package.version, function () {
        ncp("build/src", "cdn/public/fluid/build/" + majorRelease + "/latest", function () {
            if (hasDevRelease) {
                //Copy CDN files
                var majorDevRelease = "v" + package.devVersion.split(".")[0];
                mkdirp.sync("cdn/public/fluid/build/" + majorDevRelease + "/" + package.devVersion);
                mkdirp.sync("cdn/public/fluid/build/" + majorDevRelease + "/latest");
                ncp("build/dev", "cdn/public/fluid/build/" + majorDevRelease + "/" + package.devVersion, function () {
                    ncp("build/dev", "cdn/public/fluid/build/" + majorDevRelease + "/latest", function () {
                        //Copy www
                        ncp("www", "build", function () {
                            console.log("[3/4] Done");
                            generateDocs();
                        });
                    });
                });
            } else {
                //Copy www
                ncp("www", "build", function () {
                    console.log("[3/4] Done");
                    generateDocs();
                });
            }
        });
    });
}

//[4/4] Generate documentation
function generateDocs() {
    console.log("\n[4/4] Generating documentation...");

    //Make build folder if it doesn't already exist
    mkdirp.sync("./build/docs");

    //Generate docs (stable)
    var cp = exec("node ./node_modules/jsdoc/jsdoc.js -r src -d ./build/docs/reference -c ./reference/jsdoc.conf.json -t ./node_modules/foodoc/template -R ./reference/README.md", function (e, o) {
        if (e) console.error(e);
        if (o) console.log(o);
    });

    //Listen for exit
    cp.addListener("close", function () {
        if (hasDevRelease) {
            //Generate docs (dev)
            var cpDev = exec("node ./node_modules/jsdoc/jsdoc.js -r dev -d ./build/dev/reference -c ./reference/jsdoc.conf.json -t ./node_modules/foodoc/template -R ./reference/README.md", function (e, o) {
                if (e) console.error(e);
                if (o) console.log(o);
            });

            //Listen for exit
            cpDev.addListener("close", function () {
                console.log("[4/4] Done");
                finish();
            });
        } else {
            console.log("[4/4] Done");
            finish();
        }
    });
}

function finish() {
    console.log("\nAll build tasks have finished");
}