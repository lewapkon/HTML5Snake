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
		var list = $("#settings ul.settings-list")[0],
			cheat = document.createElement("li"),
			cheatName = document.createElement("span"),
			cheatValue = document.createElement("input");
		cheatName.innerHTML = "Cheaty";
		cheatValue.type = "checkbox";
		cheatValue.checked = false;
		cheat.appendChild(cheatName);
		cheat.appendChild(cheatValue);
		list.appendChild(cheat);
		dom.bind(cheatValue, "click", function(e) {
			if (settings.baseScore == 1000) {
				settings.baseScore = 100;
			} else {
				settings.baseScore = 1000;
			}
		});
		
		var list = $("#settings ul.settings-list")[0],
			row = document.createElement("li"),
			rowName = document.createElement("span"),
			rowValue = document.createElement("input");
		rowName.innerHTML = "Wielkość planszy";
		rowValue.type = "textbox";
		row.appendChild(rowName);
		row.appendChild(rowValue);
		list.appendChild(row);
		dom.bind(rowValue, "change", function(e) {
		settings.size=rowValue.value;
		});
		
	}
	return {
		run : run
	};
})();