var express = require('express');
var adminModel = require('../models/adminModel.js');
var userModel = require('../models/userModel.js');
var config = require("../config");
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("authRouter");
var router = express.Router();

router.get('/admin/login', function (req, res, next) {
    res.render('admin/login');
});

router.get('/user/login', function (req, res, next) {
    res.render('user/login');
});

router.post('/admin/login', function (req, res, next) {
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

    password = commonUtils.md5(password);
    console.log(password);
    adminModel.query(username, password, function (err, result) {
        if (!err && commonUtils.isArray(result) && result.length > 0) {
            var admin = result[0];
            delete admin.password;
            req.session.admin = admin;
            //登录成功
            res.redirect('/admin/index');
            // res.send(admin);
        } else {
            res.render('error', {
                success: false,
                msg: "用户不存在"
            });
        }
    });
});

router.post('/user/login', function (req, res, next) {
    var password = req.body.password.trim();
    var email = req.body.email.trim();

    logger.info("用户尝试登陆", email, password);

    if (!email) {
        return res.render('error', {
            success: false,
            msg: "登录邮箱不能为空"
        });
    }
    if (!password) {
        return res.render('error', {
            success: false,
            msg: "密码不能为空"
        });
    }

    password = commonUtils.md5(password);
    userModel.queryUserByEmail(email, function (err, result) {
        if (!err && commonUtils.isArray(result) && result.length > 0) {
            var user = result[0];
            if(user.password != password){
                return res.render('error', {
                    success: false,
                    msg: "用户名或密码错误"
                });
            }

            if(user.status != 1){
                return res.render('error', {
                    success: false,
                    msg: "账户未激活"
                });
            }
            delete user.password;
            req.session.user = user;
            //登录成功
            res.redirect('/moka/index');
        } else {
            res.render('error', {
                success: false,
                msg: "用户名或密码错误"
            });
        }
    });
});

module.exports = router;

