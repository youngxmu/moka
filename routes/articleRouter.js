var express = require('express');
var articleModel = require('../models/articleModel.js');
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("articleRouter");
var config = require("../config");
var router = express.Router();


router.get('list', function(req, res, next) {
    var id = req.params.id;
    res.render('article/list');
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    articleModel.getArticleTotalCount(status, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryModelList(isVirtual, createFrom, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].im_passwd;
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
                    data: {
                        totalCount: totalCount,
                        totalPage: totalPage,
                        currentPage: pageNo,
                        list: result
                    }
                });
            }
        });
    });
});


//根据文章id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询文章出错"
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = true;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                res.render('article/detail', article);
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
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, function (err, data) {
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
        articleModel.updateArticle(id, title, author, content, -1, function (err, result) {
            console.log(err);
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

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    var isAdmin = true;
    if(!isAdmin){
        res.render('error', {
            success: false,
            msg: "没有权限"
        });
        return;
    }
    if(id == null || id == undefined){
        console.log(id);
        res.render('article/edit');
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = true;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                res.render('article/edit', article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询文章出错"
                });
            }
        });
    }
});

router.get('/edit', function(req, res, next) {
    res.render('article/edit');
});


//根据文章姓名模糊查询
router.post('/queryArticleByTitle', function (req, res, next) {
    var title = req.body.title;
    articleModel.queryArticleByTitle(title, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
                result[i].create_time = new Date(result[i].create_time).getTime();
            }
            res.json({
                success: true,
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "根据标题查询文章出错"
            });
        }
    })
});


module.exports = router;

