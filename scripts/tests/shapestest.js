"use strict";
define(['../physics/shapes', '../physics/vector2'],
function(shapes, v) {
    var run = function() {
        test("cannot create polygon with less than 3 line segments",
        function () {
            try {
                var p = new shapes.Polygon();
            } catch(err) {
                equal(err, "Must provide array of more than 2 LineSegments to Polygon constructor");
            }
        });

        test("cannot create open polygon", 
        function () {
            try {
                var p = new shapes.Polygon([
                    { startPoint: function () {return [0,0];}, endPoint: function () {return [1,1];} },
                    { startPoint: function () {return [1,1];}, endPoint: function () {return [1,0];} },
                    { startPoint: function () {return [2,2];}, endPoint: function () {return [0,0];} }
                ]);
            } catch (err) {
                equal(err, "Cannot create an open polygon; see lines 1 and 2: {}, {}");
            }

        });

        test("calculate centroid of polygon",
        function () {
            var p = new shapes.Polygon([
                new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(1, 0)),
                new shapes.LineSegment(new v.Vector2(1, 0), new v.Vector2(1, 1)),
                new shapes.LineSegment(new v.Vector2(1, 1), new v.Vector2(0, 1)),
                new shapes.LineSegment(new v.Vector2(0, 1), new v.Vector2(0, 0))
            ]);

            var centroid = p.getCentroid();
            deepEqual(centroid, new v.Vector2(0.5, 0.5));
        });

        test("find points along edge of polygon using line segments",
        function () {
            var p = new shapes.Polygon([
                new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(10, 0)),
                new shapes.LineSegment(new v.Vector2(10, 0), new v.Vector2(10, 10)),
                new shapes.LineSegment(new v.Vector2(10, 10), new v.Vector2(0, 10)),
                new shapes.LineSegment(new v.Vector2(0, 10), new v.Vector2(0, 0))
            ]);

            var points = p.getSpacedPointsAlongPerimeter(1);
            equal(points.length, 44);
            for (var i = 0; i < 11; i++) {
                ok(points[i+1].x - points[i].x < 1.000001);
                ok(Math.abs(points[i+1].y - points[i].y) < 0.000001);
            }
            ok(Math.abs(points[10].x - points[11].x) < 0.000001);
            ok(Math.abs(points[10].y - points[11].y) < 0.000001);
            for (var i = 11; i < 22; i++) {
                ok(Math.abs(points[i+1].x - points[i].x) < 0.000001);
                ok(points[i+1].y - points[i].y < 1.000001);
            }
            ok(Math.abs(points[21].x - points[22].x) < 0.000001);
            ok(Math.abs(points[21].y - points[22].y) < 0.000001);
            for (var i = 22; i < 33; i++) {
                ok(points[i].x - points[i+1].x < 1.000001);
                ok(Math.abs(points[i+1].y - points[i].y) < 0.000001);
            }
            ok(Math.abs(points[32].x - points[33].x) < 0.000001);
            ok(Math.abs(points[32].y - points[33].y) < 0.000001);
            for (var i = 33; i < 43; i++) {
                ok(Math.abs(points[i+1].x - points[i].x) < 0.000001);
                ok(points[i].y - points[i+1].y < 1.000001);
            }
            ok(Math.abs(points[0].x - points[43].x) < 0.000001);
            ok(Math.abs(points[0].y - points[43].y) < 0.000001);
        });

        test("calculate point along linesegment",
        function () {
            var line = new shapes.LineSegment(1, 1);
            deepEqual(line.calculatePoint(1), new v.Vector2(1, 1));
        });

        test("calculate start and end points",
        function () {
            var line = new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(1, 0));
            deepEqual(line.startPoint(), new v.Vector2(0, 0));
            deepEqual(line.endPoint(), new v.Vector2(1, 0));

            line = new shapes.LineSegment(new v.Vector2(1, 0), new v.Vector2(1, 1));
            deepEqual(line.startPoint(), new v.Vector2(1, 0));
            deepEqual(line.endPoint(), new v.Vector2(1, 1));

        });

        test("construct line segment given start and end points",
        function () {
            var line = new shapes.LineSegment(new v.Vector2(0, 0),
                                              new v.Vector2(1, 5));
            deepEqual(line.calculatePoint(0), new v.Vector2(0, 0));
            deepEqual(line.calculatePoint(0.5), new v.Vector2(0.5, 2.5));
            deepEqual(line.calculatePoint(1), new v.Vector2(1, 5));

            try {
                line.calculatePoint(10);
                ok(false, "Should have thrown exception");
            } catch (err) {
                equal(err, "Parameter to line segment out of range; must be between 0 and 1 inclusive");
            }

        });

        test("find multiple points along linesegment with approximate desired point spacing given",
        function () {
            var line = new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(10, 10));

            var points = line.getSpacedPoints(1);
            equal(points.length, 15);
            for (var i = 0; i < points.length - 1; i++) {
                ok(Math.abs(points[i+1].subtract(points[i]).magnitude()) <= 1.000001);
            }
        });

        test("get intersection point for two line segments",
        function () {
            var line1 = new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(10, 10));
            var line2 = new shapes.LineSegment(new v.Vector2(0, 10), new v.Vector2(10, 0));

            deepEqual(line1.getIntersectionPoint(line2), new v.Vector2(5, 5));
        });

        test("intersection point is null for two parallel lines",
        function () {
            var line1 = new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(10, 10));
            var line2 = new shapes.LineSegment(new v.Vector2(1, 1), new v.Vector2(11, 11));

            equal(line1.getIntersectionPoint(line2), null);
        });

        test("get first intersection of polygon and line",
        function () {
            var line = new shapes.LineSegment(new v.Vector2(0, 0), new v.Vector2(10, 10));
            var poly = new shapes.Polygon([
                new shapes.LineSegment(new v.Vector2(9, 9), new v.Vector2(9, 11)),
                new shapes.LineSegment(new v.Vector2(9, 11), new v.Vector2(11, 11)),
                new shapes.LineSegment(new v.Vector2(11, 11), new v.Vector2(11, 9)),
                new shapes.LineSegment(new v.Vector2(11, 9), new v.Vector2(9, 9)),
            ]);

            var i1 = poly.getIntersectionPoint(line);
            var i2 = line.getIntersectionPoint(poly);

            deepEqual(i1, i2);
            deepEqual(i1, new v.Vector2(9, 9));
        });

    };
    return {run: run};
});
