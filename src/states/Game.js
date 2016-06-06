/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Logo from '../objects/Logo';

var meter, gameLevel, platforms, coinSprite, windSprite, windForce, cursors, currentBet, totalAmount; //, meterBouncingStatus;
// meterBouncingStatus, gameLevel;
// gameLevel = meterBouncingStatus = 0;
var fireButton;
// var fireBullet = function() {
// 	// alert('fired!');
// 	return true;
// };

// function newSlice(){
// 	alert(this);
// 	return this;
// }
function calculateWind(game) {
	//return game.rnd.angle();
	return game.rnd.integerInRange(0, 180);
}

export default class Game extends Phaser.State {

	create() {
		// TODO: Replace this with really cool game code here :)

		/*===================================
		=            SETUP WORLD            =
		===================================*/
		const { centerX: x, centerY: y } = this.world;

		//init game information
		gameLevel = 0;
		currentBet = 25;
		totalAmount = 500;

		this.add.existing(new Logo(this.game, x, y));

		// this.game.physics.startSystem(Phaser.Physics.P2);


		// this.load.spritesheet('toss', 'assets/toss-animation.png', 32, 48);

		//create the element on the canvas. it needs to be defined in the assets before using
		this.add.sprite(0, 0, 'sky');


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
			this.world.centerX * 2 - 80,
			16,
			'Total',
			interfaceTextProperties
		);

		this.moneyTotalAmountText = this.add.text(
			this.world.centerX * 2 - 76,
			46,
			totalAmount,
			interfaceTextProperties
		);

		this.currentBetText = this.add.text(
			this.world.centerX - 100,
			this.world.height - 32,
			'Bet',
			interfaceTextProperties
		);

		this.currentBetAmountText = this.add.text(
			this.world.centerX - 40,
			this.world.height - 32,
			currentBet,
			interfaceTextProperties
		);

		this.powerMeterText = this.add.text(
			16,
			this.world.height - 32,
			'Power',
			interfaceTextProperties
		);

		this.currentWindText = this.add.text(
			this.world.centerX * 2 - 80,
			this.world.height - 32,
			'Wind',
			interfaceTextProperties
		);

		/*----------  INTERFACE ELEMENTS  ----------*/
		meter = this.add.sprite(0, 600, 'platform');
		meter.scale.setTo(0.4, 0.8);
		meter.anchor.setTo(0, 0);
		meter.angle = -90;


		/*=====  End of add GUI elements  ======*/
		coinSprite = this.game.add.sprite(this.world.centerX, (this.world.centerY * 2 - 100), 'toss-spr');
		coinSprite.animations.add('toss-up', [0, 1, 2, 3, 4, 5, 6], true);
		coinSprite.animations.add('toss-up-full', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);
		coinSprite.animations.play('toss-up', (gameLevel * 2 + 10), true);


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

		windSprite = this.add.sprite((this.world.centerX * 2) - 50, (this.world.centerY * 2 - 66), 'wind-sock');
		windSprite.scale.setTo(0.2, 0.2);
		windSprite.anchor.setTo(0.5, 0.5);
		windSprite.angle = calculateWind(this);
		windForce = (((-90 + windSprite.angle) / 90) * -1) * 100 * (gameLevel + 1);
		///alert(windForce);

		// wind as gravity
		// coinSprite.body.gravity.x = windForce;


		coinSprite.body.collideWorldBounds = true;
		coinSprite.body.bounce.setTo(0, 0.5);
		coinSprite.body.velocity.setTo(windForce, 1200);

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
		fireButton.onDown.add(shootBullet, this);

		function shootBullet() {
			alert('once?');
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
		/////////////////////////this chunk is for the power indicator = enable later
		/*				var powerAmount = meter.scale.x,
							powerAmountIncrease;

						if (this.game.time.now % (8 - gameLevel) == 0) {

							meterBouncingStatus = meterBouncingStatus == undefined ? 0 : meterBouncingStatus;

							if (meterBouncingStatus == 'reachedEnd') {
								powerAmountIncrease = powerAmount - 0.1;
							} else {
								powerAmountIncrease = powerAmount + 0.1;
							}

							if (powerAmountIncrease >= 0.7 && meterBouncingStatus != 'reachedEnd') {
								meterBouncingStatus = 'reachedEnd';
							} else if (powerAmountIncrease <= 0.1 && meterBouncingStatus == 'reachedEnd') {
								meterBouncingStatus = 'normal';
							}

							meter.scale.setTo(powerAmountIncrease, 0.8);

							if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
								fireBullet();
							}
						}*/
		// console.log(this.game.time.now % 8);
		/////////////////////////this chunk is for the power indicator = enable later// 
		this.game.physics.arcade.collide(coinSprite, platforms);
		if ((Math.abs(coinSprite.body.velocity.y) <= 10) && (coinSprite.body.touching.down || coinSprite.body.blocked.down)) {
			// alert('shtopped');
			coinSprite.body.velocity.setTo(0, 0);
			coinSprite.animations.stop(null, false);
		}
		if (cursors.left.isDown) {
			//  Move to the left
			// player.body.velocity.x = -150;

			// player.animations.play('left');
		} else if (cursors.right.isDown) {
			//  Move to the right
			// player.body.velocity.x = 150;

			// player.animations.play('right');
		} else if (cursors.up.isDown) {
			currentBet += 25;
			this.currentBetAmountText.setText(currentBet);
			//  Stand still
			// player.animations.stop();

			// player.frame = 4;
		} else if (cursors.down.isDown) {
			currentBet -= 25;
			this.currentBetAmountText.setText(currentBet);
			//
		}

		//  Allow the player to jump if they are touching the ground.
		// if (cursors.up.isDown && player.body.touching.down) {
		// 	player.body.velocity.y = -350;
		// }
	}

	render() {
		this.game.debug.text('frame' + coinSprite.frame);
		this.game.debug.bodyInfo(coinSprite, 32, 64);
		// game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
		// game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
		// game.debug.text('angularDrag: ' + sprite.body.angularDrag, 32, 264);
		// game.debug.text('deltaZ: ' + sprite.body.deltaZ(), 32, 296);
	}
}
