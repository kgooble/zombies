define(['physics', 'graphics', 'behaviours', 'directions', 'states'], 
function (physicslib, graphicslib, behaviours, directions, states) {
    var TIME_BETWEEN_ZOMBIES = 10;
    var BULLET_SPEED = 100;
    var PLAYER_COLOR = "red";
    var TARGET_COLOR = "blue";
    var ZOMBIE_COLOR = "gray";
    var BULLET_RADIUS = 2;

    var GameObject = function(name, graphicsId, physicsId, behaviour, bounded){
        this.name = name;
        this.physicsId = physicsId;
        this.graphicsId = graphicsId;
        this.behaviour = behaviour;
        this.state = states.IDLE;

        if (bounded === undefined) {
            bounded = true;
        };
        this.bounded = bounded;
    };
    GameObject.prototype.setState = function (state) {
        this.state = state;
    };
    GameObject.prototype.isDead = function(){
        return this.behaviour.isDead();
    };
    GameObject.prototype.update = function(timeDelta){
        // TODO
    };
    GameObject.prototype.isBounded = function() {
        return this.bounded;
    };
    GameObject.prototype.onCollision = function (other) {
        this.behaviour.onCollision(other.behaviour);
    };
    GameObject.prototype.inform = function (data) {
        return this.behaviour.calculateAction(data);
    };

    var Game = function(){
        this.graphics = graphicslib;
        this.physics = physicslib;
    };
    Game.prototype.initialize = function (world){
        this.graphics.preload();
        this.gameOver = false;
        this.playerId = 0;
        this.targetId = 1;
        this.nextKey = 2;
        this.world = world;
    };
    Game.prototype.populate = function () {
        this.objects = {
            0: new GameObject("player",
                       this.graphics.registerSprite("player"),
                       this.physics.registerRectangle(
                           this.world.center.x, this.world.center.y, 30, 36),
                       behaviours.playerBehaviour(),
                       false),
            1: new GameObject("target",
                       this.graphics.registerCircle(TARGET_COLOR),
                       this.physics.registerCircle(0, 0, 10),
                       behaviours.emptyBehaviour(),
                       false)
            };
        this.physics.removeCollisions(this.getPhysicsId(this.targetId));
        this.physics.addManualSpeed(this.getPhysicsId(this.playerId), 20, 20);
    },
    Game.prototype.loaded = function () {
        return this.graphics.loaded();
    };
    Game.prototype.getPhysicsId = function (objectId) {
        return this.objects[objectId].physicsId;
    };
    Game.prototype.getGraphicsId = function (objectId) {
        return this.objects[objectId].graphicsId;
    };
    Game.prototype.getPosition = function (objectId) {
        return this.physics.getPosition(this.getPhysicsId(objectId));
    };
    Game.prototype.getTopLeftCorner = function (objectId) {
        return this.physics.getTopLeftCorner(this.getPhysicsId(objectId));
    };
    Game.prototype.moveUp = function () {
        this.moveInDirection(directions.UP);
    };
    Game.prototype.moveDown = function () {
        this.moveInDirection(directions.DOWN);
    };
    Game.prototype.moveRight = function () {
        this.moveInDirection(directions.RIGHT);
    };
    Game.prototype.moveLeft = function () {
        this.moveInDirection(directions.LEFT);
    };
    Game.prototype.moveInDirection = function (direction) {
        this.physics.moveInDirection(this.getPhysicsId(this.playerId), 
                direction);
        this.objects[this.playerId].setState(states.WALKING);
    };
    Game.prototype.stopWalking = function () {
        this.objects[this.playerId].setState(states.IDLE);
        this.physics.removeConstantVelocity(this.getPhysicsId(this.playerId));
    };
    Game.prototype.moveTarget = function (x, y){
        this.physics.moveTo(this.targetId, x, y);
    };
    Game.prototype.shootBullet = function (x, y){
        var playerX = this.getPosition(this.playerId).x;
        var playerY = this.getPosition(this.playerId).y;
        var bullet = new GameObject(
                "bullet",
                this.graphics.registerCircle("yellow", "yellow"),
                this.physics.registerCircle(playerX, playerY, BULLET_RADIUS),
                behaviours.bulletBehaviour()
                );
        this.physics.addConstantVelocity(bullet.physicsId, 
                BULLET_SPEED, x - playerX, y - playerY);
        this.physics.faceDirection(this.getPhysicsId(this.playerId), x, y);
        this.addEntity(bullet);
    };
    Game.prototype.addEntity = function (entity){
        this.objects[this.getNextKey()] = entity;
    };
    Game.prototype.getNextKey = function () {
        var next = this.nextKey;
        this.nextKey++;
        return next;
    };
    Game.prototype.outOfBounds = function (x, y){
        return !this.world.contains(x, y);
    };
    Game.prototype.detectCollisions = function () {
        for (var i in this.objects){
            for (var j in this.objects) {
                var collision = this.physics.collision(
                        this.getPhysicsId(i), this.getPhysicsId(j));
                if (collision){
                    this.objects[i].onCollision(this.objects[j]);
                    this.objects[j].onCollision(this.objects[i]);
                }
            }
        }
    };
    Game.prototype.updateGameObjects = function (timeDelta) {
        for (var i in this.objects){
            this.objects[i].update(timeDelta);
            var action = this.objects[i].inform({
                "player_location": this.getPosition(this.playerId),
                "my_location": this.physics.getPosition(this.getPhysicsId(i))
            });
            if (action.type === "move") {
                this.physics.addConstantVelocity(this.getPhysicsId(i),
                    action.speed, action.xDirection,action.yDirection);
                this.objects[i].setState(states.WALKING);
            }
            var posn = this.getPosition(i);
            if (this.objects[i].isDead() || 
                    (this.objects[i].isBounded() 
                     && this.outOfBounds(posn.x, posn.y))){
                this.physics.destroy(this.getPhysicsId(i));
                this.graphics.destroy(this.getGraphicsId(i));
                delete this.objects[i];
                if (i == this.playerId){
                    this.gameOver = true;
                    break;
                }
            }
        }
    };
    Game.prototype.redrawGameObjects = function (ctx) {
        for (var j in this.objects){
            this.graphics.drawObject(ctx, 
                    this.getGraphicsId(j),
                    { shape:    this.physics.getShape(this.getPhysicsId(j)),
                      state:    this.objects[j].state,
                      forward:  this.physics.getForward(this.getPhysicsId(j)),
                      topLeftCorner: this.getTopLeftCorner(this.getPhysicsId(j))
                    });
        }
    };
    Game.prototype.possiblySpawnEnemies = function (timeDelta) {
        if (this.timeSinceLastZombie === undefined) {
            this.timeSinceLastZombie = 0;
        }
        this.timeSinceLastZombie += timeDelta;
        if (this.timeSinceLastZombie > TIME_BETWEEN_ZOMBIES) {
            this.timeSinceLastZombie = 0;
            var spawnPoint = this.world.getRandomSpawnPoint();
            var newZombie = new GameObject("zombie",
                    this.graphics.registerSprite("zombie"),
                    this.physics.registerRectangle(spawnPoint.x, spawnPoint.y, 29, 34), // TODO get zombie height/width from sprite?
                    behaviours.zombieBehaviour());
            this.addEntity(newZombie);
        }
    };
    Game.prototype.update = function (ctx, timeDelta) {
        if (this.gameOver){
            this.graphics.drawGameOver(ctx);
            return;
        }
        this.graphics.update(timeDelta);
        this.physics.update(timeDelta);
        this.detectCollisions();
        this.updateGameObjects(timeDelta);
        this.possiblySpawnEnemies(timeDelta);
        this.graphics.clearScreen(ctx);
        this.redrawGameObjects(ctx);
    };

    var game = new Game();
    return {
        // Game initialization
        initialize: function(world) {
            game.initialize(world);
        },
        loaded: function () {
            return game.loaded();
        },
        populate: function () {
            game.populate();
        },

        // Game actions
        update: function (ctx, timeDelta) {
            game.update(ctx, timeDelta);
        },
        moveTarget: function(x, y) {
            game.moveTarget(x, y);
        },

        // Player actions
        shootBullet: function(x, y) {
            game.shootBullet(x, y);
        },
        moveUp: function(){
            game.moveUp();
        },
        moveDown: function(){
            game.moveDown();
        },
        moveLeft: function(){
            game.moveLeft();
        },
        moveRight: function(){
            game.moveRight();
        },
        stopWalking: function () {
            game.stopWalking();
        },

        // Game state
        isGameOver: function(){
            return game.gameOver;
        }
    };
});