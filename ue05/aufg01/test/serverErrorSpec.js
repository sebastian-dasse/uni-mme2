describe('The ServerError module', function() {
    'use strict';

    var ServerError = require('../ServerError').ServerError;

    // beforeEach(function() {});
    // afterEach(function() {});

    it('should export dependencies', function() {
        expect(ServerError).toBeDefined();
    });

    it('should have a standard error', function() {
        var err = new ServerError();
        expect(err.type).toEqual('ServerError');
        expect(err.statusCode).toBe(404);
        expect(err.msg).toEqual('Requested resource not found.');
    });

    it('should have an error with a customized message', function() {
        var err = new ServerError('foo bar');
        expect(err.type).toEqual('ServerError');
        expect(err.statusCode).toBe(404);
        expect(err.msg).toEqual('foo bar');
    });

    it('should have an error with a customized status code', function() {
        var err = new ServerError(null, 123);
        expect(err.type).toEqual('ServerError');
        expect(err.statusCode).toBe(123);
        expect(err.msg).toEqual('Requested resource not found.');
    });

});