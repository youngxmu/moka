var express = require('express');
var config = require("../config");
var logger = require("../lib/log.js").logger("indexRouter");
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");


var articleModel = require('../models/articleModel.js');
var infoModel = require('../models/infoModel.js');
var paperModel = require('../models/paperModel.js');
var newsModel = require('../models/newsModel.js');

var router = express.Router();

router.get('', function (req, res, next) {
    var menuMap = menuUtils.getMenuMap();
    var menuList = [
        {
            id : 11,
            name : '教育资源',
            url : 'resource/list'
        },
        {
            id : 12,
            name : '教育测评',
            url : 'paper/list'
        },
        {
            id : 13,
            name : '理论教学',
            url : 'jsll/list'
        },
        {
            id : 14,
            name : '技能教学',
            url : 'jsjn/list'
        },
        {
            id : 15,
            name : '理论试题',
            url : 'exam/list'
        },
        {
            id : 16,
            name : '后备力量',
            url : 'store/list'
        }
    ];

    // for(var mid in menuMap){
    // 	var menu = menuMap[mid];
    // 	if(menu.mlevel == 1){
    // 		menuList.push(menu);
    // 	}
    // }
    var islogin = false;
    if(req.session.user && req.session.user){
        islogin = true;
    }
    res.render('index', {
        islogin : islogin,
    	menuList : menuList
    });
});


router.post('/news', function (req, res, next) {
    newsModel.queryNewsList(function(err, results){
        if(err){
            return res.json({
                success : false
            });
        }else{
            return res.json({
                success : true,
                list : results
            });
        }
    });
});

//国防教育
router.post('/gfjy', function (req, res, next) {
    var mid = 11;
    var pageNo = 1;
    var pageSize = 5;
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(menu){
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }else{
        mid = '';
    }
    articleModel.getArticleByMenu(mid, 0, 5, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            for (var i in result) {
                var date = new Date(result[i].create_time);
                result[i].create_time = commonUtils.formatDate(date);
            }
            res.json({
                success: true,
                msg: "查找文章成功",
                data: {
                    list: result
                }
            });
        }
    });
});

//
router.post('/jsll', function (req, res, next) {
    var mid = 14;
    var pageNo = 1;
    var pageSize = 5;
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(menu){
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }else{
        mid = '';
    }
    articleModel.getArticleByMenu(mid, 0, 5, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            for (var i in result) {
                var date = new Date(result[i].create_time);
                result[i].create_time = commonUtils.formatDate(date);
            }
            res.json({
                success: true,
                msg: "查找文章成功",
                data: {
                    list: result
                }
            });
        }
    });
});

//
router.post('/jsjn', function (req, res, next) {
    infoModel.queryIndexInfos(function (err, result) {
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

//
router.post('/llks', function (req, res, next) {
    var name = '';
    var pageNo = 1;
    var pageSize = 5;

    paperModel.queryPaperTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        paperModel.queryPapers(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找试卷出错", err);
                res.json({
                    success: false,
                    msg: "查找试卷出错"
                });
            } else {
                res.json({
                    success: true,
                    msg: "查找试卷成功",
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

