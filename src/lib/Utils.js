/*
 * Wind sock
 * ====
 *
 */
export default class Utils {
	constructor () {
		this.dd = 'd';
	}

	centerGameObjects(objects) {
		objects.forEach(function(object) {
			object.anchor.setTo(0.5);
		})
	}

	doO(game, that, textOutput) {
		console.log('kdjkdjdf');
	}
};
