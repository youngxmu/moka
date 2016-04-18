var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var authRouter = require('./routes/authRouter.js');
var uploadRouter = require('./routes/uploadRouter.js');
var articleRouter = require('./routes/articleRouter.js');
var resourceRouter = require('./routes/user/resourceRouter.js');
var registerRouter = require('./routes/registerRouter.js');


var adminArticleRouter = require('./routes/admin/articleRouter.js');
var checkRouter = require('./routes/admin/checkRouter.js');


var menuRouter = require('./routes/menuRouter.js');
var indexRouter = require('./routes/indexRouter.js');

module.exports = function (app) {
	
    app.use('/auth', authRouter);//登录
    app.use('/index', indexRouter);//主页
    app.use('/article', articleRouter);//通用文件上传
    app.use('/resource', resourceRouter);//通用文件上传
    app.use('/user', registerRouter);//通用文件上传
    app.use('/menu', menuRouter);//通用文件上传


    app.use('/admin/article', adminArticleRouter);//主页
    app.use('/admin/check', checkRouter);//主页
    
    app.use('/upload', uploadRouter);//通用文件上传
    app.get("/", function (req, res, next) {
        res.redirect("/index")
    });

};
