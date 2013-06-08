var snake = {
	screens : {},
	settings : {
		rows : 11,
		cols : 11,
		baseScore : 100,
		snakeSize : 16
	},
	images : {}
};

// Oczekiwanie na załadowanie głównego dokumentu.
window.addEventListener("load", function(){
	
	// Określa rozmiar klejnotu.
	//var snakeProto = document.getElementById("snake-proto"),
	//	rect = snakeProto.getBoundingClientRect();
	//snake.settings.snakeSize = rect.width;
	
	
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
	Modernizr.load([
	                {
	                	// Następujące skrypty są ładowane domyślnie.
	                	load : [
	                	        "scripts/sizzle.js",
	                	        "scripts/dom.js",
	                	        "scripts/game.js",
	                	        "scripts/screen.splash.js",
	                	        "scripts/screen.main-menu.js",
	                	        "scripts/board.js",
	                	        "loader!snake" + snake.settings.snakeSize + ".png"
	                	        ],
	                	        // Funcja wywoływana po załadowaniu wszystkich plików i zakończeniu głównego programu.
	                	        complete : function() {
	                	        	snake.game.setup();
	                	        	console.log("Załadowano wszystkie pliki! ");
	                	        	snake.game.showScreen("splash-screen",
	                	        			getLoadProgress);
	                	        }
	                }
	                ]);

}, false);