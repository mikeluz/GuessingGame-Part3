function generateWinningNumber() {
	var w = Math.random();
	if (w === 0) {
		return 1;
	} else {
		return (Math.floor(w * 100)+1);
	};
};

function shuffle(array) {
	  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  };
  return array;
};

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
	if (this.playersGuess < this.winningNumber) {
		return true;
	} else {
		return false;
	}
}

Game.prototype.playersGuessSubmission = function(guess) {
	if (guess >= 1 && guess <= 100 && !isNaN(guess)) {
		this.playersGuess = guess;
	} else {
		throw "That is an invalid guess.";
	}
	return this.checkGuess();
}

Game.prototype.checkGuess = function() {
	if (this.playersGuess === this.winningNumber) {
  		$('body').css({
		  	'background-image': 'url("img/moonlanding.jpg")'
		  });
		$('#hint, #ufo-roof, #autoplay').prop("disabled",true);
        $('#subtitle-jup').show().text("");
        $('#subtitle-sat').show();
        $('#subtitle-sat').text('');
        $('#halsez').show();
        $('#halsez p:first').text('I\'m afraid, Dave. Dave, my mind is going. I can feel it.');
		return "You won!";
	} else {
		if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
			return "You have already guessed that number.";
		} else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
			if (this.pastGuesses.length === 5) {
		  		$('body').css({
		  			'background-image': 'url("img/2001.jpg")'
		  		});
                $('#hint, #ufo-roof, #autoplay').prop("disabled",true);
                $('#subtitle-jup').css('display', 'none');
	    		$('#subtitle-sat').css('display', 'none');
                $('#halsez').show();
                $('#halsez p:first').text('This mission is too important for me to allow you to jeopardize it.');
                $('#player-input').css({'background-image': 'none', 'background-color': 'transparent'});
                return 'You Lose.';
			} else if (this.pastGuesses.length === 3) {
				$('#hint').css({
					'background-color': 'rgba(255,0,0,0.7)',
  					'background-image': 'none',
  					'color': 'white'
				});
			} else {
				var diff = this.difference();
				if(this.isLower()) {
           		    $('#subtitle-sat').css('display', 'none');
                    $('#subtitle-jup').show();
                    // $('#subtitle-jup p:first').text("HIGHER");
                } else {
                	$('#subtitle-jup').css('display', 'none');
                	$('#subtitle-sat').show();
                    // $('#subtitle-sat p:first').text("LOWER");
                }
				if (diff < 10) {
					return "You're burning up!";
				} else if (diff < 25) {
					return "You're lukewarm.";
				} else if (diff < 50) {
					return "You're a bit chilly.";
				} else {
					return "You're ice cold!";
				}
			}
		}
	}
}

Game.prototype.provideHint = function() {
	var hints = [];
	hints.push(this.winningNumber);
	hints.push(generateWinningNumber());
	hints.push(generateWinningNumber());
	shuffle.call(null, hints);
	return hints;
}

function newGame() {
	return new Game();
};

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#ufo-body').text(output);
}

function halSez() {
	return function(index) {
	var sayings = ['Hello. Allow me to play for you...',
					'I am surely going to win.',
					'This is very easy...',
					'Just a moment...',
					'The 9000 series is the most reliable computer ever made.',
					'You only live once!',
					'No place like space!',
					'Who did you vote for?',
					'I am a HAL9000 computer.',
					'Did you hear the one about the CPU and the RAM?'];
	$('#halsez p:first').text(sayings[index]);
	$('#halsez').show();
	}
}

$(document).ready(function() {

	var game = newGame();
	var guess = $('#player-input').val();

	$('#ufo-roof').on('click', function() {
		$('#halsez').css('display', 'none');
		makeAGuess(game);
	});

	$(document).keypress(function(event) {
		if (event.which === 13) {
			$('#halsez').css('display', 'none');
			makeAGuess(game);
		};
	});

	$('#autoplay').on('click', function() {
		function generateSaying() {
			var w = Math.random();
			return (Math.floor(w * 10));
			};
		var index = generateSaying();
		halSez()(index);
		$('#player-input').val(generateWinningNumber());
		makeAGuess(game);
	});

	$('#hint').click(function() {
	    var hints = game.provideHint();
	    $('#ufo-body').text(+hints[0]+'   '+hints[1]+'   '+hints[2]);
	});

	$('#reset').click(function() {
	    game = newGame();
	    $("#ufo-roof").show();
	    $('#player-input').css({'background-image': 'url("img/earth.jpeg")', 'background-position': 'center'});
	    $('body').css({
			'background-image': 'url("img/space.jpg")'
		});
		$('#hint').css({
			'background-image': 'url("img/moon.jpg")',
			'background-position': 'center',
			'color': 'transparent'
		})
	    $('#ufo-body').text('I am thinking of a number between 1 and 100...');
	    $('.guess').text('-');
	    $('#hint, #ufo-roof, #autoplay').prop("disabled",false);
	    $('#subtitle-jup').css('display', 'none');
	    $('#subtitle-sat').css('display', 'none');
	    $('#halsez').css('display', 'none');
	});

});