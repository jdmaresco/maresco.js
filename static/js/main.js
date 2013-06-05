
String.prototype.firstTwo = function() {
	return this.substr(0,2);
}

var PostCollectionView = Backbone.View.extend({
	el: '#post-collection',
	initialize: function() {
		this.$el.hide();
		var posts = this.model.models;

		_.each(posts, function(post){
			var postView = new PostView({ model: post });
			this.$el.append( postView.render().el );
		}, this)

		this.$el.fadeIn(1000);
	}
})

var PostView = Backbone.View.extend({
	template: "<p class='post-title'>{{postTitle}}</p>{{{postContent}}}",
	initialize: function() {
		_.bindAll(this, 'respondToScroll');
		$(window).scroll(this.respondToScroll);
	},
	render: function() {
		this.$el.html(Mustache.to_html(this.template, this.model.toJSON()));
		this.postDate = this.model.get('postDate');
		return this;
	},
	respondToScroll: function() {
		if ( ( $(window).scrollTop() > (this.$el.offset().top - 12) ) && ( $(window).scrollTop() < (this.$el.offset().top + this.$el.height() ) ) ) {
			app.dateView.render(this.postDate,'MM-DD-YYYY');
		};
		//console.log($(window).scrollTop());
		//console.log(this.cid + ' top check: ' + (this.$el.offset().top - 20) + ' & bottom check: ' + (this.$el.offset().top + this.$el.height() - 20) + ' & date: ' + this.postDate);
	},
	postDate: '',


});

var DateView = Backbone.View.extend({
	el: '.theCircleText',
	initialize: function() {
		this.render();
	},
	render: function(dateWritten,format) {	// may want to add 3rd parameter to allow text before date, e.g. 'today is'
		if (dateWritten) {
			if(dateWritten != this.currentDateListed) {
				this.$el.fadeOut('200', function() { 
					console.log(this);
					$(this).html(moment(dateWritten).format("dddd, <br> MMMM Do"));
				});
			}
		} else { this.$el.html(moment().format("dddd, <br> MMMM Do")); }
		this.$el.fadeIn('200');	
		this.currentDateListed = dateWritten;
	},
	currentDateListed: ''
});

var Post = Backbone.Model.extend({
	postID:"",
	postContent:""
});

var PostCollection = Backbone.Collection.extend({
	
	model: 'post',
	
	initialize: function() {
		currentPostContent ="";
		currentPostID = "";
		$.ajax({
			collection : this,
			url : "posts.txt",
			dataType : "text",
			success : function(data) {
				var posts = data.split(/\n/);								// each line in posts.txt is a title, date, or paragraph
				posts = _.reject(posts, function(post) {					// strip out comments in posts.txt as well as empty rows
					return ( post.firstTwo() == '//' || post == false );
				});
				this.collection.load(posts);
			}
		});
	},

	load: function(element) {

		var myline;
		var textFileFullyLoaded = false;

		var getNextLine = function(element) {
			if (element.length > 0) {
			console.log(myline = element.pop()); }
			else { textFileFullyLoaded = true; }
		};

		getNextLine(element);

		var currentPostContent = "";
		var currentPostDate = "";
		var currentPostTitle = "";

		while ( !textFileFullyLoaded ) {

			while (element.length > 0 && $.isNumeric(myline)) {							// don't start popping posts if the last item in file is numeric
				console.log(1);
				getNextLine(element);
			};
			while (element.length > 0 && !($.isNumeric(myline.firstTwo()))) {						// pop text posts
				console.log(2);
				currentPostContent = "<p class='post-paragraph'>" + myline +"</p>" +  currentPostContent;
				getNextLine(element);
			};

			if (element.length > 0 && $.isNumeric(myline.firstTwo())) { 										// pop post date and title
				console.log(3);
				currentPostDate = myline;
				getNextLine(element);
				currentPostTitle = myline;
			};
			
			var myModel = new Post({"postTitle": currentPostTitle, "postDate": currentPostDate, "postContent": currentPostContent});
			this.add(myModel);
			currentPostContent = currentPostID = "";
			getNextLine(element);

		} 

		var postCollectionView = new PostCollectionView({'model': this});

	}

});

var Workspace = Backbone.Router.extend({

	routes: {
		"*path" : "startUp",
		"posts/:id": "scrollToPost"
	},

	startUp: function() {
		this.postCollection = new PostCollection();
		this.dateView = new DateView();
	},

	scrollToPost: function(id) {
		// jQuery code to scroll to post with given id
	}

});

var app = new Workspace();
Backbone.history.start();

$().ready(function() {

})