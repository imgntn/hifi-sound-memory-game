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

var demoBaseURL="https://hifi-spatial-sound-game.herokuapp.com/"

	//thanks for the assist!! :)
	Script.include('https://hifi-public.s3.amazonaws.com/eric/scripts/tween.js');
	Script.include(demoBaseURL+'from_hifi/floor.js');

	

	var SOUND_URLS = [
		demoBaseURL+'wavs/C3.wav',
		demoBaseURL+'wavs/D3.wav',
		demoBaseURL+'wavs/F3.wav',
		demoBaseURL+'wavs/G3.wav',
	];

	var soundClips = [
		SoundCache.getSound(SOUND_URLS[0]),
		SoundCache.getSound(SOUND_URLS[1]),
		SoundCache.getSound(SOUND_URLS[2]),
		SoundCache.getSound(SOUND_URLS[3])
	]

	function playSound(index) {

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
	GLOW_DURATION = SOUND_DURATION = 1250;
	var RADIAL_DISTANCE = 5;

	var SURROUND_MODE = false;

	if (SURROUND_MODE) {
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
			z: MyAvatar.position.z,
		}]
	} else {

		var BOX_LOCATIONS = [{
				x: MyAvatar.position.x + RADIAL_DISTANCE * 2,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE,
			}, {
				x: MyAvatar.position.x + RADIAL_DISTANCE,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE,
			},

			{
				x: MyAvatar.position.x,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE,
			},

			{
				x: MyAvatar.position.x - RADIAL_DISTANCE,
				y: MyAvatar.position.y,
				z: MyAvatar.position.z + RADIAL_DISTANCE,
			},


		]
	}



	var App = {
		boxes: [],
		round: 0,
		combination: [1, 2, 2, 1, 2, 3],
		comboSoundIndex: 0,
		soundBank: [],
		combinationInterval: null,
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
			Script.clearInterval(App.combinationInterval);
			console.log('new step is:' + step);
			return
		},
		handleFinalGuess: function() {
			var _t = this;
			_t.generateNextStep();
			console.log('current combination is:' + _t.combination);
			_t.playCombination();
		},
		advancePlaybackIndex: function() {
			var _t = this;
		},
		playCombination: function() {
			var _t = this;
			//add a slight delay before this starts... never really in a hurry.
			Script.setTimeout(function() {
				_t.combinationInterval = Script.setInterval(function() {
					App.playSoundForCombination()
				}, SOUND_DURATION);
			}, 500);

		},
		playSoundForCombination: function() {
			console.log('play sound!')
			var _t = this;
			if (_t.comboSoundIndex < _t.combination.length) {
				console.log('yea')
				playSound(_t.combination[_t.comboSoundIndex])
				_t.comboSoundIndex++
			} else {
				console.log('nay')
				Script.clearInterval(App.combinationInterval);
				_t.comboSoundIndex = 0;
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
				//,script:'http://localhost:8080/playSoundOnClick.js'


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
		animateBlock: function() {
			var _t = this;
			var tween = new TWEEN.Tween({
					x: 50,
					y: 0
				})
				.to({
					x: 400
				}, 2000)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onUpdate(function() {

				})
				.start();

		}
	}

	function handleIncorrectGuess() {
		print("NOT CORRECT!")
		restartGame();
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

	function growBox(entityID) {
		Entities.editEntity(entityID, {
			scale: {
				x: 5,
				y: 5,
				z: 5
			}
		})
	}


	function shrinkBox() {
		Entities.editEntity(entityID, {
			scale: {
				x: 1,
				y: 1,
				z: 1
			}
		})
	}

	function toggleGlow(entityID) {

		Script.setTimeout(shrinkBox(entityID, GLOW_DURATION));
	}

	function handleMagicBoxInput(boxIndex) {
		var _a = App;
		var entityID = _a.boxes[boxIndex];
		growBox(entityID);
		playSound(boxIndex);
		makeAGuess(boxIndex);
	}

	function stopSound(soundPlaying) {
		console.log('should stop sound here');
		//  Audio.stopInjector(soundPlaying);
	}


	function toggleGlowForDuration() {
		var duration = GLOW_DURATION;
		//	Script.setTimeout(_t.stopSound(soundPlaying), duration);

	}

	function playerDidWin() {
		storeScore(round)
		displayVictoryCelebration();
	}

	function displayVictoryCelebration() {

	}

	function restartGame() {
		print("Work on that memory!  Try again.");
		Script.clearInterval(App.combinationInterval);

		var _a = App;
		_a.currentGuessIndex = 0;
		_a.combination = [];
		_a.setStartingCombination();
		_a.playCombination();
		console.log('COMBINATION:' + _a.combination)

	}


	function storeScore(userID, score) {
		var http = new XMLHttpRequest();
		var url = demoBaseURL+"api/scores";
		var params = "userID=" + userID + "&score=" + score;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {
				print('IT WORKED!' + http.responseText);
			} else {
				print('IT DID NOT WORK :(')
			}
		}
		http.send(params);
	}

	function getHighScores(howMany) {
		var http = new XMLHttpRequest();
		var url = demoBaseURL+"api/top/" + howMany;
		http.open("GET", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {

				var data = JSON.parse(http.responseText);

				print('IT WORKED!');
			} else {
				print('IT DID NOT WORK :(')
			}
		}
		http.send(params);
	}

	function displayHighScores() {

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

	function scriptEnding() {
		var _a = App;
		for (var i = 0; i < _a.boxes.length; i++) {
			console.log('cleaning up')
			Entities.deleteEntity(_a.boxes[i]);
		}
		Script.clearInterval(App.combinationInterval);

	}
	Script.scriptEnding.connect(scriptEnding);

	print("...finished loading");

	App.createBlockSet();
	App.setStartingCombination();
	App.playCombination();