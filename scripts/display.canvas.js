snake.display = (function() {
	var dom = snake.dom,
		$ = dom.$,
		canvas, ctx,
		size,
		snakeSize,
		firstRun = true,
		board,
		animations = [],
		timer;
	function createBackground() {
		var background = document.createElement("canvas"),
			bgctx = background.getContext("2d"),
			image = snake.images["images/tlo" + snakeSize + ".png"];
		dom.addClass(background, "background");
		background.width = size * snakeSize;
		background.height = size * snakeSize;
		//bgctx.fillStyle = "rgba(225,235,255,0.15)";
		//bgctx.fillRect(0, 0, cols * snakeSize, rows * snakeSize);
		
		for (var x = 0; x < size; x++) {
			for (var y = 0; y < size; y++) {
				bgctx.drawImage(image, x * snakeSize, y * snakeSize, snakeSize, snakeSize);
			}
		}
		return background;
	}
	function addAnimation(runTime, fncs) {
        var anim = {
            runTime : runTime,
            startTime : Date.now(),
            pos : 0,
            fncs : fncs
        };
        animations.push(anim);
    }
	function setup() {
		var boardElement = $("#game-screen .game-board")[0];
		size = snake.settings.size;
		snakeSize = snake.settings.snakeSize;
		
		canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
		dom.addClass(canvas, "board");
		canvas.width = size * snakeSize;
		canvas.height = size * snakeSize;
		ctx.scale(snakeSize, snakeSize);
		
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas);
		
		previousCycle = Date.now();
		window.requestAnimationFrame(cycle);
	}
	function renderAnimations(time, lastTime) {
        var anims = animations.slice(0), // Kopiuje listę.
            n = anims.length,
            animTime,
            anim,
            i;

        // Wywołuje funkcję before(). 
        for (i=0;i<n;i++) {
            anim = anims[i];
            if (anim.fncs.before) {
                anim.fncs.before(anim.pos);
            }
            anim.lastPos = anim.pos;
            animTime = (lastTime - anim.startTime);
            anim.pos = animTime / anim.runTime;
            anim.pos = Math.max(0, Math.min(1, anim.pos));
        }

        animations = []; // Resetuje listę animacji.

        for (i=0;i<n;i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos == 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } else {
                animations.push(anim);
            }
        }
    }
	function cycle(time) {
        renderAnimations(time, previousCycle);
        previousCycle = time;
        window.requestAnimationFrame(cycle);
    }
	function gameOver(callback) {
        addAnimation(1000, {
            render : function(pos) {
                canvas.style.left =
                    0.2 * pos * (Math.random() - 0.5) + "em";
                canvas.style.top =
                    0.2 * pos * (Math.random() - 0.5) + "em";
            },
            done : function() {
                canvas.style.left = "0";
                canvas.style.top = "0";
                explode(callback);
            }
        });
    }
	function explodePieces(pieces, pos, delta) {
        var piece, i;
        for (i = 0; i < pieces.length ; i++) {
            piece = pieces[i];

            piece.vel.y += 50 * delta;
            piece.pos.y += piece.vel.y * delta;
            piece.pos.x += piece.vel.x * delta;

            if (piece.pos.x < 0 || piece.pos.x > size) {
                piece.pos.x = Math.max(0, piece.pos.x);
                piece.pos.x = Math.min(size, piece.pos.x);
                piece.vel.x *= -1;
            }

            ctx.save();
            ctx.translate(piece.pos.x, piece.pos.y);
            ctx.rotate(piece.rot * pos * Math.PI * 4);
            ctx.translate(-piece.pos.x, -piece.pos.y);
            drawObject(piece.type,
                piece.pos.x - 0.5,
                piece.pos.y - 0.5,
                1, piece.rotation
            );
            ctx.restore();
        }
    }

    function explode(callback) {
        var pieces = [],
            piece,
            x, y,
            bonus = snake.board.getBonus(),
            snakes = snake.board.getSnakes();
        for (var i = 0; i < snakes.length; i++) {
                	x = snakes[i].X;
                	y = snakes[i].Y;
                	piece = {
                   		type : board[x][y],
                    	pos : {
                        	x : x + 0.5,
                        	y : y + 0.5
                    	},
                    	vel : {
                        	x : (Math.random() - 0.5) * 20,
                        	y : -Math.random() * 10
                    	},
                    	rot : (Math.random() - 0.5) * 3,
                    	rotation : snakes[i].rot
                	}
                pieces.push(piece);
        }
        
		pieces.push({
			type : board[bonus.X][bonus.Y],
			pos : {
				x : bonus.X,
				y : bonus.Y
			},
			vel : {
				x : (Math.random() - 0.5) * 20,
				y : -Math.random() * 10
			},
			rot : (Math.random() - 0.5) * 3,
			rotation : 0
		});
		
        addAnimation(3000, {
            before : function(pos) {
                ctx.clearRect(0,0,size,size);
            },
            render : function(pos, delta) {
                explodePieces(pieces, pos, delta);
            },
            done : callback
        });
    }
	function initialize(callback) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		callback();
	}
	function drawObject(type, x, y, scale, rot) {
		var image = snake.images["images/images" + snakeSize + ".png"];
		ctx.save();
		if (type == 6) return;
		if (typeof scale !== "undefined" && scale > 0) {
			ctx.beginPath();
			ctx.rect(x, y, 1, 1);
			ctx.clip();
			ctx.translate(x + 0.5, y + 0.5);
			ctx.scale(scale, scale);
			if (rot) {
				ctx.rotate(rot);
			}
			ctx.translate(-x - 0.5, -y - 0.5);
		}
		ctx.drawImage(image, type * snakeSize, 0, snakeSize, snakeSize, x, y, 1, 1);
		ctx.restore();
	}
	function redraw(newBoard, snakes) {
		var x, y, field;
		board = newBoard;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawObject(board[snakes[0].X][snakes[0].Y], snakes[0].X, snakes[0].Y, 1, snakes[0].rot * Math.PI / 2);
		for (var i = 1; i < snakes.length; i++) {
			x = snakes[i].X;
			y = snakes[i].Y;
			drawObject(board[x][y], x, y, 1, snakes[i].rot * Math.PI / 2);
		}
		for (x = 0; x < size; x++) {
			for (y = 0; y < size; y++) {
				field = board[x][y];
				if (field == 4 || field == 5) {
					drawObject(field, x, y, 1, 0);
				}
			}
		}
	}
	function moveSnake(objects, pos) {
		var fromX, fromY, toX, toY,
			destX, destY;
		for (var i = 0; i < objects.length; i++) {
			fromX = objects[i].from.x;
			fromY = objects[i].from.y;
			toX = objects[i].to.x;
			toY = objects[i].to.y;
			if (objects[i].type != 1 && objects[i].type != 2) {
				drawObject(objects[i].type, fromX + ((toX - fromX) * pos),
							  fromY + ((toY - fromY) * pos),
							  1, objects[i].rot
			);
			} else {
				var difference = 0.95, helper;
				if (toX != fromX) {
					if (toX < fromX) {
						destX = toX + difference;
						helper = 3;
					} else {
						destX = toX - difference;
						helper = 1;
					}
				} else {
					destX = toX;
				}
				if (toY != fromY) {
					if (toY < fromY) {
						destY = toY + difference;
						helper = 0;
					} else {
						destY = toY - difference;
						helper = 2;
					}
				} else {
					destY = toY;
				}
	    		drawObject(0, destX, destY, 1, objects[i].rot);
				drawObject(objects[i].type, toX, toY, 1, objects[i].rot);
    	        if (i == objects.length - 1) {
					if (helper == 0) {
						ctx.clearRect(destX, destY + 1 - pos, 1, pos);
					} else if (helper == 1) {
						ctx.clearRect(destX, destY, pos, 1);
					} else if (helper == 2) {
						ctx.clearRect(destX, destY, 1, pos);
					} else {
						ctx.clearRect(destX + 1 - pos, destY, pos, 1);
					}
				}			
			}
		}
	}
	function animateSnake(newBoard, snakes, popped) {
		var objects = [], current,
			bonus = snake.board.getBonus();
		board = newBoard;
		
		for (var i = 0; i < snakes.length - 1; i++) {
			current = {
				from : {
					x : snakes[i + 1].X,
					y : snakes[i + 1].Y
				},
				to : {
					x : snakes[i].X,
					y : snakes[i].Y
				},
				type : board[snakes[i].X][snakes[i].Y],
				rot : snakes[i].rot * Math.PI / 2
			};
				objects.push(current);
		}
		
		addAnimation(snake.settings.fps, {
            before : function(pos) {
                ctx.clearRect(0, 0, size, size);
            },
            render : function(pos) {
                drawObject(bonus.type, bonus.X, bonus.Y, 1, 0);
                moveSnake(objects, pos);
            }
        });
	}
	return {
		initialize : initialize,
		redraw : redraw,
		gameOver : gameOver,
		animateSnake : animateSnake
	};
})();