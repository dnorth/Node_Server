var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
	body: String,
	upvotes: {type: Number, default: 0},
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }
    });

CommentSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Comments', CommentSchema);