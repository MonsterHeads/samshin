var GameObject = function(game_objects, assets, data, initial_data) {
	var $this = this;

	var _status_map = {};
	var _position_data = {'width':0, 'height':0, 'hitbox_list':[]};
	var _x = initial_data.x;
	var _y = initial_data.y;

	var _data = {};
	var _status;
	var _status_start = -1;
	var _child_map = {};
	var _child_list = [];
	this.setChild = function(child_name, child) {
		_child_list.push(child);
		_child_map[name] = {'child':child, 'idx':_child_list.length-1};
	}
	//Object.defineProperty(this, 'child', {});
	this.setStatus= function(status) {
		if( !_status_map.hasOwnProperty(status) ) {
			return false;
		}
		_status = status;
		_status_start = -1;
		var status_position_data = _status_map[_status].init.apply($this,[assets]);
		$.extend(_position_data, status_position_data);
	};
	this.setData = function(data) { _data = data; };
	this.getData = function() { return _data; };
	this.getX = function() { return _x; }
	this.setX = function(x) { _x = x; }
	this.getY = function() { return _y; }
	this.setY = function(y) { _y = y; }
	this.getWidth = function() { return _position_data.width; };
	this.getHeight = function() { return _position_data.height; };
	this.getHitboxList = function() { return _position_data.hitbox_list; }

	this.beforeRender = function(t) {
		if( 0 > _status_start ) {
			_status_start = t;
		}
		var status_data = _status_map[_status];
		var status_position_data = status_data.beforeRender.apply($this, [t-_status_start]);
		$.extend(_position_data, status_position_data);
		$.each(_child_list, function(idx, child) {
			child.beforeRender(t);
		});
	}
	this.render = function(t, ctx) {
		if( 0 > _status_start ) {
			_status_start = t;
		}
		var status_data = _status_map[_status];
		status_data.render.apply($this, [t-_status_start, ctx]);
		$.each(_child_list, function(idx, child) {
			ctx.save();
			ctx.translate(child.getX(), child.getY());
			child.render(t, ctx);
			ctx.restore();
		});
	};
	$.each(data, function(status, status_data) {
		_status_map[status] = {
			'init': status_data.init,
			'beforeRender': status_data.beforeRender,
			'render': status_data.render,
		};
	});
	$.each(initial_data.children, function(name, child_data) {
		var child = game_objects.createGameObject(child_data.cls, child_data);
		$this.setChild(name, child);
	});
	$this.setStatus(initial_data.status);
};

var GameObjects = function(assets, data) {
	var _game_object_data_map = {};
	$.each(data, function(group, group_game_object) {
		$.each(group_game_object, function(game_object_key, data) {
			var cls = group + '/' + game_object_key;
			_game_object_data_map[cls] = data;
		});
	});
	this.createGameObject = function(cls, initial_data) {
		return new GameObject(this, assets, _game_object_data_map[cls], initial_data);
	}
};