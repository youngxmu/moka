var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("expertRouter");
var expertModel = require('../../models/expertModel.js');
var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/expert/list');
});


//根据”创建渠道“和”是否虚拟“查询专家
router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    expertModel.queryExpertTotalCount(name, function (totalCount) {
        logger.info("专家总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找专家:", start, pageSize);
        expertModel.queryExperts(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找专家出错", err);
                res.json({
                    success: false,
                    msg: "查找专家出错"
                });
            } else {
                for(var index in result){
                    result[index].birthday =  commonUtils.formatShortDate(result[index].birthday);
                }
                res.json({
                    success: true,
                    msg: "查找专家成功",
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

router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                res.json({
                    success: true,
                    expert : expert
                });
            } else {
                 res.json({
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//根据专家id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                expert.avatar = config.imgHost + '/uploads/' + expert.avatar;
                res.render('admin/expert/detail', expert);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//创建专家
router.post('/save', function (req, res) {
    var id = req.body.id;
	var name = req.body.name;
	var gender = req.body.gender;
	var birthday = req.body.birthday;
	var title = req.body.title;
	var topic = req.body.topic;
	var unit = req.body.unit;
	var address = req.body.address;
	var tel = req.body.tel;
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        expertModel.insertExpert(name,gender,birthday,title,topic,unit,address,tel, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "创建成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        logger.info("管理员修改专家信息", id);
        expertModel.updateExpert(id, name,gender,birthday,title,topic,unit,address,tel, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改专家信息成功"
                });
            } else {
                logger.error("修改专家个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改专家个人信息失败"
                });
            }
        });
    }
});

router.post('/del', function (req, res) {
    var id = req.body.id;
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "删除失败"
        });
    }else{
        logger.info("管理员删除专家信息", id);
        expertModel.delExpert(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除专家信息成功"
                });
            } else {
                logger.error("删除专家发生错误", err);
                res.json({
                    success: false,
                    msg: "删除专家失败"
                });
            }
        });
    }
});

module.exports = router;

