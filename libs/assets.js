var ImageLoader = function() {
	var _loading = {};
	var _complete = {};
	
	this.load = function(url, loadingCallback) {
		if( _complete.hasOwnProperty(url) ) {
			loadingCallback(url, 'loaded');
			return _complete[url];
		} else if( _loading.hasOwnProperty(url) ) {
			_loading[url].callbacks.push(loadingCallback);
			return _loading[url].image;
		} else {
			var data = {'image':new Image(), 'callbacks':[loadingCallback,]};
			data.image.onload = function() {
				console.log('image loaded', url);
				$.each(data.callbacks, function(idx, callback){
					callback(url, 'loaded');
				});
				_complete[url] = data.image;
			}
			data.image.onerror = function() {
				$.each(data.callbacks, function(idx, callback){
					callback(url, 'error');
				});
				console.log('image error', url);
			}
			data.image.src = url;
			_loading[url] = data;
			return data.image;
		}
	}
};

var ImageAsset = function(key, loader, data, loadingCallback) {
	var _url = data.url;
	var _x = data.x;
	var _y = data.y;
	var _width = data.width;
	var _height = data.height;

	var _image = loader.load(_url, function(url, msg){
		switch(msg) {
		case 'loaded': loadingCallback(key, 'loaded'); break;
		case 'error': loadingCallback(key, 'error'); break;
		}
	});

	this.getWidth = function() {
		return _width;
	}
	this.getHeight = function() {
		return _height;
	}

	this.draw = function(ctx, dx, dy, dw, dh) {
		var drawW = Math.min(_width, dw);
		var drawH = Math.min(_height, dh);
		ctx.drawImage(_image, _x, _y, drawW, drawH, dx, dy, drawW, drawH);
	}
};

var AssetPool = function(assetData, loadingCallback) {
	var _assetMap = {};
	var _loaded = 0;
	var _allLoading = false;
	var _assetAmount = 0;
	var _imageLoader = new ImageLoader();
	$.each(assetData, function(group, groupAssets) {
		if( 'image' == groupAssets.type ) {
			$.each(groupAssets.data, function(assetKey, data) {
				var key = group + '/' + assetKey;
				_assetAmount += 1;
				var assetObj = new ImageAsset(key, _imageLoader, data, function(key, msg){
					switch(msg) {
					case 'loaded':
						break;
					case 'error':
						console.error('error while image loading', data, evt);
						break;
					}
					_loaded += 1;
					if( _allLoading && _loaded == _assetAmount ) loadingCallback('finished');
				});
				_assetMap[key] = assetObj;
			});
		}
	});
	_allLoading = true;

	this.getAsset = function(key) {
		return _assetMap[key];
	}
};