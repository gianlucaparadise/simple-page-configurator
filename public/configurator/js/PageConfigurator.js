var PageConfigurator = {
	saveCurrentPage: function (pageDiv) {
		var modules = buildJson(pageDiv);
		var id = currentPage.id;
		var lang = currentPage.langcode;
		console.log("saving:\nid: " + id + "\tlang: " + lang + "\nmodules: " + JSON.stringify(modules));
		savePage(id, lang, modules);
	},

	rebuildImageLists: function (sortable) {
		if (!sortable) return;

		$(".imageeditable", sortable).each((i, imageeditable) => {
			var imageList = $(".imagelist", imageeditable);
			var plus = $(".plus", imageeditable);
			buildImageList(imageeditable, imageList, plus);
		});
	},

	prepareForSortable: function (moduleId, moduleDiv) {
		$(moduleDiv).data("moduleId", moduleId);

		// I set this css here because, when in static css, sortable doesn't sort
		$(moduleDiv).css("height", "auto");

		$("[contenteditable=\"true\"]", moduleDiv).keydown(e => {
			if (!isEnter(e)) return true;

			// On Enter, I focus to the next contenteditable
			var editables = $("[contenteditable=\"true\"]");
			var currentIndex = editables.index(e.target);
			var next = editables.get(currentIndex + 1);

			if (next) next.focus();
			else $(e.target).blur(); // unfocus

			return false;
		});

		// Delete button configuration
		var deleteButton = $("<div class=\"delete button\" />");
		$(moduleDiv).append(deleteButton);

		$(moduleDiv).hover(e => {
			fadeIn(deleteButton);
		}, e => {
			fadeOut(deleteButton);
		});

		deleteButton.click(() => {
			$(moduleDiv).slideUp('slow', function () { $(moduleDiv).remove(); });
		});

		// Image picker configuration
		var imageeditable = $(".imageeditable", moduleDiv);
		if (imageeditable && currentPage) {
			var plus = $("<div class=\"plus button\" />");

			var imagelist = $("<ul class=\"imagelist\" />");
			imageeditable.append(imagelist);

			buildImageList(imageeditable, imagelist, plus);

			// adding plus button
			imageeditable.append(plus);

			imageeditable.hover(e => {
				fadeIn(plus);
			}, e => {
				if (plus.hasClass('rotated')) return;
				fadeOut(plus);
			});

			plus.click(() => {
				plus.toggleClass('rotated');
				imagelist.fadeToggle(500);
			});
		}

		PageLoader.loadCustomModules(moduleDiv);
	}
};

function buildImageList(imageeditable, imagelist, plus) {
	if (!currentPage || !imagelist) return;
	imagelist = $(imagelist);
	imagelist.empty();

	imageeditable = $(imageeditable);

	var images = currentPage.images;
	if (!images) {
		var liNoImage = $("<li />").html("<a href=\"/node/86/edit#edit-field-images-wrapper\">Upload images</a>");
		imagelist.append(liNoImage);
	}
	else {
		imageeditable.data("background", imageeditable.css("background-image"));

		images.forEach(url => {
			var last = url.split("/").pop();
			var name = last.substring(0, last.lastIndexOf("."));

			var li = $("<li />")
				.text(name)
				.hover(e => {
					imageeditable.css("background-image", "url(\"" + url + "\")");
				})
				.click(() => {
					imageeditable.data("background", imageeditable.css("background-image"));
					plus.click();
				});

			imagelist.append(li);
		}, this);

		imageeditable.hover(null, e => {
			imageeditable.css("background-image", imageeditable.data("background"));
		});
	}
}

function savePage(id, lang, modules) {
	Logger.writeLog("Saving current page...");
	var request = {
		"id": id,
		"lang": lang,
		"modules": modules
	};

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/configurator/page",
		"method": "PUT",
		"headers": {
			"content-type": "application/json",
		},
		"processData": false,
		"data": JSON.stringify(request)
	};

	$.ajax(settings)
		.done(response => {
			console.log(response);
			Logger.writeLog("Current page saved", true);
		})
		.fail(err => {
			console.log(err);
			Logger.writeLog("Error while saving current page");
		});
}

function buildJson(pageDiv) {
	var result = [];
	$(pageDiv).children().each((i, moduleElement) => {
		var mod = {};
		mod.moduleId = $(moduleElement).data("moduleId");

		$("[contenteditable=\"true\"]", moduleElement).map((i, editable) => {
			var key = editable.id;
			if (!key) throw "You forgot to set an ID in a template!";
			//console.log($(editable));
			mod[key] = $(editable).text().trim();
			//console.log(mod[key]);
		});

		$(".imageeditable", moduleElement).map((i, editable) => {
			var key = editable.id;
			if (!key) throw "You forgot to set an ID in a template!";
			//console.log($(editable));
			var urlProperty = $(editable).data("background");
			mod[key] = urlProperty.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
			//console.log(mod[key]);
		});

		$(".imagecarousel", moduleElement).map((i, editable) => {
			var key = editable.id;
			if (!key) throw "You forgot to set an ID in a template!";
			//console.log($(editable));
			mod[key] = currentPage.imageCarousel;
			//console.log(mod[key]);
		});

		$(".poilist", moduleElement).map((i, editable) => {
			var key = editable.id;
			if (!key) throw "You forgot to set an ID in a template!";
			//console.log($(editable));
			mod[key] = currentPage.pois;
			//console.log(mod[key]);
		});

		result.push(mod);
	});

	return result;
}

function fadeIn(button) {
	if (button.is(':animated')) button.stop();
	button.fadeIn(300);
}

function fadeOut(button) {
	if (button.is(':animated')) button.stop();
	button.fadeOut(300);
}

function buildHtml(pageDiv) {
	// It is not safe to convert html to string because of code injection

	const contenteditableRegex = /contenteditable\s*=\s*"true"/g;

	var body = $(pageDiv).get(0).outerHTML;
	body = body.replace(contenteditableRegex, "");
	var html = "<html><head></head><body>" + body + "</body></html>";
	return html;
}