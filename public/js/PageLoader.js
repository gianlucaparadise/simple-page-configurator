var Logger;
const config = {
	"modules": [
		{
			"moduleId": "main_title",
			"moduleTitle": "Title, subtitle, Image",
			"templatePath": "../templates/titlesubtitleimage.template.html"
		},
		{
			"moduleId": "simple_quote",
			"moduleTitle": "Simple Quote",
			"templatePath": "../templates/simplequote.template.html"
		},
		{
			"moduleId": "image_description",
			"moduleTitle": "Image and Description",
			"templatePath": "../templates/imagedescription.template.html"
		},
		{
			"moduleId": "description_image",
			"moduleTitle": "Description and Image",
			"templatePath": "../templates/descriptionimage.template.html"
		},
		{
			"moduleId": "quote_image",
			"moduleTitle": "Quote and Image",
			"templatePath": "../templates/quoteimage.template.html"
		},
		{
			"moduleId": "image_quote",
			"moduleTitle": "Image and Quote",
			"templatePath": "../templates/imagequote.template.html"
		},
		{
			"moduleId": "simple_text",
			"moduleTitle": "Simple Text",
			"templatePath": "../templates/simpletext.template.html"
		},
		{
			"moduleId": "image_carousel",
			"moduleTitle": "Image Carousel",
			"templatePath": "../templates/imagecarousel.template.html"
		},
		{
			"moduleId": "poi_list",
			"moduleTitle": "POI List",
			"templatePath": "../templates/poilist.template.html"
		},
		{
			"moduleId": "line",
			"moduleTitle": "Line",
			"templatePath": "../templates/line.template.html"
		}
	]
};

var modulesIndexed = {}; // This var is used to store the modules indexed by moduleId
config.modules.forEach(element => modulesIndexed[element.moduleId] = element, this);

var currentPage;

var PageLoader = {
	getTemplates: function () {
		return config.modules;
	},

	getTemplatePath: function (moduleId) {
		return modulesIndexed[moduleId].templatePath;
	},

	loadPage: function (pageId, onModuleLoaded, onPageLoaded) {
		var body = $("#body");
		var pageTitle = $("#pageTitle");
		var sortable = $("#sortable");

		retrievePageById(pageId, page => {
			if (!page) return;
			pageTitle.text(page.name);
			populatePage(page.modules, sortable, onModuleLoaded);

			body.fadeIn(500);

			if (onPageLoaded) onPageLoaded(page);
		});
	},

	loadCustomModules: function (modWrapper) {
		loadCustomModules(modWrapper);
	},

	retrievePages: function (next, bypassCache) {
		retrievePages(next, bypassCache);
	},

	retrievePageById: function (id, next) {
		retrievePageById(id, next);
	},

	setCarouselIndex: function (imagecarousel, index) {
		setCarouselIndex(imagecarousel, index);
	},

	loadPoiList: function (poilist) {
		loadPoiList(poilist);
	},
};

var lastPages; // cached pages
var lastPagesIndexed; // cached pages by id

function retrievePages(next, bypassCache) {
	if (!bypassCache && lastPages) {
		if (next) next(lastPages);
		return;
	}

	if (Logger) Logger.writeLog("Retrieving pages...");
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/page",
		"method": "GET"
	}

	$.ajax(settings)
		.done(function (response) {
			lastPages = response.data;
			lastPagesIndexed = {};
			lastPages.forEach(page => {
				page.uniqueId = page.id + page.langcode;
				lastPagesIndexed[page.uniqueId] = page;
			}, this);
			if (currentPage) currentPage = lastPagesIndexed[currentPage.uniqueId];

			if (next) next(lastPages);
			if (Logger) Logger.writeLog("Pages retrieved", true);
		})
		.fail(err => {
			console.log(err);
			if (Logger) Logger.writeLog("Error while retrieving pages");
		});
}

function retrievePageById(id, next) {
	retrievePages(pages => {
		currentPage = lastPagesIndexed[id];
		next(currentPage);
	});
}

function populatePage(pageJson, sortable, onModuleLoaded) {
	sortable.empty();
	pageJson.forEach(function (mod) {
		var moduleId = mod.moduleId;
		var templatePath = PageLoader.getTemplatePath(moduleId);

		var modWrapper = $("<div />");
		modWrapper.load(templatePath, (elem) => {
			// this populates texts
			Object.keys(mod).forEach(key => {
				var editable = $("#" + key, modWrapper);
				if (!editable.get(0)) return;

				if (editable.hasClass("imageeditable")) {
					editable.css("background-image", "url(\"" + mod[key] + "\")");
				}
				else if (!editable.hasClass("imagecarousel") && !editable.hasClass("poilist")) {
					editable.text(mod[key]);
				}
			}, this);

			if (onModuleLoaded) onModuleLoaded(moduleId, modWrapper);
		});

		sortable.append(modWrapper);
	}, this);
}

function loadCustomModules(moduleDiv) {
	// Image Carousel configuration
	var imagecarousel = $(".imagecarousel", moduleDiv);
	if (imagecarousel && currentPage) {
		var prev = $("<div class=\"prev button\" />");
		var next = $("<div class=\"next button\" />");
		imagecarousel.append(prev);
		imagecarousel.append(next);

		setCarouselIndex(imagecarousel, 0);

		next.click(e => {
			var index = imagecarousel.data("image-index");
			setCarouselIndex(imagecarousel, index + 1);
		});

		prev.click(e => {
			var index = imagecarousel.data("image-index");
			setCarouselIndex(imagecarousel, index - 1);
		});
	}

	// POI List configuration
	var poilist = $(".poilist", moduleDiv);
	if (poilist && currentPage) {
		loadPoiList(poilist);
	}
}

function setCarouselIndex(imagecarousel, index) {
	if (!currentPage.imageCarousel || !currentPage.imageCarousel[index]) return;

	var image = currentPage.imageCarousel[index];
	imagecarousel.data("image-index", index);
	imagecarousel.find(".coverBackground").css("background-image", "url(\"" + image.url + "\")");
	imagecarousel.find(".imageTitle").text(image.title);
}

function loadPoiList(poilist) {
	if (!currentPage || !currentPage.pois) return;

	poilist.empty();
	currentPage.pois.forEach(function (poi) {
		var div = $("<div />").load("../templates/poilistitem.template.html", () => {
			var poiitem = $(div).children().first();
			$(".poiprice", poiitem).html(poi.price + " &euro;");
			$(".poititle", poiitem).text(poi.name);
			$(".poisubtitle", poiitem).text(poi.summary);

			if (poi.mainImage) {
				$(".poiimage", poiitem).css("background-image", "url(\"" + poi.mainImage + "\")");
			}

			poilist.append(poiitem);
		});
	}, this);
}