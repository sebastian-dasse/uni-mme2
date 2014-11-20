var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('<h1>The amazing MME2-Server</h1>call "/player" for the video player <br> call "/api/v1/stream" for the REST service');
});

app.use('/player', express.static('public'));


/**
 * Logs some parameters of every HTTP request.
 */
app.use(function(req, res, next) {
    console.log('%s %s %s %s', req.method, req.path, req.body, req.route);
    next();
});


/**
 * Returns all streams.
 */
app.get('/api/v1/stream', function(req, res) {
    res.send(streams);
});

/**
 * Returns the stream with the specified index. If there is no element for the
 * given value (because it is a negative number, too large or not numeric) an
 * error will be thrown.
 */
app.get('/api/v1/stream/:index', function(req, res) {
    var stream = streams[req.params.index];
    // var stream = streamAt(req.params.index, 'GET');
    if (!stream) {
        res.status(404).send(new Error());
    } else {
        res.send(stream);
    }
});

/**
 * Creates a new stream.
 */
app.post('/api/v1/stream', function(req, res) {
    var newStream = req.body;
    if (!newStream) {
        res.status(404).send(new Error());
    } else {
        streams.push(req.body);
        res.send('POST ' + JSON.stringify(req.body));
    }
});

/**
 * Throws an error.
 */
app.post('/api/v1/stream/:index', function(req, res) {
    res.status(404).send(new Error());
});

/**
 * Updates all streams.
 */
app.put('/api/v1/stream', function(req, res) {
    var newStreams = req.body;
    if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
        res.status(404).send(new Error('not an ARRAY'));
    } else {
        streams = newStreams;
        res.send('PUT ' + JSON.stringify(newStreams));
    }
});

/**
 * Updates the stream with the specified index. If there is no element for the
 * given value (because it is a negative number, too large or not numeric) an
 * error will be thrown.
 */
app.put('/api/v1/stream/:index', function(req, res) {
    var index = req.params.index;
    // var stream = streamAt(index, 'PUT');
    if (streams[index] === 'undefined') {
        res.status(404).send(new Error());
    } else {
        var newStream = req.body
        streams[index] = newStream;
        res.send('PUT to ' + index + ': ' + JSON.stringify(newStream));
    }
});

/**
 * Deletes the stream with the specified index. If there is no element for the
 * given value (because it is a negative number, too large or not numeric) an
 * error will be thrown.
 */
app.delete('/api/v1/stream', function(req, res) {
    streams = [];
    res.send('DELETE of all streams');
});

/**
 * Deletes all streams.
 */
app.delete('/api/v1/stream/:index', function(req, res) {
    var index = req.params.index;
    // var stream = streamAt(index, 'DELETE');
    if (streams[index] === 'undefined') {
        res.status(404).send(new Error());
    } else {
        streams.splice(index, 1);
        res.send('DELETE from ' + index);
    }
});


var server = app.listen(8000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Serving at http://%s:%s', host, port);
});


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
}];

// var error = {
//     type: 'error',
//     statusCode: 404,
//     msg: 'Requested resource not found'
// };

var Error = function(msg) {
    var err = {};
    err.type = 'error';
    err.statusCode = 404;
    err.msg = msg || 'Requested resource not found';
    return err;
};

// var streamAt = function(index, method) {
//     var element = streams[index];
//     if (element !== undefined) {
//         return element;
//     }
//     console.log('error' + (method === undefined ? '' : ': could not ' + method + ' stream ' + index));
//     return new Error();
// }