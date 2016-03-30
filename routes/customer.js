//管理模块
var express = require('express');
var config = require("../config");
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('customer/index');
});

router.get('/model', function(req, res, next) {
	res.render('customer/model');
});

router.get('/user', function(req, res, next) {
	res.render('customer/user');
});


router.get('/verify', function(req, res, next) {
	res.render('customer/verify');
});

router.get('/tag', function(req, res, next) {
	res.render('customer/tag');
});

router.post('/getHost', function (req, res, next) {
    res.json({
        success: true,
        host: config.qiniu.domain
    });
});

module.exports = router;	