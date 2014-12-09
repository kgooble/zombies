"use strict";
define(['../physics/forces', '../physics/vector2', '../objectkinds'],
function(forces, vector2, objectkinds) {
    var run = function() {
    	var v = vector2.Vector2;

        test("pulling force calculates the correct direction of force", 
        function () {
        	var f = forces.pullToward({x: 5, y: 5});

        	deepEqual(f.on({x: 10, y: 5}), new vector2.Vector2(-5, 0));
        	deepEqual(f.on({x: 3, y: 3}), new vector2.Vector2(2, 2));
        });

        test("pushing force calculates the correct direction of force",
        function () {
        	var f = forces.pushAwayFrom({x: 5, y: 5});

        	deepEqual(f.on({x: 1, y: 1}), new vector2.Vector2(-4, -4));

        });

        test("player pulls zombie towards it",
        function () {
            var f = forces.calculateForces(
                {"kind": objectkinds.PLAYER, "position": new vector2.Vector2(4, 1)}, 
                {"kind": objectkinds.ZOMBIE});
            deepEqual(f.on({x: 0, y: 0}), new vector2.Vector2(4, 1));
        });

        test("bullet has no force on zombie",
        function () {
            var f = forces.calculateForces(
                {"kind": objectkinds.BULLET},
                {"kind": objectkinds.ZOMBIE});
            equal(f, null);

        });

        test("constant force always always moves in given direction",
        function () {
            var f = forces.constantForce({x: 5, y: 5}, 10);
            deepEqual(f.on({x: 0, y: 0}), new vector2.Vector2(1, 1).normalized().times(10));

        });

    };
    return {run: run};
}
);