describe('The stream module', function() {
    'use strict';

    var stream = require('../stream').stream,
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
        stream.setData(dummyStreamData);
    });

    // afterEach(function() {});


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
        expect(stream.getAll).toBeDefined();
        expect(stream.getOne).toBeDefined();
        expect(stream.postAll).toBeDefined();
        expect(stream.postOne).toBeDefined();
        expect(stream.putAll).toBeDefined();
        expect(stream.putOne).toBeDefined();
        expect(stream.deleteAll).toBeDefined();
        expect(stream.deleteOne).toBeDefined();
        expect(stream.setData).toBeDefined();
        expect(stream.getData).toBeDefined();
    });

    it('should have an array of streams', function() {
        expect(Object.prototype.toString.call(stream.getData())).toEqual('[object Array]');
    });

    describe('getAll', function() {

        it('should send all streams', function() {
            stream.getAll({}, {
                send: function(sentData) {
                    expect(sentData).toEqual(dummyStreamData);
                }
            });
        });

    });

    describe('getOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(stream.getOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should send the stream at the specified index position', function() {
            stream.getOne({
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
            expectEmptyBodyToProduceErrorFor(stream.postAll);
        });

        it('should create a new stream at the end of the list', function() {
            var originalLength = stream.getData().length,
                newElement = {
                    data: 'fresh'
                };

            stream.postAll({
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

            var actual = stream.getData();
            expect(actual.length).toBe(originalLength + 1);
            expect(actual[actual.length - 1]).toEqual(newElement);
        });

    });

    describe('postOne', function() {

        it('should not be allowed', function() {
            stream.postOne({}, {
                status: function(code) {
                    expect(code).toBe(405);
                    return {
                        send: function(sentData) {
                            expect(sentData.type).toBe('ServerError');
                            expect(sentData.statusCode).toBe(405);
                        }
                    };
                }
            });
        });

    });

    describe('putAll', function() {

        it('should only accept an array', function() {
            stream.putAll({
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

            stream.putAll({
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

            expect(stream.getData()).toBe(newList);
        });

    });

    describe('putOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(stream.putOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should reject a request with an empty body', function() {
            expectEmptyBodyToProduceErrorFor(stream.putOne, {
                index: 0
            });
        });

        it('should not modify the total number of streams', function() {
            var originalLength = stream.getData().length;

            stream.putOne({
                body: {},
                params: {
                    index: 0
                }
            }, {
                send: function() {}
            });

            expect(stream.getData().length).toBe(originalLength);
        });

        it('should update the stream at the specified index position', function() {
            var pos = 0,
                newElement = {
                    "data": "fresh"
                };

            stream.putOne({
                body: newElement,
                params: {
                    index: pos
                }
            }, {
                send: function() {}
            });

            expect(stream.getData()[pos]).toEqual(newElement);
        });

    });

    describe('deleteAll', function() {

        it('should delete all streams', function() {
            stream.deleteAll({}, {
                status: function(code) {
                    expect(code).toBe(200);
                    // expect(code).toBe(204);
                    return {
                        send: function() {}
                    };
                }
            });

            expect(stream.getData().length).toBe(0);
        });

    });

    describe('deleteOne', function() {

        it('should reject invalid indices', function() {
            var test = expectInvalidIndicesToProcuceErrorFor(stream.getOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should delete the stream with the specified index position', function() {
            var pos = 0,
                elementToDelete = dummyStreamData[0];

            stream.deleteOne({
                params: {
                    index: pos
                }
            }, {
                status: function(code) {
                    expect(code).toBe(200);
                    // expect(code).toBe(204);
                    return {
                        send: function() {}
                    };
                }
            });

            var actual = stream.getData();
            expect(actual[pos]).toBeUndefined();
        });

    });

});