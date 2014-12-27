define(['./vector2', '../objectkinds'], function (vector2, objectkinds) {
	var ZOMBIE_TO_PLAYER_ATTRACTION = 0.5;
	var ZOMBIE_TO_WALL_DETRACTION = 0.5;

	var Force = function (center, magnitude) {
		if (typeof(center) != vector2.Vector2) {
			center = new vector2.Vector2(center.x, center.y);
		}
		this.center = center;
		this.magnitude = magnitude;
	};
	Force.prototype.on = function(point) {
		return this.center.subtract(point).times(this.magnitude);
	};

	var ConstantForce = function (direction, magnitude) {
		if (typeof(direction) != vector2.Vector2) {
			direction = new vector2.Vector2(direction.x, direction.y);
		}
		this.direction = direction.normalized();
		this.magnitude = magnitude;
	};
	ConstantForce.prototype.on = function (point) {
		return this.direction.times(this.magnitude);
	};

	var calculateForces = function (object1, object2) {
		if (object1.kind == objectkinds.PLAYER && object2.kind == objectkinds.ZOMBIE){
			return pullToward(object1.position, ZOMBIE_TO_PLAYER_ATTRACTION);
		} else if (object1.kind == objectkinds.WALL && object2.kind == objectkinds.ZOMBIE) {
			return pushAwayFrom(object1.position, ZOMBIE_TO_WALL_DETRACTION);
		}
		return null;
	};

	var pullToward = function(point, magnitude) {
		if (magnitude === undefined) {
			magnitude = 1;
		} else if (magnitude < 0) {
			magnitude = -magnitude;
		}
		return new Force(point, magnitude);
	};
	var pushAwayFrom = function(point, magnitude) {
		if (magnitude === undefined) {
			magnitude = -1;
		} else if (magnitude > 0) {
			magnitude = -magnitude;
		}
		return new Force(point, magnitude);
	};

	var applyAll = function(forces, point) {
		if (forces === undefined || forces.length === 0){
			return vector2.ZERO;
		}
		var resultVector = new vector2.Vector2(0, 0);
		for (var i = 0; i < forces.length; i++){
			resultVector = resultVector.add(forces[i].on(point));
		}
		return new ConstantForce(resultVector, resultVector.magnitude());
	};

	return {
		calculateForces: calculateForces,
		pullToward: pullToward,
		pushAwayFrom: pushAwayFrom,
		constantForce: function (direction, magnitude) {
			return new ConstantForce(direction, magnitude);
		},
		applyAll: applyAll

	};
});