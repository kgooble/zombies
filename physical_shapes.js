define([], function () {
    var Circle = function (radius){
        this.radius = radius;
    };
    Circle.prototype.getWidth = function() {
        return this.radius*2;
    };
    Circle.prototype.getHeight = function() {
        return this.radius*2;
    };

    var Rectangle = function (width, height){
        this.width = width;
        this.height = height;
    };
    Rectangle.prototype.getWidth = function() {
        return this.width;
    };
    Rectangle.prototype.getHeight = function() {
        return this.height;
    };

    return {
        Circle: Circle,
        Rectangle: Rectangle
    };
});
