var data_game_objects = {
	'tiles': {
		'room01':{
			'101': GameObjectHelper.tile('tiles/floor_01', 16, false),
			'201': GameObjectHelper.tile('tiles/floor_01_frame_tl', 16, true),
			'202': GameObjectHelper.tile('tiles/floor_01_frame_tm', 16, true),
			'203': GameObjectHelper.tile('tiles/floor_01_frame_tr', 16, true),
			'204': GameObjectHelper.tile('tiles/floor_01_frame_ml', 16, true),
			'205': GameObjectHelper.tile('tiles/floor_01_frame_mr', 16, true),
			'206': GameObjectHelper.tile('tiles/floor_01_frame_bl', 16, true),
			'207': GameObjectHelper.tile('tiles/floor_01_frame_bm', 16, true),
			'208': GameObjectHelper.tile('tiles/floor_01_frame_br', 16, true),
			'209': GameObjectHelper.tile('tiles/floor_01_frame_corner_tl', 16, true),
			'210': GameObjectHelper.tile('tiles/floor_01_frame_corner_tr', 16, true),
			'211': GameObjectHelper.tile('tiles/floor_01_frame_corner_bl', 16, true),
			'212': GameObjectHelper.tile('tiles/floor_01_frame_corner_br', 16, true),
			'215': GameObjectHelper.tile('tiles/room01_wall', 16, true),
			'216': GameObjectHelper.tile('tiles/room01_wall_bottom', 16, true),
			'999': GameObjectHelper.tile('tiles/floor_01_blank', 16, true),
		},
	},	
	'furnitures': {
		'room01':{
			'chair': GameObjectHelper.single('room01_furnitures/chair', []),
			'citywindow': GameObjectHelper.single('room01_furnitures/citywindow', []),
			'couch': GameObjectHelper.single('room01_furnitures/couch', []),
			'diningtable': GameObjectHelper.single('room01_furnitures/diningtable', []),
			'stackbook': GameObjectHelper.single('room01_furnitures/stackbook', []),
			'tableandlamp': GameObjectHelper.single('room01_furnitures/tableandlamp', []),
			'teatable': GameObjectHelper.single('room01_furnitures/teatable', []),
			'tv': GameObjectHelper.single('room01_furnitures/tv', []),
			'wallshelf': GameObjectHelper.single('room01_furnitures/wallshelf', []),
		}
	},
	'characters': { // width:1, height:1
		// 'agatha':{
		// 	'down_stop': gameObjectAnimation.single('', [{'x':0,'y':0,'width':32,'height':32}]),
		// 	'up_stop': gameObjectAnimation.single('', [{'x':0,'y':0,'width':32,'height':32}]),
		// 	'left_stop': gameObjectAnimation.single('', [{'x':0,'y':0,'width':32,'height':32}]),
		// 	'right_stop': gameObjectAnimation.single('', [{'x':0,'y':0,'width':32,'height':32}]),
		// 	'down_walk': gameObjectAnimation.simpleAnimation(300, [''], [{'x':0,'y':0,'width':32,'height':32}]),
		// 	'attack': { // custom
		// 		'asset_list':[],
		//		'hitbox_list':[{'x':0,'y':0,'width':32,'height':32}]
		// 		'animate': function(t, data) {
		// 			return {
		// 				'asset_idx':0,
		// 				'x':0, 'y':0, 				
		// 			}
		// 		}
		// 	},
		// },
	},
}