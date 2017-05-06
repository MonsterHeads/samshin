SS.tool.MapScene = function(application, mapData, sceneName) {
	var $this = this;
	var _app = application;
	var _center = {'x':0, 'y':0};
	var _view = {'width':0, 'height':0};

	var _root;
	var _sceneDescriptor = {};

	Object.defineProperty(this, 'app', {
		'get':function() { return _app; },
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _root.child('objects').width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _root.child('objects').height; },
	});
	Object.defineProperty(this, 'center', {
		'get':function() { return _center; },
	});
	Object.defineProperty(this, 'tileObject', {
		'get':function() { return _root.child('tile'); },
	});
	this.gameObject = function(name) {
		return _root.child('objects').child(name);
	}
	this.eachGameObject = function() {
		_root.child('objects').eachChild.apply(_root.child('objects'), Array.prototype.slice.call(arguments));
	}
	this.eventListener = function(t, type, evt) {
		switch(type) {
		case 'keypress': case 'keydown': case 'keyup':
			_sceneDescriptor.keyboardEventListener.apply($this, [t, type, evt]);
			break;
		case 'mousemove':
			_handleMouseEvent(t, type, evt);
		}
	};
	this.render = function(t, ctx, width, height) {
		_view.width = width;
		_view.height = height;
		_sceneDescriptor.update.apply($this, [t, width, height]);
		var mapSrcX = Math.max(0, $this.center.x-width/2);
		var mapSrcY = Math.max(0, $this.center.y-height/2);
		var ctxDstX = Math.max(0, width/2-$this.center.x);
		var ctxDstY = Math.max(0, height/2-$this.center.y);

		_root.update(t);
		ctx.save();
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);
		ctx.translate(ctxDstX-mapSrcX, ctxDstY-mapSrcY);
		_root.render(t, ctx);
		ctx.restore();
	};

	var _handleMouseEvent = function(t, type, viewportEvent) {
		var mapSrcX = Math.max(0, $this.center.x-_view.width/2);
		var mapSrcY = Math.max(0, $this.center.y-_view.height/2);
		var ctxDstX = Math.max(0, _view.width/2-$this.center.x);
		var ctxDstY = Math.max(0, _view.height/2-$this.center.y);

		var sceneEvent = new SS.MouseEvent(type, {'x':ctxDstX-mapSrcX, 'y':ctxDstY-mapSrcY, 'parentEvent':viewportEvent});
		var targets = SS.helper.MouseEventHelper.getHitObjectList(sceneEvent.offsetX, sceneEvent.offsetY, _root.child('objects'));
		var eventList = [];
		var curEvent = sceneEvent;
		for( var i=0; i<targets.length; i++ ) {
			curEvent = new SS.MouseEvent(type, {'x':targets[i].x, 'y':targets[i].y, 'parentEvent':curEvent});
			eventList.push(curEvent);
		}
		for( var i=targets.length-1; i>=0; i-- ) {
			curEvent = eventList[i];
			targets[i].fireEvent(type, type, curEvent);
			if( curEvent.propagationStopped ) {
				break;
			}
		}
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
			tileObject.z = 0;
		})();

		// root object
		var objectsClassData = {
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
		objects = new SS.GameObject(_app, objectsClassData, {'status':'default'});
		objects.z = 1;
		// other game objects
		$.each(mapData.objects, function(name, objectConfig) {
			objects.setChild(name, _app.createGameObject(objectConfig.cls, objectConfig.data));
		});

		_root = new SS.GameObject(_app, objectsClassData, {'status':'default'});
		_root.setChild('tile', tileObject);
		_root.setChild('objects', objects);

		// scene_descriptor   #should be last
		_sceneDescriptor = mapData.scenes[sceneName];
		_sceneDescriptor.init.apply($this,[]);
	})();
};