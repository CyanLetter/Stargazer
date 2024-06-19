import { PlanetarySystem } from "./planetarySystem.js";

export { Map };

class Map {
	constructor() {
		this.container = new PIXI.Container();

		this.nextSystem = null;
		this.route = [];

		this.systems = [];
		this.systemIcons = [];

		this.scrollPosition = new PIXI.Point();

		this.init();
	}

	init() {
		// todo basic full screen UI container system
		var bg = new PIXI.Graphics();
		bg.beginFill(0x000000);
		bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
		this.container.addChild(bg);

		// todo scroll container
		for (var key in game.data.systems) {
			this.addSystem(game.data.systems[key]);
		}


		app.stage.addChild(this.container);
		this.container.visible = false;
	}

	addSystem(systemRef) {
		var system = PIXI.Sprite.from('./img/star.png');
		system.ref = systemRef;
		system.position = new PIXI.Point(systemRef.mapPos.x + (app.view.width / 2), systemRef.mapPos.y+ (app.view.height / 2));
		system.scale = new PIXI.Point(1, 1);
		system.anchor.set(0.5, 0.5);
		system.on('pointerdown', (event) => this.gotoSystem(systemRef));
		system.eventMode = 'static';


		this.systems.push(system);
		this.container.addChild(system);

		var style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 12,
			fill: '0xFFFFFF'
			// fontStyle: 'italic',
			// fontWeight: 'bold',
			// fill: { fill },
			// stroke: { color: '#4a1850', width: 5, join: 'round' },
			// dropShadow: {
			// 	color: '#000000',
			// 	blur: 4,
			// 	angle: Math.PI / 6,
			// 	distance: 6,
			// },
			// wordWrap: true,
			// wordWrapWidth: 440,
		});

		var sysText = new PIXI.Text(systemRef.name, style);
		sysText.x = system.position.x;
		sysText.y = system.position.y + 20;
		sysText.anchor.set(0.5, 0.5);
		this.container.addChild(sysText);
	}

	gotoSystem(targetSystem) {
		// testing only
		// also handle player entry into system and resetting
		// velocity, position, etc
		game.currentSystem.destroy();
		game.currentSystem = new PlanetarySystem(targetSystem);
	}

	setNextSystem() {

	}

	addToRoute() {

	}

	toggleMap() {
		var enabled = game.currentScreen == "map";
		game.currentScreen = enabled ? "system" : "map";
		this.container.visible = !enabled;
	}
}