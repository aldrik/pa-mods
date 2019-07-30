(function() {
	var html = $('html');

	model.pipSplitMode = ko.observable(false);
	model.pipPOVMode = ko.observable(false);
	model.pipState.dispose();
	model.pipState = ko.pureComputed(function () {
		return {
			alert: model.pipAlertMode(),
			mirror: model.pipMirrorMode(),
			pov: model.pipPOVMode(),
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


	// Fix for PiP POV enable indicator.
	var togglePOV = model.togglePOV;
	model.togglePOV = function(forcePrimary) {
		togglePOV.apply(model, arguments);

		if (!forcePrimary) {
			var holodeck = api.Holodeck.focused;
			var is_pov = holodeck.cameraMode() !== "pov";
			model.pipPOVMode(is_pov);
		};
	}


	// State fix for when copying to pip.
	var copyToPip = model.copyToPip;
	model.copyToPip = function () {
		copyToPip();
		model.pipMirrorMode(false);
	};
})();
