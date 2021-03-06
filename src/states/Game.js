/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import WindSock from '../objects/WindSock';
import PowerBar from '../objects/PowerBar';
import Outcomes from '../objects/Outcomes';
import Utils from '../lib/Utils';
import ScoreCounter from '../objects/ScoreCounter';

var meterSprite, platformsSpriteGroup, panelsSpriteGroup, slicesSpriteGroup, coinSprite, windSprite, cursors, currentBet, totalAmount, BETAMOUNTINCREMENT, EDGEPADDING, STARTINGTOTALAMOUNT, COINGRAVITY, GAMELEVELTHRESHOLD, fireButton, currentLevelTarget, bounceSound, winSound, loseSound, tossSound;

var utils = new Utils();
// var scoreCounter = new ScoreCounter(1000);
// console.info(scoreCounter.totalScore);

/**
 * return the state of game's playability
 */
function isPlayable(that) {
	return that.gameCanPlay;
}

function setCurrentLevelTarget(that) {
	return (that.gameLevel + 1) * 1000;
}

function addOneSlice() {
	var temp;
	slicesSpriteGroup.forEach(function(item) {
		if (!item.visible && !temp) {
			temp = item;
			item.visible = true;
		}
	});
}

/**
 * reset GUI elements, such as coin position etc
 */
function resetGUI(that) {
	try {
		windSprite.initWind();
		// that.gameCanPlay = true;
		coinSprite.frame = 0;
		meterSprite.IAmAlive = true;
		coinSprite.x = that.COINSTARTINGPOSITION.x;
		coinSprite.y = that.COINSTARTINGPOSITION.y;
		coinSprite.body.velocity.y = 0;
		coinSprite.body.velocity.x = 0;
		if (currentBet.currentScore > totalAmount.currentScore) {
			currentBet.setScore(totalAmount.currentScore);
		}
	} catch (err) {
		console.error(err);
		//state is destroyed
	}
}

/**
 * freeze GUI elements when coin is tossed
 */
function pauseInterractions(that) {
	meterSprite.IAmAlive = false;
	coinSprite.body.velocity.setTo(0, 0);
	coinSprite.animations.stop(null, false);
	that.gameCanPlay = false;
}

/**
 * calculate if the bet was won
 */
function determineBetOutcome() {
	var theValue = panelsSpriteGroup.children[0].isSelected() ? panelsSpriteGroup.children[0].hasValueOf() : panelsSpriteGroup.children[1].hasValueOf(),
		levelMultp = 1;
	var cachecoinSpriteFrame = coinSprite.frame;

	// if (that.gameLevel >= GAMELEVELTHRESHOLD) {
	// 	levelMultp = 2;
	// }
	//first see ti ginetai me ta tost. typou an exei er8ei tost, xeirisou ta tost...
	//opote de 8elw na dw ayta, 8elw na dw ti value exei to value....
	//an to value einai mesa sto euros tou outcoume tote mpla mpla
	//alla kai to tost exei eyros... isws na einai udefined, ti skata kanei o kwdikas ekei...
	//einai undefined, opote kati allo? bebaia isxyei (peripou h deyterh sun8hkh... pali mporei na einai mesa sto ayto, isws X 2)
	//
	//
	//prwta koitas an hr8e feta:
	if (cachecoinSpriteFrame >= 7 && cachecoinSpriteFrame <= 9) {
		//you won a slice, paei kai teleiwse - no money exchange
		console.info('add slice bonus');
		//this is repeated actually, so it should be function
		addOneSlice();
		return undefined;
	} else if (cachecoinSpriteFrame >= 10 && cachecoinSpriteFrame <= 14) {
		console.info('lose a slice or lose game, whatevs');
		var temp;
		slicesSpriteGroup.forEach(function(item) {
			if (item.visible) {
				temp = item;
			}
		}, this);
		try {
			temp.visible = false;
		} catch (err) {
			console.info('no toast, lose game??');
		}
		return undefined;
	} else if (Math.abs(theValue - cachecoinSpriteFrame) < (3 * levelMultp)) {
		//just calculate normally - but then this breaks the control
		return true;
	} else if (Math.abs(theValue - cachecoinSpriteFrame) == (3 * levelMultp)) {
		return undefined;
	} else {
		return false;
	}
}

/**
 * advance in levels
 */
function calculateBonusProgression(that) {
	if (totalAmount.currentScore >= currentLevelTarget) {
		//add a slice and check if there are three
		console.info('add a slice');
		addOneSlice();
		if (totalAmount.currentScore >= (currentLevelTarget * 3)) {
			console.info('increse level!');
			//level progression - increase level, hide all slices
			//perhaps show a toast or something
			that.gameLevel++;
			//hide all slides, ok one abstraction to take care of all slice management
			currentLevelTarget = setCurrentLevelTarget(that);
			slicesSpriteGroup.forEach(function(item) {
				item.visible = false;
			}, this);
		}
	}
	console.info('current single level increase', currentLevelTarget);
	console.info('current level', that.gameLevel + 1);
	console.info('current slice target', currentLevelTarget * 3);
}

// function assertPayouts(that) {
// 	that.gameCanPlay = true;

// 	var determineOutcome = true;

// 	if (determineOutcome != undefined) {
// 		if (determineOutcome) {
// 			totalAmount.currentScore = totalAmount.currentScore + currentBet.currentScore;
// 		} else {
// 			totalAmount.currentScore = totalAmount.currentScore - currentBet.currentScore;
// 		}
// 		if (totalAmount.currentScore == 0) {
// 			// console.info('GAME OVER');
// 			that.state.start('GameOver');
// 		} else {
// 			totalAmount.displayScore();
// 			calculateBonusProgression(that);
// 		}
// 	}

// 	window.setTimeout(function() {
// 		resetGUI(that);
// 	}, 6);
// }

function playAudio(result) {
	bounceSound.stop();
	if (result != undefined) {
		if (result) {
			winSound.play();
		} else {
			loseSound.play();
		}
	}
}

/**
 * whan the coin lands, take approprate action
 */
function payOuts(that) {
	that.gameCanPlay = true;

	var determineOutcome = determineBetOutcome();

	if (determineOutcome != undefined) {
		//if there is score (no middle or other special cases, update the score)
		totalAmount.updateScore(currentBet.currentScore, determineOutcome);

		//tha game is over
		if (totalAmount.currentScore == 0) {
			panelsSpriteGroup.children[0].resetParentClass();
			that.state.start('GameOver');
			return false;
		} else {
			totalAmount.displayScore();
			playAudio(determineOutcome);
			//progression only on positive outcome
			//level advancement is related to score only
			//and not slices anyway
			if (determineOutcome) {
				calculateBonusProgression(that);
			}
		}
	}

	utils.animateOutcome(that.game, utils, determineOutcome);
	window.setTimeout(function() {
		resetGUI(that);
	}, 4250);
}

function notifyAllSelectionOutcomes(groupParent) {
	groupParent.forEach(function(item) {
		item.onSelectionChange.dispatch();
	}, this);
}

export default class Game extends Phaser.State {
	preload() {
		bounceSound = this.game.add.audio('bounce');
		winSound = this.game.add.audio('win');
		loseSound = this.game.add.audio('lose');
		tossSound = this.game.add.audio('toss');
		//		
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
		GAMELEVELTHRESHOLD = 2;

		this.COINSTARTINGPOSITION = {
			x: x - 80,
			y: y * 2 - 100
		};

		this.gameCanPlay = true;
		this.gameLevel = 0;

		currentLevelTarget = setCurrentLevelTarget(this);
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
		var ledge = platformsSpriteGroup.create(550, 340, 'platform');
		ledge.body.immovable = true;
		//left ledge
		ledge = platformsSpriteGroup.create(-150, 220, 'platform');
		ledge.body.immovable = true;

		/*----------  TEXT ELEMENTS  ----------*/

		this.createTextElements.apply(this, [x, y]);


		currentBet = new ScoreCounter(BETAMOUNTINCREMENT, this.currentBetAmountText);
		totalAmount = new ScoreCounter(STARTINGTOTALAMOUNT, this.moneyTotalAmountText);

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
			item.visible = false;
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
				tossSound.play();
				coinSprite.body.velocity.setTo(windSprite.windForce, meterSprite.meterForce);
				//if level up, show toast (cannot be in outcome)
				if (this.gameLevel < GAMELEVELTHRESHOLD) {
					coinSprite.animations.play('toss-up', (this.gameLevel * 2 + 10), true);
				} else {
					coinSprite.animations.play('toss-up-full', (this.gameLevel * 2 + 10), true);
				}
				this.gameCanPlay = false;
			}
		}
		/*=====  End of BUSINESS ELEMENTS INTERACTION  ======*/

	}

	update() {
		// platformsSpriteGroup.x += 1;

		if (!isPlayable(this)) {
			this.game.physics.arcade.collide(coinSprite, platformsSpriteGroup);
			if ((coinSprite.body.blocked.up || coinSprite.body.blocked.down || coinSprite.body.blocked.left || coinSprite.body.blocked.right || coinSprite.body.touching.down || coinSprite.body.touching.left || coinSprite.body.touching.right) && !tossSound.isPlaying) {
				console.info('play sound <.:| ');
				if (bounceSound.isPlaying) bounceSound.stop();
				bounceSound.play();
			}

			/**
			 *
			 * when coin has landed and stopped moving
			 *
			 */
			if ((Math.abs(coinSprite.body.velocity.y) <= 10) && (coinSprite.body.touching.down || coinSprite.body.blocked.down)) {
				//stop the events, go to payouts
				pauseInterractions(this);
				payOuts(this);
				//assertPayouts(this);
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
				if (currentBet.currentScore <= totalAmount.currentScore - BETAMOUNTINCREMENT) {
					currentBet.currentScore += BETAMOUNTINCREMENT;
					currentBet.displayScore();
				}
			} else if (cursors.down.isDown) {
				if (currentBet.currentScore > BETAMOUNTINCREMENT) {
					currentBet.currentScore -= BETAMOUNTINCREMENT;
					currentBet.displayScore();
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


	createTextElements(x) {
		//use an object for similar formatting though 
		//might become less complicated to straight up
		//use the properties if many combinations arise
		var interfaceTextProperties = {
			// size: '12px',
			fill: '#000',
			align: 'left',
			fontSize: 30,
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		};


		var amountsTextProperties = {
			fill: '#000',
			align: 'right',
			fontSize: 50,
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		};

		this.slicesText = this.add.text(
			16,
			16,
			'Slices',
			interfaceTextProperties
		);

		this.moneyTotalText = this.add.text(
			x * 2 - 140,
			16,
			'Total',
			interfaceTextProperties
		);

		this.moneyTotalAmountText = this.add.text(
			x * 2 - 146,
			46,
			'',
			// totalAmount,
			amountsTextProperties
		);

		this.currentBetText = this.add.text(
			x - 270,
			this.world.height - 32,
			'Bet',
			interfaceTextProperties
		);

		this.currentBetAmountText = this.add.text(
			x - 270,
			this.world.height - 82,
			'',
			// currentBet,
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
