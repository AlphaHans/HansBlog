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

router.get('/reg', function(req, res, next) {
  res.render('reg',{ title: "注册"});
});

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
      res.redirect('/');//注册成功后返回主页
    });
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{ title: "登录"});
});

router.post('/login', function(req, res, next) {
  //TODO
});

router.get('/post', function(req, res, next) {
  res.render('post',{ title: "发表"});
});

router.post('/post', function(req, res, next) {
  //TODO
});

router.get('/loginOut', function(req, res, next) {
  //TODO
});

module.exports = router;


// //JS中函数都是可以当做一个对象
// module.exports = function(app) {
//   app.get('/',function(req, res) {
//     res.render('index',{ title: 'Express' });
//   })
// };
