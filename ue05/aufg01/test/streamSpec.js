describe('The Stream module', function() {
    'use strict';

    var Stream = require('../Stream').Stream,
        ServerError = require('../ServerError').ServerError;

    // beforeEach(function() {});
    // afterEach(function() {});

    it('should export dependencies', function() {
        expect(Stream).toBeDefined();
        expect(Stream.create).toBeDefined();
    });

    var name = 'foo',
        description = 'this is foo',
        url = 'http://www.foo.bar',
        state = 0;

    it('should have a contructor', function() {
        var config = {
            name: name,
            description: description,
            url: url,
            state: state
        };
        var stream = new Stream(config);
        expect(stream.name).toEqual(name);
        expect(stream.description).toEqual(description);
        expect(stream.url).toEqual(url);
        expect(stream.state).toEqual(state);
    });

    it('should have a static factory method', function() {
        var stream = Stream.create(name, description, url, state);
        expect(stream.name).toEqual(name);
        expect(stream.description).toEqual(description);
        expect(stream.url).toEqual(url);
        expect(stream.state).toEqual(state);
    });

    it('should throw an error if name is not defined', function() {
        expect(function() {
            Stream.create(null, description, url, state);
        }).toThrow(new ServerError('Required parameters were missing.', 400));
    });

    it('should throw an error if URL is not defined', function() {
        expect(function() {
            Stream.create(name, description, null, state);
        }).toThrow(new ServerError('Required parameters were missing.', 400));
    });

    it('should throw an error if the constructor is called without configuration object', function() {
        expect(function() {
            new Stream();
        }).toThrow(new ServerError('Required parameters were missing.', 400));
    });

});