var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var authRouter = require('./routes/authRouter.js');
var uploadRouter = require('./routes/uploadRouter.js');
var articleRouter = require('./routes/articleRouter.js');
var resourceRouter = require('./routes/resourceRouter.js');
var menuRouter = require('./routes/menuRouter.js');

var indexRouter = require('./routes/indexRouter.js');

module.exports = function (app) {
	app.use('/index', indexRouter);//登录
    app.use('/auth', authRouter);//登录
    app.use('/article', articleRouter);//通用文件上传
    app.use('/resource', resourceRouter);//通用文件上传
    app.use('/menu', menuRouter);//通用文件上传
    
    app.use('/upload', uploadRouter);//通用文件上传
    app.get("/", function (req, res, next) {
        res.redirect("/index")
    });

};
