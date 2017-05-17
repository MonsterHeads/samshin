var txt = $.extend({}, txt, {
	'tutorial.room01.scene01.01':'아르바이트가 끝난 후 아무도 없는 집으로 돌아오는 건 역시 외로운 일이다.',
	'tutorial.room01.scene01.02':'얼마 전만 해도 집에 돌아오면 할아버지가 나를 기다리고 계셨는데.',
	'tutorial.room01.scene01.03':'',

});

var tutorial_room01_scene01 = (function(){
	var Scene = {};
	var $this;
	var _timeline;

	Scene.init = function() {
		$this = this;
		var blackLayer = $this.uiObject('blackLayer');
		var character = $this.gameObject('doctorW');
		var textDialog = $this.modalObject('textDialog');

		var tl01 = new SS.helper.Timeline();
		var uiObjectClick = undefined;
		tl01.now(character, {'status':'up_stop', 'x':72, 'y':170});
		// tl01.now(blackLayer,{'hide':false,});
		// tl01.animate(blackLayer, 3000, {'opacity':{'begin':1,'end':0,'easing':SS.helper.Easing.easeInQuad}});
		// tl01.now(blackLayer,{'hide':true});
		tl01.now(character, {'status':'up_walk'});
		tl01.animate(character, 2200, {'y':{'begin':170,'end':110}});
		tl01.now(character, {'status':'up_stop'});
		tl01.wait(700);
		tl01.call(function(){
			textDialog.hide = false;
			$this.modal = true;
		});
		tl01.waitFunc(function(resolver){
			uiObjectClick = function() {
				textDialog.hide = true;
				$this.modal = false;
				resolver();
			};
		});
		tl01.call(function(){
			console.log('finished');
		});
		tl01.start();
		_timeline = tl01;

		$this.modalObject().on('mouseup', function(evt){
			if( uiObjectClick ) uiObjectClick();
			uiObjectClick = undefined;
		});
	};
	Scene.keyboardEventListener = function() {

	};
	Scene.update = function(t, view_width, view_height) {
		_timeline.update(t);
	};
	return Scene;
})();

var room01_default_scene = (function() {
	var $this;
	var _character;
	var _characterStartPosition;
	var _statusStartTime = -1;
	var _keyPressed = -1;
	var Scene = {};

	var setHoverCursorForNearCharacter = function(gameObject, hoverStatus) {
		var mouseOver = false;
		var checkNearAndSet = function() {
			var dist = Math.max(gameObject.width, gameObject.height)/2 + Math.max(_character.width, _character.height)/2;
			var obj = gameObject;
			var p1 = {'x':obj.x+obj.width/2, 'y':obj.y+obj.height/2,};
			while( obj.parent && obj.parent != _character.parent ) {
				obj = obj.parent;
				p1.x += obj.x;
				p1.y += obj.y;
			}
			var p2 = {'x':_character.x+_character.width/2, 'y':_character.y+_character.height/2,};
			if( !mouseOver ) return;
			if( obj.parent && SS.helper.HitChecker.pointDistance(p1, p2, dist) ) {
				gameObject.data.nearCharacter = true;
				$this.app.cursor.status=hoverStatus;
			} else {
				gameObject.data.nearCharacter = false;
				$this.app.cursor.status='normal';
			}
		}
		_character.addObserver('nearCursorCheck', function(evt){checkNearAndSet();}, ['positionChanged']);
		gameObject.addObserver('nearCursorCheck', function(evt){checkNearAndSet();}, ['positionChanged']);
		gameObject.on('mouseenter', function(evt) {mouseOver = true; checkNearAndSet();});
		gameObject.on('mousemove', function(evt) {mouseOver = true; checkNearAndSet();});
		gameObject.on('mouseleave', function(evt) {mouseOver = false; $this.app.cursor.status='normal';});
	}
	var checkAndChangeToWalk = function(t, status, axis, plus) {
		if( status != _character.status ) {
			_character.status = status;
			_characterStartPosition = {'x':_character.x, 'y':_character.y};
			_statusStartTime = t;
			temp =0;
		}
		var delta = (t-_statusStartTime)/35;
		if( !plus ) delta = 0 - delta;
		var org = _character[axis];
		var newValue = Math.floor(_characterStartPosition[axis]+delta);
		if( newValue != _character[axis] ) {
			_character[axis] = newValue;
			var hit = false;
			var checkFunc = function(idx, gameObject) {
				if( _character == gameObject ) return true;
				if( gameObject.hitCheckForBoxList('move', _character.hitboxList('move')) ) {
					hit = true;
					return false;
				}
			};
			if( !hit ) $this.eachTileObject(true, checkFunc);
			if( !hit ) $this.eachGameObject(true, checkFunc);
			if( hit ) {
				_character[axis] = org;
				_statusStartTime = t;
				_characterStartPosition = {'x':_character.x, 'y':_character.y};
			}
		}
	};
	Scene.init = function() {
		$this = this;

		_character = $this.gameObject('doctorW');
		_characterStartPosition = {'x':_character.x, 'y':_character.y};

		var tv = $this.gameObject('tv');
		setHoverCursorForNearCharacter(tv, 'action');

		var stackbook = $this.gameObject('teatable').child('stackbook');
		setHoverCursorForNearCharacter(stackbook, 'action');
		stackbook.on('mouseup', function(evt){
			if( stackbook.data.nearCharacter ) {
				$this.uiObject('textDialog').hide = false;
				$this.modal = true;
			}
		});
	};
	Scene.keyboardEventListener = function(t, type, evt) {
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
	Scene.update = function(t, view_width, view_height) {
		if( 0 > _keyPressed ) {
			switch(_character.status) {
			case 'down_walk': _character.status = 'down_stop'; break;
			case 'up_walk': _character.status = 'up_stop'; break;
			case 'left_walk': _character.status = 'left_stop'; break;
			case 'right_walk': _character.status = 'right_stop'; break;
			}
		} else {
			switch(_keyPressed) {
			case 37:case 65: checkAndChangeToWalk(t, 'left_walk', 'x', false); break;
			case 38:case 87: checkAndChangeToWalk(t, 'up_walk', 'y', false); break;
			case 39:case 68: checkAndChangeToWalk(t, 'right_walk', 'x', true); break;
			case 40:case 83: checkAndChangeToWalk(t, 'down_walk', 'y', true); break;
			}
		}				
	};
	return Scene;
})();

var tutorial_room01_map_data = {
	'objects': {
		'citywindow1':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'citywindow', 'x':35, 'y':20, 'z':1
			},
		},
		'citywindow2':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'citywindow', 'x':120, 'y':20, 'z':1
			},
		},
		'wallshelf':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'wallshelf', 'x':70, 'y':18, 'z':1
			},
		},
		'tv':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'tv', 'x':24, 'y':40, 'z':1
			},
		},
		'tableandlamp':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'tableandlamp', 'x':90, 'y':40, 'z':1
			},
		},
		'teatable':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'teatable', 'x':25, 'y':72, 'z':1,
				'children':{
					'stackbook':{
						'cls':'/furnitures/room01',
						'data':{
							'status':'stackbook', 'x':25, 'y':5, 'z':1
						},
					},
				},
			},
		},
		'couch':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'couch', 'x':25, 'y':100, 'z':1
			},
		},
		'diningtable':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'diningtable', 'x':110, 'y':120, 'z':1
			},
		},
		'chair':{
			'cls':'/furnitures/room01',
			'data':{
				'status':'chair', 'x':125, 'y':145, 'z':1
			},
		},
		'doctorW':{
			'cls':'/characters/doctor_w',
			'data':{
				'status':'down_stop', 'x':72, 'y':100, 'z':1
			},
		},
	},
	'modal': {
		'textDialog': {
			'cls': '/ui/dialog',
			'data': {
				'status':'default', 'x':0, 'y':10, 'z':1, 'xOrigin':'center', 'yOrigin':'bottom', 'hide':true,
			}
		},
	},
	'ui': {
		'blackLayer': {
			'cls': '/ui/blackLayer',
			'data': {
				'status':'default', 'x':0, 'y':0, 'z':10, 'hide':true,
			}
		},
	},
	'tiles': {
		101:{'cls':'/tiles/room01', 'status':'101'},
		201:{'cls':'/tiles/room01', 'status':'201'},
		202:{'cls':'/tiles/room01', 'status':'202'},
		203:{'cls':'/tiles/room01', 'status':'203'},
		204:{'cls':'/tiles/room01', 'status':'204'},
		205:{'cls':'/tiles/room01', 'status':'205'},
		206:{'cls':'/tiles/room01', 'status':'206'},
		207:{'cls':'/tiles/room01', 'status':'207'},
		208:{'cls':'/tiles/room01', 'status':'208'},
		209:{'cls':'/tiles/room01', 'status':'209'},
		210:{'cls':'/tiles/room01', 'status':'210'},
		211:{'cls':'/tiles/room01', 'status':'211'},
		212:{'cls':'/tiles/room01', 'status':'212'},
		215:{'cls':'/tiles/room01', 'status':'215'},
		216:{'cls':'/tiles/room01', 'status':'216'},
		999:{'cls':'/tiles/room01', 'status':'999'},
	},
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
};