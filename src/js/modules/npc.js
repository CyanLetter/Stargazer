import { Ship } from "./ship.js";

export { NPC };

class NPC {
	constructor(config, world) {
		this.config = config;
		this.world = world;
		this.ship = new Ship(this.config.shipConfig);
		this.world.addChild(this.ship.container);

		this.target = this.config.target;

		this.id = this.config.id != null ? this.config.id : Math.round(Math.random() * 100000000);

		this.accelerating = true;
		this.vX = 0;
		this.vY = 0;

		// TODO probably keep track of shots globally and register to entity IDs. This way can destroy NPCs without consequence
		this.shots = [];
		this.lastShot = 0;
		this.shooting = false;

		/*
		// NPC config example
		{
			id: ,
			name: ,
			shipConfig: ,
			faction: ,
			target: ,
			emotion: ,
			ai: 
		}
		*/
	}

	update(deltaTime) {
		

		if (this.accelerating) {
			this.updateSpeed(deltaTime);
		}
		if (this.target) {
			this.updateRotation(deltaTime);
		}

		this.ship.x += this.vX;
		this.ship.y += this.vY;
		this.ship.update(deltaTime);
	}

	updateSpeed(deltaTime) {
		this.vX += Math.cos(this.ship.rotation) * this.ship.config.accel * deltaTime;
		this.vY += Math.sin(this.ship.rotation) * this.ship.config.accel * deltaTime;

		this.vX = Math.max(-this.ship.config.maxSpeed, this.vX);
		this.vX = Math.min(this.ship.config.maxSpeed, this.vX);
		this.vY = Math.max(-this.ship.config.maxSpeed, this.vY);
		this.vY = Math.min(this.ship.config.maxSpeed, this.vY);
	}

	updateRotation(deltaTime) {
		var distX = this.target.x - this.ship.x;
		var distY = this.target.y - this.ship.y;
		var targetAngle = Math.atan2(distY,distX);

		var behind = this.ship.rotation - 3.14;
		if (behind < -3.14) {
			behind += 6.28;
		}
		if (this.ship.rotation < 0) {
			if (targetAngle > this.ship.rotation && targetAngle < behind) {
				this.ship.rotation += this.r2d(game.turnRate) * deltaTime;
			} else {
				this.ship.rotation -= this.r2d(game.turnRate) * deltaTime;
			}
		} else {
			if (targetAngle < this.ship.rotation && targetAngle > behind) {
				this.ship.rotation -= this.r2d(game.turnRate) * deltaTime;
			} else {
				this.ship.rotation += this.r2d(game.turnRate) * deltaTime;
			}
		}

		if (this.ship.rotation < -3.14) {
			this.ship.rotation += 6.28;
		}
		if (this.ship.rotation > 3.14) {
			this.ship.rotation -= 6.28;
		}
	}

	destroy() {
		this.world.removeChild(this.ship.container);
	}

	r2d(r) {
		return r * (180/Math.PI);
	}
}