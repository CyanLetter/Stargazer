export { Ship };

class Ship {
	constructor(config) {
		this.config = config;
		this.weapons = [];

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

	update(deltaTime) {
		
	}
}