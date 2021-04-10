const express = require('express');
const app = express();

var port = 1222;

//Check CLI args
process.argv.forEach(arg => {
    if (arg.startsWith("--port=")) {
        port = Number(arg.replace("--port=", ""));
    }
})

//Serve dev
app.get('/fluid/dev', function (req, res) {
    res.send(true);
});

//Serve CSS & JS
app.use('/src', express.static('src'));
app.use('/dev', express.static('dev'));

//Serve www
app.use('/', express.static('www'));

//Serve 404
app.get('*', function (req, res) {
    res.status(404).sendFile('www/404.html', { root : __dirname});
});

app.listen(port, () => {
    console.log("The Fluid UI development server is listening at http://localhost:" + port);
});