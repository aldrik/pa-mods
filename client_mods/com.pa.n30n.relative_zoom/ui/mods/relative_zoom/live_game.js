(function() {
	resetZoom = function() {
		var zoom_speed = api.settings.data.camera.zoom_speed || 40;
		engine.call("set_camera_zoom_speed", zoom_speed / 10);
		// console.log("zoom reset");
	}

	setRelativeZoom = function(celestial_view) {
		if (model.showPipControls() || celestial_view.isSelected()) {
			if (celestial_view.isSun()) {
				resetZoom();
			} else {
				var scale_factor = 475;
				var radius = celestial_view.radius();
				var zoom_speed = api.settings.data.camera.zoom_speed || 40;
				engine.call("set_camera_zoom_speed", (radius / scale_factor * zoom_speed) / 10);
				// console.log("set_camera_zoom_speed", (radius / scale_factor * zoom_speed) / 10);
			}
		}
	}

	var focus_planet_changed = handlers.focus_planet_changed;
	handlers.focus_planet_changed = function(payload) {
		focus_planet_changed.apply(handlers, arguments);

		var focus_planet = payload.focus_planet;
		var celestial_view = model.celestialViewModels()[focus_planet];
		setRelativeZoom(celestial_view);
	};

	model.showPipControls.subscribe(function(pip) {
		if (pip) {
			model.pips[0].focusedPlanet().then(function(focus_planet) {
				if (focus_planet === null) {
					resetZoom();
				} else {
					var celestial_view = model.celestialViewModels()[focus_planet];
					setRelativeZoom(celestial_view);
				}
			});
		} else {
			var celestial_view_models = model.celestialViewModels();
			for (var i in celestial_view_models) {
				var celestial_view = celestial_view_models[i];
				if (celestial_view.isSelected()) {
					return setRelativeZoom(celestial_view);
				}
			}
			resetZoom();
		}
	})
})();
