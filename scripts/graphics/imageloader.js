define(['./staticfiles'], function (staticfiles) {
    var ImageLoader = function () {
        this.imageMap = {};
    };

    ImageLoader.prototype.getImage = function (name) {
        if (this.imageMap[name] !== undefined) {
            return this.imageMap[name];
        } else {
            var path = this.createPath(name);
            this.imageMap[name] = null;
            var image = new Image();
            var imageMap = this.imageMap;
            image.onload = function (){
                imageMap[name] = image;
            };
            image.src = path;
            return null; // All images should be preloaded already!
        }
    };

    ImageLoader.prototype.createPath = function (name) {
        return staticfiles.createPath(name, "images", "png");
    };

    ImageLoader.prototype.areAllLoaded = function () {
        for (var imgName in this.imageMap) {
            if (this.imageMap[imgName] === null) {
                return false;
            }
        }
        return true;
    };

    ImageLoader.prototype.preloadAll = function (nameList) {
        for (var i = 0; i < nameList.length; i++){
            this.getImage(nameList[i]);
        }
    };

    var loader = new ImageLoader();

    return {
        getImage: function (name) {
            return loader.getImage(name);
        },
        preloadImages: function (imageNameList) {
            loader.preloadAll(imageNameList);
        },
        areAllLoaded: function () {
            return loader.areAllLoaded();
        }
    };
});
