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


var renderData = {
    title : '学术成果',
    link : 'index/science/list',
};

var dict = {
    1 : '课题',
    2 : '专著',
    3 : '论文',
    4 : '教材',
    5 : '研究报告'
}
router.get('/list', function (req, res, next) {
    res.render('index/science-list');
});

router.get('/list/:moduleId', function (req, res, next) {
    var moduleId = req.params.moduleId;
    var title = dict[moduleId];
    var data = renderData;
    data.mid = moduleId;
    data.subtitle = title;
    res.render('index/science-list', data);
});
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var moduleId = req.body.moduleId;
    var title = dict[moduleId];
    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    if(!title || title == 'undefined'){
        title = '';
    }

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

