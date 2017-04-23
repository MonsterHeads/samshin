var World = function(ground_tiles, map_data, scene_name) {
	var _grid_width = map_data.width;
	var _grid_height = map_data.height;
	var _width = _grid_width * config.ground_tile.unit;
	var _height = _grid_height * config.ground_tile.unit;
	var _ground_data = $.extend({}, map_data.ground);
	var _center_x = _width/2;
	var _center_y = _height/2;

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
		var real_width = Math.max(0, Math.min(width-ctx_dst_x, _width-map_src_x));
		var real_height = Math.max(0, Math.min(height-ctx_dst_y, _height-map_src_y));
		var init_cur_x = ctx_dst_x + 0-(map_src_x%config.ground_tile.unit);
		var init_cur_y = ctx_dst_y + 0-(map_src_y%config.ground_tile.unit);
		var init_x = Math.floor(map_src_x/config.ground_tile.unit);
		var init_y = Math.floor(map_src_y/config.ground_tile.unit);
		var to_x = Math.min(_grid_width, Math.ceil((map_src_x+real_width)/config.ground_tile.unit));
		var to_y = Math.min(_grid_height, Math.ceil((map_src_y+real_height)/config.ground_tile.unit));

		ctx.fillStyle = config.viewport.background_color;
		ctx.fillRect(0, 0, width, height);

		var cur_y = init_cur_y;
		for( var y=init_y; y<to_y; y++ ) {
			var cur_x = init_cur_x;
			for( var x=init_x; x<to_x; x++ ) {
				var tile_idx = _ground_data[y][x];
				if( 0 < tile_idx ) {
					ground_tiles.getGroundTile(tile_idx).draw(ctx, cur_x, cur_y);
				}
				cur_x += config.ground_tile.unit;
			}
			cur_y += config.ground_tile.unit;
		}
	}
	var scene = new map_data.scenes[scene_name](this);
};