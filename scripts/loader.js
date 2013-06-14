var snake = {
	screens : {},
	settings : {
		rows : 15,
		cols : 15,
		baseScore : 100,
		snakeSize : 16,
		controls : {
			KEY_UP : "go",
			KEY_LEFT : "turnLeft",
			KEY_RIGHT : "turnRight",
			CLICK : "turn",
			TOUCH : "turn"
		}
	},
	images : {}
};

// Oczekiwanie na załadowanie głównego dokumentu.
window.addEventListener("load", function(){

	// Określa rozmiar kawałka węża.
	var snakeProto = document.getElementById("snake-proto"),
		rect = snakeProto.getBoundingClientRect();
	snake.settings.snakeSize = rect.width;
	if (snake.settings.snakeSize != 40 || snake.settings.snakeSize != 64) {
		snake.settings.snakeSize = 40;
	}

	Modernizr.addTest("standalone", function() {
		return (window.navigator.standalone != false);
	});

	// Rozszerza funkcjonalnosć systemu yepnope o wstępne ładowanie
	yepnope.addPrefix("preload", function(resource) {
		resource.noexec = true;
		return resource;
	});

	var numPreload = 0,
	numLoaded = 0;
	yepnope.addPrefix("loader", function(resource) {
		console.log("Ładowanie: " + resource.url);
		var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
		resource.noexec = isImage;
		numPreload++;
		resource.autoCallback = function(e) {
			console.log("Postęp ładowania: " + resource.url);
			numLoaded++;
			if (isImage) {
				var image = new Image();
				image.src = resource.url;
				snake.images[resource.url] = image;
			}
		};
		return resource;
	});

	function getLoadProgress() {
		if (numPreload > 0) {
			return numLoaded/numPreload;
		} else {
			return 0;
		}
	}
	// Rozpoczęcie dynamicznego ładowania.

	Modernizr.load([{
		// Następujące skrypty są ładowane domyślnie.
		load : [
			"scripts/sizzle.js",
			"scripts/dom.js",
			"scripts/requestAnimationFrame.js",
			"scripts/storage.js",
			"scripts/game.js",
			"scripts/screen.splash.js"
		],
		// Funcja wywoływana po załadowaniu wszystkich plików i zakończeniu głównego programu.
		complete : function() {
			snake.game.setup();
			//console.log("Załadowano wszystkie pliki! ");
			snake.game.showScreen("splash-screen",
			getLoadProgress);
		}
	}]);
	Modernizr.load([{
		load : [
			"loader!scripts/display.canvas.js",
			"loader!scripts/board.js",
			"loader!scripts/input.js",
			"loader!scripts/screen.hiscore.js",
			"loader!scripts/screen.settings.js",
			"loader!scripts/screen.main-menu.js",
			"loader!scripts/screen.game.js",
			"loader!images/images" + snake.settings.snakeSize + ".png",
			"loader!images/tlo" + snake.settings.snakeSize + ".png"
		]
	}]);
}, false);