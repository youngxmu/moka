var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var articleModel = require("../../models/articleModel.js");
var router = express.Router();

router.get('/list', function (req, res, next) {
    res.render('user/jsll/list');
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
                article.file_name = config.imgHost + '/' + article.file_name;
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                res.render('user/jsll/detail', article);
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

