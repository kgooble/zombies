define(['util/logger', '../directions'],
function (logger, directions) {
    var SpriteRenderer = function (animator, sprite, initialState) {
        this.animator = animator;
        this.sprite = sprite; 
        this.state = initialState;
    };
    SpriteRenderer.prototype.update = function (timeDelta) {
        var result = this.animator.update(timeDelta);
        this.state = result;
    };
    SpriteRenderer.prototype.draw = function (ctx, props, jsonloader, imageloader) {
        var facing = props.forward;
        var topLeftCorner = props.topLeftCorner;

        this.animator.setState(this.state);
        var poseName = this.animator.getPoseName();
        var poseOrientation = "forward";
        switch (facing) {
            case directions.UP:
                poseOrientation = "back";
                break;
            case directions.RIGHT:
                poseOrientation = "right";
                break;
            case directions.LEFT:
                poseOrientation = "left";
                break;
            default:
                poseOrientation = "forward";
        }
        var pose = this.sprite.getPose(poseOrientation, 
            poseName, jsonloader, imageloader);
        if (pose === null) {
            logger.log("Pose was null so getting default:", 
                this.animator.getDefaultPoseName());
            pose = this.sprite.getPose(poseOrientation, 
                this.animator.getDefaultPoseName(), jsonloader, imageloader);
        }
        pose.draw(ctx, topLeftCorner);
    };
    SpriteRenderer.prototype.setState = function (state) {
        this.state = state;
    };
    var CircleRenderer = function (strokeColour, fillColour) {
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
    };

    CircleRenderer.prototype.update = function (timeDelta) {
    };
    CircleRenderer.prototype.draw = function (ctx, props, jsonloader, imageloader) {
        var shape = props.shape;
        var topLeftCorner = props.topLeftCorner;

        ctx.beginPath();
        ctx.arc(topLeftCorner.x + shape.radius, topLeftCorner.y + shape.radius, 
            shape.radius, 0, 2 * Math.PI, false);
        if (this.strokeColour !== undefined) {
            ctx.strokeStyle = this.strokeColour;
        } else {
            ctx.strokeStyle = "white";
        }
        if (this.fillColour !== undefined) {
            ctx.fillStyle = this.fillColour;
            ctx.fill();
        }
        ctx.stroke();
    };

    var RectangleRenderer = function (strokeColour, fillColour) {
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
    };
    RectangleRenderer.prototype.update = function (timeDelta) {
    };

    RectangleRenderer.prototype.draw = function (ctx, props, jsonloader, imageloader) {
        var shape = props.shape;
        var topLeftCorner = props.topLeftCorner;

        ctx.fillStyle = this.fillColour;
        ctx.fillRect(topLeftCorner.x, topLeftCorner.y, shape.width, 
                shape.height);
    };

    var PointRenderer = function (x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    };
    PointRenderer.prototype.draw = function (ctx, props, jsonloader, imageloader) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
    };

    return {
    	PointRenderer: PointRenderer,
    	CircleRenderer: CircleRenderer,
    	RectangleRenderer: RectangleRenderer,
    	SpriteRenderer: SpriteRenderer

    };
	
});