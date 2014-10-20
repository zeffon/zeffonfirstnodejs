/**
 * Created by yuzefeng on 14-10-17.
 */
/**
 * Created by yuzefeng on 14-10-15.
 */

var User = require('../models/user');
var crypto= require('crypto');
var _ = require('underscore');
var passport = require('passport');


//signup
exports.signup = function (req,res) {
    var _user = req.body.user;
//    var md5 = crypto.createHash('md5'),
//        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
//        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//    _user.head = head;

    User.findOne({"name":_user.name}, function (err,user) {
        if(err){
            console.log(err);
        }
        if(user){
            return res.redirect('/signin');
        }else{
            user = new User(_user);
            user.save(function (err,user) {
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            });
        }
    });
}

//signin
exports.signin = function (req,res) {

    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({"name": name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {

                req.session.user = user;
                return res.redirect('/');
            }
            return res.redirect('/signin');
        });
    });
}

exports.signinWithGit = function (req, res) {
    req.session.user = { name:req.user.username };
    res.redirect('/');
}
exports.logout = function (req,res) {
//logout

    delete req.session.user;
//        delete app.locals.user;
    res.redirect('/');


}

exports.ulist = function (req,res) {

    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.render('userlist',{
            user:req.session.user,
            title:'用户列表页',
            users: users
        })
    })
}
exports.showSignin = function (req, res) {
    res.render('signin',{
        title:"登录页面",
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}
exports.showSignup = function (req, res) {
    res.render('signup',{
        title:"注册页面",
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.singinRequired = function (req, res, next) {
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
}
exports.adminRequired = function (req, res, next) {
    var user = req.session.user;

    if( user.role <= 10 ){
        return res.redirect('/');
    }
    next();
}

exports.del = function (req,res) {
//list delete movie

    var id = req.query.id;
    console.log(id);
    if(id){
        User.removeById(id, function (err,user) {
            if(err){
                console.log(err);
            }
            else{
                res.json({success:1});
            }
        });
    }
}