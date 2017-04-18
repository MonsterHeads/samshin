var game_objects = {
	'character': { // width:1, height:1
		0:{
			'name':'agatha',
			'animations': {
				'walk_up':['characters/ch_00_01'],
				'walk_down':['characters/ch_00_01'],
				'walk_left':['characters/ch_00_02'],
				'walk_right':['characters/ch_00_02'],
			},
		},
	},

	'map_object': {
		0:{
			'name':'house1',
			'asset':'houses/ho_01',
			'width':4, 'height':3,
			'block_height':1,
		},
		1:{
			'name':'house2',
			'asset':'houses/ho_02',
			'width':4, 'height':4,
			'block_height':2,
		},
	},
}