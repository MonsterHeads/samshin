SS.tool.MapScene = function(application, mapData, sceneHandler) {
	var $this = this;
	var _app = application;
	var _center = {};

	var _view = {'width':0, 'height':0};

	var _root;
	var _tileRoot;
	var _gameRoot;
	var _uiRoot;
	var _modalRoot;
	var _sceneHandler = {};
	var _mouseEventHelper;
	var _modal = false;

	Object.defineProperty(_center, 'x', {
		'get':function() { return _gameRoot.x; },
		'set':function(x) { _gameRoot.x = x; _tileRoot.x = x; },
	});
	Object.defineProperty(_center, 'y', {
		'get':function() { return _gameRoot.y; },
		'set':function(y) { _gameRoot.y = y; _tileRoot.y = y; },
	});
	Object.defineProperty(this, 'app', {
		'get':function() { return _app; },
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _tileRoot.width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _tileRoot.height; },
	});
	Object.defineProperty(this, 'center', {
		'get':function() { return _center; },
	});
	Object.defineProperty(this, 'modal', {
		'get':function() { return _modal; },
		'set':function(modal) {
			if( modal != _modal ) {
				_modal = modal;
				_modalRoot.hide = !modal;
			}
		},
	});
	this.modalObject = function() {
		if( 0 == arguments.length ) return _modalRoot;
		else return _modalRoot.child(arguments[0]);
	};
	this.gameObject = function() {
		if( 0 == arguments.length ) return _gameRoot;
		else return _gameRoot.child(arguments[0]);
	};
	this.uiObject = function() {
		if( 0 == arguments.length ) return _uiRoot;
		else return _uiRoot.child(arguments[0]);
	};
	this.eachGameObject = function() {
		_gameRoot.eachChild.apply(_gameRoot, Array.prototype.slice.call(arguments));
	};
	this.eachTileObject = function() {
		_tileRoot.eachChild.apply(_tileRoot, Array.prototype.slice.call(arguments));
	};
	this.eventListener = function(t, type, evt) {
		switch(type) {
		case 'keypress': case 'keydown': case 'keyup':
			_sceneHandler.keyboardEventListener.apply($this, [t, type, evt]);
			break;
		case 'mousemove': case 'mouseleave': case 'mousedown': case 'mouseup':
			_handleMouseEvent(t, type, evt);
		}
	};
	this.render = function(t, ctx, width, height) {
		_view.width = width;
		_view.height = height;
		_sceneHandler.update.apply($this, [t, width, height]);
		var mapSrcX = Math.max(0, $this.center.x-width/2);
		var mapSrcY = Math.max(0, $this.center.y-height/2);
		var ctxDstX = Math.max(0, width/2-$this.center.x);
		var ctxDstY = Math.max(0, height/2-$this.center.y);

		_root.update(t);
		ctx.save();
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);
		_root.render(t, ctx);
		ctx.restore();
	};

	var _handleMouseEvent = function(t, type, viewportEvent) {
		_mouseEventHelper.handleEvent(type, viewportEvent);
	};

	(function(){
		var rootObjectClassData = {'status': {'default': {'type':'custom','data': (function(){
			var _width = _view.width;
			var _height = _view.height
			return {
				'init': function(application) { return { 'width':_width, 'height':_height, 'hitboxList':[],} },
				'update': function(t) {
					var result = {};
					if( _view.width != _width ) {
						_width = _view.width;
						result.width = _width;
						_tileRoot.x = $this.center.x;
						_gameRoot.x = $this.center.x;
					}
					if( _view.height != _height ) {
						_height = _view.height;
						result.height = _height;
						_tileRoot.y = $this.center.y;
						_gameRoot.y = $this.center.y;
					}
					return result;
				},
				'render': function(t, ctx) {}
			}
		})(),},},};
		_root = new SS.GameObject(_app, rootObjectClassData, {'status':'default'});	
	})();
	(function() { // tiles
		var tileObjectList = [];
		var x = 0;
		var y = 0;
		var maxWidth = 0;
		$.each(mapData.ground, function(yIdx, row) {
			var maxHeight = 0;
			x = 0;
			$.each(row, function(xIdx, tileIdx) {
				var tileObjectData = $.extend({}, mapData.tiles[tileIdx], {'x':x, 'y':y});
				var tileObject = _app.createGameObject(mapData.tiles[tileIdx].cls, tileObjectData);
				tileObjectList.push({'name':'__tile_'+xIdx+'_'+yIdx, 'inst':tileObject});
				x = x + tileObject.width;
				maxHeight = Math.max(maxHeight, tileObject.height);
			});
			y = y + maxHeight;
			maxWidth = Math.max(maxWidth, x);
		});
		var width = maxWidth;
		var height = y;
		var tileObjectClassData = {'status':{'default': {'type':'custom','data':{
			'init': function(application) {return {'width':width,'height':height,}},
			'render': function(t, ctx) {}
		},},},};
		_tileRoot = new SS.GameObject(_app, tileObjectClassData, {'x':0, 'y':0, 'status':'default', 'xOrigin':'center', 'yOrigin':'center'});
		$.each(tileObjectList, function(idx, obj) {
			_tileRoot.setChild(obj.name, obj.inst);
		});
		_tileRoot.z = 0;
		_root.setChild('tile', _tileRoot);
	})();
	(function() { // game object
		var gameObjectClassData = {'status': {'default': {'type':'custom','data':{
			'init': function(application) {return {'width':_tileRoot.width,'height':_tileRoot.height,}},
			'render': function(t, ctx) {}
		},},},};
		_gameRoot = new SS.GameObject(_app, gameObjectClassData, {'x':0, 'y':0, 'status':'default', 'xOrigin':'center', 'yOrigin':'center'});
		_gameRoot.z = 1;
		// add game objects
		$.each(mapData.objects, function(name, objectConfig) {
			_gameRoot.setChild(name, _app.createGameObject(objectConfig.cls, objectConfig.data));
		});
		_root.setChild('game', _gameRoot);
	})();
	(function() { // ui object
		var uiObjectClassData = {'status': {'default': {'type':'custom','data': (function(){
			return {
				'init': function(application) {
					return { 'width': _root.width, 'height': _root.height };
				},
				'update': function(t) {
					return { 'width': _root.width, 'height': _root.height };
				},
				'render': function(t, ctx) {}
			};
		})(),},},};
		_uiRoot = new SS.GameObject(_app, uiObjectClassData, {'status':'default'});
		_uiRoot.z = 2;
		_uiRoot.passMouseEvent = true;
		// add ui objects
		$.each(mapData.ui, function(name, objectConfig) {
			_uiRoot.setChild(name, _app.createGameObject(objectConfig.cls, objectConfig.data));
		});
		_root.setChild('ui', _uiRoot);
	})();
	(function() { // modal object
		var modalObjectClassData = {'status': {'default': {'type':'custom','data': (function(){
			return {
				'init': function(application) {
					return { 'width': _root.width, 'height': _root.height };
				},
				'update': function(t) {
					return { 'width': _root.width, 'height': _root.height };
				},
				'render': function(t, ctx) {}
			};
		})(),},},};
		_modalRoot = new SS.GameObject(_app, modalObjectClassData, {'status':'default'});
		_modalRoot.z = 3;
		_modalRoot.hide = true;
		_root.setChild('modal', _modalRoot);
	})();
	(function() {
		_mouseEventHelper = new SS.helper.MouseEventHelper(_root)
		_sceneHandler = sceneHandler;
		_sceneHandler.init.apply($this,[]);
	})();
};
