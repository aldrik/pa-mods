(function() {
	model.hideSplash();

	var overlay = document.getElementById('splash_overlay');
	overlay.parentNode.removeChild(overlay);

	window.setTimeout(function() { setLayoutMode(true) }, 0);
})();
