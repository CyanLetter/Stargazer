import { Ship } from "./ship.js";

export { Player };

class Player {
	// Player handles control schemes
	// TBD whether also handles quests or property etc? May just be the current input handling for the player ship
	// may also handle escorts?
	// Ships themselves are in control of the physical act of moving through and interacting with space
	constructor(config, world) {
		this.config = config;
		this.world = world;
		this.ship = new Ship(this.config.shipConfig);
		this.world.addChild(this.ship.container);

		this.accelerating = false;
		this.turningL = false;
		this.turningR = false;
		this.shooting = false;

		/*
		// Player config example
		{
			id: ,
			name: ,
			gender: ,
			shipConfig: ,
			target: ,
		}
		*/

		window.addEventListener("keydown", (event) => this.handleKeyDown(event));
		window.addEventListener("keyup", (event) => this.handleKeyUp(event));
	}

	update(deltaTime) {
		if (this.accelerating) {
			this.ship.accelerate(deltaTime);
		}
		if (this.turningL) {
			this.ship.rotateDirection(deltaTime, -1)
		}
		if (this.turningR) {
			this.ship.rotateDirection(deltaTime, 1)
		}
		if (this.target) {
			// this.ship.rotateTowardsTarget(deltaTime, this.target);
		}
		if (this.shooting) {
			// this.ship.rotateTowardsTarget(deltaTime, this.target);
			this.ship.shoot();
		}

		this.ship.update(deltaTime);
	}

	handleKeyDown(event) {
		// console.log(event);

		if (event.code === "KeyW") {
			this.accel(true);
		} else if (event.code === "KeyA") {
			this.turn(true, "L");
		} else if (event.code === "KeyD") {
			this.turn(true, "R");
		} else if (event.code === "Space") {
			this.shooting = true;
		}
	}

	handleKeyUp(event) {
		// console.log(event);

		if (event.code === "KeyW") {
			this.accel(false);
		} else if (event.code === "KeyA") {
			this.turn(false, "L");
		} else if (event.code === "KeyD") {
			this.turn(false, "R");
		} else if (event.code === "Space") {
			this.shooting = false;
		}
	}

	turn(isTurning, direction) {
		this["turning" + direction] = isTurning;
	}

	accel(isAccelerating) {
		this.accelerating = isAccelerating;
	}

	destroy() {
		this.world.removeChild(this.ship.container);

		window.removeEventListener("keydown", (event) => this.handleKeyDown(event));
		window.removeEventListener("keyup", (event) => this.handleKeyUp(event));
	}

}