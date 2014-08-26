define(['jsonloader', 'imageloader', 'animations', 'spritemap', 
        'directions', 'states'], 
function(jsonloader, imageloader, animations, spritemap, directions, states){
    var SpriteRenderer = function(animator, sprite) {
        this.animator = animator;
        this.sprite = sprite; 
    };
    SpriteRenderer.prototype.update = function(timeDelta) {
        this.animator.update(timeDelta);
    };
    SpriteRenderer.prototype.draw = function (ctx, props) {
        var shape = props.shape;
        var facing = props.forward;
        var topLeftCorner = props.topLeftCorner;
        var state = props.state;

        this.animator.setState(state);
        var poseName = this.animator.getPoseName();
        var poseOrientation = "forward";
        switch (facing) {
            case directions.UP:
                poseOrientation = "back";
                break;
            case directions.RIGHT:
                poseOrientation = "right";
                break;
            case directions.LEFT:
                poseOrientation = "left";
                break;
            default:
                poseOrientation = "forward";
        }
        var pose = this.sprite.getPose(poseName, poseOrientation, jsonloader, imageloader);
        pose.draw(ctx, topLeftCorner);
    };
    var CircleRenderer = function(strokeColour, fillColour){
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
    };

    CircleRenderer.prototype.update = function(timeDelta) {
    };
    CircleRenderer.prototype.draw = function(ctx, props) {
        var shape = props.shape;
        var topLeftCorner = props.topLeftCorner;

        ctx.beginPath();
        ctx.arc(topLeftCorner.x + shape.radius, topLeftCorner.y + shape.radius, 
            shape.radius, 0, 2 * Math.PI, false);
        if (this.strokeColour !== undefined) {
            ctx.strokeStyle = this.strokeColour;
        } else {
            ctx.strokeStyle = "white";
        }
        if (this.fillColour !== undefined) {
            ctx.fillStyle = this.fillColour;
            ctx.fill();
        }
        ctx.stroke();
    };

    var RectangleRenderer = function(strokeColour, fillColour){
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
    };
    RectangleRenderer.prototype.update = function(timeDelta) {
    };

    RectangleRenderer.prototype.draw = function(ctx, props) {
        var shape = props.shape;
        var topLeftCorner = props.topLeftCorner;

        ctx.fillStyle = this.fillColour;
        ctx.fillRect(topLeftCorner.x, topLeftCorner.y, shape.width, 
                shape.height);
    };

    var PointRenderer = function(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
    };
    PointRenderer.prototype.draw = function(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
    };

    var GraphicsEngine = function(){ 
        this.objects = {};
        this.nextKey = 0;
        this.debugObjects = [];
    };

    GraphicsEngine.prototype.isInvalidIndex = function (objectId) {
        return this.objects[objectId] === undefined;
    };
    GraphicsEngine.prototype.clearScreen = function(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.width, ctx.height);
        for (var i = 0; i < this.debugObjects.length; i++){
            this.debugObjects[i].draw(ctx);
        }
    };
    GraphicsEngine.prototype.addDebugObject = function (object) {
        this.debugObjects.push(object);
    };
    GraphicsEngine.prototype.update = function (timeDelta) {
        for (var key in this.objects) {
            this.objects[key].update(timeDelta);
        }
    };
    GraphicsEngine.prototype.drawObject = function(ctx, objectId, 
            physicalProperties){
        if (this.isInvalidIndex(objectId)){
            return;
        }
        this.objects[objectId].draw(ctx, physicalProperties);
    };
    GraphicsEngine.prototype.drawDebugPoint = function(ctx, x, y){
        this.addDebugObject(new PointRenderer(x, y, "white"));
    };
    GraphicsEngine.prototype.drawGameOver = function (ctx) {
        this.clearScreen(ctx);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", 100, 250);
    };
    GraphicsEngine.prototype.getNextKey = function () {
        var key = this.nextKey;
        this.nextKey++;
        return key;
    };
    GraphicsEngine.prototype.addObject = function (object) {
        var key = this.getNextKey();
        this.objects[key] = object;
        return key;
    };
    GraphicsEngine.prototype.registerCircle = function(strokeColour, 
            fillColour){
        return this.addObject(new CircleRenderer(strokeColour, fillColour));
    };
    GraphicsEngine.prototype.registerRectangle = function(strokeColour, 
            fillColour){
        return this.addObject(new RectangleRenderer(strokeColour, fillColour));
    };

    GraphicsEngine.prototype.getAnimations = function(spriteName) {
        return jsonloader.getAnimationsMap(spriteName);
    };
    GraphicsEngine.prototype.getSpriteMap = function(spriteName) {
        return jsonloader.getSpriteMap(spriteName);
    };
    GraphicsEngine.prototype.registerSprite = function(spriteName) {
        return this.addObject(new SpriteRenderer(
                    new animations.AnimationController(states.IDLE, 
                        this.getAnimations(spriteName)),
                    new spritemap.SpriteMap(spriteName)));
    };
    GraphicsEngine.prototype.destroy = function(objectId){
        delete this.objects[objectId];
    };

    var engine = new GraphicsEngine();
    return {
        preload: function (){
            imageloader.preloadImages(["zombie", "player"]);
            jsonloader.preloadJSON(["zombie", "player"]);
        },
        loaded: function(ctx) {
            return jsonloader.areAllLoaded() && imageloader.areAllLoaded();
        },
        update: function (timeDelta) {
            engine.update(timeDelta);
        },
        // Draw functions
        clearScreen: function (ctx){
            engine.clearScreen(ctx);
        },
        drawObject: function(ctx, objectId, physicalProperties){
            engine.drawObject(ctx, objectId, physicalProperties);
        },
        drawDebugPoint: function (ctx, x, y){
            engine.drawDebugPoint(ctx, x, y);
        },
        drawGameOver: function (ctx) {
            engine.drawGameOver(ctx);
        },

        // Registry functions
        registerCircle: function(strokeColour, fillColour){
            return engine.registerCircle(strokeColour, fillColour);
        },
        registerRectangle: function(strokeColour, fillColour){
            return engine.registerRectangle(strokeColour, fillColour);
        },
        registerSprite: function(spriteName) {
            return engine.registerSprite(spriteName);
        },
        destroy: function(objectId){
            engine.destroy(objectId);
        },
    };
});
