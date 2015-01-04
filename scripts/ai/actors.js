define([], function () {
    var EmptyActor = function(){};
    var WallActor = function(){};
    var ZombieActor = function(){
        this.speed = 5;
    };
    var PlayerActor = function(){};
    var BulletActor = function(){};

    EmptyActor.prototype.onCollision = function(other){
    };
    WallActor.prototype.onCollision = function (other) {
    };
    ZombieActor.prototype.onCollision = function (other, stats) {
        if (other instanceof BulletActor){
            stats.dead = true;
        }
    };
    ZombieActor.prototype.calculateAction = function (data) {
        var path = data.world.getPathBetween(data.my_location, data.player_location);
        var dir = null;
        if (path) {
            dir = path.getDirection();
        } else {
            dir = {"x": data.player_location.x - data.my_location.x,
                   "y": data.player_location.y - data.my_location.y};
        }
        return { 
            type: "move", speed: this.speed, 
            xDirection: dir.x,
            yDirection: dir.y
        };
    };

    PlayerActor.prototype.onCollision = function (other, stats) {
        if (other instanceof ZombieActor){
            stats.dead = true;
        } else if (other instanceof WallActor) {
        }
    };
   
    BulletActor.prototype.onCollision = function (other, stats) {
        if (other instanceof ZombieActor || other instanceof WallActor){
            stats.dead = true;
        }
    };

    return {
        EmptyActor: EmptyActor,
        WallActor: WallActor,
        ZombieActor: ZombieActor,
        PlayerActor: PlayerActor,
        BulletActor: BulletActor
    };
});
