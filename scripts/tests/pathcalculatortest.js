"use strict";
define(["../ai/pathcalculator", "../physics/shapes"], 
function (pathcalc, shapes) {
    var run = function() {
        test("the first path a path calculator returns is its input path", 
        function () {
            var initPath = new shapes.LineSegment([0,0], [1,1]);
            var pc = new pathcalc.PathCalculator(initPath);

            var path = pc.getNextPath();

            deepEqual(path, initPath);
        });

        // perhaps in the future, different path determination,e.g. which way
        // to rotate it, should be extracted into a PathRotator?
        // PathDeterminer? Pather? some kind of external, pluggable
        // intelligence.
        test("the second path is rotated 30 degrees clockwise from the start path",
        function () {
            var initPath = new shapes.LineSegment([0,0], [1,0]);
            var pc = new pathcalc.PathCalculator(initPath);
            var path = pc.getNextPath();
            path = pc.getNextPath();

            var expectedEndX = (Math.sqrt(3) * 1/2);
            var expectedEndY = (-1/2);

            deepEqual(path.startPoint(), initPath.startPoint());
            ok(Math.abs(path.endPoint().x - expectedEndX) < 0.0000001);
            ok(Math.abs(path.endPoint().y - expectedEndY) < 0.0000001);

        });
    };
    return {run: run};
});
