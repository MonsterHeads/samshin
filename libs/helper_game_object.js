var GameObjectHelper = {
	'tile': function(asset_name, size, hitcheck) {
		var _assets;
		var _asset;
		var _hitbox_list = [];
		return {
			'init': function(assets) {
				_assets = assets;
				_asset = _assets.getAsset(asset_name);
				if( hitcheck ) {
					_hitbox_list = [{'x':0, 'y':0, 'width':size, 'height':size}];
				}
				return {
					'width':size,
					'height':size,
					'hitbox_list':_hitbox_list,
				}
			},
			'beforeRender': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				_asset.draw(ctx, 0, 0, size, size);
			}
		}
	},	
	'single': function(asset_name, hitbox_list) {
		var _assets;
		var _asset;
		return {
			'init': function(assets) {
				_assets = assets;
				_asset = _assets.getAsset(asset_name);
				return {
					'rx':0,
					'ry':0,
					'width':_asset.getWidth(),
					'height':_asset.getHeight(),
					'hitbox_list':hitbox_list,
				}
			},
			'beforeRender': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				_asset.draw(ctx, 0, 0, _asset.getWidth(), _asset.getHeight());
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