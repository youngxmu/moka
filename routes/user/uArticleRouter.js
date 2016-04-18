var express = require('express');
var articleModel = require('../models/articleModel.js');
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");
var logger = require("../lib/log.js").logger("articleRouter");
var config = require("../config");
var router = express.Router();


router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
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
        res.render('article/edit', {menuList: menuList});
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

//创建文章
router.post('/save', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, mid, function (err, data) {
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
        articleModel.updateArticle(id, title, author, content, -1, mid,  function (err, result) {
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


module.exports = router;

