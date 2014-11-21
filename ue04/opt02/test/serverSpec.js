describe('A suite', function() {
    var serverJs = require('../server'),
        app = serverJs.app,
        Error = serverJs.Error,
        server = serverJs.server,
        streams = serverJs.streams;

    // beforeEach(function() {});
    // afterEach(function() {});

    describe('the serverJs', function() {

        it('should export dependencies', function() {
            expect(app).toBeDefined();
            expect(Error).toBeDefined();
            expect(streams).toBeDefined();
            expect(server).toBeDefined();
        });

        it('should have a standard error', function() {
            var err = Error();
            expect(err.type).toEqual('error');
            expect(err.statusCode).toBe(404);
            expect(err.msg).toEqual('Requested resource not found.');
        });

        it('should have an error with a customized message', function() {
            var err = Error('foo bar');
            expect(err.type).toEqual('error');
            expect(err.statusCode).toBe(404);
            expect(err.msg).toEqual('foo bar');
        });

        it('should have an array of streams', function() {
            expect(Object.prototype.toString.call(streams)).toEqual('[object Array]');
        });

    });

    describe('the REST app', function() {

        beforeEach(function() {
            streams = [{
                type: 'stream',
                data: 'foo'
            }];

            // app.listen(8000, function() {
            //     // console.log('Server runnung on port 8000');
            // });
        });

        // afterEach(function() {
        //     app.close();
        // });

        describe('GET', function() {

            var request = require('http')

            it('get is defined', function() {
                expect(app.get).toBeDefined();
            });

            it('try to get', function(done) {
                request.get('http://localhost:8000/api/v1/streams', function(error, response, body) {
                    expect(body).toEqual(streams); // <------------- ** FAILS ** ------------
                    done();
                });
            }, 250);

        });


    });

});