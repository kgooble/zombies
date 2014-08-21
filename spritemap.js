define(['jquery'], function ($) {
    var SpriteMap = function(name){
        this.name = name;
    };
    SpriteMap.prototype.getPose = function(poseName, direction, jsonLoader, 
        imageLoader) {
        var map = jsonLoader.getSpriteMap(this.name);
        var sprites = map["sprites"];
        var image = imageLoader.getImage(this.name);
        // This is based on the direction the dude is facing.
        if (sprites[direction] && sprites[direction][poseName]) {
            return this.createPose(sprites[direction][poseName]["top_left"], map, image);
        }
        return this.createPose(sprites["forward"]["still"]["top_left"], map, image);
    };
    SpriteMap.prototype.createPose = function(spritexy, map, image) {
        return {
            draw: function (ctx, topLeftCorner) {
                ctx.drawImage(image, spritexy.x, spritexy.y,
                    map.width, map.height, topLeftCorner.x, topLeftCorner.y,
                    map.width, map.height);
            }
        };
    };

    return {
        SpriteMap: SpriteMap
    };
});
