/*
 * Wind sock
 * ====
 *
 */
export default class Outcomes extends Phaser.Sprite {
	constructor(game, x, y, INIT_FRAME, INIT_VALUE) {
		Outcomes.staticCounter = Outcomes.staticCounter == undefined ? 0 : Outcomes.staticCounter;
		super(game, x, y, 'toss-spr', INIT_FRAME);
		this.value = INIT_VALUE == undefined ? INIT_FRAME : INIT_VALUE;
		this.scale.setTo(0.5, 0.5);		
		this.onScoreChange = new Phaser.Signal();

		Outcomes.prototype.isSelected = function(){
			return this.myRect.visible;
		}

		function makeRect(that) {
			var selectionPanel = game.add.graphics(that.x, that.y);
			selectionPanel.lineStyle(4, 0xEFF, 4);
			selectionPanel.drawRect(-5, -5, that.width + 10, that.height + 10);
			if (Outcomes.staticCounter != 1) {
				selectionPanel.visible = false;
			}
			return selectionPanel;
		}		

		function toggleIamSelected() {
			this.myRect.visible = !this.myRect.visible;
		}

	    Outcomes.count = function () {
	        return ++Outcomes.staticCounter;
	    };
	    
	    Outcomes.count();
		
		this.onScoreChange.add(toggleIamSelected, this);
		this.myRect = makeRect(this);

		return this;
	}
	update() {
		//this.angle += 0.1;
	}
}
