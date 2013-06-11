snake.screens["game-screen"] = (function() {
	var settings = snake.settings,
		board = snake.board,
		display = snake.display,
		input = snake.input,
		firstRun = true,
		timer,
		dom = snake.dom,
		$ = dom.$;
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		board.initialize(function() {
			display.initialize(function() {
				
			});
		});
	}
	function announce(str) {
        var element = $("#game-screen .announcement")[0];
        element.innerHTML = str;
        if (Modernizr.cssanimations) {
            dom.removeClass(element, "zoomfade");
            setTimeout(function() {
                dom.addClass(element, "zoomfade");
            }, 1);
        } else {
            dom.addClass(element, "active");
            setTimeout(function() {
                dom.removeClass(element, "active");
            }, 1000);
        }
    }
	function gameOver() {
		clearInterval(timer);
		display.gameOver(function() {
			announce("Przegrałeś grę!");
		});
	}
	function turn(turn) {
		if (turn == 0) {
			board.turnLeft();
		}
		if (turn == 1) {
			board.turnRight();
		}
	}
	function setup() {
		input.initialize();
		input.bind("turnLeft", board.turnLeft);
		input.bind("turnRight", board.turnRight);
		//input.bind("go", board.go);
		input.bind("turn", turn);
		timer = setInterval(board.go, 200);
	}
	return {
		run : run,
		gameOver : gameOver,
		announce : announce
	};
})();