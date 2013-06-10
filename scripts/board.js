snake.board = (function() {
	var settings,
		cols,
		rows,
		baseScore,
		rotation,
		rotated = false,
		startX,	startY,
		endX, endY,
		bonusX, bonusY,
		board, snakes,
		score,
		display = snake.display,
		time = 0, counter = 0,
		dom = snake.dom,
		$ = dom.$,
		timer;
	
	/* funkcje gry */
	function initialize(callback) {
		settings = snake.settings;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		
		generateSnake();
		callback();
	}
	function changeTime() {
		time++;
		var minutes = 0,
			seconds = 0;
		minutes = Math.floor(time / 60);
		seconds = time % 60;
		if (seconds < 10) {
			seconds = 0 + "" + seconds;
		}
		$("#game-screen .time span")[0].innerHTML = minutes + ":" + seconds;
	}
	function generateSnake() {
		startX = Math.floor(cols/2);
		startY = Math.floor(rows/2);
		endX = startX;
		endY = startY;
		rotation = Math.floor(Math.random()*4);
		score = 0;
		snakes = [];
		board = [];
		
		for (var x = 0; x < cols; x++) {
			board[x] = [];
			for (var y = 0; y < rows; y++) {
				board[x][y] = 0;
			}
		}
		snakes.push({X : startX, Y : startY});
		board[snakes[0].X][snakes[0].Y] = 1;
		rndBonus();
	}
	function rndBonus() {
		do {
			bonusX = Math.floor(Math.random() * cols);
			bonusY = Math.floor(Math.random() * rows);
		} while (!(board[bonusX][bonusY] == 0));
		
		board[bonusX][bonusY] = 2;
	}
	function checkBonus(x, y) {
		if (getField(x, y) == 2) {
			return true;
		} else {
			return false;
		}
	}
	function getField(x, y) {
		if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
			return -1;
		} else {
			return board[x][y];
		}
	}
	function checkField(x, y) {
		if (getField(x, y) == 0 || getField(x, y) == 2) {
			return true;
		} else {
			return false;
		}
	}
	function goHelper(x, y) {
		if (checkField(x, y)) {
			if (checkBonus(x, y)) {
				score += baseScore;
				$("#game-screen .score span")[0].innerHTML = score;
				//bonuses.push({X : x, Y : y});
				rndBonus();
				return 2;
			} else {
				return 1;
			}
		}
		return 0;
	}
	function go() {
		var helper;
		rotated = false;
		switch (rotation) {
			case 0:
				helper = goHelper(startX, startY - 1);
				if (helper > 0) {
					snakes.unshift({X : startX, Y : --startY});
					board[snakes[0].X][snakes[0].Y] = 1;
					if (helper == 1) {
						board[snakes[snakes.length - 1].X][snakes[snakes.length - 1].Y] = 0;
						snakes.pop();
					}
				}
				break;
			case 1:
				helper = goHelper(startX + 1, startY);
				if (helper > 0) {
					snakes.unshift({X : ++startX, Y : startY});
					board[snakes[0].X][snakes[0].Y] = 1;
					if (helper == 1) {
						board[snakes[snakes.length - 1].X][snakes[snakes.length - 1].Y] = 0;
						snakes.pop();
					}
				}
				break;
			case 2:
				helper = goHelper(startX, startY + 1);
				if (helper > 0) {
					snakes.unshift({X : startX, Y : ++startY});
					board[snakes[0].X][snakes[0].Y] = 1;
					if (helper == 1) {
						board[snakes[snakes.length - 1].X][snakes[snakes.length - 1].Y] = 0;
						snakes.pop();
					}
				}
				break;
			case 3:
				helper = goHelper(startX - 1, startY);
				if (helper > 0) {
					snakes.unshift({X : --startX, Y : startY});
					board[snakes[0].X][snakes[0].Y] = 1;
					if (helper == 1) {
						board[snakes[snakes.length - 1].X][snakes[snakes.length - 1].Y] = 0;
						snakes.pop();
					}
				}
		}
		if (helper == 0) {
			rotated = true;
			snake.screens["game-screen"].gameOver();
			return;
		}
		print();
		snake.display.redraw(getBoard(), function(){});
		if (++counter == 5) {
			counter = 0;
			changeTime();
		}
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
	function turnLeft() {
		if (!rotated) {
			if (--rotation < 0)	rotation = 3;
			rotated = true;
		}
	}
	function turnRight() {
		if (!rotated) {
			if (++rotation > 3)	rotation = 0;
			rotated = true;
		}
	}
	function print() {
		var str = "";
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += getField(x, y) + " ";
			}
			str += "\r\n";
		}
		console.log(str);
		console.log("Score: " + score);
	}
	function getBoard() {
		return board;
	}
	return {
		initialize : initialize,
		go : go,
		turnLeft : turnLeft,
		turnRight : turnRight,
		print : print,
		getBoard : getBoard
	};
})();
