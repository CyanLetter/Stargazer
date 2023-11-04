import { Ship } from "./ship.js";

export { NPC };

class NPC {
	// NPCs control the behavior and allegiance of specific ships
	// Ships themselves are in control of the physical act of moving through and interacting with space
	constructor(config, world) {
		this.config = config;
		this.world = world;
		this.ship = new Ship(this.config.shipConfig, this.config.id);
		this.world.addChild(this.ship.container);

		this.target = this.config.target;

		this.id = this.config.id != null ? this.config.id : Math.round(Math.random() * 100000000);

		this.accelerating = true;

		// TODO probably keep track of shots globally and register to entity IDs. 
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
			this.ship.accelerate(deltaTime);
		}
		if (this.target) {
			// TODO non combat AI target behavior
			var aimTarget = this.target.position;
			if (this.target.vX) {
				// try to lead shot
				
				let projectileSpeed = this.ship.longestReachWeapon.config.shotSpeed;
				let thisV = new PIXI.Point(this.ship.vX, this.ship.vY);
				let targetV = new PIXI.Point(this.target.vX, this.target.vY);

				let interceptPoint = this.calculateInterceptPoint(this.ship.position, thisV, this.target.position, targetV, projectileSpeed);

				if (interceptPoint) {
					aimTarget = interceptPoint;
				}

			}
			this.ship.rotateTowardsTarget(deltaTime, aimTarget);
		}
		if (this.shooting) {
			this.ship.shoot();
		}

		this.ship.update(deltaTime);
	}

	calculateInterceptPoint(aPos, aVel, bPos, bVel, projectileSpeed) {
		// Calculate the relative velocity
		let relVel = { x: bVel.x - aVel.x, y: bVel.y - aVel.y };

		// Calculate the relative position
		let relPos = { x: bPos.x - aPos.x, y: bPos.y - aPos.y };

		// Quadratic equation coefficients a*t^2 + b*t + c = 0
		let a = relVel.x**2 + relVel.y**2 - projectileSpeed**2;
		let b = 2 * (relPos.x * relVel.x + relPos.y * relVel.y);
		let c = relPos.x**2 + relPos.y**2;

		// Quadratic formula discriminant
		let discriminant = b**2 - 4 * a * c;
		if (discriminant < 0) {
			// No real root means no possible intercept
			return null;
		}

		// Time at which the intercept occurs
		let t = 2 * c / (Math.sqrt(discriminant) - b);

		if (t < 0) {
			// Negative time means the intercept is not possible in the future
			return null;
		}

		// Calculate the intercept position
		let interceptPos = {
			x: bPos.x + relVel.x * t,
			y: bPos.y + relVel.y * t
		};

		return interceptPos;
	}

	distance(a, b) {
		var w = a.x - b.x;
		var h = a.y - b.y;

		return Math.sqrt( w*w + h*h );
	}

	destroy() {
		this.world.removeChild(this.ship.container);
	}
}