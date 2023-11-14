export { Minimap };

class Minimap {
	constructor(worldRef) {
		this.worldRef = worldRef;
		this.container = new PIXI.Container();
		this.map = new PIXI.Container();
		this.mapScale = 0.05;
		this.mapSize = 200;
		this.map.scale = new PIXI.Point(this.mapScale, this.mapScale);

		
		var bg1 = new PIXI.Graphics();
		bg1.beginFill(0xCCCCCC);
		bg1.drawRect(-10, -10, this.mapSize + 20, this.mapSize + 20);
		this.container.addChild(bg1);

		var bg2 = new PIXI.Graphics();
		bg2.beginFill(0x000000);
		bg2.drawRect(0, 0, this.mapSize, this.mapSize);
		this.container.addChild(bg2);

		var mask = new PIXI.Graphics();
		mask.beginFill(0xCC3300);
		mask.drawRect(0, 0, this.mapSize, this.mapSize);
		this.container.addChild(mask);

		this.map.mask = mask;

		this.planets = [];
		this.entities = [];

		this.container.addChild(this.map);

		// this.container.width = 200;
		// this.container.height = 200;
		// this.map.anchor = new PIXI.Point(1, 0);
		// this.container.width

		// this.testSprite = PIXI.Sprite.from('./img/laserBlue01.png');
		// this.container.addChild(this.testSprite);
	}

	update(deltaTime) {
		for (let i = 0; i < this.entities.length; i++) {

			var entity = this.entities[i];
			var ref = entity.ref;
			if (ref) {
				entity.x = ref.ship.x;
				entity.y = ref.ship.y;
			}
		}

		this.container.x = app.view.width - this.mapSize - 10;
		this.container.y = 10;

		this.map.x = (this.worldRef.x - (app.view.width / 2)) * this.mapScale + (this.mapSize / 2);
		this.map.y = (this.worldRef.y - (app.view.width / 2)) * this.mapScale + (this.mapSize / 2);
	}

	addPlanet(planetRef) {
		var planet = PIXI.Sprite.from('./img/star.png');
		planet.ref = planetRef;
		planet.position = new PIXI.Point(planetRef.x, planetRef.y);
		planet.scale = new PIXI.Point(5, 5);
		this.planets.push(planet);
		this.map.addChild(planet);
	}

	addEntity(entityRef) {
		var entity = PIXI.Sprite.from('./img/star.png');
		entity.tint = 0x0000FF;
		entity.ref = entityRef;
		entity.position = new PIXI.Point(entityRef.x, entityRef.y);
		entity.scale = new PIXI.Point(5, 5);
		this.entities.push(entity);
		this.map.addChild(entity);
	}

	removeEntity(entityRef) {

	}
}