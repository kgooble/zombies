define([], function () {
    var Stats = function() {
        this.dead = false;
    };
    var Behaviour = function (actor) {
        this.stats = new Stats();
        this.actor = actor;
    };
    Behaviour.prototype.isDead = function(){
        return this.stats.dead;
    };
    Behaviour.prototype.onCollision = function(other){
        this.actor.onCollision(other.actor, this.stats);
    };
    Behaviour.prototype.calculateAction = function(data) {
        if (this.actor.calculateAction !== undefined){
            return this.actor.calculateAction(data);
        }
        return {};
    };

    var emptyBehaviour = function () { 
        return new Behaviour(new EmptyActor());
    };
    var bulletBehaviour = function () {
        return new Behaviour(new BulletActor());
    };
    var zombieBehaviour = function () {
        return new Behaviour(new ZombieActor());
    };
    var playerBehaviour = function () {
        return new Behaviour(new PlayerActor());
    };


    var EmptyActor = function(){
    };
    var ZombieActor = function(){
        this.speed = 5;
    };
    var PlayerActor = function(){
    };
    var BulletActor = function(){
    };

    EmptyActor.prototype.onCollision = function(other){
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
        }
    };
   
    BulletActor.prototype.onCollision = function (other, stats) {
        if (other instanceof ZombieActor){
            stats.dead = true;
        }
    };

    return {
        emptyBehaviour: emptyBehaviour,
        playerBehaviour: playerBehaviour,
        zombieBehaviour: zombieBehaviour,
        bulletBehaviour: bulletBehaviour
    };
});
