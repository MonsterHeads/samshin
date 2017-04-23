var data_game_objects = {
	'furnitures': {
		'room01':{
			'chair': gameObjectAnimation.single('room01_furnitures/chair', []),
			'citywindow': gameObjectAnimation.single('room01_furnitures/citywindow', []),
			'couch': gameObjectAnimation.single('room01_furnitures/couch', []),
			'diningtable': gameObjectAnimation.single('room01_furnitures/diningtable', []),
			'stackbook': gameObjectAnimation.single('room01_furnitures/stackbook', []),
			'tableandlamp': gameObjectAnimation.single('room01_furnitures/tableandlamp', []),
			'teatable': gameObjectAnimation.single('room01_furnitures/teatable', []),
			'tv': gameObjectAnimation.single('room01_furnitures/tv', []),
			'wallshelf': gameObjectAnimation.single('room01_furnitures/wallshelf', []),
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