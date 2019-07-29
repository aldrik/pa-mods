
/* Add "Requeue" & "Exit" options the ranked menu once the game has concluded. */
model.menuConfigGenerator = ko.observable(function() {
	var list = [];

	var allow_pause = model.singleHumanPlayer() || model.sandbox() || !model.isSpectator();
	var reject_pause = model.ranked() || model.viewReplay();
	if (allow_pause && !reject_pause) {
		var togglePause = model.paused() ? {
			label: '!LOC:Resume Game',
			action: 'menuResumeGame'
		} : {
			label: '!LOC:Pause Game',
			action: 'menuPauseGame'
		};

		list.push(togglePause);
	}

	list.push({
		label: '!LOC:Game Stats',
		action: 'toggleGamestatsPanel'
	});

	list.push({
		label: '!LOC:Player Guide',
		action: 'menuTogglePlayerGuide'
	});

	list.push({
		label: '!LOC:Chrono Cam',
		action: 'menuToggleChronoCam'
	});

	list.push({
		label: '!LOC:Game Settings',
		action: 'menuSettings'
	});

	if (!model.isSpectator() && model.serverMode() !== 'replay') {
		list.push({
			label: '!LOC:Surrender',
			action: 'menuSurrender',
		});
	}

	if (model.canSave()) {
		list.push({
			label: '!LOC:Save Game',
			action: 'menuSave'
		});
	}

	if (model.ranked() && model.isSpectator()) {
		list.push({
			label: '!LOC:Requeue',
			action: 'navToMatchMaking'
		});
	}

	if (!model.ranked() || model.isSpectator()) {
		list.push({
			label: '!LOC:Quit',
			action: 'menuExit'
		});
	}

	return _.map(list, function(entry) { return { label: loc(entry.label), action: entry.action }; });
});

model.navToMatchMaking = function () {
	handlers['game_over.nav']({
		url: 'coui://ui/main/game/start/start.html?startMatchMaking=true',
		disconnect: true
	});
}
