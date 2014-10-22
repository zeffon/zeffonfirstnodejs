/**
 * Created by yuzefeng on 14-10-17.
 */
var crypto = require('crypto');
var fs = require('fs');
var Post = require('../models/post');
var passport = require('passport');
//var Category = require('../models/category');
var _ = require('underscore');
var async = require('async');

//index page
exports.index = function (req,res) {
    //        判断是否时第一页，并把请求的页数转换成number类型
//    var page = req.query.p?parseInt(req.query.p):1;
//    res.render('index', { title: 'Express' });
    async.parallel([
        function(callback){
            Post
                .find()
                .sort({"meta.updateAt":-1})
                .exec(function (err, posts) {
                    if(err){
                        console.log(err);
                    }

                    res.render('index',{
                        title:'主页',
                        posts: posts,
//                page:page,
//                isFirstPage:(page - 1) == 0,
//                isLastPage:((page - 1) * 10 + posts.length) == total,
                        user: req.session.user,
                        success: req.flash('success').toString(),
                        warn: req.flash('warn').toString(),
                        error: req.flash('error').toString()
                    });
                    callback(null,posts);
                });
        },
        function(callback){
            Post
                .distinct({},'tags')
                .exec(function (err, tags) {
                    if(err){
                        console.log(err);
                    }
                    res.render('index',{
                        user: req.session.user,
                        tags: tags,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                    callback(null,tags);
                });
        }
        
        
        
    ], function (err, results) {
        if(err){
            console.log(err);
        }
        callback(null,results);
    })

}

