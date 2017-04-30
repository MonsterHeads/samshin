SS.tool.MapScene = function(application, mapData, sceneName) {
	var $this = this;
	var _app = application;
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
	this.gameObject = function(name) {
		return _rootGameObject.child(name);
	}

	this.hitCheckWithChildren = function(gameObject) {
		return _rootGameObject.hitCheckWithChildren(gameObject);
	}
	this.eventCallback = function(t, type, evt) {
		_sceneDescriptor.eventCallback.apply($this, [t, type, evt]);
	};
	this.render = function(t, ctx, width, height) {
		_sceneDescriptor.update.apply($this, [t, width, height]);
		var mapSrcX = Math.max(0, this.center.x-width/2);
		var mapSrcY = Math.max(0, this.center.y-height/2);

		var ctxDstX = Math.max(0, width/2-this.center.x);
		var ctxDstY = Math.max(0, height/2-this.center.y);

		_rootGameObject.update(t);
		ctx.save();
		ctx.fillStyle = "#000000";
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
				var tileObject = _app.createGameObject(mapData.tiles[tileIdx].cls, tileObjectData);
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
			objectList.push({'name':name, 'inst':_app.createGameObject(objectData.cls, objectData)});
		});

		// root object
		var rootObjectClassData = {
			'default': {
				'init': function(application) {
					return { 'width':width, 'height':height, 'hitboxList':[],}
				},
				'update': function(t) {return {}},
				'render': function(t, ctx) {}
			}
		};
		_rootGameObject = new GameObject(_app, rootObjectClassData, {'status':'default'});

		// append child to root object
		$.each(objectList, function(idx, obj) {
			_rootGameObject.setChild(obj.name, obj.inst);
		});

		// scene_descriptor   #should be last
		_sceneDescriptor = mapData.scenes[sceneName].apply($this,[]);
		_sceneDescriptor.init.apply($this,[]);
	})();
};