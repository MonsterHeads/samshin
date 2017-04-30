SS.priv.AssetImageLoader = (function() {
	var _loading = {};
	var _complete = {};	
	return {
		'load': function(url, loadingCallback) {
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
				data.image.onerror = function(evt) {
					$.each(data.callbacks, function(idx, callback){
						callback(url, 'error', evt);
					});
					console.log('image error', url);
				}
				data.image.src = url;
				_loading[url] = data;
				return data.image;
			}
		}
	}
})();
SS.assetClass.image = function(key, assetData, loadingCallback) {
	var _url = assetData.url;
	var _x = assetData.x;
	var _y = assetData.y;
	var _width = assetData.width;
	var _height = assetData.height;

	var _image = SS.priv.AssetImageLoader.load(_url, function(url, msg){
		switch(msg) {
		case 'loaded': loadingCallback(key, 'loaded'); break;
		case 'error': loadingCallback(key, 'error'); break;
		}
	});

	Object.defineProperty(this, 'width', {
		'get':function() { return _width; },
	});
	Object.defineProperty(this, 'height', {
		'get':function() { return _height; },
	});

	this.draw = function(ctx, dx, dy, dw, dh) {
		var drawW = Math.min(_width, dw);
		var drawH = Math.min(_height, dh);
		ctx.drawImage(_image, _x, _y, drawW, drawH, dx, dy, drawW, drawH);
	}
};

SS.priv.AssetPool = function(application) {
	var _app = application;
	var _assetMap = {};

	this.loadAssets = function(configList, loadingCallback) {
		var _loaded = 0;
		var _allLoading = false;
		var _assetAmount = 0;
		var processConfig = function(config, parentKey) {
			if( 'group' == config.type ) {
				processGroupConfig(config, parentKey);
			} else if('asset' == config.type ) {
				processAssetConfig(config, parentKey);
			}
		};
		var processGroupConfig = function(groupConfig, parentKey) {
			var currentKey = parentKey + '/' + groupConfig.name;
			$.each(groupConfig.children, function(idx, config) {
				processConfig(config, currentKey);
			});
		};
		var processAssetConfig = function(assetConfig, parentKey) {
			var currentKey = parentKey + '/' + assetConfig.name;
			if( SS.assetClass.hasOwnProperty(assetConfig.cls) ) {
				_assetAmount += 1;
				var assetObject = new SS.assetClass[assetConfig.cls](currentKey, assetConfig.data, function(key, msg){
					switch(msg) {
					case 'loaded':
						break;
					case 'error':
						console.error('error while asset loading', data);
						break;
					}
					_loaded += 1;
					if( _allLoading && _loaded == _assetAmount ) loadingCallback('finished');
				});
				_assetMap[currentKey] = assetObject;
			} else {
				console.error('unknown asset class.', currentKey, assetConfig);
			}
		}
		$.each(configList, function(idx, config) {
			processConfig(config, '');
		});
		_allLoading = true;
		if( 0 == _assetAmount ) {
			loadingCallback('finished');
		}
	};

	this.getAsset = function(key) {
		return _assetMap[key];
	};
};