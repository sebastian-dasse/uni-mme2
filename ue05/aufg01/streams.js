/**
 * A simple REST API for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var ServerError = require('./ServerError').ServerError;

    var streams = {};

    module.exports = {
        streams: streams
    };

    /**
     * An array of streams containing the data.
     */
    var streamData = [];

    /**
     * A simple GET sends all streams.
     */
    streams.getAll = function(req, res, next) {
        res.send(streamData);

        // if (req.query.name) console.log('query name was: ' + req.query.name)

        // var contains = function(query) {
        //     return function(ele) {
        //         for (var attr in ele) {
        //             if (query[attr] && ele[attr].indexOf(query[attr]) < 0) {
        //                 return false;
        //             }
        //         }
        //         return true;
        //     };
        // };
        // var filtered = streamData.filter(contains(req.query));
        // res.send(filtered);


        // db.streams.find();

        // res.send();
    };

    /**
     * A GET with an index parameter sends the stream at the specified index
     * position. If there is no element for the given index value (because it
     * is a negative number, too large or not numeric) a ServerError will be
     * sent.
     */
    streams.getOne = function(req, res, next) {
        var index = req.params.index;
        var stream = streamData[index];
        if (!stream) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            res.send(stream);
        }
    };

    /**
     * A simple POST creates a new stream at the end of the list.
     */
    streams.postAll = function(req, res, next) {
        var newStream = req.body;
        if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streamData.push(newStream);
            res.status(201).send(streamData[(streamData.length - 1)]);
        }
    };

    // /**
    //  * A POST with an index parameter sends a ServerError.
    //  */
    // streams.postOne = function(req, res, next) {
    //     res.status(405).send(new ServerError('Not allowed to post to a specified index.', 405));
    // };

    /**
     * A simple PUT updates all streams with the array that was passed with the
     * request.
     */
    streams.putAll = function(req, res, next) {
        var newStreams = req.body;
        if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
            res.status(400).send(new ServerError('The request body has to be an array.', 400));
        } else {
            streamData = newStreams;
            res.status(201).send(streamData);
        }
    };

    /**
     * A PUT with an index parameter updates the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be sent.
     */
    streams.putOne = function(req, res, next) {
        var index = req.params.index;
        var newStream = req.body;
        if (!streamData[index]) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streamData[index] = newStream;
            res.send(streamData[index]);
        }
    };

    // /**
    //  * A simple DELETE Deletes all streams.
    //  */
    // streams.deleteAll = function(req, res, next) {
    //     streamData = [];
    //     // res.status(200).send('All streams were successfully deleted.');
    //     res.status(204).send();
    // };

    /**
     * A DELETE with an index parameter deletes the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be thrown.
     */
    streams.deleteOne = function(req, res, next) {
        var index = req.params.index;
        if (!streamData[index]) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            // streamData.splice(index, 1);
            streamData[index] = undefined;
            // res.status(200).send('The stream at ' + index + ' was successfully deleted.');
            res.status(204).send();
        }
    };

    /**
     * Sets the stream data.
     */
    streams.setData = function(newData) {
        streamData = newData;
    };

    /**
     * Gets the stream data.
     */
    streams.getData = function() {
        return streamData;
    };

}());