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
    ['QUnit', 'tests/vector2tests', 'tests/clocktests', 'tests/animationstest'],
    function(QUnit, vector2tests, clocktests, animationstest) {
        // run the tests.
        vector2tests.run();
        clocktests.run();
        animationstest.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);
