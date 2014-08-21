define({
    createPath: function(name, type, ext){
        // TODO get base URL from somewhere else.
        return ("../../static/games/zombies/assets/spritesheets/" + type + 
                "/" + name + "." + ext);
    }
});
