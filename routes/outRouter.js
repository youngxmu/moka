var express = require('express');
var async = require('async');

var modelModel = require("../models/modelModel.js");
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("outRouter");
var config = require("../config");
var router = express.Router();


var middleware = function (req, res, next) {
    var accessKey = req.body.accessKey;
    console.log(accessKey);
    if (!accessKey || accessKey !== config.accessKey) {
        logger.error("非授权应用不得使用该API", req.header("X-Real-IP") || "");
        return res.json({
            success: false,
            msg: "授权key错误"
        });
    }
    else {
        next();
    }
};

//外部程序调用：导入模特,同时自动生成moka_id，以2开头，并且审核通过。
router.post('/insertModelFromOut', middleware, function (req, res, next) {
    var tel = '100000';
    var name = req.body.name;
    var password = req.body.password;//明文
    var birthday = req.body.birthday;
    var bwh = req.body.bwh;
    var cup = req.body.cup;
    var height = req.body.height;
    var jifen = req.body.jifen;//积分
    var isVirtual = req.body.isVirtual || 0;//是否虚拟，1虚拟，0非虚拟
    var inviteId = 0;
    var profile = req.body.profile;//头像
    var operator = req.body.operator;//操作人
    var createTime = req.body.createTime;//create time
    if(!operator){
        operator = 'CM001';
    }

    var currMokaId = '';
    password = commonUtils.md5(password, "-weimo");//模拟生成手机端提交的密码
    password = commonUtils.md5(password);//加盐生成真实入库密码


       async.waterfall([
            function (callback) {
                modelModel.queryMaxMokaIdForOut(function (err, result) {
                    callback(err, result);
                });
            },
            function (maxMokaId, callback) {
                logger.info("获取到的最大mokaId:", maxMokaId);

                if (!maxMokaId || !maxMokaId[0].max_moka_id) {
                    maxMokaId = 20000;
                }
                else {
                    maxMokaId = parseInt(maxMokaId[0].max_moka_id);
                }


                var mokaId = maxMokaId + 1;//要初始化的moka_id
                var status = 1;//审核通过

                tel = tel + mokaId;
                currMokaId = mokaId;
                modelModel.insertModelFromOut(tel, name, password, birthday, bwh, cup, height, inviteId, jifen, isVirtual, profile, mokaId, status,operator, createTime, function (err, data) {
                    callback(err, data);
                });
            }
        ], function (err, result) {
            if (err) {
                logger.error("外部程序调用插入模特功能错误", err);
                return res.json({
                    success: false,
                    msg: "插入模特错误"
                });
            }
            console.log(result);
            var data = {
                mokaId : currMokaId,
                modelId : result['insertId']
            };
            console.log(data);
            res.json({
            success: true,
            data : data,
            msg: "插入模特成功"
        });
    });
});


//外部程序调用：修改模特inviteId(仅可以修改一次)。
router.post('/updateModelFromOut', middleware, function (req, res, next) {
    var inviteId = req.body.inviteId;
    var modelId = req.body.modelId;//明文

    modelModel.updateModelInviteId(inviteId, modelId,  function (err, result) {
        if (err) {
            logger.error("外部程序调用修改模特inviteId功能错误", err);
            return res.json({
                success: false,
                msg: "修改模特inviteId错误"
            });
        }
        if(result.affectedRows == 0){
            res.json({
                success: false,
                msg: "模特inviteId已设置"
            });
        }else{
            res.json({
            success: true,
            msg: "修改模特inviteId成功"
        });
        }
        
        
    });
});

module.exports = router;

