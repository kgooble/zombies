"use strict";
define(['../graphics/spritemap'],
function(spritemap) {
    var run = function() {
        test("sprite is extracted correctly from json", 
        function () {
        	var jsonLoader = {
        		getSpriteMap: function () {
        			return {
        			    "width": 5,
        			    "height": 10,
        			    "sprites": {
        			    	"left": {
        			    		"still": {
        			    			"basic": {
        			    				"top_left": {
        			    					"x": 9,
        			    					"y": 11
        			    				}
        			    			}
        			    		}
        			    	}
        			    }
        			};
        		}
        	};
        	var imageLoader = {
        		getImage: function () {
        			return null;
        		}
        	};

        	var map = new spritemap.SpriteMap("test");

        	var poseDrawer = map.getPose("left", "still", "basic", 
        		jsonLoader, imageLoader);

        	var fakeContext = {
        		"drawImage": function (image, imageX, imageY,
        			imageWidth, imageHeight, drawX, drawY,
        			drawWidth, drawHeight) {
        			this.props = {
        				"image": image,
        				"imageX": imageX,
        				"imageY": imageY,
        				"imageWidth": imageWidth,
        				"imageHeight": imageHeight,
        				"drawX": drawX,
        				"drawY": drawY,
        				"drawWidth": drawWidth,
        				"drawHeight": drawHeight
        			};
        		}
        	};
        	poseDrawer.draw(fakeContext, 0, 0);
        	var result = fakeContext.props;

        	equal(result.imageX, 9, "image x coordinate sent ok");
        	equal(result.imageY, 11, "image y coordinate sent ok");
        	equal(result.imageWidth, 5, "image width sent ok");
        	equal(result.imageHeight, 10, "image height sent ok");
        	equal(result.drawWidth, 5, "draw width sent ok");
        	equal(result.drawHeight, 10, "draw height sent ok");
        });
    };
    return {run: run};
}
);
