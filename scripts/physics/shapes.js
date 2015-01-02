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

    var LineSegment = function (a, b, c, d) {
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

    return {
        Circle: Circle,
        Rectangle: Rectangle,
        Polygon: Polygon,
        LineSegment: LineSegment
    };
});
