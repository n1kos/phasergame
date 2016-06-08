/*
 * Wind sock
 * ====
 *
 */
export default class Outcomes extends Phaser.Sprite {
	constructor(game, x, y, INIT_FRAME, INIT_VALUE) {
		// debugger;
		super(game, x, y, 'toss-spr', INIT_FRAME);
		this.value = INIT_VALUE == undefined ? INIT_FRAME : INIT_VALUE;
		this.scale.setTo(0.5, 0.5);
		
		this.onScoreChange = new Phaser.Signal();
		this.onScoreChange.add(onDown, this);

		Outcomes.prototype.isSelected = function(){
			return this.myRect.visible;
		}

		Outcomes.staticCounter = Outcomes.staticCounter == undefined ? 0 : Outcomes.staticCounter;
	    Outcomes.count = function () {
	        return ++Outcomes.staticCounter;
	    };

		function makeRect(that) {
			var selectionPanel = game.add.graphics(that.x, that.y);
			selectionPanel.lineStyle(4, 0xEFF, 4);
			selectionPanel.drawRect(-5, -5, that.width + 10, that.height + 10);
			if (Outcomes.staticCounter != 1) {
				selectionPanel.alpha = 0;
			}
			return selectionPanel;
		}		

		function onDown() {
			// do something wonderful here
			console.log('got the event', this.x);
			this.myRect.alpha = !this.myRect.alpha;
			// var selectionPanel = game.add.graphics(this.x, this.y);
			// selectionPanel.lineStyle(4, 0xEFF, 4);
			// selectionPanel.drawRect(-5, -5, this.width + 10, this.height + 10);
		}

	    Outcomes.count();


		// Outcomes.prototype.initWind = function(){
		// 	function calculateWind() {
		// 		return game.rnd.integerInRange(0, 180);
		// 	}
		// 	this.angle = calculateWind();
		// 	this.windForce = (((-90 + this.angle) / 90) * -1) * 100 * (gameLevel + 1);
		// 	return this;		
		// };
		// this.initWind();

		this.myRect = makeRect(this);

		return this;
	}
	update() {
		//this.angle += 0.1;
	}
}
