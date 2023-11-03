import { Physics } from "./physics.js";

export { Ship };

class Ship {
	constructor(config) {
		this.config = config;
		this.weapons = [];
		this.vX = 0;
		this.vY = 0;

		/*
		// Ship config example
		{
			spritePath: ,
			accel: ,
			maxSpeed: ,
			turnRate: ,
			fireRate: ,
			shotSpeed: ,
			shotLifetime: ,
		}
		*/

		this.container = new PIXI.Container();
		this.container.rotation = Math.random() * 6.28;
		this.sprite = PIXI.Sprite.from(this.config.spritePath);
		this.sprite.anchor = new PIXI.Point(0.5, 0.5);
		this.container.addChild(this.sprite);

		this.container.x = config.x;
		this.container.y = config.y;

		return this;
	}

	get rotation() 		{ return this.container.rotation; }
	set rotation(val) 	{ this.container.rotation = val; }
	get x() 			{ return this.container.x; }
	set x(val) 			{ this.container.x = val; }
	get y() 			{ return this.container.y; }
	set y(val) 			{ this.container.y = val; }
	get width() 		{ return this.container.width; }
	get height() 		{ return this.container.height; }

	accelerate(deltaTime) {
		this.vX += Math.cos(this.rotation) * this.config.accel * deltaTime;
		this.vY += Math.sin(this.rotation) * this.config.accel * deltaTime;

		this.vX = Math.max(-this.config.maxSpeed, this.vX);
		this.vX = Math.min(this.config.maxSpeed, this.vX);
		this.vY = Math.max(-this.config.maxSpeed, this.vY);
		this.vY = Math.min(this.config.maxSpeed, this.vY);
	}

	rotateDirection(deltaTime, direction) {
		this.rotation += (Physics.r2d(this.config.turnRate) * deltaTime) * direction;
	}

	rotateTowardsTarget(deltaTime, target) {
		var distX = target.x - this.x;
		var distY = target.y - this.y;
		var targetAngle = Math.atan2(distY,distX);

		var behind = this.rotation - 3.14;
		if (behind < -3.14) {
			behind += 6.28;
		}
		if (this.rotation < 0) {
			if (targetAngle > this.rotation && targetAngle < behind) {
				this.rotation += Physics.r2d(this.config.turnRate) * deltaTime;
			} else {
				this.rotation -= Physics.r2d(this.config.turnRate) * deltaTime;
			}
		} else {
			if (targetAngle < this.rotation && targetAngle > behind) {
				this.rotation -= Physics.r2d(this.config.turnRate) * deltaTime;
			} else {
				this.rotation += Physics.r2d(this.config.turnRate) * deltaTime;
			}
		}

		if (this.rotation < -3.14) {
			this.rotation += 6.28;
		}
		if (this.rotation > 3.14) {
			this.rotation -= 6.28;
		}
	}

	shoot() {
		PubSub.publish('SHOTS_FIRED', 'Shots fired captain!');
	}

	update(deltaTime) {
		this.x += this.vX;
		this.y += this.vY;	
	}
}