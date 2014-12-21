/**
 * Try out mongoDB with mongoJS.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var dburl = 'localhost/mongoDemoDb',
        collections = ['streams'],
        mongojs = require('mongojs');
    var db = mongojs(dburl, collections);

    // short form:
    // var db = require('mongojs').connect('localhost/mydb', ['streams']);

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

    var dummyStream1 = {
        name: 'foo',
        description: 'this is foo',
        url: 'https://www.youtube.com/watch?v=UDB-jm8MWro',
        state: 0
    };

    var dummyStream2 = {
        name: 'bar',
        description: 'this is bar',
        url: 'http://www.arte.tv',
        state: 0
    };

    var saveIt = function(stream) {
        db.streams.save(stream, function(err, savedStream) {
            if (err || !savedStream) {
                console.log('Stream ' + savedStream + ' not save because of error ' + err);
            } else {
                console.log('Stream ' + savedStream.name + ' saved.');
            }
        });
    };

    saveIt(dummyStream1);
    saveIt(dummyStream2);

    db.streams.find(function(err, docs) {
        err && console.log(err);
        console.log(docs);
    });

}());