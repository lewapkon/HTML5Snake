snake.screens["settings"] = (function() {
	var dom = snake.dom,
		$ = dom.$,
		board = snake.board,
		game = snake.game,
		firstRun = true,
		settings = snake.settings;
	function setup() {
		initialize();
	}
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
	}
	function initialize() {
		var backButton = $("#settings footer button[name=back]")[0];
		dom.bind(backButton, "click", function(e) {
			game.showScreen("main-menu");
		});
		var list = $("#settings ul.settings-list")[0],
			anim = document.createElement("li"),
			animName = document.createElement("span"),
			animValue = document.createElement("input");
		animName.innerHTML = "Animacje";
		animValue.type = "checkbox";
		animValue.checked = true;
		anim.appendChild(animName);
		anim.appendChild(animValue);
		list.appendChild(anim);
		dom.bind(animValue, "click", function(e) {
			if (settings.animations == true) {
				settings.animations = false;
			} else {
				settings.animations = true;
			}
		});
	}
	return {
		run : run
	};
})();