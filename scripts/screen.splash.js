snake.screens["splash-screen"] = (function() {
	var game = snake.game,
		dom = snake.dom,
		$ = dom.$,
		firstRun = true;
	function setup(getLoadProgress) {
		var scr = $("#splash-screen")[0];
		function checkProgress() {
			var p = getLoadProgress() * 100;
			$(".indicator", scr)[0].style.width = p + "%";
			if (p == 100) {
				$(".continue", scr)[0].style.display = "block";
				//$(".progress", scr)[0].style.display = "none";
				dom.bind(scr, "click", function() {
					snake.game.showScreen("main-menu");
				});
				// Ustawia nazwę.
				var activeName = snake.storage.get("name");
				if (activeName) {
					snake.settings.name = activeName;
				}
			} else {
				setTimeout(checkProgress, 30);
			}
		}
		checkProgress();
	}
	function run(getLoadProgress) {
		if (firstRun) {
			setup(getLoadProgress);
			firstRun = false;
		}
	}
	return {
		run : run
	};
})();