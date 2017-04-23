var data_maps = {
'room01': {
	'width':11, 'height':14,
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
	[ -1, -1, -1,204,101,101,101,205, -1, -1, -1],
	[ -1, -1, -1,211,207,207,207,212, -1, -1, -1],
	],


	'scenes': {
'default': function(world) {
	var _center_x = world.getWidth()/2;
	var _center_y = world.getHeight()/2;
	var _dx = 0;
	var _dy = 0;
	var eventCallback = function(type, evt) {
		switch(type) {
		case 'keydown':
			switch(evt.keyCode) {
			case 37: _dx -= 1; break;
			case 38: _dy -= 1; break;
			case 39: _dx += 1; break;
			case 40: _dy += 1; break;
			}
			switch(evt.keyCode) {
			case 37: case 38: case 39: case 40: evt.preventDefault();
			}
			break;
		}
	}
	var doAction = function(t, view_width, view_height) {
		_center_x += _dx*2;
		_center_y += _dy*2;
		_center_x = Math.min(view_width/2, Math.max(_center_x, world.getWidth()-view_width/2));
		_center_y = Math.min(view_height/2, Math.max(_center_y, world.getHeight()-view_height/2));
		world.setCenter(_center_x, _center_y);
		_dx = 0;
		_dy = 0;
	};
	return {'eventCallback': eventCallback, 'doAction': doAction};
},
	}


}
};