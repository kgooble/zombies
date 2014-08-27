define(['jquery', './staticfiles'], function($, staticfiles){
    var MAPPINGS = "mappings";
    var ANIMATIONS = "animations";
    var JSONLoader = function() {
        this.json = {};
    };

    JSONLoader.prototype.preloadAll = function (jsonNameList) {
        for (var i = 0; i < jsonNameList.length; i++){
            this.loadAnimationsMap(jsonNameList[i]);
            this.loadSpriteMap(jsonNameList[i]);
        }
    };

    JSONLoader.prototype.loadAnimationsMap = function (name) {
        if (this.json[name] === undefined || this.json[name][ANIMATIONS] === undefined) {
            this.loadJSON(name, ANIMATIONS);
        }
    };
    JSONLoader.prototype.loadSpriteMap = function (name) {
        if (this.json[name] === undefined || this.json[name][MAPPINGS] === undefined) {
            this.loadJSON(name, MAPPINGS);
        }
    };

    JSONLoader.prototype.getAnimationsMap = function (name) {
        return this.json[name][ANIMATIONS];
    };
    JSONLoader.prototype.getSpriteMap = function (name) {
        return this.json[name][MAPPINGS];
    };

    JSONLoader.prototype.loadJSON = function (name, type) {
        var path = this.createPath(name, type);
        if (this.json[name] === undefined) {
            this.json[name] = {type: false};
        }
        var json = this.json;
        $.getJSON(path, function(resultjson) {
            json[name][type] = resultjson;
        });
    };

    JSONLoader.prototype.createPath = function(name, type) {
        return staticfiles.createPath(name, type, "json");
    };
    JSONLoader.prototype.areAllLoaded = function() {
        for (var spriteName in this.json) {
            if (this.json[spriteName][MAPPINGS] === false || this.json[spriteName][ANIMATIONS] === false){
                return false;
            }
        }
        return true;
    };

    var loader = new JSONLoader();

    return {
        preloadJSON: function(jsonNameList){
            loader.preloadAll(jsonNameList);
        },
        getSpriteMap: function(name) {
            return loader.getSpriteMap(name);
        },
        getAnimationsMap: function(name) {
            return loader.getAnimationsMap(name);
        },
        areAllLoaded: function(){
            return loader.areAllLoaded();
        }
    };

});
