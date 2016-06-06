/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Logo from '../objects/Logo';

var meter, gameLevel, platforms, coinSprite; //, meterBouncingStatus;
// meterBouncingStatus, gameLevel;
// gameLevel = meterBouncingStatus = 0;

// var fireBullet = function() {
// 	// alert('fired!');
// 	return true;
// };

export default class Game extends Phaser.State {
	create() {
		// TODO: Replace this with really cool game code here :)

		/*===================================
		=            SETUP WORLD            =
		===================================*/
		const { centerX: x, centerY: y } = this.world;

		//init game information
		gameLevel = 0;

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
		this.slicesText = this.add.text(
			16,
			16,
			'Slices',
			{
				size: '32px',
				fill: '#FFF',
				align: 'center'
			}
		);

		this.moneyTotalText = this.add.text(
			this.world.centerX * 2 - 80,
			16,
			'Total',
			{
				size: '32px',
				fill: '#FFF',
				align: 'left'
			}
		);

		this.currentBetText = this.add.text(
			this.world.centerX - 20,
			this.world.height - 32,
			'Bet',
			{
				size: '32px',
				fill: '#FFF',
				align: 'center'
			}
		);

		this.powerMeterText = this.add.text(
			16,
			this.world.height - 32,
			'Power',
			{
				size: '32px',
				fill: '#FFF',
				align: 'left'
			}
		);

		this.currentWindText = this.add.text(
			this.world.centerX *2 - 80,
			this.world.height - 32,
			'Wind',
			{
				size: '32px',
				fill: '#FFF',
				align: 'center'
			}
		);		

		/*----------  INTERFACE ELEMENTS  ----------*/
		meter = this.add.sprite(0, 600, 'platform');
		meter.scale.setTo(0.4, 0.8);
		meter.anchor.setTo(0, 0);
		meter.angle = -90;


		/*=====  End of add GUI elements  ======*/
		coinSprite = this.game.add.sprite(300, 200, 'toss-spr');
		coinSprite.animations.add('toss-up', [0, 1, 2, 3, 4, 5, 6], true);
		coinSprite.animations.add('toss-up-full', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);
		coinSprite.animations.play('toss-up', (gameLevel * 2 + 10), true);


		this.game.physics.enable(coinSprite, Phaser.Physics.ARCADE);
		coinSprite.body.gravity.y = 300;


		var sliceSprite;
		sliceSprite = this.game.add.sprite(46,56,'toss-spr');
		sliceSprite.frame = 8;
		sliceSprite.scale.setTo(0.4, 0.1);
		sliceSprite.angle = 135;
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


	}

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
	}

	render() {
		this.game.debug;
		// game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
		// game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
		// game.debug.text('angularDrag: ' + sprite.body.angularDrag, 32, 264);
		// game.debug.text('deltaZ: ' + sprite.body.deltaZ(), 32, 296);
	}
}
