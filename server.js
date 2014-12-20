var express = require('express');
var server = express();

/* serves main page */
server.get('/', function (request, response) {
    response.sendFile(__dirname + '/unit/index.html');
});

server.get('/unit', function (request, response) {
    response.sendFile(__dirname + '/unit/index.html');
});

/* serves all the static files */
server.get(/^(.+)$/, function (request, response) {
    response.sendFile(__dirname + request.params[0]);
});

var port = 8000;
server.listen(port, function () {
    console.log('Listening on http://localhost:' + port);
});