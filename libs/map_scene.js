var MapScene = function(assets, game_objects, map_data, scene_name) {
	var $this = this;
	var _center;

	var _object_map = {};
	var _object_list = [];

	var _root_object;
	var _scene_descriptor = {};

	Object.defineProperty(this, 'width', {
		'get':function() { return _root_object.width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _root_object.height; },
	});
	Object.defineProperty(this, 'center', {
		'get':function() { return _center; },
	});
	this.eventCallback = function(type, evt) {
		_scene_descriptor.eventCallback.apply($this, [type, evt]);
	};
	this.render = function(t, ctx, width, height) {
		_scene_descriptor.beforeRender.apply($this, [t, width, height]);
		var map_src_x = Math.max(0, this.center.x-width/2);
		var ctx_dst_x = Math.max(0, width/2-this.center.x);
		var map_src_y = Math.max(0, this.center.y-height/2);
		var ctx_dst_y = Math.max(0, height/2-this.center.y);

		_root_object.beforeRender(t);
		ctx.save();
		ctx.fillStyle = config.viewport.background_color;
		ctx.fillRect(0, 0, width, height);
		ctx.translate(ctx_dst_x-map_src_x, ctx_dst_y-map_src_y);
		_root_object.render(t, ctx);
		ctx.restore();
	};

	(function() {
		var object_list = [];

		// tiles && size of root object
		var x = 0;
		var y = 0;
		var max_width = 0;
		$.each(map_data.ground, function(y_idx, row) {
			var max_height = 0;
			x = 0;
			$.each(row, function(x_idx, tile_idx) {
				var tile_obj_data = $.extend({}, map_data.tiles[tile_idx], {'x':x, 'y':y});
				var tile_obj = game_objects.createGameObject(map_data.tiles[tile_idx].cls, tile_obj_data);
				object_list.push({'name':'__tile_'+x_idx+'_'+y_idx, 'inst':tile_obj});
				x = x + tile_obj.width;
				max_height = Math.max(max_height, tile_obj.height);
			});
			y = y + max_height;
			max_width = Math.max(max_width, x);
		});
		var width = max_width;
		var height = y;
		_center = {'x':width/2, 'y':height/2}

		// other game objects
		$.each(map_data.objects, function(name, object_data) {
			object_list.push({'name':name, 'inst':game_objects.createGameObject(object_data.cls, object_data)});
		});

		// root object
		var root_object_data = {
			'default': {
				'init': function(assets) {
					return { 'width':width, 'height':height, 'hitbox_list':[],}
				},
				'beforeRender': function(t) {return {}},
				'render': function(t, ctx) {}
			}
		};
		_root_object = new GameObject(game_objects, assets, root_object_data, {'status':'default'});

		// append child to root object
		$.each(object_list, function(idx, obj) {
			_root_object.setChild(obj.name, obj.inst);
		});

		// scene_descriptor   #should be last
		_scene_descriptor = map_data.scenes[scene_name].apply($this,[]);
		_scene_descriptor.init.apply($this,[]);
	})();
};