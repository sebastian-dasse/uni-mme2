-- INSTALLATION INSTRUCTIONS --


Before first run you will have to install the application. To do so type:

    npm install


Run the application with:

    node index.js

Run the application with automatic server restart after code changes with:

    nodemon index.js

Or simply type:

    npm start

with npm pre-configured for automatic server restart.


To run the tests:

# in one console:
    mongod

# in another console:
    npm start

# in yet another console:
    npm test


To fill the database with some dummy data:

# in one console:
    mongod

# in another console:
    node ./test/dummyStreamsFactory.js --run
