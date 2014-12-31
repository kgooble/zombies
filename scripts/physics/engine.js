define(['./shapes', './collisions', './vector2', 'directions', './entitykinds'], 
function(shapes, collisions, vector2, directions, entitykinds){
    var translateDirectionToVector = function (direction) {
        switch (direction) {
            case directions.UP:
                return new vector2.Vector2(0, -1);
            case directions.DOWN:
                return new vector2.Vector2(0, 1);
            case directions.LEFT:
                return new vector2.Vector2(-1, 0);
            case directions.RIGHT:
                return new vector2.Vector2(1, 0);
            default:
                return new vector2.Vector2(0, 0);
        }
    };
    var Velocity = function(speed, direction) {
       this.speed = speed;
       this.direction = direction.normalized();
    };
    Velocity.prototype.x = function() {
        return this.speed * this.direction.x;
    };
    Velocity.prototype.y = function() {
        return this.speed * this.direction.y;
    };
    Velocity.prototype.reverse = function () {
        return new Velocity(this.speed, this.direction.negative());
    };

    var PhysicsObject = function(layer, shape, position){
        this.layer = layer;
        this.shape = shape;
        this.position = position;
        this.forward = directions.DOWN;
        this.collides = true;
    };
    PhysicsObject.prototype.projectFuture = function (timeDelta) {
        this.futurePosition = this.calculateNewPosition(timeDelta);
        this.futureForwardVector = this.calculateNewForwardVector();
    };
    PhysicsObject.prototype.clearFuturePositionAndForward = function (timeDelta) {
        this.futurePosition = this.position;
        this.futureForwardVector = this.forward;
    };
    PhysicsObject.prototype.calculateNewPosition = function (timeDelta) {
        if (this.constantVelocity) {
            return this.position.add({
                "x": this.constantVelocity.x() * timeDelta,
                "y": this.constantVelocity.y() * timeDelta
            });
        }
        return this.position;
    };
    PhysicsObject.prototype.calculateNewForwardVector = function (direction) {
        if (direction === undefined) {
            if (this.constantVelocity) {
                direction = {"x": this.constantVelocity.x(), "y": this.constantVelocity.y()};
            } else {
                return this.forward;
            }
        }
        var x = direction.x;
        var y = direction.y;
        if (x > 0 && Math.abs(x) > Math.abs(y)) {
            return directions.RIGHT;
        } else if (x < 0 && Math.abs(x) > Math.abs(y)) {
            return directions.LEFT;
        } else if (y > 0) {
            return directions.DOWN;
        } else {
            return directions.UP;
        }
    };
    PhysicsObject.prototype.commitChanges = function (timeDelta) {
        this.position = this.futurePosition;
        this.forward = this.futureForwardVector;
        this.clearFuturePositionAndForward();
    };
    PhysicsObject.prototype.updateForwardVector = function (direction) {
        var x = direction.x;
        var y = direction.y;
        if (x > 0 && Math.abs(x) > Math.abs(y)) {
            this.forward = directions.RIGHT;
        } else if (x < 0 && Math.abs(x) > Math.abs(y)) {
            this.forward = directions.LEFT;
        } else if (y > 0) {
            this.forward = directions.DOWN;
        } else {
            this.forward = directions.UP;
        }
    };
    PhysicsObject.prototype.getWidth = function() {
        return this.shape.getWidth();
    };
    PhysicsObject.prototype.getHeight = function() {
        return this.shape.getHeight();
    };
    PhysicsObject.prototype.intersects = function (other) {
        if (!this.collides || !other.collides) {
            return false;
        }
        if (this.shape instanceof shapes.Rectangle && other.shape instanceof shapes.Rectangle){
            return collisions.rectangleRectangleCollision({shape: this.shape, position: this.position}, 
                    {shape:other.shape, position:other.position});
        } else if (this.shape instanceof shapes.Rectangle && other.shape instanceof shapes.Circle) {
            return collisions.rectangleCircleCollision({shape: this.shape, position: this.position},
                    {shape:other.shape, position: other.position});
        }
        return false;
    };

    var PhysicsEngine = function(){ 
        this.objects = {};
        this.nextKey = 0;
    };

    PhysicsEngine.prototype.updatePositionsAndCalculateCollisions = function (timeDelta) {
        for (var i in this.objects) {
            this.objects[i].projectFuture(timeDelta);
        }
        var collisions = [];
        for (var i in this.objects) {
            for (var j in this.objects) {
                if (i === j) {
                    continue;
                }
                var collision = this.collision(i, j);
                if (collision) {
                    collisions.push({"collision": collision,
                                     "object1": i,
                                     "object2": j});
                    if (this.isDisallowedIntersection(i, j)) {
                        this.objects[i].clearFuturePositionAndForward();
                        this.objects[j].clearFuturePositionAndForward();
                    }
                }
            }
        }
        for (var i in this.objects) {
            this.objects[i].commitChanges(timeDelta);
        }
        return collisions;
    };
    PhysicsEngine.prototype.collision = function(objectId1, objectId2) {
        if (objectId1 === objectId2) return false;
        return this.objects[objectId1].intersects(this.objects[objectId2]);
    };
    PhysicsEngine.prototype.removeCollisions = function(objectId){
        this.objects[objectId].collides = false;
    };
    PhysicsEngine.prototype.isDisallowedIntersection = function (objectId1, objectId2) {
        var o1 = this.objects[objectId1];
        var o2 = this.objects[objectId2];
        if (o1.layer === entitykinds.INANIMATE_OBJECT && o2.layer !== entitykinds.NON_PHYSICAL) {
            return true;
        }
        return false;
    };

    PhysicsEngine.prototype.isInvalidIndex = function (objectId) {
        return this.objects[objectId] === undefined;
    };
    PhysicsEngine.prototype.getPosition = function(objectId){
        if (this.isInvalidIndex(objectId)){
            return new vector2.Vector2(-1, -1);
        }
        return this.objects[objectId].position;
    };
    PhysicsEngine.prototype.getForward = function(objectId){
        if (this.isInvalidIndex(objectId)){
            return directions.DOWN;
        }
        return this.objects[objectId].forward;
    };
    PhysicsEngine.prototype.getTopLeftCorner = function(objectId){
        if (this.isInvalidIndex(objectId)){
            return new vector2.Vector2(-1, -1);
        }
        var posn = this.objects[objectId].position;
        return new vector2.Vector2(posn.x - this.objects[objectId].getWidth()/2,
                           posn.y - this.objects[objectId].getHeight()/2);
    };
    PhysicsEngine.prototype.getShape = function(objectId) {
        if (this.isInvalidIndex(objectId)){
            return new vector2.Vector2(-1, -1);
        }
        return this.objects[objectId].shape;
    };
    PhysicsEngine.prototype.addManualSpeed = function(objectId, xSpeed, ySpeed) {
        this.objects[objectId].manualSpeed = new vector2.Vector2(xSpeed, ySpeed);
    };
    PhysicsEngine.prototype.addConstantVelocity = function(objectId, speed, 
            xDirection, yDirection) {
        this.objects[objectId].constantVelocity = new Velocity(speed,
                new vector2.Vector2(xDirection, yDirection));
    };
    PhysicsEngine.prototype.removeConstantVelocity = function(objectId) {
        this.objects[objectId].constantVelocity = null;
    };
    PhysicsEngine.prototype.moveInDirection = function(objectId, direction){
        var vec = translateDirectionToVector(direction);
        var obj = this.objects[objectId];
        this.addConstantVelocity(objectId, obj.manualSpeed.x, vec.x, vec.y);
    };
    PhysicsEngine.prototype.faceDirection = function (objectId, x, y) {
        var obj = this.objects[objectId];
        var direction = new vector2.Vector2(x-obj.position.x, y-obj.position.y);
        obj.updateForwardVector(direction);
    };
    PhysicsEngine.prototype.moveTo = function(objectId, x, y){
        this.objects[objectId].position = new vector2.Vector2(x, y);
    };

    PhysicsEngine.prototype.getNextKey = function () {
        var key = this.nextKey;
        this.nextKey++;
        return key;
    };
    PhysicsEngine.prototype.addObject = function (object) {
        var key = this.getNextKey();
        this.objects[key] = object;
        return key;
    };
    PhysicsEngine.prototype.registerCircle = function(layer, x, y, radius) {
        return this.addObject(new PhysicsObject(layer,
                    new shapes.Circle(radius), 
                    new vector2.Vector2(x, y)));
    };
    PhysicsEngine.prototype.registerRectangle = function(layer, x, y, width, height) {
        return this.addObject(new PhysicsObject(layer,
                    new shapes.Rectangle(width, height), 
                    new vector2.Vector2(x, y)));
    };
    PhysicsEngine.prototype.destroy = function(objectId){
        delete this.objects[objectId];
    };

    return {
        PhysicsEngine: PhysicsEngine
    };
});
