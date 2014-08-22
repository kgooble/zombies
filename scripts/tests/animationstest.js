"use strict";
// TODO -- for some reason, this doesn't like the fact that animations.js 
// includes logger.js -- it can't find it
define(['../animations'],
function(animations) {
    var run = function() {
        test('animations test...', 
        function () {
            var anims = {};
            var controller = new animations.AnimationController("state1", anims);
        });
    };
    return {run: run}
}
);
