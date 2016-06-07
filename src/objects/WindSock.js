/*
 * Wind sock
 * ====
 *
 */

export default class WindSock extends Phaser.Sprite {

	constructor(game, x, y) {
		super(game, x, y, 'wind-direction-tool');
		//		windSprite = this.add.sprite((this.world.centerX * 2) - 50, (this.world.centerY * 2 - 66), 'wind-sock');
		this.scale.setTo(0.2, 0.2);
		this.anchor.setTo(0.5, 0.5);
		//windSprite.angle = calculateWind(this);
		//windForce = (((-90 + windSprite.angle) / 90) * -1) * 100 * (gameLevel + 1);
	}

	update() {
		//this.angle += 0.1;
	}

}
