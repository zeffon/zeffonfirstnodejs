

/**
 * Created by yuzefeng on 14-10-17.
 */
var mongoose = require('mongoose');
var PostSchema = require('../schemas/post');
var Post = mongoose.model('Post', PostSchema);

module.exports = Post;

