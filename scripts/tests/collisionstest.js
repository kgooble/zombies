"use strict";
define(['../physics/collisions', '../physics/vector2'],
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

            ok(collisions.rectangleRectangleCollision(r1, r2), 
                "two rectangles directly on top of each other and same size");

            r2.position.x = 11;
            ok(!collisions.rectangleRectangleCollision(r1, r2),
                "one rectangle is below the other one; no intersection " +
                "should occur");

            r2.position.x = 1;
            r2.position.y = 4;
            ok(collisions.rectangleRectangleCollision(r1, r2),
                "one rectangle is to the bottom-right of the other");

            r1.shape.getHeight = function () { return 20; };
            r2.position.x = 0; 
            r2.position.y = 10;
            r2.shape = { "getWidth" : function () { return 1; },
                         "getHeight": function () { return 1; }
                       };

            ok(collisions.rectangleRectangleCollision(r1, r2),
                "one rectangle is along the bottom edge of the other");
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

            ok(collisions.rectangleCircleCollision(r, c), 
                "collision where rectangle & circle are centered on same spot");

            c.position.y = 2;
            ok(collisions.rectangleCircleCollision(r, c),
                "collision where circle is a bit lower than the rectangle's center");

            r.shape.getHeight = function () { return 20; };
            c.position.y = 10;
            c.shape.radius = 1;
            ok(collisions.rectangleCircleCollision(r, c),
                "collision where the circle is beyond the point where a " +
                "circle-circle collision would catch the intersection");

        }); 
    };
    return {run: run};
}
);

