$(function () {
	var i = getQueryStringValue("i");
	var lang = getQueryStringValue("lang", "en");
	var uniqueId = i + lang;
	PageLoader.loadPage(uniqueId, (moduleId, modWrapper) => {
		$("[contenteditable=\"true\"]", modWrapper).removeAttr("contenteditable");
		PageLoader.loadCustomModules(modWrapper);
	});
});

function getQueryStringValue(key, defaultValue) {
	var result = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	return result ? result : defaultValue
}  