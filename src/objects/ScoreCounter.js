/*
 * Wind sock
 * ====
 *
 */
export default class ScoreCounter {
	constructor(scoreInit, displayElem) {
		this.initialScore = scoreInit || null;
		this.displayElem = displayElem || null;
		this.currentScore = this.initialScore || 0;
		this.displayScore();
	}

	setScore(scoreIncoming) {
		this.currentScore = scoreIncoming;
		this.displayScore(scoreIncoming);
	}

	updateScore(scoreIncoming, shouldAdd) {
		if (shouldAdd) {
			this.currentScore = this.currentScore + scoreIncoming;
		} else {
			this.currentScore = this.currentScore - scoreIncoming;
		}
		// this.displayScore(this.currentScore);
		return this.currentScore;
	}

	displayScore(orExtra) {
		if (this.displayElem) {
			this.displayElem.setText(this.currentScore);
		}
		return this;
	}
	centerGameObjects(objects) {
		objects.forEach(function(object) {
			object.anchor.setTo(0.5);
		});
	}


}