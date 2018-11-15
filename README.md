# Simple Page Builder

This is POC of an interface used to build web pages. This is meant to cooperate with a CMS.

*Tested only in Chrome.*

## Interface Usage

![Example](images/usage_example.gif)

## Templates

todo

## Page Saving

todo

## CMS

The CMS is in charge of page node creation, image upload and REST APIs.

### GetPages

`GET`: `/api/page`

The backend should expose a REST API that returns the list of pages is in this format:

```
{
	"data": [
		{
			"id": "221",
			"langcode": "en",
			"name": "Leonardo's story",
			"images": [
				"http://www.leonardodavincimuseo.com/wp-content/uploads/2016/07/cenacolo_750-1.jpg",
				"https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg",
				"https://www.italian-renaissance-art.com/images/Leonardo-Annunciation-stitc.jpg",
				"https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg"
			],
			"modules": [
			    {
			      "moduleId": "main_title",
			      "title": "An italian genius",
			      "subtitle": "An italian genius in every artistic field",
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

### SavePage

`PUT`: `/api/configurator/page`

The backend should expose a REST API that saves the state of the template modules. The request that the interface sends is in this format:

```
{
  "id": "221",
  "lang": "en",
  "modules": [
    {
      "moduleId": "main_title",
      "title": "An italian genius",
      "subtitle": "An italian genius in every artistic field",
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