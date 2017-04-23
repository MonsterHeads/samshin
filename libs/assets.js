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

var Assets = function(assets_data, loadingCallback) {
	var _asset_map = {};
	var _loaded = 0;
	var _all_loading = false;
	var _asset_amount = 0;
	var _image_loader = new ImageLoader();
	$.each(assets_data, function(group, group_assets) {
		if( 'image' == group_assets.type ) {
			$.each(group_assets.data, function(asset_key, data) {
				var key = group + '/' + asset_key;
				_asset_amount += 1;
				var assetObj = new ImageAsset(key, _image_loader, data, function(key, msg){
					switch(msg) {
					case 'loaded':
						break;
					case 'error':
						console.error('error while image loading', data, evt);
						break;
					}
					_loaded += 1;
					if( _all_loading && _loaded == _asset_amount ) loadingCallback('finished');
				});
				_asset_map[key] = assetObj;
			});
		}
	});
	_all_loading = true;

	this.getAsset = function(key) {
		return _asset_map[key];
	}
};