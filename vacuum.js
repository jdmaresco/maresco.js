var fs = require('fs');
var https = require('https');
var Tumblr = require('tumblr').Tumblr;

var vacuum = {
	blogs 			: 	[ 
		'ethiopiansummers.tumblr.com',
		'maresco.tumblr.com'
	],
	twitterHandles	: 	[		/* Twitter read API changed, not functioning */
		'staceynicolem', 
		'johndavidm'
	],
	tumblrKey		: 	'HSb29TjUdYgtOtvrcbXiUoVTsaImmu3rARtuvBPqoqZaLQTPjC',
	storedData		:	[],
	getStoredData: function(file, callback) {
		fs.readFile(file + '.txt', 'utf-8', function(err, data) {
			if (err) {
				console.log('error retrieving stored data');
				console.log(err.name);
				console.log(err.message);
			};
			callback(data);
		});
	}, 
	template: [],
	captureStoredData: function(err, data) {

	},
	checkBlog: function(id) {
		console.log('Checking for new blog post from ' + this.blogs[id]);
		var blog = new Tumblr(this.blogs[id], this.tumblrKey);
		blog.posts({}, this.storeBlogPost);
	},
	checkTwitter: function(id) {		/* Twitter read API changed, not using this */

		console.log('Checking for new tweet from ' + this.twitterHandles[id]);
		https.get('https://api.twitter.com/1/statuses/user_timeline/'+this.twitterHandles[id]+'.json?count=1&include_rts=1&callback=?', function(res){
			res.setEncoding('utf8');
			var body='';
			res.on('data', function(chunk){
				body += chunk;
			});
			res.on('end', function() {
				body = JSON.parse(body)[0];
				if (body) {
					fs.writeFile(body.user.screen_name + '.txt', body.text, function(err) {
						if (err) { 
							console.log('Error saving tweet.') ;
						} else {
							console.log('Tweet saved from ' + body.user.screen_name);
						}
					});	
				} else {
					console.log('No tweet returned.');
				};
			});
		});
	},
	storeBlogPost: function(err, body) {
		if (err) {
			console.log('error:')
			console.log(err.name);
			console.log(err.message);
		} else {
			fs.writeFile(body.blog.name + '.txt', JSON.stringify(body.posts[0]), function(err) {
					if (err) { 
						console.log('Error saving blog post.') ;
					} else {
						console.log('Post saved from ' + body.blog.name);
					}		
			});	
		};
	},
	storeTweet: function(res) {

	}
};

exports.vacuum = vacuum;
