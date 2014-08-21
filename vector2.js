define([], function(){
    var Vector2 = function(x, y){
        this.x = x;
        this.y = y;
    };
    Vector2.prototype.subtract = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Vector2.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector2.prototype.normalized = function () {
        var normalizingFactor = this.magnitude();
        return new Vector2(this.x / normalizingFactor, this.y / normalizingFactor);
    };
    return {
        Vector2: Vector2
    };
});
