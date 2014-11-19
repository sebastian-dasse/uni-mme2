var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('<h1>The amazing MME2-Server</h1>call "/player" for the video player <br> call "/api/v1/stream" for the REST service');
});

app.use('/player', express.static('public'));


app.use(function(req, res, next) {
    console.log('%s %s %s %s', req.method, req.path, req.body, req.route);
    next();
});


app.get('/api/v1/stream', function(req, res) {
    res.send(streams);
});

app.get('/api/v1/stream/:index', function(req, res) {
    // res.send(errCheck(streams[req.params.index]));
    // res.send(errCheck(streams[req.params.index], 'GET'));
    var obj = streamAt(req.params.index, 'GET');
    if (obj.type === 'error') {
        res.status(404);
    }
    res.send(obj);
    // res.send(streamAt(req.params.index, 'GET'));
});

app.post('/api/v1/stream', function(req, res) {
    console.log(req);
    // TODO posted data should be appended to the original stream
    res.send(streams);
});

app.post('/api/v1/stream/:index', function(req, res) {
    // res.send(streamAt(undefined, 'POST'));
    res.status(404).send(error);
});

app.put('/api/v1/stream', function(req, res) {
    // TODO posted data should replace the original stream
    res.send('PUT ');
});

app.put('/api/v1/stream/:index', function(req, res) {
    // TODO posted data should replace the original stream
    console.log(req.params);
    var x = streamAt(req.params.index, ' PUT');
    if (x.type == 'error') {
        res.send(x);
    }
    streams[req.params.index] = 'NEW NEW NEW';
    res.send('PUT ' + req.params.index);
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

var error = {
    type: 'error',
    statusCode: 404,
    msg: 'Requested resource not found'
};

var streamAt = function(index, method) {
    var element = streams[index];
    if (element !== undefined) {
        return element;
    }
    console.log('error' + (method === undefined ? '' : ': could not ' + method + ' stream ' + index));
    return error;
}