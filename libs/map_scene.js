SS.tool.MapScene = function(application, mapData, sceneName) {
	var $this = this;
	var _app = application;
	var _center = {'x':0, 'y':0};

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

	this.eachGameObject = function() {
		_rootGameObject.eachChild.apply(_rootGameObject, Array.prototype.slice.call(arguments));
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
		var tileObject;
		(function() { // tiles && size of root object
			var tileObjectList = [];
			var hitboxList = [];
			var x = 0;
			var y = 0;
			var maxWidth = 0;
			$.each(mapData.ground, function(yIdx, row) {
				var maxHeight = 0;
				x = 0;
				$.each(row, function(xIdx, tileIdx) {
					var tileObjectData = $.extend({}, mapData.tiles[tileIdx], {'x':x, 'y':y});
					var tileObject = _app.createGameObject(mapData.tiles[tileIdx].cls, tileObjectData);
					$.each(tileObject.hitboxList('move'), function(idx, hitbox) {
						hitboxList.push({'x':hitbox.x, 'y':hitbox.y, 'width':hitbox.width, 'height':hitbox.height});
					});

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
				'init': function(application) {return {'width':width,'height':height,'hitboxMap':{'move':hitboxList,},}},
				'render': function(t, ctx) {}
			},},},};
			tileObject = new SS.GameObject(_app, tileObjectClassData, {'x':0, 'y':0, 'status':'default'});
			$.each(tileObjectList, function(idx, obj) {
				tileObject.setChild(obj.name, obj.inst);
			});
		})();

		// root object
		var rootObjectClassData = {
			'status': {
				'default': {
					'type':'custom',
					'data':{
						'init': function(application) {
							return { 'width':tileObject.width, 'height':tileObject.height, 'hitboxList':[],}
						},
						'render': function(t, ctx) {}
					},
				},
			},
		};
		_rootGameObject = new SS.GameObject(_app, rootObjectClassData, {'status':'default'});
		_rootGameObject.setChild('__tile__', tileObject);

		// other game objects
		$.each(mapData.objects, function(name, objectConfig) {
			_rootGameObject.setChild(name, _app.createGameObject(objectConfig.cls, objectConfig.data));
		});

		// scene_descriptor   #should be last
		_sceneDescriptor = mapData.scenes[sceneName];
		_sceneDescriptor.init.apply($this,[]);
	})();
};