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

            deepEqual(path.getDirection(), {"x": 10, "y": 10});
        });
    };
    return {run: run};
}
);

