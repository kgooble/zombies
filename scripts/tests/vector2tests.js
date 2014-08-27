"use strict";
define(['../physics/vector2'],
function(vector2) {
    var run = function() {
        test('vector2 subtraction test', 
        function () {
            deepEqual(new vector2.Vector2(5, 5).subtract(new vector2.Vector2(3, 1)), 
                      new vector2.Vector2(2, 4),
                      "subtract should subtract each component and return new vector2");

        });
        test('vector2 normalization and length test',
        function () {
            deepEqual(new vector2.Vector2(5, 0).normalized(),
                      new vector2.Vector2(1, 0),
                      "normalized should return vector2 with magnitude 1");
            equal(new vector2.Vector2(3, 4).magnitude(),
                  5,
                  "magnitude of vector should be the root of the sum of the " +
                  "squares of each component");
            equal(new vector2.Vector2(19, -3).normalized().magnitude(),
                  1,
                  "magnitude of normalized vector should be 1");
        });
    };
    return {run: run};
}
);
