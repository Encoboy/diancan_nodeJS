//请求express框架
var express = require('express');
var path = require('path');//解析路径的模块
var favicon = require('serve-favicon');//网站图标
var logger = require('morgan');//debug模块
var cookieParser = require('cookie-parser');//解析cookie
var session = require('express-session');//session模块 服务端存储数据用的模块
var bodyParser = require('body-parser');//解析请求的模块
var config = require('./config/config');


//将路由设置函数请求进来,这些事测试用的
var index = require('./routes/index');
var users = require('./routes/users');
var shop = require('./routes/shop.js');
var postPage = require('./routes/post.js');
var upload = require('./routes/upload.js');
var cookiePage = require('./routes/cookie.js');
var mysqlPage = require('./routes/mysql.js');


//项目页面
// 这就是elm传给接口的js
var admin = require('./routes/admin.js');

// 博客接口
var blogs = require('./routes/blogs.js');

// 师博客接口
var blog = require('./routes/fontblog.js');

var elm = require('./routes/elm.js');
//初始化express框架。
var app = express();

// 跨域的处理，响应允许所有的请求
app.all('*', function(req, res, next) {
    // 设置Access-Control-Allow-Origin 为 *；就是允许任何域名跨域访问。
    res.header("Access-Control-Allow-Origin", "*");
    // 请求设置的内容类型，内容长度，授权，接受
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // 设置的请求方式
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});


//第二种更改ejs的方式，模板使用的后缀名是html
// 路径是在views的文件夹下，静态目录
// 这里设置了ejs的静态目录为views；所以，ejs的模板引擎都放在views的文件夹下。
app.set('views', path.join(__dirname, 'views'));
// 这里设置了ejs模板的后缀名为.html
app.engine('.html', require('ejs').__express);  
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//使得传进来的 req的req.cookies属性有解析好的cookie
app.use(cookieParser());



//设置静态服务器
//如果设置多个静态资源目录，那么依照层级进行查找相关内容
app.use(express.static(path.join(__dirname, 'public')));
//可以设置一个虚拟的路径来挂载我们静态文件
app.use('/static',express.static('publicImg'));


//设置session
app.use(session({
    secret: '0717app', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000} // 过期时间（毫秒）
}));
app.get('/session', function (req, res){
	console.log(req.cookies);
    if (req.session.sign) {//检查用户是否已经登录
        console.log(req.session);//打印session的值
        // 这里设置了用户登录的次数
        req.session.count++;
        // req.send响应报文的正文内容，浏览器会按照html正常解析渲染到页面上。
        res.send('welecome <strong>' + req.session.name + '</strong>, 欢迎你第'+req.session.count+'次登录');
    } else {
      // 这里表示用户第一次登录的情况 session 服务端的存储 cookie是客户端的。
        req.session.sign = true;
        req.session.name = 'cpeng';
        req.session.count = 1;
        res.send('欢迎登陆！');
    }
});




// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


// 挂载至 /shop 的中间件
app.use('/shop', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/shop/:id', function (req, res, next) {
  console.log('带有变量ID:', req.params.id);
  next();
});




//app.use('/static',express.static(path.join(__dirname, 'public')));

//使用我们设置的路由中间件，第一个参数是路由模块的根路径
app.use('/index', index);
// '/',默认的路径，主页面
app.use('/', users);
app.use('/shop',shop)
app.use('/post',postPage)
app.use('/upload',upload)
app.use('/cookie',cookiePage);
app.use('/mysql',mysqlPage);

// elm的中间件
app.use('/admin',admin);

app.use('/blogs',blogs);

// 前端模块
app.use('/blog',blog);
app.use('/elm',elm);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
