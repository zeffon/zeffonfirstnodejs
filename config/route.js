/**
 * Created by yuzefeng on 14-10-17.
 */

var Post = require('../app/controllers/post');
var User = require('../app/controllers/user');
var passport = require('passport');
var Index = require('../app/controllers/index');
var _ = require('underscore');

module.exports = function (app) {

//pre handle user
    app.use(function (req,res,next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next();
    });

//index
    app.get('/', Index.index);


//user
    app.post('/usr/signup', User.signup);
    app.post('/usr/signin', User.signin);
    app.get('/logout', User.logout);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/login/github/callback', passport.authenticate("github",{
        session: false,
        failureRedirect:"/signin",
        successFlash:"登录成功"
    }), User.signinWithGit);
//
//    app.get('/admin/user/list', User.singinRequired, User.adminRequired, User.ulist);
//    app.delete('/admin/user/list', User.singinRequired, User.adminRequired, User.del);

//post
    app.get('/post/:id', Post.detail);
    app.get('/admin/post/new', User.singinRequired, User.adminRequired, Post.new);
    app.post('/admin/post/new', User.singinRequired, User.adminRequired, Post.save);

    app.get('/admin/post/edit/:id', User.singinRequired, User.adminRequired, Post.edit);
    app.post('/admin/post/edit', User.singinRequired, User.adminRequired, Post.save);
    app.get('/admin/post/delete/:id', User.singinRequired, User.adminRequired, Post.del);
    app.get('/tags', User.singinRequired, User.adminRequired, Post.getTags);
    app.get('/tags/:tag', User.singinRequired, User.adminRequired, Post.getTag);
    app.get('/archive', User.singinRequired, User.adminRequired, Post.getArchive);
    app.get('/links', User.singinRequired, User.adminRequired, Post.links);
    app.get('/search', User.singinRequired, User.adminRequired, Post.search);
    app.get('/admin/post/reprint/:id', User.singinRequired, User.adminRequired, Post.reprint);


};


