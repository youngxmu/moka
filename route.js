var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var authRouter = require('./routes/authRouter.js');
var uploadRouter = require('./routes/uploadRouter.js');
var articleRouter = require('./routes/articleRouter.js');
var resourceRouter = require('./routes/user/resourceRouter.js');
var registerRouter = require('./routes/registerRouter.js');

var menuRouter = require('./routes/menuRouter.js');
var indexRouter = require('./routes/indexRouter.js');


/** user */
var userPaperRouter = require('./routes/user/paperRouter.js');
var userPaperHistoryRouter = require('./routes/user/paperHistoryRouter.js');

var userVoteRouter = require('./routes/user/voteRouter.js');

var userIndexRouter = require('./routes/user/indexRouter.js');
var userExpertRouter = require('./routes/user/expertRouter.js');
var userJSLLSupportRouter = require('./routes/user/jsllSupportRouter.js');
var userJSJNSupportRouter = require('./routes/user/jsjnSupportRouter.js');
var userHBLLSupportRouter = require('./routes/user/hbllRouter.js');


/**admin*/
var adminIndexRouter = require('./routes/admin/indexRouter.js');
var adminArticleRouter = require('./routes/admin/articleRouter.js');
var adminCheckRouter = require('./routes/admin/checkRouter.js');
var adminQuestionRouter = require('./routes/admin/questionRouter.js');
var adminPaperRouter = require('./routes/admin/paperRouter.js');
var adminUserRouter = require('./routes/admin/userRouter.js');
var adminExpertRouter = require('./routes/admin/expertRouter.js');

var adminVoteRouter = require('./routes/admin/voteRouter.js');

var adminJSLLRouter = require('./routes/admin/jsllRouter.js');
var adminJSJNRouter = require('./routes/admin/jsjnRouter.js');
var adminHBLLRouter = require('./routes/admin/hbllRouter.js');



module.exports = function (app) {
    app.use('/auth', authRouter);//登录
    app.use('/index', indexRouter);//主页

    app.use('/article', articleRouter);//通用文件上传
    app.use('/resource', resourceRouter);//通用文件上传
    app.use('/user', registerRouter);//通用文件上传
    app.use('/menu', menuRouter);//通用文件上传
    app.use('/expert', userExpertRouter);//通用文件上传
    
    app.use('/paper', userPaperRouter);//主页
    app.use('/paperhistory', userPaperHistoryRouter);//主页
    
    app.use('/jsll', userJSLLSupportRouter);//主页
    app.use('/jsjn', userJSJNSupportRouter);//主页
    app.use('/vote', userVoteRouter);//主页
    app.use('/hbll', userHBLLSupportRouter);//主页


    app.use('/admin', adminIndexRouter);//主页
    app.use('/admin/article', adminArticleRouter);//主页
    app.use('/admin/check', adminCheckRouter);//主页
    app.use('/admin/user', adminUserRouter);//主页
    app.use('/admin/question', adminQuestionRouter);//主页
    app.use('/admin/paper', adminPaperRouter);//主页
    app.use('/admin/expert', adminExpertRouter);//主页
    app.use('/admin/vote', adminVoteRouter);//主页

    app.use('/admin/jsll', adminJSLLRouter);//主页
    app.use('/admin/jsjn', adminJSJNRouter);//主页
    app.use('/admin/hbll', adminHBLLRouter);//主页
    

    app.use('/upload', uploadRouter);//通用文件上传
    app.get("/", function (req, res, next) {
        res.redirect("/index")
    });

};
