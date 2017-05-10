SS.helper.HitChecker = (function() {
	return {
		'shiftBox' : function(box, x, y) {
			return {'x':box.x+x, 'y':box.y+y, 'width':box.width, 'height':box.height};
		},
		'box2box' : function(a, b) {
			return ( a.x<=b.x+b.width-1 && a.x+a.width-1>=b.x && a.y<=b.y+b.height-1 && a.y+a.height-1>=b.y );
		},
		'point2box' : function(p, a) {
			return ( p.x>=a.x && p.y>=a.y && p.x<=a.x+a.width-1 && p.y<=a.y+a.height-1 );
		},
		'pointDistance': function(a, b, d) {
			return d*d >= (a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y);
		},
	};
})();

SS.helper.MouseEventHelper = function(root) {
	var _root = root;
	var _lastMouseMoveTargets = [];
	var _checkTarget = function(targets, x, y, gameObject) {
		if( gameObject.hitCheckForPoint('ui', {'x':x, 'y':y}) ){
			targets.push(gameObject);
			var nTargetLength = targets.length;
			var newX = x - gameObject.x;
			var newY = y - gameObject.y;
			gameObject.eachChild(true, function(idx, child) {
				if( _checkTarget(targets, newX, newY, child) ) {
					return false;
				}
			});
			if( targets.length == nTargetLength && gameObject.passMouseEvent ) {
				targets.pop();
				return false;
			} else {
				return true;
			}
		}
		return false;
	};
	var _getHitObjectList = function(x, y, gameObject) {
		var targets = [];
		_checkTarget(targets, x, y, gameObject);
		return targets;
	}
	return {
		'handleEvent': function(t, type, viewportEvent, originPosition) {
			var idx;
			if( 'mouseleave' == type ) {
				for( idx=_lastMouseMoveTargets.length-1; idx>=0; idx-- ) {
					_lastMouseMoveTargets[idx].fireEvent('mouseleave', {});
				}
				_lastMouseMoveTargets = [];
			} else {
				var sceneEvent = new SS.MouseEvent(type, {'x':originPosition.x, 'y':originPosition.y, 'parentEvent':viewportEvent});
				var targets = _getHitObjectList(sceneEvent.offsetX, sceneEvent.offsetY, _root);
				var eventList = [];
				var curEvent = sceneEvent;
				for( idx=0; idx<targets.length; idx++ ) {
					curEvent = new SS.MouseEvent(type, {'x':targets[idx].x, 'y':targets[idx].y, 'parentEvent':curEvent});
					eventList.push(curEvent);
				}
				var leaveStartIdx = -1;
				for( idx=0; idx<targets.length; idx++ ) {
					if( _lastMouseMoveTargets.length-1 < idx || _lastMouseMoveTargets[idx] !== targets[idx] ) {
						if( 0 > leaveStartIdx ) {
							leaveStartIdx = idx;
						}
						targets[idx].fireEvent('mouseenter', {});
					}
				}
				for( idx=targets.length-1; idx>=0; idx-- ) {
					curEvent = eventList[idx];
					targets[idx].fireEvent(type, curEvent);
					if( curEvent.propagationStopped ) {
						break;
					}
				}
				if( 0 > leaveStartIdx ) {
					leaveStartIdx = targets.length;
				}
				for( idx=_lastMouseMoveTargets.length-1; idx>=leaveStartIdx; idx-- ) {
					_lastMouseMoveTargets[idx].fireEvent('mouseleave', {});
				}
				_lastMouseMoveTargets = targets;
			}
		}
	};
};