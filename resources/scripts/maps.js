var tutorial_scene01_room01 = (function(){
	var Scene = {};
	var $this;
	var _blackLayer;
	var _character;
	var _textDialog;
	var _charMove;
	var _timeline;
	var _partKeyboardListener;

	var nearChecking = [];
	var setHoverCursorForNearCharacter = function(gameObject, hoverStatus) {
		var mouseOver = false;
		var checkNearAndSet = function() {
			var dist = Math.max(gameObject.width, gameObject.height)/2 + Math.max(_character.width, _character.height)/2;
			var obj = gameObject;
			var p1 = {'x':obj.left+obj.width/2, 'y':obj.top+obj.height/2,};
			while( obj.parent && obj.parent != _character.parent ) {
				obj = obj.parent;
				p1.x += obj.left;
				p1.y += obj.top;
			}
			var p2 = {'x':_character.left+_character.width/2, 'y':_character.top+_character.height/2,};
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
		gameObject.on('mouseenter', function(evt) {mouseOver = true; checkNearAndSet();});
		gameObject.on('mousemove', function(evt) {mouseOver = true; checkNearAndSet();});
		gameObject.on('mouseleave', function(evt) {mouseOver = false; $this.app.cursor.status='normal';});
		nearChecking.push(gameObject);
	};
	var removeNearCharacterCheck = function() {
		_character.removeObserverGroup('nearCursorCheck');
		$.each(nearChecking, function(idx, value) {
			value.removeObserverGroup('nearCursorCheck');
			value.off('mouseenter');
			value.off('mousemove');
			value.off('mouseleave');
		});
		$this.app.cursor.status='normal';
		nearChecking = [];
	};
	var addTextDialogToTimeline = function(timeline, txt) {
		timeline.call(function(){
			_textDialog.data.txt = txt;
			_textDialog.hide = false;
			$this.modal = true;
		});
		timeline.waitFunc(function(resolver){
			var close = function() {
				$this.modalObject().off('mouseup');
				_partKeyboardListener = false;
				_textDialog.hide = true;
				$this.modal = false;
				resolver();
			}
			_partKeyboardListener = function(t, type, evt) {
				if('keydown'==type) {
					switch(evt.keyCode) {
					case 13: case 32: close(); break;
					}
				}
			}
			$this.modalObject().on('mouseup', function(evt){close();});
		});
	};
	var openTextDialog = function(txt, closeCallback) {
		var tl= new SS.helper.Timeline();
		tl.call(function(){
			_charMove.stop();
			_textDialog.data.txt = txt;
			_textDialog.hide = false;
			$this.modal = true;
		});
		tl.waitFunc(function(resolver){
			var close = function() {
				$this.modalObject().off('mouseup');
				_partKeyboardListener = false;
				_textDialog.hide = true;
				$this.modal = false;
				_charMove.start();
				resolver();
			}
			_partKeyboardListener = function(t, type, evt) {
				if('keydown'==type) {
					switch(evt.keyCode) {
					case 13: case 32: close(); break;
					}
				}
			}
			$this.modalObject().on('mouseup', function(evt){close();});
		});
		tl.start();
		_timeline = tl;
	};

	var part01 = function(callback) {
		_charMove.stop();
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
		tl.wait(500);
		tl.call(function(){
			_character.child('emoticon').status = 'silence';
		});
		tl.wait(1500);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.04']);
		tl.call(function(){
			_character.child('emoticon').status = 'none';
		});
		tl.now(_character, {'status':'down_walk'});
		tl.animate(_character, 500, {'y':{'begin':100,'end':110}});
		tl.now(_character, {'status':'down_stop'});
		tl.call(function(){
			tl.stop();
			_timeline = undefined;
			callback();
		});
		tl.start();
		_timeline = tl;
	};
	var part02 = function(callback) {
		_charMove.start();
		var stackbook = $this.gameObject('teatable').child('stackbook');
		var diningtable = $this.gameObject('diningtable');
		var couch = $this.gameObject('couch');
		var tv = $this.gameObject('tv');

		setHoverCursorForNearCharacter(tv, 'action');
		setHoverCursorForNearCharacter(stackbook, 'action');
		setHoverCursorForNearCharacter(diningtable, 'action');
		setHoverCursorForNearCharacter(couch, 'action');
		stackbook.on('mouseup', function(evt){
			if( !stackbook.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.book'], function(){});
		});
		diningtable.on('mouseup', function(evt){
			if( !diningtable.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.diningtable'], function(){});
		});
		couch.on('mouseup', function(evt){
			if( !couch.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.couch'], function(){});
		});
		tv.on('mouseup', function(evt){
			if( !tv.data.nearCharacter ) return;
			stackbook.off('mouseup');
			diningtable.off('mouseup');
			couch.off('mouseup');
			tv.off('mouseup');
			removeNearCharacterCheck();
			callback();
		});
	};
	var part03 = function(callback) {
		_charMove.stop();
		var tv = $this.gameObject('tv');
		var tl = new SS.helper.Timeline();
		tl.now(_character, {'status':'up_stop', 'x':32, 'y':90});
		tl.now(_blackLayer,{'hide':false,});
		tl.animate(_blackLayer, 3000, {'opacity':{'begin':1,'end':0,'easing':SS.helper.Easing.easeInQuad}});
		tl.now(_blackLayer,{'hide':true});
		tl.now(tv,{'status':'tv02'});
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.tv02_01']);
		tl.now(tv,{'status':'tv03'});
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.tv03_01']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.tv03_02']);
		tl.now(tv,{'status':'tv04'});
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.tv04_01']);
		tl.now(tv,{'status':'tv05'});
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.tv05_01']);
		tl.call(function(){
			tl.stop();
			_timeline = undefined;
			//callback();
		});
		tl.start();
		_timeline = tl;
	};

	Scene.init = function() {
		$this = this;
		_blackLayer = $this.uiObject('blackLayer');
		_character = $this.gameObject('main');
		_textDialog = $this.modalObject('textDialog');

		_charMove = new CharacterMoveHandler($this, _character);

		//part03();
		part01(function(){part02(function(){part03()});});
	};
	Scene.keyboardEventListener = function(t, type, evt) {
		_charMove.keyboardEventListener(t, type, evt);
		if( _partKeyboardListener ) _partKeyboardListener(t, type, evt);
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
