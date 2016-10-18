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

router.get('', function (req, res, next) {
    res.render('index/index');
});

/** 获取新闻 */
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

/**  **/
router.post('/msgs', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    messageModel.queryMessageTotalCount(function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        messageModel.queryMessageList(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].passwd;
                    delete result[i].im_passwd;
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找成功",
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


//根据id查询
router.get('/msg/:id', function (req, res, next) {
    var id = req.params.id;
    messageModel.getMessageById(id, function (err, msg) {
        if (!err) {
            msg.create_time = new Date(msg.create_time).getTime();
            msg.title = '国防教育信息';
            msg.link = 'index';
            res.render('index/msg', msg);
        } else {
            res.render('error');
        }
    })
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list/up', function (req, res, next) {
    var mid = req.body.mid;
    var map = {
        '1003'   : '英模人物',
        '100401' : '历史',
        '100402' : '法规',
        '100403' : '外国',
        '100404' : '武器 装备',
        '100405' : '形势',
        '100406' : '历史'
    }
    indexModel.getUp(mid, function (err, result) {
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

router.post('/list/res', function (req, res, next) {
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

// router.post('/res/list', function (req, res, next) {
//     var pageNo = parseInt(req.body.pageNo);
//     var pageSize = parseInt(req.body.pageSize);
//     var moduleId = req.body.moduleId;
//     var moduleMap = sysUtils.getModuleMap();
//     var title = moduleMap[moduleId];

//     var type = req.body.type;
//     if(!type || type == 'undefined'){
//         type = '';
//     }
//     if(!title || title == 'undefined'){
//         title = '';
//     }
//     resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
//         var totalPage = 0;
//         if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
//         else totalPage = totalCount / pageSize + 1;
//         totalPage = parseInt(totalPage, 10);
//         var start = pageSize * (pageNo - 1);
//         resourceModel.queryResourceByTitle(title, type, start, pageSize, function (err, result) {
//             if (err || !result || !commonUtils.isArray(result)) {
//                 logger.error("查找文章出错", err);
//                 res.json({
//                     success: false,
//                     msg: "查找文章出错"
//                 });
//             } else {
//                 for (var i in result) {
//                     // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
//                     var date = new Date(result[i].create_time);
//                     result[i].create_time = commonUtils.formatDate(date);
//                 }
//                 res.json({
//                     success: true,
//                     msg: "查找文章成功",
//                     data: {
//                         totalCount: totalCount,
//                         totalPage: totalPage,
//                         currentPage: pageNo,
//                         list: result
//                     }
//                 });
//             }
//         });
//     });
// });

module.exports = router;

