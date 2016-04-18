var express = require('express');
var async = require('async');
var smsUtils = require("../../lib/smsUtils.js");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("checkRouter");
var config = require("../../config");

var userModel = require('../../models/checkModel.js');
var articleModel = require("../../models/modelModel.js");

var router = express.Router();


//审核模特,审核通过时，没有moka_id要生成新的moka_id
router.post('/model', function (req, res, next) {
    var adminId = (req.session &&req.session.admin)? req.session.admin.id:0;
    var modelId= parseInt(req.body.modelId);
    var modelMobile = req.body.mobile;
    var status = req.body.status;
    var description = req.body.description;

    if(!modelMobile){
        return res.json({
            success: false,
            msg: "模特手机号不能为空"
        });
    }

    async.waterfall([
        function(callback){
            checkModel.checkModel(adminId,modelId,status,description,function(err ,result){
                //发送通知短信start

                try{
                    if(status==1){
                        smsUtils.sendSMS(modelMobile, "您的微模账户审核已通过", null);
                    }
                    else{
                        smsUtils.sendSMS(modelMobile, "您的微模账户未通过审核，请按要求提交真实信息", null);
                    }
                }catch(e){
                    logger.error("发送审核通知短信错误",e)
                }

                //发送通知短信end
                callback(err);
            });
        },
        function (callback) {//检查moka_id，没有则更新一个moka_id给她
            modelModel.queryMaxMokaIdForCheck(function (err, maxMokaId) {
                logger.info("审核时获取到的最大mokaId:", maxMokaId);
                if(err){
                    callback(err);
                }else{
                    if (!maxMokaId || !maxMokaId[0].max_moka_id) {
                        maxMokaId = 30000;//这种场景的id以3开头
                    }
                    else {
                        maxMokaId = parseInt(maxMokaId[0].max_moka_id);
                    }

                    var mokaId = maxMokaId + 1;//要初始化的moka_id
                    modelModel.updateMokaId(modelId, mokaId, function (err, data) {
                        callback(err);
                    });
                }
            });
        }
    ], function (err, result) {
        if (err) {
            logger.error("审核模特功能错误", err, result);
             res.json({
                success: false,
                msg: "审核模特错误"
            });
        }else{
            res.json({
                success: true,
                msg: "审核模特成功"
            });
        }
    });
});

//审核模特
//router.post('/models', function (req, res, next) {
//    var adminId = (req.session &&req.session.admin)? req.session.admin.id:0;
//    var modelIds= req.body.modelIds;
//    var status = req.body.status;
//    var description = req.body.description;
//
//    for(var index in modelIds){
//        var modelId = modelIds[index];
//        checkModel.checkModel(adminId,modelId,status,description,function(err ,result){
//            if(!err && result){
//                res.json({
//                    success: true,
//                    msg: "审核成功"
//                });
//            }else{
//                res.json({
//                    success: false,
//                    msg: "审核失败"
//                });
//            }
//        });
//    }
//
//});


//查询模特审核历史
router.post('/history', function (req, res, next) {
    var adminId = (req.session &&req.session.admin)? req.session.admin.id:0;
    var modelId= req.body.modelId;

    checkModel.history(modelId,function(err ,result){
        if(!err && result){
            res.json({
                success: true,
                msg: "查询成功",
                data:{
                    list: result
                }
            });
        }else{
            res.json({
                success: false,
                msg: "查询失败"
            });
        }
    });
});




module.exports = router;

