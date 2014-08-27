"use strict";
require.config({
    paths: {
        'QUnit': 'qunit'
    },
    shim: {
       'QUnit': {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       } 
    }
});

// require the unit tests.
require(
    ['QUnit', 'tests/vector2tests', 'tests/clocktests', 'tests/animationstest',
     'tests/animationstatetest', 'tests/collisionstest', 'tests/actorstest'],
    function(QUnit, vector2tests, clocktests, animationstest, 
             animationstatetest, collisionstest, actorstest) {
        // run the tests.
        vector2tests.run();
        clocktests.run();
        animationstest.run();
        animationstatetest.run();
        collisionstest.run();
        actorstest.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);
