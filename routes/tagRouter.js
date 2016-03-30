var express = require('express');
var async = require("async");
var tagModel = require('../models/tagModel.js');
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("tagRouter");
var config = require("../config");
var router = express.Router();

//获取所有tag
router.post('/queryTags', function (req, res, next) {
    tagModel.getTags(function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                msg: "查询所有标签成功",
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "查询所有标签失败"
            });
        }
    });
});

//获取模特被打上的所有tag
router.post('/queryTagsOfModel', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var modelId = req.body.modelId;
    logger.info("查询模特标签, adminId:", adminId, " modelId:", modelId);

    tagModel.getTagsOfModel(modelId, function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                msg: "查询模特标签成功",
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "查询模特标签失败"
            });
        }
    });
});


//更新模特tag
router.post('/updateTagsOfModel', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var modelId = req.body.modelId;
    var tagIds = req.body.tagIds;

    if (!modelId) {
        return res.json({
            success: false,
            msg: "更新模特标签时参数错误"
        });
    }

    if (!tagIds) {

        tagModel.deleteTagsOfModel(modelId, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除模特标签成功"
                });
            }else{
                 res.json({
                    success: false,
                    msg: "删除模特标签时参数错误"
                });
            }
        });

        return;
    }

    logger.info("更新模特标签, adminId:", adminId, " modelId:", modelId, " 新标签IDs:", tagIds);

    tagModel.deleteTagsOfModel(modelId, function (err, result) {
        if (!err) {
            async.each(tagIds, function (tagId, callback) {
                logger.info("插入tag, modelId:", modelId, "tagId:", tagId);
                tagModel.insertTagOfModel(modelId, tagId, function (err, result) {
                    callback(err);
                });
            }, function (err) {
                if (err) {//任何一个err都会停止执行其他
                    res.json({
                        success: false,
                        msg: "更新模特标签失败"
                    });
                } else {
                    res.json({
                        success: true,
                        msg: "更新模特标签成功"
                    });
                }
            });
        }
    });
});

//增加标签
router.post('/addTag', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var name = req.body.name;
    var desc = req.body.desc;
    if (!desc) {
        desc = '';
    }
    if (!name) {
        return res.json({
            success: false,
            msg: "参数错误"
        });
    }

    logger.info("添加标签, name:", name);

    tagModel.insertTag(name, desc, function (err, result) {
       if (err) {
            res.json({
                success: false,
                msg: "添加模特标签失败"
            });
        } else {
            res.json({
                success: true,
                msg: "添加模特标签成功"
            });
        }
    });
});

//增加标签
router.post('/updateTag', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var tagId = req.body.tagId;
    var name = req.body.name;
    var desc = req.body.desc;

    if (!name || !desc) {
        return res.json({
            success: false,
            msg: "参数错误"
        });
    }

    logger.info("添加标签, name:", name);

    tagModel.updateTag(tagId, name, desc, function (err, result) {
       if (err) {
            res.json({
                success: false,
                msg: "添加模特标签失败"
            });
        } else {
            res.json({
                success: true,
                msg: "添加模特标签成功"
            });
        }
    });
});


//更新模特tag
router.post('/removeTagOfModel', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var modelId = req.body.modelId;
    var tagId = req.body.tagId;

    if (!modelId || !tagId) {
        return res.json({
            success: false,
            msg: "删除模特标签时参数错误"
        });
    }

    logger.info("删除模特标签, adminId:", adminId, " modelId:", modelId, " 标签ID:", tagId);

    tagModel.deleteTagOfModel(modelId, tagId, function (err, result) {
        if (!err) {
            res.json({
                success: true,
                msg: "删除模特标签成功"
            });
        }else{
             res.json({
                success: false,
                msg: "删除模特标签时参数错误"
            });
        }
    });
});

//更新模特tag
router.post('/addTagOfModel', function (req, res, next) {
    var adminId = (req.session && req.session.admin) ? req.session.admin.id : 0;
    var modelId = req.body.modelId;
    var tagId = req.body.tagId;

    if (!modelId || !tagId) {
        return res.json({
            success: false,
            msg: "添加模特标签时参数错误"
        });
    }

    logger.info("添加模特标签, adminId:", adminId, " modelId:", modelId, " 标签ID:", tagId);

    tagModel.insertTagOfModel(modelId, tagId, function (err, result) {
        if (!err) {
            res.json({
                success: true,
                msg: "添加模特标签成功"
            });
        }else{
             res.json({
                success: false,
                msg: "添加模特标签时参数错误"
            });
        }
    });
});



module.exports = router;
