"use strict";
define(['../graphics/animations'],
function(animations) {
    var run = function() {
        test("do not reset state if the controller is already in that state", 
        function () {
            var anims = {
                "animations_list": ["idle"],
                "animations": {
                    "idle": {
                    }
                }
            };
            var controller = new animations.AnimationController("idle", anims);
            var idleSetCount = 0;
            var walkSetCount = 0;
            // mock out animationStates
            controller.animationStates  = {
                "idle": {
                    reset:  function () {
                        idleSetCount++;
                    },
                    canTransition: function () {
                        return false;
                    }
                },
                "walk": {
                    reset: function () {
                        walkSetCount++;
                    },
                    canTransition: function () {
                        return false;
                    }
                }
            };

            controller.setState("idle");
            equal(idleSetCount, 0);

            controller.setState("walk");
            equal(idleSetCount, 0);
            equal(walkSetCount, 1);

            controller.setState("walk");
            equal(walkSetCount, 1);
        });
        var anims = {
            "animations_list": ["walk", "shoot", "shoot_and_walk"],
            "default_state": "walk",
            "animations": {
                "walk": {
                    "type": "basic",
                    "loop": true,
                    "total_time": 1.8,
                    "poses": [
                        ["right_foot_forward", 0.3],
                        ["still", 0.6],
                        ["left_foot_forward", 0.3],
                        ["still", 0.6]
                    ],
                    "transitions": {
                        "shoot": "shoot_and_walk"
                    }
                },
                "shoot": {
                    "type": "basic",
                    "loop": false,
                    "total_time": 2.0,
                    "poses": [
                        [null, 0.2],
                        ["hand_raise", 0.3],
                        ["gun_up", 0.4],
                        ["shot", 0.5],
                        ["gun_up", 0.4],
                        [null, 0.2]
                    ],
                    "transitions": {
                        "walk": "shoot_and_walk"
                    }
                },
                "shoot_and_walk": {
                    "type": "combined",
                    "loop": false,
                    "states": ["shoot", "walk"]
                }
            }
        };

        test("transition animation smoothly",
        function () {
            var controller = new animations.AnimationController("walk", anims);
            controller.update(0.2);
            equal(controller.getPoseName(), "right_foot_forward");
            controller.setState("shoot");
            equal(controller.getPoseName(), "right_foot_forward");
            controller.update(0.2);
            equal(controller.getPoseName(), "hand_raise_still");

            controller.update(0.3);
            equal(controller.getPoseName(), "gun_up_still");
            controller.update(1.6);
            equal(controller.getPoseName(), "right_foot_forward");
            controller.update(0.5);
            equal(controller.getPoseName(), "still");

        });

        test("a combined state can transition back to a regular state", 
        function () {
            var controller = new animations.AnimationController("walk", anims);
            equal(controller.getPoseName(), "right_foot_forward", "state initialized correctly");
            controller.setState("shoot");
            controller.setState("walk");
            equal(controller.getPoseName(), "right_foot_forward", "combined state transitioned correctly");
        });
    };
    return {run: run};
}
);
