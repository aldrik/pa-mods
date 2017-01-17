setTimeout(function () {
	model.transitDelay(model.transitDelay() + 200);
	if (model.transitDestination() === "coui://ui/main/game/start/start.html") {
		engine.call('game.toggleFullscreen', true).then(function() {
			engine.call('game.toggleFullscreen', true);
		});
	}
}, 200);
