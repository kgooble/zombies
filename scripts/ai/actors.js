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
        return { 
            type: "move", speed: this.speed, 
            xDirection: (data.player_location.x - data.my_location.x),
            yDirection: (data.player_location.y - data.my_location.y)
        };
    };

    PlayerActor.prototype.onCollision = function (other, stats) {
        if (other instanceof ZombieActor){
            stats.dead = true;
        } else if (other instanceof WallActor) {
        }
    };
   
    BulletActor.prototype.onCollision = function (other, stats) {
        if (other instanceof ZombieActor){
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