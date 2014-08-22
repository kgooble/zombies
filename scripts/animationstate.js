define(['clock', 'logger'], function (clock, logger) {
    var AnimationState = function(animation) {
        this.animation = animation;
        this.clock = new clock.LimitedClock(this.animation["total_time"]);
    };

    AnimationState.prototype.update = function (timeDelta) {
        this.clock.tick(timeDelta);
    };
    AnimationState.prototype.reset = function () {
        this.clock.reset();
    };

    AnimationState.prototype.getPoseName = function () {
        var poses = this.animation["poses"];
        var startTime = 0;
        for (var i = 0; i < poses.length; i++){
            var poseName = poses[i][0];
            var poseLength = poses[i][1];
            if (this.clock.inRange(startTime, startTime + poseLength)){
                return poseName;
            }
            startTime += poseLength;
        }
        logger.warn("No pose was in range.");
        return null;
    };

    return {
        AnimationState: AnimationState
    };
});
