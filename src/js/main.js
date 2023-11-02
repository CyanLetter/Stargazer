import { NPC } from "./modules/npc.js";

window.onload = () => {
	console.log("Hello WOrld");
	init();
}

var game = {
	accel: .1,
	turnRate: .001,
	fireRate: 15,
	maxSpeed: 5,
	shotSpeed: 10,
	shotLifetime: 60,
	player: null,
	playerShots: [],
	enemySpawnRate: 100,
	lastEnemySpawn: 100,
	maxEnemies: 5,
	enemyShots: [],
	enemies: [],
	stars: []
}
window.game = game;


function init() {
	const app = new PIXI.Application({
		background: '#000000',
		resizeTo: window,
	});
	window.app = app;

	document.body.appendChild(app.view);

	game.background = new PIXI.Container();
	app.stage.addChild(game.background);
	for (let i = 0; i < 50; i++) {
		var star = PIXI.Sprite.from('./img/star.png');
		star.x = Math.random() * app.view.width;
		star.y = Math.random() * app.view.height;
		star.parallax = (Math.random() * 0.5) + 0.4;
		star.anchor = new PIXI.Point(0.5, 0.5);
		star.scale = new PIXI.Point(0.2, 0.2);
		game.stars.push(star);
		game.background.addChild(star);
	}

	game.world = new PIXI.Container();
	game.world.scale = new PIXI.Point(1, 1);
	app.stage.addChild(game.world);

	game.planetLayer = new PIXI.Container();
	game.world.addChild(game.planetLayer);

	game.shotLayer = new PIXI.Container();
	game.world.addChild(game.shotLayer);

	let planet = PIXI.Sprite.from('./img/planet15.png');
	planet.anchor = new PIXI.Point(0.5, 0.5);
	game.planetLayer.addChild(planet);

	// set up player
	let player = PIXI.Sprite.from('./img/ship3.png');
	// player.x = app.view.width / 2;
	// player.y = app.view.height / 2;
	player.anchor = new PIXI.Point(0.5, 0.5);
	game.world.addChild(player);
	game.player = player;

	game.player.vX = 0;
	game.player.vY = 0;
	game.player.turningL = false;
	game.player.turningR = false;
	game.player.accelerating = false;
	game.player.shooting = false;
	game.player.lastShot = 0;

	// set up ticker
	app.ticker.add(update);

	// controller events
	window.addEventListener("keydown", (event) => handleKeyDown(event));
	window.addEventListener("keyup", (event) => handleKeyUp(event));
}

function update(deltaTime) {
	if (game.player.turningL) {
		game.player.rotation -= r2d(game.turnRate) * deltaTime;
	}
	if (game.player.turningR) {
		game.player.rotation += r2d(game.turnRate) * deltaTime;
	}
	if (game.player.accelerating) {
		// add velocity in direction
		updateSpeed(game.player, deltaTime);
	}

	game.player.x += game.player.vX * deltaTime;
	game.player.y += game.player.vY * deltaTime;

	game.world.x = (-game.player.x * game.world.scale.x) + (app.view.width / 2);
	game.world.y = (-game.player.y * game.world.scale.x) + (app.view.height / 2);

	// handle shooting and shots
	if (game.player.lastShot > 0) {
		game.player.lastShot -= deltaTime;
	}
	if (game.player.shooting && game.player.lastShot <= 0) {
		playerShoot();
	}
	
	for (let i = game.playerShots.length - 1; i >= 0; i--) {
		let shot = game.playerShots[i];
		shot.time += deltaTime;
		if (shot.time >= game.shotLifetime) {
			game.playerShots.splice(i, 1);
			game.shotLayer.removeChild(shot);
			continue;
		}

		shot.x += shot.vX;
		shot.y += shot.vY;

		for (let j = 0; j < game.enemies.length; j++) {
			// eventually, assign all entities unique IDs, and registered to ID of shooter
			// skip collision check for shots matching shooter ID
			let enemy = game.enemies[j];

			let collide = boxIntersect(shot, enemy.ship);

			if (collide) {
				game.enemies.splice(j, 1);
				enemy.destroy();
				// game.world.removeChild(enemy);

				// destroy shot as well
				game.playerShots.splice(i, 1);
				game.shotLayer.removeChild(shot);
				continue;
			}
		}
	}

	for (let i = game.enemyShots.length - 1; i >= 0; i--) {
		let shot = game.enemyShots[i];
		shot.time += deltaTime;
		if (shot.time >= game.shotLifetime) {
			game.enemyShots.splice(i, 1);
			game.shotLayer.removeChild(shot);
			continue;
		}

		shot.x += shot.vX;
		shot.y += shot.vY;
	}

	for (let i = 0; i < game.enemies.length; i++) {
		let enemy = game.enemies[i];
		enemy.update(deltaTime);
	}

	game.lastEnemySpawn -= deltaTime;
	if (game.lastEnemySpawn <= 0 && game.enemies.length < game.maxEnemies) {
		spawnEnemy();
	}


	// update background starfield
	for (let i = 0; i < game.stars.length; i++) {
		var star = game.stars[i];
		star.x -= (game.player.vX * game.world.scale.x) * star.parallax;
		star.y -= (game.player.vY * game.world.scale.x) * star.parallax;

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

function playerShoot() {
	game.player.lastShot = game.fireRate;

	let shot = PIXI.Sprite.from('./img/laserBlue01.png');
	shot.x = game.player.x;
	shot.y = game.player.y;
	shot.rotation = game.player.rotation;
	shot.anchor = new PIXI.Point(0.5, 0.5);
	shot.scale = new PIXI.Point(0.5, 0.5);
	shot.vX = (Math.cos(shot.rotation) * game.shotSpeed) + game.player.vX;
	shot.vY = (Math.sin(shot.rotation) * game.shotSpeed) + game.player.vY;
	shot.time = 0;

	game.playerShots.push(shot);
	game.shotLayer.addChild(shot);
}

function enemyShoot(enemy) {
	let shot = PIXI.Sprite.from('./img/laserRed01.png');
	shot.x = enemy.x;
	shot.y = enemy.y;
	shot.rotation = enemy.rotation;
	shot.anchor = new PIXI.Point(0.5, 0.5);
	shot.scale = new PIXI.Point(0.5, 0.5);
	shot.vX = (Math.cos(shot.rotation) * game.shotSpeed) + enemy.vX;
	shot.vY = (Math.sin(shot.rotation) * game.shotSpeed) + enemy.vY;
	shot.time = 0;

	game.enemyShots.push(shot);
	game.shotLayer.addChild(shot);
}

function spawnEnemy() {
	game.lastEnemySpawn = game.enemySpawnRate;

	var enemyShipConfig = {
		spritePath: './img/ship2.png',
		accel: .1,
		turnRate: .001,
		maxSpeed: 5,
		fireRate: 15,
		shotSpeed: 10,
		shotLifetime: 60,
		x: Math.round(Math.random() * app.view.width),
		y: Math.round(Math.random() * app.view.height),
		vX: 0,
		vY: 0
	};

	var enemyConfig = {
		id: "0000001",
		name: "Test",
		shipConfig: enemyShipConfig,
		faction: "enemy",
		target: game.player,
		emotion: "wry",
		ai: "bad"
	};

	let enemy = new NPC(enemyConfig, game.world);
	enemy.accelerating = true;
	enemy.shooting = true;

	game.enemies.push(enemy);
}

function handleKeyDown(event) {
	// console.log(event);

	if (event.code === "KeyW") {
		accel(true);
	} else if (event.code === "KeyA") {
		turn(true, "L");
	} else if (event.code === "KeyD") {
		turn(true, "R");
	} else if (event.code === "Space") {
		game.player.shooting = true;
	}
}

function handleKeyUp(event) {
	// console.log(event);

	if (event.code === "KeyW") {
		accel(false);
	} else if (event.code === "KeyA") {
		turn(false, "L");
	} else if (event.code === "KeyD") {
		turn(false, "R");
	} else if (event.code === "Space") {
		game.player.shooting = false;
	}
}

function turn(isTurning, direction) {
	game.player["turning" + direction] = isTurning;
}

function accel(isAccelerating) {
	game.player.accelerating = isAccelerating;
}

function r2d(r) {
	return r * (180/Math.PI);
}

function boxIntersect(a, b) {
	return (
		a.x < b.x + b.width &&		// left edge of A is less than right edge of B
		a.x + a.width > b.x &&		// right edge of A is greater than left edge of B
		a.y < b.y + b.height &&		// top edge of A is less than bottom edge of B
		a.y + a.height > b.y 		// bottom edge of A is greater than top edge of B
	);
};

function updateSpeed(entity, deltaTime) {
	entity.vX += Math.cos(entity.rotation) * game.accel * deltaTime;
	entity.vY += Math.sin(entity.rotation) * game.accel * deltaTime;

	entity.vX = Math.max(-game.maxSpeed, entity.vX);
	entity.vX = Math.min(game.maxSpeed, entity.vX);
	entity.vY = Math.max(-game.maxSpeed, entity.vY);
	entity.vY = Math.min(game.maxSpeed, entity.vY);
}