define(['./physics/vector2', './physics/shapes', './util/graph'], 
function(vector2, shapes, pgraph) {
    var SpawnZone = function(position, shape) {
        this.position = position;
        this.shape = shape;
    };

    var World = function(width, height) {
        this.width = width;
        this.height = height;
        this.center = new vector2.Vector2(width/2, height/2);
        this.graph = new pgraph.Graph(width, height, 40);
        this.spawnZones = [
            new SpawnZone(new vector2.Vector2(width/8, height/2),
                          new shapes.Rectangle(width/4, height))
        ];
    };
    World.prototype.contains = function(x, y){
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    };
    World.prototype.getRandomSpawnPoint = function () {
        var spawnZone = this.spawnZones[Math.floor(Math.random() * this.spawnZones.length)];

        var x = ((Math.floor(Math.random() * spawnZone.shape.getWidth())) + 
                    spawnZone.position.x - spawnZone.shape.getWidth() / 2);
        var y = ((Math.floor(Math.random() * spawnZone.shape.getHeight())) +
                    spawnZone.position.y - spawnZone.shape.getHeight() / 2);
        return new vector2.Vector2(x, y);
    };
    World.prototype.getPathBetween = function (p1, p2) {
        var n1 = this.graph.findNearestNode(p1);
        var n2 = this.graph.findNearestNode(p2);
        return this.graph.calculatePath(n1, n2);
    };

    World.prototype.addWall = function (tlx, tly, width, height) {
        var wallPolygon = new shapes.Polygon([
                new shapes.LineSegment({"x": tlx, "y": tly}, 
                                       {"x": tlx+width, "y": tly}),
                new shapes.LineSegment({"x": tlx+width, "y": tly},
                                       {"x": tlx+width, "y": tly+height}),
                new shapes.LineSegment({"x": tlx+width, "y": tly+height},
                                       {"x": tlx, "y": tly+height}),
                new shapes.LineSegment({"x": tlx, "y": tly+height},
                                       {"x": tlx, "y": tly}),
        ]);
        var wallNodes = this.graph.findEdgeNodesOfPolygon(wallPolygon);
        for (var i = 0; i < wallNodes.length; i++) {
            wallNodes[i].setWall();
        }
    };

    return {
        World: World
    };
});
