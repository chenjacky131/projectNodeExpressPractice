const express = require('express');
const router = express.Router();
const md5 = require('md5'); //  MD5加密
const Collection = require('../lib/collection');// 获取mongo数据库的表实例
const svgCaptcha = require('svg-captcha'); // 验证码插件
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: `${req.app.locals.projectName}(首页)`, user: req.session.user});
});
/* 注册页get */
router.get('/register', function(req, res, next) {
  res.render('register', { title: `${req.app.locals.projectName}(注册页)`});
});
/* 注册页post */
router.post('/register', function(req, res, next) {
  if(req.body.captcha !== req.session.captcha){
    res.send('验证码错误');
  }else{
    Collection.Connect(req, 'user').then(function(coll){		
      coll.findOne({username: req.body.username}, function(err, user) {
        if(user){
          res.send('用户名已存在');
        }else{
          coll.insertOne({username: req.body.username, password: md5(req.app.locals.passwordFix + req.body.password)});// 插入一条数据
          res.send('注册成功！');
        }
      });		
    });
  }
});
/* 获取验证码 */
router.get('/getCaptcha', function(req, res, next) {
  const captcha = svgCaptcha.createMathExpr({// 生成数学公式验证码 create:生成普通验证码
    inverse: false,
    fontSize: 36,
    noise: 2,
    width: 80,
    height: 30,
    background: '#f3fbfe'
  });
  req.session.captcha = captcha.text.toLowerCase();
  res.setHeader('Content-Type', 'image/svg+xml');
  res.write(String(captcha.data));
  res.end();  
});
/* 登录页get */
router.get('/login', function(req, res, next) {
  if(req.session.user){
    res.redirect('/');
  }
  res.render('login', { title: `${req.app.locals.projectName}(登录页)`, session: req.session});    
});
/* 登录页post */
router.post('/login', function(req, res, next) {
  console.log(req.session.captcha)
  if(req.body.captcha !== req.session.captcha){
    res.send('验证码错误');
  }else{
    Collection.Connect(req, 'user').then(function(coll){		
      coll.findOne({username: req.body.username}, function(err, user) {        
        if(md5(req.app.locals.passwordFix + req.body.password) !== user.password){
          res.send('密码错误');
        }else{
          req.session.user = user
          res.send('登录成功');
        }
      });		
    });
  }
});
/* 登出 */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.captcha = null;
  res.redirect('/');
});
module.exports = router;
