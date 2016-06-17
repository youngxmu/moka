var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var infoModel = require("../../models/infoModel.js");
var Buffer = require('buffer').Buffer;
var router = express.Router();

router.get('/list', function (req, res, next) {
    res.render('user/jsll/list');
});

router.get('/list2', function (req, res, next) {
    res.render('user/jsll/list2');
});

router.get('/list3', function (req, res, next) {
    res.render('user/jsll/list3');
});

router.post('/list', function (req, res, next) {
    infoModel.queryInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: false,
                data: {
                    list : result
                }
            });
        } else {


            res.json({
                success: false,
                msg: "根据id查询文章出错"
            });
        }
    });
});



module.exports = router;

