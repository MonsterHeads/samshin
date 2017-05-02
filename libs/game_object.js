SS.GameObject = function(application, classData, instanceData) {
	var $this = this;
	var _app = application;
	var _statusMap = {};
	var _boxData = {'width':0, 'height':0, 'hitboxList':[]};
	var _x = 0;
	var _y = 0;
	var _z = 0;
	if( instanceData.hasOwnProperty('x') ) { _x = instanceData.x; }
	if( instanceData.hasOwnProperty('y') ) { _y = instanceData.y; }
	if( instanceData.hasOwnProperty('z') ) { _z = instanceData.z; }


	var _data = {};
	var _status;
	var _statusStartTime = -1;
	var _childMap = {};
	var _childList = [];
	var _observeTypes = {'position':{}, 'size':{}, 'status':{},};
	var _observerMap = {}; // GroupMap > TypeMap > InstanceList

	this.setChild = function(childName, child) {
		var compareZOrder = function(childA, childB) {
			if( childA.z < childB.z  ) return -1;
			else if( childA.z > childB.z ) return 1;
			var aBottom = childA.y + childA.height;
			var bBottom = childB.y + childB.height;
			if( aBottom < bBottom ) return -1;
			else if( aBottom > bBottom ) return 1;
			return 0;
		};
		var reindexChild = function(curIdx, targetIdx) {
			if( curIdx == targetIdx ) return;
			var cur = _childList[curIdx];
			_childList.splice(curIdx, 1);
			_childList.splice(targetIdx, 0, cur);
			var idx = Math.min(curIdx, targetIdx);
			var max = Math.max(curIdx, targetIdx);
			for( ;idx<=max; idx++ ) {
				_childList[idx].idx = idx;
			}
		};
		(function() {
			var insertIdx = 0;
			for(var idx=0; idx<_childList.length; idx++) {
				var compare = compareZOrder(child, _childList[idx].inst);
				if ( 0 > compare ) break;
			}
			insertIdx = idx;
			var childWrap = {'inst':child, 'name':childName, 'idx':insertIdx};
			_childList.splice(insertIdx, 0, childWrap);
			_childMap[childName] = childWrap;
			for( var idx=insertIdx+1; idx<_childList.length; idx++ ) {
				_childList[idx].idx = idx;
			}
		})();
		child.removeObserverGroup('__parent');
		child.addObserver('__parent', {
			'valueChanged': function(object, propertyName, before, after) {
				switch(propertyName) {
				case 'y': case 'height': case 'z': // re-sort z-order
					if( before > after ) {
						var curIdx = _childMap[childName].idx;
						for(var idx=curIdx-1; idx>=0; idx--) {
							var compare = compareZOrder(child, _childList[idx].inst);
							if( 0 <= compare ) break;
						}
						reindexChild(curIdx, idx+1);
					} else {
						var curIdx = _childMap[childName].idx;
						for(var idx=curIdx+1; idx<_childList.length; idx++) {
							var compare = compareZOrder(child, _childList[idx].inst);
							if( 0 > compare ) break;
						}
						reindexChild(curIdx, idx-1);
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
				$this.fireValueChangedEvent('size', 'width', _boxData.width, statusBoxData.width);
			}
			if( statusBoxData.hasOwnProperty('height') ) {
				$this.fireValueChangedEvent('size', 'height', _boxData.height, statusBoxData.height);
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
		'set':function(x) { $this.fireValueChangedEvent('position', 'x', _x, x); _x = x;},
	});
	Object.defineProperty(this, 'y', {
		'get':function() { return _y; },
		'set':function(y) { $this.fireValueChangedEvent('position', 'y', _y, y); _y = y;},
	});
	Object.defineProperty(this, 'z', {
		'get':function() { return _z; },
		'set':function(z) { $this.fireValueChangedEvent('position', 'z', _z, z); _z = z;},
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
	this.fireValueChangedEvent = function(type, propertyName, before, after) {
		if( before === after ) return;
		var observerList = [];
		$.each(_observeTypes[type], function(group) {
			$.each(_observerMap[group][type], function(idx, observer) {observerList.push(observer);});
		});
		$.each(_observeTypes['__all'], function(group) {
			$.each(_observerMap[group]['__all'], function(idx, observer) {observerList.push(observer);});
		});
		setTimeout(function(){
			$.each(observerList, function(idx, observer) {
				observer.valueChanged($this, propertyName, before, after);
			});
		}, 0);
	};
	this.addObserver = function(group, observer, types) {
		var typeToObserve = {};
		if( !types || types.length == 0 ) types = ['__all'];
		for( var i=0; i<types.length; i++ ) {
			typeToObserve[types[i]] = true;
		}
		if( !_observerMap.hasOwnProperty(group) ) {
			_observerMap[group] = {};
		}
		var typeMap = _observerMap[group];
		$.each(typeToObserve, function(type) {
			if( !_observeTypes.hasOwnProperty(type) ) {
				_observeTypes[type] = {};
			}
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
		if( statusData.hasOwnProperty('update') && 'function' == typeof statusData.update ) {
			var statusBoxData = statusData.update.apply($this, [t-_statusStartTime]);
			if( statusBoxData ) {
				if( statusBoxData.hasOwnProperty('width') ) {
					$this.fireValueChangedEvent('size', 'width', _boxData.width, statusBoxData.width);
				}
				if( statusBoxData.hasOwnProperty('height') ) {
					$this.fireValueChangedEvent('size', 'height', _boxData.height, statusBoxData.height);
				}
				$.extend(_boxData, statusBoxData);
			}
		}
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
	
	$.each(classData.status, function(status, statusData) {
		var obj = SS.gameObjectStatusType[statusData.type](statusData.data);
		_statusMap[status] = obj;
	});
	$.each(instanceData.children, function(name, childInstanceConfig) {
		var child = _app.createGameObject(childInstanceConfig.cls, childInstanceConfig.data);
		$this.setChild(name, child);
	});
	$this.status = instanceData.status;
};

SS.priv.GameObjectPool = function(application) {
	var _app = application;
	var _gameObjectDataMap = {};

	this.loadClasses = function(configList) {
		var processConfig = function(config, parentKey) {
			if( 'group' == config.type ) {
				processGroupConfig(config, parentKey);
			} else if('class' == config.type ) {
				processClassConfig(config, parentKey);
			}
		};
		var processGroupConfig = function(groupConfig, parentKey) {
			var currentKey = parentKey + '/' + groupConfig.name;
			$.each(groupConfig.children, function(idx, config) {
				processConfig(config, currentKey);
			});
		};
		var processClassConfig = function(classConfig, parentKey) {
			var currentKey = parentKey + '/' + classConfig.name;
			var valid = true;
			$.each(classConfig.data.status, function(statusName, statusConfig) {
				if( !SS.gameObjectStatusType.hasOwnProperty(statusConfig.type) || 'function' != typeof SS.gameObjectStatusType[statusConfig.type] ) {
					valid = false;
					return false;
				}
			});
			if( valid ) {
				_gameObjectDataMap[currentKey] = classConfig.data;
			} else {
				console.error('unknown game object status type.', currentKey, classConfig);
			}
		}
		$.each(configList, function(idx, config) {
			processConfig(config, '');
		});
	};
	this.createGameObject = function(cls, instanceData) {
		if( _gameObjectDataMap.hasOwnProperty(cls) ) {
			return new SS.GameObject(_app, _gameObjectDataMap[cls], instanceData);
		}
	};
};