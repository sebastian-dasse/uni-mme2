describe('The streams module', function() {
    'use strict';

    var streams = require('../streams').streams,
        dummyStreamData = [];

    // returns a fresh array of dummy data
    var produceDummyData = function() {
        var dummy = [{
            data: 'foo'
        }, {
            data: 'bar'
        }, {
            data: 'baz'
        }];
        return dummy;
        // return dummy.slice();
    };


    beforeEach(function() {
        dummyStreamData = produceDummyData();
        streams.setData(dummyStreamData);
    });

    afterEach(function() {
        // streams.setData([])
    });


    var expectInvalidIndicesToProcuceErrorFor = function(fn) {
        return function(index) {
            fn({
                params: {
                    index: index
                }
            }, {
                status: function(code) {
                    expect(code).toBe(404);
                    return {
                        send: function(data) {
                            expect(data.type).toBe('ServerError');
                            expect(data.statusCode).toBe(404);
                        }
                    };
                }
            });
        };
    };

    var expectEmptyBodyToProduceErrorFor = function(fn, params) {
        fn({
            body: undefined,
            params: params // optional
        }, {
            status: function(code) {
                expect(code).toBe(400);
                return {
                    send: function(data) {
                        expect(data.type).toBe('ServerError');
                        expect(data.statusCode).toBe(400);
                    }
                };
            }
        });
    };


    it('should export dependencies', function() {
        expect(streams.getAll).toBeDefined();
        expect(streams.getOne).toBeDefined();
        expect(streams.postAll).toBeDefined();
        // expect(streams.postOne).toBeDefined();
        expect(streams.putAll).toBeDefined();
        expect(streams.putOne).toBeDefined();
        // expect(streams.deleteAll).toBeDefined();
        expect(streams.deleteOne).toBeDefined();
        expect(streams.setData).toBeDefined();
        expect(streams.getData).toBeDefined();
    });

    it('should have an array of streams', function() {
        expect(Object.prototype.toString.call(streams.getData())).toEqual('[object Array]');
    });

    describe('getAll', function() {

        it('should send all streams', function() {
            streams.getAll({
                query: {}
            }, {
                send: function(sentData) {
                    expect(sentData).toEqual(dummyStreamData);
                }
            });
        });

    });

    describe('getOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(streams.getOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should send the stream at the specified index position', function() {
            streams.getOne({
                params: {
                    index: 0
                }
            }, {
                send: function(sentData) {
                    expect(sentData).toEqual(dummyStreamData[0]);
                }
            });
        });

    });

    describe('postAll', function() {

        it('should reject a request with an empty body', function() {
            expectEmptyBodyToProduceErrorFor(streams.postAll);
        });

        it('should create a new stream at the end of the list', function() {
            var originalLength = streams.getData().length,
                newElement = {
                    data: 'fresh'
                };

            streams.postAll({
                body: newElement
            }, {
                status: function(code) {
                    expect(code).toBe(201);
                    return {
                        send: function(setData) {
                            expect(setData).toEqual(newElement);
                        }
                    };
                }
            });

            var actual = streams.getData();
            expect(actual.length).toBe(originalLength + 1);
            expect(actual[actual.length - 1]).toEqual(newElement);
        });

    });

    // describe('postOne', function() {

    //     it('should not be allowed', function() {
    //         streams.postOne({}, {
    //             status: function(code) {
    //                 expect(code).toBe(405);
    //                 return {
    //                     send: function(sentData) {
    //                         expect(sentData.type).toBe('ServerError');
    //                         expect(sentData.statusCode).toBe(405);
    //                     }
    //                 };
    //             }
    //         });
    //     });

    // });

    describe('putAll', function() {

        it('should only accept an array', function() {
            streams.putAll({
                body: 'no array'
            }, {
                status: function(code) {
                    expect(code).toBe(400);
                    return {
                        send: function(sentData) {
                            expect(sentData.type).toBe('ServerError');
                            expect(sentData.statusCode).toBe(400);
                        }
                    };
                }
            });
        });

        it('should update the list with the passed array', function() {
            var newList = [{
                data: 'fresh'
            }];

            streams.putAll({
                body: newList
            }, {
                status: function(code) {
                    expect(code).toBe(201);
                    return {
                        send: function(sentData) {
                            expect(sentData).toEqual(newList);
                        }
                    };
                }
            });

            expect(streams.getData()).toBe(newList);
        });

    });

    describe('putOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(streams.putOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should reject a request with an empty body', function() {
            expectEmptyBodyToProduceErrorFor(streams.putOne, {
                index: 0
            });
        });

        it('should not modify the total number of streams', function() {
            var originalLength = streams.getData().length;

            streams.putOne({
                body: {},
                params: {
                    index: 0
                }
            }, {
                send: function() {}
            });

            expect(streams.getData().length).toBe(originalLength);
        });

        it('should update the stream at the specified index position', function() {
            var pos = 0,
                newElement = {
                    "data": "fresh"
                };

            streams.putOne({
                body: newElement,
                params: {
                    index: pos
                }
            }, {
                send: function() {}
            });

            expect(streams.getData()[pos]).toEqual(newElement);
        });

    });

    // describe('deleteAll', function() {

    //     it('should delete all streams', function() {
    //         streams.deleteAll({}, {
    //             status: function(code) {
    //                 expect(code).toBe(204);
    //                 return {
    //                     send: function() {}
    //                 };
    //             }
    //         });

    //         expect(streams.getData().length).toBe(0);
    //     });

    // });

    describe('deleteOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(streams.getOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should delete the stream with the specified index position', function() {
            var pos = 0,
                elementToDelete = dummyStreamData[0];

            streams.deleteOne({
                params: {
                    index: pos
                }
            }, {
                status: function(code) {
                    expect(code).toBe(204);
                    return {
                        send: function() {}
                    };
                }
            });

            var actual = streams.getData();
            expect(actual[pos]).toBeUndefined();
        });

    });

});