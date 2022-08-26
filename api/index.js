const app = require('express')();

app.get('/api/page', function (_, res) {
	res.json(stubResponse);
});

app.put('/api/configurator/page', function (req, res) {
	console.log(req.body);
	// todo: save to DB
	res.json({ text: "saved" });
});

module.exports = app;

var stubResponse =
{
	"data": [
		{
			"id": "221",
			"langcode": "en",
			"name": "Leonardo's story",
			"pois": [
				{
					"id": "56",
					"contentType": "poi",
					"name": "Saint Paul Basilica",
					"price": 12,
					"summary": "Second biggest church in Rome.",
					"mainImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Rom%2C_Sankt_Paul_vor_den_Mauern_%28San_Paolo_fuori_le_mura%29%2C_Innenansicht_1.jpg/290px-Rom%2C_Sankt_Paul_vor_den_Mauern_%28San_Paolo_fuori_le_mura%29%2C_Innenansicht_1.jpg",
				},
				{
					"id": "51",
					"contentType": "poi",
					"name": "Saint Peter Basilica",
					"price": 12,
					"summary": "Biggest christian church in the world.",
					"mainImage": "http://www.turismoroma.it/wp-content/uploads/2012/04/san_pietro-300x199.jpg",
				},
				{
					"id": "46",
					"contentType": "poi",
					"name": "Colosseum",
					"price": 12,
					"summary": "Roman ancient amphitheatre known for gladiators fights.",
					"mainImage": "http://www.turismoroma.it/wp-content/uploads/2011/02/Colosseo.jpg",
				}
			],
			"images": [
				"http://www.leonardodavincimuseo.com/wp-content/uploads/2016/07/cenacolo_750-1.jpg",
				"https://upload.wikimedia.org/wikipedia/commons/5/54/LEONARDO_DA_VINCI.jpg",
				"https://www.italian-renaissance-art.com/images/Leonardo-Annunciation-stitc.jpg",
				"https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg"
			],
			"imageCarousel": [
				{
					"url": "http://www.leonardodavincimuseo.com/wp-content/uploads/2016/07/cenacolo_750-1.jpg",
					"title": "Cenacolo"
				},
				{
					"url": "https://www.italian-renaissance-art.com/images/Leonardo-Annunciation-stitc.jpg",
					"title": "Annunciation"
				},
				{
					"url": "https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg",
					"title": "Mona Lisa",
				}
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
				{
					"moduleId": "image_carousel",
					"images": [
						{
							"title": "Ultima cena",
							"url": "http://www.leonardodavincimuseo.com/wp-content/uploads/2016/07/cenacolo_750-1.jpg"
						},
						{
							"title": "L'annunciazione",
							"url": "https://www.italian-renaissance-art.com/images/Leonardo-Annunciation-stitc.jpg"
						},
						{
							"title": "La gioconda",
							"url": "https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg"
						}
					]
				},
				{
					"moduleId": "simple_text",
					"content": "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim\n\t\t\tad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.\n\t\t\tQuis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat\n\t\t\tnon proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
				},
				{
					"moduleId": "image_description",
					"content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque\n\t\t\tpenatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium\n\t\t\tquis, sem.",
					"image": "https://cdn.britannica.com/s:300x500/24/189624-131-BAF1184D.jpg"
				}
			]
		}
	]
};