(function() {
    'use strict';

    var server = require('./js/server'),
        port = process.argv[2];
    server.serve(port);

}());