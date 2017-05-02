var data_game_object_classes = 
[
{
	'type':'class',
	'name':'cursors',
	'data': {
		'status': {
			'action': {'type':'single', 'data':{'assetName':'/cursors/action', 'hitboxList':[]}},
			'normal': {'type':'single', 'data':{'assetName':'/cursors/normal', 'hitboxList':[]}},
			'search': {'type':'single', 'data':{'assetName':'/cursors/search', 'hitboxList':[]}},
			'talk':   {'type':'single', 'data':{'assetName':'/cursors/talk', 'hitboxList':[]}},
		},
	}
},
{
	'type':'group',
	'name':'tiles',
	'children':[
		{
			'type':'class',
			'name':'room01',
			'data': {
				'status': {
					'101': {'type':'tile', 'data':{'assetName':'/tiles/floor_01', 'hitCheck': false},},
					'201': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_tl', 'hitCheck': true},},
					'202': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_tm', 'hitCheck': true},},
					'203': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_tr', 'hitCheck': true},},
					'204': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_ml', 'hitCheck': true},},
					'205': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_mr', 'hitCheck': true},},
					'206': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_bl', 'hitCheck': true},},
					'207': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_bm', 'hitCheck': true},},
					'208': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_br', 'hitCheck': true},},
					'209': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_corner_tl', 'hitCheck': true},},
					'210': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_corner_tr', 'hitCheck': true},},
					'211': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_corner_bl', 'hitCheck': true},},
					'212': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_frame_corner_br', 'hitCheck': true},},
					'215': {'type':'tile', 'data':{'assetName':'/tiles/room01_wall', 'hitCheck': true},},
					'216': {'type':'tile', 'data':{'assetName':'/tiles/room01_wall_bottom', 'hitCheck': true},},
					'999': {'type':'tile', 'data':{'assetName':'/tiles/floor_01_blank', 'hitCheck': true},},
				},
			}
		},
	],
},
{
	'type':'group',
	'name':'furnitures',
	'children':[
		{
			'type':'class',
			'name':'room01',
			'data': {
				'status': {
					'chair':        {'type':'single', 'data':{'assetName':'/room01_furnitures/chair', 'hitboxList':[{'x':0, 'y':8, 'width':19, 'height':10},]}},
					'citywindow':   {'type':'single', 'data':{'assetName':'/room01_furnitures/citywindow', 'hitboxList':[]}},
					'couch':        {'type':'single', 'data':{'assetName':'/room01_furnitures/couch', 'hitboxList':[{'x':2, 'y':14, 'width':44, 'height':16}]}},
					'diningtable':  {'type':'single', 'data':{'assetName':'/room01_furnitures/diningtable', 'hitboxList':[{'x':6, 'y':12, 'width':37, 'height':19}]}},
					'stackbook':    {'type':'single', 'data':{'assetName':'/room01_furnitures/stackbook', 'hitboxList':[]}},
					'tableandlamp': {'type':'single', 'data':{'assetName':'/room01_furnitures/tableandlamp', 'hitboxList':[{'x':4, 'y':22, 'width':24, 'height':10}]}},
					'teatable':     {'type':'single', 'data':{'assetName':'/room01_furnitures/teatable', 'hitboxList':[{'x':4, 'y':16, 'width':41, 'height':12}]}},
					'tv':           {'type':'single', 'data':{'assetName':'/room01_furnitures/tv', 'hitboxList':[{'x':6, 'y':20, 'width':38, 'height':12}]}},
					'wallshelf':    {'type':'single', 'data':{'assetName':'/room01_furnitures/wallshelf', 'hitboxList':[]}},
				},
			},
		},
	],
},
{
	'type':'group',
	'name':'characters',
	'children':[
		{
			'type':'class',
			'name':'doctor_w',
			'data': {
				'status': {
					'up_stop':     {'type':'single', 'data':{'assetName':'/characters/doctor_w/up1', 'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8},]}},
					'down_stop':   {'type':'single', 'data':{'assetName':'/characters/doctor_w/down1', 'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8},]}},
					'left_stop':   {'type':'single', 'data':{'assetName':'/characters/doctor_w/left1', 'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8},]}},
					'right_stop':  {'type':'single', 'data':{'assetName':'/characters/doctor_w/right1', 'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8},]}},
					'up_walk': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/characters/doctor_w/up2','/characters/doctor_w/up1','/characters/doctor_w/up3','/characters/doctor_w/up1',
							],
							'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}],
						},
					},
					'down_walk': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/characters/doctor_w/down2','/characters/doctor_w/down1','/characters/doctor_w/down3','/characters/doctor_w/down1',
							],
							'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}],
						},
					},
					'left_walk': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/characters/doctor_w/left2','/characters/doctor_w/left1','/characters/doctor_w/left3','/characters/doctor_w/left1',
							],
							'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}],
						},
					},
					'right_walk': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/characters/doctor_w/right2','/characters/doctor_w/right1','/characters/doctor_w/right3','/characters/doctor_w/right1',
							],
							'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}],
						},
					},
				},
			},
		},
	],
},
];

