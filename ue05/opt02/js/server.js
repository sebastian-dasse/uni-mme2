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
        streamsService = require('./streamsService').streamsService;

    /**
     * Logs some parameters of every HTTP request.
     */
    router.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });

    router.route('/streams')
        .get(streamsService.getAll)
        .post(streamsService.postAll)
        // .put(streamsService.putAll);
        // .delete(streamsService.deleteAll);

    router.route('/streams/:_id')
        .get(streamsService.getOne)
        // .post(streamsService.postOne)
        .put(streamsService.putOne)
        .delete(streamsService.deleteOne);

    // configure the server app
    app.use(bodyParser.json());
    app.use('/api/v1', router);

    app.use(express.static('public'));

    app.use(function(req, res) {
        res.status(404).send('<h1>Not Found</h1><p>The requested URL ' + req.url +
            ' was not found on this server.</p><hr>' +
            'For the REST service for streams call /api/v1/streams');
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