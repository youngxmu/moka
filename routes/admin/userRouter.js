var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("userRouter");
var commonUtils = require("../../lib/utils.js");

var userModel = require('../../models/userModel.js');

var router = express.Router();

router.get('/list', function (req, res, next) {
    var type = 2;
    if(req.session && req.session.admin && req.session.admin.type == 1){
        type = 1;
    }
    res.render('admin/user/list', {type: type});
});

//根据”创建渠道“和”是否虚拟“查询
router.post('/querylist', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var isVirtual = parseInt(req.body.isVirtual) || 0;//1虚拟，0非虚拟
    var createFrom = parseInt(req.body.createFrom) || 0;//创建渠道：1后台，0前台

    userModel.getUserTotalCount(isVirtual, createFrom, function (totalCount) {
        logger.info("总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找:", start, pageSize);
        userModel.queryUserList(isVirtual, createFrom, start, pageSize, function (err, result) {
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
router.post('/queryUserById', function (req, res, next) {
    var userId = parseInt(req.body.userId);

    userModel.queryUserById(userId, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
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
                msg: "根据id查询出错"
            });
        }
    })
});

//根据电话查询
router.post('/queryUserByTel', function (req, res, next) {
    var tel = req.body.tel;

    userModel.queryUserByTel(tel, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
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
                msg: "根据电话查询出错"
            });
        }
    })
});

//根据姓名模糊查询
router.post('/queryUserByName', function (req, res, next) {
    var name = req.body.name;

    userModel.queryUserByName(name, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
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
                msg: "根据电话查询出错"
            });
        }
    })
});

//根据姓名模糊查询
router.post('/queryUserByEmail', function (req, res, next) {
    var name = req.body.email;

    userModel.queryUserByEmail(email, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
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
                msg: "根据电话查询出错"
            });
        }
    })
});

router.post('/create', function (req, res) {
    var tel = req.body.tel;
    var nickname = req.body.nickname;
    var password = req.body.password;//明文
    var beanCount = req.body.beanCount;//乐豆
    var isVirtual = req.body.isVirtual||0;//是否虚拟，1虚拟，0非虚拟
    var inviteId = 0;
    var profile = req.body.profile;//头像

    password = commonUtils.md5(password, "-weimo");//模拟生成手机端提交的密码
    password = commonUtils.md5(password);//加盐生成真实入库密码
    userModel.insertUser(tel,nickname,password,inviteId,beanCount,isVirtual,profile, function (err, data) {
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

router.post('/modify', function (req, res) {
    var userId = req.body.userId;
    var tel = req.body.tel;
    var nickname = req.body.nickname;//名字
    var password = req.body.password;
    var beanCount = req.body.beanCount;//乐豆
    var isVirtual = req.body.isVirtual||0;//是否虚拟，1虚拟，0非虚拟
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

    logger.info("管理员修改个人信息", userId, tel, nickname, password,  beanCount, isVirtual, profile);

    password = commonUtils.md5(password, "-weimo");//模拟生成手机端提交的密码
    password = commonUtils.md5(password);//加盐生成真实入库密码
    userModel.updateUser(userId,tel,nickname,password,beanCount,isVirtual,profile, function (err, result) {
        if (!err) {
            res.json({
                success: true,
                msg: "修改信息成功"
            });
        } else {
            logger.error("修改个人信息发生错误", err);
            res.json({
                success: false,
                msg: "修改个人信息失败"
            });
        }
    });
});


module.exports = router;

