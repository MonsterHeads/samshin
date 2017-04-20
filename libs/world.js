var World = function(ground_tiles, map_data) {
	var _grid_width = map_data.width;
	var _grid_height = map_data.height;
	var _width = _grid_width * config.ground_tile.unit;
	var _height = _grid_height * config.ground_tile.unit;
	var _ground_data = $.extend({}, map_data.ground);

	this.getWidth = function(){return _width;}
	this.getHeight = function(){return _height;}

	this.render = function(ctx, width, height, center_x, center_y) {
		var map_src_x = Math.max(0, center_x-width/2);
		var ctx_dst_x = Math.max(0, width/2-center_x);
		var map_src_y = Math.max(0, center_y-height/2);
		var ctx_dst_y = Math.max(0, height/2-center_y);
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
				ground_tiles.getGroundTile(_ground_data[y][x]).draw(ctx, cur_x, cur_y);
				cur_x += config.ground_tile.unit;
			}
			cur_y += config.ground_tile.unit;
		}
	}
};

var WorldCameraScene = function(world) {
	var _center_x = world.getWidth()/2;
	var _center_y = world.getHeight()/2;

	var _dx = 0;
	var _dy = 0;
	this.eventCallback = function(type, evt) {
		switch(type) {
		case 'keydown':
			switch(evt.keyCode) {
			case 37: _dx -= 1; break;
			case 38: _dy -= 1; break;
			case 39: _dx += 1; break;
			case 40: _dy += 1; break;
			}
			switch(evt.keyCode) {
			case 37: case 38: case 39: case 40: evt.preventDefault();
			}
			break;
		}
	};
	this.render = function(t, ctx, width, height) {
		_center_x += _dx*2;
		_center_y += _dy*2;
		_center_x = Math.min(width/2, Math.max(_center_x, world.getWidth()-width/2));
		_center_y = Math.min(height/2, Math.max(_center_y, world.getHeight()-height/2));
		world.render(ctx, width, height, _center_x, _center_y);
		_dx = 0;
		_dy = 0;
	};
};