define(['./jsonloader', './imageloader', './animations', './spritemap', 
        '../directions', '../states', 'util/logger', './renderers'], 
function(jsonloader, imageloader, animations, spritemap, directions, states, 
    logger, renderers){

    var GraphicsEngine = function(){ 
        this.objects = {};
        this.nextKey = 0;
        this.debugObjects = [];
    };

    GraphicsEngine.prototype.isInvalidIndex = function (objectId) {
        return this.objects[objectId] === undefined;
    };
    GraphicsEngine.prototype.clearScreen = function (ctx) {
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
    GraphicsEngine.prototype.drawObject = function (ctx, objectId, 
            physicalProperties) {
        if (this.isInvalidIndex(objectId)){
            return;
        }
        this.objects[objectId].draw(ctx, physicalProperties, jsonloader, imageloader);
    };
    GraphicsEngine.prototype.drawDebugPoint = function (ctx, x, y) {
        this.addDebugObject(new renderers.PointRenderer(x, y, "white"));
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
    GraphicsEngine.prototype.registerCircle = function (strokeColour, 
            fillColour) {
        return this.addObject(new renderers.CircleRenderer(strokeColour, fillColour));
    };
    GraphicsEngine.prototype.registerRectangle = function (strokeColour, 
            fillColour) {
        return this.addObject(new renderers.RectangleRenderer(strokeColour, fillColour));
    };

    GraphicsEngine.prototype.getAnimations = function (spriteName) {
        return jsonloader.getAnimationsMap(spriteName);
    };
    GraphicsEngine.prototype.getSpriteMap = function (spriteName) {
        return jsonloader.getSpriteMap(spriteName);
    };
    GraphicsEngine.prototype.registerSprite = function (spriteName, initialState) {
        return this.addObject(new renderers.SpriteRenderer(
                    new animations.AnimationController(initialState, 
                        this.getAnimations(spriteName)),
                    new spritemap.SpriteMap(spriteName), initialState));
    };
    GraphicsEngine.prototype.destroy = function (objectId) {
        delete this.objects[objectId];
    };
    GraphicsEngine.prototype.setState = function (objectId, state) {
        if (this.objects[objectId].setState) {
            this.objects[objectId].setState(state);
        }
    };

    var engine = new GraphicsEngine();
    return {
        preload: function () {
            imageloader.preloadImages(["zombie", "player"]);
            jsonloader.preloadJSON(["zombie", "player"]);
        },
        loaded: function (ctx) {
            return jsonloader.areAllLoaded() && imageloader.areAllLoaded();
        },
        update: function (timeDelta) {
            engine.update(timeDelta);
        },
        // Draw functions
        clearScreen: function (ctx) {
            engine.clearScreen(ctx);
        },
        drawObject: function (ctx, objectId, physicalProperties) {
            engine.drawObject(ctx, objectId, physicalProperties);
        },
        drawDebugPoint: function (ctx, x, y){
            engine.drawDebugPoint(ctx, x, y);
        },
        drawGameOver: function (ctx) {
            engine.drawGameOver(ctx);
        },

        // Registry functions
        registerCircle: function (strokeColour, fillColour) {
            return engine.registerCircle(strokeColour, fillColour);
        },
        registerRectangle: function (strokeColour, fillColour) {
            return engine.registerRectangle(strokeColour, fillColour);
        },
        registerSprite: function (spriteName, initialState) {
            return engine.registerSprite(spriteName, initialState);
        },
        destroy: function (objectId) {
            engine.destroy(objectId);
        },
        setState: function (objectId, state) {
            engine.setState(objectId, state);
        }
    };
});
