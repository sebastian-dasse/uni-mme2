/**
 * A simple REST API for the entities "stream" and "event".
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        conn = mongoose.connect('mongodb://localhost/mmeDb'),
        ObjectId = mongoose.Types.ObjectId,
        StreamModel = require('./models/Stream'),
        EventModel = require('./models/Event'),
        ServerError = require('./ServerError');

    var models = {
        Stream: StreamModel,
        Event: EventModel
    };

    var restService = {};
    module.exports = restService;

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

    var hexregex = new RegExp("^[0-9a-fA-F]{24}$");

    var isMongoId = function(id) {
        return hexregex.test(id);
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
    restService.getAll = function(modelName) {
        var Model = models[modelName];
        return function(req, res, next) {
            var reqQuery = req.query,
                dbQuery = {};
            for (var param in reqQuery) {
                dbQuery[param] = parseParam(reqQuery[param]);
            }
            Model.find(dbQuery, respondWith(res, 200));
        };
    };

    /**
     * A GET with an ID parameter responds with the specified stream. If no
     * element with the given ID could be found, this service responds with a
     * ServerError with status 404.
     * @param {Number} req.params._id the stream ID
     */
    restService.getOne = function(modelName) {
        var Model = models[modelName];
        return function(req, res, next) {
            var id = req.params._id;
            if (!isMongoId(id)) {
                res.status(404).send(new ServerError('Not a legal MongoDb ObjectId: ' + id, 404));
                return;
            }
            Model.findById(new ObjectId(id), respondWith(res, 200, id));
        };
    };

    /**
     * A simple POST creates a new stream and sends the updated stream object
     * in respose. If required attributes were missing, this service responds
     * with a ServerError with status 400.
     * @param {Object} req.body the update object
     */
    restService.postAll = function(modelName) {
        var Model = models[modelName];
        return function(req, res, next) {
            var newStream = req.body;
            console.log(newStream)
            Model.create(newStream, respondWith(res, 201));
        };
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
    restService.putOne = function(modelName) {
        var Model = models[modelName];
        return function(req, res, next) {
            var updateObj = req.body,
                id = req.params._id;
            if (!isMongoId(id)) {
                res.status(404).send(new ServerError('Not a legal MongoDb ObjectId: ' + id, 404));
                return;
            }
            if (hasNoAttributes(updateObj)) {
                res.status(400).send(new ServerError('You must specify at least one field to update.', 400));
                return;
            }
            Model.findByIdAndUpdate(new ObjectId(id), updateObj, respondWith(res, 200, id));
        };
    };

    /**
     * A DELETE with an ID parameter deletes the specified stream. If no element
     * with the given ID could be found, this service responds with a
     * ServerError with status 404.
     * @param {Number} req.params._id the stream ID
     */
    restService.deleteOne = function(modelName) {
        var Model = models[modelName];
        return function(req, res, next) {
            var id = req.params._id;
            if (!isMongoId(id)) {
                res.status(404).send(new ServerError('Not a legal MongoDb ObjectId: ' + id, 404));
                return;
            }
            Model.findByIdAndRemove(new ObjectId(id), respondWith(res, 204, id));
        };
    };

}());