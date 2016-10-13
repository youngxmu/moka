var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var infoModel = require("../../models/jsjnModel.js");
var jsllModel = require("../../models/jsllModel.js");
var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/jsll/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/jsll/index');
});

router.get('/list', function (req, res, next) {
    res.render('user/jsll/list');
});

router.post('/list/:type', function (req, res, next) {
    var type = req.params.type;
    jsllModel.queryInfosByType(type, function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.post('/info/list', function (req, res, next) {
    infoModel.queryInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.get('/info/detail/:id', function (req, res, next) {
    var id = req.params.id;
    infoModel.queryInfoById(id, function (err, result) {
        if (err || result.length == 0) {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        } else {
           res.json({
                success: true,
                data: result[0]
            });
        }
    });
});


module.exports = router;

