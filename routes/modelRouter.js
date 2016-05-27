var express = require('express');
var modelModel = require('../models/modelModel.js');
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("modelRouter");
var config = require("../config");
var router = express.Router();


router.get('/tagmanage', function(req, res, next) {
    var tagId = req.query.tagId;
    var tagName = req.query.tagName;

    res.render('customer/tag-model', {tagId: tagId, tagName: tagName});
});

//根据”创建渠道“和”是否虚拟“查询模特
router.post('/querylist', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var isVirtual = parseInt(req.body.isVirtual) || -1;//1虚拟，0非虚拟,-1全部
    var createFrom = parseInt(req.body.createFrom) || -1;//创建渠道：1后台，0前台,-1全部

    modelModel.getModelTotalCount(isVirtual, createFrom, function (totalCount) {
        logger.info("模特总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找模特:", start, pageSize);
        modelModel.queryModelList(isVirtual, createFrom, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找模特出错", err);
                res.json({
                    success: false,
                    msg: "查找模特出错"
                });
            } else {
                for (var i in result) {
                    // delete result[i].passwd;
                    delete result[i].im_passwd;
                    result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "查找模特成功",
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


//根据模特id查询
router.post('/queryModelById', function (req, res, next) {
    var modelId = parseInt(req.body.modelId);

    modelModel.queryModelById(modelId, function (err, result) {
        if (!err) {
            for (var i in result) {
                // delete result[i].passwd;
                delete result[i].im_passwd;
                result[i].create_time = new Date(result[i].create_time).getTime();
            }
            res.json({
                success: true,
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "根据id查询模特出错"
            });
        }
    })
});

//根据模特电话查询
router.post('/queryModelByTel', function (req, res, next) {
    var tel = req.body.tel;

    modelModel.queryModelByTel(tel, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
                result[i].create_time = new Date(result[i].create_time).getTime();
            }
            res.json({
                success: true,
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "根据电话查询模特出错"
            });
        }
    })
});

//根据模特姓名模糊查询
router.post('/queryModelByName', function (req, res, next) {
    var name = req.body.name;

    modelModel.queryModelByName(name, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
                result[i].create_time = new Date(result[i].create_time).getTime();
            }
            res.json({
                success: true,
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "根据电话查询模特出错"
            });
        }
    })
});

//创建模特
router.post('/create', function (req, res) {
    var tel = req.body.tel;
    var name = req.body.name;
    var password = req.body.password;//明文
    var birthday = req.body.birthday;
    var bwh = req.body.bwh;
    var cup = req.body.cup;
    var height = req.body.height;
    var jifen = req.body.jifen;//积分
    var isVirtual = req.body.isVirtual||0;//是否虚拟，1虚拟，0非虚拟
    var inviteId = 0;
    var profile = req.body.profile;//头像

    password = commonUtils.md5(password, "-weimo");//模拟生成手机端提交的密码
    password = commonUtils.md5(password);//加盐生成真实入库密码
    modelModel.insertModel(tel, name, password, birthday, bwh, cup, height, inviteId, jifen, isVirtual, profile, function (err, data) {
        if (!err) {
            res.json({
                success: true,
                msg: "创建成功"
            });
        } else {
            res.json({
                success: false,
                msg: "创建失败"
            });
        }
    });
});



//编辑修改模特信息
router.post('/modify', function (req, res) {
    var modelId = req.body.id;
    var tel = req.body.tel;
    var name = req.body.name;//名字
    var password = req.body.password;
    var birthday = req.body.birthday;//生日
    var bwh = req.body.bwh;//三围
    var cup = req.body.cup;//罩杯
    var height = req.body.height;//身高
    var jifen = req.body.jifen;//积分
    var profile = req.body.profile;//头像

    if (!profile) {
        return res.json({
            success: false,
            errorCode: 0,
            msg: "必须上传头像"
        });
    }
    if (!tel) {
        return res.json({
            success: false,
            errorCode: 1,
            msg: "必须填写电话"
        });
    }

    logger.info("管理员修改模特个人信息", modelId, tel, name, password, birthday, bwh, cup, height, jifen, profile);


    modelModel.updateModel(modelId, tel,  name, password, birthday, bwh, cup, height,jifen, profile, function (err, result) {
        if (!err) {
            res.json({
                success: true,
                msg: "修改模特信息成功"
            });
        } else {
            logger.error("修改模特个人信息发生错误", err);
            res.json({
                success: false,
                msg: "修改模特个人信息失败"
            });
        }
    });
});

//通过标签查询模特
router.post('/modelsByTag', function (req, res) {
    var tagId = parseInt(req.body.tagId);
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = 20;//parseInt(req.body.pageSize);

    modelModel.getModelTotalCountByTag(tagId, function (totalCount) {
        logger.info("按标签查找的模特总数:", tagId, totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = parseInt(totalCount / pageSize) + 1;

        var start = pageSize * (pageNo - 1);

        logger.info("按标签查找模特:", start, pageSize, tagId);
        modelModel.queryModelListByTag(start, pageSize, tagId, function (err, result) {
            if (err || !result) {
                logger.error("按标签查找模特出错", err);
                res.json({
                    success: false,
                    msg: "按标签查找模特出错"
                });
            } else {
                for (var i in result) {
                    if (result[i].create_time)
                        result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "按标签查找模特成功",
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


//通过标签查询未打该标签模特
router.post('/modelsWithoutTag', function (req, res) {
    var tagId = parseInt(req.body.tagId);
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = 20;//parseInt(req.body.pageSize);

    modelModel.getModelTotalCountWithoutTag(tagId, function (totalCount) {
        logger.info("按标签查找的模特总数:", tagId, totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = parseInt(totalCount / pageSize) + 1;

        var start = pageSize * (pageNo - 1);

        logger.info("按标签查找模特:", start, pageSize, tagId);
        modelModel.queryModelListWithoutTag(start, pageSize, tagId, function (err, result) {
            if (err || !result) {
                logger.error("按标签查找模特出错", err);
                res.json({
                    success: false,
                    msg: "按标签查找模特出错"
                });
            } else {
                for (var i in result) {
                    if (result[i].create_time)
                        result[i].create_time = new Date(result[i].create_time).getTime();
                }
                res.json({
                    success: true,
                    msg: "按标签查找模特成功",
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

