var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Comments = mongoose.model('Comments');
var express = require('express');
var router = express.Router();

/* GET posts */
router.get('/posts', function(req, res, next) {
	Posts.find(function(err, posts){
		if(err){ return next(err); }
		res.json(posts);
	    });
    });

/* POST posts */
router.post('/posts', function(req, res, next) {
	var post = new Posts(req.body);
	post.save(function(err, post) {
		if(err){ return next(err); }
		res.json(post);
	    });
    });

/* Preload a specific post into req.post */
router.param('post', function(req, res, next, id) {
	var query = Posts.findById(id);
	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }
		req.post = post;
		return next();
	    });
    });

/* Preload a specific comment into req.comment */
router.param('comment', function(req, res, next, id) {
	var query = Comments.findById(id);

	query.exec(function (err, comment) {
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		req.comment = comment;
		return next();
	    });
    });

/* GET a single post */
router.get('/posts/:post', function(req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(req.post);
	    });
    });

/* PUT - increment a post's upvotes */
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }
		res.json(post);
	    });
    });

/* POST a new comment */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comments(req.body);
	comment.post = req.post;

	comment.save(function(err, comment) {
		if (err) { return next(err); }
		
		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if (err) { return next(err); }
			res.json(comment);
		    });
	    });
    });

/* PUT - increment a comment's upvotes */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }
		
		res.json(comment);
	    });
    });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;