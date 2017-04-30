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
			'update': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				_asset.draw(ctx, 0, 0, _asset.width, size);
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
					'width':_asset.width,
					'height':_asset.height,
					'hitboxList':hitboxList,
				}
			},
			'update': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				_asset.draw(ctx, 0, 0, _asset.width, _asset.height);
			}
		}
	},
	'simpleAnimation': function(animationData) {
		var delay = animationData.delay;
		var assetNameList = animationData.assetList;
		var hitboxList = animationData.hitboxList;
		var _width = 0;
		var _height = 0;
		var _assetList;
		return {
			'init': function(assetPool) {
				_assetList = [];
				$.each(assetNameList, function(idx, assetName){
					var asset = assetPool.getAsset(assetName);
					_width = Math.max(asset.width, _width);
					_height = Math.max(asset.height, _height)
					_assetList.push(asset);

				});
				return {
					'width':_width,
					'height':_height,
					'hitboxList':hitboxList,
				}
			},
			'update': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				var asset = _assetList[Math.floor(t/delay) % _assetList.length];
				asset.draw(ctx, 0, 0, _width, _height);
			}
		}
	}
};