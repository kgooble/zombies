define([], function () {
    var LimitedClock = function (max){
        this.time = 0;
        this.max = max;
    };
    LimitedClock.prototype.tick = function (delta) {
        this.time += delta;
        if (this.max < this.time) {
            this.reset();
        }
    };
    LimitedClock.prototype.reset = function () {
        this.time = 0;
    };
    LimitedClock.prototype.inRange = function (start, end) {
        return start <= this.time && this.time < end;
    };

    return {
        LimitedClock: LimitedClock
    };
});
