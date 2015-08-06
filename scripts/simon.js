	// notes from demo:
	// make boxes, scale smaller and more life-size (or adjustable);

	// my notes:
	// better panels / billboards
	// distribute boxes along whatever arc instead of just in a row / surround

	print("started loading...");
	var console = {};
	console.log = function(p) {
		if (arguments.length > 1) {

			for (var i = 1; i < arguments.length; i++) {
				print(arguments[i])
			}

		} else {
			print(p)
		}

	}

	var demoBaseURL = "https://hifi-spatial-sound-game.herokuapp.com/"

	//thanks for the assist!! :)
	Script.include('https://hifi-public.s3.amazonaws.com/eric/scripts/tween.js');
	Script.include(demoBaseURL + 'from_hifi/floor.js');



	var SOUND_URLS = [
		demoBaseURL + 'wavs/quick-tones/C3.wav',
		demoBaseURL + 'wavs/quick-tones/D3.wav',
		demoBaseURL + 'wavs/quick-tones/F3.wav',
		demoBaseURL + 'wavs/quick-tones/G3.wav',
	];

	var soundClips = [
		SoundCache.getSound(SOUND_URLS[0]),
		SoundCache.getSound(SOUND_URLS[1]),
		SoundCache.getSound(SOUND_URLS[2]),
		SoundCache.getSound(SOUND_URLS[3])
	]



	function playSound(index) {
		App.animateBlock(App.boxes[index]);
		var options = {
			position: {
				x: BOX_LOCATIONS[index].x,
				y: BOX_LOCATIONS[index].y,
				z: BOX_LOCATIONS[index].z,
			},
			volume: 0.75
		}
		Audio.playSound(soundClips[index], options);

	}

	var buzzSound = SoundCache.getSound(demoBaseURL + "wavs/buzz.wav"),

		function playBuzz() {
			var options = {
				position: {
					x: MyAvatar.position.x,
					y: MyAvatar.position.y,
					z: MyAvatar.position.z,
				},
				volume: 0.75
			}
			Audio.playSound(buzzSound, options);
		}

	var RED = {
		red: 255,
		green: 0,
		blue: 0
	};

	var GREEN = {
		red: 0,
		green: 255,
		blue: 0
	};

	var BLUE = {
		red: 0,
		green: 0,
		blue: 255
	};

	var YELLOW = {
		red: 255,
		green: 255,
		blue: 0
	};

	var COLORS = [RED, GREEN, BLUE, YELLOW];


	var GLOW_DURATION, SOUND_DURATION;
	GLOW_DURATION = SOUND_DURATION = 750;
	var RADIAL_DISTANCE = 5;

	var SURROUND_MODE = false;

	if (SURROUND_MODE) {
		RADIAL_DISTANCE = 8;
		var BOX_LOCATIONS = [{
			x: MyAvatar.position.x + RADIAL_DISTANCE,
			y: MyAvatar.position.y,
			z: MyAvatar.position.z,
		}, {
			x: MyAvatar.position.x,
			y: MyAvatar.position.y,
			z: MyAvatar.position.z + RADIAL_DISTANCE
		}, {
			x: MyAvatar.position.x,
			y: MyAvatar.position.y,
			z: MyAvatar.position.z - RADIAL_DISTANCE
		}, {
			x: MyAvatar.position.x - RADIAL_DISTANCE,
			y: MyAvatar.position.y,
			z: MyAvatar.position.z
		}]
	} else {

		var BOX_LOCATIONS = [{
				x: MyAvatar.position.x + RADIAL_DISTANCE * 2,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE + 15
			}, {
				x: MyAvatar.position.x + RADIAL_DISTANCE,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE + 15
			},

			{
				x: MyAvatar.position.x,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE + 15
			},

			{
				x: MyAvatar.position.x - RADIAL_DISTANCE,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE + 15
			},


		]
	}



	var App = {
		boxes: [],
		round: 0,
		combination: [1, 2, 2, 1, 2, 3],
		comboSoundIndex: 0,
		soundBank: [],
		isPlayingCombination: false,
		combinationInterval: null,
		combinationIntervals: [],
		startingCombinationLength: 4,
		currentCombinationLength: 4,
		currentGuessIndex: 0,
		boxesLocked: false,
		hasTween: function() {
			console.log('tween?' + TWEEN)
		},
		setStartingCombination: function() {
			var _t = this;
			var combination = [];
			for (var i = 0; i < _t.startingCombinationLength; i++) {
				var combo = Math.random(0, _t.startingCombinationLength);
				combo = Math.floor(combo * _t.startingCombinationLength);
				combination.push(combo);
			}
			_t.combination = combination;

			console.log('starting combination is...' + combination)
			return combination
		},
		generateNextStep: function() {
			var _t = this;
			var step = Math.random(0, _t.startingCombinationLength);
			step = Math.floor(step * _t.startingCombinationLength);
			_t.combination.push(step);
			_t.currentGuessIndex = 0;
			resetCombinationSound();
			console.log('new step is:' + step);
			return
		},
		handleFinalGuess: function() {
			var _t = this;
			_t.generateNextStep();
			changeGameStatusText(RIGHT_STRING)
			console.log('current combination is:' + _t.combination);
			_t.playCombination();
		},
		advancePlaybackIndex: function() {
			var _t = this;
		},
		playCombination: function() {
			var _t = this;
			changeGameStatusText(LISTEN_STRING);
			//add a slight delay before this starts... never really in a hurry.
			Script.setTimeout(function() {
				var myInterval = Script.setInterval(function() {
					App.playSoundForCombination()
				}, SOUND_DURATION);
				App.combinationIntervals.push(myInterval);
			}, 1000);

		},
		playSoundForCombination: function() {
			console.log('play sound!')
			var _t = this;
			if (_t.comboSoundIndex < _t.combination.length) {
				console.log('yea')
				_t.isPlayingCombination = true;
				playSound(_t.combination[_t.comboSoundIndex]);
				_t.comboSoundIndex++
			} else {
				console.log('nay')
				_t.isPlayingCombination = false;
				changeGameStatusText(PLAY_STRING);
				resetCombinationSound();

			}



		},
		advanceRound: function() {
			var _t = this;
			generateNextStep();
			_t.currentCombinationLength++;
			return
		},
		createBlock: function(index) {
			var _t = this;
			var size = 1;
			var myBox = {
				type: 'Box',
				dimensions: {
					x: size,
					y: size,
					z: size
				},
				position: {
					x: BOX_LOCATIONS[index].x,
					y: BOX_LOCATIONS[index].y,
					z: BOX_LOCATIONS[index].z
				},
				color: COLORS[index],
				collisionsWillMove: false,
				gravity: {
					x: 0,
					y: 0,
					z: 0
				}


			};

			_t.boxes.push(Entities.addEntity(myBox));
		},
		createBlockSet: function() {
			var _t = this;
			var howMany = 4;
			for (var i = 0; i < 4; i++) {
				_t.createBlock(i)
			}
			print('BOXES:' + _t.boxes)
			_t.hasTween();
		},
		animateBlock: function(entityId) {
			var _t = this;
			var ANIMATION_DURATION = 250;

			var begin = {
				x: 1,
				y: 1,
				z: 1
			}
			var target = {
				x: 3,
				y: 3,
				z: 3
			}
			var original = {
				x: 1,
				y: 1,
				z: 1
			}
			var tweenHead = new TWEEN.Tween(begin).to(target, ANIMATION_DURATION);
			// tween.easing(TWEEN.Easing.Elastic.InOut)
			function update() {
				Entities.editEntity(entityId, {
					dimensions: {
						x: begin.x,
						y: begin.y,
						z: begin.z
					}
				})
			}

			function updateBack() {
				Entities.editEntity(entityId, {
					dimensions: {
						x: begin.x,
						y: begin.y,
						z: begin.z
					}
				})
			}
			var tweenBack = new TWEEN.Tween(begin).to(original, ANIMATION_DURATION).onUpdate(updateBack);

			tweenHead.onUpdate(function() {
				update()

			})
			tweenHead.chain(tweenBack);
			tweenHead.start();

		}


	}

	function handleIncorrectGuess() {
		print("NOT CORRECT!")
		playBuzz();
		changeGameStatusText(WRONG_STRING);
		Script.setTimeout(function() {
			restartGame();
		}, 1000);

	}

	function handleCorrectGuess() {
		print("CORRECT!")
		var _a = App;
		_a.currentGuessIndex++;

		print('current guess index:' + _a.currentGuessIndex)
		if (_a.currentGuessIndex === _a.combination.length) {
			_a.handleFinalGuess()
		}
	}

	function makeAGuess(guessValue) {
		print('making a guess' + guessValue);
		var _a = App;

		var correct = false;

		if (guessValue === _a.combination[_a.currentGuessIndex]) {
			correct = true;
		}

		if (correct) {
			handleCorrectGuess();
		} else {
			handleIncorrectGuess();
		}
	}



	function resetCombinationSound() {
		App.comboSoundIndex = 0;
		for (var i = 0; i < App.combinationIntervals.length; i++) {
			Script.clearInterval(App.combinationIntervals[i]);
		}

	}

	function handleMagicBoxInput(boxIndex) {
		if (App.isPlayingCombination) {
			console.log('CURRENTLY PLAYING IGNORE INPUT!');
			return
		}
		var _a = App;
		var entityID = _a.boxes[boxIndex];
		_a.animateBlock(entityID);
		playSound(boxIndex);
		makeAGuess(boxIndex);
		resetCombinationSound();
	}

	function stopSound(soundPlaying) {
		console.log('should stop sound here');
		//  Audio.stopInjector(soundPlaying);
	}



	function displayVictoryCelebration() {

	}

	function restartGame() {
		print("Work on that memory!  Try again.");
		var _a = App;
		if (_a.combination.length > _a.highScores[2]) {
			console.log('NEW HIGH SCORE!!!');
		} else {
			console.log('SCORE NOT A HIGH SCORE');
		}
		storeScore(_a.combination.length);
		resetCombinationSound();
		_a.currentGuessIndex = 0;
		_a.combination = [];
		_a.setStartingCombination();
		_a.playCombination();

		console.log('COMBINATION:' + _a.combination)

	}


	function storeScore(score) {
		var http = new XMLHttpRequest();
		var url = demoBaseURL + "api/scores";
		var params = "highscore=" + score;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {
				print('IT WORKED! STORED SCORE' + http.responseText);
				getHighScores();
			} else {
				print('CHANGE STATE OF XML POST' + http.readyState)
			}
		}
		http.send(params);
	}

	function getHighScores(howMany) {
		var http = new XMLHttpRequest();
		var url = demoBaseURL + "api/top/" + howMany;
		http.open("GET", url, true);



		http.onreadystatechange = function() { //Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {

				var data = JSON.parse(http.responseText);
				App.highScores = data;
				displayHighScorePanel();
				changeHighScoreText(data);
				print('IT WORKED!' + App.highScores.length);
			} else {
				print('CHANGE STATE OF XML GET')
			}
		}
		http.send(null);
	}

	function changeGameStatusText(text) {
		console.log('change game status text' + text);
		Entities.editEntity(App.displayTextEntity, {
			text: text
		})
	}



	var LISTEN_STRING = 'LISTEN...';
	var PLAY_STRING = 'NOW PLAY!';
	var WRONG_STRING = 'WRONG!  START OVER!';
	var RIGHT_STRING = 'GREAT ROUND, NEXT!';

	function displayTextPanel() {
		console.log('displaying high scores');
		App.displayTextEntity = Entities.addEntity({
			type: "Text",
			dimensions: {
				x: 6,
				y: 2,
				z: 1
			},
			position: {
				x: BOX_LOCATIONS[1].x,
				y: BOX_LOCATIONS[1].y + 3,
				z: BOX_LOCATIONS[1].z
			},
			rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
			backgroundColor: {
				red: 0,
				green: 0,
				blue: 0
			},
			textColor: {
				red: 255,
				green: 255,
				blue: 255
			},
			lineHeight: 0.5
		});
		console.log('added text')

	}

		function changeComboLengthText(text) {
		console.log('change combo length text' + text);
		Entities.editEntity(App.comboLengthTextEntity, {
			text: text
		})
	}

		function displayComboLengthPanel() {
		console.log('displaying combo length');
		App.comboLengthTextEntity = Entities.addEntity({
			type: "Text",
			dimensions: {
				x: 6,
				y: 2,
				z: 1
			},
			position: {
				x: BOX_LOCATIONS[1].x,
				y: BOX_LOCATIONS[1].y + 5,
				z: BOX_LOCATIONS[1].z
			},
			rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
			backgroundColor: {
				red: 0,
				green: 0,
				blue: 0
			},
			textColor: {
				red: 255,
				green: 255,
				blue: 255
			},
			lineHeight: 0.5
		});
		

	}


	function changeHighScoreText(data) {
		App.highestScore = 0;
		console.log('change high score text');
		var scoreString = "High Scores: \n \n"
		for (var i = 0; i < 3; i++) {
			print('DATA IN HIGH SCORE:' + data[i].highscore);
			if (data[i].highscore > App.highestScore) {
				App.highestScore = data[i].highscore;
			}
			scoreString = scoreString + data[i].highscore + "\n ";
		}

		console.log('HIGHEST SCORE:', App.highestScore);
		Entities.editEntity(App.highScoreTextEntity, {
			text: scoreString
		})
	}

	function displayHighScorePanel() {
		App.highScoreTextEntity = Entities.addEntity({
			type: "Text",
			dimensions: {
				x: 6,
				y: 4,
				z: 1
			},
			position: {
				x: BOX_LOCATIONS[1].x - 8,
				y: BOX_LOCATIONS[1].y + 4,
				z: BOX_LOCATIONS[1].z + 5
			},
			rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
			backgroundColor: {
				red: 0,
				green: 0,
				blue: 0
			},
			textColor: {
				red: 255,
				green: 255,
				blue: 255
			},
			lineHeight: 0.5
		});
		console.log('added scores at' + App.highScoreTextEntity)

	}

	function displayCurrentLevel() {

	}

	function showInstructions() {


	}

	function hideInstructions() {

	}

	//
	//  rayPickExample.js
	//  examples
	//
	//  Created by Brad Hefta-Gaub on 2/6/14.
	//  Copyright 2014 High Fidelity, Inc.
	//
	//  This is an example script that demonstrates use of the Camera class
	//
	//  Distributed under the Apache License, Version 2.0.
	//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
	//

	function mousePressEvent(event) {
		var _a = App;
		print("mousePressEvent event.x,y=" + event.x + ", " + event.y);
		var pickRay = Camera.computePickRay(event.x, event.y);
		intersection = Entities.findRayIntersection(pickRay);
		if (!intersection.accurate) {
			print(">>> NOTE: intersection not accurate. will try calling Entities.findRayIntersectionBlocking()");
			intersection = Entities.findRayIntersectionBlocking(pickRay);
			print(">>> AFTER BLOCKING CALL intersection.accurate=" + intersection.accurate);
		}

		if (intersection.intersects) {
			print("intersection entityID=" + intersection.entityID);

			var entityID = intersection.entityID;

			var boxIndex = App.boxes.indexOf(entityID);

			print('BOXINDEX?', boxIndex);
			if (boxIndex > -1) {
				print('hit a box')
				handleMagicBoxInput(boxIndex);
			} else {
				print("intersection, but not in boxes")
			}
		}
	}

	Controller.mousePressEvent.connect(mousePressEvent);


	function updateTweens() {
		TWEEN.update();
	}

	Script.update.connect(updateTweens);



	function scriptEnding() {
		var _a = App;
		for (var i = 0; i < _a.boxes.length; i++) {
			console.log('cleaning up')
			Entities.deleteEntity(_a.boxes[i]);
		}


		Entities.deleteEntity(_a.displayTextEntity);

		console.log('cleaning ' + _a.highScoreTextEntity)
		Entities.deleteEntity(_a.highScoreTextEntity);

		resetCombinationSound();

	}
	Script.scriptEnding.connect(scriptEnding);

	print("...finished loading");
	getHighScores();

	App.createBlockSet();

	App.setStartingCombination();
	displayTextPanel();
	App.playCombination();