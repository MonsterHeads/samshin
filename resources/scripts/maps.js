var tutorial_scene01_room01 = (function(){
	var Scene = {};
	var $this;
	var _blackLayer;
	var _character;
	var _textDialogTop;
	var _textDialogBottom;
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
	var addTextDialogToTimeline = function(timeline, txt, pos, portrait) {
		var textDialog = _textDialogBottom;
		var portraitObj = {'hide':false};
		if( portrait ) {
			portraitObj = $this.modalObject(portrait);
		}
		if( pos == 'top' ) {
			textDialog = _textDialogTop;
		}
		timeline.call(function(){
			textDialog.data.txt = txt;
			textDialog.hide = false;
			portraitObj.hide = false;
			$this.modal = true;
		});
		timeline.waitFunc(function(resolver){
			var close = function() {
				$this.modalObject().off('mouseup');
				_partKeyboardListener = false;
				textDialog.hide = true;
				portraitObj.hide = true;
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
			_textDialogBottom.data.txt = txt;
			_textDialogBottom.hide = false;
			$this.modal = true;
		});
		tl.waitFunc(function(resolver){
			var close = function() {
				$this.modalObject().off('mouseup');
				_partKeyboardListener = false;
				_textDialogBottom.hide = true;
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
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.01_01']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.01_02']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.01_03']);
		tl.wait(500);
		tl.call(function(){
			_character.child('emoticon').status = 'silence';
		});
		tl.wait(1500);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.01_04']);
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
		tl.now(_character, {'status':'up_stop', 'x':32, 'y':88});
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
		tl.now(tv,{'status':'tv01'});
		tl.wait(1000);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.03_01']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.03_02']);
		tl.animate(_character, 300, {'y':{'begin':88,'end':82}});
		tl.wait(300);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.03_03']);
		tl.call(function(){
			tl.stop();
			_timeline = undefined;
			callback();
		});
		tl.start();
		_timeline = tl;
	};
	var part04 = function(callback) {
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
			openTextDialog(txt['tutorial.scene01.room01.04_01'], function(){});
		});
		diningtable.on('mouseup', function(evt){
			if( !diningtable.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.04_01'], function(){});
		});
		couch.on('mouseup', function(evt){
			if( !couch.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.04_01'], function(){});
		});
		tv.on('mouseup', function(evt){
			if( !tv.data.nearCharacter ) return;
			openTextDialog(txt['tutorial.scene01.room01.04_01'], function(){});
		});
		_character.addObserver('location_event', function(evt){
			if( 190 <= _character.bottom ) {
				stackbook.off('mouseup');
				diningtable.off('mouseup');
				couch.off('mouseup');
				tv.off('mouseup');
				removeNearCharacterCheck();
				_character.removeObserverGroup('location_event');
				callback();
			}
		}, ['positionChanged']);
	};
	var part05 = function(callback) {
		_charMove.stop();
		var detective = $this.gameObject('detective');
		var tl = new SS.helper.Timeline();
		var tl2;
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_01'], 'top');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_02'], 'top');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_03'], 'top');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_04'], 'top');
		var dx = _character.x-60;
		var dxStatus = 0<dx?'left_walk':'right_walk';
		var dxTime = Math.max(50, Math.abs(Math.floor(dx*35)));
		tl.now(_character, {'status':dxStatus, 'x':158,});
		tl.animate(_character, dxTime, {'x':{'begin':_character.x,'end':60}});
		tl.now(_character, {'status':'down_stop'});
		tl.now(detective, {'status':'up_walk', 'x':84, 'y':180, 'hide':false});
		tl.animate(detective, 1000, {'y':{'begin':detective.y,'end':158}});
		tl.now(detective, {'status':'up_stop'});
		tl.now(_character, {'status':'up_walk'});
		var p = tl.duration + 500;
		tl.animate(_character, 1950, {'y':{'begin':158,'end':110}});
		tl.now(_character, {'status':'up_stop'});
		tl2 = new SS.helper.Timeline();
		tl2.now(detective, {'status':'up_walk'});
		tl2.animate(detective, 1950, {'y':{'begin':158,'end':110}});
		tl2.now(detective, {'status':'up_stop'});
		tl.parallelMerge(tl2, p);
		tl.wait(500);
		tl.now(_character, {'status':'right_stop'});
		tl.now(detective, {'status':'left_stop'});
		tl.wait(1000);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_05'], 'bottom', 'detective');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_06']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_07'], 'bottom', 'detective');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_08']);
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_09'], 'bottom', 'detective');
		addTextDialogToTimeline(tl, txt['tutorial.scene01.room01.05_10']);

		tl.call(function(){
			tl.stop();
			_timeline = undefined;
			callback();
		});
		tl.start();
		_timeline = tl;
	};

	var doChain = function(functionArray, callback) {
		var chain = callback;
		for( var i=functionArray.length-1; i >= 0; i-- ) {
			(function(){
				var nextFunc = functionArray[i];
				var curFunc = chain;
				var nextChain = function() {
					nextFunc(curFunc);
				}
				chain = nextChain;
			})();
		}
		chain();
	};
	Scene.init = function() {
		$this = this;
		_blackLayer = $this.uiObject('blackLayer');
		_character = $this.gameObject('main');
		_textDialogTop = $this.modalObject('textDialogTop');
		_textDialogBottom = $this.modalObject('textDialogBottom');

		_charMove = new CharacterMoveHandler($this, _character);

		doChain([part01, part02, part03, part04, part05], function(){
		//doChain([part04, part05], function(){
			_charMove.stop();
		});
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
