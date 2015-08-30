(function() {

	/* BUILD ITEMS ----------------*/
	for (var i=1; i < 19; i++) {
		api.settings.definitions.keyboard.settings["immediately_build_item_" + i] = {
			title: 'immediately build item ' + i,
			type: 'keybind',
			set: 'build',
			display_group: '!LOC:build',
			display_sub_group: '!LOC:build items',
			default: 'ctrl+' + api.settings.definitions.keyboard.settings["build_item_" + i].default,
			allow_conflicts: true
		};
	};


	api.settings.definitions.keyboard.settings["start_build_ammo"] = {
		title: '!LOC:select ammo group',
		type: 'keybind',
		set: 'build',
		display_group: '!LOC:build',
		display_sub_group: '!LOC:build bar groups',
		default: api.settings.definitions.keyboard.settings["start_build_vehicle"].default,
		allow_conflicts: true
	};


	api.settings.definitions.keyboard.settings["clear_build_queue"] = {
		title: 'clear build queue',
		type: 'keybind',
		set: 'build',
		display_group: '!LOC:build',
		display_sub_group: '!LOC:build orders',
		default: '',
		allow_conflicts: true
	};


	/* FILTER SELECTION -----------*/
	["bot", "tank", "air", "naval", "orbital", "advanced", "fabber"].forEach(function(type) {
		api.settings.definitions.keyboard.settings["selection_filter_" + type] = {
			title: 'selection filter ' + type,
			type: 'keybind',
			set: 'units',
			display_group: '!LOC:units',
			display_sub_group: '!LOC:unit selection',
			default: '',
			allow_conflicts: true
		};
		api.settings.definitions.keyboard.settings["selection_remove_" + type] = {
			title: 'selection remove ' + type,
			type: 'keybind',
			set: 'units',
			display_group: '!LOC:units',
			display_sub_group: '!LOC:unit selection',
			default: '',
			allow_conflicts: true
		};
	});


	/* MISC -----------------------*/
	api.settings.definitions.keyboard.settings["toggle_chronocam"] = {
		title: 'toggle chronocam',
		type: 'keybind',
		set: "general",
		display_group: "!LOC:general",
		display_sub_group: "!LOC:chronocam",
		default: 'tab',
		allow_conflicts: true
	};
})()
