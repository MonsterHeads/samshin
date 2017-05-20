SS.priv.gameObjectId = 1;

SS.GameObject = function(application, classData, instanceData) {
	var $this = this;
	var _id = SS.priv.gameObjectId++;
	var _app = application;
	var defaultInstanceData = {'x':0, 'y':0, 'z':0, 'xOrigin':'left', 'yOrigin':'top', 'hide':false,};
	instanceData = $.extend({}, defaultInstanceData, instanceData);

	var _x = instanceData.x;
	var _y = instanceData.y;
	var _z = instanceData.z;
	var _position = {'left':0,'right':0,'top':0,'bottom':0};
	var _xOrigin = instanceData.xOrigin;
	var _yOrigin = instanceData.yOrigin;
	var _hide = instanceData.hide;
	var _opacity = 1;

	var _width = 0;
	var _height = 0;
	var _hitboxMap = {};
	var _shiftedHitboxMap = {};

	var _parent;
	var _statusMap = {};
	var _data = {};
	
	var _status = '';
	var _statusStartTime = -1;
	var _childMap = {};
	var _childList = [];
	var _observeTypeMap = {};
	var _observerMap = {}; // GroupMap > TypeMap > InstanceList
	var _passMouseEvent = false;

	var _updatePositionX = function() {
		var left = $this.x;
		if( $this.parent ) {
			switch(_xOrigin) {
				case 'center': left = ($this.parent.width-_width)/2 + $this.x; break;
				case 'right': left = $this.parent.width-_width-$this.x; break;
				case 'left':default: break;
			}
		}
		var right = left + _width;
		_position.left = left;
		_position.right = right;
	};
	var _updatePositionY = function() {
		var top = $this.y;
		if( $this.parent ) {
			switch(_yOrigin) {
				case 'center': top = ($this.parent.height-_height)/2 + $this.y; break;
				case 'bottom': top = $this.parent.height-_height-$this.y; break;
				case 'top':default: break;
			}
		}
		var bottom = top + _height;
		_position.top = top;
		_position.bottom = bottom;
	};
	var _updateBoxData = function(data) {
		if( !data ) return;
		var beforeWidth, beforeHeight;
		var widthUpdated = false;
		var heightUpdated = false;
		if( data.hasOwnProperty('width') && _width != data.width) {
			beforeWidth = _width;
			_width = data.width;
			_updatePositionX();
			widthUpdated = true;
		}
		if( data.hasOwnProperty('height') && _height != data.height) {
			beforeHeight = _height;
			_height = data.height;
			_updatePositionY();
			heightUpdated = true;
		}

		$.each(data.hitboxMap, function(type, hitboxList) {
			if( _shiftedHitboxMap.hasOwnProperty(type) ) {
				delete _shiftedHitboxMap[type];
			}
			if( hitboxList && hitboxList instanceof Array && 0 < hitboxList.length ) {
				_hitboxMap[type] = hitboxList;
			} else {
				delete _hitboxMap[type];
			}
		});
		if( widthUpdated || heightUpdated ) {
			_hitboxMap['ui'] = [{'x':0, 'y':0, 'width':_width, 'height':_height}];
			delete _shiftedHitboxMap['ui'];
			if( widthUpdated ) $this.fireEvent('sizeChanged', {'propertyName':'width', 'before':beforeWidth, 'after':_width});
			if( heightUpdated ) $this.fireEvent('sizeChanged', {'propertyName':'height', 'before':beforeHeight, 'after':_height});
		}
	};
	Object.defineProperty(this, 'id', {
		'value':_id, 'writable':false,
	});
	Object.defineProperty(this, 'parent', {
		'get':function() { return _parent; },
	});
	this.priv = {
		'setParent': function(parent) {
			if( _parent != parent ) {
				if( _parent ) {
					_parent.removeObserverGroup('__child_'+_id);
				}
				if( _parent != parent && parent ) {
					parent.addObserver('__child_'+_id, function(evt) {
						switch(evt.data.propertyName) {
							case 'x': case 'width': _shiftedHitboxMap = {}; _updatePositionX(); break;
							case 'y': case 'height': _shiftedHitboxMap = {}; _updatePositionY(); break;
						}
					}, ['positionChanged', 'sizeChanged']);
				}
			}
			_parent = parent;
			_shiftedHitboxMap = {};
			_updatePositionX();
			_updatePositionY();
		}
	};
	this.removeChild = function(childName) {
		if( _childMap.hasOwnProperty(childName) ) {
			var childWrap = _childMap[childName];
			childWrap.inst.priv.setParent(undefined);
			_childList.splice(childWrap.idx, 1);
			delete _childMap[childName];
			$this.fireEvent('childRemoved', {'childName':childName, 'child':childWrap.inst});
			return childWrap.inst;
		}
	}
	this.setChild = function(childName, child) {
		var compareZOrder = function(childA, childB) {
			if( childA.z < childB.z  ) return -1;
			else if( childA.z > childB.z ) return 1;
			if( childA.bottom < childB.bottom ) return -1;
			else if( childA.bottom > childB.bottom ) return 1;
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
		if( _childMap.hasOwnProperty(childName) ) {
			$this.removeChild(childName);
		}
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
			child.priv.setParent($this);
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
		}, ['positionChanged', 'sizeChanged']);
		$this.fireEvent('childSet', {'childName':childName, 'child':child});
	};
	this.child = function(childName) {
		return _childMap[childName].inst;
	};
	this.eachChild = function() {
		var reverse = false;
		var eachFunction = function(idx, child){};
		switch(arguments.length) {
		case 0:
			return;
		case 1:
			eachFunction = arguments[0];
			break;
		case 2:
		default:
			reverse = arguments[0];
			eachFunction = arguments[1];
		}
		var i;
		if( reverse ) {
			for( i=_childList.length-1; i>=0; i-- ) {
				if( false === eachFunction.apply(_childList[i].inst, [i, _childList[i].inst]) ) {
					break;
				}
			}
		} else {
			for( i=0; i<_childList.length; i++ ) {
				if( false === eachFunction.apply(_childList[i].inst, [i, _childList[i].inst]) ) {
					break;
				}
			}
		}
	}
	Object.defineProperty(this, 'passMouseEvent', {
		'get':function() { return _passMouseEvent; },
		'set':function(passMouseEvent) { _passMouseEvent = passMouseEvent; },
	});
	Object.defineProperty(this, 'hide', {
		'get':function() { return _hide; },
		'set':function(hide) { _hide = hide; },
	});
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
	});
	Object.defineProperty(this, 'x', {
		'get':function() { return _x; },
		'set':function(x) {
			var before = _x;
			_x = x;
			_shiftedHitboxMap = {};
			_updatePositionX();
			$this.fireEvent('positionChanged', {'propertyName':'x', 'before':before, 'after':_x});
		},
	});
	Object.defineProperty(this, 'y', {
		'get':function() { return _y; },
		'set':function(y) {
			var before = _y;
			_y = y;
			_shiftedHitboxMap = {};
			_updatePositionY();
			$this.fireEvent('positionChanged', {'propertyName':'y', 'before':before, 'after':_y});
		},
	});
	Object.defineProperty(this, 'z', {
		'get':function() { return _z; },
		'set':function(z) {
			var before = _z;
			_z = z;
			$this.fireEvent('positionChanged', {'propertyName':'z', 'before':before, 'after':_z});
		},
	});
	Object.defineProperty(this, 'opacity', {
		'get':function() { return _opacity; },
		'set':function(opacity) { _opacity=Math.max(0, Math.min(opacity, 1)); },
	});
	Object.defineProperty(this, 'width', {
		'get':function() { return _width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _height; },
	});
	Object.defineProperty(this, 'left', {
		'get':function() { return _position.left; },
	});
	Object.defineProperty(this, 'right', {
		'get':function() { return _position.right; },
	});
	Object.defineProperty(this, 'top', {
		'get':function() { return _position.top; },
	});
	Object.defineProperty(this, 'bottom', {
		'get':function() { return _position.bottom; },
	});
	this.hitboxList = function(type) {
		if( _hide ) return [];
		if( !_hitboxMap.hasOwnProperty(type) ) return undefined;
		if( !_shiftedHitboxMap.hasOwnProperty(type) ) {
			_shiftedHitboxMap[type] = [];
			$.each(_hitboxMap[type], function(idx, box) {
				_shiftedHitboxMap[type].push(SS.helper.HitChecker.shiftBox(box, $this.left, $this.top));
			})
		}
		return _shiftedHitboxMap[type];
	}
	this.fireEvent = function(type, data) {
		switch(type) {
			case 'positionChanged':
			case 'sizeChanged':
				if( data.before == data.after ) return false;
		}
		var observerList = [];
		$.each(_observeTypeMap[type], function(group) {
			$.each(_observerMap[group][type], function(idx, observer) {observerList.push(observer);});
		});
		$.each(_observeTypeMap['__all'], function(group) {
			$.each(_observerMap[group]['__all'], function(idx, observer) {observerList.push(observer);});
		});
		$.each(observerList, function(idx, observer) {
			observer.apply($this, [{'type':type, 'data':data}]);
		});
	};
	this.addObserver = function(group, observer, types) {
		var typesToObserve = {};
		if( !types || types.length == 0 ) types = ['__all'];
		for( var i=0; i<types.length; i++ ) {
			typesToObserve[types[i]] = true; // remove duplicated
		}
		if( !_observerMap.hasOwnProperty(group) ) {
			_observerMap[group] = {};
		}
		var typeMap = _observerMap[group];
		$.each(typesToObserve, function(type) {
			if( !_observeTypeMap.hasOwnProperty(type) ) {
				_observeTypeMap[type] = {};
			}
			_observeTypeMap[type][group] = true;
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
		$.each(_observeTypeMap, function(type, groupMap) {
			if( groupMap.hasOwnProperty(group) ) {
				delete groupMap[group];
			}
		});
	}
	this.on = function(type, observer) {
		$this.addObserver('__on_method', observer, [type]);
	}
	this.off = function(type) {
		var group = '__on_method';
		if( _observerMap.hasOwnProperty(group) ) {
			if( _observerMap[group].hasOwnProperty(type) ) {
				delete  _observerMap[group][type];
			}
		}
		if( _observeTypeMap.hasOwnProperty(type) ) {
			if( _observeTypeMap[type].hasOwnProperty(group) ) {
				delete  _observeTypeMap[type][group];	
			}
		}
	}
	this.hitCheckForBoxList = function(type, boxList) {
		var result = false;
		$.each($this.hitboxList(type), function(idx, a) {
			$.each(boxList, function(idx, b) {
				if( SS.helper.HitChecker.box2box(a, b) ) {
					result = true;
					return false;
				}
			});
		});
		return result;
	}
	this.hitCheckForPoint = function(type, point) {
		var result = false;
		$.each($this.hitboxList(type), function(idx, a) {
			if( SS.helper.HitChecker.point2box(point, a) ) {
				result = true;
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
		if( _hide ) return;
		var statusData = _statusMap[_status];
		ctx.save();
		if( _opacity != 1 ) {
			ctx.globalAlpha = _opacity;
		}
		ctx.translate($this.left, $this.top);
		statusData.render.apply($this, [t-_statusStartTime, ctx]);
		if( _app.config.debug.hitbox ) {
			$.each(_hitboxMap, function(type, hitboxList) {
				if( type == 'ui' ) return true;
				$.each(hitboxList, function(idx, hitbox) {
					ctx.fillStyle = 'rgba(50,200,50,0.3)';
					ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
					ctx.beginPath();
					ctx.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
					ctx.lineWidth = 0.3;
					ctx.strokeStyle = 'rgba(255,0,0,1)';
					ctx.stroke();
					ctx.closePath();
				})
			});
		}
		$.each(_childList, function(idx, childWrap) {
			childWrap.inst.render(t, ctx);
		});
		ctx.restore();
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