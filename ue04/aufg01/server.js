/**
 * A simple REST server for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */

'use strict';

var streams = [{
    type: 'stream',
    data: 'foo'
}, {
    type: 'stream',
    data: 'bar'
}, {
    type: 'stream',
    data: 'baz'
}];


var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());


/**
 * Show welcome message. ** TODO ** replace with better routing with express router.
 */
app.get('/', function(req, res) {
    res.send('<h1>The amazing MME2-Server</h1>call "/player" for the video player <br> call "/api/v1/stream" for the REST service');
});

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
    if (typeof stream === 'undefined') {
        res.status(404).send(Error());
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
        res.status(404).send(Error());
    } else {
        streams.push(req.body);
        res.status(201).send('New stream created at ' + (streams.length - 1) + '.');
    }
});

/**
 * Throws an error.
 */
app.post('/api/v1/stream/:index', function(req, res) {
    res.status(404).send(Error('Not allowed to post to a specified index.'));
});

/**
 * Updates all streams.
 */
app.put('/api/v1/stream', function(req, res) {
    var newStreams = req.body;
    if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
        res.status(404).send(Error('The request body has to be an array.'));
    } else {
        streams = newStreams;
        res.send('The collection of streams was successfully overwritten.');
    }
});

/**
 * Updates the stream with the specified index. If there is no element for the
 * given value (because it is a negative number, too large or not numeric) an
 * error will be thrown.
 */
app.put('/api/v1/stream/:index', function(req, res) {
    var index = req.params.index;
    if (typeof streams[index] === 'undefined') {
        res.status(404).send(Error());
    } else {
        streams[index] = req.body;
        res.send('The stream at ' + index + ' was successfully overwritten.');
    }
});

/**
 * Deletes the stream with the specified index. If there is no element for the
 * given value (because it is a negative number, too large or not numeric) an
 * error will be thrown.
 */
app.delete('/api/v1/stream', function(req, res) {
    streams = [];
    res.send('All streams were successfully deleted.');
});

/**
 * Deletes all streams.
 */
app.delete('/api/v1/stream/:index', function(req, res) {
    var index = req.params.index;
    if (typeof streams[index] === 'undefined') {
        res.status(404).send(Error());
    } else {
        streams.splice(index, 1);
        res.send('The stream at ' + index + ' was successfully deleted.');
    }
});


/**
 * Start the server.
 */
var server = app.listen(8000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Serving at http://%s:%s', host, port);
});


/**
 * Constructs a simple error object with an optional message.
 */
var Error = function(msg) {
    return {
        type: 'error',
        statusCode: 404,
        msg: msg || 'Requested resource not found.'
    };
};