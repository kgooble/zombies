"use strict";
define(['../graphics/animationstate'],
function(animationstate) {
    var run = function() {
        // TODO Figure out why Shoot state is Quickly resetting to IDLE
        test("poses cycle correctly based on time updates to animation state", 
        function () {
            var animation = {
                "poses": [
                    ["a", 0.5],
                    ["b", 0.2],
                    ["c", 0.3]
                ],
                "total_time": 1.0
            };
            var state = new animationstate.AnimationState("test", animation);

            equal(state.getPoseName(), "a");
            state.update(0.4);
            equal(state.getPoseName(), "a");
            state.update(0.1);
            equal(state.getPoseName(), "b");
            state.update(0.1);
            equal(state.getPoseName(), "b");
            state.update(0.3);
            equal(state.getPoseName(), "c");
            state.update(0.3);
            equal(state.getPoseName(), "a");

        });
        test("correctly traverse poses in combined state", 
        function () {
            var initialState = new animationstate.AnimationState("state", {
                "total_time": 1.5,
                "poses": [
                    ["still", 0.5],
                    ["left", 0.3],
                    ["still", 0.5],
                    ["right", 0.2]
                ]
            });
            initialState.update(0.2);
            equal(initialState.getPoseName(), "still");

            var nextState = new animationstate.CombinedAnimationState("walk", 
                initialState, "shoot", {
                "total_time": 2.0,
                "poses": [
                    [null, 0.2],
                    ["hand_raise", 0.3],
                    ["gun_up", 0.4],
                    ["shot", 0.5],
                    ["gun_up", 0.4],
                    [null, 0.2]
                ]
            });

            equal(nextState.getPoseName(), "still");
            nextState.update(0.4);
            equal(nextState.getPoseName(), "hand_raise_left");
            nextState.update(0.15);
            equal(nextState.getPoseName(), "gun_up_left");
            nextState.update(0.1);
            equal(nextState.getPoseName(), "gun_up_still");

            equal(nextState.getTimeElapsed(), 0.65);

            nextState.update(0.3);
            equal(nextState.getPoseName(), "shot_still");
        });
    };
    return {run: run};
}
);
