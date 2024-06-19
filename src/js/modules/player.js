import { Ship } from "./ship.js";

export { Player };

class Player {
	// Player handles control schemes
	// TBD whether also handles quests or property etc? May just be the current input handling for the player ship
	// may also handle escorts?
	// Ships themselves are in control of the physical act of moving through and interacting with space
	constructor(config) {
		this.config = config;
		this.ship = new Ship(this.config.shipConfig, this.config.id);

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

	addToWorld(world) {
		world.addChild(this.ship.container);
	}

	update(deltaTime) {
		if (this.accelerating) {
			this.ship.accelerate(deltaTime);
		}
		if (this.decelerating) {
			this.ship.decelerate(deltaTime);
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
		event.preventDefault();

		if (event.code === "KeyW" || event.code === "ArrowUp") {
			this.accel(true);
		} else if (event.code === "KeyA" || event.code === "ArrowLeft") {
			this.turn(true, "L");
		} else if (event.code === "KeyD" || event.code === "ArrowRight") {
			this.turn(true, "R");
		} else if (event.code === "KeyS" || event.code === "ArrowDown") {
			this.decel(true);
		} else if (event.code === "Space") {
			this.shooting = true;
		}
	}

	handleKeyUp(event) {
		// console.log(event);
		event.preventDefault();

		if (event.code === "KeyW" || event.code === "ArrowUp") {
			this.accel(false);
		} else if (event.code === "KeyA" || event.code === "ArrowLeft") {
			this.turn(false, "L");
		} else if (event.code === "KeyD" || event.code === "ArrowRight") {
			this.turn(false, "R");
		} else if (event.code === "KeyS" || event.code === "ArrowDown") {
			this.decel(false);
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

	decel(isDecelerating) {
		this.decelerating = isDecelerating;
	}

	removeFromWorld(world) {
		world.removeChild(this.ship.container);
	}

	destroy() {
		console.log("DESTROYED PLAYER");
		return;

		window.removeEventListener("keydown", (event) => this.handleKeyDown(event));
		window.removeEventListener("keyup", (event) => this.handleKeyUp(event));
	}

}