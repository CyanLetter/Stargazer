export { Weapon };

class Weapon {
	constructor(config, parent) {
		this.config = config;
		this.parent = parent;
		this.ownerId = parent.ownerId;
		this.lastShot = 0;
		this.maxRange = this.config.shotSpeed * this.config.shotLifetime;

		/*
		// Weapon config example
		{
			spritePath: ,
			fireRate: ,
			shotSpeed: ,
			shotLifetime: ,
		}
		*/

		// './img/laserBlue01.png'
		// './img/laserRed01.png'
	}

	update(deltaTime) {
		if (this.lastShot > 0) {
			this.lastShot -= deltaTime;
		}
	}

	fire() {
		if (this.lastShot > 0) {
			return;
		}

		this.lastShot = this.config.fireRate;
		let shot = PIXI.Sprite.from(this.config.spritePath);

		shot.ownerId = this.ownerId;
		shot.lifetime = this.config.shotLifetime;

		shot.x = this.parent.x;
		shot.y = this.parent.y;
		shot.rotation = this.parent.rotation;
		shot.anchor = new PIXI.Point(0.5, 0.5);
		shot.scale = new PIXI.Point(0.5, 0.5);
		shot.vX = (Math.cos(shot.rotation) * this.config.shotSpeed) + this.parent.vX;
		shot.vY = (Math.sin(shot.rotation) * this.config.shotSpeed) + this.parent.vY;
		shot.time = 0;

		PubSub.publish("SHOTS_FIRED", shot);
	}

}