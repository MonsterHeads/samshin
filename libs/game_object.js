var GroundTile = function(assets, key, data) {
	// {'asset':'tiles/floor_01', 'hit_check':false, 'width':1, 'height':1,}
	var asset = assets.getAsset(data.asset);
	var width = data.width;
	var height = data.height;
	var hit_check = data.hit_check;

	this.getWidth = function(){return width;};
	this.getHeight = function(){return height;};
	this.draw = function(ctx, x, y) {
		asset.draw(ctx, x, y, width*config.ground_tile.unit, height*config.ground_tile.unit);
	};
};

var GroundTiles = function(assets, data) {
	var tiles_map = {};
	$.each(data, function(key, data) {
		tiles_map[key] = new GroundTile(assets, key, data);
	});
	this.getGroundTile = function(key) {
		return tiles_map[key];
	}
}

