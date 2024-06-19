import { Player } from "./modules/player.js";
import { NPC } from "./modules/npc.js";
import { Physics } from "./modules/physics.js";
import { PlanetarySystem } from "./modules/planetarySystem.js";
import { Map } from "./modules/map.js";

window.onload = () => {
	init();
}

var game = {
	player: null,
	systemContainer: null, // contains planetary system 
	currentSystem: null,
	mapScreen: null,
	logScreen: null,
	currentScreen: "loading",
	shots: [],
	enemySpawnRate: 100,
	lastEnemySpawn: 100,
	maxEnemies: 5,
	data: {},
	dataLoaded: {
		player: false,
		systems: false
	},
	loadComplete: false
}
window.game = game;


function init() {
	const app = new PIXI.Application({
		background: '#000000',
		resizeTo: window,
	});
	window.app = app;

	document.body.appendChild(app.view);

	// data structure for ships and weapons
	// ships (and variants) have bse IDs
	// weapons and accessories also have IDs
	// each listed flat and referenced in arrays
	// use getWeapon or getMod options
	// shipyards then contain lists of IDs for ships
	// custom NPCs get special ship entries
	// could eventually make a shipbuilder tool for this

	// fast laser
	/*
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
	*/

	// run main menu code here, allow selecting player data files

	getAjax('../data/playerData.json', function(data){ 
		// console.log(data); 
		let playerData = JSON.parse(data);
		game.data.playerConfig = playerData.player;
		game.dataLoaded.player = true;
	});

	getAjax('../data/systems.json', function(data){ 
		// console.log(data); 
		let systemData = JSON.parse(data);
		game.data.systems = systemData;
		game.dataLoaded.systems = true;
	});

	app.ticker.add(loading);
}

function startGame(playerConfig) {
	let player = new Player(playerConfig);
	game.player = player;

	game.systemContainer = new PIXI.Container();
	app.stage.addChild(game.systemContainer);

	// add map
	game.mapScreen = new Map();
	// new planet
	// todo config for each planet
	// services offered, faction, etc
	var initialSystem = game.data.systems[playerConfig.currentSystem];
	game.currentSystem = new PlanetarySystem(initialSystem);
	game.currentScreen = "system";

	// set up ticker
	app.ticker.add(update);
	// events for general game screen handling
	window.addEventListener("keydown", (event) => handleKeyDown(event));
	window.addEventListener("keyup", (event) => handleKeyUp(event));
}

function loading(deltaTime) {
	console.log("loading...");
	for (var key in game.dataLoaded) {
		if (game.dataLoaded[key] == false)
			return;
	}

	app.ticker.remove(loading);
	startGame(game.data.playerConfig);
}

function update(deltaTime) {
	if (game.currentScreen == "map") {
		// update?

		return;
	}
	// return;
	// current system keeps track of all entities, including player ship
	if (game.currentScreen == "system" && game.currentSystem) {
		game.currentSystem.update(deltaTime);
	}
}

function getAjax(url, success) {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('GET', url);
	xhr.onreadystatechange = function() {
		if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.send();
	return xhr;
}

function handleKeyDown(event) {
	// console.log(event);
	event.preventDefault();

	if (event.code === "KeyM") {
		game.mapScreen.toggleMap();
	}
}

function handleKeyUp(event) {
	// console.log(event);
	event.preventDefault();
}