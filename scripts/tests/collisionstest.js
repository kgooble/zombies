"use strict";
define(['../collisions', '../vector2'],
function(collisions, vector2) {
    var run = function() {
        test("rectangle rectangle collision", 
        function () {
            var r1 = { "position": {"x": 0, "y": 0},
                       "shape":    {"getWidth" : function() { return 10; },
                                    "getHeight": function() { return 10; } 
                                   }
                     };
            var r2 = { "position": {"x": 0, "y": 0},
                       "shape":    {"getWidth" : function() { return 10; },
                                    "getHeight": function() { return 10; } 
                                   }
                     };

            ok(collisions.rectangleRectangleCollision(r1, r2));

            r2.position.x = 11;
            ok(!collisions.rectangleRectangleCollision(r1, r2));

            r2.position.x = 1;
            r2.position.y = 4;
            ok(collisions.rectangleRectangleCollision(r1, r2));
        });

        test("rectangle circle collision",
        function () {
            var r = { "position": new vector2.Vector2(0, 0),
                      "shape":    {"getWidth" : function() { return 10; },
                                   "getHeight": function() { return 10; } 
                                  }
                    };
            var c = { "position": new vector2.Vector2(0, 0),
                      "shape":    {"radius": 5}
                    };

            ok(collisions.rectangleCircleCollision(r, c));

        }); 
    };
    return {run: run}
}
);

