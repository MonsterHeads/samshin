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
	var scene;
	var config;
	var ctx;

	var init = function() {
		var default_config = {'fps': 15, 'width': 640, 'height': 480,}
		config = $.extend({}, default_config, init_config);
		var canvas = $('<canvas></canvas>');
		canvas.css('width', '100%');
		canvas.css('height', '100%');
		canvas.attr('width', config.width);
		canvas.attr('height', config.height);
		config.target.append(canvas);
		ctx = canvas[0].getContext('2d');
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		render();
	}
	var render = function() {
		var t = new Date().getTime();
		if( scene ) {
			scene.render(t, ctx, config.width, config.height);
		} else {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, config.width, config.height);
		}
		setTimeout(function(){render();}, 1000/config.fps);
	}

	init();
	
	this.setScene = function(new_scene) {
		scene = new_scene;
	};
};