var ImageLoader = function() {
	var loading = {};
	var complete = {};
	
	this.load = function(url, loadingCallback) {
		if( complete.hasOwnProperty(url) ) {
			loadingCallback(url, 'loaded');
			return complete[url];
		} else if( loading.hasOwnProperty(url) ) {
			loading[url].callbacks.push(loadingCallback);
			return loading[url].image;
		} else {
			var data = {'image':new Image(), 'callbacks':[loadingCallback,]};
			data.image.onload = function() {
				console.log('image loaded', url);
				$.each(data.callbacks, function(idx, callback){
					callback(url, 'loaded');
				});
				complete[url] = data.image;
			}
			data.image.onerror = function() {
				$.each(data.callbacks, function(idx, callback){
					callback(url, 'error');
				});
				console.log('image error', url);
			}
			data.image.src = url;
			loading[url] = data;
			return data.image;
		}
	}
};

var ImageAsset = function(key, loader, data, loadingCallback) {
	//{'url':'resources/images/agathaF.png', 'x':0, 'y':0, 'width':32, 'height':32},
	var url = data.url;
	var x = data.x;
	var y = data.y;
	var width = data.width;
	var height = data.height;

	var image = loader.load(url, function(url, msg){
		switch(msg) {
		case 'loaded': loadingCallback(key, 'loaded'); break;
		case 'error': loadingCallback(key, 'error'); break;
		}
	});

	this.draw = function(ctx, dx, dy, dw, dh) {
		var drawW = Math.min(width, dw);
		var drawH = Math.min(height, dh);
		ctx.drawImage(image, x, y, drawW, drawH, dx, dy, drawW, drawH);
	}
};

var Assets = function(assets_data, loadingCallback) {
	var asset_map = {};
	var loaded = 0;
	var all_loading = false;
	var asset_amount = 0;
	var image_loader = new ImageLoader();
	$.each(assets_data, function(group, group_assets) {
		if( 'image' == group_assets.type ) {
			$.each(group_assets.data, function(asset_key, data) {
				var key = group + '/' + asset_key;
				asset_amount += 1;
				var assetObj = new ImageAsset(key, image_loader, data, function(key, msg){
					switch(msg) {
					case 'loaded':
						break;
					case 'error':
						console.error('error while image loading', data, evt);
						break;
					}
					loaded += 1;
					if( all_loading && loaded == asset_amount ) loadingCallback('finished');
				});
				asset_map[key] = assetObj;
			});
		}
	});
	all_loading = true;

	this.getAsset = function(key) {
		return asset_map[key];
	}
};