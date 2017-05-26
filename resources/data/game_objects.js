var createCharacterStatus = function(name, customConfig) {
	var config = {
		'up_stop':     {'type':'single', 'data':{'assetName':'/characters/'+name+'/up1', 'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8},]}}},
		'down_stop':   {'type':'single', 'data':{'assetName':'/characters/'+name+'/down1', 'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8},]}}},
		'left_stop':   {'type':'single', 'data':{'assetName':'/characters/'+name+'/left1', 'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8},]}}},
		'right_stop':  {'type':'single', 'data':{'assetName':'/characters/'+name+'/right1', 'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8},]}}},
		'up_walk': {
			'type':'simpleAnimation',
			'data': {
				'delay':140,
				'assetList':[
					'/characters/'+name+'/up2','/characters/'+name+'/up1','/characters/'+name+'/up3','/characters/'+name+'/up1',
				],
				'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8}]},
			},
		},
		'down_walk': {
			'type':'simpleAnimation',
			'data': {
				'delay':140,
				'assetList':[
					'/characters/'+name+'/down2','/characters/'+name+'/down1','/characters/'+name+'/down3','/characters/'+name+'/down1',
				],
				'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8}]},
			},
		},
		'left_walk': {
			'type':'simpleAnimation',
			'data': {
				'delay':140,
				'assetList':[
					'/characters/'+name+'/left2','/characters/'+name+'/left1','/characters/'+name+'/left3','/characters/'+name+'/left1',
				],
				'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8}]},
			},
		},
		'right_walk': {
			'type':'simpleAnimation',
			'data': {
				'delay':140,
				'assetList':[
					'/characters/'+name+'/right2','/characters/'+name+'/right1','/characters/'+name+'/right3','/characters/'+name+'/right1',
				],
				'hitboxMap':{'move':[{'x':6, 'y':24, 'width':20, 'height':8}]},
			},
		},
	};
	return $.extend(config, customConfig);
};

var data_game_object_classes = 
[
{
	'type':'class',
	'name':'cursors',
	'data': {
		'status': {
			'action': {'type':'single', 'data':{'assetName':'/cursors/action',}},
			'normal': {'type':'single', 'data':{'assetName':'/cursors/normal',}},
			'search': {'type':'single', 'data':{'assetName':'/cursors/search',}},
			'talk':   {'type':'single', 'data':{'assetName':'/cursors/talk',}},
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
					'chair':        {'type':'single', 'data':{'assetName':'/room01_furnitures/chair', 'hitboxMap':{'move':[{'x':0, 'y':8, 'width':19, 'height':10},]}}},
					'citywindow':   {'type':'single', 'data':{'assetName':'/room01_furnitures/citywindow'},},
					'couch':        {'type':'single', 'data':{'assetName':'/room01_furnitures/couch', 'hitboxMap':{'move':[{'x':2, 'y':14, 'width':44, 'height':16}]}}},
					'diningtable':  {'type':'single', 'data':{'assetName':'/room01_furnitures/diningtable', 'hitboxMap':{'move':[{'x':6, 'y':12, 'width':37, 'height':19}]}}},
					'stackbook':    {'type':'single', 'data':{'assetName':'/room01_furnitures/stackbook',}},
					'tableandlamp': {'type':'single', 'data':{'assetName':'/room01_furnitures/tableandlamp', 'hitboxMap':{'move':[{'x':4, 'y':22, 'width':24, 'height':10}]}}},
					'teatable':     {'type':'single', 'data':{'assetName':'/room01_furnitures/teatable', 'hitboxMap':{'move':[{'x':4, 'y':16, 'width':41, 'height':12}]}}},
					'wallshelf':    {'type':'single', 'data':{'assetName':'/room01_furnitures/wallshelf',}},
					'tv01':         {'type':'single', 'data':{'assetName':'/room01_furnitures/tv01', 'hitboxMap':{'move':[{'x':2, 'y':20, 'width':38, 'height':12}]}}},
					'tv02':         {'type':'single', 'data':{'assetName':'/room01_furnitures/tv02', 'hitboxMap':{'move':[{'x':2, 'y':20, 'width':38, 'height':12}]}}},
					'tv03': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/room01_furnitures/tv03','/room01_furnitures/tv04','/room01_furnitures/tv05','/room01_furnitures/tv06'
							],
							'hitboxMap':{'move':[{'x':2, 'y':20, 'width':38, 'height':12}]},
						},
					},
					'tv04': {
						'type':'simpleAnimation',
						'data': {
							'delay':140,
							'assetList':[
								'/room01_furnitures/tv07','/room01_furnitures/tv08','/room01_furnitures/tv09','/room01_furnitures/tv10'
							],
							'hitboxMap':{'move':[{'x':2, 'y':20, 'width':38, 'height':12}]},
						},
					},
					'tv05':         {'type':'single', 'data':{'assetName':'/room01_furnitures/tv11', 'hitboxMap':{'move':[{'x':2, 'y':20, 'width':38, 'height':12}]}}},
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
			'name':'emoticon',
			'data': {
				'status': {
					'none': {'type':'none', 'data':{}},
					'silence': {'type':'single', 'data':{'assetName':'/emoticon/silence', 'hitboxMap':{}}},
				},
			},
		},
		{
			'type':'class',
			'name':'doctor_w',
			'data': {
				'status': createCharacterStatus('doctor_w',{
				}),
			},
		},
		{
			'type':'class',
			'name':'main',
			'data': {
				'status': createCharacterStatus('main',{
				}),
			},
		},
		{
			'type':'class',
			'name':'detective',
			'data': {
				'status': createCharacterStatus('detective',{
					'portrait_normal': {'type':'single', 'data':{'assetName':'/characters/detective/portrait_normal', 'hitboxMap':{}}},
				}),
			},
		},
	],
},
{
	'type':'group',
	'name':'ui',
	'children':[
		{
			'type':'class',
			'name':'dialog',
			'data': {
				'status': {
					'default': {
						'type':'uiDialog',
						'data': {
							'font': '10px DungGeunMo',
							'color': '#000000',
							'bgcolor': '#f0d8b4',
							'border': {
								'tl':'/ui/dialog/tl','tm':'/ui/dialog/tm','tr':'/ui/dialog/tr',
								'ml':'/ui/dialog/ml','mr':'/ui/dialog/mr',
								'bl':'/ui/dialog/bl','bm':'/ui/dialog/bm','br':'/ui/dialog/br',
							},
							'width': 290,
							'line': 3,
							'lineHeight':10,
							'lineSpace': 3,
							'padding': 7,
						}
					}
				}
			},
		},
		{
			'type':'class',
			'name':'blackLayer',
			'data': {
				'status': { 'default': {'type':'colorLayer','data': {'color':'#000000'}} },
			},
		},
	],
},
];

