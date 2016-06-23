var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var resourceModel = require("../../models/resourceModel.js");
var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/resource/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/resource/index');
});

router.get('/list', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('user/resource/list',{
        keyword : keyword
    });
});

router.get('/detail/:id', function (req, res, next) {
	var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询文章出错"
        });
    }else{
        resourceModel.getResourceById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.file_name = config.imgHost + '/uploads/' + article.file_name;
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'user/resource/detail';
                if(article.file_type == 'pic'){
                    view = 'user/resource/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'user/resource/detail-video';
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

