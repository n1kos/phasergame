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

var meter, platforms, panels, coinSprite, windSprite, cursors, currentBet, totalAmount, BETAMOUNTINCREMENT;
var fireButton;

function isPlayable(that) {
	return that.gameCanPlay;
}

function resetGUi(that) {
	windSprite.initWind();
	that.gameCanPlay = true;
	coinSprite.frame = 0;
	coinSprite.x = that.COINSTARTINGPOSITION.x;
	coinSprite.y = that.COINSTARTINGPOSITION.y;
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

function notifyAllSelectionOutcomes(groupParent) {
	groupParent.forEach(function(item) {
		item.onScoreChange.dispatch();
	}, this);
}

export default class Game extends Phaser.State {

	create() {
		// TODO: Replace this with really cool game code here :)

		/*===================================
		=            SETUP WORLD            =
		===================================*/
		const { centerX: x, centerY: y } = this.world;
		//init game information
		// gameLevel = 0;
		BETAMOUNTINCREMENT = 25;
		currentBet = BETAMOUNTINCREMENT;
		totalAmount = 500;
		this.COINSTARTINGPOSITION = {
			x: x - 100,
			y: y * 2 - 100
		};

		this.gameCanPlay = true;
		this.gameLevel = 0;

		this.add.sprite(0, 0, 'sky');
		// this.add.existing(new Logo(this.game, x, y));
		windSprite = this.add.existing(new WindSock(this.game, ((x * 2) - 50), ((y * 2) - 66), this.gameLevel));

		//create the element on the canvas. it needs to be defined in the assets before using
		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

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

		panels = this.game.add.group();

		panels.add(new Outcomes(this.game, (x + 30), ((y * 2) - 65), 0));
		panels.add(new Outcomes(this.game, (x + 110), ((y * 2) - 65), 6));


		/*=====  End of add GUI elements  ======*/
		coinSprite = this.game.add.sprite(this.COINSTARTINGPOSITION.x, this.COINSTARTINGPOSITION.y, 'toss-spr');
		coinSprite.animations.add('toss-up', [0, 1, 2, 3, 4, 5, 6], true);
		coinSprite.animations.add('toss-up-full', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);



		this.game.physics.enable(coinSprite, Phaser.Physics.ARCADE);
		coinSprite.body.gravity.y = 300;

		var slices;
		slices = this.game.add.group();

		slices.create(46, 56, 'toss-spr');
		slices.create(66, 56, 'toss-spr');
		slices.create(86, 56, 'toss-spr');


		slices.forEach(function(item) {
			item.frame = 8;
			item.scale.setTo(0.4, 0.1);
			item.angle = 135;
		}, this);

		coinSprite.body.collideWorldBounds = true;
		coinSprite.body.bounce.setTo(0, 0.5);

		cursors = this.game.input.keyboard.createCursorKeys();

		/**
		 * this is for the launch and in needs to run only once per press
		 */
		fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		fireButton.onDown.add(launchCoin, this);

		function launchCoin() {
			if (isPlayable(this)) {
				coinSprite.body.velocity.setTo(windSprite.windForce, meter.meterForce);
				coinSprite.animations.play('toss-up', (this.gameLevel * 2 + 10), true);
				this.gameCanPlay = false;
			}
		}
	}

	update() {
		if (!isPlayable(this)) {
			this.game.physics.arcade.collide(coinSprite, platforms);
			if ((Math.abs(coinSprite.body.velocity.y) <= 10) && (coinSprite.body.touching.down || coinSprite.body.blocked.down)) {
				coinSprite.body.velocity.setTo(0, 0);
				coinSprite.animations.stop(null, false);
				this.gameCanPlay = false;
				payOuts(this);
				//this is where all the payouts take place
			}
		} else {
			if (cursors.left.isDown && panels.children[1].isSelected()) {
				notifyAllSelectionOutcomes(panels);
			} else if (cursors.right.isDown && panels.children[0].isSelected()) {
				notifyAllSelectionOutcomes(panels);
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
