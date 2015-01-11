define(['underscore', './vector2'], function (_, vector2) {
    var Circle = function (radius){
        this.radius = radius;
    };
    Circle.prototype.getWidth = function() {
        return this.radius*2;
    };
    Circle.prototype.getHeight = function() {
        return this.radius*2;
    };

    var Rectangle = function (width, height){
        this.width = width;
        this.height = height;
    };
    Rectangle.prototype.getWidth = function() {
        return this.width;
    };
    Rectangle.prototype.getHeight = function() {
        return this.height;
    };

    var Polygon = function (lines) {
        if (!lines || lines.length < 3) {
            throw "Must provide array of more than 2 LineSegments to Polygon constructor";
        }
        for (var i = 0; i < lines.length - 1; i++) {
            var currLine = lines[i];
            var nextLine = lines[i+1];
            if (!_.isEqual(currLine.endPoint(), nextLine.startPoint())) {
                throw ("Cannot create an open polygon; see lines " + 
                        i + " and " + (i+1) + ": " + JSON.stringify(currLine) + 
                        ", " + JSON.stringify(nextLine));
            }
        }
        if (!_.isEqual(lines[0].startPoint(), lines[lines.length-1].endPoint())) {
            throw ("Cannot create an open polygon; see lines 0 and " + 
                    (lines.length-1) + ": " + JSON.stringify(lines[0]) + 
                    ", " + JSON.stringify(lines[lines.length-1]));
        }
        this.lines = lines;
    };

    Polygon.prototype.getCentroid = function () {
        var sumOfPoints = vector2.ZERO;
        for (var i = 0; i < this.lines.length; i++) {
            sumOfPoints = sumOfPoints.add(this.lines[i].startPoint());
        }
        return sumOfPoints.divide(this.lines.length);
    };

    Polygon.prototype.getSpacedPointsAlongPerimeter = function (pointDistance) {
        var points = [];
        for (var i = 0; i < this.lines.length; i++) {
            points = points.concat(this.lines[i].getSpacedPoints(pointDistance));
        }
        return points;
    };

    Polygon.prototype.getIntersectionPoint = function (line) {
        for (var i = 0; i < this.lines.length; i++) {
            var intersection = line.getIntersectionPoint(this.lines[i]);
            if (intersection) {
                return intersection;
            }
        }
        return null;
    };

    var LineSegment = function (a, b, c, d) {
        /*
         * The following input parameter cases are accepted:
         *  - a is an Array with at least two points and b is an Array with at
         *    least two points 
         *    - in which case, the first two points of a are
         *      taken to be the start point, and the first two points of b are
         *      taken to be the end point
         *
         *  - a and b both have properties x and y
         *    - similarly to above a becomes the start point and b the end point
         *
         *  - a, b, c, and d are all provided and they are all numbers
         *    - these will be taken for the parameters of the line segment,
         *      as described below
         *
         * A line segment has the property s.t.
         *   x = a * t + c
         *   y = b * t + d
         * where t is a parameter between 0 and 1.
         *
         */

        if (a instanceof Array && b instanceof Array) {
            a = {"x": a[0], "y": a[1]};
            b = {"x": b[0], "y": b[1]};
        }

        if (a.hasOwnProperty("x") && a.hasOwnProperty("y") && c === undefined && d === undefined) {
            this.c = a.x;
            this.d = a.y;
            this.a = b.x - this.c;
            this.b = b.y - this.d;
        } else if (a !== undefined && b !== undefined && typeof(a) === typeof(1) && typeof(b) === typeof(1)) {
            this.a = a;
            this.b = b;
            if (c === undefined) {
                c = 0;
            }
            if (d === undefined) {
                d = 0;
            }
            this.c = c;
            this.d = d;
        } else {
            throw "Error constructing line segment";
        }
    };

    LineSegment.prototype.startPoint = function () {
        return this.calculatePoint(0);
    };

    LineSegment.prototype.endPoint = function () {
        return this.calculatePoint(1);
    };

    LineSegment.prototype.calculatePoint = function (t) {
        if (t < 0 || t > 1) {
            throw "Parameter to line segment out of range; must be between 0 and 1 inclusive";
        }
        return new vector2.Vector2(this.a * t + this.c, this.b * t + this.d);
    };

    LineSegment.prototype.findPerpendicularEndingAtPoint = function (x, y) {
        if (y === undefined) {
            if (x instanceof Array) {
                y = x[1];
                x = x[0];
            } else {
                y = x.y;
                x = x.x;
            }
        }
        var newA = -this.b;
        var newB = this.a;
        var newC = x - newA;
        var newD = y - newB;
        return new LineSegment(newA, newB, newC, newD);
    };

    LineSegment.prototype.getDirection = function () {
        return this.endPoint().subtract(this.startPoint()).normalized();
    };
    
    LineSegment.prototype.length = function () {
        return this.endPoint().subtract(this.startPoint()).magnitude();
    };

    LineSegment.prototype.getSpacedPoints = function (pointDistance) {
        var startPoint = this.calculatePoint(0);
        var length = this.calculatePoint(1).subtract(startPoint).magnitude();
        if (length < pointDistance) {
            return [startPoint];
        }
        var tIncrementFactor = pointDistance / length;
        var points = [];
        for (var t = 0; t <= 1; t += tIncrementFactor) {
            points.push(this.calculatePoint(t));
        }

        return points;
    };

    LineSegment.prototype.getIntersectionPoint = function (obj) {
        if (obj instanceof Polygon) {
            return obj.getIntersectionPoint(this);
        }
        var line = obj;
        var t = null;
        if (line.a === this.a) {
            if (line.b !== this.b) {
                t = (line.d - this.d) / (this.b - line.b);
            }
        } else {
            t = (line.c - this.c) / (this.a - line.a);
        }
        if (t === null || t < 0 || t > 1) {
            return null;
        }
        return this.calculatePoint(t);
    };

    LineSegment.prototype.rotateCCW = function (angleInRadians) {
        var dir = this.endPoint().subtract(this.startPoint());
        var cosAngle = Math.cos(angleInRadians);
        var sinAngle = Math.sin(angleInRadians);

        var newDirX = cosAngle * dir.x - sinAngle * dir.y;
        var newDirY = sinAngle * dir.x + cosAngle * dir.y;

        var startPoint = this.startPoint();
        var endPoint = this.startPoint().add({"x": newDirX, "y": newDirY});
        return new LineSegment(startPoint, endPoint);
    };

    LineSegment.prototype.rotateCW = function (angleInRadians) {
        return this.rotateCCW(-angleInRadians);
    };

    var degreesToRadians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    return {
        Circle: Circle,
        Rectangle: Rectangle,
        Polygon: Polygon,
        LineSegment: LineSegment,
        degreesToRadians: degreesToRadians
    };
});
