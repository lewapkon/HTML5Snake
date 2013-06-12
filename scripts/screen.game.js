snake.screens["game-screen"] = (function() {
	var settings = snake.settings,
		board = snake.board,
		display = snake.display,
		input = snake.input,
		firstRun = true,
		timer, paused = false,
		storage = snake.storage,
		dom = snake.dom,
		$ = dom.$;
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		startGame();
	}
	function startGame() {
		var activeGame = storage.get("activeGameData"),
			useActiveGame,
			data;
		if (activeGame) {
			useActiveGame = window.confirm("Czy chciałbyś powrócić do uprzednio zapisanej gry?");
			if (useActiveGame) {
				board.setBoard(activeGame.board);
				board.setSnakes(activeGame.snakes);
				board.setBonus(activeGame.bonus);
				board.setScore(activeGame.score);
				board.setTime(activeGame.time);
				board.setRotation(activeGame.rotation);
				board.setRotated(activeGame.rotated);
				board.setCounter(activeGame.counter);
			}
		}
		
		board.initialize(useActiveGame, function() {
			display.initialize(function() {
				timer = setInterval(board.go, 200);
			});
		});
	}
	function announce(str) {
        var element = $("#game-screen .announcement")[0];
        element.innerHTML = str;
        if (1 == 1) {
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
		stopGame();
		storage.set("activeGameData", null);
		display.gameOver(function() {
			announce("Przegrałeś grę!");
			setTimeout(function() {
				snake.game.showScreen("hiscore", board.getScore());
			}, 2500);
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
		dom.bind("#game-screen button[name=exit]", "click", function() {
			togglePause(true);
			var exitGame = window.confirm("Czy chcesz powrócić do głównego menu?");
			togglePause(false);
			if (exitGame) {
				saveGameData();
				stopGame();
				snake.game.showScreen("main-menu");
			}
		});
	}
	function stopGame() {
		clearInterval(timer);
		timer = 0;
	}
	function togglePause(enable) {
		if (enable == paused) return;
		var overlay =$("#game-screen .pause-overlay")[0];
		paused = enable;
		overlay.style.display = paused ? "block" : "none";
		if (paused) {
			clearInterval(timer);
			timer = 0;
		} else {
			timer = setInterval(board.go, 200);
		}
	}
	function saveGameData() {
		storage.set("activeGameData", {
			board : board.getBoard(),
			snakes : board.getSnakes(),
			time : board.getTime(),
			counter : board.getCounter(),
			rotation : board.getRotation(),
			rotated : board.getRotated(),
			bonus : board.getBonus(),
			score : board.getScore()
		});
	}
	return {
		run : run,
		gameOver : gameOver,
		announce : announce,
		saveGameData : saveGameData
	};
})();