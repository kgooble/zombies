define(["util/logger"], function (logger) {
    var SpriteMap = function(name){
        this.name = name;
    };
    SpriteMap.prototype.getPose = function(direction, position, 
        jsonLoader, imageLoader) {
        var map = jsonLoader.getSpriteMap(this.name);
        var sprites = map.sprites;
        var image = imageLoader.getImage(this.name);
        if (sprites[direction] && sprites[direction][position]) {
            return this.createPose(sprites[direction][position].top_left, map, image);
        }
        return null;
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
