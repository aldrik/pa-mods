(function() {
	var html = $('html');

	model.pipSplitMode = ko.observable(false);
	model.pipState.dispose();
	model.pipState = ko.pureComputed(function () {
		return {
			alert: model.pipAlertMode(),
			mirror: model.pipMirrorMode(),
			split: model.pipSplitMode()
		};
	});

	model.pipState.subscribe(function() {
		var state = model.pipState();
		api.panels.pip_br_tl && api.panels.pip_br_tl.message('state', state);
		api.panels.pip_br_tr && api.panels.pip_br_tr.message('state', state);
	});

	model.toggleSplitScreen = function() {
		html.toggleClass("split_screen");

		if (html.hasClass("split_screen")) {
			model.pipSplitMode(true);
		}
		else {
			model.pipSplitMode(false);
		}
		if (!model.showPips()) {
			model.togglePips();
		}
	};

	var pipToggled = function(open) {
		if (open) {
			html.addClass("pip_open");
		}
		else {
			html.removeClass("pip_open");
		}
	};
	model.showPips.subscribe(pipToggled);
})();
