/**
 * A dummy factory for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var mongoose = require('mongoose'),
        conn = mongoose.connect('mongodb://localhost/mmeDb'),
        // streams = db.streams; //  --> replace with mongoose.model
        // StreamSchema = require('../js/Stream').StreamSchema,
        // StreamModel = mongoose.model('Stream', StreamSchema);
        StreamModel = require('../js/Stream').StreamModel;

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

    var initializeDb = function(whenDoneExec, log) {
        mongoose.connection.collections['streams' /*, 'somes'*/ ].drop(function() {
            StreamModel.create(createStreams(), function(err, doc) {
                if (err) {
                    console.error('Could not initialize DB.'); // TODO should throw error
                    console.error(err);
                }
            }).then(function() {
                if (log) {
                    console.log('Initialized DB with some dummy data (' + arguments.length + ' documents).');
                }
                if (whenDoneExec) {
                    whenDoneExec();
                }
            });
            // SomeModel.create({
            //     name: 'Karl',
            //     extra: 'this is extra'
            // });
        });

    };

    module.exports = {
        initializeDb: initializeDb,
        createStreams: createStreams
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