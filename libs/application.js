window['SS'] = {
	'priv':{},
	'tool':{},
	'assetClass':{},
};


SS.priv.Viewport = function(application) {
	var _app = application;
	var _scene;
	var _ctx;

	var init = function() {
		_config = _app.config.viewport;
		var canvas = $('<canvas></canvas>');
		canvas.css('width', '100%');
		canvas.css('height', '100%');
		canvas.attr('width', _config.width);
		canvas.attr('height', _config.height);
		_config.el.append(canvas);
		_config.renderWidth = Math.ceil(_config.width/_config.scale);
		_config.renderHeight = Math.ceil(_config.height/_config.scale);

		_ctx = canvas[0].getContext('2d');
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

SS.Application = function(config) {
	var $this = this;
	var _config = config;

	Object.defineProperty(this, 'config', {
		'get': function() { return _config; },
	});
	Object.defineProperty(this, 'scene', {
		'get': function() { return _viewport.scene; },
		'set': function(scene) { _viewport.scene = scene; },
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


