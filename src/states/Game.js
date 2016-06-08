/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Logo from '../objects/Logo';
import WindSock from '../objects/WindSock';
import PowerBar from '../objects/PowerBar';
import Outcomes from '../objects/Outcomes';

var meter, platforms, panels, coinSprite, windSprite, cursors, currentBet, totalAmount, selectionPanel, BETAMOUNTINCREMENT;
var fireButton;

function isPlayable(that) {
	return that.gameCanPlay;
}

function resetGUi(that) {
	windSprite.initWind();
	that.gameCanPlay = true;
	coinSprite.frame = 0;
	coinSprite.x = that.COINSTARTINGPOSITION.x;//.centerX;//coinSprite.STARTINGX;
	coinSprite.y = that.COINSTARTINGPOSITION.y;//world.centerY) * 2 - 100;//coinSprite.STARTINGY;
	coinSprite.body.velocity.y = 0;
	coinSprite.body.velocity.x = 0;
}

function determineBetOutcome(that) {
	if (true) {
		return true;
	} else {
		return false;
	}
}

function payOuts(that) {
	that.gameCanPlay = true;
	if (determineBetOutcome(that)) {
		totalAmount = totalAmount + currentBet;
	} else {
		totalAmount = totalAmount - currentBet;
	}
	if (totalAmount == 0) {
		alert('GAME OVER');
	} else {
		that.moneyTotalAmountText.setText(totalAmount);
	}
	resetGUi(that);
}

export default class Game extends Phaser.State {

	create() {
		// TODO: Replace this with really cool game code here :)

		/*===================================
		=            SETUP WORLD            =
		===================================*/
		const { centerX: x, centerY: y } = this.world;
		// var onScoreChange = new Phaser.Signal();
		// onScoreChange.dispatch();
		// this.onLevelComplete.dispatch();

		//init game information
		// gameLevel = 0;
		BETAMOUNTINCREMENT = 25;
		currentBet = BETAMOUNTINCREMENT;
		totalAmount = 500;
		this.COINSTARTINGPOSITION = {
			x : x - 100,
			y : y * 2 - 100
		};

		this.gameCanPlay = true;
		this.gameLevel = 0;

		this.add.sprite(0, 0, 'sky');
		// this.add.existing(new Logo(this.game, x, y));
		windSprite = this.add.existing(new WindSock(this.game, ((x * 2) - 50), ((y * 2) - 66), this.gameLevel));

		// this.game.physics.startSystem(Phaser.Physics.P2);


		// this.load.spritesheet('toss', 'assets/toss-animation.png', 32, 48);

		//create the element on the canvas. it needs to be defined in the assets before using


		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		// var ground = platforms.create(0, this.game.world.height - 64, 'ground');


		//ledges for advanced levels
		//right ledge
		var ledge = platforms.create(600, 400, 'platform');
		ledge.body.immovable = true;
		//left ledge
		ledge = platforms.create(-150, 250, 'platform');
		ledge.body.immovable = true;
		/*=====  End of SETUP WORLD  ======*/

		/*========================================
		=            add GUI elements            =
		========================================*/

		/*----------  TEXT ELEMENTS  ----------*/

		//use an object for similar formatting though 
		//might become less complicated to straight up
		//use the properties if many combinations arise
		var interfaceTextProperties = {
			size: '32px',
			fill: '#000',
			align: 'left'
		};

		this.slicesText = this.add.text(
			16,
			16,
			'Slices',
			interfaceTextProperties
		);

		this.moneyTotalText = this.add.text(
			x * 2 - 80,
			16,
			'Total',
			interfaceTextProperties
		);

		this.moneyTotalAmountText = this.add.text(
			x * 2 - 76,
			46,
			totalAmount,
			interfaceTextProperties
		);

		this.currentBetText = this.add.text(
			x - 260,
			this.world.height - 32,
			'Bet',
			interfaceTextProperties
		);

		this.currentBetAmountText = this.add.text(
			x - 200,
			this.world.height - 32,
			currentBet,
			interfaceTextProperties
		);

		this.powerMeterText = this.add.text(
			26,
			this.world.height - 32,
			'Power',
			interfaceTextProperties
		);

		this.currentWindText = this.add.text(
			x * 2 - 80,
			this.world.height - 32,
			'Wind',
			interfaceTextProperties
		);

		this.panelText = this.add.text(
			x * 2 - 220,
			this.world.height - 32,
			'Outcome',
			interfaceTextProperties
		);

		/*----------  INTERFACE ELEMENTS  ----------*/

		meter = this.add.existing(new PowerBar(this.game, 0, 600));
		// meter = this.add.sprite(0, 600, 'platform');
		// meter.scale.setTo(0.4, 0.8);
		// meter.anchor.setTo(0, 0);
		// meter.angle = -90;


		panels = this.game.add.group();
		// panels.create((x) + 30, (y * 2) - 65, 'toss-spr');
		// panels.create((x) + 110, (y * 2) - 65, 'toss-spr');

		panels.add(new Outcomes(this.game, (x + 30), ((y * 2) - 65), 0));
		panels.add(new Outcomes(this.game, (x + 110), ((y * 2) - 65), 6));

		// panels.children[0].onScoreChange.dispatch();

/*		panels.children[0].frame = 0;
		panels.children[1].frame = 6;

		panels.forEach(function(item) {
			item.scale.setTo(0.5, 0.5);
		}, this);*/

		/*=====  End of add GUI elements  ======*/
		coinSprite = this.game.add.sprite(this.COINSTARTINGPOSITION.x, this.COINSTARTINGPOSITION.y, 'toss-spr');
		coinSprite.animations.add('toss-up', [0, 1, 2, 3, 4, 5, 6], true);
		coinSprite.animations.add('toss-up-full', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);



		this.game.physics.enable(coinSprite, Phaser.Physics.ARCADE);
		coinSprite.body.gravity.y = 300;

		var slices;
		slices = this.game.add.group();
		// slices.add('newSlice', this);
		// slices.events.onAddedToGroup.add(function() {
		// 	this.frame = 8;
		// 	this.scale.setTo(0.4, 0.1);
		// 	this.angle = 135;
		// }, this);
		// var sliceSprite, sliceSprite2;
		slices.create(46, 56, 'toss-spr');
		slices.create(66, 56, 'toss-spr');
		slices.create(86, 56, 'toss-spr');


		slices.forEach(function(item) {
			item.frame = 8;
			item.scale.setTo(0.4, 0.1);
			item.angle = 135;
		}, this);

		// wind as gravity
		// coinSprite.body.gravity.x = windForce;

		coinSprite.body.collideWorldBounds = true;
		coinSprite.body.bounce.setTo(0, 0.5);



		selectionPanel = this.game.add.graphics((x) + 110, (y * 2) - 65);
		selectionPanel.lineStyle(2, 0x0000FF, 4);
		selectionPanel.drawRect(0, 0, 68, 68);

		// sliceSprite.scale.setTo(0.4, 0.1);
		// sliceSprite.angle = 135;
		// sliceSprite2 = slices.create(66,56,'toss-spr');
		// sliceSprite2.frame = 8;
		// sliceSprite2.scale.setTo(0.4, 0.1);
		// sliceSprite2.angle = 135;


		// sliceSprite.animations.add('slice', [10], false);
		// sliceSprite.animations.play('slice');
		// coinSprite.body.allowGravity = true;
		// coinSprite.body.moves = true;
		// coinSprite.body.velocity.x= (-200*1.5);
		// coinSprite.animations.play('walk', 10, true);


		// The player and its settings
		// var player;
		// player = this.game.add.sprite(0, 0, 'toss-spr');

		//  We need to enable physics on the player
		// this.game.physics.arcade.enable(player);

		// //  Player physics properties. Give the little guy a slight bounce.
		// player.body.bounce.y = 0.2;
		// player.body.gravity.y = 300;
		// player.body.collideWorldBounds = true;

		// //  Our two animations, walking left and right.
		// player.animations.add('up', [0, 1, 2, 3], 2, true);
		// player.animations.add('down', [5, 6, 7, 8], 2, true);
		cursors = this.game.input.keyboard.createCursorKeys();

		fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		fireButton.onDown.add(launchCoin, this);

		function launchCoin() {
			// alert('once?');
			if (isPlayable(this)) {
				coinSprite.body.velocity.setTo(windSprite.windForce, meter.meterForce);
				coinSprite.animations.play('toss-up', (this.gameLevel * 2 + 10), true);
				this.gameCanPlay = false;
			}
			//launch goes here
			// Will only be called once per key press.
			// Will be passed the full Key object. See Phaser.Key for properties.
		}

	}

	// add(powerup) {
	// 	powerup.events.onAddedToGroup.addOnce(() => {
	// 		this.width += powerup.width;
	// 		powerup.y = 0;
	// 		powerup.x = this.width;
	// 	});
	// 	powerup.events.onRemovedFromGroup.addOnce(() => {
	// 		this.width -= powerup.width;
	// 	});
	// 	super.add(powerup);
	// }

	update() {
		if (!isPlayable(this)) {
			this.game.physics.arcade.collide(coinSprite, platforms);
			if ((Math.abs(coinSprite.body.velocity.y) <= 10) && (coinSprite.body.touching.down || coinSprite.body.blocked.down)) {
				// alert('shtopped');
				coinSprite.body.velocity.setTo(0, 0);
				coinSprite.animations.stop(null, false);
				this.gameCanPlay = false;
				payOuts(this);
				//this is where all the payouts take place
			}
		} else {
			if (cursors.left.isDown && panels.children[1].isSelected()) {
					panels.children[0].onScoreChange.dispatch();
					panels.children[1].onScoreChange.dispatch();
			} else if (cursors.right.isDown && panels.children[0].isSelected()) {
					panels.children[0].onScoreChange.dispatch();
					panels.children[1].onScoreChange.dispatch();
			} else if (cursors.up.isDown) {
				if (currentBet <= totalAmount - BETAMOUNTINCREMENT) {
					currentBet += BETAMOUNTINCREMENT;
					this.currentBetAmountText.setText(currentBet);
				}
			} else if (cursors.down.isDown) {
				if (currentBet - BETAMOUNTINCREMENT >= 0) {
					currentBet -= BETAMOUNTINCREMENT;
					this.currentBetAmountText.setText(currentBet);
				}
			}
		}


		//  Allow the player to jump if they are touching the ground.
		// if (cursors.up.isDown && player.body.touching.down) {
		// 	player.body.velocity.y = -350;
		// }
	}

	render() {
		this.game.debug.text('frame' + coinSprite.frame, 400, 400);
		this.game.debug.bodyInfo(coinSprite, 32, 64);
		// game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
		// game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
		// game.debug.text('angularDrag: ' + sprite.body.angularDrag, 32, 264);
		// game.debug.text('deltaZ: ' + sprite.body.deltaZ(), 32, 296);
	}
}
