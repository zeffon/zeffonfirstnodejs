var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongoose = require('mongoose');
mongoose.connect(settings.url);
module.exports = function() {
    return new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});
}

/*
mongodb.open();
mongodb.close();*/
