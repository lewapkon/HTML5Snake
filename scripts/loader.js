var snake = {
	screens : {},
	settings : {
		rows : 11,
		cols : 11,
		baseScore : 100
	}
};

// Oczekiwanie na załadowanie głównego dokumentu.
window.addEventListener("load", function(){

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
			"scripts/board.js"
		],
		// Funcja wywoływana po załadowaniu wszystkich plików i zakończeniu głównego programu.
		complete : function() {
			console.log("Załadowano wszystkie pliki! ");
			snake.game.showScreen("splash-screen");
		}
	}
]);

}, false);