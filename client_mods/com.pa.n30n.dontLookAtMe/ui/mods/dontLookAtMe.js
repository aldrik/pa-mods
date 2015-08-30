(function() {
	/* Don't focus the camera on commander at spawn. */
	var lookAt = api.camera.lookAt;
	var DontLookAtMe = function() {
		api.camera.lookAt = lookAt;
	};
	var event_message = handlers.event_message;
	handlers.event_message = function(payload) {
		if (payload.type === "commander_spawn") {
			api.camera.lookAt = DontLookAtMe;
		}
		return event_message(payload);
	};
})();
