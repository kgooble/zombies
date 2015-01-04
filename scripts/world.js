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
        this.graph = new pgraph.Graph(width, height);
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


    return {
        World: World
    };
});
