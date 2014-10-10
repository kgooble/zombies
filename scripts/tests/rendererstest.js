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

		test("sprite renderer test when pose given",
		function () {
			expect(10);

			var newState = "newState";
			var poseName = "thePose";
			var fakeTimeDelta = 0.1;
			var fakeAnimator = {
				update: function (timeDelta) {
					equal(timeDelta, fakeTimeDelta, 
						  "timeDelta was passsed correctly to animator");
					return newState;
				},
				setState: function (state) {
					equal(state, newState, "state set correctly in animator");
				},
				getPoseName: function () {
					ok(true, "called getPoseName on animator");
					return poseName;
				}

			};
			var fakeCtx = {
				"name":"fakeCtx"
			};
			var fakeTopLeft = { "name": "faketopleft" };
			var fakeJsonLoader = {
				"name":"json"  // To make sure deepEqual works
			};
			var fakeImageLoader = {
				"name":"image"  // To make sure deepEqual works
			};
			var fakeSprite = {
				getPose: function (orientation, name, jsonLoader, imageLoader) {
					deepEqual(jsonLoader, fakeJsonLoader, 
						"passed jsonLoader correctly to sprite");
					deepEqual(imageLoader, fakeImageLoader,
						"passed imageLoader correctly to sprite");
					deepEqual(orientation, "right", 
						"orientation passed correctly to sprite");
					deepEqual(name, poseName, 
						"pose name passed correctly to sprite");
					return {
						draw: function (ctx, topLeftCorner) {
							deepEqual(ctx, fakeCtx, 
								"ctx passed correctly to pose.draw");
							deepEqual(topLeftCorner, fakeTopLeft, 
								"topLeftCorner passed correctly to pose.draw");
						}
					};
				}

			};
			var initialState = "initialState";
			var sprite = new renderers.SpriteRenderer(fakeAnimator, 
	  												  fakeSprite, 
	  												  initialState);
			sprite.update(fakeTimeDelta);
			equal(sprite.state, newState, "state was set correctly after update");

			var fakeProps = {
				shape: {},
				forward: "right",
				topLeftCorner: fakeTopLeft
			};
			sprite.draw(fakeCtx, fakeProps, fakeJsonLoader, fakeImageLoader);


		});

    };
    return {run: run};
}
);
