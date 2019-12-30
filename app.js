const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');// session
const MongoStore = require('connect-mongo')(session);// session store instance
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const indexRouter = require('./routes/index');
const siteRouter = require('./routes/sites');
require('dotenv').config();
const app = express();
app.locals.projectName = 'Express项目练习';// 全局环境变量
app.locals.mixVar = 'node.express.jack';
// 引入mongodb数据库驱动
const MongoClient = require('mongodb').MongoClient;
//连接mongodb
const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds046027.mlab.com:46027/${process.env.DB_NAME}`, {useUnifiedTopology: true});
client.connect(function() {//  连接之后在进行下一步的app实例复制操作，防止出现没连上数据库数据赋值不到的问题
  app.mgClient = client;//  把数据库对象赋值给全局变量，方便进行数据库操作
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  // session setting 
  app.use(session({
    secret: app.locals.mixVar,// 防止cookie被篡改
    resave: true, //  强制更新session
    saveUninitialized: true, // 强制创建一个session, 即使用户未登录
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000//  过期时间毫秒
    },
    store: new MongoStore({
      url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds046027.mlab.com:46027/${process.env.DB_NAME}`
    })
  }));
  app.use('/', indexRouter);
  app.use('/sites', siteRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});
module.exports = app;
