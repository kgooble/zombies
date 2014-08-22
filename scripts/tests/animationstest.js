"use strict";
define(['../animations'],
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
            // mock out animators
            controller.animators = {
                "idle": {
                    reset:  function () {
                        idleSetCount++;
                    }
                },
                "walk": {
                    reset: function () {
                        walkSetCount++;
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
    };
    return {run: run}
}
);
