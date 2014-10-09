"use strict";
define(['../graphics/renderers'],
function(renderers) {
    var run = function() {

        test("circle renderer test", 
        function () {
        	expect(11);

        	var strokeColour = "red";
        	var fillColour = "green";
        	var circRenderer = new renderers.CircleRenderer(strokeColour, fillColour);
        	var fakeProps = {
        		topLeftCorner: {x: 0, y: 0},
        		shape: {
        			radius: 5
        		}
        	};
        	var fakeCtx = {
        		beginPath: function () {
        			ok(true, "beginPath called on ctx");
        		},
        		arc: function (centerX, centerY, radius, startAngle, endAngle, ccw) {
        			ok(!ccw, "drew circle clockwise in ctx.arc");
        			equal(5, radius, "radius passed through correctly to ctx.arc");
        			equal(5, centerX, "centerX calculated correctly");
        			equal(5, centerY, "centerX calculated correctly");
        			equal(0, startAngle, "startAngle correct");
        			equal(2 * Math.PI, endAngle, "endAngle correct");
        		},
        		fill: function () {
        			ok(true, "called fill");
        		},
        		stroke: function () {
        			ok(true, "called stroke");
        		}
        	};
        	circRenderer.draw(fakeCtx, fakeProps);

        	equal(strokeColour, fakeCtx.strokeStyle, 
        		"strokeStyle set correctly in ctx after draw");
        	equal(fillColour, fakeCtx.fillStyle, 
        		"fillStyle set correctly in ctx after draw");
        });

    };
    return {run: run};
}
);
