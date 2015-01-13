/**
 * A model for events.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var EventSchema = new Schema({
        name: {
            type: String,
            required: '{NAME} is required!'
        },
        description: {
            type: String,
            default: ''
        },
        streams: [{
            type: ObjectId,
            ref: 'Stream'
        }]
    });

    module.exports = mongoose.model('Event', EventSchema);

}());