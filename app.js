// Load HTTP Module
var http = require('http');
var util = require('util');
var Tumblr = require('tumblr').Tumblr;
var mu = require('mu2');
var connect = require('connect');

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.static('static'))
	.use(function(req,res){

		res.writeHead(200, {"Content-Type": "text/html"});

		var blog = new Tumblr('jdandstacey.tumblr.com', 'HSb29TjUdYgtOtvrcbXiUoVTsaImmu3rARtuvBPqoqZaLQTPjC');
		blog.posts({limit: 1}, function(error, response) {
			if (error) {
				throw new Error(error);
			}

			blog1PostTitle = response.posts[0].title;
			blog1PostText = response.posts[0].body;
			blog1PostURL = response.posts[0].short_url;

			var blog2 = new Tumblr('maresco.tumblr.com', 'HSb29TjUdYgtOtvrcbXiUoVTsaImmu3rARtuvBPqoqZaLQTPjC');
			blog2.posts({limit: 1},function(error, response) {
				if (error) {
					throw new Error(error);
				}
				blog2PostTitle = response.posts[0].title;
				blog2PostText = response.posts[0].body;
				blog2PostURL = response.posts[0].short_url;

					var stream = mu.compileAndRender('index.html', {
						Blog1PostTitle: blog1PostTitle,
						Blog1PostText: blog1PostText,
						Blog1PostURL: blog1PostURL,
						Blog2PostTitle: blog2PostTitle,
						Blog2PostText: blog2PostText,
						Blog2PostURL: blog2PostURL
					});
					util.pump(stream,res);

			});

		});
	})
	.listen(3000);

// Terminal output
console.log("Server up");