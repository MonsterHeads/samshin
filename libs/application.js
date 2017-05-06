window['SS'] = {
	'priv':{},
	'tool':{},
	'helper':{},
	'assetClass':{},
};

SS.MouseEvent = function(_type, data, scale) {
	var _propagationStopped = false;
	this.type = _type;
	if( data.hasOwnProperty('originalEvent') ) {
		this.button = data.button;
		this.buttons = data.buttons;
		this.viewportX = Math.round(data.offsetX / scale);
		this.viewportY = Math.round(data.offsetY / scale);
		this.offsetX = Math.round(data.offsetX / scale);
		this.offsetY = Math.round(data.offsetY / scale);
	} else if( data.hasOwnProperty('parentEvent')) {
		this.button = data.parentEvent.button;
		this.buttons = data.parentEvent.buttons;
		this.viewportX = data.parentEvent.viewportX;
		this.viewportY = data.parentEvent.viewportY;
		this.offsetX = data.parentEvent.offsetX - data.x;
		this.offsetY = data.parentEvent.offsetY - data.y;
	} else {
		console.error('invalid mouse event');
	}
	this.stopPropagation = function() {
		_propagationStopped = true;
	};
};

SS.helper.MouseEventHelper = function(root) {
	var _root = root;
	var _lastMouseMoveTargets = [];
	var _checkTarget = function(targets, x, y, gameObject) {
		if( gameObject.hitCheckForPoint('ui', {'x':x, 'y':y}) ){
			targets.push(gameObject);
			var newX = x + gameObject.x;
			var newY = y + gameObject.y;
			gameObject.eachChild(true, function(idx, child) {
				if( _checkTarget(targets, newX, newY, child) ) {
					return false;
				}
			});
			return true;
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
				var targets = _getHitObjectList(sceneEvent.offsetX, sceneEvent.offsetY, _root.child('objects'));
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

SS.priv.Viewport = function(application) {
	var _app = application;
	var _config;
	var _scene;
	var _canvas;
	var _ctx;
	var _lastRenderCalled;

	var init = function() {
		_config = _app.config.viewport;
		_canvas = $('<canvas></canvas>');
		_canvas.css('width', '100%');
		_canvas.css('height', '100%');
		_canvas.attr('width', _config.width);
		_canvas.attr('height', _config.height);
		_config.el.append(_canvas);
		_config.renderWidth = Math.ceil(_config.width/_config.scale);
		_config.renderHeight = Math.ceil(_config.height/_config.scale);

		_ctx = _canvas[0].getContext('2d');
		_ctx.scale(_config.scale, _config.scale);
		_ctx.mozImageSmoothingEnabled = false;
		_ctx.webkitImageSmoothingEnabled = false;
		_ctx.msImageSmoothingEnabled = false;
		_ctx.imageSmoothingEnabled = false;

		$(window).on('keypress', function(evt) {
			if( _scene && typeof _scene.eventListener == 'function' ) {
				var t = new Date().getTime();
				_scene.eventListener(t, 'keypress', evt);
			}
		});
		$(window).on('keydown', function(evt) {
			if( _scene && typeof _scene.eventListener == 'function' ) {
				var t = new Date().getTime();
				_scene.eventListener(t, 'keydown', evt);
			}
		});
		$(window).on('keyup', function(evt) {
			if( _scene && typeof _scene.eventListener == 'function' ) {
				var t = new Date().getTime();
				_scene.eventListener(t, 'keyup', evt);	
			}
		});
		$(_canvas).on('mousemove', function(evt) {
			if( _app.cursor ) {
				_app.cursor.x = evt.offsetX / _config.scale;
				_app.cursor.y = evt.offsetY / _config.scale;
			}
			if( _scene && typeof _scene.eventListener == 'function' ) {
				var t = new Date().getTime();
				_scene.eventListener(t, 'mousemove', new SS.MouseEvent('mousemove', evt, _config.scale));
			}
		});
		$(_canvas).on('mouseleave', function(evt) {
			if( _app.cursor ) {
				_app.cursor.x = 0 - _app.cursor.width - 10;
				_app.cursor.y = 0 - _app.cursor.height - 10;
			}
			if( _scene && typeof _scene.eventListener == 'function' ) {
				var t = new Date().getTime();
				_scene.eventListener(t, 'mouseleave', {});
			}
		});
		render();
	}
	var render = function() {
		var t = new Date().getTime();
		if( _scene ) {
			_scene.render(t, _ctx, _config.renderWidth, _config.renderHeight);
		} else {
			_ctx.fillStyle = "#000000";
			_ctx.fillRect(0, 0, _config.renderWidth, _config.renderHeight);
		}
		var cursor = _app.cursor;
		if( cursor ) {
			_canvas.css('cursor','none');
			_ctx.save();
			_ctx.translate(cursor.x, cursor.y);
			cursor.render(t, _ctx);
			_ctx.restore();
		} else {
			_canvas.css('cursor','');
		}
		var endT = new Date().getTime();
		var delta = 1000/_config.fps - (endT - t);
		if( delta < 0 ) {
			delta = 0;
		}
		
		if( _app.config.debug.fps ) {
			_ctx.fillStyle = '#00ff00';
			_ctx.font = '8px Arial';
			_ctx.textAlign = 'right';
			_ctx.fillText(""+Math.round(1000/(t-_lastRenderCalled)), _config.renderWidth, 8);
		}
		_lastRenderCalled = t;
		setTimeout(function(){render();}, delta);
	}

	Object.defineProperty(this, 'scene', {
		'get': function() { return _scene; },
		'set': function(scene) { _scene = scene; },
	});
	init();
};

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
	};
})();

SS.Application = function(config) {
	var $this = this;
	var _config = config;
	var _cursorGameObject;

	Object.defineProperty(this, 'config', {
		'get': function() { return _config; },
	});
	Object.defineProperty(this, 'scene', {
		'get': function() { return _viewport.scene; },
		'set': function(scene) { _viewport.scene = scene; },
	});
	Object.defineProperty(this, 'cursor', {
		'get': function() { return _cursorGameObject; },
		'set': function(cursor) { if( cursor instanceof SS.GameObject ) _cursorGameObject = cursor; },
	});
	this.loadAssets = function(assetData, loadingCallback) {
		_assetPool.loadAssets(assetData, loadingCallback);
	};
	this.getAsset = function(key) {
		return _assetPool.getAsset(key);
	};
	this.loadClasses = function(data) {
		_gameObjectPool.loadClasses(data);
	};
	this.createGameObject = function(cls, initial_data) {
		return _gameObjectPool.createGameObject(cls, initial_data);
	};

	var _viewport = new SS.priv.Viewport($this);
	var _assetPool = new SS.priv.AssetPool($this);
	var _gameObjectPool = new SS.priv.GameObjectPool($this);
};


