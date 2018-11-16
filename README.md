# Simple Page Builder

This is a POC of an interface used to build web pages. This is meant to cooperate with a CMS.

*Tested only in Chrome.*

**Demo:** https://simple-page-configurator.herokuapp.com/

## Interface Usage

![Example](images/usage_example.gif)

## Templates

To add a new template, you need to:

* create an html file under [templates folder](public/templates)
* add an entry in the [modules configuration array](public/js/PageLoader.js#3) of PageLoader.js

### Template files

The template file has some constraints:

* can't contain CSS files: all the style must be inline
* when an editable text is needed, you must add the `contenteditable` attribute to the element
* when an image picker is needed, you must add the `imageeditable` class to the element
* all the elements with the `contenteditable` attribute and the `imageeditable` class must have an id (for further information go to [Page Saving](#page-saving) chapter)

### Modules configuration array

The configuration array is in this format:

```json
{
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
    ...
  ]
}
```

* `moduleId`: unique id of the module
* `moduleTitle`: title of the module (will be displayed in the template select list)
* `templatePath`: path of the template

## Page Saving

When the page is saved, the Page Preview is converted in json. Each template becomes an entry of the `modules` array using this format:

```json
			"modules": [
			    {
			      "moduleId": "main_title",
			      "title": "An Italian genius",
			      "subtitle": "An Italian genius in every artistic field",
			      "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg"
			    },
			    {
			      "moduleId": "line"
			    },
			    {
			      "moduleId": "simple_quote",
			      "quote": "Best painter in the world",
			      "quoteAuthor": "Piero Angela"
			    },
			    {
			      "moduleId": "line"
			    },
			    ...
			]
```

* `moduleId`: id of the module in the [Modules configuration array](#modules-configuration-array)
* *contenteditable elements*: all the template elements having the `contenteditable` attribute are converted in key value pairs where the key is the `id` attribute and the value is the text node
* *.imageeditable elements*: all the template elements having the `imageeditable ` class are converted in key value pairs where the key is the `id` attribute and the value is the url of the selected image

## CMS

The CMS is in charge of page node creation, image upload and REST APIs.

### GetPages

`GET`: `/api/page`

The backend should expose a REST API that returns the list of pages is in this format:

```json
{
	"data": [
		{
			"id": "221",
			"langcode": "en",
			"name": "Leonardo's story",
			"images": [
				"http://www.leonardodavincimuseo.com/wp-content/uploads/2016/07/cenacolo_750-1.jpg",
				"https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg",
				"https://www.Italian-renaissance-art.com/images/Leonardo-Annunciation-stitc.jpg",
				"https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg"
			],
			"modules": [
			    {
			      "moduleId": "main_title",
			      "title": "An Italian genius",
			      "subtitle": "An Italian genius in every artistic field",
			      "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg"
			    },
			    {
			      "moduleId": "line"
			    },
			    {
			      "moduleId": "simple_quote",
			      "quote": "Best painter in the world",
			      "quoteAuthor": "Piero Angela"
			    },
			    {
			      "moduleId": "line"
			    },
			    ...
			]
		},
		...
	]
}
```

### SavePage

`PUT`: `/api/configurator/page`

The backend should expose a REST API that saves the state of the template modules. The request that the interface sends is in this format:

```json
{
  "id": "221",
  "lang": "en",
  "modules": [
    {
      "moduleId": "main_title",
      "title": "An Italian genius",
      "subtitle": "An Italian genius in every artistic field",
      "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg"
    },
    {
      "moduleId": "line"
    },
    {
      "moduleId": "simple_quote",
      "quote": "Best painter in the world",
      "quoteAuthor": "Piero Angela"
    },
    {
      "moduleId": "line"
    },
    ...
  ]
}
```

N.B. The array in `modules` can be converted and saved as a string. The CMS doesn't need to interpret this field.

### Fields

* `id`: string id of the page
* `lang`: string language code of the page
* `name`: string title of the page
* `images`: array of the image urls uploaded to the CMS page node
* `modules`: array of modules to display (for further information go to [Page Saving](#page-saving) chapter)
