//管理模块
var express = require('express');
var config = require("../config");
var albumModel = require('../models/albumModel.js');
var commonUtils = require("../lib/utils.js");
var jpushUtils = require("../lib/jpushUtils.js");
var logger = require("../lib/log.js").logger("albumModel");
var router = express.Router();

router.get('/benifit', function(req, res, next) {
	res.render('album/benifit');
});

router.get('/benifit/import', function(req, res, next) {
    res.render('album/benifit-import');
});

//查找未发送的系统福利
router.post('/benifit', function(req, res, next) {
	var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    albumModel.querySystemBenifitCount(function (totalCount) {
        logger.info("模未发送的系统福利总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找未发送的系统福利:", start, pageSize);
        albumModel.querySystemBenifit(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找未发送的系统福利出错", err);
                res.json({
                    success: false,
                    msg: "查找未发送的系统福利出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找未发送的系统福利成功",
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

//发送系统福利
router.post('/benifit/send', function(req, res, next) {
    var benifitId = req.body.benifitId;
    var albumId = req.body.albumId;

    albumModel.sendSystemBenifit(benifitId, function (err, result) {
        if (!err) {

            //推送开始
            if(albumId){
                jpushUtils.pushAlbum(albumId);
            }else{
                logger.error("推送福利时，前端传入的albumId为空")
            }
            //推送结束

            res.json({
                success: true,
                msg: "发送系统福利成功"
            });
        } else {
            logger.error("发送系统福利发生错误", err);
            res.json({
                success: false,
                msg: "发送系统福利息失败"
            });
        }
    });
});


//查找未发送的系统福利
router.post('/queryByModelId', function(req, res, next) {
    var modelId = req.body.modelId;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    albumModel.getModelAlbumTotalCount(modelId, function (totalCount) {
        logger.info("模未发送的系统福利总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找未发送的系统福利:", start, pageSize);
        albumModel.getModelAlbumPageList(modelId, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找未发送的系统福利出错", err);
                res.json({
                    success: false,
                    msg: "查找未发送的系统福利出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找未发送的系统福利成功",
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




//查找导入的未发送模特福利
router.post('/benifit/import', function(req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    albumModel.queryImportSystemBenifitCount(function (totalCount) {
        logger.info("模未发送的系统福利总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找未发送的系统福利:", start, pageSize);
        albumModel.queryImportSystemBenifit(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找未发送的系统福利出错", err);
                res.json({
                    success: false,
                    msg: "查找未发送的系统福利出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找未发送的系统福利成功",
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

//发送系统福利
router.post('/benifit/import/send', function(req, res, next) {
    var benifitId = req.body.benifitId;
    var albumId = req.body.albumId;

    albumModel.sendImportSystemBenifit(benifitId, function (err, result) {
        if (!err) {

            //推送开始
            if(albumId){
                jpushUtils.pushAlbum(albumId);
            }else{
                logger.error("推送福利时，前端传入的albumId为空")
            }
            //推送结束

            res.json({
                success: true,
                msg: "发送系统福利成功"
            });
        } else {
            logger.error("发送系统福利发生错误", err);
            res.json({
                success: false,
                msg: "发送系统福利息失败"
            });
        }
    });
});


//查找未发送的系统福利
router.post('/import/queryByModelId', function(req, res, next) {
    var modelId = req.body.modelId;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    albumModel.getModelAlbumTotalCount(modelId, function (totalCount) {
        logger.info("模未发送的系统福利总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找未发送的系统福利:", start, pageSize);
        albumModel.getModelAlbumPageList(modelId, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找未发送的系统福利出错", err);
                res.json({
                    success: false,
                    msg: "查找未发送的系统福利出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找未发送的系统福利成功",
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

//查找未发送的系统福利
router.post('/del', function(req, res, next) {
    var adminId = req.session.id;
    var modelId = req.body.modelId;
    var albumId = req.body.albumId;
    
    logger.info("删除模特写真:admin-id-->", adminId, modelId, albumId);
    albumModel.delModelAlbum(modelId, albumId, function (err, result) {
        logger.error(arguments);
        if (err) {
            logger.error("删除模特写真出错", err);
            res.json({
                success: false,
                msg: "删除模特写真出错"
            });
        } else {
            res.json({
                success: true,
                msg: "删除模特写真成功"
            });
        }
    });
});

module.exports = router;	