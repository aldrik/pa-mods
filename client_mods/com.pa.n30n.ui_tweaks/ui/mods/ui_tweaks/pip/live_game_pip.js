(function() {
	model.splitMode = ko.computed(function() {
		return !!model.state().split;
	});

	model.toggleSplitScreen = function() {
		/* Call function in live_game. */
		api.Panel.message(api.Panel.parentId, 'panel.invoke', ["toggleSplitScreen"]);
	};

	// Add the split screen button.
	$(".btn_pip_copy").after('<div class="btn_pip btn_split_screen" data-placement="left" data-tooltipkey="split_screen" data-bind="click: toggleSplitScreen, css: { enabled: splitMode }, tooltip: \'!LOC:Split screen\'" />');

	// Also place tooltips for the other button on the left.
	$(".btn_pip").attr("data-placement", "left")


	// Fix for PiP POV enable indicator.
	model.povMode = ko.computed(function() {
		return !!model.state().pov;
	});

	var pov_button = $(".btn_pip_pov");
	var pov_data_bind = pov_button.attr("data-bind");
	pov_data_bind = pov_data_bind.replace("mirrorMode", "povMode");
	pov_button.attr("data-bind", pov_data_bind);
})();
