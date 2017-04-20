var LoadingScene = function() {
	var begin = -1;
	var circle = 1500;
	
	this.render = function(t, ctx, width, height) {
		if( 0 > begin ) {
			begin = t;
		}
		var dt = (t-begin) / circle;
		var rad = Math.PI * dt
		var opacity = Math.abs(Math.sin(rad));

		ctx.fillStyle = '#bbccdd';
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = 'rgba(0,0,0,'+opacity+')';
		ctx.font = 'italic 50px Arial';
		ctx.textAlign = 'center'
		ctx.fillText("Loading...", width/2, height/2);
	}
}

var Viewport = function(init_config) {
	var _scene;
	var _config;
	var _ctx;

	var init = function() {
		var default_config = {'fps': 15, 'width': 640, 'height': 480,}
		_config = $.extend({}, default_config, init_config);
		var canvas = $('<canvas></canvas>');
		canvas.css('width', '100%');
		canvas.css('height', '100%');
		canvas.attr('width', _config.width);
		canvas.attr('height', _config.height);
		_config.target.append(canvas);
		_config.render_width = Math.ceil(_config.width/config.viewport.scale);
		_config.render_height = Math.ceil(_config.height/config.viewport.scale);

		_ctx = canvas[0].getContext('2d');
		_ctx.scale(config.viewport.scale, config.viewport.scale);
		_ctx.mozImageSmoothingEnabled = false;
		_ctx.webkitImageSmoothingEnabled = false;
		_ctx.msImageSmoothingEnabled = false;
		_ctx.imageSmoothingEnabled = false;

		$(window).on('keydown', function(evt) {
			if( _scene && typeof _scene.eventCallback == 'function' ) {
				_scene.eventCallback('keydown', evt);
			}
		});
		$(window).on('keyup', function(evt) {
			if( _scene && typeof _scene.eventCallback == 'function' ) {
				_scene.eventCallback('keyup', evt);	
			}
		});
		render();
	}
	var render = function() {
		var t = new Date().getTime();
		if( _scene ) {
			_scene.render(t, _ctx, _config.render_width, _config.render_height);
		} else {
			_ctx.fillStyle = "#000000";
			_ctx.fillRect(0, 0, _config.width, _config.height);
		}
		setTimeout(function(){render();}, 1000/_config.fps);
	}

	init();
	
	this.setScene = function(new_scene) {
		_scene = new_scene;
	};
};