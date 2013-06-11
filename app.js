// Load HTTP Module
var http = require('http');
var util = require('util');
var connect = require('connect');
var _ = require('underscore');
var h = require('handlebars');
var vacuum = require('./vacuum').vacuum;
var fs = require('fs');
var moment = require('moment');

_.bindAll(vacuum);


var start = function() {
	connect()
	.use(connect.logger('dev'))
	.use(connect.static('static'))
	.use(function(req,res){
		
		res.writeHead(200, { 'Content-Type': 'text/html' });

		vacuum.getStoredData('ethiopiansummers', function(data) {
			data = JSON.parse(data);
			vacuum.storedData.blog1PostText = data.body;
			vacuum.storedData.blog1PostTitle = data.title;
			vacuum.storedData.blog1PostURL = data.short_url;
			vacuum.storedData.blog1PostDate = moment(JSON.stringify(data.date).substring(1,11), "YYYY-MM-DD").format("dddd, MMMM Do YYYY");

			vacuum.getStoredData('maresco', function(data) {
				data = JSON.parse(data);
				vacuum.storedData.blog2PostText = data.body;
				vacuum.storedData.blog2PostTitle = data.title;
				vacuum.storedData.blog2PostURL = data.short_url;
				vacuum.storedData.blog2PostDate = moment(JSON.stringify(data.date).substring(1,11), "YYYY-MM-DD").format("dddd, MMMM Do YYYY");

				vacuum.getStoredData('johndavidm', function(data) {
					vacuum.storedData.tweet2 = data;

					vacuum.getStoredData('staceynicolem', function(data) {
						vacuum.storedData.tweet1 = data;

				        var pageData = vacuum.template({
				                Blog1PostTitle: vacuum.storedData.blog1PostTitle,
				                Blog1PostText: vacuum.storedData.blog1PostText,
				                Blog1PostURL: vacuum.storedData.blog1PostURL,
				                Blog1PostDate: vacuum.storedData.blog1PostDate,
				                Blog2PostTitle: vacuum.storedData.blog2PostTitle,
				                Blog2PostText: vacuum.storedData.blog2PostText,
				                Blog2PostURL: vacuum.storedData.blog2PostURL,
   				                Blog2PostDate: vacuum.storedData.blog2PostDate,
				                Tweet1: vacuum.storedData.tweet1,
				                Tweet2: vacuum.storedData.tweet2
				        });
				        res.write(pageData);
				        res.end();
					});
		    	});
		    });
        });
	})
	.listen(process.env.PORT || 5000);

	// Terminal output
	console.log("Server up");

	setInterval(function(){
		dataPoll();
	},60000);

	fs.readFile('index.html', 'utf-8', function(err, data) {
		if (err) {
			console.log('error retrieving stored data');
			console.log(err.name);
			console.log(err.message);
		};
		vacuum.template = h.compile(data);
	})

};

var dataPoll = function() {
	console.log(vacuum.blogs);
	for (var i in vacuum.blogs) {
		vacuum.checkBlog(i);
	};
	for (var j in vacuum.twitterHandles) {
		vacuum.checkTwitter(j);
	};
};

exports.start = start;
