var GameObjectHelper = {
	'tile': function(assetName, size, hitcheck) {
		var _app;
		var _asset;
		var _hitboxList = [];
		return {
			'init': function(application) {
				_app = application;
				_asset = _app.getAsset(assetName);
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
		var _app;
		var _asset;
		return {
			'init': function(application) {
				_app = application;
				_asset = _app.getAsset(assetName);
				console.log(_app, assetName, _asset);
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
		var _app;
		var _delay = animationData.delay;
		var _assetNameList = animationData.assetList;
		var _hitboxList = animationData.hitboxList;
		var _width = 0;
		var _height = 0;
		var _assetList;
		return {
			'init': function(application) {
				_app = application;
				_assetList = [];
				$.each(_assetNameList, function(idx, assetName){
					var asset = _app.getAsset(assetName);
					_width = Math.max(asset.width, _width);
					_height = Math.max(asset.height, _height)
					_assetList.push(asset);

				});
				return {
					'width':_width,
					'height':_height,
					'hitboxList':_hitboxList,
				}
			},
			'update': function(t) {
				return {}
			},
			'render': function(t, ctx) {
				var asset = _assetList[Math.floor(t/_delay) % _assetList.length];
				asset.draw(ctx, 0, 0, _width, _height);
			}
		}
	}
};