define(['logger', 'animationstate'], function(logger, animationstate) {
    var AnimationController = function (startState, animations) {
        this.state = startState;
        this.animations = animations;
        this.animators = {};
        for (var i = 0; i < animations.animations_list.length; i++){
            var name = animations.animations_list[i];
            this.animators[name] = new animationstate.AnimationState(
                    animations.animations.name);
        }
    };
    AnimationController.prototype.update = function (timeDelta) {
        this.animators[this.state].update(timeDelta);
    };
    AnimationController.prototype.getPoseName = function () {
        return this.animators[this.state].getPoseName();
    };
    AnimationController.prototype.setState = function (state) {
        if (this.animators[state]) {
            if (this.state !== state) {
                this.state = state;
                this.animators[this.state].reset();
            }
        } else {
            logger.warn("no animations found for", state);
        }
    };

    return {
        AnimationController: AnimationController
    };
});
