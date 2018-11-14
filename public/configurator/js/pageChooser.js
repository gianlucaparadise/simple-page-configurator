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

	var viewButton = $("#viewButton").click((e) => {
		var selected = $("option:selected", pageSelector);
		var pageId = selected.data("pageId");
		window.open("/view/index.html?i=" + pageId, '_blank');
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
				viewButton.removeProp("disabled");
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
			.text(page.name)
			.data("pageId", page.id);

		pageSelector.append(option);
	}, this);
}