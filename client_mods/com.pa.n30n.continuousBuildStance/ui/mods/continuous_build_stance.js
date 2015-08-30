(function buildStanceContinuous() {
	var original = handlers.selection;
	var factory = /(unit_cannon|orbital_launcher|factory)(_adv)?.json$/;
	handlers.selection = function selectionWrapper(payload) {
		/* Upon selecting an idle factory set build stance to continuous. */
		for (var spec in payload.spec_ids) {
			if (factory.test(spec)) {
				for (var i in payload.build) {
					if (payload.build[i] === "normal" && !Object.keys(payload.build_orders).length) {
						model.selectionBuildStanceContinuous();
						break;
					}
				}
				break;
			}
		}
		return original.apply(this, arguments);
	};

	var playSoundAtLocation = api.audio.playSoundAtLocation;
	api.audio.playSoundAtLocation = function(cue, x, y, z) {
		/* Stop voice from saying "construction build enabled". */
		if (cue !== "/VO/Computer/construction_continuous_on") {
			playSoundAtLocation(cue, x, y, z);
		}
	};
})();
