/**
 * A simple REST API for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    // dependencies
    var ServerError = require('./serverError').ServerError;

    var stream = {};


    // TODO ...
    // - stream data should not be static
    // - setDummyData


    /**
     * An array of streams containing some dummy data.
     */
    var streamData = [{
        data: 'foo'
    }, {
        data: 'bar'
    }, {
        data: 'baz'
    }];


    module.exports = {
        stream: stream,
        streamData: streamData
    };



    /**
     * A simple GET sends all streams.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.getAll = function(req, res, next) {
        res.send(streamData);
    };

    /**
     * A GET with an index parameter sends the stream at the specified index
     * position. If there is no element for the given index value (because it
     * is a negative number, too large or not numeric) a ServerError will be
     * sent.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.getOne = function(req, res, next) {
        var index = req.params.index;
        var stream = streamData[index];
        if (stream === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            res.send(stream);
        }
    };

    /**
     * A simple POST creates a new stream at the end of the list.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.postAll = function(req, res, next) {
        var newStream = req.body;
        if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streamData.push(newStream);
            res.status(201).send('New stream created at ' + (streamData.length - 1) + '.');
        }
    };

    /**
     * A POST with an index parameter sends a ServerError.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.postOne = function(req, res, next) {
        res.status(405).send(new ServerError('Not allowed to post to a specified index.', 405));
    };

    /**
     * A simple PUT updates all streams with the array that was passed with the
     * request.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.putAll = function(req, res, next) {
        var newStreams = req.body;
        if (Object.prototype.toString.call(newStreams) !== '[object Array]') {
            res.status(400).send(new ServerError('The request body has to be an array.', 400));
        } else {
            streamData = newStreams;
            res.send('The collection of streams was successfully overwritten.');
        }
    };

    /**
     * A PUT with an index parameter updates the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be sent.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.putOne = function(req, res, next) {
        var index = req.params.index;
        var newStream = req.body;
        if (streamData[index] === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else if (!newStream) {
            res.status(400).send(new ServerError('Your request body was empty.', 400));
        } else {
            streamData[index] = newStream;
            res.send('The stream at ' + index + ' was successfully overwritten.');
        }
    };

    /**
     * A simple DELETE Deletes all streams.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.deleteAll = function(req, res, next) {
        streamData = [];
        res.send('All streams were successfully deleted.');
    };

    /**
     * A DELETE with an index parameter deletes the stream with the specified
     * index. If there is no element for the given value (because it is a
     * negative number, too large or not numeric) an ServerError will be thrown.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    stream.deleteOne = function(req, res, next) {
        var index = req.params.index;
        if (streamData[index] === undefined) {
            res.status(404).send(new ServerError('No stream with index ' + index + ' found.'));
        } else {
            streamData.splice(index, 1);
            res.send('The stream at ' + index + ' was successfully deleted.');
        }
    };

}());