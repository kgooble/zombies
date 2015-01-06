"use strict";
define(['../world', '../physics/vector2'],
function(world, v) {
    var run = function() {
        test("world can calculate a path between two points",
        function () {
            var p1 = new v.Vector2(10, 10);
            var p2 = new v.Vector2(30, 30);
            var w = new world.World(100, 100);

            var path = w.getPathBetween(p1, p2);

            deepEqual(path.getDirection(), new v.Vector2(1, 1).normalized());
        });

        test("world can add a wall to its graph representation and alters path between two points",
        function () {
            var w = new world.World(100, 100);
            w.addWall(10, 10, 20, 20);
            var path = w.getPathBetween({"x": 0, "y": 0}, {"x": 40, "y": 40});
            deepEqual(path.getDirection(), new v.Vector2(1, 0));
        });
    };
    return {run: run};
}
);

