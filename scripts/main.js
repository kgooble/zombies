require.config({
    paths: {
        jquery: 'libs/jquery-1.11.1',
        util: 'util/'
    }
});

requirejs([
        'jquery', 'input', 'game', 'world'

        ],
function ($, input, game, world) {
    var ONE_FRAME_TIME = 1000/60;
    var TIME_DELTA = 1 / ONE_FRAME_TIME;

    var canvasElement = $("#myCanvas").get(0);
	var ctx = canvasElement.getContext('2d');
    var CANVAS_WIDTH = canvasElement.width;
    var CANVAS_HEIGHT = canvasElement.height;
    ctx.width = CANVAS_WIDTH;
    ctx.height = CANVAS_HEIGHT;

    // TODO preload . show loading screen or something!

    game.initialize(new world.World(CANVAS_WIDTH, CANVAS_HEIGHT));

    var doneLoading = false;
    setInterval(function(){
        if (game.loaded() && !doneLoading) {
            doneLoading = true;
            game.populate();
            input.initialize(game);
        }
    }, 500);


    var detached = false;
    var fn = function(){
        game.update(ctx, TIME_DELTA);
        if (game.isGameOver() && !detached){
            input.detach(game);
            detached = true;
        }
    };
    setInterval(fn, ONE_FRAME_TIME);
});
