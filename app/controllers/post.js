/**
 * Created by yuzefeng on 14-10-17.
 */

var Post = require('../models/post');
var _ = require('underscore');
var async = require('async');

exports.new = function (req,res) {

        res.render('post',{

            user: req.session.user,
            post: {},
            reprint_info: {

            },
            pv:0,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()

        });
}

exports.save = function (req,res) {

    var id = req.params._id;

    var postObj = req.body.post;

    postObj.name = req.session.user.name;

    var _post;

    if(id){

        Post.findById(id, function(err,post){
            if(err){
                req.flash('error', err);
            }

            _post = _.extend(post, postObj);
            _post.save(function(err, post){
                if(err){
                    req.flash('error', err);
                }
                res.redirect('/post/'+post._id);

            });
        });
    }else{
        postObj.reprint_info = {};
        _post = new Post(postObj);

        _post.save(function(err,post){
            if(err){
                req.flash('error', err);
            }
            res.redirect('/post/'+post._id);
        });
    }
}

//获取一篇文章
exports.detail = function(req, res) {
    var _id = req.params.id;

    async.parallel([
        function (callback) {
            Post.update({_id: _id},{$inc:{"pv":1}}, function () {
                callback(null, 'r');
            });
        },
        function (callback) {
            Post.findById(_id, function (err, post) {
                callback(null, post);
            });
        }

    ], function (err,results) {

        res.render('article', {

            user: req.session.user,
            post: results[1],
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}

//Post.getTen = function (name , page , callback) {
//    mongodb.connect(settings.url, function (err, db){
//        if (err) {
//            return callback(err);
//        }
//        db.collection('posts', function (err,collection) {
//            if(err){
//                db.close();
//                return callback(err);
//            }
//            var query = {};
//            if(name){
//                query.name = name;
//            }
//            collection.count(query, function (err,total) {
//                collection.find(query,{
//                    skip: (page - 1)*5,
//                    limit:5
//                }).sort({
//                    time: -1
//                }).toArray(function (err,docs) {
//
//                    db.close();
//                    if(err){
//                        return callback(err);
//                    }
//
//
//                    callback(null,docs,total);
//                })
//            })
//
//        })
//    })
//}


exports.edit = function (req, res) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
       if(err){
           req.flash('error', err);
       }
        res.render('edit', {

            user: req.session.user,
            post: post,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}
exports.del = function (req, res) {
    var id = req.params.id;
    Post.removeById(id, function (err, post) {
        if(err){
            req.flash('error', err);
        }

        res.redirect('/');
    });
}
exports.getArchive = function (req, res) {

    Post
        .find({},{"name":1, "title":1, "meta.updateAt":1})
        .sort("-meta.updateAt")
        .exec(function (err, posts) {
            if(err){
                req.flash('error', err);
            }
            res.render('archive', {
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
}


exports.getTags = function (req, res) {
    Post
        .distinct({},'tags')
        .exec(function (err, results) {
            if(err){
                req.flash('error', err);
            }
            console.log(results);
            res.render('tags',{
                tags: results,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

}
exports.getTag = function (req, res) {
    var tagNew = req.params.tag;
    Post
        .find({tags:tagNew})
        .sort('-meta.updateAt')
        .exec(function (err, results) {
            if(err){
                req.flash('error', err);
            }
            console.log(results);
            res.render('tag',{
                title: tagNew,
                posts: results,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

}
exports.links = function (req, res) {
    res.render('links',{
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });

}
exports.search = function (req, res) {
    var keyword = req.query.keyword;
    var pattern = new RegExp("^.*" + keyword +".*$", "i");
    Post
        .find({"title":pattern},{"name":1, "title":1, "meta.updateAt":1})
        .sort("-meta.updateAt")
        .exec(function (err, posts) {
            if(err){
                req.flash('error', err);
            }
            res.render('search',{
                keyword: keyword,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
}

exports.reprint = function (req, res) {

//reprint_from, reprint_to
    var fromId = req.params.id;
    var toName = req.session.user.name;

    Post.findById(fromId, function (err, doc) {
        if(err){
            req.flash('error', err);
        }


        delete doc._id;
//        doc._id = undefined;
        doc.name = toName;
        doc.title = (doc.title.search( /[转载]/ ) > -1) ? doc.title : "[转载]" + doc.title;
        doc.pv = 0;
        doc.reprint_info = {"reprint_from": fromId};
//               更新被转载的原文档的reprint_info内的reprint_to


        Post.update({
            "_id" : fromId
        }, {
            $push: {
                "reprint_info.reprint_to":{
                    "name": doc.name,
                    "title": doc.title
                }
            }
        }, function (err) {
            if(err){
                req.flash('error', err);
            }
        });

//               将转载生成的副本修改后存入数据库，并返回存储后的文档
        var postNew = new Post();

        Object.defineProperties(postNew, {
            "_id": {
                configurable: true
            }
        });

        postNew.name = doc.name;
        postNew.title = doc.title;
        postNew.tags = doc.tags;
        postNew.post = doc.post;
//        postNew.reprint_info = { reprint_from: doc._id };


        console.log('-------------------------------------------------------------------' );
        console.log('postNew:' + postNew + " " + postNew.hasOwnProperty('_id') );
//        postNew.save(function (err, post) {
        postNew.save(function (err, post) {
                if(err){
                    req.flash('error', err);
                }
                console.log(post);
                res.redirect('/post/' + post._id);
                console.log('-------------------------------------------------------------------' );
                console.log('save postNew:' + post + " " + postNew.hasOwnProperty('_id') );
//            res.redirect('/post/' + post[0]._id);
                req.flash('success', '转载成功!');
            });

//        });



    });
}


