snake.board = (function() {
	var settings,
		cols,
		rows,
		baseScore,
		rotation,
		startX,	startY,
		endX, endY,
		bonusX, bonusY,
		snakes, bonuses,
		score;
	
	/* funkcje gry */
	function initialize() {
		settings = snake.settings;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		
		generateSnake();
	}
	function rndBonus() {
		do {
			bonusX = Math.floor(Math.random() * cols);
			bonusY = Math.floor(Math.random() * rows);
		} while (snakes[bonusX][bonusY] == 1)
		
		snakes[bonusX][bonusY] = 2;
	}
	function checkBonus(x, y) {
		if (getField(x, y) == 2) {
			return true;
		} else {
			return false;
		}
	}
	function generateSnake() {
		startX = Math.floor(cols/2);
		startY = Math.floor(rows/2);
		endX = startX;
		endY = startY;
		rotation = Math.floor(Math.random()*4);
		score = 0;
		bonuses = new Array();
		snakes = [];
		
		for (x = 0; x < cols; x++) {
			snakes[x] = [];
			for (y = 0; y < rows; y++) {
				snakes[x][y] = 0;
			}
		}
		snakes[startX][startY] = 1;
		rndBonus();
	}
	function checkArray() {
		if (bonuses.length > 0 && bonuses[0].X == endX && bonuses[0].Y == endY) {
			return false;
		} else {
			return true;
		}
	}
	function getField(x, y) {
		if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
			return -1;
		} else {
			return snakes[x][y];
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
				bonuses.push({X : x, Y : y});
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
		if (rotation == 0) {
			helper = goHelper(startX, startY - 1);
			if (helper > 0) {
				snakes[startX][--startY] = 1;
				if (helper == 1) {
					snakes[endX][endY--] = 0;
				} else {
					//bonuses.shift();
				}
			}
		} else if (rotation == 1) {
			helper = goHelper(startX + 1, startY);
			if (helper > 0) {
				snakes[++startX][startY] = 1;
				if (helper == 1) {
					snakes[endX++][endY] = 0;
				} else {
					//bonuses.shift();
				}
			}
		} else if (rotation == 2) {
			helper = goHelper(startX, startY + 1);
			if (helper > 0) {
				snakes[startX][++startY] = 1;
				if (helper == 1) {
					snakes[endX][endY++] = 0;
				} else {
					//bonuses.shift();
				}
			}
		} else if (rotation == 3) {
			helper = goHelper(startX - 1, startY);
			if (helper > 0) {
				snakes[--startX][startY] = 1;
				if (helper == 1) {
					snakes[endX--][endY] = 0;
				} else {
					//bonuses.shift();
				}
			}
		}
	}
	function turn(rotate) {
		if ((Math.abs(rotation - rotate)) != 2) {
			rotation = rotate;
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
	function printBonus() {
		console.log(bonuses);
	}
	function test() {
		console.log("Length: " + bonuses.length);
		console.log("If: " + bonuses.length > 0 && bonuses[0].X == endX && bonuses[0].Y == endY);
		console.log("Start: " + startX + ", " + startY);
		console.log("End: " + endX + ", " + endY);
		}
	return {
		initialize : initialize,
		go : go,
		turn : turn,
		print : print,
		printBonus : printBonus,
		test : test
	};
})();
