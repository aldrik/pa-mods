(function(){
	//...
	$(".chat_message_player_name").replaceWith('<!-- ko if: model.spectatorChat -->'
		+ '<span class="chat_message_player_name" data-bind="visible: player_name, text: player_name, css: { team_chat_message_player_name: isTeam }"></span>'
		+ '<!-- /ko -->'
		+ '<!-- ko ifnot: model.spectatorChat -->'
		+ '<span class="chat_message_player_name" data-bind="visible: player_name, css: { team_chat_message_player_name: isTeam }">Anonymous</span>'
		+ '<!-- /ko -->');
})();
