var MapScene = function(assetPool, gameObjectPool, mapData, sceneName) {
	var $this = this;
	var _center;

	var _rootGameObject;
	var _sceneDescriptor = {};

	Object.defineProperty(this, 'width', {
		'get':function() { return _rootGameObject.width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _rootGameObject.height; },
	});
	Object.defineProperty(this, 'center', {
		'get':function() { return _center; },
	});
	this.eventCallback = function(type, evt) {
		_sceneDescriptor.eventCallback.apply($this, [type, evt]);
	};
	this.render = function(t, ctx, width, height) {
		_sceneDescriptor.beforeRender.apply($this, [t, width, height]);
		var mapSrcX = Math.max(0, this.center.x-width/2);
		var mapSrcY = Math.max(0, this.center.y-height/2);

		var ctxDstX = Math.max(0, width/2-this.center.x);
		var ctxDstY = Math.max(0, height/2-this.center.y);

		_rootGameObject.beforeRender(t);
		ctx.save();
		ctx.fillStyle = config.viewport.background_color;
		ctx.fillRect(0, 0, width, height);
		ctx.translate(ctxDstX-mapSrcX, ctxDstY-mapSrcY);
		_rootGameObject.render(t, ctx);
		ctx.restore();
	};

	(function() {
		var objectList = [];

		// tiles && size of root object
		var x = 0;
		var y = 0;
		var maxWidth = 0;
		$.each(mapData.ground, function(yIdx, row) {
			var maxHeight = 0;
			x = 0;
			$.each(row, function(xIdx, tileIdx) {
				var tileObjectData = $.extend({}, mapData.tiles[tileIdx], {'x':x, 'y':y});
				var tileObject = gameObjectPool.createGameObject(mapData.tiles[tileIdx].cls, tileObjectData);
				objectList.push({'name':'__tile_'+xIdx+'_'+yIdx, 'inst':tileObject});
				x = x + tileObject.width;
				maxHeight = Math.max(maxHeight, tileObject.height);
			});
			y = y + maxHeight;
			maxWidth = Math.max(maxWidth, x);
		});
		var width = maxWidth;
		var height = y;
		_center = {'x':width/2, 'y':height/2}

		// other game objects
		$.each(mapData.objects, function(name, objectData) {
			objectList.push({'name':name, 'inst':gameObjectPool.createGameObject(objectData.cls, objectData)});
		});

		// root object
		var rootObjectData = {
			'default': {
				'init': function(assetPool) {
					return { 'width':width, 'height':height, 'hitboxList':[],}
				},
				'beforeRender': function(t) {return {}},
				'render': function(t, ctx) {}
			}
		};
		_rootGameObject = new GameObject(gameObjectPool, assetPool, rootObjectData, {'status':'default'});

		// append child to root object
		$.each(objectList, function(idx, obj) {
			_rootGameObject.setChild(obj.name, obj.inst);
		});

		// scene_descriptor   #should be last
		_sceneDescriptor = mapData.scenes[sceneName].apply($this,[]);
		_sceneDescriptor.init.apply($this,[]);
	})();
};