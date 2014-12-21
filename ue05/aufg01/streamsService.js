/**
 * A simple REST API for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongojs = require('mongojs'),
        db = mongojs('mmeDb', ['streams']),
        streams = db.streams,
        Stream = require('./Stream').Stream,
        ServerError = require('./ServerError').ServerError;

    var streamsService = {};

    module.exports = {
        streamsService: streamsService
    };

    var toMongoId = function(id, res) {
        try {
            return mongojs.ObjectId(id);
        } catch (err) {
            console.log(err)
            res.status(404).send(new ServerError(id + ' is no valid mongoDB ID.', 404));
        }
    };

    var respondWith = function(res, okStatus, id) {
        return function(err, doc) {
            if (err) {
                res.status(500).send(new ServerError(err, 500));
            } else if (!doc) {
                res.status(404).send(new ServerError('No stream with ID ' + id + ' found.', 404));
            } else {
                res.status(okStatus).send(doc);
            }
        };
    };

    /**
     * A simple GET sends all streams.
     */
    streamsService.getAll = function(req, res, next) {
        var reqQuery = req.query,
            dbQuery = {};
        for (var param in reqQuery) {
            var value = reqQuery[param];
            dbQuery[param] = isNaN(value) ? new RegExp(value) : parseInt(value);
        }
        db.streams.find(dbQuery, respondWith(res, 200));
    };

    /**
     * A GET with an index parameter sends the stream at the specified index
     * position. If there is no element for the given index value (because it
     * is a negative number, too large or not numeric) a ServerError will be
     * sent.
     */
    streamsService.getOne = function(req, res, next) {
        var id = toMongoId(req.params._id, res);
        if (!id) {
            return;
        }
        streams.findOne({
            _id: id
        }, respondWith(res, 200, id));
    };

    /**
     * A simple POST creates a new stream at the end of the list.
     */
    streamsService.postAll = function(req, res, next) {
        var newStream;
        try {
            newStream = new Stream(req.body);
        } catch (err) {
            res.status(400).send(err);
            return;
        }
        streams.save(newStream, respondWith(res, 201));
    };

    // /**
    //  * A POST with an index parameter sends a ServerError.
    //  */
    // streamsService.postOne = function(req, res, next) {
    //     res.status(405).send(new ServerError('Not allowed to post to a specified index.', 405));
    // };

    /**
     * A simple PUT updates all streams with the array that was passed with the
     * request.
     */
    streamsService.putAll = function(req, res, next) {
        var newStreams = req.body;
        if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
            res.status(400).send(new ServerError('The request body has to be an array.', 400));
        } else {
            res.status(400).send(new ServerError('FIXME not implemented (should it be implemented?)', 501));

            // streamData = newStreams;
            // res.status(201).send(streamData);
        }
    };

    var hasNoAttributes = function(obj) {
        return Object.keys(obj).length == 0;
    }

    /**
     * A PUT with an index parameter updates the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be sent.
     */
    streamsService.putOne = function(req, res, next) {
        var updateObj = req.body,
            id = toMongoId(req.params._id, res);
        if (!id) {
            return;
        }
        if (hasNoAttributes(updateObj)) {
            res.status(400).send(new ServerError('You must specify at least one field to update.', 400));
            return;
        }
        streams.findAndModify({
            query: {
                _id: id
            },
            update: {
                $set: updateObj
            },
            new: true
        }, respondWith(res, 200, id));
    };

    // /**
    //  * A simple DELETE Deletes all streams.
    //  */
    // streamsService.deleteAll = function(req, res, next) {
    //     streamData = [];
    //     // res.status(200).send('All streams were successfully deleted.');
    //     res.status(204).send();
    // };

    /**
     * A DELETE with an index parameter deletes the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be thrown.
     */
    streamsService.deleteOne = function(req, res, next) {
        var id = toMongoId(req.params._id, res);
        if (!id) {
            return;
        }
        streams.remove({
            _id: id
        }, respondWith(res, 204, id));
    };

    /**
     * Sets the stream data.
     */
    streamsService.setData = function(newData) {
        // streamData = newData;

        streams.drop();
        newData.forEach(function(element) {
            streams.save(element);
        });
    };

    /**
     * Gets the stream data.
     */
    streamsService.getData = function() {
        // return streamData;

        streams.find(function(err, docs) {
            if (err) {
                console.log(err);
            }
            return docs; // FIXME broken, returns undefined
        });
    };

}());