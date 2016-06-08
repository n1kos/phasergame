/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import WindSock from '../objects/WindSock';
import PowerBar from '../objects/PowerBar';
import Outcomes from '../objects/Outcomes';

var meterSprite, platformsSpriteGroup, panelsSpriteGroup, slicesSpriteGroup, coinSprite, windSprite, cursors, currentBet, totalAmount, BETAMOUNTINCREMENT, EDGEPADDING, STARTINGTOTALAMOUNT, COINGRAVITY, fireButton;

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
	var theValue = panelsSpriteGroup.children[0].isSelected() ? panelsSpriteGroup.children[0].hasValueOf() : panelsSpriteGroup.children[1].hasValueOf();
	console.log('theValue of the toss is ', theValue);
	console.log('cirrent frame is (fuck, look at the screen) ', coinSprite.frame);
	if (Math.abs(theValue - coinSprite.frame) < 3) {
		return true;
	} else if (Math.abs(theValue - coinSprite.frame) == 3) {
		return undefined;
	} else {
		return false;
	}
}

function payOuts(that) {
	that.gameCanPlay = true;

	var determineOutcome = determineBetOutcome(that);

	console.log('ara to apotelesma eeeeinaiaiaiaiai', determineOutcome);
	if (determineOutcome != undefined) {
		if (determineOutcome) {
			totalAmount = totalAmount + currentBet;
		} else {
			totalAmount = totalAmount - currentBet;
		}
		if (totalAmount == 0) {
			// alert('GAME OVER');
			that.state.start('GameOver');
		} else {
			that.moneyTotalAmountText.setText(totalAmount);
		}
	}

	window.setTimeout(function() {
		resetGUi(that);
	}, 6);
}

function notifyAllSelectionOutcomes(groupParent) {
	groupParent.forEach(function(item) {
		item.onScoreChange.dispatch();
	}, this);
}

export default class Game extends Phaser.State {
	preload() {
	}

	create() {
		// TODO: Replace this with really cool game code here :)

		/*===================================
		=            SETUP WORLD            =
		===================================*/
		const { centerX: x, centerY: y } = this.world;
		//init game information
		//constants that cound in json file
		BETAMOUNTINCREMENT = 25;
		EDGEPADDING = 6;
		STARTINGTOTALAMOUNT = 500;
		COINGRAVITY = 300;

		//these do no need to be exposed properties
		currentBet = BETAMOUNTINCREMENT;
		totalAmount = STARTINGTOTALAMOUNT;
		this.COINSTARTINGPOSITION = {
			x: x - 80,
			y: y * 2 - 100
		};

		this.gameCanPlay = true;
		this.gameLevel = 0;
		/*=====  End of SETUP WORLD  ======*/

		/*========================================
		=            add GUI elements            =
		========================================*/
		this.add.sprite(0, 0, 'sky');
		
		windSprite = this.add.existing(new WindSock(this.game, ((x * 2) - 50), ((y * 2) - 66), this.gameLevel));
		
		platformsSpriteGroup = this.game.add.group();
		platformsSpriteGroup.enableBody = true;

		//ledges for advanced levels
		//right ledge
		var ledge = platformsSpriteGroup.create(600, 300, 'platform');
		ledge.body.immovable = true;
		//left ledge
		ledge = platformsSpriteGroup.create(-150, 250, 'platform');
		ledge.body.immovable = true;

		/*----------  TEXT ELEMENTS  ----------*/

		this.createTextElements.apply(this, [x, y]);

		/*----------  INTERFACE ELEMENTS  ----------*/

		meterSprite = this.add.existing(new PowerBar(this.game, EDGEPADDING, 560));

		panelsSpriteGroup = this.game.add.group();
		panelsSpriteGroup.add(new Outcomes(this.game, (x + 160), ((y * 2) - 105), 0));
		panelsSpriteGroup.add(new Outcomes(this.game, (x + 240), ((y * 2) - 105), 6));

		slicesSpriteGroup = this.game.add.group();
		slicesSpriteGroup.create(46, 56, 'toss-spr');
		slicesSpriteGroup.create(66, 56, 'toss-spr');
		slicesSpriteGroup.create(86, 56, 'toss-spr');


		slicesSpriteGroup.forEach(function(item) {
			item.frame = 8;
			item.scale.setTo(0.4, 0.1);
			item.angle = 135;
		}, this);
		/*=====  End of add GUI elements  ======*/

		/*=========================================
		=            BUSINESS ELEMENTS            =
		=========================================*/
		coinSprite = this.game.add.sprite(this.COINSTARTINGPOSITION.x, this.COINSTARTINGPOSITION.y, 'toss-spr');
		coinSprite.animations.add('toss-up', [0, 1, 2, 3, 4, 5, 6], true);
		coinSprite.animations.add('toss-up-full', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);
		this.game.physics.enable(coinSprite, Phaser.Physics.ARCADE);
		coinSprite.body.gravity.y = COINGRAVITY;
		coinSprite.body.collideWorldBounds = true;
		coinSprite.body.bounce.setTo(0, 0.5);
		/*=====  End of BUSINESS ELEMENTS  ======*/
		
		/*=====================================================
		=            BUSINESS ELEMENTS INTERACTION            =
		=====================================================*/
		cursors = this.game.input.keyboard.createCursorKeys();

		/**
		 * this is for the launch and in needs to run only once per press
		 */
		fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		fireButton.onDown.add(launchCoin, this);

		function launchCoin() {
			if (isPlayable(this)) {
				coinSprite.body.velocity.setTo(windSprite.windForce, meterSprite.meterForce);
				coinSprite.animations.play('toss-up', (this.gameLevel * 2 + 10), true);
				this.gameCanPlay = false;
			}
		}
		/*=====  End of BUSINESS ELEMENTS INTERACTION  ======*/
		
	}

	update() {
		if (!isPlayable(this)) {
			this.game.physics.arcade.collide(coinSprite, platformsSpriteGroup);
			/**
			*
			* when coin has landed and stopped moving
			*
			*/		
			if ((Math.abs(coinSprite.body.velocity.y) <= 10) && (coinSprite.body.touching.down || coinSprite.body.blocked.down)) {
				coinSprite.body.velocity.setTo(0, 0);
				coinSprite.animations.stop(null, false);
				this.gameCanPlay = false;
				//stop the events, go to payouts
				payOuts(this);
			}
		} else {
			/**
			*
			* select an outcome and change bet amount
			*
			*/		
			if (cursors.left.isDown && panelsSpriteGroup.children[1].isSelected()) {
				notifyAllSelectionOutcomes(panelsSpriteGroup);
			} else if (cursors.right.isDown && panelsSpriteGroup.children[0].isSelected()) {
				notifyAllSelectionOutcomes(panelsSpriteGroup);
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
		// this.game.debug.text('frame' + coinSprite.frame, 400, 400);
		// this.game.debug.bodyInfo(coinSprite, 32, 64);
		// game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
		// game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
		// game.debug.text('angularDrag: ' + sprite.body.angularDrag, 32, 264);
		// game.debug.text('deltaZ: ' + sprite.body.deltaZ(), 32, 296);
	}


	createTextElements(x, y) {
		//use an object for similar formatting though 
		//might become less complicated to straight up
		//use the properties if many combinations arise
		var interfaceTextProperties = {
			// size: '12px',
			fill: '#000',
			align: 'left',
			fontSize: 30
		};


		var amountsTextProperties = {
			fill: '#000',
			align: 'right',
			fontSize: 50
		}

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
			x * 2 - 96,
			46,
			totalAmount,
			amountsTextProperties
		);

		this.currentBetText = this.add.text(
			x - 260,
			this.world.height - 32,
			'Bet',
			interfaceTextProperties
		);

		this.currentBetAmountText = this.add.text(
			x - 270,
			this.world.height - 82,
			currentBet,
			amountsTextProperties
		);

		this.powerMeterText = this.add.text(
			EDGEPADDING,
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
			x * 2 - 230,
			this.world.height - 32,
			'Outcome',
			interfaceTextProperties
		);
		return this;
	}

}
