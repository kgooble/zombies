define([], function () {
    var LimitedClock = function (max){
        this.time = 0;
        this.max = max;
        console.log("MAX time is", max);
    };
    LimitedClock.prototype.tick = function (delta) {
        this.time += delta;
        if (this.max < this.time) {
            this.doneOnce = true;
            this.time = 0;
        }
    };
    LimitedClock.prototype.reset = function () {
        this.time = 0;
        this.doneOnce = false;
    };
    LimitedClock.prototype.hasReset = function () {
        return this.doneOnce;
    }
    LimitedClock.prototype.inRange = function (start, end) {
        return start <= this.time && this.time < end;
    };
    LimitedClock.prototype.getTime = function () {
        return this.time;
    };

    return {
        LimitedClock: LimitedClock
    };
});
