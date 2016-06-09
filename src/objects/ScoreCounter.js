/*
 * This is responsible for calculating and displaying any score
 * Needs to be attached to a text element to display it.
 * ====
 *
 */
export default class ScoreCounter {
	constructor(scoreInit, displayElem) {
		this.initialScore = scoreInit || null;
		this.displayElem = displayElem || null;
		this.currentScore = this.initialScore || 0;
		this.displayScore();
		return this;
	}

	setScore(scoreIncoming) {
		this.currentScore = scoreIncoming;
		this.displayScore(scoreIncoming);
		return this;
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
}