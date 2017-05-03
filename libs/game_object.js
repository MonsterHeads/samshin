SS.GameObject = function(application, classData, instanceData) {
	var $this = this;
	var _app = application;
	
	var _x = 0;
	var _y = 0;
	var _z = 0;
	if( instanceData.hasOwnProperty('x') ) { _x = instanceData.x; }
	if( instanceData.hasOwnProperty('y') ) { _y = instanceData.y; }
	if( instanceData.hasOwnProperty('z') ) { _z = instanceData.z; }
	var _width = 0;
	var _height = 0;
	var _hitboxMap = {};

	var _statusMap = {};
	var _data = {};
	var _status = '';
	var _statusStartTime = -1;
	var _childMap = {};
	var _childList = [];
	var _observeCategoryMap = {'position':{}, 'size':{}, 'status':{},};
	var _observerMap = {}; // GroupMap > TypeMap > InstanceList

	var _updateBoxData = function(data) {
		if( !data ) return;
		var beforeWidth, beforeHeight;
		var widthUpdated = false;
		var heightUpdated = false;
		if( data.hasOwnProperty('width') ) {
			beforeWidth = _width;
			_width = data.width;
			widthUpdated = true;
		}
		if( data.hasOwnProperty('height') ) {
			beforeHeight = _height;
			_height = data.height;
			heightUpdated = true;
		}

		$.each(data.hitboxMap, function(type, hitboxList) {
			if( hitboxList && hitboxList instanceof Array && 0 < hitboxList.length ) {
				_hitboxMap[type] = hitboxList;
			} else {
				delete _hitboxMap[type];
			}
		});
		if( widthUpdated || heightUpdated ) {
			_hitboxMap['ui'] = {'x':0, 'y':0, 'width':_width, 'height':_height};
			if( widthUpdated ) $this.fireEvent('size', 'valueChanged', {'propertyName':'width', 'before':beforeWidth, 'after':_width});
			if( heightUpdated ) $this.fireEvent('size', 'valueChanged', {'propertyName':'height', 'before':beforeHeight, 'after':_height});
		}
	};
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
		child.addObserver('__parent', function(evt) {
				switch(evt.data.propertyName) {
				case 'y': case 'height': case 'z': // re-sort z-order
					if( evt.data.before > evt.data.after ) {
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
		);
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
			_updateBoxData(_statusMap[_status].init.apply($this,[_app]))
		},
	});
	Object.defineProperty(this, 'data', {
		'get':function() { return _data; },
		'set':function(data) { _data = data;},
	});
	Object.defineProperty(this, 'x', {
		'get':function() { return _x; },
		'set':function(x) { $this.fireEvent('position', 'valueChanged', {'propertyName':'x', 'before':_x, 'after':x}); _x = x;},
	});
	Object.defineProperty(this, 'y', {
		'get':function() { return _y; },
		'set':function(y) { $this.fireEvent('position', 'valueChanged', {'propertyName':'y', 'before':_y, 'after':y}); _y = y;},
	});
	Object.defineProperty(this, 'z', {
		'get':function() { return _z; },
		'set':function(z) { $this.fireEvent('position', 'valueChanged', {'propertyName':'z', 'before':_z, 'after':z}); _z = z;},
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _height; },
	});
	this.hitboxList = function(type) {
		return _hitboxMap[type];
	}
	this.fireEvent = function(category, type, data) {
		if( type == 'valueChanged' && data.before == data.after ) {
			return false;
		}
		var observerList = [];
		$.each(_observeCategoryMap[category], function(group) {
			$.each(_observerMap[group][type], function(idx, observer) {observerList.push(observer);});
		});
		$.each(_observeCategoryMap['__all'], function(group) {
			$.each(_observerMap[group]['__all'], function(idx, observer) {observerList.push(observer);});
		});
		setTimeout(function(){
			$.each(observerList, function(idx, observer) {
				observer.apply($this, [{'category':category, 'type':type, 'data':data}]);
			});
		}, 0);
	};
	this.addObserver = function(group, observer, categories) {
		var categoryToObserve = {};
		if( !categories || categories.length == 0 ) categories = ['__all'];
		for( var i=0; i<categories.length; i++ ) {
			categoryToObserve[categories[i]] = true;
		}
		if( !_observerMap.hasOwnProperty(group) ) {
			_observerMap[group] = {};
		}
		var categoryMap = _observerMap[group];
		$.each(categoryToObserve, function(category) {
			if( !_observeCategoryMap.hasOwnProperty(category) ) {
				_observeCategoryMap[category] = {};
			}
			_observeCategoryMap[category][group] = true;
			if( !categoryMap.hasOwnProperty(category) ) {
				categoryMap[category] = [];
			}
			categoryMap[category].push(observer);
		});
	};
	this.removeObserverGroup = function(group) {
		if( _observerMap.hasOwnProperty(group) ) {
			delete _observerMap[group];
		}
		$.each(_observeCategoryMap, function(category, groupMap) {
			if( groupMap.hasOwnProperty(group) ) {
				delete groupMap[group];
			}
		});
	}

	this.hitCheck = function(otherObject, type) {
		var o = otherObject;
		if( $this === o ) return false;
		var result = false;
		$.each($this.hitboxList(type), function(idx, a) {
			$.each(o.hitboxList(type), function(idx, b) {
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
	this.hitCheckWithChildren = function(gameObject, type) {
		if( 0 == gameObject.hitboxList.length ) return false;
		var result = false;
		$.each(_childList, function(idx, childWrap) {
			if( childWrap.inst.hitCheck(gameObject, type) ) {
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
			_updateBoxData(statusBoxData);
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