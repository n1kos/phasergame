/*
 * Wind sock
 * ====
 *
 */

var meterBouncingStatus;

export default class PowerBar extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, 'platform');		
		this.scale.setTo(0.4, 0.8);
		this.anchor.setTo(0, 0);
		this.angle = -90;

		PowerBar.prototype.operatePower = function(){
			if (game.state.callbackContext.gameCanPlay) {
				var powerAmount = this.scale.x,
					powerAmountIncrease;

				/* 8 is arbitrary, decreasing will increase the speed of the animation */				
				if (game.time.now % (8 - game.state.callbackContext.gameLevel) == 0) {

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

					this.scale.setTo(powerAmountIncrease, 0.8);
					this.meterForce = powerAmountIncrease * 6000;
				}

			}
			return this;		
		};
	}

	update() {
		this.operatePower();
	}

}
