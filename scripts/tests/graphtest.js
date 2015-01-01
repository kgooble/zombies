"use strict";
define(['../util/graph'],
function(graph) {
    var run = function() {
        test("find nearest node in a pixel graph works",
        function () {
            var g = new graph.Graph(100, 100, 10);

            var node = g.findNearestNode(0, 0);

            equal(node.x, 0);
            equal(node.y, 0);

            node = g.findNearestNode(8, 9);
            equal(node.x, 10);
            equal(node.y, 10);

            node = g.findNearestNode(4, 16);
            equal(node.x, 0);
            equal(node.y, 20);
        });

        test("find neighbours gets all surrounding nodes",
        function () {
            var g = new graph.Graph(100, 100, 10);

            var node = g.findNearestNode(0, 0);
            var neighbours = g.findNeighbours(node);

            equal(neighbours.length, 3);
            equal(neighbours[0].x, 10);
            equal(neighbours[0].y, 0);

            equal(neighbours[1].x, 0);
            equal(neighbours[1].y, 10);

            equal(neighbours[2].x, 10);
            equal(neighbours[2].y, 10);
        });

    };
    return {run: run};
});