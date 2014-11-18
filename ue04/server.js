var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('<h1>The amazing MME2-Server</h1>call "/player" for the video player <br> call "/api/v1/stream" for the REST service');
});

app.use('/player', express.static('public'));


app.get('/api/v1/stream/:index', function(req, res) {
    // res.send(resMsg('GET'));
    // if (index) {}
    res.send(index);
});

app.post('/api/v1/stream', function(req, res) {

    res.send(resMsg('POST'));
});

app.put('/api/v1/stream', function(req, res) {
    res.send(resMsg('PUT'));
});

app.delete('/api/v1/stream', function(req, res) {
    res.send(resMsg('DELETE'));
});


var server = app.listen(8000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Serving at http://%s:%s', host, port);
});


var resMsg = function(met) {
    return 'REST: recieved a ' + met + ' message';
};


var streams = [{
    type: 'stream',
    name: 'foo',
    quality: 'high'
}, {
    type: 'stream',
    name: 'bar',
    quality: 'medium'
}, {
    type: 'stream',
    name: 'baz',
    quality: 'low'
}]