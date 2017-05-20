var tutorial_scene01_room01 = (function(){
	var Scene = {};
	var $this;
	var _blackLayer;
	var _character;
	var _textDialog;
	var _charMove;
	var _timeline;

	var setHoverCursorForNearCharacter = function(gameObject, hoverStatus) {
		var mouseOver = false;
		var checkNearAndSet = function() {
			var dist = Math.max(gameObject.width, gameObject.height)/2 + Math.max(_character.width, _character.height)/2;
			var obj = gameObject;
			var p1 = {'x':obj.x+obj.width/2, 'y':obj.y+obj.height/2,};
			while( obj.parent && obj.parent != _character.parent ) {
				obj = obj.parent;
				p1.x += obj.x;
				p1.y += obj.y;
			}
			var p2 = {'x':_character.x+_character.width/2, 'y':_character.y+_character.height/2,};
			if( !mouseOver ) return;
			if( obj.parent && SS.helper.HitChecker.pointDistance(p1, p2, dist) ) {
				gameObject.data.nearCharacter = true;
				$this.app.cursor.status=hoverStatus;
			} else {
				gameObject.data.nearCharacter = false;
				$this.app.cursor.status='normal';
			}
		}
		_character.addObserver('nearCursorCheck', function(evt){checkNearAndSet();}, ['positionChanged']);
		gameObject.addObserver('nearCursorCheck', function(evt){checkNearAndSet();}, ['positionChanged']);
		gameObject.on('mouseenter', function(evt) {console.log('test'); mouseOver = true; checkNearAndSet();});
		gameObject.on('mousemove', function(evt) {mouseOver = true; checkNearAndSet();});
		gameObject.on('mouseleave', function(evt) {mouseOver = false; $this.app.cursor.status='normal';});
	};
	var addTextDialogToTimeline = function(timeline, txt) {
		timeline.call(function(){
			_textDialog.data.txt = txt;
			_textDialog.hide = false;
			$this.modal = true;
		});
		timeline.waitFunc(function(resolver){
			$this.modalObject().on('mouseup', function(evt){
				$this.modalObject().off('mouseup');
				_textDialog.hide = true;
				$this.modal = false;
				resolver();
			});
		});
	};
	var openTextDialog = function(txt, closeCallback) {
		var timeline= new SS.helper.Timeline();
		timeline.call(function(){
			_textDialog.data.txt = txt;
			$this.modal = true;
		});
		timeline.waitFunc(function(resolver){
			$this.modalObject().on('mouseup', function(evt){
				$this.modalObject().off('mouseup');
				$this.modal = false;
				resolver();
			});
		});
	};

	var part01 = function(callback) {
		var tl = new SS.helper.Timeline();
		tl.now(_character, {'status':'up_stop', 'x':72, 'y':170});
		tl.now(_blackLayer,{'hide':false,});
		tl.animate(_blackLayer, 3000, {'opacity':{'begin':1,'end':0,'easing':SS.helper.Easing.easeInQuad}});
		tl.now(_blackLayer,{'hide':true});
		tl.now(_character, {'status':'up_walk'});
		tl.animate(_character, 2500, {'y':{'begin':170,'end':100}});
		tl.now(_character, {'status':'up_stop'});
		tl.wait(500);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.01']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.02']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.03']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.04']);
		tl.call(function(){
			tl.stop();
			_timeline = undefined;
			callback();
		});
		tl.start();
		_timeline = tl;
	};
	var part02 = function(callback) {
		var tv = $this.gameObject('tv');
		var stackbook = $this.gameObject('teatable').child('stackbook');

		_charMove.start();

		setHoverCursorForNearCharacter(tv, 'action');
		var stackbook = $this.gameObject('teatable').child('stackbook');
		setHoverCursorForNearCharacter(stackbook, 'action');
		stackbook.on('mouseup', function(evt){
		});
	}

	Scene.init = function() {
		$this = this;
		_blackLayer = $this.uiObject('blackLayer');
		_character = $this.gameObject('doctorW');
		_textDialog = $this.modalObject('textDialog');

		_charMove = new CharacterMoveHandler($this, _character);

		part01(function(){part02();});
	};
	Scene.keyboardEventListener = function(t, type, evt) {
		_charMove.keyboardEventListener(t, type, evt);
	};
	Scene.update = function(t, view_width, view_height) {
		if( _timeline ) {
			_timeline.update(t);
		}
		if( !$this.modal ) {
			_charMove.update(t);
		}
	};
	return Scene;
})();
