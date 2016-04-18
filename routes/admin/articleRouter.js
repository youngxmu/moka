var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var logger = require("../../lib/log.js").logger("articleRouter");

var articleModel = require('../../models/articleModel.js');

var router = express.Router();


//根据文章id查询
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
                res.render('admin/article/detail', article);
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
    var fileName = '';//明文
    var type = 1;//resource
    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    console.log(req.session.user);

    console.log();

    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, mid, user.id, fileName, type, function (err, data) {
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
        articleModel.updateArticle(id, title, author, content, -1, mid,  user.id, fileName, type, function (err, result) {
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
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

    var menuList = [];
    if(menuPath != null && menuPath != ''){
        var menuMap = menuUtils.getMenuMap();
        var menuArr = menuPath.split(',');
        var lastIndex = menuArr.length - 1;
        console.log(menuArr);
        for(var i=lastIndex;i>=0;i--){
            var menu = menuMap[menuArr[i]];
            menuList.push(menu);
        }
    }
    if(id == null || id == undefined){
        res.render('admin/article/edit', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.menuList = menuList;
                res.render('admin/article/edit', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询文章出错"
                });
            }
        });
    }
});

router.get('/uneval', function(req, res, next) {
    var id = req.params.id;
    res.render('admin/article/uneval');
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/uneval', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(!menu){
        mid = null;
    }else{
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }
    
    var status = 0;
    articleModel.queryArticleTotalCount(status, mid, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryArticles(status, mid, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time));
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

module.exports = router;

