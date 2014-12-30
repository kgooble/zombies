"use strict";
define(['../util/minheap'],
function(minheap) {
    var run = function() {
        test("minheap insert works correctly", 
        function () {
            var m = new minheap.MinHeap();

            m.insert(1, 1);
            m.insert(3, 2);
            m.insert(10, 3);
            m.insert(6, 0);

            equal(m.pop(), 6);
        });

        test("minheap contains works correctly",
        function () {
            var m = new minheap.MinHeap();
            m.insert(3, 1);
            ok(m.contains(3));

        });

    };
    return {run: run};
}
);