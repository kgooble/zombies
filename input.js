define(['jquery', 'keyevent', 'logger'], function ($, keyevent, logger){
    var mousemovefn = undefined;
    var mouseclickfn = undefined;
    var keydownfn = undefined;

    var lastPressedMovementKey = null;

    var makeMouseMoveFunction = function(game){
        return function(event){
            game.moveTarget(event.pageX, event.pageY);
        };
    };
    var makeClickFunction = function(game){
        return function(event){
            game.shootBullet(event.pageX, event.pageY);
        };
    };
    var makeKeyUpFunction = function (game) {
        return function (event) {
            if (event.which === lastPressedMovementKey) {
                lastPressedMovementKey = null;
                game.stopWalking();
            }
        };
    };
    var makeKeyDownFunction = function (game) {
        return function (event) {
            lastPressedMovementKey = event.which;
            switch(event.which){
                case keyevent.DOM_VK_UP:
                    game.moveUp();
                    break;
                case keyevent.DOM_VK_DOWN:
                    game.moveDown();
                    break;
                case keyevent.DOM_VK_LEFT:
                    game.moveLeft();
                    break;
                case keyevent.DOM_VK_RIGHT:
                    game.moveRight();
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
    }
});
