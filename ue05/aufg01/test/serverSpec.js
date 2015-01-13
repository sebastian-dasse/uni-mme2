describe('The server module', function() {
    'use strict';

    var request = require('request'),
        streamsService = require('../js/streamsService').streamsService,
        dummyStreamsFactory = require('./dummyStreamsFactory'),
        url = 'http://localhost:8000/api/v1/streams/';

    beforeEach(function(done) {
        dummyStreamsFactory.initializeDb(done);
    });

    // afterEach(function() {});

    describe('The streams API', function() {

        describe('GET all', function() {

            it('should get all streams', function(done) {
                request.get({
                    url: url,
                    json: true
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(200);
                    expect(Array.isArray(body)).toBe(true);
                    done();
                });
            });
        });

        var expectInvalidIdsToProcuceErrorFor = function(fn, done, options) {
            options = options || {};
            options.json = true;
            var arr = [-1, 10000, 'abc', '123456789012345678901234'],
                numCalls = 0;
            arr.forEach(function(id) {
                options.url = url + id;
                fn(options, function(err, response, body) {
                    expect(response.statusCode).toBe(404);
                    expect(body.type).toEqual('error');
                    numCalls++;
                    if (numCalls == arr.length) {
                        done();
                    }
                });
            });
        };

        describe('GET one', function() {

            it('should respond with an error for invalid IDs', function(done) {
                expectInvalidIdsToProcuceErrorFor(request.get, done);
            });

            it('should get the stream with the specified ID', function(done) {
                request.get({
                    url: url,
                    json: true
                }, function(err, response, body) {
                    var aStream = body[0];

                    request.get({
                        url: url + aStream._id,
                        json: true
                    }, function(err, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).toEqual(aStream);
                        done();
                    });
                });
            });

        });

        var haveEqualAttributes = function(obj, other) { // TODO -> reuse for updatedAttributesAreEqual
            for (var attr in obj) {
                if (obj[attr] != other[attr]) {
                    return false;
                }
            }
            return true;
        };

        describe('POST all', function() {

            it('should create a new stream', function(done) {
                var newStream = {
                    name: 'fresh',
                    description: 'so fresh',
                    url: 'https://www.youtube.com/watch?v=UDB-jm8MWro',
                    state: 0
                };

                request.post({
                    url: url,
                    json: true,
                    body: newStream
                }, function(err, response, body) {
                    var posted = body;
                    expect(response.statusCode).toBe(201);
                    expect(haveEqualAttributes(newStream, posted)).toBe(true);

                    request.get({
                        url: url + posted._id,
                        json: true
                    }, function(err, response, body) {
                        expect(body).toEqual(posted);
                        done();
                    })
                });
            });

        });

        // describe('POST one', function() {

        //     it('should not be allowed ', function(done) {
        //         request.post({
        //             url: url + '1',
        //             json: true,
        //             body: {}
        //         }, function(err, response, body) {
        //             expect(response.statusCode).toBe(405);
        //             expect(body.type).toEqual('error');
        //             done();
        //         });
        //     });

        // });

        describe('PUT all', function() {

            it('should only accept an array', function(done) {
                request.put({
                    url: url,
                    json: true,
                    body: 'no array'
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(400);
                    expect(body.type).toEqual('error');
                    done();
                });
            });

            // it('should update the list with the passed array', function(done) {
            //     var newStreams = [{
            //         id: 'foo'
            //     }, {
            //         id: 'bar'
            //     }];

            //     var expectGetStreamsToEqual = function(expected, done) {
            //         request.get({
            //             url: url,
            //             json: true
            //         }, function(err, response, body) {
            //             expect(body).toEqual(expected);
            //             done();
            //         });
            //     };

            //     request.put({
            //         url: url,
            //         json: true,
            //         body: newStreams
            //     }, function(err, response, body) {
            //         expect(response.statusCode).toBe(201);
            //         expect(body).toEqual(newStreams, done);
            //         expectGetStreamsToEqual(newStreams, done);
            //     });

            // });

        });

        describe('PUT one', function() {

            it('should respond with an error for invalid IDs', function(done) {
                var reqOptions = {
                    body: {
                        name: 'foo'
                    }
                };
                expectInvalidIdsToProcuceErrorFor(request.put, done, reqOptions);
            });

            it('should not modify the total number of streams', function(done) {
                request.get({
                    url: url,
                    json: true
                }, function(err, response, body) {
                    var originalNumber = body.length,
                        aStream = body[0];

                    request.put({
                        url: url + aStream._id,
                        json: true,
                        body: {
                            name: 'updated'
                        }
                    }, function(err, response, body) {

                        request.get({
                            url: url,
                            json: true
                        }, function(err, response, body) {
                            var newNumber = body.length;

                            expect(newNumber).toBe(originalNumber);
                            done();
                        });
                    });
                });
            });
        });

        // TODO check if attributes that are not specified in the update stay unaltered
        it('should update the stream with the specified ID', function(done) {
            var streamUpdate = {
                name: 'updated',
                description: 'freshly updated',
                state: 123
            };

            request.get({
                url: url,
                json: true
            }, function(err, response, body) {
                var aStream = body[0];

                request.put({
                    url: url + aStream._id,
                    json: true,
                    body: streamUpdate
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(200);
                    expect(haveEqualAttributes(streamUpdate, body)).toBe(true);

                    request.get({
                        url: url + aStream._id,
                        json: true
                    }, function(err, response, body) {
                        expect(haveEqualAttributes(streamUpdate, body)).toBe(true);
                        done();
                    });
                });
            });
        });

        // it('should only update the specified attributes', function(done) {}); // TODO

        // describe('DELETE all', function() {

        //     it('should delete all streams', function(done) {
        //         request.del({
        //             url: url
        //         }, function(err, response, body) {
        //             expect(response.statusCode).toBe(204);

        //             request.get({
        //                 url: url,
        //                 json: true
        //             }, function(err, response, body) {
        //                 expect(Array.isArray(body)).toBe(true);
        //                 expect(body.length).toBe(0);
        //                 done();
        //             });
        //         });
        //     });

        // });

        describe('DELETE one', function() {

            it('should respond with an error for invalid IDs', function(done) {
                expectInvalidIdsToProcuceErrorFor(request.del, done);
            });

            it('should delete the stream with the specified index position', function(done) {
                var index = 0;

                request.get({
                    url: url,
                    json: true
                }, function(err, response, body) {
                    var aStream = body[0];

                    request.del({
                        url: url + aStream._id,
                        json: true
                    }, function(err, response, body) {
                        expect(response.statusCode).toBe(204);

                        request.get({
                            url: url + aStream._id,
                            json: true
                        }, function(err, response, body) {
                            expect(response.statusCode).toBe(404);
                            expect(body.type).toEqual('error');
                            done();
                        });
                    });
                });
            });

        });

    });

});