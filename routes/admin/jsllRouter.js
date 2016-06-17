var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("jsllRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var infoModel = require("../../models/infoModel.js");
var articleModel = require("../../models/articleModel.js");
var router = express.Router();

router.get('/list', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/jsll/list',{
        keyword : keyword
    });
});

router.get('/list2', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/jsll/list2',{
        keyword : keyword
    });
});

router.get('/list3', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/jsll/list3',{
        keyword : keyword
    });
});



router.post('/resource/list', function (req, res, next) {
    infoModel.queryInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: false,
                data: {
                    list : result
                }
            });
        } else {


            res.json({
                success: false,
                msg: "根据id查询文章出错"
            });
        }
    });
});


router.get('/upload', function (req, res, next) {
    res.render('admin/jsll/upload');
});

router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询文章出错"
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.file_name = config.imgHost + '/uploads/' + article.file_name;
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/jsll/detail';
                if(article.file_type == 'pic'){
                    view = 'admin/jsll/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'admin/jsll/detail-video';
                }
                res.render(view, article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询文章出错"
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
    var type = 2;//resource
    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, '', mid, user.id, fileName, type, description,function (err, data) {
            if (!err) {
                console.log(data);
                res.json({
                    success: true,
                    msg: "创建成功",
                    data : data
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
        articleModel.updateArticle(id, title, author, '', -1, mid,  user.id, fileName, type,description, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改文章信息成功"
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

router.get('/info/:id', function (req, res, next) {
    var id = req.params.id;
    infoModel.queryInfoById(id, function (err, result) {
        if (err || result.length == 0) {
            res.json({
                success: false,
                msg: "根据id查询文章出错"
            });
        } else {
           res.json({
                success: true,
                data: result[0]
            });
        }
    });
});


router.post('/addinfo', function(req, res, next) {
    var name = req.body.name;
    var content = req.body.content;
    var parent_id = req.body.parent_id;
    var mlevel = req.body.mlevel;
    
    
    logger.info("增加:admin-id-->", name, mlevel, parent_id);
    infoModel.addInfo(name, content, parent_id, mlevel, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "添加失败"
            });
        } else {
            res.json({
                success: true,
                msg: "添加成功",
                data : result
            });
        }
    });
});

router.post('/updateinfo', function(req, res, next) {
    var name = req.body.name;
    var id = req.body.id;
    
    infoModel.updateInfo(id, name, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "添加失败"
            });
        } else {
            res.json({
                success: true,
                msg: "添加成功"
            });
        }
    });
});

router.post('/delinfo', function(req, res, next) {
    var id = req.body.id;
    
    infoModel.delInfo(id, function (err, result) {
        if (err) {
            logger.error("删除出错", err);
            res.json({
                success: false,
                msg: "删除出错"
            });
        } else {
            res.json({
                success: true,
                msg: "删除成功"
            });
        }
    });
});

module.exports = router;

