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

	'scenes': { // this == world
		'default': function() {
			var _dx = 0;
			var _dy = 0;
			var init = function() {
				_dx = 0;
				_dy = 0;
				this.setCenter(this.getWidth()/2, this.getHeight()/2);
			}
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
			var beforeRender = function(t, view_width, view_height) {
				var center = this.getCenter();
				center.x += _dx*2;
				center.y += _dy*2;
				center.x = Math.min(view_width/2, Math.max(center.x, this.getWidth()-view_width/2));
				center.y = Math.min(view_height/2, Math.max(center.y, this.getHeight()-view_height/2));
				this.setCenter(center.x, center.y);
				_dx = 0;
				_dy = 0;
			};
			return {'init':init, 'eventCallback': eventCallback, 'beforeRender': beforeRender};
		},
	}


}
};