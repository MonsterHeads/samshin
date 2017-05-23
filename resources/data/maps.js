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
				'status':'tv01', 'x':28, 'y':40, 'z':1
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
		'main':{
			'cls':'/characters/main',
			'data':{
				'status':'down_stop', 'x':72, 'y':100, 'z':1,
				'children':{
					'emoticon':{
						'cls':'/characters/emoticon',
						'data':{
							'status':'none', 'x':0, 'y':-18, 'z':1, 'xOrigin':'center', 'yOrigin':'top'
						},
					},
				},

			},
		},
	},
	'modal': {
		'textDialogTop': {
			'cls': '/ui/dialog',
			'data': {
				'status':'default', 'x':0, 'y':10, 'z':1, 'xOrigin':'center', 'yOrigin':'top', 'hide':true,
			}
		},
		'textDialogBottom': {
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