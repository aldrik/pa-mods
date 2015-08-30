(function() {

	/* Fix for ammo group */
	action_sets["build structure"]["start_build_ammo"] = function () {
		maybeInvokeWith('startBuild', 'ammo', true);
	};

	var scene = /[^/]+(?=.html$)/.exec(window.location.href)[0];
	if (scene === "live_game") {
		/* BUILD ITEMS ----------------*/
		var regular_build = api.unit.build;
		var immediate_build = function(spec, count) {
			api.unit.build = regular_build;
			return engine.call('unit.build', spec, count, true);
		};
		for (var i=1; i < 19; i++) {
			(function(index) {
				action_sets.build["immediately_build_item_" + (index + 1)] = function () {
					api.unit.build = immediate_build;
					model.buildItemFromList(index);
				};
			})(i)
		};


		/* Fix for mines */
		var buildItem = model.buildItem;
		model.buildItem = function(item) {
			if (item.id === "/pa/units/land/land_mine/land_mine.json") {
				item.structure = true;
			}
			return buildItem.apply(model, arguments);
		};


		/* FILTER SELECTION -----------*/
		["bot", "tank", "air", "naval", "orbital", "advanced", "fabber"].forEach(function(type) {
			action_sets.gameplay["selection_filter_" + type] = function() {
				api.select.fromSelectionWithTypeFilter(type, null, false);
			};
			action_sets.gameplay["selection_remove_" + type] = function() {
				api.select.fromSelectionWithTypeFilter(type, null, true);
			};
		});


		/* MISC -----------------------*/
		action_sets.general["toggle_chronocam"] = model.toggleTimeControls;

		action_sets.general["clear_build_queue"] = function() {
			/* Clear build queue, while allowing already started units to complete. */
			var selection = model.selection();
			if (selection) {
				var build_orders = selection.build_orders;
				for (var spec in build_orders) {
					api.unit.cancelBuild(spec, build_orders[spec], true);
				}
				api.audio.playSound('/SE/UI/UI_factory_remove_from_queue');
			}
		}

		model.maybeDeleteUnits = function definitelyDeleteUnits() {
			/* Immediately delete without a prompt. */
			api.unit.selfDestruct();
		};
	}


	globalHandlers["inputmap.reload"]();
})();
