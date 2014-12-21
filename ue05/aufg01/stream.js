/**
 * A model for streams.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    var ServerError = require('./ServerError').ServerError;

    /**
     * Constructs a Stream object with ... and optional...
     */
    var Stream = function(config) {
        if (!(this instanceof Stream)) {
            return new Stream(config);
        }
        if (!config || !config.name || !config.url) {
            throw new ServerError();
        }
        this.name = config.name;
        this.description = config.description;
        this.url = config.url;
        this.state = config.state;
    };

    Stream.create = function(name, description, url, state) {
        return new Stream({
            name: name,
            description: description,
            url: url,
            state: state
        });
    };

    module.exports = {
        Stream: Stream
    };

}());