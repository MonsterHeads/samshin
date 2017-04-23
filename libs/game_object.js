var GroundTile = function(assets, key, data) {
	// {'asset':'tiles/floor_01', 'hit_check':false, 'width':1, 'height':1,}
	var _asset = assets.getAsset(data.asset);
	var _width = data.width;
	var _height = data.height;
	var _hit_check = data.hit_check;

	this.getWidth = function(){return _width;};
	this.getHeight = function(){return _height;};
	this.draw = function(ctx, x, y) {
		_asset.draw(ctx, x, y, _width*config.ground_tile.unit, _height*config.ground_tile.unit);
	};
};

var GroundTiles = function(assets, data) {
	var _tiles_map = {};
	$.each(data, function(key, data) {
		_tiles_map[key] = new GroundTile(assets, key, data);
	});
	this.getGroundTile = function(key) {
		return _tiles_map[key];
	}
};

var GameObject = function(assets, data, initial_status) {
	var _status_map = {};
	$.each(data, function(status, status_data) {
		var asset_list = {};
		var _width = 0;
		var _height = 0;
		$.each(status_data.asset_list, function(idx, asset_name) {
			var asset = assets.getAsset(asset_name);
			asset_list[idx] = asset;
			_width = Math.max(_width, asset.getWidth());
			_height = Math.max(_height, asset.getHeight());
		});
		_status_map[status] = {
			'asset_list': asset_list,
			'width': _width,
			'height': _height,
			'hitbox_list': status_data.hitbox_list,
			'animate': status_data.animate,
		};
	});
	var _additional_data = {};
	var _status;
	var _status_start = -1;
	var _child_map = {};
	var _child_list = [];
	this.setChild = function(child_name, wrap_child) {
		_child_list.push(wrap_child);
		_child_map[name] = {'wrap_child':wrap_child, 'idx':_child_list.length-1};
	}
	this.setStatus= function(status, validateFunc) {
		if( !_status_map.hasOwnProperty(status) ) {
			return false;
		}
		if( validateFunc && !validateFunc(_status_map[_status], _status_map[status]) ) {
			return false;
		}
		_status = status;
		_status_start = -1;
	};
	this.setAdditionalData = function(additional_data) {
		_additional_data = additional_data;
	};
	this.getAdditionalData = function() {
		return _additional_data;
	};
	this.getWidth = function() {
		return _status_map[_status].width;
	};
	this.getHeight = function() {
		return _status_map[_status].height;
	};
	this.getHitboxList = function() {
		return _status_map[_status].hitbox_list;
	}
	this.draw = function(t, ctx, x, y) {
		if( 0 > _status_start ) {
			_status_start = t;
		}
		var data = _status_map[_status];
		var ani_info = data.animate(t-_status_start, _additional_data);
		data.asset_list[ani_info.asset_idx].draw(ctx, x, y, data.width, data.height);
		$.each(_child_list, function(idx, wrap_child) {
			wrap_child.inst.draw(t, ctx, x+wrap_child.x, y+wrap_child.y);
		});
	};

	this.setStatus(initial_status);
};

var GameObjects = function(assets, data) {
	var _game_object_data_map = {};
	$.each(data, function(group, group_game_object) {
		$.each(group_game_object, function(game_object_key, data) {
			var cls = group + '/' + game_object_key;
			_game_object_data_map[cls] = data;
		});
	});
	this.createGameObject = function(cls, initial_status) {
		return new GameObject(assets, _game_object_data_map[cls], initial_status);
	}
};