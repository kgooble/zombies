define(['util/clock', 'util/logger'], function (clock, logger, $) {
    // TODO: replace animation with separate poses and total_time 
    // variables. or at least consider doing so.
    var AnimationState = function(name, animation) {
        this.name = name;
        this.animation = animation;
        logger.log("hi, I'm", name, "and my animations are", animation);
        this.clock = new clock.LimitedClock(this.animation.total_time);
    };

    AnimationState.prototype.update = function (timeDelta) {
        this.clock.tick(timeDelta);
        if (this.clock.hasReset()) {
            this.finished = true;
        }
        if (this.isFinished()) {
            return true;
        }
    };
    AnimationState.prototype.isFinished = function () {
        return this.finished && !this.animation.loop;
    };
    AnimationState.prototype.reset = function () {
        console.log("RESETTING Animation State", name);
        this.clock.reset();
        this.finished = false;
    };
    AnimationState.prototype.getTimeElapsed = function () {
        return this.clock.getTime();
    };
    AnimationState.prototype.canTransition = function (nextState) {
        return (this.animation.transitions !== undefined && 
                this.animation.transitions[nextState] !== undefined);
    };
    AnimationState.prototype.getTransitionState = function (nextState) {
        return this.animation.transitions[nextState];
    };

    AnimationState.prototype.getPoseName = function () {
        var poses = this.animation.poses;
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

    var CombinedAnimationState = function (initialStateName, initialState, newStateName, newAnimation) {
        this.oldState = new AnimationState(initialStateName, initialState.animation);
        // Effectively copy the state
        this.oldState.update(initialState.getTimeElapsed());
        this.newState = new AnimationState(newStateName, newAnimation);
    };
    CombinedAnimationState.prototype.update = function (timeDelta) {
        this.oldState.update(timeDelta);
        this.newState.update(timeDelta);
        if (this.newState.isFinished()) {
            return {
                stateName: this.oldState.name,
                state: this.oldState
            };
        }
    };
    CombinedAnimationState.prototype.getPoseName = function () {
        if (this.newState.getPoseName() === null) {
            return this.oldState.getPoseName();
        }
        return this.newState.getPoseName() + "_" + this.oldState.getPoseName();
    };
    CombinedAnimationState.prototype.getTimeElapsed = function () {
        return this.newState.getTimeElapsed();
    };
    CombinedAnimationState.prototype.reset = function () {
        // This function doesn't make a lot of sense for this state.
        // The state in its entirety should be thrown out.
        this.newState.reset();
        this.oldState.reset();
    };


    return {
        AnimationState: AnimationState,
        CombinedAnimationState: CombinedAnimationState
    };
});
