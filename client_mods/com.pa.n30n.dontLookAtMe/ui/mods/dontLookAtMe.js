(function() {
	var event_message = handlers.event_message;
	handlers.event_message = function(payload) {
		if (payload.type === "commander_spawn") {
			if (payload.units.length) {
				api.select.unitsById(payload.units, true);
				engine.call("holodeck.setCommanderId", payload.units[0]);
			}
		}
		else {
			event_message(payload);
		}
	};
})();
