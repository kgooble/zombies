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

        test("find neighbours gets all surrounding nodes for top left corner node",
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

        test("find neighbours gets all surrounding nodes for bottom right corner node",
        function () {
            var g = new graph.Graph(100, 100, 10);
            console.log(g);
            var node = g.findNearestNode(100, 100);
            equal(node.x, 90);
            equal(node.y, 90);
            var neighbours = g.findNeighbours(node);
            console.log(neighbours);

            equal(neighbours.length, 3);
            equal(neighbours[0].x, 80);
            equal(neighbours[0].y, 80);

            equal(neighbours[1].x, 90);
            equal(neighbours[1].y, 80);

            equal(neighbours[2].x, 80);
            equal(neighbours[2].y, 90);

        });

        test("find neighbours gets all surrounding nodes for central node",
        function () {
            var g = new graph.Graph(100, 100, 10);
            var node = g.findNearestNode(10, 10)            
            equal(node.x, 10);
            equal(node.y, 10);
            var neighbours = g.findNeighbours(node);

            equal(neighbours.length, 8);
            equal(neighbours[0].x, 0);
            equal(neighbours[0].y, 0);

            equal(neighbours[1].x, 10);
            equal(neighbours[1].y, 0);

            equal(neighbours[2].x, 20);
            equal(neighbours[2].y, 0);

            equal(neighbours[3].x, 0);
            equal(neighbours[3].y, 10);

            equal(neighbours[4].x, 20);
            equal(neighbours[4].y, 10);

            equal(neighbours[5].x, 0);
            equal(neighbours[5].y, 20);

            equal(neighbours[6].x, 10);
            equal(neighbours[6].y, 20);

            equal(neighbours[7].x, 20);
            equal(neighbours[7].y, 20);
        });

    };
    return {run: run};
});