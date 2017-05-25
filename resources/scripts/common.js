var CharacterMoveHandler = function(mapScene, characterObject) {
	var _mapScene = mapScene;
	var _charObj = characterObject;
	var _startPosition = {'x':_charObj.x, 'y':_charObj.y};
	var _startTime = -1;
	var _deltaAxis;
	var _deltaPlus;
	var _walking = false;
	var _running = false;

	var start = function() {
		_running = true;
	};
	var stop = function() {
		_running = false;
		stopWalk();
	};
	var setWalk = function(t, status, axis, plus) {
		if( status != _charObj.status ) {
			_charObj.status = status;
			_startPosition = {'x':_charObj.x, 'y':_charObj.y};
			_startTime = t;
			_deltaAxis = axis;
			_deltaPlus = plus;
		}
		_walking = true;
	};
	var stopWalk = function() {
		switch(_charObj.status) {
		case 'down_walk': _charObj.status = 'down_stop'; break;
		case 'up_walk': _charObj.status = 'up_stop'; break;
		case 'left_walk': _charObj.status = 'left_stop'; break;
		case 'right_walk': _charObj.status = 'right_stop'; break;
		}
		_walking = false;
	};
	var getScreenPosition = function() {
		var nObj = _charObj;
		var left = 0;
		var top = 0;
		while( nObj ) {
			left += nObj.left;
			top += nObj.top;
			nObj = nObj.parent;
		}
		return {'left':left, 'top':top, 'right':left+_charObj.width, 'bottom':top+_charObj.height};
	}
	var doWalk = function(t) {
		if( !_walking ) return;
		var delta = (t-_startTime)/35;
		if( !_deltaPlus ) delta = 0 - delta;
		var org = _charObj[_deltaAxis];
		var newValue = Math.floor(_startPosition[_deltaAxis]+delta);
		if( newValue != _charObj[_deltaAxis] ) {
			_charObj[_deltaAxis] = newValue;
			var hit = false;
			var checkFunc = function(idx, gameObject) {
				if( _charObj == gameObject ) return true;
				if( gameObject.hitCheckForBoxList('move', _charObj.hitboxList('move')) ) {
					hit = true;
					return false;
				}
			};
			if( !hit ) _mapScene.eachTileObject(true, checkFunc);
			if( !hit ) _mapScene.eachGameObject(true, checkFunc);
			if( hit ) {
				_charObj[_deltaAxis] = org;
				_startTime = t;
				_startPosition = {'x':_charObj.x, 'y':_charObj.y};
			}
		}
	};
	var handleKeyboardEvent = function(t, type, evt) {
		if( !_running ) return;
		switch(type) {
		case 'keydown':
			switch(evt.keyCode) {
			case 37:case 65: setWalk(t, 'left_walk', 'x', false); break;
			case 38:case 87: setWalk(t, 'up_walk', 'y', false); break;
			case 39:case 68: setWalk(t, 'right_walk', 'x', true); break;
			case 40:case 83: setWalk(t, 'down_walk', 'y', true); break;
			}
			break;
		case 'keyup':
			switch(evt.keyCode) {
			case 37:case 65: if('left_walk'==_charObj.status) stopWalk(); break;
			case 38:case 87: if('up_walk'==_charObj.status) stopWalk(); break;
			case 39:case 68: if('right_walk'==_charObj.status) stopWalk(); break;
			case 40:case 83: if('down_walk'==_charObj.status) stopWalk(); break;
			}
		}
	};
	return {
		'start':start,
		'stop':stop,
		'update':doWalk,
		'keyboardEventListener':handleKeyboardEvent,
	};
};