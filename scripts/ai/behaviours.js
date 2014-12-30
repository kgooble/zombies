define(['./actors'], function (actors) {
    var Stats = function() {
        this.dead = false;
    };
    var Behaviour = function (actor) {
        this.stats = new Stats();
        this.actor = actor;
    };
    Behaviour.prototype.isDead = function (){
        return this.stats.dead;
    };
    Behaviour.prototype.update = function (timeDelta, data) {
        if (this.actor.calculateAction !== undefined) {
            return this.actor.calculateAction(data);

        }
        return {};
    };
    Behaviour.prototype.onCollision = function(other){
        this.actor.onCollision(other.actor, this.stats);
    };
    var emptyBehaviour = function () { 
        return new Behaviour(new actors.EmptyActor());
    };
    var bulletBehaviour = function () {
        return new Behaviour(new actors.BulletActor());
    };
    var zombieBehaviour = function () {
        return new Behaviour(new actors.ZombieActor());
    };
    var playerBehaviour = function () {
        return new Behaviour(new actors.PlayerActor());
    };

    return {
        emptyBehaviour: emptyBehaviour,
        playerBehaviour: playerBehaviour,
        zombieBehaviour: zombieBehaviour,
        bulletBehaviour: bulletBehaviour
    };
});
