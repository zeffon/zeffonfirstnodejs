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

    Post
        .find()
        .sort({"meta.updateAt":-1})
        .exec(function (err, posts) {
            if(err){
                console.log(err);
            }
            Post.distinct({},'tags')
                .limit(30)
                .exec(function (err, tags) {
                    if(err){
                        req.flash('error', err);
                    }

                    res.render('index',{
                        title:'主页',
                        posts: posts,
                        tags: tags,
//                page:page,
//                isFirstPage:(page - 1) == 0,
//                isLastPage:((page - 1) * 10 + posts.length) == total,
                        user: req.session.user,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                });

    });
}

