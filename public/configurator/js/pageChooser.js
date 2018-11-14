$(function () {

	var pageSelector = $("#pageSelector");
	var sortable = $("#sortable");

	PageLoader.retrievePages(pages => {
		populatePageSelector(pageSelector, pages);
	});

	var savePageButton = $("#savePageButton").click((e) => {
		PageConfigurator.saveCurrentPage(sortable);
	});

	var refreshButton = $("#refreshButton").click((e) => {
		PageLoader.retrievePages(pages => {
			PageConfigurator.rebuildImageLists(sortable);
			populatePageSelector(pageSelector, pages);
		}, true);
	});

	$("#choosePageButton").click(() => {
		var selected = $("option:selected", pageSelector);
		var pageId = selected.val();

		PageLoader.retrievePageById(pageId, page => {
			PageLoader.loadPage(pageId, (moduleId, modWrapper) => {
				PageConfigurator.prepareForSortable(moduleId, modWrapper);
			}, page => {
				savePageButton.removeProp("disabled");
				refreshButton.removeProp("disabled");
			});
		});
	});
});

function populatePageSelector(pageSelector, pages) {
	pageSelector.empty();
	if (!pages) return;
	pages.forEach(function (page) {
		var option = $("<option />")
			.val(page.uniqueId)
			.text(page.name);

		pageSelector.append(option);
	}, this);
}