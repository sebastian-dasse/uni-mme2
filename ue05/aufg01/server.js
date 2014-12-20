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
        stream = require('./stream').stream;

    // some dummy data
    var dummmyStreamData = [{
        _id: '1',
        name: 'foo',
        description: 'this is foo',
        url: 'https://www.youtube.com/watch?v=UDB-jm8MWro',
        state: 0
    }, {
        _id: '2',
        name: 'bar',
        description: 'this is bar',
        url: 'https://www.youtube.com/watch?v=B7UmUX68KtE',
        state: 0
    }, {
        _id: '3',
        name: 'baz',
        description: 'this is baz',
        url: 'https://www.youtube.com/watch?v=2Qj8PhxSnhg',
        state: 0
    }];
    stream.setData(dummmyStreamData);

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


    router.route('/streams')
        .get(stream.getAll)
        .post(stream.postAll)
        .put(stream.putAll)
        .delete(stream.deleteAll);

    router.route('/streams/:index')
        .get(stream.getOne)
        .post(stream.postOne)
        .put(stream.putOne)
        .delete(stream.deleteOne);


    // configure the server app
    app.use(bodyParser.json());
    app.use('/api/v1', router);

    // start the server
    var server = app.listen(8000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Serving at http://%s:%s', host, port);
    });

    // module.exports = {
    //     app: app,
    //     router: router
    // };

}());