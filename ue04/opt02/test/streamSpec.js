describe('The stream module', function() {
    'use strict';

    var streamJs = require('../stream'),
        stream = streamJs.stream;

    var streamData;

    beforeEach(function() {
        streamData = streamJs.streamData;
        streamJs = require('../stream'),
            stream = streamJs.stream;
    });

    // afterEach(function() {});


    var checkInvalidIndices = function(fn) {
        return function(index) {
            fn({
                params: {
                    index: index
                }
            }, {
                status: function(code) {
                    expect(code).toEqual(404);
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

    var checkForEmptyBody = function(fn, params) {
        fn({
            body: undefined,
            params: params // optional
        }, {
            status: function(code) {
                expect(code).toEqual(400);
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
        expect(streamData).toBeDefined();
    });

    it('should have an array of streams', function() {
        expect(Object.prototype.toString.call(streamData)).toEqual('[object Array]');
    });

    describe('getAll', function() {

        it('should send all streams', function() {
            stream.getAll({}, {
                send: function(data) {
                    expect(data).toEqual(streamData);
                }
            });
        });
    });

    describe('getOne', function() {

        it('should reject invalid indices', function() {
            var test = checkInvalidIndices(stream.getOne);
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
                send: function(data) {
                    expect(data).toEqual(streamData[0]);
                }
            });
        });

    });

    describe('postAll', function() {

        it('should reject a request with an empty body', function() {
            checkForEmptyBody(stream.postAll);
        });

        it('should create a new stream at the end of the list', function() {

            var listLength = streamData.length,
                newElement = {
                    "data": "fresh"
                };

            stream.postAll({
                body: newElement
            }, {
                status: function(code) {
                    expect(code).toEqual(201);
                    return {
                        send: function(data) {
                            // expect(streamData.length).toBe(listLength + 1);
                            // expect(streamData[streamData.length - 1]).toBe(newElement);
                        }
                    };
                }
            });

            stream.getAll({}, {
                send: function(data) {
                    expect(data.length).toBe(listLength + 1);
                    expect(data[data.length - 1]).toBe(newElement);
                }
            });
        });

    });

    describe('postOne', function() {

        it('should not be allowed', function() {
            stream.postOne({}, {
                status: function(code) {
                    expect(code).toEqual(405);
                    return {
                        send: function(data) {
                            expect(data.type).toBe('ServerError');
                            expect(data.statusCode).toBe(405);
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
                    expect(code).toEqual(400);
                    return {
                        send: function(data) {
                            expect(data.type).toBe('ServerError');
                            expect(data.statusCode).toBe(400);
                        }
                    };
                }
            });
        });

        it('should update the list with the passed array', function() {

            var newList = [{
                "data": "fresh"
            }];

            stream.putAll({
                body: newList
            }, {
                send: function(data) {

                    // TODO streamData should be injected into stream.js
                    // expect(streamData).toEqual(newList);
                }
            });

            stream.getAll({}, {
                send: function(data) {
                    expect(data).toEqual(newList);
                }
            });
        });

    });

    describe('putOne', function() {

        it('should reject invalid indices', function() {
            var test = checkInvalidIndices(stream.putOne);
            test(-1);
            test(10000);
            test('abc');
        });

        it('should reject a request with an empty body', function() {
            checkForEmptyBody(stream.putOne, {
                index: 0
            });
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

            stream.getOne({
                params: {
                    index: pos
                }
            }, {
                send: function(data) {
                    expect(data).toEqual(newElement);
                }
            });
        });

    });

    describe('deleteAll', function() {

        it('should delete all streams', function() {

            stream.deleteAll({}, {
                send: function() {}
            });

            stream.getAll({}, {
                send: function(data) {
                    expect(data.length).toBe(0);
                    expect(data).toEqual([]);
                }
            });

            // expect(streamData.length).toBe(0);
            // expect(streamData).toEqual([]);
        });

    });

    describe('deleteOne', function() {

        it('should reject invalid indices', function() {
            var test = checkInvalidIndices(stream.getOne);
            test(-1);
            test(10000);
            test('abc');
        });


        // TODO

        // it('should delete the stream with the specified index position', function() {

        //     var pos = 0,
        //         listLength = streamData.length, // not right???
        //         elementToDelete;

        //     stream.getAll({}, {
        //         send: function(data) {
        //             data.push({
        //                 "data": 1
        //             });
        //             data.push({
        //                 "data": 2
        //             });
        //             data.push({
        //                 "data": 3
        //             });
        //             console.log(data)
        //         }
        //     });

        //     stream.getOne({
        //         params: {
        //             index: pos
        //         }
        //     }, {
        //         // status: function(code) {
        //         //         // elementToDelete = data;
        //         //         return {
        //         //             send: function(data) {
        //         //                 elementToDelete = data;
        //         //             }
        //         //         };
        //         //     }
        //         send: function(data) {
        //             elementToDelete = data;
        //         }
        //     });

        //     stream.deleteOne({
        //         params: {
        //             index: pos
        //         }
        //     }, {
        //         send: function() {}
        //     });

        //     // stream.getOne({
        //     //     params: {
        //     //         index: pos
        //     //     }
        //     // }, {
        //     //     send: function(data) {
        //     //         expect(data).not.toEqual(elementToDelete);
        //     //     }
        //     // });

        //     stream.getAll({}, {
        //         send: function(data) {
        //             expect(data).not.toContain(elementToDelete);
        //             expect(data.length).toBe(listLength - 1);
        //             expect(data.length).toBe(listLength);
        //         }
        //     });

        //     // expect(data.length).toBe(listLength - 1);
        // });

    });

});