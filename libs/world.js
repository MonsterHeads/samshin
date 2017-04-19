var World = function(ctx, ground_tiles, map_data) {
	var grid_width = data.width;
	var grid_height = data.height;
	var width = grid_width * config.ground_tile.unit;
	var height = grid_height * config.ground_tile.unit;
	var ground_data = $.extend({}, data.ground);

	this.render = function(ctx, width, height, center_x, center_y) {
		for( var y=0; y<grid_height; y++ ) {
			for( var x=0; x<grid_width; x++ ) {
				ground_tiles.getGroundTile(ground_data[y][x]);
			}
		}
	}
};

var WorldCameraScene = function(world_map) {

};