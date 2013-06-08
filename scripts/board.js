snake.board = (function() {
	var settings,
		cols,
		rows,
		baseScore,
		rotation,
		startX,	startY,
		endX, endY,
		bonusX, bonusY,
		board, snakes,
		score;
	
	/* funkcje gry */
	function initialize() {
		settings = snake.settings;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		
		generateSnake();
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
		
		for (x = 0; x < cols; x++) {
			board[x] = [];
			for (y = 0; y < rows; y++) {
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
		} while (board[bonusX][bonusY] == 1)
		
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
	}
	/*
	function turn(rotate) {
		if ((Math.abs(rotation - rotate)) != 2) {
			rotation = rotate;
		}
	}*/
	function turnLeft() {
		if (--rotation < 0)	rotation = 3;
	}
	function turnRight() {
		if (++rotation > 3)	rotation = 0;
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
	return {
		initialize : initialize,
		go : go,
		turnLeft : turnLeft,
		turnRight : turnRight,
		print : print
	};
})();