handlers.acknowledge_alert = function() {
	/* Dismiss alerts only (as pre Titans) */
	var alert = model.alerts()[0];
	if (alert)
		model.acknowledge(alert.id);
};
