// TODO: Also in-game hide starting bounties?
(function () {
	var legion = (typeof(legionExpansionLoaded) == "boolean");
	var legion_commanders = legion ? legionglobal.commanders : [];

	var preferredColours = [
		"rgb(151,251,152)", // Pale Green || Mint Green
		"rgb(219,217,37)", // Bitter Lemon || Pear
		"rgb(255,144,47)", // Neon Carrot
		"rgb(210,50,44)", // Persian Red
		"rgb(206,51,122)", // Medium Red Violet (flubb pink)
		"rgb(128,0,128)", // Purple || Fresh Eggplant
		"rgb(100,149,237)", // Cornflower Blue
		"rgb(200,200,200)", // Very Light Grey || Silver
		"rgb(70,70,70)", // Charcoal || Tundora
		"rgb(128,0,0)", // Maroon
	];

	var setPreferredColor = function(slot) {
		var colors = model.colors();
		if (!colors.length) {
			return;
		}

		var current = colors[slot.colorIndex()].color;
		if (preferredColours.indexOf(current) > -1) {
			return;
		}

		var avalible = [];
		for(var i = 0; i < colors.length; i++) {
			var color = colors[i];
			if (!color.taken && preferredColours.indexOf(color.color) > -1) {
				avalible.push(i);
			}
		}
		if (avalible.length) {
			var newColor = avalible[_.random(avalible.length - 1)];
			slot.colorIndex(newColor);
		}
	};

	var getThisPlayerSlot = function() {
		var armies = model.armies();
		for(var i = 0; i < armies.length; i++) {
			var army = armies[i];
			if (!army.armyContainsThisPlayer()) {
				continue;
			}
			var slots = army.slots();
			for(var j = 0; j < slots.length; j++) {
				var slot = slots[j];
				if (slot.containsThisPlayer()) {
					return slot;
				}
			}
		}
	};

	$(document).ready(function () {
		var players = handlers.players;
		handlers.players = function (payload, force) {
			players.apply(handlers, arguments);
			var slot = getThisPlayerSlot();
			if (!slot) {
				return;
			}
			setPreferredColor(slot);
		};
	});

	// Replace commander selector and color with faction selector:
	$(".army-button.btn_add_ai[data-bind*=Legion]").remove();
	$('.slot-player-commander, .color-picker-combo').remove();
	$('.slot-player').prepend('<!-- ko if: slot.containsThisPlayer -->'
		+ '<div class="slot-player-commander bootstrap-select spectator span">'
		+ '<select class="form-control faction" id="faction_picker" data-bind="options: model.factionOptions, selectPicker: model.factionSelect"></select>'
		+ '</div><!-- /ko -->');

	var factionChange = function (faction, slot) {
		var commanders = model.commanders();
		var mla_commanders = commanders.filter(function(element) {
			for (var i in legion_commanders) {
				if (legion_commanders[i] === element) {
					return false;
				}
			}
			return true;
		});

		if (!faction && legion) {
			// Randomly pick a faction.
			var factionOptions = model.factionOptions();
			var faction = factionOptions[_.random(factionOptions.length - 1)];
		}

		switch (faction) {
			case "Legion":
				var commander = legion_commanders[_.random(legion_commanders.length - 1)];
				break;
			case "MLA":
				var commander = mla_commanders[_.random(mla_commanders.length - 1)];
		}

		if (commander === "/pa/units/commanders/raptor_xov/raptor_xov.json") {
			// Try again due to this commander still being broken for Linux clients.
			return factionChange.apply(this, arguments);
		}

		if (slot && slot.ai()) {
			model.send_message('set_ai_commander', {id: slot.playerId(), ai_commander: commander});
		} else {
			model.preferredCommander(commander);
			model.selectedCommanderIndex(commanders.indexOf(commander));
			model.send_message('update_commander', { commander: commander });
		}
	}
	model.factionOptions = ko.computed(function () {
		var factions = ["MLA"];
		if (legion) {
			factions.push("Legion");
		}
		return factions;
	});
	model.factionSelect = ko.observable("MLA");
	model.factionSelect.subscribe(factionChange);

	model.usePreferredCommander = function() {
		factionChange(model.factionSelect());
	};

	// Random faction for AI players.
	var addAI = model.addAI;
	model.addAI = function() {
		addAI.apply(model, arguments);

		var army_index = model.targetAIArmyIndex();
		var slot_index = model.targetAISlotIndex();
		var slot = model.armies()[army_index].slots()[slot_index];
		setTimeout(function () {
			factionChange(null, slot);
			setPreferredColor(slot);
		}, 100);
	}

	// Remove Legion message due to it not being applicable to this mod.
	var localChatMessage = model.localChatMessage;
	model.localChatMessage = function(name, message) {
		if (name === "Legion Expansion") {
			return;
		}
		return localChatMessage.apply(model, arguments);
	}

	// Remove Legion slot styling.
	$("link[href='coui://ui/mods/com.pa.legion-expansion/css/legion_commander_picker.css']").remove()

	// Force disable the "Favourite Colour" mod.
	Object.defineProperty(model, 'dFavouriteColour_enabled', {
		value: false,
		writable: false
	});
})();
