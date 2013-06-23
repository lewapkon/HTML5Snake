snake.input = (function() {
	var dom = snake.dom,
		$ = dom.$,
		settings = snake.settings,
		inputHandlers,
		keys = {
			37 : "KEY_LEFT",
			38 : "KEY_UP",
			39 : "KEY_RIGHT"
		};
	function handleClick(event, control, click) {
		var action = settings.controls[control];
		if (!action) {
				return;
		}
		var board = $("#game-screen .game-board")[0],
			direction,
			rect = board.getBoundingClientRect();
		if (click.clientX - rect.left < rect.width / 2) {
			direction = 0;
		} else {
			direction = 1;
		}
		trigger(action, direction);
		//event.preventDefault();
	}
	function initialize() {
		inputHandlers = {};
		var board = $("#game-screen .game-board")[0];
		dom.bind(board, "mousedown", function(event) {
			handleClick(event, "CLICK", event);
		});
		dom.bind(document, "touchstart", function(event) {
			handleClick(event, "TOUCH", event.targetTouches[0]);
		});
		dom.bind(document, "keydown", function(event) {
			var keyName = keys[event.keyCode];
			if (keyName && settings.controls[keyName]) {
				event.preventDefault();
				trigger(settings.controls[keyName]);
			}
		});
	}
	function bind(action, handler) {
		// Załącza działanie w grze do handlera.
		if (!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}
	function trigger(action) {
		// Wyzwala działanie w grze.
		var handlers = inputHandlers[action],
		args = Array.prototype.slice.call(arguments, 1);
		if (handlers) {
			for (var i = 0; i < handlers.length; i++) {
				handlers[i].apply(null, args);
			}
		}
	}
	return {
		initialize : initialize,
		bind : bind
	};
})();