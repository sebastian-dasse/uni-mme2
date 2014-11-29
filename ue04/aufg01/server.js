/**
 * A simple REST server for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var express = require('express'),
        bodyParser = require('body-parser'),
        app = express(),
        router = express.Router(),
        ServerError = require('./serverError').ServerError;

    /**
     * An array of streams containing some dummy data.
     */
    var streams = [{
        data: 'foo'
    }, {
        data: 'bar'
    }, {
        data: 'baz'
    }];


    /**
     * Shows a welcome message.
     */
    router.get('/', function(req, res) {
        res.send('<h1>The amazing MME2-Server</h1>call "/api/v1/streams" for the REST service');
    });

    /**
     * Logs some parameters of every HTTP request.
     */
    router.use(function(req, res, next) {
        console.log('%s %s', req.method, req.path);
        next();
    });


    /**
     * A simple GET returns all streams.
     */
    router.get('/streams', function(req, res) {
        res.send(streams);
    });

    /**
     * A GET with an index parameter returns the stream at the specified index
     * position. If there is no element for the given index value (because it
     * is a negative number, too large or not numeric) a ServerError will be
     * thrown.
     */
    router.get('/streams/:index', function(req, res) {
        var index = req.params.index;
        var stream = streams[index];
        if (stream === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            res.send(stream);
        }
    });

    /**
     * A simple POST creates a new stream at the end of the list.
     */
    router.post('/streams', function(req, res) {
        var newStream = req.body;
        if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streams.push(newStream);
            res.status(201).send('New stream created at ' + (streams.length - 1) + '.');
        }
    });

    /**
     * A POST with an index parameter throws a ServerError.
     */
    router.post('/streams/:index?', function(req, res) {
        res.status(405).send(new ServerError('Not allowed to post to a specified index.', 405));
    });

    /**
     * A simple PUT updates all streams with the array that was passed with the
     * request.
     */
    router.put('/streams', function(req, res) {
        var newStreams = req.body;
        if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
            res.status(400).send(new ServerError('The request body has to be an array.', 400));
        } else {
            streams = newStreams;
            res.send('The collection of streams was successfully overwritten.');
        }
    });

    /**
     * A PUT with an index parameter updates the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be thrown.
     */
    router.put('/streams/:index', function(req, res) {
        var index = req.params.index;
        var newStream = req.body;
        if (streams[index] === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streams[index] = newStream;
            res.send('The stream at ' + index + ' was successfully overwritten.');
        }
    });

    /**
     * A simple DELETE Deletes all streams.
     */
    router.delete('/streams', function(req, res) {
        streams = [];
        res.send('All streams were successfully deleted.');
    });

    /**
     * A DELETE with an index parameter deletes the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be thrown.
     */
    router.delete('/streams/:index', function(req, res) {
        var index = req.params.index;
        if (streams[index] === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            streams.splice(index, 1);
            res.send('The stream at ' + index + ' was successfully deleted.');
        }
    });

    // configure the server app
    app.use(bodyParser.json());
    app.use('/api/v1', router);

    // start the server
    var server = app.listen(8000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Serving at http://%s:%s', host, port);
    });

}());