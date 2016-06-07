/*
 * Wind sock
 * ====
 *
 */
export default class WindSock extends Phaser.Sprite {
	constructor(game, x, y, gameLevel) {
		super(game, x, y, 'wind-sock');
		this.scale.setTo(0.2, 0.2);
		this.anchor.setTo(0.5, 0.5);

		WindSock.prototype.initWind = function(){
			function calculateWind() {
				return game.rnd.integerInRange(0, 180);
			}
			this.angle = calculateWind();
			this.windForce = (((-90 + this.angle) / 90) * -1) * 100 * (gameLevel + 1);
			return this;		
		};
		this.initWind();
	}
	update() {
		//this.angle += 0.1;
	}

}
