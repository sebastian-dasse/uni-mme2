// describe('The restService module', function() {
//     'use strict';

//     var restService = require('../restService'),
//         dummyStreamData = [];

//     // returns a fresh array of dummy data
//     var produceDummyData = function() {
//         var dummy = [{
//             data: 'foo'
//         }, {
//             data: 'bar'
//         }, {
//             data: 'baz'
//         }];
//         return dummy;
//         // return dummy.slice();
//     };


//     beforeEach(function() {
//         dummyStreamData = produceDummyData();
//         restService.setData(dummyStreamData);
//     });

//     afterEach(function() {
//         // restService.setData([])
//     });


//     var expectInvalidIndicesToProcuceErrorFor = function(fn) {
//         return function(index) {
//             fn({
//                 params: {
//                     index: index
//                 }
//             }, {
//                 status: function(code) {
//                     expect(code).toBe(404);
//                     return {
//                         send: function(data) {
//                             expect(data.type).toBe('ServerError');
//                             expect(data.statusCode).toBe(404);
//                         }
//                     };
//                 }
//             });
//         };
//     };

//     var expectEmptyBodyToProduceErrorFor = function(fn, params) {
//         fn({
//             body: undefined,
//             params: params // optional
//         }, {
//             status: function(code) {
//                 expect(code).toBe(400);
//                 return {
//                     send: function(data) {
//                         expect(data.type).toBe('ServerError');
//                         expect(data.statusCode).toBe(400);
//                     }
//                 };
//             }
//         });
//     };


//     it('should export dependencies', function() {
//         expect(restService.getAll).toBeDefined();
//         expect(restService.getOne).toBeDefined();
//         expect(restService.postAll).toBeDefined();
//         // expect(restService.postOne).toBeDefined();
//         expect(restService.putAll).toBeDefined();
//         expect(restService.putOne).toBeDefined();
//         // expect(restService.deleteAll).toBeDefined();
//         expect(restService.deleteOne).toBeDefined();
//         expect(restService.setData).toBeDefined();
//         expect(restService.getData).toBeDefined();
//     });

//     it('should have an array of streams', function() {
//         expect(Object.prototype.toString.call(restService.getData())).toEqual('[object Array]');
//     });

//     describe('getAll', function() {

//         it('should send all streams', function() {
//             restService.getAll({
//                 query: {}
//             }, {
//                 send: function(sentData) {
//                     expect(sentData).toEqual(dummyStreamData);
//                 }
//             });
//         });

//     });

//     describe('getOne', function() {

//         it('should reject invalid indices', function() {
//             var test = expectInvalidIndicesToProcuceErrorFor(restService.getOne);
//             test(-1);
//             test(10000);
//             test('abc');
//         });

//         it('should send the stream at the specified index position', function() {
//             restService.getOne({
//                 params: {
//                     index: 0
//                 }
//             }, {
//                 send: function(sentData) {
//                     expect(sentData).toEqual(dummyStreamData[0]);
//                 }
//             });
//         });

//     });

//     describe('postAll', function() {

//         it('should reject a request with an empty body', function() {
//             expectEmptyBodyToProduceErrorFor(restService.postAll);
//         });

//         it('should create a new stream at the end of the list', function() {
//             var originalLength = restService.getData().length,
//                 newElement = {
//                     data: 'fresh'
//                 };

//             restService.postAll({
//                 body: newElement
//             }, {
//                 status: function(code) {
//                     expect(code).toBe(201);
//                     return {
//                         send: function(setData) {
//                             expect(setData).toEqual(newElement);
//                         }
//                     };
//                 }
//             });

//             var actual = restService.getData();
//             expect(actual.length).toBe(originalLength + 1);
//             expect(actual[actual.length - 1]).toEqual(newElement);
//         });

//     });

//     // describe('postOne', function() {

//     //     it('should not be allowed', function() {
//     //         restService.postOne({}, {
//     //             status: function(code) {
//     //                 expect(code).toBe(405);
//     //                 return {
//     //                     send: function(sentData) {
//     //                         expect(sentData.type).toBe('ServerError');
//     //                         expect(sentData.statusCode).toBe(405);
//     //                     }
//     //                 };
//     //             }
//     //         });
//     //     });

//     // });

//     describe('putAll', function() {

//         it('should only accept an array', function() {
//             restService.putAll({
//                 body: 'no array'
//             }, {
//                 status: function(code) {
//                     expect(code).toBe(400);
//                     return {
//                         send: function(sentData) {
//                             expect(sentData.type).toBe('ServerError');
//                             expect(sentData.statusCode).toBe(400);
//                         }
//                     };
//                 }
//             });
//         });

//         it('should update the list with the passed array', function() {
//             var newList = [{
//                 data: 'fresh'
//             }];

//             restService.putAll({
//                 body: newList
//             }, {
//                 status: function(code) {
//                     expect(code).toBe(201);
//                     return {
//                         send: function(sentData) {
//                             expect(sentData).toEqual(newList);
//                         }
//                     };
//                 }
//             });

//             expect(restService.getData()).toBe(newList);
//         });

//     });

//     describe('putOne', function() {

//         it('should reject invalid indices', function() {
//             var test = expectInvalidIndicesToProcuceErrorFor(restService.putOne);
//             test(-1);
//             test(10000);
//             test('abc');
//         });

//         it('should reject a request with an empty body', function() {
//             expectEmptyBodyToProduceErrorFor(restService.putOne, {
//                 index: 0
//             });
//         });

//         it('should not modify the total number of streams', function() {
//             var originalLength = restService.getData().length;

//             restService.putOne({
//                 body: {},
//                 params: {
//                     index: 0
//                 }
//             }, {
//                 send: function() {}
//             });

//             expect(restService.getData().length).toBe(originalLength);
//         });

//         it('should update the stream at the specified index position', function() {
//             var pos = 0,
//                 newElement = {
//                     "data": "fresh"
//                 };

//             restService.putOne({
//                 body: newElement,
//                 params: {
//                     index: pos
//                 }
//             }, {
//                 send: function() {}
//             });

//             expect(restService.getData()[pos]).toEqual(newElement);
//         });

//     });

//     // describe('deleteAll', function() {

//     //     it('should delete all streams', function() {
//     //         restService.deleteAll({}, {
//     //             status: function(code) {
//     //                 expect(code).toBe(204);
//     //                 return {
//     //                     send: function() {}
//     //                 };
//     //             }
//     //         });

//     //         expect(restService.getData().length).toBe(0);
//     //     });

//     // });

//     describe('deleteOne', function() {

//         it('should reject invalid indices', function() {
//             var test = expectInvalidIndicesToProcuceErrorFor(restService.getOne);
//             test(-1);
//             test(10000);
//             test('abc');
//         });

//         it('should delete the stream with the specified index position', function() {
//             var pos = 0,
//                 elementToDelete = dummyStreamData[0];

//             restService.deleteOne({
//                 params: {
//                     index: pos
//                 }
//             }, {
//                 status: function(code) {
//                     expect(code).toBe(204);
//                     return {
//                         send: function() {}
//                     };
//                 }
//             });

//             var actual = restService.getData();
//             expect(actual[pos]).toBeUndefined();
//         });

//     });

// });