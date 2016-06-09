/*
 * This implements the possible outcomes interface
 * Only the first created will be highlighted and 
 * each instance handles if it needs to be displayed
 * selected.
 * TODO:: expand so more outcomes can be added
 * ====
 *
 */
export default class Outcomes extends Phaser.Sprite {
	constructor(game, x, y, INIT_FRAME, INIT_VALUE) {
		//count the instances of outcomes
		Outcomes.staticCounter = Outcomes.staticCounter == undefined ? 0 : Outcomes.staticCounter;
		super(game, x, y, 'toss-spr', INIT_FRAME);
		//each outcome should have a value so it is possible to compare against result
		//since the sprite used will be the same and the outcome is determined by the frame
		//if no other value is passed, the frame will be used as the value
		this.value = INIT_VALUE == undefined ? INIT_FRAME : INIT_VALUE;
		this.scale.setTo(0.5, 0.5);
		this.onSelectionChange = new Phaser.Signal();

		Outcomes.prototype.isSelected = function() {
			return this.myRect.visible;
		};

		Outcomes.prototype.hasValueOf = function() {
			return this.value;
		};

		Outcomes.prototype.resetParentClass = function() {
			delete Outcomes.staticCounter
		}

		//highlight yourself
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

		Outcomes.count = function() {
			return ++Outcomes.staticCounter;
		};

		Outcomes.count();

		this.onSelectionChange.add(toggleIamSelected, this);
		this.myRect = makeRect(this);

		return this;
	}
	update() {
		//this.angle += 0.1;
	}
}
