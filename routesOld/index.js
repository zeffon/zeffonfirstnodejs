
/*
 * GET home page.
 */
var crypto = require('crypto');
var fs = require('fs');
var User = require('../app/controllers/user');
var Post = require('../app/controllers/post');
var passport = require('passport');
var ObjectID = require('mongodb').ObjectID;

module.exports = function (app) {

    app.get('/', function (req,res) {
//        判断是否时第一页，并把请求的页数转换成number类型
        var page = req.query.p?parseInt(req.query.p):1;
//        查询并返回第page页的10篇文章
        Post.getTen(null, page, function (err, posts, total) {
            if(err){
                posts = [];
            }
            res.render('index',{
                title:'主页',
                posts: posts,
                page:page,
                isFirstPage:(page - 1) == 0,
                isLastPage:((page - 1) * 10 + posts.length) == total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
    });
    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req,res) {
        res.render('reg',{
            title:'注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req,res) {

        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];

        if(password_re != password){
            req.flash('error','两次输入的密码不一致');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password =md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name:name,
            password : password,
            email : req.body.email
        });
        User.get(newUser.name, function (err,user) {
            if(user){
                req.flash('error','用户名已存在');
                return res.redirect('/reg');
            }
            newUser.save(function (err, user) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success','注册成功');
                res.redirect('/');
            });
        });

    });
    app.get('/login', checkNotLogin);
    app.get('/login', function (req,res) {
        res.render('login',{
            title:'登录',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });
    app.get("/login/github", passport.authenticate("github", {session:false}));
    app.get("/login/github/callback",passport.authenticate("github",{
        session: false,
        failureRedirect:"/login",
        successFlash:"登录成功"
    }), function (req, res) {
        req.session.user = {name:req.user.username, head:"http://gravatar.com/avatar/" + req.user._json.gravatar_id + "?s=48"};
        res.redirect('/');
    } );
    app.post('/login', checkNotLogin);
    app.post('/login', function (req,res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err,user) {
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/login');
            }
            if(user.password != password){
                req.flash('error','密码错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success','成功登录');
            res.redirect('/');
        });


    });
    app.get('/post', checkLogin);
    app.get('/post', function (req,res) {
        res.render('post',{
            title:'发表',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function (req,res) {
        var currentUser = req.session.user,
            tags = [req.body.tag1.trim(), req.body.tag2.trim(), req.body.tag3.trim()],
            post = new Post(currentUser.name, currentUser.head, req.body.title, req.body.post,tags);
        post.save(function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','发布成功')
            res.redirect('/');
        })
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function (req,res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });
    app.get('/upload',checkLogin);
    app.get('/upload', function (req,res) {

        res.render('upload',{
            title:'文件上传',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })

    app.post('/upload',checkLogin);
    app.post('/upload', function (req,res) {
        for(var i in req.files){
            if(req.files[i].size ==0 ){
//                使用同步方式删除一个文件
                fs.unlinkSync(req.files[i].path);
                console.log('Successfully removed an empty file');
            }else{
                var target_path = './public/images/' + req.files[i].name;
//               使用同步方式重命名一个文件
                fs.renameSync(req.files[i].path,target_path);
                console.log('Successfully removed an empty file');
            }
        }
        req.flash('success','文件上传成功');
        res.redirect('/upload');

    });
    app.get('/u/:name', checkLogin);
    app.get('/u/:name', function (req,res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //        检查用户是否存在
        User.get(req.params.name, function (err,user) {
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/');
            }
//            查询并返回该用户的所有文章
            Post.getTen(user.name, page, function (err,posts, total) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/');
                }
                res.render('user',{
                    title: user.name,
                    posts: posts,

                    page: page,
                    isFirstPage:(page - 1) == 0,
                    isLastPage:((page - 1) * 10 + posts.length)==total,
                    user:req.session.user,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                })
            })
        })
    })
    app.get('/search', function (req, res) {
        Post.search(req.query.keyword, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            res.render('search', {
                title: "SEARCH:" + req.query.keyword,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });

        });
    });

    app.get('/p/:_id', checkLogin);
    app.get('/p/:_id', function (req, res) {
        Post.getOne(req.params._id, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            res.render('article', {

                title: post.title,
                user: req.session.user,
                post: post,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

   /* app.post('/u/:name/:day/:title', checkLogin);
    app.post('/u/:name/:day/:title', function (req,res) {
        var date = new Date(),
            time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
        var md5 = crypto.createHash('md5'),
            email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
            head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
        var comment = {
            name:req.body.name,
            head: head,
            email:req.body.email,
            website:req.body.website,
            time:time,
            content:req.body.content
        };

        var newComment = new Comment(req.body.name, req.body.day, req.body.title, req.body.content);
        newComment.save(function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success','留言成功');
            res.redirect('back');
        })

    });*/

    app.get('/edit/p/:_id', checkLogin);
    app.get('/edit/p/:_id', function (req,res) {

        Post.edit(req.params._id, function (err,post) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            res.render('edit',{
                title:'编辑',
                post:post,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })

        });

    });
    app.post('/edit/p/:_id', checkLogin);
    app.post('/edit/p/:_id', function (req,res) {
        console.log(req.body);
        Post.update(req.params._id, req.body.title, req.body.tags, req.body.post, function (err) {
            var url = '/p/' + req.params._id;
            if(err){
                req.flash('error',err);
                return res.redirect(encodeURI(url));
            }
            req.flash('success','修改成功');
            res.redirect(encodeURI(url));

        });
    });
    app.get('/remove/p/:_id', checkLogin);
    app.get('/remove/p/:_id', function (req,res) {

        Post.remove(req.params._id,  function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功');
            res.redirect('/');

        });
    });
    app.get('/reprint/:_id', checkLogin);
    app.get('/reprint/:_id', function (req, res) {
        Post.edit(req.params._id, function (err, post) {
            if(err){
                req.flash('error', err);
                return res.redirect('back');
            }
            var currentUser = req.session.user;
            reprint_from = { _id : req.params._id},
            reprint_to = {name: currentUser.name, head: currentUser.head};
            Post.reprint(reprint_from, reprint_to, function (err, post) {
                if(err){
                    req.flash('error', err);
                    return res.redirect('back');
                }
                req.flash('success', '转载成功');
                var url = "/p/" + post._id;
                res.redirect(encodeURI(url));
            })

        })
    });
    app.get('/archive', function (req, res) {
        Post.getArchive(function (err, posts) {
            if(err){
                req.flash("error", err);
                return res.redirect('/');
            }
            res.render('archive', {
                title:'存档',
                posts:posts,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });

        });
    });
    app.get('/tags', function (req, res) {
        Post.getTags(function (err, tags) {
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tags', {
                title:'标签',
                tags:tags,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()


            })
        })
    })
    app.get('/tags/:tag', function (req,res) {
        Post.getTag(req.params.tag, function (err, posts) {
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tag', {
                title:'TAG:' + req.params.tag,
                posts:posts,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })
    app.get('/links', function (req, res) {
        res.render('links', {
            title:'友情链接',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });
    function checkLogin(req,res,next) {
        if(!req.session.user){
            req.flash('error','未登录');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req,res,next) {
        if(req.session.user){
            req.flash('error','已登录');
            res.redirect('back');
        }
        next();

    }

    app.use(function (req, res) {
        res.render('404');
    });
}
