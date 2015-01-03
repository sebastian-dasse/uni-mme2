(function() {
    'use strict';

    var mongoose = require('mongoose'),
        db = mongoose.connect('mongodb://localhost/mmeDb');

    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var StreamSchema = new Schema({
        name: String,
        description: String,
        url: String,
        state: Number
    });

    var EventSchema = new Schema({
        name: String,
        description: String,
        streams: [ObjectId],
    });


    var randomChar = function() {
        return String.fromCharCode('a'.charCodeAt(0) + Math.round(Math.random() * 25));
    };

    var randomString = function(len) {
        var str = '';
        while (len--) {
            str += randomChar();
        }
        return str;
    };


    // var StreamModel = mongoose.model('Stream', StreamSchema);
    var StreamModel = mongoose.model('Trial', StreamSchema);
    var EventModel = mongoose.model('Event', EventSchema);

    var aStream = new StreamModel();
    aStream.name = randomString(8);
    aStream.description = randomString(3) + ' ' + randomString(9);
    aStream.url = 'http://www.' + randomString(6) + '.' + randomString(2);
    aStream.state = 0;
    // aStream.save(function(err) {
    //     if (err) console.error(err);
    //     else console.log('saved ' + aStream.name);
    // });

    var anEvent = new EventModel();
    anEvent.name = 'Grillparty';
    anEvent.description = 'Bringt noch etwas zu Trinken mit.';
    // anEvent.save(function(err) {
    //     if (err) console.error(err);
    //     else console.log('saved ' + anEvent.name);
    // });

    var smashing = new EventModel();
    smashing.name = 'Oh Yeah';
    smashing.description = 'This is great';
    // smashing.save(function(err) {
    //     if (err) console.error(err);
    //     else console.log('smashing saved');
    // });

    StreamModel.find({
        name: 'hallo'
            // name: aStream.name
    }, function(err, docs) {
        docs.forEach(function(doc) {
            console.log(doc);
        });
    });

    StreamModel.find({
        name: 'hallo'
    }, function(err, docs) {

        if (err || !docs || docs.length < 0) return;
        var aStream = docs[0];

        EventModel.find({
            name: 'Oh Yeah'
        }, function(err, docs) {

            docs.forEach(function(doc) {
                console.log(doc)

                // doc.streams.push(aStream._id);
                console.log('---------------');
                console.log(doc.streams[0]);
                console.log('---------------');

                doc.save(function(err) {
                    EventModel.find({
                        name: 'Grillparty'
                            // name: aStream.name
                    }, function(err, docs) {
                        docs.forEach(function(doc) {
                            console.log(doc);
                        });
                    });
                })

            });
        });
    });

}());