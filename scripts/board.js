snake.board = (function() {
	var settings,
		size,
		baseScore,
		rotation, secRotation,
		rotated = false, secRotated = false,
		startX, startY,
		bonusX, bonusY, bonus,
		board, snakes,
		score, popped,
		display = snake.display,
		time = 0, counter = 0,
		anim,
		dom = snake.dom,
		$ = dom.$;
	
	/* funkcje gry */
	function initialize(startSnake, callback) {
		settings = snake.settings;
		baseScore = settings.baseScore;
		size = settings.size;
		anim = settings.animations;
		if (!startSnake) {
			startX = Math.floor(size/2);
			startY = Math.floor(size/2);
			generateSnake();
		} else {
			startX = snakes[0].X;
			startY = snakes[0].Y;
		}
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
		rotation = Math.floor(Math.random()*4);
		rotation = rotation == 4 ? 0 : rotation;
		score = 0;
		snakes = [];
		board = [];
		
		for (var x = 0; x < size; x++) {
			board[x] = [];
			for (var y = 0; y < size; y++) {
				board[x][y] = 7;
			}
		}
		if (rotation == 0) {
		    snakes.unshift({
			X : startX, Y : startY + 1, rot : rotation
		    });
		} else if (rotation == 1) {
		    snakes.unshift({
			X : startX - 1, Y : startY, rot : rotation
		    });
		} else if (rotation == 2) {
		    snakes.unshift({
			X : startX, Y : startY - 1, rot : rotation
		    });
		} else {
		    snakes.unshift({
			X : startX + 1, Y : startY, rot : rotation
		    });
		}
		board[snakes[0].X][snakes[0].Y] = 4;
		snakes.unshift({X : startX, Y : startY, rot : rotation});
		board[snakes[0].X][snakes[0].Y] = 0;
		rndBonus();
	}
	function rndBonus() {
		do {
			bonusX = Math.floor(Math.random() * size);
			bonusY = Math.floor(Math.random() * size);
		} while (board[bonusX][bonusY] != 7);
		
		bonus = {
			X : bonusX,
			Y : bonusY,
			type : Math.random() > 0.95 ? 6 : 5
		};
		board[bonus.X][bonus.Y] = bonus.type;
	}
	function checkBonus(x, y) {
		if (getField(x, y) == 5) {
			return 1;
		} else if (getField(x, y) == 6) {
			return 2;
		}
	}
	function getField(x, y) {
		if (x < 0 || x > size - 1 || y < 0 || y > size - 1) {
			return -2;
		} else {
			return board[x][y];
		}
	}
	function checkField(x, y) {
		if (getField(x, y) == 5 || getField(x, y) == 6 || getField(x, y) == 7) {
			return true;
		} else {
			return false;
		}
	}
	function goHelper(x, y) {
		if (checkField(x, y)) {
			if (checkBonus(x, y)) {
				score += checkBonus(x, y) * baseScore;
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
					snakes.unshift({X : startX, Y : --startY, rot : 0});
					board[snakes[0].X][snakes[0].Y] = 3;
				}
				break;
			case 1:
				helper = goHelper(startX + 1, startY);
				if (helper > 0) {
					snakes.unshift({X : ++startX, Y : startY, rot : 1});
					board[snakes[0].X][snakes[0].Y] = 3;
				}
				break;
			case 2:
				helper = goHelper(startX, startY + 1);
				if (helper > 0) {
					snakes.unshift({X : startX, Y : ++startY, rot : 2});
					board[snakes[0].X][snakes[0].Y] = 3;
				}
				break;
			case 3:
				helper = goHelper(startX - 1, startY);
				if (helper > 0) {
					snakes.unshift({X : --startX, Y : startY, rot : 3});
					board[snakes[0].X][snakes[0].Y] = 3;
				}
		}
		rotated = false;
		if (helper > 0 && snakes.length > 1) {
			if (board[snakes[1].X][snakes[1].Y] == 3) {
				board[snakes[1].X][snakes[1].Y] = 0;
			}
		}
		// Przegrałeś.
		if (helper == 0) {
			board[snakes[0].X][snakes[0].Y] = 3;
			rotated = true;
			snake.screens["game-screen"].gameOver();
			return;
		}
		if (helper == 1) {
			board[snakes[snakes.length - 2].X][snakes[snakes.length - 2].Y] = 4;
		}
		if (snakes[snakes.length - 2].rot != snakes[snakes.length - 3].rot) {
		    snakes[snakes.length - 2].rot = snakes[snakes.length - 3].rot;
		}
		// Wyświetl obraz.
		if (anim == true) {
			display.animateSnake(board, snakes);
		}
		if (helper == 1) {
			board[snakes[snakes.length - 1].X][snakes[snakes.length - 1].Y] = 7;
			popped = snakes.pop();
		}
		if (anim == false) {
			display.redraw(board, snakes);
		}
		//print();
		if (++counter == 5) {
			counter = 0;
			changeTime();
		}
		snake.screens["game-screen"].saveGameData();
		
		if (secRotation < 0) {
			if (--rotation < 0)	rotation = 3;
			rotated = true;
			board[snakes[0].X][snakes[0].Y] = 2;
			if (snakes[0].rot < 0) snakes[0].rot = 3;
			secRotated = false;
			secRotation = 0;
		} else if (secRotation > 0) {
			if (++rotation > 3)	rotation = 0;
			rotated = true;
			board[snakes[0].X][snakes[0].Y] = 1;
			if (snakes[0].rot > 3) snakes[0].rot = 0;
			secRotated = false;
			secRotation = 0;
		}
	}
	function turnLeft() {
		if (!rotated) {
			if (--rotation < 0)	rotation = 3;
			rotated = true;
			board[snakes[0].X][snakes[0].Y] = 2;
			if (snakes[0].rot < 0) snakes[0].rot = 3;
		} else if (!secRotated) {
			secRotation = -1;
			secRotated = true;
		}
	}
	function turnRight() {
		if (!rotated) {
			if (++rotation > 3)	rotation = 0;
			rotated = true;
			board[snakes[0].X][snakes[0].Y] = 1;
			if (snakes[0].rot > 3) snakes[0].rot = 0;
		} else if (!secRotated) {
			secRotation = 1;
			secRotated = true;
		}
	}
	function print() {
		var str = "";
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
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
	function setBoard(newBoard) {
		board = newBoard;
	}
	function getSnakes() {
		return snakes;
	}
	function setSnakes(newSnakes) {
		snakes = newSnakes;
	}
	function getBonus() {
		return bonus;
	}
	function setBonus(newBonus) {
		bonus = newBonus;
	}
	function getScore() {
		return score;
	}
	function setScore(newScore) {
		score = newScore;
	}
	function getTime() {
		return time;
	}
	function setTime(newTime) {
		time = newTime;
	}
	function getRotation() {
		return rotation;
	}
	function setRotation(newRotation) {
		rotation = newRotation;
	}
	function getRotated() {
		return rotated;
	}
	function setRotated(newRotated) {
		rotated = newRotated;
	}
	function getCounter() {
		return counter;
	}
	function setCounter(newCounter) {
		counter = newCounter;
	}
	return {
		initialize : initialize,
		go : go,
		turnLeft : turnLeft,
		turnRight : turnRight,
		print : print,
		getBoard : getBoard,
		getSnakes : getSnakes,
		getBonus : getBonus,
		getScore : getScore,
		getTime : getTime,
		getRotation : getRotation,
		getRotated : getRotated,
		getCounter : getCounter,
		setBoard : setBoard,
		setSnakes : setSnakes,
		setBonus : setBonus,
		setScore : setScore,
		setTime : setTime,
		setRotation : setRotation,
		setRotated : setRotated,
		setCounter : setCounter
	};
})();