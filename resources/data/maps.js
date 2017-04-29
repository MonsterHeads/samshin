var data_maps = {
'room01': {
	'objects': {
		'citywindow1':{'cls':'furnitures/room01', 'status':'citywindow', 'x':35, 'y':20},
		'citywindow2':{'cls':'furnitures/room01', 'status':'citywindow', 'x':120, 'y':20},
		'wallshelf':{'cls':'furnitures/room01', 'status':'wallshelf', 'x':70, 'y':18},
		'tv':{'cls':'furnitures/room01', 'status':'tv', 'x':24, 'y':40},
		'tableandlamp':{'cls':'furnitures/room01', 'status':'tableandlamp', 'x':90, 'y':40},
		'teatable':{'cls':'furnitures/room01', 'status':'teatable', 'x':25, 'y':72,
			'children':{
				'stackbook':{'cls':'furnitures/room01', 'status':'stackbook', 'x':25, 'y':5},
			}
		},
		'couch':{'cls':'furnitures/room01', 'status':'couch', 'x':25, 'y':100},
		'diningtable':{'cls':'furnitures/room01', 'status':'diningtable', 'x':110, 'y':120},
		'chair':{'cls':'furnitures/room01', 'status':'chair', 'x':125, 'y':145},
		'doctorW':{'cls':'characters/doctor_w', 'status':'down_stop', 'x':130, 'y':100},
	},
	'tiles': {
		101:{'cls':'tiles/room01', 'status':'101'},
		201:{'cls':'tiles/room01', 'status':'201'},
		202:{'cls':'tiles/room01', 'status':'202'},
		203:{'cls':'tiles/room01', 'status':'203'},
		204:{'cls':'tiles/room01', 'status':'204'},
		205:{'cls':'tiles/room01', 'status':'205'},
		206:{'cls':'tiles/room01', 'status':'206'},
		207:{'cls':'tiles/room01', 'status':'207'},
		208:{'cls':'tiles/room01', 'status':'208'},
		209:{'cls':'tiles/room01', 'status':'209'},
		210:{'cls':'tiles/room01', 'status':'210'},
		211:{'cls':'tiles/room01', 'status':'211'},
		212:{'cls':'tiles/room01', 'status':'212'},
		215:{'cls':'tiles/room01', 'status':'215'},
		216:{'cls':'tiles/room01', 'status':'216'},
		999:{'cls':'tiles/room01', 'status':'999'},
	},
	'width':11, 'height':14,
	'ground':[
	[201,202,202,202,202,202,202,202,202,202,203],
	[204,215,215,215,215,215,215,215,215,215,205],
	[204,215,215,215,215,215,215,215,215,215,205],
	[204,216,216,216,216,216,216,216,216,216,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[204,101,101,101,101,101,101,101,101,101,205],
	[206,207,207,209,101,101,101,210,207,207,208],
	[999,999,999,204,101,101,101,205,999,999,999],
	[999,999,999,211,207,207,207,212,999,999,999],
	],

	'scenes': {
		'default': function() {
			var $this;
			var _character;
			var _characterStartPosition;
			var _statusStartTime = -1;
			var _keyPressed = -1;

			var init = function() {
				$this = this;
				$this.center.x = $this.width/2;
				$this.center.y = $this.height/2;
				_character = $this.gameObject('doctorW');
				_characterStartPosition = {'x':_character.x, 'y':_character.y};
			};
			var eventCallback = function(t, type, evt) {
				switch(type) {
				case 'keydown':
					switch(evt.keyCode) {
					case 37: case 38: case 39: case 40: case 65: case 87: case 68: case 83:
						_keyPressed = evt.keyCode;
					}
					break;
				case 'keyup':
					switch(evt.keyCode) {
					case 37: case 38: case 39: case 40: case 65: case 87: case 68: case 83:
						if( evt.keyCode == _keyPressed ) {
							_keyPressed = -1;
						}
					}
				}
			};

			var _checkAndChangeToWalk = function(t, status, axis, plus) {
				if( status != _character.status ) {
					_character.status = status;
					_characterStartPosition = {'x':_character.x, 'y':_character.y};
					_statusStartTime = t;
					temp =0;
				}
				var delta = (t-_statusStartTime)/35;
				if( !plus ) delta = 0 - delta;
				var org = _character[axis];
				_character[axis] = Math.floor(_characterStartPosition[axis]+delta);
				var result = $this.hitCheckWithChildren(_character);
				if( result ) {
					_character[axis] = org;
					_statusStartTime = t;
					_characterStartPosition = {'x':_character.x, 'y':_character.y};
				}
			};

			var beforeRender = function(t, view_width, view_height) {
				if( 0 > _keyPressed ) {
					switch(_character.status) {
					case 'down_walk': _character.status = 'down_stop'; break;
					case 'up_walk': _character.status = 'up_stop'; break;
					case 'left_walk': _character.status = 'left_stop'; break;
					case 'right_walk': _character.status = 'right_stop'; break;
					}
				} else {
					switch(_keyPressed) {
					case 37:case 65: _checkAndChangeToWalk(t, 'left_walk', 'x', false); break;
					case 38:case 87: _checkAndChangeToWalk(t, 'up_walk', 'y', false); break;
					case 39:case 68: _checkAndChangeToWalk(t, 'right_walk', 'x', true); break;
					case 40:case 83: _checkAndChangeToWalk(t, 'down_walk', 'y', true); break;
					}
				}				
			};
			return {'init':init, 'eventCallback': eventCallback, 'beforeRender': beforeRender};
		},
	}


}
};