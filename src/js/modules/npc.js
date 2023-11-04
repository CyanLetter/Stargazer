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
			this.ship.rotateTowardsTarget(deltaTime, this.target);
		}
		if (this.shooting) {
			this.ship.shoot();
		}

		this.ship.update(deltaTime);
	}

	destroy() {
		this.world.removeChild(this.ship.container);
	}
}