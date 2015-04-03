//add request library
var request = require('request');

var search_term = "azure";

var azure_index = "blog";
var azure_domain = "yourazuresearchdomain";
var azure_api_key = "apikey";
var azure_url = "https://" + azure_domain + ".search.windows.net/indexes/" + azure_index + "/docs/index?api-version=2015-02-28&search=" + search_term;

request.get(azure_url, {headers: {"api-key": key}}).on("response", function (resp) { 
	console.log(resp);
});