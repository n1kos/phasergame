/*
 * Wind sock
 * ====
 *
 */

function calculateWind(game) {
	//return game.rnd.angle();
	return game.rnd.integerInRange(0, 180);
}

export default class WindSock extends Phaser.Sprite {
	constructor(game, x, y, gameLevel) {
		super(game, x, y, 'wind-sock');
		//		windSprite = this.add.sprite((this.world.centerX * 2) - 50, (this.world.centerY * 2 - 66), 'wind-sock');
		this.scale.setTo(0.2, 0.2);
		this.anchor.setTo(0.5, 0.5);
		this.angle = calculateWind(game);
		this.windForce = (((-90 + this.angle) / 90) * -1) * 100 * (gameLevel + 1);
	}
	update() {
		//this.angle += 0.1;
	}

}
