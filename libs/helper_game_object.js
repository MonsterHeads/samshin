var GameObjectHelper = {
	'tile': function(assetName, size, hitcheck) {
		var _assetPool;
		var _asset;
		var _hitboxList = [];
		return {
			'init': function(assetPool) {
				_assetPool = assetPool;
				_asset = _assetPool.getAsset(assetName);
				if( hitcheck ) {
					_hitboxList = [{'x':0, 'y':0, 'width':size, 'height':size}];
				}
				return {
					'width':size,
					'height':size,
					'hitboxList':_hitboxList,
				}
			},
			'beforeRender': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				_asset.draw(ctx, 0, 0, _asset.getWidth(), size);
			}
		}
	},	
	'single': function(assetName, hitboxList) {
		var _assetPool;
		var _asset;
		return {
			'init': function(assetPool) {
				_assetPool = assetPool;
				_asset = _assetPool.getAsset(assetName);
				return {
					'rx':0,
					'ry':0,
					'width':_asset.getWidth(),
					'height':_asset.getHeight(),
					'hitboxList':hitboxList,
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