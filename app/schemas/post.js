/**
 * Created by yuzefeng on 14-10-18.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var settings = require('../../settings');
var crypto = require('crypto');
var async = require('async');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR =10;



var mongodb = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;

//mongoose.connect(settings.url);


var PostSchema = new Schema({
    name: String,
//    head: String,
    title: String,
    tags: [],
    post: String,
    reprint_info:{},
    pv: {
        type: Number,
        dafault: 0
    },
    meta:{
        createAt:{
            type:Date,
            dafault:Date.now()
        },
        updateAt:{
            type:Date,
            dafault:Date.now()
        }
    }
    },
    {
        collection: 'posts'
    });

PostSchema.pre('save', function (next) {


    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();

    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});




PostSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id,cb) {
        return this.findOne({_id:id}).exec(cb);
    },
    removeById: function (id,cb) {
        return this.remove({_id:id}).exec(cb);
    },
    insertPost: function (post,cb) {
        return this.insert(post).exec(cb);

    }


}

module.exports = PostSchema;
