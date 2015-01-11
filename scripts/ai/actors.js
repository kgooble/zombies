define(['./goals'], function (goals) {
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
    ZombieActor.prototype.calculateAction = function (timeDelta) {
        return {"type": goals.MOVE_TOWARDS_PLAYER, "speed": this.speed};
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
