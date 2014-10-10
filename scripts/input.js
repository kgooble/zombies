define(['jquery', 'keyevent', 'util/logger'], function ($, keyevent, logger){
    var mousemovefn;
    var mouseclickfn;
    var keydownfn;

    var lastPressedMovementKey = null;

    var makeMouseMoveFunction = function(game){
        return function(event){
            game.moveTarget(event.pageX, event.pageY);
        };
    };
    var makeClickFunction = function(game){
        return function(event){
            game.shootBulletAction(event.pageX, event.pageY);
        };
    };
    var makeKeyUpFunction = function (game) {
        return function (event) {
            if (event.which === lastPressedMovementKey) {
                lastPressedMovementKey = null;
                game.stopWalkingAction();
            }
        };
    };
    var makeKeyDownFunction = function (game) {
        return function (event) {
            lastPressedMovementKey = event.which;
            switch(event.which){
                case keyevent.DOM_VK_UP:
                    game.moveUpAction();
                    break;
                case keyevent.DOM_VK_DOWN:
                    game.moveDownAction();
                    break;
                case keyevent.DOM_VK_LEFT:
                    game.moveLeftAction();
                    break;
                case keyevent.DOM_VK_RIGHT:
                    game.moveRightAction();
            }
        };
    };
    var detachKeyBindings = function(game){
        $(document).off("keydown", keydownfn);
        $(document).off("keyup", keydownfn);
    };
    var detachMouseBindings = function (game) {
        $(document).off("click", mouseclickfn);
        $(document).off("mousemove", mousemovefn);
    };
    var initializeMouseBindings = function(game){
        mousemovefn = makeMouseMoveFunction(game);
        mouseclickfn = makeClickFunction(game);
        $(document).mousemove(mousemovefn);
        $(document).click(mouseclickfn);
    };
    var initializeKeyBindings = function(game){
        keydownfn = makeKeyDownFunction(game);
        keyupfn = makeKeyUpFunction(game);
        $(document).keydown(keydownfn);
        $(document).keyup(keyupfn);
    };

    return {
        initialize: function(game){
            initializeKeyBindings(game);
            initializeMouseBindings(game);
        },
        detach: function(game){
            detachKeyBindings(game);
            detachMouseBindings(game); 
        }
    };
});
