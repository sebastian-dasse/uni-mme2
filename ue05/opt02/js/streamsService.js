/**
 * A simple REST API for the entity "stream".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        conn = mongoose.connect('mongodb://localhost/mmeDb'),
        ObjectId = mongoose.Types.ObjectId,
        StreamModel = require('./Stream').StreamModel,
        ServerError = require('./ServerError').ServerError;


    var streamsService = {};

    module.exports = {
        streamsService: streamsService
    };

    var toMongoId = function(id) {
        try {
            return new ObjectId(id);
        } catch (err) {
            console.log(err);
        }
    };

    var respondWith = function(res, okStatus, id, callback) {
        return function(err, doc) {
            if (err) {
                var errStatus = 500;
                if (err.name == 'ValidationError') {
                    errStatus = 400;
                }
                res.status(errStatus).send(new ServerError(err, errStatus));
            } else if (!doc) {
                res.status(404).send(new ServerError('No stream found with ID: ' + id, 404));
            } else if (!callback) {
                if (okStatus == 204) {
                    doc = null;
                }
                res.status(okStatus || 200).send(doc);
            } else {
                callback(doc);
            }
        };
    };

    /** Returns a case-insensitive regex or an int number. */
    var parseParam = function(value) {
        return isNaN(value) ? new RegExp(value, 'i') : parseInt(value);
    };

    /**
     * A simple GET responds with all streams, or a filtered list of streams
     * based on the given query, if a query object was passed.
     * @param {Number} [req.query] a query object
     */
    streamsService.getAll = function(req, res, next) {
        var reqQuery = req.query,
            dbQuery = {};
        for (var param in reqQuery) {
            dbQuery[param] = parseParam(reqQuery[param]);
        }
        StreamModel.find(dbQuery, respondWith(res, 200));
    };

    /**
     * A GET with an ID parameter responds with the specified stream. If no
     * element with the given ID could be found, this service responds with a
     * ServerError with status 404.
     * @param {Number} req.params._id the stream ID
     */
    streamsService.getOne = function(req, res, next) {
        var id = toMongoId(req.params._id);
        StreamModel.findById(id, respondWith(res, 200, id));
    };

    /**
     * A simple POST creates a new stream and sends the updated stream object
     * in respose. If required attributes were missing, this service responds
     * with a ServerError with status 400.
     * @param {Object} req.body the update object
     */
    streamsService.postAll = function(req, res, next) {
        var newStream = req.body;
        StreamModel.create(newStream, respondWith(res, 201));
    };

    var hasNoAttributes = function(obj) {
        return Object.keys(obj).length === 0;
    };

    /**
     * A PUT with an ID parameter updates the specified stream and sends the
     * updated stream object in respose. This service responds with a
     * ServerError with status 404 if no element with the given ID could
     * be found, or with 400 if the update object was empty.
     * @param {Number} req.params._id the stream ID
     * @param {Object} req.body the update object
     */
    streamsService.putOne = function(req, res, next) {
        var updateObj = req.body,
            id = toMongoId(req.params._id);
        if (hasNoAttributes(updateObj)) {
            res.status(400).send(new ServerError('You must specify at least one field to update.', 400));
            return;
        }
        StreamModel.findByIdAndUpdate(id, updateObj, respondWith(res, 200, id));
    };

    /**
     * A DELETE with an ID parameter deletes the specified stream. If no element
     * with the given ID could be found, this service responds with a
     * ServerError with status 404.
     * @param {Number} req.params._id the stream ID
     */
    streamsService.deleteOne = function(req, res, next) {
        var id = toMongoId(req.params._id);
        StreamModel.findByIdAndRemove(id, respondWith(res, 204, id));
    };

}());