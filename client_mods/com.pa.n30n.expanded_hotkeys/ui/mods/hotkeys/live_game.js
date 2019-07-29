(function() {
	/* Remove toggle menu from back/deselect. */
	model.modalBack = function () {
		if (model.mode() === 'fab')
			model.endFabMode();
		else if (model.chatSelected()) {
			model.chatSelected(false);
		}
		else if (model.mode() === 'landing') {
			model.toggleMenu();
		}
		else if (model.mode() === 'default') {
			if (model.hasSelection()) {

				if (model.activeBuildGroup())
					model.clearBuildSequence();
				else {
					api.select.empty();
					model.selection(null);
				}
			}
			else if (model.showTimeControls()) {
				model.showTimeControls(false)
			}
			else {
				// model.toggleMenu();
			}
		}
		else if (model.mode().startsWith('command_'))
			model.endCommandMode();
		else
			model.mode('default');
	}

	/* AMMO GROUP & MINES FIX -----*/
	action_sets["build structure"]["start_build_ammo"] = function () {
		maybeInvokeWith('startBuild', 'ammo', true);
	};
	var scene = /[^/]+(?=.html$)/.exec(window.location.href)[0];
	if (scene !== "live_game") {
		globalHandlers["inputmap.reload"]();
		return;
	}

	var buildItem = model.buildItem;
	model.buildItem = function(item) {
		if (item.id === "/pa/units/land/land_mine/land_mine.json") {
			item.structure = true;
		}
		return buildItem.apply(model, arguments);
	};


	/* FIX FOR BUG: FS#4025 -------*/
	var setZoom = api.camera.setZoom;
	api.camera.setZoom = function(zoom, smooth) {
		var value = setZoom.apply(this, arguments);
		if (zoom === "celestial") api.camera.zoom(-1);
		return value;
	};

	var celestial_hover = handlers.celestial_hover;
	handlers.celestial_hover = function(payload) {
		api.camera.zoom(-1);

		handlers.celestial_hover = celestial_hover;
		return celestial_hover.apply(handlers, arguments);
	};


	/* Fix PiP support for sellecting matching units on screen. */
	model.selectedAllMatchingCurrentSelectionOnScreen = function () {
		api.Holodeck.focused.selectMatchingTypes('add', model.selectionTypes());
	}


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


	/* FILTER SELECTION -----------*/
	["bot", "tank", "air", "naval", "orbital", "advanced", "fabber", "AirDefense"].forEach(function(type) {
		action_sets.gameplay["selection_filter_" + type] = function() {
			api.select.fromSelectionWithTypeFilter(type, null, false);
		};
		action_sets.gameplay["selection_remove_" + type] = function() {
			api.select.fromSelectionWithTypeFilter(type, null, true);
		};
	});


	/* MISC -----------------------*/
	action_sets.general["toggle_chronocam"] = input.doubleTap(model.toggleTimeControls, function(event) {
		/* Jump backwards for each consecutive key press. */
		if (!model.showTimeControls()) {
			model.showTimeControls(true);
		}
		if (event && event.shiftKey) {
			api.time.skip(-10.0);
		}
		else {
			api.time.skip(-3.0);
		}
	});

	action_sets.gameplay["clear_build_queue"] = input.doubleTap(function() {
		/* Clear factory build queue(s), while allowing already started units to complete. */
		var factory = /(l_orbital_dropper|unit_cannon|orbital_launcher|factory)(_adv)?.json$/;
		var selection = model.selection();
		if (!selection) {
			return;
		}
		else if (factory.test(Object.keys(selection.spec_ids)[0])) {
			var build_orders = selection.build_orders;
			for (var spec in build_orders) {
				api.unit.cancelBuild(spec, build_orders[spec], true);
			}
			api.audio.playSound('/SE/UI/UI_factory_remove_from_queue');
		}
		else {
			model.setCommandIndex(-1);
		}
		model.activatedBuildId("");
	},
	function() {
		// Stop command on double press.
		model.setCommandIndex(-1);
	});

	model.maybeDeleteUnits = function definitelyDeleteUnits() {
		/* Immediately delete without a prompt. */
		api.unit.selfDestruct();
	};

	action_sets.general["toggle_poll_lock"] = (function() {
		var poll_lock = (api.settings.data.camera.pole_lock || "OFF").toLowerCase();
		return function() {
			poll_lock = (poll_lock === "on") ? "off" : "on";
			engine.call("set_camera_pole_lock", poll_lock)
		}
	})();

	action_sets.gameplay["select_idle_factories_on_screen_or_all_factories"]=input.doubleTap(
		api.select.allIdleFactoriesOnScreen,
		api.select.allFactories);


	/* DOUBLE TAP SELECTION FIX ---*/
	var dt_selects = {
		"select_commander": api.select.commander,
		"select_all_idle_fabbers": function () { return api.select.idleFabbers(api.camera.getFocus(api.Holodeck.focused.id).planet()); },
		"recall_group_1": function() { return api.select.recallGroup(1) },
		"recall_group_2": function() { return api.select.recallGroup(2) },
		"recall_group_3": function() { return api.select.recallGroup(3) },
		"recall_group_4": function() { return api.select.recallGroup(4) },
		"recall_group_5": function() { return api.select.recallGroup(5) },
		"recall_group_6": function() { return api.select.recallGroup(6) },
		"recall_group_7": function() { return api.select.recallGroup(7) },
		"recall_group_8": function() { return api.select.recallGroup(8) },
		"recall_group_9": function() { return api.select.recallGroup(9) },
		"recall_group_0": function() { return api.select.recallGroup(0) },
	};

	for (var k in dt_selects) {
		(function(k) {
			var makeSelection = dt_selects[k];
			action_sets.gameplay[k] = input.doubleTap(makeSelection,
				function () {
					makeSelection().then(function() {
						api.camera.track(true);
					});
				}
			);
		})(k);
	}

	// Due to the changing nature of screen based selections, they can't be
	// made to work with double tap.
	action_sets.gameplay["select_idle_fabbers"]=api.select.idleFabber;


	/* Expose build bar timeout to be configurable ---*/
	model.buildSequenceTimeout = ko.computed(function () {
		if (model.selectedMobile()) {
			return 0;
		}
		return api.settings.getSynchronous('ui', 'build_sequence_timeout');
	});


	/* MODELESS COMMANDS ----------*/
	var scaleMouseEvent = function (mdevent) {
		if (mdevent.uiScaled)
			return;

		mdevent.uiScaled = true;

		var scale = api.settings.getSynchronous('ui', 'ui_scale') || 1.0;

		mdevent.offsetX = Math.floor(mdevent.offsetX * scale);
		mdevent.offsetY = Math.floor(mdevent.offsetY * scale);
		mdevent.clientX = Math.floor(mdevent.clientX * scale);
		mdevent.clientY = Math.floor(mdevent.clientY * scale);
	};

	String.prototype.capitalize = function() {
		    return this.charAt(0).toUpperCase() + this.slice(1);
	}

	var mmevent, started;
	$("holodeck").on("mousemove", function(event) {
		mmevent = event;
		if (started && !started.area && new Date().getTime() >= started.areaTime) {
			started.holodeck.unitBeginCommand(started.command, started.offsetX, started.offsetY).then(function (ok) { started.area = ok; });
			// started.holodeck.unitBeginCommand(
				// (started.command === "repair_and_assist") ? "repair" : started.command,
				// started.offsetX,
				// started.offsetY
			// ).then(function (ok) { started.area = ok; });
		}
	});

	// model.commands().forEach(function(command) {
	var commands = model.commands().slice(0);
	commands.push("repair_and_assist");
	commands.forEach(function(command) {
		switch (command) {
			case "special_move":
			case "special_attack":
			case "mass_teleport":
				return;
			case "move":
			case "unload":
				if (model.allowCustomFormations()) {
					// TODO: Add support for custom formations if/when they return.
					var area_support = true;
					break
				}
			case "assist":
			case "use":
			case "link_teleporters":
			case "fire_secondary_weapon":
			case "ping":
				var area_support = false;
				break;
			default:
				var area_support = true;
		}

		action_sets.gameplay["command_modeless_" + command] = function(event) {
			if (command !== "ping" && command !== "repair_and_assist" && !model.allowedCommands[model.toPascalCase(command)]) {
				return;
			}
			var queue = (event && event.shiftKey);
			var holodeck = api.Holodeck.get(mmevent.target);
			var now = new Date().getTime();
			scaleMouseEvent(mmevent);
			started = {
				"holodeck": holodeck,
				"command": (command === "repair_and_assist") ? "repair" : command,
				"time": now,
				"areaTime": now + 150,
				"offsetX": mmevent.offsetX,
				"offsetY": mmevent.offsetY
			};
			var modeless = function(command) {
				if (!command) {
					holodeck.unitGo(started.offsetX, started.offsetY, queue).then(function (action) {
						holodeck.showCommandConfirmation(action, started.offsetX, started.offsetY);
						if (action && action !== "move") {
							api.audio.playSound("/SE/UI/UI_Command_" + action.capitalize());
						}
						started = false;
					});
				}
				else {
					holodeck.unitCommand(command, started.offsetX, started.offsetY, queue).then(function (success) {
						holodeck.showCommandConfirmation(success ? command : "", started.offsetX, started.offsetY);
						if (success && command !== "move") {
							api.audio.playSound("/SE/UI/UI_Command_" + command.capitalize());
						}
						started = false;
					});
				}
			}

			if (!area_support) {
				modeless(command);
				return;
			}

			// Modal interface required for area commands.
			engine.call("set_command_mode", command); // set cursor icon.
			var capture = function(event) {
				if (event.key === keyboard.shift || event.key === keyboard.control) {
					return;
				}
				$(document).off("keyup", capture);
				scaleMouseEvent(mmevent);
				if (started.area) {
					(function() {
						var command = started.command;
						holodeck.unitEndCommand(command, mmevent.offsetX, mmevent.offsetY, queue).then(function (success) {
							holodeck.showCommandConfirmation(success ? command : "", mmevent.offsetX, mmevent.offsetY);
							if (success) {
								api.audio.playSound("/SE/UI/UI_Command_" + command.capitalize());
							}
							model.endCommandMode();
						});
					})();
				}
				else {
					if (command === "repair_and_assist") {
							if (model.allowedCommands[model.toPascalCase("assist")]) {
								modeless("assist");
								queue = true;
							}
							if (model.allowedCommands[model.toPascalCase("repair")]) {
								modeless("repair");
								queue = true;
							}
							if (model.allowedCommands[model.toPascalCase("assist")]) {
								modeless("assist");
							}
					}
					else {
						modeless(command);
					}

					model.endCommandMode();
				}
				started = false;
			};
			$(document).on("keyup", capture);
		};
	});

	action_sets.gameplay.command_modeless_alt_fire_or_load = function(event) {
		if (model.allowedCommands["FireSecondaryWeapon"]) {
			return action_sets.gameplay.command_modeless_fire_secondary_weapon(event);
		} else {
			return action_sets.gameplay.command_modeless_load(event);
		}
	};
	action_sets.gameplay["command_modeless_alt_fire_or_load_shift"] = action_sets.gameplay["command_modeless_alt_fire_or_load"];

	var inputmap_reload = globalHandlers["inputmap.reload"];
	globalHandlers["inputmap.reload"] = function() {
		/* Add modeless shift hotkeys where no conflict exists. */
		api.settings.loadLocalData();
		for (var key in api.settings.data.keyboard) {
			if (!key.startsWith("command_modeless_")) {
				continue;
			}
			var binding=api.settings.data.keyboard[key];
			var setBind = true;
			if (binding !== "" && binding.indexOf("shift+") === -1) {
				var n = ("shift+" + binding).split("+").sort().join("+");
				for (var k in api.settings.data.keyboard) {
					if (n === api.settings.data.keyboard[k].split("+").sort().join("+")) {
						setBind = false;
						break;
					}
				}
			}
			else {
				setBind = false;
			}
			api.settings.definitions.keyboard.settings[key + "_shift"] = {
				title: '!LOC:modeless ' + key,
				type: 'keybind',
				set: 'units',
				default: setBind ? ("shift+" + binding) : ""
			};
			action_sets.gameplay[key + "_shift"] = action_sets.gameplay[key];
		}

		/* Add build shift hotkeys. */
		var resetBar = function(event) {
			if (event.keyCode !== 16 /* ShiftLeft */) {
				model.resetClearBuildSequence();
				document.removeEventListener("keyup", resetBar, false);
			}
		};

		for (var i = 1; i <= 18; ++i) {
			var key = "build_item_" + i;
			var definition = jQuery.extend({}, api.settings.definitions.keyboard.settings[key]);
			var user_set = api.settings.data.keyboard[key];
			if (user_set) {
				if (user_set.indexOf("shift+") === -1) {
					continue;
				}
				definition.default = "shift+" + user_set;
			}
			else {
				definition.default = "shift+" + definition.default;
			}
			api.settings.definitions.keyboard.settings[key + "_shift"] = definition;
			action_sets.build[key + "_shift"] = function(index) {
				return function () {
					model.currentBuildStructureId('');
					api.panels.build_bar.query('build_item', index).then(function(id) {
						if (!id) {
							return;
						}
						document.addEventListener("keyup", resetBar, false);
						model.executeStartBuild({
							"item": id,
							"batch": true,
							"cancel": false,
							"urgent": false,
							"more": ""
						});
						model.activatedBuildId(id);
					});
				};
			}(i - 1);
		}

		return inputmap_reload.apply(globalHandlers, arguments);
	};

	globalHandlers["inputmap.reload"]();
})();
