var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var articleModel = require("../../models/articleModel.js");
var infoModel = require("../../models/jsjnModel.js");
var router = express.Router();


router.get('', function (req, res, next) {
    res.render('user/jsjn/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/jsjn/index');
});


router.get('/list', function (req, res, next) {
    res.render('user/jsjn/list');
});

router.get('/res', function (req, res, next) {
    res.render('user/jsjn/res');
});



router.post('/list', function (req, res, next) {
    infoModel.queryInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
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

router.get('/detail/:id', function (req, res, next) {
	var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询文章出错"
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.file_name = config.imgHost + '/uploads/' + article.file_name;
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'user/jsjn/detail';
                if(article.file_type == 'pic'){
                    view = 'user/jsjn/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'user/jsjn/detail-video';
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


module.exports = router;

