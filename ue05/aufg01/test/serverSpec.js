describe('The server module', function() {
    'use strict';

    var request = require('request'),
        streamsService = require('../streamsService').streamsService,
        dummyStreamsFactory = require('./dummyStreamsFactory'),
        url = 'http://localhost:8000/api/v1/streams/';

    beforeEach(function(done) {
        var log = false;
        dummyStreamsFactory.initializeDb(log, done);

        // beforeEach(function(done) {
        // var dummyStreams = [{
        //     id: 'foo'
        // }, {
        //     id: 'bar'
        // }, {
        //     id: 'baz'
        // }];

        // streamsService.setData(dummyStreams);
        // done();

        // request.put({
        //     url: url,
        //     json: true,
        //     body: dummyStreams
        // }, function(err, response, body) {
        //     done();
        // });
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

        var expectInvalidIdsToProcuceErrorFor = function(fn, done, opts) {
            // var arr = [-1, 10000, 'abc', '123456789012345678901234'];
            var arr = ['123456789012345678901234'];
            var options = {
                // url: url,
                json: true
            };
            for (var opt in opts) {
                options[opt] = opts[opt];
            }
            // done();
            var numCalls = 0;
            arr.forEach(function(id) {
                options.url = url + id
                fn(options, function(err, response, body) {
                    numCalls++;
                    console.log(response.statusCode)
                    console.log(body)
                    console.log('-------------------------')
                    expect(response.statusCode).toBe(404);
                    expect(body.type).toEqual('ServerError');
                    if (numCalls == arr.length) {
                        done();
                    }
                });
            });
        };

        describe('GET one', function() {

            iit('should respond with an error for invalid indices', function(done) {
                // expectInvalidIdsToProcuceErrorFor(request.get, done);

                // expectInvalidIdsToProcuceErrorFor(request.del, done); // FIXME debugging
                var reqOptions = {
                    body: {
                        name: 'foo'
                    }
                };
                expectInvalidIdsToProcuceErrorFor(request.put, done, reqOptions); // FIXME debugging

            });

            it('should get the stream at the specified index position', function(done) {
                var index = 0;

                var expectGetStreamsAtIndexToEqual = function(index, expected, done) {
                    request.get({
                        url: url,
                        json: true
                    }, function(err, response, body) {
                        expect(body[index]).toEqual(expected);
                        done();
                    });
                };

                request.get({
                    url: url + index,
                    json: true
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(200);
                    expectGetStreamsAtIndexToEqual(index, body, done);
                });
            });

        });

        describe('POST all', function() {

            it('should create a new stream at the end of the list', function(done) {
                var newStream = {
                    _id: '9',
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
                    expect(response.statusCode).toBe(201);
                    expect(body).toEqual(newStream);
                    done();
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
        //             expect(body.type).toEqual('ServerError');
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
                    expect(body.type).toEqual('ServerError');
                    done();
                });
            });

            it('should update the list with the passed array', function(done) {
                var newStreams = [{
                    id: 'foo'
                }, {
                    id: 'bar'
                }];

                var expectGetStreamsToEqual = function(expected, done) {
                    request.get({
                        url: url,
                        json: true
                    }, function(err, response, body) {
                        expect(body).toEqual(expected);
                        done();
                    });
                };

                request.put({
                    url: url,
                    json: true,
                    body: newStreams
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(201);
                    expect(body).toEqual(newStreams, done);
                    expectGetStreamsToEqual(newStreams, done);
                });

            });

        });

        describe('PUT one', function() {

            it('should respond with an error for invalid indices', function(done) {
                var reqOptions = {
                    body: {
                        name: 'foo'
                    }
                };
                expectInvalidIdsToProcuceErrorFor(request.put, done, reqOptions);
                // [-1, 10000, 'abc'].forEach(function(index) {
                //     request.put({
                //         url: url + index,
                //         json: true,
                //         body: {}
                //     }, function(err, response, body) {
                //         expect(response.statusCode).toBe(404);
                //         expect(body.type).toEqual('ServerError');
                //         done();
                //     });
                // });
            });

            it('should not modify the total number of streams', function(done) {
                var originalNumber,
                    newNumber;

                request.get({
                    url: url,
                    json: true
                }, function(err, response, body) {
                    originalNumber = body.length;

                    request.put({
                        url: url + '0',
                        json: true,
                        body: {}
                    }, function(err, response, body) {

                        request.get({
                            url: url,
                            json: true
                        }, function(err, response, body) {
                            newNumber = body.length;

                            expect(newNumber).toBe(originalNumber);
                            done();
                        });
                    });
                });
            });
        });

        it('should update the stream at the specified index position', function(done) {
            var streamUpdate = {
                    _id: '12',
                    name: 'updated',
                    description: 'freshly updated',
                    // url: 'https://www.youtube.com/watch?v=UDB-jm8MWro',
                    state: 0
                },
                index = 0;

            var updatedAttributesAreEqual = function(updated, update) {
                for (var attr in update) {
                    if (updated[attr] != update[attr]) {
                        return false;
                    }
                }
                return true;
            };

            request.put({
                url: url + index,
                json: true,
                body: streamUpdate
            }, function(err, response, body) {
                expect(response.statusCode).toBe(200);
                expect(updatedAttributesAreEqual(body, streamUpdate)).toBe(true);

                request.get({
                    url: url + index,
                    json: true
                }, function(err, response, body) {
                    expect(updatedAttributesAreEqual(body, streamUpdate)).toBe(true);
                    done();
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

            it('should respond with an error for invalid indices', function(done) {
                expectInvalidIdsToProcuceErrorFor(request.del, done);
                // [-1, 10000, 'abc'].forEach(function(index) {
                //     request.del({
                //         url: url + index,
                //         json: true
                //     }, function(err, response, body) {
                //         expect(response.statusCode).toBe(404);
                //         expect(body.type).toEqual('ServerError');
                //         done();
                //     });
                // });
            });

            it('should delete the stream with the specified index position', function(done) {
                var index = 0;

                request.del({
                    url: url + index,
                    json: true
                }, function(err, response, body) {
                    expect(response.statusCode).toBe(204);

                    request.get({
                        url: url + index,
                        json: true
                    }, function(err, response, body) {
                        expect(response.statusCode).toBe(404);
                        expect(body.type).toEqual('ServerError');
                        done();
                    });
                });
            });

        });

    });

});