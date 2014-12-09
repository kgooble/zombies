define(['./shapes', './collisions', './vector2', 'directions', './forces'], 
function(shapes, collisions, vector2, directions, forces){
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

    var PhysicsObject = function(shape, position){
        this.shape = shape;
        this.position = position;
        this.forward = directions.DOWN;
        this.collides = true;
    };
    PhysicsObject.prototype.update = function(timeDelta){
        if (this.constantVelocity){
            this.position.x += this.constantVelocity.x() * timeDelta;
            this.position.y += this.constantVelocity.y() * timeDelta;
            this.updateForwardVector({x: this.constantVelocity.x(), y: this.constantVelocity.y()});
        }
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

    PhysicsEngine.prototype.update = function(timeDelta){
        for (var i in this.objects) {
            this.objects[i].update(timeDelta);
        }
    };
    PhysicsEngine.prototype.collision = function(objectId1, objectId2) {
        if (objectId1 === objectId2) return false;
        return this.objects[objectId1].intersects(this.objects[objectId2]);
    };
    PhysicsEngine.prototype.removeCollisions = function(objectId){
        this.objects[objectId].collides = false;
    };

    PhysicsEngine.prototype.calculateForces = function (object1, object2) {
        return forces.calculateForces({
            "kind": object1.kind,
            "position": this.getPosition(object1.id)
        }, {
            "kind": object2.kind,
            "position": this.getPosition(object2.id)
        });
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
    PhysicsEngine.prototype.addConstantVelocity = function (objectId, forces) {
        // TODO assuming only one force
        if (!forces || forces.length == 0) {
            return;
        }
        var force = forces[0];
        var velocity = new Velocity(force.magnitude,
            force.on(this.getPosition(objectId)));
        this.objects[objectId].constantVelocity = velocity;
    };
    PhysicsEngine.prototype.removeConstantVelocity = function(objectId) {
        this.objects[objectId].constantVelocity = null;
    };
    PhysicsEngine.prototype.moveInDirection = function(objectId, direction){
        var vec = translateDirectionToVector(direction);
        var obj = this.objects[objectId];
        this.addConstantVelocity(objectId, [forces.constantForce(vec, obj.manualSpeed.x)]);
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
    PhysicsEngine.prototype.registerCircle = function(x, y, radius) {
        return this.addObject(new PhysicsObject(
                    new shapes.Circle(radius), 
                    new vector2.Vector2(x, y)));
    };
    PhysicsEngine.prototype.registerRectangle = function(x, y, width, height) {
        return this.addObject(new PhysicsObject(
                    new shapes.Rectangle(width, height), 
                    new vector2.Vector2(x, y)));
    };
    PhysicsEngine.prototype.destroy = function(objectId){
        delete this.objects[objectId];
    };

    var engine = new PhysicsEngine();

    return {
        update: function(timeDelta) {
            engine.update(timeDelta);
        },

        // Collisions
        collision: function(objectId1, objectId2) {
            return engine.collision(objectId1, objectId2);
        },
        removeCollisions: function(objectId){
            engine.removeCollisions(objectId);
        },

        // Forces
        calculateForces: function (object1, object2) {
            return engine.calculateForces(object1, object2);
        },

        // Getters
        getPosition: function(objectId) {
            return engine.getPosition(objectId);
        },
        getTopLeftCorner: function(objectId) {
            return engine.getTopLeftCorner(objectId);
        },
        getForward: function (objectId) {
            return engine.getForward(objectId);
        },
        getShape: function(objectId) {
            return engine.getShape(objectId);
        },

        // Set physics properties
        addManualSpeed: function(objectId, xSpeed, ySpeed) {
            engine.addManualSpeed(objectId, xSpeed, ySpeed);
        },
        addConstantVelocity: function(objectId, forces) {
            engine.addConstantVelocity(objectId, forces);
        },
        removeConstantVelocity: function(objectId) {
            engine.removeConstantVelocity(objectId);
        },
        moveInDirection: function(objectId, direction){
            engine.moveInDirection(objectId, direction);
        },
        faceDirection: function (objectId, x, y) {
            engine.faceDirection(objectId, x, y);
        },
        moveTo: function(objectId, x, y){
            engine.moveTo(objectId, x, y);
        },

        // Registry API
        registerCircle: function(x, y, radius) {
            return engine.registerCircle(x, y, radius);
        },
        registerRectangle: function(x, y, width, height) {
            return engine.registerRectangle(x, y, width, height);
        },
        destroy: function (objectId) {
            engine.destroy(objectId);
        },
    };
});
