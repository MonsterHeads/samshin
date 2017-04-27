var data_game_objects;

(function() {
var GOH = GameObjectHelper;
data_game_objects = {
	'tiles': {
		'room01':{
			'101': GOH.tile('tiles/floor_01', 16, false),
			'201': GOH.tile('tiles/floor_01_frame_tl', 16, true),
			'202': GOH.tile('tiles/floor_01_frame_tm', 16, true),
			'203': GOH.tile('tiles/floor_01_frame_tr', 16, true),
			'204': GOH.tile('tiles/floor_01_frame_ml', 16, true),
			'205': GOH.tile('tiles/floor_01_frame_mr', 16, true),
			'206': GOH.tile('tiles/floor_01_frame_bl', 16, true),
			'207': GOH.tile('tiles/floor_01_frame_bm', 16, true),
			'208': GOH.tile('tiles/floor_01_frame_br', 16, true),
			'209': GOH.tile('tiles/floor_01_frame_corner_tl', 16, true),
			'210': GOH.tile('tiles/floor_01_frame_corner_tr', 16, true),
			'211': GOH.tile('tiles/floor_01_frame_corner_bl', 16, true),
			'212': GOH.tile('tiles/floor_01_frame_corner_br', 16, true),
			'215': GOH.tile('tiles/room01_wall', 16, true),
			'216': GOH.tile('tiles/room01_wall_bottom', 16, true),
			'999': GOH.tile('tiles/floor_01_blank', 16, true),
		},
	},	
	'furnitures': {
		'room01':{
			'chair': GOH.single('room01_furnitures/chair', []),
			'citywindow': GOH.single('room01_furnitures/citywindow', []),
			'couch': GOH.single('room01_furnitures/couch', []),
			'diningtable': GOH.single('room01_furnitures/diningtable', []),
			'stackbook': GOH.single('room01_furnitures/stackbook', []),
			'tableandlamp': GOH.single('room01_furnitures/tableandlamp', []),
			'teatable': GOH.single('room01_furnitures/teatable', []),
			'tv': GOH.single('room01_furnitures/tv', []),
			'wallshelf': GOH.single('room01_furnitures/wallshelf', []),
		}
	},
	'characters': {
		'doctor_w':{
			'up_stop': GOH.single('characters/doctor_w_up1', []),
			'down_stop': GOH.single('characters/doctor_w_down1', []),
			'left_stop': GOH.single('characters/doctor_w_left1', []),
			'right_stop': GOH.single('characters/doctor_w_right1', []),
			'up_walk': GOH.simpleAnimation({
				'delay':300,
				'assetList':[
					'characters/doctor_w_up1','characters/doctor_w_up2','characters/doctor_w_up1','characters/doctor_w_up3',
				],
				'hitboxList':[]
			}),
			'down_walk': GOH.simpleAnimation({
				'delay':300,
				'assetList':[
					'characters/doctor_w_down1','characters/doctor_w_down2','characters/doctor_w_down1','characters/doctor_w_down3',
				],
				'hitboxList':[]
			}),
			'left_walk': GOH.simpleAnimation({
				'delay':300,
				'assetList':[
					'characters/doctor_w_left1','characters/doctor_w_left2','characters/doctor_w_left1','characters/doctor_w_left3',
				],
				'hitboxList':[]
			}),
			'right_walk': GOH.simpleAnimation({
				'delay':300,
				'assetList':[
					'characters/doctor_w_right1','characters/doctor_w_right2','characters/doctor_w_right1','characters/doctor_w_right3',
				],
				'hitboxList':[]
			}),
		}
	},
}
})();

