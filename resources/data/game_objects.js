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
			'chair': GOH.single('room01_furnitures/chair', [{'x':0, 'y':8, 'width':19, 'height':10}]),
			'citywindow': GOH.single('room01_furnitures/citywindow', []),
			'couch': GOH.single('room01_furnitures/couch', [{'x':2, 'y':14, 'width':44, 'height':16}]),
			'diningtable': GOH.single('room01_furnitures/diningtable', [{'x':6, 'y':12, 'width':37, 'height':19}]),
			'stackbook': GOH.single('room01_furnitures/stackbook', []),
			'tableandlamp': GOH.single('room01_furnitures/tableandlamp', [{'x':4, 'y':22, 'width':24, 'height':10}]),
			'teatable': GOH.single('room01_furnitures/teatable', [{'x':4, 'y':16, 'width':41, 'height':12}]),
			'tv': GOH.single('room01_furnitures/tv', [{'x':6, 'y':20, 'width':38, 'height':12}]),
			'wallshelf': GOH.single('room01_furnitures/wallshelf', []),
		}
	},
	'characters': {
		'doctor_w':{
			'up_stop': GOH.single('characters/doctor_w_up1', [{'x':6, 'y':24, 'width':20, 'height':8}]),
			'down_stop': GOH.single('characters/doctor_w_down1', [{'x':6, 'y':24, 'width':20, 'height':8}]),
			'left_stop': GOH.single('characters/doctor_w_left1', [{'x':6, 'y':24, 'width':20, 'height':8}]),
			'right_stop': GOH.single('characters/doctor_w_right1', [{'x':6, 'y':24, 'width':20, 'height':8}]),
			'up_walk': GOH.simpleAnimation({
				'delay':140,
				'assetList':[
					'characters/doctor_w_up2','characters/doctor_w_up1','characters/doctor_w_up3','characters/doctor_w_up1',
				],
				'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}]
			}),
			'down_walk': GOH.simpleAnimation({
				'delay':140,
				'assetList':[
					'characters/doctor_w_down2','characters/doctor_w_down1','characters/doctor_w_down3','characters/doctor_w_down1',
				],
				'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}]
			}),
			'left_walk': GOH.simpleAnimation({
				'delay':140,
				'assetList':[
					'characters/doctor_w_left2','characters/doctor_w_left1','characters/doctor_w_left3','characters/doctor_w_left1',
				],
				'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}]
			}),
			'right_walk': GOH.simpleAnimation({
				'delay':140,
				'assetList':[
					'characters/doctor_w_right2','characters/doctor_w_right1','characters/doctor_w_right3','characters/doctor_w_right1',
				],
				'hitboxList':[{'x':6, 'y':24, 'width':20, 'height':8}]
			}),
		}
	},
}
})();

