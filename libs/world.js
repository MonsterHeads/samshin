var World = function(game_objects, map_data, scene_name) {
	var $this = this;
	var _width, _height;
	var _center_x, _center_y;

	var object_map = {};
	var object_list = [];

	this.getWidth = function(){return _width;}
	this.getHeight = function(){return _height;}
	this.setCenter = function(x, y) {
		_center_x = x;
		_center_y = y;
	};
	this.eventCallback = function(type, evt) {
		scene.eventCallback(type, evt);
	};
	this.render = function(t, ctx, width, height) {
		scene.doAction(t, width, height);
		var map_src_x = Math.max(0, _center_x-width/2);
		var ctx_dst_x = Math.max(0, width/2-_center_x);
		var map_src_y = Math.max(0, _center_y-height/2);
		var ctx_dst_y = Math.max(0, height/2-_center_y);

		ctx.fillStyle = config.viewport.background_color;
		ctx.fillRect(0, 0, width, height);

		$.each(object_list, function(idx, wrap_obj) {
			wrap_obj.beforeRender(t);
		});
		ctx.translate(ctx_dst_x-map_src_x, ctx_dst_y-map_src_y);
		$.each(object_list, function(idx, wrap_obj) {
			var mx = wrap_obj.getX();
			var my = wrap_obj.getY();
			ctx.translate(mx, my);
			wrap_obj.render(t, ctx);
			ctx.translate(0-mx, 0-my);
		});
		ctx.translate(0-ctx_dst_x+map_src_x, 0-ctx_dst_y+map_src_y);
	}
	this.setGameObject = function(name, wrap_obj) {
		object_list.push(wrap_obj); // need sorting
		object_map[name] = {'wrap_obj':wrap_obj, 'idx':object_list.length-1};
		return true;
	}

	var x = 0;
	var y = 0;
	var max_width = 0;
	$.each(map_data.ground, function(y_idx, row) {
		var max_height = 0;
		x = 0;
		$.each(row, function(x_idx, tile_idx) {
			var tile_obj_name = '__tile_'+x_idx+'_'+y_idx;
			var tile_obj_data = $.extend({}, map_data.tiles[tile_idx], {'x':x, 'y':y});
			var tile_obj = game_objects.createGameObject(map_data.tiles[tile_idx].cls, tile_obj_data);
			$this.setGameObject(tile_obj_name, tile_obj);
			x = x + tile_obj.getWidth();
			max_height = Math.max(max_height, tile_obj.getHeight());
		});
		y = y + max_height;
		max_width = Math.max(max_width, x);
	});
	_width = max_width;
	_height = y;
	_center_x = _width/2;
	_center_y = _height/2;

	var scene = new map_data.scenes[scene_name](this);
	$.each(map_data.objects, function(name, object_data) {
		$this.setGameObject(name, game_objects.createGameObject(object_data.cls, object_data));
	});
};