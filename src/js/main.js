import { Player } from "./modules/player.js";
import { NPC } from "./modules/npc.js";
import { Physics } from "./modules/physics.js";
import { PlanetarySystem } from "./modules/planetarySystem.js";

window.onload = () => {
	init();
}

var game = {
	player: null,
	currentSystem: null,
	shots: [],
	enemySpawnRate: 100,
	lastEnemySpawn: 100,
	maxEnemies: 5,
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


	// fast laser
	let playerWeaponConfig = {
		spritePath: './img/laserBlue01.png',
		fireRate: 5,
		shotSpeed: 10,
		shotLifetime: 60,
		damageShield: 10,
		damageHull: 10
	}
	let playerWeaponConfig2 = {
		spritePath: './img/laserGreen10.png',
		fireRate: 60,
		shotSpeed: 1,
		shotLifetime: 180,
		damageShield: 150,
		damageHull: 150
	}

	let playerShipConfig = {
		spritePath: './img/ship3.png',
		shield: 50,
		hull: 50,
		accel: .1,
		turnRate: .0013,
		maxSpeed: 9,
		weapons: [playerWeaponConfig],
		vX: 0,
		vY: 0
	};
	let playerConfig = {
		id: "Player",
		name: "Skum the Trustworthy",
		gender: "Charlatan",
		shipConfig: playerShipConfig,
		target: null
	};
	let player = new Player(playerConfig);
	game.player = player;

	// new planet
	// todo config for each planet
	// services offered, faction, etc
	game.currentSystem = new PlanetarySystem({
		planetConfigs: [
			{
				spritePath: './img/planet15.png',
				x: 0,
				y: 0
			},
			{
				spritePath: './img/planet5.png',
				x: -1000,
				y: -300
			},
			{
				spritePath: './img/planet6.png',
				x: 250,
				y: 90
			}
		],
		faction: "",
		shipPool: "",
		shipFrequency: 0,
		initialShipDensity: [0, 10]
	});

	// set up ticker
	app.ticker.add(update);
}

function update(deltaTime) {
	// return;
	// current system keeps track of all entities, including player ship
	if (game.currentSystem) {
		game.currentSystem.update(deltaTime);
	}
}