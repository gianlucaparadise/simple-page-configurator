$(function () {

	var templateSelector = $("#templateSelector");

	var sortable = $("#sortable").sortable({
		revert: true,
		cancel: '[contenteditable=\"true\"],.plus,.imagelist,.delete'
	});
	var draggable = $(".draggable").draggable({
		connectToSortable: "#sortable",
		helper: "clone",
		revert: "invalid",
		scroll: true,

		start: (event, ui) => {
			// this is needed because when dragging the item changes width for no reasons
			$(ui.helper).css("width", `${$(event.target).width()}px`);
		},

		stop: (event, ui) => {
			$(ui.helper).removeClass("draggable ui-draggable ui-draggable-handle");

			// Stop event is called before animation, so I'm waiting for the animation to finish
			setTimeout(() => $(ui.helper).css("width", ""), 1000);

			// saving moduleId
			var moduleId = draggable.data("moduleId");
			PageConfigurator.prepareForSortable(moduleId, ui.helper);
		}
	});

	populateTemplatesDropdown(templateSelector, draggable);
});

function populateTemplatesDropdown(templateSelector, draggable) {
	// get templates and populate dropdown

	var templates = PageLoader.getTemplates();
	templates.forEach(function (element) {
		var option = $("<option />")
			.val(element.moduleId)
			.text(element.moduleTitle)
			.data("templatePath", element.templatePath);

		templateSelector.append(option);
	}, this);

	// on option selected populate template preview
	templateSelector.change(e => {
		var selected = $("option:selected", e.target);

		var moduleId = selected.val();
		draggable.data("moduleId", moduleId);

		var templatePath = selected.data("templatePath");
		var div = $("<div />").load(templatePath, () => {
			var template = $(div).children().first();

			var imagecarousel = $(".imagecarousel", template);
			if (imagecarousel) PageLoader.setCarouselIndex(imagecarousel, 0);

			var poilist = $(".poilist", template);
			if (poilist) PageLoader.loadPoiList(poilist);

			draggable.empty();
			draggable.append(template);
		});
	});
}

function isEnter(e) {
	return (e.which && e.which == 13) || (e.keyCode && e.keyCode == 13);
}