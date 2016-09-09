var crypto = require('crypto'),User  = require('../models/user.js');
var express = require('express');
var router = express.Router();

/**
* 添加路由规则的类
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '主页' });
});

router.get('/reg', checkNotLogin);

router.get('/reg', function(req, res, next) {
  res.render('reg',{ title: "注册"});
});

router.post('/reg', checkNotLogin);

router.post('/reg', function(req, res, next) {
  var name = req.body.name,
  password = req.body.password,
  passwordConfirm = req.body['password-repeat'];
  if (password != passwordConfirm) {
    req.flash('error','两次输入的密码不一致');
    return res.redirect('/reg');
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册、成功后返回主页、
    });
  });
});


router.get('/login', checkNotLogin);

router.get('/login', function(req, res, next) {
  res.render('login',{ title: "登录"});
});

router.post('/login', checkNotLogin);

router.post('/login', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var md5 = crypto.createHash('md5');
  var md5Password = md5.update(password).digest('hex');
  User.get(name, function(error, user) {
    if(!user) {
      req.flash('error', 'user is not exist');
      return res.redirect('/login');
    }
    if (user.password != md5Password) {
      req.flash('error', 'password error');
      return res.redirect('/login');
    }
    //登录成功之后保存到session
    req.session.user = user;
    req.flash('success', 'login successfully');
    res.redirect('/');

  });
});

router.get('/post', checkLogin);

router.get('/post', function(req, res, next) {
  res.render('post',{ title: "发表"});
});

router.post('/post', checkLogin);

router.post('/post', function(req, res, next) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name,
    req.body.title,
    req.body.post
  );
  post.save(function(err){
    if(err){
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', "发布成功！");
    res.redirect('/');
  });
});

router.get('/logout', checkLogin);

router.get('/loginOut', function(req, res, next) {
  req.session.user = null;
  req.flash('success', 'login out successfully');
  res.redirect('/');
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!');
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');//返回之前的页面
  }
  next();
}

module.exports = router;


// //JS中函数都是可以当做一个对象
// module.exports = function(app) {
//   app.get('/',function(req, res) {
//     res.render('index',{ title: 'Express' });
//   })
// };
