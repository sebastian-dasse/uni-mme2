/**
 * A model for streams.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

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

    module.exports = mongoose.model('Stream', StreamSchema);

}());