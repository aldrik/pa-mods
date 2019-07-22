$(".option-list.ui .form-group").append(
	'<div class="sub-group">'
		+ '<div class="option" data-bind="template: { name: \'setting-template\', data: $root.settingsItemMap()[\'ui.build_sequence_timeout\'] }">'
		+ '</div>'
	+'</div>'
);
