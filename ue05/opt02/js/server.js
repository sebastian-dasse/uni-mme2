/**
 * A simple REST server for the entities "stream" and "event".
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
        restService = require('./restService');

    /**
     * Logs some parameters of every HTTP request.
     */
    router.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });

    router.route('/streams')
        .get(restService.getAll('Stream'))
        .post(restService.postAll('Stream'));

    router.route('/streams/:_id')
        .get(restService.getOne('Stream'))
        .put(restService.putOne('Stream'))
        .delete(restService.deleteOne('Stream'));

    router.route('/events')
        .get(restService.getAll('Event'))
        .post(restService.postAll('Event'));

    router.route('/events/:_id')
        .get(restService.getOne('Event'))
        .put(restService.putOne('Event'))
        .delete(restService.deleteOne('Event'));

    // configure the server app
    app.use(bodyParser.json());
    app.use('/api/v1', router);

    app.use(express.static('public'));

    app.use(function(req, res) {
        res.status(404).send('<h1>Not Found</h1><p>The requested URL ' + req.url +
            ' was not found on this server or could not be called with ' + req.method + '</p><hr>' +
            'For the REST service for streams call /api/v1/streams<br />' +
            'For the REST service for events call /api/v1/events');
    });

    /**
     * Starts the server.
     *
     * @return {Function} the server
     */
    var serve = function() {
        var server = app.listen(8000, function() {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Serving at http://%s:%s', host, port);
        });
        return server;
    };

    module.exports.serve = serve;

}());