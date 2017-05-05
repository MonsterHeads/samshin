window['SS'] = {
	'priv':{},
	'tool':{},
	'assetClass':{},
};


SS.priv.Viewport = function(application) {
	var _app = application;
	var _scene;
	var _canvas;
	var _ctx;

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

		$(window).on('keydown', function(evt) {
			if( _scene && typeof _scene.eventCallback == 'function' ) {
				var t = new Date().getTime();
				_scene.eventCallback(t, 'keydown', evt);
			}
		});
		$(window).on('keyup', function(evt) {
			if( _scene && typeof _scene.eventCallback == 'function' ) {
				var t = new Date().getTime();
				_scene.eventCallback(t, 'keyup', evt);	
			}
		});
		$(_canvas).on('mousemove', function(evt) {
			if( _app.cursor ) {
				_app.cursor.x = evt.offsetX / _config.scale;
				_app.cursor.y = evt.offsetY / _config.scale;
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
			_ctx.fillRect(0, 0, _config.width, _config.height);
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
		setTimeout(function(){render();}, delta);
	}

	Object.defineProperty(this, 'scene', {
		'get': function() { return _scene; },
		'set': function(scene) { _scene = scene; },
	});
	init();
};

SS.tool.HitChecker = (function() {
	return {
		'shiftBox' : function(box, x, y) {
			return {'x':box.x+x, 'y':box.y+y, 'width':box.width, 'height':box.height};
		},
		'box2box' : function(a, b) {
			return ( a.x<=b.x+b.width-1 && a.x+a.width-1>=b.x && a.y<=b.y+b.height-1 && a.y+a.height-1>=b.y );
		},
		'point2box' : function(p, a) {
			return ( p.x>=a.x && p.y>=b.y && p.x<=a.x+a.width-1 && p.y<=a.y+a.height-1 );
		},
	}
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


