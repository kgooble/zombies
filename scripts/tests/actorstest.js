"use strict";
define(['../ai/actors'],
function(actors) {
    var run = function() {
        var zombie = new actors.ZombieActor();
        var bullet = new actors.BulletActor();
        var player = new actors.PlayerActor();

        test("bullet and zombie actors die on collision with each other", 
        function () {
            var zombieStats = { dead : false };
            var bulletStats = { dead : false };
            ok(!zombieStats.dead);
            ok(!bulletStats.dead);
            zombie.onCollision(bullet, zombieStats);
            bullet.onCollision(zombie, bulletStats);
            ok(zombieStats.dead);
            ok(bulletStats.dead);
        });

        test("player actor dies when touched by a zombie",
        function () {
            var stats = { dead : false };
            ok(!stats.dead);
            player.onCollision(zombie, stats);
            ok(stats.dead);
        });

        test("zombie's next action is to move towards player location",
        function () {
            var data = {
                world: { "getPathBetween" : function () { 
                           return {
                               "getDirection": function () {
                                   return {"x": 3, "y": 4};
                               }
                           };
                          } 
                       },
                player_location: {x: 5, y: 5},
                my_location:     {x: 2, y: 1}
            };
            var expectedAction = {
                type: "move", speed: 5,
                xDirection: 3, yDirection: 4
            };
            deepEqual(zombie.calculateAction(data), expectedAction);
        });

    };
    return {run: run};
}
);
