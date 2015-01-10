define(['../physics/shapes'], function (shapes) {
    var ROT_INCREMENT = 30;

    var PathCalculator = function (initialLine) {
        this.initialLine = initialLine;
        this.rot = 0;
    };

    PathCalculator.prototype.getNextPath = function () {
        if (this.rot === 0) {
            this.rot += ROT_INCREMENT;
            return this.initialLine;
        } else if (0 < this.rot && this.rot < 90) {
            var newPath = this.initialLine.rotateCW(shapes.degreesToRadians(this.rot));
            this.rot += ROT_INCREMENT;
            return newPath;
        }
    };

    return {
        PathCalculator: PathCalculator
    };
});
