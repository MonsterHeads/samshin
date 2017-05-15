
SS.gameObjectStatusType.custom = function(data) {
	return data;
};
SS.gameObjectStatusType.tile = function(data) {
	var _app;
	var _asset;
	var _hitboxMap = {};
	return {
		'init': function(application) {
			_app = application;
			_asset = _app.getAsset(data.assetName);
			if( data.hitCheck ) {
				_hitboxMap = {'move':[{'x':0, 'y':0, 'width':_asset.width, 'height':_asset.height}]};
			}
			return {
				'width':_asset.width,
				'height':_asset.height,
				'hitboxMap':_hitboxMap,
			}
		},
		'render': function(t, ctx) {
			_asset.draw(ctx, 0, 0, _asset.width, _asset.height);
		}
	}
};
SS.gameObjectStatusType.single = function(data) {
	var _app;
	var _asset;
	return {
		'init': function(application) {
			_app = application;
			_asset = _app.getAsset(data.assetName);
			return {
				'width':_asset.width,
				'height':_asset.height,
				'hitboxMap':data.hitboxMap,
			}
		},
		'render': function(t, ctx) {
			_asset.draw(ctx, 0, 0, _asset.width, _asset.height);
		}
	}
};
SS.gameObjectStatusType.simpleAnimation = function(animationData) {
	var _app;
	var _delay = animationData.delay;
	var _assetNameList = animationData.assetList;
	var _hitboxMap = animationData.hitboxMap;
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
				'hitboxMap':_hitboxMap,
			}
		},
		'render': function(t, ctx) {
			var asset = _assetList[Math.floor(t/_delay) % _assetList.length];
			asset.draw(ctx, 0, 0, _width, _height);
		}
	}
};
SS.gameObjectStatusType.uiDialog = function(clsData) {
	var _app;
	var $this;
	var _assetMap = {};

	var _width;
	var _height;
	var _bgColor = clsData.bgcolor;

	return {
		'init': function(application) {
			_app = application;
			$this = this;
			$.each(clsData.border, function(key, assetName) {
				_assetMap[key] = _app.getAsset(assetName);
			});
			_width = Math.max(_assetMap['tm'].width, _assetMap['bm'].width, clsData.width + clsData.padding*2);
			_width += Math.max(_assetMap['tl'].width, _assetMap['ml'].width, _assetMap['bl'].width);
			_width += Math.max(_assetMap['tr'].width, _assetMap['mr'].width, _assetMap['br'].width);
			_height = Math.max(_assetMap['ml'].height, _assetMap['mr'].height, clsData.line*(clsData.lineHeight+clsData.lineSpace)-clsData.lineSpace + clsData.padding*2);
			_height += Math.max(_assetMap['tl'].height, _assetMap['tm'].height, _assetMap['tr'].height);
			_height += Math.max(_assetMap['bl'].height, _assetMap['bm'].height, _assetMap['br'].height);
			return { 'width':_width, 'height':_height, };
		},
		'render': function(t, ctx) {
			ctx.fillStyle = _bgColor;
			ctx.fillRect(0,0,_width,_height);
			var trX = _width-_assetMap['tr'].width;
			var blY = _height-_assetMap['bl'].height;
			var brX = _width-_assetMap['br'].width;
			var brY = _height-_assetMap['br'].height;
			var bmY = _height-_assetMap['bm'].height;
			var mrX = _width-_assetMap['mr'].width;
			_assetMap['tl'].draw(ctx, 0, 0, _width, _height);
			_assetMap['tr'].draw(ctx, trX, 0, _width, _height);
			_assetMap['bl'].draw(ctx, 0, blY, _width, _height);
			_assetMap['br'].draw(ctx, brX, brY, _width, _height);
			var x;
			for( x=_assetMap['tl'].width; x<trX; x+=_assetMap['tm'].width ) {
				_assetMap['tm'].draw(ctx, x, 0, _width, _height);
			}
			for( x=_assetMap['bl'].width; x<brX; x+=_assetMap['bm'].width ) {
				_assetMap['bm'].draw(ctx, x, bmY, _width, _height);
			}
			var y;
			for( y=_assetMap['tl'].height; y<blY; y+=_assetMap['ml'].height ) {
				_assetMap['ml'].draw(ctx, 0, y, _width, _height);
			}
			for( y=_assetMap['tr'].height; y<brY; y+=_assetMap['mr'].height ) {
				_assetMap['mr'].draw(ctx, mrX, y, _width, _height);
			}
		},
	}
};
SS.gameObjectStatusType.colorLayer = function(clsData) {
	var _width;
	var _height;
	var _color = clsData.color;
	return {
		'init': function(application) {
			if(this.parent) {
				_width = this.parent.width;
				_height = this.parent.height;
			} else {
				_width = 0;
				_height = 0;
			}
			return {'width':_width, 'height':_height,};
		},
		'update': function(t) {
			var result = {};
			var width = 0;
			var height = 0;
			if(this.parent) {
				width = this.parent.width;
				height = this.parent.height;
			}
			if( width != _width ) {
				_width = width;
				result.width = width;
			}
			if( height != _height ) {
				_height = height;
				result.height = height;
			}
			return result;
		},
		'render': function(t, ctx) {
			ctx.fillStyle = _color;
			ctx.fillRect(0,0,_width,_height);
		},
	}
};