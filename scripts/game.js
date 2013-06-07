snake.game = (function() {
	var dom = snake.dom,
		$ = dom.$;
	
	// Chowa aktywny ekran i wyświetla ekran o podanym atrybucie id.
	function showScreen(screenId) {
		var activeScreen = $("#game .screen.active")[0],
			screen = $("#" + screenId)[0];
		if (activeScreen) {
			dom.removeClass(activeScreen, "active");
		}
		// Uruchamia moduł ekranu.
		snake.screens[screenId].run();
		// Wyświetla ekran.
		dom.addClass(screen, "active");
	}
	// Odsłania metody.
	return {
		showScreen : showScreen
	};
})();