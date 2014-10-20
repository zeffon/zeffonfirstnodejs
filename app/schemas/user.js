/**
 * Created by yuzefeng on 14-10-17.
 */
/**
 * Created by yuzefeng on 14-10-13.
 */
/**
 * Created by yuzefeng on 14-10-8.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var settings = require('../../settings');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR =10;


var UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    head: String,

//    0: nomal user
//    1: verified user
//    2: professonal user
//    >10: admin
    role:{
        type:Number,
        default:0
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
    }},
    {
        collection: 'users'
    }
);

UserSchema.pre('save', function (next) {

    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err,salt) {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err,hash) {
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        })
    });

});

UserSchema.methods ={
    comparePassword: function (_password,cb) {
        bcrypt.compare(_password, this.password, function (err,isMatch) {
            if(err){
                cb(err);
            }
            cb(null,isMatch);
        })
    }
}


UserSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id,cb) {
        return this.findOne({_id:id}).exec(cb);
    },
    removeById: function (id,cb) {
        return this.remove({_id:id}).exec(cb);
    }

}

module.exports = UserSchema;