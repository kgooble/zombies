define(['./vector2', './shapes', 'util/logger'], 
function (vector2, shapes, logger) {
    var topLeftOfRect = function (rect) {
        return {"x": rect.position.x - rect.shape.getWidth()/2,
                "y": rect.position.y - rect.shape.getHeight()/2};
    };
    var topRightOfRect = function (rect) {
        return {"x": rect.position.x + rect.shape.getWidth()/2,
                "y": rect.position.y - rect.shape.getHeight()/2};
    };
    var bottomLeftOfRect = function (rect) {
        return {"x": rect.position.x - rect.shape.getWidth()/2,
                "y": rect.position.y + rect.shape.getHeight()/2};
    };
    var bottomRightOffRect = function (rect) {
        return {"x": rect.position.x + rect.shape.getWidth()/2,
                "y": rect.position.y + rect.shape.getHeight()/2};
    };
    var rectangleRectangleCollision = function(r1, r2){
        var myTopEdgeBelowOthersBottomEdge = (
                (r1.position.y - r1.shape.getHeight()/2) > (r2.position.y + r2.shape.getHeight()/2)
                );
        if (myTopEdgeBelowOthersBottomEdge) return false;
        var myBottomEdgeAboveOthersTopEdge = (
                (r1.position.y + r1.shape.getHeight()/2) < (r2.position.y - r2.shape.getHeight()/2)
                );
        if (myBottomEdgeAboveOthersTopEdge) return false;
        var myLeftEdgeRightOfOthersRightEdge = (
                (r1.position.x - r1.shape.getWidth()/2) > (r2.position.x + r2.shape.getWidth()/2)
                );
        if (myLeftEdgeRightOfOthersRightEdge) return false;
        var myRightEdgeLeftOfOthersLeftEdge = (
                (r1.position.x + r1.shape.getWidth()/2) < (r2.position.x - r2.shape.getWidth()/2)
                );
        if (myRightEdgeLeftOfOthersLeftEdge) return false;
        return new vector2.Vector2(0, 0); // TODO implement real collision point?
    };
    var circleCircleCollision = function (c1, c2) {
        var distanceBetweenCenters = c1.position.subtract(c2.position).magnitude();
        return distanceBetweenCenters <= distanceBetweenCenters;
    };
    var rectangleCircleCollision = function (rect, circ) {
        // First do the faster check to eliminate most cases
        var fakeRect = {
             shape: new shapes.Rectangle(circ.shape.radius * 2, circ.shape.radius * 2), 
             position: circ.position 
        };

        if (!rectangleRectangleCollision(rect, fakeRect)){
            return false;
        }

        // Do another faster, more restrictive check that eliminates further
        // cases
        var fakeCirc = {
            shape: new shapes.Circle(Math.min(rect.shape.getWidth() / 2, rect.shape.getHeight() / 2)), 
            position: rect.position
        };
        if (circleCircleCollision(fakeCirc, circ)) {
            return true;
        }

        // Create the line between the center of the circle and the center of the rectangle
        // The line will intersect with some edge of the rectangle at some point
        // calculate the distance between the intersection point and the center of the circle
        // should be > radius for NO intersection

        var rectCenter = rect.position;
        var circCenter = circ.position;

        var rectTop = rectCenter.y - rect.shape.getHeight() / 2;
        var rectBottom = rectCenter.y + rect.shape.getHeight() / 2;
        var rectLeft = rectCenter.x - rect.shape.getWidth() / 2;
        var rectRight = rectCenter.x + rect.shape.getWidth() / 2;

        var m = (circCenter.y - rectCenter.y) / (circCenter.x - rectCenter.x);
        if (isNaN(m)) {
            logger.warn ("m is not a number! rectangle:", rect, "circle:", circ);
        }
        var b = rectCenter.y - m * rectCenter.x;
        // Line 1 is thus y = mx + b
        // Check for intersection with each edge
        var distance = 0;

        // Left edge
        var x = rectLeft;
        var y = m * x + b;
        if (y <= rectBottom && y >= rectTop){
            var leftEdgeX = new vector2.Vector2(x, y);
            distance = leftEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return leftEdgeX;
            }
        }

        // Right edge
        x = rectRight;
        y = m * x + b;
        if (y <= rectBottom && y >= rectTop){
            var rightEdgeX = new vector2.Vector2(x, y);
            distance = rightEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return rightEdgeX;
            }
        }

        // Bottom edge
        y = rectBottom;
        x = (y - b) / m;
        if (x <= rectRight && x >= rectLeft){
            var bottomEdgeX = new vector2.Vector2(x, y);
            distance = bottomEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return bottomEdgeX;
            }
        }

        // Top edge
        y = rectTop;
        x = (y - b) / m;
        if (x <= rectRight && x >= rectLeft){
            var topEdgeX = new vector2.Vector2(x, y);
            distance = topEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return topEdgeX;
            }
        }
    };

    var rectangleLineSegmentCollision = function (rectangle, line) {
        var polygon = new shapes.Polygon([
                new shapes.LineSegment(
                    topLeftOfRect(rectangle), topRightOfRect(rectangle)),
                new shapes.LineSegment(
                    topRightOfRect(rectangle), bottomRightOffRect(rectangle)),
                new shapes.LineSegment(
                    bottomRightOffRect(rectangle), bottomLeftOfRect(rectangle)),
                new shapes.LineSegment(
                    bottomLeftOfRect(rectangle), topLeftOfRect(rectangle))
        ]);
        return polygon.getIntersectionPoint(line);
    };

    var circleLineSegmentCollision = function (circle, line) {
        var shortestLineFromCircleCenterToLine = line.findPerpendicularEndingAtPoint(circle.position);
        return shortestLineFromCircleCenterToLine.length() < circle.shape.radius;
    };

    return {
        rectangleRectangleCollision: rectangleRectangleCollision,
        rectangleCircleCollision: rectangleCircleCollision,
        circleCircleCollision: circleCircleCollision,
        rectangleLineSegmentCollision: rectangleLineSegmentCollision,
        circleLineSegmentCollision: circleLineSegmentCollision
    };
});
