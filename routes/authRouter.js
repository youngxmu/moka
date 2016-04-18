var express = require('express');
var adminModel = require('../models/adminModel.js');
var config = require("../config");
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("authRouter");
var router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    var password = req.body.password.trim();
    var username = req.body.username.trim();

    logger.info("管理员尝试登陆", username, password);

    if (!username) {
        return res.render('error', {
            success: false,
            msg: "用户名不能为空"
        });
    }
    if (!password) {
        return res.render('error', {
            success: false,
            msg: "密码不能为空"
        });
    }

    password = commonUtils.md5(password, config.md5Salt);
    adminModel.query(username, password, function (err, result) {
        if (!err && commonUtils.isArray(result) && result.length > 0) {
            var admin = result[0];
            delete admin.password;
            req.session.admin = admin;
            //登录成功
            res.redirect('/article/uneval');
            // res.send(admin);
        } else {
            res.render('error', {
                success: false,
                msg: "用户不存在"
            });
        }
    });
});

module.exports = router;

