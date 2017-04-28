var GameObject = function(gameObjectPool, assets, data, initialData) {
	var $this = this;

	var _statusMap = {};
	var _boxData = {'width':0, 'height':0, 'hitboxList':[]};
	var _x = initialData.x;
	var _y = initialData.y;

	var _data = {};
	var _status;
	var _statusStartTime = -1;
	var _childMap = {};
	var _childList = [];
	this.setChild = function(child_name, child) {
		_childList.push(child);
		_childMap[child_name] = {'inst':child, 'idx':_childList.length-1};
	};
	this.child = function(child_name) {
		return _childMap[child_name].inst;
	};
	Object.defineProperty(this, 'status', {
		'get': function() { return _status; },
		'set': function(status) {
			if( !_statusMap.hasOwnProperty(status) ) {
				return false;
			}
			_status = status;
			_statusStartTime = -1;
			var statusBoxData = _statusMap[_status].init.apply($this,[assets]);
			$.extend(_boxData, statusBoxData);			
		},
	});
	Object.defineProperty(this, 'data', {
		'get':function() { return _data; },
		'set':function(data) { _data = data;},
	});
	Object.defineProperty(this, 'x', {
		'get':function() { return _x; },
		'set':function(x) { _x = x;},
	});
	Object.defineProperty(this, 'y', {
		'get':function() { return _y; },
		'set':function(y) { _y = y;},
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _boxData.width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _boxData.height; },
	});
	Object.defineProperty(this, 'hitboxList', {
		'get':function() { return _boxData.hitbox_list; },
	});

	this.beforeRender = function(t) {
		if( 0 > _statusStartTime ) {
			_statusStartTime = t;
		}
		var statusData = _statusMap[_status];
		var statusBoxData = statusData.beforeRender.apply($this, [t-_statusStartTime]);
		$.extend(_boxData, statusBoxData);
		$.each(_childList, function(idx, child) {
			child.beforeRender(t);
		});
	}
	this.render = function(t, ctx) {
		if( 0 > _statusStartTime ) {
			_statusStartTime = t;
		}
		var statusData = _statusMap[_status];
		statusData.render.apply($this, [t-_statusStartTime, ctx]);
		$.each(_childList, function(idx, child) {
			ctx.save();
			ctx.translate(child.x, child.y);
			child.render(t, ctx);
			ctx.restore();
		});
	};
	$.each(data, function(status, statusData) {
		_statusMap[status] = {
			'init': statusData.init,
			'beforeRender': statusData.beforeRender,
			'render': statusData.render,
		};
	});
	$.each(initialData.children, function(name, child_data) {
		var child = gameObjectPool.createGameObject(child_data.cls, child_data);
		$this.setChild(name, child);
	});
	$this.status = initialData.status;
};

var GameObjectPool = function(assetPool, data) {
	var _gameObjectDataMap = {};
	$.each(data, function(group, groupDataGameObject) {
		$.each(groupDataGameObject, function(gameObjectKey, data) {
			var cls = group + '/' + gameObjectKey;
			_gameObjectDataMap[cls] = data;
		});
	});
	this.createGameObject = function(cls, initial_data) {
		return new GameObject(this, assetPool, _gameObjectDataMap[cls], initial_data);
	}
};