/*
 * Boot state
 * ==========
 *
 * The first state of the game, responsible for setting up some Phaser
 * features. Adjust the game appearance, number of input pointers, screen
 * orientation handling etc. using this game state.
 */

import assets from '../assets';

var gameOverSound;
export default class GameOver extends Phaser.State {

	preload() {
		//this.load.pack('game', null, assets);
		gameOverSound = this.game.add.audio('gameover');
		//this works for loading. if not this, will it load???
		// this.load.spritesheet('uniqueKey', 'sprites/toss-animation.png', 165, 165, 18);
	}

	create() {
		// Here is a good place to initialize plugins that depend on any game
		// asset. Don't forget to `import` them first. Example:
		//this.add.plugin(MyPlugin/*, ... initialization parameters ... */);

		// this.state.start('Game');
		gameOverSound.play();
		 
		this.showFinalScreen();
		var fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		fireButton.onDown.add(startGame, this);

		function startGame() {
			this.state.start('Game');
		}
	}


	// --------------------------------------------------------------------------

	showFinalScreen() {
		var style = {
			font: '46px Courier',
			fill: '#fff'

		};
		var headings = ['G', 'A', 'M', 'E', ' ', 'O', 'V', 'E', 'R'];

		// this.add.sprite(0, 0, 'sky');
		var titleText = this.game.add.group();
		var text = this.game.add.text(150, 250, '', style);
		text.parseList(headings);

		// this.add.image(0, 0, 'splash-screen');
		// this.load.setPreloadSprite(this.add.image(82, 282, 'progress-bar'));
		// 
		var subheading = 'Press Space TO Begin';
		this.game.add.text(310, 350, subheading, { font: '16px Courier', fill: '#fff' });
	}

}
