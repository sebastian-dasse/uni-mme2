/**
 * A dummy factory for the entities "stream" and "event".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var mongoose = require('mongoose'),
        conn = mongoose.connect('mongodb://localhost/mmeDb'),
        StreamModel = require('../js/models/Stream'),
        EventModel = require('../js/models/Event');

    // some dummy data
    var createStreams = function() {
        return [{
            name: 'foo',
            description: 'this is foo',
            url: 'https://www.youtube.com/watch?v=UDB-jm8MWro',
            state: 0
        }, {
            name: 'bar',
            description: 'this is bar',
            url: 'https://www.youtube.com/watch?v=B7UmUX68KtE',
            state: 0
        }, {
            name: 'baz',
            description: 'this is baz',
            url: 'https://www.youtube.com/watch?v=2Qj8PhxSnhg',
            state: 0
        }];
    };

    var createEvents = function() {
        return [{
            name: 'Gartenparty',
            description: 'Bringt bitte etwas zu trinken mit.'
        }, {
            name: 'Opernball',
            description: 'Dresscode: Frack bzw. Abendkleid'
        }, {
            name: 'Lesung',
            description: 'Jonathan Franzen liest aus seinem aktuellen Buch.'
        }];
    };

    var initializeDb = function(whenDoneExec, log) {
        mongoose.connection.collections['streams'].drop();
        mongoose.connection.collections['events'].drop();
        StreamModel.create(createStreams()).then(function() {
            if (log) console.log('Initialized DB with some dummy streams (' + arguments.length + ').');
            EventModel.create(createEvents()).then(function() {
                if (log) console.log('Initialized DB with some dummy events (' + arguments.length + ').');
                if (whenDoneExec) whenDoneExec();
            });
        });
    };

    module.exports = {
        initializeDb: initializeDb,
        createStreams: createStreams,
        createEvents: createEvents
    };


    var args = process.argv,
        runOption = false,
        logOption = true;
    for (var i in args) {
        if (args[i] == '--run') {
            runOption = true;
        }
        if (args[i] == '--silent') {
            logOption = false;
        }
    }

    /**
     * Run from the command line like this:
     *      node ./test/dummyStreamsFactory.js --run
     */
    if (runOption) {
        initializeDb(function() {
            conn.disconnect(); // QUESTION is it ok to do this?
        }, logOption);
    }

}());