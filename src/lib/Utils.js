/*
 * Wind sock
 * ====
 *
 */
export default class Utils {
	constructor() {
		this.dd = '';
	}

	centerGameObjects(objects) {
		objects.forEach(function(object) {
			object.anchor.setTo(0.5);
		})
	}

	animateOutcome(game, that, textOutputResult) {
		var textOutput;
		switch (textOutputResult) {
			case undefined:
				textOutput = 'Toss Again!!'
				break;
			case true:
				textOutput = 'YES!!';
				break;
			case false:
				textOutput = 'LOOOOOOSEEEERRRR';
				break;
		}

		var flashText = game.add.text(-100,
			16,
			textOutput, 
			{
				size: '22px',
				fill: '#000',
				align: 'middle',
				fontSize: 30
			}
		);
		flashText.x = game.world.centerX - flashText.width / 2;
		var tween = game.add.tween(flashText).to({ y: game.world.centerY }, 4000, Phaser.Easing.Bounce.Out, true);
		tween.onComplete.addOnce(commitSuicide, this);

		function commitSuicide() {
			flashText.kill();
		}
	}

};
