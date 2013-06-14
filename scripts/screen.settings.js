snake.screens["settings"] = (function() {
	var dom = snake.dom,
		$ = dom.$,
		board = snake.board,
		game = snake.game,
		firstRun = true,
		animValue;
	function setup() {
		initialize(function() {
			// Nothing
		});
	}
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
	}
	function getAnim() {
		return animValue.checked;
	}
	function initialize(callback) {
		var backButton = $("#settings footer button[name=back]")[0];
		dom.bind(backButton, "click", function(e) {
			game.showScreen("main-menu");
		});
		var list = $("#settings ul.settings-list")[0],
			anim = document.createElement("li"),
			animName = document.createElement("span");
		animName.innerHTML = "Animacje";
		animValue = document.createElement("input");
		animValue.type = "checkbox";
		anim.appendChild(animName);
		anim.appendChild(animValue);
		list.appendChild(anim);
		
		callback();
	}
	return {
		run : run,
		getAnim : getAnim,
		initialize : initialize,
		firstRun : firstRun
	};
})();