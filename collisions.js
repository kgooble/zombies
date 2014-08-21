define(['vector2', 'physical_shapes'], function (vector2, shapes) {
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
    var rectangleCircleCollision = function(rect, circ) {
        // First do the faster check to eliminate most cases
        if (!rectangleRectangleCollision({shape: rect.shape, position: rect.position}, 
                {shape:new shapes.Rectangle(circ.shape.radius*2, circ.shape.radius*2), 
                    position:circ.position})){
            return false;
        }
        // Create the line between the center of the circle and the center of the rectangle
        // The line will intersect with some edge of the rectangle at some point
        // calculate the distance between the intersection point and the center of the circle
        // should be > radius for NO intersection

        var rectCenter = rect.position;
        var circCenter = circ.position;
        var m = (circCenter.y - rectCenter.y) / (circCenter.x - rectCenter.x);
        var b = rectCenter.y - m * rectCenter.x;
        // Line 1 is thus y = mx + b
        // Check for intersection with each edge

        // Left edge
        var x = rectCenter.x - rect.shape.getWidth()/2;
        var y = m * x + b;
        if (y <= rectCenter.y + rect.shape.getHeight()/2 && y >= rectCenter.y - rect.shape.getHeight()/2){
            var leftEdgeX = new vector2.Vector2(x, y);
            var distance = leftEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return leftEdgeX;
            }
        }

        // Right edge
        x = rectCenter.x + rect.shape.getWidth()/2;
        y = m * x + b;
        if (y <= rectCenter.y + rect.shape.getHeight()/2 && y >= rectCenter.y - rect.shape.getHeight()/2){
            var rightEdgeX = new vector2.Vector2(x, y);
            distance = rightEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return rightEdgeX;
            }
        }

        // Bottom edge
        y = rectCenter.y + rect.shape.getHeight()/2;
        x = (y - b) / m;
        if (x <= rectCenter.x + rect.shape.getWidth()/2 && x >= rectCenter.x - rect.shape.getWidth()/2){
            var bottomEdgeX = new vector2.Vector2(x, y);
            distance = bottomEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return bottomEdgeX;
            }
        }

        // Top edge
        y = rectCenter.y - rect.shape.getHeight()/2;
        x = (y - b) / m;
        if (x <= rectCenter.x + rect.shape.getWidth()/2 && x >= rectCenter.x - rect.shape.getWidth()/2){
            var topEdgeX = new vector2.Vector2(x, y);
            distance = topEdgeX.subtract(circCenter).magnitude();
            if (distance < circ.shape.radius) {
                return topEdgeX;
            }
        }
    };
    return {
        rectangleRectangleCollision: rectangleRectangleCollision,
        rectangleCircleCollision: rectangleCircleCollision
                                     
    };
});
