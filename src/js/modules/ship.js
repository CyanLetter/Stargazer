import { Physics } from "./physics.js";
import { Weapon } from "./weapon.js";

export { Ship };

class Ship {
	constructor(config, ownerId) {
		this.config = config;
		this.ownerId = ownerId;
		this.weapons = [];
		this.vX = 0;
		this.vY = 0;
		this.shield = this.config.shield;
		this.hull = this.config.hull;

		/*
		// Ship config example
		{
			ownerId: ,
			spritePath: ,
			accel: ,
			maxSpeed: ,
			turnRate: ,
			weapons: []
		}
		*/

		this.container = new PIXI.Container();
		this.container.rotation = Math.random() * 6.28;
		this.sprite = PIXI.Sprite.from(this.config.spritePath);
		this.sprite.anchor = new PIXI.Point(0.5, 0.5);
		this.container.addChild(this.sprite);

		this.container.x = config.x;
		this.container.y = config.y;

		this.longestReachWeapon = null;
		for (let i = 0; i < this.config.weapons.length; i++) {
			let weapon = new Weapon(this.config.weapons[i], this);
			this.weapons.push(weapon);

			if (i == 0 || weapon.maxRange > this.longestReachWeapon.maxRange) {
				this.longestReachWeapon = weapon;
			}
		}

		return this;
	}

	get rotation() 		{ return this.container.rotation; }
	set rotation(val) 	{ this.container.rotation = val; }
	get x() 			{ return this.container.x; }
	set x(val) 			{ this.container.x = val; }
	get y() 			{ return this.container.y; }
	set y(val) 			{ this.container.y = val; }
	get position() 		{ return this.container.position; }
	get width() 		{ return this.container.width; }
	get height() 		{ return this.container.height; }

	accelerate(deltaTime) {
		let rCos = Math.cos(this.rotation);
		let rSin = Math.sin(this.rotation);

		let maxX = rCos * this.config.maxSpeed;
		let maxY = rSin * this.config.maxSpeed;

		let dX = (rCos * this.config.accel * deltaTime);
		let dY = (rSin * this.config.accel * deltaTime);

		if (Math.sign(maxX) == Math.sign(this.vX) && Math.abs(maxX) < Math.abs(this.vX)) {
			dX *= -1;
		}
		this.vX += dX;

		if (Math.sign(maxY) == Math.sign(this.vY) && Math.abs(maxY) < Math.abs(this.vY)) {
			dY *= -1;
		}
		this.vY += dY;


		return;

		if (Math.abs(newvX) <= maxX) {
			this.vX = newvX;
		}
		if (Math.abs(newvY) <= maxY) {
			this.vY = newvY;
		}

		this.vX = Math.max(-maxX, this.vX);
		this.vX = Math.min(maxX, this.vX);
		this.vY = Math.max(-maxY, this.vY);
		this.vY = Math.min(maxY, this.vY);
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
		for (let i = 0; i < this.weapons.length; i++) {
			this.weapons[i].fire();
		}
	}

	update(deltaTime) {
		this.x += this.vX;
		this.y += this.vY;

		for (let i = 0; i < this.weapons.length; i++) {
			this.weapons[i].update(deltaTime);
		}
	}

	damage(shieldDamage, hullDamage) {
		this.shield = Math.max(this.shield - shieldDamage, 0);
		if (this.shield == 0) {
			this.hull -= hullDamage;	
		}

		console.log("Ship", this.ownerId, "Shield", this.shield, "Hull", this.hull);

		if (this.hull <= 0) {
			return true;
		}
		return false;
	}
}