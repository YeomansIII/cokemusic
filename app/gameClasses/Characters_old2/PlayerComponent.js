/**
 * Adds mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerComponent = IgeClass.extend({
	classId: 'PlayerComponent',
	componentId: 'player',
	targetPos: { x: null, y: null },
	init: function (entity, options) {
		var self = this;

		window.player = this;

		// Store the entity that this component has been added to
		this._entity = entity;

		// Store any options that were passed to us
		this._options = options;

		// Listen for the mouse up event
		ige.input.on('mouseDown', function () { self._mouseDown(); });

		//Listen for key event
		ige.input.on('keyUp', function (event, keyCode) { self._keyUp(event, keyCode); });

		// Listen for point reach input
		entity.path.on('pointComplete', function () { self._pointReached(); });
		entity.path.on('pathComplete', function () { self._pathComplete(); });
		entity.path.on('started', function () { self._pathStarted(); });
		entity.path.on('dynamicFail', function() { self._pathHalt(); });
	},

	/**
	 * Handles what we do when a mouseUp event is fired from the engine.
	 * @param event
	 * @private
	 */
	_mouseDown: function () {
		if(ige.movingItem == true)
			return false;

		// Get the tile co-ordinates that the mouse is currently over
		var endTile = ige.room.tileMap().mouseToTile(),
			overTiles;

		// Check the bounds
		//TODO: this needs to be alot more complex
		 if(endTile.x < 0 || endTile.x >= ige.room.width() || endTile.y < 0 || endTile.y >= ige.room.height()) {
		 	return false;
		 	console.log('here');
		 }

		overTiles = this._entity.overTiles()[0];

		// If we're already headed here we don't want to try again
		if (this.targetPos.x == endTile.x && this.targetPos.y == endTile.y) return;

		this.targetPos.x = endTile.x;
		this.targetPos.y = endTile.y;

		if (ige.room.tileMap().isTileOccupied (this.targetPos.x, this.targetPos.y)) {
			var occupying = ige.client.itemAt(this.targetPos.x, this.targetPos.y);

			if(occupying.data('seat') == false) {
				return false;
			}
		}

		// Check if its a seat
		// if (ige.$('tileMap1').isTileOccupied (this.targetPos.x, this.targetPos.y)) {
		// 	var occupying = ige.client.itemAt(this.targetPos.x, this.targetPos.y);

		// 	// it's not a seat, so lets just not move there
		// 	if (occupying.data('object').info.seat != true) {
		// 		console.log('occupied');
		// 		return;
		// 	}

		// 	console.log('it\'s a seat');

		// 	// is a seat.. store the target seat
		// 	this.data("targetSeat", occupying);

		// 	// find a tile near the seat we can navigate to
		// 	var x1 = this.targetPos.x - 1,
		// 		y1 = this.targetPos.y - 1,
		// 		x2 = 0
		// 		found = false;

		// 	// we only want to check in the 3x3 area
		// 	// TODO: make it check for closer tiles first
		// 	while (x2 < 3) {
		// 		if (found) break;

		// 		var y2 = 0;

		// 		if ( ! ige.$('tileMap1').isTileOccupied (x1 + x2, y1 + y2)) {
		// 			found = true; break;
		// 		}

		// 		while (y2 < 3) {
		// 			if ( ! ige.$('tileMap1').isTileOccupied (x1 + x2, y1 + y2)) {
		// 				found = true; break;
		// 			}
		// 			x2++;
		// 			y2++;
		// 		}
		// 	}

		// 	// We couldn't find a free tile, which means there is no
		// 	// free spots near the seat - don't go there
		// 	if ( ! found) {
		// 		console.log('found nothing');
		// 		return;
		// 	}


		// 	this.targetPos.x = x1 + x2;
		// 	this.targetPos.y = y1 + y2;
		// }

		// Tell the entity to start navigating along the new path
		// TODO: need to add the speed to some sort of global var JS

		this._entity.path
			.set(overTiles.x, overTiles.y, 0, this.targetPos.x, this.targetPos.y, 0)
			.speed(1.75)
			.start();
	},

	_keyUp: function (event, keyCode) {
		if (keyCode === ige.input.key.space) {
			// Change the character
			this._entity._characterType++;

			if (this._entity._characterType > 7) {
				this._entity._characterType = 0;
			}

			this._entity.setType(this._entity._characterType);

			//If the character is currently moving update the direction.
			if(this._entity.path._active == true)
				this._entity.changeDirection(this._entity.path.getDirection());
		}
	},

	_pointReached: function() {
		var direction = this._entity.path.getDirection();
		if(direction != '')
			this._entity.changeDirection(direction);
	},

	_pathComplete: function() {
		if (this.data("targetSeat") != null) {
			// path completed and we were aiming for a seat
			// TODO: mount the seat

			this.data("seat", this.targetSeat);
			this.data("targetSeat", null);
		}

		this._entity.animation.stop();

		this._entity.rest();
	},

	_pathStarted: function() {
		var direction = this._entity.path.getDirection();
		if(direction != '') {
			this._entity.changeDirection(direction);

			// If we didn't just click an item, we hide the infostand
			if ( ! ige.overItem) $('#infostand').hide();
		}
	},

	_pathHalt: function() {
		// Something happened and we had to stop, so we will just
		// stop the animation
		this._entity.animation.stop();
		this._entity.rest();
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerComponent; }
