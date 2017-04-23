var gameObjectAnimation = {
	'single': function(asset, hitbox_list) {
		return {
			'asset_list':[asset,],
			'hitbox_list':hitbox_list,
			'animate': function(t) {
				return {
					'asset_idx':0,
					'x':0, 'y':0,
				}
			}
		}
	},
	'simpleAnimation': function(delay, asset_list, hitbox_list) {
		return {
			'asset_list':asset_list,
			'hitbox_list':hitbox_list,
			'animate': function(t, data) {
				var asset_idx = Math.floor(t/delay) % asset_list.length;
				return {
					'asset_idx':asset_idx,
					'x':0, 'y':0,
				}
			}
		}	
	}
};