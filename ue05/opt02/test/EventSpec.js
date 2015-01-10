describe('The Event module', function() {
    'use strict';

    var EventModel = require('../js/models/Event').EventModel;

    it('should export dependencies', function() {
        expect(EventModel).toBeDefined();
    });

});