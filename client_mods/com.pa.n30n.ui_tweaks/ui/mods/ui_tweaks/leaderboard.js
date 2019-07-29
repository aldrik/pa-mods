(function() {
	/* Add the option to view players replays list. */
	var viewReplays = function() {
		api.Panel.message("game", "view_contact_replays", {uberId: this.uberId, displayName: this.displayName()});
	};
	var cls = LeaderboardUtility.RankedPlayerModel;
	var RankedPlayerModel = function(leaguePosition, displayName, entry) {
		cls.apply(this, arguments);
		this.viewReplays = viewReplays;
	}
	RankedPlayerModel.prototype = Object.create(cls.prototype);
	LeaderboardUtility.RankedPlayerModel = RankedPlayerModel;
	model.yourself.viewReplays = viewReplays;


	$("#player-template").text(
		'<div class="row_player" data-bind="css: { row_player_yourself: uberId == model.yourself.uberId }">'
			+ '<div class="rank" data-bind="text: leaguePosition">'
				+ '?'
			+ '</div>'
			+ '<div class="rating" data-bind="text: rating">'
				+ '?'
			+ '</div>'
			+ '<div class="username">'
				+ '<div class="commander">'
					+ '<img src="coui://ui/main/shared/img/commanders/profiles/profile_imperial_delta.png" />'
				+ '</div>'
				+ '<div data-bind="text: displayName">'
					+ 'Unknown'
				+ '</div>'
			+ '</div>'
			+ '<div class="games" data-bind="text: games">'
				+ '?'
			+ '</div>'
			+ '<div class="timestamp replay data-bind="visible: $root.allowRanked">'
				+ '<input type="button" data-bind="locValue: timeSinceLastGame, click: viewReplays, enable: canWatchReplay" />'
			+ '</div>'
		+ '</div>'
	);
})();
