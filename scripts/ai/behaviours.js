define(['./actors'], function (actors) {
    var Stats = function() {
        this.dead = false;
    };
    var Behaviour = function (actor) {
        this.stats = new Stats();
        this.actor = actor;
        this.forces = [];
    };
    Behaviour.prototype.isDead = function (){
        return this.stats.dead;
    };
    Behaviour.prototype.update = function () {
        if (this.forces.length == 0) {
            return null;
        }
        var goals = {
            "type": "move",
            "forces": this.forces
        };
        this.forces = [];
        return goals;
    };
    Behaviour.prototype.onCollision = function(other){
        this.actor.onCollision(other.actor, this.stats);
    };
    Behaviour.prototype.onForce = function (force) {
        if (force) {
            this.forces.push(force);
        }
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
