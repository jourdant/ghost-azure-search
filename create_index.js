//create request, allow cookies
var request = require('request');
var index_url = "https://<domain>.search.windows.net/indexes/?api-version=2015-02-28";
var key = "<apikey>";

var index = {name: "blog",
			  fields: [
			  	//generic fields
			  	{ name: "id", type: "Edm.String", "key": true },
				{ name: "image", type: "Edm.String", "key": false, retrievable: true },
			  	{ name: "slug", type: "Edm.String", "key": false },
			  	{ name: "title", type: "Edm.String", "key": false, searchable: true, suggestions: true, retrievable: true },
			  	{ name: "type", type: "Edm.String", "key": false, searchable: true, suggestions: true, retrievable: true },

			  	//article specific
			  	{ name: "text", type: "Edm.String", "key": false, searchable: true, retrievable: true },
			  	{ name: "published_at", type: "Edm.DateTimeOffset", "key": false, retrievable: true, filterable: true, sortable: true }
			  ],

			  suggesters: [
				{ name: "sg", searchMode: "analyzingInfixMatching", sourceFields: ["title", "text"] }
			  ],

			  corsOptions: {
			  	allowedOrigins: ["*"]
			  }
			};


request.post(index_url, {json: index, headers: {"api-key": key}}).on("response", function (resp) { 
	console.log(resp.statusCode);
});