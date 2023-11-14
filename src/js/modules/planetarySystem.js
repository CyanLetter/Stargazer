import { NPC } from "./npc.js";
import { Physics } from "./physics.js";
import { Minimap } from "./minimap.js";

export { PlanetarySystem };

class PlanetarySystem {
	constructor(config) {
		this.config = config;

		Object.assign(this, config);

		this.background = new PIXI.Container();
		this.world = new PIXI.Container();
		this.planetLayer = new PIXI.Container();
		this.shotLayer = new PIXI.Container();

		this.entities = [];
		this.planets = [];
		this.shots = [];
		this.stars = [];

		this.background = new PIXI.Container();

		this.world = new PIXI.Container();
		this.world.scale = new PIXI.Point(1, 1);

		this.planetLayer = new PIXI.Container();

		this.shotLayer = new PIXI.Container();

		this.ui = new PIXI.Container();
		


		/*
		{
			planets: [],
			faction: ,
			shipPool: ,
			shipFrequency: ,
			initialShipDensity: [0, 10],

		}
		*/


		// populate planets
		// populate persistent objects, e.g. destroyed ships
		// populate with random initial ships or derelicts
		// check for special mission requirements and spawn if needed

		this.minimap = new Minimap(this.world);
		this.ui.addChild(this.minimap.container);

		this.init();
	}

	init() {
		app.stage.addChild(this.background);
		app.stage.addChild(this.world);
		app.stage.addChild(this.ui);

		this.world.addChild(this.planetLayer);
		this.world.addChild(this.shotLayer);

		// handle shot management
		this.shotToken = PubSub.subscribe('SHOTS_FIRED', (msg, data) => {
			this.shotSubscriber(msg, data);
		});

		this.setupStarfield();
		this.setupPlanets();

		this.addEntity(game.player);
		// TEMP DISABLE NPC SPAWN
		// this.spawnInitialNpcs();
	}

	update(deltaTime) {
		// handle new ships entering

		// entity updates
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update(deltaTime);
		}
		// handle shots and collisions with entities
		this.handleShots(deltaTime);

		this.world.x = (-game.player.ship.x * this.world.scale.x) + (app.view.width / 2);
		this.world.y = (-game.player.ship.y * this.world.scale.x) + (app.view.height / 2);

		this.minimap.update(deltaTime);
		// handle starfield, config may change between systems
		this.updateStarfield();
	}

	setupPlanets() {
		for (let i = 0; i < this.planetConfigs.length; i++) {
			let config = this.planetConfigs[i];
			let planet = PIXI.Sprite.from(config.spritePath);
			planet.anchor = new PIXI.Point(0.5, 0.5);
			planet.x = config.x;
			planet.y = config.y;
			this.planetLayer.addChild(planet);

			this.minimap.addPlanet(planet);
		}
	}

	spawnInitialNpcs() {
		// min and max from config
		var minNpcs = 2;
		var maxNpcs = 8 - minNpcs;
		let count = minNpcs + Math.floor(Math.random() * maxNpcs);

		for (let i = 0; i < count; i++) {
			this.spawnEntity();
		}
	}

	spawnEntity() {
		// TODO does this really belong here?
		// TODO pull random configs from system pool
		let newEntityWeaponConfig = {
			spritePath: './img/laserRed01.png',
			fireRate: 30,
			shotSpeed: 10,
			shotLifetime: 30,
			damageShield: 1,
			damageHull: 1
		}
		let newEntityShipConfig = {
			spritePath: './img/ship2.png',
			shield: 25,
			hull: 25,
			accel: .1,
			turnRate: .001,
			maxSpeed: 5,
			weapons: [newEntityWeaponConfig],
			vX: 0,
			vY: 0
		};

		let newnewEntityId = Math.round(Math.random() * 100000000);
		let newEntityConfig = {
			id: newnewEntityId,
			name: "Test",
			shipConfig: newEntityShipConfig,
			faction: "independent",
			target: game.player.ship,
			emotion: "wry",
			ai: "bad"
		};

		let newEntity = new NPC(newEntityConfig, this.world);
		newEntity.ship.x = Math.round(Math.random() * app.view.width),
		newEntity.ship.y = Math.round(Math.random() * app.view.height),
		newEntity.accelerating = true;
		newEntity.shooting = true;

		this.addEntity(newEntity);
	}

	addEntity(entity) {
		this.entities.push(entity);
		entity.addToWorld(this.world);

		this.minimap.addEntity(entity);
	}

	shotSubscriber (msg, data) {
		// console.log(msg, data);
		if (msg == "SHOTS_FIRED") {
			this.shots.push(data);
			this.shotLayer.addChild(data);
		}
	};

	handleShots(deltaTime) {
		for (let i = this.shots.length - 1; i >= 0; i--) {
			let shot = this.shots[i];
			shot.time += deltaTime;
			if (shot.time >= shot.lifetime) {
				this.shots.splice(i, 1);
				this.shotLayer.removeChild(shot);
				continue;
			}

			shot.x += shot.vX;
			shot.y += shot.vY;

			let shotHit = this.checkShotCollision(shot);
			if (shotHit) {
				this.shots.splice(i, 1);
				this.shotLayer.removeChild(shot);
			}
		}
	}

	checkShotCollision(shot) {

		for (let j = 0; j < this.entities.length; j++) {
			let entity = this.entities[j];

			if (entity.config.id == shot.ownerId) {
				continue;
			}
			let collide = Physics.boxIntersect(shot, entity.ship);

			if (collide) {
				console.log("Shot", shot.ownerId, "Hit Entity", entity.config.id);
				let destroyed = entity.ship.damage(shot.damageShield, shot.damageHull);

				if (destroyed && entity != this.player) {
					this.entities.splice(j, 1);
					entity.removeFromWorld(this.world);
					entity.destroy();
				} else if (entity == this.player) {
					console.log("Shot Destroyed Player");
				}
				
				return true;
			}
		}
	}

	setupStarfield() {
		// TODO config different star densities and backgrounds

		for (let i = 0; i < 50; i++) {
			var star = PIXI.Sprite.from('./img/star.png');
			star.x = Math.random() * app.view.width;
			star.y = Math.random() * app.view.height;
			star.parallax = (Math.random() * 0.5) + 0.4;
			star.anchor = new PIXI.Point(0.5, 0.5);
			star.scale = new PIXI.Point(0.2, 0.2);
			this.stars.push(star);
			this.background.addChild(star);
		}

	}

	updateStarfield() {
		// update background starfield
		for (let i = 0; i < this.stars.length; i++) {
			var star = this.stars[i];
			star.x -= (game.player.ship.vX * this.world.scale.x) * star.parallax;
			star.y -= (game.player.ship.vY * this.world.scale.x) * star.parallax;

			if (star.x < -32) {
				star.x = app.view.width + 16;
				star.y = Math.random() * app.view.height;
				star.parallax = (Math.random() * 0.5) + 0.4;
			} else if (star.x > app.view.width + 32) {
				star.x = -16;
				star.y = Math.random() * app.view.height;
				star.parallax = (Math.random() * 0.5) + 0.4;
			}
			if (star.y < -32) {
				star.y = app.view.height + 16;
				star.x = Math.random() * app.view.width;
				star.parallax = (Math.random() * 0.5) + 0.4;
			} else if (star.y > app.view.height + 32) {
				star.y = -16;
				star.x = Math.random() * app.view.width;
				star.parallax = (Math.random() * 0.5) + 0.4;
			}
		}
	}

	destroy() {
		// save data on new persistent objects
		app.stage.removeChild(this.background);
		app.stage.removeChild(this.world);
	}
}