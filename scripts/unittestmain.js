"use strict";
require.config({
    paths: {
        'QUnit': 'qunit',
        jquery: 'libs/jquery-1.11.1'
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
     'tests/animationstatetest', 'tests/collisionstest', 'tests/actorstest',
     'tests/spritemaptest', 'tests/gametest', 'tests/rendererstest', 'tests/forcestest'],
    function(QUnit, vector2tests, clocktests, animationstest, 
             animationstatetest, collisionstest, actorstest,
             spritemaptest, gametest, rendererstest, forcestest) {
        // run the tests.
        vector2tests.run();
        clocktests.run();
        animationstest.run();
        animationstatetest.run();
        collisionstest.run();
        actorstest.run();
        spritemaptest.run();
        gametest.run();
        rendererstest.run();
        forcestest.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);
