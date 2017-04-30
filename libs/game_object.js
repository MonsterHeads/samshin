var GameObject = function(application, classData, initialData) {
	var $this = this;
	var _app = application;
	var _statusMap = {};
	var _boxData = {'width':0, 'height':0, 'hitboxList':[]};
	var _x = initialData.x;
	var _y = initialData.y;
	var _z = 0;
	if( initialData.hasOwnProperty('z') ) {
		_z = initialData.z;
	}

	var _data = {};
	var _status;
	var _statusStartTime = -1;
	var _childMap = {};
	var _childList = [];
	var _observeTypes = {'position':{}, 'size':{}, 'status':{},};
	var _observerMap = {}; // GroupMap > TypeMap > InstanceList

	this.setChild = function(childName, child) {
		var insertIdx = 0;
		for(var idx=0; idx<_childList.length; idx++) {
			var childWrap = _childList[idx];
			if( child.z > childWrap.inst.z  ) continue;
			if( child.z < childWrap.inst.z  ) break;
			if( child.y + child.height < childWrap.inst.y + childWrap.inst.height ) break;
		}
		insertIdx = idx;
		_childList.splice(insertIdx, 0, {'inst':child, 'name':childName});
		_childMap[childName] = {'inst':child, 'idx':insertIdx};
		child.removeObserverGroup('__parent');
		child.addObserver('__parent', {
			'valueChanged': function(object, propertyName, before, after) {
				switch(propertyName) {
				case 'y': case 'height': case 'z': // re-sort z-order
				if( before > after ) {
					var curIdx = _childMap[childName].idx;
					for(var idx=curIdx-1; idx>=0; idx--) {
						var childWrap = _childList[idx];
						if( child.z < childWrap.inst.z  ) continue;
						if( child.z > childWrap.inst.z  ) break;
						if( child.y + child.height >= childWrap.inst.y + childWrap.inst.height ) break;
					}
					if( idx+1 != curIdx ) {
						var cur = _childList[curIdx];
						_childMap[childName].idx = idx+1;
						_childList.splice(curIdx,1);
						_childList.splice(idx+1,0, cur);
					}
				} else {
					var curIdx = _childMap[childName].idx;
					for(var idx=curIdx+1; idx<_childList.length; idx++) {
						var childWrap = _childList[idx];
						if( child.z > childWrap.inst.z  ) continue;
						if( child.z < childWrap.inst.z  ) break;
						if( child.y + child.height < childWrap.inst.y + childWrap.inst.height ) break;
					}
					if( idx-1 != curIdx ) {
						var cur = _childList[curIdx];
						_childMap[childName].idx = idx-1;
						_childList.splice(curIdx,1);
						_childList.splice(idx-1,0, cur);
					}
				}
				}
			}
		});
	};
	this.child = function(childName) {
		return _childMap[childName].inst;
	};
	Object.defineProperty(this, 'status', {
		'get': function() { return _status; },
		'set': function(status) {
			if( !_statusMap.hasOwnProperty(status) ) {
				return false;
			}
			_status = status;
			_statusStartTime = -1;
			var statusBoxData = _statusMap[_status].init.apply($this,[_app]);
			if( statusBoxData.hasOwnProperty('width') ) {
				fireObserveEvent('size', 'width', _boxData.width, statusBoxData.width);
			}
			if( statusBoxData.hasOwnProperty('height') ) {
				fireObserveEvent('size', 'height', _boxData.height, statusBoxData.height);
			}
			$.extend(_boxData, statusBoxData);			
		},
	});
	Object.defineProperty(this, 'data', {
		'get':function() { return _data; },
		'set':function(data) { _data = data;},
	});
	Object.defineProperty(this, 'x', {
		'get':function() { return _x; },
		'set':function(x) { fireObserveEvent('position', 'x', _x, x); _x = x;},
	});
	Object.defineProperty(this, 'y', {
		'get':function() { return _y; },
		'set':function(y) { fireObserveEvent('position', 'y', _y, y); _y = y;},
	});
	Object.defineProperty(this, 'z', {
		'get':function() { return _z; },
		'set':function(z) { fireObserveEvent('position', 'z', _z, z); _z = z;},
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _boxData.width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _boxData.height; },
	});
	Object.defineProperty(this, 'hitboxList', {
		'get':function() { return _boxData.hitboxList; },
	});
	var fireObserveEvent = function(type, propertyName, before, after) {
		if( before === after ) return;
		$.each(_observeTypes[type], function(group) {
			$.each(_observerMap[group][type], function(idx, observer) {
				setTimeout(function(){observer.valueChanged($this, propertyName, before, after);}, 0);
			});
		});
	};
	this.addObserver = function(group, observer, types) {
		var typeToObserve = {};
		if( !types || types.length == 0 ) types = Object.keys(_observeTypes);
		for( var i=0; i<types.length; i++ ) {
			if( _observeTypes.hasOwnProperty(types[i]) ) {
				typeToObserve[types[i]] = true;
			}
		}
		if( !_observerMap.hasOwnProperty(group) ) {
			_observerMap[group] = {};
		}
		var typeMap = _observerMap[group];
		$.each(typeToObserve, function(type) {
			_observeTypes[type][group] = true;
			if( !typeMap.hasOwnProperty(type) ) {
				typeMap[type] = [];
			}
			typeMap[type].push(observer);
		});
	};
	this.removeObserverGroup = function(group) {
		if( _observerMap.hasOwnProperty(group) ) {
			delete _observerMap[group];
		}
		$.each(_observeTypes, function(type, groupMap) {
			if( groupMap.hasOwnProperty(group) ) {
				delete groupMap[group];
			}
		});
	}

	this.hitCheck = function(otherObject) {
		var o = otherObject;
		if( $this === o ) return false;
		var result = false;
		$.each($this.hitboxList, function(idx, a) {
			$.each(o.hitboxList, function(idx, b) {
				var ax1=$this.x+a.x, ax2=$this.x+a.x+a.width-1, ay1=$this.y+a.y, ay2=$this.y+a.y+a.height-1;
				var bx1=o.x+b.x, bx2=o.x+b.x+b.width-1, by1=o.y+b.y, by2=o.y+b.y+b.height-1;
				if( ax1<=bx2 && ax2>=bx1 && ay1<=by2 && ay2>=by1 ) {
					result = true;
					return false;	
				} 
			});
		});
		return result;
	}
	this.hitCheckWithChildren = function(gameObject) {
		if( 0 == gameObject.hitboxList.length ) return false;
		var result = false;
		$.each(_childList, function(idx, childWrap) {
			if( childWrap.inst.hitCheck(gameObject) ) {
				result = childWrap.inst;
				return false;
			}
		});
		return result;
	}
	this.update = function(t) {
		if( 0 > _statusStartTime ) {
			_statusStartTime = t;
		}
		var statusData = _statusMap[_status];
		var statusBoxData = statusData.update.apply($this, [t-_statusStartTime]);
		if( statusBoxData.hasOwnProperty('width') ) {
			fireObserveEvent('size', 'width', _boxData.width, statusBoxData.width);
		}
		if( statusBoxData.hasOwnProperty('height') ) {
			fireObserveEvent('size', 'height', _boxData.height, statusBoxData.height);
		}
		$.extend(_boxData, statusBoxData);
		$.each(_childList, function(idx, childWrap) {
			childWrap.inst.update(t);
		});
	}
	this.render = function(t, ctx) {
		if( 0 > _statusStartTime ) {
			_statusStartTime = t;
		}
		var statusData = _statusMap[_status];
		statusData.render.apply($this, [t-_statusStartTime, ctx]);
		if( _app.config.debug.hitbox ) {
			$.each(_boxData.hitboxList, function(idx, hitbox) {
				ctx.fillStyle = 'rgba(50,200,50,0.3)';
				ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
				ctx.beginPath();
				ctx.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
				ctx.lineWidth = 0.3;
				ctx.strokeStyle = 'rgba(255,0,0,1)';
				ctx.stroke();
				ctx.closePath();
			});
		}
		$.each(_childList, function(idx, childWrap) {
			ctx.save();
			ctx.translate(childWrap.inst.x, childWrap.inst.y);
			childWrap.inst.render(t, ctx);
			ctx.restore();
		});
	};
	$.each(classData, function(status, statusData) {
		_statusMap[status] = {
			'init': statusData.init,
			'update': statusData.update,
			'render': statusData.render,
		};
	});
	$.each(initialData.children, function(name, child_data) {
		var child = _app.createGameObject(child_data.cls, child_data);
		$this.setChild(name, child);
	});
	$this.status = initialData.status;
};

SS.priv.GameObjectPool = function(application) {
	var _app = application;
	var _gameObjectDataMap = {};

	this.loadClasses = function(data) {
		$.each(data, function(group, groupDataGameObject) {
			$.each(groupDataGameObject, function(gameObjectKey, data) {
				var cls = group + '/' + gameObjectKey;
				_gameObjectDataMap[cls] = data;
			});
		});
	};
	this.createGameObject = function(cls, initial_data) {
		return new GameObject(_app, _gameObjectDataMap[cls], initial_data);
	};
};