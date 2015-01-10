/**
 * A model for streams.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        ServerError = require('./ServerError').ServerError;

    /**
     * Constructs a Stream object with ... and optional...
     */
    var Stream = function(config) {
        if (!(this instanceof Stream)) {
            return new Stream(config);
        }
        if (!(config && config.name && config.url)) {
            throw new ServerError('Required parameters were missing.', 400);
        }
        this.name = config.name;
        this.description = config.description || '';
        this.url = config.url;
        this.state = config.state || 0;
    };

    Stream.create = function(name, description, url, state) {
        return new Stream({
            name: name,
            description: description,
            url: url,
            state: state
        });
    };

    var Schema = require('mongoose').Schema,
        ObjectId = Schema.ObjectId;

    var StreamSchema = new Schema({
        name: {
            type: String,
            required: '{NAME} is required!'
        },
        description: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            required: '{URL} is required!'
        },
        state: {
            type: Number,
            default: 0
        }
    });
    var StreamModel = mongoose.model('Stream', StreamSchema);

    module.exports = {
        Stream: Stream,
        // StreamSchema: StreamSchema
        StreamModel: StreamModel
    };

}());