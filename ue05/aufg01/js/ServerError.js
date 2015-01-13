/**
 * A model for server errors.
 *
 * @author Sebastian Dass&eacute;
 */
(function() {
    'use strict';

    /**
     * Constructs a ServerError object with optional message and status code.
     */
    var ServerError = function(msg, status) {
        return {
            type: 'error',
            statusCode: status || 404,
            msg: msg || 'Requested resource not found.'
        };
    };

    module.exports = {
        ServerError: ServerError
    };

}());