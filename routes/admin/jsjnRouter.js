var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("jsjnRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var articleModel = require("../../models/articleModel.js");
var router = express.Router();

router.get('/list', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/jsjn/list',{
        keyword : keyword
    });
});

router.get('/upload', function (req, res, next) {
    res.render('admin/jsjn/upload');
});

router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + '/uploads/' + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/jsjn/detail';
                if(article.file_type == 'pic'){
                    view = 'admin/jsjn/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'admin/jsjn/detail-video';
                }
                res.render(view, article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


//创建文章
router.post('/save', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    var fileName = req.body.fileName;//明文
    var description = req.body.description;//明文
    var type = commonUtils.getFileType(fileName);
    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, 1, mid, user.id, fileName, type, description,function (err, data) {
            if (!err && data) {
                var res_id = data.insertId;
                var sys_type = 'article';
                content_type = type;
                articleModel.insertResource(res_id,sys_type,title,content_type, function(err){
                    if(err){
                        return res.json({
                            success: false,
                            msg: "创建失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "创建成功",
                        data : data
                    });
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        logger.info("管理员修改文章信息", id);
        articleModel.updateArticle(id, title, author, content, 1, mid,  user.id, fileName, type,description, function (err, result) {
            if (!err) {
                var res_id = id;
                var sys_type = 'article';
                content_type = type;
                articleModel.updateResource(res_id,sys_type,title,content_type, function(err){
                    if(err){
                        return res.json({
                            success: false,
                            msg: "修改文章失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "修改文章成功"
                    });
                });
            } else {
                logger.error("修改文章个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改文章个人信息失败"
                });
            }
        });
    }
    
});

module.exports = router;

