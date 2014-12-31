define(['physics/engine', 'physics/entitykinds', 'graphics/engine', 'ai/behaviours', 
        'directions', 'states', 'objectkinds'], 
function (physicslib, physicsentitykinds, graphicslib, behaviours, directions,
          states, objectkinds) {
    var GameActions = {
        MOVE_UP: 0,
        MOVE_DOWN: 1,
        MOVE_LEFT: 2,
        MOVE_RIGHT: 3,
        SHOOT_BULLET: 4,
        STOP_MOVING: 5
    };
    var TIME_BETWEEN_ZOMBIES = 10;
    var BULLET_SPEED = 100;
    var PLAYER_COLOR = "red";
    var TARGET_COLOR = "blue";
    var WALL_COLOR = "green";
    var ZOMBIE_COLOR = "gray";
    var BULLET_RADIUS = 2;

    var GameObject = function (kind, graphicsId, physicsId, behaviour, bounded) {
        this.kind = kind;
        this.physicsId = physicsId;
        this.graphicsId = graphicsId;
        this.behaviour = behaviour;
        this.state = states.IDLE;

        if (bounded === undefined) {
            bounded = true;
        }
        this.bounded = bounded;
    };
    GameObject.prototype.isDead = function () {
        return this.behaviour.isDead();
    };
    GameObject.prototype.update = function (timeDelta, data) {
        return this.behaviour.update(timeDelta, data);
    };
    GameObject.prototype.isBounded = function () {
        return this.bounded;
    };
    GameObject.prototype.onCollision = function (other) {
        this.behaviour.onCollision(other.behaviour);
    };
    GameObject.prototype.onForce = function (force) {
        this.behaviour.onForce(force);
    };

    var Game = function(){
        this.graphics = new graphicslib.GraphicsEngine();
        this.physics = new physicslib.PhysicsEngine();
        this.queue = [];
    };
    Game.prototype.initialize = function (world) {
        this.graphics.preload();
        this.gameOver = false;
        this.playerId = 0;
        this.targetId = 1;
        this.nextKey = 3;
        this.world = world;
        this.physicsIdReverseLookup = {};
    };
    Game.prototype.populate = function () {
        this.objects = {
            0: new GameObject(objectkinds.PLAYER,
                       this.graphics.registerSprite("player", states.IDLE),
                       this.physics.registerRectangle(physicsentitykinds.CHARACTER,
                           this.world.center.x, this.world.center.y, 30, 36),
                       behaviours.playerBehaviour(),
                       false),
            1: new GameObject(objectkinds.MISC,
                       this.graphics.registerCircle(TARGET_COLOR),
                       this.physics.registerCircle(physicsentitykinds.NON_PHYSICAL, 0, 0, 10),
                       behaviours.emptyBehaviour(),
                       false),
            2: new GameObject(objectkinds.WALL,
                       this.graphics.registerRectangle(WALL_COLOR, WALL_COLOR),
                       this.physics.registerRectangle(physicsentitykinds.INANIMATE_OBJECT, 
                                                      this.world.center.x-25, 
                                                      this.world.center.y-10, 10, 40),
                       behaviours.wallBehaviour(),
                       false)
            };
        this.physics.removeCollisions(this.getPhysicsId(this.targetId));
        this.physics.addManualSpeed(this.getPhysicsId(this.playerId), 20, 20);

        this.physicsIdReverseLookup[this.getPhysicsId(0)] = 0;
        this.physicsIdReverseLookup[this.getPhysicsId(1)] = 1;
        this.physicsIdReverseLookup[this.getPhysicsId(2)] = 2;
    };
    Game.prototype.loaded = function () {
        return this.graphics.loaded();
    };
    Game.prototype.getPhysicsId = function (objectId) {
        return this.objects[objectId].physicsId;
    };
    Game.prototype.getObjectIdFromPhysicsId = function (physicsId) {
        return this.physicsIdReverseLookup[physicsId];
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
    Game.prototype.queueAction = function (action, extraParams) {
        this.queue.push({"type": action, "params": extraParams});
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
        this.setGameObjectState(this.playerId, states.WALKING);
    };
    Game.prototype.stopWalking = function () {
        this.setGameObjectState(this.playerId, states.IDLE);
        this.physics.removeConstantVelocity(this.getPhysicsId(this.playerId));
    };
    Game.prototype.moveTarget = function (x, y) {
        this.physics.moveTo(this.targetId, x, y);
    };
    Game.prototype.shootBullet = function (x, y) {
        this.setGameObjectState(this.playerId, states.SHOOTING);
        var playerX = this.getPosition(this.playerId).x;
        var playerY = this.getPosition(this.playerId).y;
        var bullet = new GameObject(
                objectkinds.BULLET,
                this.graphics.registerCircle("yellow", "yellow"),
                this.physics.registerCircle(physicsentitykinds.WEAPON, playerX, playerY, BULLET_RADIUS),
                behaviours.bulletBehaviour()
                );
        this.physics.addConstantVelocity(bullet.physicsId, 
                BULLET_SPEED, x - playerX, y - playerY);
        this.physics.faceDirection(this.getPhysicsId(this.playerId), x, y);
        this.addEntity(bullet);
    };
    Game.prototype.addEntity = function (entity) {
        var objectId = this.getNextKey();
        this.objects[objectId] = entity;
        this.physicsIdReverseLookup[entity.physicsId] = objectId;
    };
    Game.prototype.destroy = function (objectId) {
        delete this.physicsIdReverseLookup[this.getPhysicsId(objectId)];
        delete this.objects[objectId];
    };
    Game.prototype.getNextKey = function () {
        var next = this.nextKey;
        this.nextKey++;
        return next;
    };
    Game.prototype.outOfBounds = function (x, y) {
        return !this.world.contains(x, y);
    };
    Game.prototype.processCollisions = function (collisions) {
        for (var i = 0; i < collisions.length; i++) {
            var obj1 = this.getObjectIdFromPhysicsId(collisions[i].object1);
            var obj2 = this.getObjectIdFromPhysicsId(collisions[i].object2);
            this.objects[obj1].onCollision(this.objects[obj2]);
            this.objects[obj2].onCollision(this.objects[obj1]);
        }
    };
    Game.prototype.setGameObjectState = function (objectId, state) {
        this.graphics.setState(this.getGraphicsId(objectId), state);
    };
    Game.prototype.updateGameObjects = function (timeDelta) {
        for (var q = 0; q < this.queue.length; q++) {
            var queuedAction = this.queue[q];
            switch (queuedAction.type) {
                case GameActions.MOVE_LEFT:
                    this.moveLeft();
                    break;
                case GameActions.MOVE_RIGHT:
                    this.moveRight();
                    break;
                case GameActions.MOVE_DOWN:
                    this.moveDown();
                    break;
                case GameActions.MOVE_UP:
                    this.moveUp();
                    break;
                case GameActions.STOP_MOVING:
                    this.stopWalking();
                    break;
                case GameActions.SHOOT_BULLET:
                    this.shootBullet(queuedAction.params.x, queuedAction.params.y);
                    break;
            }
        }
        this.queue = [];
        for (var i in this.objects){
            var goals = this.objects[i].update(timeDelta, 
                {"player_location": this.physics.getPosition(this.getPhysicsId(this.playerId)),
                "my_location": this.physics.getPosition(this.getPhysicsId(i))
                }
                );
            if (goals && goals.type === "move") {
                this.physics.addConstantVelocity(this.getPhysicsId(i),
                    goals.speed, goals.xDirection, goals.yDirection);
                this.setGameObjectState(i, states.WALKING);
            }
            var posn = this.getPosition(i);
            if (this.objects[i].isDead() || 
                    (this.objects[i].isBounded() && 
                     this.outOfBounds(posn.x, posn.y))){
                this.physics.destroy(this.getPhysicsId(i));
                this.graphics.destroy(this.getGraphicsId(i));
                this.destroy(i);
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
            var newZombie = new GameObject(objectkinds.ZOMBIE,
                    this.graphics.registerSprite("zombie", states.IDLE),
                    this.physics.registerRectangle(
                        physicsentitykinds.CHARACTER, 
                        spawnPoint.x, spawnPoint.y, 29, 34), // TODO get zombie height/width from sprite?
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
        var collisions = this.physics.updatePositionsAndCalculateCollisions(timeDelta);
        this.processCollisions(collisions);
        this.updateGameObjects(timeDelta);
        this.possiblySpawnEnemies(timeDelta);
        this.graphics.clearScreen(ctx);
        this.redrawGameObjects(ctx);
    };

    Game.prototype.shootBulletAction = function(x, y) {
        this.queueAction(GameActions.SHOOT_BULLET, {"x": x, "y": y});
    };
    Game.prototype.moveUpAction = function(){
        this.queueAction(GameActions.MOVE_UP);
    };
    Game.prototype.moveDownAction = function(){
        this.queueAction(GameActions.MOVE_DOWN);
    };
    Game.prototype.moveLeftAction = function(){
        this.queueAction(GameActions.MOVE_LEFT);
    };
    Game.prototype.moveRightAction = function(){
        this.queueAction(GameActions.MOVE_RIGHT);
    };
    Game.prototype.stopWalkingAction = function () {
        this.queueAction(GameActions.STOP_MOVING);
    };
    Game.prototype.isGameOver = function(){
        return this.gameOver;
    };

    return {
        Game: Game
    };
});
