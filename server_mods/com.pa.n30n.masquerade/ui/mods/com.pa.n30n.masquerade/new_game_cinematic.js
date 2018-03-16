(function() {
	function shuffle(array) {
		/*
			Randomize array element order in-place.
			Using Durstenfeld shuffle algorithm.
		*/
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	var state = handlers.state;
	handlers.state = function wrapper(config) {
		var teams = config.teams || [];
		shuffle(teams);
		teams.forEach(function(team) {
			shuffle(team.players)
			team.players.forEach(function(player) {
				player.name = "";
			})
		});
		return state(config);
	};
})();
