snake.screens["settings"] = (function() {
	var dom = snake.dom,
		$ = dom.$,
		board = snake.board,
		game = snake.game,
		firstRun = true,
		settings = snake.settings,
		storage = snake.storage;
	function setup() {
		initialize();
	}
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
	}
	function add(name, type, eventType, handler) {
	    var list = $("#settings ul.settings-list")[0],
			element = document.createElement("li"),
			elementName = document.createElement("span"),
			elementControl = document.createElement("input");
	    elementName.innerHTML = name;
		elementControl.type = type;
		element.appendChild(elementName);
		element.appendChild(elementControl);
		list.appendChild(element);
		dom.bind(elementControl, eventType, handler);
	}
	function initialize() {
		var backButton = $("#settings footer button[name=back]")[0];
		dom.bind(backButton, "click", function(e) {
			game.showScreen("main-menu");
		});

		// Dodanie kolejnych elementów menu ustawień.

		// Nazwa
		add("Nazwa", "textbox", "change", function() {
			settings.name = $("#settings ul.settings-list input")[0].value;
			storage.set("name", settings.name);
		});
		$("#settings ul.settings-list input")[0].value = settings.name;

		// Animacje
		add("Animacje", "checkbox", "click", function() {
			if (settings.animations == true) {
				settings.animations = false;
			} else {
				settings.animations = true;
			}
		});
		$("#settings ul.settings-list input")[1].checked = true;

		// Rozmiar planszy
		add("Rozmiar planszy", "textbox", "change", function() {
			settings.size = $("#settings ul.settings-list input")[2].value;
		});
		$("#settings ul.settings-list input")[2].value = settings.size;

		/*
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
		*/
	}
	return {
		run : run
	};
})();