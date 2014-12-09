define(['./vector2', '../objectkinds'], function (vector2, objectkinds) {
	var ZOMBIE_TO_PLAYER_ATTRACTION = 10;
	var ZOMBIE_TO_WALL_DETRACTION = 3;

	var PullingForce = function (center, magnitude) {
		if (typeof(center) != vector2.Vector2) {
			center = new vector2.Vector2(center.x, center.y);
		}
		this.center = center;
		this.magnitude = magnitude;
	};
	PullingForce.prototype.on = function (point) {
		return this.center.subtract(point);
	};

	var PushingForce = function (center, magnitude) {
		if (typeof(center) != vector2.Vector2) {
			center = new vector2.Vector2(center.x, center.y);
		}
		this.center = center;
		this.magnitude = magnitude;
	};
	PushingForce.prototype.on = function (point) {
		if (typeof(point) != vector2.Vector2) {
			point = new vector2.Vector2(point.x, point.y);
		}
		return point.subtract(this.center);
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
			return new PullingForce(object1.position, ZOMBIE_TO_PLAYER_ATTRACTION);
		} else if (object1.kind == objectkinds.WALL && object2.kind == objectkinds.ZOMBIE) {
			return new PushingForce(object1.position, ZOMBIE_TO_WALL_DETRACTION);
		}
		return null;
	};

	return {
		calculateForces: calculateForces,
		pullToward: function (point) {
			return new PullingForce(point);
		},
		pushAwayFrom: function (point) {
			return new PushingForce(point);
		},
		constantForce: function (direction, magnitude) {
			return new ConstantForce(direction, magnitude);
		}

	};
});