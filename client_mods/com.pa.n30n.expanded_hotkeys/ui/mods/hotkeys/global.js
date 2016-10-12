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

	api.settings.definitions.keyboard.settings["select_all_idle_fabbers"] = {
		title: '!LOC:select all idle fabbers',
		type: 'keybind',
		set: 'units',
		display_group: '!LOC:units',
		display_sub_group: '!LOC:unit selection',
		default: ''
	};

	api.settings.definitions.keyboard.settings["select_idle_factories_on_screen_or_all_factories"] = {
		title: '!LOC:select idle factories on screen and all factories on double press',
		type: 'keybind',
		set: 'units',
		display_group: '!LOC:units',
		display_sub_group: '!LOC:unit selection',
		default: ''
	};

	api.settings.definitions.keyboard.settings["toggle_poll_lock"] = {
		title: '!LOC:toggle poll lock',
		type: 'keybind',
		set: 'camera',
		display_group: '!LOC:camera',
		display_sub_group: '!LOC:tracking & alignment',
		default: ''
	};


	/* MODELESS COMMANDS ----------------*/
	["move",
	"attack",
	"assist",
	"repair",
	"reclaim",
	"patrol",
	"unload",
	"load",
	"alt_fire",
	"alt_fire_or_load"
	].forEach(function(command) {
		api.settings.definitions.keyboard.settings["command_modeless_" + command] = {
			title: '!LOC:modeless ' + command.replace(/_/g, " "),
			type: 'keybind',
			set: 'units',
			display_group: '!LOC:units',
			display_sub_group: '!LOC:unit commands',
			default: ''
		};
	});

	api.settings.definitions.keyboard.settings["command_modeless_ping"] = {
		title: '!LOC:modeless ping',
		type: 'keybind',
		set: 'general',
		display_group: '!LOC:general',
		display_sub_group: '!LOC:alerts',
		default: ''
	};
})()
