(function() {
	// Remove killer from annihilation alerts.
	$(".commander_alert").replaceWith('<div class="commander_alert">'
		+ '<div class="msg" data-bind="vars: { victim_name: defeated.name }">'
			+ '<loc>__victim_name__ has been annihilated.</loc>'
		+ '</div>'
	+ '</div>');
})();
