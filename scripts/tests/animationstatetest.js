"use strict";
define(['../animationstate'],
function(animationstate) {
    var run = function() {
        test("poses cycle correctly based on time updates to animaton state", 
        function () {
            var animation = {
                "poses": [
                    ["a", 0.5],
                    ["b", 0.2],
                    ["c", 0.3]
                ],
                "total_time": 1.0
            };
            var state = new animationstate.AnimationState(animation);

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
    };
    return {run: run}
}
);
