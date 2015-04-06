//
// Title:     create_index.js
// Author:    Jourdan Templeton
// Blog:      http://blog.jourdant.me
// Email:     hello@jourdant.me
// Modified:  06/04/2015 09:50PM NZDT
//

//import modules
var request = require('request');

//azure settings
var azure_service = "<searchservicename>";
var azure_index = "<indexname>";
var azure_api_key = "<apikey>";
var azure_url = "https://" + azure_service + ".search.windows.net/indexes/" + azure_index + "?api-version=2015-02-28";



//build index payload
var index = {
	name: azure_index,
	fields: [
		//generic fields
		{ name: "id", 			type: "Edm.String", "key": true },
		{ name: "image", 		type: "Edm.String" },
		{ name: "slug", 		type: "Edm.String" },
		{ name: "title", 		type: "Edm.String", searchable: true},
		{ name: "type", 		type: "Edm.String", searchable: true, filterable: true},
		{ name: "tags", 		type: "Collection(Edm.String)"},

		//article specific
		{ name: "text", 		type: "Edm.String", searchable: true, analyzer: "en.lucene"},
		{ name: "published_at", type: "Edm.DateTimeOffset", filterable: true, sortable: true }
	],

	suggesters: [
		{ name: "sg", searchMode: "analyzingInfixMatching", sourceFields: ["title"] }
	],

	corsOptions: {
		allowedOrigins: ["*"]
	}
};


//create index in azure
request.put(azure_url, {json: index, headers: {"api-key": azure_api_key}})
	.on("response", function (resp) {
		if (resp.statusCode == 201) { console.log("Index created."); }
		else if (resp.statusCode >= 200 && resp.statusCode < 210) { console.log("Index updated."); }
		else if (resp.statusCode >= 400) { console.log(resp); }
	})
	.on("error", function (err)
	{
		console.log(err);
	});