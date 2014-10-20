
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var fs = require('fs');
var accessLog = fs.createWriteStream('accessLog',{flag:'a'});
var errorLog = fs.createWriteStream('errorLog',{flag:'a'});
var http = require('http');
var path = require('path');
var mongodb = require('mongodb').Db;
var mongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var routes = require('./config/route');
//var dbUrl = 'mongodb://localhost/myblog';
var mongoose = require('mongoose');

mongoose.connect(settings.url);

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.logger({stream:accessLog}));
app.locals.moment = require('moment');
app.use(express.bodyParser({
    keepExtensions:true,uploadDir:'/public/images'
}));

app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret:settings.cookieSecret,
    cookie:{maxAge: 1000 * 60 * 60 * 24 * 30},
//    url: settings.url

    store:new mongoStore({
        url: settings.url,
        collection: 'sessions'
    })
}));
app.use(passport.initialize());


app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + ']' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
})

passport.use(new GithubStrategy({
    clientID:"fdd6fdf1b7b5de1d5c71",
    clientSecret:"0615b02236c319cb7acb84040f354cc2946f1328",
    callbackURL:"http://yuzefengtest.herokuapp.com/login/github/callback"
}, function (accessToken, refreshToken, profile, done) {
    done(null, profile);
}));

// development only
if('development' === app.get('env')){
    app.set('showStackError', true);
    app.use(express.logger(':method:url:status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/route.js')(app);

http.createServer(app). listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
