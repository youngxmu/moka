var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var infoModel = require("../../models/infoModel.js");
var jsllModel = require("../../models/jsllModel.js");
var info2Model = require("../../models/info2Model.js");
var info3Model = require("../../models/info3Model.js");
var Buffer = require('buffer').Buffer;
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



router.get('/info/:id', function (req, res, next) {
    var id = req.params.id;
    infoModel.queryInfoById(id, function (err, result) {
        if (err || result.length == 0) {
            res.json({
                success: false,
                msg: "根据id查询文章出错"
            });
        } else {
           res.json({
                success: true,
                data: result[0]
            });
        }
    });
});


router.post('/list', function (req, res, next) {
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
                msg: "根据id查询文章出错"
            });
        }
    });
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
                msg: "根据id查询文章出错"
            });
        }
    });
});




module.exports = router;

