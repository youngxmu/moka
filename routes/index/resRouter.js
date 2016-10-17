var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var sysUtils = require("../../lib/sysUtils.js");
var articleModel = require('../../models/articleModel.js');
var infoModel = require('../../models/infoModel.js');
var paperModel = require('../../models/paperModel.js');
var newsModel = require('../../models/newsModel.js');
var indexModel = require('../../models/indexModel.js');
var menuModel = require('../../models/menuModel.js');
var resourceModel = require('../../models/resourceModel.js');
var messageModel = require('../../models/messageModel.js');
var router = express.Router();

router.get('/list/:moduleId', function (req, res, next) {
    var moduleId = req.params.moduleId;
    res.render('index/res-list');
});

router.post('/up', function (req, res, next) {
    var moduleId = req.body.moduleId;
    indexModel.getUp(moduleId, function (err, result) {
        console.log(mid);
        console.log(result);
        if (err || !result || result.length == 0) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var ids = result[0].aid;
            console.log(ids);
            indexModel.queryUpByIds(ids, function (err, result) {
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
        }
    });
});

router.post('/list', function (req, res, next) {
    var mid = req.body.mid;
    menuModel.queryMenuById(mid, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var pageNo = parseInt(req.body.pageNo);
            var pageSize = parseInt(req.body.pageSize);
            var type = req.body.type;
            if(!type || type == 'undefined'){
                type = '';
            }
            var title = result[0].keyword;
            if(!title || title == 'undefined'){
                title = '';
            }
            resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
                logger.info("文章总数:", totalCount);
                var totalPage = 0;
                if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
                else totalPage = totalCount / pageSize + 1;
                totalPage = parseInt(totalPage, 10);
                var start = pageSize * (pageNo - 1);

                resourceModel.queryResourceByTitle(title, type, start, pageSize, function (err, result) {
                    if (err || !result || !commonUtils.isArray(result)) {
                        logger.error("查找文章出错", err);
                        res.json({
                            success: false,
                            msg: "查找文章出错"
                        });
                    } else {
                        for (var i in result) {
                            // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                            var date = new Date(result[i].create_time);
                            result[i].create_time = commonUtils.formatDate(date);
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
        }
    });
});

router.post('/short', function (req, res, next) {
    var moduleId = req.body.moduleId;
    var moduleMap = sysUtils.getModuleMap();
    var title = moduleMap[moduleId];

    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    if(!title || title == 'undefined'){
        title = '';
    }

    var pageNo = 1;
    var pageSize = 7;
    resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        resourceModel.queryResourceByTitle(title, type, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                    var date = new Date(result[i].create_time);
                    result[i].create_time = commonUtils.formatDate(date);
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