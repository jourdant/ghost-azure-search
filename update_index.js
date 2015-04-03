//settings
var ghost_base_url = "http://yourghostblog.com";
var ghost_username = "yourghostlogin";
var ghost_password = "yourghostghost_password";

var azure_index = "blog";
var azure_domain = "yourazuresearchdomain";
var azure_api_key = "apikey";
var azure_url = "https://" + azure_domain + ".search.windows.net/indexes/" + azure_index + "/docs/index?api-version=2015-02-28";

//import modules
var request = require('request').defaults({jar: true});
var htmlToText = require('html-to-text');

//log into page
var login_url = ghost_base_url + "/ghost/api/v0.1/authentication/token";
var login_data = { grant_type: "ghost_password", ghost_username: ghost_username, ghost_password: ghost_password, client_id: "ghost-admin" }
console.log("Logging in");
request.post(login_url, {form: login_data}, function(err, resp, body) {
	if (!err) {
		var token = JSON.parse(body).access_token;
		var export_url = ghost_base_url + "/ghost/api/v0.1/db/?access_token=" + token;

		console.log("Token acquired");
		console.log("Downloading database export");
		request.get(export_url, null, function(err, resp, body){
			if (!err) {
				console.log("Blog data acquired");
				console.log("Building Azure Search index");


				var index = {value: []};
				var data = JSON.parse(body);

				//users
				for (user in data.db[0].data.users) {
					var user = data.db[0].data.users[user];
					console.log("    Adding [AUTHOR] '" + user.name + "'");
						index.value[index.value.length] = {
							"@search.action": "upload",
							id: 	user.uuid,
							image: 	user.image,
							slug: 	user.slug,
							title: 	user.name,
							type: 	"AUTHOR"
						}
				}


				//posts
				for (post in data.db[0].data.posts) {
					var post = data.db[0].data.posts[post];
					if (post.page == 0 && post.status == "published") {
						console.log("    Adding [POST] '" + post.title + "'");
						index.value[index.value.length] = {
							"@search.action": "upload",
							id: 	post.uuid,
							image: 	post.image,
							slug: 	post.slug,
							title: 	post.title,
							type: 	"POST",

							text: htmlToText.fromString(post.html, {wordwrap: null}),
							published_at: new Date(post.published_at)
						}
					}
				}


				//tags
				for (tag in data.db[0].data.tags) {
					var tag = data.db[0].data.tags[tag];
					if (tag.hidden == 0) {
						console.log("    Adding [TAG] '" + tag.name + "'");
						index.value[index.value.length] = {
							"@search.action": "upload",
							id: 	tag.uuid,
							image: 	tag.image,
							slug: 	tag.slug,
							title: 	tag.name,
							type: 	"TAG",

							text: 	tag.description
						}
					}
				}


				console.log("Index compiled. Uploading.");
				request.post(azure_url, {json: index, headers: {"api-azure_api_key": azure_api_key}}, function(err, resp, body) {
					if (resp.statusCode == 200) {console.log("Upload complete.");}
					else {console.log(resp.statusCode);}
				});
			}
			else {console.error(err);}
		});
	}
	else {console.error(err);}
});
