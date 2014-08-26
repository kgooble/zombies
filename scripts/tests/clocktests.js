"use strict";
define(['../clock'],
function(clock) {
    var run = function() {
        test('clock in range test', 
        function () {
            var c = new clock.LimitedClock(10);
            c.tick(2);
            ok(c.inRange(0, 5), 
                "clock with two ticks should be in range of 0 and 5");
            ok(!c.inRange(3, 5),
                "clock with two ticks shouldn't be in range of 3 and 5");
        });

        test('clock ticking test',
        function () {
            var c = new clock.LimitedClock(3);
            c.tick(1);
            equal(c.time, 1, "after 1 tick, clock's time should be 1");
            c.tick(1);
            c.tick(1);
            equal(c.time, 3, 
                  "after 3 ticks with max of 3, clock's time should be 3");
            c.tick(1);
            equal(c.time, 0, 
                  "after 4 ticks with max of 3, clock's time should be 0");
        });
    };
    return {run: run};
}
);
