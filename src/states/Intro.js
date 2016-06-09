/*
 * Intro state
 * ==========
 *
 * Simple intro, can make it more elaborate
 */

import assets from '../assets';

export default class Intro extends Phaser.State {

	preload() {
		//this.load.pack('game', null, assets);

		//this works for loading. if not this, will it load???
		// this.load.spritesheet('uniqueKey', 'sprites/toss-animation.png', 165, 165, 18);
	}

	create() {
		// Here is a good place to initialize plugins that depend on any game
		// asset. Don't forget to `import` them first. Example:
		//this.add.plugin(MyPlugin/*, ... initialization parameters ... */);

		// this.state.start('Game');
		this.showIntroScreen();
		var fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		fireButton.onDown.add(startGame, this);

		function startGame() {
			this.state.start('Game');
		}

	}


	// --------------------------------------------------------------------------

	showIntroScreen() {
		var style = {
			font: '46px Courier',
			fill: '#fff'

		};
		var headings = ['C', 'O', 'I', 'N', ' ', 'T', 'O', 'S', 'S'];

		// this.add.sprite(0, 0, 'sky');
		var Introtext = this.game.add.text(150, 250, '', style);
		Introtext.parseList(headings);

		var theA = this.game.add.text(530, 230, 'A', { font: '84px Courier', fill: '#fff'});
		theA.alpha = 0;
		var theB = this.game.add.text(620, 230, 'T', { font: '84px Courier', fill: '#fff'});
		theB.alpha = 0;
		// this.add.image(0, 0, 'splash-screen');
		// this.load.setPreloadSprite(this.add.image(82, 282, 'progress-bar'));
		// 
		var subheading = 'Press Space To Begin';
		this.game.add.text(310, 350, subheading, { font: '16px Courier', fill: '#fff' });

		this.game.time.events.add(Phaser.Timer.SECOND * 2, makeStuff, this);

		function makeStuff() {
			this.game.add.tween(theA).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			this.game.add.tween(theB).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
		}
	}

}
