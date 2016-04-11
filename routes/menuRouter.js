//管理模块
var express = require('express');
var config = require("../config");
var menuModel = require('../models/menuModel.js');
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("menuModel");
var router = express.Router();

router.post('/tree', function(req, res, next) {
	menuModel.queryAllMenu(function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("", err);
            res.json({
                success: false,
                msg: ""
            });
        } else {
            res.json({
                success: true,
                msg: "",
                data: {
                    list: result
                }
            });
        }
    });
});

//查找未发送的系统福利
router.post('/del', function(req, res, next) {
    var adminId = req.session.id;
    var modelId = req.body.modelId;
    var albumId = req.body.albumId;
    
    logger.info("删除模特写真:admin-id-->", adminId, modelId, albumId);
    // albumModel.delModelAlbum(modelId, albumId, function (err, result) {
    //     logger.error(arguments);
    //     if (err) {
    //         logger.error("删除模特写真出错", err);
    //         res.json({
    //             success: false,
    //             msg: "删除模特写真出错"
    //         });
    //     } else {
    //         res.json({
    //             success: true,
    //             msg: "删除模特写真成功"
    //         });
    //     }
    // });
});

module.exports = router;	

