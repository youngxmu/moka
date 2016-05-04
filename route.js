var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var authRouter = require('./routes/authRouter.js');
var uploadRouter = require('./routes/uploadRouter.js');
var articleRouter = require('./routes/articleRouter.js');
var resourceRouter = require('./routes/user/resourceRouter.js');
var registerRouter = require('./routes/registerRouter.js');


/**admin*/
var adminIndexRouter = require('./routes/admin/indexRouter.js');
var adminArticleRouter = require('./routes/admin/articleRouter.js');
var adminRrsourceRouter = require('./routes/admin/resourceRouter.js');
var checkRouter = require('./routes/admin/checkRouter.js');
var questionRouter = require('./routes/admin/questionRouter.js');

var adminUserRouter = require('./routes/admin/userRouter.js');


var menuRouter = require('./routes/menuRouter.js');
var indexRouter = require('./routes/indexRouter.js');

module.exports = function (app) {
	
    app.use('/auth', authRouter);//登录
    app.use('/index', indexRouter);//主页
    app.use('/article', articleRouter);//通用文件上传
    app.use('/resource', resourceRouter);//通用文件上传
    app.use('/user', registerRouter);//通用文件上传
    app.use('/menu', menuRouter);//通用文件上传

    app.use('/admin', adminIndexRouter);//主页
    app.use('/admin/article', adminArticleRouter);//主页
    app.use('/admin/resource', adminRrsourceRouter);//主页
    app.use('/admin/check', checkRouter);//主页
    app.use('/admin/user', adminUserRouter);//主页
    app.use('/admin/question', questionRouter);//主页
    
    app.use('/upload', uploadRouter);//通用文件上传
    app.get("/", function (req, res, next) {
        res.redirect("/index")
    });

};
