$(function () {
	var div = $("#logContainer");
	Logger.setLogDiv(div);
});


var logDiv;
var timer;
var Logger = {
	writeLog: function (text, shouldClear) {
		if (timer) clearTimeout(timer);

		$(logDiv).text(text);
		if (shouldClear) {
			timer = setTimeout(function () {
				$(logDiv).empty();
				$(logDiv).html("<br />");
			}, 3000);
		}
	},

	setLogDiv: function (div) {
		logDiv = div;
	}
};