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
	var _lastViewportEvent = undefined;
	var _lastMouseMoveTargets = [];

	var _checkTarget = function(targets, x, y, gameObject) {
		var check = gameObject.hitCheckForPoint('ui', {'x':x, 'y':y});
		if( check ){
			targets.push(gameObject);
			var nTargetLength = targets.length;
			var newX = x - gameObject.left;
			var newY = y - gameObject.top;
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
	var _handleEvent = function(type, viewportEvent) {
		var idx;
		if( 'mouseleave' == type ) {
			for( idx=_lastMouseMoveTargets.length-1; idx>=0; idx-- ) {
				_lastMouseMoveTargets[idx].fireEvent('mouseleave', {});
			}
			_lastMouseMoveTargets = [];
			_lastViewportEvent = undefined;
		} else {
			_lastViewportEvent = viewportEvent;
			var sceneEvent = new SS.MouseEvent(type, {'x':0, 'y':0, 'parentEvent':viewportEvent});
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
					if( 0 > leaveStartIdx ) leaveStartIdx = idx;
					targets[idx].fireEvent('mouseenter', {});
				}
			}
			if( 'object_move' != type ) {
				for( idx=targets.length-1; idx>=0; idx-- ) {
					curEvent = eventList[idx];
					if( targets[idx].passMouseEvent ) continue;
					targets[idx].fireEvent(type, curEvent);
					if( curEvent.propagationStopped ) {
						break;
					}
				}
			}
			if( 0 > leaveStartIdx ) leaveStartIdx = targets.length;
			for( idx=_lastMouseMoveTargets.length-1; idx>=leaveStartIdx; idx-- ) {
				_lastMouseMoveTargets[idx].fireEvent('mouseleave', {});
			}
			_lastMouseMoveTargets = targets;
		}		
	}
	var _handleObjectChange = function(evt) {
		if( _lastViewportEvent ) {
			_handleEvent('object_move', _lastViewportEvent);
		}
	}
	var _removeObserver = function(gameObject) {
		gameObject.removeObserverGroup('_mouse_helper');
		gameObject.eachChild(function(idx, child){_removeObserver(child)});
	}
	var _setObserver = function(gameObject) {
		gameObject.addObserver('_mouse_helper', function(evt){_setObserver(evt.data.child);}, ['childSet']);
		gameObject.addObserver('_mouse_helper', function(evt){_removeObserver(evt.data.child);}, ['childRemoved']);
		gameObject.addObserver('_mouse_helper', _handleObjectChange, ['positionChanged', 'sizeChanged']);
		gameObject.eachChild(function(idx, child){_setObserver(child)});
	};
	_setObserver(_root);
	return {
		'handleEvent': _handleEvent,
	};
};


//t: current time, b: begInnIng value, c: change In value, d: duration
SS.helper.Easing = {
	'linear': function(t, b, c, d) {return c*(t/=d)+b;},
	'easeInQuad': function(t, b, c, d) {return c*(t/=d)*t+b;},
	'easeOutQuad': function(t, b, c, d) {return -c *(t/=d)*(t-2)+b;},
};

SS.priv.Timeline = {};
SS.priv.Timeline.Timeline = function() {
	var $this = this;
	var _timeline = [];
	var _duration = 0;
	var _defaultEasing = SS.helper.Easing.linear;

	Object.defineProperty(this, 'duration', {
		'get':function() { return _duration; },
	});
	this.now = function(object, properties) {
		_timeline.push({'obj':object, 'type':'now', 'begin':_duration, 'properties':$.extend({},properties)});
		return $this;
	};
	this.animate = function(object, duration, properties) {  // { 'name':'x', begin':0, 'to':10 }
		_timeline.push({'obj':object, 'type':'animate', 'begin':_duration, 'duration':duration, 'properties':$.extend({},properties)});
		_duration += duration;
		return $this;
	};
	this.wait = function(duration) {
		_timeline.push({'type':'wait', 'begin':_duration, 'duration':duration});
		_duration += duration;
		return $this;
	};
	this.waitFunc = function(handler) {
		_timeline.push({'type':'waitFunc', 'begin':_duration, 'handler':handler});
		return $this;
	};
	this.call = function(handler) {
		_timeline.push({'type':'call', 'begin':_duration, 'handler':handler});
		return $this;
	}
	this.clone = function(after) {
		var result = new SS.priv.Timeline.Timeline();
		if( 0 < after ) {
			result.wait(after);
		}
		$.each(_timeline, function(idx, descriptor) {
			switch(descriptor.type) {
			case 'now': result.now(descriptor.obj, descriptor.properties); break;
			case 'animate': result.animate(descriptor.obj, descriptor.duration, descriptor.properties); break;
			case 'wait': result.wait(descriptor.duration); break;
			case 'waitFunc': result.waitFunc(descriptor.handler); break;
			case 'call': result.call(descriptor.handler); break;
			}
		});
		return result;
	};

	var _curIdx = 0;
	this.clearDone = function(t) {
		_curIdx = 0;
	};
	this.do = function(t, waitResolver) {
		var current;
		var easing;
		while( true ) {
			if( _timeline.length <= _curIdx ) break;
			current = _timeline[_curIdx];
			if( current.begin > t ) break;
			switch( current.type ) {
			case 'now':
				_curIdx++;
				$.each(current.properties, function(key, value) {
					current.obj[key] = value;
				});
				break;
			case 'waitFunc':
				_curIdx++;
				current.handler(waitResolver);
				return false;
			case 'call':
				_curIdx++;
				current.handler();
				break;
			case 'wait':
				if( current.begin+current.duration <= t ) {
					_curIdx++;
					break;
				} else {
					return true;
				}
			case 'animate':
				if( current.begin+current.duration <= t ) {
					_curIdx++;
					$.each(current.properties, function(key, value) {
						current.obj[key] = value.end;
					});
					break;
				} else {
					$.each(current.properties, function(key, value) {
						if( value.hasOwnProperty('easing') ) {
							easing = value.easing;
						} else {
							easing = _defaultEasing;
						}
						current.obj[key] = easing(t-current.begin, value.begin, value.end-value.begin, current.duration);
					});
					return true;
				}
			}
			current = _timeline[_curIdx];
		}
		return true;
	};
};
SS.helper.Timeline = function(){
	var $this = this;
	var _timelines = [new SS.priv.Timeline.Timeline(), ];
	var _longestTimelineIdx = 0;

	this.priv = {};
	this.priv.timelines = function(){
		return _timelines;
	};
	this.now = function(object, properties) {
		_timelines[_longestTimelineIdx].now(object, properties);
		return $this;
	};
	this.animate = function(object, duration, properties) {
		_timelines[_longestTimelineIdx].animate(object, duration, properties);
		return $this;
	};
	this.wait = function(duration) {
		_timelines[_longestTimelineIdx].wait(duration);
		return $this;
	};
	this.waitFunc = function(handler) {
		_timelines[_longestTimelineIdx].waitFunc(handler);
		return $this;
	};
	this.call = function(handler) {
		_timelines[_longestTimelineIdx].call(handler);
		return $this;
	};
	this.parallelMerge = function(timeline, timeAt) {
		var newTimelines = timeline.priv.timelines();
		if( timeAt && 0 < timeAt ) {
		} else {
			timeAt = 0;
		}
		$.each(newTimelines, function(idx, newTimeline) {
			newTimeline = newTimeline.clone(timeAt);
			_timelines.push(newTimeline);
			if( newTimeline.duration > _timelines[_longestTimelineIdx].duration ) {
				_longestTimelineIdx = _timelines.length-1;
			}
		});
		return $this;
	};
	Object.defineProperty(this, 'duration', {
		'get':function() { return _timelines[_longestTimelineIdx].duration; },
	});

	var _beginTime = -1;
	var _running = false;
	var _pausedCheck = {};
	var _pauseBeginTime = -1;
	var _totalPausedTime = 0;

	var _isPaused = function() {
		var result = false;
		$.each(_pausedCheck, function(key, value) {
			if( value ) {
				result = true;
				return false;
			}
		});
		return result;
	}
	this.start = function() {
		if( _running ) {
			delete _pausedCheck['main'];
		} else {
			_beginTime = -1;
			_running = true;
			_paused = {};
			_pauseBeginTime = -1;
			_totalPausedTime = 0;
			$.each(_timelines, function(idx, timeline) {
				timeline.clearDone();
			});
		}
	};
	this.stop = function() {
		_running = false;
	};
	this.pause = function() {
		_pausedCheck['main'] = true;
	};
	this.update = function(t) {
		if( !_running ) return;
		if( 0 > _beginTime ) _beginTime = t;
		var isPaused = _isPaused();
		if( isPaused && 0 > _pauseBeginTime ) {
			_pauseBeginTime = t;
		}
		if( isPaused ) return;
		else if( 0 <= _pauseBeginTime ) {
			_totalPausedTime += Math.max(0,t-_pauseBeginTime);
			_pauseBeginTime = -1;
		}
		var aniT = Math.max(0,t-_beginTime-_totalPausedTime);
		$.each(_timelines, function(idx, timeline) {
			var result = timeline.do(aniT, function() { delete _pausedCheck[idx]; });
			if( !result ) {
				_pausedCheck[idx] = true;
			}
		});
		if( _isPaused() && 0 > _pauseBeginTime ) {
			_pauseBeginTime = t;
		}
		return;
	}
};
