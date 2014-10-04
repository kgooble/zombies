define(['util/logger', './animationstate'], function(logger, animationstate) {
    var AnimationController = function (startState, animations) {
        this.state = startState;
        this.animations = animations;
        this.animationStates = {};
        for (var i = 0; i < animations.animations_list.length; i++){
            var name = animations.animations_list[i];
            if (this.animations.animations[name].type == "combined") {
                continue;
            }
            this.animationStates[name] = new animationstate.AnimationState(name,
                    animations.animations[name]);
        }
    };
    AnimationController.prototype.update = function (timeDelta) {
        var result = this.animationStates[this.state].update(timeDelta);
        if (result) { 
            if (result.stateName && result.stateName != this.state) {
                logger.log("after updating, Setting state to", result.stateName);
                this.state = result.stateName;
                this.animationStates[this.state] = result.state;
            } else {
                logger.log("after updating, setting state to default!");
                this.state = this.animations.default_state;
            }
        }
        return this.state;
    };
    AnimationController.prototype.getPoseName = function () {
        return this.animationStates[this.state].getPoseName();
    };
    AnimationController.prototype.getDefaultPoseName = function () {
        return "still";
    };
    AnimationController.prototype.setState = function (newState) {
        logger.log("My STate is ", this.state);
        if (this.animationStates[this.state].canTransition(newState)) {
            logger.log("I'm transitioning! to: ", newState);
            var transitionState = this.animationStates[this.state].getTransitionState(newState);
            var oldStateName = this.state;
            var originalState = this.animationStates[this.state];
            logger.log("I'm setting my transitioned state to", transitionState);
            this.state = transitionState;
            this.animationStates[transitionState] = this.createState(
                originalState, oldStateName, transitionState);
        } else if (this.animationStates[newState]) {
            if (this.state !== newState) {
                this.state = newState;
                this.animationStates[this.state].reset();
                if (this.state == "shoot") {
                    logger.log("I SET THE STATE TO SHOOT AND RESET IT ");
                }
            }
        } else {
            logger.warn("no animations found for", newState);
            logger.log("the animationStates were", this.animationStates);
        }
    };

    AnimationController.prototype.createState = function (originalState, oldStateName, stateName) {
        var animationData = this.animations.animations[stateName];
        if (animationData.type == "combined") {
            var newStateName = animationData.states[0];
            if (newStateName == oldStateName) {
                newStateName = animationData.states[1];
            }
            return new animationstate.CombinedAnimationState(
                oldStateName,
                originalState,
                newStateName,
                this.animations.animations[newStateName]);
        }
        return new animationstate.AnimationState(stateName, this.animations.animations[stateName]);
    };

    return {
        AnimationController: AnimationController
    };
});
