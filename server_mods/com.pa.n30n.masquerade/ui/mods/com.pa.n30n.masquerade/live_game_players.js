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

	model.sortedPlayersArray = ko.computed(function () {
		var p = [];
		var r = [];
		var i = -1;
		var t;
		if (model.players) {
			//sort each army by its alliance group
			_.forEach(model.players(), function (player) {
				if (!_.isArray(p[player.alliance_group]))
					p[player.alliance_group] = [];
				p[player.alliance_group].push(player);
			});

			// Randomise player order within alliances.
			p.forEach(function(alliances) {
				shuffle(alliances)
			});

			//break alliance group 0 into individuals (shared armies)
			_.forEach(p[0], function (player) { r.push([player]) });
			p.shift()
			// Randomise alliance group order.
			shuffle(p)
			r = r.concat(p);
		}
		//find player group and move to front of array
		if (model.player()) {
			_.forEach(r, function (group, index) {
				if (group.indexOf(model.player()) > -1)
					i = index;
			});
			t = r.splice(i, 1);
			r.unshift(t[0]);
		}
		return r;
	});

	var playerToolTip = model.playerToolTip;
	model.playerToolTip = function (army) {
		responce = playerToolTip.apply(model, arguments);
		if (!army.defeated) {
			responce[1] = '<span class="div_player_name_tooltip truncate">Anonymous</span>';
		}
		return responce;
	};

	// TODO fix expanded FFA player list order.
		// Replace: <!-- ko foreach: players -->
		// With:    <!-- ko foreach: sortedPlayersArray -->
})();
